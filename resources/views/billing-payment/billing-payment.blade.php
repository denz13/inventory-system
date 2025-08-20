@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>My Bills: View and manage your billing records. Check payment status and review billing details.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    My Bills
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="billing_toast_success" type="success" title="Success" message="Billing created successfully"
        :showButton="false" />
    <x-notification-toast id="billing_toast_error" type="error" title="Error" :showButton="false">
        <div id="billing_error_message_slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <style>
        .toastify {
            background: transparent !important;
            box-shadow: none !important;
        }
        
        /* Ensure notification toast content is visible */
        .toastify-content {
            color: #000 !important;
            background: #fff !important;
            padding: 1rem !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .toastify-content .font-medium {
            font-weight: 600 !important;
            font-size: 1rem !important;
            margin-bottom: 0.5rem !important;
            color: #1f2937 !important;
        }
        
        .toastify-content .text-slate-500 {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
        }

        /* Payment Modal Styles */
        .bank-type-card.selected {
            border-color: #3b82f6 !important;
            background-color: #dbeafe !important;
        }

        .account-category-card {
            transition: all 0.2s ease;
        }

        .account-category-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .account-category-card.selected {
            border-color: #3b82f6 !important;
            background-color: #eff6ff !important;
        }
        
        /* Step Indicator Styles */
        .step-indicator {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
        }
        .step-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #e2e8f0;
            margin: 0 8px;
            transition: all 0.3s ease;
        }
        .step-dot.active {
            background-color: #3b82f6;
            transform: scale(1.2);
        }
        .step-dot.completed {
            background-color: #10b981;
        }
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <div class="flex gap-2">
            <input type="text" data-daterange="true" class="datepicker form-control w-56" placeholder="Filter by date range" id="dateRangeFilter">
            <button type="button" class="btn btn-outline-secondary" id="clearFilterBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1 -1 2 -2 2H7c-1 0 -2 -1 -2 -2V6"></path>
                    <path d="M8 6V4c0 -1 1 -2 2 -2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Show All
            </button>
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $userBillings->count() }}</span> of <span id="total-count">{{ $userBillings->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">BILLING DATE</th>
                    <th class="text-center whitespace-nowrap">AMOUNT DUE</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">ITEMS</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($userBillings as $billing)
                <tr class="intro-x" data-status="{{ $billing->status }}" data-billing-date="{{ $billing->billing_date }}">
                    <td class="whitespace-nowrap">
                        <div class="font-medium">{{ $billing->billing_date }}</div>
                        <div class="text-slate-500 text-xs mt-0.5">Bill #{{ str_pad($billing->id, 6, '0', STR_PAD_LEFT) }}</div>
                    </td>
                    <td class="text-center">
                        <div class="font-medium text-primary">₱{{ number_format($billing->amount_due, 2) }}</div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            @if($billing->status === 'sent to owners')
                                Your Bill Now
                            @else
                                {{ $billing->status }}
                            @endif
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {{ $billing->billingItems->count() }} {{ $billing->billingItems->count() === 1 ? 'item' : 'items' }}
                        </span>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-billing-modal" data-billing-id="{{ $billing->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            <a class="flex items-center text-success" href="javascript:;" data-tw-toggle="modal" data-tw-target="#payment-modal" data-billing-id="{{ $billing->id }}" data-amount="{{ $billing->amount_due }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                Pay Now
                            </a>
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="5" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                            <div class="font-medium">No bills found</div>
                            <div class="text-sm">You don't have any billing records yet</div>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <x-pagination 
        :current-page="$userBillings->currentPage()" 
        :total-pages="$userBillings->lastPage()" 
        :per-page="$userBillings->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>



<!-- BEGIN: View Billing Modal -->
<div id="view-billing-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div id="billing-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading billing details...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Billing Modal -->

<!-- BEGIN: Payment Modal -->
<div id="payment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header px-6 py-4 border-b border-slate-200">
                <h2 class="text-xl font-semibold text-slate-800">Payment Method</h2>
                <button type="button" class="btn-close" data-tw-dismiss="modal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                                    </div>
                        <div class="modal-body px-6 py-8">
                            <!-- Step Indicator -->
                            <div class="step-indicator">
                                <div class="step-dot active" data-step="1"></div>
                                <div class="step-dot" data-step="2"></div>
                                <div class="step-dot" data-step="3"></div>
                            </div>

                            <!-- Payment Amount Display -->
                <div class="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                    <div class="flex items-center justify-between">
                        <span class="text-blue-800 font-medium">Amount to Pay:</span>
                        <span class="text-2xl font-bold text-blue-900" id="paymentAmount">₱0.00</span>
                    </div>
                    <div class="text-sm text-blue-600 mt-1">Bill #<span id="paymentBillNumber"></span></div>
                </div>

                                            <!-- Step 1: Payment Method Selection -->
                            <div id="paymentStep1" class="step-content">
                                <h3 class="text-lg font-medium mb-4 text-center">Select Payment Method</h3>
                                <p class="text-slate-500 text-center mb-6">Choose the type of payment method you prefer</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    @foreach($bankAccountTypes as $type)
                                    <div class="bank-type-card cursor-pointer p-6 border-2 border-slate-200 rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md" data-type-id="{{ $type->id }}" data-type-name="{{ $type->type }}">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="font-medium text-lg">{{ $type->type }}</div>
                                                <div class="text-slate-500 text-sm mt-1">{{ $type->status }}</div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-400">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                            </div>

                            <!-- Step 2: Choose Account -->
                            <div id="paymentStep2" class="step-content hidden">
                                <h3 class="text-lg font-medium mb-4 text-center">Choose Account</h3>
                                <p class="text-slate-500 text-center mb-6">Select the specific account for your payment</p>
                                <div class="mb-6">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="backToPaymentStep1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                        Back to Payment Methods
                                    </button>
                                </div>
                                <div id="accountCategoriesList" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Categories will be populated here -->
                                </div>
                            </div>

                            <!-- Step 3: Confirm Payment -->
                            <div id="paymentStep3" class="step-content hidden">
                                <h3 class="text-lg font-medium mb-4 text-center">Confirm Payment</h3>
                                <p class="text-slate-500 text-center mb-6">Review your payment details before confirming</p>
                                <div class="mb-6">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="backToPaymentStep2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                        Back to Accounts
                                    </button>
                                </div>
                                
                                <div class="grid grid-cols-12 gap-4 mb-6">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Selected Payment Method</label>
                                        <input type="text" class="intro-x login__input form-control py-3 px-4 block" id="selectedPaymentMethodDisplay" readonly>
                                    </div>
                                    
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Selected Account</label>
                                        <input type="text" class="intro-x login__input form-control py-3 px-4 block" id="selectedAccountNameDisplay" readonly>
                                    </div>
                                </div>
                                
                                <!-- Selected Account Display -->
                                <div id="selectedAccountDisplay" class="mb-6">
                                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 class="font-semibold text-green-800 mb-3">Selected Payment Account</h4>
                                        <div id="selectedAccountDetails"></div>
                                    </div>
                                </div>
                            </div>

                <input type="hidden" id="selectedBillingId">
                <input type="hidden" id="selectedAccountId">
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">Cancel</button>
                    <button type="button" id="confirmPaymentBtn" class="btn btn-success px-6 py-2" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Payment Modal -->

<!-- BEGIN: Account Details Modal -->
<div id="account-details-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-5 py-10">
                <div id="account-details">
                    <!-- Account details will be loaded here -->
                </div>
            </div>
            <div class="modal-footer px-5 py-3">
                <div class="flex justify-end gap-2">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Close</button>
                    <button type="button" id="selectAccountBtn" class="btn btn-primary w-32">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Select Account
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Account Details Modal -->

@endsection

@push('scripts')
    <script>
        // Pass PHP data to JavaScript
        window.bankAccountCategories = @json($bankAccountCategories ?? []);
    </script>
    <script src="{{ asset('js/billing-payment/billing-payment.js') }}"></script>
@endpush