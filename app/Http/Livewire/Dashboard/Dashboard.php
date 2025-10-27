<?php

namespace App\Http\Livewire\Dashboard;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use App\Models\User;
use App\Models\tbl_appointment;
use App\Models\vehicle_management_list;
use App\Models\tbl_incident_report;
use App\Models\tbl_service_management_type;
use App\Models\tbl_service_management_category;
use App\Models\tbl_service_management_complaints;
use App\Models\tbl_announcement;

class Dashboard extends Component
{
    use WithPagination;
    
    public $perPage = 10;
    
    public function updatingPerPage()
    {
        $this->resetPage();
    }
    
    public function render()
    {
        // Get active announcements
        $announcements = tbl_announcement::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get billing statistics - get actual values from database
        $totalBillings = tbl_billing_management::count();
        
        // Get all unique status values from the database
        $statusValues = tbl_billing_management::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->pluck('status')
            ->toArray();
        
        // Count billings for each status dynamically
        $paidBillings = 0;
        $pendingBillings = 0;
        $rejectedBillings = 0;
        $totalAmountPaid = 0;
        $totalAmountPending = 0;
        
        foreach ($statusValues as $status) {
            $count = tbl_billing_management::where('status', $status)->count();
            $amount = tbl_billing_management::where('status', $status)->sum('amount_due');
            
            // Categorize statuses dynamically
            if (strtolower($status) === 'approved' || strtolower($status) === 'paid' || strtolower($status) === 'completed') {
                $paidBillings += $count;
                $totalAmountPaid += $amount;
            } elseif (strtolower($status) === 'rejected' || strtolower($status) === 'declined' || strtolower($status) === 'cancelled') {
                $rejectedBillings += $count;
            } else {
                // Everything else is considered pending (sent to owners, under review, etc.)
                $pendingBillings += $count;
                $totalAmountPending += $amount;
            }
        }
        
        // Get billing items statistics - get actual values from database
        $totalBillingItems = tbl_billing_management_list::count();
        
        // Get all unique is_pay values from the database
        $isPayValues = tbl_billing_management_list::select('is_pay')
            ->distinct()
            ->whereNotNull('is_pay')
            ->pluck('is_pay')
            ->toArray();
        
        // Count items for each is_pay value dynamically
        $paidBillingItems = 0;
        $unpaidBillingItems = 0;
        
        foreach ($isPayValues as $value) {
            $count = tbl_billing_management_list::where('is_pay', $value)->count();
            // Consider any value that indicates payment as "paid"
            if (strtolower($value) === 'yes' || strtolower($value) === 'paid' || strtolower($value) === '1' || strtolower($value) === 'true') {
                $paidBillingItems += $count;
            } else {
                $unpaidBillingItems += $count;
            }
        }
        
        // Get other statistics
        $totalUsers = User::count();
        $totalAppointments = tbl_appointment::count();
        $totalVehicles = vehicle_management_list::count();
        
        // Get recent users with pagination
        $recentUsers = User::orderBy('created_at', 'desc')->paginate($this->perPage);
        
        // Get email verification statistics
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $unverifiedUsers = User::whereNull('email_verified_at')->count();
        $emailVerificationRate = $totalUsers > 0 ? round(($verifiedUsers / $totalUsers) * 100, 1) : 0;
        
        // Get service management statistics
        $totalServiceTypes = tbl_service_management_type::count();
        $totalServiceCategories = tbl_service_management_category::count();
        $totalServiceComplaints = tbl_service_management_complaints::count();
        $approvedServiceComplaints = tbl_service_management_complaints::where('status', 'approved')->count();
        $declinedServiceComplaints = tbl_service_management_complaints::where('status', 'declined')->count();
        $serviceComplaintApprovalRate = $totalServiceComplaints > 0 ? round(($approvedServiceComplaints / $totalServiceComplaints) * 100, 1) : 0;
        
        // Get gender statistics from users
        $genderStats = User::select('gender')
            ->selectRaw('COUNT(*) as count')
            ->whereNotNull('gender')
            ->groupBy('gender')
            ->get()
            ->pluck('count', 'gender')
            ->toArray();
        
        // Calculate gender percentages
        $totalUsersWithGender = array_sum($genderStats);
        $genderPercentages = [];
        foreach ($genderStats as $gender => $count) {
            $genderPercentages[$gender] = $totalUsersWithGender > 0 ? round(($count / $totalUsersWithGender) * 100, 1) : 0;
        }
        
        // Calculate accurate percentages based on actual data
        $paymentCompletionRate = $totalBillings > 0 ? round(($paidBillings / $totalBillings) * 100, 1) : 0;
        $itemPaymentRate = $totalBillingItems > 0 ? round(($paidBillingItems / $totalBillingItems) * 100, 1) : 0;
        
        // Additional percentage calculations for better insights
        $pendingRate = $totalBillings > 0 ? round(($pendingBillings / $totalBillings) * 100, 1) : 0;
        $rejectedRate = $totalBillings > 0 ? round(($rejectedBillings / $totalBillings) * 100, 1) : 0;
        $unpaidItemRate = $totalBillingItems > 0 ? round(($unpaidBillingItems / $totalBillingItems) * 100, 1) : 0;
        
        return view('livewire.dashboard.dashboard', compact(
            'announcements',
            'totalBillings',
            'paidBillings', 
            'pendingBillings',
            'rejectedBillings',
            'totalAmountPaid',
            'totalAmountPending',
            'totalBillingItems',
            'paidBillingItems',
            'unpaidBillingItems',
            'totalUsers',
            'totalAppointments',
            'totalVehicles',
            'paymentCompletionRate',
            'itemPaymentRate',
            'pendingRate',
            'rejectedRate',
            'unpaidItemRate',
            'genderStats',
            'genderPercentages',
            'totalUsersWithGender',
            'verifiedUsers',
            'unverifiedUsers',
            'emailVerificationRate',
            'totalServiceTypes',
            'totalServiceCategories',
            'totalServiceComplaints',
            'approvedServiceComplaints',
            'declinedServiceComplaints',
            'serviceComplaintApprovalRate',
            'recentUsers'
        ));
    }
}
