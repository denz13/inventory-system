var _token = $('meta[name="csrf-token"]').attr("content");
var schedule_id = "";
var days_modal = "";
var esms_faculty = "";
var agency_employee = "";
var dt__faculty_subjects;
var dt__linked_data;
// var filter_sem = '';

var sy = "";
var sm = "";
var sc = "";
var sec = "";
var scd = "";
var blk = "";
var fid = "";
var pk = "";

$(document).ready(function () {
    bpath = __basepath + "/";
    load_dropdown_days();
    load_subjects_datatable();
    load_linked_datatable();
    load_subject_data_list();
    load_linked_data_list();
});

function load_dropdown_days() {
    days_modal = $("#daysModal").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
    modal_sem = $("#modal_sem").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
    esms_faculty = $("#esms_faculty").select2({
        placeholder: "Select Faculty",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
    agency_employee = $("#agency_employee").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
}

function load_subjects_datatable() {
    try {
        /***/
        dt__faculty_subjects = $("#dt__faculty_subjects").DataTable({
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
                    targets: [13],
                    orderable: false,
                },
            ],
        });

        /***/
    } catch (err) {}
}

function load_linked_datatable() {
    dt__linked_data = $("#dt__linked_data").DataTable({
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
                targets: [2],
                orderable: false,
            },
        ],
    });
}

