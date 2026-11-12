<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\User;
use App\Models\UserFeedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Store submitted user feedback.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'category' => ['required', 'in:bug,feature,support'],
            'message' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        $feedback = $request->user()->feedbacks()->create([
            'category' => $request->category,
            'message' => $request->message,
            'status' => 'open',
        ]);

        // Send alert notification to platform admin
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            AppNotification::create([
                'user_id' => $admin->id,
                'title' => 'New User Feedback (' . strtoupper($feedback->category) . ')',
                'message' => "Feedback from {$request->user()->name}: " . substr($feedback->message, 0, 80) . '...',
                'type' => 'system',
                'action_url' => route('dashboard'),
            ]);
        }

        return back()->with('success', 'Thank you! Your feedback has been received by our platform team.');
    }
}
