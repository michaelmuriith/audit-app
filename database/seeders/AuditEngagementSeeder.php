<?php

namespace Database\Seeders;

use App\Models\AuditEngagement;
use Illuminate\Database\Seeder;

class AuditEngagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $engagements = [
            ['engagement_id' => '2024-FN-01', 'name' => 'Revenue Recognition Audit', 'department' => 'Finance', 'start_date' => '2024-04-01', 'end_date' => '2024-05-15', 'status' => 'Assigned', 'fiscal_year' => 2024],
            ['engagement_id' => '2024-IT-02', 'name' => 'Network Security Review', 'department' => 'IT', 'start_date' => '2024-05-20', 'end_date' => '2024-06-30', 'status' => 'Not Started', 'fiscal_year' => 2024],
            ['engagement_id' => '2024-OP-03', 'name' => 'Inventory Management Audit', 'department' => 'Operations', 'start_date' => '2024-06-01', 'end_date' => '2024-07-15', 'status' => 'Planning', 'fiscal_year' => 2024],
            ['engagement_id' => '2024-LG-04', 'name' => 'Contractual Compliance', 'department' => 'Legal', 'start_date' => '2024-08-15', 'end_date' => '2024-09-30', 'status' => 'Not Started', 'fiscal_year' => 2024],
        ];

        foreach ($engagements as $eng) {
            AuditEngagement::create($eng);
        }
    }
}