function load_subject_data_list() {
    showLoading();
    $.ajax({
        url: bpath + "faculty-monitoring/load/subject",
        type: "POST",
        data: {
            _token: _token,
            filter_year: $("#filter_year").val(),
            filter_sem: $("#filter_sem").val(),
        },
        success: function (data) {
            dt__faculty_subjects.clear().draw();
            /***/
            var data = JSON.parse(data);

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/
                    var oid = data[i]["oid"];
                    var sy = data[i]["sy"];
                    var sem = data[i]["sem"];
                    var subjcode = data[i]["subjcode"];
                    var section = data[i]["section"];
                    var subjsecno = data[i]["subjsecno"];
                    var days = data[i]["days"];
                    var time = data[i]["time"];
                    var room = data[i]["room"];
                    var bldg = data[i]["bldg"];
                    var block = data[i]["block"];
                    var maxstud = data[i]["maxstud"];
                    var forcoll = data[i]["forcoll"];
                    var fordept = data[i]["fordept"];
                    var lock = data[i]["lock"];
                    var facultyload = data[i]["facultyload"];
                    var tuitionfee = data[i]["tuitionfee"];
                    var facultyid = data[i]["facultyid"];
                    var primary_key = data[i]["primary_key"];
                    var status = data[i]["status"];
                    var class_color = data[i]["class_color"];
                    var status_btn = data[i]["status_btn"];
                    var id_ = data[i]["id_"];
                    var class_id = data[i]["class_id"];
                    var created_by = data[i]["created_by"];

                    // console.log(id_);
                    /***/

                    cd =
                        "" +
                        "<tr>" +
                        //facultyid
                        '<td style="width:200px" class="facultyid text-center">' +
                        facultyid +
                        "</td>" +
                        //subjcode
                        '<td  class="subjcode">' +
                        subjcode +
                        "</td>" +
                        //section
                        '<td  class="section">' +
                        section +
                        "</td>" +
                        //days
                        '<td style="display:none" class="days">' +
                        days +
                        "</td>" +
                        //time
                        '<td style="display:none" class="time">' +
                        time +
                        "</td>" +
                        //room
                        '<td style="display:none" class="room">' +
                        room +
                        "</td>" +
                        //bldg
                        '<td style="display:none" class="bldg">' +
                        bldg +
                        "</td>" +
                        //block
                        '<td  class="block_data">' +
                        block +
                        "</td>" +
                        //maxstud
                        '<td class="maxstud">' +
                        maxstud +
                        "</td>" +
                        //forcoll
                        '<td  class="forcoll">' +
                        forcoll +
                        "</td>" +
                        //fordept
                        '<td  class="fordept">' +
                        fordept +
                        "</td>" +
                        //facultyload
                        '<td  class="facultyload">' +
                        facultyload +
                        "</td>" +
                        //classs status
                        '<td  class="facultyload">' +
                        '<div class="w-full mt-3 xl:mt-0 flex-1">' +
                        '<div class="form-check form-switch">' +
                        status_btn +
                        '<label class="form-check-label text-' +
                        class_color +
                        '" >' +
                        status +
                        "</label>" +
                        "</div>" +
                        "</div>" +
                        "</td>" +
                        //actions
                        '<td class="items-center">' +
                        '<div class="flex justify-center items-center">' +
                        //new btn
                        '<div id="myDropdown" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">' +
                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>' +
                        '<div class="dropdown-menu w-40">' +
                        '<div class="dropdown-content">' +
                        //new btn
                        '<a id="btn_for_update_link_meeting" href="javascript:;" class="dropdown-item" data-id-sy="' +
                        sy +
                        '" data-id-sm="' +
                        sem +
                        '" data-id-sc="' +
                        subjcode +
                        '" data-id-sec="' +
                        section +
                        '" data-id-scd="' +
                        subjsecno +
                        '" data-id-blk="' +
                        block +
                        '" data-id-fid="' +
                        facultyid +
                        '" data-id-fc="' +
                        forcoll +
                        '" data-id-pk="' +
                        primary_key +
                        '"data-id_="' +
                        id_ +
                        '"data-class-id="' +
                        class_id +
                        '"> <i class="fa fa-edit w-4 h-4 mr-2 text-success"></i> Edit </a>' +
                        //new btn
                        '<a id="btn_for_clear_link_meeting" href="javascript:;" class="dropdown-item" data-id-sy="' +
                        sy +
                        '" data-id-sm="' +
                        sem +
                        '" data-id-sc="' +
                        subjcode +
                        '" data-id-sec="' +
                        section +
                        '" data-id-scd="' +
                        subjsecno +
                        '" data-id-blk="' +
                        block +
                        '" data-id-fid="' +
                        facultyid +
                        '" data-id-fc="' +
                        forcoll +
                        '" data-id-pk="' +
                        primary_key +
                        '"data-id_="' +
                        id_ +
                        '"data-class-id="' +
                        class_id +
                        '"> <i class="fa fa-trash w-4 h-4 mr-2 text-danger"></i> Clear </a>' +
                        //new btn
                        '<a id="print_button" target="_blank" href="/faculty-monitoring/print/f/' +
                        sy +
                        "/vw?" +
                        "sm=" +
                        sem +
                        "&sc=" +
                        subjcode +
                        "&sec=" +
                        section +
                        "&scd=" +
                        subjsecno +
                        "&blk=" +
                        block +
                        "&fid=" +
                        facultyid +
                        "&fc=" +
                        forcoll +
                        "&pk=" +
                        primary_key +
                        "&id_=" +
                        id_ +
                        "&class_id=" +
                        class_id +
                        "&created_by=" +
                        created_by +
                        "&sy=" +
                        sy +
                        '" class="dropdown-item" data-id-sy="' +
                        sy +
                        '" data-id-sm="' +
                        sem +
                        '" data-id-sc="' +
                        subjcode +
                        '" data-id-sec="' +
                        section +
                        '" data-id-scd="' +
                        subjsecno +
                        '" data-id-blk="' +
                        block +
                        '" data-id-fid="' +
                        facultyid +
                        '" data-id-fc="' +
                        forcoll +
                        '" data-id-pk="' +
                        primary_key +
                        '"data-id_="' +
                        id_ +
                        '"data-class-id="' +
                        class_id +
                        '"> <i class="fa fa-print w-4 h-4 mr-2 text-primary"></i> Print </a>' +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</td>" +
                        "</tr>";

                    dt__faculty_subjects.row.add($(cd)).draw();
                    /***/
                }
            }
            hideLoading();
        },
    });
}

