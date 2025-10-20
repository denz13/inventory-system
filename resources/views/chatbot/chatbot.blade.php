@extends('layout._partials.master')

@section('content')

<div class="col-span-12 mt-6 -mb-6 intro-y">
            <h2 class="intro-y text-lg font-medium mt-10">
        Guest Chatbot Messages
    </h2>   

    <div class="intro-y chat grid grid-cols-12 gap-5 mt-5">
        <!-- BEGIN: Guest List -->
                    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
                        <div class="tab-content">
                <div class="tab-pane active" role="tabpanel">
                                <div class="pr-1">
                                    <div class="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
                                        <div class="relative text-slate-500">
                                <input type="text" id="searchGuests" class="form-control py-3 px-4 border-transparent bg-slate-100 pr-10" placeholder="Search guests...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 hidden sm:absolute my-auto inset-y-0 mr-3 right-0">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg> 
                                                    </div>
                                                    </div>
                        
                        <div class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4" id="guestsList" style="max-height: 600px;">
                            @forelse($guestConversations as $guest)
                            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-3 guest-item hover:bg-slate-50" 
                                 data-guest-id="{{ $guest['guest_id'] }}"
                                 data-message-count="{{ $guest['message_count'] }}">
                                <div class="w-12 h-12 flex-none flex items-center justify-center mr-3 bg-primary/10 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                                    </div>
                                        <div class="ml-2 overflow-hidden flex-1">
                                            <div class="flex items-center justify-between">
                                        <div class="font-medium truncate">Guest #{{ substr($guest['guest_id'], -8) }}</div>
                                        @if($guest['pending_messages'] > 0)
                                        <span class="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                            {{ $guest['pending_messages'] }}
                                        </span>
                                    @endif
                                                    </div>
                                    <div class="w-full truncate text-slate-500 text-xs mt-1">
                                        {{ $guest['last_message'] }}
                                                    </div>
                                    <div class="text-xs text-slate-400 mt-1">
                                        {{ $guest['last_message_human'] }}
                                            </div>
                                    <div class="text-xs text-slate-400 mt-0.5">
                                        {{ $guest['message_count'] }} messages
                                    </div>
                                </div>
                            </div>
                            @empty
                            <div class="text-center py-10 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-slate-400">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <p>No guest conversations yet</p>
                            </div>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Guest List -->
        
                    <!-- BEGIN: Chat Content -->
                    <div class="intro-y col-span-12 lg:col-span-8 2xl:col-span-9">
                        <div class="chat__box box">
                            <!-- BEGIN: Chat Active -->
                <div id="chatActive" class="hidden h-full flex flex-col">
                                <div class="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                                    <div class="flex items-center">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none flex items-center justify-center bg-primary/10 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                        </div>
                                        <div class="ml-3 mr-auto">
                                <div id="activeGuestId" class="font-medium text-base"></div>
                                <div class="text-slate-500 text-xs sm:text-sm">
                                    <span id="activeGuestStats"></span>
                                        </div>
                                    </div>
                                            </div>
                                        </div>
                    
                    <div id="messagesContainer" class="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1" style="max-height: 500px;">
                        <!-- Messages will be loaded here -->
                                    </div>
                    
                    <div class="pt-4 pb-10 sm:py-4 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
                        <textarea id="messageInput" class="chat__box__input form-control dark:bg-darkmode-600 h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0" rows="1" placeholder="Type your reply..."></textarea>
                        <button id="sendReplyBtn" class="w-8 h-8 sm:w-10 sm:h-10 block bg-primary text-white rounded-full flex-none flex items-center justify-center mr-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                                </div>
                                        </div>
                <!-- END: Chat Active -->
                
                <!-- BEGIN: Chat Default -->
                <div id="chatDefault" class="h-full flex items-center">
                    <div class="mx-auto text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-slate-400">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <div class="mt-3">
                            <div class="font-medium">Guest Chatbot Messages</div>
                            <div class="text-slate-500 mt-1">Select a guest conversation to view and reply</div>
                                            </div>
                                        </div>
                                    </div>
                <!-- END: Chat Default -->
                                            </div>
                                        </div>
        <!-- END: Chat Content -->
                                        </div>
                                        </div>

<!-- Hidden data for JavaScript -->
<input type="hidden" id="csrfToken" value="{{ csrf_token() }}">
<input type="hidden" id="currentAdminId" value="{{ auth()->user()->id }}">

