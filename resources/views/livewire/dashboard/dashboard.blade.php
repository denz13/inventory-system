<div>
    {{-- Do your work, then step back. --}}
    <div class="grid grid-cols-12 gap-6">

    <!-- Alert Message - Active Announcements -->
        <div class="intro-y col-span-12 mt-6 -mb-6">
            @forelse($announcements as $announcement)
                <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
                    <div class="flex-1">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <div>
                                <span class="font-medium">{{ $announcement->type ? ucfirst($announcement->type) . ': ' : '' }}</span>
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
            @empty
                {{-- No announcements, show default message --}}
                <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
                    <span>Welcome to your Dashboard! Track your billing, service requests, appointments, and more in one place.</span>
                    <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            @endforelse
        </div>
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                    Dashboard
                </h2>
               
                <a href="" class="ml-auto flex items-center text-primary"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="refresh-ccw" data-lucide="refresh-ccw" class="lucide lucide-refresh-ccw w-4 h-4 mr-3"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 006 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0015 6.7l3-2.7"></path></svg> Reload Data </a>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="shopping-cart" data-lucide="shopping-cart" class="lucide lucide-shopping-cart report-box__icon text-primary"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></svg> 
                                <div class="ml-auto">
                                    <div class="report-box__indicator bg-success tooltip cursor-pointer"> {{ $itemPaymentRate }}% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg> </div>
                                </div>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalBillingItems) }}</div>
                            <div class="text-base text-slate-500 mt-1">Billing Items</div>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="credit-card" data-lucide="credit-card" class="lucide lucide-credit-card report-box__icon text-pending"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> 
                                <div class="ml-auto">
                                    <div class="report-box__indicator bg-success tooltip cursor-pointer"> {{ $paymentCompletionRate }}% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg> </div>
                                </div>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($paidBillings) }}</div>
                            <div class="text-base text-slate-500 mt-1">Approved Payments</div>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="monitor" data-lucide="monitor" class="lucide lucide-monitor report-box__icon text-warning"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> 
                                <div class="ml-auto">
                                    <div class="report-box__indicator bg-success tooltip cursor-pointer"> 12% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg> </div>
                                </div>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalUsers) }}</div>
                            <div class="text-base text-slate-500 mt-1">Total Users</div>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="settings" data-lucide="settings" class="lucide lucide-settings report-box__icon text-success"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> 
                                <div class="ml-auto">
                                    <div class="report-box__indicator bg-success tooltip cursor-pointer"> {{ $serviceComplaintApprovalRate }}% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg> </div>
                                </div>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalServiceComplaints) }}</div>
                            <div class="text-base text-slate-500 mt-1">Service Complaints</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: General Report -->
        <!-- BEGIN: Service Management Report -->
        <div class="col-span-12 lg:col-span-6 mt-8">
            <div class="intro-y block sm:flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                    Service Management
                </h2>
                <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="calendar" data-lucide="calendar" class="lucide lucide-calendar w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 
                    <input type="text" class="datepicker form-control sm:w-56 box pl-10">
                </div>
            </div>
            <div class="intro-y box p-5 mt-12 sm:mt-5">
                <div class="flex flex-col md:flex-row md:items-center">
                    <div class="flex">
                        <div>
                            <div class="text-primary dark:text-slate-300 text-lg xl:text-xl font-medium">{{ number_format($totalServiceComplaints) }}</div>
                            <div class="mt-0.5 text-slate-500">Total Complaints</div>
                        </div>
                        <div class="w-px h-12 border border-r border-dashed border-slate-200 dark:border-darkmode-300 mx-4 xl:mx-5"></div>
                        <div>
                            <div class="text-slate-500 text-lg xl:text-xl font-medium">{{ number_format($approvedServiceComplaints) }}</div>
                            <div class="mt-0.5 text-slate-500">Approved Complaints</div>
                        </div>
                    </div>
                    <div class="dropdown md:ml-auto mt-5 md:mt-0">
                        <button class="dropdown-toggle btn btn-outline-secondary font-normal" aria-expanded="false" data-tw-toggle="dropdown"> Complaint Status <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-down" data-lucide="chevron-down" class="lucide lucide-chevron-down w-4 h-4 ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
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
                        <canvas id="report-line-chart" class="mt-6 -mb-6" width="419" height="275" style="display: block; box-sizing: border-box; height: 275px; width: 419px;"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Service Management Report -->
        <!-- BEGIN: Weekly Top Seller -->
        <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div class="intro-y flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                    User Demographics
                </h2>
            </div>
            <div class="intro-y box p-5 mt-5">
                <div class="mt-3">
                    <div class="h-[213px]">
                        <canvas id="report-pie-chart" width="177" height="213" style="display: block; box-sizing: border-box; height: 213px; width: 177px;"></canvas>
                    </div>
                </div>
                <div class="w-52 sm:w-auto mx-auto mt-8">
                    @if(count($genderStats) > 0)
                        @php
                            $colors = ['bg-primary', 'bg-pending', 'bg-warning', 'bg-success', 'bg-danger'];
                            $colorIndex = 0;
                        @endphp
                        @foreach($genderStats as $gender => $count)
                            <div class="flex items-center {{ $loop->first ? '' : 'mt-4' }}">
                                <div class="w-2 h-2 {{ $colors[$colorIndex % count($colors)] }} rounded-full mr-3"></div>
                                <span class="truncate">{{ ucfirst($gender) }}</span> 
                                <span class="font-medium ml-auto">{{ $genderPercentages[$gender] }}%</span>
                            </div>
                            @php $colorIndex++; @endphp
                        @endforeach
                    @else
                        <div class="text-center text-slate-500">
                            <div class="text-sm">No gender data available</div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
        <!-- END: User Demographics -->
            <!-- BEGIN: Email Verification -->
            <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
                <div class="intro-y flex items-center h-10">
                    <h2 class="text-lg font-medium truncate mr-5">
                        Email Verification
                    </h2>
                    <a href="" class="ml-auto text-primary truncate">Show More</a> 
                </div>
                <div class="intro-y box p-5 mt-5">
                    <div class="mt-3">
                        <div class="h-[213px]">
                            <canvas id="report-donut-chart" width="177" height="213" style="display: block; box-sizing: border-box; height: 213px; width: 177px;"></canvas>
                        </div>
                    </div>
                    <div class="w-52 sm:w-auto mx-auto mt-8">
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                            <span class="truncate">Verified</span> <span class="font-medium ml-auto">{{ $emailVerificationRate }}%</span> 
                        </div>
                        <div class="flex items-center mt-4">
                            <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                            <span class="truncate">Unverified</span> <span class="font-medium ml-auto">{{ round(100 - $emailVerificationRate, 1) }}%</span> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Email Verification -->
        
        <!-- BEGIN: General Report -->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex items-center">
                        <div class="w-2/4 flex-none">
                            <div class="text-lg font-medium truncate">Pending Payments</div>
                            <div class="text-slate-500 mt-1">{{ number_format($pendingBillings) }} Under Review</div>
                        </div>
                        <div class="flex-none ml-auto relative">
                            <div class="w-[90px] h-[90px]">
                                <canvas id="report-donut-chart-1" width="90" height="90" style="display: block; box-sizing: border-box; height: 90px; width: 90px;"></canvas>
                            </div>
                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">{{ $paymentCompletionRate }}%</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex">
                        <div class="text-lg font-medium truncate mr-3">Appointments</div>
                        <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">{{ number_format($totalAppointments) }} Total</div>
                    </div>
                    <div class="mt-1">
                        <div class="h-[58px]">
                            <canvas class="simple-line-chart-1 -ml-1" width="423" height="58" style="display: block; box-sizing: border-box; height: 58px; width: 423px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex items-center">
                        <div class="w-2/4 flex-none">
                            <div class="text-lg font-medium truncate">Unpaid Items</div>
                            <div class="text-slate-500 mt-1">{{ number_format($unpaidBillingItems) }} Items</div>
                        </div>
                        <div class="flex-none ml-auto relative">
                            <div class="w-[90px] h-[90px]">
                                <canvas id="report-donut-chart-2" width="90" height="90" style="display: block; box-sizing: border-box; height: 90px; width: 90px;"></canvas>
                            </div>
                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">{{ $itemPaymentRate }}%</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex">
                        <div class="text-lg font-medium truncate mr-3">Vehicles</div>
                        <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">{{ number_format($totalVehicles) }} Registered</div>
                    </div>
                    <div class="mt-1">
                        <div class="h-[58px]">
                            <canvas class="simple-line-chart-1 -ml-1" width="423" height="58" style="display: block; box-sizing: border-box; height: 58px; width: 423px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: General Report -->
        <!-- BEGIN: Weekly Top Products -->
        <div class="col-span-12 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                    Recent Users
                </h2>
                <div class="flex items-center sm:ml-auto mt-3 sm:mt-0">
                    <a href="{{ route('dashboard.export.users.excel') }}" class="btn box flex items-center text-slate-600 dark:text-slate-300"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="file-text" data-lucide="file-text" class="lucide lucide-file-text hidden sm:block w-4 h-4 mr-2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg> Export to Excel </a>
                    <a href="{{ route('dashboard.export.users.pdf') }}" class="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="file-text" data-lucide="file-text" class="lucide lucide-file-text hidden sm:block w-4 h-4 mr-2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg> Export to PDF </a>
                </div>
            </div>
            <div class="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                <table class="table table-report sm:mt-2">
                    <thead>
                        <tr>
                            <th class="whitespace-nowrap">AVATAR</th>
                            <th class="whitespace-nowrap">USER NAME</th>
                            <th class="text-center whitespace-nowrap">EMAIL</th>
                            <th class="text-center whitespace-nowrap">STATUS</th>
                            <th class="text-center whitespace-nowrap">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($recentUsers as $user)
                        <tr class="intro-x">
                            <td class="w-40">
                                <div class="w-10 h-10 image-fit zoom-in">
                                    <img alt="{{ $user->name }}" class="tooltip rounded-full" src="{{ $user->photo_url }}">
                                </div>
                            </td>
                            <td>
                                <a href="" class="font-medium whitespace-nowrap">{{ $user->name }}</a> 
                                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ ucfirst($user->role ?? 'User') }}</div>
                            </td>
                            <td class="text-center">{{ $user->email }}</td>
                            <td class="w-40">
                                <div class="flex items-center justify-center {{ $user->active ? 'text-success' : 'text-danger' }}"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg> 
                                    {{ $user->active ? 'Active' : 'Inactive' }} 
                                </div>
                            </td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href=""> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg> Edit 
                                    </a>
                                    <a class="flex items-center text-danger" href=""> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete 
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr class="intro-x">
                            <td colspan="5" class="text-center py-8 text-slate-500">
                                No users found
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <!-- BEGIN: Pagination -->
            <x-pagination 
                :current-page="$recentUsers->currentPage()" 
                :total-pages="$recentUsers->lastPage()" 
                :per-page="$recentUsers->perPage()" 
                :show-per-page-selector="true" 
                :show-first-last="true" 
            />
            <!-- END: Pagination -->
        </div>
        <!-- END: Recent Users -->
    </div>

    <!-- Pass gender data to JavaScript -->
    <script>
        window.genderStats = @json($genderStats);
        
        // Pass email verification data to JavaScript
        window.emailVerificationStats = {
            'Verified': {{ $verifiedUsers }},
            'Unverified': {{ $unverifiedUsers }}
        };
        
        // Pass service management data to JavaScript
        window.serviceManagementStats = {
            totalComplaints: {{ $totalServiceComplaints }},
            approvedComplaints: {{ $approvedServiceComplaints }},
            declinedComplaints: {{ $declinedServiceComplaints }},
            totalServiceTypes: {{ $totalServiceTypes }},
            totalServiceCategories: {{ $totalServiceCategories }}
        };
    </script>

</div>