// Assuming you have included SweetAlert library
function handleDeleteClick(rowId) {
    const confirmed = window.confirm(
        `Are you sure you want to delete this row with ID ${rowId}?`
    );

    if (confirmed) {
        // Perform an AJAX request to delete the data
        $.ajax({
            url: bpath + "faculty-monitoring/delete-linked-id", // Replace with your actual delete API URL
            type: "POST", // Use appropriate HTTP method (GET, POST, etc.)
            data: { id: rowId, _token: _token }, // Replace with your data
            success: function (response) {
                if (response.success) {
                    // On successful deletion, remove the corresponding row from the table
                    const tableRow = document.querySelector(
                        `[data-id="${rowId}"]`
                    );

                    if (tableRow) {
                        tableRow.remove();
                        load_linked_data_list();
                    }
                } else {
                    alert("Failed to delete the row."); // Display an error message
                }
            },
            error: function () {
                alert("An error occurred while deleting the row."); // Display an error message
            },
        });
    }
}

function load_linked_data_list() {
    showLoading();
    $.ajax({
        url: bpath + "faculty-monitoring/load/linked",
        type: "POST",
        data: {
            _token: _token,
            esms_faculty: $("#esms_faculty").val(),
            agency_employee: $("#agency_employee").val(),
        },
        success: function (data) {
            dt__linked_data.clear().draw();
            /***/
            var data = JSON.parse(data);

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/

                    var esms_faculty_id = data[i]["esms_faculty_id"];
                    var hris_agency_id = data[i]["hris_agency_id"];
                    var fullname = data[i]["fullname"];
                    var id = data[i]["id"];

                    /***/

                    cd =
                        "" +
                        '<tr data-id="' +
                        id +
                        '">' +
                        //to_id
                        '<td class="to_id">' +
                        fullname +
                        "</td>" +
                        //user_id
                        '<td  class="subjcode">' +
                        esms_faculty_id +
                        "</td>" +
                        //user_id
                        '<td  class="subjcode">' +
                        hris_agency_id +
                        "</td>" +
                        //actions
                        "<td>" +
                        '<div class="flex justify-center items-center">' +
                        '<a href="javascript:;" class="zoom-in w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-danger text-2xl shadow-md" onclick="handleDeleteClick(' +
                        id +
                        ')"><i class="w-4 h-4 fas fa-trash"></i></a>' +
                        "</div>" +
                        "</td>" +
                        "</tr>";

                    dt__linked_data.row.add($(cd)).draw();
                    /***/
                }
            }
            hideLoading();
        },
    });
}

$("#filter_year").change(function () {
    load_subject_data_list();
});

$("#filter_sem").change(function () {
    load_subject_data_list();
});

$("#esms_faculty").change(function () {
    load_linked_data_list();
});

$("#agency_employee").change(function () {
    load_linked_data_list();
});

$("body").on("click", "#add_new_schedule_btn", function (ev) {
    schedule_id = $("#schedule_id").val();

    var days_list = [];

    $("#days_modal :selected").each(function (i, selected) {
        days_list[i] = $(selected).val();
    });

    $.ajax({
        url: bpath + "faculty-monitoring/add/schedule",
        type: "POST",
        data: {
            _token: _token,
            schedule_id: schedule_id,
            modal_subject_name: $("#modal_subject_name").val(),
            modal_subject_code: $("#modal_subject_code").val(),
            modal_type: $("#modal_type").val(),
            days_modal: $("#days_modal").val(),
            modal_date_time: $("#modal_date_time").val(),
            modal_status: $("#modal_status").val(),
            modal_year: $("#modal_year").val(),
            modal_sem: $("#modal_sem").val(),
            modal_Description: $("#modal_Description").val(),
        },
        cache: false,
        success: function (data) {
            var data = JSON.parse(data);
            // console.log(data);

            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#add_new_schedule_modal")
            );
            mdl.hide();
            clear_fields();
        },
    });
});

