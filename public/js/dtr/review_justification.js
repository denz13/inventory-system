$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var filter_date_from = '';
var review_page = 1;

$(document).ready(function() {
    let timeout;
    datepicker_initialization();

    // load_table_application(1, 'start');
    load_levels();
    load_table(review_page, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'start');
    filter_date();
    search_requester();
    change_status();
    pagination();
    change_level();

    approve_justification();
    disapprove_justification();
    view_reason();
    see_more_btn();
});

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

function load_levels() {
    var review_level = $('#level_status').val();
    $.ajax({
        url: "/dtr/justification_table_levels",
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
    review_page = page;
    if (date.trim() == '') {
        start = '';
        end = '';
    } else {
        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
        end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        start = getDateFormat(start_date);
        end = getDateFormat(end_date);
    }

    $.ajax({
        url: "/dtr/table_review",
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

            $('#level_status').val(response.level);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function change_status() {
    $('body').on('change', '#table_status', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
        }, 500);
    });
}

function pagination() {
    $('body').on('click', '#table_pagination a', function() {
        const page = $(this).data('page');
        load_table(page, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
    });
}

function search_requester() {
    $('body').on('input', '#table_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
        }, 500);
    });
}

function change_level() {
    $('body').on('click', '.level_btn', function() {
        if ($(this).hasClass('border-2 border-primary dark:border-primary text-primary')) {
            $('#level_status').val('');
            $(this).removeClass('border-2 border-primary dark:border-primary text-primary');
        } else {
            $('.level_btn').removeClass('border-2 border-primary dark:border-primary text-primary');
            $(this).addClass('border-2 border-primary dark:border-primary text-primary');
            var level = $(this).data('level');
            $('#level_status').val(level);
        }
        load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
    });
}

function filter_date() {
    filter_date_from.on('selected',function(date){
        load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
    });
}

function approve_justification() {
    $('body').on('click', '.approve_justification', function() {
        var id = $(this).data('id');
        var personal = $(this).data('personal');
        var technical = $(this).data('technical');
        $('#dtr_approve_time_justification_id').val(id);
        $('.dtr_time_justification_personal').html(personal);
        $('.dtr_time_justification_technical').html(technical);
        open_modal('#dtr_approve_time_justification_modal');
    });

    $('body').on('click', '#dtr_approve_time_justification_modal_btn', function() {
        var id = $('#dtr_approve_time_justification_id').val();
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
                    close_modal('#dtr_approve_time_justification_modal');
                    load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
                    __notif_show(1, 'Success', 'Time justification approved.');
                    load_levels();
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function disapprove_justification() {
    $('body').on('click', '.disapprove_justification', function() {
        var id = $(this).data('id');
        var personal = $(this).data('personal');
        var technical = $(this).data('technical');
        $('#dtr_disapprove_time_justification_id').val(id);
        $('.dtr_time_justification_personal').html(personal);
        $('.dtr_time_justification_technical').html(technical);
        open_modal('#dtr_disapprove_time_justification_modal');
    });

    $('body').on('click', '#dtr_disapprove_time_justification_modal_btn', function() {
        var id = $('#dtr_disapprove_time_justification_id').val();
        var reason = $('#dtr_reason_disapprove_time_justification').val();
        var btn = $(this);

        if (reason.trim() == '') {
            $('#dtr_reason_disapprove_time_justification').addClass('border-danger');
            $('#dtr_reason_disapprove_time_justification_err').html('Please provide reason');
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
                        close_modal('#dtr_disapprove_time_justification_modal');
                        load_table(1, $('#date_range').val(), $('#table_search').val(), $('#table_status').val(), $('#level_status').val(), 'end');
                        __notif_show(-3, 'Disapproved', 'Time justification disapproved.');
                        load_levels();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('input', '#dtr_reason_disapprove_time_justification', function() {
        $('#dtr_reason_disapprove_time_justification').removeClass('border-danger');
        $('#dtr_reason_disapprove_time_justification_err').html('');
    });
}

function view_reason() {
    $('body').on('click', '.reason_btn', function() {
        var msg = $(this).data('msg');
        var $textarea = $('#reason_msg_con');
        $textarea.val(msg);

        // Reset height to auto to shrink if needed, then set to scrollHeight
        $textarea.height('auto');
        $textarea.height($textarea[0].scrollHeight);
        
        open_modal('#reason_msg_modal');
    });
}

function see_more_btn() {
    $('body').on('click', '.see_more_btn', function() {
        var msg = $(this).data('msg');
        var $textarea = $('#reason_msg_con');
        $textarea.val(msg);

        // Reset height to auto to shrink if needed, then set to scrollHeight
        $textarea.height('auto');
        $textarea.height($textarea[0].scrollHeight);

        open_modal('#reason_msg_modal');
    });
}