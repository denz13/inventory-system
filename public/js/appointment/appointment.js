document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing appointment system...');
    
    const descriptionField = document.querySelector('textarea[name="description"]');
    const appointmentDateField = document.querySelector('input[name="appointment_date"]');
    const trackingNumberField = document.querySelector('input[name="tracking_number"]');
    const trackingNumberModal = document.getElementById('trackingNumberModal');

    console.log('Elements found:', {
        descriptionField: !!descriptionField,
        appointmentDateField: !!appointmentDateField,
        trackingNumberField: !!trackingNumberField,
        trackingNumberModal: !!trackingNumberModal
    });

    // Function to generate tracking number based on database ID
    async function generateTrackingNumber() {
        console.log('Generating tracking number...');
        try {
            // Get the next available ID from the database
            const response = await fetch('/appointment/next-id', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                const nextId = data.next_id || 1; // Default to 1 if no appointments exist
                
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                // Format: A-YEAR-MONTH-DAY-SEQUENCE (based on database ID)
                const sequence = String(nextId).padStart(3, '0');
                const trackingNumber = `A-${year}-${month}-${day}-${sequence}`;
                console.log('Generated tracking number:', trackingNumber);
                return trackingNumber;
            } else {
                throw new Error('Failed to get next ID from database');
            }
        } catch (error) {
            console.error('Error generating tracking number:', error);
            throw new Error('Could not generate tracking number. Please try again.');
        }
    }

    // Function to show tracking number modal AFTER successful submission
    async function showTrackingModal(description, appointmentDate, trackingNumber) {
        console.log('Showing modal with saved appointment details...');
        
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
                    min-width: 500px !important;
                    text-align: center !important;
                    border: 2px solid #2563eb !important;
                ">
                    <h2 style="color: #2563eb !important; margin-bottom: 20px !important; font-size: 24px !important;">✅ Your Appointment Details</h2>
                    <div style="
                        text-align: left !important;
                        background-color: #f9fafb !important;
                        padding: 20px !important;
                        border-radius: 8px !important;
                        margin-bottom: 20px !important;
                        border: 1px solid #e5e7eb !important;
                    ">
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Description:</strong> <span style="color: #374151 !important;">${description}</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Date & Time:</strong> <span style="color: #374151 !important;">${new Date(appointmentDate).toLocaleString()}</span></p>
                        <p style="margin-bottom: 0 !important; font-size: 18px !important;"><strong>Tracking Number:</strong> <span style="color: #2563eb !important; font-weight: bold !important;">${trackingNumber}</span></p>
                    </div>
                    <p style="color: #6b7280 !important; margin-bottom: 20px !important; font-size: 14px !important;">Your appointment has been successfully created and saved to the database!</p>
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
            console.error('Error showing modal:', error);
            alert('Error showing appointment details. Please try again.');
        }
    }

    // Function to close modal
    function closeModal() {
        console.log('Closing modal...');
        
        trackingNumberModal.style.display = 'none';
        trackingNumberModal.classList.remove('show');
        trackingNumberModal.setAttribute('aria-hidden', 'true');
    }

    // Close modal when clicking outside
    if (trackingNumberModal) {
        trackingNumberModal.addEventListener('click', function(e) {
            if (e.target === trackingNumberModal) {
                closeModal();
            }
        });
    }

    // Close modal on close button
    const closeBtn = trackingNumberModal?.querySelector('[data-tw-dismiss="modal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Test modal button for debugging
    const testModalBtn = document.getElementById('testModalBtn');
    if (testModalBtn) {
        testModalBtn.addEventListener('click', function() {
            console.log('Test modal button clicked');
            
            // Remove any existing test modal
            const existingTestModal = document.getElementById('testModal');
            if (existingTestModal) {
                existingTestModal.remove();
            }
            
            // Create a completely new test modal with no CSS inheritance
            const testModal = document.createElement('div');
            testModal.id = 'testModal';
            
            // Set all styles directly with !important
            testModal.style.cssText = `
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
            
            // Create modal content with inline styles
            testModal.innerHTML = `
                <div style="
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    background-color: white !important;
                    padding: 30px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                    min-width: 500px !important;
                    text-align: center !important;
                    border: 2px solid #f59e0b !important;
                ">
                    <h2 style="color: #f59e0b !important; margin-bottom: 20px !important; font-size: 24px !important;">🧪 Test Modal</h2>
                    <div style="
                        text-align: left !important;
                        background-color: #fef3c7 !important;
                        padding: 20px !important;
                        border-radius: 8px !important;
                        margin-bottom: 20px !important;
                        border: 1px solid #fbbf24 !important;
                    ">
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Description:</strong> <span style="color: #92400e !important;">Test Description</span></p>
                        <p style="margin-bottom: 10px !important; font-size: 16px !important;"><strong>Date & Time:</strong> <span style="color: #92400e !important;">Test Date Time</span></p>
                        <p style="margin-bottom: 0 !important; font-size: 18px !important;"><strong>Tracking Number:</strong> <span style="color: #dc2626 !important; font-weight: bold !important;">A-2025-08-22-999</span></p>
                    </div>
                    <p style="color: #6b7280 !important; margin-bottom: 20px !important; font-size: 14px !important;">This is a test modal to verify the system is working!</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background-color: #f59e0b !important;
                        color: white !important;
                        border: none !important;
                        padding: 12px 24px !important;
                        border-radius: 6px !important;
                        cursor: pointer !important;
                        font-size: 16px !important;
                        font-weight: bold !important;
                        transition: background-color 0.2s !important;
                    " onmouseover="this.style.backgroundColor='#d97706' !important" onmouseout="this.style.backgroundColor='#f59e0b' !important">Close</button>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(testModal);
            
            console.log('Test modal created successfully with no CSS inheritance');
            console.log('Test modal element:', testModal);
            console.log('Test modal display:', testModal.style.display);
            console.log('Test modal computed display:', window.getComputedStyle(testModal).display);
            
            // Force a repaint
            testModal.offsetHeight;
        });
    }
    
    // Force show modal button for debugging
    const forceShowBtn = document.getElementById('forceShowBtn');
    if (forceShowBtn) {
        forceShowBtn.addEventListener('click', function() {
            console.log('Force show button clicked');
            
            // First, test if JavaScript is working at all
            alert('JavaScript is working! Click OK to continue with modal test.');
            
            // Remove any existing force modal
            const existingForceModal = document.getElementById('forceModalTest');
            if (existingForceModal) {
                existingForceModal.remove();
            }
            
            // Create a completely isolated modal with no CSS inheritance
            const forceModal = document.createElement('div');
            forceModal.id = 'forceModalTest';
            
            // Set all styles directly with !important
            forceModal.style.cssText = `
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
            
            // Create modal content with inline styles
            forceModal.innerHTML = `
                <div style="
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    background-color: white !important;
                    padding: 30px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                    min-width: 400px !important;
                    text-align: center !important;
                    border: 3px solid red !important;
                ">
                    <h2 style="color: red !important; margin-bottom: 20px !important; font-size: 24px !important;">🚨 FORCE MODAL TEST 🚨</h2>
                    <p style="margin-bottom: 15px !important; font-size: 16px !important;"><strong>This modal was created with NO CSS inheritance!</strong></p>
                    <p style="margin-bottom: 15px !important; font-size: 14px !important;">If you can see this, the modal system works!</p>
                    <p style="margin-bottom: 20px !important; font-size: 14px !important;">Description: FORCE SHOW TEST</p>
                    <p style="margin-bottom: 20px !important; font-size: 14px !important;">Date: FORCE SHOW TIME</p>
                    <p style="margin-bottom: 20px !important; font-size: 16px !important; color: blue !important;"><strong>Tracking: FORCE-SHOW-999</strong></p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background-color: red !important;
                        color: white !important;
                        border: none !important;
                        padding: 10px 20px !important;
                        border-radius: 5px !important;
                        cursor: pointer !important;
                        font-size: 16px !important;
                        font-weight: bold !important;
                    ">CLOSE THIS MODAL</button>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(forceModal);
            
            console.log('Force modal created with no CSS inheritance');
            console.log('Force modal element:', forceModal);
            console.log('Force modal display:', forceModal.style.display);
            console.log('Force modal computed display:', window.getComputedStyle(forceModal).display);
            console.log('Force modal offsetParent:', forceModal.offsetParent);
            console.log('Force modal getBoundingClientRect:', forceModal.getBoundingClientRect());
            
            // Force a repaint
            forceModal.offsetHeight;
            
            // Check if it's actually visible
            setTimeout(() => {
                const rect = forceModal.getBoundingClientRect();
                console.log('Force modal final check - rect:', rect);
                console.log('Force modal final check - visible:', rect.width > 0 && rect.height > 0);
                console.log('Force modal final check - in viewport:', rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
                
                // Final alert to confirm modal creation
                if (rect.width > 0 && rect.height > 0) {
                    alert('Modal created successfully! Dimensions: ' + rect.width + 'x' + rect.height);
                } else {
                    alert('Modal creation failed! Dimensions: ' + rect.width + 'x' + rect.height);
                }
            }, 100);
        });
    }

    // Form submission handler - saves to database first, then shows modal
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted, saving appointment to database...');
            
            const description = descriptionField.value.trim();
            const appointmentDate = appointmentDateField.value;
            const status = 'pending';

            // Validate required fields
            if (!description) {
                alert('Please enter appointment description.');
                descriptionField.focus();
                return;
            }

            if (!appointmentDate) {
                alert('Please select appointment date and time.');
                appointmentDateField.focus();
                return;
            }

            try {
                // Generate tracking number first
                const trackingNumber = await generateTrackingNumber();
                
                // Submit to database
                const response = await fetch('/appointment', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: description,
                        appointment_date: appointmentDate,
                        tracking_number: trackingNumber,
                        status: status
                    })
                });

                console.log('Submit response status:', response.status);
                const data = await response.json();
                console.log('Submit response data:', data);

                if (data.success) {
                    console.log('Appointment saved successfully, showing modal...');
                    
                    // Show modal with saved appointment details
                    await showTrackingModal(description, appointmentDate, trackingNumber);
                    
                    // Reset form
                    descriptionField.value = '';
                    appointmentDateField.value = '';
                    trackingNumberField.value = '';
                    
                } else {
                    alert('Error creating appointment: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error submitting appointment:', error);
                alert('Error creating appointment. Please try again.');
            }
        });
    }

    console.log('Appointment system initialized successfully!');
});
