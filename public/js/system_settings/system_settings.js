document.addEventListener('DOMContentLoaded', function() {
    // Handle form submissions for updating system settings
    document.querySelectorAll('.update-setting-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const settingId = this.getAttribute('data-setting-id');
            const settingType = this.getAttribute('data-setting-type');
            const formData = new FormData(this);
            
            // Add _method field for Laravel PUT method spoofing
            formData.append('_method', 'PUT');
            
            // Get CSRF token from meta tag or form
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                             document.querySelector('input[name="_token"]')?.value;
            
            if (csrfToken) {
                formData.set('_token', csrfToken);
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Updating...';
            submitBtn.disabled = true;
            
            fetch(`/system-settings/${settingId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showToast(data.message, 'success');
                    
                    // Reload page after successful update
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showToast(data.message || 'Failed to update system setting', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred while updating the setting: ' + error.message, 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    });
    
    // Handle image preview for file inputs
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showToast('Please select a valid image file', 'error');
                    this.value = '';
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Image size should not exceed 5MB', 'error');
                    this.value = '';
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'mt-2';
                    preview.innerHTML = `
                        <label class="form-label text-sm font-medium text-slate-700">Preview</label>
                        <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-lg border">
                    `;
                    
                    // Remove existing preview
                    const existingPreview = input.parentNode.querySelector('.preview-container');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    
                    preview.className += ' preview-container';
                    input.parentNode.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});

function showToast(message, type) {
    const toastId = type === 'success' ? 'system_settings_toast_success' : 'system_settings_toast_error';
    const toastElement = document.getElementById(toastId);
    
    if (toastElement) {
        // Update message for error toast
        if (type === 'error') {
            const errorSlot = document.getElementById('system_settings_error_message_slot');
            if (errorSlot) {
                errorSlot.textContent = message;
            }
        }
        
        // Show toast
        toastElement.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toastElement.style.display = 'none';
        }, 5000);
    } else {
        // Fallback to Toastify if component not found
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            style: {
                background: type === 'success' ? '#10b981' : '#ef4444'
            },
            stopOnFocus: true
        }).showToast();
    }
}
