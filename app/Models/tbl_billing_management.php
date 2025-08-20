<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\tbl_billing_management_list;

class tbl_billing_management extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_billing_management';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'billing_date',
        'receipt',
        'amount_due',
        'status',
    ];

    protected $casts = [
        'amount_due' => 'decimal:2',
    ];

    // Don't cast billing_date so it can accept string date ranges

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function billingItems()
    {
        return $this->hasMany(tbl_billing_management_list::class, 'billing_management_id');
    }
}
