<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LawyerInquiry;
use App\Models\ViewingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTransactionController extends Controller
{
    /**
     * Display unified platform transaction audit overview.
     */
    public function index(Request $request): Response
    {
        $viewings = ViewingRequest::with([
            'property:id,slug,title,price,listing_type,township',
            'seeker:id,name,phone,email',
            'owner:id,name,phone,email',
        ])
            ->latest()
            ->paginate(10, ['*'], 'viewings_page');

        $inquiries = LawyerInquiry::with([
            'lawyerProfile',
            'lawyerUser:id,name,phone,email',
            'client:id,name,phone,email',
            'property:id,slug,title,price',
        ])
            ->latest()
            ->paginate(10, ['*'], 'inquiries_page');

        $metrics = [
            'total_viewings' => ViewingRequest::count(),
            'accepted_viewings' => ViewingRequest::where('status', 'accepted')->count(),
            'completed_viewings' => ViewingRequest::where('status', 'completed')->count(),
            'unlocked_contacts' => ViewingRequest::where('contact_unlocked', true)->count(),
            'total_inquiries' => LawyerInquiry::count(),
            'accepted_inquiries' => LawyerInquiry::where('status', 'accepted')->count(),
            'completed_inquiries' => LawyerInquiry::where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Transactions/Index', [
            'viewings' => $viewings,
            'inquiries' => $inquiries,
            'metrics' => $metrics,
        ]);
    }
}
