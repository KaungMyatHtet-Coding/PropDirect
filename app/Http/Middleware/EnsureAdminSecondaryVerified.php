<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminSecondaryVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isAdmin()) {
            if (! $request->session()->get('admin_secondary_verified', false)) {
                if ($request->routeIs('admin.verify-secondary.*')) {
                    return $next($request);
                }

                return redirect()->route('admin.verify-secondary.show');
            }
        }

        return $next($request);
    }
}
