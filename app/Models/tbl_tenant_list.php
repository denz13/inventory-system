<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_tenant_list extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_tenant_list';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'full_name',
        'relationship',
        'contact_number',
        'email',
        'photo',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
