<?php

namespace App\Http\Livewire\Dashboard;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use App\Models\User;
use App\Models\tbl_appointment;
use App\Models\appointment;
use App\Models\vehicle_management_list;
use App\Models\tbl_incident_report;
use App\Models\tbl_service_management_type;
use App\Models\tbl_service_management_category;
use App\Models\tbl_service_management_complaints;
use App\Models\tbl_announcement;
use App\Models\vehicle_homeowners;
use App\Models\applied_landlord;
use App\Models\business_management_list;

class Dashboard extends Component
{
    use WithPagination;
    
    public $perPage = 10;
    
    public function mount()
    {
        // Read per_page from URL query parameter
        $this->perPage = request()->get('per_page', 10);
    }
    
    public function render()
    {
        $currentUser = auth()->user();
        $userRole = strtolower($currentUser->role ?? '');
        
        $isHomeowner = $userRole === 'homeowner' || $userRole === 'home owners';
        $isNonHomeowner = $userRole === 'non-homeowner' || $userRole === 'non homeowner' || $userRole === 'non-homeowners' || $userRole === 'non home owners';
        $isSecurityPersonnel = $userRole === 'guard' || $userRole === 'security' || $userRole === 'security personnel' || $userRole === 'security guard';
        $isOperationalManager = $userRole === 'operational manager' || $userRole === 'operation manager' || $userRole === 'operations manager';
        $isServiceManager = $userRole === 'service manager' || $userRole === 'services manager';
        $isFinancialManager = $userRole === 'financial manager' || $userRole === 'finance manager';
        $isAppointmentCoordinator = $userRole === 'appointment coordinator' || $userRole === 'appointments coordinator';
        $isOccupancyManager = $userRole === 'occupancy manager' || $userRole === 'occupancies manager';
        
        // Get active announcements - Filter based on user role
        $announcementsQuery = tbl_announcement::where('status', 'active');
        
        // Non-homeowners can ONLY see public announcements
        if ($isNonHomeowner) {
            $announcementsQuery->where('visible_to', 'public');
        }
        
        $announcements = $announcementsQuery->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // If user is homeowner, show homeowner-specific dashboard
        if ($isHomeowner) {
            return $this->renderHomeownerDashboard($currentUser, $announcements);
        }
        
        // If user is non-homeowner, show non-homeowner-specific dashboard
        if ($isNonHomeowner) {
            return $this->renderNonHomeownerDashboard($currentUser, $announcements);
        }
        
        // If user is security personnel/guard, show security dashboard
        if ($isSecurityPersonnel) {
            return $this->renderSecurityPersonnelDashboard($currentUser, $announcements);
        }
        
        // If user is operational manager, show operational manager dashboard
        if ($isOperationalManager) {
            return $this->renderOperationalManagerDashboard($currentUser, $announcements);
        }
        
        // If user is service manager, show service manager dashboard
        if ($isServiceManager) {
            return $this->renderServiceManagerDashboard($currentUser, $announcements);
        }
        
        // If user is financial manager, show financial manager dashboard
        if ($isFinancialManager) {
            return $this->renderFinancialManagerDashboard($currentUser, $announcements);
        }
        
        // If user is appointment coordinator, show appointment coordinator dashboard
        if ($isAppointmentCoordinator) {
            return $this->renderAppointmentCoordinatorDashboard($currentUser, $announcements);
        }
        
        // If user is occupancy manager, show occupancy manager dashboard
        if ($isOccupancyManager) {
            return $this->renderOccupancyManagerDashboard($currentUser, $announcements);
        }
        
        // Get billing statistics - get actual values from database (for admin)
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
        
        // Get monthly service complaints data for chart
        $monthlyServiceComplaintsData = $this->getMonthlyData(tbl_service_management_complaints::class, 12);
        $monthlyApprovedComplaintsData = $this->getMonthlyData(tbl_service_management_complaints::class, 12, ['status' => 'approved']);
        
        // Get monthly appointments data for charts
        $monthlyAppointmentsData = $this->getMonthlyData(tbl_appointment::class, 12);
        
        // Get monthly vehicles data for charts
        $monthlyVehiclesData = $this->getMonthlyData(vehicle_management_list::class, 12);
        
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
            'recentUsers',
            'monthlyServiceComplaintsData',
            'monthlyApprovedComplaintsData',
            'monthlyAppointmentsData',
            'monthlyVehiclesData'
        ));
    }
    
    /**
     * Get monthly count data for a given model
     * 
     * @param string $modelClass The model class name
     * @param int $months Number of months to retrieve
     * @param array $conditions Additional where conditions
     * @return array Array of counts per month
     */
    private function getMonthlyData($modelClass, $months = 12, $conditions = [])
    {
        $data = [];
        $now = \Carbon\Carbon::now();
        
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();
            
            $query = $modelClass::whereBetween('created_at', [$startOfMonth, $endOfMonth]);
            
            // Apply additional conditions
            foreach ($conditions as $field => $value) {
                // Use case-insensitive matching for status field
                if ($field === 'status') {
                    $query->whereRaw('LOWER(' . $field . ') = ?', [strtolower($value)]);
                } else {
                    $query->where($field, $value);
                }
            }
            
            $data[] = $query->count();
        }
        
        return $data;
    }
    
    private function renderHomeownerDashboard($currentUser, $announcements)
    {
        // Get homeowner's billing history
        $recentBillings = tbl_billing_management::with(['billingItems'])
            ->where('user_id', $currentUser->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get recent appointments for the logged-in user
        $recentAppointments = \App\Models\appointment::with(['appointmentCategory', 'users'])
            ->where('users_id', $currentUser->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get homeowner's vehicles
        $userVehicles = vehicle_management_list::where('user_id', $currentUser->id)
            ->count();
        
        // Get approved vehicle registrations for alerts
        $approvedVehicles = \App\Models\vehicle_homeowners::with(['supportingDocuments', 'vehicleDetails'])
            ->where('user_id', $currentUser->id)
            ->where('status', 'Approved')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();
        
        // Get approved landlord applications
        $approvedLandlords = applied_landlord::where('submitted_by', $currentUser->id)
            ->where('status', 'Approved')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();
        
        // Check for overdue billings
        $overdueBillings = tbl_billing_management::where('user_id', $currentUser->id)
            ->where('status', '!=', 'approved')
            ->where('status', '!=', 'paid')
            ->get()
            ->filter(function($billing) {
                if (strpos($billing->billing_date, ' - ') !== false) {
                    $dateParts = explode(' - ', $billing->billing_date);
                    if (count($dateParts) >= 2) {
                        $endDate = trim($dateParts[1]);
                        try {
                            $billingEndDate = \Carbon\Carbon::parse($endDate);
                            return $billingEndDate->isPast();
                        } catch (\Exception $e) {
                            return false;
                        }
                    }
                }
                return false;
            });
        
        $hasOverdueBills = $overdueBillings->count() > 0;
        
        return view('livewire.dashboard.homeowner-dashboard', compact(
            'announcements',
            'recentBillings',
            'recentAppointments',
            'userVehicles',
            'hasOverdueBills',
            'approvedVehicles',
            'approvedLandlords',
            'currentUser'
        ));
    }
    
    private function renderNonHomeownerDashboard($currentUser, $announcements)
    {
        // Get non-homeowner's appointments for the logged-in user
        $recentAppointments = \App\Models\appointment::with(['appointmentCategory', 'users'])
            ->where('users_id', $currentUser->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get non-homeowner's vehicles
        $userVehicles = vehicle_management_list::where('user_id', $currentUser->id)
            ->count();
        
        // Get approved vehicle registrations for alerts
        $approvedVehicles = vehicle_homeowners::with(['supportingDocuments', 'vehicleDetails'])
            ->where('user_id', $currentUser->id)
            ->where('status', 'Approved')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();
        
        return view('livewire.dashboard.non-homeowners-dashboard', compact(
            'announcements',
            'recentAppointments',
            'userVehicles',
            'approvedVehicles',
            'currentUser'
        ));
    }
    
    private function renderSecurityPersonnelDashboard($currentUser, $announcements)
    {
        // Get recent service requests/complaints
        $recentServiceRequests = tbl_service_management_complaints::with(['user', 'serviceCategory.serviceType'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get recent incident reports with user relationship
        $recentIncidents = tbl_incident_report::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get total vehicles for monitoring
        $totalVehicles = vehicle_management_list::count();
        
        return view('livewire.dashboard.security-personnel-dashboard', compact(
            'announcements',
            'recentServiceRequests',
            'recentIncidents',
            'totalVehicles',
            'currentUser'
        ));
    }
    
    private function renderOperationalManagerDashboard($currentUser, $announcements)
    {
        // Get user statistics
        $totalUsers = User::count();
        $activeUsers = User::where('active', 1)->count();
        
        // Get gender statistics
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
        
        // Get email verification statistics
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $unverifiedUsers = User::whereNull('email_verified_at')->count();
        $emailVerificationRate = $totalUsers > 0 ? round(($verifiedUsers / $totalUsers) * 100, 1) : 0;
        
        // Get recent users
        $recentUsers = User::orderBy('created_at', 'desc')->paginate($this->perPage);
        
        return view('livewire.dashboard.operational-manager-dashboard', compact(
            'announcements',
            'totalUsers',
            'activeUsers',
            'genderStats',
            'genderPercentages',
            'totalUsersWithGender',
            'verifiedUsers',
            'unverifiedUsers',
            'emailVerificationRate',
            'recentUsers',
            'currentUser'
        ));
    }
    
    private function renderServiceManagerDashboard($currentUser, $announcements)
    {
        // Get user statistics
        $totalUsers = User::count();
        
        // Get service complaints statistics - case-insensitive matching
        $totalServiceComplaints = tbl_service_management_complaints::count();
        $approvedServiceComplaints = tbl_service_management_complaints::whereRaw('LOWER(status) = ?', ['approved'])->count();
        $declinedServiceComplaints = tbl_service_management_complaints::whereRaw('LOWER(status) = ?', ['declined'])->count();
        $serviceComplaintApprovalRate = $totalServiceComplaints > 0 ? round(($approvedServiceComplaints / $totalServiceComplaints) * 100, 1) : 0;
        
        // Get monthly service complaints data for chart
        $monthlyServiceComplaintsData = $this->getMonthlyData(tbl_service_management_complaints::class, 12);
        $monthlyApprovedComplaintsData = $this->getMonthlyData(tbl_service_management_complaints::class, 12, ['status' => 'approved']);
        
        // Get recent service requests
        $recentServiceRequests = tbl_service_management_complaints::with(['user', 'serviceCategory.serviceType'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        return view('livewire.dashboard.service-manager-dashboard', compact(
            'announcements',
            'totalUsers',
            'totalServiceComplaints',
            'approvedServiceComplaints',
            'declinedServiceComplaints',
            'serviceComplaintApprovalRate',
            'monthlyServiceComplaintsData',
            'monthlyApprovedComplaintsData',
            'recentServiceRequests',
            'currentUser'
        ));
    }
    
    private function renderFinancialManagerDashboard($currentUser, $announcements)
    {
        // Get user statistics
        $totalUsers = User::count();
        
        // Get billing statistics - case-insensitive matching
        $totalBillings = tbl_billing_management::count();
        $totalBillingItems = tbl_billing_management_list::count();
        $paidBillings = tbl_billing_management::whereRaw('LOWER(status) = ?', ['approved'])->count();
        
        // Count all pending billings (under review, sent to owners, pending, NULL, etc.)
        // Everything that's not approved/rejected is considered pending
        $pendingBillings = tbl_billing_management::where(function($query) {
            $query->whereNull('status')
                  ->orWhere(function($q) {
                      $q->whereNotNull('status')
                        ->whereRaw('LOWER(status) != ?', ['approved'])
                        ->whereRaw('LOWER(status) != ?', ['rejected']);
                  });
        })->count();
        
        $unpaidBillingItems = tbl_billing_management_list::whereRaw('LOWER(is_pay) = ? OR is_pay IS NULL', ['no'])->count();
        
        // Calculate percentages
        $paymentCompletionRate = $totalBillings > 0 ? round(($paidBillings / $totalBillings) * 100, 1) : 0;
        $pendingPaymentRate = $totalBillings > 0 ? round(($pendingBillings / $totalBillings) * 100, 1) : 0;
        $itemPaymentRate = $totalBillingItems > 0 ? round((($totalBillingItems - $unpaidBillingItems) / $totalBillingItems) * 100, 1) : 0;
        $unpaidItemRate = $totalBillingItems > 0 ? round(($unpaidBillingItems / $totalBillingItems) * 100, 1) : 0;
        
        // Get recent billings with pagination
        $recentBillings = tbl_billing_management::with(['user', 'billingItems'])
            ->orderBy('created_at', 'desc')
            ->paginate($this->perPage);
        
        return view('livewire.dashboard.financial-manager-dashboard', compact(
            'announcements',
            'totalUsers',
            'totalBillings',
            'totalBillingItems',
            'paidBillings',
            'pendingBillings',
            'unpaidBillingItems',
            'paymentCompletionRate',
            'pendingPaymentRate',
            'itemPaymentRate',
            'unpaidItemRate',
            'recentBillings',
            'currentUser'
        ));
    }
    
    private function renderAppointmentCoordinatorDashboard($currentUser, $announcements)
    {
        // Get user statistics
        $totalUsers = User::count();
        
        // Get appointment statistics (use 'appointment' model with relationships)
        $totalAppointments = appointment::count();
        
        // Get vehicle statistics
        $totalVehicles = vehicle_management_list::count();
        
        // Get monthly appointments data for charts
        $monthlyAppointmentsData = $this->getMonthlyData(appointment::class, 12);
        
        // Get monthly vehicles data for charts
        $monthlyVehiclesData = $this->getMonthlyData(vehicle_management_list::class, 12);
        
        // Get recent appointments with pagination (use 'appointment' model)
        $recentAppointments = appointment::with(['appointmentCategory', 'users'])
            ->orderBy('created_at', 'desc')
            ->paginate($this->perPage);
        
        return view('livewire.dashboard.appointment-coordinator-dashboard', compact(
            'announcements',
            'totalUsers',
            'totalAppointments',
            'totalVehicles',
            'monthlyAppointmentsData',
            'monthlyVehiclesData',
            'recentAppointments',
            'currentUser'
        ));
    }
    
    private function renderOccupancyManagerDashboard($currentUser, $announcements)
    {
        // Get user statistics
        $totalUsers = User::count();
        
        // Get establishment statistics (use business_management_list)
        $totalEstablishments = business_management_list::count();
        
        // Get appointment statistics
        $totalAppointments = appointment::count();
        
        // Get monthly appointments data for charts
        $monthlyAppointmentsData = $this->getMonthlyData(appointment::class, 12);
        
        // Get recent establishments with pagination
        $recentEstablishments = business_management_list::with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($this->perPage);
        
        return view('livewire.dashboard.occupancy-manager-dashboard', compact(
            'announcements',
            'totalUsers',
            'totalEstablishments',
            'totalAppointments',
            'monthlyAppointmentsData',
            'recentEstablishments',
            'currentUser'
        ));
    }
}
