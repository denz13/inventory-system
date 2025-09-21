<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActivityLogTrait;
use App\Models\User;
use App\Models\module;

class permission_settings_list extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'permission_settings_list';
    protected $primaryKey = 'id';
    protected $fillable = ['permission_settings_id', 'permission_allowed','module_id','status'];

    public function permission_settings()
    {
        return $this->belongsTo(permission_settings::class, 'permission_settings_id');
    }

    public function module()
    {
        return $this->belongsTo(module::class, 'module_id');
    }
}
