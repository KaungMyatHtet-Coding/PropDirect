<?php

use App\Http\Controllers\Admin\AdminLawyerController;
use App\Http\Controllers\Admin\AdminVerificationController;
use App\Http\Controllers\LawyerDirectoryController;
use App\Http\Controllers\LawyerVerificationController;
use App\Http\Controllers\OwnerPropertyController;
use App\Http\Controllers\OwnerVerificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing Page & Marketplaces
Route::get('/', function () {
    return redirect()->route('properties.index');
});

Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{slug}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/lawyers', [LawyerDirectoryController::class, 'index'])->name('lawyers.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // User profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Owner KYC Verification (Seeker -> Verified Owner upgrade flow)
    Route::get('/owner-verification', [OwnerVerificationController::class, 'index'])->name('owner.verification.index');
    Route::post('/owner-verification', [OwnerVerificationController::class, 'store'])->name('owner.verification.store');

    // Lawyer Credential Verification (Application)
    Route::get('/lawyer-verification', [LawyerVerificationController::class, 'index'])->name('lawyer.verification.index');
    Route::post('/lawyer-verification', [LawyerVerificationController::class, 'store'])->name('lawyer.verification.store');

    // Owner Property Management (Guarded by verified owner)
    Route::prefix('owner')->name('owner.')->middleware('verified.owner')->group(function () {
        Route::get('/properties', [OwnerPropertyController::class, 'index'])->name('properties.index');
        Route::get('/properties/create', [OwnerPropertyController::class, 'create'])->name('properties.create');
        Route::post('/properties', [OwnerPropertyController::class, 'store'])->name('properties.store');
    });
});

// Admin Only Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // KYC Verifications
    Route::get('/verifications', [AdminVerificationController::class, 'index'])->name('verifications.index');
    Route::post('/verifications/{verification}/approve', [AdminVerificationController::class, 'approve'])->name('verifications.approve');
    Route::post('/verifications/{verification}/reject', [AdminVerificationController::class, 'reject'])->name('verifications.reject');

    // Lawyer Verifications
    Route::get('/lawyers', [AdminLawyerController::class, 'index'])->name('lawyers.index');
    Route::post('/lawyers/{lawyerProfile}/approve', [AdminLawyerController::class, 'approve'])->name('lawyers.approve');
    Route::post('/lawyers/{lawyerProfile}/reject', [AdminLawyerController::class, 'reject'])->name('lawyers.reject');
});

require __DIR__.'/auth.php';
