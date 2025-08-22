document.addEventListener('DOMContentLoaded', function() {
    initializeAppointmentManagement();
});

function initializeAppointmentManagement() {
    // Appointment Form Submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleCreateAppointment);
    }

    // Edit Appointment Form Submission
    const editAppointmentForm = document.getElementById('editAppointmentForm');
    if (editAppointmentForm) {
        editAppointmentForm.addEventListener('submit', handleUpdateAppointment);
    }

    // Delete Confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteAppointment);
    }

    // Set minimum date to tomorrow
    const appointmentDateInput = document.getElementById('appointment_date');
    if (appointmentDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        appointmentDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function handleCreateAppointment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    
    fetch('/appointment', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('success', 'Appointment created successfully!');
            e.target.reset();
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showNotification('error', 'Error creating appointment: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('error', 'Error creating appointment. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

function editAppointment(appointmentId) {
    fetch(`/appointment/${appointmentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateEditForm(data.appointment);
                openEditModal();
            } else {
                showNotification('error', 'Error loading appointment details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('error', 'Error loading appointment details');
        });
}

function populateEditForm(appointment) {
    document.getElementById('edit_appointment_id').value = appointment.id;
    document.getElementById('edit_description').value = appointment.description;
    document.getElementById('edit_appointment_date').value = appointment.appointment_date;
    document.getElementById('edit_tracking_number').value = appointment.tracking_number || '';
    document.getElementById('edit_remarks').value = appointment.remarks || '';
    document.getElementById('edit_status').value = appointment.status;
    document.getElementById('edit_is_expired').checked = appointment.is_expired == 1;
}

function openEditModal() {
    const modal = document.getElementById('editAppointmentModal');
    if (modal) {
        // Try multiple approaches to open the modal
        try {
            if (window.twModal && window.twModal.show) {
                window.twModal.show(modal);
            } else {
                // Fallback: create a temporary button and click it
                const tempBtn = document.createElement('button');
                tempBtn.setAttribute('data-tw-toggle', 'modal');
                tempBtn.setAttribute('data-tw-target', '#editAppointmentModal');
                tempBtn.style.display = 'none';
                document.body.appendChild(tempBtn);
                tempBtn.click();
                document.body.removeChild(tempBtn);
            }
        } catch (error) {
            console.error('Error opening modal:', error);
            // Manual fallback
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }
}

function handleUpdateAppointment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointmentId = formData.get('appointment_id');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';
    
    fetch(`/appointment/${appointmentId}`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
            'X-HTTP-Method-Override': 'PUT'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('success', 'Appointment updated successfully!');
            closeEditModal();
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showNotification('error', 'Error updating appointment: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('error', 'Error updating appointment. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

function closeEditModal() {
    const modal = document.getElementById('editAppointmentModal');
    if (modal) {
        try {
            if (window.twModal && window.twModal.hide) {
                window.twModal.hide(modal);
            } else {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        } catch (error) {
            console.error('Error closing modal:', error);
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }
}

function deleteAppointment(appointmentId) {
    // Store the appointment ID for deletion
    window.appointmentToDelete = appointmentId;
    
    // Open delete confirmation modal
    const modal = document.getElementById('deleteAppointmentModal');
    if (modal) {
        try {
            if (window.twModal && window.twModal.show) {
                window.twModal.show(modal);
            } else {
                const tempBtn = document.createElement('button');
                tempBtn.setAttribute('data-tw-toggle', 'modal');
                tempBtn.setAttribute('data-tw-target', '#deleteAppointmentModal');
                tempBtn.style.display = 'none';
                document.body.appendChild(tempBtn);
                tempBtn.click();
                document.body.removeChild(tempBtn);
            }
        } catch (error) {
            console.error('Error opening modal:', error);
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }
}

function confirmDeleteAppointment() {
    const appointmentId = window.appointmentToDelete;
    if (!appointmentId) {
        showNotification('error', 'No appointment selected for deletion');
        return;
    }
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const originalText = confirmBtn.textContent;
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';
    
    fetch(`/appointment/${appointmentId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
            'X-HTTP-Method-Override': 'DELETE'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('success', 'Appointment deleted successfully!');
            closeDeleteModal();
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showNotification('error', 'Error deleting appointment: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('error', 'Error deleting appointment. Please try again.');
    })
    .finally(() => {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    });
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteAppointmentModal');
    if (modal) {
        try {
            if (window.twModal && window.twModal.hide) {
                window.twModal.hide(modal);
            } else {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        } catch (error) {
            console.error('Error closing modal:', error);
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }
}

function showNotification(type, message) {
    // Check if notification toast component exists
    const toast = document.getElementById(`${type}_toast`);
    if (toast) {
        // Update message and show toast
        const messageElement = toast.querySelector('.message') || toast.querySelector('[data-message]');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        // Show the toast
        if (window.showNotificationToast) {
            window.showNotificationToast(type, message);
        } else {
            // Fallback: use basic alert
            alert(message);
        }
    } else {
        // Fallback: use basic alert
        alert(message);
    }
}
