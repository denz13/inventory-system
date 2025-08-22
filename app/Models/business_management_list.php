<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class business_management_list extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'business_management_list';
    protected $fillable = ['user_id', 'type_of_business', 'business_name','business_clearance','address', 'status','reason'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
