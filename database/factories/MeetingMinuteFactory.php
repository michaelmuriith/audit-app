<?php

namespace Database\Factories;

use App\Models\Meeting;
use App\Models\MeetingMinute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MeetingMinute>
 */
class MeetingMinuteFactory extends Factory
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
            'content' => ['ops' => [['insert' => $this->faker->paragraph()]]],
            'status' => 'draft',
        ];
    }
}
