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
            <div class="intro-y flex items-center h-10">
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
            
            <div class="grid grid-cols-12 gap-6 mt-5">
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

                <!-- Service Complaints Card -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="report-box__icon text-success">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                <div class="ml-auto">
                                    <div class="report-box__indicator bg-success tooltip cursor-pointer">{{ $serviceComplaintApprovalRate }}% 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-0.5">
                                            <polyline points="18 15 12 9 6 15"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalServiceComplaints) }}</div>
                            <div class="text-base text-slate-500 mt-1">Service Complaints</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Management and Service Request Grid -->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
            <!-- Service Management Section -->
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y block sm:flex items-center h-10">
                    <h2 class="text-lg font-medium truncate mr-5">Service Management</h2>
                </div>
                <div class="intro-y box p-5 mt-12 sm:mt-5">
                    <div class="flex flex-col md:flex-row md:items-center">
                        <div class="flex">
                            <div>
                                <div class="text-primary text-lg xl:text-xl font-medium">{{ number_format($totalServiceComplaints) }}</div>
                                <div class="mt-0.5 text-slate-500">Total Complaints</div>
                            </div>
                            <div class="w-px h-12 border border-r border-dashed border-slate-200 mx-4 xl:mx-5"></div>
                            <div>
                                <div class="text-slate-500 text-lg xl:text-xl font-medium">{{ number_format($approvedServiceComplaints) }}</div>
                                <div class="mt-0.5 text-slate-500">Approved Complaints</div>
                            </div>
                        </div>
                        <div class="dropdown md:ml-auto mt-5 md:mt-0">
                            <button class="dropdown-toggle btn btn-outline-secondary font-normal" aria-expanded="false" data-tw-toggle="dropdown">
                                Complaint Status 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <div class="dropdown-menu w-40">
                                <ul class="dropdown-content overflow-y-auto h-32">
                                    <li><a href="" class="dropdown-item">Approved: {{ $approvedServiceComplaints }}</a></li>
                                    <li><a href="" class="dropdown-item">Declined: {{ $declinedServiceComplaints }}</a></li>
                                    <li><a href="" class="dropdown-item">Total: {{ $totalServiceComplaints }}</a></li>
                                    <li><a href="" class="dropdown-item">Approval Rate: {{ $serviceComplaintApprovalRate }}%</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="report-chart">
                        <div class="h-[275px]">
                            <canvas id="report-line-chart" class="mt-6 -mb-6" width="419" height="275"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Service Request Section -->
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y flex items-center h-10">
                    <h2 class="text-lg font-medium truncate mr-5">Service Request</h2>
                </div>
                <div class="intro-y box p-5 mt-12 sm:mt-5">
                    <div class="overflow-x-auto">
                        <table class="table table-report w-full">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap">TYPE</th>
                                    <th class="whitespace-nowrap">DESCRIPTION</th>
                                    <th class="whitespace-nowrap">STATUS</th>
                                    <th class="text-center whitespace-nowrap">DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($recentServiceRequests as $request)
                                <tr class="intro-x">
                                    <td class="w-32">
                                        <div class="font-medium">{{ $request->serviceCategory->serviceType->type ?? 'Complaint' }}</div>
                                    </td>
                                    <td>
                                        <div class="text-slate-600 text-sm" style="word-wrap: break-word; overflow-wrap: break-word;">
                                            {{ \Illuminate\Support\Str::limit($request->complaint_description ?? 'No description provided', 80) }}
                                        </div>
                                    </td>
                                    <td class="w-32">
                                        @php
                                            $statusColor = 'bg-warning text-white';
                                            if (strtolower($request->status ?? 'pending') === 'approved') {
                                                $statusColor = 'bg-success text-white';
                                            } elseif (strtolower($request->status ?? 'pending') === 'declined') {
                                                $statusColor = 'bg-danger text-white';
                                            }
                                        @endphp
                                        <span class="px-2 py-1 rounded text-xs {{ $statusColor }}">
                                            {{ ucfirst($request->status ?? 'Pending') }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <div class="text-slate-500 text-xs">
                                            {{ $request->created_at ? $request->created_at->format('M d, Y g:i A') : 'N/A' }}
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="4" class="text-center py-8 text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                        <div class="font-medium">No service requests</div>
                                        <div class="text-sm">No service requests at this time</div>
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    
                    @if($recentServiceRequests->isNotEmpty())
                    <div class="text-center mt-4 pt-4 border-t border-slate-200">
                        <a href="/service-management" class="btn btn-outline-secondary btn-sm">
                            Manage Service Request
                        </a>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Pass service management data to JavaScript for charts -->
    <script>
        window.serviceManagementStats = {
            totalComplaints: {{ $totalServiceComplaints }},
            approvedComplaints: {{ $approvedServiceComplaints }},
            declinedComplaints: {{ $declinedServiceComplaints }},
            totalServiceTypes: 0,
            totalServiceCategories: 0,
            monthlyData: @json($monthlyServiceComplaintsData),
            monthlyApprovedData: @json($monthlyApprovedComplaintsData)
        };
    </script>
</div>

