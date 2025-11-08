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

        <!-- Main Content Grid -->
        <div class="col-span-12 lg:col-span-6">
            <!-- Service Request -->
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <h2 class="text-lg font-medium">Service Request</h2>
                </div>
                
                @forelse($recentServiceRequests as $request)
                    <div class="py-3 border-b border-slate-200">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="font-medium">{{ $request->serviceCategory->serviceType->type ?? 'Complaint' }}:</div>
                                <div class="text-xs text-slate-500 mt-1">
                                    @if($request->created_at)
                                        {{ $request->created_at->format('M d, Y g:i A') }}
                                    @else
                                        (DATE AND TIME)
                                    @endif
                                </div>
                            </div>
                            <div>
                                @php
                                    $statusColor = 'bg-warning';
                                    if (strtolower($request->status ?? 'pending') === 'approved' || strtolower($request->status ?? 'pending') === 'resolved') {
                                        $statusColor = 'bg-success';
                                    } elseif (strtolower($request->status ?? 'pending') === 'declined') {
                                        $statusColor = 'bg-danger';
                                    }
                                @endphp
                                <span class="px-2 py-1 rounded text-xs text-white {{ $statusColor }}">
                                    {{ ucfirst($request->status ?? 'Pending') }}
                                </span>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <div class="font-medium">No service requests</div>
                        <div class="text-sm">No service requests at this time</div>
                    </div>
                @endforelse
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
            <!-- Incident Reports -->
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <h2 class="text-lg font-medium">Incident Reports</h2>
                </div>
                
                @forelse($recentIncidents as $incident)
                    <div class="py-3 border-b border-slate-200">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="font-medium">{{ $incident->user ? $incident->user->name : 'Unknown User' }}</div>
                                <div class="text-xs text-slate-500 mt-0.5">
                                    Location: {{ $incident->location_of_incident ?? 'Not specified' }}
                                </div>
                                <div class="text-xs text-slate-500 mt-1">
                                    @if($incident->datetime_of_incident)
                                        {{ \Carbon\Carbon::parse($incident->datetime_of_incident)->format('M d, Y g:i A') }}
                                    @elseif($incident->created_at)
                                        {{ $incident->created_at->format('M d, Y g:i A') }}
                                    @else
                                        (DATE AND TIME)
                                    @endif
                                </div>
                            </div>
                            <div>
                                @php
                                    $statusColor = 'bg-warning';
                                    $statusText = ucfirst($incident->status ?? 'Pending');
                                    if (strtolower($incident->status ?? 'pending') === 'resolved' || strtolower($incident->status ?? 'pending') === 'solved' || strtolower($incident->status ?? 'pending') === 'completed') {
                                        $statusColor = 'bg-success';
                                        $statusText = '(SOLVED)';
                                    } elseif (strtolower($incident->status ?? 'pending') === 'ongoing' || strtolower($incident->status ?? 'pending') === 'in progress') {
                                        $statusColor = 'bg-primary';
                                    }
                                @endphp
                                <span class="px-2 py-1 rounded text-xs text-white {{ $statusColor }}">
                                    {{ $statusText }}
                                </span>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        </svg>
                        <div class="font-medium">No incidents</div>
                        <div class="text-sm">No incident reports at this time</div>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Announcements Section (Full Width) -->
        <div class="col-span-12">
            <div class="intro-y box p-5">
                <h2 class="text-lg font-medium mb-4">Announcements</h2>
                
                @forelse($announcements as $announcement)
                    <div class="py-3 @if(!$loop->last) border-b border-slate-200 @endif">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
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

