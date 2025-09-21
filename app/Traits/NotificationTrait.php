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
    public function sendCustomNotification(string $type, string $title, string $message): Notification
    {
        return $this->customNotifications()->create([
            'users_id' => $this->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => [],
            'read_at' => null,
        ]);
    }

    /**
     * Send success notification
     */
    public function notifySuccess(string $title, string $message): Notification
    {
        return $this->sendCustomNotification('success', $title, $message);
    }

    /**
     * Send error notification
     */
    public function notifyError(string $title, string $message): Notification
    {
        return $this->sendCustomNotification('error', $title, $message);
    }

    /**
     * Send warning notification
     */
    public function notifyWarning(string $title, string $message): Notification
    {
        return $this->sendCustomNotification('warning', $title, $message);
    }

    /**
     * Send info notification
     */
    public function notifyInfo(string $title, string $message): Notification
    {
        return $this->sendCustomNotification('info', $title, $message);
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
