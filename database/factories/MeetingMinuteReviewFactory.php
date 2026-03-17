<?php

namespace Database\Factories;

use App\Models\MeetingMinute;
use App\Models\MeetingMinuteReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MeetingMinuteReview>
 */
class MeetingMinuteReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meeting_minute_id' => MeetingMinute::factory(),
            'user_id' => User::factory(),
            'status' => 'approved',
            'comment' => $this->faker->sentence(),
        ];
    }
}
