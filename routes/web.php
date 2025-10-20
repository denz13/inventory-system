<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PageController;
use App\Http\Controllers\DarkModeController;
use App\Http\Controllers\ColorSchemeController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\LangController;
use App\Http\Controllers\usermanagement\UserManagamentController;
use App\Http\Controllers\businessmanagement\BusinessManagementController;
use App\Http\Controllers\vehiclemanagement\VehicleManagementController;
use App\Http\Controllers\servicemanagement\ServiceManagementController;
use App\Http\Controllers\complaints\ComplaintsController;
use App\Http\Controllers\incident\IncidentController;
use App\Http\Controllers\incidentreportmanagement\IncidentReportManagementController;
use App\Http\Controllers\incidentmanagement\IncidentManagementController;
use App\Http\Controllers\announcement\AnnouncementController;
use App\Http\Controllers\billingmanagement\BillingManagementController;
use App\Http\Controllers\billingpayment\BillingPaymentController;
use App\Http\Controllers\bankaccount\BankAccountController;
use App\Http\Controllers\listpayments\ListPaymentsController;
use App\Http\Controllers\feedback\FeedbackController;
use App\Http\Controllers\feedbackmanagement\FeedbackManagementController;
use App\Http\Controllers\profilemanagement\ProfileManagementController;
use App\Http\Controllers\appointment\AppointmentController;
use App\Http\Controllers\viewappointment\ViewAppointmentController;
use App\Http\Controllers\appointmentmanagement\AppointmentManagementController;
use App\Http\Controllers\appointment_calendar\AppointmentCalendarController;
use App\Http\Controllers\appointment_category\AppointmentCategoryController;
use App\Http\Controllers\apply_appointment\ApplyAppointmentController;
use App\Http\Controllers\appointment_allowing\AppointmentAllowingController;
use App\Http\Controllers\forgotpassword\ForgotPasswordController;
use App\Http\Controllers\otp\OtpController;
use App\Http\Controllers\newpassword\NewPasswordController;
use App\Http\Controllers\vehicle\VehicleController;
use App\Http\Controllers\NotificationSettings\NotificationSettingsController;
use App\Http\Controllers\PermissionSettings\PermissionSettingsController;
use App\Http\Controllers\SystemSettings\SystemSettingsController;
use App\Http\Controllers\DashboardExportController;
use App\Http\Controllers\chat\ChatController;
use App\Http\Controllers\business\BusinessController;
use App\Http\Controllers\landlord\LandlordController;
use App\Http\Controllers\registration_nonhomeowners\RegistrationnonhomeownersController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Language switcher routes
Route::get('index/{locale}', [LangController::class, 'lang']);
Route::get('index', [LangController::class, 'lang']); // Handle missing locale

// Utility routes
Route::get('dark-mode-switcher', [DarkModeController::class, 'switch'])->name('dark-mode-switcher');
Route::get('color-scheme-switcher/{color_scheme}', [ColorSchemeController::class, 'switch'])->name('color-scheme-switcher');

// Authentication routes
Route::controller(AuthController::class)->middleware('loggedin')->group(function() {
    Route::get('login', 'loginView')->name('login.index');
    Route::post('login', 'login')->name('login.check');
    Route::post('verify-otp', 'verifyOTP')->name('verify-otp');
});

// Non-Homeowner Registration Routes (Public)
Route::get('registration-nonhomeowners', [RegistrationnonhomeownersController::class, 'index'])->name('registration-nonhomeowners.index');
Route::post('registration-nonhomeowners', [RegistrationnonhomeownersController::class, 'store'])->name('registration-nonhomeowners.store');

// Appointment routes
Route::get('appointment', [AppointmentController::class, 'index'])->name('appointment.index');
Route::post('appointment', [AppointmentController::class, 'store'])->name('appointment.store');
Route::get('appointment/next-id', [AppointmentController::class, 'getNextId'])->name('appointment.next-id');
Route::get('appointment/{id}', [AppointmentController::class, 'show'])->name('appointment.show');
Route::put('appointment/{id}', [AppointmentController::class, 'update'])->name('appointment.update');
Route::delete('appointment/{id}', [AppointmentController::class, 'destroy'])->name('appointment.destroy');

