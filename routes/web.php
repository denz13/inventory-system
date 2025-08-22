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
use App\Http\Controllers\forgotpassword\ForgotPasswordController;
use App\Http\Controllers\otp\OtpController;
use App\Http\Controllers\newpassword\NewPasswordController;

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
});

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

// Protected routes
Route::middleware('auth')->group(function() {
    Route::get('logout', [AuthController::class, 'logout'])->name('logout');
    
    // Dashboard route (specific route before wildcard)
    Route::get('dashboard', [RouteController::class, 'index'])->name('dashboard');
    
    // User Management routes
    Route::get('user-management', [UserManagamentController::class, 'index'])->name('usermanagement.index');
    Route::get('user-management/create', [UserManagamentController::class, 'create'])->name('usermanagement.create');
    Route::post('user-management', [UserManagamentController::class, 'store'])->name('usermanagement.store');
    Route::get('user-management/{user}', [UserManagamentController::class, 'show'])->name('usermanagement.show');
    Route::get('user-management/{user}/edit', [UserManagamentController::class, 'edit'])->name('usermanagement.edit');
    Route::put('user-management/{user}', [UserManagamentController::class, 'update'])->name('usermanagement.update');
    Route::delete('user-management/{user}', [UserManagamentController::class, 'destroy'])->name('usermanagement.destroy');

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
    Route::put('appointment-management/{id}/status', [AppointmentManagementController::class, 'updateStatus'])->name('appointment-management.updateStatus');
    Route::delete('appointment-management/{id}', [AppointmentManagementController::class, 'destroy'])->name('appointment-management.destroy');

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

    
    // // Named route for menu system
    // Route::get("{page}", [RouteController::class, 'routes'])->name('page.show')->where('page', '.*');
});

