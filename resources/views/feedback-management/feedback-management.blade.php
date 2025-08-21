@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Feedback Management: Monitor and manage all user feedback, ratings, and reviews. View and moderate feedback from all users.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Feedback Management
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="feedback_toast_success" type="success" title="Success" message="Action completed successfully"
        :showButton="false" />
    <x-notification-toast id="feedback_toast_error" type="error" title="Error" :showButton="false">
        <div id="feedback_error_message_slot" class="text-slate-500 mt-1"></div>
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
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        
        <!-- <div class="dropdown ml-2"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Status</button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="all">All Feedback</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="active">Active</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="inactive">Inactive</a> </li> 
                </ul> 
            </div> 
        </div> -->
        
        <div class="dropdown ml-2"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Rating</button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="all">All Ratings</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="5">5 Stars</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="4">4 Stars</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="3">3 Stars</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="2">2 Stars</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-rating-filter="1">1 Star</a> </li> 
                </ul> 
            </div> 
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $feedbacks->count() }}</span> of <span id="total-count">{{ $feedbacks->total() }}</span> entries
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
                    <th class="whitespace-nowrap">IMAGE</th>
                    <th class="whitespace-nowrap">USER</th>
                    <th class="whitespace-nowrap">EMAIL</th>
                    <th class="whitespace-nowrap">FEEDBACK</th>
                    <th class="text-center whitespace-nowrap">RATING</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">DATE CREATED</th>
                    <!-- <th class="text-center whitespace-nowrap">ACTIONS</th> -->
                </tr>
            </thead>
            <tbody>
                @forelse($feedbacks as $feedback)
                <tr class="intro-x" data-status="{{ $feedback->status }}" data-rating="{{ $feedback->rating }}">
                    <td class="w-40">
                        <div class="flex items-center justify-center">
                            <img src="{{ asset('images/profile.png') }}" alt="User Image" class="w-10 h-10 object-cover rounded-full">
                        </div>
                    </td>
                    <td class="w-40">
                        <div class="font-full whitespace-nowrap">{{ $feedback->user->name ?? 'N/A' }}</div>
                    </td>
                    <td class="w-40">
                        <div class="font-full">{{ $feedback->user->email ?? 'N/A' }}</div>
                    </td>
                    <td class="max-w-0 w-full">
                        <div class="font-medium truncate">{{ Str::limit($feedback->description, 100) }}</div>
                    </td>
                    <td class="text-center">
                        <div class="flex justify-center items-center">
                            @for($i = 1; $i <= 5; $i++)
                                @if($i <= $feedback->rating)
                                    @php
                                        $fillColor = '';
                                        $strokeColor = '';
                                        if($feedback->rating >= 4) {
                                            $fillColor = '#10b981'; // Green
                                            $strokeColor = '#10b981';
                                        } elseif($feedback->rating >= 3) {
                                            $fillColor = '#f59e0b'; // Yellow
                                            $strokeColor = '#f59e0b';
                                        } else {
                                            $fillColor = '#f97316'; // Orange
                                            $strokeColor = '#f97316';
                                        }
                                    @endphp
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="{{ $fillColor }}" stroke="{{ $strokeColor }}" stroke-width="1">
                                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                                    </svg>
                                @else
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="#94a3b8" stroke-width="1">
                                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                                    </svg>
                                @endif
                            @endfor
                            <span class="ml-2 text-sm font-medium">{{ $feedback->rating }}/5</span>
                        </div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($feedback->status === 'active') text-success
                            @elseif($feedback->status === 'inactive') text-slate-500
                            @else text-slate-500
                            @endif">
                            @if($feedback->status === 'active')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            @endif
                            {{ ucfirst($feedback->status) }}
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="text-slate-500 whitespace-nowrap">{{ $feedback->created_at ? $feedback->created_at->format('M d, Y g:i A') : 'N/A' }}</div>
                    </td>
                    <!-- <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-feedback-modal" data-feedback-id="{{ $feedback->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#edit-feedback-modal" data-feedback-id="{{ $feedback->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Manage
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal" data-feedback-id="{{ $feedback->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete
                            </a>
                        </div>
                    </td> -->
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="6" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <div class="font-medium">No feedback found</div>
                            <div class="text-sm">No user feedback available at this time</div>
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
        :current-page="$feedbacks->currentPage()" 
        :total-pages="$feedbacks->lastPage()" 
        :per-page="$feedbacks->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>



<!-- BEGIN: View Feedback Modal -->
<div id="view-feedback-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div id="feedback-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading feedback details...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Feedback Modal -->

<!-- BEGIN: Manage Feedback Modal -->
<div id="edit-feedback-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body px-6 py-8">
                <h3 class="text-xl font-medium mb-6">Manage Feedback Status</h3>
                <form id="editFeedbackForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editFeedbackId">
                    
                    <div id="feedbackInfo" class="mb-6 p-4 bg-slate-50 rounded-lg">
                        <!-- Feedback info will be loaded here -->
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Status</label>
                        <select name="status" id="editStatus" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <small class="text-slate-500">Change the status of this feedback</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="editFeedbackForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Manage Feedback Modal -->

<!-- BEGIN: Delete Confirmation Modal -->
<div id="delete-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div class="p-5 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x-circle" data-lucide="x-circle" class="lucide lucide-x-circle w-16 h-16 text-danger mx-auto mt-3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <div class="text-3xl mt-5">Are you sure?</div>
                    <div class="text-slate-500 mt-2">Do you really want to delete this feedback? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="deleteFeedbackId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmDeleteFeedback">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/feedback-management/feedback-management.js') }}"></script>
@endpush
