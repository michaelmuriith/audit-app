<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_engagements', function (Blueprint $table) {
            $table->id();
            $table->string('engagement_id')->unique();
            $table->string('name');
            $table->string('department')->nullable();
            $table->foreignId('auditable_entity_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('lead_auditor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('Not Started'); // Not Started, Assigned, Planning, In Progress, Completed
            $table->integer('fiscal_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_engagements');
    }
};
