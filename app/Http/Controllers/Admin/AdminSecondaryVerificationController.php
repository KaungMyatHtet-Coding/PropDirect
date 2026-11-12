<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminSecondaryVerificationController extends Controller
{
    /**
     * Show the secondary password challenge screen.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            return redirect()->route('dashboard');
        }

        if ($request->session()->get('admin_secondary_verified', false)) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/VerifySecondary');
    }

    /**
     * Verify secondary password against hashed value in DB.
     */
    public function verify(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'secondary_password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->secondary_password, $user->secondary_password)) {
            return back()->withErrors([
                'secondary_password' => 'Invalid secondary administrative security password.',
            ]);
        }

        $request->session()->put('admin_secondary_verified', true);

        return redirect()->intended(route('dashboard'))
            ->with('success', 'Administrative security verification confirmed.');
    }

    /**
     * Update admin secondary password from Profile / Settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'current_secondary_password' => ['required', 'string'],
            'new_secondary_password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if (! Hash::check($request->current_secondary_password, $user->secondary_password)) {
            return back()->withErrors([
                'current_secondary_password' => 'The provided current secondary password is incorrect.',
            ]);
        }

        $user->update([
            'secondary_password' => Hash::make($request->new_secondary_password),
        ]);

        return back()->with('success', 'Secondary administrative security password updated successfully.');
    }
}
