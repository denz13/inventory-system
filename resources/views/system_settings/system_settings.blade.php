@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>System Settings: Manage system configuration settings. Update values for different system parameters.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    System Settings
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="system_settings_toast_success" type="success" title="Success" message="System setting updated successfully"
        :showButton="false" />
    <x-notification-toast id="system_settings_toast_error" type="error" title="Error" :showButton="false">
        <div id="system_settings_error_message_slot" class="text-slate-500 mt-1"></div>
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
    <div class="intro-y col-span-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @forelse($systemSettings as $setting)
            <div class="intro-y box p-5">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        @if($setting->type === 'image')
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21,15 16,10 5,21"></polyline>
                            </svg>
                        @else
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                        @endif
                    </div>
                    <div>
                        <h3 class="font-medium text-lg">{{ $setting->key }}</h3>
                        <p class="text-slate-500 text-sm">{{ $setting->description }}</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    @if($setting->type === 'image')
                        <div class="mb-3">
                            <label class="form-label text-sm font-medium text-slate-700">Current Image</label>
                            @if($setting->value)
                                <div class="mt-2">
                                    <img src="{{ asset('storage/' . $setting->value) }}" alt="{{ $setting->key }}" class="w-full h-32 object-cover rounded-lg border">
                                </div>
                            @else
                                <div class="mt-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500">
                                    No image uploaded
                                </div>
                            @endif
                        </div>
                    @else
                        <div class="mb-3">
                            <label class="form-label text-sm font-medium text-slate-700">Current Value</label>
                            <div class="mt-2 p-3 bg-slate-50 rounded-lg border">
                                <span class="text-slate-700">{{ $setting->value ?: 'No value set' }}</span>
                            </div>
                        </div>
                    @endif
                </div>

                <form class="update-setting-form" data-setting-id="{{ $setting->id }}" data-setting-type="{{ $setting->type }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    
                    <div class="mb-4">
                        @if($setting->type === 'image')
                            <label class="form-label text-sm font-medium text-slate-700">Upload New Image</label>
                            <input type="file" name="value" class="form-control mt-2" accept="image/*" required>
                            <small class="text-slate-500">Supported formats: JPG, PNG, GIF (Max: 5MB)</small>
                        @else
                            <label class="form-label text-sm font-medium text-slate-700">New Value</label>
                            <input type="text" name="value" class="form-control mt-2" value="{{ $setting->value }}" placeholder="Enter new value" required>
                        @endif
                    </div>
                    
                    <div class="flex justify-end">
                        <button type="submit" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                            </svg>
                            Update Setting
                        </button>
                    </div>
                </form>
            </div>
            @empty
            <div class="col-span-full">
                <div class="text-center py-12">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                            <path d="M3 13v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"></path>
                        </svg>
                        <div class="font-medium">No system settings found</div>
                        <div class="text-sm">System settings will appear here when available</div>
                    </div>
                </div>
            </div>
            @endforelse
        </div>
    </div>
</div>


@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/system_settings/system_settings.js') }}"></script>
@endpush
