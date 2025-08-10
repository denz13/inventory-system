$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var num_days = '';
let table_page = 1;

$(document).ready(function() {
    let timeout;
    num_days_initialize();
    // encode_employee();
    // Table Controller
    load_table(1, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
    change_date();
    change_status();
    search_emp();
    pagination_ctrl();

    // Encoded Logs
    load_logs();

    // Encode Ledger
    encode_ledger_btn();
    change_num_days();
    custom_change_date();
    looks_good_btn();

    // Custom Tardiness
    custom_tardiness();
    looks_good_tardiness();
    remove_tardiness_x();
    remove_all_tardiness_x();
    add_date_in_custom_tardiness();
    error_handler_custom_tardiness();
    view_lwop_btn();
    insert_tardiness();
    save_ledger();

    // Counter
    load_counter($('#table_month').val());

    // Encoded employee
    employee_done_encode();
    view_balance();
    delete_encoded_ledger();

    // Message
    message_employee();

    // New Employee
    new_employee();
    new_employee_error_handler();
});

function num_days_initialize() {
    let element_id = 'num_days_val';

    num_days = new Litepicker({
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

function message_employee() {
    $('body').on('click', '#message_employee_ledger', function() {
        var id = $('#employee_agencyid').html();
        var name = $('#employee_name').html();
        bom_global_messaging(id, name);
    });
}

function load_table(page, search, month, status) {
    $.ajax({
        url: "/leave/load_emp_ledger_table",
        type: "POST",
        dataType: "json",
        data: {
            page: page,
            search: search,
            month: month,
            status: status
        },
        beforeSend: function() {
            $('#table_container').html(`
            <div class="intro-y col-span-12">
                <div class="box p-5 flex justify-center">
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
                </div>
            </div>`);
        },
        success: function (response) {
            $('#table_container').html(response.html);
            $('#table_summary').html(response.summary);
            table_pagination(response, '#table_pagination');
            table_page = page;
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.log(xhr.responseText);
        }
    });
}

function change_date() {
    $('body').on('change', '#table_month', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
            load_counter($('#table_month').val());
            load_logs();
        }, 500);
    });
}

function change_status() {
    $('body').on('change', '#table_status', function() {
        load_table(1, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
    });
}

function search_emp() {
    $('body').on('input', '#table_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
        }, 500);
    });
}

