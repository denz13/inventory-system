document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
});

function initializeRegistrationForm() {
    // Photo preview
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            handlePhotoPreview(e.target.files[0]);
        });
    }

    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    }

    // Submit button click handler
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Submit button clicked');
            submitRegistration();
        });
    }

}

function handlePhotoPreview(file) {
    if (file) {
        // Validate file size (2MB)
        if (file.size > 2048000) {
            showError('photo', 'Photo size must not exceed 2MB');
            document.getElementById('photo').value = '';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            showError('photo', 'Photo must be JPEG, PNG, or JPG format');
            document.getElementById('photo').value = '';
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreviewImg');
            const container = document.getElementById('photoPreview');
            
            if (preview && container) {
                preview.src = e.target.result;
                container.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
        
        // Clear error
        clearError('photo');
    }
}


function submitRegistration() {
    console.log('Submit registration called');
    
    // Clear all previous errors
    clearAllErrors();
    
    // Get form element
    const form = document.getElementById('registrationForm');
    if (!form) {
        console.error('Registration form not found!');
        showErrorToast('Form not found. Please refresh the page.');
        return;
    }
    
    // Basic validation
    const requiredFields = ['name', 'email', 'contact_number', 'gender', 'date_of_birth', 'civil_status', 'password'];
    let hasErrors = false;
    let firstErrorField = null;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            showError(fieldName, `${fieldName.replace('_', ' ')} is required`);
            hasErrors = true;
            
            // Track first error field
            if (!firstErrorField) {
                firstErrorField = fieldName;
            }
        }
    });
    
    if (hasErrors) {
        showWarningToast('Please fill in all required fields');
        
        // Scroll to first error field
        if (firstErrorField) {
            scrollToField(firstErrorField);
        }
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Registering...
    `;

    // Prepare form data
    const formData = new FormData(form);
    
    // Debug: Log form data
    console.log('Form data prepared:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    console.log('Submitting to: /registration-nonhomeowners');

    // Submit via AJAX
    fetch('/registration-nonhomeowners', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(async response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            // Response is not JSON (probably HTML error page)
            const text = await response.text();
            console.error('Non-JSON response received:', text.substring(0, 200));
            throw new Error('Server returned an invalid response. Please check the server logs.');
        }
    })
    .then(data => {
        console.log('Response received:', data);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (data.success) {
            console.log('Registration successful!');
            // Show success toast
            showSuccessToast(data.message);
            // Reset form
            form.reset();
            // Hide photo preview
            const photoPreview = document.getElementById('photoPreview');
            if (photoPreview) {
                photoPreview.classList.add('hidden');
            }
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } else {
            console.log('Registration failed:', data);
            // Handle validation errors
            if (data.errors) {
                displayFormErrors(data.errors);
            }
            showErrorToast(data.message || 'Registration failed. Please check the form and try again.');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        showErrorToast(error.message || 'An unexpected error occurred. Please try again later.');
    });
}

function displayFormErrors(errors) {
    let firstErrorField = null;
    
    for (const [field, messages] of Object.entries(errors)) {
        showError(field, messages[0]);
        
        // Track first error field for scrolling
        if (!firstErrorField) {
            firstErrorField = field;
        }
    }
    
    // Scroll to first error field
    if (firstErrorField) {
        scrollToField(firstErrorField);
    }
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    if (inputElement) {
        inputElement.classList.add('border-red-500');
    }
}

function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
    
    if (inputElement) {
        inputElement.classList.remove('border-red-500');
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
    
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
    });
}

function showSuccessToast(message) {
    console.log('Showing success toast:', message);
    
    // Use the notification toast component
    if (typeof window.showNotification_registration_toast_success === 'function') {
        window.showNotification_registration_toast_success();
    } else {
        console.error('Success notification function not found');
    }
}

function showErrorToast(message) {
    console.log('Showing error toast:', message);
    
    // Update error message slot
    const messageSlot = document.getElementById('registration-error-message-slot');
    if (messageSlot) {
        messageSlot.textContent = message;
    }
    
    // Use the notification toast component
    if (typeof window.showNotification_registration_toast_error === 'function') {
        window.showNotification_registration_toast_error();
    } else {
        console.error('Error notification function not found');
    }
}

function showWarningToast(message) {
    console.log('Showing warning toast:', message);
    
    // Use the notification toast component
    if (typeof window.showNotification_registration_toast_warning === 'function') {
        window.showNotification_registration_toast_warning();
    } else {
        console.error('Warning notification function not found');
    }
}

function scrollToField(fieldName) {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
        fieldElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Optional: Add a slight delay then focus
        setTimeout(() => {
            fieldElement.focus();
        }, 300);
    }
}
