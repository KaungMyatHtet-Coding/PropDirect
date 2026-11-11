<?php

namespace App\Http\Controllers;

use App\Models\OwnerVerification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OwnerVerificationController extends Controller
{
    /**
     * Display the owner verification submission page and status.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $latestVerification = OwnerVerification::with('reviewer:id,name')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        return Inertia::render('OwnerVerification/Index', [
            'verification' => $latestVerification,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_verified_owner' => (bool) $user->is_verified_owner,
            ],
        ]);
    }

    /**
     * Store a newly submitted KYC application.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Check if there is already an active pending application
        $pendingVerification = OwnerVerification::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($pendingVerification) {
            return back()->with('error', 'You already have a pending verification application under review.');
        }

        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'nrc_number' => ['required', 'string', 'max:60'],
            'nrc_front_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'utility_bill_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ], [
            'nrc_front_image.required' => 'Please upload a photo of your NRC front.',
            'utility_bill_image.required' => 'Please upload a photo of your electricity or water utility bill.',
            'phone.regex' => 'Please provide a valid phone number format.',
        ]);

        // Update user phone number if needed
        if ($user->phone !== $validated['phone']) {
            $user->phone = $validated['phone'];
            $user->save();
        }

        // Store uploaded images to storage/app/public/verifications
        $nrcPath = $request->file('nrc_front_image')->store('verifications/nrc', 'public');
        $utilityPath = $request->file('utility_bill_image')->store('verifications/utility_bills', 'public');

        OwnerVerification::create([
            'user_id' => $user->id,
            'nrc_number' => $validated['nrc_number'],
            'nrc_front_image' => $nrcPath,
            'utility_bill_image' => $utilityPath,
            'status' => 'pending',
        ]);

        return redirect()->route('owner.verification.index')
            ->with('success', 'Your owner KYC verification documents have been submitted successfully. Our team will review them promptly.');
    }
}
