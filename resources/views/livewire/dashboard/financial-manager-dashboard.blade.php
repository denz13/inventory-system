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
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalUsers) }}</div>
                            <div class="text-base text-slate-500 mt-1">Total Users</div>
                        </div>
                    </div>
                </div>

                <!-- Billing Items Card -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="report-box__icon text-primary">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($totalBillingItems) }}</div>
                            <div class="text-base text-slate-500 mt-1">Billing Items</div>
                        </div>
                    </div>
                </div>

                <!-- Approved Payments Card -->
                <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <div class="report-box zoom-in">
                        <div class="box p-5">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="report-box__icon text-pending">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <div class="text-3xl font-medium leading-8 mt-6">{{ number_format($paidBillings) }}</div>
                            <div class="text-base text-slate-500 mt-1">Approved Payments</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Status Overview -->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
            <!-- Pending Payments Card -->
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex items-center">
                        <div class="w-2/4 flex-none">
                            <div class="text-lg font-medium truncate">Pending Payments</div>
                            <div class="text-slate-500 mt-1">{{ number_format($pendingBillings) }} Under Review</div>
                        </div>
                        <div class="flex-none ml-auto relative">
                            <div class="w-[90px] h-[90px]">
                                <canvas id="report-donut-chart-1" width="90" height="90"></canvas>
                            </div>
                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">{{ $pendingPaymentRate }}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Unpaid Items Card -->
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                <div class="box p-5 zoom-in">
                    <div class="flex items-center">
                        <div class="w-2/4 flex-none">
                            <div class="text-lg font-medium truncate">Unpaid Items</div>
                            <div class="text-slate-500 mt-1">{{ number_format($unpaidBillingItems) }} Items</div>
                        </div>
                        <div class="flex-none ml-auto relative">
                            <div class="w-[90px] h-[90px]">
                                <canvas id="report-donut-chart-2" width="90" height="90"></canvas>
                            </div>
                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">{{ $unpaidItemRate }}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Billing Details Table -->
        <div class="col-span-12 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">Billing Details</h2>
            </div>
            
            <div class="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                <table class="table table-report sm:mt-2">
                    <thead>
                        <tr>
                            <th class="whitespace-nowrap">USER</th>
                            <th class="whitespace-nowrap">BILL NUMBER</th>
                            <th class="whitespace-nowrap">BILLING DATE</th>
                            <th class="text-center whitespace-nowrap">AMOUNT DUE</th>
                            <th class="text-center whitespace-nowrap">STATUS</th>
                            <th class="text-center whitespace-nowrap">DATE CREATED</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($recentBillings as $billing)
                        <tr class="intro-x">
                            <td>
                                <div class="font-medium whitespace-nowrap">{{ $billing->user->name ?? 'N/A' }}</div>
                            </td>
                            <td>
                                <div class="font-medium text-primary">#{{ str_pad($billing->id, 6, '0', STR_PAD_LEFT) }}</div>
                            </td>
                            <td class="whitespace-nowrap">
                                <div class="font-medium">{{ $billing->billing_date }}</div>
                            </td>
                            <td class="text-center">
                                <div class="font-medium text-primary">₱{{ number_format($billing->amount_due, 2) }}</div>
                            </td>
                            <td class="w-40">
                                <div class="flex items-center justify-center 
                                    @if($billing->status === 'approved') text-success
                                    @elseif($billing->status === 'rejected') text-danger
                                    @else text-warning
                                    @endif">
                                    @if($billing->status === 'approved')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                    @elseif($billing->status === 'rejected')
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
                                    {{ ucfirst($billing->status) }}
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="text-slate-500 text-xs">
                                    {{ $billing->created_at ? $billing->created_at->format('M d, Y g:i A') : 'N/A' }}
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr class="intro-x">
                            <td colspan="6" class="text-center py-8 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                <div class="font-medium">No billing records</div>
                                <div class="text-sm">No billing records found</div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            @if($recentBillings->isNotEmpty())
            <div class="text-center mt-4">
                <a href="/billing-management" class="btn btn-outline-secondary btn-sm">
                    Manage Billing
                </a>
            </div>
            @endif
            
            <!-- BEGIN: Pagination -->
            <x-pagination 
                :current-page="$recentBillings->currentPage()" 
                :total-pages="$recentBillings->lastPage()" 
                :per-page="$recentBillings->perPage()" 
                :show-per-page-selector="true" 
                :show-first-last="true" 
            />
            <!-- END: Pagination -->
        </div>
    </div>

    <!-- Pass data to JavaScript for charts -->
    <script>
        // Billing data for donut charts
        window.billingStats = {
            paid: {{ $paidBillings }},
            pending: {{ $pendingBillings }},
            total: {{ $totalBillings }},
            paymentRate: {{ $paymentCompletionRate }},
            pendingPaymentRate: {{ $pendingPaymentRate }},
            itemPaymentRate: {{ $itemPaymentRate }},
            unpaidItemRate: {{ $unpaidItemRate }},
            paidItems: {{ $totalBillingItems - $unpaidBillingItems }},
            unpaidItems: {{ $unpaidBillingItems }}
        };
    </script>
</div>

