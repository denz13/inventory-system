<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\tbl_billing_management;

class tbl_billing_management_list extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_billing_management_list';
    protected $primaryKey = 'id';
    protected $fillable = [
        'billing_management_id',
        'description',
        'qty',
        'price',
        'is_pay',
    ];

    public function billingManagement()
    {
        return $this->belongsTo(tbl_billing_management::class, 'billing_management_id');
    }
}
