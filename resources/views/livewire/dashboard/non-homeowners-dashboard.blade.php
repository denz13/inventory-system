<div>
    <style>
        /* Custom scrollbar styling for horizontal alerts */
        .alerts-scroll::-webkit-scrollbar {
            height: 8px;
        }
        
        .alerts-scroll::-webkit-scrollbar-track {
            background: #e2e8f0;
            border-radius: 10px;
        }
        
        .alerts-scroll::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 10px;
        }
        
        .alerts-scroll::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
        
        /* For Firefox */
        .alerts-scroll {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #e2e8f0;
        }
    </style>
    
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

        <!-- Welcome Banner -->
        <div class="col-span-12 mt-4">
            <div class="box p-6 shadow-md rounded-lg" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); min-height: 90px; display: flex; align-items: center;">
                <h1 class="text-3xl font-bold text-white w-full" style="font-style: italic; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Welcome, {{ $currentUser->name }}!
                </h1>
            </div>
        </div>

        <!-- Alerts Section - Horizontal Scrollable -->
        <div class="col-span-12">
            <div class="overflow-x-auto pb-4 alerts-scroll" style="scroll-behavior: smooth;">
                <div class="flex gap-4" style="min-width: min-content;">
                    <!-- Approved Vehicle Sticker Registrations -->
                    @foreach($approvedVehicles as $vehicle)
                    <div class="flex-shrink-0" style="min-width: 400px; max-width: 400px;">
                        <div class="alert show box bg-success text-white flex items-start p-4 rounded-lg h-full" role="alert">
                            <div class="flex-shrink-0 mr-3 mt-1">
                                <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="font-bold">Vehicle Sticker Registration Approved:</div>
                                <div class="mt-1">Your Vehicle Sticker Registration has been approved.</div>
                            </div>
                        </div>
                    </div>
                    @endforeach

                    <!-- Active Announcements -->
                    @forelse($announcements as $announcement)
                    <div class="flex-shrink-0" style="min-width: 400px; max-width: 400px;">
                        <div class="alert show box @if($announcement->type === 'urgent') bg-danger @else bg-success @endif text-white flex items-start p-4 rounded-lg h-full" role="alert">
                            <div class="flex-shrink-0 mr-3 mt-1">
                                <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="font-bold">{{ $announcement->type ? ucfirst($announcement->type) : 'Announcement' }}:</div>
                                <div class="mt-1">{{ $announcement->description }}</div>
                            </div>
                        </div>
                    </div>
                    @empty
                    @endforelse
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="col-span-12 lg:col-span-6">
            <!-- Schedule Appointments -->
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <h2 class="text-lg font-medium">Schedule Appointments</h2>
                    <a href="/apply-appointment" class="ml-auto text-primary text-sm">View All</a>
                </div>
                
                @forelse($recentAppointments as $appointment)
                    <div class="flex items-center py-3 border-b border-slate-200">
                        <div class="flex-1">
                            <div class="font-medium">{{ $appointment->appointmentCategory->category_name ?? $appointment->description ?? 'Appointment' }}</div>
                            <div class="text-xs text-slate-500 mt-0.5">
                                @if($appointment->appointment_date)
                                    {{ \Carbon\Carbon::parse($appointment->appointment_date)->format('M d, Y') }}
                                    @if($appointment->time)
                                        at {{ $appointment->time }}
                                    @endif
                                @else
                                    <span class="text-success">ADD DATE AND TIME</span>
                                @endif
                            </div>
                            @if($appointment->tracking_number)
                                <div class="text-xs text-slate-400 mt-0.5">Tracking: {{ $appointment->tracking_number }}</div>
                            @endif
                        </div>
                        <div>
                            @php
                                $statusColor = 'bg-warning';
                                if (strtolower($appointment->status) === 'approved') {
                                    $statusColor = 'bg-success';
                                } elseif (strtolower($appointment->status) === 'rejected' || strtolower($appointment->status) === 'declined' || strtolower($appointment->status) === 'cancelled') {
                                    $statusColor = 'bg-danger';
                                } elseif (strtolower($appointment->status) === 'completed') {
                                    $statusColor = 'bg-primary';
                                }
                            @endphp
                            <span class="px-2 py-1 rounded text-xs text-white {{ $statusColor }}">
                                {{ ucfirst($appointment->status ?? 'Pending') }}
                            </span>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <div class="font-medium">No appointments</div>
                        <div class="text-sm">You don't have any scheduled appointments</div>
                    </div>
                @endforelse
                
                <!-- Date Range Display -->
                <!-- @if($recentAppointments->isNotEmpty())
                <div class="mt-4 pt-4 border-t border-slate-200">
                    <div class="flex items-center justify-center text-slate-500 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{{ \Carbon\Carbon::now()->format('d M, Y') }} - {{ \Carbon\Carbon::now()->addMonth()->format('d M, Y') }}</span>
                    </div>
                </div>
                @endif
                
                <div class="text-center mt-4">
                    <a href="/apply-appointment" class="text-primary text-sm font-medium hover:underline">View All</a>
                </div> -->
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
            <!-- Announcements -->
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <h2 class="text-lg font-medium">Announcements</h2>
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
    </div>
</div>

