<!DOCTYPE html>
<!--
Template Name: Icewall - HTML Admin Dashboard Template
Author: Left4code
Website: http://www.left4code.com/
Contact: muhammadrizki@left4code.com
Purchase: https://themeforest.net/user/left4code/portfolio
Renew Support: https://themeforest.net/user/left4code/portfolio
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<html lang="en" class="light">
    <!-- BEGIN: Head -->
    <head>
        <meta charset="utf-8">
        <link href="{{ asset('build/assets/images/logo.svg') }}" rel="shortcut icon">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Icewall admin is super flexible, powerful, clean & modern responsive tailwind admin template with unlimited possibilities.">
        <meta name="keywords" content="admin template, Icewall Admin Template, dashboard template, flat admin template, responsive admin template, web app">
        <meta name="author" content="LEFT4CODE">
        <title>@yield('title', 'Dashboard - Midone - Tailwind HTML Admin Template')</title>
        <!-- BEGIN: CSS Assets-->
        @vite('resources/css/app.css')
        <link rel="stylesheet" href="{{ asset('assets/toastify/toastify.css') }}">
        <link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet" />
        <link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet" />
        <link href="https://unpkg.com/filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.css" rel="stylesheet" />
        @livewireStyles
        @stack('styles')
        
        <!-- BEGIN: Announcement Toast Styling -->
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
            
            /* Custom positioning for announcement toasts */
            .toastify.on {
                top: 50px !important; /* Move down from top - below header */
                right: 20px !important;
                z-index: 9999 !important;
                margin-top: 10px !important; /* Add spacing between multiple toasts */
            }
            
            /* Ensure toasts are positioned below header */
            .toastify-right {
                right: 20px !important;
            }
            
            .toastify-top {
                top: 90px !important;
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
        <!-- END: Announcement Toast Styling -->
        <!-- END: CSS Assets-->
    </head>
    <!-- END: Head -->
    <body class="main">
        <!-- BEGIN: Mobile Menu -->
        @include('layout._partials.mobile')
        <!-- END: Mobile Menu -->
        <!-- BEGIN: Top Bar -->
        @include('layout._partials.topbar')
        <!-- END: Top Bar -->
        <div class="wrapper">
            <div class="wrapper-box">
                <!-- BEGIN: Side Menu -->
                @include('layout._partials.sidebar')
                <!-- END: Side Menu -->
                <!-- BEGIN: Content -->
                <div class="content">
                    @yield('content')
                </div>
                <!-- END: Content -->
            </div>
        </div>
        @include('layout._partials.mobile')
        
        <!-- BEGIN: Announcement Notifications -->
        @if(isset($activeAnnouncements) && $activeAnnouncements->count() > 0)
            <!-- Debug: Show announcement count -->
            {{-- Found {{ $activeAnnouncements->count() }} announcements --}}
            @foreach($activeAnnouncements as $index => $announcement)
                <x-notification-toast 
                    :id="'announcement_' . $announcement->id"
                    type="info"
                    :title="$announcement->type"
                    :message="$announcement->description"
                    :showButton="false"
                    :autoHide="true"
                    :duration="8000"
                    position="right"
                    gravity="top"
                />
            @endforeach
        @else
            <!-- Debug: No announcements found -->
            {{-- No active announcements found --}}
        @endif
        <!-- END: Announcement Notifications -->
        
        <!-- BEGIN: JS Assets-->
        @vite('resources/js/app.js')
        <script src="{{ asset('assets/toastify/toastify.js') }}"></script>
        @livewireScripts
        @stack('scripts')
        
        <!-- BEGIN: Announcement Auto-Display Script -->
        @if(isset($activeAnnouncements) && $activeAnnouncements->count() > 0)
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // console.log('Announcement script loaded');
            // Display announcements with staggered timing
            const announcements = @json($activeAnnouncements);
            // console.log('Found announcements:', announcements);
            
            announcements.forEach((announcement, index) => {
                setTimeout(() => {
                    const functionName = 'showNotification_announcement_' + announcement.id;
                    // console.log('Looking for function:', functionName);
                    const showFunction = window[functionName];
                    // console.log('Function found:', typeof showFunction);
                    if (typeof showFunction === 'function') {
                        // console.log('Showing announcement:', announcement.type);
                        showFunction();
                    } else {
                        // console.error('Function not found:', functionName);
                    }
                }, (index + 1) * 2000); // Show each announcement 2 seconds apart
            });
        });
        </script>
        @endif
        <!-- END: Announcement Auto-Display Script -->
        <!-- END: JS Assets-->
    </body>
</html>