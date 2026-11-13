<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\Property;
use App\Models\User;
use App\Models\ViewingRequest;
use App\Services\ContractDiffService;
use App\Services\MyanmarFontService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    /**
     * Display list of lease contracts for landlord.
     */
    public function ownerIndex(Request $request): Response
    {
        $user = $request->user();

        $contracts = Contract::with([
            'property:id,slug,title,township,price,images,status',
            'tenant:id,name,phone,avatar,occupation,is_profile_complete',
            'latestVersion',
        ])
            ->where('owner_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Owner/Contracts/Index', [
            'contracts' => $contracts,
        ]);
    }

    /**
     * Display list of lease contracts for tenant.
     */
    public function tenantIndex(Request $request): Response
    {
        $user = $request->user();

        $contracts = Contract::with([
            'property:id,slug,title,township,price,images,status',
            'owner:id,name,phone,avatar,role,is_verified_owner',
            'latestVersion',
        ])
            ->where('tenant_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Contracts/TenantIndex', [
            'contracts' => $contracts,
        ]);
    }

    /**
     * Show form to draft a new contract.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        // Admin separation
        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot create contracts.');
        }

        // Available properties owned by user
        $properties = Property::where('owner_id', $user->id)
            ->select('id', 'title', 'slug', 'township', 'price', 'security_deposit', 'advance_payment_months', 'min_contract_months', 'house_rules', 'status', 'width_ft', 'length_ft', 'area_sqft', 'floor_level', 'address')
            ->get();

        $preselectedPropertyId = $request->query('property_id');
        $preselectedSeekerId = $request->query('seeker_id');
        $viewingRequestId = $request->query('viewing_request_id');

        $viewingRequest = null;
        if ($viewingRequestId) {
            $viewingRequest = ViewingRequest::with(['seeker', 'property'])->find($viewingRequestId);
            if ($viewingRequest && $viewingRequest->owner_id === $user->id) {
                $preselectedPropertyId = $viewingRequest->property_id;
                $preselectedSeekerId = $viewingRequest->seeker_id;
            }
        }

        $preselectedProperty = $properties->firstWhere('id', (int) $preselectedPropertyId) ?: $properties->first();
        $preselectedTenant = $preselectedSeekerId ? User::find($preselectedSeekerId) : null;

        // Auto-generate smart template if property is available
        $defaultTemplate = null;
        if ($preselectedProperty && $preselectedTenant) {
            $defaultTemplate = ContractDiffService::generateSmartTemplate($preselectedProperty, $user, $preselectedTenant);
        }

        // Candidates (seekers with accepted/completed viewing requests with this owner)
        $eligibleSeekers = User::whereIn('id', function ($query) use ($user) {
            $query->select('seeker_id')
                ->from('viewing_requests')
                ->where('owner_id', $user->id)
                ->whereIn('status', ['accepted', 'completed']);
        })
            ->select('id', 'name', 'phone', 'avatar', 'occupation')
            ->get();

        return Inertia::render('Owner/Contracts/Create', [
            'properties' => $properties,
            'eligibleSeekers' => $eligibleSeekers,
            'preselectedPropertyId' => $preselectedProperty?->id,
            'preselectedSeekerId' => $preselectedTenant?->id,
            'viewingRequestId' => $viewingRequestId,
            'defaultTemplate' => $defaultTemplate,
        ]);
    }

    /**
     * Store new contract and version 1.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot create contracts.');
        }

        $validated = $request->validate([
            'property_id' => ['required', 'exists:properties,id'],
            'tenant_id' => ['required', 'exists:users,id', 'different:' . $user->id],
            'viewing_request_id' => ['nullable', 'exists:viewing_requests,id'],
            'lawyer_inquiry_id' => ['nullable', 'exists:lawyer_inquiries,id'],
            'monthly_rent' => ['required', 'numeric', 'min:1000'],
            'deposit_amount' => ['required', 'numeric', 'min:0'],
            'rent_due_day' => ['required', 'integer', 'between:1,31'],
            'advance_payment_months' => ['required', 'integer', 'between:1,12'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'structured_clauses' => ['nullable', 'array'],
            'terms_and_conditions' => ['required', 'string'],
        ]);

        $property = Property::findOrFail($validated['property_id']);
        abort_unless($property->owner_id === $user->id, 403, 'You do not own this property.');

        // Unique contract code: CNT-YEAR-RANDOM
        $contractCode = 'CNT-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));

        $contract = Contract::create([
            'property_id' => $property->id,
            'owner_id' => $user->id,
            'tenant_id' => $validated['tenant_id'],
            'viewing_request_id' => $validated['viewing_request_id'] ?? null,
            'lawyer_inquiry_id' => $validated['lawyer_inquiry_id'] ?? null,
            'contract_code' => $contractCode,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'monthly_rent' => $validated['monthly_rent'],
            'deposit_amount' => $validated['deposit_amount'],
            'rent_due_day' => $validated['rent_due_day'],
            'current_version' => 1,
            'owner_signed_at' => now(), // Landlord signs on draft submission
            'tenant_signed_at' => null,
            'status' => 'pending_tenant',
        ]);

        // Store Version 1
        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version_number' => 1,
            'monthly_rent' => $validated['monthly_rent'],
            'deposit_amount' => $validated['deposit_amount'],
            'advance_payment_months' => $validated['advance_payment_months'],
            'rent_due_day' => $validated['rent_due_day'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'terms_and_conditions' => MyanmarFontService::normalizeToUnicode($validated['terms_and_conditions']),
            'house_rules_snapshot' => $property->house_rules,
            'revision_request_note' => 'Initial lease contract draft prepared by Landlord.',
            'structured_clauses' => $validated['structured_clauses'] ?? null,
            'change_summary' => 'Initial contract draft created and signed by Landlord.',
            'created_by' => $user->id,
        ]);

        // Notify Tenant
        AppNotification::create([
            'user_id' => $validated['tenant_id'],
            'title' => 'New Lease Contract Received',
            'message' => "Landlord {$user->name} sent you a formal lease agreement ({$contractCode}) for '{$property->title}'. Please review and sign.",
            'type' => 'contract',
            'action_url' => route('contracts.show', $contract->id),
        ]);

        return redirect()->route('contracts.show', $contract->id)
            ->with('success', 'Lease contract draft created and sent to tenant!');
    }

    /**
     * Display Contract showcase: Document, Visual Diff-Tracker, and Timeline.
     */
    public function show(Request $request, Contract $contract): Response
    {
        $user = $request->user();

        // Access gate: Owner, Tenant, or Admin auditor
        abort_unless(
            $user->isAdmin() || $user->id === $contract->owner_id || $user->id === $contract->tenant_id,
            403,
            'You do not have permission to view this contract.'
        );

        $contract->load([
            'property',
            'owner:id,name,phone,avatar,nrc_number,current_address,role,is_verified_owner',
            'tenant:id,name,phone,avatar,nrc_number,current_address,occupation,role',
            'versions.creator:id,name,avatar,role',
            'viewingRequest',
            'lawyerInquiry.lawyerUser:id,name,phone',
        ]);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    /**
     * Propose counter-offer / new contract revision.
     */
    public function revise(Request $request, Contract $contract): RedirectResponse
    {
        $user = $request->user();

        // Admin separation
        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot revise contracts.');
        }

        abort_unless(
            $user->id === $contract->owner_id || $user->id === $contract->tenant_id,
            403,
            'Only contract participants can propose revisions.'
        );

        $validated = $request->validate([
            'monthly_rent' => ['required', 'numeric', 'min:1000'],
            'deposit_amount' => ['required', 'numeric', 'min:0'],
            'rent_due_day' => ['required', 'integer', 'between:1,31'],
            'advance_payment_months' => ['required', 'integer', 'between:1,12'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'structured_clauses' => ['nullable', 'array'],
            'terms_and_conditions' => ['required', 'string'],
            'revision_request_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $oldVersion = $contract->latestVersion;
        $newVersionNumber = $contract->current_version + 1;

        $newVersion = new ContractVersion([
            'contract_id' => $contract->id,
            'version_number' => $newVersionNumber,
            'monthly_rent' => $validated['monthly_rent'],
            'deposit_amount' => $validated['deposit_amount'],
            'advance_payment_months' => $validated['advance_payment_months'],
            'rent_due_day' => $validated['rent_due_day'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'terms_and_conditions' => MyanmarFontService::normalizeToUnicode($validated['terms_and_conditions']),
            'house_rules_snapshot' => $oldVersion?->house_rules_snapshot ?? $contract->property->house_rules,
            'revision_request_note' => ! empty($validated['revision_request_note'])
                ? MyanmarFontService::normalizeToUnicode($validated['revision_request_note'])
                : null,
            'structured_clauses' => $validated['structured_clauses'] ?? $oldVersion?->structured_clauses,
            'created_by' => $user->id,
        ]);

        // Auto-generate change summary
        $summary = $oldVersion
            ? ContractDiffService::summarizeDiff($oldVersion, $newVersion)
            : 'New version proposed.';

        $newVersion->change_summary = $summary;
        $newVersion->save();

        // Update Contract core record
        $isOwner = $user->id === $contract->owner_id;
        $contract->update([
            'current_version' => $newVersionNumber,
            'monthly_rent' => $validated['monthly_rent'],
            'deposit_amount' => $validated['deposit_amount'],
            'rent_due_day' => $validated['rent_due_day'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'revision_requested',
            'owner_signed_at' => $isOwner ? now() : null, // Proposer signs; counterparty must review
            'tenant_signed_at' => ! $isOwner ? now() : null,
        ]);

        // Notify other party
        $recipientId = $isOwner ? $contract->tenant_id : $contract->owner_id;
        AppNotification::create([
            'user_id' => $recipientId,
            'title' => "Contract Revision v{$newVersionNumber} Proposed",
            'message' => "{$user->name} proposed changes for contract {$contract->contract_code}: {$summary}",
            'type' => 'contract_revision',
            'action_url' => route('contracts.show', $contract->id),
        ]);

        return back()->with('success', "Version {$newVersionNumber} published! Counterparty has been notified.");
    }

    /**
     * Digital execution / Sign contract.
     */
    public function sign(Request $request, Contract $contract): RedirectResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot sign contracts.');
        }

        abort_unless(
            $user->id === $contract->owner_id || $user->id === $contract->tenant_id,
            403,
            'You are not a party to this agreement.'
        );

        $request->validate([
            'agree_terms' => ['accepted'],
        ]);

        $isOwner = $user->id === $contract->owner_id;
        if ($isOwner) {
            $contract->owner_signed_at = now();
        } else {
            $contract->tenant_signed_at = now();
        }

        // If both parties have signed, activate contract & mark property as rented
        if ($contract->owner_signed_at && $contract->tenant_signed_at) {
            $contract->status = 'active';
            $contract->activated_at = now();
            $contract->property()->update(['status' => 'rented']);

            // Notify both parties
            AppNotification::create([
                'user_id' => $contract->owner_id,
                'title' => "Lease Contract Fully Executed! 🎉",
                'message' => "Contract {$contract->contract_code} has been digitally signed by both parties and is now legally active.",
                'type' => 'contract_active',
                'action_url' => route('contracts.show', $contract->id),
            ]);

            AppNotification::create([
                'user_id' => $contract->tenant_id,
                'title' => "Lease Contract Fully Executed! 🎉",
                'message' => "Contract {$contract->contract_code} has been digitally signed by both parties and is now legally active.",
                'type' => 'contract_active',
                'action_url' => route('contracts.show', $contract->id),
            ]);
        }

        $contract->save();

        return back()->with('success', 'You have digitally signed the contract!');
    }

    /**
     * Terminate an active contract.
     */
    public function terminate(Request $request, Contract $contract): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $user->id === $contract->owner_id || $user->id === $contract->tenant_id,
            403
        );

        $validated = $request->validate([
            'termination_reason' => ['required', 'string', 'max:1000'],
        ]);

        $normalizedReason = MyanmarFontService::normalizeToUnicode($validated['termination_reason']);

        $contract->update([
            'status' => 'terminated',
            'termination_reason' => $normalizedReason,
        ]);

        // Release property back to available
        $contract->property()->update(['status' => 'available']);

        $recipientId = $user->id === $contract->owner_id ? $contract->tenant_id : $contract->owner_id;
        AppNotification::create([
            'user_id' => $recipientId,
            'title' => "Contract Terminated",
            'message' => "Contract {$contract->contract_code} was terminated by {$user->name}. Reason: {$normalizedReason}",
            'type' => 'contract_terminated',
            'action_url' => route('contracts.show', $contract->id),
        ]);

        return back()->with('success', 'Contract has been terminated.');
    }
}
