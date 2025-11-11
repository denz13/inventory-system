// Notification Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeSearchFromURL();
    initializeRoleBasedAutoCheck();
});

// Role-based modules configuration
const roleModules = {
    'home owners': [
        'dashboard',
        'message',
        'feedback',
        'vehicle',
        'apply business',
        'apply landlord',
        'apply appointment',
        'billing payment',
        'service request',
        'incident report'
    ],
    'non home owners': [
        'dashboard',
        'vehicle',
        'apply appointment'
    ],
    'guard': [
        'dashboard',
        'message',
        'service management',
        'incident management'
    ],
    'operational manager': [
        'dashboard',
        'message',
        'user management',
        'announcements management',
        'guest chatbot',
        'notification settings',
        'permission settings',
        'system settings',
        'activity logs'
    ],
    'service manager': [
        'dashboard',
        'message',
        'service management',
        'incident management',
        'feedback management',
        'system settings',
        'guest chatbot'
    ],
    'financial manager': [
        'dashboard',
        'message',
        'billing management',
        'payment account management',
        'system settings',
        'guest chatbot'
    ],
    'appointment coordinator': [
        'dashboard',
        'message',
        'appointment management',
        'vehicle management',
        'vehicle sticker registration management',
        'calendar',
        'appointment category',
        'appointment allow schedule',
        'system settings',
        'guest chatbot'
    ],
    'occupancy manager': [
        'dashboard',
        'message',
        'landlord management',
        'establishment management',
        'landlord permissions',
        'system settings',
        'guest chatbot'
    ]
};

function initializeEventListeners() {
    // Search functionality - trigger on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performServerSideSearch();
            }
        });
        
        // Also trigger on input with debounce
        searchInput.addEventListener('input', debounce(performServerSideSearch, 500));
    }

    // Filter functionality - server-side
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-filter]')) {
            const filter = e.target.closest('[data-filter]').getAttribute('data-filter');
            applyServerSideStatusFilter(filter);
        }
        
        if (e.target.closest('[data-module-filter]')) {
            const filter = e.target.closest('[data-module-filter]').getAttribute('data-module-filter');
            applyServerSideModuleFilter(filter);
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

// Initialize search input from URL parameter
function initializeSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search');
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
    }
}

// Server-side search function
function performServerSideSearch() {
    const searchValue = document.getElementById('searchInput').value;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (searchValue) {
        urlParams.set('search', searchValue);
    } else {
        urlParams.delete('search');
    }
    
    // Reset to page 1 when searching
    urlParams.delete('page');
    
    // Redirect with new search parameter
    window.location.search = urlParams.toString();
}

// Server-side status filter
function applyServerSideStatusFilter(filter) {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (filter === 'all') {
        urlParams.delete('status');
    } else {
        urlParams.set('status', filter);
    }
    
    // Reset to page 1 when filtering
    urlParams.delete('page');
    
    // Redirect with new filter
    window.location.search = urlParams.toString();
}

