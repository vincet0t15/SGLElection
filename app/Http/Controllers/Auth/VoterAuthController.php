<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VoterAuthController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/VoterLogin');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Add is_active check to credentials
        $credentials['is_active'] = true;

        if (Auth::guard('voter')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $voter = Auth::guard('voter')->user();

            // Additional check: Ensure voter hasn't already voted for any active event
            // This protects against scenarios where an admin might manually reactivate a user
            // but they shouldn't vote again for the same event.
            $activeEvents = Event::where('is_active', true)->get();
            foreach ($activeEvents as $event) {
                $hasVoted = Vote::where('voter_id', $voter->id)
                    ->where('event_id', $event->id)
                    ->exists();

                if ($hasVoted) {
                    Auth::guard('voter')->logout();
                    $request->session()->invalidate();
                    
                    throw ValidationException::withMessages([
                        'username' => 'You have already voted for the active election.',
                    ]);
                }
            }

            return redirect()->intended(route('vote.index'));
        }

        throw ValidationException::withMessages([
            'username' => 'These credentials do not match our records or your account is inactive.',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::guard('voter')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('voter.login');
    }
}
