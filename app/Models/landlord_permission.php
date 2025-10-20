<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\applied_landlord;

class landlord_permission extends Model
{
    use HasFactory;

    protected $table = 'landlord_permission';
    protected $primaryKey = 'id';
    protected $fillable = [
        'applied_landlord_id',
        'has_have_permission',
        'status',
       
    ];

    protected $casts = [
        'has_have_permission' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function landlord()
    {
        return $this->belongsTo(applied_landlord::class, 'applied_landlord_id');
    }
}
