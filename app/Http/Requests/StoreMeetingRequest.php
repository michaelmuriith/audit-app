<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'agenda' => 'nullable|string',
            'start_time' => 'required|date|after:now',
            'duration' => 'required|integer|min:1|max:1440',
            'attendees' => 'required|array',
            'attendees.*' => 'required|email',
            'location' => 'nullable|string|max:255',
        ];
    }
}
