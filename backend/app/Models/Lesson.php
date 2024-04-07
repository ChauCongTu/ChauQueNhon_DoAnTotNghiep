<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'chap_id',
        'content',
        'view_count',
        'type',
        'likes',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class, 'chap_id');
    }
}
