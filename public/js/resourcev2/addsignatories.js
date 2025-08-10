$(document).ready(function() {
    // Set up CSRF token for all AJAX requests
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Initialize select2 for resource dropdown
    const $resourceSelect = $('#add_resource_id');
    let selectedResourceId = null;

    $resourceSelect.select2({
        dropdownParent: $('#add-signatory-modal'),
        placeholder: 'Select Resource',
        allowClear: true,
        ajax: {
            url: '/resource-v2/get-resources',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    search: params.term || '',
                    page: params.page || 1
                };
            },
            processResults: function(data) {
                console.log('Select2 processResults:', data);
                const results = data.results || [];
                return {
                    results: results.map(item => ({
                        ...item,
                        id: parseInt(item.id)
                    }))
                };
            },
            cache: false
        },
        minimumInputLength: 0,
        width: '100%'
    }).on('select2:select', function(e) {
        const data = e.params.data;
        console.log('Resource selected:', data);
        selectedResourceId = parseInt(data.id);
        console.log('Resource ID set to:', selectedResourceId);
        $('#resource_details').removeClass('hidden');
        $('#modal_resource_category').text(data.text);
    }).on('select2:unselect', function() {
        $('#resource_details').addClass('hidden');
        selectedResourceId = null;
        console.log('Resource ID cleared');
    });

    // Initialize select2 for employee dropdown
    $('#employee_id').select2({
        dropdownParent: $('#add-signatory-modal'),
        placeholder: 'Select Employee',
        allowClear: true,
        minimumInputLength: 2,
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
                    results: data.results || []
                };
            }
        }
    });

    // Initialize select2 for edit modal dropdowns
    const $editResourceSelect = $('#edit_add_resource_id');
    let editSelectedResourceId = null;

    $editResourceSelect.select2({
        dropdownParent: $('#edit-signatory-modal'),
        placeholder: 'Select Resource',
        allowClear: true,
        ajax: {
            url: '/resource-v2/get-resources',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    search: params.term || '',
                    page: params.page || 1
                };
            },
            processResults: function(data) {
                const results = data.results || [];
                return {
                    results: results.map(item => ({
                        ...item,
                        id: parseInt(item.id)
                    }))
                };
            },
            cache: false
        },
        minimumInputLength: 0,
        width: '100%'
    }).on('select2:select', function(e) {
        const data = e.params.data;
        editSelectedResourceId = parseInt(data.id);
    }).on('select2:unselect', function() {
        editSelectedResourceId = null;
    });

    $('#edit_employee_id').select2({
        dropdownParent: $('#edit-signatory-modal'),
        placeholder: 'Select Employee',
        allowClear: true,
        minimumInputLength: 2,
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
                    results: data.results || []
                };
            }
        }
    });

    // Variables for delete functionality
    let signatoryToDelete = null;

    // Handle save button click
    $('#save-signatory').on('click', function() {
        const $btn = $(this);
        const $modal = $('#add-signatory-modal');

        console.log('Before submission - Selected Resource ID:', selectedResourceId);
        console.log('Current Select2 Value:', $resourceSelect.val());
        
        const formData = new FormData();
        formData.append('type', 'resource');
        formData.append('add_resource_id', selectedResourceId);
        formData.append('employee_id', $('#employee_id').val());
        formData.append('suffix_name', $('#suffix_name').val());
        formData.append('for', $('#for').val());
        formData.append('description', $('#description').val());

        console.log('Form data being submitted:', {
            type: formData.get('type'),
            add_resource_id: formData.get('add_resource_id'),
            employee_id: formData.get('employee_id'),
            suffix_name: formData.get('suffix_name'),
            for: formData.get('for'),
            description: formData.get('description')
        });

        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();

        if (!selectedResourceId) {
            const $selectContainer = $resourceSelect.next('.select2-container');
            $selectContainer.addClass('is-invalid');
            $('#resource_error').text('Please select a resource').show();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select a resource'
            });
            return;
        }

        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Saving...');

        $.ajax({
            url: '/resource-v2/store-signatory',
            method: 'POST',
            data: Object.fromEntries(formData),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message,
                        timer: 1500
                    });
                    
                    resetAddForm();
                    const modal = tailwind.Modal.getOrCreateInstance($modal[0]);
                    modal.hide();
                    setTimeout(() => window.location.reload(), 1000);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error saving signatory:', error);
                handleFormErrors(xhr, $resourceSelect, '#resource_error');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Save');
            }
        });
    });

    // Handle update button click
    $('#update-signatory').on('click', function() {
        const $btn = $(this);
        const $modal = $('#edit-signatory-modal');
        const signatoryId = $('#edit_signatory_id').val();

        if (!editSelectedResourceId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select a resource'
            });
            return;
        }

        const formData = {
            add_resource_id: editSelectedResourceId,
            employee_id: $('#edit_employee_id').val(),
            suffix_name: $('#edit_suffix_name').val(),
            for: $('#edit_for').val(),
            description: $('#edit_description').val()
        };

        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();

        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Updating...');

        $.ajax({
            url: `/resource-v2/update-signatory/${signatoryId}`,
            method: 'PUT',
            data: formData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message,
                        timer: 1500
                    });
                    
                    const modal = tailwind.Modal.getOrCreateInstance($modal[0]);
                    modal.hide();
                    setTimeout(() => window.location.reload(), 1000);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error updating signatory:', error);
                handleFormErrors(xhr, $editResourceSelect, '#edit_resource_error');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Update');
            }
        });
    });

    // Handle delete confirmation
    $('#confirm-delete').on('click', function() {
        const $btn = $(this);
        
        if (!signatoryToDelete) return;

        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

        $.ajax({
            url: `/resource-v2/delete-signatory/${signatoryToDelete}`,
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.status === 'success') {
                    const deleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete-confirmation-modal'));
                    deleteModal.hide();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message,
                        timer: 1500
                    });
                    
                    setTimeout(() => window.location.reload(), 1000);
                }
            },
            error: function(xhr) {
                console.error('Error deleting signatory:', xhr);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete signatory'
                });
            },
            complete: function() {
                $btn.prop('disabled', false).text('Delete');
                signatoryToDelete = null;
            }
        });
    });

    // Helper functions
    function resetAddForm() {
        $resourceSelect.val(null).trigger('change');
        selectedResourceId = null;
        $('#employee_id').val('').trigger('change');
        $('#suffix_name').val('');
        $('#for').val('');
        $('#description').val('');
        $('#resource_details').addClass('hidden');
    }

    function handleFormErrors(xhr, $resourceSelect, errorSelector) {
        let errorMessage = 'Failed to save signatory';
        
        if (xhr.status === 422 && xhr.responseJSON) {
            const response = xhr.responseJSON;
            if (response.errors) {
                Object.keys(response.errors).forEach(field => {
                    const errorMsg = response.errors[field][0];
                    if (field === 'add_resource_id') {
                        const $selectContainer = $resourceSelect.next('.select2-container');
                        $selectContainer.addClass('is-invalid');
                        $(errorSelector).text(errorMsg).show();
                    } else {
                        const $field = $(`#${field}`);
                        $field.addClass('is-invalid');
                        $field.next('.invalid-feedback').text(errorMsg).show();
                    }
                });
                errorMessage = 'Please check the form for errors';
            }
        }

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
        });
    }

    // When modals are shown
    $('#add-signatory-modal').on('show.bs.modal', function() {
        resetAddForm();
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        $('#type').val('resource');
    });

    // Add event handler for edit modal
    $('#edit-signatory-modal').on('show.bs.modal', function() {
        console.log('Edit modal show event triggered');
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();
    });

    // Check if modals exist on page load
    $(document).ready(function() {
        const addModal = document.querySelector('#add-signatory-modal');
        const editModal = document.querySelector('#edit-signatory-modal');
        const deleteModal = document.querySelector('#delete-confirmation-modal');
        
        console.log('Modal elements check:', {
            addModal: !!addModal,
            editModal: !!editModal,
            deleteModal: !!deleteModal
        });
        
        if (!editModal) {
            console.error('Edit signatory modal not found in DOM!');
        }
        
        // Add test button to manually show edit modal (for debugging)
        if (editModal) {
            console.log('Adding test function to window object');
            window.testEditModal = function() {
                console.log('Testing edit modal display...');
                try {
                    if (typeof tailwind !== 'undefined' && tailwind.Modal) {
                        const modal = tailwind.Modal.getOrCreateInstance(editModal);
                        modal.show();
                        console.log('Test: Modal shown using Tailwind');
                    } else {
                        editModal.style.display = 'block';
                        editModal.classList.add('show');
                        document.body.classList.add('modal-open');
                        console.log('Test: Modal shown manually');
                    }
                } catch (e) {
                    console.error('Test modal error:', e);
                }
            };
            
            // You can test the modal by running testEditModal() in the browser console
            console.log('Run testEditModal() in console to test modal display');
        }
    });
});

