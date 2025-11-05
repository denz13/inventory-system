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
        <title>@yield('title', 'GCH HOA CONNECT')</title>
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
        
        <!-- BEGIN: Chatbot Widget -->
        <div id="chatbot-widget" class="fixed bottom-6 right-12 z-50">
            <!-- Chatbot Icon -->
            <div id="chatbot-icon" class="w-14 h-14 bg-primary rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-primary-dark transition-all duration-300 animate-pulse hover:animate-none relative" onclick="toggleChatbot()">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-bounce">
                    <!-- Robot Head -->
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                    <!-- Robot Eyes -->
                    <circle cx="8" cy="16" r="1"></circle>
                    <circle cx="16" cy="16" r="1"></circle>
                    <!-- Robot Antenna -->
                    <path d="M12 2v2"></path>
                    <path d="M12 4l-2 2"></path>
                    <path d="M12 4l2 2"></path>
                    <!-- Robot Mouth -->
                    <path d="M8 19h8"></path>
                </svg>
                
                <!-- Notification Bubble -->
                <div id="chatbot-notification" class="absolute -top-2 -right-2 bg-danger text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-ping">
                    <span class="text-xs">!</span>
                </div>
                
                <!-- Tooltip -->
                <div id="chatbot-tooltip" class="absolute bottom-full right-0 mb-3 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl opacity-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50" style="transform: translateY(-5px);">
                    <div class="flex items-center font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-yellow-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span class="text-white">Ask me anything!</span>
                    </div>
                    <!-- Arrow -->
                    <div class="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
            </div>
            
            <!-- Chatbot Modal -->
            <div id="chatbot-modal" class="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col" style="display: none; visibility: hidden; opacity: 0; transition: opacity 0.3s ease;">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-slate-200 bg-primary text-white rounded-t-lg">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <!-- Robot Head -->
                                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                                <!-- Robot Eyes -->
                                <circle cx="8" cy="16" r="1"></circle>
                                <circle cx="16" cy="16" r="1"></circle>
                                <!-- Robot Antenna -->
                                <path d="M12 2v2"></path>
                                <path d="M12 4l-2 2"></path>
                                <path d="M12 4l2 2"></path>
                                <!-- Robot Mouth -->
                                <path d="M8 19h8"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-sm">AI Assistant</h3>
                            <p class="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                    <button onclick="toggleChatbot()" class="text-white/80 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <!-- Messages Area -->
                <div id="chatbot-messages" class="flex-1 p-4 overflow-y-auto space-y-3">
                    <!-- Welcome Message -->
                    <div class="flex items-start">
                        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <!-- Robot Head -->
                                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                                <!-- Robot Eyes -->
                                <circle cx="8" cy="16" r="1"></circle>
                                <circle cx="16" cy="16" r="1"></circle>
                                <!-- Robot Antenna -->
                                <path d="M12 2v2"></path>
                                <path d="M12 4l-2 2"></path>
                                <path d="M12 4l2 2"></path>
                                <!-- Robot Mouth -->
                                <path d="M8 19h8"></path>
                            </svg>
                        </div>
                        <div class="bg-slate-100 rounded-lg p-3 max-w-sm">
                            <p class="text-sm text-slate-700">Hello! I'm your AI assistant. How can I help you today?</p>
                        </div>
                    </div>
                    
                    <!-- Quick Questions -->
                    <div id="quick-questions" class="space-y-2 mt-3">
                        <p class="text-xs text-slate-500 font-medium px-1">Quick Questions:</p>
                        <button onclick="askQuickQuestion('How to apply for vehicle sticker?')" class="w-full text-left px-3 py-2 bg-white border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-all text-xs font-medium flex items-center shadow-sm hover:shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 flex-shrink-0">
                                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                            </svg>
                            <span>How to apply for vehicle sticker?</span>
                        </button>
                        <button onclick="askQuickQuestion('How to register my business?')" class="w-full text-left px-3 py-2 bg-white border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-all text-xs font-medium flex items-center shadow-sm hover:shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 flex-shrink-0">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <span>How to register my business?</span>
                        </button>
                    </div>
                </div>
                
                <!-- Input Area -->
                <div class="p-4 border-t border-slate-200">
                    <div class="flex items-center space-x-2">
                        <input type="text" id="chatbot-input" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" onkeypress="handleChatbotKeyPress(event)">
                        <button onclick="sendChatbotMessage()" class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Chatbot Widget -->
        
        <!-- BEGIN: Floating Chat Widget -->
        <div id="floating-chat-widget" class="fixed bottom-6 right-6 z-50 hidden">
            
            <!-- Floating Chat Modal -->
            <div id="floating-chat-modal" class="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col" style="display: none; visibility: hidden; opacity: 0; transition: opacity 0.3s ease;">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-600 text-white rounded-t-lg">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                            <img id="floating-chat-user-photo" alt="User" class="w-6 h-6 rounded-full" src="{{ asset('img/user.jpg') }}">
                        </div>
                        <div>
                            <h3 id="floating-chat-user-name" class="font-semibold text-sm">Chat</h3>
                            <p id="floating-chat-user-status" class="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="openFullChat()" class="text-white/80 hover:text-white transition-colors" title="Open full chat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                        </button>
                        <button onclick="toggleFloatingChat()" class="text-white/80 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Messages Area -->
                <div id="floating-chat-messages" class="flex-1 p-3 overflow-y-auto space-y-2">
                    <!-- Messages will be loaded here -->
                </div>
                
                <!-- Input Area -->
                <div class="p-3 border-t border-slate-200">
                    <div class="flex items-center space-x-2">
                        <input type="text" id="floating-chat-input" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" onkeypress="handleFloatingChatKeyPress(event)">
                        <button onclick="sendFloatingChatMessage()" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Floating Chat Widget -->
        
        <!-- BEGIN: Database Notifications -->
        @php
            $user = auth()->user();
            $unreadNotifications = $user ? $user->getUnreadNotifications()->get() : collect();
        @endphp
        
        @if($unreadNotifications->count() > 0)
            @foreach($unreadNotifications as $index => $notification)
                @php
                    // Check if this is a chatbot notification
                    $isChatbotNotification = stripos($notification->title, 'chatbot') !== false 
                                          || stripos($notification->title, 'guest message') !== false
                                          || stripos($notification->message, 'chatbot') !== false;
                    
                    // Use appropriate type and duration for chatbot notifications
                    $notificationType = $isChatbotNotification ? 'info' : $notification->type;
                    $notificationDuration = $isChatbotNotification ? 8000 : 6000;
                @endphp
                
                <x-notification-toast 
                    :id="'notification_' . $notification->id"
                    :type="$notificationType"
                    :title="$notification->title"
                    :message="$notification->message"
                    :showButton="$isChatbotNotification"
                    :buttonText="$isChatbotNotification ? 'View Messages' : ''"
                    :buttonAction="$isChatbotNotification ? 'viewChatbotMessages()' : ''"
                    :autoHide="true"
                    :duration="$notificationDuration"
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
        
        <!-- BEGIN: Logout with Device Tracking Script -->
        <script>
        async function performLogout() {
            console.log('Performing logout with device tracking...');
            
            try {
                // Get device information (same as login)
                var deviceInfo = await getLogoutDeviceInfo();
                console.log('Logout device info:', deviceInfo);
                
                // Create form data
                var formData = new FormData();
                formData.append('_token', document.querySelector('meta[name="csrf-token"]').content);
                formData.append('mac_address', deviceInfo.mac_address);
                formData.append('public_ip', deviceInfo.public_ip || '');
                formData.append('screen_resolution', deviceInfo.screen_resolution);
                formData.append('platform', deviceInfo.platform);
                formData.append('language', deviceInfo.language);
                formData.append('timezone', deviceInfo.timezone);
                formData.append('local_ip', deviceInfo.local_ip || 'N/A');
                
                // Send logout request with device info
                var response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                console.log('Logout response:', response);
                
                // Redirect to login regardless of tracking success
                window.location.href = '/login';
                
            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect to login even if tracking fails
                window.location.href = '/login';
            }
        }
        
        async function getLogoutDeviceInfo() {
            var deviceInfo = {
                mac_address: 'N/A',
                screen_resolution: window.screen.width + 'x' + window.screen.height,
                platform: navigator.platform || 'Unknown',
                user_agent: navigator.userAgent || 'Unknown',
                language: navigator.language || 'Unknown',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
                public_ip: null
            };
            
            // Try to get public IP address
            try {
                var ipResponse = await fetch('https://api.ipify.org?format=json', {
                    method: 'GET'
                });
                if (ipResponse.ok) {
                    var ipData = await ipResponse.json();
                    deviceInfo.public_ip = ipData.ip;
                    console.log('Public IP detected for logout:', ipData.ip);
                }
            } catch (e) {
                console.log('Could not retrieve public IP for logout:', e.message);
                try {
                    var altIpResponse = await fetch('https://api.my-ip.io/ip', {
                        method: 'GET'
                    });
                    if (altIpResponse.ok) {
                        var altIpText = await altIpResponse.text();
                        deviceInfo.public_ip = altIpText.trim();
                        console.log('Public IP detected for logout (alt):', altIpText.trim());
                    }
                } catch (e2) {
                    console.log('Could not retrieve public IP from alternative API for logout:', e2.message);
                }
            }
            
            // Try to get MAC address using WebRTC
            try {
                var pc = new RTCPeerConnection({iceServers: []});
                pc.createDataChannel('');
                
                await new Promise((resolve) => {
                    pc.createOffer().then(offer => pc.setLocalDescription(offer));
                    pc.onicecandidate = function(ice) {
                        if (!ice || !ice.candidate || !ice.candidate.candidate) {
                            resolve();
                            return;
                        }
                        var candidateStr = ice.candidate.candidate;
                        var macMatch = candidateStr.match(/([0-9a-f]{2}[:-]){5}[0-9a-f]{2}/i);
                        if (macMatch) {
                            deviceInfo.mac_address = macMatch[0];
                        }
                        var ipMatch = candidateStr.match(/(\d+\.\d+\.\d+\.\d+)/);
                        if (ipMatch) {
                            deviceInfo.local_ip = ipMatch[1];
                        }
                        resolve();
                    };
                    setTimeout(() => resolve(), 500);
                });
                
                pc.close();
            } catch (e) {
                console.log('Could not retrieve MAC address via WebRTC for logout:', e.message);
            }
            
            // Create device fingerprint if MAC is still N/A
            if (deviceInfo.mac_address === 'N/A') {
                try {
                    var fingerprint = '';
                    fingerprint += navigator.hardwareConcurrency || '0';
                    fingerprint += '-' + (navigator.deviceMemory || '0');
                    fingerprint += '-' + screen.colorDepth || '0';
                    fingerprint += '-' + screen.pixelDepth || '0';
                    fingerprint += '-' + (navigator.maxTouchPoints || '0');
                    
                    var hash = 0;
                    for (var i = 0; i < fingerprint.length; i++) {
                        var char = fingerprint.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    
                    var hashStr = Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
                    deviceInfo.mac_address = hashStr.match(/.{1,2}/g).join(':').toUpperCase();
                    deviceInfo.mac_address = 'DEVICE-' + deviceInfo.mac_address;
                } catch (e) {
                    console.log('Could not create device fingerprint for logout:', e.message);
                }
            }
            
            return deviceInfo;
        }
        </script>
        <!-- END: Logout with Device Tracking Script -->
        
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
                        
                        // Check if this is a chatbot notification
                        const isChatbotNotification = notification.title.toLowerCase().includes('chatbot') 
                                                   || notification.title.toLowerCase().includes('guest message')
                                                   || notification.message.toLowerCase().includes('chatbot');
                        
                        // Mark notification as read after showing (longer delay for chatbot notifications)
                        const readDelay = isChatbotNotification ? 2000 : 1000;
                        setTimeout(() => {
                            markNotificationAsRead(notification.id);
                        }, readDelay);
                        
                        // For chatbot notifications, also show notification badge on chatbot icon
                        if (isChatbotNotification) {
                            showChatbotNotificationBadge();
                        }
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
            
            // Function to show chatbot notification badge
            function showChatbotNotificationBadge() {
                const chatbotNotification = document.getElementById('chatbot-notification');
                if (chatbotNotification) {
                    chatbotNotification.style.display = 'flex';
                    console.log('Chatbot notification badge shown');
                }
            }
        });
        
        // Function to view chatbot messages (called from notification button)
        function viewChatbotMessages() {
            console.log('View chatbot messages clicked');
            // Open the chatbot modal
            if (!chatbotOpen) {
                toggleChatbot();
            }
            // Scroll to top of chatbot messages to see latest
            setTimeout(() => {
                const messagesContainer = document.getElementById('chatbot-messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = 0;
                }
            }, 300);
        }
        </script>
        @endif
        <!-- END: Database Notifications Auto-Display Script -->
        
        <!-- BEGIN: Chatbot JavaScript -->
        <script>
        // Chatbot functionality
        let chatbotOpen = false;
        
        // Generate unique guest identifier (new on every page load) - for non-authenticated users
        let currentGuestId = null;
        
        function getGuestId() {
            // Check if user is authenticated
            @auth
                return 'USER-{{ auth()->id() }}';
            @else
                if (!currentGuestId) {
                    // Generate unique guest ID: GUEST-{timestamp}-{random}
                    const timestamp = Date.now();
                    const random = Math.random().toString(36).substring(2, 15);
                    currentGuestId = `GUEST-${timestamp}-${random}`;
                    console.log('New guest ID generated for this session:', currentGuestId);
                }
                return currentGuestId;
            @endauth
        }
        
        function toggleChatbot() {
            const modal = document.getElementById('chatbot-modal');
            const icon = document.getElementById('chatbot-icon');
            const notification = document.getElementById('chatbot-notification');
            const tooltip = document.getElementById('chatbot-tooltip');
            
            console.log('Toggle chatbot called, current state:', chatbotOpen);
            console.log('Modal current display:', modal ? modal.style.display : 'null');
            
            if (chatbotOpen) {
                // Close chatbot
                if (modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.style.display = 'none';
                        modal.style.visibility = 'hidden';
                    }, 300);
                }
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
                chatbotOpen = false;
                // Hide tooltip when closing
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
            } else {
                // Open chatbot
                if (modal) {
                    modal.style.display = 'flex';
                    modal.style.visibility = 'visible';
                    // Trigger reflow for transition
                    modal.offsetHeight;
                    modal.style.opacity = '1';
                }
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
                chatbotOpen = true;
                // Hide notification bubble when opened
                if (notification) {
                    notification.style.display = 'none';
                }
                // Hide tooltip when opened
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
                
                // Load conversation history when opening
                loadConversationHistory();
                
                // Focus on input when opened
                setTimeout(() => {
                    const input = document.getElementById('chatbot-input');
                    if (input) input.focus();
                }, 100);
            }
            
            console.log('Chatbot toggled, new state:', chatbotOpen);
            console.log('Modal new display:', modal ? modal.style.display : 'null');
        }
        
        function handleChatbotKeyPress(event) {
            if (event.key === 'Enter') {
                sendChatbotMessage();
            }
        }
        
        function sendChatbotMessage() {
            const input = document.getElementById('chatbot-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Get guest ID
            const guestId = getGuestId();
            
            // Add user message to chat
            addMessageToChat(message, 'user');
            
            // Clear input
            input.value = '';
            
            // Hide quick questions if they exist
            hideQuickQuestions();
            
            // Show typing indicator
            showTypingIndicator();
            
            // Send message to backend with guest_id
            fetch('/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ 
                    message: message,
                    guest_id: guestId
                })
            })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                if (data.success) {
                    addMessageToChat(data.response, 'bot');
                } else {
                    addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
                }
            })
            .catch(error => {
                hideTypingIndicator();
                console.error('Chatbot error:', error);
                addMessageToChat('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
            });
        }
        
        function askQuickQuestion(question) {
            // Debug: Log the question being sent
            console.log('Sending quick question:', question);
            
            // Get guest ID
            const guestId = getGuestId();
            
            // Add question as user message
            addMessageToChat(question, 'user');
            
            // Hide quick questions
            hideQuickQuestions();
            
            // Show typing indicator
            showTypingIndicator();
            
            // Send question to backend with guest_id
            fetch('/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ 
                    message: question,
                    guest_id: guestId
                })
            })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                console.log('Chatbot response:', data);
                if (data.success) {
                    addMessageToChat(data.response, 'bot');
                } else {
                    addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
                }
            })
            .catch(error => {
                hideTypingIndicator();
                console.error('Chatbot error:', error);
                addMessageToChat('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
            });
        }
        
        function hideQuickQuestions() {
            const quickQuestions = document.getElementById('quick-questions');
            if (quickQuestions) {
                quickQuestions.style.display = 'none';
            }
        }
        
        function addMessageToChat(message, sender, adminName = null) {
            const messagesContainer = document.getElementById('chatbot-messages');
            const messageDiv = document.createElement('div');
            
            if (sender === 'user') {
                messageDiv.className = 'flex items-start justify-end';
                messageDiv.innerHTML = `
                    <div class="bg-primary text-white rounded-lg p-3 max-w-sm">
                        <p class="text-sm">${escapeHtml(message)}</p>
                    </div>
                `;
            } else if (sender === 'admin') {
                // Admin reply message
                messageDiv.className = 'flex items-start';
                messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <div class="bg-green-50 rounded-lg p-3 max-w-sm border border-green-200">
                        <div class="text-xs font-semibold text-green-700 mb-1">${adminName || 'Admin'}</div>
                        <div class="text-sm text-slate-700 whitespace-pre-line">${escapeHtml(message)}</div>
                    </div>
                `;
            } else {
                // Bot message
                const formattedMessage = formatBotMessage(message);
                
                messageDiv.className = 'flex items-start';
                messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <!-- Robot Head -->
                            <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                            <!-- Robot Eyes -->
                            <circle cx="8" cy="16" r="1"></circle>
                            <circle cx="16" cy="16" r="1"></circle>
                            <!-- Robot Antenna -->
                            <path d="M12 2v2"></path>
                            <path d="M12 4l-2 2"></path>
                            <path d="M12 4l2 2"></path>
                            <!-- Robot Mouth -->
                            <path d="M8 19h8"></path>
                        </svg>
                    </div>
                    <div class="bg-slate-100 rounded-lg p-3 max-w-sm">
                        <div class="text-sm text-slate-700 whitespace-pre-line">${formattedMessage}</div>
                    </div>
                `;
            }
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function formatBotMessage(message) {
            // Escape HTML first
            let formatted = escapeHtml(message);
            
            // Convert **text** to bold
            formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            
            // Convert bullet points (• or -) to proper list items
            formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<span class="block ml-2">• $1</span>');
            
            // Convert numbered items (1️⃣, 2️⃣, etc.)
            formatted = formatted.replace(/^(\d+[️⃣]*\.?\s+\*\*[^*]+\*\*)/gm, '<div class="font-semibold mt-2">$1</div>');
            
            return formatted;
        }
        
        function showTypingIndicator() {
            const messagesContainer = document.getElementById('chatbot-messages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'flex items-start';
            typingDiv.innerHTML = `
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <!-- Robot Head -->
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                        <!-- Robot Eyes -->
                        <circle cx="8" cy="16" r="1"></circle>
                        <circle cx="16" cy="16" r="1"></circle>
                        <!-- Robot Antenna -->
                        <path d="M12 2v2"></path>
                        <path d="M12 4l-2 2"></path>
                        <path d="M12 4l2 2"></path>
                        <!-- Robot Mouth -->
                        <path d="M8 19h8"></path>
                    </svg>
                </div>
                <div class="bg-slate-100 rounded-lg p-3 max-w-sm">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Load conversation history
        function loadConversationHistory() {
            const guestId = getGuestId();
            
            // Fetch conversation history from backend
            fetch(`/chatbot/guest-conversation?guest_id=${guestId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data && data.data.length > 0) {
                        console.log('Loading conversation history:', data.data.length, 'messages');
                        
                        // Clear current messages except welcome and quick questions
                        const messagesContainer = document.getElementById('chatbot-messages');
                        const welcomeMsg = messagesContainer.querySelector('.flex.items-start');
                        const quickQuestions = document.getElementById('quick-questions');
                        
                        // Clear all messages
                        messagesContainer.innerHTML = '';
                        
                        // Re-add welcome message
                        if (welcomeMsg) {
                            messagesContainer.appendChild(welcomeMsg.cloneNode(true));
                        }
                        
                        // Load conversation messages
                        data.data.forEach(msg => {
                            if (msg.from_admin) {
                                addMessageToChat(msg.message, 'admin', msg.admin_name);
                            } else {
                                addMessageToChat(msg.message, msg.is_bot ? 'bot' : 'user');
                            }
                            
                            // Track the last message ID
                            if (msg.id > lastCheckedMessageId) {
                                lastCheckedMessageId = msg.id;
                            }
                        });
                        
                        // Hide quick questions if there are messages
                        if (data.data.length > 0) {
                            hideQuickQuestions();
                        }
                    } else {
                        console.log('No conversation history found for this session');
                    }
                })
                .catch(error => {
                    console.error('Error loading conversation history:', error);
                });
        }
        
        // Real-time polling for admin replies
        // Note: Every page reload = NEW guest_id & FRESH chat UI
        // Messages are saved to DB for admin tracking only
        // Only NEW admin replies during current session will appear in real-time
        let lastCheckedMessageId = 0;
        let pollingInterval = null;
        
        function startPollingForReplies() {
            const guestId = getGuestId();
            
            // Poll every 3 seconds for NEW admin replies only
            pollingInterval = setInterval(() => {
                if (!chatbotOpen) return; // Only poll when chatbot is open
                
                fetch(`/chatbot/guest-conversation?guest_id=${guestId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Check for NEW admin messages only (after current session started)
                            const newMessages = data.data.filter(msg => {
                                return msg.id > lastCheckedMessageId && msg.from_admin;
                            });
                            
                            if (newMessages.length > 0) {
                                console.log(`Found ${newMessages.length} new admin reply/replies`);
                            }
                            
                            // Display new admin replies in real-time
                            newMessages.forEach(msg => {
                                addMessageToChat(msg.message, 'admin', msg.admin_name);
                                lastCheckedMessageId = msg.id;
                                
                                // Show notification if new admin reply arrived
                                showNewMessageNotification(msg.admin_name || 'Admin');
                                
                                // Show notification bubble if chatbot is closed
                                if (!chatbotOpen) {
                                    const notificationBubble = document.getElementById('chatbot-notification');
                                    if (notificationBubble) {
                                        notificationBubble.style.display = 'flex';
                                    }
                                }
                            });
                        }
                    })
                    .catch(error => {
                        // Silently handle errors to avoid console spam
                        // console.error('Polling error:', error);
                    });
            }, 3000); // Check every 3 seconds
        }
        
        function stopPollingForReplies() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        }
        
        // Show notification when new admin message arrives
        function showNewMessageNotification(adminName) {
            // Visual notification in chat
            const messagesContainer = document.getElementById('chatbot-messages');
            const notifDiv = document.createElement('div');
            notifDiv.className = 'text-center py-2';
            notifDiv.innerHTML = `
                <div class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    ✉️ ${adminName} replied to your message
                </div>
            `;
            messagesContainer.appendChild(notifDiv);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notifDiv.remove();
            }, 3000);
            
            // Scroll to show new message
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            console.log(`New admin reply from ${adminName}`);
        }
        
        // Close chatbot when clicking outside
        document.addEventListener('click', function(event) {
            const chatbotWidget = document.getElementById('chatbot-widget');
            const chatbotModal = document.getElementById('chatbot-modal');
            
            if (chatbotOpen && !chatbotWidget.contains(event.target)) {
                toggleChatbot();
            }
        });
        
        // Initialize chatbot on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Chatbot initializing...');
            
            // Ensure modal is hidden on page load
            const modal = document.getElementById('chatbot-modal');
            if (modal) {
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                console.log('Modal hidden on load');
            }
            
            // Reset chatbot state
            chatbotOpen = false;
            
            // Also ensure icon is in default state
            const icon = document.getElementById('chatbot-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Start polling for new messages (no initialization needed - fresh guest_id every reload)
            startPollingForReplies();
            console.log('Started polling for admin replies');
            
            // Tooltip hover functionality
            const chatbotIcon = document.getElementById('chatbot-icon');
            const tooltip = document.getElementById('chatbot-tooltip');
            const notification = document.getElementById('chatbot-notification');
            
            if (chatbotIcon && tooltip) {
                // Show tooltip on hover
                chatbotIcon.addEventListener('mouseenter', function() {
                    if (!chatbotOpen) {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateY(0px)';
                        tooltip.style.pointerEvents = 'auto';
                    }
                });
                
                // Hide tooltip on mouse leave
                chatbotIcon.addEventListener('mouseleave', function() {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(-5px)';
                    tooltip.style.pointerEvents = 'none';
                });
                
                // Auto-hide notification after 10 seconds
                if (notification) {
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 10000);
                }
                
                // Show tooltip automatically after 3 seconds if not opened
                setTimeout(() => {
                    if (!chatbotOpen) {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateY(0px)';
                        tooltip.style.pointerEvents = 'auto';
                        
                        // Auto-hide tooltip after 5 seconds
                        setTimeout(() => {
                            if (!chatbotOpen) {
                                tooltip.style.opacity = '0';
                                tooltip.style.transform = 'translateY(-5px)';
                                tooltip.style.pointerEvents = 'none';
                            }
                        }, 5000);
                    }
                }, 3000);
            }
            
            console.log('Chatbot initialized successfully');
        });
        </script>
        <!-- END: Chatbot JavaScript -->
        
        <!-- BEGIN: Floating Chat JavaScript -->
        <script>
        // Floating Chat functionality
        let floatingChatOpen = false;
        let currentFloatingChatUserId = null;
        let currentFloatingChatUserName = '';
        let currentFloatingChatUserPhoto = '';
        let floatingChatCheckInterval = null;
        let floatingChatNotificationCheckInterval = null;
        let lastMessageCheckTime = 0;
        
        // Initialize floating chat
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Floating chat initializing...');
            
            // Check if user is authenticated
            @auth
                initializeFloatingChat();
            @else
                console.log('User not authenticated, floating chat disabled');
            @endauth
        });
        
        function initializeFloatingChat() {
            // Start checking for new messages every 5 seconds
            floatingChatNotificationCheckInterval = setInterval(checkForNewMessages, 5000);
            
            // Check for new messages immediately
            checkForNewMessages();
            
            // Initialize tooltip functionality
            initializeFloatingChatTooltip();
            
            console.log('Floating chat initialized');
        }
        
        function initializeFloatingChatTooltip() {
            const floatingChatIcon = document.getElementById('floating-chat-icon');
            const tooltip = document.getElementById('floating-chat-tooltip');
            
            if (floatingChatIcon && tooltip) {
                // Show tooltip on hover
                floatingChatIcon.addEventListener('mouseenter', function() {
                    if (!floatingChatOpen) {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateY(0px)';
                        tooltip.style.pointerEvents = 'auto';
                    }
                });
                
                // Hide tooltip on mouse leave
                floatingChatIcon.addEventListener('mouseleave', function() {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(-5px)';
                    tooltip.style.pointerEvents = 'none';
                });
            }
        }
        
        function toggleFloatingChat() {
            const modal = document.getElementById('floating-chat-modal');
            const icon = document.getElementById('floating-chat-icon');
            const notification = document.getElementById('floating-chat-notification');
            const tooltip = document.getElementById('floating-chat-tooltip');
            
            if (floatingChatOpen) {
                // Close floating chat
                if (modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.style.display = 'none';
                        modal.style.visibility = 'hidden';
                    }, 300);
                }
                floatingChatOpen = false;
                
                // Hide tooltip when closing
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
                
                // Stop checking for messages
                if (floatingChatCheckInterval) {
                    clearInterval(floatingChatCheckInterval);
                    floatingChatCheckInterval = null;
                }
            } else {
                // Open floating chat
                if (modal) {
                    modal.style.display = 'flex';
                    modal.style.visibility = 'visible';
                    modal.offsetHeight; // Trigger reflow
                    modal.style.opacity = '1';
                }
                floatingChatOpen = true;
                
                // Hide notification bubble when opened
                if (notification) {
                    notification.style.display = 'none';
                }
                
                // Hide tooltip when opened
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
                
                // If we have a current chat user, load their messages
                if (currentFloatingChatUserId) {
                    loadFloatingChatMessages(currentFloatingChatUserId);
                    
                    // Start checking for new messages every 3 seconds
                    floatingChatCheckInterval = setInterval(() => {
                        loadFloatingChatMessages(currentFloatingChatUserId, true);
                    }, 3000);
                }
                
                // Focus on input when opened
                setTimeout(() => {
                    const input = document.getElementById('floating-chat-input');
                    if (input) input.focus();
                }, 100);
            }
        }
        
        function checkForNewMessages() {
            const now = Date.now();
            
            // Prevent too frequent checks (minimum 3 seconds between checks)
            if (now - lastMessageCheckTime < 3000) {
                return;
            }
            lastMessageCheckTime = now;
            
            fetch('/chat/unread-count', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.count > 0) {
                    // Get the latest message sender first
                    getLatestMessageSender().then(() => {
                        // Then automatically open the chat modal
                        if (!floatingChatOpen) {
                            autoOpenFloatingChat();
                        }
                    });
                } else {
                    hideFloatingChatWidget();
                }
            })
            .catch(error => {
                console.error('Error checking for new messages:', error);
            });
        }
        
        function getLatestMessageSender() {
            return fetch('/chat/latest-message-sender', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.sender) {
                    // Set current chat user with real data
                    currentFloatingChatUserId = data.sender.id;
                    currentFloatingChatUserName = data.sender.name;
                    currentFloatingChatUserPhoto = data.sender.photo;
                    
                    // Update floating chat header
                    updateFloatingChatHeader();
                    return data.sender;
                }
                return null;
            })
            .catch(error => {
                console.error('Error getting latest message sender:', error);
                return null;
            });
        }
        
        function updateFloatingChatHeader() {
            const userNameEl = document.getElementById('floating-chat-user-name');
            const userPhotoEl = document.getElementById('floating-chat-user-photo');
            const userStatusEl = document.getElementById('floating-chat-user-status');
            
            if (userNameEl) userNameEl.textContent = currentFloatingChatUserName;
            if (userPhotoEl) userPhotoEl.src = currentFloatingChatUserPhoto;
            if (userStatusEl) userStatusEl.textContent = 'Online';
        }
        
        function autoOpenFloatingChat() {
            const modal = document.getElementById('floating-chat-modal');
            const widget = document.getElementById('floating-chat-widget');
            
            if (modal && widget) {
                // Show the widget
                widget.classList.remove('hidden');
                
                // Open the modal directly with animation
                modal.style.display = 'flex';
                modal.style.visibility = 'visible';
                modal.offsetHeight; // Trigger reflow
                
                // Add bounce animation
                modal.style.transform = 'scale(0.8)';
                modal.style.opacity = '0';
                
                setTimeout(() => {
                    modal.style.transform = 'scale(1)';
                    modal.style.opacity = '1';
                    modal.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                }, 10);
                
                floatingChatOpen = true;
                
                // Load messages for the current user
                if (currentFloatingChatUserId) {
                    loadFloatingChatMessages(currentFloatingChatUserId);
                    
                    // Start checking for new messages every 3 seconds
                    floatingChatCheckInterval = setInterval(() => {
                        loadFloatingChatMessages(currentFloatingChatUserId, true);
                    }, 3000);
                }
                
                // Focus on input
                setTimeout(() => {
                    const input = document.getElementById('floating-chat-input');
                    if (input) input.focus();
                }, 100);
                
                // Play notification sound (if available)
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7j9n1unEiBS13yO/eizEIHWq+8+OWT');
                    audio.volume = 0.3;
                    audio.play().catch(() => {
                        // Ignore if audio fails to play
                    });
                } catch (e) {
                    // Ignore audio errors
                }
            }
        }
        
        function showFloatingChatWidget() {
            const widget = document.getElementById('floating-chat-widget');
            const notification = document.getElementById('floating-chat-notification');
            
            if (widget) {
                widget.classList.remove('hidden');
                
                // Show notification bubble
                if (notification) {
                    notification.style.display = 'flex';
                }
                
                // Auto-hide notification after 10 seconds
                setTimeout(() => {
                    if (notification) {
                        notification.style.display = 'none';
                    }
                }, 10000);
            }
        }
        
        function hideFloatingChatWidget() {
            const widget = document.getElementById('floating-chat-widget');
            if (widget && !floatingChatOpen) {
                widget.classList.add('hidden');
            }
        }
        
        function loadFloatingChatMessages(userId, silent = false) {
            if (!silent) {
                showFloatingChatLoading();
            }
            
            fetch(`/chat/messages/${userId}`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayFloatingChatMessages(data.messages, data.currentUserId);
                } else {
                    showFloatingChatError('Failed to load messages');
                }
            })
            .catch(error => {
                console.error('Error loading floating chat messages:', error);
                if (!silent) {
                    showFloatingChatError('Error loading messages');
                }
            });
        }
        
        function displayFloatingChatMessages(messages, currentUserId) {
            const container = document.getElementById('floating-chat-messages');
            container.innerHTML = '';
            
            messages.forEach(function(message) {
                const isCurrentUser = message.from_id == currentUserId;
                const messageHtml = createFloatingChatMessageElement(message, isCurrentUser);
                container.insertAdjacentHTML('beforeend', messageHtml);
            });
            
            // Scroll to bottom
            scrollFloatingChatToBottom();
        }
        
        function createFloatingChatMessageElement(message, isCurrentUser) {
            const messageClass = isCurrentUser ? 'flex justify-end' : 'flex justify-start';
            const bubbleClass = isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700';
            
            return `
                <div class="${messageClass}">
                    <div class="max-w-xs ${bubbleClass} rounded-lg px-3 py-2 text-sm">
                        <div class="message-text">${escapeHtml(message.message)}</div>
                        <div class="text-xs opacity-70 mt-1">${formatMessageTime(message.created_at)}</div>
                    </div>
                </div>
            `;
        }
        
        function sendFloatingChatMessage() {
            const input = document.getElementById('floating-chat-input');
            const message = input.value.trim();
            
            if (!message || !currentFloatingChatUserId) {
                return;
            }
            
            const sendBtn = document.querySelector('#floating-chat-modal button[onclick="sendFloatingChatMessage()"]');
            if (sendBtn) sendBtn.disabled = true;
            
            fetch('/chat/send', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to_id: currentFloatingChatUserId,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    input.value = '';
                    loadFloatingChatMessages(currentFloatingChatUserId, true);
                } else {
                    showFloatingChatError('Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error sending floating chat message:', error);
                showFloatingChatError('Error sending message');
            })
            .finally(() => {
                if (sendBtn) sendBtn.disabled = false;
                input.focus();
            });
        }
        
        function handleFloatingChatKeyPress(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendFloatingChatMessage();
            }
        }
        
        function openFullChat() {
            // Redirect to full chat page
            window.location.href = '/chat';
        }
        
        // Helper functions
        function showFloatingChatLoading() {
            const container = document.getElementById('floating-chat-messages');
            container.innerHTML = '<div class="text-center py-4"><div class="text-slate-500 text-sm">Loading messages...</div></div>';
        }
        
        function showFloatingChatError(message) {
            const container = document.getElementById('floating-chat-messages');
            container.innerHTML = `<div class="text-center py-4"><div class="text-red-500 text-sm">${message}</div></div>`;
        }
        
        function scrollFloatingChatToBottom() {
            const container = document.getElementById('floating-chat-messages');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
        
        function formatMessageTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) {
                return 'Just now';
            } else if (diffMins < 60) {
                return `${diffMins}m ago`;
            } else if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else if (diffDays < 7) {
                return `${diffDays}d ago`;
            } else {
                return date.toLocaleDateString();
            }
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Close floating chat when clicking outside
        document.addEventListener('click', function(event) {
            const floatingChatWidget = document.getElementById('floating-chat-widget');
            const floatingChatModal = document.getElementById('floating-chat-modal');
            
            if (floatingChatOpen && !floatingChatWidget.contains(event.target)) {
                toggleFloatingChat();
            }
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (floatingChatCheckInterval) {
                clearInterval(floatingChatCheckInterval);
            }
            if (floatingChatNotificationCheckInterval) {
                clearInterval(floatingChatNotificationCheckInterval);
            }
        });
        </script>
        <!-- END: Floating Chat JavaScript -->
        
        <!-- END: JS Assets-->
    </body>
</html>