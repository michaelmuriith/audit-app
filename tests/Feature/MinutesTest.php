<?php

use App\Models\User;
use App\Models\Meeting;
use function Pest\Laravel\actingAs;

test('can view minutes management index', function () {
    $user = User::factory()->create();
    Meeting::factory()->count(3)->create(['user_id' => $user->id]);

    actingAs($user)
        ->get(route('audit-planning.meetings.minutes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('meetings/minutes-index')
            ->has('meetings.data', 3)
        );
});
