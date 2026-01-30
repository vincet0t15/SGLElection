<?php

use App\Http\Controllers\Auth\VoterAuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\YearLevelController;
use App\Http\Controllers\YearSectionController;
use App\Http\Middleware\RedirectVoter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Auth::guard('web')->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PartylistController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\Settings\SignatoryController;
use App\Http\Controllers\VoterController;

// Admin Routes
Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('results', [ResultController::class, 'index'])->name('results.index');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/{event}', [ReportController::class, 'show'])->name('reports.show');
    Route::get('reports/print/{event}', [ReportController::class, 'print'])->name('reports.print');

    // YearLevel
    Route::get('year-level', [YearLevelController::class, 'index'])->name('year-level.index');
    Route::post('year-level', [YearLevelController::class, 'store'])->name('year-level.store');
    Route::put('year-level/{yearLevel}', [YearLevelController::class, 'update'])->name('year-level.update');
    Route::delete('year-level/{yearLevel}', [YearLevelController::class, 'destroy'])->name('year-level.destroy');

    // SECTION
    Route::get('year-section', [YearSectionController::class, 'index'])->name('year-section.index');
    Route::post('year-section', [YearSectionController::class, 'store'])->name('year-section.store');
    Route::put('year-section/{yearSection}', [YearSectionController::class, 'update'])->name('year-section.update');
    Route::delete('year-section/{yearSection}', [YearSectionController::class, 'destroy'])->name('year-section.destroy');

    // EVENT
    Route::get('event', [EventController::class, 'index'])->name('event.index');
    Route::post('event', [EventController::class, 'store'])->name('event.store');
    Route::put('event/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');

    // POSITION
    Route::get('position', [PositionController::class, 'index'])->name('position.index');
    Route::post('position', [PositionController::class, 'store'])->name('position.store');
    Route::put('position/{position}', [PositionController::class, 'update'])->name('position.update');
    Route::delete('position/{position}', [PositionController::class, 'destroy'])->name('position.destroy');

    // PARTYLIST
    Route::get('partylist', [PartylistController::class, 'index'])->name('partylist.index');
    Route::post('partylist', [PartylistController::class, 'store'])->name('partylist.store');
    Route::put('partylist/{partylist}', [PartylistController::class, 'update'])->name('partylist.update');
    Route::delete('partylist/{partylist}', [PartylistController::class, 'destroy'])->name('partylist.destroy');

    // CANDIDATE
    Route::get('candidate', [CandidateController::class, 'index'])->name('candidate.index');
    Route::get('candidate/create', [CandidateController::class, 'create'])->name('candidate.create');
    Route::post('candidate', [CandidateController::class, 'store'])->name('candidate.store');
    Route::get('candidate/{candidate}/edit', [CandidateController::class, 'edit'])->name('candidate.edit');
    Route::post('candidate/{candidate}', [CandidateController::class, 'update'])->name('candidate.update');
    Route::delete('candidate/{candidate}', [CandidateController::class, 'destroy'])->name('candidate.destroy');


    // VOTER
    Route::get('voter', [VoterController::class, 'index'])->name('voter.index');
    Route::get('voter/import', [VoterController::class, 'importView'])->name('voter.import.view');
    Route::post('voter/import', [VoterController::class, 'import'])->name('voter.import');
    Route::get('voter/export', [VoterController::class, 'export'])->name('voter.export');
    Route::get('voter/print', [VoterController::class, 'print'])->name('voter.print');
    Route::post('voter/bulk-status', [VoterController::class, 'bulkStatus'])->name('voter.bulk-status');
    Route::get('voter/create', [VoterController::class, 'create'])->name('voter.create');
    Route::post('voter', [VoterController::class, 'store'])->name('voter.store');
    Route::get('voter/{voter}/edit', [VoterController::class, 'edit'])->name('voter.edit');
    Route::put('voter/{voter}', [VoterController::class, 'update'])->name('voter.update');
    Route::patch('voter/{voter}/toggle-status', [VoterController::class, 'toggleStatus'])->name('voter.toggle-status');
    Route::delete('voter/{voter}', [VoterController::class, 'destroy'])->name('voter.destroy');


    // Signatories
    Route::get('signatories', [SignatoryController::class, 'index'])->name('signatories.index');
    Route::post('signatories', [SignatoryController::class, 'store'])->name('signatories.store');
    Route::put('signatories/{signatory}', [SignatoryController::class, 'update'])->name('signatories.update');
    Route::delete('signatories/{signatory}', [SignatoryController::class, 'destroy'])->name('signatories.destroy');
});

// Voter Routes
Route::prefix('voter')->group(function () {
    Route::middleware('guest:voter')->group(function () {
        Route::get('login', [VoterAuthController::class, 'create'])->name('voter.login');
        Route::post('login', [VoterAuthController::class, 'store']);
    });

    Route::middleware('auth:voter')->group(function () {
        Route::post('logout', [VoterAuthController::class, 'destroy'])->name('voter.logout');

        // VOTE
        Route::get('vote', [VoteController::class, 'index'])->name('vote.index');
        Route::post('vote', [VoteController::class, 'store'])->name('vote.store');
    });
});


require __DIR__ . '/settings.php';
