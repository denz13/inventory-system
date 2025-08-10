var _token = $('meta[name="csrf-token"]').attr("content");
var current_user_id = $('meta[name="current-user-id"]').attr("content");

$(document).ready(function () {
    bpath = __basepath + "/";
    initializePartials();
    // getMyTravels();
    // Initial load
    fetchMyTravels();
    //fetchApprovedTravels();
    // getApprovedTravels();
    getRatedTravels();
    draggableTable();
    initialize();
    initializeDateInputs();
});

function initialize() {
    // Get the current date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var year = today.getFullYear();

    // Format the date as MM/DD/YYYY
    var formattedDate = year + '-' + month + '-' + day;

    // Set the default value for the input field
    $('#modal_date_now').val(formattedDate); // jQuery
    document.getElementById("modal_date_now").value = formattedDate; // Vanilla JavaScript
}

$(document).on("select2:open", function (e) {
    document
        .querySelector(`[aria-controls="select2-${e.target.id}-results"]`)
        .focus();
});
//Initialize all My Documents DataTables
function initializePartials() {
    try {
        /***/
        dt__created_travel_order = $("#dt__created_travel_order").DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: "bootstrap",
            info: false,
            bInfo: true,
            bJQueryUI: true,
            bProcessing: true,
            bPaginate: true,
            aLengthMenu: [
                [10, 25, 50, 100, 150, 200, 250, 300, -1],
                [10, 25, 50, 100, 150, 200, 250, 300, "All"],
            ],
            iDisplayLength: 10,
            aaSorting: [],

            columnDefs: [
                {
                    className: "dt-head-center",
                    targets: [8],
                    orderable: false,
                },
            ],
        });

        dt__created_travel_order_list = $(
            "#dt__created_travel_order_list"
        ).DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: "bootstrap",
            info: false,
            bInfo: true,
            bJQueryUI: true,
            bProcessing: true,
            bPaginate: true,
            aLengthMenu: [
                [10, 25, 50, 100, 150, 200, 250, 300, -1],
                [10, 25, 50, 100, 150, 200, 250, 300, "All"],
            ],
            iDisplayLength: 10,
            aaSorting: [],

            columnDefs: [{ className: "dt-head-center", targets: [8, 1] }],
        });

        dt__created_travel_order_rated = $(
            "#dt__created_travel_order_rated"
        ).DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: "bootstrap",
            info: false,
            bInfo: true,
            bJQueryUI: true,
            bProcessing: true,
            bPaginate: true,
            aLengthMenu: [
                [10, 25, 50, 100, 150, 200, 250, 300, -1],
                [10, 25, 50, 100, 150, 200, 250, 300, "All"],
            ],
            iDisplayLength: 10,
            aaSorting: [],

            columnDefs: [{ className: "dt-head-center", targets: [8, 1] }],
        });

        pos_des = $("#pos_des").select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
            width: "100%",
        });

        trav_emp_list = $("#trav_emp_list").select2({
            placeholder: "Select Employee",
            allowClear: true,
            closeOnSelect: false,
            width: "100%",
        });

        name_modal = $("#name_modal").select2({
            placeholder: "Select Employee",
            allowClear: true,
            closeOnSelect: false,
            width: "100%",
        });

        /***/
    } catch (err) { }
}

function draggableTable() {
    $(".sig_modal_table_tbody")
        .sortable({
            handle: ".drag-handle", // Use the drag-handle class to define the draggable area
            axis: "y", // Allow dragging only in the vertical direction
            opacity: 0.6, // Set the opacity of the dragged item
            cursor: "move", // Change cursor to indicate draggable element
            update: function (event, ui) {
    // Callback function triggered after the user stops dragging and the sort order changes
    // You can perform any necessary actions here, such as updating the database with the new order
            },
        })
        .disableSelection(); // Prevent text selection while dragging
}