function pagination_ctrl() {
    $('body').on('click', '#table_pagination a', function() {
        const page = $(this).data('page');
        load_table(page, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
    });
}

function load_logs() {
    var selectedMonth = $('#table_month').val();
    if (!selectedMonth) {
        // Get the current month in YYYY-MM format
        var today = new Date();
        var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
        selectedMonth = currentMonth;
    }

    $.ajax({
        url: "/leave/load_ledger_logs",
        type: "POST",
        dataType: "json",
        data: {selectedMonth: selectedMonth},
        beforeSend: function() {
            $('#ledger_logs_container').html(`
            <div class="intro-y">
                <div class="box flex justify-center py-5">
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
                </div>
            </div>`);
        },
        success: function (response) {
            $('#ledger_logs_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.log(xhr.responseText);
        }
    });
}

function load_counter(month) {
    $.ajax({
        url: "/leave/load_emp_ledger_counter",
        type: "POST",
        dataType: "json",
        data: {month: month},
        beforeSend: function() {
            $('#counter_container').html(`
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
            $('#counter_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function encode_employee() {
    $.ajax({
        url: "/leave/encode_employee",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
        },
        success: function (response) {
            alert(response)
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function prev_ledger_details(agencyid, classification) {
    var month = $('#table_month').val();
    $.ajax({
        url: "/leave/prev_ledger_details",
        type: "POST",
        dataType: "json",
        data: {
            month: month, 
            agencyid: agencyid, 
            classification: classification
        },
        beforeSend: function() {
            // $('#go_back_btn').prop('disabled', true);
            // $('#message_employee_ledger').prop('disabled', true);
            $('#leave_application_container').html(`
            <div class="flex p-5 justify-center">
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
            // $('#go_back_btn').prop('disabled', false);
            // $('#message_employee_ledger').prop('disabled', false);
            $('#leave_application_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function encode_ledger_btn() {
    $('body').on('click', '.encode_ledger_btn', function() {
        var agencyid = $(this).data('agencyid');
        var classification = $(this).data('class');
        $('#employee_container').toggle();
        $('#encoding_container').toggle();

        if (classification == 'admin') {
            prev_ledger_details(agencyid, 'admin');
        } else {
            prev_ledger_details(agencyid, 'instructor');
        }
    });

    $('body').on('click', '#go_back_btn', function() {
        $('#employee_container').toggle();
        $('#encoding_container').toggle();
    });
}

function change_num_days() {
    $('body').on('click', '.num_days_btn', function() {
        open_modal('#change_numdays_modal');
        var classification = $('#employee_classification').html();

        if (classification == 'admin') { 
            $('#admin_earned_details_container').show();    
            $('#non_admin_earned_details_container').hide();
        } else {
            $('#admin_earned_details_container').hide();
            $('#non_admin_earned_details_container').show();
        }

        $('#num_days_val_err').html('');
        num_days.clearSelection();
        $('#custom_particulars_tardiness').val('');
        $('#custom_particulars_undertime').val('');
        $('#custom_deduction_tardiness').val('');
        $('#custom_deduction_undertime').val('');
        $('#number_days_val').val('');
        $('#vl_earned_val').val('');
        $('#sl_earned_val').val('');
        $('#sc_earned_val').val('');
    });
}

function custom_tardiness() {
    $('body').on('click', '.custom_tardiness', function() {
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        var agencyid = $('#employee_agencyid').html();
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        $.ajax({
            url: "/leave/get_tardiness",
            type: "POST",
            dataType: "json",
            data: {start: start, end: end, selectedMonth: selectedMonth, agencyid: agencyid},
            beforeSend: function() {
                $('#tard_start_date').val('');
                $('#tard_end_date').val('');
                $('#tardiness_container').html(`
                    <div class="col-span-12 flex justify-center">
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
                $('#tard_add_date').prop('disabled', true);
                $('#tard_remove_all').prop('disabled', true);
            },
            success: function (response) {
                $('#tardiness_container').html(response.html);
                $('#tard_start_date').val(response.start);
                $('#tard_end_date').val(response.end);
                $('#tard_add_date').prop('disabled', false);
                $('#tard_remove_all').prop('disabled', false);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
        open_modal('#custom_tardiness_modal');
    });
}

function looks_good_tardiness() {
    $('body').on('click', '#tardiness_looks_good_btn', function() {
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        let data = [];
        let bool = true;
        var btn = $(this);

        if ($('.custom_date_all').length > 0) {
            $('.custom_date_all').each(function() {
                let date = $(this).find('.date_val').val();
                let tardiness = $(this).find('.tardiness_val').val();
                let undertime = $(this).find('.undertime_val').val();
    
                if (date == '') {
                    $(this).find('.date_val').addClass('border-danger');
                    $(this).find('.date_val_error').html('Empty.');
                    bool = false;
                }
    
                if ((tardiness.trim() == '' || tardiness == 0) && (undertime.trim() == '' || undertime == 0)) {
                    $(this).find('.tardiness_val').addClass('border-danger');
                    $(this).find('.undertime_val').addClass('border-danger');
                    bool = false;
                } else if (date > end || date < start) {
                    $(this).find('.date_val').addClass('border-danger');
                    $(this).find('.date_val_error').html('Invalid Date');
                    bool = false;
                } else  {
                    let dateExists = data.some(item => item.date === date);
    
                    if (!dateExists) {
                        data.push({
                            date: date,
                            tardiness: tardiness,
                            undertime: undertime
                        });
                    } else {
                        bool = false;
                        $('.date_val').filter(function() {
                            return $(this).val() === date;
                        }).addClass('border-danger');
                        $(this).find('.date_val_error').html('Date repeated.');
                    }
                }
    
            });
        }

        if (bool) {
            $.ajax({
                url: "/leave/save_custom_tardiness",
                type: "POST",
                dataType: "json",
                data: {data: data},
                beforeSend: function() {
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.prop('disabled', false);
                    $('.check_tardiness').html(response.tardiness_particulars);
                    $('.check_tardiness_deduction').html(response.tardiness_deduction);
                    $('.check_undertime').html(response.undertime_particulars);
                    $('.check_undertime_deduction').html(response.undertime_deduction);

                    $('#check_tardiness_date').val(response.tardiness_date);
                    $('#check_tardiness_time').val(response.tardiness_time);
                    $('#check_undertime_date').val(response.undertime_date);
                    $('#check_undertime_time').val(response.undertime_time);
                    open_modal('#custom_tardiness_preview_modal');
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function remove_tardiness_x() {
    $('body').on('click', '.custom_tard_dlt', function() {
        $(this).parent().parent().remove();
    });
}

function remove_all_tardiness_x() {
    $('body').on('click', '#tard_remove_all', function() {
        $('#tardiness_container').empty();
    });
}

function add_date_in_custom_tardiness() {
    $('body').on('click', '#tard_add_date', function() {
        $('#tardiness_container').append(`
        <div class="flex col-span-12 items-start custom_date_all">
            <div class="mr-1" style="width: 50%;">
                <label class="text-slate-500 text-xs ml-1">Date</label>
                <input type="date" class="form-control date_val">
                <div class="text-xs text-danger text-center date_val_error"></div>
            </div>
            <div class="mr-1" style="width: 24%;">
                <label class="text-slate-500 text-xs ml-1">Tardiness</label>
                <input type="number" class="form-control text-center tardiness_val" value="0" placeholder="0">
            </div>
            <div class="mr-1" style="width: 24%;">
                <label class="text-slate-500 text-xs ml-1">Undertime</label>
                <input type="number" class="form-control text-center undertime_val" value="0" placeholder="0">
            </div>
            <div style="width: 6%;" class="text-center">
                <button class="text-danger text-xl mt-4 custom_tard_dlt"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>`);
    });
}

function error_handler_custom_tardiness() {
    $('body').on('change', '.date_val', function() {
        $(this).removeClass('border-danger');
        $(this).next().html('');
    });

    $('body').on('input', '.tardiness_val', function() {
        $(this).removeClass('border-danger');
        $(this).parent().next().find('.undertime_val').removeClass('border-danger');
    });

    $('body').on('input', '.undertime_val', function() {
        $(this).removeClass('border-danger');
        $(this).parent().prev().find('.tardiness_val').removeClass('border-danger');
    });
}

function view_lwop_btn() {
    $('body').on('click', '.view_lwop_btn', function() {
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        var agencyid = $('#employee_agencyid').html();

        open_modal('#lwop_leave_modal');

        $.ajax({
            url: "/leave/get_lwop_leave",
            type: "POST",
            dataType: "json",
            data: {start: start, end: end, agencyid: agencyid},
            beforeSend: function() {
                $('#lwop_leave_container').html(`
                    <div class="intro-x col-span-12 border rounded p-5 flex justify-center items-center">
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
                $('#lwop_leave_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function insert_tardiness() {
    $('body').on('click', '#custom_tardiness_insert', function() {
        let data = [];
        let bool = true;
        var btn = $(this);
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        var agencyid = $('#employee_agencyid').html();
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        if ($('.custom_date_all').length > 0) {
            $('.custom_date_all').each(function() {
                let date = $(this).find('.date_val').val();
                let tardiness = $(this).find('.tardiness_val').val();
                let undertime = $(this).find('.undertime_val').val();
    
                if (date == '') {
                    $(this).find('.date_val').addClass('border-danger');
                    $(this).find('.date_val_error').html('Empty.');
                    bool = false;
                }
    
                if ((tardiness.trim() == '' || tardiness == 0) && (undertime.trim() == '' || undertime == 0)) {
                    $(this).find('.tardiness_val').addClass('border-danger');
                    $(this).find('.undertime_val').addClass('border-danger');
                    bool = false;
                } else if (date > end || date < start) {
                    $(this).find('.date_val').addClass('border-danger');
                    $(this).find('.date_val_error').html('Invalid Date');
                } else  {
                    let dateExists = data.some(item => item.date === date);
    
                    if (!dateExists) {
                        data.push({
                            date: date,
                            tardiness: tardiness,
                            undertime: undertime
                        });
                    } else {
                        bool = false;
                        $('.date_val').filter(function() {
                            return $(this).val() === date;
                        }).addClass('border-danger');
                        $(this).find('.date_val_error').html('Date repeated.');
                    }
                }
            });
        }

        var tardiness_particulars = $('.check_tardiness').html();
        var tardiness_deduction = $('.check_tardiness_deduction').html();
        var tardiness_date = $('#check_tardiness_date').val();
        var tardiness_time = $('#check_tardiness_time').val();

        var undertime_particulars = $('.check_undertime').html();
        var undertime_deduction = $('.check_undertime_deduction').html();
        var undertime_date = $('#check_undertime_date').val();
        var undertime_time = $('#check_undertime_time').val();

        $.ajax({
            url: "/leave/insert_custom_tardiness",
            type: "POST",
            dataType: "json",
            data: {
                data: data,
                tardiness_particulars: tardiness_particulars,
                tardiness_deduction: tardiness_deduction,
                tardiness_date: tardiness_date,
                tardiness_time: tardiness_time,
                undertime_particulars: undertime_particulars,
                undertime_deduction: undertime_deduction,
                undertime_date: undertime_date,
                undertime_time: undertime_time,
                agencyid: agencyid,
                selectedMonth: selectedMonth
            },
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Inserting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Insert');
                $('#final_tardiness_html').html(tardiness_particulars);
                $('#final_tardiness_deduction').html(tardiness_deduction);
                $('#final_undertime_html').html(undertime_particulars);
                $('#final_undertime_deduction').html(undertime_deduction);
                close_modal('#custom_tardiness_modal');
                close_modal('#custom_tardiness_preview_modal');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function save_ledger() {
    $('body').on('click', '#save_ledger', function() {
        open_modal('#save_ledger_confirmation');
    });

    $('body').on('click', '#save_ledger_yes', function() {
        var btn = $(this);
        var agencyid = $('#employee_agencyid').html();
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        var selectedMonth = $('#table_month').val();
        var classification = $('#employee_classification').html();

        if (classification == 'admin') {
            var final_vlearned = parseFloat($('#final_vl_earned').html());
            var final_slearned = parseFloat($('#final_sl_earned').html());
        } else {
            var final_sc_earned = parseFloat($('#final_sc_earned').html());
        }

        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        if (classification == 'admin') {
            var data = {
                agencyid: agencyid,
                selectedMonth: selectedMonth,
                final_vlearned: final_vlearned,
                final_slearned: final_slearned,
                start: start,
                end: end,
                classification: classification
            }
        } else {
            var data = {
                agencyid: agencyid,
                selectedMonth: selectedMonth,
                final_sc_earned: final_sc_earned,
                start: start,
                end: end,
                classification: classification
            }

        }
       
        $.ajax({
            url: "/leave/encode_ledger",
            type: "POST",
            dataType: "json",
            data: data,
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Encoding</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Encode');
                if (response == 'success') {
                    __notif_show('3', 'Success', 'Ledger encoded.');
                    load_logs();
                    load_counter(selectedMonth);
                    $('#go_back_btn').click();
                    load_table(table_page, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
                    close_modal('#save_ledger_confirmation');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function custom_change_date() {
    num_days.on('selected', function(date){
        const start_date = num_days.getStartDate('YYYY-MM-DD'),
            end_date = num_days.getEndDate('YYYY-MM-DD');

        var start = bom_date_format(start_date);
        var end = bom_date_format(end_date);
        var agencyid = $('#employee_agencyid').html();
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        var startMonth = start.substring(0, 7);
        var endMonth = end.substring(0, 7);
        var classification = $('#employee_classification').html();

        if (startMonth === selectedMonth && endMonth === selectedMonth) {
            // $('#ledger_start_date').val(start);
            // $('#ledger_end_date').val(end);
            $('#num_days_val_err').html('');

            $.ajax({
                url: "/leave/ledger_custom_date",
                type: "POST",
                dataType: "json",
                data: {
                    selectedMonth: selectedMonth,
                    agencyid: agencyid,
                    classification: classification,
                    start: start,
                    end: end,
                    delete_custom: 'no'
                },
                beforeSend: function() {
                    $('#looks_good_btn').prop('disabled', true);
                },
                success: function (response) {
                    $('#looks_good_btn').prop('disabled', false);
                    $('#custom_particulars_tardiness').val(response.tardiness_html);
                    $('#custom_particulars_undertime').val(response.undertime_html);
                    $('#custom_deduction_tardiness').val(response.tardiness_deduction);
                    $('#custom_deduction_undertime').val(response.undertime_deduction);
                    $('#number_days_val').val(response.num_days);
                    $('#vl_earned_val').val(response.vl_earned);
                    $('#sl_earned_val').val(response.sl_earned);
                    $('#sc_earned_val').val(response.sc_earned);
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        } else {
            $('#num_days_val_err').html('Month selected is invalid.');
        }
    });
}

function looks_good_btn() {
    $('body').on('click', '#looks_good_btn', function() {
        var daterange = $('#num_days_val').val();
        var error = $('#num_days_val_err').html();
        var classification = $('#employee_classification').html();
        var btn = $(this);

        if (error.trim() == '') {
            if (daterange.trim() == '') {
                $('#num_days_val_err').html('Please select date range.');
            } else {
                var agencyid = $('#employee_agencyid').html();
                var selectedMonth = $('#table_month').val();
                if (!selectedMonth) {
                    // Get the current month in YYYY-MM format
                    var today = new Date();
                    var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
                    selectedMonth = currentMonth;
                }

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

                    $.ajax({
                        url: "/leave/ledger_custom_date",
                        type: "POST",
                        dataType: "json",
                        data: {
                            selectedMonth: selectedMonth,
                            agencyid: agencyid,
                            classification: classification,
                            start: formattedStartDate,
                            end: formattedEndDate,
                            delete_custom: 'yes'
                        },
                        beforeSend: function() {
                            btn.prop('disabled', true);
                            btn.html('<span class="fa-fade">Inserting</span>');
                        },
                        success: function (response) {
                            btn.prop('disabled', false);
                            btn.html('Looks Good');
                            $('#ledger_start_date').val(formattedStartDate);
                            $('#ledger_end_date').val(formattedEndDate);
                            $('#final_tardiness_html').html(response.tardiness_html);
                            $('#final_undertime_html').html(response.undertime_html);
                            $('#final_tardiness_deduction').html(response.tardiness_deduction);
                            $('#final_undertime_deduction').html(response.undertime_deduction);
                            $('#final_days').html(response.num_days);
                            $('#final_vl_earned').html(response.vl_earned);
                            $('#final_sl_earned').html(response.sl_earned);
                            $('#final_sc_earned').html(response.sc_earned);
                            close_modal('#change_numdays_modal');
                        },
                        error: function(xhr, status, error) {
                            alert(xhr.responseText);
                        }
                    });
                } else {
                    $('#num_days_val_err').html('Date range format is incorrect.');
                }
            }
        } else {
            __notif_show(-3, 'Error', error);
        }
    });
}

function employee_done_encode() {
    $('body').on('click', '.encoded_btn', function() {
        var agencyid = $(this).data('agencyid');
        var classification = $(this).data('classification');
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }
        open_modal('#encoded_ledger_modal');
        $.ajax({
            url: "/leave/view_encoded_ledger",
            type: "POST",
            dataType: "json",
            data: {
                agencyid: agencyid,
                selectedMonth: selectedMonth,
                classification: classification
            },
            beforeSend: function() {
                $('#view_encoded_ledger_container').html(`
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
                $('#view_encoded_ledger_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function view_balance() {
    $('body').on('click', '.employee_view_balance', function() {
        var agencyid = $(this).data('agencyid');
        open_modal('#employee_balance_modal');
        $.ajax({
            url: "/leave/ledger_available_balance",
            type: "POST",
            dataType: "json",
            data: {agencyid: agencyid},
            beforeSend: function() {
                $('#available_balance_container').html(`
                <div class="intro-x col-span-12 py-3 px-5 border rounded flex justify-center">
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
                $('#available_balance_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function delete_encoded_ledger() {
    $('body').on('click', '.delete_encoded_ledger', function() {
        var agencyid = $(this).data('agencyid');
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }
        open_modal('#delete_ledger_modal');

        $.ajax({
            url: "/leave/check_delete_ledger",
            type: "POST",
            dataType: "json",
            data: {
                agencyid: agencyid,
                selectedMonth: selectedMonth
            },
            beforeSend: function() {
                $('#check_delete_container').html(`
                <div class="p-5 flex justify-center">
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
                $('#check_delete_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '.delete_ledger_btn', function() {
        var btn = $(this);
        var agencyid = $(this).data('agencyid');
        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        $.ajax({
            url: "/leave/delete_encoded_ledger",
            type: "POST",
            dataType: "json",
            data: {
                agencyid: agencyid,
                selectedMonth: selectedMonth
            },
            beforeSend: function() {
                btn.html('<span class="fa-fade">Deleting</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Delete');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#delete_ledger_modal');
                    close_modal('#encoded_ledger_modal');
                    load_table(table_page, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
                    __notif_show(3, 'Success', 'Ledger deleted.');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function new_employee() {
    $('body').on('click', '#encode_new_emp', function() {
        $('#new_employee_start_date').val('');
        $('#new_employee_end_date').val('');
        clear_new_employee_error();
        open_modal('#new_employee_modal');
    });

    $('body').on('click', '#new_employee_proceed', function() {
        var bool = true;    
        var employee_id = $('#new_employee_id').val();
        var start_date = $('#new_employee_start_date').val();
        var end_date = $('#new_employee_end_date').val();
        var classification = $('#new_employee_classification').val();
        var btn = $(this);

        if (employee_id == null) {
            bool = false;
            $('#new_employee_id').addClass('border-danger');
            $('#new_employee_id_error').html('Please select employee.');
        }

        if (classification == null) {
            bool = false;
            $('#new_employee_classification').addClass('border-danger');
            $('#new_employee_classification_error').html('Please select classification.');
        }

        if (start_date == '') {
            bool = false;
            $('#new_employee_start_date').addClass('border-danger');
            $('#new_employee_start_date_error').html('Please select start date.');
        }

        if (end_date == '') {
            bool = false;
            $('#new_employee_end_date').addClass('border-danger');
            $('#new_employee_end_date_error').html('Please select end date.');
        }

        if (start_date > end_date) {
            bool = false;
            $('#new_employee_start_date').addClass('border-danger');
            $('#new_employee_end_date').addClass('border-danger');
            $('#new_employee_start_date_error').html('Start date cannot be greater than end date.');
            $('#new_employee_end_date_error').html('End date cannot be greater than start date.');
        }

        if (start_date == end_date) {
            bool = false;
            $('#new_employee_start_date').addClass('border-danger');
            $('#new_employee_end_date').addClass('border-danger');
            $('#new_employee_start_date_error').html('Start date cannot be equal to end date.');
            $('#new_employee_end_date_error').html('End date cannot be equal to start date.');
        }

        // if month is not the same make bool = false
        var start_month = new Date(start_date).getMonth();
        var start_year = new Date(start_date).getFullYear();
        var end_month = new Date(end_date).getMonth();
        var end_year = new Date(end_date).getFullYear();

        if (start_month !== end_month || start_year !== end_year) {
            bool = false;
            $('#new_employee_start_date').addClass('border-danger');
            $('#new_employee_end_date').addClass('border-danger');
            $('#new_employee_start_date_error').html('Start and end dates must be in the same month.');
            $('#new_employee_end_date_error').html('Start and end dates must be in the same month.');
        }

        if (bool) {
            $.ajax({
                url: "/leave/new_ledger_details",
                type: "POST",
                dataType: "json",
                data: {
                    agencyid: employee_id, 
                    classification: classification,
                    start_date: start_date,
                    end_date: end_date
                },
                beforeSend: function() {
                    $('#leave_application_container').html(`
                    <div class="flex p-5 justify-center">
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
                    btn.html('<span class="fa-fade">Calculating</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Proceed');
                    btn.prop('disabled', false);
                    if (response == 'exists') {
                        $('#new_employee_id').addClass('border-danger');
                        $('#new_employee_id_error').html('Employee ledger already exists.');
                    } else {
                        $('#employee_container').toggle();
                        $('#encoding_container').toggle();
                        close_modal('#new_employee_modal');
                        $('#leave_application_container').html(response);
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('click', '#save_new_ledger', function() {
        open_modal('#save_new_ledger_confirmation');
    });

    $('body').on('click', '#save_new_ledger_yes', function() {
        var btn = $(this);
        var agencyid = $('#employee_agencyid').html();
        var start = $('#ledger_start_date').val();
        var end = $('#ledger_end_date').val();
        var classification = $('#employee_classification').html();

        var selectedMonth = $('#table_month').val();
        if (!selectedMonth) {
            // Get the current month in YYYY-MM format
            var today = new Date();
            var currentMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            selectedMonth = currentMonth;
        }

        if (classification == 'admin') {
            var final_vlearned = parseFloat($('#final_vl_earned').html());
            var final_slearned = parseFloat($('#final_sl_earned').html());
        } else {
            var final_sc_earned = parseFloat($('#final_sc_earned').html());
        }

        if (classification == 'admin') {
            var data = {
                agencyid: agencyid,
                final_vlearned: final_vlearned,
                final_slearned: final_slearned,
                start: start,
                end: end,
                classification: classification
            }
        } else {
            var data = {
                agencyid: agencyid,
                final_sc_earned: final_sc_earned,
                start: start,
                end: end,
                classification: classification
            }
        }
       
        $.ajax({
            url: "/leave/encode_new_ledger",
            type: "POST",
            dataType: "json",
            data: data,
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Encoding</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Encode');
                if (response == 'success') {
                    __notif_show('3', 'Success', 'Ledger encoded.');
                    load_logs();
                    load_counter(selectedMonth);
                    $('#go_back_btn').click();
                    load_table(table_page, $('#table_search').val(), $('#table_month').val(), $('#table_status').val());
                    close_modal('#save_new_ledger_confirmation');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function new_employee_error_handler() {
    $('body').on('change', '#new_employee_start_date', function() {
        clear_new_employee_error();
    });

    $('body').on('change', '#new_employee_end_date', function() {
        clear_new_employee_error();
    });

    $('body').on('change', '#new_employee_id', function() {
        clear_new_employee_error();
    });

    $('body').on('change', '#new_employee_classification', function() {
        clear_new_employee_error();
    });
}

function clear_new_employee_error() {
    $('#new_employee_id').removeClass('border-danger');
    $('#new_employee_id_error').html('');
    $('#new_employee_start_date').removeClass('border-danger');
    $('#new_employee_start_date_error').html('');
    $('#new_employee_end_date').removeClass('border-danger');
    $('#new_employee_end_date_error').html('');
    $('#new_employee_classification').removeClass('border-danger');
    $('#new_employee_classification_error').html('');
}

