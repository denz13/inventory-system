@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>List of Payments: Monitor and manage all payment submissions. View payment status, receipts, and user billing information.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    List of Payments
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
        <x-notification-toast id="incident_report_management_toast_success" type="success" title="Success" message="Action completed successfully"
            :showButton="false" />
        <x-notification-toast id="incident_report_management_toast_error" type="error" title="Error" :showButton="false">
            <div id="incident_report_management_error_message_slot" class="text-slate-500 mt-1"></div>
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
            
            .service-type-option:hover, .category-option:hover {
                border-color: #3b82f6 !important;
                background-color: #f8fafc;
            }
            .service-type-option.selected, .category-option.selected {
                border-color: #3b82f6 !important;
                background-color: #eff6ff;
            }
            .step-content {
                transition: all 0.3s ease;
            }
            .step-content.hidden {
                display: none;
            }
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
        <div class="dropdown"> 
            <button class="dropdown-toggle btn btn-primary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Status</button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="all">All Payments</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="sent to owners">Pending Payment</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="under review">Under Review</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="approved">Approved</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="rejected">Rejected</a> </li> 
                </ul> 
            </div> 
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $payments->count() }}</span> of <span id="total-count">{{ $payments->total() }}</span> entries
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
                    <th class="whitespace-nowrap">USER</th>
                    <th class="whitespace-nowrap">BILL NUMBER</th>
                    <th class="whitespace-nowrap">BILLING DATE</th>
                    <th class="whitespace-nowrap">AMOUNT DUE</th>
                    <th class="whitespace-nowrap">PAYMENT METHOD</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">DATE CREATED</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payments as $payment)
                <tr class="intro-x" data-status="{{ $payment->status }}">
                    <td class="w-40">
                        <div class="flex items-center">
                            <div class="w-10 h-10 image-fit zoom-in">
                                <img alt="Profile" class="tooltip rounded-full" src="{{ asset($payment->user->photo ?? 'dist/images/preview-8.jpg') }}">
                            </div>
                            <div class="ml-3">
                                <div class="font-medium">{{ $payment->user->name ?? 'N/A' }}</div>
                                <div class="text-slate-500 text-xs">{{ $payment->user->email ?? 'N/A' }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="font-medium">#{{ str_pad($payment->id, 6, '0', STR_PAD_LEFT) }}</div>
                        <div class="text-slate-500 text-xs">Bill #{{ $payment->id }}</div>
                    </td>
                    <td class="whitespace-nowrap">
                        {{ $payment->billing_date ?? 'N/A' }}
                    </td>
                    <td class="whitespace-nowrap">
                        <div class="font-medium text-primary">₱{{ number_format($payment->amount_due, 2) }}</div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center">
                            @if($payment->receipt)
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                                <span class="text-success text-sm">Payment Submitted</span>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-slate-400">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                <span class="text-slate-400 text-sm">No Payment</span>
                            @endif
                        </div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($payment->status === 'sent to owners') text-warning
                            @elseif($payment->status === 'under review') text-info
                            @elseif($payment->status === 'approved') text-success
                            @elseif($payment->status === 'rejected') text-danger
                            @else text-slate-500
                            @endif">
                            @if($payment->status === 'sent to owners')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                Pending Payment
                            @elseif($payment->status === 'under review')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                                Under Review
                            @elseif($payment->status === 'approved')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                                Approved
                            @elseif($payment->status === 'rejected')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                Rejected
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                {{ ucfirst($payment->status) }}
                            @endif
                        </div>
                    </td>
                    <td class="text-center">{{ $payment->created_at ? $payment->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-billing-modal" data-billing-id="{{ $payment->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            @if($payment->status === 'under review' && $payment->receipt)
                                <a class="flex items-center mr-3 text-blue-600" href="javascript:;" data-tw-toggle="modal" data-tw-target="#receipt-modal" data-receipt="{{ $payment->receipt }}" data-bill-number="{{ $payment->id }}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10,9 9,9 8,9"></polyline>
                                    </svg>
                                    Receipt
                                </a>
                            @endif
                            @if(in_array($payment->status, ['under review']))
                            <div class="dropdown">
                                <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                    Manage
                                </button>
                                <div class="dropdown-menu w-48">
                                    <ul class="dropdown-content">
                                        <li>
                                            <a href="javascript:;" class="dropdown-item" data-action="approve-payment" data-payment-id="{{ $payment->id }}" data-amount="{{ $payment->amount_due }}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                    <polyline points="9 11 12 14 22 4"></polyline>
                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                </svg>
                                                Approve Payment
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:;" class="dropdown-item" data-action="reject-payment" data-payment-id="{{ $payment->id }}" data-amount="{{ $payment->amount_due }}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-danger">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                </svg>
                                                Reject Payment
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="8" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                            <div class="font-medium">No payments found</div>
                            <div class="text-sm">There are currently no payments to display</div>
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
        :current-page="$payments->currentPage()" 
        :total-pages="$payments->lastPage()" 
        :per-page="$payments->perPage()" 
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

<!-- BEGIN: Receipt Modal -->
<div id="receipt-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header px-6 py-4 border-b border-slate-200">
                <h2 class="text-xl font-semibold text-slate-800">Payment Receipt</h2>
                <button type="button" class="btn-close" data-tw-dismiss="modal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-6 py-8">
                <div class="mb-6">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div class="flex items-center justify-between">
                            <span class="text-blue-800 font-medium">Payment Receipt for Bill #<span id="receiptBillNumber"></span></span>
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Under Review</span>
                        </div>
                        <div class="text-sm text-blue-600 mt-2">Payment proof submitted by user</div>
                    </div>
                </div>

                <div class="receipt-content">
                    <div class="text-center mb-6">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">Payment Proof</h3>
                        <p class="text-slate-500">Below is the payment proof uploaded by the user</p>
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
                    <button type="button" id="downloadReceiptBtn" class="btn btn-outline-primary px-6 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </button>
                    <button type="button" data-tw-dismiss="modal" class="btn btn-secondary px-6 py-2">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Receipt Modal -->

<!-- Approve Payment Confirmation Modal -->
<div id="approve-payment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="text-center py-8">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-green-600">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">Approve Payment</h3>
                    <p class="text-sm text-slate-500 mb-6">Are you sure you want to approve this payment? This action cannot be undone.</p>
                    <div class="bg-slate-50 rounded-lg p-4 mb-4">
                        <p class="text-sm text-slate-600">
                            <span class="font-medium">Bill #:</span> 
                            <span id="approve-bill-number">-</span>
                        </p>
                        <p class="text-sm text-slate-600 mt-1">
                            <span class="font-medium">Amount:</span> 
                            <span id="approve-amount">-</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-20 ml-2 mb-2">Cancel</button>
                <button type="button" id="confirm-approve-btn" class="btn btn-primary w-24 ml-2 mb-2">
                    <span class="approve-btn-text">Approve</span>
                    <span class="approve-btn-loading hidden">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Reject Payment Confirmation Modal -->
<div id="reject-payment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            
            <div class="modal-body">
                <div class="text-center py-8">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-red-600">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">Reject Payment</h3>
                    <p class="text-sm text-slate-500 mb-6">Are you sure you want to reject this payment? This action cannot be undone.</p>
                    <div class="bg-slate-50 rounded-lg p-4 mb-4">
                        <p class="text-sm text-slate-600">
                            <span class="font-medium">Bill #:</span> 
                            <span id="reject-bill-number">-</span>
                        </p>
                        <p class="text-sm text-slate-600 mt-1">
                            <span class="font-medium">Amount:</span> 
                            <span id="reject-amount">-</span>
                        </p>
                    </div>
                    <div class="text-left">
                        <label for="reject-reason" class="form-label text-sm font-medium text-slate-700">Reason for Rejection (Optional)</label>
                        <textarea id="reject-reason" class="form-control mt-1" rows="3" placeholder="Enter reason for rejecting this payment..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-20 ml-2 mb-2">Cancel</button>
                <button type="button" id="confirm-reject-btn" class="btn btn-danger w-24 ml-2 mb-2">
                    <span class="reject-btn-text">Reject</span>
                    <span class="reject-btn-loading hidden">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/list-payments/list-payments.js') }}"></script>
@endpush