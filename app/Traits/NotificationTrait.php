<?php

namespace App\Traits;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait NotificationTrait
{
    /**
     * Get all custom notifications for this user
     */
    public function customNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'users_id', 'id');
    }

    /**
     * Send a custom notification to this user
     */
    public function sendCustomNotification(string $type, string $title, string $message, int $moduleId = null): Notification
    {
        $notificationSettingsId = null;
        
        // If moduleId is provided, find the notification_settings_id for this user and module
        if ($moduleId) {
            $notificationSetting = \App\Models\notification_settings::where('users_id', $this->id)
                ->where('module_id', $moduleId)
                ->where('status', 'active')
                ->first();
            
            if ($notificationSetting) {
                $notificationSettingsId = $notificationSetting->id;
            }
        }
        
        return $this->customNotifications()->create([
            'users_id' => $this->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'notification_settings_id' => $notificationSettingsId,
            'read_at' => null,
        ]);
    }

    /**
     * Send success notification
     */
    public function notifySuccess(string $title, string $message, int $moduleId = null): Notification
    {
        return $this->sendCustomNotification('success', $title, $message, $moduleId);
    }

    /**
     * Send error notification
     */
    public function notifyError(string $title, string $message, int $moduleId = null): Notification
    {
        return $this->sendCustomNotification('error', $title, $message, $moduleId);
    }

    /**
     * Send warning notification
     */
    public function notifyWarning(string $title, string $message, int $moduleId = null): Notification
    {
        return $this->sendCustomNotification('warning', $title, $message, $moduleId);
    }

    /**
     * Send info notification
     */
    public function notifyInfo(string $title, string $message, int $moduleId = null): Notification
    {
        return $this->sendCustomNotification('info', $title, $message, $moduleId);
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(int $notificationId): bool
    {
        $notification = $this->customNotifications()->find($notificationId);
        
        if ($notification && !$notification->read_at) {
            $notification->markAsRead();
            return true;
        }
        
        return false;
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead(): int
    {
        return $this->customNotifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadNotificationsCount(): int
    {
        return $this->customNotifications()->whereNull('read_at')->count();
    }

    /**
     * Get unread notifications
     */
    public function getUnreadNotifications()
    {
        return $this->customNotifications()->whereNull('read_at')->orderBy('created_at', 'desc');
    }

    /**
     * Get recent notifications
     */
    public function getRecentNotifications(int $limit = 10)
    {
        return $this->customNotifications()->orderBy('created_at', 'desc')->limit($limit);
    }

    /**
     * Delete old notifications
     */
    public function deleteOldNotifications(int $days = 30): int
    {
        return $this->customNotifications()
            ->where('created_at', '<', now()->subDays($days))
            ->delete();
    }
}
