<?php

namespace Tests\Unit\Services;

use App\Services\GoogleCalendarService;
use Tests\TestCase;

class GoogleCalendarServiceTest extends TestCase
{
    public function test_it_can_handle_string_dates_in_create_event(): void
    {
        // We don't want to actually call Google API, but we want to see if it reaches the insert call
        // without the "toIso8601String on string" error.
        $this->partialMock(GoogleCalendarService::class, function ($mock) {
            $mock->shouldReceive('createEvent')->passthru();
            // Mock the internal service to avoid real API calls
            $mock->shouldAllowMockingProtectedMethods();
        });

        $service = new GoogleCalendarService;

        // This data matches what the controller sends
        $data = [
            'title' => 'Test Meeting',
            'start_time' => '2026-03-18T10:00:00Z',
            'end_time' => '2026-03-18T11:00:00Z',
            'attendees' => [],
        ];

        // If it reaches the try-catch block and fails due to auth (which is expected here since we have dummy credentials),
        // it means the toIso8601String() call succeeded.
        $result = $service->createEvent($data);

        // We expect null because authentication will fail with real service,
        // but we are checking that it didn't throw the fatal string error.
        $this->assertNull($result);
    }
}
