var _token = $('meta[name="csrf-token"]').attr('content');
var current_user_id = $('meta[name="current-user-id"]').attr("content");
var bpath; // Declare bpath as a global variable
// Array to store the selected days in all rows
var selectedDaysInRows = [];
var selectedTableRow = null;
var totalHours = 0;

// Variables to store filter, pagination, and page limit settings
let filterValue = "";
let currentPage = 1;
let pageSize = 10; // Default page size
let totalPages = 0;
let stat = "";
let yr = "";
let sem = "";

var wl_id = '';

$(document).ready(function () {
    bpath = __basepath + "/";
    load_linked_data_list();
    fetchDataFromServer();
    initializeSelect2ForDaysInput();
    load_dropdown_select2();
    load_sortable();
    loadTableData();
});

// Function to load linked data list
function load_linked_data_list() {
    showLoading();
    $.ajax({
        url: bpath + "faculty-monitoring/load/linked",
        type: "POST",
        data: {
            _token: _token,
            esms_faculty: $("#esms_faculty").val(),
            agency_employee: current_user_id,
        },
        success: function (data) {
            var dropdown = $("#esms-name"); // Assuming this is your dropdown

            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select Data</option>'); // Add default option

            var data = JSON.parse(data);

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var esms_faculty_id = data[i]["esms_faculty_id"];
                    var hris_agency_id = data[i]["hris_agency_id"];
                    var fullname = data[i]["fullname"];
                    var fullname_ems = data[i]["fullname_ems"];
                    var id = data[i]["id"];

                    // Add an option to the dropdown for each data item
                    dropdown.append(
                        '<option value="' + esms_faculty_id + '">' + fullname_ems + "</option>"
                    );
                }
            }

            hideLoading();
        },
    });
}

// Function to update the table and calculate totals
function updateTableAndTotals(data) {
    // Select the teaching load table body
    var tableBody = $("#teaching-load-body");
    // Initialize the total rows and credits
    var totalRows = 0;
    var totalSubjCredit = 0;
    var totalSubjFCredit = 0;

    // Clear the table body
    tableBody.empty();

    // Loop through each load_subject in the data
    data.load_subject.forEach(function (subject, index) {
        // Set the initial state for the content editable
        var editable = true;
        // Construct the new row with the subject data
        var newRow = `
            <tr>
                <td class="expand-btn cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
                    <a href="javascript:;" class="font-medium whitespace-nowrap ">
                        <i class="w-3 h-3 fas fa-chevron-right icon-change"></i>
                    </a>
                </td>
                <td>
                    <a href="javascript:;" class="font-medium whitespace-nowrap hidden id"></a>
                    <a href="javascript:;" class="font-medium whitespace-nowrap subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.subjcode || ""}</a>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.subject ? subject.subject.subjdesc || "" : ""}</div>
                </td>
                <td class="subjcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.subject ? subject.subject.subjcredit || "" : ""}</td>
                <td class="subjfcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.subject ? subject.subject.subjfcredit || "" : ""}</td>
                <td class="section ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.section || ""}</td>
                <td>
                    <button hidden class="delete-row-btn text-danger" data-id="${subject.oid || ""}" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </td>
            </tr>
            <tr class="details-row intro-x" style="display: none;">
                <td colspan="6">
                    <div class="sm:flex">
                        <div class="px-8 flex flex-col justify-center flex-1">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="clipboard" data-lucide="clipboard" class="lucide lucide-clipboard w-10 h-10 text-warning">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                                <div class="relative text-3xl font-medium mt-2 pl-4 ml-0.5 subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}> <span class="absolute text-2xl font-medium top-0 left-0 -ml-0.5"></span>${subject.subjcode || ""}</div>
                            </div>

                            <div class="mt-4 text-slate-500 mb-10 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.subject ? subject.subject.subjdesc || "" : ""}</div>
                            <div class="mt-4 text-slate-500 mb-10 hidden section ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.section ? subject.section || "" : ""}</div>

                            <div class="text-slate-500 text-xs">CLASS SIZE</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base maxstud ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${subject.maxstud || ""}
                                </div>
                                <div class="text-danger flex text-xs font-medium tooltip cursor-pointer ml-2">

                                </div>
                            </div>

                            <div class="text-slate-500 text-xs mt-5">
                                Program/Year & Section
                            </div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base">
                                    <input  class="form-control programYearSection ${editable ? "editable" : ""}" type="text" value="${subject.section || ""}" placeholder="Program/Year & Section" name="section[]" id="inputSection_${index}" ${editable ? 'contenteditable="true"' : ""}>
                                </div>

                            </div>
                            <div class="text-slate-500 text-xs mt-5">ROOM</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base">
                                    <input  class="form-control room ${editable ? "editable" : ""}" type="text" value="${subject.room || ""}" placeholder="Room" name="room[]" id="inputRoom_${index}" ${editable ? 'contenteditable="true"' : ""}>
                                </div>

                            </div>
                            <div class="text-slate-500 text-xs mt-5">Class Type</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base">
                                    <select class="w-full form-select class-type-dd" id="class-type-dd">
                                        <option value="A.1.">A.1. Regular Class (undergraduate)</option>
                                        <option value="A.2.">A.2. Special Class (undergraduate)</option>
                                        <option value="A.3.">A.3. Bridge Class, JEPP, etc.</option>
                                        <option value="A.4.">A.4. Graduate School</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div class="px-8 mt-2 flex flex-col flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                            <div class="text-slate-500 text-xs mt-5 mb-2">
                                <div class="flex items-center">
                                    <div class="">
                                        <a href="javascript:;" class="text-slate-500 text-xs">LABORATORY</a>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lab-schedules">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="lab-schedules">
                                <!-- Insert your laboratory schedule rows here -->
                            </div>
                            <div class="text-slate-500 text-xs mt-5 mb-2">
                                <div class="flex items-center">
                                    <div class="">
                                        <a href="javascript:;" class="text-slate-500 text-xs">LECTURE</a>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lec-schedules">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="lec-schedules">
                                <!-- Insert your lecture schedule rows here -->
                            </div>



                        </div>
                    </div>
                </td>
            </tr>`;

        // Append the new row to the table body
        tableBody.append(newRow);

        // Update total rows and credits
        totalRows++;
        totalSubjCredit += parseFloat(
            subject.subject ? subject.subject.subjcredit || 0 : 0
        );
        totalSubjFCredit += parseFloat(
            subject.subject ? subject.subject.subjfcredit || 0 : 0
        );

        // Initialize Select2 for the days input field
        initializeSelect2ForDaysInput(index);
        initializeTimeRangeInputs(index);

    });

    // Update the academic rank, total preparations, and credits
    if (!$("#academic-rank").val()) {
        $("#academic-rank").val(data.position);
    }

    $("#inputPreparations").val(totalRows);
    $("#inputSubjSCredit_").val(totalSubjCredit.toFixed(2));
    $("#inputSubjFCredit_").val(totalSubjFCredit.toFixed(2));

    // If no subjects are loaded, display a message
    if (data.load_subject.length === 0) {
        tableBody.append('<tr class="no-data-found"><td colspan="6" class="text-center no-data-found">No data found</td></tr>');
    }
}

// Function to handle keyup event on student_credit and faculty_credit inputs
function updateTotalCredits() {
    $("#inputSubjSCredit_").val("0.00");
    $("#inputSubjFCredit_").val("0.00");

    var totalStudentCredit = 0;
    var totalFacultyCredit = 0;

    $('input[name^="student_credit"]').each(function () {
        var value = parseFloat($(this).val()) || 0;
        totalStudentCredit += value;
    });

    $('input[name^="faculty_credit"]').each(function () {
        var value = parseFloat($(this).val()) || 0;
        totalFacultyCredit += value;
    });

    // Update the total inputs with the calculated totals
    $("#inputSubjSCredit_").val(totalStudentCredit.toFixed(2));
    $("#inputSubjFCredit_").val(totalFacultyCredit.toFixed(2));
}

// Event listeners
$("body").on("change", "#esms-name, #semester_modal, #semester-year_modal", function () {
    var selectedESMS = $("#esms-name").val();
    var selectedSemester = $("#semester_modal").val();
    var selectedSemesterYear = $("#semester-year_modal").val();
    var facultyName = $("#esms-name").find('option:selected').text();
    $("#faculty-name").val(facultyName);

    $.ajax({
        url: bpath + "faculty-portal/load-data-from-esms",
        type: "POST",
        data: {
            _token: _token,
            esms_empid: selectedESMS,
            semester: selectedSemester,
            semesterYear: selectedSemesterYear,
        },
        success: function (data) {
            updateTableAndTotals(data);
            updateSummary();
        },
        error: function (error) {
            console.error("Error:", error);
        },
    });
}
);

$("body").on("keyup", 'input[name^="student_credit"], input[name^="faculty_credit"]', function () {
    // Reset the total input values to zero
    $("#inputSubjSCredit_").val("0.00");
    $("#inputSubjFCredit_").val("0.00");
    updateTotalCredits();
}
);

$("body").on("click", "#addRowBtnA", function () {
    var tableBody = $("#teaching-load-body");
    var newIndex = tableBody.children("tr").length; // Calculate the new index

    var editable = false;
    var newRow = `
            <tr>
                <td class="expand-btn cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
                    <a href="javascript:;" class="font-medium whitespace-nowrap ">
                        <i class="w-3 h-3 fas fa-chevron-right icon-change"></i>
                    </a>
                </td>
                <td>
                    <a href="javascript:;" class="font-medium whitespace-nowrap subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>ITC 317</a>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>IT-Project Management</div>
                </td>
                <td class="subjcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>3</td>
                <td class="subjfcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>4.01</td>
                <td class="section ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>3 BSIT - A</td>
                <td>
                    <button hidden class="delete-row-btn text-danger" data-index="${newIndex}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </td>
            </tr>
            <tr class="details-row intro-x" style="display: none;">
                <td colspan="6">
                    <div class="sm:flex">
                        <div class="px-8 flex flex-col justify-center flex-1">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="clipboard" data-lucide="clipboard" class="lucide lucide-clipboard w-10 h-10 text-warning">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                                <div class="relative text-3xl font-medium mt-2 pl-4 ml-0.5 subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}> <span class="absolute text-2xl font-medium top-0 left-0 -ml-0.5"></span>ITC 317 </div>
                            </div>

                            <div class="mt-4 text-slate-500 mb-10 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>
                                IT-Project Management
                            </div>

                            <div class="text-slate-500 text-xs">CLASS SIZE</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base class_size ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>
                                    4.501
                                </div>
                                <div class="text-danger flex text-xs font-medium tooltip cursor-pointer ml-2">

                                </div>
                            </div>
                            <div class="text-slate-500 text-xs mt-5">ROOM</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base room ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>
                                    LAB 1
                                </div>
                                <div class="text-success flex text-xs font-medium tooltip cursor-pointer ml-2">

                                </div>
                            </div>
                        </div>
                        <div class="px-8 flex flex-col justify-center flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">

                            <div class="text-slate-500 text-xs mt-5 mb-2">
                                <div class="flex items-center">
                                    <div class="">
                                        <a href="javascript:;" class="text-slate-500 text-xs">LABORATORY</a>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lab-schedules">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="lab-schedules">
                                <!-- Insert your laboratory schedule rows here -->

                            </div>

                            <div class="text-slate-500 text-xs mt-5 mb-2">
                                <div class="flex items-center">
                                    <div class="">
                                        <a href="javascript:;" class="text-slate-500 text-xs">LECTURE</a>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lec-schedules">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="lec-schedules">
                                <!-- Insert your lecture schedule rows here -->
                            </div>

                        </div>
                    </div>

                </td>
            </tr>`;

    tableBody.append(newRow);
    updateTotalRows();

    // Initialize Select2 for the lab and lecture days inputs
    initializeSelect2ForDaysInput(newIndex);
    // Initialize time range inputs validation
    initializeTimeRangeInputs(newIndex);

    // Display notification message
    toastr.success("New row added successfully.");
});

