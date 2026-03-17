<?php

namespace Database\Factories;

use App\Models\Meeting;
use App\Models\MeetingAttendee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MeetingAttendee>
 */
class MeetingAttendeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'email' => $this->faker->unique()->safeEmail(),
            'rsvp_status' => 'needsAction',
        ];
    }
}
