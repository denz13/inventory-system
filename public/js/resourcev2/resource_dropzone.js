(function () {
    "use strict";

    // Disable auto-discover of Dropzone elements
    Dropzone.autoDiscover = false;

    // Initialize Dropzone for add form
    var addDz = new Dropzone("#image-upload", {
        url: "/resource-v2/store",
        paramName: "file",
        maxFilesize: 5,
        maxFiles: 1,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        autoProcessQueue: false,
        sending: function(file, xhr, formData) {
            // Log values before appending
            console.log('Dropzone Form Values:', {
                category: $('#resource_category').val(),
                location: $('#resource_location').val(),
                name: $('#resource_name').val(),
                model: $('#model').val(),
                serial: $('#serial_plate').val(),
                date: $('#date_acquired').val(),
                capacity: $('#capacity').val(),
                person: $('#person_incharge').val()
            });

            // Append form data
            formData.append('resource_category_id', $('#resource_category').val());
            formData.append('resource_location_id', $('#resource_location').val());
            formData.append('resource_name', $('#resource_name').val());
            formData.append('resource_model', $('#model').val());
            formData.append('resource_serial_or_plate_number', $('#serial_plate').val());
            formData.append('date_acquired', $('#date_acquired').val());
            formData.append('capacity', $('#capacity').val());
            formData.append('person_incharge', $('#person_incharge').val());
            formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
        },
        success: function(file, response) {
            if (response.status === 'success') {
                __notif_show(1, 'SUCCESS', response.message);
                clearForm();
                // Reload page maintaining the current page and per_page parameters
                const currentUrl = new URL(window.location.href);
                // Reset to first page when adding new resource
                currentUrl.searchParams.set('page', '1');
                setTimeout(() => {
                    window.location.href = currentUrl.toString();
                }, 1500);
            } else {
                __notif_show(-1, 'ERROR', response.message || 'Failed to upload file');
            }
        },
        error: function(file, errorMessage) {
            console.error('Dropzone Error:', errorMessage);
            __notif_show(-1, 'ERROR', 'Error uploading file');
        }
    });

    // Initialize Dropzone for edit form
    var editDz = new Dropzone("#edit-image-upload", {
        url: "/resource-v2/upload-temporary",
        paramName: "file",
        maxFilesize: 5,
        maxFiles: 1,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        init: function() {
            this.on("success", function(file, response) {
                if (response.status === 'success') {
                    $('#edit_resource_image').val(response.filename);
                }
            });
            
            this.on("removedfile", function(file) {
                $('#edit_resource_image').val('');
            });

            // Clear dropzone when modal is hidden
            $('#edit-resource-modal').on('hidden.bs.modal', function () {
                editDz.removeAllFiles(true);
                $('#edit_resource_image').val('');
            });
        }
    });

    // Handle save button click
    $("#save_resource").on("click", function(e) {
        e.preventDefault();
        
        // Show loading state
        const btn = $(this);
        btn.prop('disabled', true);
        btn.find('.loading-icon').removeClass('hidden');
        btn.find('.default-text').addClass('hidden');

        // Create FormData object
        const formData = new FormData();
        
        // Append form fields
        formData.append('resource_category_id', $('#resource_category').val());
        formData.append('resource_location_id', $('#resource_location').val());
        formData.append('resource_name', $('#resource_name').val());
        formData.append('resource_model', $('#model').val());
        formData.append('resource_serial_or_plate_number', $('#serial_plate').val());
        formData.append('date_acquired', $('#date_acquired').val());
        formData.append('capacity', $('#capacity').val());
        formData.append('person_incharge', $('#person_incharge').val());
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
        
        // Log form data for debugging
        console.log('Form Values:', {
            resource_category_id: $('#resource_category').val(),
            resource_location_id: $('#resource_location').val(),
            resource_name: $('#resource_name').val(),
            resource_model: $('#model').val(),
            resource_serial_or_plate_number: $('#serial_plate').val(),
            date_acquired: $('#date_acquired').val(),
            capacity: $('#capacity').val(),
            person_incharge: $('#person_incharge').val()
        });

        // If we have files, append them
        const files = addDz.getQueuedFiles();
        if (files.length > 0) {
            formData.append('file', files[0]);
        }

        // Submit the form data
        $.ajax({
            url: '/resource-v2/store',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === 'success') {
                    // Show success message using Tailwind modal
                    const el = document.querySelector("#success-modal");
                    const modal = tailwind.Modal.getOrCreateInstance(el);
                    $('#success-message').text(response.message);
                    modal.show();
                    
                    // Hide the add resource modal
                    const addModal = document.querySelector("#add-resource-modal");
                    const resourceModal = tailwind.Modal.getOrCreateInstance(addModal);
                    resourceModal.hide();
                    
                    // Clear form and dropzone
                    clearForm();
                    addDz.removeAllFiles();
                    
                    // Reload page maintaining parameters but reset to first page
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('page', '1');
                    setTimeout(() => {
                        window.location.href = currentUrl.toString();
                    }, 1500);
                } else {
                    // Show error message using Tailwind modal
                    const el = document.querySelector("#error-modal");
                    const modal = tailwind.Modal.getOrCreateInstance(el);
                    $('#error-message').text(response.message || 'Failed to save resource');
                    modal.show();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                // Show error message using Tailwind modal
                const el = document.querySelector("#error-modal");
                const modal = tailwind.Modal.getOrCreateInstance(el);
                $('#error-message').text('Failed to save resource. Please try again.');
                modal.show();
            },
            complete: function() {
                // Reset button state
                btn.prop('disabled', false);
                btn.find('.loading-icon').addClass('hidden');
                btn.find('.default-text').removeClass('hidden');
            }
        });
    });

    function clearForm() {
        $('#resource_category').val(null).trigger('change');
        $('#resource_location').val(null).trigger('change');
        $('#resource_name').val('');
        $('#model').val('');
        $('#serial_plate').val('');
        $('#date_acquired').val('');
        $('#capacity').val('');
        $('#person_incharge').val(null).trigger('change');
        addDz.removeAllFiles();
    }
})(); 