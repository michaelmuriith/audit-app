<?php

use App\Models\AuditableEntity;
use App\Models\AuditEngagement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can view annual plan', function () {
    AuditEngagement::factory()->count(3)->create();

    $this->get(route('audit-planning.annual-plan'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('audit-planning/annual-plan')
            ->has('engagements', 3)
            ->has('auditors')
            ->has('entities')
        );
});

test('can search engagements by name', function () {
    AuditEngagement::factory()->create(['name' => 'Revenue Audit']);
    AuditEngagement::factory()->create(['name' => 'HR Audit']);

    $this->get(route('audit-planning.annual-plan', ['search' => 'Revenue']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('engagements', 1)
            ->where('engagements.0.name', 'Revenue Audit')
        );
});

test('can schedule audit engagement', function () {
    $entity = AuditableEntity::factory()->create();
    $auditor = User::factory()->create();

    $data = [
        'name' => 'Scheduled Revenue Audit',
        'auditable_entity_id' => $entity->id,
        'lead_auditor_id' => $auditor->id,
        'start_date' => now()->format('Y-m-d'),
        'end_date' => now()->addMonth()->format('Y-m-d'),
        'description' => 'Detailed audit description',
    ];

    $this->post(route('audit-planning.annual-plan.store'), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('audit_engagements', [
        'name' => 'Scheduled Revenue Audit',
        'auditable_entity_id' => $entity->id,
        'lead_auditor_id' => $auditor->id,
    ]);
});

it('can update audit engagement schedule', function () {
    $engagement = AuditEngagement::factory()->create();
    $auditor = User::factory()->create();

    $response = $this->put(route('audit-planning.annual-plan.update', $engagement), [
        'name' => 'Updated Engagement Name',
        'auditable_entity_id' => $engagement->auditable_entity_id,
        'lead_auditor_id' => $auditor->id,
        'start_date' => '2025-01-01',
        'end_date' => '2025-02-01',
    ]);

    $response->assertRedirect();
    expect($engagement->fresh()->name)->toBe('Updated Engagement Name');
    expect($engagement->fresh()->lead_auditor_id)->toBe($auditor->id);
});

it('can remove audit engagement', function () {
    $engagement = AuditEngagement::factory()->create();

    $response = $this->delete(route('audit-planning.annual-plan.destroy', $engagement));

    $response->assertRedirect();
    expect(AuditEngagement::find($engagement->id))->toBeNull();
});
