document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeEditProfile();
    initializeTenantManagement();
});

// Global variable to store selected file
let selectedPhotoFile = null;

// Handle profile photo upload
function handleProfilePhotoUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            input.value = ''; // Clear the input
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size must be less than 5MB', 'error');
            input.value = ''; // Clear the input
            return;
        }
        
        // Store the selected file
        selectedPhotoFile = file;
        console.log('Selected photo file stored:', selectedPhotoFile);
        
        // Show preview in modal
        const reader = new FileReader();
        reader.onload = function(e) {
            const modalPreview = document.getElementById('modal-photo-preview');
            if (modalPreview) {
                modalPreview.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
        
        // Show confirmation modal
        showPhotoUploadModal();
    }
}

// Show the photo upload confirmation modal using Tailwind
function showPhotoUploadModal() {
    // Use the hidden trigger button to properly show Tailwind modal
    const trigger = document.getElementById('photo-modal-trigger');
    if (trigger) {
        trigger.click();
    }
}

// Hide the photo upload confirmation modal
function hidePhotoUploadModal() {
    // Use Tailwind's dismiss functionality
    const dismissBtns = document.querySelectorAll('#photo-upload-modal [data-tw-dismiss="modal"]');
    if (dismissBtns.length > 0) {
        dismissBtns[0].click();
    }
    
    // Clear the file input
    const fileInput = document.getElementById('profile-photo-input');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Clear selected file
    selectedPhotoFile = null;
}

// Initialize modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Confirm upload button
    const confirmBtn = document.getElementById('confirm-upload-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            console.log('Confirm button clicked, selectedPhotoFile:', selectedPhotoFile);
            if (selectedPhotoFile) {
                // Store file in local variable before clearing
                const fileToUpload = selectedPhotoFile;
                console.log('File to upload:', fileToUpload);
                hidePhotoUploadModal();
                setTimeout(() => {
                    uploadProfilePhoto(fileToUpload);
                }, 100); // Small delay to ensure modal closes first
            } else {
                console.error('No file selected when confirm button clicked');
                showToast('Error: No file selected', 'error');
            }
        });
    }
    
    // Clear data when modal is dismissed
    const cancelBtns = document.querySelectorAll('#photo-upload-modal [data-tw-dismiss="modal"]');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Clear the file input
            const fileInput = document.getElementById('profile-photo-input');
            if (fileInput) {
                fileInput.value = '';
            }
            // Clear selected file
            selectedPhotoFile = null;
        });
    });
});

// Upload profile photo to server
function uploadProfilePhoto(file) {
    // Check if file exists
    if (!file) {
        console.error('No file provided to upload');
        showToast('Error: No file selected', 'error');
        return;
    }

    // Debug: Log file information
    console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    });

    const formData = new FormData();
    formData.append('profile_photo', file, file.name); // Include filename
    formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    
    // Show loading state
    showToast('Uploading profile photo...', 'info');
    
    fetch('/profile-management/upload-photo', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Upload response:', data);
        if (data.success) {
            showToast('Profile photo updated successfully!', 'success');
            // Update the main profile image with the new URL
            const previewImage = document.getElementById('profile-image-preview');
            if (previewImage && data.photo_url) {
                previewImage.src = data.photo_url + '?t=' + new Date().getTime(); // Add timestamp to prevent caching
            }
        } else {
            // Show detailed validation errors if available
            let errorMessage = data.message || 'Error uploading photo';
            if (data.errors && data.errors.profile_photo) {
                errorMessage = data.errors.profile_photo.join(', ');
            }
            console.error('Upload error:', data);
            showToast(errorMessage, 'error');
        }
    })
    .catch(error => {
        console.error('Error uploading photo:', error);
        showToast('Error uploading photo. Please try again.', 'error');
    });
}

function initializeTabs() {
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.nav-link-tabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and panes
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab pane
            const targetId = this.getAttribute('data-tw-target').substring(1);
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

function initializeForms() {
    // Account form submission
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAccountUpdate();
        });
    }

    // Change password form submission
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }
}