$("body").on("click", "#add_new_linking_btn", function (ev) {
    var esms_facultyList = [];
    var agency_employeeList = [];

    $("#esms_faculty :selected").each(function (i, selected) {
        esms_facultyList[i] = $(selected).val();
    });

    $("#agency_employee :selected").each(function (i, selected) {
        agency_employeeList[i] = $(selected).val();
    });

    if ($("#esms_faculty").val() != "" && $("#agency_employee").val() != "") {
        $.ajax({
            url: bpath + "faculty-monitoring/add/linked",
            type: "POST",
            data: {
                _token: _token,
                esms_facultyList: $("#esms_faculty").val(),
                agency_employeeList: $("#agency_employee").val(),
            },
            cache: false,
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data);
                load_linked_data_list();
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#lingking_agency_esms_modal")
                );
                mdl.hide();
            },
        });
    }
});

$("body").on("click", "#btn_for_update_link_meeting", function (ev) {
    const myDropdown = tailwind.Dropdown.getOrCreateInstance(
        document.querySelector("#myDropdown")
    );
    myDropdown.hide();
    ev.preventDefault();

    if (!ev.detail || ev.detail == 1) {
        sy = $(this).data("id-sy");
        sm = $(this).data("id-sm");
        sc = $(this).data("id-sc");
        sec = $(this).data("id-sec");
        scd = $(this).data("id-scd");
        blk = $(this).data("id-blk");
        fid = $(this).data("id-fid");
        fc = $(this).data("id-fc");
        pk = $(this).data("id-pk");

        $.ajax({
            url: bpath + "faculty-monitoring/load/link/meeting/update",
            type: "POST",
            data: {
                _token: _token,
                pk: pk,
            },
            cache: false,
            success: function (data) {
                var response = JSON.parse(data);
                // console.log(response);

                if (response["get_status"]) {
                    // Get values
                    var title = response.get_status.title;
                    var link = response.get_status.link_meeting;
                    var description =
                        response.get_status.link_meeting_description;
                    var timeStart = response.get_status.time_start;
                    var timeEnd = response.get_status.time_end;
                    var end_after = response.get_status.end_after;
                    var end_after = response.get_status.end_after;
                    var id = response.get_status.id;

                    // Set values
                    $("#modalTitleMeeting").val(title);
                    $("#modalLinkMeeting").val(link);
                    $("#modalLinkMeetingDescription").val(description);
                    $("#modalDateTimeStart").val(timeStart);
                    $("#modalDateTimeEnd").val(timeEnd);
                    $("#modalEndAfterMeeting").val(end_after);
                    $("#modalMeetingUpdateLinkId").val(id);

                    // Get days array and parse
                    var days = JSON.parse(response.get_status.days);

                    // Get Select2 instance
                    var select = $("#daysModal");

                    // Clear selections
                    select.val(null).trigger("change");

                    // Filter days array to include only existing options
                    var existingDays = days.filter(function (day) {
                        return (
                            select.find('option[value="' + day + '"]').length >
                            0
                        );
                    });

                    // Set selected values directly
                    select.val(existingDays).trigger("change");
                } else {
                    clear_fields();
                }

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_update_link_meeting")
                );
                mdl.toggle();
            },
        });
    }
});

$("body").on("click", "#btn_for_clear_link_meeting", function (ev) {
    const myDropdown = tailwind.Dropdown.getOrCreateInstance(
        document.querySelector("#myDropdown")
    );
    myDropdown.hide();
    ev.preventDefault();

    if (!ev.detail || ev.detail == 1) {
        sy = $(this).data("id-sy");
        sm = $(this).data("id-sm");
        sc = $(this).data("id-sc");
        sec = $(this).data("id-sec");
        scd = $(this).data("id-scd");
        blk = $(this).data("id-blk");
        fid = $(this).data("id-fid");
        fc = $(this).data("id-fc");
        pk = $(this).data("id-pk");
        id_ = $(this).data("id_");
        class_id = $(this).data("class-id");

        // Show a confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to clear the link meeting?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                // User clicked "Yes"
                $.ajax({
                    url: bpath + "faculty-monitoring/load/link/meeting/clear",
                    type: "POST",
                    data: {
                        _token: _token,
                        pk: pk,
                        id_: id_,
                        class_id: class_id,
                    },
                    cache: false,
                    success: function (data) {
                        var response = JSON.parse(data);
                        // console.log(response);
                        load_subject_data_list();
                        clear_fields();
                    },
                });
            }
        });
    }
});