// Delete row when the delete button is clicked
$("#teaching-load-body").on("click", ".delete-row-btn", function () {
    var indexToRemove = $(this).closest("tr").index(); // Get the index of the closest row to the button
    var idToDelete = $(this).data("id");

    // Remove the row from the table
    $("#teaching-load-body tr:eq(" + indexToRemove + ")")
        .next(".details-row")
        .remove(); // Remove the next details row
    $("#teaching-load-body tr:eq(" + indexToRemove + ")").remove();
    updateSummary();

    if (idToDelete) {
        // Send an AJAX request to soft delete the record
        $.ajax({
            url: bpath + "faculty-portal/work-load/teaching-load/delete/" +
                idToDelete,
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            type: "DELETE",
            success: function (response) {
                toastr.success(response.message);
                // Update the total number of rows and total credits after successful soft delete
                updateTotalRows();
                updateTotalCredits();
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to delete record: " + error);
            },
        });
    } else {
        toastr.error("Row removed successfully.");
    }
});
// Function to update the total number of rows
function updateTotalRows() {
    var totalRows = $("#teaching-load-body tr").length;
    $("#inputPreparations").val(totalRows);
}

// Add row to the Administrative Designation Table when the button is clicked
$("body").on("click", "#addRowBtnB", function () {
    // Assuming your table body has an ID 'admin-designation-body'
    var adminTableBody = $("#admin-designation-body");
    var newRow = '';

    // Fetch designations
    $.ajax({
        type: "GET",
        url: "/faculty-portal/work-load/fetch-designations",
        success: function (response) {
            // Append fetched designations to the input field
            // Add a new row to the table body
            newRow = `
                <tr>
                    <td>
                        <input hidden class="form-control" type="text" value="" name="id[]">
                        <input class="form-control designation-title" type="text" value="${response}" name="designation_title[]">
                    </td>
                    <td>
                        <input class="form-control unit_deload" type="text" value="" name="unit_deload[]">
                    </td>
                    <td>
                        <button class="text-danger delete-row-btn" data-index="${adminTableBody.children().length}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </td>
                </tr>`;
            adminTableBody.append(newRow);
        },
        error: function (error) {
            console.error("Error fetching designations: ", error);

            // Add a new row to the table body
            newRow = `
                <tr>
                    <td>
                        <input hidden class="form-control" type="text" value="" name="id[]">
                        <input class="form-control designation-title" type="text" value="" name="designation_title[]">
                    </td>
                    <td>
                        <input class="form-control unit_deload" type="text" value="" name="unit_deload[]">
                    </td>
                    <td>
                        <button class="btn text-danger delete-row-btn" data-index="${adminTableBody.children().length}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </td>
                </tr>`;
            adminTableBody.append(newRow);
        }
    });

});

// Delete row from the Administrative Designation Table when the delete button is clicked
$("#admin-designation-body").on("click", ".delete-row-btn", function () {
    var indexToRemove = $(this).data("index");
    var idToDelete = $(this).data("id");

    if (idToDelete) {
        // Send an AJAX request to soft delete the record
        $.ajax({
            url:
                bpath +
                "faculty-portal/work-load/administrative-designation/delete/" +
                idToDelete,
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            type: "DELETE",
            success: function (response) {
                // Remove the row from the UI
                $(
                    "#admin-designation-body tr:eq(" + indexToRemove + ")"
                ).remove();
                toastr.success(response.message);
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to delete record: " + error);
            },
        });
    } else {
        $("#admin-designation-body tr:eq(" + indexToRemove + ")").remove();
        toastr.error("Row removed successfully.");
    }
});

document.getElementById("addSection").addEventListener("click", function () {
    // Create a new row for the section
    var newRow = document.createElement("div");
    newRow.className = "row-container grid grid-cols-12 gap-4 gap-y-3";

    newRow.innerHTML = `
                <div class="col-span-4 mx-auto w-full">
                    <button class="text-danger" onclick="removeSection(this, 'section')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                    <label class="form-label">
                        <input style="width: 250px" class="form-control form-control-sm mt-2 title" type="text" placeholder="Title"/>
                        <input hidden class="form-control id" type="text"/>
                    </label>
                </div>
                <div class="col-span-4 mx-auto w-full">
                    <input class="form-control form-control-sm mt-2" type="text" placeholder="Time" />
                </div>
                <div class="col-span-4 mx-auto w-full">
                    <input class="form-control form-control-sm mt-2" type="text" placeholder="Day" />
                </div>
            `;

    // Append the new row to the container
    document.querySelector("#others_").appendChild(newRow);
});

document.getElementById("addSectionSummary").addEventListener("click", function () {
    // Create a new row for the section
    var newRow = document.createElement("div");
    newRow.className = "row-container grid grid-cols-12 gap-4 gap-y-3";

    newRow.innerHTML = `
            <div class="col-span-6">
                <button class="text-danger" onclick="removeSection(this, 'sectionSummary')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
                <label class="form-label">
                    <input hidden class="form-control id" type="text" value="" placeholder="id" />
                    <input class="form-control designationInput" type="text" value="" placeholder="Title" />
                </label>
            </div>
            <div class="col-span-6">
                <label class="form-label">
                    <input class="form-control designationHoursInput" type="text" value="" placeholder="Enter hours" />
                </label>
            </div>
        `;

    // Append the new row to the container
    document.querySelector("#summarySections").appendChild(newRow);
});

function removeSection(button, sectionType) {
    var idToDelete = $(button).data("id");
    var row = $(button).closest(".row-container");

    if (idToDelete) {
        // Send an AJAX request to soft delete the section
        $.ajax({
            url:
                bpath +
                "faculty-portal/work-load/section-otherSection/delete/" +
                idToDelete,
            type: "DELETE",
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            data: { sectionType: sectionType }, // Pass section type as data
            success: function (response) {
                // Remove the row from the UI
                row.remove();
                toastr.success(response.message);
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to delete section: " + error);
            },
        });
    } else {
        // If there's no ID, simply remove the row from the UI
        row.remove();
    }
}

$("body").on("click", "#saveWorkLoad", function () {
    // Validate input fields before collecting data
    if (!validateInputFields()) {
        // If validation fails, return without further processing
        toastr.error("Please fill all required fields.");
        return;
    }
    // Check if the teaching-load-body has any rows excluding those with colspan="6"
    var totalValidRows = $("#teaching-load-body tr").not('.no-data-found').length;
    var teachingLoadParent = $(".div-teaching-load-body");

    if (totalValidRows === 0) {
        // If there are no valid rows or "No data found" row exists, indicate invalidity
        isValid = false;
        teachingLoadParent.addClass('border-danger');
        return;
    } else {
        // If there are valid rows and no "No data found" row, remove border danger
        teachingLoadParent.removeClass('border-danger');
    }

    // Disable the button and show loading icon
    $(this).prop("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');

    // Collect data from the modal when the "Save" button is clicked
    var modalData = collectDataFromModal();
    console.log(modalData);

    // Make an AJAX request to send the data to the server
    $.ajax({
        url: "/faculty-portal/save-work-load",
        type: "POST", // Use 'POST' method to send data
        contentType: "application/json", // Set content type to JSON
        data: JSON.stringify({
            _token: _token,
            modalData: modalData,
        }),
        success: function (response) {
            // Enable the button and reset its text
            $("#saveWorkLoad").prop("disabled", false).html("Save");

            fetchDataFromServer();

            // Open the modal
            const newWorkloadModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#new_workload_modal"));
            newWorkloadModal.hide();
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error("Error sending data:", error);

            // Enable the button and reset its text
            $("#saveWorkLoad").prop("disabled", false).html("Save");
        },
    });
});

// Function to validate input fields
function validateInputFields() {
    var isValid = true;

    // Validate and collect dropdown selections
    var esmsName = document.getElementById("esms-name");
    var semesterModal = document.getElementById("semester_modal");
    var semesterYearModal = document.getElementById("semester-year_modal");

    if (esmsName.value === "") {
        addBorderDanger(esmsName);
        if (isValid) {
            esmsName.focus();
        }
        isValid = false;
    } else {
        removeBorderDanger(esmsName);
    }

    if (semesterModal.value === "") {
        addBorderDanger(semesterModal);
        if (isValid) {
            semesterModal.focus();
        }
        isValid = false;
    } else {
        removeBorderDanger(semesterModal);
    }

    if (semesterYearModal.value === "") {
        addBorderDanger(semesterYearModal);
        if (isValid) {
            semesterYearModal.focus();
        }
        isValid = false;
    } else {
        removeBorderDanger(semesterYearModal);
    }

    // Validate other input fields
    var fieldsToValidate = [
        { id: "faculty-name", name: "facultyName" },
        { id: "academic-rank", name: "academicRank" },
        { id: "institute", name: "institute" },
        { id: "specialization", name: "specialization" },
        { id: "department", name: "department" },
        { id: "description", name: "description" },
        { id: "inputPreparations", name: "numberPreparation" },
        { id: "inputSubjSCredit_", name: "subjSCredit_" },
        { id: "inputSubjFCredit_", name: "subjFCredit_" },
        { id: "inputTotalLectureHours", name: "totalLectureHours" },
        { id: "inputTotalLaboratoryHours", name: "totalLaboratoryHours" }
    ];

    fieldsToValidate.forEach(function (field) {
        var inputField = document.getElementById(field.id);
        var fieldValue = inputField.value.trim();
        if (fieldValue === "") {
            addBorderDanger(inputField);
            if (isValid) {
                inputField.focus();
            }
            isValid = false;
        } else {
            removeBorderDanger(inputField);
        }
    });

    return isValid;
}


// Helper function to add border danger class to an element
function addBorderDanger(element) {
    element.classList.add('border-danger');
}

// Helper function to remove border danger class from an element
function removeBorderDanger(element) {
    element.classList.remove('border-danger');
}


// Function to validate input fields
function validateInputFields() {
    var isValid = true;

    // Validate and collect dropdown selections
    var esmsName = document.getElementById("esms-name");
    var semesterModal = document.getElementById("semester_modal");
    var semesterYearModal = document.getElementById("semester-year_modal");

    if (esmsName.value === "") {
        addBorderDanger(esmsName);
        isValid = false;
    } else {
        removeBorderDanger(esmsName);
    }

    if (semesterModal.value === "") {
        addBorderDanger(semesterModal);
        isValid = false;
    } else {
        removeBorderDanger(semesterModal);
    }

    if (semesterYearModal.value === "") {
        addBorderDanger(semesterYearModal);
        isValid = false;
    } else {
        removeBorderDanger(semesterYearModal);
    }

    // Validate other input fields
    var fieldsToValidate = [
        { id: "faculty-name", name: "facultyName" },
        { id: "academic-rank", name: "academicRank" },
        { id: "institute", name: "institute" },
        { id: "specialization", name: "specialization" },
        { id: "department", name: "department" },
        { id: "description", name: "description" },
        { id: "inputPreparations", name: "numberPreparation" },
        { id: "inputSubjSCredit_", name: "subjSCredit_" },
        { id: "inputSubjFCredit_", name: "subjFCredit_" },
        { id: "inputTotalLectureHours", name: "totalLectureHours" },
        { id: "inputTotalLaboratoryHours", name: "totalLaboratoryHours" }
    ];

    fieldsToValidate.forEach(function (field) {
        var fieldValue = document.getElementById(field.id).value.trim();
        if (fieldValue === "") {
            addBorderDanger(document.getElementById(field.id));
            isValid = false;
        } else {
            removeBorderDanger(document.getElementById(field.id));
        }
    });

    return isValid;
}

// Function to collect data from the modal
function collectDataFromModal() {
    var data = {};

    // Collect faculty information
    data.esmsNameText = document.getElementById("esms-name").options[document.getElementById("esms-name").selectedIndex].text;
    data.esmsNameValue = document.getElementById("esms-name").value;
    data.semesterText = document.getElementById("semester_modal").options[document.getElementById("semester_modal").selectedIndex].text;
    data.semesterValue = document.getElementById("semester_modal").value;
    data.semesterYearText = document.getElementById("semester-year_modal").options[document.getElementById("semester-year_modal").selectedIndex].text;
    data.semesterYearValue = document.getElementById("semester-year_modal").value;
    data.id = document.getElementById("workload_id").value;
    data.facultyName = document.getElementById("faculty-name").value;
    data.academicRank = document.getElementById("academic-rank").value;
    data.institute = document.getElementById("institute").value;
    data.specialization = document.getElementById("specialization").value;
    data.department = document.getElementById("department").value;
    data.description = document.getElementById("description").value;

    data.numberPreparation = document.getElementById("inputPreparations").value;

    data.subjSCredit_ = document.getElementById("inputSubjSCredit_").value;
    data.subjFCredit_ = document.getElementById("inputSubjFCredit_").value;
    data.totalLectureHours = document.getElementById("inputTotalLectureHours").value;
    data.totalLaboratoryHours = document.getElementById("inputTotalLaboratoryHours").value;

    data.totalStudFacul = document.getElementById("total-stud-facul").textContent.trim();
    data.summaryTotal = document.getElementById("summary-total").textContent.trim();



    // Collect data from the teaching load table
    data.teachingLoad = [];
    var mainRows = document.querySelectorAll("#teaching-load-body tr");
    mainRows.forEach(function (mainRow) {
        // Check if the row is not a details row
        if (!mainRow.classList.contains('details-row')) {
            var mainRowData = {
                id: mainRow.querySelector('.id').textContent.trim(),
                courseNo: mainRow.querySelector('.subjcode').textContent.trim(),
                courseDescription: mainRow.querySelector('.subjdesc').textContent.trim(),
                studentCredit: mainRow.querySelector('.subjcredit').textContent.trim(),
                facultyCredit: mainRow.querySelector('.subjfcredit').textContent.trim(),
                section: mainRow.querySelector('.section').textContent.trim(),
                // Add other fields as needed
            };

            // Look for the details row within the main row
            var detailsRow = mainRow.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('details-row')) {
                var detailsRowData = {
                    classSize: detailsRow.querySelector('.maxstud').textContent.trim(),
                    programYearSection: detailsRow.querySelector('.programYearSection').value,
                    room: detailsRow.querySelector('.room').value,
                    classType: detailsRow.querySelector('.class-type-dd').value,
                    // Add other fields as needed
                };

                // Collect schedule data
                var schedules = [];
                var scheduleItems = detailsRow.querySelectorAll('.item-schedule');
                scheduleItems.forEach(function (scheduleItem) {
                    var days = scheduleItem.querySelector(".schedule-days").textContent.trim();
                    var time = scheduleItem.querySelector(".schedule-time-start-end").textContent.trim();
                    var room_id = scheduleItem.querySelector(".room-id").textContent.trim(); // Change this line
                    var operator = scheduleItem.querySelector(".schedule-operator").textContent.trim();
                    var id = scheduleItem.querySelector(".id").textContent.trim();

                    var schedule = {
                        id: id,
                        days: days,
                        time: time,
                        room_id: room_id, // Change this line
                        operator: operator,
                        type: scheduleItem.dataset.type, // Get the schedule type from the data-type attribute
                        // Add other fields as needed
                    };
                    schedules.push(schedule);
                });

                // Add schedules to details row data
                detailsRowData.schedules = schedules;

                // Merge details row data with main row data
                Object.assign(mainRowData, detailsRowData);
            }

            // Push main row data to teaching load array
            data.teachingLoad.push(mainRowData);
        }
    });


    // Collect data from the administrative designation table
    data.adminDesignation = [];
    var adminDesignationRows = document.querySelectorAll(
        "#admin-designation-body tr"
    );
    adminDesignationRows.forEach(function (row) {
        var idInput = row.querySelector('input[name="id[]"]');
        var titleInput = row.querySelector('input[name="designation_title[]"]');
        var unitDeloadInput = row.querySelector('input[name="unit_deload[]"]');

        if (titleInput && unitDeloadInput) {
            var rowData = {
                id: idInput.value,
                titleOfDesignation: titleInput.value,
                unitDeload: unitDeloadInput.value,
                // Add other fields as needed
            };
            data.adminDesignation.push(rowData);
        }
    });

    // Collect data from the sections inside #others_ div
    data.othersSections = [];
    var otherContainers = document.querySelectorAll("#others_ .other-container");

    otherContainers.forEach(function (container) {
        var title = container.querySelector("a").textContent.trim();
        var id = container.querySelector(".id").textContent.trim();
        var schedules = [];
        var scheduleType = container.querySelector(".add-schedule-btn").getAttribute("data-target");

        var scheduleItems = container.querySelectorAll("." + scheduleType + " .item-schedule");

        scheduleItems.forEach(function (scheduleItem) {
            var days = scheduleItem.querySelector(".schedule-days").textContent.trim();
            var time = scheduleItem.querySelector(".schedule-time-start-end").textContent.trim();
            var room_id = scheduleItem.querySelector(".room-id").textContent.trim(); // Change this line
            var operator = scheduleItem.querySelector(".schedule-operator").textContent.trim();
            var id = scheduleItem.querySelector(".id").textContent.trim();

            var schedule = {
                id: id,
                days: days,
                time: time,
                room_id: room_id, // Change this line
                operator: operator,
                type: scheduleItem.dataset.type, // Get the schedule type from the data-type attribute
            };

            schedules.push(schedule);
        });

        var sectionData = {
            id: id,
            title: title,
            type: scheduleType,
            schedules: schedules
        };

        data.othersSections.push(sectionData);
    });


    // Collect data from the sections inside #summarySections div
    data.summarySections = [];
    $("#summarySections > .row-container").each(function () {
        var section = $(this);
        var id = section.find(".id").text().trim(); // Get the title
        var title = section.find(".title").text().trim(); // Get the title
        var hours = section.find(".hours").last().text().trim(); // Get the hours
        data.summarySections.push({
            id: id,
            title: title,
            hours: hours
        });
    });

    return data;
}

