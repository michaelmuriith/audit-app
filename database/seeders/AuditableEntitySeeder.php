<?php

namespace Database\Seeders;

use App\Models\AuditableEntity;
use Illuminate\Database\Seeder;

class AuditableEntitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $entities = [
            ['name' => 'Financial Operations', 'priority' => 'High', 'status' => 'Approved', 'year1_planned' => true, 'year2_planned' => false, 'year3_planned' => true],
            ['name' => 'IT Infrastructure', 'priority' => 'Critical', 'status' => 'Approved', 'year1_planned' => true, 'year2_planned' => true, 'year3_planned' => true],
            ['name' => 'HR Compliance', 'priority' => 'Medium', 'status' => 'Draft', 'year1_planned' => false, 'year2_planned' => true, 'year3_planned' => false],
            ['name' => 'Procurement Services', 'priority' => 'Low', 'status' => 'Approved', 'year1_planned' => true, 'year2_planned' => false, 'year3_planned' => false],
            ['name' => 'Customer Support', 'priority' => 'Medium', 'status' => 'Draft', 'year1_planned' => false, 'year2_planned' => false, 'year3_planned' => true],
        ];

        foreach ($entities as $entity) {
            AuditableEntity::create($entity);
        }
    }
}
