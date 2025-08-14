document.addEventListener('DOMContentLoaded', function () {
  var addForm = document.getElementById('addBusinessForm');
  var table = document.getElementById('businessTable');
  var editForm = document.getElementById('editBusinessForm');

  async function postForm(form, url, method) {
    const formData = new FormData(form);
    if (method && method.toUpperCase() !== 'POST') {
      formData.append('_method', method.toUpperCase());
    }
    const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
      body: formData
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp;
  }

  if (addForm) {
    addForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        await postForm(addForm, addForm.getAttribute('action') || '/business-management', 'POST');
        var modalEl = document.getElementById('add-user-modal');
        if (modalEl) modalEl.dispatchEvent(new CustomEvent('modal-hide'));
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to save business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }

  if (table) {
    table.addEventListener('click', async function (e) {
      var editBtn = e.target.closest('a[data-action="edit"]');
      var deleteBtn = e.target.closest('a[data-action="delete"]');
      if (!editBtn && !deleteBtn) return;
      e.preventDefault();
      var id = (editBtn || deleteBtn).getAttribute('data-id');
      if (!id) return;

      if (deleteBtn) {
        document.getElementById('deleteBusinessId').value = id;
        return;
      }

      if (editBtn) {
        try {
          const resp = await fetch('/business-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          document.getElementById('editBusinessId').value = data.id;
          document.getElementById('edit_business_name').value = data.business_name || '';
          document.getElementById('edit_type_of_business').value = data.type_of_business || '';
          document.getElementById('edit_user_id').value = data.user_id || '';
          document.getElementById('edit_address').value = data.address || '';
          document.getElementById('edit_status').value = data.status || 'active';
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load business';
          if (typeof window.showNotification_users_toast_error === 'function') {
            window.showNotification_users_toast_error();
          }
        }
      }
    });
  }

  // Confirm delete (modal)
  var confirmDelete = document.getElementById('confirmDeleteBusiness');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteBusinessId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const resp = await fetch('/business-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = document.getElementById('editBusinessId').value;
      const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const formData = new FormData(editForm);
      formData.append('_method', 'PUT');
      try {
        const resp = await fetch('/business-management/' + id, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
          body: formData
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to update business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }
});


