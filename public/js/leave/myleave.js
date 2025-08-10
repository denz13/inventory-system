$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var filter_date_from = '';
var filter_date_from_vl_as_sl = '';
var filter_date_from_vl_and_sl = '';

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

const documentAttachment_vl_as_sl = document.querySelector('input[id="vl_as_sl_support_docs"]');
const uploadedAttachments_vl_as_sl = FilePond.create(documentAttachment_vl_as_sl, {
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

const documentAttachment_vl_and_sl = document.querySelector('input[id="vl_and_sl_support_docs"]');
const uploadedAttachments_vl_and_sl = FilePond.create(documentAttachment_vl_and_sl, {
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

    load_table(1, $('#filter_date').val(), $('#filter_type').val(), $('#filter_status').val());
    pagination_my_leave();
    filter_date_my_leave();
    filter_type_my_leave();
    clickable_leave_name();
    clickable_status();

    pending_leave();
    force_leave_reason();
    vl_fl_computation();
    datepicker_initialization();
    load_available_leave();
    apply_leave();
    apply_leave_wo_range();
    calculate_working_days();
    apply_error_handler();
    save_application();
    save_application_wo_range();
    start_date_to_end_date_calc();
    delete_application();
    disapprove_reason();
    more_details_application();
    track_application();
    print();

    // Vacation Leave as Sick Leave
    vl_as_sl_datepicker_initialization();
    vl_as_sl();
    save_vl_as_sl();
    vl_as_sl_calculate_days();

    // Sick Leave and Vacation Leave
    vl_and_sl_datepicker_initialization();
    sick_leave_and_vl();
    save_vl_and_sl();
    vl_and_sl_calculate_days();

    monetization();
    terminal_leave();
});

function load_table(page, date, type, status) {
    $.ajax({
        url: "/leave/my_leaves",
        type: "POST",
        dataType: "json",
        data: {page: page, date: date, type: type, status: status},
        beforeSend: function() {
            $('#my_leaves_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#my_leave_container').html(`
                <div class="intro-y col-span-12 box text-center p-5 flex" style="justify-content: center;">
                    <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(203, 213, 225)" class="w-8 h-8">
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
            $('#my_leave_container').html(response.html);
            $('#my_leaves_summary').html(response.summary);
            table_pagination(response, '#pagination_my_leave');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });

    $.ajax({
        url: "/leave/my_leaves_count",
        type: "POST",
        dataType: "json",
        data: {type: type},
        beforeSend: function() {
            $('#approve_count').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#pending_count').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#disapprove_count').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#approve_count').html(response.approve);
            $('#pending_count').html(response.pending);
            $('#disapprove_count').html(response.disapprove);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function pagination_my_leave() {
    $('body').on('click', '#pagination_my_leave a', function() {
        const page = $(this).data('page');
        load_table(page, $('#filter_date').val(), $('#filter_type').val(), $('#filter_status').val());
    });
}

function filter_date_my_leave() {
    $('body').on('input', '#filter_date', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#filter_date').val(), $('#filter_type').val());
        }, 500);
    });
}

function filter_type_my_leave() {
    $('body').on('change', '#filter_type', function() {
        load_table(1, $('#filter_date').val(), $('#filter_type').val(), $('#filter_status').val());
    });
}

function clickable_leave_name() {
    $('body').on('click', '.name_of_leave_type', function() {
        var type = $(this).data('type');
        $('#filter_date').val('');
        $('#filter_type').val(type);
        load_table(1, '', type, '')
    });
}

function clickable_status() {
    $('body').on('click', '.status_clickable', function() {
        var backgroundColor = $(this).css('background-color');
        var status = '';
        $('.status_clickable').css('background-color', '');
        $('.status_clickable').find('.count_con').removeClass('text-white');
        $('.status_clickable').find('.count_con').addClass('text-slate-500');
        if (backgroundColor !== 'rgb(29, 78, 216)') {
            $(this).css('background-color', '#1D4ED8');
            $(this).find('.count_con').removeClass('text-slate-500');
            $(this).find('.count_con').addClass('text-white');
            status = $(this).data('status');
        }
        $('#filter_status').val(status);
        load_table(1, $('#filter_date').val(), $('#filter_type').val(), status);
    });
}

function pending_leave() {
    $('body').on('click', '.my_leave_pending', function() {
        $('.status_clickable').css('background-color', '');
        $('.status_clickable').find('.count_con').removeClass('text-white');
        $('.status_clickable').find('.count_con').addClass('text-slate-500');

        var type = $(this).data('type');
        var status = $(this).data('status');
        $('#filter_type').val(type);
        $('#filter_status').val(status);
        $('.status_clickable[data-status="pending"]').css('background-color', '#1D4ED8');
        $('.status_clickable[data-status="pending"]').find('.count_con').removeClass('text-slate-500');
        $('.status_clickable[data-status="pending"]').find('.count_con').addClass('text-white');
        load_table(1, '', type, status);
    });
}

function datepicker_initialization() {
    let element_id = 'leave_date_range';

    filter_date_from = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        startDate: new Date(),
        format: 'MMM DD, YYYY ',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });
}

function load_available_leave() {
    $.ajax({
        url: "/leave/my_available_leave",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#available_leave_con').html(`
                <div class="intro-y col-span-12 box flex py-3" style="justify-content: center;">
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
            $('#available_leave_con').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function apply_leave() {
    $('body').on('click', '.apply_leave_btn', function() {
        close_modal('#force_leave_notification');
        close_modal('#eo1077_modal');
        close_modal('#vl_commutation_modal');
        var type = $(this).data('type');
        var force = $(this).data('force');
        var pending = $(this).data('pending');
        var name = $(this).data('name');
        $('#show_leave_type_name').val(name);
        $('#leave_type').val(type);
        $('#leave_docs_con').css('display', 'none');

        if (type == '1' || type == '6') {
            $('#leave_details_con').html(`
                <div class="mt-3">
                    <div>Details of leave <span class="text-danger">*</span></div>
                    <select class="form-select" id="app_details">
                        <option value="" disabled selected>Please select</option>
                        <option value="1">Within the Philippines</option>
                        <option value="2">Abroad</option>
                    </select>
                    <div id="app_details_err" class="text-xs text-danger text-center"></div>
                </div>
                <div class="mt-3">
                    <div>Specify <span class="text-danger">*</span></div>
                    <input type="text" class="form-control" id="app_specify" placeholder="Please enter">
                    <div id="app_specify_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else if (type == '3') {
            $('#leave_details_con').html(`
                <div class="mt-3">
                    <div>Details of leave <span class="text-danger">*</span></div>
                    <select class="form-select" id="app_details">
                        <option value="" disabled selected>Please select</option>
                        <option value="3">In Hospital</option>
                        <option value="4">Out Patient</option>
                    </select>
                    <div id="app_details_err" class="text-xs text-danger text-center"></div>
                </div>
                <div class="mt-3">
                    <div>Specify <span class="text-danger">*</span></div>
                    <input type="text" class="form-control" id="app_specify" placeholder="Please enter">
                    <div id="app_specify_err" class="text-xs text-danger text-center"></div>
                </div>`);
            $('#leave_docs_con').css('display', 'block');
        } else if (type == '11') {
            $('#leave_details_con').html(`
                <div class="mt-3">
                    <div>Specify illness <span class="text-danger">*</span></div>
                    <input type="text" class="form-control" id="app_specify" placeholder="Please enter">
                    <div id="app_specify_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else if (type == '8') {
            $('#leave_details_con').html(`
                <div class="mt-3">
                    <div>Details of leave <span class="text-danger">*</span></div>
                    <select class="form-select" id="app_details">
                        <option value="" disabled selected>Please select</option>
                        <option value="5">Completion of Master's Degree</option>
                        <option value="6">BAR/Board Examination Review</option>
                    </select>
                    <div id="app_details_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else {
            $('#leave_details_con').html('');
        }

        $('#leave_date_range').val('');
        $('#working_days').val('');

        if (type == '1' && force >= 1) {
            var date = $(this).data('date');
            var class_name = 'apply_leave_btn';
            if (date == 'No' || date == 'Exclude') {
                class_name = 'range_apply_leave_btn';
            }
            $('#force_leave_notification_btn').html('<button type="button" class="btn w-40 btn-primary '+class_name+'" data-name="Mandatory/ Forced Leave" data-type="2" data-force="'+force+'" data-pending="'+pending+'" data-date="'+date+'">Apply force leave</button>');
            open_modal('#force_leave_notification');
        } else if (type == '1' && pending > 0) {
            $('#force_leave_notification_btn').html('<button type="button" class="btn w-40 btn-primary" disabled>No force leave</button>');
            open_modal('#force_leave_notification');
        } else {
            open_modal('#leave_application_modal');
        }
    });
}

function apply_leave_wo_range() {
    $('body').on('click', '.range_apply_leave_btn', function() {
        close_modal('#force_leave_notification');
        close_modal('#eo1077_modal');
        close_modal('#vl_commutation_modal');
        var type = $(this).data('type');
        var force = $(this).data('force');
        var pending = $(this).data('pending');
        var name = $(this).data('name');
        $('#r_show_leave_type_name').val(name);
        $('#r_leave_type').val(type);

        if (type == '6') {
            $('#r_leave_details_con').html(`
                <div class="mt-3">
                    <div>Details of leave <span class="text-danger">*</span></div>
                    <select class="form-select" id="r_app_details">
                        <option value="" disabled selected>Please select</option>
                        <option value="1">Within the Philippines</option>
                        <option value="2">Abroad</option>
                    </select>
                    <div id="r_app_details_err" class="text-xs text-danger text-center"></div>
                </div>
                <div class="mt-3">
                    <div>Specify <span class="text-danger">*</span></div>
                    <input type="text" class="form-control" id="r_app_specify" placeholder="Please enter">
                    <div id="r_app_specify_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else if (type == '11') {
            $('#r_leave_details_con').html(`
                <div class="mt-3">
                    <div>Specify illness <span class="text-danger">*</span></div>
                    <input type="text" class="form-control" id="r_app_specify" placeholder="Please enter">
                    <div id="r_app_specify_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else if (type == '8') {
            $('#r_leave_details_con').html(`
                <div class="mt-3">
                    <div>Details of leave <span class="text-danger">*</span></div>
                    <select class="form-select" id="r_app_details">
                        <option value="" disabled selected>Please select</option>
                        <option value="5">Completion of Master's Degree</option>
                        <option value="6">BAR/Board Examination Review</option>
                    </select>
                    <div id="r_app_details_err" class="text-xs text-danger text-center"></div>
                </div>`);
        } else {
            $('#r_leave_details_con').html('');
        }

        $('#r_leave_date_range').val('');
        $('#r_working_days').val('');
        $('#r_leave_docs_con').css('display', 'none');

        if (type == '1' && force >= 1) {
            var date = $(this).data('date');
            var class_name = 'apply_leave_btn';
            if (date == 'No' || date == 'Exclude') {
                class_name = 'range_apply_leave_btn';
            }
            $('#force_leave_notification_btn').html('<button type="button" class="btn w-40 btn-primary '+class_name+'" data-name="Mandatory/ Forced Leave" data-type="2" data-force="'+force+'" data-pending="'+pending+'" data-date="'+date+'">Apply force leave</button>');
            open_modal('#force_leave_notification');
        } else if (type == '1' && pending > 0) {
            $('#force_leave_notification_btn').html('<button type="button" class="btn w-40 btn-primary" disabled>No force leave</button>');
            open_modal('#force_leave_notification');
        } else {
            open_modal('#leave_application_worange_modal');
        }
    });
}

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

function getDateFormat(date) {
    try {
        let year = date.getFullYear(),
            month = pad(date.getMonth()+1),
            day = pad(date.getDate().toString());

        date  = year+'-'+month+'-'+day;

        return date;
    } catch(error) {
        console.log(error.message);
    }
}

function calculate_working_days() {
    filter_date_from.on('selected',function(date){
        let convert_start_date = '',
        convert_end_date = '';

        //extract the date from the calendar
        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        $.ajax({
            url: "/leave/calculate_days",
            type: "POST",
            dataType: "json",
            data: {
                start: start,
                end: end
            },
            beforeSend: function() {
                $('#days_calculating_load').css('display', 'inline');
            },
            success: function (response) {
                $('#days_calculating_load').css('display', 'none');
                $('#working_days').val(response);
                var type = $('#leave_type').val();
                $('#leave_date_range').removeClass('border-danger');
                $('#leave_date_range_err').html('');
                $('#working_days').removeClass('border-danger');
                $('#working_days_err').html('');
                // if (response > 4 && type == '3') {
                //     $('#leave_docs_con').css('display', 'block');
                // } else {
                //     $('#leave_docs_con').css('display', 'none');
                // }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function apply_error_handler() {
    $('body').on('input', '#app_details_err', function() {
        $(this).removeClass('border-danger');
        $(this).next().html('');
    });

    $('body').on('change', '#app_details, #working_days, #app_commutation', function() {
        $(this).removeClass('border-danger');
        $(this).next().html('');
    });

    $('body').on('change', '#app_supervisor, #r_app_supervisor', function() {
        if (!$(this).val()) {  // Check if no value is selected
            $('#app_supervisor_err').html('Please select a supervisor');
            $('#r_app_supervisor_err').html('Please select a supervisor');
        } else {
            $('#app_supervisor_err').html('');
            $('#r_app_supervisor_err').html('');
        }
    });

    $('body').on('change', '#r_leave_start_date, #r_leave_end_date', function() {
        $(this).removeClass('border-danger');
        $('#r_leave_start_date_err').html('');
    });
}

function save_application() {
    $('body').on('click', '#save_application', function() {
        var checker = false;
        var type = $('#leave_type').val();
        var details = '';
        var specify = '';
        var date = $('#leave_date_range').val();
        var days = $('#working_days').val();
        var commutation = $('#app_commutation').val();
        var supervisor = $('#app_supervisor').val();
        var super_ext = $('#app_supervisor_ext').val();
        var files = uploadedAttachments.getFiles();
        var btn = $(this);

        if (type == '1' || type == '6' || type == '3' || type == '8') {
            details = $('#app_details').val();
            if (details == null) {
                $('#app_details').addClass('border-danger');
                $('#app_details_err').html('Please select');
                checker = true;
            }
        }
        if (type == '1' || type == '6' || type == '3' || type == '11') {
            specify = $('#app_specify').val();
            if (specify.trim() == '') {
                $('#app_specify').addClass('border-danger');
                $('#app_specify_err').html('Please specify');
                checker = true;
            }
            if (type == '1' || type == '6') {
                if (specify.trim().length > 17) {
                    $('#app_specify').addClass('border-danger');
                    $('#app_specify_err').html('Limited to 17 letters only.');
                    checker = true;
                }
            }
            if (type == '3') {
                if (specify.trim().length > 13) {
                    $('#app_specify').addClass('border-danger');
                    $('#app_specify_err').html('Limited to 13 letters only.');
                    checker = true;
                }
            }
            if (type == '11') {
                if (specify.trim().length > 22) {
                    $('#app_specify').addClass('border-danger');
                    $('#app_specify_err').html('Limited to 22 letters only.');
                    checker = true;
                }
            }
        }
        if (date.trim() == '') {
            $('#leave_date_range').addClass('border-danger');
            $('#leave_date_range_err').html('Please select date range.');
            checker = true;
        }
        if (commutation == null) {
            $('#app_commutation').addClass('border-danger');
            $('#app_commutation_err').html('Please select');
            checker = true;
        }
        if (supervisor == null) {
            $('#app_supervisor_err').html('Please select supervisor');
            checker = true;
        }
        if (days > 4 && type == '3') {
            if (files.length === 0) {
                __notif_show(-1, 'Incomplete', 'Upload files that will support your statement');
                checker = true;
            }
        }
        if (days < 1 || days.trim() == '') {
            $('#working_days').addClass('border-danger');
            $('#working_days_err').html('Working days must be greater to 1');
            checker = true;
        }

        if (!checker) {
            const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
                end_date = filter_date_from.getEndDate('YYYY-MM-DD');

            var start = getDateFormat(start_date);
            var end = getDateFormat(end_date);

            var formData = new FormData();
            formData.append('type', type);
            formData.append('details', details);
            formData.append('specify', specify);
            formData.append('start', start);
            formData.append('end', end);
            formData.append('days', days);
            formData.append('commutation', commutation);
            formData.append('supervisor', supervisor);
            formData.append('super_ext', super_ext);

            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/leave/application",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Appyling</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        load_available_leave();
                        load_table(1, '', '', '');
                        close_modal('#leave_application_modal');
                        $('#leave_date_range').val('');
                        $('#working_days').val('');
                        $('#app_supervisor').val('').trigger('change');
                        uploadedAttachments.removeFiles();
                    } else if (response == 'exist') {
                        $('#leave_date_range').addClass('border-danger');
                        $('#leave_date_range_err').html('You already have leave in this date.');
                    } else if (response == 'not_employed') {
                        close_modal('#leave_application_modal');
                        __notif_show(-3, 'You are not Employed', 'Contact the HR to be employed.');
                    } else if (response == 'not_assigned') {
                        close_modal('#leave_application_modal');
                        __notif_show(-3, 'Campus not assigned', 'Contact the HR to be assign to a campus.');
                    } else if (response == 'sig_not_set') {
                        close_modal('#leave_application_modal');
                        __notif_show(-3, 'Signatory not set', 'Contact the HR to be set signatory to a campus.');
                    } else if (response == 'exceed') {
                        $('#leave_date_range').addClass('border-danger');
                        $('#leave_date_range_err').html('The number of days applied for exceeds the available leave.');
                    } else if (response == 'year_error') {
                        $('#leave_date_range').addClass('border-danger');
                        $('#leave_date_range_err').html('This leave can only be applied this year.');
                    } else {
                        $('#leave_date_range').addClass('border-danger');
                        $('#leave_date_range_err').html(response + ' onwards are allowed.');
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

function start_date_to_end_date_calc() {
    $('body').on('change', '#r_leave_start_date', function() {
        var start = $('#r_leave_start_date').val();
        var type = $('#r_leave_type').val();
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $.ajax({
                url: "/leave/calculate_end_date",
                type: "POST",
                dataType: "json",
                data: {start: start, type: type},
                beforeSend: function() {
                    $('.r_days_calculating_load').css('display', 'inline');
                },
                success: function (response) {
                    $('.r_days_calculating_load').css('display', 'none');
                    $('#r_working_days').val(response.working_days);
                    $('#r_leave_end_date').val(response.end_date);
                    $('#r_leave_start_date_word').html(response.word_start);
                    $('#r_leave_end_date_word').html(response.word_end);
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }, 100);
    });
}

function save_application_wo_range() {
    $('body').on('click', '#r_save_application', function() {
        var checker = false;
        var type = $('#r_leave_type').val();
        var start = $('#r_leave_start_date').val();
        var end = $('#r_leave_end_date').val();
        var details = '';
        var specify = '';
        var days = $('#r_working_days').val();
        var commutation = $('#r_app_commutation').val();
        var supervisor = $('#r_app_supervisor').val();
        var super_ext = $('#r_app_supervisor_ext').val();
        var btn = $(this);

        if (type == '1' || type == '6' || type == '3' || type == '8') {
            details = $('#r_app_details').val();
            if (details == null) {
                $('#r_app_details').addClass('border-danger');
                $('#r_app_details_err').html('Please select');
                checker = true;
            }
        }
        if (type == '1' || type == '6' || type == '3' || type == '11') {
            specify = $('#r_app_specify').val();
            if (specify.trim() == '') {
                $('#r_app_specify').addClass('border-danger');
                $('#r_app_specify_err').html('Please specify');
                checker = true;
            }
            if (type == '1' || type == '6') {
                if (specify.trim().length > 17) {
                    $('#r_app_specify').addClass('border-danger');
                    $('#r_app_specify_err').html('Limited to 17 letters only.');
                    checker = true;
                }
            }
            if (type == '3') {
                if (specify.trim().length > 13) {
                    $('#r_app_specify').addClass('border-danger');
                    $('#r_app_specify_err').html('Limited to 13 letters only.');
                    checker = true;
                }
            }
            if (type == '11') {
                if (specify.trim().length > 22) {
                    $('#r_app_specify').addClass('border-danger');
                    $('#r_app_specify_err').html('Limited to 22 letters only.');
                    checker = true;
                }
            }
        }
        if (commutation == null) {
            $('#r_app_commutation').addClass('border-danger');
            $('#r_app_commutation_err').html('Please select');
            checker = true;
        }
        if (supervisor == null) {
            $('#r_app_supervisor_err').html('Please select supervisor');
            checker = true;
        }
        if (start.trim() == '') {
            $('#r_leave_start_date').addClass('border-danger');
            $('#r_leave_start_date_err').html('Please select starting date.');
            checker = true;
        }
        if (end.trim() == '') {
            $('#r_leave_end_date').addClass('border-danger');
            checker = true;
        }

        if (!checker) {
            var formData = new FormData();
            formData.append('type', type);
            formData.append('details', details);
            formData.append('specify', specify);
            formData.append('start', start);
            formData.append('end', end);
            formData.append('days', days);
            formData.append('commutation', commutation);
            formData.append('supervisor', supervisor);
            formData.append('super_ext', super_ext);

            $.ajax({
                url: "/leave/application_wo_range",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Appyling</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        load_available_leave();
                        load_table(1, '', '', '');
                        close_modal('#leave_application_worange_modal');
                        $('#r_leave_date_range').val('');
                        $('#r_working_days').val('');
                        $('#r_app_supervisor').val('').trigger('change');
                        uploadedAttachments.removeFiles();
                    } else if (response == 'exist') {
                        $('#r_leave_date_range').addClass('border-danger');
                        $('#r_leave_date_range_err').html('You already have leave in this date.');
                    } else if (response == 'not_employed') {
                        close_modal('#leave_application_worange_modal');
                        __notif_show(-3, 'You are not Employed', 'Contact the HR to be employed.');
                    } else if (response == 'not_assigned') {
                        close_modal('#leave_application_worange_modal');
                        __notif_show(-3, 'Campus not assigned', 'Contact the HR to be assign to a campus.');
                    } else if (response == 'sig_not_set') {
                        close_modal('#leave_application_worange_modal');
                        __notif_show(-3, 'Signatory not set', 'Contact the HR to be set signatory to a campus.');
                    } else if (response == 'exceed') {
                        $('#r_leave_date_range').addClass('border-danger');
                        $('#r_leave_date_range_err').html('The number of days applied for exceeds the available leave.');
                    } else if (response == 'year_error') {
                        $('#r_leave_date_range').addClass('border-danger');
                        $('#r_leave_date_range_err').html('This leave can only be applied this year.');
                    } else {
                        $('#r_leave_date_range').addClass('border-danger');
                        $('#r_leave_date_range_err').html(response + ' onwards are allowed.');
                    }
                },
                error: function(xhr, status, error) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    alert(xhr.responseText);
                }
            });
            alert('asdasd')
        }
    });
}

function delete_application() {
    // Allowed
    $('body').on('click', '.delete_application', function() {
        var id = $(this).data('id');
        $('#dlt_app_id').val(id);
        open_modal('#delete_application_modal');
    });

    $('body').on('click', '#delete_application_btn', function() {
        var id = $('#dlt_app_id').val();
        var btn = $(this);
        $.ajax({
            url: "/leave/delete_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Deleting</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Delete');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#delete_application_modal');
                    __notif_show(1, 'Success', 'Application deleted.');
                    load_available_leave();
                    load_table(1, '', '', '');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    // Not Allowed
    $('body').on('click', '.action_denied', function() {
        open_modal('#not_allowed_dlt_modal');
    });
}

function disapprove_reason() {
    $('body').on('mouseenter mouseleave', '.leave_due_to', function(event) {
        if (event.type === 'mouseenter') {
            $(this).removeClass('fa-shake');
        } else if (event.type === 'mouseleave') {
            $(this).addClass('fa-shake');
        }
    });

    $('body').on('click', '.leave_due_to', function() {
        var msg = $(this).data('msg');
        $('#due_to_msg').val(msg);
        open_modal('#due_to_modal');
    });
}

function more_details_application() {
    $('body').on('click', '.more_details', function() {
        var id = $(this).data('id');
        open_modal('#more_details_modal');
        $.ajax({
            url: "/leave/more_details",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#more_details_body').html(`
                <div class="col-span-12 flex" style="justify-content: center;">
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
                $('#more_details_body').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function track_application() {
    $('body').on('click', '.track_application', function() {
        var id = $(this).data('id');
        open_modal('#tracking_modal');
        $.ajax({
            url: "/leave/track_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#leava_tracking_container').html(`
                <div class="flex" style="justify-content: center;">
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
                $('#leava_tracking_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function print() {
    $('body').on('click', '#blank_print', function() {
        var id = 3;
        let url = `/leave/blank_print`;
        window.open(url,'_blank');
    });

    $('body').on('click', '.print_leave', function() {
        var id = $(this).data('id');
        let url = `/leave/print_leave?id=${id}`;
        window.open(url,'_blank');
    });
}

function vl_as_sl_datepicker_initialization() {
    let element_id = 'vl_as_sl_leave_date_range';

    filter_date_from_vl_as_sl = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        startDate: new Date(),
        format: 'MMM DD, YYYY ',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });
}

function vl_as_sl() {
    $('body').on('click', '.apply_as_sl', function() {
        var balance = $(this).data('balance');
        $('#vl_as_sl_balance').val(balance);
        open_modal('#leave_application_vl_as_sl_modal');
    });

    $('body').on('change', '#vl_as_sl_app_details', function() {
        $('#vl_as_sl_app_details').removeClass('border-danger');
        $('#vl_as_sl_app_details_err').html('');
    });

    $('body').on('input', '#vl_as_sl_app_specify', function() {
        $('#vl_as_sl_app_specify').removeClass('border-danger');
        $('#vl_as_sl_app_specify_err').html('');
    }); 

    $('body').on('change', '#vl_as_sl_app_supervisor', function() {
        $('#vl_as_sl_app_supervisor_err').html('');
    }); 
}

function save_vl_as_sl() {
    $('body').on('click', '#vl_as_sl_save_application', function() {
        var checker = false;
        var balance = $('#vl_as_sl_balance').val();
        var details = $('#vl_as_sl_app_details').val();
        var specify = $('#vl_as_sl_app_specify').val();
        var date = $('#vl_as_sl_leave_date_range').val();
        var days = $('#vl_as_sl_working_days').val();
        var commutation = $('#vl_as_sl_app_commutation').val();
        var supervisor = $('#vl_as_sl_app_supervisor').val();
        var super_ext = $('#vl_as_sl_app_supervisor_ext').val();
        var files = uploadedAttachments_vl_as_sl.getFiles();
        var btn = $(this);

        if (details == null) {
            $('#vl_as_sl_app_details').addClass('border-danger');
            $('#vl_as_sl_app_details_err').html('Please select');
            checker = true;
        }
        if (specify.trim().length > 13 || specify.trim() == '') {
            $('#vl_as_sl_app_specify').addClass('border-danger');
            $('#vl_as_sl_app_specify_err').html('Limited to 13 letters only.');
            checker = true;
        }
        if (date.trim() == '') {
            $('#vl_as_sl_leave_date_range').addClass('border-danger');
            $('#vl_as_sl_leave_date_range_err').html('Please select date range.');
            checker = true;
        }
        if (commutation == null) {
            $('#vl_as_sl_app_commutation').addClass('border-danger');
            $('#vl_as_sl_app_commutation_err').html('Please select');
            checker = true;
        }
        if (supervisor == null) {
            $('#vl_as_sl_app_supervisor_err').html('Please select supervisor');
            checker = true;
        }
        if (days > 4) {
            if (files.length === 0) {
                __notif_show(-1, 'Incomplete', 'Upload files that will support your statement');
                checker = true;
            }
        }
        if (days < 1 || days.trim() == '') {
            $('#vl_as_sl_working_days').addClass('border-danger');
            $('#vl_as_sl_working_days_err').html('Working days must be greater to 1');
            checker = true;
        }

        if (parseFloat(days) > parseFloat(balance)) {
            $('#vl_as_sl_working_days').addClass('border-danger');
            $('#vl_as_sl_working_days_err').html('The number of days applied for exceeds the available leave.');
            checker = true;
        }
        
        if (!checker) {
            const start_date = filter_date_from_vl_as_sl.getStartDate('YYYY-MM-DD'),
                end_date = filter_date_from_vl_as_sl.getEndDate('YYYY-MM-DD');

            var start = getDateFormat(start_date);
            var end = getDateFormat(end_date);

            var formData = new FormData();
            formData.append('details', details);
            formData.append('specify', specify);
            formData.append('start', start);
            formData.append('end', end);
            formData.append('days', days);
            formData.append('commutation', commutation);
            formData.append('supervisor', supervisor);
            formData.append('super_ext', super_ext);

            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/leave/sl_as_vl_application",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Appyling</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        load_available_leave();
                        load_table(1, '', '', '');
                        close_modal('#leave_application_vl_as_sl_modal');
                        $('#vl_as_sl_leave_date_range').val('');
                        $('#vl_as_sl_working_days').val('');
                        $('#vl_as_sl_app_supervisor').val('').trigger('change');
                        uploadedAttachments_vl_as_sl.removeFiles();
                    } else if (response == 'exist') {
                        $('#vl_as_sl_leave_date_range').addClass('border-danger');
                        $('#vl_as_sl_leave_date_range_err').html('You already have leave in this date.');
                    } else if (response == 'not_employed') {
                        close_modal('#leave_application_vl_as_sl_modal');
                        __notif_show(-3, 'You are not Employed', 'Contact the HR to be employed.');
                    } else if (response == 'not_assigned') {
                        close_modal('#leave_application_vl_as_sl_modal');
                        __notif_show(-3, 'Campus not assigned', 'Contact the HR to be assign to a campus.');
                    } else if (response == 'sig_not_set') {
                        close_modal('#leave_application_vl_as_sl_modal');
                        __notif_show(-3, 'Signatory not set', 'Contact the HR to be set signatory to a campus.');
                    } else {
                        $('#vl_as_sl_leave_date_range').addClass('border-danger');
                        $('#vl_as_sl_leave_date_range_err').html(response + ' onwards are allowed.');
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

function vl_as_sl_calculate_days() {
    filter_date_from_vl_as_sl.on('selected',function(date){
        //extract the date from the calendar
        const start_date = filter_date_from_vl_as_sl.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from_vl_as_sl.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        $.ajax({
            url: "/leave/calculate_days",
            type: "POST",
            dataType: "json",
            data: {
                start: start,
                end: end
            },
            beforeSend: function() {
                $('#vl_as_sl_days_calculating_load').css('display', 'inline');
            },
            success: function (response) {
                $('#vl_as_sl_days_calculating_load').css('display', 'none');
                $('#vl_as_sl_working_days').val(response);
                $('#vl_as_sl_leave_date_range').removeClass('border-danger');
                $('#vl_as_sl_leave_date_range_err').html('');
                $('#vl_as_sl_working_days').removeClass('border-danger');
                $('#vl_as_sl_working_days_err').html('');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function monetization() {
    $('body').on('click', '#monetization_btn', function() {
        construction_modal();
    });
}

function terminal_leave() {
    $('body').on('click', '#terminal_btn', function() {
        open_modal('#terminal_leave_modal');
        $.ajax({
            url: "/leave/terminal_leave_computation",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $('#terminal_leave_modal_body').html(`
                <div class="text-left">Computation:</div>
                <div class="text-center text-base border py-2 px-5 rounded">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            },
            success: function (response) {
                $('#terminal_leave_modal_body').html(response);
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });
}

function force_leave_reason() {
    $('body').on('click', '#force_leave_reason', function() {
        close_modal('#force_leave_notification');
        open_modal('#eo1077_modal');
    });

    $('body').on('click', '.how_fl_earned', function() {
        close_modal('#eo1077_modal');
        close_modal('#vl_commutation_modal');
        open_modal('#fl_earned_modal');
    });
}

function vl_fl_computation() {
    $('body').on('click', '.vl_fl_computation', function() {
        var vl = $(this).data('vl');
        var force = $(this).data('force');
        var total = $(this).data('total');
        var remaining = $(this).data('remaining');

        $('#vl_commutation_compute').html(`${vl} <span class="ml-3 mr-3">-</span> ${total} <span class="ml-3 mr-3">=</span> <span class="font-bold">${remaining}</span>`);
        $('#vl_commutation_total').html(remaining);
        open_modal('#vl_commutation_modal');
    });
}

function vl_and_sl_datepicker_initialization() {
    let element_id = 'vl_and_sl_leave_date_range';

    filter_date_from_vl_and_sl = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        startDate: new Date(),
        format: 'MMM DD, YYYY ',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });
}

function sick_leave_and_vl() {
    $('body').on('click', '.apply_two_types', function() {
        var sl = $(this).data('sickl');
        var vl = $(this).data('vacl');
        $('#vl_and_sl_sick_leave_balance').val(sl);
        $('#vl_and_sl_vl_balance').val(vl);
        open_modal('#leave_application_vl_and_sl_modal');
    });

    $('body').on('change', '#vl_and_sl_app_details', function() {
        $('#vl_and_sl_app_details').removeClass('border-danger');
        $('#vl_and_sl_app_details_err').html('');
    });

    $('body').on('input', '#vl_and_sl_app_specify', function() {
        $('#vl_and_sl_app_specify').removeClass('border-danger');       
        $('#vl_and_sl_app_specify_err').html('');
    });

    $('body').on('change', '#vl_and_sl_app_supervisor', function() {
        $('#vl_and_sl_app_supervisor_err').html('');
    });
}

function save_vl_and_sl() {
    $('body').on('click', '#vl_and_sl_save_application', function() {
        var checker = false;
        var sl_balance = $('#vl_and_sl_sick_leave_balance').val();
        var vl_balance = $('#vl_and_sl_vl_balance').val();
        var details = $('#vl_and_sl_app_details').val();
        var specify = $('#vl_and_sl_app_specify').val();
        var date = $('#vl_and_sl_leave_date_range').val();
        var days = $('#vl_and_sl_working_days').val();
        var commutation = $('#vl_and_sl_app_commutation').val();
        var supervisor = $('#vl_and_sl_app_supervisor').val();
        var super_ext = $('#vl_and_sl_app_supervisor_ext').val();
        var files = uploadedAttachments_vl_and_sl.getFiles();
        var btn = $(this);

        if (details == null) {
            $('#vl_and_sl_app_details').addClass('border-danger');
            $('#vl_and_sl_app_details_err').html('Please select');
            checker = true;
        }
        if (specify.trim().length > 13 || specify.trim() == '') {
            $('#vl_and_sl_app_specify').addClass('border-danger');
            $('#vl_and_sl_app_specify_err').html('Limited to 13 letters only.');
            checker = true;
        }
        if (date.trim() == '') {
            $('#vl_and_sl_leave_date_range').addClass('border-danger');
            $('#vl_and_sl_leave_date_range_err').html('Please select date range.');
            checker = true;
        }
        if (commutation == null) {  
            $('#vl_and_sl_app_commutation').addClass('border-danger');
            $('#vl_and_sl_app_commutation_err').html('Please select');
            checker = true;
        }
        if (supervisor == null) {
            $('#vl_and_sl_app_supervisor_err').html('Please select supervisor');
            checker = true;
        }
        if (days > 4) {
            if (files.length === 0) {
                __notif_show(-1, 'Incomplete', 'Upload files that will support your statement');
                checker = true;
            }
        }
        if (days < 1 || days.trim() == '') {
            $('#vl_and_sl_working_days').addClass('border-danger');
            $('#vl_and_sl_working_days_err').html('Working days must be greater to 1');
            checker = true;
        }

        var balance = parseFloat(sl_balance) + parseFloat(vl_balance);
        if (parseFloat(days) > balance) {
            $('#vl_and_sl_working_days').addClass('border-danger');
            $('#vl_and_sl_working_days_err').html('The number of days applied for exceeds the available leave.');
            checker = true;
        }
       
        if (!checker) {
            const start_date = filter_date_from_vl_and_sl.getStartDate('YYYY-MM-DD'),
                end_date = filter_date_from_vl_and_sl.getEndDate('YYYY-MM-DD');

            var start = getDateFormat(start_date);
            var end = getDateFormat(end_date);

            var formData = new FormData();
            formData.append('details', details);
            formData.append('specify', specify);
            formData.append('start', start);
            formData.append('end', end);
            formData.append('days', days);
            formData.append('commutation', commutation);
            formData.append('supervisor', supervisor);
            formData.append('super_ext', super_ext);

            files.forEach(function(file) {
                formData.append('files[]', file.file);
            });

            $.ajax({
                url: "/leave/vl_and_sl_application",
                type: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Appyling</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Apply');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        load_available_leave();
                        load_table(1, '', '', '');
                        close_modal('#leave_application_vl_and_sl_modal');
                        $('#vl_and_sl_leave_date_range').val('');
                        $('#vl_and_sl_working_days').val('');
                        $('#vl_and_sl_app_supervisor').val('').trigger('change');
                        uploadedAttachments_vl_and_sl.removeFiles();
                    } else if (response == 'exist') {
                        $('#vl_and_sl_leave_date_range').addClass('border-danger');
                        $('#vl_and_sl_leave_date_range_err').html('You already have leave in this date.');
                    } else if (response == 'not_employed') {
                        close_modal('#leave_application_vl_and_sl_modal');
                        __notif_show(-3, 'You are not Employed', 'Contact the HR to be employed.');
                    } else if (response == 'not_assigned') {
                        close_modal('#leave_application_vl_and_sl_modal');
                        __notif_show(-3, 'Campus not assigned', 'Contact the HR to be assign to a campus.');
                    } else if (response == 'sig_not_set') {
                        close_modal('#leave_application_vl_and_sl_modal');
                        __notif_show(-3, 'Signatory not set', 'Contact the HR to be set signatory to a campus.');
                    } else {
                        $('#vl_and_sl_leave_date_range').addClass('border-danger');
                        $('#vl_and_sl_leave_date_range_err').html(response + ' onwards are allowed.');
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

function vl_and_sl_calculate_days() {
    filter_date_from_vl_and_sl.on('selected',function(date){
        //extract the date from the calendar
        const start_date = filter_date_from_vl_and_sl.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from_vl_and_sl.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        $.ajax({
            url: "/leave/calculate_days",
            type: "POST",
            dataType: "json",
            data: {
                start: start,
                end: end
            },
            beforeSend: function() {
                $('#vl_and_sl_days_calculating_load').css('display', 'inline');
            },
            success: function (response) {
                $('#vl_and_sl_days_calculating_load').css('display', 'none');
                $('#vl_and_sl_working_days').val(response);
                $('#vl_and_sl_leave_date_range').removeClass('border-danger');
                $('#vl_and_sl_leave_date_range_err').html('');
                $('#vl_and_sl_working_days').removeClass('border-danger');
                $('#vl_and_sl_working_days_err').html('');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}
