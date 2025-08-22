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
                showToast('Please enter your new password', 'warning');
                passwordInput.focus();
                return;
            }
            
            if (password.length < 8) {
                showToast('Password must be at least 8 characters long', 'error');
                passwordInput.focus();
                return;
            }
            
            // Validate confirm password
            if (!confirmPassword) {
                showToast('Please confirm your new password', 'warning');
                confirmPasswordInput.focus();
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
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
                        showToast(data.message, data.toast_type || 'success');
                    }
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = data.redirect || '/login';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.message || 'Failed to reset password', data.toast_type || 'error');
                    }
                    // Clear the inputs for retry
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
                    passwordInput.focus();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Something went wrong. Please try again.', 'error');
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

// Toast notification function (following announcement pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'new_password_toast_success' : 'new_password_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('new_password_error_message_slot');
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
