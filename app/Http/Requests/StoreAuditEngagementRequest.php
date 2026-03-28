<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAuditEngagementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'engagement_id' => 'nullable|string|unique:audit_engagements,engagement_id',
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'auditable_entity_id' => 'nullable|exists:auditable_entities,id',
            'lead_auditor_id' => 'nullable|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'nullable|string|in:Not Started,Assigned,Planning,In Progress,Completed',
            'fiscal_year' => 'nullable|integer',
        ];
    }
}
