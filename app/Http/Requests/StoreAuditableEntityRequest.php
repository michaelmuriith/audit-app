<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAuditableEntityRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'sector' => 'nullable|string|max:255',
            'priority' => 'required|string|in:Critical,High,Medium,Low',
            'year1_planned' => 'nullable|boolean',
            'year2_planned' => 'nullable|boolean',
            'year3_planned' => 'nullable|boolean',
            'last_audit_date' => 'nullable|date',
            'last_audit_rating' => 'nullable|string|max:255',
            'risk_frequency' => 'required|string|in:Annual,Bi-annual,Tri-annual',
            'description' => 'nullable|string',
        ];
    }
}
