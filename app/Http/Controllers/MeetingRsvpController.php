<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingAttendee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRsvpController extends Controller
{
    public function show(Meeting $meeting): Response
    {
        return Inertia::render('meetings/rsvp', [
            'meeting' => $meeting->load('user'),
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'rsvp_status' => 'required|in:present,apologies',
        ]);

        MeetingAttendee::updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'email' => $request->email,
            ],
            [
                'name' => $request->name,
                'designation' => $request->designation,
                'department' => $request->department,
                'rsvp_status' => $request->rsvp_status,
            ]
        );

        return redirect()->back()->with('success', 'Your RSVP has been recorded.');
    }
}
