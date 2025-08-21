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
        
        /* File Upload Styles */
        .upload-area {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .upload-area:hover {
            background-color: #fef3c7;
        }
        .upload-area.dragover {
            border-color: #f59e0b;
            background-color: #fef3c7;
        }
        .file-preview-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            margin-top: 8px;
        }
        .file-preview-item .remove-file {
            color: #ef4444;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .file-preview-item .remove-file:hover {
            background-color: #fef2f2;
        }
        
        /* FilePond Custom Styles */
        .filepond--root {
            margin: 0;
            font-family: inherit;
            min-height: 80px;
            max-height: none; /* Allow dynamic growth for previews */
            transition: height 0.3s ease;
        }
        
        /* When preview is present, allow more height */
        .filepond--root.has-preview {
            max-height: 450px;
        }
        
        .filepond--drop-label {
            color: #4c4e53;
            font-size: 16px;
        }
        
        .filepond--label-action {
            text-decoration-color: #babdc0;
            color: #4c4e53;
            font-weight: 600;
        }
        
        .filepond--panel-root {
            border-radius: 2em;
            background-color: #edf0f4;
            height: auto;
            min-height: 80px;
            max-height: 150px;
            border: 2px dashed #babdc0;
        }
        
        .filepond--item-panel {
            background-color: #595e68;
            border-radius: 1em;
        }
        
        .filepond--drip-blob {
            background-color: #7f8a9a;
        }
        
        .filepond--file-action-button {
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .filepond--file-action-button:hover,
        .filepond--file-action-button:focus {
            background-color: rgba(0, 0, 0, 0.7);
        }
        
        .filepond--progress-indicator {
            color: #7f8a9a;
        }
        
        .filepond--panel {
            border-radius: 2em;
        }
        
        .filepond--file-info {
            color: #ffffff;
        }
        
        .filepond--file-status {
            color: #ffffff;
        }
        
        /* FilePond Preview Styles */
        .filepond--image-preview {
            background: #f8fafc !important;
            border-radius: 8px !important;
        }
        
        .filepond--image-preview-wrapper {
            border-radius: 8px !important;
        }
        
        .filepond--image-preview-overlay {
            background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%) !important;
        }
        
        .filepond--pdf-preview {
            background: #f8fafc !important;
            border-radius: 8px !important;
        }
        
        .filepond--pdf-preview-wrapper {
            border-radius: 8px !important;
        }
        
        /* Ensure image preview displays correctly */
        .filepond--item {
            width: calc(100% - 0.5em) !important;
        }
        
        .filepond--item-panel {
            background-color: #f8fafc !important;
            border-radius: 8px !important;
        }
        
        .filepond--image-preview-markup {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
        }
        
        /* Dynamic modal footer positioning */
        #payment-modal .modal-content {
            display: flex;
            flex-direction: column;
            max-height: 90vh;
        }
        
        #payment-modal .modal-body {
            flex: 1;
            overflow-y: auto;
        }
        
        #payment-modal .modal-footer {
            flex-shrink: 0;
            margin-top: auto;
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
                            @elseif($billing->status === 'under review')
                                Under Review
                            @elseif($billing->status === 'rejected')
                                <span class="text-red-600">Payment Rejected</span>
                                @if($billing->reason)
                                    <div class="text-sm text-red-500 mt-1">{{ $billing->reason }}</div>
                                @endif
                            @else
                                {{ ucfirst($billing->status) }}
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
                            @if($billing->status === 'under review' && $billing->receipt)
                                <a class="flex items-center mr-3 text-blue-600" href="javascript:;" data-tw-toggle="modal" data-tw-target="#receipt-modal" data-receipt="{{ $billing->receipt }}" data-bill-number="{{ $billing->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10,9 9,9 8,9"></polyline>
                                </svg>
                                    My Receipt
                            </a>
                            @endif
                            @if($billing->status === 'sent to owners' || $billing->status === 'rejected')
                                <a class="flex items-center text-success" href="javascript:;" data-tw-toggle="modal" data-tw-target="#payment-modal" data-billing-id="{{ $billing->id }}" data-amount="{{ $billing->amount_due }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                    @if($billing->status === 'rejected')
                                        Pay Again
                                    @else
                                        Pay Now
                                    @endif
                                </a>

                            @endif
                            
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

                                <!-- File Upload Section -->
                                <div class="bg-orange-50 p-4 rounded-lg  border-orange-200 mb-6">
                                    <h4 class="font-semibold text-orange-800 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14,2 14,8 20,8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10,9 9,9 8,9"></polyline>
                                </svg>
                                        Upload Payment Proof *
                                    </h4>
                                    <p class="text-orange-700 text-sm mb-4">Please upload your payment receipt or proof of payment</p>
                                    
                                                                        <div class="filepond-container">
                                        <input type="file" 
                                               class="filepond"
                                               id="paymentFile" 
                                               name="payment_file" 
                                               data-max-file-size="10MB"
                                               data-max-files="1"
                                               accept="image/*,application/pdf,.doc,.docx" 
                                               required>
                                    </div>
                                    
                                    <div id="fileError" class="text-red-600 text-sm mt-2 hidden">
                                        Please upload a payment proof to continue
                                    </div>
                        </div>
                    </div>

                <input type="hidden" id="selectedBillingId">
                <input type="hidden" id="selectedAccountId">
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="confirmPaymentBtn" class="btn btn-primary px-6 py-2 hidden mr-2" disabled>
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

