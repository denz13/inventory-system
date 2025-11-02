document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize star rating functionality
    initializeStarRating();
    
    // Initialize modal functionality
    initializeModals();
    
    // Initialize form submissions
    initializeForms();
});

function initializeFilters() {
    // Status filter
    document.querySelectorAll('[data-filter]').forEach(filterItem => {
        filterItem.addEventListener('click', function() {
            const status = this.getAttribute('data-filter');
            filterTableRowsByStatus(status);
        });
    });
    
    // Rating filter
    document.querySelectorAll('[data-rating-filter]').forEach(filterItem => {
        filterItem.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating-filter');
            filterTableRowsByRating(rating);
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTableRowsBySearch(searchTerm);
        });
    }
}

function initializeStarRating() {
    // Create feedback star rating
    document.addEventListener('click', function(e) {
        if (e.target.closest('#rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            setStarRating('rating-stars', 'rating-input', rating);
        }
        
        // Edit feedback star rating
        if (e.target.closest('#edit-rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            setStarRating('edit-rating-stars', 'edit-rating-input', rating);
        }
    });
    
    // Add hover effects for better UX
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('#rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            previewStarRating('rating-stars', rating);
        }
        
        if (e.target.closest('#edit-rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            previewStarRating('edit-rating-stars', rating);
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        // Check if e.target is an Element before calling closest
        if (e.target && e.target.closest) {
            if (e.target.closest('#rating-stars')) {
                const currentRating = document.getElementById('rating-input').value;
                setStarRating('rating-stars', 'rating-input', parseInt(currentRating));
            }
            
            if (e.target.closest('#edit-rating-stars')) {
                const currentRating = document.getElementById('edit-rating-input').value;
                setStarRating('edit-rating-stars', 'edit-rating-input', parseInt(currentRating));
            }
        }
    }, true);
}

function setStarRating(containerId, inputId, rating) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    
    if (container && input) {
        // Update hidden input
        input.value = rating;
        
        // Clear rating error when user selects a star
        if (inputId === 'rating-input') {
            const ratingError = document.getElementById('ratingError');
            if (ratingError) ratingError.classList.add('hidden');
        } else if (inputId === 'edit-rating-input') {
            const editRatingError = document.getElementById('editRatingError');
            if (editRatingError) editRatingError.classList.add('hidden');
        }
        
        // Update star display
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                // Determine color based on rating
                let fillColor, strokeColor;
                if (rating >= 4) {
                    // 4-5 stars: Green (excellent)
                    fillColor = '#10b981'; // green-500
                    strokeColor = '#10b981';
                } else if (rating >= 3) {
                    // 3 stars: Yellow (good)
                    fillColor = '#f59e0b'; // yellow-500
                    strokeColor = '#f59e0b';
                } else {
                    // 1-2 stars: Orange/Red (poor)
                    fillColor = '#f97316'; // orange-500
                    strokeColor = '#f97316';
                }
                
                star.setAttribute('fill', fillColor);
                star.setAttribute('stroke', strokeColor);
                star.style.opacity = '1'; // Ensure full opacity for selected
            } else {
                // Unselected stars: white with black border
                star.setAttribute('fill', 'white');
                star.setAttribute('stroke', 'black');
                star.style.opacity = '1'; // Ensure full opacity for unselected
            }
        });
    }
}

function previewStarRating(containerId, rating) {
    const container = document.getElementById(containerId);
    
    if (container) {
        // Update star display for preview
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                // Determine color based on rating (lighter/transparent for preview)
                let fillColor, strokeColor;
                if (rating >= 4) {
                    // 4-5 stars: Light green (excellent)
                    fillColor = '#10b981'; // green-500
                    strokeColor = '#10b981';
                } else if (rating >= 3) {
                    // 3 stars: Light yellow (good)
                    fillColor = '#f59e0b'; // yellow-500
                    strokeColor = '#f59e0b';
                } else {
                    // 1-2 stars: Light orange/red (poor)
                    fillColor = '#f97316'; // orange-500
                    strokeColor = '#f97316';
                }
                
                star.setAttribute('fill', fillColor);
                star.setAttribute('stroke', strokeColor);
                star.style.opacity = '0.7'; // Make it slightly transparent for preview
            } else {
                // Unselected stars: white with black border
                star.setAttribute('fill', 'white');
                star.setAttribute('stroke', 'black');
                star.style.opacity = '1';
            }
        });
    }
}

