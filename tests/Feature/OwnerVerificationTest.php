<?php

namespace Tests\Feature;

use App\Models\OwnerVerification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OwnerVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeker_can_view_owner_verification_page(): void
    {
        $seeker = User::factory()->create([
            'role' => 'seeker',
            'is_verified_owner' => false,
        ]);

        $response = $this->actingAs($seeker)->get(route('owner.verification.index'));

        $response->assertStatus(200);
    }

    public function test_seeker_cannot_access_admin_verification_routes(): void
    {
        $seeker = User::factory()->create([
            'role' => 'seeker',
            'is_verified_owner' => false,
        ]);

        $response = $this->actingAs($seeker)->get(route('admin.verifications.index'));

        $response->assertStatus(403);
    }

    public function test_admin_can_access_verification_queue(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get(route('admin.verifications.index'));

        $response->assertStatus(200);
    }

    public function test_seeker_can_submit_kyc_verification(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'seeker',
            'is_verified_owner' => false,
            'phone' => '09123456789',
        ]);

        $response = $this->actingAs($user)->post(route('owner.verification.store'), [
            'phone' => '09123456789',
            'nrc_number' => '12/YAKANA(N)123456',
            'nrc_front_image' => UploadedFile::fake()->image('nrc.jpg'),
            'utility_bill_image' => UploadedFile::fake()->image('bill.png'),
        ]);

        $response->assertRedirect(route('owner.verification.index'));

        $this->assertDatabaseHas('owner_verifications', [
            'user_id' => $user->id,
            'nrc_number' => '12/YAKANA(N)123456',
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_approve_kyc_verification(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $user = User::factory()->create([
            'role' => 'seeker',
            'is_verified_owner' => false,
        ]);

        $verification = OwnerVerification::create([
            'user_id' => $user->id,
            'nrc_number' => '12/TEST(N)999999',
            'nrc_front_image' => 'verifications/nrc/dummy.png',
            'utility_bill_image' => 'verifications/utility_bills/dummy.png',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->post(route('admin.verifications.approve', $verification), [
                'admin_remark' => 'All documents verified and legitimate.',
            ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('owner_verifications', [
            'id' => $verification->id,
            'status' => 'approved',
            'reviewed_by' => $admin->id,
        ]);

        $user->refresh();
        $this->assertEquals('owner', $user->role);
        $this->assertTrue((bool) $user->is_verified_owner);
    }

    public function test_admin_can_reject_kyc_verification_with_remark(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $user = User::factory()->create([
            'role' => 'seeker',
            'is_verified_owner' => false,
        ]);

        $verification = OwnerVerification::create([
            'user_id' => $user->id,
            'nrc_number' => '12/REJECT(N)000000',
            'nrc_front_image' => 'verifications/nrc/dummy.png',
            'utility_bill_image' => 'verifications/utility_bills/dummy.png',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->post(route('admin.verifications.reject', $verification), [
                'admin_remark' => 'Utility meter bill name does not match NRC card.',
            ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('owner_verifications', [
            'id' => $verification->id,
            'status' => 'rejected',
            'admin_remark' => 'Utility meter bill name does not match NRC card.',
            'reviewed_by' => $admin->id,
        ]);

        $user->refresh();
        $this->assertFalse((bool) $user->is_verified_owner);
    }
}