// Function to fetch data from the server with filtering, pagination, and page limit
function fetchDataFromServer() {
    $.ajax({
        url: "/faculty-portal/workload-data", // Replace this with your actual route name
        type: "GET",
        data: {
            filter: filterValue,
            page: currentPage,
            limit: pageSize,
            stat: stat,
            yr: yr,
            sem: sem,
        },
        beforeSend: function () {
            // Clear existing table rows
            $("#data-table tbody").empty();
            $("#data-table tbody").append(`
                        <tr>
                            <td colspan="8" class="text-center">
                                <div class="flex justify-center items-center">
                                    <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                        <g fill="none" fill-rule="evenodd">
                                            <g transform="translate(1 1)" stroke-width="4">
                                                <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                                </path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    `);
        },
        success: function (response) {
            // Response contains the data retrieved from the server
            if (response.data && response.data.length > 0) {
                updateTable(response.data);
            } else {
                $("#data-table tbody").empty();
                $("#data-table tbody").append(`
                            <tr>
                                <td colspan="8" class="text-center">
                                    No data found!
                                </td>
                            </tr>
                        `);
            }
            updatePager(response); // Pass the entire response object
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
            $("#data-table tbody").empty();
            $("#data-table tbody").append(`
                        <tr>
                            <td colspan="8" class="text-center">
                                Something went wrong!
                            </td>
                        </tr>
                    `);
        },
    });
}

