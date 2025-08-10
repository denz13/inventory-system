$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var filter_date_from = '';

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

const re_documentAttachment = document.querySelector('input[id="re_support_docs"]');
const re_uploadedAttachments = FilePond.create(re_documentAttachment, {
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
    send_request();
    load_justification(1, $('#filter_date').val());
    error_handler();
    pagination();
    filter();
    delete_justification();
    track_justification();
    track_version2();
    reason_btn();
    disapprove_message();
    sm_employee();
    hr_emp();
    msg_sm_employee();
    request_again();
    delete_files();

    save_approvers();
});

function send_request() {
    $('body').on('click', '#send_request', function() {
        var date = $('#req_date').val();
        var when = $('#req_when').val();
        var time = $('#req_time').val();
        var type = $('#req_type').val();
        var msg = $('#req_msg').val();
        var head = $('#req_head').val();
        var files = uploadedAttachments.getFiles();
        var btn = $(this);

        if (date.trim() == '') {
            $('#req_date').addClass('border-danger');
            $('#req_date_err').html('Please select date');
        } else if (when == null) {
            $('#req_when').addClass('border-danger');
            $('#req_when_err').html('Please select when');
        } else if (time == '') {
            $('#req_time').addClass('border-danger');
            $('#req_time_err').html('Please enter time');
        } else if (head == null) {
            $('#req_head_err').html('Please select office head');
        }  else if (files.length === 0) {
            __notif_show(-1, 'Incomplete', 'Upload files that will support your statement');
        } else {
            var formData = new FormData();
            formData.append('date', date);
            formData.append('when', when);
            formData.append('time', time);
            formData.append('msg', msg);
            formData.append('type', type);
            formData.append('head', head);

            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/dtr/send_request",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Sending</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Send');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#request_time_modal');
                        __notif_show(3, 'Success', 'Your request has been sent.');
                        $('#req_date').val('');
                        $('#req_when').val('');
                        $('#req_time').val('');
                        $('#req_msg').val('');
                        $('#req_head').val('').trigger('change');
                        uploadedAttachments.removeFiles();
                        load_justification(1, $('#filter_date').val());
                    } else if (response == 'naa_time') {
                        __notif_show(-3, 'Error', 'You have time in the chosen date.');
                    } else if (response == 'invalid_time') {
                        $('#req_time').addClass('border-danger');
                        $('#req_time_err').html('Invalid time ');
                    } else if (response == 'req_check') {
                        __notif_show(-1, 'Exist', 'There is a request in the same date and when.');
                    } else if (response == 'date_invalid') {
                        $('#req_date').addClass('border-danger');
                        $('#req_date_err').html('Please refrain from choosing this date and beyond');
                    }
                },
                error: function(xhr, status, error) {
                    btn.html('Send');
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

function load_justification(page, date) {
    $.ajax({
        url: "/dtr/table_justification",
        type: "POST",
        dataType: "json",
        data: {page: page, date: date},
        beforeSend: function() {
            $('#justification_con').html(`
                <div class="intro-y col-span-12 text-center box py-5">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>
            `);
        },
        success: function (response) {
            $('#justification_con').html(response.html);
            table_pagination(response, '#justification_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function error_handler() {
    $('body').on('input', '#req_date', function() {
        $(this).removeClass('border-danger');
        $('#req_date_err').html('');
    });

    $('body').on('input', '#req_time', function() {
        $(this).removeClass('border-danger');
        $('#req_time_err').html('');
    });

    $('body').on('change', '#req_when', function() {
        $(this).removeClass('border-danger');
        $('#req_when_err').html('');
    });

    $('body').on('change', '#req_head', function() {
        $('#req_head_err').html('');
    });
}

function pagination() {
    $('body').on('click', '#justification_pagination a', function() {
        const page = $(this).data('page');
        load_justification(page, $('#filter_date').val());
    });
}

function filter() {
    $('body').on('change', '#filter_date', function() {
        load_justification(1, $('#filter_date').val());
    });
}

function delete_justification() {
    $('body').on('click', '.delete_justification', function() {
        var id = $(this).data('id');
        $('#justification_id_delete').val(id);
        open_modal('#delete_justification_modal');
    });

    $('body').on('click', '#delete_just_btn', function() {
        var id = $('#justification_id_delete').val();
        var btn = $(this);
        $.ajax({
            url: "/dtr/delete_justification",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Deleting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Delete');
                if (response == 'success') {
                    close_modal('#delete_justification_modal');
                    load_justification(1, $('#filter_date').val());
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function track_justification() {
    $('body').on('click', '.track_justification', function() {
        var id = $(this).data('id');
        open_modal('#tracking_modal');
        $.ajax({
            url: "/dtr/tracking_records",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#track_record_con').html(`
                <div class="flex justify-center">
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
                $('#track_record_con').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function track_version2() {
    $('body').on('click', '.track_version2', function() {
        var id = $(this).data('id');
        open_modal('#tracking_version2_modal');
        $.ajax({
            url: "/dtr/tracking_records_version2",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#track_record_con_version2').html(`
                <div class="flex justify-center">
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
                $('#track_record_con_version2').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function reason_btn() {
    $('body').on('click', '.reason_btn', function() {
        var msg = $(this).data('msg');
        $('#reason_msg_con').val(msg);
        open_modal('#reason_msg_modal');
    });
}

function disapprove_message() {
    $('body').on('mouseenter mouseleave', '.disapprove_msg', function(event) {
        if (event.type === 'mouseenter') {
            $(this).removeClass('fa-shake');
        } else if (event.type === 'mouseleave') {
            $(this).addClass('fa-shake');
        }
    });

    $('body').on('click', '.disapprove_msg', function() {
        var msg = $(this).data('msg');
        $('#disapprove_msg').val(msg);
        open_modal('#disapprove_msg_modal');
    });
}

function sm_employee() {
    $('body').on('click', '.sm_emp', function() {
        open_modal('#sm_emp_modal');
        $.ajax({
            url: "/dtr/sm_employee",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $('#sm_employee_container').html(`
                <div class="border rounded-md flex py-3 justify-center">
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
                $('#sm_employee_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function hr_emp() {
    $('body').on('click', '.hr_emp', function() {
        open_modal('#sm_emp_modal');
        $.ajax({
            url: "/dtr/hr_employee",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $('#sm_employee_container').html(`
                <div class="border rounded-md flex py-3 justify-center">
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
                $('#sm_employee_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function private_message(receiver, msg, btn) {
    $.ajax({
        url: "/dtr/send_msg",
        type: "POST",
        dataType: "json",
        data: {receiver: receiver, msg: msg},
        beforeSend: function() {
            btn.prop('disabled', true);
            btn.html('<span class="fa-fade">Sending</span>');
        },
        success: function (response) {
            btn.prop('disabled', false);
            btn.html('Send');
            if (response == 'success') {
                close_modal('#message_modal');
                __notif_show(3, 'Success', 'Message sent.');
            }
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function msg_sm_employee() {
    $('body').on('click', '.msg_to_sm', function() {
        var name = $(this).closest('.border').find('.pm_name_data').html();
        var receiver = $(this).data('receiver');
        bom_global_messaging(receiver, name);
    });
}

function request_again () {
    $('body').on('click', '.re_request', function() {
        var id = $(this).data('id');
        $('#re_request_id').val(id);
        open_modal('#re_request_time_modal');
        $.ajax({
            url: "/dtr/re_request_get",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#re_request_container_load').css('display', 'block');
                $('#re_request_container').css('display', 'none');
            },
            success: function (response) {
                $('#re_request_container_load').css('display', 'none');
                $('#re_request_container').css('display', 'block');
                $('#re_req_docs_exist').html(response.docs);
                $('#re_req_date').val(response.date);
                $('#re_req_when').val(response.when);
                $('#re_req_time').val(response.time);
                $('#re_req_msg').val(response.msg);
                $('#re_req_head').val(response.head).trigger('change');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#re_send_request', function() {
        var id = $('#re_request_id').val();
        var date = $('#re_req_date').val();
        var when = $('#re_req_when').val();
        var time = $('#re_req_time').val();
        var msg = $('#re_req_msg').val();
        var head = $('#re_req_head').val();
        var files = re_uploadedAttachments.getFiles();
        var btn = $(this);

        if (date.trim() == '') {
            $('#re_req_date').addClass('border-danger');
            $('#re_req_date_err').html('Please select date');
        } else if (when == null) {
            $('#re_req_when').addClass('border-danger');
            $('#re_req_when_err').html('Please select when');
        } else if (type == null) {
            $('#re_req_type').addClass('border-danger');
            $('#re_req_type_err').html('Please select type');
        } else if (time == '') {
            $('#re_req_time').addClass('border-danger');
            $('#re_req_time_err').html('Please enter time');
        } else if (head == null) {
            $('#re_req_head_err').html('Please select office head');
        } else {
            var formData = new FormData();
            formData.append('id', id);
            formData.append('date', date);
            formData.append('when', when);
            formData.append('time', time);
            formData.append('msg', msg);
            formData.append('head', head);

            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/dtr/resend_request",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Sending</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Send');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#re_request_time_modal');
                        __notif_show(3, 'Success', 'Your request was updated.');
                        $('#re_req_date').val('');
                        $('#re_req_when').val('');
                        $('#re_req_time').val('');
                        $('#re_req_msg').val('');
                        $('#re_req_head').val('').trigger('change');
                        $('#re_req_type').val('');
                        re_uploadedAttachments.removeFiles();
                        load_justification(1, $('#filter_date').val());
                    } else if (response == 'naa_time') {
                        __notif_show(-3, 'Error', 'You have time in the chosen date.');
                    } else if (response == 'invalid_time') {
                        $('#re_req_time').addClass('border-danger');
                        $('#re_req_time_err').html('Invalid time ');
                    } else if (response == 'req_check') {
                        __notif_show(-1, 'Exist', 'There is a pending request in the same date and time.');
                    }
                },
                error: function(xhr, status, error) {
                    btn.html('Send');
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

function delete_files() {
    $('body').on('click', '.delete_file', function() {
        var id = $(this).data('id');
        $('#delete_id_justification').val(id);
        open_modal('#delete_file_modal');
    });

    $('body').on('click', '#delete_time_btn', function() {
        var id = $('#delete_id_justification').val();
        var btn = $(this);
        $.ajax({
            url: "/dtr/delete_request_files",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Sending</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Send');
                btn.prop('disabled', false);
                if (response == 'success') {
                    load_justification(1, $('#filter_date').val());
                    $('.delete_file[data-id="' + id + '"]').closest('.docs_uniq').remove();
                    __notif_show(3, 'Success', 'File removed.');
                    close_modal('#delete_file_modal');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function save_approvers() {
    $('body').on('click', '#settings_btn', function() {
        open_modal('#settings_modal');
        $.ajax({
            url: "/dtr/get_approvers",
            type: "GET",
            dataType: "json",
            success: function (response) {
                $('#personal_approver_now').val(response.personal);
                $('#technical_approver_now').val(response.technical);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#save_approvers', function() {
        var personal = $('#settings_personal').val();
        var technical = $('#settings_technical').val();
        var btn = $(this);
        var bool = true;

        if (personal == null) {
            $('#settings_personal_err').html('Please select personal approver');
            bool = false;
        }  
        if (technical == null) {
            $('#settings_technical_err').html('Please select technical approver');
            bool = false;
        } 
        
        if (bool) {
            $.ajax({
                url: "/dtr/change_approvers",
                type: "POST",
                dataType: "json",
                data: {
                    personal: personal,
                    technical: technical
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        __notif_show(3, 'Success', 'Approvers updated.');
                        $('#settings_personal').val('').trigger('change');
                        $('#settings_technical').val('').trigger('change');
                        close_modal('#settings_modal');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}
