$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let gac_force_leave_page = 1;
let gac_force_leave_timeout;
var gac_custom_date_leave = '';
let gac_action_center_search_timeout;

// Action center variables
let gac_current_page = 1;
let gac_is_loading = false;
let gac_has_more = true;

$(document).ready(function () {
    bom_global_load();

    // Global Messaging Direct Message
    gac_send_message_btn();

    // Time Justification
    gac_justification();
    gac_view_dtr();
    gac_justification_approve();
    gac_justification_disapprove();
    gac_track_request();

    // Leave Application
    gac_leave();
    gac_leave_disapprove();
    gac_leave_approve();

    // Force Leave Reset
    gac_force_leave_reset();
    gac_deduct_btn();
    gac_force_leave_save();
    gac_reset_without_deduction();
    gac_search_force_leave();
    gac_force_leave_next_prev_button();
    gac_deduct_all_btn();
    gac_reset_force_leave_btn();
    gac_reset_no_balance_btn();

    // Special Privelege Leave
    gac_special_privelege_leave();
    gac_special_privelege_leave_confirmation();

    // Action Center
    gac_action_center();
    gac_action_center_search();
    gac_approve_leave();
    gac_approve_custom_date();
    gac_disapprove_leave();
    gac_leave_attachments();

    gac_approve_time_justification();
    gac_disapprove_time_justification();
    gac_time_justification_attachments();
    gac_view_dtr_justification();       
});

function gac_pad(number) {
    return (number < 10 ? '0' : '') + number;
}

function gac_getDateFormat(date) {
    try {
        let year = date.getFullYear(),
            month = gac_pad(date.getMonth()+1),
            day = gac_pad(date.getDate().toString());

        date  = year+'-'+month+'-'+day;

        return date;
    } catch(error) {
        console.log(error.message);
    }
}

function global_send_private_message(receiver, msg, btn) {
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
                close_modal('#global_message_modal');
                __notif_show(3, 'Success', 'Message sent.');
            } else if (response == 'you') {
                __notif_show(-3, 'Failed', 'You can\'t send a message to yourself.');
            }
        },
        error: function(xhr, status, error) {
            // alert(xhr.responseText);
            warningModal(error, xhr.responseText);
        }
    });
}

function bom_global_messaging(receiver_agencyid, receviername) {
    $('#global_msg_receiver_name').html(receviername);
    $('#global_msg_receiver_agencyid').val(receiver_agencyid);
    open_modal('#global_message_modal');
}

function gac_send_message_btn() {
    $('body').on('click', '#gac_send_message_btn', function() {
        var receiver =  $('#global_msg_receiver_agencyid').val();
        var msg = $('#gac_message_content').val();
        var btn = $(this);
        if (msg.trim() == '') {
            $('#gac_message_content').addClass('border-danger');
        } else {
            global_send_private_message(receiver, msg, btn);
        }
    });

    $('body').on('input', '#gac_message_content', function() {
        $('#gac_message_content').removeClass('border-danger');
    });
}

function bom_global_load() {
    $.ajax({
        url: "/gac/gac_load_documents",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
        },
        success: function (response) {
            if (response !== '') {
                $('#gac_whole_container').css('display', 'block');
                $('#gac_container').html(response);
            } else {
                $('#gac_whole_container').css('display', 'none');
            }
        },
        error: function(xhr, status, error) {
            // alert(xhr.responseText);
            warningModal(error, xhr.responseText);
        }
    });
}

