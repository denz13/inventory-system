<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class tbl_feedback extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_feedback';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'description',
        'rating',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
