<div>
    <div class="grid grid-cols-12 gap-6">
        <!-- Advisory Banner -->
        @forelse($announcements->take(1) as $announcement)
        <div class="col-span-12 mt-6">
            <div class="alert alert-dismissible show box bg-primary text-white flex items-center" role="alert" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);">
                <div class="flex-1">
                    <div class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div>
                            <span class="font-medium">{{ $announcement->type ? ucfirst($announcement->type) . ': ' : 'Advisory: ' }}</span>
                            <span>{{ $announcement->description }}</span>
                            <div class="text-xs text-white/80 mt-1">
                                Posted {{ $announcement->created_at ? $announcement->created_at->diffForHumans() : 'recently' }}
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        @empty
        @endforelse

        <!-- Main Dashboard Grid -->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
            <!-- Left Side: KPIs and Charts -->
            <div class="col-span-12 lg:col-span-6">
                <!-- KPI Cards Row -->
                <div class="grid grid-cols-12 gap-6">
                    <!-- Total Users Card -->
                    <div class="col-span-12 sm:col-span-6 intro-y">
                        <div class="report-box zoom-in">
                            <div class="box p-5">
                                <div class="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="report-box__icon text-warning">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                    <div class="ml-auto">
                                        <div class="report-box__indicator bg-success tooltip cursor-pointer">12% 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-0.5">
                                                <polyline points="18 15 12 9 6 15"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalUsers) }}</div>
                                <div class="text-base text-slate-500 mt-1">Total Users</div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Appointments Card -->
                    <div class="col-span-12 sm:col-span-6 intro-y">
                        <div class="report-box zoom-in">
                            <div class="box p-5">
                                <div class="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="report-box__icon text-warning">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                    <div class="ml-auto">
                                        <div class="report-box__indicator bg-success tooltip cursor-pointer">12% 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-0.5">
                                                <polyline points="18 15 12 9 6 15"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalAppointments) }}</div>
                                <div class="text-base text-slate-500 mt-1">Total Appointment</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-12 gap-6 mt-6">
                    <!-- Appointments Chart -->
                    <div class="col-span-12 sm:col-span-6 intro-y">
                        <div class="box p-5 zoom-in">
                            <div class="flex">
                                <div class="text-lg font-medium truncate mr-3">Appointments</div>
                                <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 text-slate-500 cursor-pointer ml-auto truncate">{{ number_format($totalAppointments) }} Total</div>
                            </div>
                            <div class="mt-1">
                                <div class="h-[58px]">
                                    <canvas class="simple-line-chart-1 -ml-1" width="423" height="58"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicles Chart -->
                    <div class="col-span-12 sm:col-span-6 intro-y">
                        <div class="box p-5 zoom-in">
                            <div class="flex">
                                <div class="text-lg font-medium truncate mr-3">Vehicles</div>
                                <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 text-slate-500 cursor-pointer ml-auto truncate">{{ number_format($totalVehicles) }} Registered</div>
                            </div>
                            <div class="mt-1">
                                <div class="h-[58px]">
                                    <canvas class="simple-line-chart-1 -ml-1" width="423" height="58"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Appointments Table -->
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y block sm:flex items-center h-10">
                    <h2 class="text-lg font-medium truncate mr-5">Appointments</h2>
                    <a href="" class="ml-auto flex items-center text-primary" onclick="location.reload(); return false;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-3">
                            <path d="M3 2v6h6"></path>
                            <path d="M21 12A9 9 0 006 5.3L3 8"></path>
                            <path d="M21 22v-6h-6"></path>
                            <path d="M3 12a9 9 0 0015 6.7l3-2.7"></path>
                        </svg>
                        Reload Data
                    </a>
                </div>
                
                <div class="intro-y mt-8 sm:mt-0" style="overflow-x: auto; overflow-y: visible;">
                    <table class="table table-report sm:mt-2" style="min-width: 100%;">
                        <thead>
                            <tr>
                                <th class="whitespace-nowrap">TRACKING NUMBER</th>
                                <th class="whitespace-nowrap" style="min-width: 150px;">DESCRIPTION</th>
                                <th class="whitespace-nowrap">DATE & TIME</th>
                                <th class="text-center whitespace-nowrap">STATUS</th>
                                <th class="text-center whitespace-nowrap">CREATED</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($recentAppointments as $appointment)
                            <tr class="intro-x">
                                <td class="whitespace-nowrap">
                                    <div class="font-medium text-primary">{{ $appointment->tracking_number ?? 'N/A' }}</div>
                                </td>
                                <td>
                                    <div class="font-medium" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="{{ $appointment->description ?? 'N/A' }}">
                                        {{ $appointment->description ?? 'N/A' }}
                                    </div>
                                </td>
                                <td class="whitespace-nowrap">
                                    <div class="text-slate-600">
                                        {{ $appointment->appointment_date ? \Carbon\Carbon::parse($appointment->appointment_date)->format('M d, Y g:i A') : 'N/A' }}
                                    </div>
                                </td>
                                <td class="w-40">
                                    <div class="flex items-center justify-center 
                                        @if($appointment->status === 'Approved') text-success
                                        @elseif($appointment->status === 'Cancelled') text-danger
                                        @elseif($appointment->status === 'Completed') text-primary
                                        @else text-warning
                                        @endif">
                                        @if($appointment->status === 'Approved')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                <polyline points="9 11 12 14 22 4"></polyline>
                                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                            </svg>
                                        @elseif($appointment->status === 'Cancelled')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                        @elseif($appointment->status === 'Completed')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                <polyline points="9 11 12 14 22 4"></polyline>
                                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                            </svg>
                                        @else
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 6v6l4 2"></path>
                                            </svg>
                                        @endif
                                        {{ $appointment->status ?? 'Pending' }}
                                    </div>
                                </td>
                                <td class="text-center">
                                    <div class="text-slate-500 text-xs">
                                        {{ $appointment->created_at ? $appointment->created_at->format('M d, Y') : 'N/A' }}
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr class="intro-x">
                                <td colspan="5" class="text-center py-8 text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <div class="font-medium">No appointments</div>
                                    <div class="text-sm">No appointment records found</div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                
                @if($recentAppointments->isNotEmpty())
                <div class="text-center mt-4">
                    <a href="/appointment" class="btn btn-outline-secondary btn-sm">
                        Manage Appointments
                    </a>
                </div>
                @endif
                
                <!-- BEGIN: Pagination -->
                <x-pagination 
                    :current-page="$recentAppointments->currentPage()" 
                    :total-pages="$recentAppointments->lastPage()" 
                    :per-page="$recentAppointments->perPage()" 
                    :show-per-page-selector="true" 
                    :show-first-last="true" 
                />
                <!-- END: Pagination -->
            </div>
        </div>
    </div>
    
    <!-- Pass data to JavaScript for charts -->
    <script>
        // Appointments monthly data for simple line charts
        window.appointmentsMonthlyData = @json($monthlyAppointmentsData);
        
        // Vehicles monthly data for simple line charts
        window.vehiclesMonthlyData = @json($monthlyVehiclesData);
    </script>
</div>

