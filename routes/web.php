<?php

use App\Http\Controllers\Admin\AdminLawyerController;
use App\Http\Controllers\Admin\AdminSecondaryVerificationController;
use App\Http\Controllers\Admin\AdminTransactionController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\LawyerDirectoryController;
use App\Http\Controllers\LawyerInquiryController;
use App\Http\Controllers\LawyerVerificationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OwnerPropertyController;
use App\Http\Controllers\OwnerVerificationController;
use App\Http\Controllers\OwnerViewingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ViewingMessageController;
use App\Http\Controllers\ViewingRequestController;
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

    // Viewing Requests (Seeker flow & Chat)
    Route::post('/properties/{slug}/viewing', [ViewingRequestController::class, 'store'])->name('viewing.store');
    Route::get('/my-viewings', [ViewingRequestController::class, 'seekerIndex'])->name('my-viewings.index');
    Route::post('/viewings/{viewingRequest}/accept-reschedule', [ViewingRequestController::class, 'acceptReschedule'])->name('viewing.accept-reschedule');
    Route::post('/viewings/{viewingRequest}/cancel', [ViewingRequestController::class, 'cancel'])->name('viewing.cancel');

    // Direct P2P Messaging per Viewing Request
    Route::get('/viewings/{viewingRequest}', [ViewingMessageController::class, 'show'])->name('viewing.show');
    Route::post('/viewings/{viewingRequest}/messages', [ViewingMessageController::class, 'store'])->name('viewing.messages.store');

    // Lawyer Inquiries (Client Flow)
    Route::post('/lawyers/{lawyerProfile}/inquiries', [LawyerInquiryController::class, 'store'])->name('lawyer.inquiries.store');
    Route::get('/my-legal-inquiries', [LawyerInquiryController::class, 'clientIndex'])->name('my-legal-inquiries.index');

    // Owner Property & Viewing Management (Guarded by verified owner)
    Route::prefix('owner')->name('owner.')->middleware('verified.owner')->group(function () {
        Route::get('/properties', [OwnerPropertyController::class, 'index'])->name('properties.index');
        Route::get('/properties/create', [OwnerPropertyController::class, 'create'])->name('properties.create');
        Route::post('/properties', [OwnerPropertyController::class, 'store'])->name('properties.store');

        Route::get('/viewings', [OwnerViewingController::class, 'index'])->name('viewings.index');
        Route::post('/viewings/{viewingRequest}/accept', [OwnerViewingController::class, 'accept'])->name('viewings.accept');
        Route::post('/viewings/{viewingRequest}/reschedule', [OwnerViewingController::class, 'reschedule'])->name('viewings.reschedule');
        Route::post('/viewings/{viewingRequest}/complete', [OwnerViewingController::class, 'complete'])->name('viewings.complete');
        Route::post('/viewings/{viewingRequest}/reject', [OwnerViewingController::class, 'reject'])->name('viewings.reject');
    });

    // Lawyer Inquiries Workspace (Guarded by lawyer role)
    Route::prefix('lawyer')->name('lawyer.')->middleware('role:lawyer')->group(function () {
        Route::get('/inquiries', [LawyerInquiryController::class, 'lawyerIndex'])->name('inquiries.index');
        Route::post('/inquiries/{inquiry}/accept', [LawyerInquiryController::class, 'accept'])->name('inquiries.accept');
        Route::post('/inquiries/{inquiry}/complete', [LawyerInquiryController::class, 'complete'])->name('inquiries.complete');
        Route::post('/inquiries/{inquiry}/reject', [LawyerInquiryController::class, 'reject'])->name('inquiries.reject');
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

    // Platform Transactions & Audits
    Route::get('/transactions', [AdminTransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/auth.php';