//Approved travel orders
function getApprovedTravels() {
    showLoading();
    $.ajax({
        url: bpath + "travel/order/load/travel/order/list",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            dt__created_travel_order_list.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/

                    var id = data[i]["id"];
                    var name_id = data[i]["name_id"];
                    var name = data[i]["name"];
                    var date = data[i]["date"];
                    var departure_date = data[i]["departure_date"];
                    var return_date = data[i]["return_date"];
                    var pos_des_id = data[i]["pos_des_id"];
                    var pos_des_type = data[i]["pos_des_type"];
                    var station = data[i]["station"];
                    var station_id = data[i]["station_id"];
                    var destination = data[i]["destination"];
                    var purpose = data[i]["purpose"];
                    var created_at = data[i]["created_at"];
                    var interval = data[i]["interval"];
                    var days = data[i]["days"];
                    // var can_delete = data[i]["can_delete"];
                    var can_view = data[i]["can_view"];
                    var can_update = data[i]["can_update"];
                    var can_release = data[i]["can_release"];
                    var status = data[i]["status"];
                    var class_sss = data[i]["class"];
                    var to_status = data[i]["to_status"];
                    var doc_type = data[i]["doc_type"];
                    var doc_type_id = data[i]["doc_type_id"];
                    var prepared_by = data[i]["prepared_by"];
                    var isAdmin = data[i]["isAdmin"];

                    var limit_update = "";

                    if (isAdmin) {
                        // if (to_status == "1") {
                        var can_delete = data[i]["can_delete"];
                    } else {
                        var can_delete = "";
                    }

                    if (to_status == "11") {
                        limit_update = "";
                    } else {
                        limit_update = can_update;
                    }

                    /***/
                    cd = `
                            <tr>
                                <td style="display: none" class="to_id">${id}</td>
                                <td style="display: none" class="name_id">${name_id}</td>
                                <td class="text-${class_sss}">
                                    <div class="flex justify-center items-center">
                                        <a id="for_action_button" data-doc-typ="${doc_type}" data-doc-tid="${doc_type_id}" href="javascript:;" class="status-link bg-${class_sss}/20 text-${class_sss} rounded px-2 py-1" data-tw-toggle="modal" data-tw-target="#view_signatories_modal">${status}</a>
                                    </div>
                                </td>
                                <td class="name text-justify">
                                    <div data-to-prps="${purpose}">
                                        <span class="text">${purpose}</span>
                                    </div>
                                    <div class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${created_at}</div>
                                </td>
                                <td>
                                    <div class="whitespace-nowrap type">
                                        <span class="text">${days}</span>
                                    </div>
                                    <span class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${prepared_by}</span>
                                </td>
                                <td>
                                    <div class="whitespace-nowrap type">
                                        <span class="text">${departure_date}</span>
                                    </div>
                                    <span class="hidden">${departure_date}</span>
                                </td>
                                <td>
                                    <div class="whitespace-nowrap type">
                                        <span class="text">${return_date}</span>
                                    </div>
                                    <span class="hidden">${return_date}</span>
                                </td>
                               <td class="station">
                                    <div class="max-w-64 truncate mr-1 text">${station}</div>
                                </td>
                                <td class="destination">
                                    <div class="max-w-64 truncate mr-1 text">${destination}</div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        ${can_view}
                                        ${can_delete}
                                    </div>

                                </td>
                            </tr>
                            `;

                    dt__created_travel_order_list.row.add($(cd)).draw();
                    /***/
                }
            }
            hideLoading();
        },
    });
}

//Rated travel orders
function getRatedTravels() {
    showLoading();
    $.ajax({
        url: bpath + "travel/order/load/travel/order/rated",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            dt__created_travel_order_rated.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/

                    var id = data[i]["id"];
                    var name_id = data[i]["name_id"];
                    var name = data[i]["name"];
                    var date = data[i]["date"];
                    var departure_date = data[i]["departure_date"];
                    var return_date = data[i]["return_date"];
                    var pos_des_id = data[i]["pos_des_id"];
                    var pos_des_type = data[i]["pos_des_type"];
                    var station = data[i]["station"];
                    var station_id = data[i]["station_id"];
                    var destination = data[i]["destination"];
                    var purpose = data[i]["purpose"];
                    var created_at = data[i]["created_at"];
                    var interval = data[i]["interval"];
                    var days = data[i]["days"];

                    var can_view = data[i]["can_view"];
                    var can_update = data[i]["can_update"];
                    var can_release = data[i]["can_release"];
                    var status = data[i]["status"];
                    var class_sss = data[i]["class"];
                    var to_status = data[i]["to_status"];
                    var doc_type = data[i]["doc_type"];
                    var doc_type_id = data[i]["doc_type_id"];
                    var prepared_by = data[i]["prepared_by"];

                    var limit_update = "";

                    if (to_status == "1") {
                        var can_delete = data[i]["can_delete"];
                    } else {
                        var can_delete = "";
                    }

                    if (to_status == "11") {
                        limit_update = "";
                    } else {
                        limit_update = can_update;
                    }

                    /***/

                    cd = `
                        <tr>
                            <td style="display: none" class="to_id">${id}</td>
                            <td style="display: none" class="name_id">${name_id}</td>
                            <td class="text-${class_sss}">
                                <div class="flex justify-center items-center">
                                    <a id="for_action_button" data-doc-typ="${doc_type}" data-doc-tid="${doc_type_id}" href="javascript:;" class="status-link bg-${class_sss}/20 text-${class_sss} rounded px-2 py-1" data-tw-toggle="modal" data-tw-target="#view_signatories_modal">${status}</a>
                                </div>
                            </td>
                            <td class="name text-justify">
                                <div data-to-prps="${purpose}">
                                    <span class="text">${purpose}</span>
                                </div>
                                <div class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${created_at}</div>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${days}</span>
                                </div>
                                <span class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${prepared_by}</span>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${departure_date}</span>
                                </div>
                                <span class="hidden">${departure_date}</span>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${return_date}</span>
                                </div>
                                <span class="hidden">${return_date}</span>
                            </td>
                            <td class="station">
                                <div class="max-w-64 truncate mr-1 text">${station}</div>
                            </td>
                            <td class="destination">
                                <div class="max-w-64 truncate mr-1 text">${destination}</div>
                            </td>
                            <td>
                                <div class="flex justify-center items-center">
                                    ${can_view}
                                </div>
                            </td>
                        </tr>
                        `;

                    dt__created_travel_order_rated.row.add($(cd)).draw();

                    /***/
                }
            }
            hideLoading();
        },
    });
}