function initializeModals() {
    // View feedback modal
    document.querySelectorAll('[data-tw-target="#view-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackDetails(feedbackId);
        });
    });
    
    // Edit feedback modal
    document.querySelectorAll('[data-tw-target="#edit-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackForEdit(feedbackId);
        });
    });
    
    // Delete confirmation modal
    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            document.getElementById('deleteFeedbackId').value = feedbackId;
        });
    });
    
    // Confirm delete button
    document.getElementById('confirmDeleteFeedback').addEventListener('click', function() {
        const feedbackId = document.getElementById('deleteFeedbackId').value;
        deleteFeedback(feedbackId);
    });
}

function initializeForms() {
    // Create feedback form
    document.getElementById('createFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCreateFeedback();
    });
    
    // Edit feedback form
    document.getElementById('editFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateFeedback();
    });
}

function filterTableRowsByStatus(status) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function filterTableRowsByRating(rating) {
    const rows = document.querySelectorAll('tbody tr[data-rating]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowRating = row.getAttribute('data-rating');
        
        if (rating === 'all' || rowRating === rating) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function filterTableRowsBySearch(searchTerm) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const userName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        const userEmail = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
        
        if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function updateFilteredCount(count) {
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = count;
    }
}

function toggleNoResultsMessage(visibleCount) {
    const noResultsRow = document.getElementById('no-results-row');
    const noFeedbackRow = document.getElementById('no-feedback-row');
    const dataRows = document.querySelectorAll('tbody tr[data-status]');
    
    // If there are data rows (feedback exists)
    if (dataRows.length > 0) {
        // Hide the "No feedback found" message
        if (noFeedbackRow) {
            noFeedbackRow.style.display = 'none';
        }
        
        // Show/hide "No results found" based on visible count
        if (noResultsRow) {
            if (visibleCount === 0) {
                noResultsRow.classList.remove('hidden');
                noResultsRow.style.display = '';
            } else {
                noResultsRow.classList.add('hidden');
                noResultsRow.style.display = 'none';
            }
        }
    } else {
        // No data rows exist, show "No feedback found"
        if (noFeedbackRow) {
            noFeedbackRow.style.display = '';
        }
        if (noResultsRow) {
            noResultsRow.classList.add('hidden');
            noResultsRow.style.display = 'none';
        }
    }
}

function loadFeedbackDetails(feedbackId) {
    const detailsContainer = document.getElementById('feedback-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading feedback details...</p>
        </div>
    `;
    
    // Fetch feedback details
    fetch(`/feedback/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayFeedbackDetails(data.feedback);
            } else {
                showError('Failed to load feedback details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error loading feedback details');
        });
}

