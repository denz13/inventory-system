// Initialize Select2 for person in charge dropdown
$('#person_incharge').select2({
    placeholder: 'Select an employee...',
    allowClear: true,
    width: '100%',
    dropdownParent: $('#add-resource-modal')
});

// Register the plugin
FilePond.registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

// Get a reference to the file input element
const inputElement = document.querySelector('input[id="up_resource_image"]');

// Create a FilePond instance
const pond = FilePond.create(inputElement, {
    credits: false,
    allowMultiple: false,
    allowFileTypeValidation: true,
    acceptedFileTypes: ['image/png', 'image/jpeg'],
    labelIdle: 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
    maxFileSize: '2MB',
    storeAsFile: true,
    imagePreviewHeight: 170,
    stylePanelLayout: 'integrated',
    styleLoadIndicatorPosition: 'center bottom',
    styleProgressIndicatorPosition: 'center bottom',
    styleButtonRemoveItemPosition: 'center bottom',
    styleButtonProcessItemPosition: 'center bottom'
});

// Set server configuration
pond.setOptions({
    server: {
        process: "/resource/upload-temporary",
        revert: "/resource/delete-temporary",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }
});

function removeUploadedResource() {
    if (pond) {
        var files = pond.getFiles();
        if (files.length > 0) {
            pond.processFiles().then(() => {
                pond.removeFiles();
            });
        }
    }
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.querySelector('#add-resource-modal form');
    
    if (!form) return;

    // Add validation rules
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-danger');
            } else {
                field.classList.remove('border-danger');
            }
        });

        if (isValid) {
            submitForm(form);
        }
    });
}

// Handle form submission
async function submitForm(form) {
    try {
        const formData = new FormData(form);
        const url = form.getAttribute('action');

        // Get all signatory data (including empty ones)
        const signatoryData = [];
        form.querySelectorAll('.signatory-entry').forEach((entry, index) => {
            const employeeId = entry.querySelector(`select[name="signatories[${index}][employee_id]"]`).value;
            const suffixName = entry.querySelector(`input[name="signatories[${index}][suffix_name]"]`).value;
            const forValue = entry.querySelector(`input[name="signatories[${index}][for]"]`).value;
            const description = entry.querySelector(`input[name="signatories[${index}][description]"]`).value;
            
            // Only add if employee is selected
            if (employeeId) {
                signatoryData.push({
                    employee_id: employeeId,
                    suffix_name: suffixName,
                    for: forValue,
                    description: description
                });
            }
        });

        // Add signatories as JSON string
        formData.append('signatories', JSON.stringify(signatoryData));

        // Debug log
        console.log('Form Data:', Object.fromEntries(formData));
        console.log('Signatories:', signatoryData);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit form');
        }

        const data = await response.json();

        if (data.status === 'success') {
            // Hide the modal
            const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#add-resource-modal'));
            modal.hide();
            
            // Show success message
            __notif_show(1, 'SUCCESS', data.message);
            
            // Reset form and select2
            form.reset();
            $('#person_incharge').val(null).trigger('change');
            $('.signatory-employee').val(null).trigger('change');
            
            // Reload page after delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            throw new Error(data.message || 'Failed to add resource');
        }
    } catch (error) {
        console.error('Error:', error);
        __notif_show(-1, 'ERROR', error.message || 'An unexpected error occurred');
    }
}

// Initialize date picker
function initializeDatePicker() {
    const dateAcquired = document.getElementById('date_acquired');
    if (dateAcquired) {
        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        dateAcquired.setAttribute('max', today);
    }
}

