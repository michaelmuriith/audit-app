<?php

use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingMinuteController;
use App\Http\Controllers\MeetingRsvpController;
use Illuminate\Support\Facades\Route;

Route::get('meetings/{meeting}/rsvp', [MeetingRsvpController::class, 'show'])->name('meetings.rsvp');
Route::post('meetings/{meeting}/rsvp', [MeetingRsvpController::class, 'store'])->name('meetings.rsvp.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/', 'dashboard')->name('dashboard');

    Route::inertia('coming-soon', 'coming-soon')->name('coming-soon');

    Route::prefix('audit-planning')->name('audit-planning.')->group(function () {
        Route::inertia('strategic-plan', 'audit-planning/strategic-plan')->name('strategic-plan');
        Route::inertia('risk-assessment', 'audit-planning/risk-assessment')->name('risk-assessment');

        Route::get('meetings/minutes', [MeetingMinuteController::class, 'index'])->name('meetings.minutes.index');
        Route::resource('meetings', MeetingController::class);
        Route::get('meetings/{meeting}/minutes', [MeetingMinuteController::class, 'show'])->name('meetings.minutes.show');
        Route::get('meetings/{meeting}/minutes/export', [MeetingMinuteController::class, 'export'])->name('meetings.minutes.export');
        Route::post('meetings/minutes', [MeetingMinuteController::class, 'store'])->name('meetings.minutes.store');
        Route::post('meeting-minutes/{minute}/review', [MeetingMinuteController::class, 'review'])->name('meetings.minutes.review');

        Route::inertia('annual-plan', 'audit-planning/annual-plan')->name('annual-plan');
    });

    Route::prefix('audit-execution')->name('audit-execution.')->group(function () {
        Route::inertia('engagement', 'audit-execution/engagement')->name('engagement');
        Route::inertia('questionnaire', 'audit-execution/questionnaire')->name('questionnaire');
        Route::inertia('programme', 'audit-execution/programme')->name('programme');
    });

    Route::prefix('audit-reporting')->name('audit-reporting.')->group(function () {
        Route::inertia('findings', 'audit-reporting/findings')->name('findings');
        Route::inertia('draft-report', 'audit-reporting/draft-report')->name('draft-report');
    });

    Route::prefix('issue-management')->name('issue-management.')->group(function () {
        Route::inertia('action-plans', 'issue-management/action-plans')->name('action-plans');
        Route::inertia('follow-up', 'issue-management/follow-up')->name('follow-up');
    });
});

require __DIR__.'/settings.php';
