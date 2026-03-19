<x-mail::message>
# Minutes Approved: {{ $meeting->title }}

The minutes for the meeting held on {{ $meeting->start_time->format('M d, Y') }} have been approved.

You can view the final minutes and action items on the platform.

<x-mail::button :url="route('meetings.rsvp', $meeting)" color="green">
RSVP to this Meeting
</x-mail::button>

<x-mail::button :url="config('app.url') . '/meetings/' . $meeting->id . '/minutes'">
View Minutes
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
