document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('addUserForm');
    var table = document.querySelector('.table.table-report');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch(form.getAttribute('action') || "/user-management", {
                method: "POST",
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
                },
                body: formData
            });

            if (response.ok) {
                // Close modal
                const modalEl = document.getElementById('add-user-modal');
                if (modalEl) {
                    modalEl.dispatchEvent(new CustomEvent('modal-hide'));
                }
                // Show toast
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                } else if (typeof Toastify !== 'undefined') {
                    Toastify({ text: 'User saved successfully', duration: 5000, gravity: 'top', position: 'right' }).showToast();
                }
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
            if (typeof window.showNotification_users_toast_error === 'function') {
                // If server sent message, show it in slot
                try {
                    const data = err && err.message ? err.message : '';
                    const slot = document.getElementById('users-error-message-slot');
                    if (slot && data) slot.textContent = data;
                } catch (_) {}
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
            try {
                var resp = await fetch('/user-management/' + id, {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });
                if (!resp.ok) throw new Error(await resp.text());
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
                setTimeout(function(){ window.location.reload(); }, 500);
            } catch (err) {
                console.error(err);
                const slot = document.getElementById('users-error-message-slot');
                if (slot) slot.textContent = 'Failed to delete user';
                if (typeof window.showNotification_users_toast_error === 'function') {
                    window.showNotification_users_toast_error();
                }
            }
        });
    }

    // Edit submit
    var editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('editUserId').value;
            const formData = new FormData(editForm);
            formData.append('_method', 'PUT');
            try {
                const resp = await fetch('/user-management/' + id, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: formData
                });
                if (!resp.ok) throw new Error(await resp.text());
                if (typeof window.showNotification_users_toast_success === 'function') {
                    window.showNotification_users_toast_success();
                }
                setTimeout(function(){ window.location.reload(); }, 500);
            } catch (err) {
                console.error(err);
                const slot = document.getElementById('users-error-message-slot');
                if (slot) slot.textContent = 'Failed to update user';
                if (typeof window.showNotification_users_toast_error === 'function') {
                    window.showNotification_users_toast_error();
                }
            }
        });
    }
});

