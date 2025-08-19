<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_chat extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_chat';
    protected $primaryKey = 'id';
    protected $fillable = ['from_user_id', 'message', 'to_user_id', 'status'];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