$("#modal_update_link_meeting").on(
    "click",
    "#add_update_link_meeting_modal_btn",
    function (ev) {
        ev.preventDefault();

        if (!ev.detail || ev.detail == 1) {
            var btn = $(this);
            var meetingID = $("#modalMeetingUpdateLinkId").val();
            var days = $("#daysModal").val();
            var title = $("#modalTitleMeeting").val();
            var link = $("#modalLinkMeeting").val();
            var description = $("#modalLinkMeetingDescription").val();
            var timeStart = $("#modalDateTimeStart").val();
            var timeEnd = $("#modalDateTimeEnd").val();
            var autoEndAfter = $("#modalEndAfterMeeting").val();

            // Validate required fields before making the AJAX request
            if (
                title.trim() === "" ||
                link.trim() === "" ||
                days.length === 0
            ) {
                // Find the first empty input field
                var emptyInput = "";
                if (title.trim() === "") {
                    emptyInput = $("#modalTitleMeeting");
                } else if (link.trim() === "") {
                    emptyInput = $("#modalLinkMeeting");
                } else if (days.length === 0) {
                    emptyInput = $("#daysModal");
                }

                // Focus on the empty input field
                emptyInput.focus();

                // Show error toast message with red color and shield icon
                showToast(
                    "Error",
                    "Please fill in all the required fields.",
                    "error",
                    "fas fa-shield-alt"
                );

                return;
            }

            // URL validation
            const inputField = document.getElementById("modalLinkMeeting");
            const inputText = inputField.value.trim();
            // Validate URL with regex
            const urlRegex =
                /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

            if (inputText !== "" && !urlRegex.test(inputText)) {
                // Show error toast message for invalid URL with red color and shield icon
                showToast(
                    "Error",
                    "Please enter a valid URL.",
                    "error",
                    "fas fa-shield-alt"
                );

                // Focus on the input field
                inputField.focus();

                return;
            }

            $.ajax({
                url: bpath + "faculty-monitoring/add/link/meeting",
                type: "POST",
                beforeSend: function () {
                    // Before sending the AJAX request
                    btn.prop("disabled", true); // Disable the button

                    // Add loading icon
                    btn.html(
                        '<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-5 h-5"> <g fill="none" fill-rule="evenodd" stroke-width="4"> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> </g> </svg>'
                    );
                },
                data: {
                    _token: _token,
                    meeting_id: meetingID,
                    days: days,
                    title: title,
                    link: link,
                    description: description,
                    time_start: timeStart,
                    time_end: timeEnd,
                    auto_end_after: autoEndAfter,
                    sy: sy,
                    sm: sm,
                    sc: sc,
                    sec: sec,
                    scd: scd,
                    blk: blk,
                    fid: fid,
                    fc: fc,
                    pk: pk,
                },
                cache: false,
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data);
                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_update_link_meeting")
                    );
                    mdl.hide();

                    showToast(
                        "Success",
                        "Meeting data added successfully!",
                        "success",
                        "fas fa-check-circle"
                    );

                    load_subject_data_list();
                    clear_fields();
                },
                error: function (xhr, status, error) {
                    console.error(error);

                    showToast(
                        "Error",
                        "Failed to add meeting data. Please try again later.",
                        "error",
                        "fas fa-shield-alt"
                    );
                },
                complete: function () {
                    // Re-enable the button and remove loading icon
                    btn.prop("disabled", false);
                    btn.html("Save"); // Assuming the original text of the button is "Save"
                },
            });
        }
    }
);

