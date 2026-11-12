<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LawyerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminLawyerController extends Controller
{
    /**
     * Display a listing of all lawyer verification applications.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = LawyerProfile::with('user:id,name,email,phone,avatar,role,is_profile_complete,created_at')
            ->latest();

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('license_number', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%")
                  ->orWhere('office_township', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $lawyers = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => LawyerProfile::count(),
            'pending' => LawyerProfile::where('status', 'pending')->count(),
            'approved' => LawyerProfile::where('status', 'approved')->count(),
            'rejected' => LawyerProfile::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Lawyers/Index', [
            'lawyers' => $lawyers,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Approve lawyer application.
     */
    public function approve(Request $request, LawyerProfile $lawyerProfile): RedirectResponse
    {
        $request->validate([
            'admin_remark' => ['nullable', 'string', 'max:1000'],
        ]);

        $lawyerProfile->update([
            'status' => 'approved',
            'admin_remark' => $request->input('admin_remark', 'Verified Bar Council Advocate / Higher Grade Pleader.'),
        ]);

        $lawyerProfile->user->update([
            'role' => 'lawyer',
        ]);

        return back()->with('success', "Lawyer credentials for {$lawyerProfile->user->name} have been approved!");
    }

    /**
     * Reject lawyer application with remark.
     */
    public function reject(Request $request, LawyerProfile $lawyerProfile): RedirectResponse
    {
        $validated = $request->validate([
            'admin_remark' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        $lawyerProfile->update([
            'status' => 'rejected',
            'admin_remark' => $validated['admin_remark'],
        ]);

        if ($lawyerProfile->user->role === 'lawyer') {
            $lawyerProfile->user->update([
                'role' => 'seeker',
            ]);
        }

        return back()->with('success', "Lawyer application for {$lawyerProfile->user->name} has been rejected with remark.");
    }
}