// View Appointment routes
Route::get('view-appointments', [ViewAppointmentController::class, 'index'])->name('view-appointments.index');
Route::post('view-appointments/track', [ViewAppointmentController::class, 'getAppointmentByTrackingNumber'])->name('view-appointments.track');

// Forgot Password routes
Route::get('forgot-password', [ForgotPasswordController::class, 'index'])->name('forgot-password.index');
Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('forgot-password.store');

// OTP routes
Route::get('otp', [OtpController::class, 'index'])->name('otp.index');
Route::post('otp', [OtpController::class, 'store'])->name('otp.store');

// New Password routes
Route::get('new-password', [NewPasswordController::class, 'index'])->name('new-password.index');
Route::post('new-password', [NewPasswordController::class, 'store'])->name('new-password.store');


// Root redirect
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

// Public Chatbot routes (accessible without authentication for guests)
Route::post('chatbot/message', [\App\Http\Controllers\chatbot\ChatbotController::class, 'message'])->name('chatbot.message');
Route::get('chatbot/guest-conversation', [\App\Http\Controllers\chatbot\ChatbotController::class, 'getGuestConversation'])->name('chatbot.getGuestConversation');

// Protected routes
Route::middleware('auth')->group(function() {
    Route::match(['get', 'post'], 'logout', [AuthController::class, 'logout'])->name('logout');
    
    // Notification routes
    Route::post('notifications/{notification}/mark-read', function($notificationId) {
        $user = auth()->user();
        if ($user) {
            $success = $user->markNotificationAsRead($notificationId);
            return response()->json(['success' => $success]);
        }
        return response()->json(['success' => false], 401);
    })->name('notifications.mark-read');
    
    Route::post('notifications/mark-all-read', function() {
        $user = auth()->user();
        if ($user) {
            // Debug: Check unread count before marking as read
            $unreadBefore = $user->getUnreadNotificationsCount();
            
            $count = $user->markAllNotificationsAsRead();
            
            // Debug: Check unread count after marking as read
            $unreadAfter = $user->getUnreadNotificationsCount();
            
            \Log::info('Mark all notifications as read', [
                'user_id' => $user->id,
                'unread_before' => $unreadBefore,
                'unread_after' => $unreadAfter,
                'marked_count' => $count
            ]);
            
            return response()->json([
                'success' => true, 
                'count' => $count,
                'unread_before' => $unreadBefore,
                'unread_after' => $unreadAfter
            ]);
        }
        return response()->json(['success' => false], 401);
    })->name('notifications.mark-all-read');
    
    Route::get('notifications/all', function() {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['success' => false, 'notifications' => []], 401);
            }
            
            // Get all notifications, paginated or limited (using correct column name: users_id)
            $notifications = \App\Models\Notification::where('users_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function($notification) {
                    return [
                        'id' => $notification->id,
                        'title' => $notification->title ?? 'Notification',
                        'message' => $notification->message ?? '',
                        'type' => $notification->type ?? 'info',
                        'is_read' => $notification->isRead() ? 1 : 0, // Use isRead() method
                        'created_at' => $notification->created_at ? $notification->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s'),
                        'created_at_human' => $notification->created_at ? $notification->created_at->diffForHumans() : 'Just now'
                    ];
                });
            
            return response()->json([
                'success' => true,
                'notifications' => $notifications
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching all notifications: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false, 
                'error' => $e->getMessage(),
                'notifications' => []
            ], 500);
        }
    })->name('notifications.all');
    
    // Dashboard route (specific route before wildcard)
    Route::get('dashboard', [RouteController::class, 'index'])->name('dashboard');
    
    // Admin chatbot management routes (requires authentication)
    Route::get('chatbot', [\App\Http\Controllers\chatbot\ChatbotController::class, 'index'])->name('chatbot.index');
    Route::post('chatbot/reply-to-guest', [\App\Http\Controllers\chatbot\ChatbotController::class, 'replyToGuest'])->name('chatbot.replyToGuest');
    Route::get('chatbot/all-guest-conversations', [\App\Http\Controllers\chatbot\ChatbotController::class, 'getAllGuestConversations'])->name('chatbot.getAllGuestConversations');
    
    // User Management routes
    Route::get('user-management', [UserManagamentController::class, 'index'])->name('usermanagement.index');
    Route::get('user-management/create', [UserManagamentController::class, 'create'])->name('usermanagement.create');
    Route::post('user-management', [UserManagamentController::class, 'store'])->name('usermanagement.store');
    Route::get('user-management/{user}', [UserManagamentController::class, 'show'])->name('usermanagement.show');
    Route::get('user-management/{user}/edit', [UserManagamentController::class, 'edit'])->name('usermanagement.edit');
    Route::put('user-management/{user}', [UserManagamentController::class, 'update'])->name('usermanagement.update');
    Route::delete('user-management/{user}', [UserManagamentController::class, 'destroy'])->name('usermanagement.destroy');
    Route::post('user-management/{user}/toggle-status', [UserManagamentController::class, 'toggleStatus'])->name('usermanagement.toggleStatus');

    // Business Management routes
    Route::get('business-management', [BusinessManagementController::class, 'index'])->name('businessmanagement.index');
    Route::get('business-management/create', [BusinessManagementController::class, 'create'])->name('businessmanagement.create');
    Route::post('business-management', [BusinessManagementController::class, 'store'])->name('businessmanagement.store');
    Route::get('business-management/{business}', [BusinessManagementController::class, 'show'])->name('businessmanagement.show');
    Route::get('business-management/{business}/edit', [BusinessManagementController::class, 'edit'])->name('businessmanagement.edit');
    Route::put('business-management/{business}', [BusinessManagementController::class, 'update'])->name('businessmanagement.update');
    Route::put('business-management/{business}/status', [BusinessManagementController::class, 'updateStatus'])->name('businessmanagement.updateStatus');
    Route::delete('business-management/{business}', [BusinessManagementController::class, 'destroy'])->name('businessmanagement.destroy');

    // Vehicle Management routes
    Route::get('vehicle-management', [VehicleManagementController::class, 'index'])->name('vehiclemanagement.index');
    Route::get('vehicle-management/create', [VehicleManagementController::class, 'create'])->name('vehiclemanagement.create');
    Route::post('vehicle-management', [VehicleManagementController::class, 'store'])->name('vehiclemanagement.store');
    Route::get('vehicle-management/{vehicle}', [VehicleManagementController::class, 'show'])->name('vehiclemanagement.show');
    Route::get('vehicle-management/{vehicle}/edit', [VehicleManagementController::class, 'edit'])->name('vehiclemanagement.edit');
    Route::put('vehicle-management/{vehicle}', [VehicleManagementController::class, 'update'])->name('vehiclemanagement.update');
    Route::delete('vehicle-management/{vehicle}', [VehicleManagementController::class, 'destroy'])->name('vehiclemanagement.destroy');
