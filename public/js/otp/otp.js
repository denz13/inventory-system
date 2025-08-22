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
                showToast('warning', 'Missing field', 'Please enter the OTP');
                return;
            }
            
            if (otp.length !== 6) {
                showToast('error', 'Invalid OTP', 'Please enter a 6-digit OTP');
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
                        showToast(data.toast_type || 'success', 'Success', data.message);
                    }
                    // Clear the stored email
                    sessionStorage.removeItem('reset_email');
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = data.redirect || '/login';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.toast_type || 'error', 'Error', data.message || 'Invalid OTP');
                    }
                    // Clear the input for retry
                    otpInput.value = '';
                    otpInput.focus();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('error', 'Error', 'Something went wrong. Please try again.');
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

function showToast(type, title, message) {
    // Get the appropriate toast element
    let toastId;
    switch (type) {
        case 'success':
            toastId = 'login_toast_success';
            break;
        case 'error':
            toastId = 'login_toast_error';
            break;
        case 'warning':
            toastId = 'login_toast_warning';
            break;
        default:
            toastId = 'login_toast_error';
    }
    
    const toast = document.getElementById(toastId);
    if (toast) {
        // Update toast content if needed
        if (type === 'error' && message) {
            const errorSlot = document.getElementById('login-error-message-slot');
            if (errorSlot) {
                errorSlot.textContent = message;
            }
        }
        
        // Show toast using Toastify
        Toastify({
            text: title + ': ' + message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: type === 'success' ? '#10B981' : 
                           type === 'error' ? '#EF4444' : 
                           type === 'warning' ? '#F59E0B' : '#6B7280'
            }
        }).showToast();
    }
}