<!-- BEGIN: Receipt Modal -->
<div id="receipt-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            
            <div class="modal-body px-6 py-8">
                <div class="mb-6">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div class="flex items-center justify-between">
                            <span class="text-blue-800 font-medium">Payment Receipt for Bill #<span id="receiptBillNumber"></span></span>
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Under Review</span>
                        </div>
                        <div class="text-sm text-blue-600 mt-2">Status: Your payment proof has been submitted and is currently being reviewed.</div>
                    </div>
                </div>

                <div class="receipt-content">
                    <div class="text-center mb-6">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">Payment Proof</h3>
                        <p class="text-slate-500">Below is the payment proof you uploaded</p>
                    </div>
                    
                    <!-- Receipt Image/PDF Display -->
                    <div class="receipt-display bg-slate-50 rounded-lg p-6 min-h-96 flex items-center justify-center">
                        <div id="receiptFileDisplay" class="w-full">
                            <!-- Receipt will be loaded here -->
                            <div class="text-center text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14,2 14,8 20,8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10,9 9,9 8,9"></polyline>
                                </svg>
                                <p>Loading receipt...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div class="flex justify-between items-center w-full">
                    <button type="button" id="downloadReceiptBtn" class="btn btn-outline-primary px-6 py-2 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </button>
                    <button type="button" data-tw-dismiss="modal" class="btn btn-secondary px-6 py-2 mr-2">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Receipt Modal -->

@endsection

