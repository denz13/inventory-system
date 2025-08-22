document.addEventListener('DOMContentLoaded', function() {
    console.log('Forgot password script loaded');
    
    const submitButton = document.getElementById('forgot-password-submit');
    const emailInput = document.getElementById('forgot-password-email');
    
    console.log('Submit button found:', submitButton);
    console.log('Email input found:', emailInput);
    
    if (submitButton && emailInput) {
        console.log('Adding event listener to submit button');
        submitButton.addEventListener('click', function(e) {
            console.log('Submit button clicked');
            e.preventDefault();
            
            const email = emailInput.value.trim();
            console.log('Email value:', email);
            
            // Validate email
            if (!email) {
                showToast('Please enter your email address', 'warning');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            console.log('CSRF token element:', csrfToken);
            console.log('CSRF token value:', csrfToken ? csrfToken.getAttribute('content') : 'NOT FOUND');
            
            if (!csrfToken) {
                showToast('CSRF token not found', 'error');
                return;
            }
            
            console.log('Sending AJAX request to /forgot-password');
            
            // Send AJAX request
            fetch('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken.getAttribute('content')
                },
                body: JSON.stringify({
                    email: email
                })
            })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    if (data.show_toast) {
                        showToast(data.message, data.toast_type || 'success');
                    }
                    // Store email in session storage for OTP verification
                    sessionStorage.setItem('reset_email', email);
                    // Redirect to OTP page after a short delay
                    setTimeout(() => {
                        window.location.href = '/otp';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.message || 'Failed to send OTP', data.toast_type || 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send OTP';
            });
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toast notification function (following announcement pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'forgot_password_toast_success' : 'forgot_password_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('forgot_password_error_message_slot');
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