// Global functions for inline onclick handlers
function deleteSignatory(id) {
    signatoryToDelete = id;
    const deleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete-confirmation-modal'));
    deleteModal.show();
}

function editSignatory(id) {
    console.log('Edit signatory clicked for ID:', id);
    
    // Check if modal exists before making AJAX call
    const modalElement = document.querySelector('#edit-signatory-modal');
    console.log('Modal element exists:', !!modalElement);
    
    if (!modalElement) {
        console.error('Edit modal element not found in DOM!');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Edit modal not found. Please refresh the page and try again.'
        });
        return;
    }
    
    $.ajax({
        url: `/resource-v2/edit-signatory/${id}`,
        method: 'GET',
        success: function(response) {
            console.log('Edit response:', response);
            
            if (response.status === 'success') {
                const data = response.data;
                console.log('Signatory data:', data);
                
                // Set hidden ID
                $('#edit_signatory_id').val(data.id);
                console.log('Set signatory ID:', data.id);
                
                // Clear existing options first
                $('#edit_add_resource_id').empty();
                $('#edit_employee_id').empty();
                console.log('Cleared existing select2 options');
                
                // Set resource - create option and select it
                const resourceOption = new Option(data.resource_name, data.add_resource_id, true, true);
                $('#edit_add_resource_id').append(resourceOption).trigger('change');
                editSelectedResourceId = data.add_resource_id;
                console.log('Set resource:', data.resource_name, 'ID:', data.add_resource_id);
                
                // Set employee - create option and select it
                const employeeOption = new Option(data.employee_name, data.employee_id, true, true);
                $('#edit_employee_id').append(employeeOption).trigger('change');
                console.log('Set employee:', data.employee_name, 'ID:', data.employee_id);
                
                // Set other fields
                $('#edit_suffix_name').val(data.suffix_name || '');
                $('#edit_for').val(data.for || '');
                $('#edit_description').val(data.description || '');
                console.log('Set form fields');
                
                // Clear any previous errors
                $('.is-invalid').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                
                // Show modal - try multiple methods to ensure it works
                console.log('Attempting to show edit modal...');
                
                // Check if tailwind object exists
                if (typeof tailwind !== 'undefined' && tailwind.Modal) {
                    try {
                        const editModal = tailwind.Modal.getOrCreateInstance(modalElement);
                        editModal.show();
                        console.log('Modal shown using Tailwind method');
                        return;
                    } catch (e) {
                        console.error('Tailwind modal error:', e);
                    }
                }
                
                // Try jQuery modal (Bootstrap)
                if (typeof $.fn.modal !== 'undefined') {
                    try {
                        $('#edit-signatory-modal').modal('show');
                        console.log('Modal shown using Bootstrap method');
                        return;
                    } catch (e) {
                        console.error('Bootstrap modal error:', e);
                    }
                }
                
                // Manual modal display (last resort)
                try {
                    modalElement.style.display = 'block';
                    modalElement.classList.add('show');
                    modalElement.setAttribute('aria-hidden', 'false');
                    modalElement.style.paddingRight = '17px';
                    
                    // Add backdrop
                    const backdrop = document.createElement('div');
                    backdrop.className = 'modal-backdrop fade show';
                    backdrop.id = 'edit-modal-backdrop';
                    document.body.appendChild(backdrop);
                    
                    document.body.classList.add('modal-open');
                    document.body.style.overflow = 'hidden';
                    console.log('Modal shown using manual method');
                    
                    // Add close event handlers
                    const closeButtons = modalElement.querySelectorAll('[data-tw-dismiss="modal"], .btn-outline-secondary');
                    closeButtons.forEach(btn => {
                        btn.addEventListener('click', function() {
                            modalElement.style.display = 'none';
                            modalElement.classList.remove('show');
                            modalElement.setAttribute('aria-hidden', 'true');
                            document.body.classList.remove('modal-open');
                            document.body.style.overflow = '';
                            const backdrop = document.getElementById('edit-modal-backdrop');
                            if (backdrop) {
                                backdrop.remove();
                            }
                        });
                    });
                    
                } catch (e) {
                    console.error('Manual modal error:', e);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not open edit modal. Please refresh the page and try again.'
                    });
                }
                
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to fetch signatory details'
                });
            }
        },
        error: function(xhr) {
            console.error('Error fetching signatory details:', xhr);
            console.error('Response text:', xhr.responseText);
            console.error('Status:', xhr.status);
            
            let errorMessage = 'Failed to fetch signatory details';
            if (xhr.status === 404) {
                errorMessage = 'Signatory not found';
            } else if (xhr.status === 500) {
                errorMessage = 'Server error occurred';
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    });
}

