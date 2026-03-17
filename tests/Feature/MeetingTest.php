<?php

use App\Mail\MeetingInvite;
use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Support\Facades\Mail;
use Mockery\MockInterface;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Mock GoogleCalendarService globally to avoid credentials check
    $this->mock(GoogleCalendarService::class, function (MockInterface $mock) {
        $mock->shouldReceive('createEvent')->byDefault();
        $mock->shouldReceive('updateEvent')->byDefault();
        $mock->shouldReceive('deleteEvent')->byDefault();
    });
});

test('can view meetings list', function () {
    Meeting::factory()->count(3)->create(['user_id' => $this->user->id]);

    $this->get(route('audit-planning.meetings.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('meetings/index')
            ->has('meetings.data', 3)
        );
});

test('can create a meeting', function () {
    Mail::fake();

    $this->mock(GoogleCalendarService::class, function (MockInterface $mock) {
        $event = Mockery::mock('Google\Service\Calendar\Event');
        $event->shouldReceive('getId')->andReturn('google-event-id');
        $event->id = 'google-event-id';
        $event->htmlLink = 'https://meet.google.com/abc-def-ghi';
        $event->shouldReceive('getHangoutLink')->andReturn('https://meet.google.com/abc-def-ghi');

        $mock->shouldReceive('createEvent')->once()->andReturn($event);
    });

    $data = [
        'title' => 'Test Meeting',
        'agenda' => 'Test Agenda',
        'start_time' => now()->addDay()->toIso8601String(),
        'end_time' => now()->addDay()->addHour()->toIso8601String(),
        'attendees' => ['attendee1@example.com', 'attendee2@example.com'],
        'location' => 'Board Room',
    ];

    $response = $this->post(route('audit-planning.meetings.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('meetings', [
        'title' => 'Test Meeting',
        'google_event_id' => 'google-event-id',
    ]);

    $this->assertDatabaseCount('meeting_attendees', 2);
    Mail::assertQueued(MeetingInvite::class, 2);
});

test('can save meeting minutes as draft', function () {
    $meeting = Meeting::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'meeting_id' => $meeting->id,
        'content' => ['ops' => [['insert' => 'Meeting notes here']]],
        'status' => 'draft',
        'notes' => 'Internal draft notes',
    ];

    $this->post(route('audit-planning.meetings.minutes.store'), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('meeting_minutes', [
        'meeting_id' => $meeting->id,
        'status' => 'draft',
    ]);
});

test('can submit and approve meeting minutes', function () {
    Mail::fake();
    $meeting = Meeting::factory()->has(App\Models\MeetingAttendee::factory()->count(2), 'attendees')->create(['user_id' => $this->user->id]);
    $minute = MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'content' => ['some' => 'content'],
        'status' => 'submitted',
    ]);

    // Test Submission notification (if store is used to submit)
    $this->post(route('audit-planning.meetings.minutes.store'), [
        'meeting_id' => $meeting->id,
        'content' => ['some' => 'content'],
        'status' => 'submitted',
    ])->assertRedirect();

    Mail::assertQueued(App\Mail\MinutesSubmitted::class);

    // Test Approval notification
    $this->post(route('audit-planning.meetings.minutes.review', $minute), [
        'status' => 'approved',
        'comment' => 'Looks good',
    ])->assertRedirect();

    $this->assertDatabaseHas('meeting_minutes', [
        'id' => $minute->id,
        'status' => 'approved',
        'approved_by' => $this->user->id,
    ]);

    $this->assertEquals('approved', $meeting->fresh()->status);
    Mail::assertQueued(App\Mail\MinutesApproved::class, 2);
});

test('can update a meeting without google_event_id and it syncs', function () {
    $meeting = Meeting::factory()->create([
        'user_id' => $this->user->id,
        'google_event_id' => null,
    ]);

    $this->mock(GoogleCalendarService::class, function (MockInterface $mock) {
        $event = Mockery::mock('Google\Service\Calendar\Event');
        $event->id = 'new-google-event-id';
        $event->shouldReceive('getHangoutLink')->andReturn('https://meet.google.com/new-link');

        $mock->shouldReceive('createEvent')->once()->andReturn($event);
        $mock->shouldNotReceive('updateEvent');
    });

    $data = [
        'title' => 'Updated Title',
        'start_time' => now()->addDays(2)->toIso8601String(),
    ];

    $response = $this->put(route('audit-planning.meetings.update', $meeting), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('meetings', [
        'id' => $meeting->id,
        'title' => 'Updated Title',
        'google_event_id' => 'new-google-event-id',
        'status' => 'rescheduled',
    ]);
});
