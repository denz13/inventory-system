<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait ActivityLogTrait
{
    /**
     * Log an activity for this model
     */
    public function logActivity(string $description): ActivityLog
    {
        return ActivityLog::create([
            'users_id' => Auth::id(),
            'description' => $description,
        ]);
    }

    /**
     * Log creation activity
     */
    public function logCreated(): ActivityLog
    {
        $modelName = class_basename($this);
        return $this->logActivity("{$modelName} was created");
    }

    /**
     * Log update activity
     */
    public function logUpdated(): ActivityLog
    {
        $modelName = class_basename($this);
        return $this->logActivity("{$modelName} was updated");
    }

    /**
     * Log deletion activity
     */
    public function logDeleted(): ActivityLog
    {
        $modelName = class_basename($this);
        return $this->logActivity("{$modelName} was deleted");
    }

    /**
     * Log view activity
     */
    public function logViewed(): ActivityLog
    {
        $modelName = class_basename($this);
        return $this->logActivity("{$modelName} was viewed");
    }

    /**
     * Log custom activity
     */
    public function logCustom(string $description): ActivityLog
    {
        return $this->logActivity($description);
    }

    /**
     * Get recent activities for current user
     */
    public static function getRecentActivities(int $limit = 10)
    {
        return ActivityLog::with('user')
            ->where('users_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get all activities for current user
     */
    public static function getUserActivities()
    {
        return ActivityLog::with('user')
            ->where('users_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Delete old activities
     */
    public static function deleteOldActivities(int $days = 90): int
    {
        return ActivityLog::where('created_at', '<', now()->subDays($days))->delete();
    }

    /**
     * Boot the trait - automatically log model events
     */
    protected static function bootActivityLogTrait()
    {
        static::created(function ($model) {
            $model->logCreated();
        });

        static::updated(function ($model) {
            $model->logUpdated();
        });

        static::deleted(function ($model) {
            $model->logDeleted();
        });
    }
}
