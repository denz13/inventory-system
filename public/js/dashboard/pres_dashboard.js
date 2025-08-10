$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    // Campuses
    load_campuses();
    change_campus();
    active_tab();

    // Employee
    employee_summary();
    all_employee_summary();
    view_details_btn();
    close_more_details();

    // Travel Order
    todays_report();
    travel_order_controller();
    to_view_details_btn();

    // Resource
    resources();
    all_resource_btn();
    resource_details_btn();
    resource_usage_select();
    resource_records();
});

function load_campuses() {
    $.ajax({
        url: "/dashboard/load_campuses",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#campuses_list_container').html(`
            <div class="px-5 py-3 border rounded whitespace-nowrap fa-fade">
                Loading <i class="fa-solid fa-ellipsis ml-2"></i>
            </div>`);
        },
        success: function (response) {
            $('#campuses_list_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function change_campus() {
    $('#campuses_list_container').on('click', '.campuses_btn', function() {
        var id = $(this).data('id');
        $('.campuses_btn').removeClass('btn-primary');
        $(this).addClass('btn-primary');
        $('#campuses__hide').val(id);
        employee_summary();
        resources();
        $('#employee__type_hide').val('');
        todays_report();

        employee_page = 1;
        employee_table_nav();
        employee_table_head(employee_page, '', '', id);
    });
}

function active_tab() {
    $('#details_container').on('click', '.tab_btns', function() {
        var tab = $(this).data('tab');
        $('#tab__hide').val(tab);
    });
}

function employee_summary() {
    var campus = $('#campuses__hide').val();
    $.ajax({
        url: "/dashboard/employee_summary",
        type: "POST",
        dataType: "json",
        data: {campus: campus},
        beforeSend: function() {
            $('#left_top').html(`
            <div class="font-bold text-lg rounded p-2 intro-x">Today's Report</div>
            <div class="mt-2 border rounded p-5 text-xs text-center fa-fade">
                Gathering data ...
            </div>`);
        },
        success: function (response) {
            $('#left_top').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function employee_table_nav() {
    $('#table_nav').html(`
    <div class="intro-y text-slate-400 p-1 flex" style="justify-content: space-between;">
        <div>Search</div>
        <div class="employee_summary mr-1">Showing 1 to 10 of 150 entries</div>
    </div>
    <div class="intro-y flex" style="justify-content: space-between;">
        <div>
            <input type="text" class="form-control" id="employee_search" placeholder="Type here ...">
        </div>
        <div>
            <button class="btn btn-secondary w-24" id="employee_prev">Prev</button>
            <button class="btn btn-secondary w-24" id="employee_next">Next</button>
        </div>
    </div>`);
}

function employee_table_head(page, search, type, campus) {
    $('#table_table').html(`
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-12 overflow-auto 2xl:overflow-visible">
            <table class="table table-report -mt-2">
                <thead class="intro-y">
                    <tr>
                        <th class="whitespace-nowrap">EMPLOYEE NAME</th>
                        <th class="text-center whitespace-nowrap">EMPLOYMENT TYPE</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="intro-y tbody_employee">
                </tbody>
            </table>
        </div>
    </div>`);

    employee_table_body(page, search, type, campus);
}

function employee_table_body(page, search, type, campus) {
    $.ajax({
        url: "/dashboard/tbody_employee",
        type: "POST",
        dataType: "json",
        data: {
            page: page,
            search: search,
            type: type,
            campus: campus
        },
        success: function (response) {
            $('.tbody_employee').html(response.html);
            $('.employee_summary').html(response.summary);

            const previousPageButton = $('#employee_prev');
            const nextPageButton = $('#employee_next');
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
            alert(xhr.responseText);
        }
    });
}

function all_employee_summary() {
    let employee_page = 1;
    employee_table_nav();
    employee_table_head(employee_page, '', '', '');

    $('#left_container').on('click', '.all_employee_view', function() {
        employee_page = 1;
        var type = $(this).data('id');
        $('#employee__type_hide').val(type);
        var search = '';
        var campus = $('#campuses__hide').val();
        employee_table_nav();
        employee_table_head(employee_page, search, type, campus);

        // DELETE THIS
        $('#test_employee').css('display', 'block');
        $('#test_resource').css('display', 'none');
    });

    $('#table_nav').on('click', '#employee_prev', function() {
        employee_page = employee_page - 1;
        var type = $('#employee__type_hide').val();
        var search = $('#employee_search').val();
        var campus = $('#campuses__hide').val();
        employee_table_body(employee_page, search, type, campus);
    });

    $('#table_nav').on('click', '#employee_next', function() {
        employee_page = employee_page + 1;
        var type = $('#employee__type_hide').val();
        var search = $('#employee_search').val();
        var campus = $('#campuses__hide').val();
        employee_table_body(employee_page, search, type, campus);
    });

    var employee_timeout;
    $('#table_nav').on('keyup', '#employee_search', function() {
        clearTimeout(employee_timeout);
        var search = $(this).val();
        var type = $('#employee__type_hide').val();
        var campus = $('#campuses__hide').val();

        employee_timeout = setTimeout(function() {
            employee_page = 1;
            employee_table_body(employee_page, search, type, campus);
        }, 500);
    });
}

function get_employee_details(id) {
    var tab = $('#tab__hide').val();
    $.ajax({
        url: "/dashboard/employee_details",
        type: "POST",
        dataType: "json",
        data: {
            tab: tab,
            id: id
        },
        success: function (response) {
            $('#details_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function view_details_btn() {
    $('#mid_container').on('click', '.employ_details', function() {
        $('#default_details_container').css('display', 'none');
        $('#details_container').css('display', 'block');
        var id = $(this).data('id');
        get_employee_details(id);
    });
}

function close_more_details() {
    $('#right_container').on('click', '.close_employee', function() {
        $('#details_container').css('display', 'none');
        $('#default_details_container').css('display', 'block');
    });
}

function todays_report() {
    var campus = $('#campuses__hide').val();
    $.ajax({
        url: "/dashboard/todays_report",
        type: "POST",
        dataType: "json",
        data: {campus: campus},
        beforeSend: function() {
            $('#right_top').html(`
            <div class="font-bold text-lg rounded p-2 intro-x">Today's Report</div>
            <div class="mt-2 border rounded p-5 text-xs text-center fa-fade">
                Gathering data ...
            </div>`);
        },
        success: function (response) {
            $('#right_top').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

// TRAVEL ORDER PAGINATED
function to_table_nav(count) {
    $('#table_nav').html(`
    <div class="intro-y text-slate-400 p-1 flex" style="justify-content: space-between;">
        <div>Search</div>
        <div class="mr-1">${count} Employee</div>
    </div>
    <div class="intro-y flex" style="justify-content: space-between;">
        <div>
            <input type="text" class="form-control" id="to_search" placeholder="Type here ...">
        </div>
        <div>
            <button class="btn btn-secondary w-24" id="to_prev">Prev</button>
            <button class="btn btn-secondary w-24" id="to_next">Next</button>
        </div>
    </div>`);
}

// function to_table_head(page, search) {
//     $('#table_table').html(`
//     <div class="grid grid-cols-12 gap-6 mt-5">
//         <div class="col-span-12 overflow-auto 2xl:overflow-visible">
//             <table class="table table-report -mt-2">
//                 <thead class="intro-y">
//                     <tr>
//                         <th class="whitespace-nowrap">EMPLOYEE NAME</th>
//                         <th class="text-center whitespace-nowrap">DESTINATION</th>
//                         <th class="text-center whitespace-nowrap">ACTIONS</th>
//                     </tr>
//                 </thead>
//                 <tbody class="intro-y tbody_to">
//                 </tbody>
//             </table>
//         </div>
//     </div>`);

//     to_table_body(page, search);
// }

// function to_table_body(page, search) {
//     $.ajax({
//         url: "/dashboard/tbody_to",
//         type: "POST",
//         dataType: "json",
//         data: {
//             page: page,
//             search: search
//         },
//         success: function (response) {
//             $('.tbody_to').html(response.html);

//             const previousPageButton = $('#to_prev');
//             const nextPageButton = $('#to_next');
//             if (response.users.current_page === 1) {
//                 previousPageButton.prop('disabled', true);
//             } else {
//                 previousPageButton.prop('disabled', false);
//             }
//             if (response.users.current_page === response.users.last_page) {
//                 nextPageButton.prop('disabled', true);
//             } else {
//                 nextPageButton.prop('disabled', false);
//             }
//         },
//         error: function(xhr, status, error) {
//             alert(xhr.responseText);
//         }
//     });
// }

// function travel_order_controller() {
//     let to_page = 1;
//     $('#right_container').on('click', '.travel_order_count', function() {
//         var count = $(this).data('count');
//         to_page = 1;
//         to_table_nav(count);
//         to_table_head(to_page, '');
//     });

//     $('#table_nav').on('click', '#to_prev', function() {
//         to_page = to_page - 1;
//         var search = $('#employee_search').val();
//         to_table_body(to_page, search);
//     });

//     $('#table_nav').on('click', '#to_next', function() {
//         to_page = to_page + 1;
//         var search = $('#employee_search').val();
//         to_table_body(to_page, search);
//     });

//     var to_timeout;
//     $('#table_nav').on('keyup', '#to_search', function() {
//         clearTimeout(to_timeout);
//         var search = $(this).val();

//         to_timeout = setTimeout(function() {
//             to_page = 1;
//             to_table_body(to_page, search);
//         }, 500);
//     });
// }

function to_table_head() {
    $('#table_table').html(`
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-12 overflow-auto 2xl:overflow-visible">
            <table class="table table-report -mt-2">
                <thead class="intro-y">
                    <tr>
                        <th class="whitespace-nowrap">EMPLOYEE NAME</th>
                        <th class="text-center whitespace-nowrap">DESTINATION</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="intro-y tbody_to">
                </tbody>
            </table>
        </div>
    </div>`);
}

function to_table_content() {
    var campus = $('#campuses__hide').val();
    $.ajax({
        url: "/dashboard/tbody_to",
        type: "POST",
        dataType: "json",
        data: {campus:campus},
        success: function (response) {
            $('#table_table').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function travel_order_controller() {
    $('#right_container').on('click', '.travel_order_count', function() {
        $('#table_nav').empty();
        to_table_content();
    });
}

function to_view_details_btn() {
    $('#mid_container').on('click', '.to_view_details', function() {
        $('#default_details_container').css('display', 'none');
        $('#details_container').css('display', 'block');
        var id = $(this).data('id');
        var agencyid = $(this).data('agencyid');
        $.ajax({
            url: "/dashboard/travel_details",
            type: "POST",
            dataType: "json",
            data: {
                id: id,
                agencyid: agencyid
            },
            success: function (response) {
                $('#details_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function resources() {
    var campus = $('#campuses__hide').val();
    $.ajax({
        url: "/dashboard/resources",
        type: "POST",
        dataType: "json",
        data: {campus: campus},
        beforeSend: function() {
            $('#left_down').html(`
            <div class="font-bold text-lg rounded p-2 intro-x">Today's Report</div>
            <div class="mt-2 border rounded p-5 text-xs text-center fa-fade">
                Gathering data ...
            </div>`);
        },
        success: function (response) {
            $('#left_down').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function resource_table_nav() {
    $('#table_nav').html(`
    <div class="intro-y text-slate-400 p-1 flex" style="justify-content: space-between;">
        <div>Search</div>
        <div class="resource_summary mr-1">Showing 1 to 10 of 150 entries</div>
    </div>
    <div class="intro-y flex" style="justify-content: space-between;">
        <div>
            <input type="text" class="form-control" id="resource_search" placeholder="Type here ...">
        </div>
        <div>
            <button class="btn btn-secondary w-24" id="resource_prev">Prev</button>
            <button class="btn btn-secondary w-24" id="resource_next">Next</button>
        </div>
    </div>`);
}

function resource_table_head(page, search, type, campus) {
    $('#table_table').html(`
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-12 overflow-auto 2xl:overflow-visible">
            <table class="table table-report -mt-2">
                <thead class="intro-y">
                    <tr>
                        <th class="whitespace-nowrap">RESOURCE NAME</th>
                        <th class="text-center whitespace-nowrap">CATEGORY</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="intro-y tbody_resource">
                </tbody>
            </table>
        </div>
    </div>`);

    resource_table_body(page, search, type, campus);
}

function resource_table_body(page, search, type, campus) {
    $.ajax({
        url: "/dashboard/tbody_resource",
        type: "POST",
        dataType: "json",
        data: {
            page: page,
            search: search,
            type: type,
            campus: campus
        },
        success: function (response) {
            $('.tbody_resource').html(response.html);
            $('.resource_summary').html(response.summary);

            const previousPageButton = $('#resource_prev');
            const nextPageButton = $('#resource_next');
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
            alert(xhr.responseText);
        }
    });
}

function all_resource_btn() {
    let resource_page = 1;

    $('#left_down').on('click', '.resource_btn', function() {
        resource_page = 1;
        var type = $(this).data('type');
        $('#employee__type_hide').val(type);
        var search = '';
        var campus = $('#campuses__hide').val();
        resource_table_nav();
        resource_table_head(resource_page, search, type, campus);

        // DELETE THIS
        $('#test_employee').css('display', 'none');
        $('#test_resource').css('display', 'block');
    });

    $('#table_nav').on('click', '#resource_prev', function() {
        resource_page = resource_page - 1;
        var type = $('#employee__type_hide').val();
        var search = $('#resource_search').val();
        resource_table_body(resource_page, search, type);
    });

    $('#table_nav').on('click', '#resource_next', function() {
        resource_page = resource_page + 1;
        var type = $('#employee__type_hide').val();
        var search = $('#resource_search').val();
        resource_table_body(resource_page, search, type);
    });

    var resource_timeout;
    $('#table_nav').on('keyup', '#resource_search', function() {
        clearTimeout(resource_timeout);
        var search = $(this).val();
        var type = $('#employee__type_hide').val();

        resource_timeout = setTimeout(function() {
            resource_page = 1;
            resource_table_body(resource_page, search, type);
        }, 500);
    });
}

function resource_usage_chart(id, year) {
    var data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Resource Usage',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#3453B7',
            backgroundColor: 'rgba(52, 83, 183, 0.2)',
            borderWidth: 2,
            fill: true
        }]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 3,
                borderColor: '#3453B7',
                borderCapStyle: 'round'
            }
        }
    };

    var ctx = document.getElementById('resource_usage_chart_canvas').getContext('2d');

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

    get_recource_data(id, year);
}

function get_recource_data(id, year) {
    $.ajax({
        url: "/dashboard/usage_chart_data",
        type: "POST",
        dataType: "json",
        data: {year: year, id: id},
        success: function (response) {
            update_resource_data(response.data);
            $('#resource_what_month_container').html(response.month);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function update_resource_data(data) {
    var ctx = document.getElementById('resource_usage_chart_canvas').getContext('2d');
    var chart = Chart.getChart(ctx);

    chart.data.datasets[0].data = data;
    chart.update();
}

function resource_details_btn() {
    $('#mid_container').on('click', '.resource_details', function() {
        $('#default_details_container').css('display', 'none');
        $('#details_container').css('display', 'block');
        var id = $(this).data('id');
        var tab = $('#tab__hide').val();

        $.ajax({
            url: "/dashboard/resource_details",
            type: "POST",
            dataType: "json",
            data: {
                id: id,
                tab: tab
            },
            success: function (response) {
                $('#details_container').html(response.html);
                if (response.year == '') {
                    $('#personal_tab').empty();
                    $('#personal_tab').html(`
                    <div class="border border-dashed p-3 text-center rounded">
                        Not been used
                    </div>`);
                } else {
                    resource_usage_chart(id, '');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function resource_usage_select() {
    $('#details_container').on('change', '#resource_usage_select', function() {
        var year = $(this).val();
        var id = $('#what__resouce').html();
        get_recource_data(id, year);
    });
}

function resource_records() {
    $('#details_container').on('click', '.resource_records', function() {
        alert('asdasd')
    });
}
