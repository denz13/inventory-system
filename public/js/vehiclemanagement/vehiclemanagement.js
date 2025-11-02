document.addEventListener('DOMContentLoaded', function () {
  var addForm = document.getElementById('addVehicleForm');
  var editForm = document.getElementById('editVehicleForm');
  var table = document.getElementById('vehicleTable');
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  let searchTerm = urlParams.get('search') || '';
  
  // Initialize search functionality - Server-side (Enter key only)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
      searchInput.value = searchTerm; // Set initial value from URL
      
      // Search only when Enter key is pressed
      searchInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
              performServerSideSearch();
          }
      });
      
      // Also allow clicking the search icon to trigger search
      const searchIcon = searchInput.parentElement.querySelector('svg');
      if (searchIcon) {
          searchIcon.style.cursor = 'pointer';
          searchIcon.addEventListener('click', function() {
              performServerSideSearch();
          });
      }
  }
  
  function performServerSideSearch() {
      const url = new URL(window.location.href);
      const searchValue = searchInput ? searchInput.value.trim() : '';
      
      // Update URL parameters
      if (searchValue) {
          url.searchParams.set('search', searchValue);
      } else {
          url.searchParams.delete('search');
      }
      
      // Reset to page 1 when searching
      url.searchParams.delete('page');
      
      // Reload page with new parameters
      window.location.href = url.toString();
  }

  async function postForm(form, url, method) {
    const formData = new FormData(form);
    if (method && method.toUpperCase() !== 'POST') formData.append('_method', method.toUpperCase());
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
        await postForm(addForm, addForm.getAttribute('action') || '/vehicle-management', 'POST');
        var modalEl = document.getElementById('add-vehicle-modal');
        if (modalEl) modalEl.dispatchEvent(new CustomEvent('modal-hide'));
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to save vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

    // Old client-side search functions removed - now using server-side search

  // Bind type-of-vehicle radio to hidden inputs (Add)
  function bindTypeRadios(groupName, hiddenId, otherWrapId, otherInputId) {
    var radios = document.querySelectorAll('input[name="'+groupName+'"]');
    var hidden = document.getElementById(hiddenId);
    var otherWrap = document.getElementById(otherWrapId);
    var otherInput = document.getElementById(otherInputId);
    if (!radios.length || !hidden) return;
    var update = function (val) {
      if (val === 'others') {
        if (otherWrap) otherWrap.classList.remove('hidden');
        if (otherInput) { otherInput.addEventListener('input', function(){ hidden.value = otherInput.value; }); hidden.value = otherInput.value || ''; }
      } else {
        if (otherWrap) otherWrap.classList.add('hidden');
        hidden.value = val;
      }
    };
    radios.forEach(function(r){
      r.addEventListener('change', function(){ update(this.value); });
      if (r.checked) update(r.value);
    });
  }

  bindTypeRadios('add_type_of_vehicle_opt','add_type_of_vehicle','add_other_type_wrap','add_other_type');
  bindTypeRadios('edit_type_of_vehicle_opt','edit_type_of_vehicle','edit_other_type_wrap','edit_other_type');

  // File input handlers
  const addFileInput = document.getElementById('addSupportingDocuments');
  if (addFileInput) {
    addFileInput.addEventListener('change', function() {
      const files = this.files;
      const fileInfo = document.getElementById('addFileInfo');
      if (files && files.length > 0 && fileInfo) {
        let fileList = '';
        let totalSize = 0;
        for (let i = 0; i < files.length; i++) {
          totalSize += files[i].size;
          fileList += `<div>${i + 1}. ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)</div>`;
        }
        fileInfo.innerHTML = `<div class="font-medium mb-1">Selected ${files.length} file(s):</div>${fileList}<div class="mt-1 font-medium">Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</div>`;
        fileInfo.style.display = 'block';
      } else if (fileInfo) {
        fileInfo.style.display = 'none';
      }
    });
  }

  const editFileInput = document.getElementById('editSupportingDocuments');
  if (editFileInput) {
    editFileInput.addEventListener('change', function() {
      const files = this.files;
      const fileInfo = document.getElementById('editFileInfo');
      if (files && files.length > 0 && fileInfo) {
        let fileList = '';
        let totalSize = 0;
        for (let i = 0; i < files.length; i++) {
          totalSize += files[i].size;
          fileList += `<div>${i + 1}. ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)</div>`;
        }
        fileInfo.innerHTML = `<div class="font-medium mb-1">New ${files.length} file(s) selected:</div>${fileList}<div class="mt-1 font-medium">Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</div>`;
        fileInfo.style.display = 'block';
      }
    });
  }


  if (table) {
    table.addEventListener('click', async function (e) {
      var editBtn = e.target.closest('a[data-action="edit"]');
      var deleteBtn = e.target.closest('a[data-action="delete"]');
      var viewBtn = e.target.closest('a[data-action="view"]');
      if (!editBtn && !deleteBtn && !viewBtn) return;
      e.preventDefault();
      var id = (editBtn || deleteBtn || viewBtn).getAttribute('data-id');
      if (!id) return;

      if (deleteBtn) {
        document.getElementById('deleteVehicleId').value = id;
        return;
      }

      if (viewBtn) {
        try {
          const resp = await fetch('/vehicle-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          
          console.log('View data received:', data);
          
          const v = data.vehicle || {};
          const supportingDocs = data.supporting_documents || {};
          const details = data.vehicle_details || {};
          
          var setValue = function (id, value) { 
            var el = document.getElementById(id); 
            if (el) {
              el.value = value || 'N/A';
            }
          };
          
          setValue('view_type_of_vehicle_text', v.type_of_vehicle);
          setValue('view_owner', details.owner);
          setValue('view_driver', details.driver);
          setValue('view_plate_number', details.plate_number);
          setValue('view_vehicle_model', details.vehicle_model);
          setValue('view_or_no', details.or_no);
          setValue('view_cr_no', details.cr_no);
          setValue('view_color_of_vehicle', details.color_of_vehicle);
          setValue('view_vehicle_sticker_control_no', details.sticker_control?.control_number || '-');
          setValue('view_status_text', v.status);
          
          // Handle multiple files
          const docsDiv = document.getElementById('view_supporting_documents');
          if (docsDiv) {
            let supportingDoc = 'No files uploaded';
            if (supportingDocs.supporting_documents_attachments) {
              try {
                const files = JSON.parse(supportingDocs.supporting_documents_attachments);
                if (Array.isArray(files) && files.length > 0) {
                  supportingDoc = files.map((file, index) => {
                    const fileName = file.split('/').pop();
                    return `<div class="mb-1"><a href="/storage/${file}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${index + 1}. ${fileName}</a></div>`;
                  }).join('');
                } else {
                  supportingDoc = `<a href="/storage/${supportingDocs.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>`;
                }
              } catch (e) {
                supportingDoc = `<a href="/storage/${supportingDocs.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>`;
              }
            }
            docsDiv.innerHTML = supportingDoc;
          }
          
          // Show the modal using the proper method
          if (typeof modal_show === 'function') {
            modal_show('#view-vehicle-modal');
          } else {
            // Fallback: try to trigger the modal manually
            const viewModal = document.getElementById('view-vehicle-modal');
            if (viewModal) {
              viewModal.style.display = 'block';
              viewModal.classList.add('show');
              document.body.classList.add('modal-open');
            }
          }
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load vehicle';
          if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
        }
        return;
      }

      if (editBtn) {
        try {
          const resp = await fetch('/vehicle-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          const v = data.vehicle || {};
          const details = data.vehicle_details || {};
          const supportingDocs = data.supporting_documents || {};
          
          var setVal = function (id, value) { var el = document.getElementById(id); if (el) el.value = value || ''; };
          setVal('editVehicleId', v.id);
          setVal('edit_status', v.status || 'Pending');
          
          // Set vehicle type radio buttons
          var vehicleType = v.type_of_vehicle || '';
          var editRadios = document.querySelectorAll('input[name="edit_type_of_vehicle_opt"]');
          var foundMatch = false;
          editRadios.forEach(function(r){ 
            r.checked = false;
            if (r.value === vehicleType) {
              r.checked = true;
              foundMatch = true;
            }
          });
          
          // If type doesn't match preset options, select "others" and show input
          if (!foundMatch && vehicleType) {
            editRadios.forEach(function(r){ if (r.value === 'others') r.checked = true; });
            var wrap = document.getElementById('edit_other_type_wrap');
            if (wrap) wrap.classList.remove('hidden');
            var other = document.getElementById('edit_other_type');
            if (other) other.value = vehicleType;
            document.getElementById('edit_type_of_vehicle').value = vehicleType;
          } else {
            var wrap = document.getElementById('edit_other_type_wrap');
            if (wrap) wrap.classList.add('hidden');
            document.getElementById('edit_type_of_vehicle').value = vehicleType;
          }
          
          // Populate vehicle details
          setVal('edit_owner', details.owner);
          setVal('edit_driver', details.driver);
          setVal('edit_plate_number', details.plate_number);
          setVal('edit_or_no', details.or_no);
          setVal('edit_cr_no', details.cr_no);
          setVal('edit_vehicle_model', details.vehicle_model);
          setVal('edit_color_of_vehicle', details.color_of_vehicle);
          setVal('edit_vehicle_sticker_control_no', details.vehicle_sticker_control_no);
          
          // Show current files
          const fileInfoDiv = document.getElementById('editFileInfo');
          if (fileInfoDiv && supportingDocs.supporting_documents_attachments) {
            try {
              const files = JSON.parse(supportingDocs.supporting_documents_attachments);
              if (Array.isArray(files) && files.length > 0) {
                let fileList = '';
                files.forEach((file, index) => {
                  const fileName = file.split('/').pop();
                  fileList += `<div class="mb-1"><a href="/storage/${file}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${index + 1}. ${fileName}</a></div>`;
                });
                fileInfoDiv.innerHTML = `<div class="font-medium mb-1">Current files (${files.length}):</div>${fileList}`;
                fileInfoDiv.style.display = 'block';
              } else {
                const fileName = supportingDocs.supporting_documents_attachments.split('/').pop();
                fileInfoDiv.innerHTML = `Current file: <a href="/storage/${supportingDocs.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${fileName}</a>`;
                fileInfoDiv.style.display = 'block';
              }
            } catch (e) {
              const fileName = supportingDocs.supporting_documents_attachments.split('/').pop();
              fileInfoDiv.innerHTML = `Current file: <a href="/storage/${supportingDocs.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${fileName}</a>`;
              fileInfoDiv.style.display = 'block';
            }
          }
          
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load vehicle';
          if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
        }
      }
    });
  }

  var confirmDelete = document.getElementById('confirmDeleteVehicle');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteVehicleId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const resp = await fetch('/vehicle-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = document.getElementById('editVehicleId').value;
      try {
        await postForm(editForm, '/vehicle-management/' + id, 'PUT');
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to update vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

  // Event listeners for approve/decline actions
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-action="approve"]')) {
      const vehicleId = e.target.getAttribute('data-vehicle-id');
      console.log('Approve clicked for vehicle ID:', vehicleId);
      approveVehicle(vehicleId);
    }
    
    if (e.target.matches('[data-action="decline"]')) {
      const vehicleId = e.target.getAttribute('data-vehicle-id');
      console.log('Decline clicked for vehicle ID:', vehicleId);
      declineVehicle(vehicleId);
    }
  });

  // Approve vehicle function
  function approveVehicle(vehicleId) {
    console.log('approveVehicle called with ID:', vehicleId);
    
    // Set the vehicle ID first
    const approveIdInput = document.getElementById('approveVehicleId');
    if (approveIdInput) {
      approveIdInput.value = vehicleId;
      console.log('Approve Vehicle ID set to:', approveIdInput.value);
    } else {
      console.error('approveVehicleId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('approve-confirmation-modal');
    if (!modal) {
      console.error('approve-confirmation-modal not found!');
      return;
    }
    console.log('Approve modal found:', modal);
    
    // Use Tailwind's modal system properly
    // Create a temporary button with data-tw-toggle and data-tw-target
    const tempButton = document.createElement('button');
    tempButton.setAttribute('data-tw-toggle', 'modal');
    tempButton.setAttribute('data-tw-target', '#approve-confirmation-modal');
    tempButton.style.display = 'none';
    
    // Add to DOM, click it, then remove it
    document.body.appendChild(tempButton);
    tempButton.click();
    document.body.removeChild(tempButton);
    
    console.log('Modal should now be visible using Tailwind system');
  }

  // Decline vehicle function
  function declineVehicle(vehicleId) {
    console.log('declineVehicle called with ID:', vehicleId);
    
    // Set the vehicle ID first
    const declineIdInput = document.getElementById('declineVehicleId');
    if (declineIdInput) {
      declineIdInput.value = vehicleId;
      console.log('Decline Vehicle ID set to:', declineIdInput.value);
    } else {
      console.error('declineVehicleId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('decline-reason-modal');
    if (!modal) {
      console.error('decline-reason-modal not found!');
      return;
    }
    console.log('Decline modal found:', modal);
    
    // Use Tailwind's modal system properly
    // Create a temporary button with data-tw-toggle and data-tw-target
    const tempButton = document.createElement('button');
    tempButton.setAttribute('data-tw-toggle', 'modal');
    tempButton.setAttribute('data-tw-target', '#decline-reason-modal');
    tempButton.style.display = 'none';
    
    // Add to DOM, click it, then remove it
    document.body.appendChild(tempButton);
    tempButton.click();
    document.body.removeChild(tempButton);
    
    console.log('Modal should now be visible using Tailwind system');
  }

  // Confirm approve function
  window.confirmApprove = function() {
    const vehicleId = document.getElementById('approveVehicleId').value;
    
    // Show loading state
    const approveBtn = document.querySelector('#approve-confirmation-modal .btn-success');
    const originalText = approveBtn.innerHTML;
    approveBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Approving...
    `;
    approveBtn.disabled = true;
    
    fetch(`/vehicle-management/${vehicleId}/approve`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // Close approve confirmation modal
        const modal = document.getElementById('approve-confirmation-modal');
        if (modal) {
          const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
          if (dismissBtn) dismissBtn.click();
        }
        
        // Show valid until modal with control number
        if (data.control_number && data.sticker_id) {
          document.getElementById('displayControlNumber').textContent = data.control_number;
          document.getElementById('validUntilStickerId').value = data.sticker_id;
          
          // Set minimum date to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          document.getElementById('validUntilDate').min = tomorrow.toISOString().split('T')[0];
          
          // Show valid until modal
          const validUntilModal = document.getElementById('valid-until-modal');
          if (validUntilModal) {
            const tempButton = document.createElement('button');
            tempButton.setAttribute('data-tw-toggle', 'modal');
            tempButton.setAttribute('data-tw-target', '#valid-until-modal');
            tempButton.style.display = 'none';
            
            document.body.appendChild(tempButton);
            tempButton.click();
            document.body.removeChild(tempButton);
          }
        } else {
          // Fallback if no control number generated
          showToast(data.message, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if (data.error) {
        // Show error notification
        showToast(data.error, 'error');
      }
    })
    .catch(error => {
      console.error('Error approving vehicle:', error);
      // Show error notification
      showToast('Error approving vehicle. Please try again.', 'error');
    })
    .finally(() => {
      // Reset button state
      approveBtn.innerHTML = originalText;
      approveBtn.disabled = false;
    });
  };

  // Confirm valid until function
  window.confirmValidUntil = function() {
    const stickerId = document.getElementById('validUntilStickerId').value;
    const validUntil = document.getElementById('validUntilDate').value;
    
    if (!validUntil) {
      showToast('Please select a validity date', 'error');
      return;
    }
    
    // Show loading state
    const setDateBtn = document.querySelector('#valid-until-modal .btn-success');
    const originalText = setDateBtn.innerHTML;
    setDateBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Setting...
    `;
    setDateBtn.disabled = true;
    
    fetch(`/vehicle-management/sticker/${stickerId}/valid-until`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valid_until: validUntil
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // Show success notification
        showToast(data.message, 'success');
        // Close modal and reload page after delay
        const modal = document.getElementById('valid-until-modal');
        if (modal) {
          const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
          if (dismissBtn) dismissBtn.click();
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (data.error) {
        // Show error notification
        showToast(data.error, 'error');
      }
    })
    .catch(error => {
      console.error('Error setting validity date:', error);
      // Show error notification
      showToast('Error setting validity date. Please try again.', 'error');
    })
    .finally(() => {
      // Reset button state
      setDateBtn.innerHTML = originalText;
      setDateBtn.disabled = false;
    });
  };

  // Confirm decline function
  window.confirmDecline = function() {
    const vehicleId = document.getElementById('declineVehicleId').value;
    const reason = document.getElementById('declineReason').value;
    
    if (!reason.trim()) {
      // Show error notification for missing reason
      showToast('Please provide a reason for declining.', 'error');
      return;
    }
    
    // Show loading state
    const declineBtn = document.querySelector('#decline-reason-modal .btn-danger');
    const originalText = declineBtn.innerHTML;
    declineBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Declining...
    `;
    declineBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('_token', document.querySelector('input[name="_token"]').value);
    
    fetch(`/vehicle-management/${vehicleId}/decline`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // Show success notification
        showToast(data.message, 'success');
        // Close modal and reload page after delay
        const modal = document.getElementById('decline-reason-modal');
        if (modal) {
          const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
          if (dismissBtn) dismissBtn.click();
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (data.error) {
        // Show error notification
        showToast(data.error, 'error');
      }
    })
    .catch(error => {
      console.error('Error declining vehicle:', error);
      // Show error notification
      showToast('Error declining vehicle. Please try again.', 'error');
    })
    .finally(() => {
      // Reset button state
      declineBtn.innerHTML = originalText;
      declineBtn.disabled = false;
    });
  };

  // Toast notification function
  function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'vehicle_management_toast_success' : 'vehicle_management_toast_error';
    
    if (type === 'success') {
      // Update success message slot with the actual success message
      const successMessageSlot = document.getElementById('vehicle-management-success-message-slot');
      if (successMessageSlot) {
        successMessageSlot.textContent = message;
      }
    } else if (type === 'error') {
      // Update error message slot with the actual error message
      const errorMessageSlot = document.getElementById('vehicle-management-error-message-slot');
      if (errorMessageSlot) {
        errorMessageSlot.textContent = message;
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
            duration: 2000,
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

});


