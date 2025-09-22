<div class="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12">
    <div class="h-full flex items-center">
        <!-- BEGIN: Logo -->
        <a href="" class="-intro-x hidden md:flex">
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
                <li class="breadcrumb-item"><a href="#">Golden Country Homes</a></li>
                <li class="breadcrumb-item active" aria-current="page">Home Owners Association Inc.</li>
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
                                <a href="#" class="text-primary text-sm hover:underline">View All Notifications</a>
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
                        <a href="{{ route('logout') }}" class="dropdown-item hover:bg-white/5"> <i data-lucide="toggle-right" class="w-4 h-4 mr-2"></i> Logout </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- END: Account Menu -->
    </div>
</div>