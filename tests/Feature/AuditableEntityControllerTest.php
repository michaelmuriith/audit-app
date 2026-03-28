<?php

use App\Models\AuditableEntity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can view strategic plan', function () {
    AuditableEntity::factory()->count(3)->create();

    $this->get(route('audit-planning.strategic-plan'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('audit-planning/strategic-plan')
            ->has('entities', 3)
        );
});

it('can update auditable entity', function () {
    $entity = AuditableEntity::factory()->create();

    $response = $this->put(route('audit-planning.strategic-plan.update', $entity), [
        'name' => 'Updated Name',
        'priority' => 'Critical',
        'year1_planned' => true,
        'year2_planned' => false,
        'year3_planned' => true,
    ]);

    $response->assertRedirect();
    expect($entity->fresh()->name)->toBe('Updated Name');
    expect($entity->fresh()->priority)->toBe('Critical');
});

it('can remove auditable entity', function () {
    $entity = AuditableEntity::factory()->create();

    $response = $this->delete(route('audit-planning.strategic-plan.destroy', $entity));

    $response->assertRedirect();
    expect(AuditableEntity::find($entity->id))->toBeNull();
});

it('can submit strategic plan', function () {
    AuditableEntity::factory()->count(3)->create(['status' => 'Draft']);

    $response = $this->post(route('audit-planning.strategic-plan.submit'));

    $response->assertRedirect();
    expect(AuditableEntity::where('status', 'Draft')->count())->toBe(0);
    expect(AuditableEntity::where('status', 'Approved')->count())->toBeGreaterThanOrEqual(3);
});

test('can search entities by name', function () {
    AuditableEntity::factory()->create(['name' => 'Finance Audit']);
    AuditableEntity::factory()->create(['name' => 'IT Review']);

    $this->get(route('audit-planning.strategic-plan', ['search' => 'Finance']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entities', 1)
            ->where('entities.0.name', 'Finance Audit')
        );
});

test('can filter entities by priority', function () {
    AuditableEntity::factory()->create(['priority' => 'Critical']);
    AuditableEntity::factory()->create(['priority' => 'Low']);

    $this->get(route('audit-planning.strategic-plan', ['priority' => 'Critical']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entities', 1)
            ->where('entities.0.priority', 'Critical')
        );
});

test('can store auditable entity', function () {
    $data = [
        'name' => 'New Auditable Entity',
        'priority' => 'High',
        'year1_planned' => true,
        'year2_planned' => false,
        'year3_planned' => true,
        'description' => 'Test description',
    ];

    $this->post(route('audit-planning.strategic-plan.store'), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('auditable_entities', [
        'name' => 'New Auditable Entity',
        'priority' => 'High',
        'year1_planned' => true,
    ]);
});

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