// Function to update the table with the fetched data
function updateTable(data) {
    // Clear existing table rows
    $("#data-table tbody").empty();
    // Loop through the data and append rows to the table
    data.forEach(function (item, index) {
        // Append row to the table
        $("#data-table tbody").append(`
            <tr>
                <td class="w-10">
                    <input class="form-check-input" type="checkbox">
                </td>
                <td class="w-40">
                    <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">
                        ${item.esms_id}
                    </a>
                </td>
                <td class="w-40">
                    <a href="javascript:;" class="font-medium whitespace-nowrap">
                        ${item.specialization}
                    </a>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        ${item.department}
                    </div>
                </td>
                <td class="text-center">
                    <a href="javascript:;" class="font-medium whitespace-nowrap">
                        ${item.academic_rank}
                    </a>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        ${item.institute}
                    </div>
                </td>
                <td>
                    <a href="javascript:;" class="font-medium whitespace-nowrap">
                        ${item.semester_year}
                    </a>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        ${item.semester}
                    </div>
                </td>
                <td class="text-right">
                    ${item.faculty_name}
                </td>
                <td class="text-center">
                    ${item.status == 1 ? `<a href="javascript:;" class="status-link bg-pending/10 text-pending rounded px-1 py-1" onclick="getSignatoryStatus(${item.id})">Pending</a>` : ''}
                    ${item.status == 15 ? `<a href="javascript:;" class="status-link bg-primary/10 text-primary rounded px-1 py-1" onclick="getSignatoryStatus(${item.id})">Ongoing</a>` : ''}
                    ${item.status == 11 ? `<a href="javascript:;" class="status-link bg-success/20 text-success rounded px-1 py-1" onclick="getSignatoryStatus(${item.id})">Approved</a>` : ''}
                    ${item.status == 12 ? `<a href="javascript:;" class="status-link bg-danger/20 text-danger rounded px-1 py-1" onclick="getSignatoryStatus(${item.id})">Disapproved</a>` : ''}
                </td>
                <td>
                    <div class="flex justify-center items-center">
                    ${(item.status == 1 || item.status == 12) ? `
                        <a href="javascript:;" class="view-details-btn flex items-center text-primary whitespace-nowrap mr-5" data-id="${item.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                            Edit
                        </a>
                    ` : ''}
                    ${(item.status == 1) ? `
                        <a href="javascript:;" class=" table-release-btn flex items-center text-primary whitespace-nowrap mr-5" data-id="${item.id}" data-tw-toggle="modal" data-tw-target="#release-signatories-modal-preview">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-left-right" data-lucide="arrow-left-right" class="lucide lucide-arrow-left-right w-4 h-4 mr-1"><polyline points="17 11 21 7 17 3"></polyline><line x1="21" y1="7" x2="9" y2="7"></line><polyline points="7 21 3 17 7 13"></polyline><line x1="15" y1="17" x2="3" y2="17"></line></svg>
                            Release
                        </a>
                    ` : ''}
                        <div class="dropdown wl-options opacity-0 bg-primary/10 text-primary rounded-full px-1 py-1">
                            <a class="dropdown-toggle w-5 h-5 block" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="more-vertical" data-lucide="more-vertical" class="lucide lucide-more-vertical w-5 h-5 text-slate-500 text-primary"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </a>
                            <div class="dropdown-menu w-40">
                                <ul class="dropdown-content">
                                    <li>
                                        <a href="print/wl/${item.id}/vw" target="blank" class="dropdown-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="printer" data-lucide="printer" class="lucide lucide-printer w-4 h-4 mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                            Print
                                        </a>
                                    </li>
                                    ${item.status == 1 ? `
                                        <li>
                                            <a href="javascript:;" class="dropdown-item delete-btn" data-id="${item.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                Delete
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:;" class="dropdown-item change-status-btn" data-id="${item.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-left-right" data-lucide="arrow-left-right" class="lucide lucide-arrow-left-right w-4 h-4 mr-2"><polyline points="17 11 21 7 17 3"></polyline><line x1="21" y1="7" x2="9" y2="7"></line><polyline points="7 21 3 17 7 13"></polyline><line x1="15" y1="17" x2="3" y2="17"></line></svg>                                                Change Status
                                            </a>
                                        </li>
                                    ` : ''}
                                </ul>
                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        `);
    });
}

function getSignatoryStatus(workloadId) {
    // Append a card with "No data found" message
    var noDataCard = `
                <div class="intro-y box p-5 text-center">
                    <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8 text-center">
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
                </div>
            `;
    $('.signatory-history__box').append(noDataCard);
    $('.signatory-persons__box').append(noDataCard);

    // Open the modal
    const releaseModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#signatories-modal-preview"));
    releaseModal.show();

    // Perform AJAX request to retrieve the status of the workload
    $.ajax({
        url: bpath + "faculty-portal/work-load/details/" + workloadId, // Adjust the URL to your endpoint
        type: 'GET',
        data: { id: workloadId }, // Pass the workload ID as a parameter
        success: function (response) {
            // Assuming the response contains the status data
            appendSignatoryHistory(response);
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('Error:', error);
        }
    });
}

function appendSignatoryHistory(data) {
    var allHistoryEntries = []; // Array to collect all history entries
    var signatoryPersonsHTML = ``;

    if (data.get_signatories.length === 0) {
        $('.signatory-persons__box').empty();
        $('.signatory-history__box').empty();
        // Append a card with "No data found" message
        var noDataCard = `
            <div class="intro-y box p-5 text-center">
                No data found
            </div>
        `;
        $('.signatory-history__box').append(noDataCard);
        $('.signatory-persons__box').append(noDataCard);
        return; // Exit the function early
    }

    // Iterate over each signatory
    data.get_signatories.forEach(function (signatory) {
        // Access the signatory history for each signatory
        var signatoryHistory = signatory.get_signatory_history;

        // Iterate over each entry in the signatory history and push it into the allHistoryEntries array
        signatoryHistory.forEach(function (history) {
            allHistoryEntries.push({
                name: signatory.name, // Store the name
                history: history // Store the history entry
            });
        });
        // Calculate the time difference using Moment.js
        var timeDifference = moment(signatory.updated_at).fromNow();
        signatoryPersonsHTML += `
            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-4 zoom-in" data-id="${signatory.id}">
                <div class="ml-2 overflow-hidden w-full">
                    <div class="flex items-center">
                        <div class="font-medium">${signatory.name}</div>
                        <div class="text-xs text-slate-500 ml-auto">${timeDifference}</div>
                    </div>
                    <div class="w-full truncate text-slate-500 mt-0.5">${signatory.description}</div>
                </div>
        `;

        // Determine the status text and color
        var statusText = '';
        var statusColor = '';
        if (signatory.approved == 0) {
            statusText = 'Pending';
            statusColor = 'bg-pending/10 text-pending';
        } else if (signatory.approved == 1) {
            statusText = 'Approved';
            statusColor = 'bg-success/20 text-success';
        } else if (signatory.approved == 2) {
            statusText = 'Disapproved';
            statusColor = 'bg-danger/20 text-danger';
        } else {
            statusText = 'Rated';
            statusColor = 'bg-primary/10 text-primary';
        }

        // Append status HTML
        signatoryPersonsHTML += `
            <div class="flex items-center justify-center absolute top-0 right-0 text-xs rounded ${statusColor} font-medium -mt-1 -mr-1 px-1 py-1">${statusText}</div>
        </div>`;
    });

    $('.signatory-persons__box').empty();
    $('.signatory-persons__box').append(signatoryPersonsHTML);

    // Sort the combined history entries based on the 'created_at' timestamp in descending order
    allHistoryEntries.sort(function (a, b) {
        return new Date(b.history.created_at) - new Date(a.history.created_at);
    });

    if (allHistoryEntries.length === 0) {
        $('.signatory-history__box').empty();
        // Append a card with "No data found" message
        var noDataCard = `
            <div class="intro-y box p-5 text-center">
                No data found
            </div>
        `;
        $('.signatory-history__box').append(noDataCard);
        return; // Exit the function early
    }

    // Generate HTML for all history entries
    var signatoryHistoryHTML = `
        <div class="signatory-history__box mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
    `;

    allHistoryEntries.forEach(function (entry) {
        var history = entry.history;
        var name = entry.name;

        // Determine the icon based on the action
        var icon = '';
        if (history.action === '0') {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit block mx-auto text-primary"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'; // Icon for approval
        } else if (history.action === '1') {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="thumbs-up" data-lucide="thumbs-up" class="lucide lucide-thumbs-up block mx-auto text-success"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path></svg>'; // Icon for disapproval
        } else if (history.action === '2') {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="thumbs-down" data-lucide="thumbs-down" class="lucide lucide-thumbs-down block mx-auto text-danger"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"></path></svg>'; // Icon for other actions
        } else {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bookmark" data-lucide="bookmark" class="lucide lucide-bookmark block mx-auto text-warning"><path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z"></path></svg>'; // Icon for other actions
        }

        // Calculate the time difference using Moment.js
        var timeDifference = moment(history.updated_at).fromNow();

        // Generate HTML for each history entry
        var historyEntryHTML = `
            <div class="intro-x relative flex items-center mb-3">
                <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                    <div class="w-10 h-10 flex-none rounded-full overflow-hidden">
                        ${icon} <!-- Insert the icon here -->
                    </div>
                </div>
                <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                    <div class="flex items-center">
                        <div class="font-medium">${name}</div>
                        <div class="text-xs text-slate-500 ml-auto">${timeDifference}</div> <!-- Display time difference here -->
                    </div>
                    <div class="text-slate-500 mt-1">${history.note}</div>
                </div>
            </div>
        `;

        // Append the generated HTML to the overall signatory history HTML
        signatoryHistoryHTML += historyEntryHTML;
    });

    signatoryHistoryHTML += `</div>`;

    $('.signatory-history__box').empty();
    // Append the signatory history HTML to the designated element
    $('.signatory-history__box').append(signatoryHistoryHTML);
}

// Function to update the pager with pagination information
function updatePager(response) {
    currentPage = response.current_page;
    pageSize = response.per_page;
    totalPages = response.total_pages;

    // Select the pagination ul element
    let paginationElement = $(".pagination");

    // Clear the existing pagination HTML
    paginationElement.empty();

    // Add "First" page link
    paginationElement.append(`
                <li class="page-item ${currentPage === 1 ? "hidden" : ""}">
                    <a class="page-link" href="#" data-page="1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                    </a>
                </li>
            `);

    // Add "Previous" page link
    paginationElement.append(`
                <li class="page-item ${currentPage === 1 ? "hidden" : ""}">
                    <a class="page-link" href="#" data-page="${currentPage - 1
        }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </a>
                </li>
            `);

    // Add ellipsis before the first page link if there are more than 3 pages
    if (totalPages > 3 && currentPage > 2) {
        paginationElement.append(`
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                `);
    }

    // Add individual page links (showing 3 pages at a time)
    for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages);
        i++
    ) {
        paginationElement.append(`
                    <li class="page-item ${i === currentPage ? "active" : ""}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `);
    }

    // Add ellipsis after the last page link if there are more than 3 pages
    if (totalPages > 3 && currentPage < totalPages - 1) {
        paginationElement.append(`
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                `);
    }

    // Add "Next" page link
    paginationElement.append(`
                <li class="page-item ${currentPage === totalPages ? "hidden" : ""
        }">
                    <a class="page-link" href="#" data-page="${currentPage + 1
        }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                </li>
            `);

    // Add "Last" page link
    paginationElement.append(`
                <li class="page-item ${currentPage === totalPages ? "hidden" : ""
        }">
                    <a class="page-link" href="#" data-page="${totalPages}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                    </a>
                </li>
            `);
}

// Function to handle filter change event
$("#search-subject-input").on("input", function () {
    filterValue = $(this).val();
    fetchDataFromServer();
});

// Event listener for pagination links
$(".pagination").on("click", "a.page-link", function (e) {
    e.preventDefault();
    let page = $(this).data("page");
    currentPage = page;
    fetchDataFromServer();
});

// Function to handle page limit change event
$("#page-size-select").on("change", function () {
    pageSize = parseInt($(this).val());
    currentPage = 1; // Reset current page to 1 when page limit changes
    fetchDataFromServer();
});

$("#status-select").on("change", function () {
    stat = $(this).val();
    currentPage = 1;
    fetchDataFromServer();
});

$("#school-year-select").on("change", function () {
    yr = $(this).val();
    currentPage = 1;
    fetchDataFromServer();
});

$("#semester-select").on("change", function () {
    sem = $(this).val();
    currentPage = 1;
    fetchDataFromServer();
});

// Event listener for the "View Details" button
$("body").on("click", ".view-details-btn", function () {
    // Open the modal
    const newWorkloadModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#new_workload_modal"));
    newWorkloadModal.show();

    // Get the ID associated with the button
    var id = $(this).data("id");

    // Perform an AJAX request to fetch details based on the ID
    $.ajax({
        url: bpath + "faculty-portal/work-load/details/" + id, // Adjust the URL to your endpoint
        type: "GET",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        success: function (response) {
            // Append the data to the modal
            populateModal(response);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching details:", error);
        },
    });
});

// Event listener for the "Change Status" button
$("body").on("click", ".change-status-btn", function () {
    // Get the ID associated with the button
    var id = $(this).data("id");

    if (id) {
        // Perform an AJAX request to change the status based on the ID
        $.ajax({
            url: bpath + "faculty-portal/work-load/change-status/" + id, // Adjust the URL to your endpoint
            type: "PUT", // or 'POST' depending on your API
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            success: function (response) {
                // Handle success
            },
            error: function (xhr, status, error) {
                console.error("Error changing status:", error);
            },
        });
    }

});

// Event listener for the "Delete" button
$("body").on("click", ".delete-btn", function () {
    // Get the ID associated with the button
    var id = $(this).data("id");

    // Store the reference to the button element
    var deleteButton = $(this);

    // Display a SweetAlert confirmation dialog
    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this item!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: "Delete",
    }).then((result) => {
        if (result.value) {
            // Perform an AJAX request to delete the item based on the ID
            $.ajax({
                url: bpath + "faculty-portal/work-load/delete/" + id,
                type: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": _token, // Include CSRF token in headers
                },
                success: function (response) {
                    // Handle success
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your item has been deleted.",
                        type: "success",
                        confirmButtonColor: "#1e40af",
                    });
                    fetchDataFromServer();
                    // Remove the parent <tr> element
                    deleteButton.closest("tr").remove();
                },
                error: function (xhr, status, error) {
                    // Handle error
                    Swal.fire({
                        title: "Error",
                        text: "Error deleting item: " + error,
                        type: "error",
                        confirmButtonColor: "#1e40af",
                    });
                    console.error("Error deleting item:", error);
                },
            });
        }
    });
});