//My travel orders
function getMyTravels() {
    showLoading();
    $.ajax({
        url: bpath + "travel/order/load/travel/order",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            dt__created_travel_order.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/

                    var id = data[i]["id"];
                    var name_id = data[i]["name_id"];
                    var name = data[i]["name"];
                    var date = data[i]["date"];
                    var departure_date = data[i]["departure_date"];
                    var return_date = data[i]["return_date"];
                    var pos_des_id = data[i]["pos_des_id"];
                    var pos_des_type = data[i]["pos_des_type"];
                    var station = data[i]["station"];
                    var station_id = data[i]["station_id"];
                    var destination = data[i]["destination"];
                    var purpose = data[i]["purpose"];
                    var created_at = data[i]["created_at"];
                    var interval = data[i]["interval"];
                    var days = data[i]["days"];
                    // var can_delete = data[i]["can_delete"];
                    var can_view = data[i]["can_view"];
                    var can_update = data[i]["can_update"];
                    var can_release = data[i]["can_release"];
                    var status = data[i]["status"];
                    var class_sss = data[i]["class"];
                    var to_status = data[i]["to_status"];
                    var doc_type = data[i]["doc_type"];
                    var doc_type_id = data[i]["doc_type_id"];
                    var prepared_by = data[i]["prepared_by"];

                    var limit_update = "";

                    if (to_status == "1" || to_status == "15") {
                        var can_delete = data[i]["can_delete"];
                    } else {
                        var can_delete = "";
                    }

                    if (to_status == "11") {
                        limit_update = "";
                    } else {
                        limit_update = can_update;
                    }

                    /***/

                    cd = `
                        <tr>
                            <td style="display: none" class="to_id">${id}</td>
                            <td style="display: none" class="name_id">${name_id}</td>
                            <td class="text-${class_sss}">
                                <div class="flex justify-center items-center">
                                    <a id="for_action_button" data-doc-typ="${doc_type}" data-doc-tid="${doc_type_id}" href="javascript:;" class="status-link bg-${class_sss}/20 text-${class_sss} rounded px-2 py-1" data-tw-toggle="modal" data-tw-target="#view_signatories_modal">${status}</a>
                                </div>
                            </td>
                            <td class="name text-justify">
                                <div data-to-prps="${purpose}">
                                    <span class="text">${purpose}</span>
                                </div>
                                <div class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${created_at}</div>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${days}</span>
                                </div>
                                <span class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level">${prepared_by}</span>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${departure_date}</span>
                                </div>
                                <span class="hidden">${departure_date}</span>
                            </td>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${return_date}</span>
                                </div>
                                <span class="hidden">${return_date}</span>
                            </td>
                            <td class="station">
                                <div class="max-w-64 truncate mr-1 text">${station}</div>
                            </td>
                            <td class="destination">
                                <div class="max-w-64 truncate mr-1 text">${destination}</div>
                            </td>
                            <td>
                                <div class="flex justify-center items-center">
                                    ${can_release}
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                        <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                        <div class="dropdown-menu w-40">
                                            <div class="dropdown-content">
                                                ${limit_update}
                                                ${can_view}
                                                ${can_delete}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        `;

                    dt__created_travel_order.row.add($(cd)).draw();

                    /***/
                }
            }
            hideLoading();
        },
    });
}

$("body").on("click", "#add_row_signatories", function (ev) {
    if ($("#trav_emp_list").val()) {
        addRowSignatories();
    } else {
        // Show toast message if dropdown is empty
        toastr.error("Please select a person before adding a signatory.");

        // Focus on the dropdown toggle button to bring attention to it
        $("#trav_emp_list").select2("open");
    }
    draggableTable();
});

