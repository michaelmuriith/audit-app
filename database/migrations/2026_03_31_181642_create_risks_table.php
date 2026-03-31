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
        Schema::create('risks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['Technology', 'Financial', 'Compliance', 'Operational', 'Strategic']);
            $table->unsignedTinyInteger('likelihood')->default(1);
            $table->unsignedTinyInteger('impact')->default(1);
            $table->foreignId('auditable_entity_id')->nullable()->constrained()->onDelete('set null');
            $table->string('department')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risks');
    }
};
