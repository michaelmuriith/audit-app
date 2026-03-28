<?php

namespace Database\Factories;

use App\Models\AuditEngagement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditEngagement>
 */
class AuditEngagementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'engagement_id' => $this->faker->unique()->regexify('[A-Z]{2}-[0-9]{2}-[0-9]{3}'),
            'name' => $this->faker->sentence(3),
            'department' => $this->faker->word(),
            'start_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'end_date' => $this->faker->dateTimeBetween('+1 year', '+2 years'),
            'status' => $this->faker->randomElement(['Not Started', 'Assigned', 'Planning', 'In Progress', 'Completed']),
            'fiscal_year' => 2024,
        ];
    }
}
