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
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('french');
            $table->string('english');
            $table->integer('correct_count')->default(0);    // réussites d'affilée
            $table->integer('wrong_count')->default(0);      // total d'erreurs
            $table->timestamp('next_review_at')->nullable(); // quand revoir le mot
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};
