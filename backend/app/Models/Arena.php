<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arena extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'author',
        'users',
        'max_users',
        'time',
        'questions',
        'start_at',
        'type',
        'password',
    ];

    public function author()
    {
        return $this->belongsTo(User::class);
    }
}
