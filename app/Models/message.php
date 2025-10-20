<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class message extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'messages';
    protected $primaryKey = 'id';
    protected $fillable = ['from_id', 'to_id', 'message', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id');
    }
}