// Initialize capacity input to only accept numbers
function initializeCapacityInput() {
    const capacityInput = document.getElementById('capacity');
    if (capacityInput) {
        capacityInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('resource-search');
    const clearSearchBtn = document.getElementById('clear-search');

    if (!searchInput) return;

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Search function
    function performSearch(searchTerm) {
        const currentUrl = new URL(window.location.href);
        
        if (searchTerm && searchTerm.trim()) {
            currentUrl.searchParams.set('search', searchTerm.trim());
        } else {
            currentUrl.searchParams.delete('search');
        }
        
        // Reset to first page when searching
        currentUrl.searchParams.set('page', '1');
        
        // Show loading state
        searchInput.classList.add('loading');
        if (searchInput.nextElementSibling) {
            searchInput.nextElementSibling.style.opacity = '0.5';
        }
        
        // Navigate to search results
        window.location.href = currentUrl.toString();
    }

    // Debounced search for typing
    const debouncedSearch = debounce(function(e) {
        performSearch(e.target.value);
    }, 500);

    // Add event listeners
    searchInput.addEventListener('input', debouncedSearch);
    
    // Immediate search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });

    // Clear search functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
        });
    }

    // Add loading class styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0.5;
            pointer-events: none;
        }
        #resource-search:focus {
            box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
        }
    `;
    document.head.appendChild(style);
}

// Initialize edit functionality for resource
function initializeEditFunctionality() {
    // Initialize Select2 for edit form
    $('#edit_person_incharge').select2({
        placeholder: 'Select an employee...',
        allowClear: true,
        width: '100%',
        dropdownParent: $('#edit-resource-modal')
    });

    // Handle edit button click
    $(document).on('click', '[data-tw-target="#edit-resource-modal"]', async function(e) {
        e.preventDefault();
        const resourceId = $(this).data('resource-id');
        
        try {
            // Show loading state
            $(this).addClass('loading');
            
            // Fetch resource data
            const response = await fetch(`/resource-v2/${resourceId}/edit`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const resource = data.resource;
                
                // Set form action
                $('#edit-resource-form').attr('action', `/resource-v2/${resourceId}/update`);
                
                // Populate form fields
                $('#edit_resource_id').val(resource.id);
                $('#edit_resource_category').val(resource.resource_category_id);
                $('#edit_resource_name').val(resource.resource_name);
                $('#edit_model').val(resource.resource_model);
                $('#edit_serial_plate').val(resource.resource_serial_or_plate_number);
                $('#edit_date_acquired').val(resource.date_acquired);
                $('#edit_resource_location').val(resource.resource_location_id);
                $('#edit_capacity').val(resource.capacity);
                $('#edit_person_incharge').val(resource.person_incharge).trigger('change');
                
                // Handle image
                if (resource.resource_image) {
                    $('#edit_current_image').attr('src', '/' + resource.resource_image);
                    $('#edit_current_image_container').show();
                } else {
                    $('#edit_current_image_container').hide();
                }
                
                // Show modal
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#edit-resource-modal'));
                modal.show();
            } else {
                __notif_show(-1, 'ERROR', 'Failed to fetch resource data');
            }
        } catch (error) {
            console.error('Error:', error);
            __notif_show(-1, 'ERROR', 'An unexpected error occurred');
        } finally {
            // Remove loading state
            $(this).removeClass('loading');
        }
    });

    // Handle form submission
    $('#edit-resource-form').on('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<i data-loading-icon="oval" class="w-4 h-4 mr-2"></i>Updating...');
        
        try {
            const formData = new FormData(this);
            
            // If we have a file in the edit dropzone, append it
            const editDropzone = Dropzone.forElement("#edit-image-upload");
            if (editDropzone && editDropzone.files.length > 0) {
                formData.append('file', editDropzone.files[0]);
            }
            
            // Make sure the PUT method is included
            formData.append('_method', 'PUT');
            
            const response = await fetch($(this).attr('action'), {
                method: 'POST', // We still use POST but Laravel will interpret it as PUT
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Hide modal
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#edit-resource-modal'));
                modal.hide();
                
                // Show success message
                __notif_show(1, 'SUCCESS', data.message);
                
                // Reload page after delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                __notif_show(-1, 'ERROR', data.message || 'Failed to update resource');
            }
        } catch (error) {
            console.error('Error:', error);
            __notif_show(-1, 'ERROR', 'An unexpected error occurred');
        } finally {
            // Reset button state
            submitBtn.prop('disabled', false).html('Update');
        }
    });

    // Initialize date picker for edit form
    const editDateAcquired = document.getElementById('edit_date_acquired');
    if (editDateAcquired) {
        const today = new Date().toISOString().split('T')[0];
        editDateAcquired.setAttribute('max', today);
    }

    // Initialize capacity input for edit form
    const editCapacityInput = document.getElementById('edit_capacity');
    if (editCapacityInput) {
        editCapacityInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

// Initialize delete functionality for resource
function initializeDeleteFunctionality() {
    let resourceIdToDelete = null;

    // Store the resource ID when delete button is clicked
    $(document).on('click', '[data-tw-target="#delete-confirmation-modal"]', function() {
        resourceIdToDelete = $(this).data('resource-id');
    });

    // Handle delete confirmation
    $('#confirm-delete-btn').on('click', function() {
        if (!resourceIdToDelete) return;

        // Show loading state
        const deleteBtn = $(this);
        deleteBtn.prop('disabled', true).html('<i data-loading-icon="oval" class="w-4 h-4 mr-2"></i>Deleting...');

        $.ajax({
            url: `/resource-v2/${resourceIdToDelete}/delete`,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.status === 'success') {
                    // Hide delete modal
                    const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete-confirmation-modal'));
                    modal.hide();
                    
                    // Show success message
                    __notif_show(1, 'SUCCESS', response.message);
                    
                    // Reload page after a short delay
                    setTimeout(function() {
                        window.location.href = getUrlWithCurrentParams();
                    }, 1500);
                } else {
                    __notif_show(-1, 'ERROR', response.message || 'Failed to delete resource');
                }
            },
            error: function(xhr) {
                __notif_show(-1, 'ERROR', xhr.responseJSON?.message || 'Failed to delete resource. Please try again.');
            },
            complete: function() {
                // Reset button state
                deleteBtn.prop('disabled', false).html('Delete');
            }
        });
    });

    // Reset resourceIdToDelete when modal is hidden
    $('#delete-confirmation-modal').on('hidden.bs.modal', function() {
        resourceIdToDelete = null;
    });
}

// Initialize signatories functionality
function initializeSignatories() {
    // Initialize Select2 for all signatory employee dropdowns
    $('.signatory-employee').each(function() {
        $(this).select2({
            placeholder: 'Select an employee...',
            allowClear: true,
            width: '100%',
            dropdownParent: $('#add-resource-modal')
        });
    });

    // Reset form when modal is hidden
    $('#add-resource-modal').on('hidden.bs.modal', function() {
        $('#add-resource-form')[0].reset();
        $('.signatory-employee').val(null).trigger('change');
    });
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#add-resource-modal form');
    const saveButton = document.getElementById('save_resource');
    const perPageSelect = document.getElementById('per-page-select');

    if (!form || !saveButton) return;

    // Initialize date picker
    initializeDatePicker();

    // Initialize capacity input
    initializeCapacityInput();

    // Initialize search functionality
    initializeSearch();

    // Initialize edit functionality
    initializeEditFunctionality();

    // Initialize delete functionality
    initializeDeleteFunctionality();

    // Initialize signatories functionality
    initializeSignatories();

    // Handle per page selection
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', this.value);
            currentUrl.searchParams.set('page', '1'); // Reset to first page when changing items per page
            window.location.href = currentUrl.toString();
        });
    }
});

// Function to maintain URL parameters
function getUrlWithCurrentParams() {
    const currentUrl = new URL(window.location.href);
    return currentUrl.toString();
}

$(document).ready(function() {
    // Set up CSRF token for all AJAX requests
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Initialize select2 for person in charge dropdown
    $('#person_incharge').select2({
        placeholder: 'Select an employee...',
        allowClear: true,
        width: '100%'
    });

    let signatoryCount = 0;

    // Function to create signatory fields
    function addSignatoryFields() {
        const html = `
            <div class="signatory-entry border rounded p-3 mb-3">
                <div class="grid grid-cols-12 gap-2">
                    <div class="col-span-12 sm:col-span-3">
                        <label class="form-label">Employee</label>
                        <select name="signatories[${signatoryCount}][employee_id]" class="form-select signatory-employee" required>
                            <option value="">Select Employee</option>
                        </select>
                    </div>
                    <div class="col-span-12 sm:col-span-3">
                        <label class="form-label">Suffix Name</label>
                        <input type="text" name="signatories[${signatoryCount}][suffix_name]" class="form-control" placeholder="Enter suffix">
                    </div>
                    <div class="col-span-12 sm:col-span-3">
                        <label class="form-label">For</label>
                        <input type="text" name="signatories[${signatoryCount}][for]" class="form-control" required placeholder="Enter for">
                    </div>
                    <div class="col-span-12 sm:col-span-2">
                        <label class="form-label">Description</label>
                        <input type="text" name="signatories[${signatoryCount}][description]" class="form-control" required placeholder="Enter description">
                    </div>
                    <div class="col-span-12 sm:col-span-1">
                        <label class="form-label">&nbsp;</label>
                        <button type="button" class="btn btn-danger w-full delete-signatory">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('#signatories-container').append(html);
        
        // Initialize Select2 for the new employee dropdown
        const newSelect = $(`select[name="signatories[${signatoryCount}][employee_id]"]`);
        newSelect.select2({
            dropdownParent: $('#add-resource-modal'),
            placeholder: 'Select Employee',
            allowClear: true,
            width: '100%',
            ajax: {
                url: '/resource-v2/get-employees',
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        search: params.term || '',
                        page: params.page || 1
                    };
                },
                processResults: function(data) {
                    return {
                        results: data.map(employee => ({
                            id: employee.agencyid,
                            text: `${employee.firstname} ${employee.lastname}`
                        }))
                    };
                },
                cache: true
            }
        });

        // Initialize new icons
        lucide.createIcons();
        
        signatoryCount++;
    }

    // Add click handler for the Add Signatory button
    $('#addSignatoryBtn').on('click', function() {
        addSignatoryFields();
    });

    // Delete signatory button click handler (using event delegation)
    $(document).on('click', '.delete-signatory', function() {
        $(this).closest('.signatory-entry').remove();
    });

    // Reset signatories when modal is hidden
    $('#add-resource-modal').on('hidden.bs.modal', function() {
        $('#signatories-container').empty();
        signatoryCount = 0;
    });

    // ... rest of your existing code ...
});
