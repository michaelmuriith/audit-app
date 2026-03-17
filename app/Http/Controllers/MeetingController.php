<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Mail\MeetingInvite;
use App\Models\Meeting;
use App\Models\MeetingAttendee;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function __construct(protected GoogleCalendarService $googleCalendar) {}

    public function index(Request $request): Response
    {
        $meetings = Meeting::query()
            ->with(['attendees', 'user'])
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->date, fn ($q, $date) => $q->whereDate('start_time', $date))
            ->latest('start_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'status', 'date']),
        ]);
    }

    public function store(StoreMeetingRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        // Create Google Event
        $googleEvent = $this->googleCalendar->createEvent($data);

        if ($googleEvent) {
            $data['google_event_id'] = $googleEvent->id;
            $data['google_meet_link'] = $googleEvent->getHangoutLink();
        }

        $meeting = Meeting::create($data);

        // Add Attendees
        foreach ($data['attendees'] as $email) {
            MeetingAttendee::create([
                'meeting_id' => $meeting->id,
                'email' => $email,
                // Optionally link to existing user if found
                'user_id' => User::where('email', $email)->first()?->id,
            ]);

            // Send Custom Email
            Mail::to($email)->queue(new MeetingInvite($meeting));
        }

        return redirect()->back()->with('success', 'Meeting created and invites sent.');
    }

    public function update(UpdateMeetingRequest $request, Meeting $meeting)
    {
        $data = $request->validated();

        // Sync with Google Calendar if relevant fields changed
        if (isset($data['start_time']) || isset($data['title']) || isset($data['attendees'])) {
            if ($meeting->google_event_id) {
                $this->googleCalendar->updateEvent($meeting->google_event_id, $data);
            } else {
                // Combine existing meeting data with updated data to ensure event is complete
                $eventData = array_merge([
                    'title' => $meeting->title,
                    'agenda' => $meeting->agenda,
                    'location' => $meeting->location,
                    'start_time' => $meeting->start_time,
                    'end_time' => $meeting->end_time,
                    'attendees' => $meeting->attendees->pluck('email')->toArray(),
                ], $data);

                $googleEvent = $this->googleCalendar->createEvent($eventData);

                if ($googleEvent) {
                    $data['google_event_id'] = $googleEvent->id;
                    $data['google_meet_link'] = $googleEvent->getHangoutLink();
                }
            }
            $data['status'] = 'rescheduled';
        }

        $meeting->update($data);

        // Update Attendees if provided
        if (isset($data['attendees'])) {
            $meeting->attendees()->delete();
            foreach ($data['attendees'] as $email) {
                MeetingAttendee::create([
                    'meeting_id' => $meeting->id,
                    'email' => $email,
                    'user_id' => User::where('email', $email)->first()?->id,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Meeting updated.');
    }

    public function destroy(Meeting $meeting)
    {
        if ($meeting->google_event_id) {
            $this->googleCalendar->deleteEvent($meeting->google_event_id);
        }

        $meeting->delete();

        return redirect()->back()->with('success', 'Meeting deleted.');
    }
}
