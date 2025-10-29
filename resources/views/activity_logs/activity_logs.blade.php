@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Activity Logs: Monitor all system activities and user actions. Track changes, updates, and important events across the platform.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    System Activity Logs
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="activity_logs_toast_success" type="success" title="Success" message="Action completed successfully"
        :showButton="false" />
    <x-notification-toast id="activity_logs_toast_error" type="error" title="Error" :showButton="false">
        <div id="activity_logs_error_message_slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <style>
        .toastify {
            background: transparent !important;
            box-shadow: none !important;
        }
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <div class="hidden md:block mx-auto text-slate-500">
            Showing {{ $activityLogs->count() }} of {{ $activityLogs->total() }} activity logs
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <div class="overflow-x-auto">
            <table class="table table-report -mt-2" id="activityLogsTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">ID</th>
                        <th class="whitespace-nowrap">USER</th>
                        <th class="whitespace-nowrap">ACTIVITY DESCRIPTION</th>
                        <th class="text-center whitespace-nowrap">DATE & TIME</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($activityLogs as $log)
                    <tr class="intro-x" data-id="{{ $log->id }}">
                        <td class="w-20">
                            <div class="font-medium text-slate-600">#{{ str_pad($log->id, 6, '0', STR_PAD_LEFT) }}</div>
                        </td>
                        <td class="w-40">
                            <div class="flex items-center">
                                <div class="w-10 h-10 image-fit zoom-in">
                                    @if($log->user && $log->user->photo)
                                        <img alt="{{ $log->user->name }}" class="tooltip rounded-full" src="{{ asset('storage/profiles/' . $log->user->photo) }}" title="{{ $log->user->name }}">
                                    @else
                                        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {{ $log->user ? strtoupper(substr($log->user->name, 0, 1)) : 'U' }}
                                        </div>
                                    @endif
                                </div>
                                <div class="ml-3">
                                    <div class="font-medium">{{ $log->user ? $log->user->name : 'Unknown User' }}</div>
                                    <div class="text-slate-500 text-xs">{{ $log->user ? $log->user->email : 'N/A' }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="text-slate-600">{{ Str::limit($log->description, 100) }}</div>
                        </td>
                        <td class="text-center">
                            <div class="text-slate-500 whitespace-nowrap">
                                <div>{{ $log->created_at ? $log->created_at->format('M d, Y') : 'N/A' }}</div>
                                <div class="text-xs text-slate-400">{{ $log->created_at ? $log->created_at->format('g:i A') : '' }}</div>
                            </div>
                        </td>
                        <td class="table-report__action w-56">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary" href="javascript:;" data-action="view" data-id="{{ $log->id }}" data-tw-toggle="modal" data-tw-target="#view-activity-log-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View Details
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
                                </svg>
                                <div class="font-medium">No activity logs found</div>
                                <div class="text-sm">System activity logs will appear here</div>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    @if($activityLogs && $activityLogs->count() > 0)
    <x-pagination 
        :current-page="$activityLogs->currentPage()" 
        :total-pages="$activityLogs->lastPage()" 
        :per-page="$activityLogs->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    @endif
    <!-- END: Pagination -->
</div>

<!-- BEGIN: View Activity Log Modal -->
<div id="view-activity-log-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Activity Log Details</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body p-0">
                <div id="activity-log-details-content">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading activity log details...</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Activity Log Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/activity_logs/activity_logs.js') }}?v={{ time() }}"></script>
@endpush
