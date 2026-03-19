<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'agenda' => 'nullable|string',
            'start_time' => 'sometimes|date|after_or_equal:now',
            'duration' => 'sometimes|integer|min:1|max:1440',
            'attendees' => 'sometimes|array',
            'attendees.*' => 'required|email',
            'location' => 'nullable|string|max:255',
            'status' => 'sometimes|string|in:scheduled,rescheduled,cancelled',
        ];
    }
}
