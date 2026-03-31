<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditEngagementRequest;
use App\Models\AuditableEntity;
use App\Models\AuditEngagement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditEngagementController extends Controller
{
    public function index(Request $request): Response
    {
        $engagements = AuditEngagement::query()
            ->with(['auditableEntity', 'leadAuditor'])
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->get();

        $auditors = User::all(['id', 'name', 'email']);
        $entities = AuditableEntity::query()
            ->with(['risks'])
            ->where('year1_planned', true)
            ->get()
            ->map(function ($entity) {
                $entity->residual_risk_score = $entity->risks->sum('residual_score');
                return $entity;
            });

        return Inertia::render('audit-planning/annual-plan', [
            'engagements' => $engagements,
            'auditors' => $auditors,
            'entities' => $entities,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(StoreAuditEngagementRequest $request)
    {
        $data = $request->validated();

        // Auto-generate engagement_id if not provided
        if (empty($data['engagement_id'])) {
            $prefix = date('Y');
            $count = AuditEngagement::where('engagement_id', 'like', "{$prefix}-%")->count();
            $data['engagement_id'] = sprintf('%s-ENG-%03d', $prefix, $count + 1);
        }

        // Default status and fiscal year
        $data['status'] = $data['status'] ?? 'Not Started';
        $data['fiscal_year'] = $data['fiscal_year'] ?? date('Y');

        AuditEngagement::create($data);

        return redirect()->back()->with('success', 'Audit engagement scheduled successfully.');
    }

    public function update(StoreAuditEngagementRequest $request, AuditEngagement $annualPlan)
    {
        $annualPlan->update($request->validated());

        return redirect()->back()->with('success', 'Audit engagement updated successfully.');
    }

    public function destroy(AuditEngagement $annualPlan)
    {
        $annualPlan->delete();

        return redirect()->back()->with('success', 'Audit engagement removed successfully.');
    }
}
