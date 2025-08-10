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

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {

    var today = new Date();

    // Create a new date object for the first day of the current month
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Function to format date as yyyy-mm-dd
    function formatDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if necessary
        var day = ('0' + date.getDate()).slice(-2); // Add leading zero if necessary
        return year + '-' + month + '-' + day;
    }

    // Get formatted first day of the month and current day
    var firstDayFormatted = formatDate(firstDayOfMonth);
    var currentDayFormatted = formatDate(today);

    bind_events();

    // bom_load_dtr();
    bom_initialize();
    bom_date_change();
    bom_load_dtr();
    bom_send_request();
    bom_table_justification();
    error_handler();
    // dtr_justification_data();
    leave_details();

    load_default_dates();
    load_data_dtr(currentDayFormatted, currentDayFormatted);
});

var  _token = $('meta[name="csrf-token"]').attr('content');
var  bpath = $('meta[name="basepath"]').attr('content') + "/";
var tbldata;
var tbldata_skills;
var tbldata_skills_add;
var tbldata_reqs;
var tbldata_reqs_add;

function bind_events() {
    try{
        $('.b_action').unbind();
    }catch(err){}
    try{
    $(".b_action").on('click', function(event){
        /***/
        check_action($(this));
        /***/
    });
    }catch(err){}
}

function bind_events_2() {
    try{
        $('.b_action_2').unbind();
    }catch(err){}
    try{
    $(".b_action_2").on('click', function(event){
        /***/
        check_action($(this));
        /***/
    });
    }catch(err){}
}

function bind_tooltip() {
    try{
        //$('.tooltip').unbind();
    }catch(err){}
    try{
        $('.tooltip').tooltipster();
    }catch(err){}
}

