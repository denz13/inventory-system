<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActivityLogTrait;
use App\Models\User;

class permission_settings extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'permission_settings';
    protected $primaryKey = 'id';
    protected $fillable = ['users_id', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function permissionSettingsList()
    {
        return $this->hasMany(permission_settings_list::class, 'permission_settings_id');
    }
}
