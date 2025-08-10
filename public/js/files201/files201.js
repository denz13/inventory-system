$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

FilePond.registerPlugin(
    // validates the size of the file

    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,

);

const documentAttachment = document.querySelector('input[id="support_docs"]');
const uploadedAttachments = FilePond.create(documentAttachment, {
    credits: false,
    allowMultiple: false,
    allowFileTypeValidation: true,
    maxFileSize: '10MB',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    labelFileTypeNotAllowed: 'Only JPEG, PNG, and PDF files are allowed.',
    fileValidateTypeLabelExpectedTypes: 'Expects {allTypes}',

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


$(document).ready(function() {
    let timeout;

    // Table Controller
    load_employee(1, $('#employee_search').val(), $('#employee_status').val());
    pagination();
    search();
    employment_type();

    upload_files();
    save_uploaded_files();

    view_files();
});

function load_employee(page, search, status) {
    $.ajax({
        url: "/admin/load_employee_201",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search, status: status},
        beforeSend: function() {
            $('#employee_sumamry').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#emloyee_container').html(`
            <div class="intro-y col-span-12 flex justify-center box py-3">
                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
                    <circle cx="15" cy="15" r="15">
                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="105" cy="15" r="15">
                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
            </div>`);
        },
        success: function (response) {
            $('#emloyee_container').html(response.html);
            $('#employee_sumamry').html(response.summary);
            table_pagination(response, '#employee_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function pagination() {
    $('body').on('click', '#employee_pagination a', function() {
        const page = $(this).data('page');
        load_employee(page, $('#employee_search').val(), $('#employee_status').val());
    });
}

function search() {
    $('body').on('input', '#employee_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_employee(1, $('#employee_search').val(), $('#employee_status').val());
        }, 500);
    });
}

function employment_type() {
    $('body').on('change', '#employee_status', function() {
        load_employee(1, $('#employee_search').val(), $('#employee_status').val());
    });
}

function upload_files() {
    $('body').on('click', '.upload_files', function() {
        const agencyid = $(this).data('agencyid');
        $('#agencyid_201').val(agencyid);
        open_modal('#upload_files_modal');
    });
}

function save_uploaded_files() {
    $('body').on('click', '#save_uploaded_files', function() {
        let checker = false;
        let btn = $(this);
        var agencyid = $('#agencyid_201').val();
        var files = uploadedAttachments.getFiles();
        if (files.length === 0) {
            __notif_show(-1, 'Incomplete', 'Upload files that will support your statement');
            checker = true;
        }

        if (!checker) {
            var formData = new FormData();
            formData.append('agencyid', agencyid);
            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/admin/save_employee_201",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    
                    if (response == 'success') {
                        __notif_show(3, 'Success', 'Files uploaded successfully');
                        close_modal('#upload_files_modal');
                    }
                },
                error: function(xhr, status, error) {
                    btn.html('Save');
                    btn.prop('disabled', false);

                    if (xhr.status === 422) { // Validation error
                        var errors = xhr.responseJSON.errors;

                        // Check for file validation errors
                        if (errors['files.0']) {
                            var fileError = errors['files.0'][0]; // Get the first error message

                            // Check if the error is related to file type
                            if (fileError.includes('must be a file of type')) {
                                __notif_show(-2, 'Invalid File Type', 'It only accepts jpg, png, and pdf files.');
                            }
                            // You can add more conditions here if you want to check for other errors
                        }

                        // Handle other potential validation errors similarly...
                    } else if (xhr.status === 413) { // 413 Payload Too Large
                        __notif_show(-2, 'File too big', 'Files should be under 10MB.');
                    } else {
                        alert(xhr.responseText);
                    }
                }
            });
        }
    });
}

function view_files() {
    $('body').on('click', '.view_files', function() {
        const agencyid = $(this).data('agencyid');
        open_modal('#view_files_modal');

        $.ajax({
            url: "/admin/get_employee_201",
            type: "POST",
            dataType: "json",
            data: {
                agencyid: agencyid
            },
            beforeSend: function() {
                $('#view_files_content').html('<div class="text-center"><i class="fa-solid fa-ellipsis fa-fade"></i></div>');
            },
            success: function (response) {
                $('#view_files_content').html(response.html);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}
