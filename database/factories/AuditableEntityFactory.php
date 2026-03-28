<?php

namespace Database\Factories;

use App\Models\AuditableEntity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditableEntity>
 */
class AuditableEntityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company().' Audit',
            'priority' => $this->faker->randomElement(['Critical', 'High', 'Medium', 'Low']),
            'status' => $this->faker->randomElement(['Draft', 'Approved']),
            'year1_planned' => $this->faker->boolean(),
            'year2_planned' => $this->faker->boolean(),
            'year3_planned' => $this->faker->boolean(),
            'description' => $this->faker->sentence(),
        ];
    }
}
