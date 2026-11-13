<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\ViewingMessage;
use App\Models\ViewingRequest;
use App\Services\MyanmarFontService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ViewingMessageController extends Controller
{
    /**
     * Show chat thread for a viewing request.
     */
    public function show(Request $request, ViewingRequest $viewingRequest): Response
    {
        $user = $request->user();

        // Seeker, Owner, or Admin can view the chat
        abort_unless(
            $user->isAdmin() || $user->id === $viewingRequest->seeker_id || $user->id === $viewingRequest->owner_id,
            403,
            'You do not have access to this conversation.'
        );

        // Mark incoming messages as read
        ViewingMessage::where('viewing_request_id', $viewingRequest->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $viewingRequest->load([
            'property:id,slug,title,price,listing_type,township,images,address',
            'seeker:id,name,phone,avatar,role,occupation,nrc_number',
            'owner:id,name,phone,avatar,role,is_verified_owner',
            'messages.sender:id,name,avatar,role',
        ]);

        return Inertia::render('Viewings/Show', [
            'viewing' => $viewingRequest,
        ]);
    }

    /**
     * Post a new message in the viewing chat thread.
     */
    public function store(Request $request, ViewingRequest $viewingRequest): RedirectResponse
    {
        $user = $request->user();

        // Only participants can post messages (admin is read-only auditor)
        abort_unless(
            $user->id === $viewingRequest->seeker_id || $user->id === $viewingRequest->owner_id,
            403,
            'Only participants may send messages in this thread.'
        );

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $normalized = MyanmarFontService::normalizeToUnicode($validated['message']);

        $message = ViewingMessage::create([
            'viewing_request_id' => $viewingRequest->id,
            'sender_id' => $user->id,
            'message' => $normalized,
        ]);

        // Notify other participant
        $recipientId = $user->id === $viewingRequest->seeker_id ? $viewingRequest->owner_id : $viewingRequest->seeker_id;

        AppNotification::create([
            'user_id' => $recipientId,
            'title' => "New Message from {$user->name}",
            'message' => Str::limit($normalized, 100),
            'type' => 'viewing_message',
            'action_url' => route('viewing.show', $viewingRequest->id),
        ]);

        return back()->with('success', 'Message sent.');
    }
}
