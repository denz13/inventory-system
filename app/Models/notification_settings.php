<?php

namespace App\Models;

use App\Traits\ActivityLogTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class notification_settings extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'notification_settings';
    protected $primaryKey = 'id';
    protected $fillable = ['users_id', 'status', 'module_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function module()
    {
        return $this->belongsTo(module::class, 'module_id');
    }
}
