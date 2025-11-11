document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFromURL();
    
    // Status filter functionality - server-side
    document.querySelectorAll('[data-filter]').forEach(filterBtn => {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.getAttribute('data-filter');
            applyServerSideStatusFilter(filterValue);
        });
    });

    // Module filter functionality - server-side
    document.querySelectorAll('[data-module-filter]').forEach(filterBtn => {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.getAttribute('data-module-filter');
            applyServerSideModuleFilter(filterValue);
        });
    });
    
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
    
    // Initialize Tom Select and add change listener for Create User Select
    setTimeout(function() {
        const createUserSelect = document.getElementById('createUserSelect');
        if (createUserSelect && createUserSelect.tomselect) {
            createUserSelect.tomselect.on('change', function(value) {
                if (value) {
                    handleUserRoleChange(value, 'create');
                }
            });
        }
        
        const editUserSelect = document.getElementById('editUsersId');
        if (editUserSelect && editUserSelect.tomselect) {
            editUserSelect.tomselect.on('change', function(value) {
                if (value) {
                    handleUserRoleChange(value, 'edit');
                }
            });
        }
    }, 1000);
    
    // View permission setting modal functionality
    document.querySelectorAll('[data-tw-target="#view-permission-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            loadPermissionSettingDetails(settingId);
        });
    });

    // Edit permission setting modal functionality
    document.querySelectorAll('[data-tw-target="#edit-permission-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            loadPermissionSettingForEdit(settingId);
        });
    });

    // Delete permission setting modal functionality
    document.querySelectorAll('[data-tw-target="#delete-permission-setting-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const settingId = this.getAttribute('data-setting-id');
            document.getElementById('deletePermissionSettingId').value = settingId;
        });
    });

    // Confirm delete button
    document.getElementById('confirmDeletePermissionSetting').addEventListener('click', function() {
        const settingId = document.getElementById('deletePermissionSettingId').value;
        confirmDeletePermissionSetting(settingId);
    });

    // Form submission handlers
    const createForm = document.getElementById('createPermissionSettingForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreatePermissionSetting();
        });
    }

    const editForm = document.getElementById('editPermissionSettingForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdatePermissionSetting();
        });
    }
});

function loadPermissionSettingDetails(settingId) {
    const detailsContainer = document.getElementById('permission-setting-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading permission setting details...</p>
        </div>
    `;
    
    // Fetch permission setting details
    fetch(`/permission-settings/${settingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPermissionSettingDetails(data.setting);
            } else {
                showError('Failed to load permission setting details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error loading permission setting details');
        });
}

