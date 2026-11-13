<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\LawyerInquiry;
use App\Models\LawyerProfile;
use App\Models\Property;
use App\Models\User;
use App\Models\ViewingMessage;
use App\Models\ViewingRequest;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Phase3ViewingAndLawyerBookingTest extends TestCase
{
    use RefreshDatabase;

    private function createCompleteUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'phone' => '09' . rand(100000000, 999999999),
            'avatar' => 'avatars/test.png',
            'occupation' => 'Software Engineer',
            'current_address' => 'No. 1, Main Road, Yangon',
            'is_profile_complete' => true,
        ], $attributes));
    }

    private function createProperty(User $owner, array $attributes = []): Property
    {
        return Property::create(array_merge([
            'owner_id' => $owner->id,
            'title' => 'Test Sanchaung Apartment',
            'slug' => 'test-sanchaung-apartment-' . uniqid(),
            'description' => 'A cozy apartment in Sanchaung',
            'listing_type' => 'rent',
            'property_type' => 'apartment',
            'price' => 450000,
            'township' => 'Sanchaung',
            'city' => 'Yangon',
            'address' => 'Padonmar Street, Sanchaung',
            'width_ft' => 15,
            'length_ft' => 60,
            'area_sqft' => 900,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'floor_level' => '2nd',
            'status' => 'available',
        ], $attributes));
    }

    public function test_incomplete_profile_cannot_request_viewing(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);

        $incompleteSeeker = User::factory()->create([
            'role' => 'seeker',
            'is_profile_complete' => false,
        ]);

        $response = $this->actingAs($incompleteSeeker)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
            'message' => 'Want to visit.',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $this->assertDatabaseMissing('viewing_requests', [
            'seeker_id' => $incompleteSeeker->id,
        ]);
    }

    public function test_complete_profile_can_submit_viewing_request(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $response = $this->actingAs($seeker)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
            'message' => 'I would like to view this unit tomorrow morning.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('viewing_requests', [
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        // Assert owner received notification
        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $owner->id,
            'type' => 'viewing_request',
        ]);
    }

    public function test_viewing_message_created_on_request_submission(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $this->actingAs($seeker)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
            'message' => 'Initial inquiry note.',
        ]);

        $viewing = ViewingRequest::where('property_id', $property->id)->first();
        $this->assertNotNull($viewing);

        $this->assertDatabaseHas('viewing_messages', [
            'viewing_request_id' => $viewing->id,
            'sender_id' => $seeker->id,
            'message' => 'Initial inquiry note.',
        ]);
    }

    public function test_admin_cannot_request_viewing(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $admin = $this->createCompleteUser(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
        ]);

        $response->assertStatus(403);
    }

    public function test_owner_cannot_request_viewing_on_own_property(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);

        $response = $this->actingAs($owner)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
        ]);

        $response->assertSessionHas('error');
    }

    public function test_seeker_cannot_submit_duplicate_active_viewing_request(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        $response = $this->actingAs($seeker)->post(route('viewing.store', $property->slug), [
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Afternoon',
        ]);

        $response->assertSessionHas('error');
        $this->assertEquals(1, ViewingRequest::where('property_id', $property->id)->count());
    }

    public function test_owner_can_accept_viewing_request_and_unlock_contact(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        $response = $this->actingAs($owner)->post(route('owner.viewings.accept', $viewing->id));

        $response->assertSessionHas('success');
        $viewing->refresh();
        $this->assertEquals('accepted', $viewing->status);
        $this->assertTrue($viewing->contact_unlocked);

        // Seeker receives notification
        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $seeker->id,
            'type' => 'viewing_accepted',
        ]);
    }

    public function test_phone_is_unlocked_on_property_page_for_accepted_seeker(): void
    {
        $owner = $this->createCompleteUser([
            'role' => 'owner',
            'is_verified_owner' => true,
            'phone' => '09123456789',
        ]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        $response = $this->actingAs($seeker)->get(route('properties.show', $property->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Properties/Show')
            ->where('isUnlocked', true)
            ->where('property.owner.phone', '09123456789')
        );
    }

    public function test_phone_is_masked_on_property_page_for_non_accepted_seeker(): void
    {
        $owner = $this->createCompleteUser([
            'role' => 'owner',
            'is_verified_owner' => true,
            'phone' => '09123456789',
        ]);
        $property = $this->createProperty($owner);
        $otherSeeker = $this->createCompleteUser(['role' => 'seeker']);

        $response = $this->actingAs($otherSeeker)->get(route('properties.show', $property->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Properties/Show')
            ->where('isUnlocked', false)
            ->where('property.owner.phone', fn ($phone) => str_contains($phone, '****'))
        );
    }

    public function test_owner_can_reschedule_viewing_request(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        $newDate = Carbon::now()->addDays(3)->toDateString();
        $response = $this->actingAs($owner)->post(route('owner.viewings.reschedule', $viewing->id), [
            'rescheduled_date' => $newDate,
            'rescheduled_time' => 'Afternoon (1:00 PM - 5:00 PM)',
            'owner_note' => 'Please visit in the afternoon.',
        ]);

        $response->assertSessionHas('success');
        $viewing->refresh();
        $this->assertEquals('rescheduled', $viewing->status);
        $this->assertEquals($newDate, $viewing->rescheduled_date->toDateString());
        $this->assertEquals('Please visit in the afternoon.', $viewing->owner_note);
    }

    public function test_seeker_can_accept_rescheduled_time(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $rescheduledDate = Carbon::now()->addDays(3)->toDateString();
        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'rescheduled_date' => $rescheduledDate,
            'rescheduled_time' => 'Afternoon (1:00 PM - 5:00 PM)',
            'owner_note' => 'Afternoon works better.',
            'status' => 'rescheduled',
            'contact_unlocked' => false,
        ]);

        $response = $this->actingAs($seeker)->post(route('viewing.accept-reschedule', $viewing->id));

        $response->assertSessionHas('success');
        $viewing->refresh();
        $this->assertEquals('accepted', $viewing->status);
        $this->assertTrue($viewing->contact_unlocked);
        $this->assertEquals($rescheduledDate, $viewing->preferred_date->toDateString());
    }

    public function test_p2p_message_sent_and_zawgyi_normalized(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        // Zawgyi input for Sanchaung
        $zawgyiText = "စမ္းေခ်ာင္း တိုက်ခန်း ကြည့်လိုပါသည်";

        $response = $this->actingAs($seeker)->post(route('viewing.messages.store', $viewing->id), [
            'message' => $zawgyiText,
        ]);

        $response->assertSessionHas('success');

        $message = ViewingMessage::where('viewing_request_id', $viewing->id)->latest()->first();
        $this->assertNotNull($message);
        // Ensure normalized to Unicode
        $this->assertStringContainsString('စမ်းချောင်း', $message->message);
    }

    public function test_seeker_can_book_verified_lawyer(): void
    {
        $lawyerUser = $this->createCompleteUser(['role' => 'lawyer']);
        $lawyerProfile = LawyerProfile::create([
            'user_id' => $lawyerUser->id,
            'license_number' => 'ADV-99999/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => 10,
            'specialization' => 'Grant Verification',
            'consultation_fee' => 50000,
            'contract_fee' => 100000,
            'office_township' => 'Bahan',
            'license_card_image' => 'lawyers/licenses/dummy.png',
            'bio' => 'Experienced advocate specializing in real estate.',
            'status' => 'approved',
        ]);

        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $response = $this->actingAs($seeker)->post(route('lawyer.inquiries.store', $lawyerProfile->id), [
            'service_type' => 'grant_verification',
            'preferred_date' => Carbon::now()->addDays(5)->toDateString(),
            'notes' => 'Please verify the title deed for this property.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('lawyer_inquiries', [
            'lawyer_profile_id' => $lawyerProfile->id,
            'client_id' => $seeker->id,
            'service_type' => 'grant_verification',
            'status' => 'pending',
        ]);

        // Lawyer notified
        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $lawyerUser->id,
            'type' => 'lawyer_inquiry',
        ]);
    }

    public function test_lawyer_can_accept_inquiry_with_quoted_fee(): void
    {
        $lawyerUser = $this->createCompleteUser(['role' => 'lawyer']);
        $lawyerProfile = LawyerProfile::create([
            'user_id' => $lawyerUser->id,
            'license_number' => 'ADV-99999/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => 10,
            'specialization' => 'Grant Verification',
            'consultation_fee' => 50000,
            'contract_fee' => 100000,
            'office_township' => 'Bahan',
            'license_card_image' => 'lawyers/licenses/dummy.png',
            'bio' => 'Experienced advocate specializing in real estate.',
            'status' => 'approved',
        ]);

        $client = $this->createCompleteUser(['role' => 'seeker']);

        $inquiry = LawyerInquiry::create([
            'lawyer_profile_id' => $lawyerProfile->id,
            'lawyer_user_id' => $lawyerUser->id,
            'client_id' => $client->id,
            'service_type' => 'grant_verification',
            'preferred_date' => Carbon::now()->addDays(3)->toDateString(),
            'quoted_fee' => 50000,
            'notes' => 'Title deed check.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($lawyerUser)->post(route('lawyer.inquiries.accept', $inquiry->id), [
            'quoted_fee' => 60000,
            'lawyer_response' => 'Appointment confirmed. Please bring certified copies.',
        ]);

        $response->assertSessionHas('success');
        $inquiry->refresh();
        $this->assertEquals('accepted', $inquiry->status);
        $this->assertEquals(60000, $inquiry->quoted_fee);
        $this->assertEquals('Appointment confirmed. Please bring certified copies.', $inquiry->lawyer_response);
    }

    public function test_incomplete_profile_cannot_book_lawyer(): void
    {
        $lawyerUser = $this->createCompleteUser(['role' => 'lawyer']);
        $lawyerProfile = LawyerProfile::create([
            'user_id' => $lawyerUser->id,
            'license_number' => 'ADV-99999/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => 10,
            'specialization' => 'Grant Verification',
            'consultation_fee' => 50000,
            'contract_fee' => 100000,
            'office_township' => 'Bahan',
            'license_card_image' => 'lawyers/licenses/dummy.png',
            'bio' => 'Experienced advocate specializing in real estate.',
            'status' => 'approved',
        ]);

        $incompleteUser = User::factory()->create([
            'role' => 'seeker',
            'is_profile_complete' => false,
        ]);

        $response = $this->actingAs($incompleteUser)->post(route('lawyer.inquiries.store', $lawyerProfile->id), [
            'service_type' => 'grant_verification',
            'preferred_date' => Carbon::now()->addDays(3)->toDateString(),
            'notes' => 'Title check.',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $this->assertDatabaseMissing('lawyer_inquiries', [
            'client_id' => $incompleteUser->id,
        ]);
    }

    public function test_lawyer_can_complete_inquiry(): void
    {
        $lawyerUser = $this->createCompleteUser(['role' => 'lawyer']);
        $lawyerProfile = LawyerProfile::create([
            'user_id' => $lawyerUser->id,
            'license_number' => 'ADV-99999/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => 10,
            'specialization' => 'Grant Verification',
            'consultation_fee' => 50000,
            'contract_fee' => 100000,
            'office_township' => 'Bahan',
            'license_card_image' => 'lawyers/licenses/dummy.png',
            'bio' => 'Experienced advocate specializing in real estate.',
            'status' => 'approved',
        ]);

        $client = $this->createCompleteUser(['role' => 'seeker']);

        $inquiry = LawyerInquiry::create([
            'lawyer_profile_id' => $lawyerProfile->id,
            'lawyer_user_id' => $lawyerUser->id,
            'client_id' => $client->id,
            'service_type' => 'grant_verification',
            'preferred_date' => Carbon::now()->addDays(3)->toDateString(),
            'quoted_fee' => 50000,
            'notes' => 'Title deed check.',
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($lawyerUser)->post(route('lawyer.inquiries.complete', $inquiry->id));

        $response->assertSessionHas('success');
        $inquiry->refresh();
        $this->assertEquals('completed', $inquiry->status);
    }

    public function test_seeker_or_owner_can_cancel_viewing(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        $response = $this->actingAs($seeker)->post(route('viewing.cancel', $viewing->id));

        $response->assertSessionHas('success');
        $viewing->refresh();
        $this->assertEquals('cancelled', $viewing->status);
    }

    public function test_non_participant_cannot_access_chat(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $property = $this->createProperty($owner);
        $seeker = $this->createCompleteUser(['role' => 'seeker']);
        $stranger = $this->createCompleteUser(['role' => 'seeker']);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $seeker->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning',
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        $response = $this->actingAs($stranger)->get(route('viewing.show', $viewing->id));
        $response->assertStatus(403);
    }

    public function test_admin_can_view_transactions_page(): void
    {
        $admin = $this->createCompleteUser([
            'role' => 'admin',
            'secondary_password' => Hash::make('admin1234'),
        ]);

        // Verified secondary password in session
        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get(route('admin.transactions.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Admin/Transactions/Index'));
    }
}
