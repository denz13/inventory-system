<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use Carbon\Carbon;

class tbl_otp extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_otp';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'email',
        'otp_code',
        'status',
        'expire_at',
    ];

    protected $dates = [
        'expire_at',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Status constants
    const STATUS_NOT_USED = 'not_used';
    const STATUS_USED = 'used';
    const STATUS_EXPIRED = 'expired';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired()
    {
        return Carbon::now()->greaterThan($this->expire_at);
    }

    /**
     * Mark OTP as used
     */
    public function markAsUsed()
    {
        $this->update(['status' => self::STATUS_USED]);
    }

    /**
     * Mark OTP as expired
     */
    public function markAsExpired()
    {
        $this->update(['status' => self::STATUS_EXPIRED]);
    }

    /**
     * Scope for unused OTPs
     */
    public function scopeNotUsed($query)
    {
        return $query->where('status', self::STATUS_NOT_USED);
    }

    /**
     * Scope for expired OTPs
     */
    public function scopeExpired($query)
    {
        return $query->where('status', self::STATUS_EXPIRED);
    }

    /**
     * Scope for used OTPs
     */
    public function scopeUsed($query)
    {
        return $query->where('status', self::STATUS_USED);
    }
}
