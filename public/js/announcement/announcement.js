document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentStatusFilter = urlParams.get('status') || 'all';
    let searchTerm = urlParams.get('search') || '';
    
    // Initialize search functionality - Server-side (Enter key only)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm; // Set initial value from URL
        
        // Search only when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                applyServerSideFilters();
            }
        });
        
        // Also allow clicking the search icon to trigger search
        const searchIcon = searchInput.parentElement.querySelector('svg');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', function() {
                applyServerSideFilters();
            });
        }
    }
    
    // Initialize filter functionality - Server-side
    const filterItems = document.querySelectorAll('[data-filter]');
    filterItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentStatusFilter = this.getAttribute('data-filter');
            applyServerSideFilters();
        });
    });
    
    // Apply server-side filters by updating URL and reloading
    function applyServerSideFilters() {
        const url = new URL(window.location.href);
        const searchValue = searchInput ? searchInput.value.trim() : '';
        
        // Update URL parameters
        if (searchValue) {
            url.searchParams.set('search', searchValue);
        } else {
            url.searchParams.delete('search');
        }
        
        if (currentStatusFilter && currentStatusFilter !== 'all') {
            url.searchParams.set('status', currentStatusFilter);
        } else {
            url.searchParams.delete('status');
        }
        
        // Reset to page 1 when filtering
        url.searchParams.delete('page');
        
        // Reload page with new parameters
        window.location.href = url.toString();
    }
    
    // Initialize modal handlers
    initializeModals();
    
    // Initialize form handlers
    initializeForms();
});

function initializeModals() {
    // View announcement modal
    document.querySelectorAll('[data-tw-target="#view-announcement-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const announcementId = this.getAttribute('data-announcement-id');
            loadAnnouncementDetails(announcementId);
        });
    });
    
    // Edit announcement modal
    document.querySelectorAll('[data-tw-target="#edit-announcement-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const announcementId = this.getAttribute('data-announcement-id');
            loadAnnouncementForEdit(announcementId);
        });
    });
    
    // Delete confirmation modal
    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const announcementId = this.getAttribute('data-announcement-id');
            document.getElementById('deleteAnnouncementId').value = announcementId;
        });
    });
}

function initializeForms() {
    // Create announcement form
    const createForm = document.getElementById('createAnnouncementForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateAnnouncement();
        });
    }
    
    // Edit announcement form
    const editForm = document.getElementById('editAnnouncementForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateAnnouncement();
        });
    }
    
    // Delete confirmation
    const deleteBtn = document.getElementById('confirmDeleteAnnouncement');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            handleDeleteAnnouncement();
        });
    }
}

function loadAnnouncementDetails(announcementId) {
    const announcementDetailsDiv = document.getElementById('announcement-details');
    
    // Show loading state
    announcementDetailsDiv.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading announcement details...</p>
        </div>
    `;
    
    fetch(`/announcement/${announcementId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayAnnouncementDetails(data);
    })
    .catch(error => {
        console.error('Error:', error);
        announcementDetailsDiv.innerHTML = `
            <div class="text-center text-red-500 py-12">
                <p>Error loading announcement details. Please try again.</p>
            </div>
        `;
    });
}

function displayAnnouncementDetails(announcement) {
    const announcementDetailsDiv = document.getElementById('announcement-details');
    
    const createdDate = announcement.created_at ? 
        new Date(announcement.created_at).toLocaleString() : 'N/A';
    
    const statusColor = getStatusColor(announcement.status);
    const visibilityColor = getVisibilityColor(announcement.visible_to);
    
    announcementDetailsDiv.innerHTML = `
        <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Announcement Information -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-lg mb-6 text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Announcement Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Type</label>
                            <input type="text" class="form-control mt-1" value="${announcement.type}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Status</label>
                            <input type="text" class="form-control mt-1 ${statusColor}" value="${announcement.status}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Created Date</label>
                            <input type="text" class="form-control mt-1" value="${createdDate}" readonly>
                        </div>
                    </div>
                </div>
                
                <!-- Visibility Information -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Audience Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Visible To</label>
                            <input type="text" class="form-control mt-1 ${visibilityColor}" value="${announcement.visible_to}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Audience Description</label>
                            <input type="text" class="form-control mt-1" value="${getAudienceDescription(announcement.visible_to)}" readonly>
                            <div class="form-help mt-1">Target audience for this announcement</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Description Section -->
            <div class="mt-8">
                <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 class="font-semibold text-lg mb-6 text-orange-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                        </svg>
                        Announcement Content
                    </h3>
                    <div class="bg-white p-4 rounded-lg border">
                        <p class="text-slate-800 whitespace-pre-wrap">${announcement.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadAnnouncementForEdit(announcementId) {
    fetch(`/announcement/${announcementId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('editAnnouncementId').value = data.id;
        document.getElementById('editType').value = data.type;
        document.getElementById('editStatus').value = data.status;
        document.getElementById('editVisibleTo').value = data.visible_to;
        document.getElementById('editDescription').value = data.description;
        
        // Update form action
        document.getElementById('editAnnouncementForm').action = `/announcement/${data.id}`;
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error loading announcement for editing. Please try again.', 'error');
    });
}

function handleCreateAnnouncement() {
    const form = document.getElementById('createAnnouncementForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = document.querySelector('button[form="createAnnouncementForm"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
        `;
    }
    
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showToast(data.message, 'success');
            // Close modal and reload page
            const closeBtn = document.querySelector('#create-announcement-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating announcement. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function handleUpdateAnnouncement() {
    const form = document.getElementById('editAnnouncementForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = document.querySelector('button[form="editAnnouncementForm"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
        `;
        submitBtn.disabled = true;
    }
    
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showToast(data.message, 'success');
            // Close modal and reload page
            const closeBtn = document.querySelector('#edit-announcement-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating announcement. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function handleDeleteAnnouncement() {
    const announcementId = document.getElementById('deleteAnnouncementId').value;
    
    if (announcementId) {
        fetch(`/announcement/${announcementId}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                // Close modal and reload page
                const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error deleting announcement. Please try again.', 'error');
        });
    }
}

// Helper functions
function getStatusColor(status) {
    switch(status) {
        case 'Active': return 'bg-green-100 text-green-800 border-green-300';
        case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

function getVisibilityColor(visibility) {
    switch(visibility) {
        case 'public': return 'bg-green-100 text-green-800 border-green-300';
        case 'private': return 'bg-blue-100 text-blue-800 border-blue-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

function getAudienceDescription(visibility) {
    switch(visibility) {
        case 'public': return 'Visible to all users in the system';
        case 'private': return 'Only visible to authorized users';
        default: return 'Unknown visibility';
    }
}

// Toast notification function (following your complaints pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'announcement_toast_success' : 'announcement_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('announcement_error_message_slot');
        if (messageSlot) {
            messageSlot.textContent = message;
        }
    }
    
    // Use your notification-toast component's show function
    try {
        if (window[`showNotification_${toastId}`]) {
            window[`showNotification_${toastId}`]();
        } else {
            // Fallback: use Toastify if available
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: message,
                    duration: 5000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: type === 'success' ? "#10b981" : "#ef4444",
                    stopOnFocus: true,
                }).showToast();
            } else {
                // Ultimate fallback
                console.log(`${type.toUpperCase()}:`, message);
            }
        }
    } catch (error) {
        console.error('Error showing toast:', error);
        console.log(`${type.toUpperCase()}:`, message);
    }
}
