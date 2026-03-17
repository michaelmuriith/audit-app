<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeetingMinuteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meeting_id' => 'required|exists:meetings,id',
            'content' => 'required|array',
            'notes' => 'nullable|string',
            'decisions' => 'nullable|string',
            'action_items' => 'nullable|string',
            'status' => 'sometimes|string|in:draft,submitted',
        ];
    }
}