$("body").on("click", "#add_update_link_modal_btn", function (ev) {
    ev.preventDefault();

    if (!ev.detail || ev.detail == 1) {
        if ($("#esms_faculty").val() != "") {
            $.ajax({
                url: bpath + "faculty-monitoring/add/linked",
                type: "POST",
                data: {
                    _token: _token,
                    esms_facultyList: $("#esms_faculty").val(),
                    agency_employeeList: $("#agency_employee").val(),
                },
                cache: false,
                success: function (data) {
                    var data = JSON.parse(data);

                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#lingking_agency_esms_modal")
                    );
                    mdl.hide();
                },
            });
        }
    }
});

function clear_fields() {
    // Clear meeting data fields
    days_modal.val(null).trigger("change");
    $("#modalMeetingUpdateLinkId").val("");
    $("#daysModal").val("");
    $("#modalTitleMeeting").val("");
    $("#modalLinkMeeting").val("");
    $("#modalLinkMeetingDescription").val("");
    $("#modalDateTimeStart").val("");
    $("#modalDateTimeEnd").val("");
    $("#modalEndAfterMeeting").val("");

    // Clear subject data fields
    $("#modal_subject_name").val("");
    $("#modal_subject_code").val("");
    $("#modal_type").val("");
    $("#modal_date_time").val("");
    $("#modal_status").val("");
    $("#modal_year").val("");
    $("#modal_sem").val("");
    $("#modal_Description").val("");
}

function checkClickFunc($primary_key, $link_meeting, $class_id) {
    var checkbox = document.getElementById($primary_key);
    var link_meeting = checkbox.dataset.idLnk;

    // Store the original state
    var originalState = checkbox.checked;

    var route_ = "";
    var action = checkbox.checked ? "open" : "close";

    // Flag to prevent multiple clicks
    var isActionInProgress = false;

    // Show a confirmation dialog
    Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to " + action + " the class?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false, // Prevent closing by pressing Esc key
    }).then((result) => {
        if (result.value && !isActionInProgress) {
            // User clicked "Yes" and action is not in progress
            isActionInProgress = true; // Set flag to true

            // Now proceed with your AJAX request or any other action
            $.ajax({
                url:
                    bpath +
                    "faculty-monitoring/add/class/" +
                    (checkbox.checked ? "started" : "ended"),
                type: "POST",
                data: {
                    _token: _token,
                    primary_key: $primary_key,
                    link_meeting: $link_meeting,
                    class_id: $class_id,
                    link_meeting_text: link_meeting,
                },
                cache: false,
                complete: function () {
                    // Reset flag on AJAX complete (success or failure)
                    isActionInProgress = false;
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data);
                    load_subject_data_list();
                },
                error: function () {
                    // Handle error if needed
                    // Reset flag on error
                    isActionInProgress = false;
                },
            });
        } else {
            // User clicked "No" or closed the dialog
            // Restore the original state
            if (originalState) {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }
        }
    });
}

$("body").on("input", "#modalLinkMeeting", function (event) {
    const inputValue = $(this).val().trim();
    const urlWithProtocol = addProtocol(inputValue, event);
    const modalLinkMeetingDiv = $("#modalLinkMeetingDiv"); // Convert to jQuery object

    const urlRegex =
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    if (urlRegex.test(urlWithProtocol)) {
        $(this)
            .removeClass("btn-outline-danger")
            .addClass("btn-outline-primary ");

        modalLinkMeetingDiv.removeClass("has-error"); // jQuery object

        // console.log("Valid URL");
    } else {
        $(this)
            .removeClass("btn-outline-primary ")
            .addClass("btn-outline-danger");

        modalLinkMeetingDiv.addClass("has-error");
        // console.log("Invalid URL");
    }

    // Update input field value
    $(this).val(urlWithProtocol);
});

function addProtocol(url, event) {
    // Check if the backspace key was pressed
    if (event && event.which === 8) {
        return url; // Return the original URL without modification
    }

    // Check if the URL doesn't start with https:// and is not empty after trimming
    if (!/^https?:\/\//i.test(url) && url.trim().length > 0) {
        // Add https:// to the URL
        return `https://${url}`;
    }

    // Return the original URL if it already starts with https:// or is empty after trimming
    return url;
}