function addRowSignatories() {
    var signatoryDescription;
    if ($("#sd_modal_sd").val() == "Other") {
        signatoryDescription = $("#custom-signatory").val();
    } else {
        signatoryDescription = $("#sd_modal_sd").val();
    }
    var tr = `
    <tr class="hover:bg-gray-200">
        <td>
            <span class="drag-handle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4">
                    <polyline points="5 9 2 12 5 15"></polyline>
                    <polyline points="9 5 12 2 15 5"></polyline>
                    <polyline points="15 19 12 22 9 19"></polyline>
                    <polyline points="19 9 22 12 19 15"></polyline>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                </svg>
            </span>
        </td>
        <td style="display:none">
            ${$("#trav_emp_list").val()}
        </td>
        <td style="display:none">
            <input type="text" style="display: none" name="table_signatory_id[]" class="form-control table_signatory_emp_id" value="" />
        </td>
        <td style="display: flex; align-items: center;">
            <input type="text" style="display: none" name="table_signatory_emp_id[]" class="form-control" value="${$(
                "#trav_emp_list"
            ).val()}" />
            <span class="text-xs" style="margin-right: 5px;">
                ${$("#trav_emp_list option:selected").text()}
            </span>
            <input type="text" name="table_signatory_suffix[]" class="form-control w-12 form-control-sm" value="${$(
                "#sd_modal_suffix"
            ).val()}" />
        </td>
        <td>
            <input type="text" name="table_signatory_description[]" class="form-control form-control-sm" value="${signatoryDescription}" />
        </td>
        <td class='justify-center'>
            <a href="javascript:void(0);" class="flex items-center text-danger delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                </svg>
            </a>
        </td>
    </tr>`;
    $(".sig_modal_table tbody").append(tr);

    // Reset input values after adding row
    $("#sd_modal_sd").val("");
    $("#sd_modal_suffix").val("");
    $("#trav_emp_list").val(null).trigger("change");

    var customSignatoryInput = document.getElementById("customSignatoryInput");
    customSignatoryInput.style.display = "none";
}

$(".sig_modal_table tbody").on("click", ".delete", function () {
    var tableRow = $(this).closest("tr");
    var table_signatory_id = tableRow.find(".table_signatory_id").val();
    var rowCount = $(".sig_modal_table tbody tr").length;

    if (rowCount === 1) {
        // If it's the last row, show a message or perform any action you want
        toastr.error("Cannot remove the last signatory.");
        return; // Exit the function without further execution
    }

    if (table_signatory_id) {
        $.ajax({
            url: "order/remove/signatory/travel/order",
            type: "POST",
            data: {
                _token: _token,
                table_signatory_id: table_signatory_id,
            },
            success: function (data) {
                console.log(data);
                __notif_load_data(__basepath + "/");
            },
        });
    }

    // Remove the table row only if it's not the last one
    tableRow.remove();
});

$("body").on("click", ".not_allowed_to_take_action", function () {
    $.ajax({
        url: bpath + "admin/manage/load/priv/notif",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            var data = JSON.parse(data);

            __notif_load_data(__basepath + "/");
        },
    });
});

