<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\ViewingRequest;
use App\Services\MyanmarFontService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OwnerViewingController extends Controller
{
    /**
     * Display landlord's viewing requests.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $viewings = ViewingRequest::with([
            'property:id,slug,title,price,listing_type,township,images,address',
            'seeker:id,name,phone,avatar,occupation,nrc_number,current_address,is_profile_complete',
            'messages' => fn ($q) => $q->latest()->take(1),
        ])
            ->where('owner_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Owner/Viewings/Index', [
            'viewings' => $viewings,
        ]);
    }

    /**
     * Landlord accepts a viewing request -> unlocks direct phone contact.
     */
    public function accept(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->owner_id, 403);

        $viewingRequest->update([
            'status' => 'accepted',
            'contact_unlocked' => true,
        ]);

        // Notify seeker that viewing is confirmed and contact is unlocked
        AppNotification::create([
            'user_id' => $viewingRequest->seeker_id,
            'title' => 'Viewing Request Confirmed! 🎉',
            'message' => "The landlord confirmed your viewing for '{$viewingRequest->property->title}'. Landlord direct contact number is now unlocked!",
            'type' => 'viewing_accepted',
            'action_url' => route('my-viewings.index'),
        ]);

        return back()->with('success', 'Viewing request accepted! Seeker can now see your contact number.');
    }

    /**
     * Landlord proposes a new date and time if unavailable.
     */
    public function reschedule(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->owner_id, 403);

        $validated = $request->validate([
            'rescheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'rescheduled_time' => ['required', 'string', 'max:50'],
            'owner_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $normalizedNote = ! empty($validated['owner_note'])
            ? MyanmarFontService::normalizeToUnicode($validated['owner_note'])
            : null;

        $viewingRequest->update([
            'rescheduled_date' => $validated['rescheduled_date'],
            'rescheduled_time' => $validated['rescheduled_time'],
            'owner_note' => $normalizedNote,
            'status' => 'rescheduled',
        ]);

        // Notify seeker
        AppNotification::create([
            'user_id' => $viewingRequest->seeker_id,
            'title' => 'Landlord Rescheduled Viewing Time',
            'message' => "Landlord proposed a new viewing time for '{$viewingRequest->property->title}' on {$validated['rescheduled_date']} ({$validated['rescheduled_time']}). Please review and accept.",
            'type' => 'viewing_rescheduled',
            'action_url' => route('my-viewings.index'),
        ]);

        return back()->with('success', 'Reschedule proposal sent to property seeker.');
    }

    /**
     * Mark viewing appointment as completed.
     */
    public function complete(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->owner_id, 403);

        $viewingRequest->update([
            'status' => 'completed',
        ]);

        return back()->with('success', 'Viewing marked as completed.');
    }

    /**
     * Landlord declines a viewing request.
     */
    public function reject(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $viewingRequest->owner_id, 403);

        $reason = $request->input('reason');
        $normalizedReason = ! empty($reason) ? MyanmarFontService::normalizeToUnicode($reason) : null;

        $viewingRequest->update([
            'status' => 'rejected',
            'owner_note' => $normalizedReason,
        ]);

        // Notify seeker
        AppNotification::create([
            'user_id' => $viewingRequest->seeker_id,
            'title' => 'Viewing Request Declined',
            'message' => "The landlord is unable to accommodate the viewing for '{$viewingRequest->property->title}'.",
            'type' => 'viewing_rejected',
            'action_url' => route('my-viewings.index'),
        ]);

        return back()->with('success', 'Viewing request has been declined.');
    }
}