function populateModal(data) {
    console.log(data);
    // Assuming you have elements with specific IDs in your modal to display the data
    // Fill Faculty Information Section
    $("#esms-name").val(data.esms_id);
    $("#semester_modal").val(data.semester);
    $("#semester-year_modal").val(data.semester_year);
    $("#workload_id").val(data.id);
    $("#faculty-name").val(data.faculty_name);
    $("#academic-rank").val(data.academic_rank);
    $("#institute").val(data.institute);
    $("#specialization").val(data.specialization);
    $("#department").val(data.department);

    // Populate teaching loads
    var teachingLoads = data.teaching_loads;
    var teachingLoadTableBody = $("#teaching-load-body");
    teachingLoadTableBody.empty(); // Clear previous data

    var totalRows = 0;
    var totalSubjCredit = 0;
    var totalSubjFCredit = 0;

    teachingLoads.forEach(function (load, index) {
        var editable = true;

        var newRow = `
        <tr>
            <td class="expand-btn cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
                <a href="javascript:;" class="font-medium whitespace-nowrap ">
                    <i class="w-3 h-3 fas fa-chevron-right icon-change"></i>
                </a>
            </td>
            <td>
            <a href="javascript:;" class="font-medium whitespace-nowrap hidden id">${load.id}</a>
                <a href="javascript:;" class="font-medium whitespace-nowrap subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.course_no}</a>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.course_description}</div>
            </td>
            <td>
                <span class="editable-student-credit subjcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.student_credit}</span>
            </td>
            <td>
                <span class="editable-faculty-credit subjfcredit ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.faculty_credit}</span>
            </td>
            <td>
                <span class="editable-program-year-section section ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.section}</span>
            </td>
            <td>
                <button hidden class="delete-row-btn text-danger" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </td>
        </tr>
        <tr class="details-row intro-x" style="display: none;">
            <td colspan="6">
                <div class="sm:flex">
                    <div class="px-8 flex flex-col justify-center flex-1">
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="clipboard" data-lucide="clipboard" class="lucide lucide-clipboard w-10 h-10 text-warning">
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                            </svg>
                            <div class="relative text-3xl font-medium mt-2 pl-4 ml-0.5 subjcode ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}><span class="absolute text-2xl font-medium top-0 left-0 -ml-0.5"></span> ${load.course_no}</div>
                        </div>

                        <div class="mt-4 text-slate-500 mb-10 subjdesc ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.course_description}</div>
                        <div class="mt-4 text-slate-500 mb-10 hidden section ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}>${load.section}</div>

                        <div class="text-slate-500 text-xs">CLASS SIZE</div>
                        <div class="mt-1.5 flex items-center">
                            <div class="text-base maxstud ${editable ? "editable" : ""}" ${editable ? 'contenteditable="true"' : ""}">
                                ${load.class_size}
                            </div>
                            <div class="text-danger flex text-xs font-medium tooltip cursor-pointer ml-2">
                            </div>
                        </div>
                        <div class="text-slate-500 text-xs mt-5">Program/Year & Section</div>
                            <div class="mt-1.5 flex items-center">
                                <div class="text-base">
                                    <input  class="form-control programYearSection ${editable ? "editable" : ""}" type="text" value="${load.program_year_section || ""}" placeholder="Program/Year & Section" name="section[]" id="inputSection_${load.id}" ${editable ? 'contenteditable="true"' : ""}>
                                </div>
                            </div>
                        <div class="text-slate-500 text-xs mt-5">ROOM</div>
                        <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                                <input  class="form-control room ${editable ? "editable" : ""}" type="text" value="${load.room || ""}" placeholder="Room" name="room[]" id="inputRoom_${load.id}" ${editable ? 'contenteditable="true"' : ""}>
                            </div>
                            <div class="text-success flex text-xs font-medium tooltip cursor-pointer ml-2">
                            </div>
                        </div>

                        <div class="text-slate-500 text-xs mt-5">Class Type</div>
                        <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                                <select class="w-full form-select class-type-dd" id="class-type-dd">
                                    <option value="A.1.">A.1. Regular Class (undergraduate)</option>
                                    <option value="A.2.">A.2. Special Class (undergraduate)</option>
                                    <option value="A.3.">A.3. Bridge Class, JEPP, etc.</option>
                                    <option value="A.4.">A.4. Graduate School</option>
                                </select>
                            </div>
                            <div class="text-success flex text-xs font-medium tooltip cursor-pointer ml-2">
                            </div>
                        </div>
                    </div>
                    <div class="px-8 flex flex-col justify-center flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                        <div class="text-slate-500 text-xs mt-5 mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs">LABORATORY</a>
                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lab-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="lab-schedules">
                            <!-- Loop through lab schedules and create rows -->
                            ${load.lab_schedules.map(function (schedule) {
                                const operatorSymbolColor = schedule.operator === "∧" ? "success" : ""
                                return `
                                <div class="flex items-center mt-5 transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md item-schedule" data-index="${schedule.id}" data-type="${schedule.type}">
                                    <div class="border-l-2 border-primary dark:border-primary pl-4">
                                        <a href="javascript:;" class="font-medium flex update-schedule">
                                            <div class="schedule-operator text-slate-500 mr-2 text-${operatorSymbolColor}">${schedule.operator}</div>
                                            <div class="schedule-days">${schedule.days}</div>
                                            <div class="id hidden">${schedule.id}</div>
                                            <div class="room-id hidden">${schedule.room_id}</div>
                                            <button class="mr-1 update-schedule">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit w-4 h-4 text-slate-500 ml-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                        </a>
                                        <div class="text-slate-500 schedule-time-start-end">${schedule.time_start} - ${schedule.time_end}</div>
                                        <div class="text-slate-500 schedule-room">(${schedule.room.building})${schedule.room.room_name}</div>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="text-danger mr-1 remove-schedule">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>

                        <div class="text-slate-500 text-xs mt-5 mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs">LECTURE</a>
                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="lec-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="lec-schedules">
                            ${load.lec_schedules.map(function (schedule) {
                                const operatorSymbolColor = schedule.operator === "∧" ? "success" : ""
                                return `
                                <div class="flex items-center mt-5 transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md item-schedule" data-index="${schedule.id}" data-type="${schedule.type}">
                                    <div class="border-l-2 border-primary dark:border-primary pl-4">
                                        <a href="javascript:;" class="font-medium flex update-schedule">
                                            <div class="schedule-operator text-slate-500 mr-2 text-${operatorSymbolColor}">${schedule.operator}</div>
                                            <div class="schedule-days">${schedule.days}</div>
                                            <div class="id hidden">${schedule.id}</div>
                                            <div class="room-id hidden">${schedule.room_id}</div>
                                            <button class="mr-1 update-schedule">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit w-4 h-4 text-slate-500 ml-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                        </a>
                                        <div class="text-slate-500 schedule-time-start-end">${schedule.time_start} - ${schedule.time_end}</div>
                                        <div class="text-slate-500 schedule-room">(${schedule.room.building})${schedule.room.room_name}</div>
                                    </div>
                                    <div class="form-check form-switch ml-auto">
                                        <button class="text-danger mr-1 remove-schedule">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            `;
                            }).join('')}

                        </div>


                    </div>
                </div>
            </td>
        </tr>`;

        teachingLoadTableBody.append(newRow);

        // Update total rows and credits
        totalRows++;
        totalSubjCredit += parseFloat(load ? load.student_credit || 0 : 0);
        totalSubjFCredit += parseFloat(load ? load.faculty_credit || 0 : 0);
    });
    $("#inputPreparations").val(totalRows);
    $("#inputSubjSCredit_").val(totalSubjCredit.toFixed(2));
    $("#inputSubjFCredit_").val(totalSubjFCredit.toFixed(2));


    // Populate admin designations
    var adminDesignations = data.admin_designations;
    var adminTableBody = $("#admin-designation-body");
    adminTableBody.empty(); // Clear previous data

    adminDesignations.forEach(function (designation, index) {
        var newRow = `
                <tr>
                    <td>
                        <input hidden class="form-control" type="text" value="${designation.id}" name="id[]">
                        <input class="form-control" type="text" value="${designation.title_of_designation}" name="designation_title[]">
                    </td>
                    <td><input class="form-control unit_deload" type="text" value="${designation.unit_deload}" name="unit_deload[]"></td>
                    <td><button class="text-danger delete-row-btn" data-index="${index}" data-id="${designation.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button></td>
                </tr>`;
        adminTableBody.append(newRow);
    });

    // Populate others sections
    var otherSections = data.others_sections; // Assuming data.others_sections contains your section data
    var othersContainer = $("#others_");
    othersContainer.empty(); // Clear previous data

    // Start the outer div and table
    var outerHTML = `<table class="w-full">`;

    // Loop through each section and create rows
    otherSections.forEach(function (section, index) {
        var newRow = `
        <tr>
            <td>
                <div class="other-container">
                    <div class="text-slate-500 text-xs mt-5 mb-2">
                        <div class="flex items-center">
                            <div class="">
                                <a href="javascript:;" class="text-slate-500 text-xs title-name">${section.title}</a>
                                <a href="javascript:;" class="text-slate-500 text-xs hidden id">${section.id}</a>
                            </div>
                            <div class="form-check form-switch ml-auto">
                                <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="${section.type}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="${section.type}">
                        ${section.scon_schedules && section.scon_schedules.map(function (schedule) {
                            const operatorSymbolColor = schedule.operator === "∧" ? "success" : "";
                            return appendSched(schedule, operatorSymbolColor);
                        }).join('')}
                        ${section.res_schedules && section.res_schedules.map(function (schedule) {
                            const operatorSymbolColor = schedule.operator === "∧" ? "success" : "";
                            return appendSched(schedule, operatorSymbolColor);
                        }).join('')}
                        ${section.exten_schedules && section.exten_schedules.map(function (schedule) {
                            const operatorSymbolColor = schedule.operator === "∧" ? "success" : "";
                            return appendSched(schedule, operatorSymbolColor);
                        }).join('')}
                        ${section.prod_schedules && section.prod_schedules.map(function (schedule) {
                            const operatorSymbolColor = schedule.operator === "∧" ? "success" : "";
                            return appendSched(schedule, operatorSymbolColor);
                        }).join('')}
                    </div>
                </div>
            </td>
        </tr>
    `;
        outerHTML += newRow;
    });

    // End the outer div and table
    outerHTML += `</table>`;

    // Append the constructed HTML to the container
    othersContainer.append(outerHTML);

    function appendSched(schedule, operatorSymbolColor) {
        return `
            <div class="flex items-center mt-5 transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md item-schedule" data-index="${schedule.id}" data-type="${schedule.type}">
                <div class="border-l-2 border-primary dark:border-primary pl-4">
                    <a href="javascript:;" class="font-medium flex update-schedule">
                        <div class="schedule-operator text-slate-500 mr-2 text-${operatorSymbolColor}">${schedule.operator}</div>
                        <div class="schedule-days">${schedule.days}</div>
                        <div class="id hidden">${schedule.id}</div>
                        <div class="room-id hidden">${schedule.room_id}</div>
                        <button class="mr-1 update-schedule">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit w-4 h-4 text-slate-500 ml-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </a>
                    <div class="text-slate-500 schedule-time-start-end">${schedule.time_start} - ${schedule.time_end}</div>
                    <div class="text-slate-500 schedule-room">(${schedule.room.building})${schedule.room.room_name}</div>
                </div>
                <div class="form-check form-switch ml-auto">
                    <button class="text-danger mr-1 remove-schedule">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }

    updateSummary();

    $('#summarySections').empty();

    // Populate sections
    var sections = data.sections;
    var sectionsContainer = $("#summarySections");

    sections.forEach(function (section, index) {
        // var totalDays = getDays(section.);
        var newRow = `
        <div class="flex mb-4 row-container">
            <div class="mr-auto">
                <div class="flex row-container">
                    <div id="schedule-accordion" class="accordion">
                        <div class="accordion-item">
                            <div id="schedule-header" class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-tw-toggle="collapse" data-tw-target="#schedule-collapse-${section.id}" aria-expanded="false" aria-controls="schedule-collapse-${section.id}">
                                    <div class="flex row-container">
                                        <div class="text-slate-500 text-xs mr-auto title">${section.title}</div>
                                        <div class="text-slate-500 text-xs mr-auto hidden id">${section.id}</div>
                                    </div>
                                </button>
                            </div>
                            <div id="schedule-collapse-${section.id}" class="accordion-collapse collapse" aria-labelledby="schedule-header" data-tw-parent="#schedule-accordion">
                                <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
                                    <div class="px-2 py-3 flex flex-col justify-center flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="font-medium hours">${section.hours}</div>
        </div>
    `;

        sectionsContainer.append(newRow);

    });

    // Append total hours
    var totalHoursRow = `
                    <div class="flex mt-4 pt-4 border-t border-slate-200/60 dark:border-darkmode-400">
                        <div class="mr-auto font-medium text-base">Total (A+B+C+D+E+F)</div>
                        <div id="summary-total" class="font-medium text-base">${totalHours.toFixed(2)} hrs</div>
                    </div>
                `;
    $('#summarySections').append(totalHoursRow);
}

$("body").on("click", ".new_workload_btn", function () {
    clearModalData();
});
function clearModalData() {
    // Clear Faculty Information Section
    $("#esms-name").val("");
    $("#semester_modal").val("");
    $("#semester-year_modal").val("");
    $("#workload_id").val("");
    $("#faculty-name").val("");
    $("#academic-rank").val("");
    $("#institute").val("");
    $("#specialization").val("");
    $("#department").val("");

    $("#inputSubjSCredit_").val(0.00);
    $("#inputSubjFCredit_").val(0.00);
    $("#inputTotalLectureHours").val(0.00);
    $("#inputTotalLaboratoryHours").val(0.00);
    $("#inputPreparations").val("");

    // Clear Teaching Load Section
    $("#teaching-load-body").empty();

    // Clear Admin Designations Section
    $("#admin-designation-body").empty();

    // Clear Other Sections
    var othersContainer = $("#others_");
    othersContainer.empty(); // Clear previous data

    var outerHTML = `
            <table class="w-full">
            <tr>
                <td>
                    <div class="other-container">
                        <div class="text-slate-500 text-xs mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs title-name">C. STUDENT CONSULTATION </a>
                                    <a href="javascript:;" class="text-slate-500 text-xs hidden id"></a>
                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="scon-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="scon-schedules">

                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="other-container">
                        <div class="text-slate-500 text-xs mt-5 mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs title-name">D. RESEARCH</a>
                                    <a href="javascript:;" class="text-slate-500 text-xs hidden id"></a>

                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="res-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="res-schedules">

                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="other-container">
                        <div class="text-slate-500 text-xs mt-5 mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs title-name">E. EXTENSION</a>
                                    <a href="javascript:;" class="text-slate-500 text-xs hidden id"></a>
                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="exten-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="exten-schedules">

                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="other-container">
                        <div class="text-slate-500 text-xs mt-5 mb-2">
                            <div class="flex items-center">
                                <div class="">
                                    <a href="javascript:;" class="text-slate-500 text-xs title-name">F. PRODUCTION </a>
                                    <a href="javascript:;" class="text-slate-500 text-xs hidden id"></a>

                                </div>
                                <div class="form-check form-switch ml-auto">
                                    <button class="bg-primary/10 text-primary rounded px-1 py-1 add-schedule-btn" data-tw-toggle="modal" data-tw-target="#next-overlapping-modal-add-schedule" data-target="prod-schedules">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" class="lucide lucide-plus w-4 h-4" data-lucide="plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="prod-schedules">

                        </div>
                    </div>
                </td>
            </tr>
        </table>
    `;
    // Append the constructed HTML to the container
    othersContainer.append(outerHTML);


    // Clear Summary Sections
    $("#summarySections").empty();
}

// Event listener for expand buttons
$("body").on("click", ".expand-btn", function (ev) {
    // Find the details row
    const detailsRow = $(this).closest('tr').next('.details-row');

    // Close all other details rows and change their icons
    $('.details-row').not(detailsRow).slideUp("fast").each(function () {
        // Change the icon of each closed details row
        const icon = $(this).prev('tr').find('.icon-change');
        icon.removeClass('fa-chevron-down text-primary fa-beat').addClass('fa-chevron-right');
    });



    // Change the icon based on the visibility of the details row
    const icon = $(this).find('.icon-change');
    if (icon.hasClass('fa-chevron-right')) {
        icon.removeClass('fa-chevron-right').addClass('fa-chevron-down text-primary fa-beat');
    } else {
        icon.removeClass('fa-chevron-down text-primary fa-beat').addClass('fa-chevron-right');
    }

    // Toggle the display of the details row with slide animation
    detailsRow.slideToggle("fast");
});

// Bind change event listener to inputs for dynamic calculation
$('body').on('change', "teaching-load-body", 'input[name="lab_time[]"], input[name="lab_days[]"],input[name="lec_time[]"], input[name="lec_days[]"]', function () {
    calculateTotalHours();
});

function load_dropdown_select2() {
    $(".input-initialize").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });

    days_modal = $("#input-day").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });

    day_modal = $("#input-day").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
    day_modal = $("#input-operator").select2({
        placeholder: "Select Operator",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });

    release_signatories = $("#person-signatory").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
}

