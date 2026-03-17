<?php

use App\Models\User;

test('authenticated users can visit all audit routes', function (string $route) {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route($route));
    $response->assertOk();
})->with([
    'dashboard',
    'audit-planning.strategic-plan',
    'audit-planning.risk-assessment',
    'audit-planning.meetings',
    'audit-planning.annual-plan',
    'audit-execution.engagement',
    'audit-execution.questionnaire',
    'audit-execution.programme',
    'audit-reporting.findings',
    'audit-reporting.draft-report',
    'issue-management.action-plans',
    'issue-management.follow-up',
]);
