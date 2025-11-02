document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('addUserForm');
    var table = document.querySelector('.table.table-report');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentRoleFilter = urlParams.get('role') || '';
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
    
    // Initialize role filter - Server-side
    initializeRoleFilter();
    
    // Handle User Status Toggle
    document.querySelectorAll('.user-status-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const userId = this.getAttribute('data-user-id');
            const enabled = this.checked;
            
            // Disable toggle during processing
            this.disabled = true;
            
            toggleUserStatus(userId, enabled, this);
        });
    });
    
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"][form="addUserForm"]');
        const originalText = submitBtn?.innerHTML || '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            `;
        }

        try {
            const response = await fetch(form.getAttribute('action') || "/user-management", {
                method: "POST",
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
                },
                body: formData
            });

            if (response.ok) {
                // Show toast
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
                
                // Close modal
                const closeBtn = document.querySelector('#add-user-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                
                // Give toast time to render before reload
                setTimeout(function(){ window.location.reload(); }, 1000);
                return;
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await response.json();
                throw new Error(data.message || 'Request failed');
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Request failed');
            }
        } catch (err) {
            console.error(err);
            
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            
            // Show error toast
            const slot = document.getElementById('users-error-message-slot');
            if (slot) slot.textContent = err.message || 'Failed to save user';
            
            if (typeof window.showNotification_users_toast_error === 'function') {
                window.showNotification_users_toast_error();
            }
        }
    });

    // Delegated View/Edit/Delete handlers
    if (table) {
        table.addEventListener('click', async function (e) {
            var viewBtn = e.target.closest('a[data-action="view"]');
            var editBtn = e.target.closest('a[data-action="edit"]');
            var deleteBtn = e.target.closest('a[data-action="delete"]');
            if (!viewBtn && !editBtn && !deleteBtn) return;

            e.preventDefault();
            var userId = (viewBtn || editBtn || deleteBtn).getAttribute('data-id');
            if (!userId) return;

            if (deleteBtn) {
                document.getElementById('deleteUserId').value = userId;
                return;
            }

            if (viewBtn) {
                await loadUserDetailsForView(userId);
                return;
            }

            if (editBtn) {
                try {
                    const resp = await fetch('/user-management/' + userId);
                    if (!resp.ok) throw new Error(await resp.text());
                    const data = await resp.json();
                    document.getElementById('editUserId').value = data.id;
                    document.getElementById('edit_name').value = data.name || '';
                    document.getElementById('edit_email').value = data.email || '';
                    document.getElementById('edit_password').value = '';
                    document.getElementById('edit_contact_number').value = data.contact_number || '';
                    document.getElementById('edit_street').value = data.street || '';
                    document.getElementById('edit_lot').value = data.lot || '';
                    document.getElementById('edit_block').value = data.block || '';
                    document.getElementById('edit_membership_fee').value = data.membership_fee || '';
                    document.getElementById('edit_gender').value = data.gender || '';
                    document.getElementById('edit_role').value = data.role || '';
                } catch (err) {
                    console.error(err);
                    const slot = document.getElementById('users-error-message-slot');
                    if (slot) slot.textContent = 'Failed to load user';
                    if (typeof window.showNotification_users_toast_error === 'function') {
                        window.showNotification_users_toast_error();
                    }
                }
            }
        });
    }

    // Load user details for view modal
    async function loadUserDetailsForView(userId) {
        const viewContent = document.getElementById('view-user-content');
        
        // Show loading state
        viewContent.innerHTML = `
            <div class="text-center text-slate-500 py-8">
                <svg class="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Loading user information...</p>
            </div>
        `;
        
        try {
            const resp = await fetch('/user-management/' + userId);
            if (!resp.ok) throw new Error(await resp.text());
            const user = await resp.json();
            
        // Build user details HTML
        const hasPhoto = user.photo && user.photo.trim() !== '';
        const photoUrl = hasPhoto ? `/storage/profiles/${user.photo}` : null;
        const statusClass = user.active == 1 ? 'text-success' : 'text-slate-400';
        const statusText = user.active == 1 ? 'Active' : 'Inactive';
        const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        
        // Profile photo HTML - either image or initial circle
        const profilePhotoHtml = hasPhoto 
            ? `<img src="${photoUrl}" alt="${user.name}" class="w-full h-full object-cover">`
            : `<div class="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-4xl">
                   ${userInitial}
               </div>`;
        
        // Signature image
        const hasSignature = user.signature_image && user.signature_image.trim() !== '';
        const signatureUrl = hasSignature ? `/storage/signatures/${user.signature_image}` : null;
        
        viewContent.innerHTML = `
            <div class="grid grid-cols-12 gap-6">
                <!-- Profile Photo Section -->
                <div class="col-span-12 flex justify-center mb-4">
                    <div class="text-center">
                        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 mx-auto mb-3">
                            ${profilePhotoHtml}
                        </div>
                        <div class="font-medium text-lg">${user.name || 'N/A'}</div>
                        <div class="text-slate-500 text-sm">${user.email || 'N/A'}</div>
                        <div class="mt-2">
                            <span class="${statusClass} font-medium">${statusText}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Personal Information Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Personal Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">User ID</label>
                            <div class="form-control bg-slate-50">${user.id || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Full Name</label>
                            <div class="form-control bg-slate-50">${user.name || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Email Address</label>
                            <div class="form-control bg-slate-50">${user.email || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Contact Number</label>
                            <div class="form-control bg-slate-50">${user.contact_number || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Telephone Number</label>
                            <div class="form-control bg-slate-50">${user.telephone_number || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Gender</label>
                            <div class="form-control bg-slate-50">${user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Date of Birth</label>
                            <div class="form-control bg-slate-50">${user.date_of_birth || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Civil Status</label>
                            <div class="form-control bg-slate-50">${user.civil_status ? user.civil_status.charAt(0).toUpperCase() + user.civil_status.slice(1) : 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Role</label>
                            <div class="form-control bg-slate-50">
                                <span class="px-2 py-1 rounded text-xs font-medium bg-slate-200 text-slate-700">
                                    ${user.role ? user.role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Address Information Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Address Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Street</label>
                            <div class="form-control bg-slate-50">${user.street || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Lot</label>
                            <div class="form-control bg-slate-50">${user.lot || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label font-medium text-slate-600">Block</label>
                            <div class="form-control bg-slate-50">${user.block || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Stay Information Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Stay Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Number of Months Stay</label>
                            <div class="form-control bg-slate-50">${user.number_of_months_stay || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Membership Fee</label>
                            <div class="form-control bg-slate-50">${user.membership_fee || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Online Status</label>
                            <div class="form-control bg-slate-50">
                                <span class="px-2 py-1 rounded text-xs font-medium ${user.is_online == 1 ? 'bg-success text-white' : 'bg-slate-300 text-slate-700'}">
                                    ${user.is_online == 1 ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Social Media & Contacts Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Social Media & Contacts</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Facebook Account</label>
                            <div class="form-control bg-slate-50">${user.fb_account || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Messenger Account</label>
                            <div class="form-control bg-slate-50">${user.messenger_account || 'N/A'}</div>
                        </div>
                        <div class="col-span-12">
                            <label class="form-label font-medium text-slate-600">Prepared Contact</label>
                            <div class="form-control bg-slate-50">${user.prepared_contact || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Caretaker Information Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Caretaker Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Caretaker Name</label>
                            <div class="form-control bg-slate-50">${user.caretaker_name || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Caretaker Email</label>
                            <div class="form-control bg-slate-50">${user.caretaker_email || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Caretaker Contact Number</label>
                            <div class="form-control bg-slate-50">${user.caretaker_contact_number || 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Caretaker Address</label>
                            <div class="form-control bg-slate-50">${user.caretaker_address || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Emergency Contact Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Emergency Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12">
                            <label class="form-label font-medium text-slate-600">In Case of Emergency</label>
                            <div class="form-control bg-slate-50 min-h-[60px]">${user.incase_of_emergency || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Signature & Documents Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Signature & Documents</h3>
                    <div class="grid grid-cols-12 gap-4">
                        ${hasSignature ? `
                        <div class="col-span-12">
                            <label class="form-label font-medium text-slate-600">Signature Image</label>
                            <div class="form-control bg-slate-50 p-4 flex justify-center">
                                <img src="${signatureUrl}" alt="Signature" class="max-h-32 border border-slate-200 rounded" onerror="this.parentElement.innerHTML='<span class=text-slate-400>Signature not available</span>'">
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Account Information Section -->
                <div class="col-span-12">
                    <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Account Information</h3>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Account Status</label>
                            <div class="form-control bg-slate-50 ${statusClass} font-medium">${statusText}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Account Created</label>
                            <div class="form-control bg-slate-50">${user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Last Updated</label>
                            <div class="form-control bg-slate-50">${user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}</div>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label font-medium text-slate-600">Email Verified</label>
                            <div class="form-control bg-slate-50">${user.email_verified_at ? new Date(user.email_verified_at).toLocaleString() : 'Not Verified'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        } catch (err) {
            console.error(err);
            viewContent.innerHTML = `
                <div class="text-center text-slate-500 py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-red-300">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p class="text-lg text-red-600">Failed to load user information</p>
                    <p class="text-sm mt-2">${err.message || 'An error occurred'}</p>
                </div>
            `;
        }
    }

    // Confirm delete handler
    var confirmDeleteBtn = document.getElementById('confirmDeleteUser');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function () {
            var id = document.getElementById('deleteUserId').value;
            if (!id) return;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = `
                <svg class="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
            `;
            
            try {
                var resp = await fetch('/user-management/' + id, {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });
                
                if (!resp.ok) throw new Error(await resp.text());
                
                // Show success toast
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
                
                // Close modal
                const closeBtn = document.querySelector('#delete-user-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                
                setTimeout(function(){ window.location.reload(); }, 1000);
            } catch (err) {
                console.error(err);
                
                // Reset button state
                this.disabled = false;
                this.innerHTML = originalText;
                
                // Show error toast
                const slot = document.getElementById('users-error-message-slot');
                if (slot) slot.textContent = err.message || 'Failed to delete user';
                
                if (typeof window.showNotification_users_toast_error === 'function') {
                    window.showNotification_users_toast_error();
                }
            }
        });
    }

    // Edit submit handler
    var editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const id = document.getElementById('editUserId').value;
            const formData = new FormData(editForm);
            formData.append('_method', 'PUT');
            
            // Show loading state
            const submitBtn = document.querySelector('button[type="submit"][form="editUserForm"]');
            const originalText = submitBtn?.innerHTML || '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                `;
            }
            
            try {
                const resp = await fetch('/user-management/' + id, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: formData
                });
                
                if (!resp.ok) throw new Error(await resp.text());
                
                // Show success toast
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
                
                // Close modal
                const closeBtn = document.querySelector('#edit-user-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                
                setTimeout(function(){ window.location.reload(); }, 1000);
            } catch (err) {
                console.error(err);
                
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                
                // Show error toast
                const slot = document.getElementById('users-error-message-slot');
                if (slot) slot.textContent = err.message || 'Failed to update user';
                
                if (typeof window.showNotification_users_toast_error === 'function') {
                    window.showNotification_users_toast_error();
                }
            }
        });
    }

    // Toggle user status function
    function toggleUserStatus(userId, enabled, toggleElement) {
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                      document.querySelector('input[name="_token"]')?.value;
        
        // Make API call to toggle user status
        fetch(`/user-management/${userId}/toggle-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                active: enabled ? 1 : 0
            })
        })
        .then(response => response.json())
        .then(data => {
            // Re-enable toggle
            toggleElement.disabled = false;
            
            if (data.success) {
                // Update the label text and color
                const label = toggleElement.closest('label');
                const statusText = label.querySelector('.text-sm');
                
                if (enabled) {
                    statusText.textContent = 'Active';
                    statusText.classList.remove('text-slate-400');
                    statusText.classList.add('text-success');
                } else {
                    statusText.textContent = 'Inactive';
                    statusText.classList.remove('text-success');
                    statusText.classList.add('text-slate-400');
                }
                
                // Show success message
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
            } else {
                // Revert toggle state on error
                toggleElement.checked = !enabled;
                
                // Show error message
                const slot = document.getElementById('users-error-message-slot');
                if (slot) slot.textContent = data.message || 'Failed to update user status';
                
                if (typeof window.showNotification_users_toast_error === 'function') {
                    window.showNotification_users_toast_error();
                }
            }
        })
        .catch(error => {
            console.error('Error toggling user status:', error);
            
            // Re-enable toggle and revert state
            toggleElement.disabled = false;
            toggleElement.checked = !enabled;
            
            // Show error message
            const slot = document.getElementById('users-error-message-slot');
            if (slot) slot.textContent = 'Error updating user status. Please try again.';
            
            if (typeof window.showNotification_users_toast_error === 'function') {
                window.showNotification_users_toast_error();
            }
        });
    }

    // Role filter functionality - Server-side
    function initializeRoleFilter() {
        const roleFilterItems = document.querySelectorAll('.role-filter-item');
        roleFilterItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentRoleFilter = this.getAttribute('data-role');
                
                // Update button text
                const filterButtonText = document.getElementById('filterButtonText');
                if (currentRoleFilter === '') {
                    filterButtonText.textContent = 'Filter by Role';
                } else {
                    filterButtonText.textContent = this.textContent.trim();
                }
                
                // Apply filters server-side
                applyServerSideFilters();
            });
        });
    }
    
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
        
        if (currentRoleFilter && currentRoleFilter !== '') {
            url.searchParams.set('role', currentRoleFilter);
        } else {
            url.searchParams.delete('role');
        }
        
        // Reset to page 1 when filtering
        url.searchParams.delete('page');
        
        // Reload page with new parameters
        window.location.href = url.toString();
    }
    
    // Set initial filter button state from URL
    if (currentRoleFilter && currentRoleFilter !== '') {
        const filterButtonText = document.getElementById('filterButtonText');
        if (filterButtonText) {
            // Find the matching role to get the display text
            const matchingItem = document.querySelector(`.role-filter-item[data-role="${currentRoleFilter}"]`);
            if (matchingItem) {
                filterButtonText.textContent = matchingItem.textContent.trim();
            } else {
                filterButtonText.textContent = currentRoleFilter.charAt(0).toUpperCase() + currentRoleFilter.slice(1);
            }
        }
    }
});

