<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\LawyerInquiry;
use App\Models\LawyerProfile;
use App\Models\Property;
use App\Services\MyanmarFontService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LawyerInquiryController extends Controller
{
    /**
     * Client submits an inquiry or booking request to a verified lawyer.
     */
    public function store(Request $request, LawyerProfile $lawyerProfile): RedirectResponse
    {
        $user = $request->user();

        // 1. Admin separation
        if ($user->isAdmin()) {
            abort(403, 'Administrators cannot book legal consultations.');
        }

        // 2. Profile completion gate
        if (! $user->is_profile_complete) {
            return redirect()->route('profile.edit')->with(
                'error',
                'Please complete your profile (photo, phone, occupation, address) before hiring a lawyer.'
            );
        }

        // 3. Cannot book oneself
        if ($lawyerProfile->user_id === $user->id) {
            return back()->with('error', 'You cannot book a consultation with yourself.');
        }

        // 4. Validate input
        $validated = $request->validate([
            'service_type' => [
                'required',
                'in:grant_verification,sale_contract,lease_contract,newspaper_notice,general_consultation',
            ],
            'preferred_date' => ['required', 'date', 'after_or_equal:today'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'notes' => ['required', 'string', 'max:2000'],
        ]);

        // Default initial quote based on service type
        $defaultFee = in_array($validated['service_type'], ['sale_contract', 'lease_contract'], true)
            ? $lawyerProfile->contract_fee
            : $lawyerProfile->consultation_fee;

        $normalizedNotes = MyanmarFontService::normalizeToUnicode($validated['notes']);

        $inquiry = LawyerInquiry::create([
            'lawyer_profile_id' => $lawyerProfile->id,
            'lawyer_user_id' => $lawyerProfile->user_id,
            'client_id' => $user->id,
            'property_id' => $validated['property_id'] ?? null,
            'service_type' => $validated['service_type'],
            'preferred_date' => $validated['preferred_date'],
            'quoted_fee' => $defaultFee,
            'notes' => $normalizedNotes,
            'status' => 'pending',
        ]);

        // Notify lawyer
        AppNotification::create([
            'user_id' => $lawyerProfile->user_id,
            'title' => 'New Legal Client Inquiry',
            'message' => "{$user->name} booked a legal consultation for '{$validated['service_type']}'.",
            'type' => 'lawyer_inquiry',
            'action_url' => route('lawyer.inquiries.index'),
        ]);

        return back()->with('success', 'Your inquiry was sent to the lawyer! You will receive confirmation and quote updates soon.');
    }

    /**
     * Display client's list of legal inquiries.
     */
    public function clientIndex(Request $request): Response
    {
        $user = $request->user();

        $inquiries = LawyerInquiry::with([
            'lawyerProfile',
            'lawyerUser:id,name,phone,avatar,role',
            'property:id,slug,title,township,price,listing_type',
        ])
            ->where('client_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('LegalInquiries/Index', [
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Display lawyer's active inquiries workspace.
     */
    public function lawyerIndex(Request $request): Response
    {
        $user = $request->user();

        $inquiries = LawyerInquiry::with([
            'client:id,name,phone,avatar,occupation,nrc_number,current_address',
            'property:id,slug,title,township,price,listing_type',
        ])
            ->where('lawyer_user_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Lawyer/Inquiries/Index', [
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Lawyer accepts inquiry and confirms or adjusts fee quote.
     */
    public function accept(Request $request, LawyerInquiry $inquiry): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $inquiry->lawyer_user_id, 403);

        $validated = $request->validate([
            'quoted_fee' => ['nullable', 'numeric', 'min:0'],
            'lawyer_response' => ['nullable', 'string', 'max:1000'],
        ]);

        $normalizedResponse = ! empty($validated['lawyer_response'])
            ? MyanmarFontService::normalizeToUnicode($validated['lawyer_response'])
            : null;

        $inquiry->update([
            'status' => 'accepted',
            'quoted_fee' => $validated['quoted_fee'] ?? $inquiry->quoted_fee,
            'lawyer_response' => $normalizedResponse,
        ]);

        // Notify client
        AppNotification::create([
            'user_id' => $inquiry->client_id,
            'title' => 'Lawyer Accepted Your Inquiry',
            'message' => "Advocate {$user->name} accepted your request. Quoted fee: " . number_format($inquiry->quoted_fee) . ' Ks.',
            'type' => 'lawyer_accepted',
            'action_url' => route('my-legal-inquiries.index'),
        ]);

        return back()->with('success', 'Inquiry accepted with consultation quote.');
    }

    /**
     * Mark legal service as completed.
     */
    public function complete(Request $request, LawyerInquiry $inquiry): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $inquiry->lawyer_user_id, 403);

        $inquiry->update([
            'status' => 'completed',
        ]);

        // Notify client
        AppNotification::create([
            'user_id' => $inquiry->client_id,
            'title' => 'Legal Service Completed',
            'message' => "Your consultation with Advocate {$user->name} has been marked as completed.",
            'type' => 'lawyer_completed',
            'action_url' => route('my-legal-inquiries.index'),
        ]);

        return back()->with('success', 'Legal service completed.');
    }

    /**
     * Lawyer declines inquiry.
     */
    public function reject(Request $request, LawyerInquiry $inquiry): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->id === $inquiry->lawyer_user_id, 403);

        $reason = $request->input('reason');
        $normalizedReason = ! empty($reason) ? MyanmarFontService::normalizeToUnicode($reason) : null;

        $inquiry->update([
            'status' => 'rejected',
            'lawyer_response' => $normalizedReason,
        ]);

        // Notify client
        AppNotification::create([
            'user_id' => $inquiry->client_id,
            'title' => 'Lawyer Inquiry Update',
            'message' => "Advocate {$user->name} is currently unavailable for this consultation request.",
            'type' => 'lawyer_rejected',
            'action_url' => route('my-legal-inquiries.index'),
        ]);

        return back()->with('success', 'Inquiry declined.');
    }
}
