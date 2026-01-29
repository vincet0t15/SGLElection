<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeEvent = Event::where('is_active', true)->first();
        
        $stats = [
            'total_voters' => Voter::count(),
            'total_candidates' => Candidate::count(),
            'total_positions' => \App\Models\Position::count(),
            'active_event' => $activeEvent,
            'votes_cast' => 0,
            'turnout_percentage' => 0,
        ];

        if ($activeEvent) {
            $votesCast = Vote::where('event_id', $activeEvent->id)
                ->distinct('voter_id')
                ->count('voter_id');
                
            $stats['votes_cast'] = $votesCast;
            
            // Calculate turnout based on total voters (or voters assigned to event if applicable)
            // Assuming global voter pool for now based on simplicity
            if ($stats['total_voters'] > 0) {
                $stats['turnout_percentage'] = round(($votesCast / $stats['total_voters']) * 100, 1);
            }
        }

        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
}