Route::post('vehicle-management/{id}/approve', [VehicleManagementController::class, 'approve'])->name('vehiclemanagement.approve');
Route::post('vehicle-management/{id}/decline', [VehicleManagementController::class, 'decline'])->name('vehiclemanagement.decline');
Route::post('vehicle-management/sticker/{id}/valid-until', [VehicleManagementController::class, 'updateValidUntil'])->name('vehiclemanagement.valid-until');

    // Complaints routes
    Route::get('complaints', [ComplaintsController::class, 'index'])->name('complaints.index');
    Route::get('complaints/create', [ComplaintsController::class, 'create'])->name('complaints.create');
    Route::post('complaints', [ComplaintsController::class, 'store'])->name('complaints.store');
    Route::get('complaints/{complaint}', [ComplaintsController::class, 'show'])->name('complaints.show');
    Route::get('complaints/{complaint}/edit', [ComplaintsController::class, 'edit'])->name('complaints.edit');
    Route::put('complaints/{complaint}', [ComplaintsController::class, 'update'])->name('complaints.update');
    Route::delete('complaints/{complaint}', [ComplaintsController::class, 'destroy'])->name('complaints.destroy');
    Route::get('complaints/categories/{typeId}', [ComplaintsController::class, 'getCategories'])->name('complaints.categories');

    // Service Management routes
    Route::get('service-management', [ServiceManagementController::class, 'index'])->name('service-management.index');
    Route::get('service-management/create', [ServiceManagementController::class, 'create'])->name('service-management.create');
    Route::post('service-management', [ServiceManagementController::class, 'store'])->name('service-management.store');
    Route::get('service-management/{service}', [ServiceManagementController::class, 'show'])->name('service-management.show');
    Route::get('service-management/{service}/edit', [ServiceManagementController::class, 'edit'])->name('service-management.edit');
    Route::put('service-management/{service}', [ServiceManagementController::class, 'update'])->name('service-management.update');
    Route::delete('service-management/{service}', [ServiceManagementController::class, 'destroy'])->name('service-management.destroy');
    Route::post('service-management/{service}/approve', [ServiceManagementController::class, 'approve'])->name('service-management.approve');
    Route::post('service-management/{service}/decline', [ServiceManagementController::class, 'decline'])->name('service-management.decline');

    // Incident Management routes
    Route::get('incident-report-management', [IncidentReportManagementController::class, 'index'])->name('incident-report-management.index');
    Route::get('incident-report-management/{id}', [IncidentReportManagementController::class, 'show'])->name('incident-report-management.show');
    Route::put('incident-report-management/{id}/status', [IncidentReportManagementController::class, 'updateStatus'])->name('incident-report-management.updateStatus');
    Route::put('incident-report-management/{id}/assign', [IncidentReportManagementController::class, 'assign'])->name('incident-report-management.assign');

    // Billing Management Routes
    Route::get('billing-management', [BillingManagementController::class, 'index'])->name('billing-management.index');
    Route::get('billing-management/user/{userId}/date-range', [BillingManagementController::class, 'getUserBillingDateRange'])->name('billing-management.user-date-range');
    Route::post('/billing', [BillingManagementController::class, 'store'])->name('billing.store');
    Route::get('/billing/{id}', [BillingManagementController::class, 'show'])->name('billing.show');
    Route::put('/billing/{id}', [BillingManagementController::class, 'update'])->name('billing.update');
    Route::delete('/billing/{id}', [BillingManagementController::class, 'destroy'])->name('billing.destroy');

    // Feedback Management routes (Admin view)
    Route::get('feedback-management', [FeedbackManagementController::class, 'index'])->name('feedback-management.index');
    Route::get('feedback-management/{id}', [FeedbackManagementController::class, 'show'])->name('feedback-management.show');
    Route::put('feedback-management/{id}', [FeedbackManagementController::class, 'update'])->name('feedback-management.update');
    Route::delete('feedback-management/{id}', [FeedbackManagementController::class, 'destroy'])->name('feedback-management.destroy');

    // Profile Management routes
    Route::get('profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
    Route::post('profile-management/update', [ProfileManagementController::class, 'updateProfile'])->name('profile-management.update');
    Route::post('profile-management/change-password', [ProfileManagementController::class, 'changePassword'])->name('profile-management.change-password');
    Route::post('profile-management/upload-photo', [ProfileManagementController::class, 'uploadPhoto'])->name('profile-management.upload-photo');
    
    // Tenant Management routes
    Route::post('profile-management/tenants', [ProfileManagementController::class, 'addTenant'])->name('profile-management.tenants.store');
    Route::get('profile-management/tenants/{id}', [ProfileManagementController::class, 'getTenant'])->name('profile-management.tenants.show');
    Route::put('profile-management/tenants/{id}', [ProfileManagementController::class, 'updateTenant'])->name('profile-management.tenants.update');
    Route::delete('profile-management/tenants/{id}', [ProfileManagementController::class, 'deleteTenant'])->name('profile-management.tenants.destroy');

    // Business Management routes
    Route::post('profile-management/businesses', [ProfileManagementController::class, 'addBusiness'])->name('profile-management.businesses.store');
    Route::get('profile-management/businesses/{id}', [ProfileManagementController::class, 'getBusiness'])->name('profile-management.businesses.show');
    Route::put('profile-management/businesses/{id}', [ProfileManagementController::class, 'updateBusiness'])->name('profile-management.businesses.update');
    Route::delete('profile-management/businesses/{id}', [ProfileManagementController::class, 'deleteBusiness'])->name('profile-management.businesses.destroy');

    // Appointment Management routes
    Route::get('appointment-management', [AppointmentManagementController::class, 'index'])->name('appointment-management.index');
    Route::get('appointment-management/{id}', [AppointmentManagementController::class, 'show'])->name('appointment-management.show');
    Route::put('appointment-management/{id}/status', [AppointmentManagementController::class, 'updateStatus'])->name('appointment-management.updateStatus');
    Route::delete('appointment-management/{id}', [AppointmentManagementController::class, 'destroy'])->name('appointment-management.destroy');

    // Appointment Calendar routes
    Route::get('appointment-calendar', [AppointmentCalendarController::class, 'index'])->name('calendar.index');
    Route::get('appointment-calendar/appointments', [AppointmentCalendarController::class, 'getAppointments'])->name('calendar.appointments');
    
    // Appointment Category Routes
    Route::get('appointment-category', [AppointmentCategoryController::class, 'index'])->name('appointment-category.index');
    Route::post('appointment-category', [AppointmentCategoryController::class, 'store'])->name('appointment-category.store');
    Route::get('appointment-category/{id}', [AppointmentCategoryController::class, 'show'])->name('appointment-category.show');
    Route::put('appointment-category/{id}', [AppointmentCategoryController::class, 'update'])->name('appointment-category.update');
    Route::delete('appointment-category/{id}', [AppointmentCategoryController::class, 'destroy'])->name('appointment-category.destroy');
    
    // Apply Appointment Routes (User can apply for appointments)
    Route::get('apply-appointment', [ApplyAppointmentController::class, 'index'])->name('apply-appointment.index');
    Route::post('apply-appointment', [ApplyAppointmentController::class, 'store'])->name('apply-appointment.store');
    Route::post('apply-appointment/check-availability', [ApplyAppointmentController::class, 'checkAvailability'])->name('apply-appointment.check-availability');
    Route::get('apply-appointment/{id}', [ApplyAppointmentController::class, 'show'])->name('apply-appointment.show');
    Route::delete('apply-appointment/{id}', [ApplyAppointmentController::class, 'destroy'])->name('apply-appointment.destroy');
    
    // Appointment Allowing Routes (Daily schedule limit settings)
    Route::get('appointment-allowing', [AppointmentAllowingController::class, 'index'])->name('appointment-allowing.index');
    Route::post('appointment-allowing', [AppointmentAllowingController::class, 'store'])->name('appointment-allowing.store');
    Route::get('appointment-allowing/{id}', [AppointmentAllowingController::class, 'show'])->name('appointment-allowing.show');
    Route::put('appointment-allowing/{id}', [AppointmentAllowingController::class, 'update'])->name('appointment-allowing.update');
    Route::delete('appointment-allowing/{id}', [AppointmentAllowingController::class, 'destroy'])->name('appointment-allowing.destroy');

    // Temporary debug route
    Route::get('debug/business/{id}', function($id) {
        try {
            $business = \App\Models\business_management_list::find($id);
            if ($business) {
                return response()->json([
                    'success' => true,
                    'business' => $business,
                    'user_id' => $business->user_id,
                    'current_user_id' => auth()->id()
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Business not found in database'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    });

    // Bank Account routes
    Route::get('bank-account', [BankAccountController::class, 'index'])->name('bank-account.index');
    Route::post('bank-account', [BankAccountController::class, 'store'])->name('bank-account.store');
    Route::get('bank-account/{id}', [BankAccountController::class, 'show'])->name('bank-account.show');
    Route::put('bank-account/{id}', [BankAccountController::class, 'update'])->name('bank-account.update');
    Route::delete('bank-account/{id}', [BankAccountController::class, 'destroy'])->name('bank-account.destroy');
    
    // Incident routes
    Route::get('incident', [IncidentController::class, 'index'])->name('incident.index');
    Route::post('incident-reports', [IncidentController::class, 'store'])->name('incident.store');
    Route::get('incident-reports/{id}', [IncidentController::class, 'show'])->name('incident.show');
    Route::put('incident-reports/{id}', [IncidentController::class, 'update'])->name('incident.update');
    Route::delete('incident-reports/{id}', [IncidentController::class, 'destroy'])->name('incident.destroy');

    // Announcement routes
    Route::get('announcement', [AnnouncementController::class, 'index'])->name('announcement.index');
    Route::post('announcement', [AnnouncementController::class, 'store'])->name('announcement.store');
    Route::get('announcement/{id}', [AnnouncementController::class, 'show'])->name('announcement.show');
    Route::put('announcement/{id}', [AnnouncementController::class, 'update'])->name('announcement.update');
    Route::delete('announcement/{id}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy');


    // Billing Payment routes
    Route::get('billing-payment', [BillingPaymentController::class, 'index'])->name('billing-payment.index');
    Route::post('billing-payment/process', [BillingPaymentController::class, 'processPayment'])->name('billing-payment.process');
    Route::put('billing-payment/{billingId}/status', [BillingPaymentController::class, 'updatePaymentStatus'])->name('billing-payment.update-status');
    Route::get('billing-payment/test-notifications', [BillingPaymentController::class, 'testNotifications'])->name('billing-payment.test-notifications');

    // List of Payments routes
    Route::get('list-payments', [ListPaymentsController::class, 'index'])->name('list-payments.index');
    Route::get('list-payments/{id}', [ListPaymentsController::class, 'show'])->name('list-payments.show');
    Route::post('list-payments/{id}/approve', [ListPaymentsController::class, 'approve'])->name('list-payments.approve');
    Route::post('list-payments/{id}/reject', [ListPaymentsController::class, 'reject'])->name('list-payments.reject');

    // Feedback routes
    Route::get('feedback', [FeedbackController::class, 'index'])->name('feedback.index');
    Route::post('feedback', [FeedbackController::class, 'store'])->name('feedback.store');
    Route::get('feedback/{id}', [FeedbackController::class, 'show'])->name('feedback.show');
    Route::put('feedback/{id}', [FeedbackController::class, 'update'])->name('feedback.update');
    Route::delete('feedback/{id}', [FeedbackController::class, 'destroy'])->name('feedback.destroy');

    // Vehicle routes
    Route::get('vehicle', [VehicleController::class, 'index'])->name('vehicle.index');
    Route::post('vehicle', [VehicleController::class, 'store'])->name('vehicle.store');
    Route::get('vehicle/{id}', [VehicleController::class, 'show'])->name('vehicle.show');
    Route::put('vehicle/{id}', [VehicleController::class, 'update'])->name('vehicle.update');
    Route::delete('vehicle/{id}', [VehicleController::class, 'destroy'])->name('vehicle.destroy');
    // Soft delete routes
    Route::patch('vehicle/{id}/restore', [VehicleController::class, 'restore'])->name('vehicle.restore');
    Route::delete('vehicle/{id}/force', [VehicleController::class, 'forceDelete'])->name('vehicle.force-delete');
    Route::get('vehicle/trash', [VehicleController::class, 'trash'])->name('vehicle.trash');

    // // Named route for menu system
    // Route::get("{page}", [RouteController::class, 'routes'])->name('page.show')->where('page', '.*');

    // Notification Settings routes
// Notification Settings Routes
Route::get('notification-settings', [NotificationSettingsController::class, 'index'])->name('notification-settings.index');
Route::post('notification-settings', [NotificationSettingsController::class, 'store'])->name('notification-settings.store');
Route::get('notification-settings/{id}', [NotificationSettingsController::class, 'show'])->name('notification-settings.show');
Route::put('notification-settings/{id}', [NotificationSettingsController::class, 'update'])->name('notification-settings.update');
Route::delete('notification-settings/{id}', [NotificationSettingsController::class, 'destroy'])->name('notification-settings.destroy');

// Permission Settings Routes
Route::get('permission-settings', [PermissionSettingsController::class, 'index'])->name('permission-settings.index');
Route::post('permission-settings', [PermissionSettingsController::class, 'store'])->name('permission-settings.store');
Route::get('permission-settings/{id}', [PermissionSettingsController::class, 'show'])->name('permission-settings.show');
Route::put('permission-settings/{id}', [PermissionSettingsController::class, 'update'])->name('permission-settings.update');
Route::delete('permission-settings/{id}', [PermissionSettingsController::class, 'destroy'])->name('permission-settings.destroy');

// System Settings Routes
Route::get('system-settings', [SystemSettingsController::class, 'index'])->name('system-settings.index');
Route::put('system-settings/{id}', [SystemSettingsController::class, 'update'])->name('system-settings.update');

// Dashboard export routes
Route::get('dashboard/export/users/excel', [DashboardExportController::class, 'exportUsersToExcel'])->name('dashboard.export.users.excel');
Route::get('dashboard/export/users/pdf', [DashboardExportController::class, 'exportUsersToPDF'])->name('dashboard.export.users.pdf');

// Chat routes
Route::get('chat', [ChatController::class, 'index'])->name('chat.index');
Route::get('chat/messages/{userId}', [ChatController::class, 'getMessages'])->name('chat.messages');
Route::post('chat/send', [ChatController::class, 'sendMessage'])->name('chat.send');
Route::get('chat/unread-count', [ChatController::class, 'getUnreadCount'])->name('chat.unread-count');
Route::get('chat/notifications', [ChatController::class, 'getNotifications'])->name('chat.notifications');
Route::post('chat/notifications/{notificationId}/read', [ChatController::class, 'markNotificationAsRead'])->name('chat.markNotificationRead');
Route::post('chat/notifications/read-all', [ChatController::class, 'markAllNotificationsAsRead'])->name('chat.markAllNotificationsRead');
Route::get('chat/latest-message-sender', [ChatController::class, 'getLatestMessageSender'])->name('chat.latestMessageSender');

// Business routes
Route::get('business', [BusinessController::class, 'index'])->name('business.index');
Route::post('business', [BusinessController::class, 'store'])->name('business.store');
Route::get('business/{id}', [BusinessController::class, 'show'])->name('business.show');
Route::put('business/{id}', [BusinessController::class, 'update'])->name('business.update');
Route::delete('business/{id}', [BusinessController::class, 'destroy'])->name('business.destroy');

// Landlord routes
Route::get('landlord', [LandlordController::class, 'index'])->name('landlord.index');
Route::post('landlord', [LandlordController::class, 'store'])->name('landlord.store');
Route::get('landlord/{id}', [LandlordController::class, 'show'])->name('landlord.show');
Route::put('landlord/{id}', [LandlordController::class, 'update'])->name('landlord.update');
Route::delete('landlord/{id}', [LandlordController::class, 'destroy'])->name('landlord.destroy');
Route::put('landlord/{id}/status', [LandlordController::class, 'updateStatus'])->name('landlord.updateStatus');

// Landlord Management routes (Admin view of all applications)
Route::get('landlord-management', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'index'])->name('landlord-management.index');
Route::post('landlord-management', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'store'])->name('landlord-management.store');
Route::get('landlord-management/{id}', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'show'])->name('landlord-management.show');
Route::put('landlord-management/{id}', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'update'])->name('landlord-management.update');
Route::delete('landlord-management/{id}', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'destroy'])->name('landlord-management.destroy');
Route::put('landlord-management/{id}/status', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'updateStatus'])->name('landlord-management.updateStatus');
Route::post('landlord-management/{id}/approve', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'approve'])->name('landlord-management.approve');
Route::post('landlord-management/{id}/decline', [\App\Http\Controllers\landlordmanagement\LandlordManagementController::class, 'decline'])->name('landlord-management.decline');

