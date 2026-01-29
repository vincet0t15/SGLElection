<?php

use App\Http\Controllers\CandidateController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\YearLevelController;
use App\Http\Controllers\YearSectionController;
use App\Http\Middleware\RedirectVoter;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified', RedirectVoter::class])->name('dashboard');
Route::middleware(['auth', 'verified'])->group(function () {
    // VOTE
    Route::get('vote', [VoteController::class, 'index'])->name('vote.index');
    Route::post('vote', [VoteController::class, 'store'])->name('vote.store');

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

    // CANDIDATE
    Route::get('candidate', [CandidateController::class, 'index'])->name('candidate.index');
    Route::get('candidate/create', [CandidateController::class, 'create'])->name('candidate.create');
    Route::post('candidate', [CandidateController::class, 'store'])->name('candidate.store');
    Route::get('candidate/{candidate}/edit', [CandidateController::class, 'edit'])->name('candidate.edit');
    Route::post('candidate/{candidate}', [CandidateController::class, 'update'])->name('candidate.update');
    Route::delete('candidate/{candidate}', [CandidateController::class, 'destroy'])->name('candidate.destroy');
});


require __DIR__ . '/settings.php';