// Function to initialize Select2 for the days input field
function initializeSelect2ForDaysInput() {
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    $('input[id^="inputLabDays_"], input[id^="inputLecDays_"]').each(function () {
        var $input = $(this);
        var id = $input.attr('id');
        var newIndex = id.split('_')[1]; // Extract the index from the ID

        $input.select2({
            multiple: true,
            placeholder: "Select days",
            allowClear: true,
            data: daysOfWeek.map(function (day) {
                return {
                    id: day,
                    text: day
                };
            })
        }).on('change', function () {
            // Update the selectedDaysInRows array
            var selectedDays = $(this).val() || [];
            selectedDaysInRows[newIndex] = selectedDays;
        });
    });
}

function initializeTimeRangeInputs(newIndex) {
    $('#inputLabTime_' + newIndex).on('change', function () {
        validateTimeRange($(this));
    });

    $('#inputLecTime_' + newIndex).on('change', function () {
        validateTimeRange($(this));
    });
}

function validateTimeRange($input) {
    var value = $input.val();
    // Regular expression to match time range format like "HH:MMAM/HH:MMAM" or "HH:MM AM/PM" with optional minutes
    var regex = /^(0?[1-9]|1[0-2])(:[0-5][0-9])?(AM|PM)-(0?[1-9]|1[0-2])(:[0-5][0-9])?(AM|PM)$/i;

    if (!regex.test(value)) {
        // Reset the input value if it doesn't match the expected format
        $input.val('');
        // Add a class to highlight the input field with an invalid time range
        $input.addClass('alert-outline-danger');
        toastr.error('Please enter time range in the format HH:MMAM/HH:MMAM or HH:MM AM/PM.');
    } else {
        // Remove the class if the input is valid
        $input.removeClass('alert-outline-danger');
    }
}

// Function to calculate total hours per week for lecture and laboratory sessions
function calculateTotalHours() {
    var totalLectureHours = 0;
    var totalLaboratoryHours = 0;

    // Iterate through each row of the table
    $("#teaching-load-body tr").each(function () {
        // Get values from the corresponding input fields
        var lectureTime = $(this).find('input[name="lec_time[]"]').val();
        var laboratoryTime = $(this).find('input[name="lab_time[]"]').val();

        // Get the selected values from the Select2 dropdown
        var selectedLecDays = $(this).find('input[name="lec_days[]"]').select2('data');
        var selectedLabDays = $(this).find('input[name="lab_days[]"]').select2('data');
        var selectedLecDaysCount = countDays(selectedLecDays);
        var selectedLabDaysCount = countDays(selectedLabDays);

        // Split the time range and calculate the duration for lecture and laboratory
        if (lectureTime) {
            var lectureHours = calculateDuration(lectureTime);
            totalLectureHours += lectureHours * selectedLecDaysCount;
        }

        if (laboratoryTime) {
            var laboratoryHours = calculateDuration(laboratoryTime);
            totalLaboratoryHours += laboratoryHours * selectedLabDaysCount;
        }

    });

    // Update the total hours input fields
    $('#inputTotalLectureHours').val(totalLectureHours.toFixed(2));
    $('#inputTotalLaboratoryHours').val(totalLaboratoryHours.toFixed(2));
}

// Function to count the number of days selected
function countDays(selectedDays) {
    // Ensure selectedDays is an array and filter out any empty values
    selectedDays = Array.isArray(selectedDays) ? selectedDays.filter(Boolean) : [];
    return selectedDays.length;
}

function calculateDuration(timeRange) {
    var times = timeRange.split("-");
    var startTime = parseTime(times[0]);
    var endTime = parseTime(times[1]);
    var duration = 0;

    if (!isNaN(startTime) && !isNaN(endTime)) {
        duration = (endTime - startTime) / 60; // Convert minutes to hours
    }
    return duration;
}

function parseTime(timeString) {
    var regex = /^(\d+)(?::(\d+))?\s*(AM|PM)?$/i; // Regular expression to match time format
    var match = timeString.trim().match(regex); // Match the time string with the regex

    if (match) {
        var hours = parseInt(match[1]);
        var minutes = match[2] ? parseInt(match[2]) : 0; // If minutes are not provided, default to 0
        var amPmIndicator = match[3] ? match[3].toUpperCase() : ''; // Convert AM/PM indicator to uppercase

        if (amPmIndicator === "PM" && hours < 12) {
            hours += 12;
        }

        return hours * 60 + minutes;
    } else {
        return NaN;
    }
}

// Event listener for "Add Schedule" links
$("body").on("click", ".add-schedule-btn", function (ev) {
    // Store reference to the parent <tr> element
    selectedTableRow = $(this).closest('tr');
    // Determine the schedule type based on the data attribute of the clicked button
    scheduleType = $(this).data('target');
    // Set data attribute to indicate that it's adding a new schedule
    $('#next-overlapping-modal-add-schedule').attr('data-action', 'add');
    // Set data attribute to indicate whether it's an update or new
    $('#next-overlapping-modal-add-schedule').attr('data-action', false ? 'update' : 'add');

    // Set the title of the modal
    const modalTitle = false ? "Update Schedule" : "Add Schedule";
    $('#next-overlapping-modal-add-schedule .modal-header h2').text(modalTitle);
    loadRooms();
});

// Event listener for "Add" button in the modal
$("body").on("click", "#add-new-schedule", function (ev) {
    const InputOperator = $("#input-operator");
    const inputStartTime = $("#input-start-time");
    const inputEndTime = $("#input-end-time");
    const inputDay = $("#input-day");
    const inputRoom = $("#input-room"); // Add this line
    const modalAddScheduleEl = document.getElementById('next-overlapping-modal-add-schedule');
    const modalAddSchedule = tailwind.Modal.getOrCreateInstance(modalAddScheduleEl);

    const operator = InputOperator.val();
    const startTime = inputStartTime.val();
    const endTime = inputEndTime.val();
    const selectedDaysValues = inputDay.val();
    const roomId = inputRoom.val(); // Add this line
    const roomText = inputRoom.find('option:selected').text(); // Add this line
    const selectedDaysText = inputDay.find('option:selected').map(function () {
        return $(this).text();
    }).get().join(', ');

    if (!startTime || !endTime || !selectedDaysValues || selectedDaysValues.length === 0) {
        console.error('Please fill in all fields.');
        return;
    }

    const operatorSymbol = operator === "And" ? "∧" : "∨";
    const operatorSymbolColor = operator === "And" ? "success" : ""

    // Check if it's an update or add
    const action = $('#next-overlapping-modal-add-schedule').attr('data-action');
    if (action === 'add') {
        const index = $('.item-schedule').length + 1;
        const timeRangeDiv = `
            <div class="flex items-center mt-5 transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md item-schedule" data-index="${index}" data-type="${scheduleType}">
                <div class="border-l-2 border-primary dark:border-primary pl-4">
                    <a href="javascript:;" class="font-medium flex update-schedule">
                        <div class="schedule-operator text-slate-500 mr-2 text-${operatorSymbolColor}">${operatorSymbol}</div>
                        <div class="schedule-days">${selectedDaysText}</div>
                        <div class="id hidden"></div>
                        <div class="room-id hidden">${roomId}</div>
                        <button class="mr-1 update-schedule">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit w-4 h-4 text-slate-500 ml-2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </a>
                    <div class="text-slate-500 schedule-time-start-end">${startTime} - ${endTime}</div>
                    <div class="text-slate-500 schedule-room">${roomText}</div>
                </div>
                <div class="form-check form-switch ml-auto">
                    <button class="text-danger mr-1 remove-schedule">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash block mx-auto"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </div>
            </div>`;

        selectedTableRow.find(`.${scheduleType}`).append(timeRangeDiv);
    } else if (action === 'update') {
        const dataIndex = $('#next-overlapping-modal-add-schedule').attr('data-index');
        const scheduleElement = $(`.item-schedule[data-index="${dataIndex}"]`);

        scheduleElement.find('.schedule-operator').text(operatorSymbol);
        scheduleElement.find('.schedule-days').text(selectedDaysText);
        scheduleElement.find('.schedule-time-start-end').text(`${startTime} - ${endTime}`);
        scheduleElement.find('.room-id').text(roomId);
        scheduleElement.find('.schedule-room').text(roomText);
    }

    // Clear the modal inputs
    inputStartTime.val('');
    inputEndTime.val('');
    inputRoom.val(null).trigger('change');
    $('#input-day').val(null).trigger('change');

    modalAddSchedule.hide();
    $('#next-overlapping-modal-add-schedule').removeAttr('data-action');
    updateSummary();
});