function displayFeedbackDetails(feedback) {
    const detailsContainer = document.getElementById('feedback-details');
    
    const starsHtml = Array.from({length: 5}, (_, i) => {
        const filled = i < feedback.rating;
        let fillColor = '';
        let strokeColor = '';
        
        if (filled) {
            // Determine color based on rating
            if (feedback.rating >= 4) {
                fillColor = '#10b981'; // Green
                strokeColor = '#10b981';
            } else if (feedback.rating >= 3) {
                fillColor = '#f59e0b'; // Yellow
                strokeColor = '#f59e0b';
            } else {
                fillColor = '#f97316'; // Orange
                strokeColor = '#f97316';
            }
        } else {
            fillColor = 'white';
            strokeColor = 'black'; // Black border like create modal
        }
        
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
                 fill="${fillColor}" stroke="${strokeColor}" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
        `;
    }).join('');
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- Feedback Description -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Feedback Description</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24 max-h-64 overflow-y-auto overflow-x-hidden" style="word-wrap: break-word; white-space: pre-wrap; overflow-wrap: break-word;">
                    ${feedback.description || 'No description provided'}
                </div>
            </div>
            
            <!-- Rating -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700 text-center block">Rating</label>
                <div class="flex items-center justify-center mt-4 space-x-3">
                    ${starsHtml}
                </div>
                <div class="text-center mt-3">
                    <small class="text-slate-500">${feedback.rating}/5 Stars</small>
                </div>
            </div>
            
            <!-- Date Created -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Date Created</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${formatDate(feedback.created_at)}
                </div>
            </div>
        </div>
    `;
}

function loadFeedbackForEdit(feedbackId) {
    fetch(`/feedback/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateEditForm(data.feedback);
            } else {
                showToast('Failed to load feedback for editing', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error loading feedback for editing', 'error');
        });
}

function populateEditForm(feedback) {
    document.getElementById('editFeedbackId').value = feedback.id;
    document.getElementById('editDescription').value = feedback.description;
    // Status is now hidden, always set to active
    document.getElementById('editStatus').value = feedback.status || 'active';
    
    // Set star rating
    setStarRating('edit-rating-stars', 'edit-rating-input', feedback.rating);
    
    // Update form action
    const form = document.getElementById('editFeedbackForm');
    form.action = `/feedback/${feedback.id}`;
}

function handleCreateFeedback() {
    const form = document.getElementById('createFeedbackForm');
    const description = document.getElementById('createDescription').value.trim();
    const rating = document.getElementById('rating-input').value;
    
    // Clear previous errors
    clearCreateFormErrors();
    
    // Validate fields
    let errors = [];
    let hasError = false;
    
    if (!description) {
        errors.push('Feedback description is required');
        document.getElementById('descriptionError').classList.remove('hidden');
        document.getElementById('createDescription').classList.add('border-red-500');
        hasError = true;
    }
    
    if (!rating || rating == '0') {
        errors.push('Please select a rating (1-5 stars)');
        document.getElementById('ratingError').classList.remove('hidden');
        hasError = true;
    }
    
    // Show errors if validation fails
    if (hasError) {
        showFormErrors('createFormErrors', 'createErrorList', errors);
        return;
    }
    
    const formData = new FormData(form);
    
    fetch('/feedback', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showToast(data.message || 'Feedback created successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#create-feedback-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reset form
            form.reset();
            setStarRating('rating-stars', 'rating-input', 0);
            
            // Reload page to show new feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
                
                // If it's a banned words error, highlight the banned words
                if (data.banned_words && data.banned_words.length > 0) {
                    highlightBannedWords(data.banned_words);
                }
            }
            
            if (errors.length > 0) {
                showFormErrors('createFormErrors', 'createErrorList', errors);
            } else {
                showToast('Failed to create feedback', 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('createFormErrors', 'createErrorList', ['Error creating feedback. Please try again.']);
    });
}

function handleUpdateFeedback() {
    const form = document.getElementById('editFeedbackForm');
    const feedbackId = document.getElementById('editFeedbackId').value;
    const description = document.getElementById('editDescription').value.trim();
    const rating = document.getElementById('edit-rating-input').value;
    
    // Clear previous errors
    clearEditFormErrors();
    
    // Validate fields
    let errors = [];
    let hasError = false;
    
    if (!description) {
        errors.push('Feedback description is required');
        document.getElementById('editDescriptionError').classList.remove('hidden');
        document.getElementById('editDescription').classList.add('border-red-500');
        hasError = true;
    }
    
    if (!rating || rating == '0') {
        errors.push('Please select a rating (1-5 stars)');
        document.getElementById('editRatingError').classList.remove('hidden');
        hasError = true;
    }
    
    // Show errors if validation fails
    if (hasError) {
        showFormErrors('editFormErrors', 'editErrorList', errors);
        return;
    }
    
    const formData = new FormData(form);
    
    fetch(`/feedback/${feedbackId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showToast(data.message || 'Feedback updated successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#edit-feedback-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
                
                // If it's a banned words error, highlight the banned words
                if (data.banned_words && data.banned_words.length > 0) {
                    highlightBannedWords(data.banned_words);
                }
            }
            
            if (errors.length > 0) {
                showFormErrors('editFormErrors', 'editErrorList', errors);
            } else {
                showToast('Failed to update feedback', 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('editFormErrors', 'editErrorList', ['Error updating feedback. Please try again.']);
    });
}

function deleteFeedback(feedbackId) {
    fetch(`/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message || 'Feedback deleted successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated list
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to delete feedback', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting feedback. Please try again.', 'error');
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-slate-100 text-slate-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

function showError(message) {
    const detailsContainer = document.getElementById('feedback-details');
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-red-300">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p class="text-lg text-red-600">${message}</p>
            <button type="button" data-tw-dismiss="modal" class="mt-4 btn btn-outline-secondary">Close</button>
        </div>
    `;
}

function showToast(message, type = 'success') {
    const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: "toastify-content",
        backgroundColor: backgroundColor,
        stopOnFocus: true,
        onClick: function() {
            this.hideToast();
        }
    }).showToast();
}

// Form validation error functions
function showFormErrors(errorDivId, errorListId, errors) {
    const errorDiv = document.getElementById(errorDivId);
    const errorList = document.getElementById(errorListId);
    
    if (errorDiv && errorList) {
        errorList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });
        errorDiv.classList.remove('hidden');
        
        // Scroll to top of modal to show errors
        const modal = errorDiv.closest('.modal-body');
        if (modal) {
            modal.scrollTop = 0;
        }
    }
}

function clearCreateFormErrors() {
    const errorDiv = document.getElementById('createFormErrors');
    const descriptionError = document.getElementById('descriptionError');
    const ratingError = document.getElementById('ratingError');
    const descriptionInput = document.getElementById('createDescription');
    
    if (errorDiv) errorDiv.classList.add('hidden');
    if (descriptionError) descriptionError.classList.add('hidden');
    if (ratingError) ratingError.classList.add('hidden');
    if (descriptionInput) descriptionInput.classList.remove('border-red-500');
}

function clearEditFormErrors() {
    const errorDiv = document.getElementById('editFormErrors');
    const descriptionError = document.getElementById('editDescriptionError');
    const ratingError = document.getElementById('editRatingError');
    const descriptionInput = document.getElementById('editDescription');
    
    if (errorDiv) errorDiv.classList.add('hidden');
    if (descriptionError) descriptionError.classList.add('hidden');
    if (ratingError) ratingError.classList.add('hidden');
    if (descriptionInput) descriptionInput.classList.remove('border-red-500');
}

// Function to highlight banned words in the textarea
function highlightBannedWords(bannedWords) {
    const createDescription = document.getElementById('createDescription');
    const editDescription = document.getElementById('editDescription');
    
    // Highlight in create form
    if (createDescription) {
        highlightWordsInTextarea(createDescription, bannedWords);
    }
    
    // Highlight in edit form
    if (editDescription) {
        highlightWordsInTextarea(editDescription, bannedWords);
    }
}

function highlightWordsInTextarea(textarea, bannedWords) {
    const text = textarea.value;
    let highlightedText = text;
    
    // Create a temporary div to work with HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Highlight each banned word
    bannedWords.forEach(word => {
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span style="background-color: #fef2f2; color: #dc2626; font-weight: bold; padding: 2px 4px; border-radius: 3px;">${word}</span>`);
    });
    
    // Show highlighted text in a temporary overlay
    showBannedWordsOverlay(textarea, highlightedText, bannedWords);
}

function showBannedWordsOverlay(textarea, highlightedText, bannedWords) {
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('banned-words-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'banned-words-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #dc2626;
        border-radius: 8px;
        padding: 12px;
        z-index: 1000;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: auto;
        max-height: 200px;
    `;
    
    overlay.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong style="color: #dc2626;">⚠️ Inappropriate Content Detected</strong>
        </div>
        <div style="margin-bottom: 10px;">
            <strong>Banned words found:</strong> ${bannedWords.join(', ')}
        </div>
        <div style="margin-bottom: 10px;">
            <strong>Your text with highlighted banned words:</strong>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 8px; background: #f9fafb; border-radius: 4px;">
            ${highlightedText}
        </div>
        <div style="margin-top: 10px;">
            <button onclick="this.parentElement.parentElement.remove()" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    // Position the overlay relative to the textarea
    const textareaRect = textarea.getBoundingClientRect();
    const modalBody = textarea.closest('.modal-body');
    
    if (modalBody) {
        modalBody.style.position = 'relative';
        modalBody.appendChild(overlay);
    }
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (overlay && overlay.parentElement) {
            overlay.remove();
        }
    }, 10000);
}

// Clear errors when user starts typing or selecting
document.addEventListener('DOMContentLoaded', function() {
    // Clear description error on input
    const createDescription = document.getElementById('createDescription');
    if (createDescription) {
        createDescription.addEventListener('input', function() {
            document.getElementById('descriptionError').classList.add('hidden');
            this.classList.remove('border-red-500');
        });
    }
    
    const editDescription = document.getElementById('editDescription');
    if (editDescription) {
        editDescription.addEventListener('input', function() {
            document.getElementById('editDescriptionError').classList.add('hidden');
            this.classList.remove('border-red-500');
        });
    }
});
