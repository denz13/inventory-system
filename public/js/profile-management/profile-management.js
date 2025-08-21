document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeEditProfile();
    initializeTenantManagement();
});

// Global variable to store selected file
let selectedPhotoFile = null;

// Handle profile photo upload
function handleProfilePhotoUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            input.value = ''; // Clear the input
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size must be less than 5MB', 'error');
            input.value = ''; // Clear the input
            return;
        }
        
        // Store the selected file
        selectedPhotoFile = file;
        console.log('Selected photo file stored:', selectedPhotoFile);
        
        // Show preview in modal
        const reader = new FileReader();
        reader.onload = function(e) {
            const modalPreview = document.getElementById('modal-photo-preview');
            if (modalPreview) {
                modalPreview.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
        
        // Show confirmation modal
        showPhotoUploadModal();
    }
}

// Show the photo upload confirmation modal using Tailwind
function showPhotoUploadModal() {
    // Use the hidden trigger button to properly show Tailwind modal
    const trigger = document.getElementById('photo-modal-trigger');
    if (trigger) {
        trigger.click();
    }
}

// Hide the photo upload confirmation modal
function hidePhotoUploadModal() {
    // Use Tailwind's dismiss functionality
    const dismissBtns = document.querySelectorAll('#photo-upload-modal [data-tw-dismiss="modal"]');
    if (dismissBtns.length > 0) {
        dismissBtns[0].click();
    }
    
    // Clear the file input
    const fileInput = document.getElementById('profile-photo-input');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Clear selected file
    selectedPhotoFile = null;
}

// Initialize modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Confirm upload button
    const confirmBtn = document.getElementById('confirm-upload-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            console.log('Confirm button clicked, selectedPhotoFile:', selectedPhotoFile);
            if (selectedPhotoFile) {
                // Store file in local variable before clearing
                const fileToUpload = selectedPhotoFile;
                console.log('File to upload:', fileToUpload);
                hidePhotoUploadModal();
                setTimeout(() => {
                    uploadProfilePhoto(fileToUpload);
                }, 100); // Small delay to ensure modal closes first
            } else {
                console.error('No file selected when confirm button clicked');
                showToast('Error: No file selected', 'error');
            }
        });
    }
    
    // Clear data when modal is dismissed
    const cancelBtns = document.querySelectorAll('#photo-upload-modal [data-tw-dismiss="modal"]');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Clear the file input
            const fileInput = document.getElementById('profile-photo-input');
            if (fileInput) {
                fileInput.value = '';
            }
            // Clear selected file
            selectedPhotoFile = null;
        });
    });
});

// Upload profile photo to server
function uploadProfilePhoto(file) {
    // Check if file exists
    if (!file) {
        console.error('No file provided to upload');
        showToast('Error: No file selected', 'error');
        return;
    }

    // Debug: Log file information
    console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    });

    const formData = new FormData();
    formData.append('profile_photo', file, file.name); // Include filename
    formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    
    // Show loading state
    showToast('Uploading profile photo...', 'info');
    
    fetch('/profile-management/upload-photo', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Upload response:', data);
        if (data.success) {
            showToast('Profile photo updated successfully!', 'success');
            // Update the main profile image with the new URL
            const previewImage = document.getElementById('profile-image-preview');
            if (previewImage && data.photo_url) {
                previewImage.src = data.photo_url + '?t=' + new Date().getTime(); // Add timestamp to prevent caching
            }
        } else {
            // Show detailed validation errors if available
            let errorMessage = data.message || 'Error uploading photo';
            if (data.errors && data.errors.profile_photo) {
                errorMessage = data.errors.profile_photo.join(', ');
            }
            console.error('Upload error:', data);
            showToast(errorMessage, 'error');
        }
    })
    .catch(error => {
        console.error('Error uploading photo:', error);
        showToast('Error uploading photo. Please try again.', 'error');
    });
}

function initializeTabs() {
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.nav-link-tabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and panes
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab pane
            const targetId = this.getAttribute('data-tw-target').substring(1);
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

function initializeForms() {
    // Account form submission
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAccountUpdate();
        });
    }

    // Change password form submission
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }
}

function initializeEditProfile() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Switch to account tab
            const accountTab = document.querySelector('[data-tw-target="#account"]');
            if (accountTab) {
                accountTab.click();
            }
        });
    }
}

