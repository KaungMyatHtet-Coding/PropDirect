<?php

namespace App\Http\Controllers;

use App\Models\LawyerProfile;
use App\Services\MyanmarFontService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LawyerDirectoryController extends Controller
{
    /**
     * Browse verified lawyers directory.
     */
    public function index(Request $request): Response
    {
        $township = $request->query('township', 'all');
        $type = $request->query('type', 'all');
        $rawSearch = $request->query('search', '');

        // Normalize Zawgyi search inputs if entered
        $search = MyanmarFontService::normalizeToUnicode($rawSearch);

        $query = LawyerProfile::with('user:id,name,email,phone,avatar,role')
            ->where('status', 'approved');

        if ($township !== 'all' && ! empty($township)) {
            $query->where('office_township', $township);
        }

        if (in_array($type, ['advocate', 'higher_grade_pleader'], true)) {
            $query->where('lawyer_type', $type);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('specialization', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%")
                  ->orWhere('office_township', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $lawyers = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Lawyers/Index', [
            'lawyers' => $lawyers,
            'filters' => [
                'township' => $township,
                'type' => $type,
                'search' => $rawSearch,
            ],
        ]);
    }
}