$("#add_travel_order").on("click", function () {
    // Get the dates
    const departureDate = $('#modal_departure_date').val();
    const returnDate = $('#modal_return_date').val();
    const today = new Date().toISOString().split('T')[0];

    // Validate dates
    if (departureDate < today) {
        toastr.error("Departure date cannot be in the past");
        return;
    }
    if (returnDate < departureDate) {
        toastr.error("Return date cannot be before departure date");
        return;
    }

    // Add loading icon and text
    $("#add_travel_order").html(`
        <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-5 h-5 inline-block align-middle mr-2">
            <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="4">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                    </path>
                </g>
            </g>
        </svg>
    `);

    $("#add_travel_order").prop("disabled", true);

    let save_or_update = document.getElementById("add_travel_order").innerText;
    let to_id = $("#modal_update_to_id").val();
    let name_modal = "";
    let name_modal_text = "";
    let modal_date_now = $("#modal_date_now").val();
    let modal_departure_date = $("#modal_departure_date").val();
    let modal_return_date = $("#modal_return_date").val();
    let pos_des = $("#pos_des").val();
    var pos_des_type = $("#pos_des").find(":selected").attr("data-ass-type");
    let modal_station = $("#modal_station").val();
    let modal_destination = $("#modal_destination").val();
    let modal_purpose = $("#modal_purpose").val();
    var table_signatory_emp_id = [];
    var table_signatory_description = [];
    var table_signatory_suffix = [];
    var table_signatory_id = [];

    var to_memberList = [];

    // Check if any of the required fields are blank
    let modalDateNowEmpty = !modal_date_now;
    let modalDepartureDateEmpty = !modal_departure_date;
    let modalReturnDateEmpty = !modal_return_date;
    let modalStationEmpty = !modal_station;
    let modalDestinationEmpty = !modal_destination;
    let modalPurposeEmpty = !modal_purpose;

    // Add or remove border-danger class based on whether the fields are empty
    modalDateNowEmpty
        ? $("#modal_date_now").addClass("border-danger")
        : $("#modal_date_now").removeClass("border-danger");
    modalDepartureDateEmpty
        ? $("#modal_departure_date").addClass("border-danger")
        : $("#modal_departure_date").removeClass("border-danger");
    modalReturnDateEmpty
        ? $("#modal_return_date").addClass("border-danger")
        : $("#modal_return_date").removeClass("border-danger");
    modalStationEmpty
        ? $("#modal_station").addClass("border-danger")
        : $("#modal_station").removeClass("border-danger");
    modalDestinationEmpty
        ? $("#modal_destination").addClass("border-danger")
        : $("#modal_destination").removeClass("border-danger");
    modalPurposeEmpty
        ? $("#modal_purpose").addClass("border-danger")
        : $("#modal_purpose").removeClass("border-danger");

    // Check if any of the required fields are blank
    if (
        modalDateNowEmpty ||
        modalDepartureDateEmpty ||
        modalReturnDateEmpty ||
        modalStationEmpty ||
        modalDestinationEmpty ||
        modalPurposeEmpty
    ) {
        // Display an error message or handle it as desired
        toastr.error("Please make sure to fill all the required fields.");
        // Enable the button and revert to original text
        $("#add_travel_order").prop("disabled", false);
        $("#add_travel_order").html("Save");
        return;
    }

    $("#name_modal :selected").each(function (i, selected) {
        to_memberList[i] = $(selected).val();
    });

    $('input[name="table_signatory_emp_id[]"]').each(function (index, emp_id) {
        table_signatory_emp_id[index] = $(emp_id).val();
    });

    $('input[name="table_signatory_description[]"]').each(function (i, desc) {
        table_signatory_description[i] = $(desc).val();
    });

    $('input[name="table_signatory_suffix[]"]').each(function (i, suff) {
        table_signatory_suffix[i] = $(suff).val();
    });

    $('input[name="table_signatory_id[]"]').each(function (i, sig_id) {
        table_signatory_id[i] = $(sig_id).val();
    });

    // Convert checked state to 1 if checked, 0 if not checked
    var official_business = document.getElementById("official_business").checked
        ? 1
        : 0;
    var official_time = document.getElementById("official_time").checked
        ? 1
        : 0;
    var public_transportation = document.getElementById("public_transportation")
        .checked
        ? 1
        : 0;
    var school_vehicle = document.getElementById("school_vehicle").checked
        ? 1
        : 0;

    $.ajax({
        type: "POST",
        url: bpath + "travel/order/add/travel/order",
        data: {
            _token: _token,
            name_modal: name_modal,
            name_modal_text: name_modal_text,
            to_memberList: to_memberList,
            modal_date_now: modal_date_now,
            modal_departure_date: modal_departure_date,
            modal_return_date: modal_return_date,
            pos_des: pos_des,
            pos_des_type: pos_des_type,
            modal_station: modal_station,
            modal_destination: modal_destination,
            modal_purpose: modal_purpose,
            table_signatory_emp_id: table_signatory_emp_id,
            table_signatory_description: table_signatory_description,
            table_signatory_suffix: table_signatory_suffix,
            table_signatory_id: table_signatory_id,
            save_or_update: save_or_update,
            to_id: to_id,
            official_business: official_business,
            official_time: official_time,
            public_transportation: public_transportation,
            school_vehicle: school_vehicle,
        },
        beforeSend: function () {
            // Disable the button and show loading icon and text
            $("#add_travel_order").prop("disabled", true);
        },
        success: function (response) {
            var data = JSON.parse(response);
            if (data.no_signatory) {
                __notif_load_data(__basepath + "/");
                // Focus on the dropdown toggle button to bring attention to it
                $("#trav_emp_list").select2("open");
            } else {
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#make_travel_order_modal")
                );
                mdl.hide();
                fetchMyTravels();
            }
        },
        complete: function () {
            // Enable the button and revert to original text
            $("#add_travel_order").prop("disabled", false);
            $("#add_travel_order").html("Save");

            // getMyTravels();

            __notif_load_data(__basepath + "/");
        },
    });

    // getApprovedTravels();
});

