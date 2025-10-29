// Chat System JavaScript
(function() {
    'use strict';

    let currentChatUserId = null;
    let currentChatUserName = '';
    let currentChatUserPhoto = '';
    let messageCheckInterval = null;
    let notificationCheckInterval = null;
    
    const currentUserId = document.getElementById('currentUserId').value;
    const csrfToken = document.getElementById('csrfToken').value;
    
    // Initialize chat
    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
        initializeSearch();
        initializeNotifications();
        
        // Start checking for notifications every 5 seconds
        notificationCheckInterval = setInterval(checkForNotifications, 5000);
        
        // Check notifications immediately
        checkForNotifications();
    });
    
    // Initialize event listeners
    function initializeEventListeners() {
        // User item click (Chats tab)
        document.querySelectorAll('.user-item').forEach(function(item) {
            item.addEventListener('click', function() {
                const userId = this.dataset.userId;
                const userName = this.dataset.userName;
                const userPhoto = this.dataset.userPhoto;
                
                // Get is_online status from the user item
                const userItem = document.querySelector(`.user-item[data-user-id="${userId}"]`);
                const isOnline = userItem ? (userItem.querySelector('.bg-success') ? 1 : 0) : 0;
                
                openChat(userId, userName, userPhoto, isOnline);
            });
        });
        
        // Quick chat user click (Recent scrolling users)
        document.querySelectorAll('.quick-chat-user').forEach(function(item) {
            item.addEventListener('click', function() {
                const userId = this.dataset.userId;
                const userName = this.dataset.userName;
                const userPhoto = this.dataset.userPhoto;
                
                // Get is_online status from the quick chat user
                const isOnline = this.querySelector('.bg-success') ? 1 : 0;
                
                openChat(userId, userName, userPhoto, isOnline);
            });
        });
        
        // Send message button
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        // Enter key to send message
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }
    
    // Initialize search functionality
    function initializeSearch() {
        // Search in Chats tab
        const searchInput = document.getElementById('searchUsers');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const userItems = document.querySelectorAll('.user-item');
                
                userItems.forEach(function(item) {
                    const userName = item.dataset.userName.toLowerCase();
                    if (userName.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Open chat with user
    function openChat(userId, userName, userPhoto, isOnline) {
        currentChatUserId = userId;
        currentChatUserName = userName;
        currentChatUserPhoto = userPhoto;
        
        // Update active user info
        document.getElementById('activeUserName').textContent = userName;
        document.getElementById('activeUserPhoto').src = userPhoto;
        
        // Update online status
        updateUserStatus(isOnline);
        
        // Show chat active, hide default
        document.getElementById('chatActive').classList.remove('hidden');
        document.getElementById('chatDefault').classList.add('hidden');
        
        // Load messages
        loadMessages(userId);
        
        // Clear unread badge for this user
        clearUnreadBadge(userId);
        
        // Start checking for new messages every 3 seconds
        if (messageCheckInterval) {
            clearInterval(messageCheckInterval);
        }
        messageCheckInterval = setInterval(() => loadMessages(userId, true), 3000);
        
        // Mark active user
        document.querySelectorAll('.user-item').forEach(function(item) {
            item.classList.remove('bg-slate-200', 'dark:bg-darkmode-400');
        });
        document.querySelector(`.user-item[data-user-id="${userId}"]`)?.classList.add('bg-slate-200', 'dark:bg-darkmode-400');
    }
    
    // Update user online status
    function updateUserStatus(isOnline) {
        const statusElement = document.getElementById('activeUserStatus');
        if (statusElement) {
            if (isOnline == 1 || isOnline === true) {
                statusElement.textContent = 'Online';
                statusElement.classList.remove('text-slate-500');
                statusElement.classList.add('text-success');
            } else {
                statusElement.textContent = 'Offline';
                statusElement.classList.remove('text-success');
                statusElement.classList.add('text-slate-500');
            }
        }
    }
    
    // Load messages
    function loadMessages(userId, silent = false) {
        if (!silent) {
            showLoading();
        }
        
        fetch(`/chat/messages/${userId}`, {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessages(data.messages, data.currentUserId);
                
                // Update online status if available
                if (data.chatUser && data.chatUser.is_online !== undefined) {
                    updateUserStatus(data.chatUser.is_online);
                }
            } else {
                showError('Failed to load messages');
            }
        })
        .catch(error => {
            console.error('Error loading messages:', error);
            if (!silent) {
                showError('Error loading messages');
            }
        });
    }
    
    // Display messages
    function displayMessages(messages, currentUserId) {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = '';
        
        messages.forEach(function(message) {
            const isCurrentUser = message.from_id == currentUserId;
            const messageHtml = createMessageElement(message, isCurrentUser);
            container.insertAdjacentHTML('beforeend', messageHtml);
        });
        
        // Render messages using templates
        renderMessages();
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Render messages using templates from Blade
    function renderMessages() {
        const messageItems = document.querySelectorAll('.message-item');
        
        messageItems.forEach(function(item) {
            const isCurrentUser = item.classList.contains('current-user-message');
            const fromId = item.querySelector('.message-from-id').value;
            const toId = item.querySelector('.message-to-id').value;
            const text = item.querySelector('.message-text').value;
            const time = item.querySelector('.message-time').value;
            const userPhoto = item.querySelector('.user-photo').value;
            
            // Get template from Blade
            const templateId = isCurrentUser ? 'currentUserMessageTemplate' : 'otherUserMessageTemplate';
            const template = document.getElementById(templateId);
            const clone = template.content.cloneNode(true);
            
            // Fill in the data
            clone.querySelector('.message-text').textContent = text;
            clone.querySelector('.message-time').textContent = formatMessageTime(time);
            clone.querySelector('.message-avatar').src = userPhoto;
            
            // Replace the item with the rendered template
            item.parentNode.replaceChild(clone, item);
        });
    }
    
    // Create message element - simplified, just store data
    function createMessageElement(message, isCurrentUser) {
        const messageClass = isCurrentUser ? 'current-user-message' : 'other-user-message';
        const userPhoto = message.user.photo ? '/storage/profiles/' + message.user.photo : '/img/user.jpg';
        
        return `
            <div class="message-item ${messageClass}" data-message-id="${message.id}">
                <input type="hidden" class="message-from-id" value="${message.from_id}">
                <input type="hidden" class="message-to-id" value="${message.to_id}">
                <input type="hidden" class="message-text" value="${escapeHtml(message.message)}">
                <input type="hidden" class="message-time" value="${message.created_at}">
                <input type="hidden" class="user-photo" value="${userPhoto}">
            </div>
        `;
    }
    
    // Send message
    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || !currentChatUserId) {
            return;
        }
        
        const sendBtn = document.getElementById('sendMessageBtn');
        sendBtn.disabled = true;
        
        fetch('/chat/send', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to_id: currentChatUserId,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = '';
                loadMessages(currentChatUserId, true);
            } else {
                showError('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            showError('Error sending message');
        })
        .finally(() => {
            sendBtn.disabled = false;
            messageInput.focus();
        });
    }
    
    // Helper functions
    function showLoading() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = '<div class="text-center py-10"><div class="text-slate-500">Loading messages...</div></div>';
    }
    
    function showError(message) {
        console.error(message);
        // You can implement a toast notification here
    }
    
    function scrollToBottom() {
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
            return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Initialize notifications
    function initializeNotifications() {
        // Notification bell click
        const notificationBell = document.getElementById('notificationBell');
        if (notificationBell) {
            notificationBell.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleNotificationDropdown();
            });
        }
        
        // Mark all read button
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                markAllNotificationsAsRead();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('notificationDropdown');
            const bell = document.getElementById('notificationBell');
            
            if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
    
    // Toggle notification dropdown
    function toggleNotificationDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            
            if (!dropdown.classList.contains('hidden')) {
                loadNotifications();
            }
        }
    }
    
    // Check for new notifications
    function checkForNotifications() {
        fetch('/chat/notifications', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateNotificationBadge(data.notifications.length);
                
                // Show toast for new message notifications
                if (data.notifications.length > 0) {
                    data.notifications.forEach(notification => {
                        if (notification.type === 'message') {
                            showToast(notification.title, notification.message, 'info');
                        }
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error checking notifications:', error);
        });
    }
    
    // Load notifications
    function loadNotifications() {
        const notificationList = document.getElementById('notificationList');
        
        if (notificationList) {
            notificationList.innerHTML = `
                <div class="p-4 text-center text-slate-500">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Loading notifications...</p>
                </div>
            `;
        }
        
        fetch('/chat/notifications', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotifications(data.notifications);
            }
        })
        .catch(error => {
            console.error('Error loading notifications:', error);
            if (notificationList) {
                notificationList.innerHTML = `
                    <div class="p-4 text-center text-red-500">
                        <p>Error loading notifications</p>
                    </div>
                `;
            }
        });
    }
    
    // Display notifications
    function displayNotifications(notifications) {
        const notificationList = document.getElementById('notificationList');
        
        if (!notificationList) return;
        
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="p-4 text-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-2 text-slate-300">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                    <p>No new notifications</p>
                </div>
            `;
            return;
        }
        
        let notificationsHtml = '';
        notifications.forEach(notification => {
            const timeAgo = formatMessageTime(notification.created_at);
            notificationsHtml += `
                <div class="notification-item unread" data-notification-id="${notification.id}">
                    <div class="flex items-start">
                        <div class="flex-1">
                            <div class="font-medium text-slate-800 dark:text-slate-200">${notification.title}</div>
                            <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">${notification.message}</div>
                            <div class="text-xs text-slate-500 mt-2">${timeAgo}</div>
                        </div>
                        <button class="ml-2 text-blue-600 hover:text-blue-800 text-xs" onclick="markNotificationRead(${notification.id})">
                            Mark read
                        </button>
                    </div>
                </div>
            `;
        });
        
        notificationList.innerHTML = notificationsHtml;
    }
    
    // Update notification badge
    function updateNotificationBadge(count) {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }
    
    // Mark notification as read
    window.markNotificationRead = function(notificationId) {
        fetch(`/chat/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove notification from list
                const notificationItem = document.querySelector(`[data-notification-id="${notificationId}"]`);
                if (notificationItem) {
                    notificationItem.remove();
                }
                
                // Refresh notifications
                loadNotifications();
                checkForNotifications();
            }
        })
        .catch(error => {
            console.error('Error marking notification as read:', error);
        });
    };
    
    // Mark all notifications as read
    function markAllNotificationsAsRead() {
        fetch('/chat/notifications/read-all', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadNotifications();
                checkForNotifications();
                showToast('Success', 'All notifications marked as read', 'success');
            }
        })
        .catch(error => {
            console.error('Error marking all notifications as read:', error);
        });
    }
    
    // Show toast notification
    function showToast(title, message, type = 'info') {
        if (typeof Toastify !== 'undefined') {
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                info: '#3b82f6',
                warning: '#f59e0b'
            };
            
            Toastify({
                text: `<div class="font-medium">${title}</div><div class="text-sm mt-1">${message}</div>`,
                duration: 5000,
                gravity: "top",
                position: "right",
                backgroundColor: colors[type] || colors.info,
                stopOnFocus: true,
                escapeMarkup: false,
                offset: {
                    y: 90
                }
            }).showToast();
        }
    }
    
    // Clear unread badge for a specific user
    function clearUnreadBadge(userId) {
        // Find user item
        const userItem = document.querySelector(`.user-item[data-user-id="${userId}"]`);
        if (userItem) {
            // Remove red badge from avatar
            const avatarBadge = userItem.querySelector('.bg-red-600');
            if (avatarBadge && avatarBadge.classList.contains('absolute')) {
                avatarBadge.remove();
            }
            
            // Remove unread message text
            const unreadText = userItem.querySelector('.ml-2.bg-red-600');
            if (unreadText) {
                unreadText.remove();
            }
        }
        
        // Find quick chat user
        const quickChatUser = document.querySelector(`.quick-chat-user[data-user-id="${userId}"]`);
        if (quickChatUser) {
            const quickBadge = quickChatUser.querySelector('.bg-red-600');
            if (quickBadge) {
                quickBadge.remove();
            }
        }
    }
    
    // Update unread badge for a specific user
    function updateUnreadBadge(userId, count) {
        if (count === 0) {
            clearUnreadBadge(userId);
            return;
        }
        
        // Update user item
        const userItem = document.querySelector(`.user-item[data-user-id="${userId}"]`);
        if (userItem) {
            const avatar = userItem.querySelector('.w-12.h-12');
            
            // Update or create avatar badge
            let avatarBadge = avatar.querySelector('.bg-red-600.absolute');
            if (!avatarBadge) {
                avatarBadge = document.createElement('div');
                avatarBadge.className = 'absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white';
                avatar.appendChild(avatarBadge);
            }
            avatarBadge.textContent = count > 9 ? '9+' : count;
            
            // Update or create unread text
            const nameContainer = userItem.querySelector('.flex.items-center.justify-between');
            let unreadText = nameContainer.querySelector('.ml-2.bg-red-600');
            if (!unreadText) {
                unreadText = document.createElement('span');
                unreadText.className = 'ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold';
                nameContainer.appendChild(unreadText);
            }
            unreadText.textContent = `${count} ${count === 1 ? 'unread message' : 'unread messages'}`;
        }
        
        // Update quick chat user
        const quickChatUser = document.querySelector(`.quick-chat-user[data-user-id="${userId}"]`);
        if (quickChatUser) {
            const quickAvatar = quickChatUser.querySelector('.w-10.h-10');
            let quickBadge = quickAvatar.querySelector('.bg-red-600');
            if (!quickBadge) {
                quickBadge = document.createElement('div');
                quickBadge.className = 'absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold';
                quickAvatar.appendChild(quickBadge);
            }
            quickBadge.textContent = count > 9 ? '9+' : count;
        }
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (messageCheckInterval) {
            clearInterval(messageCheckInterval);
        }
        if (notificationCheckInterval) {
            clearInterval(notificationCheckInterval);
        }
    });
})();