// Event listener for "update-schedule" elements
$("body").on("click", ".update-schedule", function (ev) {
    // Retrieve the schedule details from the clicked element or its parent elements
    const scheduleElement = $(this).closest('.item-schedule');
    const scheduleTime = scheduleElement.find('.schedule-time-start-end').text();
    const scheduleRoom = scheduleElement.find('.schedule-room').text();
    const scheduleDays = scheduleElement.find('.schedule-days').text();
    const scheduleOperator = scheduleElement.find('.schedule-operator').text();
    // Retrieve the data-index attribute from the schedule item
    const dataIndex = $(this).closest('.item-schedule').data('index');

    // Split the scheduleTime into startTime and endTime
    const [startTime, endTime] = scheduleTime.split(' - ');

    loadRooms();
    // Open the modal and set the values
    openModalWithScheduleDetails(startTime, endTime, scheduleRoom, scheduleDays, scheduleOperator, true,
        dataIndex); // Pass true to indicate it's an update
});

// Function to open the modal with schedule details
function openModalWithScheduleDetails(startTime, endTime, selectedDaysText, scheduleOperatorText, isUpdate,
    dataIndex) {
    // Get the modal instance
    const modalAddScheduleEl = document.getElementById('next-overlapping-modal-add-schedule');
    const modalAddSchedule = tailwind.Modal.getOrCreateInstance(modalAddScheduleEl);

    // Show the modal
    modalAddSchedule.show();

    // Set data attribute to indicate whether it's an update or new
    $('#next-overlapping-modal-add-schedule').attr('data-action', isUpdate ? 'update' : 'add');

    // Set data attribute to indicate whether it's an update or new
    $('#next-overlapping-modal-add-schedule').attr('data-index', dataIndex);

    // Set the title of the modal
    const modalTitle = isUpdate ? "Update Schedule" : "Add Schedule";
    $('#next-overlapping-modal-add-schedule .modal-header h2').text(modalTitle);

    // Set the values in the modal
    $('#input-start-time').val(startTime);
    $('#input-end-time').val(endTime);

    const operatorSymbol = scheduleOperatorText === "∧" ? "And" : "Or";

    $('#input-operator').val(operatorSymbol);
    $('#input-operator').trigger('change'); // Trigger change event to update select2

    // Set the selected days in the select2 dropdown
    const selectedDays = selectedDaysText.split(',').map(day => day.trim());
    $('#input-day').val(selectedDays);
    $('#input-day').trigger('change'); // Trigger change event to update select2

    // Log schedule details
    // Add your logic here for updating the schedule

    // Set the room value if it exists
    const scheduleElement = $(`.item-schedule[data-index="${dataIndex}"]`);
    const roomId = scheduleElement.find('.room-id').text();
    if (roomId) {
        $('#input-room').val(roomId);
        $('#input-room').trigger('change');
    }
}

// Event listener for "remove-schedule" buttons
$("body").on("click", ".remove-schedule", function (ev) {
    // Retrieve the schedule ID from the HTML element
    const scheduleId = $(this).closest('.item-schedule').find('.id').text();

    if (scheduleId) {
        // Perform AJAX request to delete the schedule from the database
        $.ajax({
            url: bpath + 'faculty-portal/item-schedule/delete/' + scheduleId,
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            method: 'DELETE', // Use the DELETE method as defined in the route
            data: { id: scheduleId },
            success: function (response) {
                toastr.success(response.message);
            },
            error: function (xhr, status, error) {
                // Handle error if deletion fails
                console.error(error);
            }
        });
    }

    // If deletion is successful, remove the schedule element from the DOM
    $(this).closest('.item-schedule').remove();
    // Perform any additional cleanup or logic as needed
    updateSummary();
});

$("body").on("blur", ".unit_deload", function (ev) {
    if ($(this).val().trim() !== "") {
        updateSummary();
    }
});

$("body").on("click", ".summary-btn", function (ev) {
    // Add spinning icon
    $(this).addClass("fa-spin");

    // Call updateSummary function
    updateSummary();

});

// Function to calculate and update the summary
function updateSummary() {
    // Clear previous summary
    $('#summarySections').empty();
    $('.lab-summary').empty();
    $('.lec-summary').empty();

    totalHours = 0;
    var totalLectureHours = 0;
    var totalLabHours = 0;

    // Iterate over each lecture-container
    $('.lec-schedules').each(function () {
        var totalHoursPerWeek = calculateTotalHours($(this).find('.item-schedule'));
        totalHours += parseFloat(totalHoursPerWeek);
        var totalDays = getDays($(this).find('.item-schedule'));
        selectedTableRow = $(this).closest('tr');
        totalLectureHours += parseFloat(totalHoursPerWeek);
        var subjectCode = selectedTableRow.find('.subjcode').text();
        var subjectDesc = selectedTableRow.find('.subjdesc').text();
        var section = selectedTableRow.find('.section').text();
        var schedRow = `
                            <div class="text-slate-500 text-xs mt-5">${subjectCode}(${section})</div>
                            ${totalDays.all}
                        `;
        $('.lec-summary').append(schedRow);
    });

    // Iterate over each lab-container
    $('.lab-schedules').each(function () {
        var totalHoursPerWeek = calculateTotalHours($(this).find('.item-schedule'));
        totalHours += parseFloat(totalHoursPerWeek);
        var totalDays = getDays($(this).find('.item-schedule'));
        totalLabHours += parseFloat(totalHoursPerWeek);
        selectedTableRow = $(this).closest('tr');
        var subjectCode = selectedTableRow.find('.subjcode').text();
        var subjectDesc = selectedTableRow.find('.subjdesc').text();
        var section = selectedTableRow.find('.section').text();
        var schedRow = `
                            <div class="text-slate-500 text-xs mt-5">${subjectCode}(${section})</div>
                            ${totalDays.all}
                        `;
        $('.lab-summary').append(schedRow);
    });

    updateLecLab(totalLectureHours.toFixed(2), totalLabHours.toFixed(2));
    updateCredUnit();

    // Iterate over each other-container
    $('.other-container').each(function () {
        var title = $(this).find('a').text().trim();
        var titleName = $(this).find('.title-name').text().trim();
        var totalHoursPerWeek = calculateTotalHours($(this).find('.item-schedule'));
        totalHours += parseFloat(totalHoursPerWeek);
        var totalDays = getDays($(this).find('.item-schedule'));

        // Append data to the summary
        var summaryRow = `
                    <div class="flex mb-4 row-container">
                            <div class="mr-auto">
                               <div class="flex row-container">
                                <div id="schedule-accordion" class="accordion">
                                    <div class="accordion-item">
                                        <div id="schedule-header" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-tw-toggle="collapse" data-tw-target="#schedule-collapse" aria-expanded="false" aria-controls="schedule-collapse">
                                                <div class="flex row-container">
                                                    <div class="text-slate-500 text-xs mr-auto title">${titleName}</div>
                                                    <div class="text-slate-500 text-xs mr-auto hidden id"></div>
                                                </div>
                                            </button>
                                        </div>
                                        <div id="schedule-collapse" class="accordion-collapse collapse" aria-labelledby="schedule-header" data-tw-parent="#schedule-accordion">
                                            <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
                                                <div class="px-2 py-3 flex flex-col justify-center flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                                                    ${totalDays.all}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="font-medium hours">${totalHoursPerWeek} hrs</div>
                        </div>
                `;
        if (titleName) {
            $('#summarySections').append(summaryRow);
        }
    });

    // Append total hours
    var totalHoursRow = `
                    <div class="flex mt-4 pt-4 border-t border-slate-200/60 dark:border-darkmode-400">
                        <div class="mr-auto font-medium text-base">Total (A+B+C+D+E+F)</div>
                        <div id="summary-total" class="font-medium text-base">${totalHours.toFixed(2)} hrs</div>
                    </div>
                `;
    $('#summarySections').append(totalHoursRow);

    // Remove spinning icon after update
    $('.summary-btn').removeClass("fa-spin");
}

function calculateTotalHours(scheduleItems) {
    var totalMinutes = 0;
    scheduleItems.each(function () {
        var time = $(this).find('.schedule-time-start-end').text().trim();
        var [startTime, endTime] = time.split(' - ');
        var [startHour, startMinute] = startTime.split(':').map(Number);
        var [endHour, endMinute] = endTime.split(':').map(Number);

        // Convert start and end hours to 24-hour format
        if (startTime.endsWith("PM") && startHour !== 12) startHour += 12;
        if (endTime.endsWith("PM") && endHour !== 12) endHour += 12;

        // Handle cases where end time is on the next day
        if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
            endHour += 24; // Add 24 hours to endHour
        }

        var hours = endHour - startHour + (endMinute - startMinute) / 60;
        var days = $(this).find('.schedule-days').text().trim().split(',').length;
        var operator = $(this).find('.schedule-operator').text().trim();
        if (operator === "∧") {
            totalMinutes += hours * 60 * days;
        }
    });
    var totalHours = totalMinutes / 60;
    return totalHours.toFixed(2);
}

function getDays(scheduleItems) {
    var days = [];
    scheduleItems.each(function () {
        var time = $(this).find('.schedule-time-start-end').text().trim();
        var [startTime, endTime] = time.split(' - ');
        var [startHour, startMinute] = startTime.split(':');
        var [endHour, endMinute] = endTime.split(':');
        var start =
            `${startHour === '12' ? 12 : startHour % 12}:${startMinute} ${startHour < 12 ? 'AM' : 'PM'}`;
        var end = `${endHour === '12' ? 12 : endHour % 12}:${endMinute} ${endHour < 12 ? 'AM' : 'PM'}`;
        var day = $(this).find('.schedule-days').text().trim();
        days.push({
            start,
            end,
            day
        });
    });

    var timeStr = "";
    var dayStr = "";
    var allStr = "";
    for (var i = 0; i < days.length; i++) {
        var day = days[i];
        var startTime = day.start.split(':');
        var endTime = day.end.split(':');
        var startHour = parseInt(startTime[0]) % 12;
        var startMinute = parseInt(startTime[1]);
        var endHour = parseInt(endTime[0]) % 12;
        var endMinute = parseInt(endTime[1]);

        // Adjust end time if it's earlier than start time
        if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
            endHour = parseInt(endHour) + 12; // Add 12 hours to endHour
        }

        // Calculate the duration
        var duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
        var totalHours = Math.floor(duration / 60);
        var totalMinutes = duration % 60;

        if (i > 0) {
            timeStr += " / ";
            dayStr += " / ";
        }
        timeStr += `${day.start} - ${day.end} (${totalHours}h ${totalMinutes}m)`;
        dayStr += `${day.day}`;
        allStr += `
                    <div class="mt-1.5 items-center">
                        <div class="text-slate-500 text-xs">${day.day}</div>
                        <div class="text-success flex text-xs font-medium tooltip cursor-pointer ml-2"> ${day.start} - ${day.end} (${totalHours}h ${totalMinutes}m)</div>
                    </div>`;
    }

    return {
        time: timeStr,
        day: dayStr,
        all: allStr
    };
}

// Function to update the lecture and lab hours
function updateLecLab(totalLectureHours, totalLabHours) {
    $('#inputTotalLectureHours').val(totalLectureHours);
    $('#inputTotalLaboratoryHours').val(totalLabHours);

    // Append data to the summary
    var summaryRow = `
                <div class="flex mb-4 row-container">
                    <div class="text-slate-500 text-xs mr-auto title">A. INSTRUCTION</div>
                    <div class="text-slate-500 text-xs mr-auto hidden id"></div>
                    <div class="font-medium hours">${(parseFloat(totalLectureHours) + parseFloat(totalLabHours)).toFixed(2)} hrs</div>
                </div>
            `;
    $('#summarySections').append(summaryRow);

}

