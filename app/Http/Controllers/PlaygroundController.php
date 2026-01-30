<?php

namespace App\Http\Controllers;

use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaygroundController extends Controller
{
    public function index()
    {
        $voters = Voter::with(['votes.candidate', 'votes.position'])
            ->whereHas('votes') // Only show voters who have voted
            ->latest()
            ->limit(50) // Limit to 50 for playground
            ->get();

        return Inertia::render('Playground/Index', [
            'voters' => $voters
        ]);
    }
}
