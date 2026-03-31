<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditableEntityRequest;
use App\Models\AuditableEntity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditableEntityController extends Controller
{
    public function universe(Request $request): Response
    {
        $entities = AuditableEntity::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->sector && $request->sector !== 'all', fn ($q) => $q->where('sector', $request->sector))
            ->latest()
            ->get();

        return Inertia::render('audit-planning/auditable-entities', [
            'entities' => $entities,
            'filters' => $request->only(['search', 'sector']),
        ]);
    }

    public function index(Request $request): Response
    {
        $entities = AuditableEntity::query()
            ->with(['risks'])
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->priority && $request->priority !== 'all', fn ($q) => $q->where('priority', $request->priority))
            ->latest()
            ->get()
            ->map(function ($entity) {
                // Calculate Aggregate Residual Score
                $entity->residual_risk_score = $entity->risks->sum('residual_score');
                
                // Auto-suggest Frequency
                if ($entity->residual_risk_score >= 15) {
                    $entity->suggested_frequency = 'Annual';
                } elseif ($entity->residual_risk_score >= 8) {
                    $entity->suggested_frequency = 'Bi-annual';
                } else {
                    $entity->suggested_frequency = 'Tri-annual';
                }

                return $entity;
            });

        return Inertia::render('audit-planning/strategic-plan', [
            'entities' => $entities,
            'filters' => $request->only(['search', 'priority']),
        ]);
    }

    public function store(StoreAuditableEntityRequest $request)
    {
        AuditableEntity::create($request->validated());

        return redirect()->back()->with('success', 'Auditable entity added successfully.');
    }

    public function update(Request $request, AuditableEntity $strategicPlan)
    {
        $validated = $request->validate([
            'year1_planned' => 'boolean',
            'year2_planned' => 'boolean',
            'year3_planned' => 'boolean',
            'risk_frequency' => 'string|in:Annual,Bi-annual,Tri-annual',
            'priority' => 'string|in:Critical,High,Medium,Low',
        ]);

        $strategicPlan->update($validated);

        return redirect()->back()->with('success', 'Strategic schedule updated successfully.');
    }

    public function destroy(AuditableEntity $strategicPlan)
    {
        $strategicPlan->delete();

        return redirect()->back()->with('success', 'Auditable entity removed from plan.');
    }

    public function submit(Request $request)
    {
        AuditableEntity::where('status', 'Draft')->update(['status' => 'Approved']);

        return redirect()->back()->with('success', 'Strategic plan submitted for approval.');
    }
}