function handleAccountUpdate() {
    const form = document.getElementById('accountForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    fetch('/profile-management/update', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Profile updated successfully', 'success');
            
            // Update the profile display
            updateProfileDisplay(formData);
            
            // Switch back to profile tab
            setTimeout(() => {
                const profileTab = document.querySelector('[data-tw-target="#profile"]');
                if (profileTab) {
                    profileTab.click();
                }
            }, 1000);
        } else {
            showToast(data.message || 'Error updating profile', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function handlePasswordChange() {
    const form = document.getElementById('changePasswordForm');
    const formData = new FormData(form);
    
    // Validate password confirmation
    const newPassword = form.querySelector('[name="new_password"]').value;
    const confirmPassword = form.querySelector('[name="new_password_confirmation"]').value;
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Changing...';
    submitBtn.disabled = true;

    fetch('/profile-management/change-password', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Password changed successfully', 'success');
            
            // Reset form
            form.reset();
            
            // Switch back to profile tab
            setTimeout(() => {
                const profileTab = document.querySelector('[data-tw-target="#profile"]');
                if (profileTab) {
                    profileTab.click();
                }
            }, 1000);
        } else {
            showToast(data.message || 'Error changing password', 'error');
        }
    })
    .catch(error => {
        console.error('Error changing password:', error);
        showToast('Error changing password', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function updateProfileDisplay(formData) {
    // Update the profile information display
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const address = formData.get('address') || 'Not provided';
    const bio = formData.get('bio') || 'No bio available';

    // Update profile tab display
    const profileTab = document.getElementById('profile');
    if (profileTab) {
        // Update personal information section
        const personalInfoSection = profileTab.querySelector('.box');
        if (personalInfoSection) {
            const infoElements = personalInfoSection.querySelectorAll('.text-slate-600');
            if (infoElements.length >= 5) {
                infoElements[0].textContent = name;
                infoElements[1].textContent = email;
                infoElements[2].textContent = phone;
                infoElements[3].textContent = address;
                infoElements[4].textContent = bio;
            }
        }
    }

    // Update header display
    const headerName = document.querySelector('.font-medium.text-lg');
    if (headerName) {
        headerName.textContent = name;
    }

    // Update contact details
    const contactDetails = document.querySelectorAll('.truncate.sm\\:whitespace-normal.flex.items-center');
    if (contactDetails.length >= 1) {
        // Update email
        contactDetails[0].innerHTML = contactDetails[0].innerHTML.replace(/[^<]*$/, ' ' + email + ' ');
        
        // Update phone if exists
        if (contactDetails.length >= 2) {
            contactDetails[1].innerHTML = contactDetails[1].innerHTML.replace(/[^<]*$/, ' ' + phone + ' ');
        }
        
        // Update address if exists
        if (contactDetails.length >= 3) {
            contactDetails[2].innerHTML = contactDetails[2].innerHTML.replace(/[^<]*$/, ' ' + address + ' ');
        }
    }
}

function showToast(message, type = 'success') {
    const toastElement = document.getElementById(`profile_toast_${type}`);
    
    // Fix: Check if toastElement exists before calling querySelector
    const messageElement = type === 'error' 
        ? document.getElementById('profile_error_message_slot')
        : (toastElement ? toastElement.querySelector('.text-slate-500') : null);
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    if (toastElement) {
        // Show toast using Toastify
        Toastify({
            node: toastElement.cloneNode(true),
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
        }).showToast();
    } else {
        // Fallback: Simple Toastify if toast elements don't exist
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: type === 'success' ? '#10b981' : '#ef4444',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '14px'
            },
            className: "toastify-content"
        }).showToast();
    }
}

// Additional utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
}