function previewSignatory(id) {
    $.ajax({
        url: `/resource-v2/get-signatory/${id}`,
        method: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                const data = response.data;
                console.log('Preview data:', data);
                
                // Update employee information
                $('#preview-signatory-modal .modal-header h2').text(`Signatory Details - ${data.employee.name}`);
                
                // Clear existing content
                const $signatoriesList = $('#signatories-list');
                $signatoriesList.empty();
                
                // Add employee summary
                const employeeSummary = `
                    <div class="intro-y box p-5 mb-5">
                        <div class="flex items-center pb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div class="text-slate-500 font-medium text-lg">Employee Information</div>
                        </div>
                        <div class="mt-5">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-4 h-4 mr-2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <span class="font-medium">Name:</span>
                                <span class="ml-2">${data.employee.name}</span>
                            </div>
                            <div class="flex items-center mt-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase w-4 h-4 mr-2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                <span class="font-medium">Total Resources:</span>
                                <span class="ml-2">${data.employee.total_resources}</span>
                            </div>
                        </div>
                    </div>
                `;
                $signatoriesList.append(employeeSummary);
                
                // Add each resource and its signatories
                data.resources.forEach((resource, index) => {
                    const resourceCard = `
                        <div class="intro-y box p-5 ${index > 0 ? 'mt-5' : ''}">
                            <div class="flex items-center pb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                <div class="text-slate-500 font-medium text-lg">${resource.resource_name}</div>
                                <div class="ml-auto text-slate-500">${resource.category}</div>
                            </div>
                            <div class="mt-5">
                                ${resource.signatories.map(signatory => `
                                    <div class="p-5 border rounded-md ${resource.signatories.indexOf(signatory) > 0 ? 'mt-3' : ''}">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award w-4 h-4 mr-2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                                            <span class="font-medium">Suffix:</span>
                                            <span class="ml-2">${signatory.suffix}</span>
                                        </div>
                                        <div class="flex items-center mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-4 h-4 mr-2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                                            <span class="font-medium">For:</span>
                                            <span class="ml-2">${signatory.for}</span>
                                        </div>
                                        <div class="flex items-center mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-4 h-4 mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                                            <span class="font-medium">Description:</span>
                                            <span class="ml-2">${signatory.description}</span>
                                        </div>
                                        <div class="flex items-center mt-3 text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock w-4 h-4 mr-2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            <span class="text-xs">${signatory.created_at}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    $signatoriesList.append(resourceCard);
                });
                
                // Show modal
                const previewModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#preview-signatory-modal'));
                previewModal.show();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to fetch signatory details'
                });
            }
        },
        error: function(xhr) {
            console.error('Error fetching signatory details:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch signatory details'
            });
        }
    });
}