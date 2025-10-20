<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class users_login extends Model
{
    use HasFactory;

    protected $table = 'users_login';
    protected $primaryKey = 'id';
    protected $fillable = [
        'users_id',
        'browser',
        'ip_address',
        'mac_address',
        'location',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