$("body").on("click", "#btn_delete_to", function (ev) {
    to_id = $(this).data("to-id");
    // console.log( to_id);
    swal({
        container: "my-swal",
        title: "Are you sure?",
        text: "It will permanently deleted!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.value == true) {
            swal({
                title: "Deleted!",
                text: "Travel Order deleted permanently!",
                type: "success",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 1000,
            });

            $.ajax({
                url: "/travel/order/remove",
                type: "POST",
                data: {
                    _token: _token,
                    to_id: to_id,
                },
                cache: false,
                success: function (data) {
                    var data = JSON.parse(data);
                    __notif_load_data(__basepath + "/");
                    // getMyTravels();
                    fetchMyTravels();
                    // getApprovedTravels();
                    //fetchApprovedTravels();
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
        }
    });
});

$("body").on("click", "#btn_update_to", function (ev) {
    to_id = $(this).data("to-id");

    document.getElementById("add_travel_order").innerText = "Update";

    $.ajax({
        url: "order/load/details",
        type: "POST",
        data: {
            _token: _token,
            to_id: to_id,
        },
        cache: false,
        success: function (data) {
            clear_add_update_modal();
            var data = JSON.parse(data);

            // Assuming data contains information about the toggles' state
            var officialBusinessChecked =
                data["get_to"]["official_business"] == 1 ? true : false;
            var officialTimeChecked =
                data["get_to"]["official_time"] == 1 ? true : false;
            var publicTransportationChecked =
                data["get_to"]["public_transportation"] == 1 ? true : false;
            var schoolVehicleChecked =
                data["get_to"]["school_vehicle"] == 1 ? true : false;

            // Set the checked attribute for each checkbox based on the retrieved data
            $("#official_business").prop("checked", officialBusinessChecked);
            $("#official_time").prop("checked", officialTimeChecked);
            $("#public_transportation").prop(
                "checked",
                publicTransportationChecked
            );
            $("#school_vehicle").prop("checked", schoolVehicleChecked);

            $("#modal_update_to_id").val(data["get_to"]["id"]);

            $("#modal_date_now").val(data["get_to"]["date"]);
            $("#modal_departure_date").val(data["get_to"]["departure_date"]);
            $("#modal_return_date").val(data["get_to"]["return_date"]);
            $("#modal_station").val(data["get_to"]["station"]);
            $("#modal_destination").val(data["get_to"]["destination"]);
            $("#modal_purpose").val(data["get_to"]["purpose"]);

            $(".sig_modal_table tbody").append(data["sig_for_table"]);

            $("#name_modal")
                .val(data.selected_values_members)
                .trigger("change");

            if (data["get_to"]["status"] == 1) {
                $(".delete").css("display", "block");
                $("#div_hide_if_not_pending").css("display", "block");
            } else {
                // $('.delete').hide();
                $(".delete").css("display", "none");
                $("#div_hide_if_not_pending").css("display", "none");
            }

            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#make_travel_order_modal")
            );
            mdl.toggle();
        },
    });
});

$("body").on("click", "#release_travel_order", function (ev) {
    to_id = $(this).data("to-id");

    $.ajax({
        url: "order/load/details",
        type: "POST",
        data: {
            _token: _token,
            to_id: to_id,
        },
        cache: false,
        success: function (data) {
            var data = JSON.parse(data);

            $("#modal_release_to_id").val(data["get_to"]["id"]);
            $(".sig_modal_table tbody tr").detach();
            $(".sig_modal_table tbody").append(data["sig_for_table"]);

            $(".sig_modal_table_modal tbody tr").detach();
            $(".sig_modal_table_modal tbody").append(
                data["sig_for_table_modal"]
            );
            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#release_travel_order_modal")
            );

            __notif_load_data(__basepath + "/");

            if (data["get_to"]["status"] != 1) {
                mdl.hide();
            } else {
                mdl.toggle();
            }
            // getMyTravels();
            // fetchMyTravels();
        },
    });
});

$("body").on("click", "#make_travel_order", function (ev) {
    document.getElementById("add_travel_order").innerText = "Save";
    clear_add_update_modal();
    $(".delete").css("display", "block");
    $("#div_hide_if_not_pending").css("display", "block");
});

$("body").on("click", "#btn_release_travel_order_modal", function (ev) {
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#release_travel_order_modal")
    );
    mdl.hide();

    to_id = $("#modal_release_to_id").val();
    message = $("#message").val();
    //  console.log(message)
    $.ajax({
        url: "order/release/travel/order",
        type: "POST",
        data: {
            _token: _token,
            to_id: to_id,
            message: message,
        },
        cache: false,
        success: function (data) {
            var data = JSON.parse(data);
            __notif_load_data(__basepath + "/");
            // getMyTravels();
            fetchMyTravels();
            //  console.log(data);
        },
    });
});

