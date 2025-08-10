$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let page_type_user = 1;
let hasMorePages = true;
let hard_copy_date_range = '';

$(document).ready(function() {
    let timeout;

    // Leave Earned Daily
    daily_vac_sick_show();
    $('#vac_sick_daily').click();

    // Deduction of Lates
    deduction_late_show();
    pagination_deduct();
    search_deduct();
    save_minute();
    keyup_deduct();
    compute_large_min();

    // Campus Assignment
    show_campus_assignment();
    pagination_campus_assignment();
    search_campus_assignment();
    add_new_campus();
    add_change_campus_address();
    add_assign_in_campus();
    remove_assign();

    // Campus Signatory
    show_campus_signatory();
    filter_campus();
    pagination_campus_signatory();
    search_campus_signatory();
    pagination_employee_signatory();
    search_employee_signatory();
    edit_signatory_campus();
    save_signatory_campus();
    error_remover_signatory_campus();
    set_signatory_employee_show();
    set_signatory_employee();
    signatory_records_modal();
    edit_emp_sig_on_modal();
    modal_employee_sig_record_controller();
    delete_emp_sig();
    pagination_all_record();
    search_all_rec();

    // Leave Type
    show_leave_type();
    pagination_leave_type();
    search_leave_type();
    show_types_settings();
    save_application_day();
    leave_type_what_to_input();
    type_settings_error_handler();
    show_user_settings();
    pagination_user_settings();
    search_user_settings();
    remove_user_settings();
    add_balance_user_settings();
    add_employee();
    add_new_leave_type();
    save_new_leave_type();
    error_handler_new_leave_type();
    remove_leave_type();

    // Leave Balance
    show_leave_ledger();
    pagination_leave_ledger();
    search_leave_ledger();
    set_balance();
    save_ledger_balance();
    error_handler_balance();
    update_set_balance();
    set_in_leave_type_btn();

    // Schedule
    show_schedule();
    save_schedule();

    // Service Credits
    show_service_credits();
    pagination_service_credits();
    search_service_credits();
    add_service_credits();
    add_service_credits_error_handler();
    view_earned_credits();
    pagination_view_earned_credits();
    change_month_view_earned_credits();
    service_credits_encoded_logs();
    pagination_service_credits_encoded_logs();
    search_service_credits_encoded_logs();
    change_month_service_credits_encoded_logs();

    // Conversion
    show_conversion();
    pagination_conversion();
    search_conversion();
    admin_to_instructor();
    instructor_to_admin();
    convert_pending();
    conversion_error_handler();
    conversion_logs();
    conversion_logs_pagination();
    search_conversion_logs();

    // View Employees Leave Ledger
    show_emp_leave_ledger();
    pagination_emp_leave_ledger();
    search_emp_leave_ledger();

    // Hard Copy
    show_hard_copy();
    employee_leave_type();
    change_leave_type();
    hard_copy_save();
    hard_copy_correction();
    hard_copy_logs();
    pagination_hard_copy_logs();
    search_hard_copy_logs();
    delete_hard_copy_logs();
});

function change_active(target) {
    $('.settings_nav').removeClass('bg-primary text-white font-medium');
    $(target).addClass('bg-primary text-white font-medium');
}

function vl_sl_earned_daily() {
    $.ajax({
        url: "/leave/vl_sl_earned_daily",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#content_con').html(`
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
            $('#content_con').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function daily_vac_sick_show() {
    $('body').on('click', '#vac_sick_daily', function() {
        change_active('#vac_sick_daily');
        vl_sl_earned_daily();
    });
}

function table_leave_deduct(page, search) {
    $.ajax({
        url: "/leave/leave_late_deduct",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#tbody_deduct').html(`
                <tr>
                    <td colspan="2"><i class="fa-solid fa-ellipsis fa-fade"></i></td>
                </tr>`);
            $('#summary_deduct').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#tbody_deduct').html(response.html);
            $('#summary_deduct').html(response.summary);
            table_pagination(response, '#pagination_deduct');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function deduction_late_show() {
    $('body').on('click', '#leave_deduct', function() {
        change_active('#leave_deduct');
        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Conversion of Working Hours/Minutes into Fractions of a Day</div>
                        <div class="intro-y text-xs text-slate-500">Provided for under CSC MC No. 41, s. 1998 and futher amended by CSC MC No. 14, s. 1999</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5 mt-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <div class="dropdown"> <button class="dropdown-toggle btn btn-primary w-full sm:w-56 shadow-md" aria-expanded="false" data-tw-toggle="dropdown">Compute Larger Minute</button>
                            <div class="dropdown-menu w-full">
                                <ul class="dropdown-content">
                                    <input type="number" class="form-control" id="large_min" placeholder="Enter minutes...">
                                    <input type="number" class="form-control mt-2" disabled id="large_val" placeholder="Equiv. day">
                                </ul>
                            </div>
                        </div>
                        <!-- <button class="btn btn-primary w-full sm:w-56 shadow-md" data-tw-toggle="modal" data-tw-target="#add_minute_modal">Add New Minute</button> -->
                        <div class="hidden md:block mx-auto text-slate-500" id="summary_deduct">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="search_deduct" placeholder="Search by minutes...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="faq-accordion-1" class="accordion accordion-boxed mt-3 pb-4 px-2 sm:px-5">
                    <div class="overflow-x-auto px-0 sm:px-5">
                        <table class="table table-bordered table-hover intro-y">
                            <thead>
                                <tr class="text-center">
                                    <th class="whitespace-nowrap">MINUTES</th>
                                    <th class="whitespace-nowrap">EQUIV. DAY</th>
                                </tr>
                            </thead>
                            <tbody class="text-center" id="tbody_deduct">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="pagination_deduct">
                        </ul>
                    </nav>
                </div>
            </div>`);
        table_leave_deduct(1, $('#search_deduct').val());
    });
}

function pagination_deduct() {
    $('body').on('click', '#pagination_deduct a', function() {
        const page = $(this).data('page');
        table_leave_deduct(page, $('#search_deduct').val());
    });
}

function search_deduct() {
    $('body').on('input', '#search_deduct', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_leave_deduct(1, $('#search_deduct').val());
        }, 500);
    });
}

