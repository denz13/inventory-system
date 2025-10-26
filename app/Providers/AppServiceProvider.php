<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Livewire\Livewire;
use App\Http\Livewire\Pages\FAQS\FAQLayout1;
use App\Http\Livewire\Pages\FAQS\FAQLayout2;
use App\Http\Livewire\Pages\FAQS\FAQLayout3;
use App\Models\tbl_announcement;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Livewire::component('pages.faqs.faqlayout1', FAQLayout1::class);
        Livewire::component('pages.faqs.faqlayout2', FAQLayout2::class);
        Livewire::component('pages.faqs.faqlayout3', FAQLayout3::class);
        
        // Register Inventory components
        Livewire::component('inventory.entrydata', \App\Http\Livewire\Inventory\Entrydata::class);
        
        // Share active announcements with all views
        View::composer('*', function ($view) {
            $activeAnnouncements = tbl_announcement::where('status', 'Active')
                ->whereIn('visible_to', ['public', 'private'])
                ->orderBy('created_at', 'desc')
                ->take(5) // Limit to 5 most recent announcements
                ->get();
            
            $view->with('activeAnnouncements', $activeAnnouncements);
        });
        
        // Share breadcrumbs with all views
        View::composer('*', function ($view) {
            $breadcrumbs = $this->generateBreadcrumbs();
            $view->with('breadcrumbs', $breadcrumbs);
        });
    }
    
    /**
     * Generate breadcrumbs based on current route
     *
     * @return array
     */
    protected function generateBreadcrumbs()
    {
        $routeName = request()->route() ? request()->route()->getName() : '';
        $currentPath = request()->path();
        
        // Default breadcrumb
        $breadcrumbs = [
            ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
            ['title' => 'Home Owners Association Inc.', 'url' => null]
        ];
        
        // Breadcrumb mapping based on routes
        $breadcrumbMap = [
            // Dashboard
            'dashboard' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Dashboard', 'url' => null]
            ],
            
            // Messages
            'chat.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Message', 'url' => null]
            ],
            
            // Feedback
            'feedback.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Feedback', 'url' => null]
            ],
            
            // Vehicle
            'vehicle.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Vehicle', 'url' => null]
            ],
            
            // Apply Business
            'business.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Apply Business', 'url' => null]
            ],
            
            // Apply Landlord
            'landlord.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Apply Landlord', 'url' => null]
            ],
            
            // Apply Appointment
            'apply-appointment.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Apply Appointment', 'url' => null]
            ],
            
            // Billing Payment
            'billing-payment.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Billing Payment', 'url' => null]
            ],
            
            // Service Request (Complaints)
            'complaints.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Service Request', 'url' => null]
            ],
            
            // Incident Report
            'incident.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Incident Report', 'url' => null]
            ],
            
            // Information Management
            'usermanagement.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'User Management', 'url' => null]
            ],
            
            'businessmanagement.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Establishment Management', 'url' => null]
            ],
            
            'vehiclemanagement.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Vehicle Management', 'url' => null]
            ],
            
            'service-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Service Management', 'url' => null]
            ],
            
            'incident-report-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Incident Management', 'url' => null]
            ],
            
            'announcement.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Announcement', 'url' => null]
            ],
            
            'billing-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Billing Management', 'url' => '#'],
                ['title' => 'Create Billing', 'url' => null]
            ],
            
            'list-payments.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Billing Management', 'url' => '#'],
                ['title' => 'List of Payments', 'url' => null]
            ],
            
            'bank-account.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Payment Account Management', 'url' => null]
            ],
            
            'feedback-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Feedback Management', 'url' => null]
            ],
            
            'appointment-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Appointment Management', 'url' => null]
            ],
            
            'chatbot.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Guest Chatbot', 'url' => null]
            ],
            
            'landlord-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Landlord Management', 'url' => null]
            ],
            
            'calendar.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Information', 'url' => '#'],
                ['title' => 'Calendar', 'url' => null]
            ],
            
            // Settings
            'notification-settings.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'Notification Settings', 'url' => null]
            ],
            
            'system-settings.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'System Settings', 'url' => null]
            ],
            
            'permission-settings.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'Permission Settings', 'url' => null]
            ],
            
            'landlord-permission.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'Landlord Permissions', 'url' => null]
            ],
            
            'appointment-category.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'Appointment Category', 'url' => null]
            ],
            
            'appointment-allowing.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Settings', 'url' => '#'],
                ['title' => 'Appointment Allow Schedule', 'url' => null]
            ],
            
            // Activity Records
            'activity-logs.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Activity Records', 'url' => '#'],
                ['title' => 'Activity Logs', 'url' => null]
            ],
            
            'users-login.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Activity Records', 'url' => '#'],
                ['title' => 'Users Login', 'url' => null]
            ],
            
            // Profile Management
            'profile-management.index' => [
                ['title' => 'Golden Country Homes', 'url' => url('dashboard')],
                ['title' => 'Profile Management', 'url' => null]
            ],
        ];
        
        // Return breadcrumb for current route or default
        if (isset($breadcrumbMap[$routeName])) {
            return $breadcrumbMap[$routeName];
        }
        
        return $breadcrumbs;
    }
}
