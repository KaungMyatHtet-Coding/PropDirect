<?php

namespace Tests\Feature;

use App\Models\LawyerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Phase2LawyerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_lawyer_verification(): void
    {
        $response = $this->get('/lawyer-verification');
        $response->assertRedirect('/login');
    }

    public function test_seeker_can_submit_lawyer_verification(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'seeker',
            'phone' => '09123456789',
            'occupation' => 'Legal Assistant',
            'current_address' => 'Yangon',
            'is_profile_complete' => true,
        ]);

        $file = UploadedFile::fake()->image('license.png');

        $response = $this->actingAs($user)->post('/lawyer-verification', [
            'license_number' => 'ADV-9999/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => 5,
            'specialization' => 'Contract Law, Grant Verification',
            'consultation_fee' => 30000,
            'contract_fee' => 100000,
            'bio' => 'Experienced real estate advocate with strong track record in Yangon.',
            'office_township' => 'Sanchaung',
            'license_card_image' => $file,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('lawyer_profiles', [
            'user_id' => $user->id,
            'license_number' => 'ADV-9999/2020',
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_approve_lawyer(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'seeker']);
        $profile = LawyerProfile::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post("/admin/lawyers/{$profile->id}/approve", [
            'admin_remark' => 'Bar license verified and confirmed active standing.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('lawyer_profiles', [
            'id' => $profile->id,
            'status' => 'approved',
        ]);

        $user->refresh();
        $this->assertSame('lawyer', $user->role);
    }

    public function test_approved_lawyers_appear_in_public_directory(): void
    {
        $lawyerUser = User::factory()->create([
            'name' => 'Daw Thuzar',
            'role' => 'lawyer',
            'phone' => '09555666777',
        ]);

        LawyerProfile::factory()->create([
            'user_id' => $lawyerUser->id,
            'status' => 'approved',
            'specialization' => 'Lease Contracts',
            'office_township' => 'Kamayut',
        ]);

        $response = $this->get('/lawyers');
        $response->assertOk();
        $response->assertSee('Daw Thuzar');
    }
}
