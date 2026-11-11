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

        // Admin bypass or verified owner
        if ($user->isAdmin() || ($user->isOwner() && $user->is_verified_owner)) {
            return $next($request);
        }

        return redirect()->route('owner.verification.index')
            ->with('error', 'Only verified property owners can access this section. Please complete owner KYC verification.');
    }
}
