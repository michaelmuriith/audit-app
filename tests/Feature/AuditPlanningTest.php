<?php

use App\Models\AuditableEntity;
use App\Models\Risk;
use App\Models\User;

test('it calculates residual risk score correctly', function () {
    $entity = AuditableEntity::create([
        'name' => 'Finance Dept',
        'category' => 'Department',
    ]);

    $risk = Risk::create([
        'auditable_entity_id' => $entity->id,
        'name' => 'Fraud',
        'category' => 'Financial',
        'likelihood' => 4,
        'impact' => 5, // Inherent 20
        'control_effectiveness' => 4, // 20% * 3 reduction = 60% reduction
        'mitigations' => 'Daily reconciliations',
    ]);

    // Residual = 20 * (1 - ((4-1)*0.2)) = 20 * (1 - 0.6) = 20 * 0.4 = 8
    expect($risk->fresh()->residual_score)->toEqual(8);
});

test('it suggests correct frequency based on residual score', function () {
    $entity = AuditableEntity::create(['name' => 'High Risk Unit']);
    
    Risk::create([
        'auditable_entity_id' => $entity->id,
        'name' => 'Big Risk',
        'category' => 'Operational',
        'likelihood' => 5,
        'impact' => 5,
        'control_effectiveness' => 1, // No reduction
        'mitigations' => 'None',
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('audit-planning.strategic-plan'))
        ->assertInertia(fn ($page) => $page
            ->component('audit-planning/strategic-plan')
            ->has('entities.0', fn ($entity) => $entity
                ->where('name', 'High Risk Unit')
                ->where('residual_risk_score', 25)
                ->where('suggested_frequency', 'Annual')
                ->etc()
            )
        );
});
