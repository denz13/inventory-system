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
        
        <!-- BEGIN: Database Notifications -->
        @php
            $user = auth()->user();
            $unreadNotifications = $user ? $user->getUnreadNotifications()->get() : collect();
        @endphp
        
        @if($unreadNotifications->count() > 0)
            @foreach($unreadNotifications as $index => $notification)
                <x-notification-toast 
                    :id="'notification_' . $notification->id"
                    :type="$notification->type"
                    :title="$notification->title"
                    :message="$notification->message"
                    :showButton="false"
                    :autoHide="true"
                    :duration="6000"
                    position="right"
                    gravity="top"
                />
            @endforeach
        @endif
        <!-- END: Database Notifications -->
        
        <!-- BEGIN: JS Assets-->
        @vite('resources/js/app.js')
        <script src="{{ asset('assets/toastify/toastify.js') }}"></script>
        @livewireScripts
        @stack('scripts')
        
        <!-- BEGIN: Database Notifications Auto-Display Script -->
        @if($unreadNotifications->count() > 0)
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Database notifications script loaded');
            // Display notifications with staggered timing
            const notifications = @json($unreadNotifications);
            console.log('Found notifications:', notifications);
            
            notifications.forEach((notification, index) => {
                setTimeout(() => {
                    const functionName = 'showNotification_notification_' + notification.id;
                    console.log('Looking for function:', functionName);
                    const showFunction = window[functionName];
                    console.log('Function found:', typeof showFunction);
                    if (typeof showFunction === 'function') {
                        console.log('Showing notification:', notification.title);
                        showFunction();
                        
                        // Mark notification as read after showing
                        setTimeout(() => {
                            markNotificationAsRead(notification.id);
                        }, 1000);
                    } else {
                        console.error('Function not found:', functionName);
                    }
                }, (index + 1) * 2000); // Show each notification 2 seconds apart
            });
            
            // Function to mark notification as read
            function markNotificationAsRead(notificationId) {
                fetch('/notifications/' + notificationId + '/mark-read', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Notification marked as read:', data);
                })
                .catch(error => {
                    console.error('Error marking notification as read:', error);
                });
            }
        });
        </script>
        @endif
        <!-- END: Database Notifications Auto-Display Script -->
        <!-- END: JS Assets-->
    </body>
</html>