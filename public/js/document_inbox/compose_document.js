$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    bindSelect2();
    filePondInstance();

});


function bindSelect2(){

    //Set Document Type value after each clicked
    $('#document_type_submitted').change(function () {

        let doc_type_val = $(this).val();

        if (doc_type_val !== '2')
        {
            $('.div_document_Attachment').show();
        }
        else
        {
            $('.div_document_Attachment').hide();
        }

    });

    $('#document_type_submitted').select2({});
    $('#document_type').select2({
        placeholder: 'Select Type of Document'
    });
    $('#document_level').select2({
        placeholder: 'Select Level of Document'
    });
    $('#document_pub_pri_file').select2({
        placeholder: 'Select Document Privacy Type'
    });


}

function filePondInstance() {

    const documentAttachment = document.querySelector('input[id="document_uploaded"]');
    const uploadedAttachments = FilePond.create(documentAttachment, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',

        // Enable client-side processing
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {
                // Simulate successful upload after a delay
                setTimeout(() => {
                    load(file); // Simulate successful upload
                }, 1000);
            },
            revert: (uniqueFileId, load, error) => {
                // Handle file removal
                // Implement your file deletion logic here
            },
        },
    });

    $('body').on('click', '.add_documents_btn', function () {

        const thisButton    = $(this);
        const formData      = new FormData();
        const files         = uploadedAttachments.getFiles(); // Get all uploaded files
        const documentCopyType      = $('#document_type_submitted').val();
        const documentTitle         = $('#document_title').val();
        const documentDescription   = $('#message').val();
        const documentType          = $('#document_type').val();
        const documentLevel         = $('#document_level').val();
        const documentPrivacy       = $('#document_pub_pri_file').val();

        // Validation checks
        if (!documentTitle.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Title is required');
            return; // Prevent AJAX call if documentTitle is empty
        }

        if (!documentDescription.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Description is required');
            return; // Prevent AJAX call if documentDescription is empty
        }

        if (!documentType.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Type is required');
            return; // Prevent AJAX call if documentTitle is empty
        }

        if (!documentLevel.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Level is required');
            return; // Prevent AJAX call if documentDescription is empty
        }

        if (!documentPrivacy.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Privacy is required');
            return; // Prevent AJAX call if documentDescription is empty
        }



        // Append data based on documentCopyType
        if (documentCopyType !== '2') {
            if (files.length > 0) {
                // Append all files to FormData
                files.forEach(fileItem => {
                    formData.append('fileAttachments[]', fileItem.file); // Use fileItem.file
                });
                // Append other form data
                formData.append('documentCopyType', documentCopyType);
                formData.append('documentTitle', documentTitle);
                formData.append('documentDescription', documentDescription);
                formData.append('documentType', documentType);
                formData.append('documentLevel', documentLevel);
                formData.append('documentPrivacy', documentPrivacy);
            } else {

                __notif_show(-1, 'Oooopss...', 'Soft copy documents need attachments.');
                return; // Prevent AJAX call if no files are selected
            }
        }
        else
        {
            // Append only other form data if no files
            formData.append('documentCopyType', documentCopyType);
            formData.append('documentTitle', documentTitle);
            formData.append('documentDescription', documentDescription);
            formData.append('documentType', documentType);
            formData.append('documentLevel', documentLevel);
            formData.append('documentPrivacy', documentPrivacy);
        }

        // Send the FormData using AJAX
        $.ajax({
            url: '/documents/inbox/compose-my-documents', // Replace with your actual upload URL
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.html('Saving...');
            },
            success: function (response) {
                console.log('Files uploaded successfully:', response.message);

                if(response.status === 200)
                {
                    // Remove uploaded files from FilePond
                    removeUploadedAttachments(uploadedAttachments);
                    $('#document_title').val(null);
                    $('#message').val(null);
                    $('#document_type').val(null).trigger('change');
                    $('#document_level').val(null).trigger('change');
                    $('#document_pub_pri_file').val(null).trigger('change');

                    __modal_hide('create_document');
                    Swal.fire({
                        icon:  'success',
                        title: 'Success',
                        text:  response.message,
                        showConfirmButton: true,
                        timerProgressBar: true,
                        timer: 1000  // Close the alert after 1 second
                    });

                    loadInboxItems(currentPage, currentFilter, query);
                }


                thisButton.prop('disabled', false);
                thisButton.html('Save');
            },
            error: function (xhr, status, error) {
                console.error('File upload failed:', error);
                // Handle error response
                thisButton.prop('disabled', false);
                thisButton.html('Save');
            }
        });
    });
}


function removeUploadedAttachments(uploadedFiles) {
    if (uploadedFiles) {
        let files = uploadedFiles.getFiles();
        if (files.length > 0) {
            uploadedFiles.processFiles().then(() => {
                uploadedFiles.removeFiles();
            });
        }
    }
}
