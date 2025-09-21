// Notification Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filter functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-filter]')) {
            const filter = e.target.closest('[data-filter]').getAttribute('data-filter');
            handleStatusFilter(filter);
        }
        
        if (e.target.closest('[data-module-filter]')) {
            const filter = e.target.closest('[data-module-filter]').getAttribute('data-module-filter');
            handleModuleFilter(filter);
        }
    });

    // Form submissions
    const createForm = document.getElementById('createNotificationSettingForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateNotificationSetting();
        });
    }

    const editForm = document.getElementById('editNotificationSettingForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateNotificationSetting();
        });
    }

    // View notification setting modal
    document.querySelectorAll('[data-tw-target="#view-notification-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            loadNotificationSettingDetails(settingId);
        });
    });

    // Edit notification setting modal
    document.querySelectorAll('[data-tw-target="#edit-notification-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            loadNotificationSettingForEdit(settingId);
        });
    });

    // Delete notification setting modal
    document.querySelectorAll('[data-tw-target="#delete-notification-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            document.getElementById('deleteNotificationSettingId').value = settingId;
        });
    });

    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteNotificationSetting');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const settingId = document.getElementById('deleteNotificationSettingId').value;
            deleteNotificationSetting(settingId);
        });
    }
}

function handleSearch() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchValue) || searchValue === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount();
}

function handleStatusFilter(filter) {
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    
    tableRows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount();
}

function handleModuleFilter(filter) {
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    
    tableRows.forEach(row => {
        const moduleId = row.getAttribute('data-module');
        if (filter === 'all' || moduleId === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount();
}

function updateFilteredCount() {
    const allRows = document.querySelectorAll('tbody tr.intro-x');
    let visibleCount = 0;
    
    allRows.forEach(row => {
        if (row.style.display !== 'none') {
            visibleCount++;
        }
    });
    
    const filteredCount = document.getElementById('filtered-count');
    if (filteredCount) {
        filteredCount.textContent = visibleCount;
    }
}

function loadNotificationSettingDetails(settingId) {
    const detailsDiv = document.getElementById('notification-setting-details');
    
    // Show loading state
    detailsDiv.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading notification setting details...</p>
        </div>
    `;
    
    fetch(`/notification-settings/${settingId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayNotificationSettingDetails(data.setting);
    })
    .catch(error => {
        console.error('Error:', error);
        detailsDiv.innerHTML = `
            <div class="text-center text-red-500 py-12">
                <p>Error loading notification setting details. Please try again.</p>
            </div>
        `;
    });
}

function displayNotificationSettingDetails(setting) {
    const detailsDiv = document.getElementById('notification-setting-details');
    
    const createdDate = setting.created_at ? 
        new Date(setting.created_at).toLocaleString() : 'N/A';
    
    const updatedDate = setting.updated_at ? 
        new Date(setting.updated_at).toLocaleString() : 'N/A';
    
    detailsDiv.innerHTML = `
        <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Notification Setting Information -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-lg mb-6 text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                            <path d="M3 13v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"></path>
                        </svg>
                        Notification Setting Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Setting ID</label>
                            <input type="text" class="form-control mt-1" value="${setting.id}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">User</label>
                            <input type="text" class="form-control mt-1" value="${setting.user ? setting.user.name : 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Email</label>
                            <input type="text" class="form-control mt-1" value="${setting.user ? setting.user.email : 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Module</label>
                            <input type="text" class="form-control mt-1" value="${setting.module ? setting.module.module_name : 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Created Date</label>
                            <input type="text" class="form-control mt-1" value="${createdDate}" readonly>
                        </div>
                    </div>
                </div>
                
                <!-- Status Information -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                        Status Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Status</label>
                            <input type="text" class="form-control mt-1 ${setting.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}" value="${setting.status}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Updated Date</label>
                            <input type="text" class="form-control mt-1" value="${updatedDate}" readonly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadNotificationSettingForEdit(settingId) {
    fetch(`/notification-settings/${settingId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const setting = data.setting;
        
        // Set form values
        document.getElementById('editNotificationSettingId').value = setting.id;
        document.getElementById('editUsersId').value = setting.users_id;
        document.getElementById('editModuleId').value = setting.module_id;
        document.getElementById('editStatus').value = setting.status;
        
        // Update form action
        const form = document.getElementById('editNotificationSettingForm');
        form.action = `/notification-settings/${setting.id}`;
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error loading notification setting for edit', 'error');
    });
}

function deleteNotificationSetting(settingId) {
    fetch(`/notification-settings/${settingId}`, {
        method: 'DELETE',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const modal = document.getElementById('delete-notification-setting-modal');
            const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(data.message || 'Error deleting notification setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting notification setting. Please try again.', 'error');
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: type === 'success' ? "#10b981" : type === 'error' ? "#ef4444" : "#3b82f6",
            stopOnFocus: true,
        }).showToast();
    }
}

function handleCreateNotificationSetting() {
    const form = document.getElementById('createNotificationSettingForm');
    const formData = new FormData(form);
    
    fetch('/notification-settings', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#create-notification-setting-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reset form
            form.reset();
            
            // Reload page to show new notification setting
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to create notification setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating notification setting. Please try again.', 'error');
    });
}

function handleUpdateNotificationSetting() {
    const form = document.getElementById('editNotificationSettingForm');
    const settingId = document.getElementById('editNotificationSettingId').value;
    const formData = new FormData(form);
    
    // Add _method field for Laravel to recognize as PUT request
    formData.append('_method', 'PUT');
    
    fetch(`/notification-settings/${settingId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#edit-notification-setting-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated notification setting
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to update notification setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating notification setting. Please try again.', 'error');
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
