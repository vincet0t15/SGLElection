<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class OnlineVoterController extends Controller
{
    public function index()
    {
        $onlineVoters = DB::table('sessions')
            ->join('voters', 'sessions.voter_id', '=', 'voters.id')
            ->select(
                'sessions.id as session_id',
                'sessions.last_activity',
                'sessions.ip_address',
                'sessions.user_agent',
                'voters.id as voter_id',
                'voters.name',
                'voters.username',
                'voters.lrn_number'
            )
            ->whereNotNull('sessions.voter_id')
            ->orderBy('sessions.last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                $session->last_activity_human = Carbon::createFromTimestamp($session->last_activity)->diffForHumans();
                return $session;
            });

        return Inertia::render('Voter/Online', [
            'onlineVoters' => $onlineVoters
        ]);
    }

    public function destroy($sessionId)
    {
        DB::table('sessions')->where('id', $sessionId)->delete();

        return back()->with('success', 'Voter has been logged out successfully.');
    }
}
