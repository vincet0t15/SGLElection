<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoteLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $logs = \App\Models\VoteActivityLog::with('voter')
            ->when($search, function ($query, $search) {
                $query->whereHas('voter', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('VoteLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }
}
