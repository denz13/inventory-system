@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Users Login: Monitor all user login and logout activities. Track authentication events, browser information, IP addresses, and device locations.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    User Login Activities
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="users_login_toast_success" type="success" title="Success" message="Action completed successfully"
        :showButton="false" />
    <x-notification-toast id="users_login_toast_error" type="error" title="Error" :showButton="false">
        <div id="users_login_error_message_slot" class="text-slate-500 mt-1"></div>
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
            Showing <span id="filtered-count">{{ $usersLogin->count() }}</span> of <span id="total-count">{{ $usersLogin->total() }}</span> login activities
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
            <table class="table table-report -mt-2" id="usersLoginTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">ID</th>
                        <th class="whitespace-nowrap">USER</th>
                        <th class="whitespace-nowrap">STATUS</th>
                        <th class="whitespace-nowrap">BROWSER</th>
                        <th class="whitespace-nowrap">IP ADDRESS</th>
                        <th class="whitespace-nowrap">LOCATION</th>
                        <th class="text-center whitespace-nowrap">DATE & TIME</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($usersLogin as $login)
                    <tr class="intro-x" data-id="{{ $login->id }}">
                        <td class="w-20">
                            <div class="font-medium text-slate-600">#{{ str_pad($login->id, 6, '0', STR_PAD_LEFT) }}</div>
                        </td>
                        <td class="w-40">
                            <div class="flex items-center">
                                <div class="w-10 h-10 image-fit zoom-in">
                                    @if($login->user && $login->user->photo)
                                        <img alt="{{ $login->user->name }}" class="tooltip rounded-full" src="{{ asset('storage/profiles/' . $login->user->photo) }}" title="{{ $login->user->name }}">
                                    @else
                                        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {{ $login->user ? strtoupper(substr($login->user->name, 0, 1)) : 'U' }}
                                        </div>
                                    @endif
                                </div>
                                <div class="ml-3">
                                    <div class="font-medium">{{ $login->user ? $login->user->name : 'Unknown User' }}</div>
                                    <div class="text-slate-500 text-xs">{{ $login->user ? $login->user->email : 'N/A' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="w-20">
                            @if($login->status === 'login')
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mr-1">
                                        <path d="M9 12l2 2 4-4"></path>
                                        <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                                    </svg>
                                    Login
                                </span>
                            @elseif($login->status === 'logout')
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mr-1">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16,17 21,12 16,7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </span>
                            @else
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                    {{ ucfirst($login->status) }}
                                </span>
                            @endif
                        </td>
                        <td class="w-32">
                            <div class="text-slate-600 text-sm">{{ Str::limit($login->browser, 20) }}</div>
                        </td>
                        <td class="w-24">
                            <div class="text-slate-600 text-sm font-mono">{{ $login->ip_address }}</div>
                        </td>
                        <td class="w-32">
                            <div class="text-slate-600 text-sm">{{ Str::limit($login->location, 25) }}</div>
                        </td>
                        <td class="text-center">
                            <div class="text-slate-500 whitespace-nowrap">
                                <div>{{ $login->created_at ? $login->created_at->format('M d, Y') : 'N/A' }}</div>
                                <div class="text-xs text-slate-400">{{ $login->created_at ? $login->created_at->format('g:i A') : '' }}</div>
                            </div>
                        </td>
                        <td class="table-report__action w-56">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary" href="javascript:;" data-action="view" data-id="{{ $login->id }}" data-tw-toggle="modal" data-tw-target="#view-user-login-modal">
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
                        <td colspan="8" class="text-center py-8">
                            <div class="text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <path d="M20 8v6"></path>
                                    <path d="M23 11h-6"></path>
                                </svg>
                                <div class="font-medium">No login activities found</div>
                                <div class="text-sm">User login activities will appear here</div>
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
    @if($usersLogin && $usersLogin->count() > 0)
    <x-pagination 
        :current-page="$usersLogin->currentPage()" 
        :total-pages="$usersLogin->lastPage()" 
        :per-page="$usersLogin->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    @endif
    <!-- END: Pagination -->
</div>

<!-- BEGIN: View User Login Modal -->
<div id="view-user-login-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">User Login Details</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body p-0">
                <div id="user-login-details-content">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading login details...</p>
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
<!-- END: View User Login Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/users_login/users_login.js') }}?v={{ time() }}"></script>
@endpush
