<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OwnerVerification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminVerificationController extends Controller
{
    /**
     * Display a listing of all owner verification KYC applications.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = OwnerVerification::with([
            'user:id,name,email,phone,role,is_verified_owner,created_at',
            'reviewer:id,name,email',
        ])->latest();

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nrc_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $verifications = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => OwnerVerification::count(),
            'pending' => OwnerVerification::where('status', 'pending')->count(),
            'approved' => OwnerVerification::where('status', 'approved')->count(),
            'rejected' => OwnerVerification::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Verifications/Index', [
            'verifications' => $verifications,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Approve an owner verification request.
     */
    public function approve(Request $request, OwnerVerification $verification): RedirectResponse
    {
        $request->validate([
            'admin_remark' => ['nullable', 'string', 'max:1000'],
        ]);

        $verification->update([
            'status' => 'approved',
            'admin_remark' => $request->input('admin_remark', 'Verified Genuine Property Owner.'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // Upgrade user to Verified Owner
        $applicant = $verification->user;
        $applicant->update([
            'role' => 'owner',
            'is_verified_owner' => true,
        ]);

        return back()->with('success', "Application approved successfully! {$applicant->name} is now a Verified Owner.");
    }

    /**
     * Reject an owner verification request with remark.
     */
    public function reject(Request $request, OwnerVerification $verification): RedirectResponse
    {
        $validated = $request->validate([
            'admin_remark' => ['required', 'string', 'min:5', 'max:1000'],
        ], [
            'admin_remark.required' => 'Please provide a clear reason or remark for rejection so the user can rectify.',
            'admin_remark.min' => 'The rejection remark must be at least 5 characters long.',
        ]);

        $verification->update([
            'status' => 'rejected',
            'admin_remark' => $validated['admin_remark'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // If the user's only role was owner because of this verification, keep or revert is_verified_owner
        $applicant = $verification->user;
        $applicant->update([
            'is_verified_owner' => false,
        ]);

        return back()->with('success', "Application for {$applicant->name} has been rejected with remark recorded.");
    }
}