@endsection

@push('scripts')
<script>
let currentGuestId = null;
let currentParentMessageId = null;

// Load guest conversation
function loadGuestConversation(guestId) {
    currentGuestId = guestId;
    
    fetch(`/chatbot/guest-conversation?guest_id=${guestId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessages(data.data);
                
                // Update header
                document.getElementById('activeGuestId').textContent = `Guest #${guestId.substr(-8)}`;
                document.getElementById('activeGuestStats').textContent = `${data.data.length} messages`;
                
                // Show chat active
                document.getElementById('chatDefault').classList.add('hidden');
                document.getElementById('chatActive').classList.remove('hidden');
            }
        })
        .catch(error => console.error('Error loading conversation:', error));
}

// Display messages
function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-4';
        
        if (msg.from_guest) {
            // Guest message
            messageDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="w-10 h-10 flex-none flex items-center justify-center bg-slate-200 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="bg-slate-100 rounded-lg p-3 max-w-xl">
                            <div class="text-sm">${escapeHtml(msg.message)}</div>
                            <div class="text-xs text-slate-500 mt-1">${msg.created_at}</div>
                        </div>
                    </div>
                </div>
            `;
            currentParentMessageId = msg.id; // Track latest guest message for reply
        } else if (msg.from_admin) {
            // Admin reply
            messageDiv.innerHTML = `
                <div class="flex items-start justify-end">
                    <div class="flex-1 text-right">
                        <div class="bg-primary text-white rounded-lg p-3 max-w-xl inline-block">
                            <div class="text-sm">${escapeHtml(msg.message)}</div>
                            <div class="text-xs text-white/80 mt-1">${msg.admin_name} • ${msg.created_at}</div>
                        </div>
                    </div>
                    <div class="w-10 h-10 flex-none flex items-center justify-center bg-primary/20 rounded-full ml-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                </div>
            `;
        } else if (msg.from_bot) {
            // Bot response
            messageDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="w-10 h-10 flex-none flex items-center justify-center bg-blue-100 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                            <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                            <circle cx="8" cy="16" r="1"></circle>
                            <circle cx="16" cy="16" r="1"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 4l-2 2"></path>
                            <path d="M12 4l2 2"></path>
                            <path d="M8 19h8"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="bg-blue-50 rounded-lg p-3 max-w-xl">
                            <div class="text-sm whitespace-pre-line">${formatBotMessage(msg.message)}</div>
                            <div class="text-xs text-slate-500 mt-1">Bot • ${msg.created_at}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Send admin reply
document.getElementById('sendReplyBtn').addEventListener('click', sendReply);
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendReply();
    }
});

function sendReply() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || !currentGuestId || !currentParentMessageId) return;
    
    const csrfToken = document.getElementById('csrfToken').value;
    
    fetch('/chatbot/reply-to-guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
            guest_id: currentGuestId,
            parent_message_id: currentParentMessageId,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            input.value = '';
            
            // Reload conversation to show admin reply
            loadGuestConversation(currentGuestId);
            
            // Update the guest item to remove pending count
            const guestItem = document.querySelector(`[data-guest-id="${currentGuestId}"]`);
            if (guestItem) {
                const pendingBadge = guestItem.querySelector('.bg-red-600');
                if (pendingBadge) {
                    pendingBadge.remove(); // Remove red dot
                }
            }
            
            console.log('Reply sent and pending messages marked as read');
        } else {
            alert('Error sending reply: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error sending reply:', error);
        alert('Failed to send reply');
    });
}

// Guest item click handler
document.querySelectorAll('.guest-item').forEach(item => {
    item.addEventListener('click', function() {
        const guestId = this.getAttribute('data-guest-id');
        
        // Remove active class from all items
        document.querySelectorAll('.guest-item').forEach(el => {
            el.classList.remove('bg-slate-100');
        });
        
        // Add active class to clicked item
        this.classList.add('bg-slate-100');
        
        // Load conversation
        loadGuestConversation(guestId);
    });
});

// Search guests
document.getElementById('searchGuests').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.guest-item').forEach(item => {
        const guestId = item.getAttribute('data-guest-id').toLowerCase();
        if (guestId.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBotMessage(message) {
    let formatted = escapeHtml(message);
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<span class="block ml-2">• $1</span>');
    return formatted;
}
</script>
@endpush