function clear_add_update_modal() {
    $(".sig_modal_table tbody tr").detach();
    trav_emp_list.val(null).trigger("change");
    name_modal.val(null).trigger("change");
    $("#sd_modal_sd").val("");
    $("#sd_modal_suffix").val("");
    $("#modal_date_now").val("");
    $("#modal_departure_date").val("");
    $("#modal_return_date").val("");
    $("#modal_station").val("");
    $("#modal_destination").val("");
    $("#modal_purpose").val("");

    $("#modal_update_to_id").val("");

    initialize();
}

function toggleCustomSignatory(selectElement) {
    var customSignatoryInput = document.getElementById("customSignatoryInput");
    if (selectElement.value === "Other") {
        customSignatoryInput.style.display = "block";
    } else {
        customSignatoryInput.style.display = "none";
    }
}

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Search input change event with debounce
$('#search-input').on('input', debounce(function () {
    fetchMyTravels();
}, 500)); // Adjust the delay (500ms) as needed

// Per page select change event
$('#per-page-select').on('change', function () {
    fetchMyTravels();
    //fetchApprovedTravels();
});

// Pagination click event
$(document).on('click', '#pagination-links a', function (e) {
    e.preventDefault();
    let page = $(this).attr('href').split('page=')[1];
    fetchMyTravels(page);
    //fetchApprovedTravels(page);
});

