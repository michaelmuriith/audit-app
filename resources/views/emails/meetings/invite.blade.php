<x-mail::message>
# Meeting Invitation: {{ $meeting->title }}

You have been invited to a meeting.

**Agenda:**
{{ $meeting->agenda }}

**Time:**
{{ \Carbon\Carbon::parse($meeting->start_time)->format('M d, Y h:i A') }} - 
{{ \Carbon\Carbon::parse($meeting->end_time)->format('h:i A') }}

@if($meeting->google_meet_link)
<x-mail::button :url="$meeting->google_meet_link">
Join Google Meet
</x-mail::button>
@endif

<x-mail::button :url="config('app.url') . '/meetings/' . $meeting->id">
View Meeting Details
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
