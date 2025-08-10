$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    let timeout;
    
    load_ledger($('#start_month_filter').val(), $('#end_month_filter').val());
    filter_last_3_month();
    filter_this_year();
    filter_ledger_apply();

    view_late();
    view_leave();

    excel_ledger();
    pdf_ledger();
    summary_leave_credits();
});

function load_ledger(start_month, end_month) {
    $.ajax({
        url: "/leave/ledger_load",
        type: "POST",
        dataType: "json",
        data: {
            start_month: start_month,
            end_month: end_month
        },
        beforeSend: function() {
            $('#ledger_container').html(`
                <div class="flex justify-center items-center p-5">
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
            $('#ledger_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function filter_last_3_month() {
    $('body').on('click', '#filter_last_3_months', function() {
        close_modal('#filter_ledger_modal');
        load_ledger(moment().subtract(3, 'month').format('YYYY-MM'), moment().format('YYYY-MM'));
    });
}

function filter_this_year() {
    $('body').on('click', '#filter_this_year', function() {
        close_modal('#filter_ledger_modal');
        load_ledger(moment().format('YYYY-01'), moment().format('YYYY-MM'));
    });
}

function filter_ledger_apply() {
    $('body').on('click', '#filter_ledger_apply', function() {
        var bool = true;
        var start_month = $('#start_month_filter').val();
        var end_month = $('#end_month_filter').val();

        if (start_month == '') {
            $('#start_month_filter').addClass('border-danger');
            $('#start_month_filter_error').html('Start month is required');
            bool = false;
        }   
        if (end_month == '') {
            $('#end_month_filter').addClass('border-danger');
            $('#end_month_filter_error').html('End month is required');
            bool = false;
        }
        if (start_month > end_month) {
            $('#start_month_filter').addClass('border-danger');
            $('#end_month_filter').addClass('border-danger');
            $('#start_month_filter_error').html('Invalid month');
            $('#end_month_filter_error').html('Invalid month');
            bool = false;
        }

        if (bool) {
            $('#start_month_filter').removeClass('border-danger');
            $('#start_month_filter_error').html('');
            $('#end_month_filter').removeClass('border-danger');
            $('#end_month_filter_error').html('');
            close_modal('#filter_ledger_modal');
            load_ledger(start_month, end_month);
        }
    });

    $('body').on('change', '#start_month_filter', function() {
        $('#start_month_filter').removeClass('border-danger');
        $('#start_month_filter_error').html('');
    });

    $('body').on('change', '#end_month_filter', function() {
        $('#end_month_filter').removeClass('border-danger');
        $('#end_month_filter_error').html('');
    });
}

function view_late() {
    $('body').on('click', '.late_view', function() {
        var month = $(this).data('month');
        open_modal('#view_tardiness_modal');
        $.ajax({
            url: "/leave/view_tardiness",
            type: "POST",
            dataType: "json",
            data: {
                month: month
            },
            beforeSend: function() {
                $('#view_tardiness_container').html(`
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
            },
            success: function (response) {
                $('#view_tardiness_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function view_leave() {
    $('body').on('click', '.view_leave', function() {
        var id = $(this).data('id');
        let url = `/leave/print_leave?id=${id}`;
        window.open(url,'_blank');
    });
}

function excel_ledger() {
    $('body').on('click', '#excel_ledger', function() {
        construction_modal();
    });
}

function pdf_ledger() {
    $('body').on('click', '#pdf_ledger', function() {
        construction_modal();   
    });
}

function summary_leave_credits() {
    $('body').on('click', '#summary_leave_credits', function() {
        let url = `/leave/summary_leave_credits`;
        window.open(url,'_blank');
    });
}

