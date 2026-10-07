<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = [
        'user_id', 'french', 'english', 'correct_count', 'wrong_count', 'next_review_at',
    ];

    protected $casts = [
        'next_review_at' => 'datetime',
    ];
}
