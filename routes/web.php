<?php

use App\Http\Controllers\Admin\AdminLawyerController;
use App\Http\Controllers\Admin\AdminSecondaryVerificationController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\LawyerDirectoryController;
use App\Http\Controllers\LawyerVerificationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OwnerPropertyController;
use App\Http\Controllers\OwnerVerificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// Public Landing Page & Marketplaces
Route::get('/', function () {
    return redirect()->route('properties.index');
});

Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{slug}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/lawyers', [LawyerDirectoryController::class, 'index'])->name('lawyers.index');

// Main Authenticated Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'admin.secondary'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // User profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Secondary Password Update
    Route::post('/admin/secondary-password', [AdminSecondaryVerificationController::class, 'update'])
        ->name('admin.secondary-password.update');

    // Owner KYC Verification (Seeker -> Verified Owner upgrade flow)
    Route::get('/owner-verification', [OwnerVerificationController::class, 'index'])->name('owner.verification.index');
    Route::post('/owner-verification', [OwnerVerificationController::class, 'store'])->name('owner.verification.store');

    // Lawyer Credential Verification (Application)
    Route::get('/lawyer-verification', [LawyerVerificationController::class, 'index'])->name('lawyer.verification.index');
    Route::post('/lawyer-verification', [LawyerVerificationController::class, 'store'])->name('lawyer.verification.store');

    // User Feedback
    Route::post('/feedbacks', [FeedbackController::class, 'store'])->name('feedbacks.store');

    // Notifications
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');

    // Owner Property Management (Guarded by verified owner)
    Route::prefix('owner')->name('owner.')->middleware('verified.owner')->group(function () {
        Route::get('/properties', [OwnerPropertyController::class, 'index'])->name('properties.index');
        Route::get('/properties/create', [OwnerPropertyController::class, 'create'])->name('properties.create');
        Route::post('/properties', [OwnerPropertyController::class, 'store'])->name('properties.store');
    });
});

// Admin Secondary Password Gate (Must be accessible before session verification)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/verify-secondary', [AdminSecondaryVerificationController::class, 'show'])->name('verify-secondary.show');
    Route::post('/verify-secondary', [AdminSecondaryVerificationController::class, 'verify'])->name('verify-secondary.verify');
});

// Admin Only Governance Routes (Protected by role AND secondary password)
Route::middleware(['auth', 'role:admin', 'admin.secondary'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/block', [AdminUserController::class, 'block'])->name('users.block');
    Route::post('/users/{user}/unblock', [AdminUserController::class, 'unblock'])->name('users.unblock');

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