// Landlord Permission routes (View approved landlords)
Route::get('landlord-permission', [\App\Http\Controllers\landlord_permission\LandlordPermissionController::class, 'index'])->name('landlord-permission.index');
Route::get('landlord-permission/{id}', [\App\Http\Controllers\landlord_permission\LandlordPermissionController::class, 'show'])->name('landlord-permission.show');
Route::post('landlord-permission/{id}/toggle-access', [\App\Http\Controllers\landlord_permission\LandlordPermissionController::class, 'toggleTenantAccess'])->name('landlord-permission.toggleAccess');

// Activity Logs routes
Route::get('activity-logs', [\App\Http\Controllers\activity_logs\ActivityLogsController::class, 'index'])->name('activity-logs.index');
Route::get('activity-logs/{id}', [\App\Http\Controllers\activity_logs\ActivityLogsController::class, 'show'])->name('activity-logs.show');

// Users Login routes
Route::get('users-login', [\App\Http\Controllers\users_login\UsersloginController::class, 'index'])->name('users-login.index');
Route::get('users-login/{id}', [\App\Http\Controllers\users_login\UsersloginController::class, 'show'])->name('users-login.show');

// Debug route to check modules and notification settings for business
Route::get('debug/business-notifications', function() {
    $modules = \App\Models\module::all();
    $businessModule = \App\Models\module::where('module_name', 'apply business')->first();
    $notificationSettings = \App\Models\notification_settings::with(['user', 'module'])->get();
    $businessNotificationSettings = $businessModule ? 
        \App\Models\notification_settings::where('module_id', $businessModule->id)
            ->where('status', 'active')
            ->with('user')
            ->get() : collect([]);
    
    return response()->json([
        'all_modules' => $modules->pluck('module_name', 'id'),
        'business_module' => $businessModule,
        'all_notification_settings_count' => $notificationSettings->count(),
        'business_notification_settings_count' => $businessNotificationSettings->count(),
        'users_with_business_notifications' => $businessNotificationSettings->map(function($s) {
            return [
                'user_id' => $s->user?->id,
                'user_name' => $s->user?->name,
                'user_email' => $s->user?->email,
                'status' => $s->status,
            ];
        }),
    ]);
});

// Fix business clearance paths - remove duplicate business-clearances/
Route::get('debug/fix-business-paths', function() {
    $businesses = \App\Models\business_management_list::whereNotNull('business_clearance')->get();
    $fixed = 0;
    $skipped = 0;
    
    foreach ($businesses as $business) {
        $originalPath = $business->business_clearance;
        
        // Check if path has duplicate "business-clearances/"
        if (strpos($originalPath, 'business-clearances/business-clearances/') !== false) {
            // Has duplicate, fix it
            $newPath = str_replace('business-clearances/business-clearances/', 'business-clearances/', $originalPath);
            
            $business->business_clearance = $newPath;
            $business->save();
            $fixed++;
        } else {
            // Already correct format
            $skipped++;
        }
    }
    
    return response()->json([
        'message' => "Fixed {$fixed} duplicate paths",
        'skipped' => "{$skipped} already correct",
        'total_businesses' => $businesses->count(),
        'note' => 'Database should store: business-clearances/filename.jpg'
    ]);
});
});

