<?php

use App\Models\Meeting;
use App\Models\MeetingAttendee;
use App\Models\MeetingMinute;
use App\Models\User;

test('authenticated user can export minutes', function () {
    $user = User::factory()->create();
    $meeting = Meeting::factory()->create([
        'user_id' => $user->id,
    ]);

    MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => 'approved',
        'content' => [
            'discussions' => [],
        ],
    ]);

    MeetingAttendee::create([
        'meeting_id' => $meeting->id,
        'email' => 'test@example.com',
        'name' => 'John Doe',
        'rsvp_status' => 'present',
    ]);

    $response = $this->actingAs($user)->get(route('audit-planning.meetings.minutes.export', $meeting->id));

    $response->assertStatus(200);
    $response->assertHeader('content-type', 'application/pdf');
});
