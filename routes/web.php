<?php

use App\Http\Controllers\Auth\VoterAuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\YearLevelController;
use App\Http\Controllers\YearSectionController;
use App\Http\Middleware\EnsureVoterIsActive;
use App\Http\Middleware\RedirectVoter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Auth::guard('web')->check()) {
        return redirect()->route('dashboard');
    }
    if (Auth::guard('voter')->check()) {
        return redirect()->route('vote.index');
    }
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PartylistController;
use App\Http\Controllers\VoteLogController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\Settings\SignatoryController;
use App\Http\Controllers\VoterController;

// Admin Routes
Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('vote-logs', [VoteLogController::class, 'index'])->name('vote-logs');
    Route::get('results', [ResultController::class, 'index'])->name('results.index');
    Route::get('results/{event}/print', [ResultController::class, 'exportPdf'])->name('results.print');
    Route::get('results/{event}/download-pdf', [ResultController::class, 'downloadPdf'])->name('results.download-pdf');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/{event}', [ReportController::class, 'show'])->name('reports.show');
    Route::get('reports/analytics/{event}', [ReportController::class, 'analytics'])->name('reports.analytics');
    Route::get('reports/audit/{event}', [ReportController::class, 'audit'])->name('reports.audit');
    Route::get('reports/audit/print/{event}', [ReportController::class, 'printAudit'])->name('reports.audit.print');
    Route::get('reports/live/{event}', [ReportController::class, 'live'])->name('reports.live');
    Route::get('reports/print/{event}', [ReportController::class, 'print'])->name('reports.print');
    Route::get('reports/print-pdf/{event}', [ReportController::class, 'exportPrintPdf'])->name('reports.print-pdf');
    Route::get('reports/comelec/{event}', [ReportController::class, 'generateComelecForm'])->name('reports.comelec');
    Route::post('reports/{event}/resolve-tie', [ReportController::class, 'resolveTie'])->name('reports.resolve-tie');
    Route::get('reports/{event}/voters/{voter}/votes', [ReportController::class, 'getVoterVotes'])->name('reports.voter-votes');
    Route::get('reports/{event}/voters/{voter}/receipt', [ReportController::class, 'exportVoterReceipt'])->name('reports.voter-receipt');

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
    Route::get('archives', [EventController::class, 'archives'])->name('archives.index');
    Route::post('event', [EventController::class, 'store'])->name('event.store');
    Route::put('event/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');
    Route::put('event/{event}/toggle-show-winner', [EventController::class, 'toggleShowWinner'])->name('event.toggle-show-winner');
    Route::put('event/{event}/toggle-archive', [EventController::class, 'toggleArchive'])->name('event.toggle-archive');

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
    Route::post('candidate/import', [CandidateController::class, 'import'])->name('candidate.import');
    Route::get('candidate/template', [CandidateController::class, 'template'])->name('candidate.template');
    Route::post('candidate', [CandidateController::class, 'store'])->name('candidate.store');
    Route::get('candidate/{candidate}/edit', [CandidateController::class, 'edit'])->name('candidate.edit');
    Route::post('candidate/{candidate}', [CandidateController::class, 'update'])->name('candidate.update');
    Route::delete('candidate/{candidate}', [CandidateController::class, 'destroy'])->name('candidate.destroy');

    // VOTER
    Route::get('voter', [VoterController::class, 'index'])->name('voter.index');
    Route::get('voter/search', [VoterController::class, 'search'])->name('voter.search');
    Route::get('voter/import', [VoterController::class, 'importView'])->name('voter.import.view');
    Route::post('voter/import', [VoterController::class, 'import'])->name('voter.import');
    Route::get('voter/template', [VoterController::class, 'downloadTemplate'])->name('voter.template');
    Route::get('voter/export', [VoterController::class, 'export'])->name('voter.export');
    Route::get('voter/print', [VoterController::class, 'print'])->name('voter.print');
    Route::get('voter/print-cards', [VoterController::class, 'printCards'])->name('voter.print-cards');
    Route::post('voter/activate-all', [VoterController::class, 'activateAll'])->name('voter.activate-all');
    Route::post('voter/bulk-status', [VoterController::class, 'bulkStatus'])->name('voter.bulk-status');
    Route::post('voter/bulk-destroy', [VoterController::class, 'bulkDestroy'])->name('voter.bulk-destroy');
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

    Route::middleware(['auth:voter', EnsureVoterIsActive::class])->group(function () {
        Route::post('logout', [VoterAuthController::class, 'destroy'])->name('voter.logout');

        // VOTE
        Route::get('vote', [VoteController::class, 'index'])->name('vote.index');
        Route::post('vote', [VoteController::class, 'store'])->name('vote.store');
        Route::get('vote/receipt', [VoteController::class, 'receipt'])->name('vote.receipt');
    });
});


require __DIR__ . '/settings.php';
