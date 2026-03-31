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
        Schema::table('risks', function (Blueprint $table) {
            $table->integer('control_effectiveness')->default(1)->after('impact'); // 1-5 scale
            $table->decimal('residual_score', 8, 2)->nullable()->after('control_effectiveness');
            $table->text('mitigations')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('risks', function (Blueprint $table) {
            $table->dropColumn(['control_effectiveness', 'residual_score', 'mitigations']);
        });
    }
};
