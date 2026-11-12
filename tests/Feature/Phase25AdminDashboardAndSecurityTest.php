<?php

namespace Tests\Feature;

use App\Models\SearchLog;
use App\Models\User;
use App\Models\UserFeedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Phase25AdminDashboardAndSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_is_redirected_to_secondary_password_gate(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'secondary_password' => Hash::make('admin1234'),
        ]);

        $response = $this->actingAs($admin)->get('/dashboard');
        $response->assertRedirect(route('admin.verify-secondary.show'));
    }

    public function test_admin_can_verify_secondary_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'secondary_password' => Hash::make('admin1234'),
        ]);

        $response = $this->actingAs($admin)->post(route('admin.verify-secondary.verify'), [
            'secondary_password' => 'admin1234',
        ]);

        $response->assertSessionHas('admin_secondary_verified', true);
        $response->assertRedirect(route('dashboard'));
    }

    public function test_admin_fails_verification_with_wrong_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'secondary_password' => Hash::make('admin1234'),
        ]);

        $response = $this->actingAs($admin)->post(route('admin.verify-secondary.verify'), [
            'secondary_password' => 'wrongpass',
        ]);

        $response->assertSessionHasErrors('secondary_password');
        $response->assertSessionMissing('admin_secondary_verified');
    }

    public function test_admin_can_update_secondary_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'secondary_password' => Hash::make('admin1234'),
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->post(route('admin.secondary-password.update'), [
                'current_secondary_password' => 'admin1234',
                'new_secondary_password' => 'secret9999',
                'new_secondary_password_confirmation' => 'secret9999',
            ]);

        $response->assertSessionHasNoErrors();
        $admin->refresh();
        $this->assertTrue(Hash::check('secret9999', $admin->secondary_password));
    }

    public function test_admin_is_blocked_from_creating_properties(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get('/owner/properties/create');

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_admin_is_blocked_from_owner_verification(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get('/owner-verification');

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_admin_is_blocked_from_lawyer_verification(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get('/lawyer-verification');

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_admin_can_block_and_unblock_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $seeker = User::factory()->create([
            'role' => 'seeker',
            'is_blocked' => false,
        ]);

        // 1. Block user
        $blockResponse = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->post(route('admin.users.block', $seeker), [
                'blocked_reason' => 'Suspected broker masquerading as direct buyer.',
            ]);

        $blockResponse->assertSessionHasNoErrors();
        $seeker->refresh();
        $this->assertTrue($seeker->is_blocked);
        $this->assertSame('Suspected broker masquerading as direct buyer.', $seeker->blocked_reason);

        // 2. Unblock user
        $unblockResponse = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->post(route('admin.users.unblock', $seeker));

        $unblockResponse->assertSessionHasNoErrors();
        $seeker->refresh();
        $this->assertFalse($seeker->is_blocked);
        $this->assertNull($seeker->blocked_reason);
    }

    public function test_blocked_user_is_logged_out_by_middleware(): void
    {
        $blockedUser = User::factory()->create([
            'is_blocked' => true,
            'blocked_reason' => 'Multiple broker violations reported.',
        ]);

        $response = $this->actingAs($blockedUser)->get('/dashboard');
        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
    }

    public function test_marketplace_filters_record_search_log(): void
    {
        $seeker = User::factory()->create(['role' => 'seeker']);

        $response = $this->actingAs($seeker)->get('/properties?township=Sanchaung&target_price=400000');
        $response->assertOk();

        $this->assertDatabaseHas('search_logs', [
            'user_id' => $seeker->id,
            'township' => 'Sanchaung',
            'target_price' => 400000.00,
        ]);
    }

    public function test_user_can_submit_feedback_and_notifies_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'seeker']);

        $response = $this->actingAs($user)->post(route('feedbacks.store'), [
            'category' => 'feature',
            'message' => 'Please add 3D virtual tour support for Yangon luxury condos.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('user_feedbacks', [
            'user_id' => $user->id,
            'category' => 'feature',
        ]);

        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $admin->id,
            'type' => 'system',
        ]);
    }
}