function gac_justification() {
    $('body').on('click', '.gac_justification_btn', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        open_modal('#gac_time_justification_modal');
        $.ajax({
            url: "/gac/load_justification_details",
            type: "POST",
            dataType: "json",
            data: {id: id, status: status},
            beforeSend: function() {
                $('#gac_time_just_con').html(`
                    <div class="text-center lg:text-left mt-3 lg:mt-0">
                        <a href="" class="font-medium"><i class="fa-solid fa-ellipsis fa-fade"></i></a>
                        <div class="text-slate-500 text-xs mt-0.5"><i class="fa-solid fa-ellipsis fa-fade"></i></div>
                    </div>`);
                $('#gac_justificaion_body_con').html(`
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
                $('#gac_time_just_con').html(response.header);
                $('#gac_justificaion_body_con').html(response.body);
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_view_dtr () {
    $('body').on('click', '.gac_time_justification_dtr_view_btn', function() {
        var date = $('#gac_time_date').val();
        var agencyid = $('#gac_time_requester').val();
        open_modal('#gac_dtr_view_modal');
        $.ajax({
            url: "/gac/dtr_details",
            type: "POST",
            dataType: "json",
            data: {date: date, agencyid: agencyid},
            beforeSend: function() {
                $('#gac_time_justification_dtr_container').html(`
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
                $('#gac_time_justification_dtr_container').html(response);
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_justification_approve() {
    $('body').on('click', '.gac_time_approve', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        $('#gac_time_app_id').val(id);
        $('#gac_time_app_status').val(status);
        open_modal('#gac_approve_modal');
    });

    $('body').on('click', '#gac_time_approve_btn', function() {
        var id = $('#gac_time_app_id').val();
        var status = $('#gac_time_app_status').val();
        var btn = $(this);

        $.ajax({
            url: "/gac/action_time_justification",
            type: "POST",
            dataType: "json",
            data: {id: id, status: status, diction: 'approve', reason: null},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('Approving');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Approve');
                if (response == 'success') {
                    bom_global_load();
                    close_modal('#gac_time_justification_modal');
                    close_modal('#gac_approve_modal');
                    __show_notif(3, 'Success', 'Time justification <span class="text-success">approve</span>.');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_justification_disapprove() {
    $('body').on('click', '.gac_time_disapprove', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        $('#gac_time_dis_id').val(id);
        $('#gac_time_dis_status').val(status);
        open_modal('#gac_disapprove_modal');
    });

    $('body').on('click', '#gac_time_disapprove_btn', function() {
        var id = $('#gac_time_dis_id').val();
        var status = $('#gac_time_dis_status').val();
        var reason = $('#gac_time_reason_input').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#gac_time_reason_input').addClass('border-danger');
        } else {
            $.ajax({
                url: "/gac/action_time_justification",
                type: "POST",
                dataType: "json",
                data: {id: id, status: status, diction: 'disapprove', reason: reason},
                beforeSend: function() {
                    btn.prop('disabled', true);
                    btn.html('Disapproving');
                },
                success: function (response) {
                    btn.prop('disabled', false);
                    btn.html('Disapprove');
                    if (response == 'success') {
                        bom_global_load();
                        close_modal('#gac_time_justification_modal');
                        close_modal('#gac_disapprove_modal');
                        __show_notif(3, 'Success', 'Time justification <span class="text-danger">disapprove</span>.');
                    }
                },
                error: function(xhr, status, error) {
                    // alert(xhr.responseText);
                    warningModal(error, xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#gac_time_reason_input', function() {
        $(this).removeClass('border-danger');
    });
}

function gac_track_request() {
    $('body').on('click', '.gac_track_request', function() {
        var id = $(this).data('id');
        open_modal('#gac_tracking_modal');
        $.ajax({
            url: "/gac/justification_details_dtr",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#gac_time_tracking_container').html(`
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
                $('#gac_time_tracking_container').html(response);
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_leave() {
    $('body').on('click', '.gac_leave_btn', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        open_modal('#gac_leave_modal');
        $.ajax({
            url: "/gac/load_leave_details",
            type: "POST",
            dataType: "json",
            data: {id: id, status: status},
            beforeSend: function() {
                $('#gac_leave_head_con').html(`
                    <div class="text-center lg:text-left mt-3 lg:mt-0">
                        <a href="" class="font-medium"><i class="fa-solid fa-ellipsis fa-fade"></i></a>
                        <div class="text-slate-500 text-xs mt-0.5"><i class="fa-solid fa-ellipsis fa-fade"></i></div>
                    </div>`);
                $('#gac_leave_body_con').html(`
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
                $('#gac_leave_head_con').html(response.header);
                $('#gac_leave_body_con').html(response.body);
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_leave_disapprove() {
    $('body').on('click', '.gac_leave_disapprove', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        $('#gac_leave_dis_id').val(id);
        $('#gac_leave_dis_status').val(status);
        open_modal('#gac_leave_disapprove_modal');
    });

    $('body').on('click', '#gac_leave_disapprove_btn', function() {
        var id = $('#gac_leave_dis_id').val();
        var status = $('#gac_leave_dis_status').val();
        var reason = $('#gac_leave_reason_input').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#gac_leave_reason_input').addClass('border-danger');
            $('#gac_leave_reason_input_err').html('Please provide reason');
        } else if (reason.trim().length > 40 && status == 'super') {
            $('#gac_leave_reason_input').addClass('border-danger');
            $('#gac_leave_reason_input_err').html('Limited to 40 characters only.');
        } else if (reason.trim().length > 90 && status == 'app') {
            $('#gac_leave_reason_input').addClass('border-danger');
            $('#gac_leave_reason_input_err').html('Limited to 90 characters only.');
        } else {
            $.ajax({
                url: "/gac/action_leave_application",
                type: "POST",
                dataType: "json",
                data: {id: id, status: status, diction: 'disapprove', reason: reason},
                beforeSend: function() {
                    btn.prop('disabled', true);
                    btn.html('Disapproving');
                },
                success: function (response) {
                    btn.prop('disabled', false);
                    btn.html('Disapprove');
                    if (response == 'success') {
                        bom_global_load();
                        close_modal('#gac_leave_modal');
                        close_modal('#gac_leave_disapprove_modal');
                        __show_notif(3, 'Success', 'Leave application <span class="text-danger">disapprove</span>.');
                    }
                },
                error: function(xhr, status, error) {
                    // alert(xhr.responseText);
                    warningModal(error, xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#gac_leave_reason_input', function() {
        $(this).removeClass('border-danger');
        $('#gac_leave_reason_input_err').html('');
    });
}

function gac_leave_approve() {
    $('body').on('click', '.gac_leave_approve', function() {
        var id = $(this).data('id');
        var status = $(this).data('status');
        $('#gac_leave_app_id').val(id);
        $('#gac_leave_app_status').val(status);
        open_modal('#gac_leave_approve_modal');
    });

    $('body').on('click', '#gac_leave_approve_btn', function() {
        var id = $('#gac_leave_app_id').val();
        var status = $('#gac_leave_app_status').val();
        var btn = $(this);

        $.ajax({
            url: "/gac/action_leave_application",
            type: "POST",
            dataType: "json",
            data: {id: id, status: status, diction: 'approve', reason: null},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('Approving');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Approve');
                if (response == 'success') {
                    bom_global_load();
                    close_modal('#gac_leave_modal');
                    close_modal('#gac_leave_approve_modal');
                    __show_notif(3, 'Success', 'Time justification <span class="text-success">approve</span>.');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_force_leave_reset() {
    const currentMonth = new Date().getMonth();
    
    // Only run in January (0), February (1), or March (2)
    if (currentMonth <= 2) {
        $.ajax({
            url: "/leave/force_leave_check_resetter", 
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response == 'success') {
                    open_modal('#force_leave_reset_modal');
                    gac_force_leave_table(1, $('#gac_force_leave_reset_search').val());
                }
                // } else if (response == 'no_balance') {
                //     open_modal('#gac_force_leave_no_balance_modal');
                // }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    }
}

function gac_force_leave_table(page, search) {
    gac_force_leave_page = page || 1;
    $.ajax({
        url: "/leave/force_leave_reset",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#gac_force_leave_reset_container').html(`
            <div class="col-span-12">
                <div class="flex justify-center border intro-x rounded-md p-3">
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
            $('#gac_force_leave_reset_container').html(response.html);
            $('#gac_force_leave_reset_entries_count').html(response.summary);

            const previousPageButton = $('#gac_force_leave_reset_prev_btn');
            const nextPageButton = $('#gac_force_leave_reset_next_btn');
            if (response.users.current_page === 1) {
                previousPageButton.prop('disabled', true);
            } else {
                previousPageButton.prop('disabled', false);
            }
            if (response.users.current_page === response.users.last_page) {
                nextPageButton.prop('disabled', true);
            } else {
                nextPageButton.prop('disabled', false);
            }
        },
        error: function(xhr, status, error) {
            // alert(xhr.responseText);
            warningModal(error, xhr.responseText);
        }
    });
}

function gac_deduct_btn() {
    $('body').on('click', '.gac_deduct_force_leave_vl_btn', function() {
        var id = $(this).data('id');
        var vl = $(this).data('vl');
        var fl = $(this).data('fl');
        var new_vl = Number((vl - fl).toFixed(3));
        $('#gac_force_leave_id').val(id);
        $('#gac_vacation_leave_balance').val(vl);
        $('#gac_force_leave_balance').val(fl);
        $('#gac_updated_vacation_leave').val(new_vl);
        open_modal('#force_leave_computation_modal');
    });
}

function gac_search_force_leave() {
    $('body').on('input', '#gac_force_leave_reset_search', function() {
        clearTimeout(gac_force_leave_timeout);

        gac_force_leave_timeout = setTimeout(function() {
            gac_force_leave_table(1, $('#gac_force_leave_reset_search').val());
        }, 500);
    });
}

function gac_force_leave_next_prev_button() {
    $('body').on('click', '#gac_force_leave_reset_prev_btn', function() {
        if (gac_force_leave_page > 1) {
            gac_force_leave_page--;
            gac_force_leave_table(gac_force_leave_page, $('#gac_force_leave_reset_search').val());
        }
    });

    $('body').on('click', '#gac_force_leave_reset_next_btn', function() {
        gac_force_leave_page++;
        gac_force_leave_table(gac_force_leave_page, $('#gac_force_leave_reset_search').val());
    });
}

function gac_force_leave_save() {
    $('body').on('click', '#gac_force_leave_save_btn', function() {
        var btn = $(this);
        var id = $('#gac_force_leave_id').val();
        var fl = $('#gac_force_leave_balance').val();
        var old_vl = $('#gac_vacation_leave_balance').val();
        var new_vl = $('#gac_updated_vacation_leave').val();

        $.ajax({
            url: "/leave/save_new_vl",
            type: "POST",
            dataType: "json",
            data: {id: id, new_vl: new_vl, fl: fl, old_vl: old_vl},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Saving</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Save');
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Vacation leave updated.');
                    close_modal('#force_leave_computation_modal');
                    $('#gac_force_leave_reset_search').val('');
                    gac_force_leave_table(1, '');
                } else {
                    __notif_show(3, 'Success', 'Vacation leave updated.');
                    close_modal('#force_leave_computation_modal');
                    close_modal('#force_leave_reset_modal');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_reset_without_deduction() {
    $('body').on('click', '#gac_force_leave_reset_without_deduction_btn', function() {
        open_modal('#gac_reset_without_deduction_confirmation_modal');
    });

    $('body').on('click', '#gac_reset_without_deduction_confirmation_modal_btn', function() {
        var btn = $(this);
        var id = $('#gac_force_leave_id').val();
        
        $.ajax({
            url: "/leave/reset_fl_no_deduction",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Resetting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Reset');
                close_modal('#gac_reset_without_deduction_confirmation_modal');
                close_modal('#force_leave_computation_modal');
                __notif_show(3, 'Success', 'Force leave reset.');
                $('#gac_force_leave_reset_search').val('');
                gac_force_leave_table(1, '');
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_deduct_all_btn() {
    $('body').on('click', '#gac_force_leave_reset_deduct_all_btn', function() {
        open_modal('#gac_deduct_all_confirmation_modal');
    });

    $('body').on('click', '#gac_deduct_all_btn', function() {
        var btn = $(this);
        $.ajax({
            url: "/leave/deduct_all_force_leave",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Deducting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Deduct');
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Force leave deducted.');
                    close_modal('#gac_deduct_all_confirmation_modal');
                    close_modal('#force_leave_reset_modal');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_special_privelege_leave() {
    const currentMonth = new Date().getMonth();

    // Only run in January (month 0)
    if (currentMonth === 0) {
        $.ajax({
            url: "/leave/special_privelege_leave_check_resetter", 
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response == 'success') {
                    open_modal('#gac_special_privelege_leave_modal');
                } 
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    }
}

function gac_special_privelege_leave_confirmation() {
    $('body').on('click', '#gac_special_privelege_leave_btn', function() {
        open_modal('#gac_special_privelege_leave_confirmation_modal');
    });

    $('body').on('click', '#gac_special_privelege_leave_confirmation_btn', function() {
        var btn = $(this);
        $.ajax({
            url: "/leave/special_privelege_leave_reset",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Resetting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Reset');
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Special Privelege Leave reset.');
                    close_modal('#gac_special_privelege_leave_confirmation_modal');  
                    close_modal('#gac_special_privelege_leave_modal');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_reset_force_leave_btn() {
    $('body').on('click', '.gac_reset_force_leave_btn', function() {
        var id = $(this).data('id');
        $('#gac_force_leave_reset_id').val(id);
        open_modal('#gac_reset_force_leave_confirmation_modal');
    });

    $('body').on('click', '#gac_force_leave_nb_reset_btn', function() {
        var btn = $(this);
        var id = $('#gac_force_leave_reset_id').val();
        $.ajax({
            url: "/leave/fl_no_balance_reset",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Resetting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Reset');
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Force Leave reset.');
                    close_modal('#gac_reset_force_leave_confirmation_modal');
                    $('#gac_force_leave_reset_search').val('');
                    gac_force_leave_table(1, '');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_reset_no_balance_btn() {
    $('body').on('click', '#gac_flnb_reset_all_btn', function() {
        open_modal('#gac_reset_no_balance_confirmation_modal');
    });

    $('body').on('click', '#gac_flnb_reset_all_btn_modal', function() {
        var btn = $(this);
        $.ajax({
            url: "/leave/fl_no_balance_reset_all",
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                btn.prop('disabled', true);
                btn.html('<span class="fa-fade">Resetting</span>');
            },
            success: function (response) {
                btn.prop('disabled', false);
                btn.html('Reset');
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Force Leave reset.');
                    close_modal('#gac_reset_no_balance_confirmation_modal');
                    close_modal('#force_leave_reset_modal');
                }
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

function gac_load_content(page, append = false) {
    if (gac_is_loading || !gac_has_more) return;
    
    gac_is_loading = true;
    var search = $('#gac_action_center_search').val();
    
    $.ajax({
        url: "/gac/action_center_content",
        type: "GET",
        data: { page: page, search: search },
        dataType: "json",
        beforeSend: function() {
            if (!append) {
                $('#gac_action_center_content_body').html(`
                <div class="border p-5 rounded-md flex items-center justify-center">
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
            } else {
                $('#gac_action_center_content_body').append(`
                <div class="border p-5 rounded-md flex items-center justify-center">
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
            }
        },
        success: function (response) {
            if (append) {
                $('#gac_action_center_content_body').find('.border.p-5.rounded-md.flex.items-center.justify-center').last().remove();
                $('#gac_action_center_content_body').append(response.html);
            } else {
                $('#gac_action_center_content_body').html(response.html);
            }

            if (response.count > 0) {
                $('#gac_action_center_count').html(response.count + ' Documents Found');
                $('#gac_action_center_btn').addClass('notification notification--bullet');
            } else {
                $('#gac_action_center_count').html('');
                $('#gac_action_center_btn').removeClass('notification notification--bullet');
            }
            
            gac_has_more = response.hasMore;
            gac_current_page = response.nextPage;
            gac_is_loading = false;
        },
        error: function(xhr, status, error) {
            warningModal(error, xhr.responseText);
            gac_is_loading = false;
        }
    });
}

function gac_action_center() {
    // Initial load when clicking the action center button
    $('body').on('click', '#gac_action_center_btn', function() {
        gac_current_page = 1;
        gac_has_more = true;
        gac_load_content(1);
    });

    // Infinite scroll handler
    $('#gac_action_center_content .modal-body').on('scroll', function() {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;

        // Load more content when user scrolls near the bottom
        if (scrollHeight - scrollTop - clientHeight < 100) {
            gac_load_content(gac_current_page, true);
        }
    });

    // Load initial content
    gac_load_content(1);
}

function gac_action_center_search() {
    $('body').on('input', '#gac_action_center_search', function() {
        clearTimeout(gac_action_center_search_timeout);
        gac_action_center_search_timeout = setTimeout(function() {
            gac_current_page = 1;
            gac_has_more = true;
            gac_load_content(1);
        }, 500);
    });
}

function gac_approve_leave() {
    $('body').on('click', '.gac_action_center_approve_leave', function() {
        var id = $(this).data('id');
        $('#gac_approve_leave_id').val(id);
        open_modal('#gac_approve_leave_modal');
    });

    $('body').on('click', '#gac_approve_leave_modal_btn', function() {
        var id = $('#gac_approve_leave_id').val();
        var btn = $(this);
        $.ajax({
            url: "/leave/approve_leave_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Processing</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Approve');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#gac_approve_leave_modal');
                    gac_current_page = 1;
                    gac_has_more = true;
                    gac_load_content(1);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function gac_approve_custom_date() {
    $('body').on('click', '#gac_approve_custom_date', function() {
        var btn = $(this);
        var id = $('#gac_approve_leave_id').val();
        
        $.ajax({
            url: "/leave/get_custom_leave_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Processing</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Approve Custom Date');
                btn.prop('disabled', false);
                open_modal('#gac_approve_custom_date_modal');
                let element_id = 'gac_custom_leave_range';

                if (gac_custom_date_leave) {
                    gac_custom_date_leave.destroy();
                }

                gac_custom_date_leave = new Litepicker({
                    element: document.getElementById(element_id),
                    autoApply: true,  // Changed to true to auto-apply selection
                    singleMode: false,
                    numberOfColumns: 1,
                    numberOfMonths: 1,
                    showWeekNumbers: false,
                    startDate: response.start_date,
                    endDate: response.end_date,
                    format: 'MMM DD, YYYY ',
                    allowRepick: true,
                    minDate: response.start_date,
                    maxDate: response.end_date,
                    dropdowns: {
                        minYear: 1950,
                        maxYear: 2100,
                        months: true,
                        years: true
                    }
                });
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#gac_approve_custom_date_modal_btn', function() {
        var bool = true;
        var btn = $(this);
        var date = $('#gac_custom_leave_range').val();  
        var id = $('#gac_approve_leave_id').val();

        if (date == '') {
            bool = false;
            $('#gac_custom_leave_range_err').html('Please select date');
        } 
        
        if (bool) {
            const start_date = gac_custom_date_leave.getStartDate('YYYY-MM-DD'),
                end_date = gac_custom_date_leave.getEndDate('YYYY-MM-DD');

            var start = gac_getDateFormat(start_date);
            var end = gac_getDateFormat(end_date);

            $.ajax({
                url: "/leave/approve_custom_leave_application",
                type: "POST",
                dataType: "json",
                data: {id: id, start: start, end: end},
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Approving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Approve');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#gac_approve_custom_date_modal');
                        close_modal('#gac_approve_leave_modal');
                        gac_current_page = 1;
                        gac_has_more = true;
                        gac_load_content(1);
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function gac_disapprove_leave() {
    $('body').on('click', '.gac_action_center_disapprove_leave', function() {
        var id = $(this).data('id');
        var level = $(this).data('level');
        $('#gac_disapprove_leave_id').val(id);
        $('#gac_disapprove_leave_level').val(level);
        open_modal('#gac_disapprove_leave_modal');
    });

    $('body').on('click', '#gac_disapprove_leave_modal_btn', function() {
        var id = $('#gac_disapprove_leave_id').val();
        var level = $('#gac_disapprove_leave_level').val();
        var reason = $('#gac_reason_disapprove').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#gac_reason_disapprove').addClass('border-danger');
            $('#gac_reason_disapprove_err').html('Please provide reason');
        } else if (reason.trim().length > 40 && level == 'Recommendation') {
            $('#gac_reason_disapprove').addClass('border-danger');
            $('#gac_reason_disapprove_err').html('Shorten reason to 40 letters.');
        } else if (reason.trim().length > 90 && level == 'Approval') {
            $('#gac_reason_disapprove').addClass('border-danger');
            $('#gac_reason_disapprove_err').html('Shorten reason to 90 letters.');
        } else {
            $.ajax({
                url: "/leave/disapprove_leave_application",
                type: "POST",
                dataType: "json",
                data: {id: id, reason: reason},
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Processing</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Disapprove');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        $('#gac_reason_disapprove').val('');
                        close_modal('#gac_disapprove_leave_modal');
                        gac_current_page = 1;
                        gac_has_more = true;
                        gac_load_content(1);
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#gac_reason_disapprove', function() {
        var reason = $(this).val();
        $('#gac_reason_disapprove').removeClass('border-danger');
        $('#gac_reason_disapprove_err').html('');
    });
}

function gac_leave_attachments() {
    $('body').on('click', '.gac_leave_attachments', function() {
        var id = $(this).data('id');
        open_modal('#gac_leave_attachment_modal');
        $.ajax({
            url: "/leave/get_application_attachments",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#gac_leave_attachments_container').html(`
                    <div class="col-span-12 border rounded p-3 flex justify-center">
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
                $('#gac_leave_attachments_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '.folder_btn', function() {
        var folder = $(this).data('folder');
        window.open('/gac/leave_files/' + folder, '_blank');
    });
}

function gac_approve_time_justification() {
    $('body').on('click', '.gac_action_center_approve_time_justification', function() {
        var id = $(this).data('id');
        var personal = $(this).data('personal');
        var technical = $(this).data('technical');
        $('#gac_approve_time_justification_id').val(id);
        $('.gac_time_justification_personal').html(personal);
        $('.gac_time_justification_technical').html(technical);
        open_modal('#gac_approve_time_justification_modal');
    });

    $('body').on('click', '#gac_approve_time_justification_modal_btn', function() {
        var id = $('#gac_approve_time_justification_id').val();
        var btn = $(this);
        $.ajax({
            url: "/gac/approve_time_justification",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Processing</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Approve');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#gac_approve_time_justification_modal');
                    gac_current_page = 1;
                    gac_has_more = true;
                    gac_load_content(1);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function gac_disapprove_time_justification() {
    $('body').on('click', '.gac_action_center_disapprove_time_justification', function() {
        var id = $(this).data('id');
        var personal = $(this).data('personal');
        var technical = $(this).data('technical');
        $('#gac_disapprove_time_justification_id').val(id);
        $('.gac_time_justification_personal').html(personal);
        $('.gac_time_justification_technical').html(technical);
        open_modal('#gac_disapprove_time_justification_modal');
    });

    $('body').on('click', '#gac_disapprove_time_justification_modal_btn', function() {
        var id = $('#gac_disapprove_time_justification_id').val();
        var reason = $('#gac_reason_disapprove_time_justification').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#gac_reason_disapprove_time_justification').addClass('border-danger');
            $('#gac_reason_disapprove_time_justification_err').html('Please provide reason');
        } else {
            $.ajax({
                url: "/gac/disapprove_time_justification",
                type: "POST",
                dataType: "json",
                data: {id: id, reason: reason},
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Processing</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Disapprove');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        $('#gac_reason_disapprove_time_justification').val('');
                        close_modal('#gac_disapprove_time_justification_modal');
                        gac_current_page = 1;
                        gac_has_more = true;
                        gac_load_content(1);
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#gac_reason_disapprove_time_justification', function() {
        var reason = $(this).val();
        $('#gac_reason_disapprove_time_justification').removeClass('border-danger');
        $('#gac_reason_disapprove_time_justification_err').html('');
    });
}

function gac_time_justification_attachments() {
    $('body').on('click', '.gac_time_justification_attachments', function() {
        var id = $(this).data('id');
        open_modal('#gac_time_justification_attachment_modal');
        $.ajax({
            url: "/gac/time_justification_attachments",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#gac_time_justification_attachments_container').html(`
                    <div class="col-span-12 border rounded p-3 flex justify-center">
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
                $('#gac_time_justification_attachments_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '.gac_time_justification_folder_btn', function() {
        var folder = $(this).data('folder');
        window.open('/gac/dtr_files/' + folder, '_blank');
    });
}

function gac_view_dtr_justification() {
    $('body').on('click', '.gac_view_dtr_justification', function() {
        var date = $(this).data('date');
        var agencyid = $(this).data('agencyid');
        open_modal('#gac_dtr_view_modal');
        $.ajax({
            url: "/gac/dtr_details",
            type: "POST",
            dataType: "json",
            data: {date: date, agencyid: agencyid},
            beforeSend: function() {
                $('#gac_time_justification_dtr_container').html(`
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
                $('#gac_time_justification_dtr_container').html(response);
            },
            error: function(xhr, status, error) {
                // alert(xhr.responseText);
                warningModal(error, xhr.responseText);
            }
        });
    });
}

