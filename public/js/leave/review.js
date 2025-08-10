$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var filter_date_from = '';
var custom_date = '';
let review_page = 1;

$(document).ready(function() {
    let timeout;
    datepicker_initialization();

    load_table_application(1, 'start');
    load_levels();
    filter_date();
    search_requester();
    change_status();
    pagination();
    change_level();

    approve_leave();
    approve_custom_date();
    disapprove_leave();
    undo_leave();
    attachment_btn();
});

function load_table_application(page, start) {
    review_page = page;
    load_table(page, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_stat').val(), start);
}

function datepicker_initialization() {
    let element_id = 'date_range';

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

function load_table(page, date, search, status, level, starting) {
    var start = '';
    var end = '';
    if (date.trim() == '') {
        start = '';
        end = '';
    } else {
        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
        end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        start = getDateFormat(start_date);
        end = getDateFormat(end_date);
    }
    console.log(start, end);
    $.ajax({
        url: "/leave/table_review",
        type: "POST",
        dataType: "json",
        data: {
            page: page,
            start: start,
            end: end,
            search: search,
            status: status,
            level: level,
            starting: starting
        },
        beforeSend: function() {
            $('#table_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#tbody_container').html(`
            <tr class="intro-y">
                <td colspan="7">
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
                    </div>
                </td>
            </tr>`);
        },
        success: function (response) {
            $('#tbody_container').html(response.html);
            $('#table_summary').html(response.summary);
            table_pagination(response, '#table_pagination');

            $('#level_stat').val(level);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_levels() {
    var review_level = $('#level_stat').val();
    $.ajax({
        url: "/leave/table_levels",
        type: "POST",
        dataType: "json",
        data: {review_level: review_level},
        beforeSend: function() {
            $('#level_container').html(`
                <div class="intro-y col-span-12 box py-2 flex justify-center">
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
            $('#level_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function filter_date() {
    filter_date_from.on('selected',function(date){
        load_table_application(1, 'end');
    });
}

function search_requester() {
    $('body').on('input', '#table_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table_application(1, 'end');
        }, 500);
    });
}

function change_status() {
    $('body').on('change', '#table_status', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table_application(1, 'end');
        }, 500);
    });
}

function pagination() {
    $('body').on('click', '#table_pagination a', function() {
        const page = $(this).data('page');
        load_table_application(page, 'end');
    });
}

function change_level() {
    $('body').on('click', '.level_btn', function() {
        if ($(this).hasClass('border-2 border-primary dark:border-primary text-primary')) {
            $('#level_stat').val('');
            $(this).removeClass('border-2 border-primary dark:border-primary text-primary');
        } else {
            $('.level_btn').removeClass('border-2 border-primary dark:border-primary text-primary');
            $(this).addClass('border-2 border-primary dark:border-primary text-primary');
            var level = $(this).data('level');
            $('#level_stat').val(level);
        }
        load_table_application(1, 'end');
    });
}

function approve_leave() {
    $('body').on('click', '.approve_leave', function() {
        var id = $(this).data('id');
        $('#approve_leave_id').val(id);
        open_modal('#approve_modal');
    });

    $('body').on('click', '#approve_leave_modal_btn', function() {
        var id = $('#approve_leave_id').val();
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
                    close_modal('#approve_modal');
                    load_table_application(review_page, 'end');
                    load_levels();
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function approve_custom_date() {
    $('body').on('click', '#approve_custom_date', function() {
        var btn = $(this);
        var id = $('#approve_leave_id').val();
        
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
                open_modal('#approve_custom_date_modal');
                let element_id = 'custom_leave_range';

                if (custom_date) {
                    custom_date.destroy();
                }

                custom_date = new Litepicker({
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

    $('body').on('click', '#approve_custom_date_modal_btn', function() {
        var bool = true;
        var btn = $(this);
        var date = $('#custom_leave_range').val();
        var id = $('#approve_leave_id').val();

        if (date == '') {
            bool = false;
            $('#custom_leave_range_err').html('Please select date');
        } 
        
        if (bool) {
            const start_date = custom_date.getStartDate('YYYY-MM-DD'),
                end_date = custom_date.getEndDate('YYYY-MM-DD');

            var start = getDateFormat(start_date);
            var end = getDateFormat(end_date);

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
                        close_modal('#approve_custom_date_modal');
                        close_modal('#approve_modal');
                        load_table_application(review_page, 'end');
                        load_levels();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function disapprove_leave() {
    $('body').on('click', '.disapprove_leave', function() {
        var id = $(this).data('id');
        var level = $(this).data('level');
        $('#disapprove_leave_id').val(id);
        $('#disapprove_leave_level').val(level);
        open_modal('#disapprove_modal');
    });

    $('body').on('click', '#disapprove_leave_modal_btn', function() {
        var id = $('#disapprove_leave_id').val();
        var level = $('#disapprove_leave_level').val();
        var reason = $('#reason_disapprove').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#reason_disapprove').addClass('border-danger');
            $('#reason_disapprove_err').html('Please provide reason');
        } else if (reason.trim().length > 40 && level == 'Recommendation') {
            $('#reason_disapprove').addClass('border-danger');
            $('#reason_disapprove_err').html('Shorten reason to 40 letters.');
        } else if (reason.trim().length > 90 && level == 'Approval') {
            $('#reason_disapprove').addClass('border-danger');
            $('#reason_disapprove_err').html('Shorten reason to 90 letters.');
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
                        close_modal('#disapprove_modal');
                        load_table_application(review_page, 'end');
                        load_levels();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function undo_leave() {
    $('body').on('click', '.undo_leave', function() {
        var id = $(this).data('id');
        open_modal('#undo_modal');
        $.ajax({
            url: "/leave/check_undo_leave_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#undo_container').html(`
                    <div class="flex p-5" style="justify-content: center;">
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
                $('#undo_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#undo_modal_btn', function() {
        var id = $(this).data('id');
        var btn = $(this);

        $.ajax({
            url: "/leave/undo_leave_application",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                btn.html('<span class="fa-fade">Processing</span>');
                btn.prop('disabled', true);
            },
            success: function (response) {
                btn.html('Undo');
                btn.prop('disabled', false);
                if (response == 'success') {
                    close_modal('#undo_modal');
                    load_table_application(review_page, 'end');
                    load_levels();
                } else {
                    $('#undo_container').html(response);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function attachment_btn() {
    $('body').on('click', '.attachment_btn', function() {
        var id = $(this).data('id');
        open_modal('#attachment_modal');
        $.ajax({
            url: "/leave/get_application_attachments",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#attachments_container').html(`
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
                $('#attachments_container').html(response);
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
