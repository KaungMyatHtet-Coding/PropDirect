<?php

namespace Tests\Feature;

use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\Property;
use App\Models\User;
use App\Models\ViewingRequest;
use App\Services\ContractDiffService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase4ContractDiffTrackerTest extends TestCase
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
            'description' => 'A cozy apartment in Sanchaung with generator',
            'listing_type' => 'rent',
            'property_type' => 'apartment',
            'price' => 450000,
            'security_deposit' => 450000,
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
            'house_rules' => ['no_sublease', 'no_pets'],
            'min_contract_months' => 6,
            'advance_payment_months' => 1,
        ], $attributes));
    }

    public function test_owner_can_access_contract_creation_page_with_preselected_data(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $viewing = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $tenant->id,
            'owner_id' => $owner->id,
            'preferred_date' => Carbon::tomorrow()->toDateString(),
            'preferred_time' => 'Morning (9:00 AM - 12:00 PM)',
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        $response = $this->actingAs($owner)->get(route('owner.contracts.create', [
            'property_id' => $property->id,
            'seeker_id' => $tenant->id,
            'viewing_request_id' => $viewing->id,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Owner/Contracts/Create')
            ->has('properties')
            ->has('eligibleSeekers')
            ->where('preselectedPropertyId', $property->id)
            ->where('preselectedSeekerId', $tenant->id)
            ->where('viewingRequestId', (string) $viewing->id)
        );
    }

    public function test_owner_can_create_lease_contract_with_version_1(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $payload = [
            'property_id' => $property->id,
            'tenant_id' => $tenant->id,
            'monthly_rent' => 480000,
            'deposit_amount' => 960000,
            'rent_due_day' => 1,
            'advance_payment_months' => 3,
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'structured_clauses' => [
                [
                    'clause_number' => 1,
                    'title_en' => 'Premises & Permitted Use',
                    'title_mm' => 'ငှားရမ်းသည့်နေရာနှင့် အသုံးပြုခွင့်',
                    'content_en' => 'Residential use only in Sanchaung.',
                    'content_mm' => 'စမ်းချောင်းမြို့နယ်ရှိ တိုက်ခန်းအား လူနေထိုင်ရန်သာ ငှားရမ်းပါသည်။',
                ],
            ],
            'terms_and_conditions' => 'Standard terms applied.',
        ];

        $response = $this->actingAs($owner)->post(route('owner.contracts.store'), $payload);

        $contract = Contract::where('property_id', $property->id)->first();
        $this->assertNotNull($contract);
        $this->assertEquals($owner->id, $contract->owner_id);
        $this->assertEquals($tenant->id, $contract->tenant_id);
        $this->assertEquals('pending_tenant', $contract->status);
        $this->assertEquals(1, $contract->current_version);
        $this->assertNotNull($contract->owner_signed_at);
        $this->assertNull($contract->tenant_signed_at);

        // Version 1 check
        $v1 = ContractVersion::where('contract_id', $contract->id)->where('version_number', 1)->first();
        $this->assertNotNull($v1);
        $this->assertEquals(480000, (int) $v1->monthly_rent);
        $this->assertEquals(960000, (int) $v1->deposit_amount);
        $this->assertEquals(1, $v1->rent_due_day);
        $this->assertStringContainsString('Initial contract draft', $v1->change_summary);

        $response->assertRedirect(route('contracts.show', $contract->id));
    }

    public function test_tenant_and_owner_can_view_contract_showcase(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'contract_code' => 'CNT-2026-TEST1',
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'rent_due_day' => 5,
            'current_version' => 1,
            'owner_signed_at' => now(),
            'status' => 'pending_tenant',
        ]);

        ContractVersion::create([
            'contract_id' => $contract->id,
            'version_number' => 1,
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'advance_payment_months' => 1,
            'rent_due_day' => 5,
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'terms_and_conditions' => 'Standard clauses.',
            'change_summary' => 'Initial draft.',
            'created_by' => $owner->id,
        ]);

        // Tenant can view
        $responseTenant = $this->actingAs($tenant)->get(route('contracts.show', $contract->id));
        $responseTenant->assertOk();
        $responseTenant->assertInertia(fn ($page) => $page
            ->component('Contracts/Show')
            ->where('contract.id', $contract->id)
        );

        // Owner can view
        $responseOwner = $this->actingAs($owner)->get(route('contracts.show', $contract->id));
        $responseOwner->assertOk();
    }

    public function test_tenant_can_propose_revision_creating_version_2_with_automatic_diff_summary(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'contract_code' => 'CNT-2026-TEST2',
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'monthly_rent' => 500000,
            'deposit_amount' => 1000000,
            'rent_due_day' => 1,
            'current_version' => 1,
            'owner_signed_at' => now(),
            'tenant_signed_at' => null,
            'status' => 'pending_tenant',
        ]);

        ContractVersion::create([
            'contract_id' => $contract->id,
            'version_number' => 1,
            'monthly_rent' => 500000,
            'deposit_amount' => 1000000,
            'advance_payment_months' => 3,
            'rent_due_day' => 1,
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'terms_and_conditions' => 'Original landlord terms.',
            'change_summary' => 'Initial draft.',
            'created_by' => $owner->id,
        ]);

        // Tenant proposes revision: Rent 450,000 (-10%), Deposit 450,000 (-55%), Due Day 5th
        $response = $this->actingAs($tenant)->post(route('contracts.revise', $contract->id), [
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'rent_due_day' => 5,
            'advance_payment_months' => 1,
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'terms_and_conditions' => 'Revised tenant proposal terms.',
            'revision_request_note' => 'Please lower rent to 450,000 Ks and deposit to 1 month.',
        ]);

        $contract->refresh();
        $this->assertEquals(2, $contract->current_version);
        $this->assertEquals('revision_requested', $contract->status);
        $this->assertEquals(450000, (int) $contract->monthly_rent);
        $this->assertEquals(450000, (int) $contract->deposit_amount);
        $this->assertNotNull($contract->tenant_signed_at); // Proposer signed
        $this->assertNull($contract->owner_signed_at); // Counterparty signature reset

        // Version 2 record check
        $v2 = ContractVersion::where('contract_id', $contract->id)->where('version_number', 2)->first();
        $this->assertNotNull($v2);
        $this->assertEquals($tenant->id, $v2->created_by);
        $this->assertStringContainsString('Rent decreased by 50,000 Ks', $v2->change_summary);
        $this->assertStringContainsString('Deposit decreased by 550,000 Ks', $v2->change_summary);
        $this->assertStringContainsString('Rent due day changed from 1st to 5th', $v2->change_summary);
    }

    public function test_contract_diff_service_accurately_detects_financial_and_text_changes(): void
    {
        $v1 = new ContractVersion([
            'monthly_rent' => 400000,
            'deposit_amount' => 800000,
            'rent_due_day' => 1,
            'advance_payment_months' => 3,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'terms_and_conditions' => 'Old clause text.',
        ]);

        $v2 = new ContractVersion([
            'monthly_rent' => 360000,
            'deposit_amount' => 360000,
            'rent_due_day' => 10,
            'advance_payment_months' => 1,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'terms_and_conditions' => 'New updated clause text.',
        ]);

        $summary = ContractDiffService::summarizeDiff($v1, $v2);

        $this->assertStringContainsString('Rent decreased by 40,000 Ks (-10.0%)', $summary);
        $this->assertStringContainsString('Deposit decreased by 440,000 Ks (-55.0%)', $summary);
        $this->assertStringContainsString('Rent due day changed from 1st to 10th', $summary);
        $this->assertStringContainsString('Advance payment months reduced from 3 to 1', $summary);
    }

    public function test_dual_digital_signatures_activate_contract_and_mark_property_as_rented(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'contract_code' => 'CNT-2026-TEST3',
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'rent_due_day' => 5,
            'current_version' => 1,
            'owner_signed_at' => now(), // Landlord has already signed
            'tenant_signed_at' => null,
            'status' => 'pending_tenant',
        ]);

        $this->assertEquals('available', $property->status);

        // Tenant signs agreement
        $response = $this->actingAs($tenant)->post(route('contracts.sign', $contract->id), [
            'agree_terms' => true,
        ]);

        $contract->refresh();
        $property->refresh();

        $this->assertNotNull($contract->tenant_signed_at);
        $this->assertEquals('active', $contract->status);
        $this->assertNotNull($contract->activated_at);
        $this->assertEquals('rented', $property->status); // Property automatically marked rented!
    }

    public function test_admin_separation_of_duties_admin_is_read_only_auditor(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@test.com',
            'is_profile_complete' => true,
        ]);

        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'contract_code' => 'CNT-2026-ADMINTEST',
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'rent_due_day' => 5,
            'current_version' => 1,
            'status' => 'pending_tenant',
        ]);

        // 1. Admin cannot access create contract page (redirected to dashboard by EnsureVerifiedOwner)
        $this->actingAs($admin)->get(route('owner.contracts.create'))->assertRedirect(route('dashboard'));

        // 2. Admin cannot post contract
        $this->actingAs($admin)->post(route('owner.contracts.store'), [
            'property_id' => $property->id,
            'tenant_id' => $tenant->id,
            'monthly_rent' => 400000,
        ])->assertRedirect(route('dashboard'));

        // 3. Admin cannot sign contract
        $this->actingAs($admin)->post(route('contracts.sign', $contract->id), [
            'agree_terms' => true,
        ])->assertForbidden();

        // 4. Admin cannot propose revision
        $this->actingAs($admin)->post(route('contracts.revise', $contract->id), [
            'monthly_rent' => 400000,
            'deposit_amount' => 400000,
            'rent_due_day' => 1,
            'advance_payment_months' => 1,
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'terms_and_conditions' => 'Admin trying to alter.',
        ])->assertForbidden();

        // 5. Admin CAN view contract in read-only audit mode
        $auditView = $this->actingAs($admin)->get(route('contracts.show', $contract->id));
        $auditView->assertOk();

        // 6. Admin CAN view contracts list in platform transactions audit (with secondary password session)
        $transactionsView = $this->actingAs($admin)
            ->withSession(['admin_secondary_verified' => true])
            ->get(route('admin.transactions.index'));
        $transactionsView->assertOk();
    }

    public function test_unauthorized_user_cannot_view_or_sign_other_parties_contract(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);
        $stranger = $this->createCompleteUser(['role' => 'seeker']);
        $property = $this->createProperty($owner);

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'contract_code' => 'CNT-2026-STRANGER',
            'start_date' => '2026-12-01',
            'end_date' => '2027-11-30',
            'monthly_rent' => 450000,
            'deposit_amount' => 450000,
            'rent_due_day' => 5,
            'current_version' => 1,
            'status' => 'pending_tenant',
        ]);

        // Stranger cannot view
        $this->actingAs($stranger)->get(route('contracts.show', $contract->id))->assertForbidden();

        // Stranger cannot sign
        $this->actingAs($stranger)->post(route('contracts.sign', $contract->id), [
            'agree_terms' => true,
        ])->assertForbidden();
    }

    public function test_owner_and_tenant_can_view_their_respective_contract_index_pages(): void
    {
        $owner = $this->createCompleteUser(['role' => 'owner', 'is_verified_owner' => true]);
        $tenant = $this->createCompleteUser(['role' => 'seeker']);

        $this->actingAs($owner)->get(route('owner.contracts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Owner/Contracts/Index'));

        $this->actingAs($tenant)->get(route('my-contracts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Contracts/TenantIndex'));
    }
}
