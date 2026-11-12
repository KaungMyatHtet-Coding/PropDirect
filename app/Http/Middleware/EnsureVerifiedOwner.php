<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVerifiedOwner
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Strict Separation of Duties: Admins cannot post or manage properties
        if ($user->isAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Admin accounts are strictly for platform governance and cannot list, rent, or buy properties to prevent conflict of interest.');
        }

        // Only genuine verified owners allowed
        if ($user->isOwner() && $user->is_verified_owner) {
            return $next($request);
        }

        return redirect()->route('owner.verification.index')
            ->with('error', 'Only verified property owners can access this section. Please complete owner KYC verification.');
    }
}