function initializeEditProfile() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditProfile');
    const editProfileForm = document.getElementById('editProfileForm');
    const profileDisplay = document.getElementById('profileDisplay');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Show edit form and hide display
            editProfileForm.style.display = 'block';
            profileDisplay.style.display = 'none';
            
            // Change button text and style
            editProfileBtn.textContent = 'Editing...';
            editProfileBtn.classList.remove('btn-outline-secondary');
            editProfileBtn.classList.add('btn-warning');
            editProfileBtn.disabled = true;
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Hide edit form and show display
            editProfileForm.style.display = 'none';
            profileDisplay.style.display = 'block';
            
            // Reset button
            editProfileBtn.textContent = 'Edit Profile';
            editProfileBtn.classList.remove('btn-warning');
            editProfileBtn.classList.add('btn-outline-secondary');
            editProfileBtn.disabled = false;
            
            // Reset form to original values
            resetEditProfileForm();
        });
    }
    
    // Handle edit profile form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEditProfileUpdate();
        });
    }
}

function handleAccountUpdate() {
    const form = document.getElementById('accountForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    fetch('/profile-management/update', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Profile updated successfully', 'success');
            
            // Update the profile display
            updateProfileDisplay(formData);
            
            // Switch back to profile tab
            setTimeout(() => {
                const profileTab = document.querySelector('[data-tw-target="#profile"]');
                if (profileTab) {
                    profileTab.click();
                }
            }, 1000);
        } else {
            showToast(data.message || 'Error updating profile', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function handlePasswordChange() {
    const form = document.getElementById('changePasswordForm');
    const formData = new FormData(form);
    
    // Validate password confirmation
    const newPassword = form.querySelector('[name="new_password"]').value;
    const confirmPassword = form.querySelector('[name="new_password_confirmation"]').value;
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Changing...';
    submitBtn.disabled = true;

    fetch('/profile-management/change-password', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Password changed successfully', 'success');
            
            // Reset form
            form.reset();
            
            // Switch back to profile tab
            setTimeout(() => {
                const profileTab = document.querySelector('[data-tw-target="#profile"]');
                if (profileTab) {
                    profileTab.click();
                }
            }, 1000);
        } else {
            showToast(data.message || 'Error changing password', 'error');
        }
    })
    .catch(error => {
        console.error('Error changing password:', error);
        showToast('Error changing password', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function updateProfileDisplay(formData) {
    // Update the profile information display
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const address = formData.get('address') || 'Not provided';
    const bio = formData.get('bio') || 'No bio available';

    // Update profile tab display
    const profileTab = document.getElementById('profile');
    if (profileTab) {
        // Update personal information section
        const personalInfoSection = profileTab.querySelector('.box');
        if (personalInfoSection) {
            const infoElements = personalInfoSection.querySelectorAll('.text-slate-600');
            if (infoElements.length >= 5) {
                infoElements[0].textContent = name;
                infoElements[1].textContent = email;
                infoElements[2].textContent = phone;
                infoElements[3].textContent = address;
                infoElements[4].textContent = bio;
            }
        }
    }

    // Update header display
    const headerName = document.querySelector('.font-medium.text-lg');
    if (headerName) {
        headerName.textContent = name;
    }

    // Update contact details
    const contactDetails = document.querySelectorAll('.truncate.sm\\:whitespace-normal.flex.items-center');
    if (contactDetails.length >= 1) {
        // Update email
        contactDetails[0].innerHTML = contactDetails[0].innerHTML.replace(/[^<]*$/, ' ' + email + ' ');
        
        // Update phone if exists
        if (contactDetails.length >= 2) {
            contactDetails[1].innerHTML = contactDetails[1].innerHTML.replace(/[^<]*$/, ' ' + phone + ' ');
        }
        
        // Update address if exists
        if (contactDetails.length >= 3) {
            const addressParts = [];
            if (lot) addressParts.push('Lot ' + lot);
            if (block) addressParts.push('Block ' + block);
            if (street) addressParts.push(street);
            
            const address = addressParts.join(' ').trim();
            if (address) {
                contactDetails[2].innerHTML = contactDetails[2].innerHTML.replace(/[^<]*$/, ' ' + address + ' ');
            }
        }
    }
}

function handleEditProfileUpdate() {
    const form = document.getElementById('editProfileForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;

    fetch('/profile-management/update', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Profile updated successfully!', 'success');
            
            // Update the profile display with new data
            updateProfileDisplayFromForm(formData);
            
            // Hide edit form and show updated display
            const editProfileForm = document.getElementById('editProfileForm');
            const profileDisplay = document.getElementById('profileDisplay');
            editProfileForm.style.display = 'none';
            profileDisplay.style.display = 'block';
            
            // Reset edit button
            const editProfileBtn = document.getElementById('editProfileBtn');
            editProfileBtn.textContent = 'Edit Profile';
            editProfileBtn.classList.remove('btn-warning');
            editProfileBtn.classList.add('btn-outline-secondary');
            editProfileBtn.disabled = false;
            
            // Update header display
            updateHeaderDisplay(formData);
            
            // Update contact details in the main profile section
            updateContactDetailsDisplay(formData);
            
            // Update statistics display
            updateStatisticsDisplay(formData);
            
        } else {
            // Show detailed validation errors if available
            let errorMessage = data.message || 'Error updating profile';
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                errorMessage = errorMessages.join(', ');
            }
            console.error('Profile update error:', data);
            showToast(errorMessage, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showToast('Error updating profile. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function resetEditProfileForm() {
    const form = document.getElementById('editProfileForm');
    if (form) {
        // Reset form to original values from the display
        const profileDisplay = document.getElementById('profileDisplay');
        
        // Get current values from profile display
        const name = profileDisplay.querySelector('[data-field="name"]')?.textContent || '';
        const email = profileDisplay.querySelector('[data-field="email"]')?.textContent || '';
        const contactNumber = profileDisplay.querySelector('[data-field="contact_number"]')?.textContent || '';
        const gender = profileDisplay.querySelector('[data-field="gender"]')?.textContent || '';
        const street = profileDisplay.querySelector('[data-field="street"]')?.textContent || '';
        const lot = profileDisplay.querySelector('[data-field="lot"]')?.textContent || '';
        const block = profileDisplay.querySelector('[data-field="block"]')?.textContent || '';
        const dateOfBirth = profileDisplay.querySelector('[data-field="date_of_birth"]')?.textContent || '';
        const civilStatus = profileDisplay.querySelector('[data-field="civil_status"]')?.textContent || '';
        const monthsStay = profileDisplay.querySelector('[data-field="number_of_months_stay"]')?.textContent || '';
        const telephoneNumber = profileDisplay.querySelector('[data-field="telephone_number"]')?.textContent || '';
        const fbAccount = profileDisplay.querySelector('[data-field="fb_account"]')?.textContent || '';
        const messengerAccount = profileDisplay.querySelector('[data-field="messenger_account"]')?.textContent || '';
        const preparedContact = profileDisplay.querySelector('[data-field="prepared_contact"]')?.textContent || '';
        const caretakerName = profileDisplay.querySelector('[data-field="caretaker_name"]')?.textContent || '';
        const caretakerAddress = profileDisplay.querySelector('[data-field="caretaker_address"]')?.textContent || '';
        const caretakerContact = profileDisplay.querySelector('[data-field="caretaker_contact_number"]')?.textContent || '';
        const caretakerEmail = profileDisplay.querySelector('[data-field="caretaker_email"]')?.textContent || '';
        const emergencyContact = profileDisplay.querySelector('[data-field="incase_of_emergency"]')?.textContent || '';
        
        // Set form values
        form.querySelector('[name="name"]').value = name;
        form.querySelector('[name="email"]').value = email;
        form.querySelector('[name="contact_number"]').value = contactNumber;
        form.querySelector('[name="gender"]').value = gender.toLowerCase();
        form.querySelector('[name="street"]').value = street;
        form.querySelector('[name="lot"]').value = lot;
        form.querySelector('[name="block"]').value = block;
        form.querySelector('[name="date_of_birth"]').value = dateOfBirth ? formatDateForInput(dateOfBirth) : '';
        form.querySelector('[name="civil_status"]').value = civilStatus.toLowerCase();
        form.querySelector('[name="number_of_months_stay"]').value = monthsStay;
        form.querySelector('[name="telephone_number"]').value = telephoneNumber;
        form.querySelector('[name="fb_account"]').value = fbAccount;
        form.querySelector('[name="messenger_account"]').value = messengerAccount;
        form.querySelector('[name="prepared_contact"]').value = preparedContact;
        form.querySelector('[name="caretaker_name"]').value = caretakerName;
        form.querySelector('[name="caretaker_address"]').value = caretakerAddress;
        form.querySelector('[name="caretaker_contact_number"]').value = caretakerContact;
        form.querySelector('[name="caretaker_email"]').value = caretakerEmail;
        form.querySelector('[name="incase_of_emergency"]').value = emergencyContact;
    }
}

// Helper function to format date for input field
function formatDateForInput(dateString) {
    if (!dateString || dateString === 'Not provided') return '';
    
    // Try to parse the date string (format: "Jan 01, 2025")
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Format as YYYY-MM-DD for input field
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Helper function to format date for display
function formatDisplayDate(dateString) {
    if (!dateString || dateString === 'Not provided') return 'Not provided';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not provided';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day.toString().padStart(2, '0')}, ${year}`;
}

function updateProfileDisplayFromForm(formData) {
    const profileDisplay = document.getElementById('profileDisplay');
    if (!profileDisplay) return;
    
    // Update all the display fields with new values
    const name = formData.get('name');
    const email = formData.get('email');
    const contactNumber = formData.get('contact_number') || 'Not provided';
    const gender = formData.get('gender') || 'Not provided';
    const street = formData.get('street') || 'Not provided';
    const lot = formData.get('lot') || 'Not provided';
    const block = formData.get('block') || 'Not provided';
    const dateOfBirth = formData.get('date_of_birth') || 'Not provided';
    const civilStatus = formData.get('civil_status') || 'Not provided';
    const monthsStay = formData.get('number_of_months_stay') || 'Not provided';
    const telephoneNumber = formData.get('telephone_number') || 'Not provided';
    const fbAccount = formData.get('fb_account') || 'Not provided';
    const messengerAccount = formData.get('messenger_account') || 'Not provided';
    const preparedContact = formData.get('prepared_contact') || 'Not provided';
    const caretakerName = formData.get('caretaker_name') || 'Not provided';
    const caretakerAddress = formData.get('caretaker_address') || 'Not provided';
    const caretakerContact = formData.get('caretaker_contact_number') || 'Not provided';
    const caretakerEmail = formData.get('caretaker_email') || 'Not provided';
    const emergencyContact = formData.get('incase_of_emergency') || 'Not provided';
    
    // Update all fields in single column layout
    const allFields = profileDisplay.querySelectorAll('[data-field]');
    
    allFields.forEach(field => {
        const fieldName = field.getAttribute('data-field');
        let value = '';
        
        switch(fieldName) {
            case 'name':
                value = name;
                break;
            case 'email':
                value = email;
                break;
            case 'contact_number':
                value = contactNumber;
                break;
            case 'gender':
                value = gender;
                break;
            case 'street':
                value = street;
                break;
            case 'lot':
                value = lot;
                break;
            case 'block':
                value = block;
                break;
            case 'date_of_birth':
                value = dateOfBirth !== 'Not provided' ? formatDisplayDate(dateOfBirth) : 'Not provided';
                break;
            case 'civil_status':
                value = civilStatus !== 'Not provided' ? civilStatus.charAt(0).toUpperCase() + civilStatus.slice(1) : 'Not provided';
                break;
            case 'number_of_months_stay':
                value = monthsStay !== 'Not provided' ? monthsStay : 'Not provided';
                break;
            case 'telephone_number':
                value = telephoneNumber;
                break;
            case 'fb_account':
                value = fbAccount;
                break;
            case 'messenger_account':
                value = messengerAccount;
                break;
            case 'prepared_contact':
                value = preparedContact;
                break;
            case 'caretaker_name':
                value = caretakerName;
                break;
            case 'caretaker_address':
                value = caretakerAddress;
                break;
            case 'caretaker_contact_number':
                value = caretakerContact;
                break;
            case 'caretaker_email':
                value = caretakerEmail;
                break;
            case 'incase_of_emergency':
                value = emergencyContact;
                break;
        }
        
        if (value && field) {
            field.textContent = value;
        }
    });
}

function updateHeaderDisplay(formData) {
    const name = formData.get('name');
    
    // Update header name
    const headerName = document.querySelector('.font-medium.text-lg');
    if (headerName) {
        headerName.textContent = name;
    }
}

function updateContactDetailsDisplay(formData) {
    const email = formData.get('email');
    const contactNumber = formData.get('contact_number') || 'Not provided';
    const street = formData.get('street') || 'Not provided';
    const lot = formData.get('lot') || 'Not provided';
    const block = formData.get('block') || 'Not provided';
    
    // Update contact details in the main profile section
    const contactDetails = document.querySelectorAll('.truncate.sm\\:whitespace-normal.flex.items-center');
    if (contactDetails.length >= 1) {
        // Update email
        contactDetails[0].innerHTML = contactDetails[0].innerHTML.replace(/[^<]*$/, ' ' + email + ' ');
        
        // Update phone if exists
        if (contactDetails.length >= 2) {
            contactDetails[1].innerHTML = contactDetails[1].innerHTML.replace(/[^<]*$/, ' ' + contactNumber + ' ');
        }
        
        // Update address if exists
        if (contactDetails.length >= 3) {
            const addressParts = [];
            if (lot) addressParts.push('Lot ' + lot);
            if (block) addressParts.push('Block ' + block);
            if (street) addressParts.push(street);
            
            const address = addressParts.join(' ').trim();
            if (address) {
                contactDetails[2].innerHTML = contactDetails[2].innerHTML.replace(/[^<]*$/, ' ' + address + ' ');
            }
        }
    }
}

function updateStatisticsDisplay(formData) {
    const gender = formData.get('gender') || 'N/A';
    
    // Update statistics in the main profile section
    const statsContainer = document.querySelector('.flex.items-center.justify-center.px-5');
    if (statsContainer) {
        const statItems = statsContainer.querySelectorAll('.text-center.rounded-md');
        if (statItems.length >= 3) {
            // Update "Gender" stat
            const genderStat = statItems[2].querySelector('.font-medium.text-primary.text-xl');
            if (genderStat) {
                genderStat.textContent = gender;
            }
        }
    }
}

// Toast notification function (following complaints pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'profile_toast_success' : 'profile_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('profile_error_message_slot');
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

// Additional utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
}

// Settings handlers
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('#settings')) {
        // Handle settings changes
        const setting = e.target.closest('.flex').querySelector('.font-medium').textContent;
        const isEnabled = e.target.checked;
        
        console.log(`Setting "${setting}" ${isEnabled ? 'enabled' : 'disabled'}`);
        
        // You can add API calls here to save settings
        showToast(`${setting} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
    }
});

// Two-factor authentication enable button
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Enable' && e.target.closest('#settings')) {
        showToast('Two-Factor Authentication setup would open here', 'success');
        e.target.textContent = 'Enabled';
        e.target.classList.remove('btn-outline-primary');
        e.target.classList.add('btn-success');
        e.target.disabled = true;
    }
});

// Tenant Management Functions
function initializeTenantManagement() {
    // Add tenant form submission
    const addTenantForm = document.getElementById('addTenantForm');
    if (addTenantForm) {
        addTenantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddTenant();
        });
    }

    // Reset tenant form
    const resetTenantBtn = document.getElementById('resetTenantForm');
    if (resetTenantBtn) {
        resetTenantBtn.addEventListener('click', function() {
            resetTenantForm();
        });
    }

    // Tenant search functionality
    const tenantSearch = document.getElementById('tenantSearch');
    if (tenantSearch) {
        tenantSearch.addEventListener('input', function() {
            filterTenants(this.value);
        });
    }

    // Initialize tenant action buttons
    initializeTenantActions();
    
    // Add keyboard shortcuts
    initializeTenantKeyboardShortcuts();
    
    // Initialize delete modal functionality (following complaints pattern)
    initializeDeleteModal();
}

function initializeTenantKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only apply shortcuts when in the add tenant tab
        const addTenantTab = document.getElementById('add-tenant');
        if (!addTenantTab || !addTenantTab.classList.contains('active')) {
            return;
        }
        
        // Escape key to cancel edit mode
        if (e.key === 'Escape') {
            const form = document.getElementById('addTenantForm');
            if (form && form.getAttribute('data-edit-mode') === 'true') {
                e.preventDefault();
                resetTenantForm();
            }
        }
        
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const form = document.getElementById('addTenantForm');
            if (form) {
                handleAddTenant();
            }
        }
        
        // Ctrl/Cmd + R to reset form
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            resetTenantForm();
        }
    });
    
    // Add keyboard shortcuts for delete modal
    document.addEventListener('keydown', function(e) {
        const deleteModal = document.getElementById('delete-tenant-modal');
        if (!deleteModal || (!deleteModal.classList.contains('show') && deleteModal.style.display !== 'block')) {
            return;
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            e.preventDefault();
            hideDeleteTenantModal();
        }
        
        // Enter to confirm if DELETE is typed correctly
        if (e.key === 'Enter') {
            const confirmBtn = document.getElementById('confirmDeleteTenantBtn');
            if (confirmBtn && !confirmBtn.disabled) {
                e.preventDefault();
                confirmBtn.click();
            }
        }
    });
}

function handleAddTenant() {
    const form = document.getElementById('addTenantForm');
    const formData = new FormData(form);
    
    // Check if we're in edit mode
    const isEditMode = form.getAttribute('data-edit-mode') === 'true';
    const tenantId = form.getAttribute('data-tenant-id');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = isEditMode ? 'Updating...' : 'Adding...';
    submitBtn.disabled = true;

    const url = isEditMode ? `/profile-management/tenants/${tenantId}` : '/profile-management/tenants';
    const method = isEditMode ? 'PUT' : 'POST';

    // If updating, add method override for Laravel
    if (isEditMode) {
        formData.append('_method', 'PUT');
    }

    fetch(url, {
        method: 'POST', // Always POST with method override for Laravel
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(isEditMode ? 'Tenant updated successfully!' : 'Tenant added successfully!', 'success');
            
            // Reset form
            resetTenantForm();
            
            if (isEditMode) {
                // Refresh the page to update the tenant list
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                // Add new tenant to list
                refreshTenantsList(data.tenant);
            }
        } else {
            // Show detailed validation errors if available
            let errorMessage = data.message || 'Error saving tenant';
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                errorMessage = errorMessages.join(', ');
            }
            console.error('Tenant save error:', data);
            showToast(errorMessage, 'error');
        }
    })
    .catch(error => {
        console.error('Error saving tenant:', error);
        showToast('Error saving tenant. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function resetTenantForm() {
    const form = document.getElementById('addTenantForm');
    if (form) {
        const wasInEditMode = form.getAttribute('data-edit-mode') === 'true';
        
        form.reset();
        
        // Reset form state
        form.removeAttribute('data-edit-mode');
        form.removeAttribute('data-tenant-id');
        
        // Reset form title and button
        const formTitle = form.closest('.box').querySelector('h2');
        if (formTitle) {
            formTitle.textContent = 'Add New Tenant';
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Add Tenant';
            submitBtn.removeAttribute('data-editing');
            submitBtn.classList.remove('btn-warning');
            submitBtn.classList.add('btn-primary');
        }

        // Reset button styling
        const resetBtn = document.getElementById('resetTenantForm');
        if (resetBtn) {
            resetBtn.textContent = 'Reset';
            resetBtn.classList.remove('btn-outline-danger');
            resetBtn.classList.add('btn-outline-secondary');
        }

        // Reset form visual indicators
        form.style.border = '';
        form.style.borderRadius = '';
        form.style.backgroundColor = '';
        
        // Show appropriate toast message
        if (wasInEditMode) {
            showToast('Edit cancelled. Form reset to add new tenant.', 'success');
        }
    }
}

function refreshTenantsList(newTenant) {
    const tenantsList = document.getElementById('tenantsList');
    if (!tenantsList) return;

    // Check if there's a "no tenants" message and remove it
    const noTenantsMessage = tenantsList.querySelector('.text-center.py-8');
    if (noTenantsMessage) {
        noTenantsMessage.remove();
    }

    // Create new tenant item HTML
    const tenantHTML = createTenantItemHTML(newTenant);
    
    // Add to the beginning of the list
    tenantsList.insertAdjacentHTML('afterbegin', tenantHTML);
    
    // Re-initialize action buttons for the new tenant
    initializeTenantActions();
}

function createTenantItemHTML(tenant) {
    const photoSrc = tenant.photo 
        ? `/storage/tenants/${tenant.photo}` 
        : '';
    
    const photoHTML = tenant.photo 
        ? `<img alt="${tenant.full_name}" class="rounded-full w-full h-full object-cover" src="${photoSrc}">`
        : `<div class="rounded-full w-full h-full bg-slate-200 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>`;

    const relationshipText = tenant.relationship ? tenant.relationship.charAt(0).toUpperCase() + tenant.relationship.slice(1) : 'No relationship set';
    
    const contactInfo = (tenant.contact_number || tenant.email) 
        ? `<div class="text-slate-500 text-xs mt-1">
               ${tenant.contact_number ? `<span>${tenant.contact_number}</span>` : ''}
               ${tenant.email ? `<span class="ml-2">${tenant.email}</span>` : ''}
           </div>`
        : '';

    return `
        <div class="tenant-item border-b border-slate-200/60 py-4 last:border-b-0" data-tenant-id="${tenant.id}">
            <div class="flex items-center">
                <div class="w-12 h-12 flex-none image-fit">
                    ${photoHTML}
                </div>
                <div class="ml-4 flex-1">
                    <div class="font-medium">${tenant.full_name}</div>
                    <div class="text-slate-500 text-xs mt-0.5">${relationshipText}</div>
                    ${contactInfo}
                </div>
                <div class="flex items-center">
                    <span class="px-2 py-1 rounded-full text-xs ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                    <div class="dropdown ml-3">
                        <button class="dropdown-toggle btn px-2 py-1 box" aria-expanded="false" data-tw-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        <div class="dropdown-menu w-40">
                            <ul class="dropdown-content">
                                <li>
                                    <a href="javascript:;" class="dropdown-item edit-tenant" data-tenant-id="${tenant.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:;" class="dropdown-item delete-tenant text-danger" data-tenant-id="${tenant.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeTenantActions() {
    // Edit tenant buttons
    const editBtns = document.querySelectorAll('.edit-tenant');
    editBtns.forEach(btn => {
        btn.removeEventListener('click', handleEditTenant); // Remove existing listeners
        btn.addEventListener('click', handleEditTenant);
    });

    // Delete tenant buttons
    const deleteBtns = document.querySelectorAll('.delete-tenant');
    deleteBtns.forEach(btn => {
        btn.removeEventListener('click', handleDeleteTenant); // Remove existing listeners
        btn.addEventListener('click', handleDeleteTenant);
    });
}

function handleEditTenant(e) {
    e.preventDefault();
    const tenantId = this.getAttribute('data-tenant-id');
    
    // Show loading state
    const button = this;
    const originalText = button.innerHTML;
    button.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...';
    button.disabled = true;
    
    // Fetch tenant data
    fetch(`/profile-management/tenants/${tenantId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateTenantForm(data.tenant);
            
            // Scroll to form
            const form = document.getElementById('addTenantForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            showToast('Tenant loaded for editing. Make your changes and click "Update Tenant".', 'success');
        } else {
            showToast('Error loading tenant data: ' + (data.message || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error fetching tenant:', error);
        showToast('Error loading tenant data. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function populateTenantForm(tenant) {
    const form = document.getElementById('addTenantForm');
    if (!form) return;

    // Populate form fields
    document.getElementById('tenantFullName').value = tenant.full_name || '';
    document.getElementById('tenantRelationship').value = tenant.relationship || '';
    document.getElementById('tenantContact').value = tenant.contact_number || '';
    document.getElementById('tenantEmail').value = tenant.email || '';

    // Change form title and button
    const formTitle = form.closest('.box').querySelector('h2');
    if (formTitle) {
        formTitle.textContent = `Edit Tenant: ${tenant.full_name}`;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Update Tenant';
        submitBtn.setAttribute('data-editing', tenant.id);
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-warning');
    }

    // Update reset button to "Cancel Edit"
    const resetBtn = document.getElementById('resetTenantForm');
    if (resetBtn) {
        resetBtn.textContent = 'Cancel Edit';
        resetBtn.classList.remove('btn-outline-secondary');
        resetBtn.classList.add('btn-outline-danger');
    }

    // Change form action
    form.setAttribute('data-edit-mode', 'true');
    form.setAttribute('data-tenant-id', tenant.id);
    
    // Add visual indicator that form is in edit mode
    form.style.border = '2px solid #f59e0b';
    form.style.borderRadius = '8px';
    form.style.backgroundColor = '#fffbeb';
}

function handleDeleteTenant(e) {
    e.preventDefault();
    const tenantId = this.getAttribute('data-tenant-id');
    const tenantItem = document.querySelector(`[data-tenant-id="${tenantId}"]`);
    const tenantName = tenantItem ? tenantItem.querySelector('.font-medium').textContent : 'this tenant';
    
    // Set tenant info in the modal (following complaints pattern)
    document.getElementById('deleteTenantName').textContent = tenantName;
    document.getElementById('deleteTenantId').value = tenantId;
}

function deleteTenant(tenantId, tenantName = 'Tenant') {
    // Show deleting status
    showToast(`Deleting ${tenantName}...`, 'info');
    
    // Add visual feedback to the tenant item
    const tenantItem = document.querySelector(`[data-tenant-id="${tenantId}"]`);
    if (tenantItem) {
        tenantItem.style.opacity = '0.5';
        tenantItem.style.pointerEvents = 'none';
    }
    
    fetch(`/profile-management/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(`${tenantName} deleted successfully`, 'success');
            
            // Animate removal
            if (tenantItem) {
                tenantItem.style.transition = 'all 0.3s ease-out';
                tenantItem.style.transform = 'translateX(-100%)';
                tenantItem.style.opacity = '0';
                
                setTimeout(() => {
                    tenantItem.remove();
                    
                    // Check if list is now empty
                    const tenantsList = document.getElementById('tenantsList');
                    if (tenantsList && tenantsList.children.length === 0) {
                        tenantsList.innerHTML = `
                            <div class="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 mx-auto text-slate-300 mb-4"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                                <p class="text-slate-500">No tenants added yet</p>
                                <p class="text-slate-400 text-sm">Use the form on the left to add your first tenant</p>
                            </div>
                        `;
                    }
                }, 300);
            }
        } else {
            // Restore tenant item if deletion failed
            if (tenantItem) {
                tenantItem.style.opacity = '1';
                tenantItem.style.pointerEvents = 'auto';
            }
            showToast(data.message || `Error deleting ${tenantName}`, 'error');
        }
    })
    .catch(error => {
        // Restore tenant item if deletion failed
        if (tenantItem) {
            tenantItem.style.opacity = '1';
            tenantItem.style.pointerEvents = 'auto';
        }
        console.error('Error deleting tenant:', error);
        showToast(`Error deleting ${tenantName}. Please try again.`, 'error');
    });
}

function filterTenants(searchTerm) {
    const tenantItems = document.querySelectorAll('.tenant-item');
    const searchLower = searchTerm.toLowerCase();

    tenantItems.forEach(item => {
        const fullName = item.querySelector('.font-medium').textContent.toLowerCase();
        const relationship = item.querySelector('.text-slate-500').textContent.toLowerCase();
        
        const matches = fullName.includes(searchLower) || relationship.includes(searchLower);
        item.style.display = matches ? 'block' : 'none';
    });
}

// Test function for debugging
function testDeleteModal() {
    console.log('Testing delete modal...');
    showDeleteTenantModal('test-id', 'Test Tenant');
}

// Make test function globally available
window.testDeleteModal = testDeleteModal;

// Test function to force enable and click delete button
function testDeleteButton() {
    console.log('Testing delete button...');
    
    // First show modal
    testDeleteModal();
    
    setTimeout(() => {
        // Force enable the button
        const deleteBtn = document.getElementById('confirmDeleteTenantBtn');
        const deleteInput = document.getElementById('deleteConfirmInput');
        
        if (deleteInput) {
            deleteInput.value = 'DELETE';
            // Trigger input event
            deleteInput.dispatchEvent(new Event('input'));
            console.log('Set input to DELETE');
        }
        
        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.classList.remove('opacity-50');
            console.log('Enabled delete button');
            
            // Try clicking it
            setTimeout(() => {
                console.log('Clicking delete button...');
                deleteBtn.click();
            }, 500);
        }
    }, 1000);
}

window.testDeleteButton = testDeleteButton;

// Delete Modal Functions (following complaints pattern)
function initializeDeleteModal() {
    // Delete tenant functionality (simplified like complaints)
    const confirmDeleteBtn = document.getElementById('confirmDeleteTenant');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const tenantId = document.getElementById('deleteTenantId').value;
            const tenantName = document.getElementById('deleteTenantName').textContent;
            
            if (tenantId) {
                deleteTenant(tenantId, tenantName);
            }
        });
    }
}

// Simplified delete tenant function (following complaints pattern)
function deleteTenant(tenantId, tenantName) {
    fetch(`/profile-management/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast('Tenant deleted successfully', 'success');
            // Close modal and reload page to refresh the list
            document.getElementById('delete-tenant-modal').classList.remove('show');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error deleting tenant:', error);
        showToast('Error deleting tenant: ' + error.message, 'error');
    });
}

