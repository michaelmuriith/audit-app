<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Risk;
use App\Models\AuditableEntity;
use Inertia\Inertia;
use Inertia\Response;

class RiskController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('audit-planning/risk-assessment', [
            'risks' => Risk::with('auditableEntity')->latest()->get(),
            'entities' => AuditableEntity::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Technology,Financial,Compliance,Operational,Strategic',
            'likelihood' => 'required|integer|min:1|max:5',
            'impact' => 'required|integer|min:1|max:5',
            'control_effectiveness' => 'required|integer|min:1|max:5',
            'auditable_entity_id' => 'required|exists:auditable_entities,id',
            'description' => 'nullable|string',
            'mitigations' => 'nullable|string',
        ]);

        Risk::create($validated);

        return redirect()->back()->with('success', 'Risk entry added successfully.');
    }

    public function update(Request $request, Risk $risk)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Technology,Financial,Compliance,Operational,Strategic',
            'likelihood' => 'required|integer|min:1|max:5',
            'impact' => 'required|integer|min:1|max:5',
            'control_effectiveness' => 'required|integer|min:1|max:5',
            'auditable_entity_id' => 'required|exists:auditable_entities,id',
            'description' => 'nullable|string',
            'mitigations' => 'nullable|string',
        ]);

        $risk->update($validated);

        return redirect()->back()->with('success', 'Risk entry updated successfully.');
    }

    public function destroy(Risk $risk)
    {
        $risk->delete();

        return redirect()->back()->with('success', 'Risk entry removed successfully.');
    }
}