// Function to update the faculty credit and unit deload
function updateCredUnit() {
    var totalUnitDeload = 0;

    // Calculate the total unit deload
    $('.unit_deload').each(function () {
        var unitDeload = parseFloat($(this).val());
        if (!isNaN(unitDeload)) {
            totalUnitDeload += unitDeload;
        }
    });
    totalHours += parseFloat(totalUnitDeload);
    // Append data to the summary
    var summaryRow = `
                <div class="flex mb-4 row-container">
                    <div class="text-slate-500 text-xs mr-auto title">B. DESIGNATION</div>
                    <div class="text-slate-500 text-xs mr-auto hidden id"></div>
                    <div class="font-medium hours">${(totalUnitDeload).toFixed(2)} hrs</div>

                </div>
            `;
    $('#summarySections').append(summaryRow);

    // Update the total of student and faculty credits
    var totalFacultyCreds = parseFloat($('#inputSubjFCredit_').val());
    var totalStudentCreds = parseFloat($('#inputSubjSCredit_').val());
    $('#total-stud-facul').empty();
    $('#total-stud-facul').append((totalFacultyCreds + totalStudentCreds + totalUnitDeload).toFixed(2));
}

// Listen for operator changes
$('#input-operator').on('change', function () {
    const operator = $(this).val();
    const warningMessage = operator === "And" ?
        `"And" means the hours will be multiplied by the number of selected days.` :
        `"Or" means the hours will be the same for all selected days.`;

    $('.operatorWarning').html(warningMessage);
});

// Event listener for mouseenter on table rows to show the dropdown menu
$("body").on("mouseenter", "#data-table tr", function () {
    // Find the dropdown menu within the current table row
    const dropdownMenu = $(this).find('.wl-options');
    // Set the opacity to 1 to show the dropdown menu
    dropdownMenu.css('opacity', 1);
});

// Event listener for mouseleave on table rows to hide the dropdown menu
$("body").on("mouseleave", "#data-table tr", function () {
    // Find the dropdown menu within the current table row
    const dropdownMenu = $(this).find('.wl-options');
    // Set the opacity to 0 to hide the dropdown menu
    dropdownMenu.css('opacity', 0);
});

function toggleCustomSignatory(selectElement) {
    var customSignatoryInput = document.getElementById("customSignatoryInput");
    if (selectElement.value === "Other") {
        customSignatoryInput.style.display = "block";
    } else {
        customSignatoryInput.style.display = "none";
    }
}

// Event listener for adding a new signatory row
$("body").on("click", "#add_row_signatories", function () {
    var personSignatory = $("#person-signatory");
    var descriptionSignatory = $("#sd_modal_sd");

    if (personSignatory.val() && descriptionSignatory.val()) {
        addRowSignatory();

        // Remove border-danger class if operation is successful
        personSignatory.removeClass("border-danger");
        descriptionSignatory.removeClass("border-danger");
    } else {
        toastr.error("Please select a person and description before adding a signatory.");

        // Add border-danger class to input fields if they are null
        if (!personSignatory.val()) {
            personSignatory.addClass("border-danger");

        }
        if (!descriptionSignatory.val()) {
            descriptionSignatory.addClass("border-danger");
        }

        // Focus on the dropdown toggle button to bring attention to it
        personSignatory.select2("open");
    }
});

// Function to add a new signatory row
function addRowSignatory() {
    var signatoryDescription = $("#sd_modal_sd").val() === "Other" ? $("#custom-signatory").val() : $("#sd_modal_sd").val();
    var tr = `
        <tr class="hover:bg-gray-200">
            <td style="display:none">
                <input type="hidden" name="table_signatory_emp_id[]" class="form-control table_signatory_emp_id" value="${$("#person-signatory").val()}">
            </td>
            <td>
                <span class="drag-handle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg></span>
            </td>
            <td style="display: flex; align-items: center;">
                <div class="text-xs table_signatory_emp_name" name="table_signatory_emp_name[]" style="margin-right: 5px;" editable contenteditable="true">${$("#person-signatory option:selected").text()}</div>
                <input type="text" name="table_signatory_suffix[]" class="form-control w-12 form-control-sm" value="${$("#sd_modal_suffix").val()}" contenteditable="true">
            </td>
            <td>
                <input type="text" name="table_signatory_description[]" class="form-control form-control-sm" value="${signatoryDescription}" contenteditable="true">
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
    $("#sd_modal_sd, #sd_modal_suffix").val("");
    $("#person-signatory").val(null).trigger("change");

    // Update local table data
    saveTableData();
}

// Event listener for deleting a signatory row
$(".sig_modal_table tbody").on("click", ".delete", function () {
    var tableRow = $(this).closest("tr");
    var tableSignatoryId = tableRow.find("input[name='table_signatory_id[]']").val();
    tableRow.remove();

    // Update local table data after removing the row
    saveTableData();
});

// Function to save the table data to local storage
function saveTableData() {
    var tableData = [];
    $(".sig_modal_table tbody tr").each(function () {
        var rowData = {
            signatoryId: $(this).find("input[name='table_signatory_id[]']").val(),
            signatoryEmpId: $(this).find("input[name='table_signatory_emp_id[]']").val(),
            signatoryText: $(this).find(".table_signatory_emp_name").text(),
            signatorySuffix: $(this).find("input[name='table_signatory_suffix[]']").val(),
            signatoryDescription: $(this).find("input[name='table_signatory_description[]']").val()
        };
        tableData.push(rowData);
    });
    localStorage.setItem("tableData", JSON.stringify(tableData));
}
// Function to load the table data from local storage
function loadTableData() {
    var tableData = localStorage.getItem("tableData");
    if (tableData) {
        tableData = JSON.parse(tableData);
        $(".sig_modal_table tbody").empty();
        tableData.forEach(function (rowData) {
            var tr = `
                <tr class="hover:bg-gray-200">
                    <td style="display:none">
                        <input type="hidden" name="table_signatory_id[]" value="${rowData.signatoryId}">
                        <input type="hidden" name="table_signatory_emp_id[]" class="form-control table_signatory_emp_id" value="${rowData.signatoryEmpId}">
                    </td>
                    <td>
                        <span class="drag-handle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg></span>
                    </td>
                    <td style="display: flex; align-items: center;">
                        <input type="hidden" name="table_signatory_emp_id[]" class="form-control" value="${rowData.signatoryEmpId}">
                        <div class="text-xs table_signatory_emp_name" name="table_signatory_emp_name[]" style="margin-right: 5px;" contenteditable="true">${rowData.signatoryText}</div>
                        <input type="text" name="table_signatory_suffix[]" class="form-control w-12 form-control-sm" value="${rowData.signatorySuffix}" contenteditable="true">
                    </td>
                    <td>
                        <input type="text" name="table_signatory_description[]" class="form-control form-control-sm" value="${rowData.signatoryDescription}" contenteditable="true">
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
        });
    }
}

// Call saveTableData whenever a change is made to the table
$(".sig_modal_table").on("change", function () {
    saveTableData();
});

function load_sortable() {
    $(".sig_modal_table tbody").sortable({
        handle: ".drag-handle", // Use the drag-handle class to define the draggable area
        axis: "y", // Allow dragging only in the vertical direction
        opacity: 0.6, // Set the opacity of the dragged item
        cursor: "move", // Change cursor to indicate draggable element
        update: function (event, ui) {
            // Callback function triggered after the user stops dragging and the sort order changes
            // You can perform any necessary actions here, such as updating the database with the new order
        }
    }).disableSelection(); // Prevent text selection while dragging
}

$("body").on("click", ".table-release-btn", function () {
    wl_id = $(this).data('id');
    // Enable the button and reset text
    $("#confirm-workload-modal-btn").prop('disabled', false);

    // Show "Release" button and hide loading icon
    $("#release-workload-modal-btn").show();
    $("#confirm-workload-modal-btn").hide();
});

// Event listener for the "Release" button click
$("#release-workload-modal-btn").on("click", function () {
    // Show loading icon and hide "Release" button
    $(this).hide();
    $("#confirm-workload-modal-btn").show();
});

// Event listener for the "Release" button click
$("#cancel_release_btn").on("click", function () {
    // Enable the button and reset text
    $("#confirm-workload-modal-btn").prop('disabled', false);

    // Show "Release" button and hide loading icon
    $("#release-workload-modal-btn").show();
    $("#confirm-workload-modal-btn").hide();
});

// Event listener for the "Confirm" button click
$("#confirm-workload-modal-btn").on("click", function () {
    var $confirmBtn = $(this); // Store reference to the button element

    // Show loading icon on "Confirm" button
    $confirmBtn.html(`<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white">
                        <g fill="none" fill-rule="evenodd" stroke-width="4" stroke="white">
                            <circle cx="22" cy="22" r="1">
                                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="22" cy="22" r="1">
                                <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                            </circle>
                        </g>
                    </svg>`).prop('disabled', true);

    // Prepare data to send to the server
    var formData = {
        wl_id: wl_id,
        sendAs: $("#doc_sendAs").val(),
        message: $("#message").val(),
        signatories: []
    };

    // Iterate over the signatories table rows
    $(".sig_modal_table tbody tr").each(function () {
        var row = $(this);
        var signatory = {
            user_id: row.find(".table_signatory_emp_id").val(),
            user_name: row.find(".table_signatory_emp_name").text(),
            suffix: row.find("input[name='table_signatory_suffix[]']").val(),
            description: row.find("input[name='table_signatory_description[]']").val()
        };
        // Add the signatory data to the formData array
        formData.signatories.push(signatory);
    });

    // Send the data to the server using AJAX
    $.ajax({
        url: "/faculty-portal/release-work-load",
        type: "POST",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        data: formData,
        success: function (response) {
            toastr.success("Workload released successfuly.");
            // close the modal
            const releaseModal = tailwind.Modal.getOrCreateInstance(document.querySelector(
                "#release-signatories-modal-preview"));
            releaseModal.hide();
            // Enable the button and reset text
            $confirmBtn.html('Confirm').prop('disabled', false);

            // Optionally, close the modal or perform any other action
            fetchDataFromServer();

            // Show "Release" button and hide loading icon
            $("#release-workload-modal-btn").show();
            $("#confirm-workload-modal-btn").hide();
        },
        error: function (xhr, status, error) {
            // Handle errors if any
            console.error("Error sending data:", error);

            // Enable the button and reset text
            $confirmBtn.html('Confirm').prop('disabled', false);

            // Show "Release" button and hide loading icon
            $("#release-workload-modal-btn").show();
            $("#confirm-workload-modal-btn").hide();
        }
    });
});
// Add these functions at the end of your existing work_load.js

// Function to load rooms into select
function loadRooms() {
    $.ajax({
        url: '/api/rooms',
        type: 'GET',
        success: function (rooms) {
            const roomSelect = $('#input-room');
            roomSelect.empty().append('<option value="">Select Room</option>');

            rooms.forEach(room => {
                roomSelect.append(new Option(
                    `${room.room_name} ${room.building ? `(${room.building})` : ''}`,
                    room.id
                ));
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading rooms:', error);
            toastr.error('Failed to load rooms');
        }
    });
}

// Function to save new room
function saveRoom() {
    const formData = {
        room_name: $('#room_name').val(),
        room_type: $('#room_type').val(),
        building: $('#building').val(),
        floor: $('#floor').val(),
        capacity: $('#capacity').val(),
    };

    $.ajax({
        url: '/api/rooms',
        type: 'POST',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            // Reload rooms in the select
            loadRooms();

            // Close the room modal
            const roomModal = tailwind.Modal.getInstance(document.querySelector("#room-modal-preview"));
            roomModal.hide();

            // Show success message
            toastr.success('Room added successfully');

            // Reset form
            $('#room_name').val('');
            $('#room_type').val('classroom');
            $('#building').val('');
            $('#floor').val('');
            $('#capacity').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error saving room:', error);
            toastr.error('Failed to add room');
        }
    });
}

// Load rooms when schedule modal opens
$('#next-overlapping-modal-add-schedule').on('shown.tw.modal', function () {
    loadRooms();
});

// Initialize when room modal opens
$('#room-modal-preview').on('shown.tw.modal', function () {
    $('#room_name').focus();
});
