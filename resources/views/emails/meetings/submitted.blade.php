<x-mail::message>
# Minutes Submitted: {{ $meeting->title }}

The minutes for the meeting held on {{ \Carbon\Carbon::parse($meeting->start_time)->format('M d, Y') }} have been submitted for review.

**Key Decisions:**
{{ $meeting->minutes->decisions }}

**Action Items:**
{{ $meeting->minutes->action_items }}

<x-mail::button :url="route('meetings.rsvp', $meeting)" color="green">
RSVP to this Meeting
</x-mail::button>

<x-mail::button :url="config('app.url') . '/meetings/' . $meeting->id . '/minutes'">
Review Minutes
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
