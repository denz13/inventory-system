document.addEventListener('DOMContentLoaded', function () {
  var table = document.getElementById('appointmentTable');

  if (table) {
    table.addEventListener('click', async function (e) {
      var approveBtn = e.target.closest('[data-action="approve"]');
      var cancelBtn = e.target.closest('[data-action="cancel"]');
      var completeBtn = e.target.closest('[data-action="complete"]');
      var deleteBtn = e.target.closest('[data-action="delete"]');
      
      // Debug logging
      console.log('Click detected:', e.target);
      console.log('Approve button found:', !!approveBtn);
      console.log('Cancel button found:', !!cancelBtn);
      console.log('Complete button found:', !!completeBtn);
      console.log('Delete button found:', !!deleteBtn);
      
      if (!approveBtn && !cancelBtn && !completeBtn && !deleteBtn) return;
      e.preventDefault();
      
      var id = (approveBtn || cancelBtn || completeBtn || deleteBtn).getAttribute('data-appointment-id') || 
               (deleteBtn).getAttribute('data-id');
      if (!id) return;

      console.log('Appointment ID:', id);

      if (deleteBtn) {
        document.getElementById('deleteAppointmentId').value = id;
        return;
      }

      if (approveBtn) {
        console.log('Approve button clicked for appointment ID:', id);
        approveAppointment(id);
        return;
      }

      if (cancelBtn) {
        console.log('Cancel button clicked for appointment ID:', id);
        openCancelReasonModal(id);
        return;
      }

      if (completeBtn) {
        console.log('Complete button clicked for appointment ID:', id);
        completeAppointment(id);
        return;
      }
    });
  }

  // Load appointment details for view modal
  function loadAppointmentDetails(appointment) {
    console.log('Loading appointment details:', appointment);
    
    const detailsContainer = document.getElementById('appointment-details');
    if (detailsContainer) {
      const trackingNumber = appointment.tracking_number || 'N/A';
      const status = appointment.status || 'N/A';
      const description = appointment.description || 'N/A';
      const appointmentDate = appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'N/A';
      const dateCreated = appointment.created_at ? new Date(appointment.created_at).toLocaleString() : 'N/A';
      const remarks = appointment.remarks || 'N/A';

      detailsContainer.innerHTML = `
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Tracking Number</label>
            <input type="text" class="form-control" value="${trackingNumber}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Status</label>
            <input type="text" class="form-control" value="${status}" readonly>
          </div>
          <div class="col-span-12">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="3" readonly>${description}</textarea>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Appointment Date</label>
            <input type="text" class="form-control" value="${appointmentDate}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Date Created</label>
            <input type="text" class="form-control" value="${dateCreated}" readonly>
          </div>
          <div class="col-span-12">
            <label class="form-label">Remarks</label>
            <textarea class="form-control" rows="3" readonly>${remarks}</textarea>
          </div>
        </div>
      `;
    }
  }

  // Approve appointment function
  function approveAppointment(appointmentId) {
    console.log('approveAppointment called with ID:', appointmentId);
    
    // Set the appointment ID first
    const approveIdInput = document.getElementById('approveAppointmentId');
    if (approveIdInput) {
      approveIdInput.value = appointmentId;
      console.log('Approve Appointment ID set to:', approveIdInput.value);
    } else {
      console.error('approveAppointmentId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('approve-confirmation-modal');
    if (!modal) {
      console.error('approve-confirmation-modal not found!');
      return;
    }
    console.log('Approve modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#approve-confirmation-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#approve-confirmation-modal');
      tempButton.style.display = 'none';
      
      document.body.appendChild(tempButton);
      tempButton.click();
      document.body.removeChild(tempButton);
      
      console.log('Modal opened via temporary button');
      
      // Approach 3: Manual modal display
      setTimeout(() => {
        if (!modal.classList.contains('show')) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-hidden', 'false');
          console.log('Modal manually shown');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  // Complete appointment function
  function completeAppointment(appointmentId) {
    console.log('completeAppointment called with ID:', appointmentId);
    
    // Set the appointment ID first
    const completeIdInput = document.getElementById('completeAppointmentId');
    if (completeIdInput) {
      completeIdInput.value = appointmentId;
      console.log('Complete Appointment ID set to:', completeIdInput.value);
    } else {
      console.error('completeAppointmentId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('complete-confirmation-modal');
    if (!modal) {
      console.error('complete-confirmation-modal not found!');
      return;
    }
    console.log('Complete modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#complete-confirmation-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#complete-confirmation-modal');
      tempButton.style.display = 'none';
      
      document.body.appendChild(tempButton);
      tempButton.click();
      document.body.removeChild(tempButton);
      
      console.log('Modal opened via temporary button');
      
      // Approach 3: Manual modal display
      setTimeout(() => {
        if (!modal.classList.contains('show')) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-hidden', 'false');
          console.log('Modal manually shown');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  // Function to open cancel reason modal
  function openCancelReasonModal(appointmentId) {
    console.log('=== OPEN CANCEL REASON MODAL DEBUG ===');
    console.log('openCancelReasonModal called with appointment ID:', appointmentId);
    
    // Set the appointment ID in the hidden input
    const cancelIdInput = document.getElementById('cancelAppointmentId');
    if (cancelIdInput) {
      cancelIdInput.value = appointmentId;
      console.log('Cancel Appointment ID set to:', cancelIdInput.value);
    } else {
      console.error('cancelAppointmentId input not found!');
      return;
    }
    
    console.log('=== END OPEN CANCEL REASON MODAL DEBUG ===');
  }





  // Confirm delete (modal)
  var confirmDelete = document.getElementById('confirmDeleteAppointment');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteAppointmentId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('input[name="_token"]').value;
        const resp = await fetch('/appointment-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_appointments_toast_success === 'function') {
          window.showNotification_appointments_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('appointments-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete appointment';
        if (typeof window.showNotification_appointments_toast_error === 'function') {
          window.showNotification_appointments_toast_error();
        }
      }
    });
  }



  // Additional event listener for dropdown menu items
  document.addEventListener('click', function(e) {
    // Check if clicked element is an approve or complete button
    if (e.target.matches('[data-action="approve"]') || e.target.closest('[data-action="approve"]')) {
      e.preventDefault();
      const approveBtn = e.target.matches('[data-action="approve"]') ? e.target : e.target.closest('[data-action="approve"]');
      const appointmentId = approveBtn.getAttribute('data-appointment-id');
      console.log('Approve button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        approveAppointment(appointmentId);
      }
    }
    
    if (e.target.matches('[data-action="complete"]') || e.target.closest('[data-action="complete"]')) {
      e.preventDefault();
      const completeBtn = e.target.matches('[data-action="complete"]') ? e.target : e.target.closest('[data-action="complete"]');
      const appointmentId = completeBtn.getAttribute('data-appointment-id');
      console.log('Complete button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        completeAppointment(appointmentId);
      }
    }
    
    // Check if clicked element is a cancel button
    if (e.target.matches('[data-action="cancel"]') || e.target.closest('[data-action="cancel"]')) {
      const cancelBtn = e.target.matches('[data-action="cancel"]') ? e.target : e.target.closest('[data-action="cancel"]');
      const appointmentId = cancelBtn.getAttribute('data-appointment-id');
      console.log('Cancel button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        openCancelReasonModal(appointmentId);
      }
    }
  });

  // Add event listener for view modal shown event
  const viewModal = document.getElementById('view-appointment-modal');
  if (viewModal) {
    // Listen for when the modal is shown
    viewModal.addEventListener('show.tw.modal', function (event) {
      // Get the appointment ID from the button that triggered the modal
      const triggerButton = document.querySelector('[data-tw-toggle="modal"][data-tw-target="#view-appointment-modal"]:focus');
      if (triggerButton) {
        const appointmentId = triggerButton.getAttribute('data-appointment-id');
        if (appointmentId) {
          loadAppointmentData(appointmentId);
        }
      }
    });
  }

  // Function to load appointment data when modal is shown
  async function loadAppointmentData(appointmentId) {
    try {
      const resp = await fetch('/appointment-management/' + appointmentId);
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      if (data.success && data.appointment) {
        loadAppointmentDetails(data.appointment);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      var slot = document.getElementById('appointments-error-message-slot');
      if (slot) slot.textContent = 'Failed to load appointment';
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  }
});

// Confirm approve appointment function
window.confirmApproveAppointment = function() {
  const appointmentId = document.getElementById('approveAppointmentId').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for approval');
    return;
  }
  
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
  
  const formData = new FormData();
  formData.append('status', 'approved');
  formData.append('remarks', 'Your appointment is approved and you may now go to office at that time and date that in your appointment');
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('approve-confirmation-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error approving appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    approveBtn.innerHTML = originalText;
    approveBtn.disabled = false;
  });
};

// Confirm complete appointment function
window.confirmCompleteAppointment = function() {
  const appointmentId = document.getElementById('completeAppointmentId').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for completion');
    return;
  }
  
  // Show loading state
  const completeBtn = document.querySelector('#complete-confirmation-modal .btn-info');
  const originalText = completeBtn.innerHTML;
  completeBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Completing...
  `;
  completeBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'completed');
  formData.append('remarks', 'Your appointment has been completed successfully');
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('complete-confirmation-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error completing appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    completeBtn.innerHTML = originalText;
    completeBtn.disabled = false;
  });
};



// Confirm cancel appointment function
window.confirmCancelAppointment = function() {
  const appointmentId = document.getElementById('cancelAppointmentId').value;
  const reason = document.getElementById('cancelReason').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for cancellation');
    return;
  }
  
  if (!reason.trim()) {
    // Show error notification for missing reason
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
    // Focus on the reason field
    document.getElementById('cancelReason').focus();
    return;
  }
  
  // Show loading state
  const cancelBtn = document.querySelector('#cancel-reason-modal .btn-danger');
  const originalText = cancelBtn.innerHTML;
  cancelBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Cancelling...
  `;
  cancelBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'cancelled');
  formData.append('remarks', reason);
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('cancel-reason-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error cancelling appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    cancelBtn.innerHTML = originalText;
    cancelBtn.disabled = false;
  });
};
