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
                <h2 class="text-lg font-medium truncate mr-5">Dashboard</h2>
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

                <!-- Active Users Card -->
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
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($activeUsers) }}</div>
                            <div class="text-base text-slate-500 mt-1">Active Users</div>
                        </div>
                    </div>
                </div>

                <!-- User Demographics Chart -->
                <div class="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
                    <div class="intro-y flex items-center h-10">
                        <h2 class="text-lg font-medium truncate mr-5">User Demographics</h2>
                    </div>
                    <div class="intro-y box p-5 mt-5">
                        <div class="mt-3">
                            <div class="h-[213px]">
                                <canvas id="report-pie-chart" width="177" height="213"></canvas>
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

                <!-- Email Verification Chart -->
                <div class="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
                    <div class="intro-y flex items-center h-10">
                        <h2 class="text-lg font-medium truncate mr-5">Email Verification</h2>
                        <a href="" class="ml-auto text-primary truncate">Show More</a> 
                    </div>
                    <div class="intro-y box p-5 mt-5">
                        <div class="mt-3">
                            <div class="h-[213px]">
                                <canvas id="report-donut-chart" width="177" height="213"></canvas>
                            </div>
                        </div>
                        <div class="w-52 sm:w-auto mx-auto mt-8">
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                                <span class="truncate">Verified</span> 
                                <span class="font-medium ml-auto">{{ $emailVerificationRate }}%</span> 
                            </div>
                            <div class="flex items-center mt-4">
                                <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                                <span class="truncate">Unverified</span> 
                                <span class="font-medium ml-auto">{{ round(100 - $emailVerificationRate, 1) }}%</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Announcements Section -->
        <div class="col-span-12 mt-6">
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <h2 class="text-lg font-medium">Announcements</h2>
                    <a href="/announcement" class="ml-auto btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Make Announcements
                    </a>
                </div>
                
                @forelse($announcements as $announcement)
                    <div class="py-3 @if(!$loop->last) border-b border-slate-200 @endif">
                        <div class="flex items-start">
                            <div class="flex-1">
                                <div class="font-medium">{{ $announcement->description }}</div>
                                <div class="text-xs text-slate-500 mt-1">
                                    {{ $announcement->created_at ? $announcement->created_at->format('F d, Y g:i A') : 'Recently posted' }}
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <div class="font-medium">No announcements</div>
                        <div class="text-sm">There are no announcements at this time</div>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Recent Users Section -->
        <div class="col-span-12 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">Recent Users</h2>
                <div class="flex items-center sm:ml-auto mt-3 sm:mt-0">
                    <a href="{{ route('dashboard.export.users.excel') }}" class="btn box flex items-center text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block w-4 h-4 mr-2">
                            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                        Export to Excel
                    </a>
                    <a href="{{ route('dashboard.export.users.pdf') }}" class="ml-3 btn box flex items-center text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block w-4 h-4 mr-2">
                            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                        Export to PDF
                    </a>
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
                                    @if($user->photo && !empty(trim($user->photo)))
                                        <img alt="{{ $user->name }}" class="tooltip rounded-full" src="{{ asset('storage/profiles/' . $user->photo) }}">
                                    @else
                                        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {{ strtoupper(substr($user->name, 0, 1)) }}
                                        </div>
                                    @endif
                                </div>
                            </td>
                            <td>
                                <a href="" class="font-medium whitespace-nowrap">{{ $user->name }}</a> 
                                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ ucfirst($user->role ?? 'User') }}</div>
                            </td>
                            <td class="text-center">{{ $user->email }}</td>
                            <td class="w-40">
                                <div class="flex items-center justify-center {{ $user->active ? 'text-success' : 'text-danger' }}"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                    </svg>
                                    {{ $user->active ? 'Active' : 'Inactive' }} 
                                </div>
                            </td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href="/usermanagement"> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit 
                                    </a>
                                    <a class="flex items-center text-danger" href="/usermanagement"> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                        Delete 
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
    </div>

    <!-- Pass gender data to JavaScript -->
    <script>
        window.genderStats = @json($genderStats);
        
        // Pass email verification data to JavaScript
        window.emailVerificationStats = {
            'Verified': {{ $verifiedUsers }},
            'Unverified': {{ $unverifiedUsers }}
        };
    </script>
</div>