function dtr_justification_data() {
    $('body').on('click', '.justification_btn', function() {
        var id = $(this).data('just');
        open_modal('#dtr_justification_modal_final');
        $.ajax({
            url: "/dtr/justification_details_dtr_final",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#just_details_mdl_body_final').html(`
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
                $('#just_details_mdl_body_final').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function leave_details() {
    $('body').on('click', '.dtr_leave_btn', function() {
        var id = $(this).data('id');
        $.ajax({
            url: "/dtr/leave_details",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                if (response.status == 'print') {
                    let url = `/leave/print_leave?id=${response.id}`;
                    window.open(url,'_blank');
                } else {
                    $('#leave_attachment_container').html(response.attachment);
                    $('#leave_modal_btn_container').html(response.button);
                    open_modal('#dtr_leave_modal');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '.leave_print_modal', function() {
        var id = $(this).data('id');
        let url = `/leave/print_leave?id=${id}`;
        window.open(url,'_blank');
    });
}

function check_action(src) {
    try{
        var data_type = src.attr("data-type");
        var data_target = src.attr("data-target");
        /***/
        if(data_type != null) {
            /***/
            if(data_type.trim().toLowerCase() == "action".trim().toLowerCase()) {

                if(data_target.trim().toLowerCase() == "load-dtr".trim().toLowerCase()) {
                    /***/
                    load_data_dtr();
                    /***/
                }

                if(data_target.trim().toLowerCase() == "print-dtr".trim().toLowerCase()) {
                    /***/
                    print_dtr();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "print-dtr-w-remarks".trim().toLowerCase()) {
                    /***/
                    print_dtr_w_remarks();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "print-dtr-w-total".trim().toLowerCase()) {
                    /***/
                    print_dtr_w_total();
                    /***/
                }

            }
            /***/
        }
        /***/
    }catch(err){}
}

// Bom
function load_default_dates() {
    try{

        var datefrom = $('#' + 'date_from');
        var dateto = $('#' + 'date_to');

        try{
            if(datefrom == null || datefrom == undefined || datefrom.val().trim() == "") {
                var date = new Date();
                var year = "" + date.getFullYear();
                var month = "" + (date.getMonth() + 1);
                var day = "" + date.getDate();
                day = "01";
                if(year.length < 2) {
                    year = "0" + year;
                }
                if(month.length < 2) {
                    month = "0" + month;
                }
                if(day.length < 2) {
                    day = "0" + day;
                }
                var tv = year + "-" + month + "-" + day;
                datefrom.val(tv);
            }
        }catch(err){  }

        try{
            if(dateto == null || dateto == undefined || dateto.val().trim() == "") {
                var date = new Date();
                var year = "" + date.getFullYear();
                var month = "" + (date.getMonth() + 1);
                var day = "" + date.getDate();
                if(year.length < 2) {
                    year = "0" + year;
                }
                if(month.length < 2) {
                    month = "0" + month;
                }
                if(day.length < 2) {
                    day = "0" + day;
                }
                var tv = year + "-" + month + "-" + day;
                dateto.val(tv);
            }
        }catch(err){  }

    }catch(err){}
}

// Bom
function bom_initialize() {
    let element_id = 'bom_date';

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

// Bom
function bom_load_dtr() {
    $('body').on('click', '#bom_load_btn', function() {
        var daterange = $('#bom_date').val();
        if (daterange.trim() == '') {
            __notif_show(-3, 'Empty', 'Please select date.');
        } else {
            var dates = daterange.split(' - ');
            if (dates.length === 2) {
                var startDateStr = dates[0].trim();
                var endDateStr = dates[1].trim();

                // Parse the dates using JavaScript's Date object
                var startDate = new Date(startDateStr);
                var endDate = new Date(endDateStr);

                // Function to format the date into yyyy-mm-dd
                function formatDate(date) {
                    var year = date.getFullYear();
                    var month = String(date.getMonth() + 1).padStart(2, '0');
                    var day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                // Format the start and end dates
                var formattedStartDate = formatDate(startDate);
                var formattedEndDate = formatDate(endDate);

                load_data_dtr(formattedStartDate, formattedEndDate);
            } else {
                console.error("Date range format is incorrect.");
            }
        }
    });
}

// Bom
function load_data_dtr(datefrom,dateto) {

    try{

        var uid = "";
        // var datefrom = $('#' + 'date_from').val();
        // var dateto = $('#' + 'date_to').val();
        var month = true;

        var databody = $('#' + 'dtr-data');
        databody.html('');

        var fromDate = new Date(datefrom);
        var toDate = new Date(dateto);
        var fromMonth = fromDate.getMonth();
        var toMonth = toDate.getMonth();

        if (fromMonth !== toMonth) {
            month = false;
        } else {
            month = true;
        }
        if (month) {
            if (datefrom > dateto) {
                databody.html(`<tr><td colspan="7" style="text-align: center;" class="box"><b>DATE FROM</b> must not be greater than <b>DATE TO</b></td></tr>`);
            } else {
                $.ajax({
                    url: bpath + 'dtr/my/data/get',
                    type: "POST",
                    data: {
                        '_token': _token,
                        'uid': uid,
                        'datefrom': datefrom,
                        'dateto': dateto,
                    },
                    beforeSend: function() {
                        databody.html(`<tr><td colspan="7" style="text-align: center;" class="box">Loading <i class="fa-solid fa-spinner fa-spin"></i></td></tr>`);
                    },
                    success: function(response) {
                        /***/

                        var data = (response);

                        databody.html(data);

                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }
        } else {
            databody.html(`<tr><td colspan="7" style="text-align: center;" class="box">Month must be the same</td></tr>`);
        }

    }catch(err){  }

}

// Bom
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

// Bom
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

// Bom
function bom_date_change() {
    filter_date_from.on('selected',function(date){
        let convert_start_date = '',
            convert_end_date = '';
        //extract the date from the calendar
        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        load_data_dtr(start, end);
    });
}

// Bom
function print_dtr() {
    try{
        var daterange = $('#bom_date').val();
        if (daterange.trim() == '') {
            __notif_show(-3, 'Empty', 'Please select date.');
        } else {
            var dates = daterange.split(' - ');
            if (dates.length === 2) {
                var startDateStr = dates[0].trim();
                var endDateStr = dates[1].trim();

                // Parse the dates using JavaScript's Date object
                var startDate = new Date(startDateStr);
                var endDate = new Date(endDateStr);

                // Function to format the date into yyyy-mm-dd
                function formatDate(date) {
                    var year = date.getFullYear();
                    var month = String(date.getMonth() + 1).padStart(2, '0');
                    var day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                // Format the start and end dates
                var formattedStartDate = formatDate(startDate);
                var formattedEndDate = formatDate(endDate);

                var url = bpath + "dtr/my/print?" + "datefrom=" + formattedStartDate + "&dateto=" + formattedEndDate + "&ft=" + "48";
                window.open(url);
            } else {
                console.error("Date range format is incorrect.");
            }
        }
    }catch(err){}
}

// Bom
function print_dtr_w_remarks() {
    try{
        var daterange = $('#bom_date').val();
        if (daterange.trim() == '') {
            __notif_show(-3, 'Empty', 'Please select date.');
        } else {
            var dates = daterange.split(' - ');
            if (dates.length === 2) {
                var startDateStr = dates[0].trim();
                var endDateStr = dates[1].trim();

                // Parse the dates using JavaScript's Date object
                var startDate = new Date(startDateStr);
                var endDate = new Date(endDateStr);

                // Function to format the date into yyyy-mm-dd
                function formatDate(date) {
                    var year = date.getFullYear();
                    var month = String(date.getMonth() + 1).padStart(2, '0');
                    var day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                // Format the start and end dates
                var formattedStartDate = formatDate(startDate);
                var formattedEndDate = formatDate(endDate);

                var url = bpath + "dtr/my/print?" + "datefrom=" + formattedStartDate + "&dateto=" + formattedEndDate + "&ft=" + "48wr";
                window.open(url);
            } else {
                console.error("Date range format is incorrect.");
            }
        }
    }catch(err){}
}

// Bom
function bom_send_request() {
    $('body').on('click', '#my_dtr_time_justification_open', function() {
        $('#req_date').prop('disabled', false);
        $('#req_when').prop('disabled', false);
        open_modal('#request_time_modal');
    });

    $('body').on('click', '#send_request', function() {
        var date = $('#req_date').val();
        var when = $('#req_when').val();
        var time = $('#req_time').val();
        var msg = $('#req_msg').val();
        var type = $('#req_type').val();
        var head = $('#req_head').val();
        var files = uploadedAttachments.getFiles();
        var btn = $(this);

        if (date.trim() == '') {
            $('#req_date').addClass('border-danger');
            $('#req_date_err').html('Please select date');
        } else if (when == null) {
            $('#req_when').addClass('border-danger');
            $('#req_when_err').html('Please select when');
        } else if (type == null) {
            $('#req_type').addClass('border-danger');
            $('#req_type_err').html('Please select type');
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
                        $('#req_type').val('');
                        $('#req_head').val('').trigger('change');
                        uploadedAttachments.removeFiles();
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

// Bom
function bom_table_justification() {
    $('body').on('click', '.tbl_justification', function() {
        var date = $(this).data('date');
        var when = $(this).data('when');
        $('#req_date').val(date);
        $('#req_when').val(when);
        $('#req_date').prop('disabled', true);
        $('#req_when').prop('disabled', true);
        open_modal('#request_time_modal');
    });
}

// Bom
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

function print_dtr_w_total() {
    try{

        var datefrom = $('#' + 'date_from').val();
        var dateto = $('#' + 'date_to').val();

        if(datefrom.trim() != "") {
            var url = bpath + "dtr/my/print?" + "datefrom=" + datefrom + "&dateto=" + dateto + "&ft=" + "48wt";
            window.open(url);
        }

    }catch(err){}
}

