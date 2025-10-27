<div class="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12">
    <div class="h-full flex items-center">
        <!-- BEGIN: Logo -->
        <a href="{{ route('dashboard') }}" class="-intro-x hidden md:flex hover:opacity-80 transition-opacity">
            @if($topbarTopLogo && $topbarTopLogo->value)
                <img alt="Topbar Logo" class="w-6" src="{{ asset('storage/' . $topbarTopLogo->value) }}">
            @else
                <img alt="Midone - HTML Admin Template" class="w-6" src="dist/images/logo.png">
            @endif
            <span class="text-white text-lg ml-3">
                @if($topbarTopText && $topbarTopText->value)
                    {{ $topbarTopText->value }}
                @else
                    GCH
                @endif
            </span> 
        </a>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <nav aria-label="breadcrumb" class="-intro-x h-full mr-auto">
            <ol class="breadcrumb breadcrumb-light">
                @foreach($breadcrumbs as $index => $breadcrumb)
                    @if($loop->last)
                        <li class="breadcrumb-item active" aria-current="page">{{ $breadcrumb['title'] }}</li>
                    @else
                        <li class="breadcrumb-item">
                            @if($breadcrumb['url'] && $breadcrumb['url'] !== '#')
                                <a href="{{ $breadcrumb['url'] }}">{{ $breadcrumb['title'] }}</a>
                            @else
                                <span>{{ $breadcrumb['title'] }}</span>
                            @endif
                        </li>
                    @endif
                @endforeach
            </ol>
        </nav>
        <!-- END: Breadcrumb -->
        
        <!-- BEGIN: Notifications -->
        @php
            $user = auth()->user();
            $notifications = $user ? $user->getRecentNotifications(5)->get() : collect();
            $unreadCount = $user ? $user->getUnreadNotificationsCount() : 0;
            
            // Debug: Check if there are actually unread notifications
            $unreadNotifications = $user ? $user->getUnreadNotifications()->get() : collect();
            
            // Debug output (remove this after testing)
            // {{-- Unread count: {{ $unreadCount }}, Unread notifications: {{ $unreadNotifications->count() }}, Total notifications: {{ $notifications->count() }} --}}
        @endphp
        
        <div class="intro-x dropdown mr-4 sm:mr-6">
            <div class="dropdown-toggle notification cursor-pointer {{ $unreadCount > 0 ? 'notification--bullet' : '' }}" 
                 role="button" aria-expanded="false" data-tw-toggle="dropdown" id="notification-bell" onclick="markAllNotificationsAsRead()"> 
                <i data-lucide="bell" class="notification__icon dark:text-slate-500"></i>
                @if($unreadCount > 0 && $unreadNotifications->count() > 0)
                    <span class="notification__bullet absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" id="notification-badge"></span>
                @endif
            </div>
            <div class="notification-content pt-2 dropdown-menu">
                <div class="notification-content__box dropdown-content">
                    <div class="notification-content__title">
                        Notifications 
                        @if($unreadCount > 0 && $unreadNotifications->count() > 0)
                            <span class="ml-2 px-2 py-1 text-xs bg-danger text-white rounded-full">{{ $unreadCount }}</span>
                        @endif
                    </div>
                    
                    @if($notifications->count() > 0)
                        @foreach($notifications as $notification)
                            <div class="cursor-pointer relative flex items-center {{ $loop->first ? '' : 'mt-5' }} notification-item" 
                                 data-notification-id="{{ $notification->id }}">
                                <div class="w-12 h-12 flex-none image-fit mr-1">
                                    @if($user && $user->photo)
                                        <img alt="{{ $user->name }}" class="rounded-full" src="{{ asset('storage/profiles/' . $user->photo) }}">
                                    @else
                                        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {{ $user ? strtoupper(substr($user->name, 0, 1)) : 'U' }}
                                        </div>
                                    @endif
                                    <div class="w-3 h-3 bg-{{ $notification->type === 'success' ? 'success' : ($notification->type === 'error' ? 'danger' : ($notification->type === 'warning' ? 'warning' : 'info')) }} absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                                </div>
                                <div class="ml-2 overflow-hidden">
                                    <div class="flex items-center">
                                        <a href="javascript:;" class="font-medium truncate mr-5">{{ $notification->title }}</a> 
                                        <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">{{ $notification->created_at->format('h:i A') }}</div>
                                    </div>
                                    <div class="w-full truncate text-slate-500 mt-0.5">{{ $notification->message }}</div>
                                    @if($notification->isUnread())
                                        <div class="text-xs text-primary mt-1">• Unread</div>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                        
                        @if($notifications->count() >= 5)
                            <div class="text-center mt-4">
                                <a href="javascript:;" class="text-primary text-sm hover:underline" data-tw-toggle="modal" data-tw-target="#all-notifications-modal">View All Notifications</a>
                            </div>
                        @endif
                    @else
                        <div class="text-center py-8">
                            <i data-lucide="bell-off" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
                            <div class="text-slate-500">No notifications yet</div>
                        </div>
                    @endif
        </div>
    </div>
