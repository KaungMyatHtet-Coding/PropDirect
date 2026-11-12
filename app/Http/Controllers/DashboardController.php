<?php

namespace App\Http\Controllers;

use App\Models\LawyerProfile;
use App\Models\OwnerVerification;
use App\Models\Property;
use App\Models\SearchLog;
use App\Models\User;
use App\Models\UserFeedback;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render role-adaptive dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard($request);
        }

        if ($user->isOwner()) {
            return $this->ownerDashboard($request, $user);
        }

        return $this->seekerDashboard($request, $user);
    }

    protected function adminDashboard(Request $request): Response
    {
        $totalProperties = Property::count();
        $verifiedOwnersCount = User::where('is_verified_owner', true)->count();
        $approvedLawyersCount = LawyerProfile::where('status', 'approved')->count();
        $verifiedUsersTotal = $verifiedOwnersCount + $approvedLawyersCount;

        $pendingOwnerKYC = OwnerVerification::where('status', 'pending')->count();
        $pendingLawyerKYC = LawyerProfile::where('status', 'pending')->count();
        $totalPendingKYC = $pendingOwnerKYC + $pendingLawyerKYC;

        // 7-day Volume trend (Rent, Sale, Search Activity)
        $trendRange = $request->query('trend_range', 'week'); // 'week' or 'month'
        $daysCount = $trendRange === 'month' ? 30 : 7;

        $trendData = [];
        for ($i = $daysCount - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $formattedDate = $date->format('M d');

            $rents = Property::where('listing_type', 'rent')
                ->whereDate('created_at', $date)
                ->count();

            $sales = Property::where('listing_type', 'sale')
                ->whereDate('created_at', $date)
                ->count();

            $searches = SearchLog::whereDate('created_at', $date)->count();

            $trendData[] = [
                'date' => $formattedDate,
                'rent' => $rents,
                'sale' => $sales,
                'searches' => $searches,
            ];
        }

        // Market Demand from Search Logs
        $topTownships = SearchLog::whereNotNull('township')
            ->selectRaw('township, count(*) as count')
            ->groupBy('township')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        $topDimensions = SearchLog::whereNotNull('dimension_preset')
            ->selectRaw('dimension_preset, count(*) as count')
            ->groupBy('dimension_preset')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        $topFloors = SearchLog::whereNotNull('floor_level')
            ->selectRaw('floor_level, count(*) as count')
            ->groupBy('floor_level')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        // Feed of latest activities
        $recentVerifications = OwnerVerification::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => 'ov-' . $item->id,
                'type' => 'kyc_owner',
                'title' => 'Owner KYC: ' . ($item->user->name ?? 'User'),
                'subtitle' => 'Status: ' . ucfirst($item->status),
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'timestamp' => $item->created_at,
            ]);

        $recentLawyers = LawyerProfile::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => 'lp-' . $item->id,
                'type' => 'kyc_lawyer',
                'title' => 'Lawyer License: ' . ($item->user->name ?? 'User'),
                'subtitle' => 'Lic: ' . $item->license_number,
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'timestamp' => $item->created_at,
            ]);

        $recentProperties = Property::with('owner:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => 'prop-' . $item->id,
                'type' => 'property',
                'title' => 'New Listing: ' . $item->title,
                'subtitle' => $item->township . ' | ' . number_format($item->price) . ' Ks',
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'timestamp' => $item->created_at,
            ]);

        $recentFeedbacks = UserFeedback::with('user:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => 'fb-' . $item->id,
                'type' => 'feedback',
                'title' => 'Feedback [' . strtoupper($item->category) . ']: ' . ($item->user->name ?? 'User'),
                'subtitle' => substr($item->message, 0, 45) . '...',
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'timestamp' => $item->created_at,
            ]);

        $allActivities = $recentVerifications
            ->concat($recentLawyers)
            ->concat($recentProperties)
            ->concat($recentFeedbacks)
            ->sortByDesc('timestamp')
            ->values();

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $groupedActivities = [
            'today' => $allActivities->filter(fn ($a) => $a['timestamp']->isToday())->values(),
            'yesterday' => $allActivities->filter(fn ($a) => $a['timestamp']->isYesterday())->values(),
            'this_week' => $allActivities->filter(fn ($a) => $a['timestamp']->lt($yesterday) && $a['timestamp']->gt(Carbon::now()->subDays(7)))->values(),
        ];

        return Inertia::render('Dashboard', [
            'role' => 'admin',
            'adminMetrics' => [
                'totalProperties' => $totalProperties,
                'verifiedUsersTotal' => $verifiedUsersTotal,
                'verifiedOwnersCount' => $verifiedOwnersCount,
                'approvedLawyersCount' => $approvedLawyersCount,
                'totalPendingKYC' => $totalPendingKYC,
                'pendingOwnerKYC' => $pendingOwnerKYC,
                'pendingLawyerKYC' => $pendingLawyerKYC,
                'totalSearches' => SearchLog::count(),
            ],
            'trendData' => $trendData,
            'trendRange' => $trendRange,
            'marketDemand' => [
                'topTownships' => $topTownships,
                'topDimensions' => $topDimensions,
                'topFloors' => $topFloors,
            ],
            'activityFeed' => $groupedActivities,
        ]);
    }

    protected function ownerDashboard(Request $request, User $user): Response
    {
        $properties = Property::where('owner_id', $user->id)->latest()->take(6)->get();

        return Inertia::render('Dashboard', [
            'role' => 'owner',
            'ownerMetrics' => [
                'total' => Property::where('owner_id', $user->id)->count(),
                'available' => Property::where('owner_id', $user->id)->where('status', 'available')->count(),
                'rented' => Property::where('owner_id', $user->id)->where('status', 'rented')->count(),
            ],
            'myProperties' => $properties,
        ]);
    }

    protected function seekerDashboard(Request $request, User $user): Response
    {
        $featuredProperties = Property::where('status', 'available')->latest()->take(6)->get();
        $verifiedLawyers = LawyerProfile::with('user:id,name,phone,avatar')->where('status', 'approved')->take(3)->get();

        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'featuredProperties' => $featuredProperties,
            'verifiedLawyers' => $verifiedLawyers,
        ]);
    }
}
