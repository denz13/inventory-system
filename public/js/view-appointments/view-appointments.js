document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing view appointments system...');
    
    const viewAppointmentForm = document.getElementById('viewAppointmentForm');
    const trackingNumberField = document.querySelector('input[name="tracking_number"]');
    const trackingNumberModal = document.getElementById('trackingNumberModal');

    console.log('Elements found:', {
        viewAppointmentForm: !!viewAppointmentForm,
        trackingNumberField: !!trackingNumberField,
        trackingNumberModal: !!trackingNumberModal
    });

    // Function to show appointment details modal
    function showAppointmentModal(appointment) {
        console.log('Showing appointment details modal:', appointment);
        
        try {
            // Remove any existing modal first
            const existingModal = document.getElementById('trackingNumberModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Create a completely new modal with no CSS inheritance
            const newModal = document.createElement('div');
            newModal.id = 'trackingNumberModal';
            
            // Set all styles directly with !important
            newModal.style.cssText = `
                display: block !important;
                position: fixed !important;
                z-index: 999999 !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background-color: rgba(0, 0, 0, 0.8) !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: Arial, sans-serif !important;
                color: black !important;
            `;
            
            // Set status color
            let statusColor = '#6b7280'; // Default gray
            switch(appointment.status?.toLowerCase()) {
                case 'pending':
                    statusColor = '#f59e0b'; // Orange
                    break;
                case 'confirmed':
                    statusColor = '#10b981'; // Green
                    break;
                case 'cancelled':
                    statusColor = '#ef4444'; // Red
                    break;
                case 'completed':
                    statusColor = '#3b82f6'; // Blue
                    break;
            }
            
            // Create modal content with inline styles
            newModal.innerHTML = `
                <div style="
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    background-color: white !important;
                    padding: 30px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                    min-width: 600px !important;
                    text-align: center !important;
                    border: 2px solid #2563eb !important;
                ">
                    <h2 style="color: #2563eb !important; margin-bottom: 20px !important; font-size: 24px !important;">📋 Appointment Details</h2>
                    <div style="
                        text-align: left !important;
                        background-color: #f9fafb !important;
                        padding: 20px !important;
                        border-radius: 8px !important;
                        margin-bottom: 20px !important;
                        border: 1px solid #e5e7eb !important;
                    ">
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Tracking Number:</strong> <span style="color: #2563eb !important; font-weight: bold !important;">${appointment.tracking_number || 'N/A'}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Description:</strong> <span style="color: #374151 !important;">${appointment.description || 'N/A'}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Date & Time:</strong> <span style="color: #374151 !important;">${appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleString() : 'N/A'}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Status:</strong> <span style="color: white !important; background-color: ${statusColor} !important; padding: 4px 8px !important; border-radius: 4px !important; font-weight: bold !important;">${appointment.status || 'N/A'}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Remarks:</strong> <span style="color: #374151 !important;">${appointment.remarks || 'N/A'}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Created:</strong> <span style="color: #374151 !important;">${appointment.created_at ? new Date(appointment.created_at).toLocaleString() : 'N/A'}</span></p>
                        <p style="margin-bottom: 0 !important; font-size: 16px !important;"><strong>Last Updated:</strong> <span style="color: #374151 !important;">${appointment.updated_at ? new Date(appointment.updated_at).toLocaleString() : 'N/A'}</span></p>
                    </div>
                    <p style="color: #6b7280 !important; margin-bottom: 20px !important; font-size: 14px !important;">Appointment details retrieved successfully!</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background-color: #2563eb !important;
                        color: white !important;
                        border: none !important;
                        padding: 12px 24px !important;
                        border-radius: 6px !important;
                        cursor: pointer !important;
                        font-size: 16px !important;
                        font-weight: bold !important;
                        transition: background-color 0.2s !important;
                    " onmouseover="this.style.backgroundColor='#1d4ed8' !important" onmouseout="this.style.backgroundColor='#2563eb' !important">Close</button>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(newModal);
            
            console.log('Appointment modal created successfully with no CSS inheritance');
            console.log('Modal element:', newModal);
            console.log('Modal display:', newModal.style.display);
            console.log('Modal computed display:', window.getComputedStyle(newModal).display);
            
            // Force a repaint
            newModal.offsetHeight;
            
        } catch (error) {
            console.error('Error showing appointment modal:', error);
            alert('Error displaying appointment details. Please try again.');
        }
    }

    // Function to close modal
    function closeModal() {
        console.log('Closing modal...');
        
        const modal = document.getElementById('trackingNumberModal');
        if (modal) {
            modal.remove();
        }
    }

    // Close modal when clicking outside
    if (trackingNumberModal) {
        trackingNumberModal.addEventListener('click', function(e) {
            if (e.target === trackingNumberModal) {
                closeModal();
            }
        });
    }

    // Form submission handler - lookup appointment by tracking number
    if (viewAppointmentForm) {
        viewAppointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted, looking up appointment...');
            
            const trackingNumber = trackingNumberField.value.trim();

            // Validate required field
            if (!trackingNumber) {
                alert('Please enter a tracking number.');
                trackingNumberField.focus();
                return;
            }

            console.log('Looking up tracking number:', trackingNumber);

            try {
                // Look up appointment by tracking number
                const response = await fetch('/view-appointments/track', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tracking_number: trackingNumber
                    })
                });

                console.log('Lookup response status:', response.status);
                const data = await response.json();
                console.log('Lookup response data:', data);

                if (data.success) {
                    console.log('Appointment found, showing details...');
                    console.log('Appointment data:', data.appointment);
                    
                    // Show modal with appointment details
                    showAppointmentModal(data.appointment);
                    
                    // Clear the form
                    trackingNumberField.value = '';
                    
                } else {
                    console.log('Appointment not found:', data.message);
                    alert('Appointment not found: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error looking up appointment:', error);
                alert('Error looking up appointment. Please try again.');
            }
        });
    }

    // Make closeModal function globally available
    window.closeModal = closeModal;

    console.log('View appointments system initialized successfully!');
});
