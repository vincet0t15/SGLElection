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

        $voters = Voter::with(['votes.candidate.candidatePhotos', 'votes.position'])
            ->whereHas('votes') // Only show voters who have voted
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $positions = Position::orderBy('id')->get();

        return Inertia::render('VoteLog/Index', [
            'voters' => $voters,
            'positions' => $positions,
            'filters' => $request->only(['search']),
        ]);
    }
}