@push('scripts')
    <!-- Load FilePond directly for this page -->
    <script src="https://unpkg.com/filepond/dist/filepond.js"></script>
    <script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>
    <script src="https://unpkg.com/filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.js"></script>
    <script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js"></script>
    <script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>
    <script src="https://unpkg.com/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.js"></script>
    
    <script>
        // Wait for FilePond to load and initialize immediately
        document.addEventListener('DOMContentLoaded', function() {
            // Check if FilePond loaded
            if (typeof FilePond !== 'undefined') {
                console.log('FilePond loaded successfully on this page');
                
                // Register FilePond plugins for previews
                FilePond.registerPlugin(
                    FilePondPluginImagePreview,
                    FilePondPluginPdfPreview,
                    FilePondPluginFileValidateSize,
                    FilePondPluginFileValidateType,
                    FilePondPluginImageExifOrientation
                );
                console.log('FilePond plugins registered for preview functionality');
                
                // Initialize FilePond immediately for payment file
                const paymentFileInput = document.querySelector('#paymentFile');
                if (paymentFileInput) {
                    console.log('Creating FilePond for payment file...');
                    
                    // Create FilePond instance with preview settings
                    const pond = FilePond.create(paymentFileInput, {
                        labelIdle: `Drag & Drop your payment proof or <span class="filepond--label-action">Browse</span><br><small style="color: #6b7280;">Supports: Images, PDF, Word documents (Max 10MB)</small>`,
                        maxFileSize: '10MB',
                        maxFiles: 1,
                        allowMultiple: false,
                        allowRevert: true,
                        allowRemove: true,
                        allowReplace: true,
                        credits: false,
                        acceptedFileTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                        
                        // Image preview settings - larger size for better visibility
                        allowImagePreview: true,
                        imagePreviewHeight: 200,
                        imagePreviewMaxHeight: 300,
                        allowImageCrop: false,
                        allowImageResize: false,
                        imagePreviewTransparencyIndicator: null,
                        
                        // PDF preview settings - larger size for better visibility
                        allowPdfPreview: true,
                        pdfPreviewHeight: 350,
                        pdfComponentExtraParams: 'toolbar=0&view=fit&page=1',
                        
                        // File validation
                        fileValidateTypeDetectType: (source, type) => new Promise((resolve, reject) => {
                            // Allow common file types
                            resolve(type);
                        })
                    });
                    
                    // Store globally for our billing payment JS
                    window.paymentFilePond = pond;
                    
                    // Add event handlers
                    pond.on('addfile', (error, file) => {
                        if (error) {
                            console.error('FilePond add file error:', error);
                            return;
                        }
                        console.log('File added:', file.filename, 'Type:', file.fileType);
                        console.log('File object:', file);
                        window.uploadedFile = file.file;
                        
                        // Add preview class if it's an image or PDF
                        const isImage = file.fileType.startsWith('image/');
                        const isPdf = file.fileType === 'application/pdf';
                        
                        if (isImage || isPdf) {
                            setTimeout(() => {
                                const filePondRoot = document.querySelector('.filepond--root');
                                if (filePondRoot) {
                                    filePondRoot.classList.add('has-preview');
                                    console.log('Added has-preview class for better layout');
                                }
                            }, 300);
                        }
                        
                        if (typeof updateConfirmButtonState === 'function') {
                            updateConfirmButtonState();
                        }
                        // Adjust modal layout after file is added - with delay for preview loading
                        setTimeout(() => adjustModalLayout(), 500);
                    });

                    pond.on('removefile', (error, file) => {
                        if (error) {
                            console.error('FilePond remove file error:', error);
                            return;
                        }
                        console.log('File removed:', file.filename);
                        window.uploadedFile = null;
                        
                        // Remove preview class when file is removed
                        const filePondRoot = document.querySelector('.filepond--root');
                        if (filePondRoot) {
                            filePondRoot.classList.remove('has-preview');
                            console.log('Removed has-preview class');
                        }
                        
                        if (typeof updateConfirmButtonState === 'function') {
                            updateConfirmButtonState();
                        }
                        // Adjust modal layout after file is removed
                        adjustModalLayout();
                    });
                    
                    // Add preview processing event
                    pond.on('processfile', (error, file) => {
                        if (error) {
                            console.error('FilePond process file error:', error);
                            return;
                        }
                        console.log('File processed for preview:', file.filename);
                    });
                    
                    // Add load event for images
                    pond.on('processfiles', () => {
                        console.log('All files processed');
                        // Force a layout adjustment after preview loads
                        setTimeout(() => {
                            adjustModalLayout();
                        }, 500);
                    });
                    
                    console.log('FilePond initialized successfully');
                }
            } else {
                console.error('FilePond still not available, using basic file input');
            }
        });
        
        // Function to dynamically adjust modal layout based on FilePond content and preview
        function adjustModalLayout() {
            setTimeout(() => {
                const modal = document.getElementById('payment-modal');
                const modalBody = modal.querySelector('.modal-body');
                const modalFooter = modal.querySelector('.modal-footer');
                const filePond = modal.querySelector('.filepond--root');
                const imagePreview = modal.querySelector('.filepond--image-preview');
                const pdfPreview = modal.querySelector('.filepond--pdf-preview');
                
                if (filePond && modalBody && modalFooter) {
                    const filePondHeight = filePond.offsetHeight;
                    const modalContent = modal.querySelector('.modal-content');
                    
                    // Calculate available space
                    const viewportHeight = window.innerHeight;
                    let maxModalHeight = viewportHeight * 0.9; // 90vh
                    
                    // Check if there's a preview and adjust accordingly
                    let hasPreview = false;
                    let previewHeight = 0;
                    
                    if (imagePreview) {
                        hasPreview = true;
                        previewHeight = imagePreview.offsetHeight || 200;
                        console.log('Image preview detected, height:', previewHeight);
                    } else if (pdfPreview) {
                        hasPreview = true;
                        previewHeight = pdfPreview.offsetHeight || 320;
                        console.log('PDF preview detected, height:', previewHeight);
                    }
                    
                    if (hasPreview) {
                        // Give more space for preview - increase modal height
                        maxModalHeight = Math.min(viewportHeight * 0.95, filePondHeight + 200);
                        
                        // Adjust FilePond container to accommodate larger preview
                        if (imagePreview) {
                            // Make image preview larger when there's space
                            imagePreview.style.maxHeight = '300px';
                            imagePreview.style.height = 'auto';
                        }
                        
                        if (pdfPreview) {
                            // Make PDF preview larger  
                            pdfPreview.style.maxHeight = '400px';
                            pdfPreview.style.height = 'auto';
                        }
                        
                        // Push footer down to accommodate larger preview
                        modalFooter.style.marginTop = '20px';
                        console.log('Adjusted layout for preview - Modal height:', maxModalHeight, 'Preview height:', previewHeight);
                    } else {
                        // No preview, compact layout
                        modalFooter.style.marginTop = 'auto';
                        console.log('No preview detected, using compact layout');
                    }
                    
                    // Apply the calculated height
                    modalContent.style.maxHeight = maxModalHeight + 'px';
                    
                    console.log('Modal layout adjusted - FilePond height:', filePondHeight, 'Max modal height:', maxModalHeight);
                }
            }, 200); // Increased delay to ensure preview is fully rendered
        }
        
        // Call adjust function when modal is opened
        document.addEventListener('DOMContentLoaded', function() {
            const paymentModal = document.getElementById('payment-modal');
            if (paymentModal) {
                // Listen for modal show events
                paymentModal.addEventListener('shown.bs.modal', adjustModalLayout);
                paymentModal.addEventListener('show.bs.modal', adjustModalLayout);
                
                // Also listen for window resize
                window.addEventListener('resize', adjustModalLayout);
            }
        });
        
        // Pass PHP data to JavaScript
        window.bankAccountCategories = @json($bankAccountCategories ?? []);
    </script>
    
    <script src="{{ asset('js/billing-payment/billing-payment.js') }}"></script>
@endpush