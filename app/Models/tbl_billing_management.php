<?php

namespace App\Models;

use App\Traits\ActivityLogTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\tbl_billing_management_list;
use App\Models\tbl_bank_account_category;

class tbl_billing_management extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'tbl_billing_management';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'billing_date',
        'receipt',
        'official_receipt',
        'amount_due',
        'status',
        'payment_account_id',
        'reason',
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

    public function paymentAccount()
    {
        return $this->belongsTo(tbl_bank_account_category::class, 'payment_account_id');
    }
}
