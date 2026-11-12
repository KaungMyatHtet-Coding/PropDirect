<?php

namespace App\Http\Controllers;

use App\Models\LawyerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LawyerVerificationController extends Controller
{
    /**
     * Show lawyer verification application form and current status.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Admin accounts are strictly for platform governance and cannot list, rent, or buy properties to prevent conflict of interest.');
        }

        $profile = LawyerProfile::where('user_id', $user->id)->first();

        return Inertia::render('LawyerVerification/Index', [
            'lawyerProfile' => $profile,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'is_profile_complete' => (bool) $user->is_profile_complete,
            ],
        ]);
    }

    /**
     * Submit lawyer verification application.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Admin accounts are strictly for platform governance and cannot list, rent, or buy properties to prevent conflict of interest.');
        }

        $existing = LawyerProfile::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return back()->with('error', 'You already have a pending lawyer application in review.');
        }

        $validated = $request->validate([
            'license_number' => ['required', 'string', 'max:100', 'unique:lawyer_profiles,license_number'],
            'lawyer_type' => ['required', 'in:advocate,higher_grade_pleader'],
            'degree' => ['required', 'string', 'max:100'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:60'],
            'specialization' => ['required', 'string', 'max:255'],
            'consultation_fee' => ['required', 'numeric', 'min:0'],
            'contract_fee' => ['required', 'numeric', 'min:0'],
            'office_township' => ['required', 'string', 'max:100'],
            'bio' => ['required', 'string', 'min:20', 'max:2000'],
            'license_card_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $licenseImagePath = $request->file('license_card_image')->store('verifications/lawyer_cards', 'public');

        LawyerProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'license_number' => $validated['license_number'],
                'lawyer_type' => $validated['lawyer_type'],
                'degree' => $validated['degree'],
                'experience_years' => $validated['experience_years'],
                'specialization' => $validated['specialization'],
                'consultation_fee' => $validated['consultation_fee'],
                'contract_fee' => $validated['contract_fee'],
                'office_township' => $validated['office_township'],
                'bio' => $validated['bio'],
                'license_card_image' => $licenseImagePath,
                'status' => 'pending',
                'admin_remark' => null,
            ]
        );

        return redirect()->route('lawyer.verification.index')
            ->with('success', 'Your lawyer credential application has been submitted. Our legal safety team will audit your Bar license.');
    }
}
