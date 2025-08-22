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
                showToast('warning', 'Missing field', 'Please enter your email address');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('error', 'Invalid email', 'Please enter a valid email address');
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
                showToast('error', 'Error', 'CSRF token not found');
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
                        showToast(data.toast_type || 'success', 'OTP Sent', data.message);
                    }
                    // Store email in session storage for OTP verification
                    sessionStorage.setItem('reset_email', email);
                    // Redirect to OTP page after a short delay
                    setTimeout(() => {
                        window.location.href = '/otp';
                    }, 1500);
                } else {
                    if (data.show_toast) {
                        showToast(data.toast_type || 'error', 'Error', data.message || 'Failed to send OTP');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('error', 'Error', 'Something went wrong. Please try again.');
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

function showToast(type, title, message) {
    console.log('showToast called:', type, title, message);
    
    // Fallback if Toastify is not available
    if (typeof Toastify === 'undefined') {
        console.error('Toastify is not loaded');
        alert(title + ': ' + message);
        return;
    }
    
    // Show toast using Toastify
    try {
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
    } catch (error) {
        console.error('Error showing toast:', error);
        alert(title + ': ' + message);
    }
}