</div>

<!-- Notification Bell Click Handler -->
<script>
// Make function global so it can be called from onclick
window.markAllNotificationsAsRead = function() {
    console.log('markAllNotificationsAsRead called');
    
    // Hide the red badge immediately (before API call)
    const badge = document.getElementById('notification-badge');
    if (badge) {
        console.log('Hiding notification badge immediately');
        badge.style.display = 'none';
        badge.remove();
    }
    
    // Also try to hide by class
    const badges = document.querySelectorAll('.notification__bullet');
    badges.forEach(badge => {
        console.log('Hiding badge by class');
        badge.style.display = 'none';
        badge.remove();
    });
    
    // Update the notification title to remove unread count
    const notificationTitle = document.querySelector('.notification-content__title');
    if (notificationTitle) {
        console.log('Updating notification title');
        notificationTitle.innerHTML = 'Notifications';
    }
    
    // Make API call to mark as read in database
    fetch('/notifications/mark-all-read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('All notifications marked as read:', data);
        console.log('Unread before:', data.unread_before);
        console.log('Unread after:', data.unread_after);
        console.log('Marked count:', data.count);
        
        // If there were no unread notifications, just return
        if (data.unread_before === 0) {
            console.log('No unread notifications to mark as read');
            return;
        }
        
        // Update all notification items to remove "Unread" indicator
        const unreadIndicators = document.querySelectorAll('.notification-item .text-primary');
        unreadIndicators.forEach(indicator => {
            if (indicator.textContent.includes('• Unread')) {
                console.log('Hiding unread indicator');
                indicator.style.display = 'none';
            }
        });
        
        // Update notification type dots to show as read (remove the colored dot)
        const notificationDots = document.querySelectorAll('.notification-item .w-3.h-3');
        notificationDots.forEach(dot => {
            dot.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
            dot.classList.add('bg-slate-400');
        });
        
        // Update the notification count dynamically without page refresh
        console.log('Updating notification count dynamically...');
        
        // Remove the notification--bullet class from the bell
        const bellElement = document.getElementById('notification-bell');
        if (bellElement) {
            bellElement.classList.remove('notification--bullet');
        }
        
        // Update the notification title to remove unread count
        const notificationTitle = document.querySelector('.notification-content__title');
        if (notificationTitle) {
            notificationTitle.innerHTML = 'Notifications';
        }
        
        // Force remove any remaining notification bullets
        const allBullets = document.querySelectorAll('.notification__bullet, .notification-badge, [id*="notification-badge"]');
        allBullets.forEach(bullet => {
            bullet.style.display = 'none';
            bullet.remove();
        });
        
        // Also remove any CSS classes that might show the bullet
        const bellContainer = document.querySelector('.dropdown-toggle.notification');
        if (bellContainer) {
            bellContainer.classList.remove('notification--bullet');
        }
        
        console.log('All UI updates completed');
        
    })
    .catch(error => {
        console.error('Error marking notifications as read:', error);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Notification bell script loaded');
    
    const notificationBell = document.getElementById('notification-bell');
    const notificationBadge = document.getElementById('notification-badge');
    
    console.log('Notification bell element:', notificationBell);
    console.log('Notification badge element:', notificationBadge);
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            console.log('Notification bell clicked via event listener!');
            // Don't prevent default to allow dropdown to work
            markAllNotificationsAsRead();
        });
    }
});
</script>
        <!-- END: Notifications -->

        <!-- BEGIN: All Notifications Modal -->
        <div id="all-notifications-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="font-medium text-base mr-auto">All Notifications</h2>
                        <button class="btn btn-outline-secondary hidden sm:flex" data-tw-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Close
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="all-notifications-content" class="max-h-[500px] overflow-y-auto">
                            <!-- Notifications will be loaded here via JavaScript -->
                            <div class="text-center py-8">
                                <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div class="text-slate-500">Loading notifications...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: All Notifications Modal -->

        <script>
        // Load all notifications when modal is opened
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('all-notifications-modal');
            if (modal) {
                modal.addEventListener('show.tw.modal', function() {
                    loadAllNotifications();
                });
            }
        });

        function loadAllNotifications() {
            const contentDiv = document.getElementById('all-notifications-content');
            
            fetch('/notifications/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.notifications && data.notifications.length > 0) {
                    let html = '<div class="space-y-4">';
                    
                    data.notifications.forEach((notification, index) => {
                        const typeColor = notification.type === 'success' ? 'success' : 
                                        (notification.type === 'error' ? 'danger' : 
                                        (notification.type === 'warning' ? 'warning' : 'info'));
                        
                        const isUnread = notification.is_read == 0 || notification.is_read === false;
                        const readStatus = isUnread ? '<span class="text-xs text-primary font-medium">• Unread</span>' : '<span class="text-xs text-slate-400">• Read</span>';
                        
                        html += `
                            <div class="flex items-start p-4 ${isUnread ? 'bg-primary/5' : 'bg-slate-50'} rounded-lg hover:bg-slate-100 transition-colors">
                                <div class="flex-shrink-0 mr-3">
                                    <div class="w-10 h-10 bg-${typeColor} rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start justify-between">
                                        <p class="text-sm font-medium text-slate-900">${notification.title}</p>
                                        <span class="text-xs text-slate-500 ml-2 whitespace-nowrap">${formatNotificationDate(notification.created_at)}</span>
                                    </div>
                                    <p class="text-sm text-slate-600 mt-1">${notification.message}</p>
                                    <div class="flex items-center mt-2 gap-3">
                                        ${readStatus}
                                        <span class="text-xs text-slate-400">${notification.created_at_human || ''}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    
                    html += '</div>';
                    contentDiv.innerHTML = html;
                } else {
                    contentDiv.innerHTML = `
                        <div class="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-slate-300 mx-auto mb-4">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <div class="text-slate-500 font-medium">No notifications found</div>
                            <div class="text-slate-400 text-sm mt-1">You're all caught up!</div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading notifications:', error);
                contentDiv.innerHTML = `
                    <div class="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-danger mx-auto mb-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div class="text-slate-500 font-medium">Error loading notifications</div>
                        <div class="text-slate-400 text-sm mt-1">Please try again later</div>
                    </div>
                `;
            });
        }

        function formatNotificationDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        </script>

        <!-- BEGIN: Account Menu -->
        <div class="intro-x dropdown w-8 h-8">
            <div class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110" role="button" aria-expanded="false" data-tw-toggle="dropdown">
                @php
                    $user = auth()->user();
                    $hasImage = $user && $user->photo && !empty(trim($user->photo));
                @endphp
                
                @if($hasImage)
                    <img alt="{{ $user->name }}" src="{{ asset('storage/profiles/' . $user->photo) }}" class="w-full h-full object-cover">
                @else
                    <div class="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {{ $user ? strtoupper(substr($user->name, 0, 1)) : 'U' }}
                    </div>
                @endif
            </div>
            <div class="dropdown-menu w-56">
                <ul class="dropdown-content bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                    <li class="p-2">
                        <div class="font-medium">{{ $user ? $user->name : 'User' }}</div>
                        <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">{{ $user ? $user->email : 'user@example.com' }}</div>
                       
                    </li>
                    <li>
                        <hr class="dropdown-divider border-white/[0.08]">
                    </li>
                    <li>
                        <a href="{{ route('profile-management.index') }}" class="dropdown-item hover:bg-white/5"> <i data-lucide="user" class="w-4 h-4 mr-2"></i> Profile </a>
                    </li>
                    <li>
                        <hr class="dropdown-divider border-white/[0.08]">
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick="performLogout()" class="dropdown-item hover:bg-white/5"> <i data-lucide="toggle-right" class="w-4 h-4 mr-2"></i> Logout </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- END: Account Menu -->
    </div>
</div>