function displayPermissionSettingDetails(setting) {
    const detailsContainer = document.getElementById('permission-setting-details');
    
    const permissionsHtml = setting.permission_settings_list && setting.permission_settings_list.length > 0 
        ? setting.permission_settings_list.map(permission => `
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mr-2 mb-2">
                ${capitalizeWords(permission.permission_allowed)}
            </span>
        `).join('')
        : '<span class="text-slate-500">No permissions assigned</span>';
    
    detailsContainer.innerHTML = `
        <div class="p-8">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Permission Setting Details</h2>
                    <p class="text-slate-600 mt-1">Setting ID: #${setting.id}</p>
                </div>
                <button type="button" data-tw-dismiss="modal" class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <!-- User Information -->
            <div class="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">User Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-slate-600">Name</label>
                        <div class="mt-1 text-slate-800">${setting.user?.name || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Email</label>
                        <div class="mt-1 text-slate-800">${setting.user?.email || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Status</label>
                        <div class="mt-1">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(setting.status)}">
                                ${getStatusText(setting.status)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Date Created</label>
                        <div class="mt-1 text-slate-800">${setting.created_at ? new Date(setting.created_at).toLocaleDateString() : 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Permissions -->
            <div class="bg-white rounded-lg border border-slate-200 mb-6">
                <div class="px-6 py-4 border-b border-slate-200">
                    <h3 class="text-lg font-semibold text-slate-800">Assigned Permissions</h3>
                </div>
                <div class="p-6">
                    <div class="flex flex-wrap gap-2">
                        ${permissionsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-slate-100 text-slate-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'active': return 'Active';
        case 'inactive': return 'Inactive';
        default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
}

function showError(message) {
    const detailsContainer = document.getElementById('permission-setting-details');
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-red-300">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p class="text-lg text-red-600">${message}</p>
            <button type="button" data-tw-dismiss="modal" class="mt-4 btn btn-outline-secondary">Close</button>
        </div>
    `;
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

// Debounce function
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

function loadPermissionSettingForEdit(settingId) {
    // Fetch permission setting details for editing
    fetch(`/permission-settings/${settingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const setting = data.setting;
                
                // Set form values
                document.getElementById('editPermissionSettingId').value = setting.id;
                document.getElementById('editStatus').value = setting.status;
                
                // Set user using Tom Select - wait for it to be ready
                setTimeout(function() {
                    const editUserSelect = document.getElementById('editUsersId');
                    if (editUserSelect && editUserSelect.tomselect) {
                        editUserSelect.tomselect.setValue(setting.users_id);
                    }
                }, 100);
                
                // Clear all checkboxes first
                document.querySelectorAll('#editPermissionsContainer input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Check the permissions that are assigned
                if (setting.permission_settings_list && setting.permission_settings_list.length > 0) {
                    setting.permission_settings_list.forEach(permission => {
                        const checkbox = document.querySelector(`#editPermissionsContainer input[value="${permission.module_id}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                }
            } else {
                showToast('Failed to load permission setting details', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error loading permission setting details', 'error');
        });
}

function handleCreatePermissionSetting() {
    const form = document.getElementById('createPermissionSettingForm');
    const formData = new FormData(form);
    
    // Validate that at least one permission is selected
    const selectedPermissions = formData.getAll('permissions[]');
    if (selectedPermissions.length === 0) {
        showToast('Please select at least one permission', 'error');
        return;
    }
    
    fetch('/permission-settings', {
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
            const closeBtn = document.querySelector('#create-permission-setting-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            form.reset();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to create permission setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating permission setting. Please try again.', 'error');
    });
}

function handleUpdatePermissionSetting() {
    const form = document.getElementById('editPermissionSettingForm');
    const settingId = document.getElementById('editPermissionSettingId').value;
    const formData = new FormData(form);
    
    // Validate that at least one permission is selected
    const selectedPermissions = formData.getAll('permissions[]');
    if (selectedPermissions.length === 0) {
        showToast('Please select at least one permission', 'error');
        return;
    }
    
    formData.append('_method', 'PUT');
    
    fetch(`/permission-settings/${settingId}`, {
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
            const closeBtn = document.querySelector('#edit-permission-setting-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to update permission setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating permission setting. Please try again.', 'error');
    });
}

function confirmDeletePermissionSetting(settingId) {
    fetch(`/permission-settings/${settingId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            const closeBtn = document.querySelector('#delete-permission-setting-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to delete permission setting', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting permission setting. Please try again.', 'error');
    });
}

function showToast(message, type = 'success') {
    const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: "toastify-content",
        backgroundColor: backgroundColor,
        stopOnFocus: true
    }).showToast();
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

// Role-based permissions configuration
const rolePermissions = {
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

// Handle user role change and auto-check permissions based on role
function handleUserRoleChange(userId, formType) {
    // Build the URL with proper base URL
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/permission-settings/user/${userId}/role`;
    
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.role) {
                const roleLower = data.role.toLowerCase().trim();
                console.log('User role detected:', data.role);
                
                // Special case: Admin gets all permissions
                if (roleLower === 'admin') {
                    autoCheckAllPermissions(formType);
                }
                // Check if we have permissions configured for this role
                else if (rolePermissions[roleLower]) {
                    autoCheckPermissionsByRole(roleLower, formType);
                } else {
                    console.log('No auto-permissions configured for role:', data.role);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching user role:', error);
        });
}

// Auto-check ALL permissions (for Admin role) - excluding specific permissions
function autoCheckAllPermissions(formType) {
    // Determine which container to use based on form type
    const container = formType === 'create' 
        ? document.querySelector('#createPermissionSettingForm .border.rounded-lg')
        : document.getElementById('editPermissionsContainer');
    
    if (!container) {
        console.error('Permissions container not found!');
        return;
    }
    
    // Permissions to exclude for Admin role
    const excludedPermissions = [
        'feedback',
        'vehicle',
        'apply business',
        'apply landlord',
        'apply appointment',
        'billing payment',
        'service request',
        'incident report'
    ];
    
    // Get all permission checkboxes in the container
    const checkboxes = container.querySelectorAll('input[type="checkbox"][name="permissions[]"]');
    
    let checkedCount = 0;
    checkboxes.forEach(checkbox => {
        // Get the label text next to the checkbox
        const label = checkbox.closest('label');
        if (label) {
            const labelText = label.textContent.trim().toLowerCase();
            
            // Check if this permission should be excluded
            const shouldExclude = excludedPermissions.some(excluded => {
                const excludedLower = excluded.toLowerCase();
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
    
    console.log(`Admin: Auto-checked ${checkedCount} permissions (excluded ${excludedPermissions.length} permissions)`);
    
    // Show a notification that permissions were auto-selected
    if (checkedCount > 0) {
        showToast('Permissions auto-selected for Admin role', 'success');
    }
}

// Auto-check permissions based on role configuration
function autoCheckPermissionsByRole(role, formType) {
    // Get permissions for this role
    const permissionsToCheck = rolePermissions[role];
    
    if (!permissionsToCheck) {
        console.error('No permissions configured for role:', role);
        return;
    }
    
    // Determine which container to use based on form type
    const container = formType === 'create' 
        ? document.querySelector('#createPermissionSettingForm .border.rounded-lg')
        : document.getElementById('editPermissionsContainer');
    
    if (!container) {
        console.error('Permissions container not found!');
        return;
    }
    
    // Get all permission checkboxes in the container
    const checkboxes = container.querySelectorAll('input[type="checkbox"][name="permissions[]"]');
    
    let checkedCount = 0;
    checkboxes.forEach(checkbox => {
        // Get the label text next to the checkbox
        const label = checkbox.closest('label');
        if (label) {
            const labelText = label.textContent.trim().toLowerCase();
            
            // Check if this permission should be auto-checked (exact match only to avoid substring issues)
            // e.g., "feedback" should NOT match "feedback management"
            const shouldCheck = permissionsToCheck.some(permission => {
                const permissionLower = permission.toLowerCase();
                // Exact match only - prevents "feedback" from matching "feedback management"
                return labelText === permissionLower;
            });
            
            if (shouldCheck) {
                checkbox.checked = true;
                checkedCount++;
            }
        }
    });
    
    console.log(`${capitalizeWords(role)}: Auto-checked ${checkedCount} permissions`);
    
    // Show a notification that permissions were auto-selected
    if (checkedCount > 0) {
        showToast(`Permissions auto-selected for ${capitalizeWords(role)} role`, 'success');
    }
}
