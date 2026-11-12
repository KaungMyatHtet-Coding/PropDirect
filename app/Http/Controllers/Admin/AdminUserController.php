<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display filtered user directory for platform governance.
     */
    public function index(Request $request): Response
    {
        $role = $request->query('role', 'all');
        $status = $request->query('status', 'all'); // 'all', 'verified', 'blocked'
        $search = $request->query('search', '');

        $query = User::with([
            'ownerVerification',
            'lawyerProfile',
        ])->withCount(['properties', 'viewingRequestsAsSeeker']);

        if ($role !== 'all' && in_array($role, ['admin', 'owner', 'seeker', 'lawyer'], true)) {
            $query->where('role', $role);
        }

        if ($status === 'verified') {
            $query->where(function ($q) {
                $q->where('is_verified_owner', true)
                  ->orWhereHas('lawyerProfile', fn ($lp) => $lp->where('status', 'approved'));
            });
        } elseif ($status === 'blocked') {
            $query->where('is_blocked', true);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('nrc_number', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'role' => $role,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Suspend / Block user with mandatory remark.
     */
    public function block(Request $request, User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Administrator accounts cannot be suspended.');
        }

        $request->validate([
            'blocked_reason' => ['required', 'string', 'max:255'],
        ]);

        $user->update([
            'is_blocked' => true,
            'blocked_reason' => $request->blocked_reason,
            'blocked_at' => now(),
        ]);

        return back()->with('success', "User {$user->name} has been suspended.");
    }

    /**
     * Restore user access.
     */
    public function unblock(User $user): RedirectResponse
    {
        $user->update([
            'is_blocked' => false,
            'blocked_reason' => null,
            'blocked_at' => null,
        ]);

        return back()->with('success', "User {$user->name} access has been restored.");
    }
}
