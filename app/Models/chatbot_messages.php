<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class chatbot_messages extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'chatbot_messages';
    protected $primaryKey = 'id';
    protected $fillable = ['from_guest_id', 'from_users_id', 'message','parent_id','status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'from_users_id');
    }
}
