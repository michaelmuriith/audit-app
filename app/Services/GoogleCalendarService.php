<?php

namespace App\Services;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    protected Client $client;

    protected Calendar $service;

    public function __construct()
    {
        $this->client = new Client;
        $this->client->setAuthConfig(storage_path('app/google-calendar/credentials.json'));
        $this->client->addScope(Calendar::CALENDAR);
        $this->client->setAccessType('offline');

        // If we are using a Service Account, we might need to impersonate a user
        if ($owner = config('services.google.calendar_owner')) {
            $this->client->setSubject($owner);
        }

        $this->service = new Calendar($this->client);
    }

    /**
     * Create a Google Calendar event with a Meet link.
     */
    public function createEvent(array $data): ?Event
    {
        try {
            $eventData = [
                'summary' => $data['title'],
                'location' => $data['location'] ?? '',
                'description' => $data['agenda'] ?? '',
                'start' => [
                    'dateTime' => Carbon::parse($data['start_time'])->toIso8601String(),
                    'timeZone' => config('app.timezone'),
                ],
                'end' => [
                    'dateTime' => Carbon::parse($data['end_time'])->toIso8601String(),
                    'timeZone' => config('app.timezone'),
                ],
            ];

            if ($this->calendarSupportsMeet()) {
                $eventData['conferenceData'] = new ConferenceData([
                    'createRequest' => new CreateConferenceRequest([
                        'requestId' => uniqid(),
                        'conferenceSolutionKey' => new ConferenceSolutionKey([
                            'type' => 'hangoutsMeet',
                        ]),
                    ]),
                ]);
            }

            $event = new Event($eventData);

            $calendarId = 'primary';

            return $this->service->events->insert($calendarId, $event, ['conferenceDataVersion' => 1]);
        } catch (\Exception $e) {
            Log::error('Google Calendar Create Event Error: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Check if the primary calendar supports Google Meet conferences.
     */
    protected function calendarSupportsMeet(): bool
    {
        try {
            $calendar = $this->service->calendars->get('primary');
            $conferenceProperties = $calendar->getConferenceProperties();

            if (! $conferenceProperties) {
                return false;
            }

            $allowedTypes = $conferenceProperties->getAllowedConferenceSolutionTypes();

            return in_array('hangoutsMeet', $allowedTypes ?: []);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Update an existing Google Calendar event.
     */
    public function updateEvent(string $eventId, array $data): ?Event
    {
        try {
            $event = $this->service->events->get('primary', $eventId);

            if (isset($data['title'])) {
                $event->setSummary($data['title']);
            }
            if (isset($data['agenda'])) {
                $event->setDescription($data['agenda']);
            }
            if (isset($data['location'])) {
                $event->setLocation($data['location']);
            }

            if (isset($data['start_time'])) {
                $event->setStart(['dateTime' => Carbon::parse($data['start_time'])->toIso8601String(), 'timeZone' => config('app.timezone')]);
            }
            if (isset($data['end_time'])) {
                $event->setEnd(['dateTime' => Carbon::parse($data['end_time'])->toIso8601String(), 'timeZone' => config('app.timezone')]);
            }

            return $this->service->events->update('primary', $eventId, $event);
        } catch (\Exception $e) {
            Log::error('Google Calendar Update Event Error: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Delete a Google Calendar event.
     */
    public function deleteEvent(string $eventId): bool
    {
        try {
            $this->service->events->delete('primary', $eventId);

            return true;
        } catch (\Exception $e) {
            Log::error('Google Calendar Delete Event Error: '.$e->getMessage());

            return false;
        }
    }
}