// Settings handlers
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('#settings')) {
        // Handle settings changes
        const setting = e.target.closest('.flex').querySelector('.font-medium').textContent;
        const isEnabled = e.target.checked;
        
        console.log(`Setting "${setting}" ${isEnabled ? 'enabled' : 'disabled'}`);
        
        // You can add API calls here to save settings
        showToast(`${setting} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
    }
});

// Two-factor authentication enable button
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Enable' && e.target.closest('#settings')) {
        showToast('Two-Factor Authentication setup would open here', 'success');
        e.target.textContent = 'Enabled';
        e.target.classList.remove('btn-outline-primary');
        e.target.classList.add('btn-success');
        e.target.disabled = true;
    }
});

// Tenant Management Functions
function initializeTenantManagement() {
    // Add tenant form submission
    const addTenantForm = document.getElementById('addTenantForm');
    if (addTenantForm) {
        addTenantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddTenant();
        });
    }

    // Reset tenant form
    const resetTenantBtn = document.getElementById('resetTenantForm');
    if (resetTenantBtn) {
        resetTenantBtn.addEventListener('click', function() {
            resetTenantForm();
        });
    }

    // Tenant search functionality
    const tenantSearch = document.getElementById('tenantSearch');
    if (tenantSearch) {
        tenantSearch.addEventListener('input', function() {
            filterTenants(this.value);
        });
    }

    // Initialize tenant action buttons
    initializeTenantActions();
}

function handleAddTenant() {
    const form = document.getElementById('addTenantForm');
    const formData = new FormData(form);
    
    // Check if we're in edit mode
    const isEditMode = form.getAttribute('data-edit-mode') === 'true';
    const tenantId = form.getAttribute('data-tenant-id');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = isEditMode ? 'Updating...' : 'Adding...';
    submitBtn.disabled = true;

    const url = isEditMode ? `/profile-management/tenants/${tenantId}` : '/profile-management/tenants';
    const method = isEditMode ? 'PUT' : 'POST';

    // If updating, add method override for Laravel
    if (isEditMode) {
        formData.append('_method', 'PUT');
    }

    fetch(url, {
        method: 'POST', // Always POST with method override for Laravel
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(isEditMode ? 'Tenant updated successfully!' : 'Tenant added successfully!', 'success');
            
            // Reset form
            resetTenantForm();
            
            if (isEditMode) {
                // Refresh the page to update the tenant list
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                // Add new tenant to list
                refreshTenantsList(data.tenant);
            }
        } else {
            // Show detailed validation errors if available
            let errorMessage = data.message || 'Error saving tenant';
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                errorMessage = errorMessages.join(', ');
            }
            console.error('Tenant save error:', data);
            showToast(errorMessage, 'error');
        }
    })
    .catch(error => {
        console.error('Error saving tenant:', error);
        showToast('Error saving tenant. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function resetTenantForm() {
    const form = document.getElementById('addTenantForm');
    if (form) {
        form.reset();
        
        // Reset form state
        form.removeAttribute('data-edit-mode');
        form.removeAttribute('data-tenant-id');
        
        // Reset form title and button
        const formTitle = form.closest('.box').querySelector('h2');
        if (formTitle) {
            formTitle.textContent = 'Add New Tenant';
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Add Tenant';
            submitBtn.removeAttribute('data-editing');
        }
    }
}

function refreshTenantsList(newTenant) {
    const tenantsList = document.getElementById('tenantsList');
    if (!tenantsList) return;

    // Check if there's a "no tenants" message and remove it
    const noTenantsMessage = tenantsList.querySelector('.text-center.py-8');
    if (noTenantsMessage) {
        noTenantsMessage.remove();
    }

    // Create new tenant item HTML
    const tenantHTML = createTenantItemHTML(newTenant);
    
    // Add to the beginning of the list
    tenantsList.insertAdjacentHTML('afterbegin', tenantHTML);
    
    // Re-initialize action buttons for the new tenant
    initializeTenantActions();
}

function createTenantItemHTML(tenant) {
    const photoSrc = tenant.photo 
        ? `/storage/tenants/${tenant.photo}` 
        : '';
    
    const photoHTML = tenant.photo 
        ? `<img alt="${tenant.full_name}" class="rounded-full w-full h-full object-cover" src="${photoSrc}">`
        : `<div class="rounded-full w-full h-full bg-slate-200 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>`;

    const relationshipText = tenant.relationship ? tenant.relationship.charAt(0).toUpperCase() + tenant.relationship.slice(1) : 'No relationship set';
    
    const contactInfo = (tenant.contact_number || tenant.email) 
        ? `<div class="text-slate-500 text-xs mt-1">
               ${tenant.contact_number ? `<span>${tenant.contact_number}</span>` : ''}
               ${tenant.email ? `<span class="ml-2">${tenant.email}</span>` : ''}
           </div>`
        : '';

    return `
        <div class="tenant-item border-b border-slate-200/60 py-4 last:border-b-0" data-tenant-id="${tenant.id}">
            <div class="flex items-center">
                <div class="w-12 h-12 flex-none image-fit">
                    ${photoHTML}
                </div>
                <div class="ml-4 flex-1">
                    <div class="font-medium">${tenant.full_name}</div>
                    <div class="text-slate-500 text-xs mt-0.5">${relationshipText}</div>
                    ${contactInfo}
                </div>
                <div class="flex items-center">
                    <span class="px-2 py-1 rounded-full text-xs ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                    <div class="dropdown ml-3">
                        <button class="dropdown-toggle btn px-2 py-1 box" aria-expanded="false" data-tw-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        <div class="dropdown-menu w-40">
                            <ul class="dropdown-content">
                                <li>
                                    <a href="javascript:;" class="dropdown-item edit-tenant" data-tenant-id="${tenant.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:;" class="dropdown-item delete-tenant text-danger" data-tenant-id="${tenant.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeTenantActions() {
    // Edit tenant buttons
    const editBtns = document.querySelectorAll('.edit-tenant');
    editBtns.forEach(btn => {
        btn.removeEventListener('click', handleEditTenant); // Remove existing listeners
        btn.addEventListener('click', handleEditTenant);
    });

    // Delete tenant buttons
    const deleteBtns = document.querySelectorAll('.delete-tenant');
    deleteBtns.forEach(btn => {
        btn.removeEventListener('click', handleDeleteTenant); // Remove existing listeners
        btn.addEventListener('click', handleDeleteTenant);
    });
}

function handleEditTenant(e) {
    e.preventDefault();
    const tenantId = this.getAttribute('data-tenant-id');
    
    // Fetch tenant data
    fetch(`/profile-management/tenants/${tenantId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateTenantForm(data.tenant);
            showToast('You can now edit the tenant information', 'success');
        } else {
            showToast('Error loading tenant data', 'error');
        }
    })
    .catch(error => {
        console.error('Error fetching tenant:', error);
        showToast('Error loading tenant data', 'error');
    });
}