function save_minute() {
    $('body').on('click', '#save_minute', function() {
        var saveBtn = $('#save_minute');
        var minErr = $('#minute_error');
        var equiErr = $('#equivalent_error');
        var min = $('#minunte_val');
        var equiv = $('#equiv_val');
        var minute = min.val();
        var equivalent = equiv.val();

        if (minute.trim() == '') {
            min.addClass('border-danger');
            minErr.html('Please enter a value');
        } else if (equivalent.trim() == '') {
            equiv.addClass('border-danger');
            equiErr.html('Please enter a value');
        } else {
            $.ajax({
                url: "/leave/save_minutes_deduct",
                type: "POST",
                dataType: "json",
                data: {minute: minute, equivalent: equivalent},
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Saving</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Save');
                    saveBtn.prop('disabled', false);
                    if (response == 'exist_min') {
                        min.addClass('border-danger');
                        minErr.html('Minute already existed');
                    } else if (response == 'exist_equivalent') {
                        equiv.addClass('border-danger');
                        equiErr.html('Equivalent already existed');
                    } else {
                        min.val('');
                        equiv.val('');
                        $('#search_deduct').val('');
                        table_leave_deduct(1, '')
                        close_modal('#add_minute_modal');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function keyup_deduct() {
    $('body').on('input', '#minunte_val, #equiv_val', function() {
        $(this).removeClass('border-danger');
        $(this).next('div').html('');
    });
}

function compute_large_min() {
    $('body').on('input', '#large_min', function() {
        var minute = parseFloat($(this).val()) || 0;
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            $.ajax({
                url: "/leave/large_minute",
                type: "POST",
                dataType: "json",
                data: {minute: minute},
                success: function (response) {
                    $('#large_val').val(response);
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }, 500);
    });
}

function table_campus_assignment(page, search) {
    $.ajax({
        url: "/leave/table_campus_assignment",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#campus_assignment_con').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#campus_assignment_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#campus_assignment_con').html(response.html);
            $('#campus_assignment_summary').html(response.summary);
            table_pagination(response, '#campus_assignment_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_campus_assignment() {
    $('body').on('click', '#campus_assignment', function() {
        change_active('#campus_assignment');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">HR Assign in Each Campus</div>
                        <div class="intro-y text-xs text-slate-500">These privileges are limited in the Leave Module.</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <button class="btn btn-primary w-full sm:w-56 shadow-md" id="add_new_campus">Add New Campus</button>
                        <div class="hidden md:block mx-auto text-slate-500" id="campus_assignment_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" placeholder="Search campus..." id="campus_assignment_search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-1 sm:px-5">
                    <div class="intro-y grid grid-cols-12 gap-6 mt-5 px-1 sm:px-5" id="campus_assignment_con">
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="campus_assignment_pagination">
                        </ul>
                    </nav>
                </div>
            </div>`);
        table_campus_assignment(1, $('#campus_assignment_search').val());
    });
}

function pagination_campus_assignment() {
    $('body').on('click', '#campus_assignment_pagination a', function() {
        const page = $(this).data('page');
        table_campus_assignment(page, $('#campus_assignment_search').val());
    });
}

function search_campus_assignment() {
    $('body').on('input', '#campus_assignment_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_campus_assignment(1, $('#campus_assignment_search').val());
        }, 500);
    });
}

function add_new_campus() {
    $('body').on('click', '#add_new_campus', function() {
        open_modal('#add_new_campus_modal');
    });

    $('body').on('click', '#save_new_campus', function() {
        var nameInput = $('#new_campus_name');
        var nameError = $('#new_campus_name_error');
        var addressInput = $('#new_campus_address');
        var addressError = $('#new_campus_address_error');
        var saveBtn = $(this);

        var name = nameInput.val();
        var address = addressInput.val();

        if (name.trim() == '') {
            nameInput.addClass('border-danger text-danger');
            nameError.html('Please enter a name');
        } else if (address.trim() == '') {
            addressInput.addClass('border-danger text-danger');
            addressError.html('Please enter a address');
        } else {
            $.ajax({
                url: "/leave/save_new_campus",
                type: "POST",
                dataType: "json",
                data: {name: name, address: address},
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Saving</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Save');
                    saveBtn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#add_new_campus_modal');
                        __notif_show(1, 'Success', 'New campus added.');
                        $('#campus_assignment_search').val('');
                        table_campus_assignment(1, '');
                    } else {
                        nameInput.addClass('border-danger text-danger');
                        nameError.html('Campus already existed');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#new_campus_name, #new_campus_address', function() {
        $(this).removeClass('border-danger text-danger');
        $(this).next().html('');
    });

    $('body').on('keypress', '#new_campus_name, #new_campus_address', function(e) {
        if (e.which === 13) {
            $('#save_new_campus').click();
        }
    });
}

function add_change_campus_address() {
    $('body').on('click', '.campus_address', function() {
        var id = $(this).data('id');
        var address = $(this).html();

        if (address != 'Add address') {
            $('#campus_complete_address').val(address);
        }

        $('#campus_address_id').val(id);
        open_modal('#add_address_modal');
    });

    $('body').on('click', '#save_campus_address', function() {
        var addressInput = $('#campus_complete_address');
        var id = $('#campus_address_id').val();
        var address = addressInput.val();
        var saveBtn = $(this);

        if (address.trim() == '') {
            addressInput.addClass('border-danger text-danger');
            $('#campus_complete_address_error').html('Please enter value');
        } else {
            $.ajax({
                url: "/leave/save_campus_address",
                type: "POST",
                dataType: "json",
                data: {id: id, address: address},
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Saving</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Save');
                    saveBtn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#add_address_modal');
                        __notif_show(1, 'Success', 'Address updated.');
                        table_campus_assignment(1, $('#campus_assignment_search').val());
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#campus_complete_address', function() {
        $(this).removeClass('border-danger text-danger');
        $(this).next().html('');
    });

    $('body').on('keypress', '#campus_complete_address', function(e) {
        if (e.which === 13) {
            $('#save_campus_address').click();
        }
    });
}

function load_assign_employee(campus) {
    $.ajax({
        url: "/leave/load_assign_employee",
        type: "POST",
        dataType: "json",
        data: {campus: campus},
        beforeSend: function() {
            $('#assigned_tbody').html(`
                <tr>
                    <td colspan="2" class="text-center"><i class="fa-solid fa-ellipsis fa-fade"></i></td>
                </tr>`);
        },
        success: function (response) {
            $('#assigned_tbody').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function add_assign_in_campus() {
    $('body').on('click', '.add_assign_campus', function() {
        var campus = $(this).data('id');
        var campus_name = $(this).closest('.intro-y').find('.campus_name').text().trim();
        $('#campus_name_mdl').html(campus_name);
        $('#campus_to_assign').val(campus);
        load_assign_employee(campus);
        open_modal('#add_new_assign_modal');
    });

    $('body').on('click', '#add_assign_employee', function() {
        var empSelect = $('#assign_employee_id');
        var empError = $('#assign_employee_error');
        var saveBtn = $(this);
        var campus = $('#campus_to_assign').val();
        var employee = empSelect.val();

        if (employee == null) {
            empSelect.addClass('border-danger text-danger');
            empError.html('Please select an employee');
        } else {
            $.ajax({
                url: "/leave/add_assign_employee",
                type: "POST",
                dataType: "json",
                data: {employee: employee, campus: campus},
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Add</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Add');
                    saveBtn.prop('disabled', false);
                    if (response == 'success') {
                        __notif_show(1, 'Success', 'Employee assigned.');
                        load_assign_employee(campus);
                    } else {
                        empSelect.addClass('border-danger text-danger');
                        empError.html('Employee already assigned here');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('change', '#assign_employee_id', function() {
        $(this).removeClass('border-danger text-danger');
        $('#assign_employee_error').html('');
    });
}

function remove_assign() {
    $('body').on('click', '.remove_assign', function() {
        var id = $(this).data('id');
        var campus = $('#campus_to_assign').val();

        $.ajax({
            url: "/leave/remove_assign_employee",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                if (response == 'success') {
                    load_assign_employee(campus);
                    __notif_show(2, 'Success', 'Employee removed.');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function table_signatory_campus(page, search) {
    $.ajax({
        url: "/leave/table_signatory_campus",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#signatory_con').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#signatory_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#signatory_con').html(response.html);
            $('#signatory_summary').html(response.summary);
            table_pagination(response, '#signatory_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function table_signatory_employee(page, search) {
    $.ajax({
        url: "/leave/table_signatory_employee",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#signatory_con').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#signatory_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#signatory_con').html(response.html);
            $('#signatory_summary').html(response.summary);
            table_pagination(response, '#signatory_emp_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_campus_signatory() {
    $('body').on('click', '#campus_signatory', function() {
        change_active('#campus_signatory');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div class="font-medium text-base mr-auto">
                        <div  class="intro-y">Set Signatory per Campus</div>
                        <div class="intro-y text-xs text-slate-500">These privileges are limited in the Leave Module.</div>
                    </div>
                    <div class="ml-4"><button class="btn btn-primary hidden intro-x" id="employee_records">  <i class="fa-regular fa-file-lines mr-2"></i> Records</button></div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <select class="form-select w-full sm:w-56" id="signatory_filter">
                            <option value="1">Per campus</option>
                            <option value="2">Per employee</option>
                        </select>
                        <div class="hidden md:block mx-auto text-slate-500" id="signatory_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0" id="sig_camp_con">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="signatory_campus_search" placeholder="Search by campus...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0" id="sig_emp_con" style="display: none;">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="signatory_emp_search" placeholder="Search by employee...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-1 sm:px-5">
                    <div class="intro-y grid grid-cols-12 gap-6 mt-5 px-1 sm:px-5" id="signatory_con"></div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="signatory_pagination"></ul>
                        <ul class="pagination" id="signatory_emp_pagination"></ul>
                    </nav>
                </div>
            </div>`);

        table_signatory_campus(1, $('#signatory_campus_search').val());
    });
}

function filter_campus() {
    $('body').on('change', '#signatory_filter', function() {
        var filter = $(this).val();

        if (filter == 1) {
            $('#sig_camp_con').css('display', 'inline');
            $('#sig_emp_con').css('display', 'none');
            $('#signatory_pagination').css('display', 'flex');
            $('#signatory_emp_pagination').css('display', 'none');
            $('#signatory_campus_search').val('');
            $('#employee_records').addClass('hidden');
            table_signatory_campus(1, '');
        } else {
            $('#sig_camp_con').css('display', 'none');
            $('#sig_emp_con').css('display', 'inline');
            $('#signatory_pagination').css('display', 'none');
            $('#signatory_emp_pagination').css('display', 'flex');
            $('#signatory_emp_search').val('');
            $('#employee_records').removeClass('hidden');
            table_signatory_employee(1, '');
        }
    });
}

function pagination_campus_signatory() {
    $('body').on('click', '#signatory_pagination a', function() {
        const page = $(this).data('page');
        table_signatory_campus(page, $('#signatory_campus_search').val());
    });
}

function search_campus_signatory() {
    $('body').on('input', '#signatory_campus_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_signatory_campus(1, $('#signatory_campus_search').val());
        }, 500);
    });
}

function pagination_employee_signatory() {
    $('body').on('click', '#signatory_emp_pagination a', function() {
        const page = $(this).data('page');
        table_signatory_employee(page, $('#signatory_emp_search').val());
    });
}

function search_employee_signatory() {
    $('body').on('input', '#signatory_emp_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_signatory_employee(1, $('#signatory_emp_search').val());
        }, 500);
    });
}

function edit_signatory_campus() {
    $('body').on('click', '.edit_signatory_campus', function() {
        var campus = $(this).data('campus');
        var title = $(this).prev().html();
        $('#save_sig_campus').css('display', 'inline');
        $('#set_sig_emp').css('display', 'none');
        $('#signatory_alert').css('display', 'none');
        $('#sig_camp_title').html(title);
        $('#campus_sig_id').val(campus);
        open_modal('#set_signatory_modal');

        $.ajax({
            url: "/leave/get_campug_sig",
            type: "POST",
            dataType: "json",
            data: {campus: campus},
            success: function (response) {
                $('#cert_emp_val').val(response.cert_emp).trigger('change');
                $('#cert_ext_val').val(response.cert_ext);
                $('#cert_desi_val').val(response.cert_desi);
                $('#app_emp_val').val(response.app_emp).trigger('change');
                $('#app_ext_val').val(response.app_ext);
                $('#app_desi_val').val(response.app_desi);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function save_signatory_campus() {
    $('body').on('click', '#save_sig_campus', function() {
        var campus = $('#campus_sig_id').val();
        var cert_emp = $('#cert_emp_val').val();
        var cert_ext = $('#cert_ext_val').val();
        var cert_desi = $('#cert_desi_val').val();
        var app_emp = $('#app_emp_val').val();
        var app_ext = $('#app_ext_val').val();
        var app_desi = $('#app_desi_val').val();
        var saveBtn = $(this);

        if (cert_emp == null || cert_desi.trim() == '') {
            $('#cert_error').html('Please complete information');
        } else if (app_emp == null || app_desi.trim() == '') {
            $('#app_error').html('Please complete information');
        } else {
            var data = {
                campus: campus,
                cert_emp: cert_emp,
                cert_ext: cert_ext,
                cert_desi: cert_desi,
                app_emp: app_emp,
                app_ext: app_ext,
                app_desi: app_desi
            };
            $.ajax({
                url: "/leave/edit_campus_sig",
                type: "POST",
                dataType: "json",
                data: data,
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Saving</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Save');
                    saveBtn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#set_signatory_modal');
                        __notif_show(1, 'Success', 'Campus signatory set.');
                        table_signatory_campus();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function error_remover_signatory_campus() {
    $('body').on('change', '#cert_emp_val, #app_emp_val', function() {
        $(this).closest('.sig_con_mdl').next('.sig_err_mdl').html('');
    });

    $('body').on('input', '#cert_desi_val, #app_desi_val', function() {
        $(this).closest('.sig_con_mdl').next('.sig_err_mdl').html('');
    });
}

function set_signatory_employee_show() {
    $('body').on('click', '.set_emp_sig', function() {
        var employee = $(this).data('employee');
        $('#signatory_alert').css('display', 'flex');
        $('#save_sig_campus').css('display', 'none');
        $('#set_sig_emp').css('display', 'inline');
        $('#campus_sig_id').val(employee);
        open_modal('#set_signatory_modal');

        $.ajax({
            url: "/leave/check_emp_sig",
            type: "POST",
            dataType: "json",
            data: {employee: employee},
            success: function (response) {
                if (response == 'goods') {
                    $('#cert_emp_val').val('').trigger('change');
                    $('#cert_ext_val').val('');
                    $('#cert_desi_val').val('');
                    $('#app_emp_val').val('').trigger('change');
                    $('#app_ext_val').val('');
                    $('#app_desi_val').val('');
                } else {
                    $('#cert_emp_val').val(response.cert_emp).trigger('change');
                    $('#cert_ext_val').val(response.cert_ext);
                    $('#cert_desi_val').val(response.cert_desi);
                    $('#app_emp_val').val(response.app_emp).trigger('change');
                    $('#app_ext_val').val(response.app_ext);
                    $('#app_desi_val').val(response.app_desi);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function set_signatory_employee() {
    $('body').on('click', '#set_sig_emp', function() {
        var employee = $('#campus_sig_id').val();
        var cert_emp = $('#cert_emp_val').val();
        var cert_ext = $('#cert_ext_val').val();
        var cert_desi = $('#cert_desi_val').val();
        var app_emp = $('#app_emp_val').val();
        var app_ext = $('#app_ext_val').val();
        var app_desi = $('#app_desi_val').val();
        var saveBtn = $(this);

        if (cert_emp == null || cert_desi.trim() == '') {
            $('#cert_error').html('Please complete information');
        } else if (app_emp == null || app_desi.trim() == '') {
            $('#app_error').html('Please complete information');
        } else {
            var data = {
                employee: employee,
                cert_emp: cert_emp,
                cert_ext: cert_ext,
                cert_desi: cert_desi,
                app_emp: app_emp,
                app_ext: app_ext,
                app_desi: app_desi
            };
            $.ajax({
                url: "/leave/set_employee_sig",
                type: "POST",
                dataType: "json",
                data: data,
                beforeSend: function() {
                    saveBtn.html('<span class="fa-fade">Setting</span>');
                    saveBtn.prop('disabled', true);
                },
                success: function (response) {
                    saveBtn.html('Set');
                    saveBtn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#set_signatory_modal');
                        __notif_show(1, 'Success', 'Campus signatory set.');
                        table_signatory_employee(1, $('#signatory_emp_search').val());
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function table_today_sig(page, search) {
    $.ajax({
        url: "/leave/table_today_record_sig",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#today_rec_con').html(`
                <div class="intro-y col-span-12">
                    <div class="border rounded-md p-3 text-center">
                        <i class="fa-solid fa-ellipsis fa-fade"></i>
                    </div>
                </div>`);
            $('#today_rec_sum').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#today_rec_con').html(response.html);
            $('#today_rec_sum').html(response.summary);
            table_pagination(response, '#today_rec_page');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function table_all_sig(page, search) {
    $.ajax({
        url: "/leave/table_all_record_sig",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#all_rec_con').html(`
                <div class="intro-y col-span-12">
                    <div class="border rounded-md p-3 text-center">
                        <i class="fa-solid fa-ellipsis fa-fade"></i>
                    </div>
                </div>`);
            $('#all_rec_sum').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#all_rec_con').html(response.html);
            $('#all_rec_sum').html(response.summary);
            table_pagination(response, '#all_rec_page');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function signatory_records_modal() {
    $('body').on('click', '#employee_records', function() {
        $('#search_today_sig').val('');
        $('#search_all_rec').val('');
        table_today_sig(1, '');
        table_all_sig(1, '');
        open_modal('#emp_sig_records');
    });
}

function edit_emp_sig_on_modal() {
    $('body').on('click', '.mdl_sig', function() {
        var employee = $(this).data('employee');
        $('#signatory_alert').css('display', 'flex');
        $('#save_sig_campus').css('display', 'none');
        $('#set_sig_emp').css('display', 'inline');
        $('#campus_sig_id').val(employee);
        open_modal('#set_signatory_modal');

        $.ajax({
            url: "/leave/check_emp_sig",
            type: "POST",
            dataType: "json",
            data: {employee: employee},
            success: function (response) {
                if (response == 'goods') {
                    $('#cert_emp_val').val('').trigger('change');
                    $('#cert_ext_val').val('');
                    $('#cert_desi_val').val('');
                    $('#app_emp_val').val('').trigger('change');
                    $('#app_ext_val').val('');
                    $('#app_desi_val').val('');
                } else {
                    $('#cert_emp_val').val(response.cert_emp).trigger('change');
                    $('#cert_ext_val').val(response.cert_ext);
                    $('#cert_desi_val').val(response.cert_desi);
                    $('#app_emp_val').val(response.app_emp).trigger('change');
                    $('#app_ext_val').val(response.app_ext);
                    $('#app_desi_val').val(response.app_desi);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function modal_employee_sig_record_controller() {
    $('body').on('click', '#today_rec_page a', function() {
        const page = $(this).data('page');
        table_today_sig(page, $('#search_today_sig').val());
    });

    $('body').on('input', '#search_today_sig', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_today_sig(1, $('#search_today_sig').val());
        }, 500);
    });
}

function delete_emp_sig() {
    $('body').on('click', '.delete_emp_sig', function() {
        var id = $(this).data('id');
        $('#dlt_today_id').val(id);
        open_modal('#dlt_today_sig');
    });

    $('body').on('click', '#delete_today_rec', function() {
        var id = $('#dlt_today_id').val();
        var btn = $(this);
        $.ajax({
            url: "/leave/delete_today_rec",
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
                if (response) {
                    close_modal('#dlt_today_sig');
                    __notif_show(1, 'Success', 'Signatory deleted.');
                    table_today_sig(1, $('#search_today_sig').val());
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function pagination_all_record() {
    $('body').on('click', '#all_rec_page a', function() {
        const page = $(this).data('page');
        table_all_sig(page, $('#search_all_rec').val());
    });
}

function search_all_rec() {
    $('body').on('input', '#search_all_rec', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_all_sig(1, $('#search_all_rec').val());
        }, 500);
    });
}

function table_leave_type(page, search) {
    $.ajax({
        url: "/leave/table_leave_type",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#types_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#types_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#types_container').html(response.html);
            $('#types_summary').html(response.summary);
            table_pagination(response, '#types_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_leave_type() {
    $('body').on('click', '#leave_type', function() {
        change_active('#leave_type');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Leave Type Settings</div>
                        <div class="intro-y text-xs text-slate-500">Adjust days and add leave type for each employee.</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <button class="btn btn-primary w-full sm:w-56 shadow-md" id="new_leave_type_btn">Add New Leave Type</button>
                        <div class="block mx-auto text-slate-500" id="types_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="types_search" placeholder="Search ...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-6 mt-5 px-2 sm:px-5" id="types_container">
                        <div class="intro-y col-span-12 md:col-span-6">
                            <div class="border rounded">
                                <div class="flex flex-col lg:flex-row items-center p-5">
                                    <div class="lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                        <div class="font-medium">Vacation Leave</div>
                                        <div class="text-slate-500 text-xs mt-0.5">Sec 51, Rule XVI, Omnibus Rules Implementing E.O. No. 292</div>
                                    </div>
                                    <div class="flex mt-4 lg:mt-0">
                                        <button class="btn btn-primary py-1 px-2 mr-2">Settings</button>
                                        <button class="btn btn-outline-secondary px-2"><i class="fa-regular fa-user"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="types_pagination"></ul>
                    </nav>
                </div>
            </div>
        `);

        table_leave_type(1, $('#types_search').val());
    });
}

function pagination_leave_type() {
    $('body').on('click', '#types_pagination a', function() {
        const page = $(this).data('page');
        table_leave_type(page, $('#types_search').val());
    });
}

function search_leave_type() {
    $('body').on('input', '#types_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_leave_type(1, $('#types_search').val());
        }, 500);
    });
}

function show_types_settings() {
    $('body').on('click', '.type_settings', function() {
        var id = $(this).data('id');
        var dlt = $(this).data('dlt');
        var days = $(this).data('days');
        var num_days = $(this).data('numdays');
        var nextyear = $(this).data('nextyear');
        var daterange = $(this).data('daterange');
        var num_days_solo = $(this).data('numdayssolo');

        $('#type_id_val').val(id);
        $('#days_apply').val(days);
        $('#use_next_year').val(nextyear);
        $('#datarange_allowed').val(daterange);

        if (id == '1' || id == '3' || id == '14') {
            $('#allow_nxt_year_container').css('display', 'none');
            $('#allow_range_container').css('display', 'none');
        } else {
            $('#allow_nxt_year_container').css('display', 'block');
            $('#allow_range_container').css('display', 'block');
        }

        if (dlt == '1') {
            $('#type_dlt_con').html('<button class="btn btn-danger w-32" id="remove_leave_type_btn">Remove</button>');
        }
        if (id == '1' || id == '3' || id == '14') {
            $('#type_days_con').html('');
        } else if (id == '4') {
            $('#type_days_con').html(`
                <div class="mt-2">
                    <div>Number of Days if <b class="text-primary">not solo parent</b></div>
                    <input type="number" class="form-control" placeholder="Please enter" id="type_num_days" value="${num_days}">
                    <div class="mt-1 text-xs text-danger text-center" id="err_type_num_days"></div>
                </div>
                <div class="mt-2">
                    <div>No. of days if <b class="text-primary">solo parent</b></div>
                    <input type="number" class="form-control" placeholder="Please enter" id="type_num_days_solo" value="${num_days_solo}">
                    <div class="mt-1 text-xs text-danger text-center" id="err_type_num_days_solo"></div>
                </div>`);
        } else {
            $('#type_days_con').html(`
                <div class="mt-2">
                    <div>Number of Days</div>
                    <input type="number" class="form-control" placeholder="Please enter" id="type_num_days" value="${num_days}">
                    <div class="mt-1 text-xs text-danger text-center" id="err_type_num_days"></div>
                </div>`);
        }
        open_modal('#leave_type_settings_modal');
    });
}

function save_application_day() {
    $('body').on('click', '#save_day_apply', function() {
        var dayInput = $('#days_apply');
        var errInput = $('#days_error_con');
        var day = dayInput.val();
        var id = $('#type_id_val').val();
        var next_year = $('#use_next_year').val();
        var allow_range = $('#datarange_allowed').val();
        var btn = $(this);
        var num_days = 0;
        var num_days_solo = 0;

        $bool = false;
        if (id == '1' || id == '2' || id == '3') {

        } else if (id == '4') {
            num_days = $('#type_num_days').val();
            num_days_solo = $('#type_num_days_solo').val();

            if (num_days < 0 || num_days == '') {
                $('#type_num_days').addClass('border-danger text-danger');
                $('#err_type_num_days').html('Please enter 0 or more.');
                $bool = true;
            }
            if (num_days_solo < 0 || num_days_solo == '') {
                $('#type_num_days_solo').addClass('border-danger text-danger');
                $('#err_type_num_days_solo').html('Please enter 0 or more.');
                $bool = true;
            }
        } else {
            num_days = $('#type_num_days').val();
            if (num_days < 0 || num_days == '') {
                $('#type_num_days').addClass('border-danger text-danger');
                $('#err_type_num_days').html('Please enter 0 or more.');
                $bool = true;
            }
        }

        if (day.trim() == '') {
            dayInput.addClass('border-danger text-danger');
            errInput.html('Please enter a number.');
            $bool = true;
        }

        if (!$bool) {
            $.ajax({
                url: "/leave/save_day_apply",
                type: "POST",
                dataType: "json",
                data: {
                    id: id,
                    day: day,
                    num_days: num_days,
                    next_year: next_year,
                    allow_range: allow_range,
                    num_days_solo: num_days_solo
                },
                beforeSend: function() {
                    btn.prop('disabled', true);
                    btn.html('<span class="fa-fade">Saving</span>');
                },
                success: function (response) {
                    btn.prop('disabled', false);
                    btn.html('Save');
                    __notif_show(2, 'Success', 'Application date changed.');
                    close_modal('#leave_type_settings_modal');
                    table_leave_type(1, $('#types_search').val());
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function leave_type_what_to_input() {
    $('body').on('click', '#leave_type_what_to_input', function() {
        open_modal('#leave_type_what_to_input_modal');
    });
}

function type_settings_error_handler() {
    $('body').on('input', '#days_apply, #type_num_days, #type_num_days_solo', function() {
        $(this).removeClass('border-danger text-danger');
        $(this).next().html('');
    });
}

function table_employee_on_add(append, search) {
    if (!hasMorePages) return;
    var ids = id_employee_add_in_type();
    var leave_type = $('#leaveType_id').val();

    $.ajax({
        url: "/leave/employee_on_add",
        type: "POST",
        dataType: "json",
        data: {perpage: 10, search: search, ids: ids, page: page_type_user, leave_type: leave_type},
        success: function(response) {
            if (append) {
                $('#add_emp_con').append(response.html);
            } else {
                $('#add_emp_con').html(response.html);
            }

            hasMorePages = response.hasMorePages;
            page_type_user++;
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function table_user_leave_type(page, search) {
    var leave_type = $('#leaveType_id').val();

    $.ajax({
        url: "/leave/table_user_leave_type",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search, leave_type: leave_type},
        beforeSend: function() {
            $('#lt_con').html(`
                <div class="intro-x text-center py-3 border rounded mt-2">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#lt_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#lt_con').html(response.html);
            $('#lt_summary').html(response.summary);
            table_pagination(response, '#lt_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_user_settings() {
    $('body').on('click', '.type_users', function() {
        var id = $(this).data('id');
        var name = $(this).closest('.jhasda').find('.leave_type_asd').html();
        $('#leaveType_id').val(id);
        $('#user_leavetype_name').html(name);
        table_user_leave_type(1, $('#lt_search').val());
        open_modal('#leave_type_user_modal');
    });
}

function pagination_user_settings() {
    $('body').on('click', '#lt_pagination a', function() {
        const page = $(this).data('page');
        table_user_leave_type(page, $('#lt_search').val());
    });
}

function search_user_settings() {
    $('body').on('input', '#lt_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_user_leave_type(1, $('#lt_search').val());
        }, 500);
    });
}

function remove_user_settings() {
    $('body').on('click', '.remove_user_settings', function() {
        var id = $(this).data('id');
        $('#user_settings_id').val(id);
        open_modal('#dlt_user_settings');
    });

    $('body').on('click', '#dlt_user_settings_btn', function() {
        var id = $('#user_settings_id').val();
        var btn = $(this);

        $.ajax({
            url: "/leave/delete_user_settings",
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
                if (response) {
                    close_modal('#dlt_user_settings');
                    __notif_show(1, 'Success', 'Row deleted.');
                    table_user_leave_type(1, $('#lt_search').val());
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function add_balance_user_settings() {
    $('body').on('click', '.add_balance_user_settings', function() {
        var id = $(this).data('id');
        var days = $(this).data('days');
        var solo = $(this).data('solo');
        var type = $(this).data('type');

        if (type == '4') {
            $('#maternity_balance_leave_type_id').val(id);
            $('#not_solo_num').val(days);
            $('#solo_num').val(solo);
            open_modal('#maternity_solo_or_not_modal');
        } else {
            $('#balance_leave_type_id').val(id);
            $('#balance_leave_type_days').val(days);
            $('#add_balance_days_con').html(days + ' day/s');
            open_modal('#add_balance_modal');
        }
    });

    $('body').on('click', '#balance_maternity_yes', function() {
        var id = $('#maternity_balance_leave_type_id').val();
        var solo = $('#solo_num').val();
        $('#balance_leave_type_id').val(id);
        $('#balance_leave_type_days').val(solo);
        $('#add_balance_days_con').html(solo + ' day/s');
        close_modal('#maternity_solo_or_not_modal');
        open_modal('#add_balance_modal');
    });

    $('body').on('click', '#balance_maternity_no', function() {
        var id = $('#maternity_balance_leave_type_id').val();
        var not = $('#not_solo_num').val();
        $('#balance_leave_type_id').val(id);
        $('#balance_leave_type_days').val(not);
        $('#add_balance_days_con').html(not + ' day/s');
        close_modal('#maternity_solo_or_not_modal');
        open_modal('#add_balance_modal');
    });

    $('body').on('click', '#add_new_balance_btn', function() {
        var id = $('#balance_leave_type_id').val();
        var days = $('#balance_leave_type_days').val();
        var btn = $(this);
        $.ajax({
            url: "/leave/add_balance_on_emp",
            type: "POST",
            dataType: "json",
            data: {id: id, days: days},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Adding</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Add');
                btn.prop('disabled', false);
                if (response) {
                    close_modal('#add_balance_modal');
                    __notif_show(1, 'Success', 'Balance added');
                    table_user_leave_type(1, $('#lt_search').val());
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function check_add_emp_div() {
    if ($('#new_emp_user_con').children().length === 0) {
        $('.type_user_div').css('display', 'none');
    } else {
        $('.type_user_div').css('display', 'block');
    }
}

function id_employee_add_in_type() {
    var dataIds = [];

    $('#new_emp_user_con > div').each(function() {
        var dataId = $(this).data('id');
        dataIds.push(dataId);
    });

    return dataIds;
}

function add_employee_on_leave_type(employee, leave_type, opt_days) {
    $.ajax({
        url: "/leave/add_employee",
        type: "POST",
        dataType: "json",
        data: {employee: employee, leave_type: leave_type, opt_days: opt_days},
        beforeSend: function() {
        },
        success: function(response) {
            close_modal('#maternity_num_days_modal');
            close_modal('#add_new_emp_mdl');
            __notif_show(2, 'Success', 'Employee added.');
            $('#lt_search').val('');
            table_user_leave_type(1, '');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function add_employee() {
    // Show Modal
    $('body').on('click', '#add_employee_btn_mdl', function() {
        page_type_user = 1;
        hasMorePages = true;
        $('#new_user_type_search').val('');
        $('.type_user_div').css('display', 'none');
        $('#new_emp_user_con').empty();
        table_employee_on_add(false, '');
        open_modal('#add_new_emp_mdl');
    });

    // Employee Adding / Remove in the Box
    $('body').on('click', '.employee_add_con', function() {
        var id = $(this).data('id');
        var imgSrc = $(this).find('img').attr('src');
        var fullName = $(this).find('.font-medium').text();

        if ($(this).hasClass('activated')) {
            $(this).removeClass('activated');
            $(`#new_emp_user_con .add_emp_bot[data-id="${id}"]`).remove();
        } else {
            $(this).addClass('activated');

            $('#new_emp_user_con').append(`
                <div data-id="${id}" class="add_emp_bot">
                    <div class="py-1 px-2 flex rounded border items-center to_be_added cursor-pointer">
                        <div class="w-4 h-4 image-fit mr-2">
                            <img class="rounded-full" src="${imgSrc}" alt="">
                        </div>
                        ${fullName}
                        <i class="fa-solid fa-xmark ml-4"></i>
                    </div>
                </div>`);
        }
        check_add_emp_div();
    });

    // Infinite Loading
    $('#add_emp_con').scroll(function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            table_employee_on_add(true, $('#new_user_type_search').val());
        }
    });

    // Remove Employee Inside the Box
    $('body').on('click', '.add_emp_bot', function() {
        $(this).remove();
        var id = $(this).data('id');
        $(`#add_emp_con .employee_add_con[data-id="${id}"]`).removeClass('activated');
        check_add_emp_div();
    });

    // Search
    $('body').on('input', '#new_user_type_search', function() {
        var input = $(this);
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            page_type_user = 1;
            hasMorePages = true;
            table_employee_on_add(false, input.val());
        }, 500);
    });

    // Adding
    $('body').on('click', '#add_new_emp_btn', function() {
        var employee = id_employee_add_in_type();
        var btn = $(this);
        var leave_type = $('#leaveType_id').val();

        if (employee.length > 0) {
            if (leave_type == '4') {
                open_modal('#maternity_num_days_modal');
            } else {
                add_employee_on_leave_type(employee, leave_type, 'num_days');
            }

        } else {
            __notif_show('-2', 'Empty', 'Please select an employee.');
        }
    });

    // Maternity No
    $('body').on('click', '#maternity_no', function() {
        var employee = id_employee_add_in_type();
        add_employee_on_leave_type(employee, '4', 'num_days');
    });

    // Maternity Yes
    $('body').on('click', '#maternity_yes', function() {
        var employee = id_employee_add_in_type();
        add_employee_on_leave_type(employee, '4', 'num_days_solo');
    });
}

function add_new_leave_type() {
    $('body').on('click', '#new_leave_type_btn', function() {
        open_modal('#new_leave_type_modal');
    });
}

function save_new_leave_type() {
    $('body').on('click', '#save_new_leave_type', function() {
        var checker = false;
        var btn = $(this);
        var name = $('#new_type_name').val();
        var name_abr = $('#new_type_abr').val();
        var order = $('#new_type_order').val();
        var application = $('#new_type_application').val();
        var days = $('#new_type_days').val();
        var forfeit = $('#new_type_forfeit').val();
        var date = $('#new_type_date').val();

        if (name.trim() == '') {
            $('#new_type_name').addClass('border-danger');
            $('#new_type_name_err').html('Provide name of this leave type.');
            checker = true;
        }

        
        if (name_abr.trim() == '') {
            $('#new_type_abr').addClass('border-danger');
            $('#new_type_abr_err').html('Provide Abbreviation for the leave type.');
            checker = true;
        }

        if (application.trim() == '' || application < 0) {
            $('#new_type_application').addClass('border-danger');
            $('#new_type_application_err').html('Input application period');
            checker = true;
        }

        if (days.trim() == '' || days < 0) {
            $('#new_type_days').addClass('border-danger');
            $('#new_type_days_err').html('Input application period');
            checker = true;
        }

        if (!checker) {
            var data = {
                name: name,
                name_abr: name_abr,
                order: order,
                application: application,
                days: days,
                forfeit: forfeit,
                date: date
            };

            $.ajax({
                url: "/leave/save_new_leave_type",
                type: "POST",
                dataType: "json",
                data: data,
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        table_leave_type(1, '');
                        close_modal('#new_leave_type_modal');
                        __notif_show(3, 'Success', 'New leave type saved.');
                    } else if (response == 'exist') {
                        $('#new_type_name').addClass('border-danger');
                        $('#new_type_name_err').html('Name existed.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function error_handler_new_leave_type() {
    $('body').on('input', '#new_type_name, #new_type_application, #new_type_days, #new_type_abr', function() {
        $(this).removeClass('border-danger');
        $(this).next().html('');
    });
}

function remove_leave_type() {
    $('body').on('click', '#remove_leave_type_btn', function() {
        var id = $('#type_id_val').val();
        $('#rmv_leave_type_id').val(id);
        open_modal('#remove_leave_type_modal');
    });

    $('body').on('click', '#remove_leave_type_mdl_btn', function() {
        var btn = $(this);
        var id = $('#rmv_leave_type_id').val();
        $.ajax({
            url: "/leave/remove_leave_type",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Removing</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Remove');
                btn.prop('disabled', false);
                if (response == 'success') {
                    table_leave_type(1, '');
                    close_modal('#remove_leave_type_modal');
                    close_modal('#leave_type_settings_modal');
                    __notif_show(3, 'Success', 'Leave type deleted.');
                } else if (response == 'not_allowed') {
                    close_modal('#remove_leave_type_modal');
                    __notif_show(-3, 'Failed', 'Deleting this type is not allowed.');
                } else if (response == 'available') {
                    close_modal('#remove_leave_type_modal');
                    __notif_show(-3, 'Failed', 'There are leave available on this type.');
                } else if (response == 'application') {
                    close_modal('#remove_leave_type_modal');
                    __notif_show(-3, 'Failed', 'Deleting this can affect the previous application form.');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function table_leave_ledger(page, search) {
    $.ajax({
        url: "/leave/table_leave_ledger",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#ledger_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#ledger_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#ledger_container').html(response.html);
            $('#ledger_summary').html(response.summary);
            table_pagination(response, '#leave_ledger_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_leave_ledger() {
    $('body').on('click', '#leave_ledger', function() {
        change_active('#leave_ledger');

        $('#content_con').html(`
             <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Employee's Leave Ledger</div>
                        <div class="intro-y text-xs text-slate-500">Track the leave and leave balance of all employee.</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5" id="ledger_nav">
                        <button class="btn btn-primary w-full sm:w-56 shadow-md hidden" id="">Add New Leave Type</button>
                        <div class="block ml-3 mr-auto text-slate-500" id="ledger_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="leave_ledget_search" placeholder="Search by employee...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5" style="display: none;" id="list_nav">
                        <button class="btn btn-primary w-full sm:w-56 shadow-md" id="go_back_ledger"><i class="fa-solid fa-reply mr-2"></i> Go back to list</button>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-6 mt-5 px-2 sm:px-5" id="ledger_container">
                    </div>
                    <div class="grid grid-cols-12 mt-5 gap-5 px-2 sm:px-5" id="ledger_list_container" style="display: none;">

                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="leave_ledger_pagination"></ul>
                    </nav>
                </div>
            </div>`);

        table_leave_ledger(1, $('#leave_ledget_search').val());
    });
}

function pagination_leave_ledger() {
    $('body').on('click', '#leave_ledger_pagination a', function() {
        const page = $(this).data('page');
        table_leave_ledger(page, $('#leave_ledget_search').val());
    });
}

function search_leave_ledger() {
    $('body').on('input', '#leave_ledget_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_leave_ledger(1, $('#leave_ledget_search').val());
        }, 500);
    });
}

function set_balance() {
    $('body').on('click', '.pick_set_leave_balance', function() {
        var id = $(this).data('id');
        $('#to_set_agencyid').val(id);
        open_modal('#pick_balance_modal');
    });

    $('body').on('click', '.set_leave_balance', function() {
        close_modal('#pick_balance_modal');
        var id = $('#to_set_agencyid').val();
        $('#ledger_nav').css('display', 'none');
        $('#list_nav').css('display', 'flex');
        $('#leave_ledger_pagination').css('display', 'none');
        $('#ledger_container').css('display', 'none');
        $('#ledger_list_container').css('display', 'grid');
        $.ajax({
            url: "/leave/insert_leave_balance",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#ledger_list_container').html(`
                    <div class="intro-y col-span-12 border rounded p-5 text-center">
                        <i class="fa-solid fa-ellipsis fa-fade"></i>
                    </div>`);
            },
            success: function (response) {
                $('#ledger_list_container').html(response.html);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '.set_teacher_balance', function() {
        close_modal('#pick_balance_modal');
        var id = $('#to_set_agencyid').val();
        $('#ledger_nav').css('display', 'none');
        $('#list_nav').css('display', 'flex');
        $('#leave_ledger_pagination').css('display', 'none');
        $('#ledger_container').css('display', 'none');
        $('#ledger_list_container').css('display', 'grid');
        $.ajax({
            url: "/leave/insert_teacher_balance",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#ledger_list_container').html(`
                    <div class="intro-y col-span-12 border rounded p-5 text-center">
                        <i class="fa-solid fa-ellipsis fa-fade"></i>
                    </div>`);
            },
            success: function (response) {
                $('#ledger_list_container').html(response.html);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#go_back_ledger', function() {
        $('#ledger_nav').css('display', 'flex');
        $('#list_nav').css('display', 'none');
        $('#leave_ledger_pagination').css('display', 'flex');
        $('#ledger_container').css('display', 'grid');
        $('#ledger_list_container').css('display', 'none');
    });
}

function save_ledger_balance() {
    $('body').on('click', '#ledger_balance_save', function() {
        var agencyid = $('#ledger_emp').html();
        var vacation = $('#ledger_vacation').val();
        var sick = $('#ledger_sick').val();
        var special = $('#ledger_special').val();
        var force = $('#ledger_force').val();
        var solo = $('#ledger_solo').val();
        var start = $('#ledger_start').val();
        var end = $('#ledger_end').val();
        var btn = $(this);

        var hasEmptyField = false;

        if (vacation.trim() == '') {
            $('#ledger_vacation').addClass('border-danger');
            hasEmptyField = true;
        }
        if (sick.trim() == '') {
            $('#ledger_sick').addClass('border-danger');
            hasEmptyField = true;
        }
        if (special.trim() == '') {
            $('#ledger_special').addClass('border-danger');
            hasEmptyField = true;
        }
        if (force.trim() == '') {
            $('#ledger_force').addClass('border-danger');
            hasEmptyField = true;
        }
        if (solo.trim() == '') {
            $('#ledger_solo').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start.trim() == '') {
            $('#ledger_start').addClass('border-danger');
            hasEmptyField = true;
        }
        if (end.trim() == '') {
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start > end) {
            $('#ledger_start').addClass('border-danger');
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        var startDate = new Date(start);
        var endDate = new Date(end);

        if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
            __notif_show(-3, 'Invalid Period', 'Must be the same month and year.');
            $('#ledger_start').addClass('border-danger');
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }

        if (!hasEmptyField) {
            $.ajax({
                url: "/leave/ledger_balance",
                type: "POST",
                dataType: "json",
                data: {
                    agencyid: agencyid,
                    vacation: vacation,
                    sick: sick,
                    special: special,
                    force: force,
                    solo: solo,
                    start: start,
                    end: end
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        table_leave_ledger(1, $('#leave_ledget_search').val());
                        $('#go_back_ledger').click();
                        __notif_show(3, 'Success', 'Leave balance save.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('click', '#teacher_ledger_balance_save', function() {
        var agencyid = $('#ledger_emp').html();
        var service_credits = $('#service_credits_val').val();
        var start = $('#teacher_ledger_start').val();
        var end = $('#teacher_ledger_end').val();
        var btn = $(this);

        var hasEmptyField = false;

        if (service_credits.trim() == '') {
            $('#service_credits_val').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start.trim() == '') {
            $('#teacher_ledger_start').addClass('border-danger');
            hasEmptyField = true;
        }
        if (end.trim() == '') {
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start > end) {
            $('#teacher_ledger_start').addClass('border-danger');
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        var startDate = new Date(start);
        var endDate = new Date(end);

        if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
            __notif_show(-3, 'Invalid Period', 'Must be the same month and year.');
            $('#teacher_ledger_start').addClass('border-danger');
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }

        if (!hasEmptyField) {
            $.ajax({
                url: "/leave/teacher_ledger_balance",
                type: "POST",
                dataType: "json",
                data: {
                    agencyid: agencyid,
                    service_credits: service_credits,
                    start: start,
                    end: end
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        table_leave_ledger(1, $('#leave_ledget_search').val());
                        $('#go_back_ledger').click();
                        __notif_show(3, 'Success', 'Leave balance save.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function error_handler_balance() {
    $('body').on('input', '#ledger_vacation, #ledger_sick, #ledger_special, #ledger_force, #ledger_solo, #ledger_start, #ledger_end, #service_credits_val, #teacher_ledger_start, #teacher_ledger_end', function() {
        $(this).removeClass('border-danger');
    });
}

function update_set_balance() {
    // Opening the modal
    $('body').on('click', '.already_set_btn', function() {
        var id = $(this).data('id');
        open_modal('#view_balance_modal');
        $.ajax({
            url: "/leave/view_set_balance",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#view_balance_container').html(`
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
                $('#view_balance_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    // Click here button
    $('body').on('click', '.update_set_balance', function() {
        var id = $(this).data('id');
        var agencyid = $(this).data('agencyid');
        $.ajax({
            url: "/leave/update_leave_balance",
            type: "POST",
            dataType: "json",
            data: {id: id, agencyid: agencyid},
            beforeSend: function() {
            },
            success: function (response) {
                if (response.check == 'not_allowed') {
                    open_modal('#not_allowed_upt_modal');
                } else {
                    close_modal('#view_balance_modal');
                    $('#ledger_nav').css('display', 'none');
                    $('#list_nav').css('display', 'flex');
                    $('#leave_ledger_pagination').css('display', 'none');
                    $('#ledger_container').css('display', 'none');
                    $('#ledger_list_container').css('display', 'grid');
                    $('#ledger_list_container').html(response.html);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    // Update Admin Balance
    $('body').on('click', '#update_balance_leave_btn', function() {
        var ledger_id = $(this).data('id');
        var agencyid = $('#ledger_emp').html();
        var vacation = $('#ledger_vacation').val();
        var sick = $('#ledger_sick').val();
        var special = $('#ledger_special').val();
        var force = $('#ledger_force').val();
        var solo = $('#ledger_solo').val();
        var start = $('#ledger_start').val();
        var end = $('#ledger_end').val();

        var hasEmptyField = false;

        if (vacation.trim() == '') {
            $('#ledger_vacation').addClass('border-danger');
            hasEmptyField = true;
        }
        if (sick.trim() == '') {
            $('#ledger_sick').addClass('border-danger');
            hasEmptyField = true;
        }
        if (special.trim() == '') {
            $('#ledger_special').addClass('border-danger');
            hasEmptyField = true;
        }
        if (force.trim() == '') {
            $('#ledger_force').addClass('border-danger');
            hasEmptyField = true;
        }
        if (solo.trim() == '') {
            $('#ledger_solo').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start.trim() == '') {
            $('#ledger_start').addClass('border-danger');
            hasEmptyField = true;
        }
        if (end.trim() == '') {
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start > end) {
            $('#ledger_start').addClass('border-danger');
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        var startDate = new Date(start);
        var endDate = new Date(end);

        if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
            __notif_show(-3, 'Invalid Period', 'Must be the same month and year.');
            $('#ledger_start').addClass('border-danger');
            $('#ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }

        if (!hasEmptyField) {
            $('#id_to_update').val(ledger_id);
            open_modal('#making_sure_balance_update_modal');
        }
    });
    $('body').on('click', '#update_now_admin_btn', function() {
        var btn = $(this);
        var id = $('#id_to_update').val();
        var agencyid = $('#ledger_emp').html();
        var vacation = $('#ledger_vacation').val();
        var sick = $('#ledger_sick').val();
        var special = $('#ledger_special').val();
        var force = $('#ledger_force').val();
        var solo = $('#ledger_solo').val();
        var start = $('#ledger_start').val();
        var end = $('#ledger_end').val();

        $.ajax({
            url: "/leave/updatenow_ledger_balance",
            type: "POST",
            dataType: "json",
            data: {
                id: id,
                agencyid: agencyid,
                vacation: vacation,
                sick: sick,
                special: special,
                force: force,
                solo: solo,
                start: start,
                end: end
            },
            beforeSend: function() {
                btn.html('<span class="fa-fade">Updating</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Update');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#making_sure_balance_update_modal');
                    table_leave_ledger(1, $('#leave_ledget_search').val());
                    $('#go_back_ledger').click();
                    __notif_show(3, 'Success', 'Leave balance updated.');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    // Update Instructor Balance
    $('body').on('click', '#update_teacher_ledger_balance_save', function() {
        var ledger_id = $(this).data('id');
        var service_credits = $('#service_credits_val').val();
        var start = $('#teacher_ledger_start').val();
        var end = $('#teacher_ledger_end').val();

        var hasEmptyField = false;

        if (service_credits.trim() == '') {
            $('#service_credits_val').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start.trim() == '') {
            $('#teacher_ledger_start').addClass('border-danger');
            hasEmptyField = true;
        }
        if (end.trim() == '') {
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        if (start > end) {
            $('#teacher_ledger_start').addClass('border-danger');
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }
        var startDate = new Date(start);
        var endDate = new Date(end);

        if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
            __notif_show(-3, 'Invalid Period', 'Must be the same month and year.');
            $('#teacher_ledger_start').addClass('border-danger');
            $('#teacher_ledger_end').addClass('border-danger');
            hasEmptyField = true;
        }

        if (!hasEmptyField) {
            $('#teacher_id_to_update').val(ledger_id);
            open_modal('#teacher_making_sure_balance_update_modal');
        }
    });
    $('body').on('click', '#teacher_update_now_admin_btn', function() {
        var btn = $(this);
        var id = $('#teacher_id_to_update').val();
        var agencyid = $('#ledger_emp').html();
        var service_credits = $('#service_credits_val').val();
        var start = $('#teacher_ledger_start').val();
        var end = $('#teacher_ledger_end').val();

         $.ajax({
                url: "/leave/teacher_updatenow_ledger_balance",
                type: "POST",
                dataType: "json",
                data: {
                    id: id,
                    agencyid: agencyid,
                    service_credits: service_credits,
                    start: start,
                    end: end
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Updating</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Update');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#teacher_making_sure_balance_update_modal');
                        table_leave_ledger(1, $('#leave_ledget_search').val());
                        $('#go_back_ledger').click();
                        __notif_show(3, 'Success', 'Leave balance update.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
    });
}

function set_in_leave_type_btn() {
    $('body').on('click', '.set_in_leave_type_btn', function() {
        var agencyid = $(this).data('agencyid');
        open_modal('#view_leave_available_modal');
        $.ajax({
            url: "/leave/view_available_balance",
            type: "POST",
            dataType: "json",
            data: {agencyid: agencyid},
            beforeSend: function() {
                $('#view_leave_available_container').html(`
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
                $('#view_leave_available_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function load_schedule() {
    var btn = $('#save_schedule');
    $.ajax({
        url: "/leave/get_schedule",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            btn.html('<span class="fa-fade">Getting data</span>');
            btn.prop('disabled', true);
            $('#month_schedule').prop('disabled', true);
            $('#year_schedule').prop('disabled', true);
        },
        success: function (response) {
            btn.html('Save');
            btn.prop('disabled', false);
            $('#month_schedule').prop('disabled', false);
            $('#year_schedule').prop('disabled', false);
            $('#month_schedule').val(response.month);
            $('#year_schedule').val(response.year);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_schedule() {
    $('body').on('click', '#schedule', function() {
        change_active('#schedule');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Set Schedule</div>
                        <div class="intro-y text-xs text-slate-500">Set schedule for the adding of earned leaves per month and year.</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5 py-5">
                    <div class="intro-y">
                        <div>Schedule for Vacation and Sick Leave earned per month.</div>
                        <select class="form-select mt-2" id="month_schedule">
                            <option value="4">4th day of the month</option>
                            <option value="5">5th day of the month</option>
                            <option value="6">6th day of the month</option>
                            <option value="7">7th day of the month</option>
                            <option value="8">8th day of the month</option>
                            <option value="9">9th day of the month</option>
                            <option value="10">10th day of the month</option>
                            <option value="11">11th day of the month</option>
                            <option value="12">12th day of the month</option>
                            <option value="13">13th day of the month</option>
                            <option value="14">14th day of the month</option>
                            <option value="15">15th day of the month</option>
                        </select>
                    </div>
                    <div class="mt-6 intro-y">
                        <div>Schedule for earned leave per year.</div>
                        <select class="form-select mt-2" id="year_schedule">
                            <option value="4">4th day of the year</option>
                            <option value="5">5th day of the year</option>
                            <option value="6">6th day of the year</option>
                            <option value="7">7th day of the year</option>
                            <option value="8">8th day of the year</option>
                            <option value="9">9th day of the year</option>
                            <option value="10">10th day of the year</option>
                            <option value="11">11th day of the year</option>
                            <option value="12">12th day of the year</option>
                            <option value="13">13th day of the year</option>
                            <option value="14">14th day of the year</option>
                            <option value="15">15th day of the year</option>
                        </select>
                    </div>
                    <div class="mt-6 intro-y">
                        <button class="btn btn-success w-full sm: w-40" id="save_schedule">Save</button>
                    </div>
                </div>
            </div>`);

        load_schedule();
    });
}

function save_schedule() {
    $('body').on('click', '#save_schedule', function() {
        var month =   $('#month_schedule').val();
        var year = $('#year_schedule').val();
        var btn = $(this);

        $.ajax({
            url: "/leave/save_schedule",
            type: "POST",
            dataType: "json",
            data: {month: month, year: year},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Saving</span>');
                btn.prop('disabled', true);
                $('#month_schedule').prop('disabled', true);
                $('#year_schedule').prop('disabled', true);
            },
            success: function (response) {
                btn.html('Save');
                btn.prop('disabled', false);
                $('#month_schedule').prop('disabled', false);
                $('#year_schedule').prop('disabled', false);
                __notif_show(3, 'Success', 'Schedule saved.');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function table_service_credits(page, search) {
    $.ajax({
        url: "/leave/table_service_credits",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#service_credits_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#service_credits_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#service_credits_container').html(response.html);
            $('#service_credits_summary').html(response.summary);
            table_pagination(response, '#service_credits_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_service_credits() {
    $('body').on('click', '#service_credits', function() {
        change_active('#service_credits');
        
        $('#content_con').html(`
             <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Service Credits</div>
                        <div class="intro-y text-xs text-slate-500">Track the service credits of all employee.</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <button class="btn btn-secondary w-full sm:w-56 shadow-md" id="service_credits_encoded_logs"><i class="fa-regular fa-folder-closed mr-2"></i> Encoded Logs</button>
                        <div class="hidden md:block mx-auto text-slate-500" id="service_credits_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="service_credits_search" placeholder="Search employee...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-6 mt-5 px-2 sm:px-5" id="service_credits_container">
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="service_credits_pagination"></ul>
                    </nav>
                </div>
            </div>`);

        table_service_credits(1, $('#service_credits_search').val());
    });
}

function pagination_service_credits() {
    $('body').on('click', '#service_credits_pagination a', function() {
        var page = $(this).data('page');
        table_service_credits(page, $('#service_credits_search').val());
    });
}

function search_service_credits() {
    $('body').on('keyup', '#service_credits_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_service_credits(1, $('#service_credits_search').val());
        }, 500);
    });
}

function add_service_credits() {
    $('body').on('click', '#add_service_credits', function() {
        var id = $(this).data('id');
        open_modal('#add_service_credits_modal');
        $.ajax({
            url: "/leave/check_service_credits_class",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#add_service_credits_container').html(`
                    <div class="intro-y col-span-12 border rounded p-5 text-center">
                        <i class="fa-solid fa-ellipsis fa-fade"></i>
                    </div>`);
            },
            success: function (response) {
                $('#add_service_credits_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#add_service_credits_btn', function() {
        var bool = false;
        var agencyid = $('#add_service_credits_agencyid').val();
        var date = $('#add_service_credits_date').val();
        var num = $('#add_service_credits_num').val().trim();
        var btn = $(this);
       
        if (date == '') {
            $('#add_service_credits_date').addClass('border-danger');
            $('#add_service_credits_date_error').html('Date is required.');
            bool = true;
        } 
        if (num <= 0 || num == '') {
            $('#add_service_credits_num').addClass('border-danger');
            $('#add_service_credits_num_error').html('Service credits is required.');
            bool = true;
        }

        if (!bool) {
            $.ajax({
                url: "/leave/save_service_credits",
                type: "POST",
                dataType: "json",
                data: {
                    date: date, 
                    num: num,
                    agencyid: agencyid
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#add_service_credits_modal');
                        table_service_credits(1, $('#service_credits_search').val());
                        __notif_show(3, 'Success', 'Service credits saved.');
                    } else if (response == 'exist') {
                        $('#add_service_credits_date').addClass('border-danger');
                        $('#add_service_credits_date_error').html('Date already exists.');
                    } else {
                        __notif_show(-1, 'Error', 'You are not allowed to add service credits.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function add_service_credits_error_handler() {
    $('body').on('change', '#add_service_credits_date', function() {
        $('#add_service_credits_date').removeClass('border-danger');
        $('#add_service_credits_date_error').html('');
    });

    $('body').on('input', '#add_service_credits_num', function() {
        $('#add_service_credits_num').removeClass('border-danger');
        $('#add_service_credits_num_error').html('');
    });
}

function table_view_earned_credits(page, agencyid, month) {
    $.ajax({
        url: "/leave/view_earned_credits",
        type: "POST",
        dataType: "json",
        data: {page: page, agencyid: agencyid, month: month},
        beforeSend: function() {
            $('#view_earned_credits_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
        },
        success: function (response) {
            $('#view_earned_credits_container').html(response.html);
            $('#balance_service_credits').val(response.balance);
            table_pagination(response, '#view_earned_credits_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function view_earned_credits() {
    $('body').on('click', '#view_earned_credits', function() {
        var agencyid = $(this).data('id');
        var month = $('#view_earned_credits_month').val();
        $('#view_earned_credits_agencyid').val(agencyid);
        open_modal('#view_earned_credits_modal');
        table_view_earned_credits(1, agencyid, month);
    });
}

function pagination_view_earned_credits() {
    $('body').on('click', '#view_earned_credits_pagination a', function() {
        var page = $(this).data('page');
        table_view_earned_credits(page, $('#view_earned_credits_agencyid').val(), $('#view_earned_credits_month').val());
    });
}

function change_month_view_earned_credits() {
    $('body').on('change', '#view_earned_credits_month', function() {
        table_view_earned_credits(1, $('#view_earned_credits_agencyid').val(), $('#view_earned_credits_month').val());
    });
}

function table_service_credits_encoded_logs(page, search, month) {
    $.ajax({
        url: "/leave/table_service_credits_encoded_logs",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search, month: month},
        beforeSend: function() {
            $('#service_credits_encoded_logs_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#summary_service_credits_encoded_logs').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#service_credits_encoded_logs_container').html(response.html);
            $('#summary_service_credits_encoded_logs').html(response.summary);
            table_pagination(response, '#service_credits_encoded_logs_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function service_credits_encoded_logs() {
    $('body').on('click', '#service_credits_encoded_logs', function () {
        open_modal('#service_credits_encoded_logs_modal');
        table_service_credits_encoded_logs(1, $('#service_credits_encoded_logs_employee').val(), $('#service_credits_encoded_logs_month').val());
    });
}

function pagination_service_credits_encoded_logs() {
    $('body').on('click', '#service_credits_encoded_logs_pagination a', function() {
        var page = $(this).data('page');
        table_service_credits_encoded_logs(page, $('#service_credits_encoded_logs_employee').val(), $('#service_credits_encoded_logs_month').val());
    });
}

function search_service_credits_encoded_logs() {
    $('body').on('input', '#service_credits_encoded_logs_employee', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_service_credits_encoded_logs(1, $('#service_credits_encoded_logs_employee').val(), $('#service_credits_encoded_logs_month').val());
        }, 500);
    });
}

function change_month_service_credits_encoded_logs() {
    $('body').on('change', '#service_credits_encoded_logs_month', function() {
        table_service_credits_encoded_logs(1, $('#service_credits_encoded_logs_employee').val(), $('#service_credits_encoded_logs_month').val());
    });
}

function table_conversion(page, search) {
    $.ajax({
        url: "/leave/table_conversion",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#conversion_container').html(`
                <div class="intro-y col-span-12 border rounded p-5 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#conversion_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#conversion_container').html(response.html);
            $('#conversion_summary').html(response.summary);
            table_pagination(response, '#conversion_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_conversion() {
    $('body').on('click', '#conversion', function() {
        change_active('#conversion');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Conversion</div>
                        <div class="intro-y text-xs text-slate-500">Admin to Instructor or Instructor to Admin</div>
                    </h2>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <button class="btn btn-secondary w-full sm:w-56 shadow-md" id="conversion_logs"><i class="fa-regular fa-folder-closed mr-2"></i> Conversion Logs</button>
                        <div class="hidden md:block mx-auto text-slate-500" id="conversion_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" class="form-control w-full sm:w-56 pr-10" id="conversion_search" placeholder="Search employee...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-6 mt-5 px-2 sm:px-5" id="conversion_container">
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="conversion_pagination"></ul>
                    </nav>
                </div>
            </div>`);

        table_conversion(1, $('#conversion_search').val());
    });
}

function pagination_conversion() {
    $('body').on('click', '#conversion_pagination a', function() {
        const page = $(this).data('page');
        table_conversion(page, $('#conversion_search').val());
    });
}

function search_conversion() {
    $('body').on('input', '#conversion_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_conversion(1, $('#conversion_search').val());
        }, 500);
    });
}

function admin_to_instructor() {
    $('body').on('click', '.btn_convert_admin', function() {
        var agencyid = $(this).data('id');
        $('#admin_to_instructor_agencyid').val(agencyid);
        open_modal('#admin_to_instructor_modal');
        $.ajax({
            url: "/leave/admin_to_instructor",
            type: "POST",
            dataType: "json",
            data: {agencyid: agencyid},
            beforeSend: function() {
                $('#admin_to_instructor_vacation_leave').val('');
                $('#admin_to_instructor_sick_leave').val('');
                $('#admin_to_instructor_service_credits').val('');
                $('#admin_to_instructor_convert_btn').html('<span class="fa-fade">Calculating</span>');
                $('#admin_to_instructor_convert_btn').prop('disabled', true);
            },
            success: function (response) {
                $('#admin_to_instructor_convert_btn').html('Convert');
                $('#admin_to_instructor_convert_btn').prop('disabled', false);
                $('#admin_to_instructor_vacation_leave').val(response.vacation_leave);
                $('#admin_to_instructor_sick_leave').val(response.sick_leave);
                $('#admin_to_instructor_service_credits').val(response.service_credits);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#admin_to_instructor_convert_btn', function() {
        var btn = $(this);
        var bool = true;
        var agencyid = $('#admin_to_instructor_agencyid').val();
        var vacation_leave = $('#admin_to_instructor_vacation_leave').val();
        var sick_leave = $('#admin_to_instructor_sick_leave').val();
        var service_credits = $('#admin_to_instructor_service_credits').val();

        if (vacation_leave == '') {
            bool = false;
        }

        if (sick_leave == '') {
            bool = false;
        }

        if (service_credits == '') {
            bool = false;
        }

        if (bool) {
            $.ajax({
                url: "/leave/admin_to_instructor_convert",
                type: "POST",
                dataType: "json",
                data: {
                    agencyid: agencyid, 
                    service_credits: service_credits,
                    vacation_leave: vacation_leave,
                    sick_leave: sick_leave
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Converting</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Convert');
                    btn.prop('disabled', false);
                    close_modal('#admin_to_instructor_modal');
                    __notif_show(3, 'Success', 'Conversion successful.');
                    table_conversion(1, $('#conversion_search').val());
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function instructor_to_admin() {
    $('body').on('click', '.btn_convert_instructor', function() {
        var agencyid = $(this).data('id');
        $('#instructor_to_admin_agencyid').val(agencyid);
        $('#instructor_to_admin_force_leave').val('');
        $('#instructor_to_admin_special_privelege_leave').val('');
        open_modal('#instructor_to_admin_modal');
        $.ajax({
            url: "/leave/instructor_to_admin",
            type: "POST",
            dataType: "json",
            data: {agencyid: agencyid},
            beforeSend: function() {
                $('#instructor_to_admin_vacation_leave').val('');
                $('#instructor_to_admin_sick_leave').val('');
                $('#instructor_to_admin_service_credits').val('');
                $('#instructor_to_admin_convert_btn').html('<span class="fa-fade">Calculating</span>');
                $('#instructor_to_admin_convert_btn').prop('disabled', true);
            },
            success: function (response) {
                $('#instructor_to_admin_convert_btn').html('Convert');
                $('#instructor_to_admin_convert_btn').prop('disabled', false);
                $('#instructor_to_admin_vacation_leave').val(response.vacation_leave);
                $('#instructor_to_admin_sick_leave').val(response.sick_leave);
                $('#instructor_to_admin_service_credits').val(response.service_credits);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#instructor_to_admin_convert_btn', function() {
        var btn = $(this);
        var bool = true;
        var agencyid = $('#instructor_to_admin_agencyid').val();
        var vacation_leave = $('#instructor_to_admin_vacation_leave').val();
        var sick_leave = $('#instructor_to_admin_sick_leave').val();
        var service_credits = $('#instructor_to_admin_service_credits').val();
        var force_leave = $('#instructor_to_admin_force_leave').val();
        var special_privelege_leave = $('#instructor_to_admin_special_privelege_leave').val();

        if (vacation_leave == '') {
            bool = false;
        }

        if (sick_leave == '') {
            bool = false;
        }

        if (force_leave == '') {
            $('#instructor_to_admin_force_leave').addClass('border-danger');
            $('#instructor_to_admin_force_leave_error').html('Please enter');
            bool = false;
        }

        if (special_privelege_leave == '') {
            $('#instructor_to_admin_special_privelege_leave').addClass('border-danger');
            $('#instructor_to_admin_special_privelege_leave_error').html('Please enter');   
            bool = false;
        }

        if (force_leave > 5 || force_leave < 0) {
            $('#instructor_to_admin_force_leave').addClass('border-danger');
            $('#instructor_to_admin_force_leave_error').html('Please enter 0-5');
            bool = false;
        }

        if (special_privelege_leave > 3 || special_privelege_leave < 0) {
            $('#instructor_to_admin_special_privelege_leave').addClass('border-danger');
            $('#instructor_to_admin_special_privelege_leave_error').html('Please enter 0-3');
            bool = false;
        }

        if (bool) {
            $.ajax({
                url: "/leave/instructor_to_admin_convert",
                type: "POST",
                dataType: "json",
                data: {
                    agencyid: agencyid, 
                    service_credits: service_credits,
                    vacation_leave: vacation_leave,
                    sick_leave: sick_leave,
                    force_leave: force_leave,
                    special_privelege_leave: special_privelege_leave
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Converting</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Convert');
                    btn.prop('disabled', false);
                    close_modal('#instructor_to_admin_modal');
                    __notif_show(3, 'Success', 'Conversion successful.');
                    table_conversion(1, $('#conversion_search').val());
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }   
    });
}

function convert_pending() {
    $('body').on('click', '.convert_pending', function() {
        open_modal('#conversion_pending_modal');
    });
}

function conversion_error_handler() {
    $('body').on('input', '#instructor_to_admin_force_leave', function() {
        $('#instructor_to_admin_force_leave').removeClass('border-danger');
        $('#instructor_to_admin_force_leave_error').html('');
    });

    $('body').on('input', '#instructor_to_admin_special_privelege_leave', function() {
        $('#instructor_to_admin_special_privelege_leave').removeClass('border-danger');
        $('#instructor_to_admin_special_privelege_leave_error').html('');
    });
}

function table_conversion_logs(page, search) {
    $.ajax({
        url: "/leave/table_conversion_logs",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#conversion_logs_container').html(`
                <div class="intro-x col-span-12 border text-center rounded p-5">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#summary_conversion_logs').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#conversion_logs_container').html(response.html);
            $('#summary_conversion_logs').html(response.summary);
            table_pagination(response, '#conversion_logs_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}   

function conversion_logs() {
    $('body').on('click', '#conversion_logs', function() {
        open_modal('#conversion_logs_modal');
        table_conversion_logs(1, $('#conversion_logs_employee').val());
    });
}

function conversion_logs_pagination() {
    $('body').on('click', '#conversion_logs_pagination a', function() {
        const page = $(this).data('page');
        table_conversion_logs(page, $('#conversion_logs_employee').val());
    });
}

function search_conversion_logs() {
    $('body').on('input', '#conversion_logs_employee', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_conversion_logs(1, $('#conversion_logs_employee').val());
        }, 500);
    });
}

function table_emp_leave_ledger(page, search) {
    $.ajax({
        url: "/leave/table_emp_leave_ledger",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#emp_leave_ledger_container').html(`
                <div class="intro-x col-span-12 border text-center rounded p-5">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#emp_leave_ledger_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#emp_leave_ledger_container').html(response.html);
            $('#emp_leave_ledger_summary').html(response.summary);
            table_pagination(response, '#emp_leave_ledger_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}   

function show_emp_leave_ledger() {
    $('body').on('click', '#emp_leave_ledger', function() {
        change_active('#emp_leave_ledger');

        $('#content_con').html(`
             <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Leave Ledger</div>
                        <div class="intro-y text-xs text-slate-500">View all Employees Leave Ledger</div>
                    </h2>
                </div> 
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5">
                        <div class="hidden md:block mx-auto text-slate-500" id="emp_leave_ledger_summary">Showing 1 to 10 of 150 entries</div>
                        <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-full sm:w-56 relative text-slate-500">
                                <input type="text" id="emp_leave_ledger_search" class="form-control w-full sm:w-56 pr-10" placeholder="Search employee...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-6 mt-5 px-2 sm:px-5" id="emp_leave_ledger_container">
                    </div>
                </div>
                <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-4 pb-5 px-2 sm:px-5">
                    <nav class="w-full sm:w-auto sm:mr-auto px-0 sm:px-5">
                        <ul class="pagination" id="emp_leave_ledger_pagination"></ul>
                    </nav>
                </div>
            </div>`);

        table_emp_leave_ledger(1, $('#emp_leave_ledger_search').val());
    });
}

function pagination_emp_leave_ledger() {
    $('body').on('click', '#emp_leave_ledger_pagination a', function() {
        const page = $(this).data('page');
        table_emp_leave_ledger(page, $('#emp_leave_ledger_search').val());
    });
}

function search_emp_leave_ledger() {
    $('body').on('input', '#emp_leave_ledger_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_emp_leave_ledger(1, $('#emp_leave_ledger_search').val());
        }, 500);
    });
}

function hard_copy_employee() {
    $.ajax({
        url: "/leave/hard_copy_employee",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#hard_copy_employee_id').prop('disabled', true);
            $('#hard_copy_supervisor').prop('disabled', true);
        },
        success: function (response) {
            $('#hard_copy_employee_id').prop('disabled', false);
            $('#hard_copy_supervisor').prop('disabled', false);
            $('#hard_copy_employee_id').html(response); 
            $('#hard_copy_supervisor').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function show_hard_copy() {
    $('body').on('click', '#hard_copy', function() {
        change_active('#hard_copy');

        $('#content_con').html(`
            <div>
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        <div  class="intro-y">Encode Hard Copy</div>
                        <div class="intro-y text-xs text-slate-500">Employee's Hard Copy details</div>
                    </h2>
                </div> 
                <div class="px-2 sm:px-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-3 px-0 sm:px-5" style="justify-content: flex-end;">
                        <button class="btn btn-secondary w-full sm:w-56 shadow-md" id="hard_copy_logs_btn"><i class="fa-regular fa-folder-closed mr-2"></i> Hard Copy Logs</button>
                    </div>
                </div>
                <div class="px-2 sm:px-5">
                    <div class="grid grid-cols-12 gap-2 mt-5 px-2 sm:px-5">
                        <div class="intro-y col-span-12 form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Employee Name</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                    <div class="leading-relaxed text-slate-500 text-xs mt-3"> Check the employee's <a href="" class="text-primary"> Leave Balance here</a> </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <select data-placeholder="Search employee name" id="hard_copy_employee_id" class="form-select">
                                    <option value="0" disabled selected>Choose an employee</option>
                                </select>
                                <div id="hard_copy_employee_id_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Leave Type</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <select class="form-select" id="hard_copy_leave_type">
                                    <option disabled selected>Please Select</option>
                                </select>
                                <div id="hard_copy_leave_type_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div id="hard_copy_details_container" class="col-span-12 mt-1"></div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Date of Filing</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <input id="hard_copy_date_of_filing" type="datetime-local" class="form-control" placeholder="">
                                <div id="hard_copy_date_of_filing_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Date Range</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <input id="hard_copy_date_range" type="text" class="form-control" placeholder="">
                                <div id="hard_copy_date_range_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Days</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <input id="hard_copy_days" type="number" disabled class="form-control" placeholder="Please Enter">
                                <div id="hard_copy_days_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12">
                            <div class="w-full flex justify-center border-t border-slate-200/60 dark:border-darkmode-400 mt-5">
                                <div class="bg-white dark:bg-darkmode-600 px-5 -mt-3 text-slate-500">Signatory</div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:mt-0 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Supervisor / Academic Ext / Date Approved</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <div class="sm:grid grid-cols-3 gap-2">
                                    <div class="input-group">
                                        <select data-placeholder="Search employee name" id="hard_copy_supervisor" class="form-select">
                                            <option value="0" disabled selected>Choose an employee</option>
                                        </select>
                                        <div id="hard_copy_supervisor_error" class="text-center text-red-500 text-xs"></div>
                                    </div>
                                    <div class="input-group mt-2 sm:mt-0">
                                        <input type="text" id="hard_copy_academic_extension" class="form-control" placeholder="Academic Extension">
                                        <div id="hard_copy_academic_extension_error" class="text-center text-red-500 text-xs"></div>
                                    </div>
                                    <div class="input-group mt-2 sm:mt-0">
                                        <input type="datetime-local" id="hard_copy_date_approved" class="form-control" placeholder="Academic Extension">
                                        <div id="hard_copy_date_approved_error" class="text-center text-red-500 text-xs"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Certification of Leave Credits</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <input id="hard_copy_certification_of_leave_credits" type="datetime-local" class="form-control" placeholder="Input SKU">
                                <div id="hard_copy_certification_of_leave_credits_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                        <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                            <div class="form-label xl:w-64 xl:!mr-10">
                                <div class="text-left">
                                    <div class="flex items-center">
                                        <div class="font-medium">Approved</div>
                                        <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mt-3 xl:mt-0 flex-1">
                                <input id="hard_copy_approved" type="datetime-local" class="form-control" placeholder="Input SKU">
                                <div id="hard_copy_approved_error" class="text-center text-red-500 text-xs"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="intro-y mt-8 pb-5 px-2 sm:px-5">
                    <div class="px-0 sm:px-5">
                        <button class="btn btn-elevated-success w-40 mr-1 mb-2" id="hard_copy_save">Save</button>
                    </div>
                </div>
            </div>`);

        hard_copy_employee();

        let element_id = 'hard_copy_date_range';
        hard_copy_date_range = new Litepicker({
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

        hard_copy_get_working_days();
    });

}

function employee_leave_type() {
    $('body').on('change', '#hard_copy_employee_id', function() {
        var employee = $(this).val();
        $.ajax({
            url: "/leave/hard_copy_employee_leave_type",
            type: "POST",
            dataType: "json",
            data: {employee: employee},
            beforeSend: function() {
                $('#hard_copy_leave_type').prop('disabled', true);
            },
            success: function (response) {
                $('#hard_copy_leave_type').prop('disabled', false);
                $('#hard_copy_leave_type').html(response); 
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function change_leave_type() {
    $('body').on('change', '#hard_copy_leave_type', function() {
        var leave_type = $(this).val();
        if (leave_type == '1' || leave_type == '6') {
            $('#hard_copy_details_container').html(`
            <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Details of Leave</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <select class="form-select" id="hard_copy_details_of_leave">
                        <option value="" disabled selected>Please select</option>
                        <option value="1">Within the Philippines</option>
                        <option value="2">Abroad</option>
                    </select>
                    <div id="hard_copy_details_of_leave_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>
            <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Specify</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <input id="hard_copy_specify" type="text" class="form-control" placeholder="Please Enter">
                    <div id="hard_copy_specify_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>`);
        } else if (leave_type == '3') {
            $('#hard_copy_details_container').html(`
            <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Details of Leave</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <select class="form-select" id="hard_copy_details_of_leave">
                        <option value="" disabled selected>Please select</option>
                        <option value="3">In Hospital</option>
                        <option value="4">Out Patient</option>
                    </select>
                    <div id="hard_copy_details_of_leave_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>
            <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Specify</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <input id="hard_copy_specify" type="text" class="form-control" placeholder="Please Enter">
                    <div id="hard_copy_specify_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>`);
        } else if (leave_type == '11') {
            $('#hard_copy_details_container').html(`
             <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Specify</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <input id="hard_copy_specify" type="text" class="form-control" placeholder="Please Enter">
                    <div id="hard_copy_specify_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>`);
        } else if (leave_type == '8') {
            $('#hard_copy_details_container').html(`
                <div class="intro-y col-span-12 form-inline items-center flex-col xl:flex-row pt-3 first:pt-0">
                <div class="form-label xl:w-64 xl:!mr-10">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Details of Leave</div>
                            <div class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">Required</div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-3 xl:mt-0 flex-1">
                    <select class="form-select" id="hard_copy_details_of_leave">
                        <option value="" disabled selected>Please select</option>
                        <option value="5">Completion of Master's Degree</option>
                        <option value="6">BAR/Board Examination Review</option>
                    </select>
                    <div id="hard_copy_details_of_leave_error" class="text-center text-red-500 text-xs"></div>
                </div>
            </div>`);
        } else {
            $('#hard_copy_details_container').html('');
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

function hard_copy_get_working_days() {
    hard_copy_date_range.on('selected',function(date){
        const start_date = hard_copy_date_range.getStartDate('YYYY-MM-DD'),
            end_date = hard_copy_date_range.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        $('#hard_copy_date_range_error').html('');
        
        $.ajax({
            url: "/leave/calculate_days",
            type: "POST",
            dataType: "json",
            data: {
                start: start,
                end: end
            },
            success: function (response) {
                $('#hard_copy_days').val(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function hard_copy_save() {
    $('body').on('click', '#hard_copy_save', function() {
        var details_of_leave = null;
        var specify = null;
        var btn = $(this);
        let bool = true;
        var requester = $('#hard_copy_employee_id').val();
        var leave_type = $('#hard_copy_leave_type').val();
        var days = $('#hard_copy_days').val();
        var date_of_filing = $('#hard_copy_date_of_filing').val();
        var date_range = $('#hard_copy_date_range').val();
        var supervisor = $('#hard_copy_supervisor').val();
        var academic_extension = $('#hard_copy_academic_extension').val();
        var date_approved = $('#hard_copy_date_approved').val();
        var certification_of_leave_credits = $('#hard_copy_certification_of_leave_credits').val();
        var approved = $('#hard_copy_approved').val();

        if (leave_type == '1' || leave_type == '3' || leave_type == '8' || leave_type == '6') {
            details_of_leave = $('#hard_copy_details_of_leave').val();

            if (details_of_leave == null || details_of_leave == '') {
                $('#hard_copy_details_of_leave_error').html('Please select a details of leave');
                bool = false;
            }
        }
        if (leave_type == '1' || leave_type == '3' || leave_type == '11' || leave_type == '6') {
            specify = $('#hard_copy_specify').val();

            if (specify == null || specify == '') {
                $('#hard_copy_specify_error').html('Please enter a specify');
                bool = false;
            }
        }
        
        if (requester == null || requester == '') {
            $('#hard_copy_employee_id_error').html('Please select an employee');
            bool = false;
        }

        if (leave_type == null || leave_type == '') {
            $('#hard_copy_leave_type_error').html('Please select a leave type');
            bool = false;
        }

        if (supervisor == null || supervisor == '') {
            $('#hard_copy_supervisor_error').html('Please select a supervisor');
            bool = false;
        }

        if (date_approved == null || date_approved == '') {
            $('#hard_copy_date_approved_error').html('Please select a date');
            bool = false;
        }

        if (certification_of_leave_credits == null || certification_of_leave_credits == '') {
            $('#hard_copy_certification_of_leave_credits_error').html('Please select a datetime');
            bool = false;
        }   

        if (approved == null || approved == '') {
            $('#hard_copy_approved_error').html('Please select a datetime');
            bool = false;
        }
        
        if (date_range == null || date_range == '') {
            $('#hard_copy_date_range_error').html('Please select a date range');
            bool = false;
        }

        if (date_of_filing == null || date_of_filing == '') {
            $('#hard_copy_date_of_filing_error').html('Please select a date');
            bool = false;
        }

        if (bool) {
            const start_date = hard_copy_date_range.getStartDate('YYYY-MM-DD'),
                end_date = hard_copy_date_range.getEndDate('YYYY-MM-DD');
            var start = getDateFormat(start_date);
            var end = getDateFormat(end_date);

            var data = {
                requester: requester,
                leave_type: leave_type,
                details_of_leave: details_of_leave,
                specify: specify,
                date_of_filing: date_of_filing,
                start: start,
                end: end,
                days: days,
                supervisor: supervisor,     
                academic_extension: academic_extension,
                date_approved: date_approved,
                certification_of_leave_credits: certification_of_leave_credits,
                approved: approved,
            }

            $.ajax({
                url: "/leave/hard_copy_save",
                type: "POST",
                dataType: "json",
                data: data,
                beforeSend: function() {
                    btn.prop('disabled', true);
                    btn.html('<span class="fa-fade">Saving</span>');
                },
                success: function (response) {
                    btn.prop('disabled', false);
                    btn.html('Save');
                    if (response == 'success') {
                        $('#hard_copy_employee_id').val('');
                        $('#hard_copy_leave_type').val('');
                        $('#hard_copy_details_container').html('');
                        $('#hard_copy_date_of_filing').val('');
                        hard_copy_date_range.clearSelection();
                        $('#hard_copy_days').val('');
                        $('#hard_copy_supervisor').val('');
                        $('#hard_copy_academic_extension').val('');
                        $('#hard_copy_date_approved').val('');
                        $('#hard_copy_certification_of_leave_credits').val('');
                        $('#hard_copy_approved').val('');
                        __notif_show(1, 'Success', 'Leave application saved successfully.');
                    } else if (response == 'year_error') {
                        __notif_show(2, 'Error', 'Leave Type cannot be applied in this year');
                    } else if (response == 'exist') {
                        __notif_show(2, 'Error', 'Leave application already exists in this date.');
                    } else if (response == 'exceed') {
                        __notif_show(2, 'Error', 'His/her application exceeded his/her balance.');
                    } else if (response == 'not_available') {
                        __notif_show(2, 'Error', 'No available balance.');
                    } else if (response == 'not_assigned') {
                        __notif_show(2, 'Error', 'Employee not assigned to a campus.');
                    } else if (response == 'not_employed') {
                        __notif_show(2, 'Error', 'Employee not employed.');
                    } else if (response == 'sig_not_set') {
                        __notif_show(2, 'Error', 'Signatory not set.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function hard_copy_correction() {
    $('body').on('change', '#hard_copy_employee_id', function() {
        $('#hard_copy_employee_id_error').html('');
    });

    $('body').on('change', '#hard_copy_leave_type', function() {
        $('#hard_copy_leave_type_error').html('');
    });

    $('body').on('change', '#hard_copy_details_of_leave', function() {
        $('#hard_copy_details_of_leave_error').html('');
    });

    $('body').on('input', '#hard_copy_specify', function() {
        $('#hard_copy_specify_error').html('');
    });

    $('body').on('change', '#hard_copy_date_of_filing', function() {
        $('#hard_copy_date_of_filing_error').html('');
    });

    $('body').on('change', '#hard_copy_supervisor', function() {
        $('#hard_copy_supervisor_error').html('');
    });

    $('body').on('change', '#hard_copy_date_approved', function() {
        $('#hard_copy_date_approved_error').html('');
    });

    $('body').on('change', '#hard_copy_certification_of_leave_credits', function() {
        $('#hard_copy_certification_of_leave_credits_error').html('');
    });

    $('body').on('change', '#hard_copy_approved', function() {
        $('#hard_copy_approved_error').html('');
    });
}

function table_hard_copy_logs(page, search) {
    $.ajax({
        url: "/leave/table_hard_copy_logs",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#hard_copy_logs_container').html(`
                <div class="intro-x col-span-12 border text-center rounded p-5">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#hard_copy_logs_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#hard_copy_logs_container').html(response.html);
            $('#hard_copy_logs_summary').html(response.summary);
            table_pagination(response, '#hard_copy_logs_pagination');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function hard_copy_logs() {
    $('body').on('click', '#hard_copy_logs_btn', function() {
        open_modal('#hard_copy_logs_modal');
        table_hard_copy_logs(1, '');
    });
}

function pagination_hard_copy_logs() {
    $('body').on('click', '#hard_copy_logs_pagination a', function() {
        const page = $(this).data('page');
        table_hard_copy_logs(page, $('#hard_copy_logs_search').val());
    });
}

function search_hard_copy_logs() {
    $('body').on('input', '#hard_copy_logs_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            table_hard_copy_logs(1, $('#hard_copy_logs_search').val());
        }, 500);
    });
}

function delete_hard_copy_logs() {
    $('body').on('click', '.remove_hard_copy_logs', function() {
        const id = $(this).data('id');
        $('#rmv_hard_copy_logs_id').val(id);
        open_modal('#remove_hard_copy_logs_modal');
    });

    $('body').on('click', '#rmv_hard_copy_logs_btn_confirm', function() {
        var btn = $(this);
        const id = $('#rmv_hard_copy_logs_id').val();

        $.ajax({
            url: "/leave/delete_hard_copy_logs",
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
                    __notif_show(1, 'Success', 'Leave application deleted successfully.');
                    $('#remove_hard_copy_logs_modal').modal('hide');
                    close_modal('#remove_hard_copy_logs_modal');
                    table_hard_copy_logs(1, '');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}