<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditableEntityRequest;
use App\Models\AuditableEntity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditableEntityController extends Controller
{
    public function index(Request $request): Response
    {
        $entities = AuditableEntity::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->priority && $request->priority !== 'all', fn ($q) => $q->where('priority', $request->priority))
            ->latest()
            ->get();

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

    public function update(StoreAuditableEntityRequest $request, AuditableEntity $strategicPlan)
    {
        $strategicPlan->update($request->validated());

        return redirect()->back()->with('success', 'Auditable entity updated successfully.');
    }

    public function destroy(AuditableEntity $strategicPlan)
    {
        $strategicPlan->delete();

        return redirect()->back()->with('success', 'Auditable entity removed successfully.');
    }

    public function submit(Request $request)
    {
        AuditableEntity::where('status', 'Draft')->update(['status' => 'Approved']);

        return redirect()->back()->with('success', 'Strategic plan submitted for approval.');
    }
}