// Server-side module filter
function applyServerSideModuleFilter(filter) {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (filter === 'all') {
        urlParams.delete('module_filter');
    } else {
        urlParams.set('module_filter', filter);
    }
    
    // Reset to page 1 when filtering
    urlParams.delete('page');
    
    // Redirect with new filter
    window.location.search = urlParams.toString();
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
    
    // Format module name to title case
    const formatModuleName = (name) => {
        if (!name) return 'N/A';
        return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };
    
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
                            <div class="form-control mt-1 bg-white">
                                ${setting.module ? `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">${formatModuleName(setting.module.module_name)}</span>` : 'N/A'}
                            </div>
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
        document.getElementById('editStatus').value = setting.status;
        
        // Set user using Tom Select - wait for it to be ready
        setTimeout(function() {
            const editUserSelect = document.getElementById('editUserSelect');
            if (editUserSelect && editUserSelect.tomselect) {
                editUserSelect.tomselect.setValue(setting.users_id);
            }
        }, 100);
        
        // Clear all checkboxes first
        const checkboxes = document.querySelectorAll('#editModulesContainer input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Check the checkbox for the current module
        if (setting.module_id) {
            const moduleCheckbox = document.querySelector(`#editModulesContainer input[value="${setting.module_id}"]`);
            if (moduleCheckbox) {
                moduleCheckbox.checked = true;
            }
        }
        
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

// Initialize role-based auto-check functionality
function initializeRoleBasedAutoCheck() {
    console.log('Initializing role-based auto-check...');
    
    // Add event listener for Create Role Filter
    const createRoleFilter = document.getElementById('createRoleFilter');
    if (createRoleFilter) {
        console.log('Create Role Filter found, attaching event listener');
        createRoleFilter.addEventListener('change', function() {
            const selectedRole = this.value;
            console.log('Create Role Filter changed to:', selectedRole);
            if (selectedRole) {
                handleRoleFilterChange(selectedRole, 'create');
            } else {
                // Clear all checkboxes if "All Roles" is selected
                clearAllModules('create');
            }
        });
    } else {
        console.error('Create Role Filter NOT FOUND!');
    }
    
    // Add event listener for Edit Role Filter
    const editRoleFilter = document.getElementById('editRoleFilter');
    if (editRoleFilter) {
        console.log('Edit Role Filter found, attaching event listener');
        editRoleFilter.addEventListener('change', function() {
            const selectedRole = this.value;
            console.log('Edit Role Filter changed to:', selectedRole);
            if (selectedRole) {
                handleRoleFilterChange(selectedRole, 'edit');
            } else {
                // Clear all checkboxes if "All Roles" is selected
                clearAllModules('edit');
            }
        });
    } else {
        console.error('Edit Role Filter NOT FOUND!');
    }
    
    console.log('Role-based auto-check initialization complete');
}

// Handle role filter change and auto-check modules based on role
function handleRoleFilterChange(role, formType) {
    const roleLower = role.toLowerCase().trim();
    console.log('Role selected:', role);
    
    // Check if role is admin - check all modules
    if (roleLower === 'admin') {
        autoCheckAllModules(formType);
    }
    // Check if we have modules configured for this role
    else if (roleModules[roleLower]) {
        autoCheckModulesByRole(roleLower, formType);
    } else {
        console.log('No modules configured for role:', role);
    }
}

// Clear all module checkboxes
function clearAllModules(formType) {
    // Use more specific selector for the modules container
    let container;
    if (formType === 'create') {
        const form = document.getElementById('createNotificationSettingForm');
        if (form) {
            container = form.querySelector('.max-h-48.overflow-y-auto');
        }
    } else {
        container = document.getElementById('editModulesContainer');
    }
    
    if (!container) {
        console.log('Container not found for clearing');
        return;
    }
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"][name="modules[]"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    console.log('All', checkboxes.length, 'modules cleared');
}

// Auto-check ALL modules (for Admin role) - excluding specific modules
function autoCheckAllModules(formType) {
    // Use more specific selector for the modules container
    let container;
    if (formType === 'create') {
        // Find the container within the create form that has the checkboxes
        const form = document.getElementById('createNotificationSettingForm');
        if (form) {
            container = form.querySelector('.max-h-48.overflow-y-auto');
        }
    } else {
        container = document.getElementById('editModulesContainer');
    }
    
    console.log('Container for', formType, ':', container);
    
    if (!container) {
        console.error('Modules container not found!');
        return;
    }
    
    // Modules to exclude for Admin role
    const excludedModules = [
        'feedback',
        'vehicle',
        'apply business',
        'apply landlord',
        'apply appointment',
        'billing payment',
        'service request',
        'incident report'
    ];
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"][name="modules[]"]');
    console.log('Found', checkboxes.length, 'checkboxes for admin');
    
    let checkedCount = 0;
    checkboxes.forEach(checkbox => {
        // Get the label text next to the checkbox
        const label = checkbox.closest('label');
        if (label) {
            // Normalize label text: trim, convert to lowercase, and replace multiple spaces with single space
            const labelText = label.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
            
            // Check if this module should be excluded
            const shouldExclude = excludedModules.some(excluded => {
                const excludedLower = excluded.toLowerCase().trim();
                // Exact match to avoid excluding "feedback management" when excluding "feedback"
                return labelText === excludedLower;
            });
            
            // Only check if not excluded
            if (!shouldExclude) {
                checkbox.checked = true;
                checkedCount++;
            }
        }
    });
    
    console.log(`Admin: Auto-checked ${checkedCount} modules (excluded ${excludedModules.length} modules)`);
    
    if (checkedCount > 0) {
        showToast('Modules auto-selected for Admin role', 'success');
    }
}

// Auto-check modules based on role configuration
function autoCheckModulesByRole(role, formType) {
    console.log('autoCheckModulesByRole called with role:', role, 'formType:', formType);
    
    const modulesToCheck = roleModules[role];
    console.log('Modules to check:', modulesToCheck);
    
    if (!modulesToCheck || modulesToCheck === 'all') {
        console.log('No modules to check or role is "all"');
        return;
    }
    
    // Use more specific selector for the modules container
    let container;
    if (formType === 'create') {
        // Find the container within the create form that has the checkboxes
        const form = document.getElementById('createNotificationSettingForm');
        if (form) {
            container = form.querySelector('.max-h-48.overflow-y-auto');
        }
    } else {
        container = document.getElementById('editModulesContainer');
    }
    
    console.log('Container found:', container);
    
    if (!container) {
        console.error('Modules container not found!');
        return;
    }
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"][name="modules[]"]');
    console.log('Found', checkboxes.length, 'checkboxes');
    
    // First, log all checkbox labels to see what we're working with
    console.log('=== ALL AVAILABLE MODULES ===');
    checkboxes.forEach((checkbox, index) => {
        const label = checkbox.closest('label');
        if (label) {
            const labelText = label.textContent.trim();
            console.log(`${index}: "${labelText}"`);
        }
    });
    console.log('=== END OF MODULES LIST ===');
    
    let checkedCount = 0;
    checkboxes.forEach((checkbox, index) => {
        const label = checkbox.closest('label');
        if (label) {
            // Normalize label text: trim, convert to lowercase, and replace multiple spaces with single space
            const labelText = label.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
            
            // Check if this module should be auto-checked (exact match only to avoid substring issues)
            // e.g., "feedback" should NOT match "feedback management"
            const shouldCheck = modulesToCheck.some(module => {
                const moduleLower = module.toLowerCase().trim();
                // Exact match only - prevents "feedback" from matching "feedback management"
                const matches = labelText === moduleLower;
                if (matches) {
                    console.log(`  ✓ MATCH: "${labelText}" matches "${module}"`);
                }
                return matches;
            });
            
            if (shouldCheck) {
                checkbox.checked = true;
                checkedCount++;
                console.log(`  ✓ CHECKED: ${labelText}`);
            }
        }
    });
    
    console.log(`${capitalizeRole(role)}: Auto-checked ${checkedCount} modules`);
    
    if (checkedCount > 0) {
        showToast(`Modules auto-selected for ${capitalizeRole(role)} role`, 'success');
    } else {
        console.warn('No modules were checked! Check if module names match.');
    }
}

// Helper function to capitalize role name
function capitalizeRole(role) {
    return role.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}
