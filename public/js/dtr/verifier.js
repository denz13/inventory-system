$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var filter_date_from = '';
let table_page = 1;
const logs = tailwind.Modal.getOrCreateInstance(document.querySelector("#verifier_canvas"));
let page_verifier = 1;
let hasMorePages = true;
let isLoading = false;

$(document).ready(function() {
    let timeout;

    // Initialization
    datepicker_initialization();

    // List of employee
    load_table(1, $('#table_search').val());
    search();
    next_prev_btn();
    daterange_change();
    load_dtr_btn();

    // Employee details
    send_message();
    flexi_details();
    dtr_justification_details();

    // Verifier Logs
    load_logs_btn();
    verifier_scroll();
    verifier_search();

    // Print
    verifier_print();

    // Verifier User
    verifier_user_btn();
    add_verifier_btn();
    remove_verifier();
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
        maxDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Set maxDate to yesterday
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

function load_table(page, search) {
    $.ajax({
        url: "/dtr/employee_list",
        type: "POST",
        dataType: "json",
        data: {page: page, search: search},
        beforeSend: function() {
            $('#table_prev').prop('disabled', true);
            $('#table_next').prop('disabled', true);
            $('#table_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#table_container').html(`
                <div class="col-span-12 intro-y box p-5 flex" style="justify-content: center;">
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
            `);
        },
        success: function (response) {
            $('#table_container').html(response.html);
            $('#table_summary').html(response.summary);

            const previousPageButton = $('#table_prev');
            const nextPageButton = $('#table_next');

            if (response.query.current_page === 1) {
                previousPageButton.prop('disabled', true);
            } else {
                previousPageButton.prop('disabled', false);
            }
            if (response.query.current_page === response.query.last_page) {
                nextPageButton.prop('disabled', true);
            } else {
                nextPageButton.prop('disabled', false);
            }
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function search() {
    $('body').on('input', '#table_search', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            load_table(1, $('#table_search').val());
        }, 500);
    });
}

function next_prev_btn() {
    $('body').on('click', '#table_prev', function() {
        if (table_page > 1) {
            table_page--;
            load_table(table_page, $('#table_search').val());
        }
    });
    
    $('body').on('click', '#table_next', function() {
        table_page++;
        load_table(table_page, $('#table_search').val());
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

function daterange_change() {
    filter_date_from.on('selected',function(date){
        $('#printing_status').val('');
        $('#date_range').removeClass('border-danger text-danger');
        $('#date_range_err').html('');
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        let convert_start_date = '',
        convert_end_date = '';

        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        var start = getDateFormat(start_date);
        var end = getDateFormat(end_date);

        var agencyid = $('#agency_id_checking').val();
        if (agencyid.trim() !== '') {
            var endDate_checker = new Date(end);
            if (endDate_checker >= today) {
                $('#date_range').addClass('border-danger text-danger');
                $('#date_range_err').html('Kindly refrain from choosing dates from today onwards');
            } else {
                load_employee_details(start, end, agencyid);
            }
        }
    });
}

function load_dtr_btn() {
    $('body').on('click', '.load_dtr_btn', function() {
        $('#printing_status').val('');
        var id = $(this).data('id');
        var daterange = $('#date_range').val();
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (daterange.trim() == '') {
            $('#date_range').addClass('border-danger text-danger');
            $('#date_range_err').html('Please select date');
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
    
                var endDate_checker = new Date(formattedEndDate);
                if (endDate_checker >= today) {
                    $('#date_range').addClass('border-danger text-danger');
                    $('#date_range_err').html('Kindly refrain from choosing dates from today onwards');
                } else if (formattedStartDate > formattedEndDate) {
                    $('#date_range').addClass('border-danger text-danger');
                    $('#date_range_err').html('Start and end date invalid');
                } else {
                    load_employee_details(formattedStartDate, formattedEndDate, id);
                    $('#agency_id_checking').val(id);
                }
            } else {
                $('#date_range').addClass('border-danger text-danger');
                $('#date_range_err').html('Date format is incorrect');
            }
        }
    });
}

function load_employee_details(datefrom, dateto, agencyid) {
    $('#printing_status').val('goods');
    $.ajax({
        url: "/dtr/employee_details",
        type: "POST",
        dataType: "json",
        data: {
            agencyid: agencyid,
            datefrom: datefrom,
            dateto: dateto
        },
        beforeSend: function() {
            $('#employee_details').html(`
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
            $('#employee_details').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });

    $.ajax({
        url: "/dtr/get_dtr_verify",
        type: "POST",
        dataType: "json",
        data: {
            agencyid: agencyid,
            datefrom: datefrom,
            dateto: dateto
        },
        beforeSend: function() {
            $('.load_dtr_btn').prop('disabled', true);
            $('#verifier_tbody').html('<tr><td colspan="6" class="text-center"><i class="fa-solid fa-ellipsis fa-fade"></i></td></tr>');
        },
        success: function (response) {
            $('.load_dtr_btn').prop('disabled', false);
            $('#verifier_tbody').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function send_message() {
    $('body').on('click', '.send_message', function() {
        var id = $(this).data('id');
        var name = $(this).data('name');
        bom_global_messaging(id, name);
    });
}

function flexi_details() {
    $('body').on('click', '.flexi_details', function() {
        var id = $(this).data('id');
        var day = $(this).data('day');
        var agencyid = $(this).data('agencyid');
        open_modal('#flexi_details');
        $.ajax({
            url: "/dtr/getflexi_detail",
            type: "POST",
            dataType: "json",
            data: {
                id :id,
                day: day,
                agencyid: agencyid
            },
            beforeSend: function() {
                $('#flexi_details_content').html(`
                <div class="border p-2 text-center w-100">
                    Loading <i class="fa-solid fa-spinner fa-spin"></i>
                </div>`);
            },
            success: function (response) {
                $('#flexi_details_content').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
        
    });
}

function dtr_justification_details() {
    $('body').on('click', '.justification_btn', function() {
        var id = $(this).data('just');
        open_modal('#justification_details_modal');
        $.ajax({
            url: "/dtr/get_justification_details",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#justification_details_container').html(`
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
                $('#justification_details_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function load_logs(append, search) {
    if (!hasMorePages || isLoading) return; // Stop if no more pages or already loading

    isLoading = true; // Set to true to prevent duplicate requests

    $.ajax({
        url: "/dtr/load_verifier_logs",
        type: "POST",
        dataType: "json",
        data: { perpage: 10, search: search, page: page_verifier },
        beforeSend: function() {
            // $('#verifier_search').prop('disabled', true);
            $('#verifier_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            if (!append) {
                $('#verifier_logs_container').html(`
                    <div class="col-span-12 intro-y">
                        <div class="p-5 rounded mt-2 border border-slate-100 text-center">
                            <i class="fa-solid fa-ellipsis fa-fade"></i>
                        </div>
                    </div>
                `);
            }
        },
        success: function(response) {
            // $('#verifier_search').prop('disabled', false);
            if (append) {
                $('#verifier_logs_container').append(response.html); // Append new logs
            } else {
                $('#verifier_logs_container').html(response.html); // Replace logs
            }

            hasMorePages = response.hasMorePages; // Update hasMorePages flag
            page_verifier++; // Increment page number

            let start = 1;
            let end = Math.min(response.total, response.currentPage * response.perPage);
            let summaryText = `Showing ${start} to ${end} of ${response.total} entries`;
            $('#verifier_summary').html(summaryText);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        },
        complete: function() {
            isLoading = false; // Reset loading flag when request completes
        }
    });
}

function load_logs_btn() {
    $('body').on('click', '#verifier_logs', function() {
        logs.show();
        page_verifier = 1; // Reset page count when reloading from the button click
        hasMorePages = true; // Reset to allow further loading
        load_logs(false, $('#verifier_search').val()); // Load logs with the current search value
    });
}

function verifier_scroll() {
    $('#verifier_logs_container').on('scroll', function() {
        let container = $(this);

        // Check if the user has scrolled near the bottom of the container
        if (container.scrollTop() + container.innerHeight() >= container[0].scrollHeight - 100) {
            if (!isLoading && hasMorePages) {  // Prevent triggering another request while still loading
                load_logs(true, $('#verifier_search').val());  // Append new logs
            }
        }
    });
}

function verifier_search() {
    $('body').on('input', '#verifier_search', function() {
        clearTimeout(timeout); // Clear the previous timeout to avoid unnecessary requests

        timeout = setTimeout(function() {
            page_verifier = 1;      // Reset the page number for new search
            hasMorePages = true;    // Reset to allow more pages to be loaded
            load_logs(false, $('#verifier_search').val());  // Load logs without appending (fresh search)
        }, 500); // Set a delay of 500ms before triggering the search
    });
}

function verifier_print() {
    $('body').on('click', '#verifier_print', function() {
        var status = $('#printing_status').val();
        var agencyid = $('#agency_id_checking').val();

        if (status == 'goods') {
            var daterange = $('#date_range').val();
    
            if (daterange.trim() == '') {
                $('#date_range').addClass('border-danger text-danger');
                $('#date_range_err').html('Please select date');
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
        
                    let url = `/dtr/print_verifier?uid=${agencyid}&datefrom=${formattedStartDate}&dateto=${formattedEndDate}`;
                    window.open(url,'_blank');
                } else {
                    $('#date_range').addClass('border-danger text-danger');
                    $('#date_range_err').html('Date format is incorrect');
                }
            }
        } else {
            __notif_show(-3, 'Denied', 'Please choose date and employee.');
        }
    });
}

function load_verifier() {
    $.ajax({
        url: "/dtr/load_verifiers",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#verifiers_container').html(`
            <div class="col-span-12 intro-y">
                <div class="border rounded p-3 text-center">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#verifiers_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function verifier_user_btn() {
    $('body').on('click', '#verifier_user_btn', function() {
        open_modal('#verifiers_modal'); 
        load_verifier();
    });
}

function add_verifier_btn() {
    $('body').on('click', '#add_verifier_btn', function() {
        var id = $('#verifier_agencyid').val();
        var btn = $(this);
        
        if (id == null) {

        } else {
            $.ajax({
                url: "/dtr/add_verifiers",
                type: "POST",
                dataType: "json",
                data: {id: id},
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Adding</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Add');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        $('#verifier_agencyid').val('').trigger('change');
                        __notif_show(3, 'Success', 'Added a verifier.');
                        load_verifier();
                    } else {
                        $('#verifier_agencyid').val('').trigger('change');
                        __notif_show(-1, 'Exist', 'Already exist.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
}

function remove_verifier() {
    $('body').on('click', '.remove_verifier', function() {
        var id = $(this).data('id');

        $.ajax({
            url: "/dtr/remove_verifiers",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                if (response == 'success') {
                    __notif_show(3, 'Success', 'Verifier removed.');
                    load_verifier();
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}