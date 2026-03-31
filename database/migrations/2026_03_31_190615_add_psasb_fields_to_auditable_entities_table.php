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
        Schema::table('auditable_entities', function (Blueprint $table) {
            $table->string('category')->default('Process')->after('name'); // Department, Process, Branch
            $table->string('sector')->nullable()->after('category'); // Governance, Finance, HR, IT
            $table->date('last_audit_date')->nullable()->after('description');
            $table->string('last_audit_rating')->nullable()->after('last_audit_date');
            $table->string('risk_frequency')->default('Annual')->after('last_audit_rating'); // Annual, Bi-annual, Tri-annual
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auditable_entities', function (Blueprint $table) {
            $table->dropColumn(['category', 'sector', 'last_audit_date', 'last_audit_rating', 'risk_frequency']);
        });
    }
};
