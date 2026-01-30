<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoteLogController extends Controller
{
    public function index()
    {
        $voters = Voter::with(['votes.candidate.candidatePhotos', 'votes.position'])
            ->whereHas('votes') // Only show voters who have voted
            ->latest()
            ->limit(50) // Limit to 50 for performance
            ->get();

        $positions = Position::orderBy('id')->get();

        return Inertia::render('VoteLog/Index', [
            'voters' => $voters,
            'positions' => $positions
        ]);
    }
}