function fetchMyTravels(page = 1, sortBy = null, sortOrder = null) {
    let perPage = $('#per-page-select').val();
    let search = $('#search-input').val();
    $('#my-travel-orders-table tbody').empty();
    $('#my-travel-orders-table tbody').append(`
                <tr id="loading-row">
                    <td colspan="10" class="text-center">
                        <div class="flex justify-center items-center">
                            <span class="ml-2 flex items-center">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                    <g fill="none" fill-rule="evenodd" stroke-width="4">
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                    </g>
                                </svg>
                                <span class="ml-2">Loading data...</span>
                            </span>
                        </div>
                    </td>
                </tr>
            `);


    $.ajax({
        url: '/travel/order/fetch?page=' + page,
        type: 'GET',
        data: {
            perPage: perPage,
            search: search,
            sortBy: sortBy,
            sortOrder: sortOrder
        },
        success: function (response) {
            // Update table rows
            $('#my-travel-orders-table tbody').empty();
            $.each(response.data, function (index, travelOrder) {
                let profilePictures = '';
                let members = travelOrder.members;
                let membersCount = members.length;

                // Limit to 3 pictures
                let displayedMembers = members.slice(0, 3);

                $.each(displayedMembers, function (memberIndex, member) {
                    let profilePicture = `
                                    <div class="w-10 h-10 image-fit zoom-in ${memberIndex === 0 ? '' : '-ml-5'}">
                                        <img alt="Profile Picture" class="tooltip rounded-full" title="${member.name}" data-action="zoom" src="${member.profile_picture}">
                                    </div>
                                `;
                    profilePictures += profilePicture;
                });

                // Add a "more" count if there are more than 5 members
                if (membersCount > 3) {
                    profilePictures += `
                                    <div class="w-10 h-5 image-fit p-1">
                                        <div class="bg-primary/10 text-primary rounded px-1 text-center">+${membersCount - 3}</div>
                                    </div>
                                `;
                }

                var limit_update = "";
                var can_delete = "";

                if (travelOrder.to_status == "1" || travelOrder.to_status == "15") {
                    can_delete = travelOrder.can_delete;
                } else {
                    can_delete = "";
                }

                if (travelOrder.to_status == "11") {
                    limit_update = "";
                } else {
                    limit_update = travelOrder.can_update;
                }

                let row = `
                                <tr>
                                    <td style="display: none" class="to_id">${travelOrder.id}</td>
                                <td style="display: none" class="name_id">${travelOrder.name_id}</td>
                                    <td class="w-40">
                                        <div class="flex">
                                            ${profilePictures}
                                        </div>
                                    </td>
                                    <td class="w-56">
                                        <div class="div__truncate-text">${travelOrder.purpose}</div>
                                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${travelOrder.days} Day/s</div>
                                    </td>
                                    <td>
                                        <a href="javascript:;" class="font-medium whitespace-nowrap ">${travelOrder.prepared_by}</a>
                                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${travelOrder.date_formatted}</div>
                                    </td>
                                    <td class="text-center w-56">
                                        ${travelOrder.departure_date}
                                    </td>
                                    <td class="text-center w-56">
                                        ${travelOrder.return_date}
                                    </td>
                                    <td class="text-center w-56">
                                        <div class="div__truncate-text ">${travelOrder.station}</div>
                                        </td>
                                    <td class="text-center w-56">
                                        <div class="div__truncate-text ">${travelOrder.destination}</div>
                                        </td>
                                    <td class="text-${travelOrder.class}">
                                         <div class="flex justify-center items-center">
                                            <a id="for_action_button" data-doc-typ="${travelOrder.doc_type}" data-doc-tid="${travelOrder.doc_type_id}" href="javascript:;" class="status-link bg-${travelOrder.class}/20 text-${travelOrder.class} rounded px-2 py-1" data-tw-toggle="modal" data-tw-target="#view_signatories_modal">${travelOrder.status}</a>
                                        </div>
                                    </td>
                                    <td class="table-report__action w-56">
                                        <div class="flex justify-center items-center">
                                            ${travelOrder.can_release}
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                                <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                                <div class="dropdown-menu w-40">
                                                    <div class="dropdown-content">
                                                        ${limit_update}
                                                        ${travelOrder.can_view}
                                                        ${can_delete}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `;
                $('#my-travel-orders-table tbody').append(row);
            });

            // Update table information
            $('#table-info').text(
                `Showing ${response.from} to ${response.to} of ${response.total} entries`
            );

            // Update pagination links
            let pagination = `
                            <nav class="w-full sm:w-auto sm:mr-auto">
                                <ul class="pagination">
                                    <li class="page-item ${response.current_page === 1 ? 'hidden' : ''}">
                                        <a class="page-link" href="?page=1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left">
                                                <polyline points="11 17 6 12 11 7"></polyline>
                                                <polyline points="18 17 13 12 18 7"></polyline>
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="page-item ${response.current_page === 1 ? 'hidden' : ''}">
                                        <a class="page-link" href="?page=${response.current_page - 1}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </a>
                                    </li>
                                    ${generatePaginationLinks(response)}
                                    <li class="page-item ${response.current_page === response.last_page ? 'hidden' : ''}">
                                        <a class="page-link" href="?page=${response.current_page + 1}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="page-item ${response.current_page === response.last_page ? 'hidden' : ''}">
                                        <a class="page-link" href="?page=${response.last_page}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right">
                                                <polyline points="13 17 18 12 13 7"></polyline>
                                                <polyline points="6 17 11 12 6 7"></polyline>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        `;

            $('#pagination-links').html(pagination);
        },
        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function generatePaginationLinks(response) {
    let links = '';

    if (response.last_page <= 7) {
        for (let i = 1; i <= response.last_page; i++) {
            links += generatePageLink(i, response.current_page);
        }
    } else {
        if (response.current_page <= 4) {
            for (let i = 1; i <= 5; i++) {
                links += generatePageLink(i, response.current_page);
            }
            links += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            links += generatePageLink(response.last_page, response.current_page);
        } else if (response.current_page >= response.last_page - 3) {
            links += generatePageLink(1, response.current_page);
            links += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            for (let i = response.last_page - 4; i <= response.last_page; i++) {
                links += generatePageLink(i, response.current_page);
            }
        } else {
            links += generatePageLink(1, response.current_page);
            links += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            for (let i = response.current_page - 1; i <= response.current_page + 1; i++) {
                links += generatePageLink(i, response.current_page);
            }
            links += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            links += generatePageLink(response.last_page, response.current_page);
        }
    }

    return links;
}

function generatePageLink(page, currentPage) {
    let activeClass = (page === currentPage) ? 'active' : '';
    return `<li class="page-item ${activeClass}"><a class="page-link" href="?page=${page}">${page}</a></li>`;
}

// Sorting functionality
$(document).on('click', '.sort-header', function () {
    let sortBy = $(this).data('sort-by');
    let sortOrder = $(this).hasClass('ascending') ? 'desc' : 'asc';

    // Toggle sort order class and icon
    $('.sort-header').removeClass('ascending descending');
    $('.sort-icon').html(''); // Clear all sort icons
    $(this).addClass(sortOrder === 'asc' ? 'ascending' : 'descending');
    $(this).find('.sort-icon').html(sortOrder === 'asc' ? '<i class="fas fa-sort-up"></i>' : '<i class="fas fa-sort-down"></i>');

    // Sort and reload data
    fetchMyTravels(1, sortBy, sortOrder);
    // fetchApprovedTravels(1, sortBy, sortOrder);
});

function initializeDateInputs() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Set min date for both inputs
    $('#modal_departure_date').attr('min', today);
    $('#modal_return_date').attr('min', today);
    
    // Add event listener for departure date change
    $('#modal_departure_date').on('change', function() {
        const departureDate = $(this).val();
        // Set return date min to departure date
        $('#modal_return_date').attr('min', departureDate);
        
        // If return date is before departure date, reset it
        const returnDate = $('#modal_return_date').val();
        if (returnDate && returnDate < departureDate) {
            $('#modal_return_date').val(departureDate);
        }
    });
}
