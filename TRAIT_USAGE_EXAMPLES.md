# Reusable Traits Usage Examples

## ActivityLogTrait

### 1. Add to your User model:

```php
<?php

namespace App\Models;

use App\Traits\ActivityLogTrait;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use ActivityLogTrait;
    
    // Your existing code...
}
```

### 2. Usage Examples:

```php
// Automatic logging (happens automatically when model events occur)
$user = new User();
$user->name = 'John Doe';
$user->email = 'john@example.com';
$user->save(); // Automatically logs: "User was created"

$user->name = 'Jane Doe';
$user->save(); // Automatically logs: "User was updated"

$user->delete(); // Automatically logs: "User was deleted"

// Manual logging
$user->logCustom('User profile picture updated');
$user->logViewed(); // Logs: "User was viewed"

// Get activities
$recentActivities = ActivityLogTrait::getRecentActivities(5);
$userActivities = ActivityLogTrait::getUserActivities();

// Clean up old activities
ActivityLogTrait::deleteOldActivities(90); // Delete activities older than 90 days
```

### 3. Add to any model:

```php
<?php

namespace App\Models;

use App\Traits\ActivityLogTrait;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use ActivityLogTrait;
    
    // Your existing code...
}

// Usage:
$product = Product::find(1);
$product->logCustom('Product price updated from $100 to $120');
$product->logViewed();
```

## NotificationTrait

### 1. Add to your User model:

```php
<?php

namespace App\Models;

use App\Traits\NotificationTrait;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use NotificationTrait;
    
    // Your existing code...
}
```

### 2. Usage Examples:

```php
// Send notifications
$user->notifySuccess('Login Successful', 'Welcome back!');
$user->notifyError('Login Failed', 'Invalid credentials');
$user->notifyWarning('Account Expiring', 'Your account expires in 7 days');
$user->notifyInfo('New Feature', 'Check out our new dashboard');

// Send custom notification directly
$user->sendCustomNotification('success', 'Custom Title', 'Custom message');

// Get notifications
$unreadCount = $user->getUnreadNotificationsCount();
$unreadNotifications = $user->getUnreadNotifications();
$recentNotifications = $user->getRecentNotifications(10);

// Mark as read
$user->markNotificationAsRead($notificationId);
$user->markAllNotificationsAsRead();

// Clean up old notifications
$user->deleteOldNotifications(30); // Delete notifications older than 30 days
```

### 3. In Controllers:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            $user->notifySuccess('Login Successful', 'Welcome back!');
            $user->logCustom('User logged in successfully');
            return redirect('/dashboard');
        } else {
            // Log failed login attempt
            ActivityLogTrait::logCustom('Failed login attempt for email: ' . $request->email);
            return back()->with('error', 'Invalid credentials');
        }
    }
    
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        $user->update($request->validated());
        
        // Notifications and logs are automatic due to traits
        $user->notifyInfo('Profile Updated', 'Your profile has been updated successfully');
        
        return back()->with('success', 'Profile updated');
    }
}
```

## Database Tables

### ActivityLogs Table (already exists):
- `id` (INT, PK, AI)
- `users_id` (VARCHAR(45))
- `description` (VARCHAR(45))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP)

### Notifications Table (run migration):
```bash
php artisan migrate
```

## Benefits:

1. **Automatic Logging**: Model events are automatically logged
2. **Easy Integration**: Just add the trait to any model
3. **Consistent API**: Same methods across all models
4. **Flexible**: Can log custom activities and send various notification types
5. **Clean Code**: Reduces boilerplate code in controllers
6. **Maintainable**: Centralized logging and notification logic

## Quick Setup:

1. Add traits to your models:
```php
use App\Traits\ActivityLogTrait;
use App\Traits\NotificationTrait;

class YourModel extends Model
{
    use ActivityLogTrait, NotificationTrait;
}
```

2. Run the notification migration:
```bash
php artisan migrate
```

3. Start using in your controllers and models!
