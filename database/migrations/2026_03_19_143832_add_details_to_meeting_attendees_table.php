<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_attendees', function (Blueprint $table) {
            $table->string('name')->nullable()->after('user_id');
            $table->string('designation')->nullable()->after('name');
            $table->string('department')->nullable()->after('designation');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_attendees', function (Blueprint $table) {
            $table->dropColumn(['name', 'designation', 'department']);
        });
    }
};
