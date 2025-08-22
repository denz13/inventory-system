document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('otp-submit');
    const otpInput = document.getElementById('otp-input');
    
    // Display the email from session storage
    const resetEmail = sessionStorage.getItem('reset_email');
    if (resetEmail) {
        const emailDisplay = document.querySelector('.intro-x.mt-2.text-slate-400');
        if (emailDisplay) {
            emailDisplay.textContent = `Enter the OTP sent to ${resetEmail}`;
        }
    }
    
    if (submitButton && otpInput) {
        // Auto-focus on OTP input
        otpInput.focus();
        
        // Only allow numeric input and limit to 6 digits
        otpInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 6) {
                value = value.substring(0, 6);
            }
            e.target.value = value;
        });
        
        // Submit on Enter key
        otpInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const otp = otpInput.value.trim();
            
            // Validate OTP
            if (!otp) {
                showToast('Please enter the OTP', 'warning');
                return;
            }
            
            if (otp.length !== 6) {
                showToast('Please enter a 6-digit OTP', 'error');
                return;
            }
            
            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = 'Verifying...';
            
            // Send AJAX request
            fetch('/otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    otp: otp
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.show_toast) {
                        showToast(data.message, data.toast_type || 'success');
                    }
                    // Clear the stored email
                    sessionStorage.removeItem('reset_email');
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = data.redirect || '/login';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.message || 'Invalid OTP', data.toast_type || 'error');
                    }
                    // Clear the input for retry
                    otpInput.value = '';
                    otpInput.focus();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Something went wrong. Please try again.', 'error');
                otpInput.value = '';
                otpInput.focus();
            })
            .finally(() => {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Verify OTP';
            });
        });
    }
});

// Toast notification function (following announcement pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'otp_toast_success' : 'otp_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('otp_error_message_slot');
        if (messageSlot) {
            messageSlot.textContent = message;
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
                    duration: 5000,
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
