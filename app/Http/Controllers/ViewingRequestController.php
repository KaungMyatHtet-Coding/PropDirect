<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Property;
use App\Models\ViewingMessage;
use App\Models\ViewingRequest;
use App\Services\MyanmarFontService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewingRequestController extends Controller
{
    /**
     * Submit a new viewing request for a property.
     */
    public function store(Request $request, string $slug): RedirectResponse
    {
        $user = $request->user();

        // 1. Admin separation of duties
        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot book viewing requests.');
        }

        // 2. Profile completion gate
        if (! $user->is_profile_complete) {
            return redirect()->route('profile.edit')->with(
                'error',
                'Please complete your profile (photo, phone, occupation, address) before scheduling a viewing.'
            );
        }

        $property = Property::where('slug', $slug)->firstOrFail();

        // 3. Cannot book own property
        if ($property->owner_id === $user->id) {
            return back()->with('error', 'You cannot schedule a viewing for your own property.');
        }

        // 4. Validate input
        $validated = $request->validate([
            'preferred_date' => ['required', 'date', 'after_or_equal:today'],
            'preferred_time' => ['required', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        // 5. Check duplicate active request
        $existing = ViewingRequest::where('property_id', $property->id)
            ->where('seeker_id', $user->id)
            ->whereIn('status', ['pending', 'rescheduled', 'accepted'])
            ->first();

        if ($existing) {
            return back()->with('error', 'You already have an active viewing request for this property.');
        }

        $normalizedMessage = ! empty($validated['message'])
            ? MyanmarFontService::normalizeToUnicode($validated['message'])
            : null;

        // 6. Create viewing request
        $viewingRequest = ViewingRequest::create([
            'property_id' => $property->id,
            'seeker_id' => $user->id,
            'owner_id' => $property->owner_id,
            'preferred_date' => $validated['preferred_date'],
            'preferred_time' => $validated['preferred_time'],
            'message' => $normalizedMessage,
            'status' => 'pending',
            'contact_unlocked' => false,
        ]);

        // 7. Create initial message in chat thread if message was provided
        if (! empty($normalizedMessage)) {
            ViewingMessage::create([
                'viewing_request_id' => $viewingRequest->id,
                'sender_id' => $user->id,
                'message' => $normalizedMessage,
            ]);
        }

        // 8. Notify property owner
        AppNotification::create([
            'user_id' => $property->owner_id,
            'title' => 'New Viewing Request',
            'message' => "{$user->name} requested a viewing for '{$property->title}' on {$validated['preferred_date']} ({$validated['preferred_time']}).",
            'type' => 'viewing_request',
            'action_url' => route('owner.viewings.index'),
        ]);

        return back()->with('success', 'Viewing request sent to landlord! Contact information will unlock once accepted.');
    }

    /**
     * Display seeker's scheduled and past viewing requests.
     */
    public function seekerIndex(Request $request): Response
    {
        $user = $request->user();

        $viewings = ViewingRequest::with([
            'property:id,slug,title,price,listing_type,township,images,address',
            'owner:id,name,phone,avatar,role,is_verified_owner',
            'messages' => fn ($q) => $q->latest()->take(1),
        ])
            ->where('seeker_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Viewings/SeekerIndex', [
            'viewings' => $viewings,
        ]);
    }

    /**
     * Seeker accepts the owner's proposed rescheduled time.
     */
    public function acceptReschedule(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->seeker_id, 403);
        abort_unless($viewingRequest->status === 'rescheduled', 400, 'Viewing is not in rescheduled status.');

        $viewingRequest->update([
            'preferred_date' => $viewingRequest->rescheduled_date ?? $viewingRequest->preferred_date,
            'preferred_time' => $viewingRequest->rescheduled_time ?? $viewingRequest->preferred_time,
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        // Notify landlord
        AppNotification::create([
            'user_id' => $viewingRequest->owner_id,
            'title' => 'Rescheduled Viewing Accepted',
            'message' => "{$user->name} accepted your rescheduled viewing time for '{$viewingRequest->property->title}'.",
            'type' => 'viewing_accepted',
            'action_url' => route('owner.viewings.index'),
        ]);

        return back()->with('success', 'You have accepted the new viewing time! Landlord contact is unlocked.');
    }

    /**
     * Cancel a viewing request.
     */
    public function cancel(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->seeker_id || $user->id === $viewingRequest->owner_id, 403);

        $viewingRequest->update([
            'status' => 'cancelled',
        ]);

        $recipientId = $user->id === $viewingRequest->seeker_id ? $viewingRequest->owner_id : $viewingRequest->seeker_id;
        AppNotification::create([
            'user_id' => $recipientId,
            'title' => 'Viewing Request Cancelled',
            'message' => "Viewing request for '{$viewingRequest->property->title}' was cancelled by {$user->name}.",
            'type' => 'viewing_cancelled',
            'action_url' => route('dashboard'),
        ]);

        return back()->with('success', 'Viewing request has been cancelled.');
    }
}
