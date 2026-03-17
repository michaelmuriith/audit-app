<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\MeetingMinuteReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeetingMinuteController extends Controller
{
    public function index(Request $request): Response
    {
        $meetings = Meeting::query()
            ->with(['minutes', 'attendees.user'])
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->latest('start_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('meetings/minutes-index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Meeting $meeting): Response
    {
        return Inertia::render('meetings/minutes', [
            'meeting' => $meeting->load(['minutes.reviews.user', 'attendees.user']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'meeting_id' => 'required|exists:meetings,id',
            'content' => 'required',
            'status' => 'required|in:draft,submitted',
            'notes' => 'nullable|string',
            'decisions' => 'nullable|string',
            'action_items' => 'nullable|string',
        ]);

        $minute = MeetingMinute::updateOrCreate(
            ['meeting_id' => $request->meeting_id],
            $request->only(['content', 'status', 'notes', 'decisions', 'action_items'])
        );

        if ($request->status === 'submitted') {
            // Logic to notify reviewers
        }

        return redirect()->back()->with('success', 'Minutes saved successfully.');
    }

    public function review(Request $request, MeetingMinute $minute)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'comment' => 'nullable|string',
        ]);

        MeetingMinuteReview::create([
            'meeting_minute_id' => $minute->id,
            'user_id' => Auth::id(),
            'status' => $request->status,
            'comment' => $request->comment,
        ]);

        if ($request->status === 'approved') {
            // Check if all required reviewers have approved
            // For now, single approval marks it as approved
            $minute->update([
                'status' => 'approved',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
            ]);

            $minute->meeting->update(['status' => 'approved']);
        } else {
            $minute->update(['status' => 'draft']);
        }

        return redirect()->back()->with('success', 'Review submitted.');
    }
}
