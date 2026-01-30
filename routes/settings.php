<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\Settings\SignatoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/appearance');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('settings/appearance', [App\Http\Controllers\Settings\SystemSettingController::class, 'edit'])->name('appearance.edit');
    Route::post('settings/appearance', [App\Http\Controllers\Settings\SystemSettingController::class, 'update'])->name('appearance.update');
});
