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

        <!-- KPI Section -->
        <div class="col-span-12 mt-8">
            <div class="grid grid-cols-12 gap-6">
                <!-- Total Users Card -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
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

                <!-- Total Establishments Card -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
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
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalEstablishments) }}</div>
                            <div class="text-base text-slate-500 mt-1">Total Establishments</div>
                        </div>
                    </div>
                </div>

                <!-- Business Appointments Chart -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="box p-5 zoom-in">
                        <div class="flex">
                            <div class="text-lg font-medium truncate mr-3">Business Appointments</div>
                            <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 text-slate-500 cursor-pointer ml-auto truncate">{{ number_format($totalAppointments) }} Total</div>
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

        <!-- Establishments Table -->
        <div class="col-span-12 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">Establishments</h2>
            </div>
            
            <div class="intro-y mt-8 sm:mt-0" style="overflow-x: auto;">
                <table class="table table-report sm:mt-2">
                    <thead>
                        <tr>
                            <th class="whitespace-nowrap">BUSINESS NAME</th>
                            <th class="whitespace-nowrap">TYPE</th>
                            <th class="whitespace-nowrap">OWNER</th>
                            <th class="text-center whitespace-nowrap">USER ID</th>
                            <th class="whitespace-nowrap">ADDRESS</th>
                            <th class="text-center whitespace-nowrap">CLEARANCE</th>
                            <th class="text-center whitespace-nowrap">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($recentEstablishments as $establishment)
                        <tr class="intro-x">
                            <td>
                                <div class="font-medium">{{ $establishment->business_name ?? 'N/A' }}</div>
                            </td>
                            <td>
                                <div class="text-slate-600">{{ $establishment->type_of_business ?? 'N/A' }}</div>
                            </td>
                            <td>
                                <div class="font-medium">{{ $establishment->user->name ?? '' }}</div>
                            </td>
                            <td class="text-center">
                                <div class="text-slate-600">{{ $establishment->user_id ?? 'N/A' }}</div>
                            </td>
                            <td>
                                <div class="text-slate-600" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="{{ $establishment->address ?? 'N/A' }}">
                                    {{ $establishment->address ?? 'N/A' }}
                                </div>
                            </td>
                            <td class="text-center">
                                @if($establishment->business_clearance && !empty(trim($establishment->business_clearance)))
                                    <a href="{{ asset('storage/' . $establishment->business_clearance) }}" target="_blank" class="flex items-center justify-center text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                        View
                                    </a>
                                @else
                                    <span class="text-slate-400 text-xs">No file</span>
                                @endif
                            </td>
                            <td class="w-40">
                                <div class="flex items-center justify-center 
                                    @if($establishment->status === 'Approved') text-success
                                    @elseif($establishment->status === 'Declined' || $establishment->status === 'Rejected') text-danger
                                    @else text-warning
                                    @endif">
                                    @if($establishment->status === 'Approved')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                    @elseif($establishment->status === 'Declined' || $establishment->status === 'Rejected')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                        </svg>
                                    @else
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M12 6v6l4 2"></path>
                                        </svg>
                                    @endif
                                    {{ $establishment->status ?? 'Pending' }}
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr class="intro-x">
                            <td colspan="7" class="text-center py-8 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"></path>
                                </svg>
                                <div class="font-medium">No establishments</div>
                                <div class="text-sm">No establishment records found</div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            @if($recentEstablishments->isNotEmpty())
            <div class="text-right mt-4">
                <a href="/landlord" class="btn btn-outline-secondary btn-sm">
                    Manage Appointments
                </a>
            </div>
            @endif
            
            <!-- BEGIN: Pagination -->
            <x-pagination 
                :current-page="$recentEstablishments->currentPage()" 
                :total-pages="$recentEstablishments->lastPage()" 
                :per-page="$recentEstablishments->perPage()" 
                :show-per-page-selector="true" 
                :show-first-last="true" 
            />
            <!-- END: Pagination -->
        </div>
    </div>
    
    <!-- Pass data to JavaScript for charts -->
    <script>
        // Appointments monthly data for simple line charts
        window.appointmentsMonthlyData = @json($monthlyAppointmentsData);
    </script>
</div>

