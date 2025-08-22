document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('new-password-submit');
    const passwordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    
    if (submitButton && passwordInput && confirmPasswordInput) {
        // Auto-focus on password input
        passwordInput.focus();
        
        // Submit on Enter key in password field
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmPasswordInput.focus();
            }
        });
        
        // Submit on Enter key in confirm password field
        confirmPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            // Validate password
            if (!password) {
                showToast('warning', 'Missing field', 'Please enter your new password');
                passwordInput.focus();
                return;
            }
            
            if (password.length < 8) {
                showToast('error', 'Invalid password', 'Password must be at least 8 characters long');
                passwordInput.focus();
                return;
            }
            
            // Validate confirm password
            if (!confirmPassword) {
                showToast('warning', 'Missing field', 'Please confirm your new password');
                confirmPasswordInput.focus();
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('error', 'Password mismatch', 'Passwords do not match');
                confirmPasswordInput.focus();
                return;
            }
            
            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = 'Resetting...';
            
            // Send AJAX request
            fetch('/new-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    password: password,
                    password_confirmation: confirmPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.show_toast) {
                        showToast(data.toast_type || 'success', 'Success', data.message);
                    }
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = data.redirect || '/login';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.toast_type || 'error', 'Error', data.message || 'Failed to reset password');
                    }
                    // Clear the inputs for retry
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
                    passwordInput.focus();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('error', 'Error', 'Something went wrong. Please try again.');
                passwordInput.value = '';
                confirmPasswordInput.value = '';
                passwordInput.focus();
            })
            .finally(() => {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Reset Password';
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
