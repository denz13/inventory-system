document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('addUserForm');
    var table = document.querySelector('.table.table-report');
    
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

    // Delegated Edit/Delete handlers
    if (table) {
        table.addEventListener('click', async function (e) {
            var editBtn = e.target.closest('a[data-action="edit"]');
            var deleteBtn = e.target.closest('a[data-action="delete"]');
            if (!editBtn && !deleteBtn) return;

            e.preventDefault();
            var userId = (editBtn || deleteBtn).getAttribute('data-id');
            if (!userId) return;

            if (deleteBtn) {
                document.getElementById('deleteUserId').value = userId;
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
                    document.getElementById('edit_is_with_title').value = (data.is_with_title || 0);
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
});