function populateTenantForm(tenant) {
    const form = document.getElementById('addTenantForm');
    if (!form) return;

    // Populate form fields
    document.getElementById('tenantFullName').value = tenant.full_name || '';
    document.getElementById('tenantRelationship').value = tenant.relationship || '';
    document.getElementById('tenantContact').value = tenant.contact_number || '';
    document.getElementById('tenantEmail').value = tenant.email || '';

    // Change form title and button
    const formTitle = form.closest('.box').querySelector('h2');
    if (formTitle) {
        formTitle.textContent = 'Edit Tenant';
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Update Tenant';
        submitBtn.setAttribute('data-editing', tenant.id);
    }

    // Change form action
    form.setAttribute('data-edit-mode', 'true');
    form.setAttribute('data-tenant-id', tenant.id);
}

function handleDeleteTenant(e) {
    e.preventDefault();
    const tenantId = this.getAttribute('data-tenant-id');
    
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
        deleteTenant(tenantId);
    }
}

function deleteTenant(tenantId) {
    fetch(`/profile-management/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Tenant deleted successfully', 'success');
            
            // Remove tenant from list
            const tenantItem = document.querySelector(`[data-tenant-id="${tenantId}"]`);
            if (tenantItem) {
                tenantItem.remove();
            }

            // Check if list is now empty
            const tenantsList = document.getElementById('tenantsList');
            if (tenantsList && tenantsList.children.length === 0) {
                tenantsList.innerHTML = `
                    <div class="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 mx-auto text-slate-300 mb-4"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                        <p class="text-slate-500">No tenants added yet</p>
                        <p class="text-slate-400 text-sm">Use the form on the left to add your first tenant</p>
                    </div>
                `;
            }
        } else {
            showToast(data.message || 'Error deleting tenant', 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting tenant:', error);
        showToast('Error deleting tenant', 'error');
    });
}

function filterTenants(searchTerm) {
    const tenantItems = document.querySelectorAll('.tenant-item');
    const searchLower = searchTerm.toLowerCase();

    tenantItems.forEach(item => {
        const fullName = item.querySelector('.font-medium').textContent.toLowerCase();
        const relationship = item.querySelector('.text-slate-500').textContent.toLowerCase();
        
        const matches = fullName.includes(searchLower) || relationship.includes(searchLower);
        item.style.display = matches ? 'block' : 'none';
    });
}
