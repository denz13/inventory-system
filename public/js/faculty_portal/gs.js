$(document).ready(function () {
    bpath = __basepath + "/";
    var _token = $('meta[name="csrf-token"]').attr("content");

    var allowedPatterns = [];
    var selectedSchoolYear = "";
    var selectedSemester = "";
    var selectedSubject = "";
    var selectedSection = "";
    var dt__linked_data = "";

    loadSettings("");

    //for locking
    load_allowed_dropdown();
    load_allowed_to_link_datatable();
    load_allowed_data_list();

    loadSignatoriesFromLocalStorage();

    // Attach event listeners to editable cells in the table to update localStorage
    $("#signatories_table").on(
        "input",
        "td[contenteditable='true']",
        function () {
            updateLocalStorage();
        }
    );
});

// Call the updateTableWithFilters function when filters change
$("#input-filter-6-school-year").on("change", function () {
    var selectedSchoolYear = $(this).val();
    var selectedSemester = $("#input-filter-6-semester").val(); // Get selected semester

    // Ajax request to fetch semesters based on selected school year
    $.get(
        bpath + "faculty-portal/get-semesters",
        { _token: _token, school_year: selectedSchoolYear },
        function (data) {
            var options = '<option value="Semester">Semester</option>';
            $.each(data, function (key, value) {
                options += '<option value="' + key + '">' + value + "</option>";
            });
            $("#input-filter-6-semester").html(options);

            // Trigger the change event for semester to populate subjects
            $("#input-filter-6-semester").trigger("change");
        }
    );
});

$("#input-filter-6-semester").on("change", function () {
    var selectedSemester = $(this).val();
    var selectedSchoolYear = $("#input-filter-6-school-year").val(); // Get selected school year

    // Ajax request to fetch subjects based on selected semester and school year
    $.get(
        bpath + "faculty-portal/get-subjects",
        {
            _token: _token,
            semester: selectedSemester,
            school_year: selectedSchoolYear,
        },
        function (data) {
            var options = '<option value="Subject Code">Subject Code</option>';
            $.each(data, function (key, value) {
                options += '<option value="' + key + '">' + value + "</option>";
            });
            $("#input-filter-6-subject").html(options);

            // Trigger the change event for semester to populate subjects
            $("#input-filter-6-subject").trigger("change");
        }
    );
});

$("#input-filter-6-subject").on("change", function () {
    var selectedSubject = $(this).val();
    var selectedSchoolYear = $("#input-filter-6-school-year").val();
    var selectedSemester = $("#input-filter-6-semester").val();

    // Ajax request to fetch sections based on selected subject code, school year, and semester
    $.get(
        bpath + "faculty-portal/get-sections",
        {
            _token: _token,
            subject: selectedSubject,
            school_year: selectedSchoolYear,
            semester: selectedSemester,
        },
        function (data) {
            var options = '<option value="Section">Section</option>';
            $.each(data, function (key, value) {
                options += '<option value="' + key + '">' + value + "</option>";
            });
            $("#input-filter-6-section").html(options);

            // Trigger the change event for semester to populate subjects
            $("#input-filter-6-section").trigger("change");
        }
    );
});

window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search);
    // Check if URL parameters are available
    $("#loading-indicator").empty();
    if (
        urlParams.has("subjcode") &&
        urlParams.has("section") &&
        urlParams.has("sy") &&
        urlParams.has("sem")
    ) {
        // Use values from the URL
        selectedSubject = urlParams.get("subjcode");
        selectedSection = urlParams.get("section");
        selectedSchoolYear = urlParams.get("sy");
        selectedSemester = urlParams.get("sem");
        limit = $("#input-filter-6-paging").val();
        loadStudentData();
    }
};

function loadStudentData() {
    // Show loading indication
    $("#loading-indicator").html(
        '<i class="text-primary fas fa-spinner fa-spin mr-2"></i> Loading...'
    );

    // Ajax request to fetch data based on selected filters
    $.get(
        bpath + "faculty-portal/get-data-student",
        {
            _token: _token,
            school_year: selectedSchoolYear,
            semester: selectedSemester,
            subject: selectedSubject,
            section: selectedSection,
            limit: limit,
        },
        function (data) {
            // Assuming you have the data.is_locked value, e.g., data.is_locked is a boolean
            var isLocked = data.is_locked;

            // Get a reference to the lockSubject button
            var lockSubjectButton = $("#lockSubject");

            // Get a reference to the <i> element within the button
            var iconElement = $("#icon_lock_unlock"); // Corrected spelling

            // Get a reference to the print button container
            var printButtonContainer = $("#print-button-container");

            // Clear the container to avoid repeated buttons
            printButtonContainer.empty();

            // Create the "Print" button
            var printButton = $("<button></button>")
                .text("Print")
                .addClass("btn btn-primary shadow-md mr-2")
                .attr("data-tw-toggle", "modal")
                .attr("data-tw-target", "#print_options_modal")
                .appendTo(printButtonContainer);

            // Create the printer icon using an icon font
            var printerIcon = $("<i></i>")
                .addClass("fa fa-print w-4 h-4 ml-2")
                .attr("id", "print-icon");

            // Append the printer icon to the "Print" button
            printButton.append(printerIcon);
            // Append the button to the container based on the lock state
            if (isLocked) {


                // Change the icon to a lock icon
                iconElement.removeClass("fa-unlock").addClass("fa-lock");
                lockSubjectButton.attr("data-is-locked", "true"); // Add data-is-locked attribute
            } else {
                // Clear the container to avoid repeated buttons
                // printButtonContainer.empty();
                // Change the icon to an unlock icon
                iconElement.removeClass("fa-lock").addClass("fa-unlock");
                lockSubjectButton.attr("data-is-locked", "false"); // Add data-is-locked attribute
            }

            // Remove loading indication
            $("#loading-indicator").empty();

            // console.log(data);
            $("#info_subjectcode").text(selectedSubject);
            $("#info_schoolyear").text(selectedSchoolYear);
            $("#info_sem").text(selectedSemester);
            $("#info_section").text(selectedSection);
            $("#status_lock").text(data.is_locked ? "Locked" : "Not Locked");

            $("#info_data_count").text(
                data.student_list.from +
                    " to " +
                    data.student_list.to +
                    " of " +
                    data.student_list.total +
                    " students."
            );

            // Clear existing table rows
            $("#student-table-body").empty();

            // Get object values as array
            const students = Object.values(data.student_list.data);

            // Sort students by fullname
            students.sort((a, b) => {
                if (a.fullname < b.fullname) return -1;
                if (a.fullname > b.fullname) return 1;
                return 0;
            });

            // Populate the table rows with fetched student data
            students.forEach((student, index) => {
                var newRow =
                    "<tr>" +
                    '<td class="!py-4">' +
                    '<a href="javascript:;" class="font-medium whitespace-nowrap ml-4">' +
                    (student.fullname ? student.fullname : "") +
                    "</a>" +
                    '<input id="oid_' +
                    index +
                    '" type="text" class="form-control oid-input hidden" placeholder="#" value="' +
                    student.oid +
                    '">' +
                    '<input id="sy_' +
                    index +
                    '" type="text" class="form-control sy-input hidden" placeholder="#" value="' +
                    student.sy +
                    '">' +
                    '<input id="sem_' +
                    index +
                    '" type="text" class="form-control sem-input hidden" placeholder="#" value="' +
                    student.sem +
                    '">' +
                    '<input id="studid_' +
                    index +
                    '" type="text" class="form-control studid-input hidden" placeholder="#" value="' +
                    student.studid +
                    '">' +
                    '<input id="subjcode_' +
                    index +
                    '" type="text" class="form-control subjcode-input hidden" placeholder="#" value="' +
                    student.subjcode +
                    '">' +
                    "</td>" +
                    "<td >" +
                    (data.encoding_ongoing &&
                    !data.is_locked &&
                    data.has_access &&
                    data.this_sy &&
                    data.this_sem
                        ? '<input id="mid_term_' +
                          index +
                          '" type="text" class="form-control midterm-input" placeholder="Mid Term" value="' +
                          (student.midterm ? student.midterm : "") +
                          '">'
                        : '<span class="readonly-text">' +
                          (student.midterm ? student.midterm : "") +
                          "</span>") +
                    "</td>" +
                    "<td >" +
                    (data.encoding_ongoing &&
                    !data.is_locked &&
                    data.has_access &&
                    data.this_sy &&
                    data.this_sem
                        ? '<input id="final_term_' +
                          index +
                          '" type="text" class="form-control finalterm-input" placeholder="Final Term" value="' +
                          (student.finalterm ? student.finalterm : "") +
                          '">'
                        : '<span class="readonly-text">' +
                          (student.finalterm ? student.finalterm : "") +
                          "</span>") +
                    "</td>" +
                    "<td >" +
                    (data.encoding_ongoing &&
                    !data.is_locked &&
                    data.has_access &&
                    data.this_sy &&
                    data.this_sem
                        ? '<input id="final_grade_' +
                          index +
                          '" type="text" class="form-control finalgrade-input" placeholder="Final Grade" value="' +
                          (student.grade ? student.grade : "") +
                          '">'
                        : '<span class="readonly-text">' +
                          (student.grade ? student.grade : "") +
                          "</span>") +
                    "</td>" +
                    '<td class="hidden">' +
                    (data.encoding_ongoing &&
                    !data.is_locked &&
                    data.has_access &&
                    data.this_sy &&
                    data.this_sem
                        ? '<input id="completion_' +
                          index +
                          '" type="text" class="form-control completion-input pr-5" placeholder="Completion" value="' +
                          (student.gcompl ? student.gcompl : "") +
                          '">'
                        : '<span class="readonly-text">' +
                          (student.gcompl ? student.gcompl : "") +
                          "</span>") +
                    "</td>" +
                    '<td class="text-right">' +
                    '<a href="javascript:;" class="save-button" data-index=' +
                    index +
                    '">' +
                    '<i class="loading-icon fas fa-check hidden fa-beat"></i>' +
                    "</a>" +
                    "</td>" +
                    "</tr>";

                $("#student-table-body").append(newRow);
            });
        }
    );
}

// Attach event listener to the static parent element (e.g., '#student-table-body')
$("#student-table-body").on(
    "keyup",
    ".midterm-input, .finalterm-input, .finalgrade-input, .completion-input",
    function () {
        var inputValue = $(this).val().toUpperCase();
        var isValid = isValidInput(inputValue, allowedPatterns);

        if (!isValid) {
            // Show an error or suggestion message based on allowedPatterns
            // For example, you can display a tooltip or error message near the input
        }
    }
);

// Custom validation function
function isValidInput(value, allowedPatterns) {
    // Check if the input value is included in the allowedPatterns array
    return allowedPatterns.includes(value);
}

// Fetch allowed patterns from the endpoint
$.get("/faculty-portal/get-allowed-patterns", function (response) {
    allowedPatterns = response.allowedPatterns;

    // Join the allowed patterns into a string for the message
    var allowedValues = allowedPatterns.join(", ");

    // Update the message in the alert
    $("#allowed-patterns-message").text(
        "Note: Only the following values are allowed: " +
            allowedValues +
            ". Please enter a valid value according to this pattern."
    );

    // Attach blur event listener to input fields
    $(document).on(
        "blur",
        ".midterm-input, .finalterm-input, .finalgrade-input, .completion-input",
        function () {
            blurInput($(this));
        }
    );
});

// Add an "edited" class to the edited input fields
function blurInput(inputElement) {
    var row = inputElement.closest("tr");
    var index = row.index();
    var inputValue = inputElement.val().toUpperCase();

    clearTimeout(inputElement.data("timeout"));
    // Add the "edited" class to the input field
    inputElement.addClass("edited");

    inputElement.data(
        "timeout",
        setTimeout(function () {
            if (!isValidInput(inputValue, allowedPatterns)) {
                resetInputAndShowError(inputElement, row);
                row.find(".edited")
                    .removeClass("border-success edited") // Remove success class
                    .addClass("border-danger"); // Add danger class
                return;
            }

            var student = gatherStudentData(row);

            row.find(".loading-icon")
                .removeClass("fa-spinner fa-spin hidden")
                .addClass("fa fa-check text-primary fa-beat");

            $("#allowed-patterns-message_div").removeClass(
                "text-danger fa-beat"
            );
            row.find(".edited")
                .removeClass("border-danger edited") // Remove danger class
                .addClass("border-success"); // Add success class
            saveStudentData(index, student, row);
        }, 1800)
    );
}

// Reset input and show error
function resetInputAndShowError(inputElement, row) {
    inputElement.val("");
    row.find(".loading-icon")
        .removeClass("fa-spinner fa-spin hidden")
        .addClass("fa fa-times text-danger fa-beat");
    $("#allowed-patterns-message_div").addClass("text-danger fa-beat");

    setTimeout(function () {
        row.find(".loading-icon").removeClass(
            "fa fa-times text-danger fa-beat"
        );
        $("#allowed-patterns-message_div").removeClass("text-danger fa-beat");
    }, 1800);
}

// Gather student data from a row
function gatherStudentData(row) {
    return {
        oid: row.find(".oid-input").val().toUpperCase(),
        sy: row.find(".sy-input").val().toUpperCase(),
        sem: row.find(".sem-input").val().toUpperCase(),
        studid: row.find(".studid-input").val().toUpperCase(),
        subjcode: row.find(".subjcode-input").val().toUpperCase(),
        midterm: row.find(".midterm-input").val().toUpperCase(),
        finalterm: row.find(".finalterm-input").val().toUpperCase(),
        finalgrade: row.find(".finalgrade-input").val().toUpperCase(),
        completion: row.find(".completion-input").val().toUpperCase(),
        section: selectedSection, // Convert section to uppercase
        // Add other student data fields as needed
    };
}

// Save student data to the server
function saveStudentData(index, student, row) {
    row.find(".loading-icon")
        .removeClass("fas fa-check hidden")
        .addClass("fa-spinner fa-spin");

    $.post(
        bpath + "faculty-portal/save-student-data",
        {
            _token: _token,
            index: index,
            student: student,
        },
        function (response) {
            // Handle the response from the server if needed
            // console.log(response);

            if (response.success) {
                // Show success icon
                row.find(".loading-icon")
                    .removeClass("fa-spinner fa-spin")
                    .addClass("fas fa-check text-success fa-beat");

                setTimeout(function () {
                    row.find(".loading-icon").removeClass(
                        "fas fa-check text-success fa-beat"
                    );

                    // Apply border-success class to edited input fields
                    row.find(".edited")
                        .removeClass("border-danger edited")
                        .addClass("border-success");
                }, 2000);
            } else {
                // Show error icon
                row.find(".loading-icon")
                    .removeClass("fa-spinner fa-spin")
                    .addClass("fa fa-times text-danger");

                setTimeout(function () {
                    row.find(".loading-icon").removeClass(
                        "fa fa-times text-danger fa-beat"
                    );
                }, 2000);

                // Apply border-success class to edited input fields
                row.find(".edited")
                    .removeClass("border-danger edited")
                    .addClass("border-danger");
            }
        }
    );
}

// Attach a click event listener to the save buttons
$("#student-table-body").on("click", ".save-button", function () {
    var row = $(this).closest("tr");
    var student = gatherStudentData(row);
    var index = row.index();

    saveStudentData(index, student, row);
});

$("#load-button").on("click", function () {
    const el = document.querySelector("#programmatically-dropdown");
    const dropdown = tailwind.Dropdown.getOrCreateInstance(el);
    dropdown.hide();

    // Update the selected values
    selectedSchoolYear = $("#input-filter-6-school-year").val();
    selectedSemester = $("#input-filter-6-semester").val();
    selectedSubject = $("#input-filter-6-subject").val();
    selectedSection = $("#input-filter-6-section").val();
    limit = $("#input-filter-6-paging").val();

    // Construct the new URL with updated values
    var newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?subjcode=" +
        encodeURIComponent(selectedSubject) +
        "&section=" +
        encodeURIComponent(selectedSection) +
        "&sy=" +
        encodeURIComponent(selectedSchoolYear) +
        "&sem=" +
        encodeURIComponent(selectedSemester); // Add any additional query parameters here

    // Use pushState to update the URL without reloading the page
    window.history.pushState({ path: newUrl }, "", newUrl);

    // Call the function to load student data
    loadStudentData();
});

// Add a click event listener to the refresh icon
document.getElementById("refresh-icon").addEventListener("click", function () {
    // Reload the page
    if (
        selectedSchoolYear &&
        selectedSemester &&
        selectedSubject &&
        selectedSection
    ) {
        // Call the function to load student data
        loadStudentData();
    } else {
        location.reload();
    }
});

function loadSettings(type) {
    // Perform an AJAX request to your server to fetch the settings
    $.ajax({
        url: bpath + "faculty-portal/load-settings", // Replace with the actual API endpoint
        method: "GET",
        dataType: "json", // Adjust this based on your API response format
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
            type: type,
        },
        success: function (data) {
            // Log the organized settings for debugging
            // console.log(data);

            // Define an object to store settings based on type
            var settingsByType = {};

            // Iterate through the data and organize settings by type
            data.forEach(function (setting) {
                if (!settingsByType[setting.type]) {
                    settingsByType[setting.type] = {
                        values: [],
                        active: setting.active, // Store the 'active' value
                    };
                }
                settingsByType[setting.type].values.push(setting.value);
            });
            // Log the organized settings for debugging
            // console.log(settingsByType);

            // Update elements based on settings type
            if (settingsByType["to"]) {
                // Update the modal content for 'Encoding Date'
                var fromDate = settingsByType["from"].values[0];
                var toDate = settingsByType["to"].values[0];
                $(".text_div_encoding_date").text(fromDate + " - " + toDate);

                // Set the 'active' state of the checkbox
                var encodingDateActive = settingsByType["to"].active;
                $("#checkbox_encoding_date").prop(
                    "checked",
                    encodingDateActive == 1 ? true : false
                );
            }

            if (settingsByType["sy"]) {
                // Update the modal content for 'School Year'
                var sy = settingsByType["sy"].values[0];
                $(".text_div_school_year").text(sy);

                // Set the 'active' state of the checkbox
                var schoolYearActive = settingsByType["sy"].active;
                $("#checkbox_school_year").prop(
                    "checked",
                    schoolYearActive == 1 ? true : false
                );
            }

            if (settingsByType["sem"]) {
                // Update the modal content for 'School Year'
                var sem = settingsByType["sem"].values[0];
                $(".text_div_sem").text(sem);

                // Set the 'active' state of the checkbox
                var semActive = settingsByType["sem"].active;
                $("#checkbox_sem").prop(
                    "checked",
                    semActive == 1 ? true : false
                );
            }

            if (settingsByType["notif"]) {
                // Update the modal content for 'Notification'
                var notification = settingsByType["notif"].values[0];
                $(".text_div_notification").text(notification);
                $(".text_span_notification").text(notification);
                $("#modal-form-1-text-notification").val(notification);

                // Set the 'active' state of the checkbox
                var notificationActive = settingsByType["notif"].active;
                $("#checkbox_notification").prop(
                    "checked",
                    notificationActive == 1 ? true : false
                );

                var notificationDiv = $("#notification_div");

                if (notificationActive == 1) {
                    // Show the notification
                    notificationDiv.show();
                } else {
                    // Hide the notification
                    notificationDiv.hide();
                }
            }
        },

        error: function (error) {
            console.error("Error loading settings:", error);
        },
    });
}

// Handle click on "Encoding Date" link
$("body").on("click", ".load_setting_class", function () {
    event.preventDefault();
    const type = $(this).data("type");
    loadSettings(type);
});

// Attach a click event handler to the checkboxes
$(".form-check-input").on("click", function () {
    // Get the associated setting type based on the DOM structure
    var settingType = $(this)
        .closest(".flex")
        .find(".load_setting_class")
        .data("type");

    // Determine whether the checkbox is checked or unchecked
    var isActive = $(this).prop("checked") ? 1 : 0;

    // Send an AJAX request to update the 'active' column in the database
    $.ajax({
        url: bpath + "faculty-portal/update-active", // Replace with your update API endpoint
        method: "POST", // Use POST or PUT method based on your API
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
            type: settingType,
            active: isActive,
        },
        success: function (response) {
            // Handle the response if needed
            // console.log(settingType, isActive);

            // Assuming you have a notification div with an id "notification"
            var notificationDiv = $("#notification_div");

            if (isActive == 1 && settingType == "Notification") {
                // Show the notification
                notificationDiv.show();
            } else if (isActive == 0 && settingType == "Notification") {
                // Hide the notification
                notificationDiv.hide();
            }
        },
        error: function (error) {
            console.error("Error updating setting:", error);
        },
    });
});

// Add an event listener to the "Save" button
$(".btn-save-modal-setting").on("click", function () {
    // Get the selected values from the modal inputs
    var modalType = $(this).data("modal-type");
    var selectedSchoolYear = $("#school-year-select").val();
    var selectedSemester = $("#sem-select").val();
    var fromDate = $("#modal-form-1-to").val();
    var toDate = $("#modal-form-2-from").val();
    var notificationText = $("#modal-form-1-text-notification").val();

    // Send an AJAX request to save the data
    $.ajax({
        url: bpath + "faculty-portal/save-gs-settings", // Replace with the actual URL for saving
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
            modalType: modalType,
            schoolYear: selectedSchoolYear,
            semester: selectedSemester,
            fromDate: fromDate,
            toDate: toDate,
            notificationText: notificationText,
        },
        success: function (response) {
            // Handle the success response if needed
            // console.log('Data saved successfully:', response);
            loadSettings("");
            loadStudentData();
        },
        error: function (error) {
            // Handle any errors that occur during the AJAX request
            console.error("Error saving data:", error);
        },
    });
});

function load_allowed_dropdown() {
    agency_employee = $("#allow_agency_employee").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });

    name_select = $("#name_select").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
}

function load_allowed_to_link_datatable() {
    try {
    /***/
        dt__linked_data = $("#dt__allowed_users").DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-5 text_left_1'l><'intro-y col-span-5 text_left_1'f>>" +
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
                    targets: [1],
                    orderable: false,
                },
            ],
        });

        /***/
    } catch (err) { }
}

function load_allowed_data_list() {
    showLoading();
    $.ajax({
        url: bpath + "faculty-portal/load-allowed-personel",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            dt__linked_data.clear().draw();
            /***/
            var data = JSON.parse(data);



            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/

                    var agency_id = data[i]["agency_id"];
                    var fullname = data[i]["fullname"];
                    var id = data[i]["id"];
                    console.log(agency_id);
                    /***/
                    cd = `<tr data-id="${id}">
                                <td class="agency_id">${agency_id}</td>
                                <td class="fullname">${fullname}</td>
                                <td class="fullname">${fullname}</td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        <a id="delete_linked_person" href="javascript:;" data-id="${id}" class="zoom-in w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-danger text-2xl shadow-md">
                                            <i class="w-4 h-4 fas fa-trash"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>`;

                    dt__linked_data.row.add($(cd)).draw();
                    /***/
                    // console.log(cd);
                }
            }
            hideLoading();
        },
    });
}

function addPersonToDatabase(employeeId) {
    $.ajax({
        url: bpath + "faculty-portal/add-allowed-personel", // Replace with the actual URL for your backend
        type: "POST",
        data: {
            _token: _token, // Include your CSRF token if needed
            employeeId: employeeId,
        },
        success: function (response) {
            if (response.success) {
                // The person was successfully added to the database
                // Now, you can add the person to the table
                load_allowed_data_list();
            } else {
                // Handle any error messages or display an alert
                alert("Error: " + response.message);
            }
        },
        error: function () {
            // Handle AJAX errors here
            alert("An error occurred while adding the person.");
        },
    });
}

$("#add_person_button").on("click", function () {
    var employeeId = $("#allow_agency_employee").val();
    if (employeeId) {
        addPersonToDatabase(employeeId);
    } else {
        alert("Please select an employee to add.");
    }
});

// Update the event handler for the delete button
$(document).on("click", "#delete_linked_person", function () {
    var personId = $(this).data("id");

    // Show a confirmation dialog
    if (confirm("Are you sure you want to delete this person?")) {
        deletePersonFromDatabase(personId);
    }
});

function deletePersonFromDatabase(personId) {
    $.ajax({
        url: bpath + "faculty-portal/delete-allowed-personel", // Replace with your backend delete endpoint
        type: "POST",
        data: {
            _token: _token, // Include your CSRF token if needed
            personId: personId,
        },
        success: function (response) {
            if (response.success) {
                // The person was successfully deleted from the database
                // Now, you can remove the person from the table
                removePersonFromTable(personId);
            } else {
                // Handle any error messages or display an alert
                alert("Error: " + response.message);
            }
        },
        error: function () {
            // Handle AJAX errors here
            alert("An error occurred while deleting the person.");
        },
    });
}

function removePersonFromTable(personId) {
    // Find the row with the matching data-id attribute and remove it
    dt__linked_data
        .row($('tr[data-id="' + personId + '"]'))
        .remove()
        .draw();
}

$("#lockSubject").on("click", function () {
    var lockSubjectButton = $(this);
    var isLockedAttributePresent =
        lockSubjectButton.attr("data-is-locked") != null;

    if (!isLockedAttributePresent) {
        Swal.fire({
            title: "Data Not Found",
            text: "No subject selected.",
            type: "warning",
            confirmButtonColor: "#1e40af",
        });
    } else {
        var isLocked =
            isLockedAttributePresent &&
            lockSubjectButton.attr("data-is-locked") === "true";
        var action = isLocked ? "unlock" : "lock";
        var buttonText = isLocked ? "Unlock" : "Lock";

        if (isLocked) {
            // The subject is already locked, show an information message
            Swal.fire({
                title: "Subject Already Locked!",
                text: "The subject is already locked. Unlocking is not available.",
                type: "info",
                confirmButtonColor: "#1e40af",
            });
        } else {
            // The subject is not locked, show the confirmation message
            var swalMessage =
                "Are you sure you want to " +
                buttonText +
                " this subject? This action cannot be undone.";

            Swal.fire({
                title: "" + buttonText + " Subject Confirmation",
                text: swalMessage,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1e40af",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, " + buttonText + " it!",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.value) {
                    // Lock the subject using AJAX call
                    $.ajax({
                        url: bpath + "faculty-portal/update-subject-lock",
                        type: "POST",
                        data: {
                            selectedSchoolYear: selectedSchoolYear,
                            selectedSemester: selectedSemester,
                            selectedSubject: selectedSubject,
                            selectedSection: selectedSection,
                            _token: _token,
                            action: action,
                        },
                        success: function (response) {
                            if (response.success) {
                                loadStudentData();
                                var newIsLocked = !isLocked;
                                lockSubjectButton.attr(
                                    "data-is-locked",
                                    newIsLocked.toString()
                                );
                                lockSubjectButton
                                    .find("i")
                                    .attr(
                                        "data-lucide",
                                        newIsLocked ? "lock" : "unlock"
                                    );
                                swal({
                                    title: buttonText + "ed!",
                                    text:
                                        action.charAt(0).toUpperCase() +
                                        action.slice(1) +
                                        "ed! The subject has been " +
                                        action +
                                        "ed.",
                                    type: "success",
                                    confirmButtonColor: "#1e40af",
                                });
                            } else {
                                swal({
                                    title: "Error!",
                                    text:
                                        "Failed to " +
                                        buttonText +
                                        " the subject.",
                                    type: "error",
                                    confirmButtonColor: "#d33",
                                });
                            }
                        },
                        error: function () {
                            swal({
                                title: "Error!",
                                text: "An error occurred while updating the subject.",
                                type: "error",
                                confirmButtonColor: "#d33",
                            });
                        },
                    });
                }
            });
        }
    }
});

function loadSignatoriesFromLocalStorage() {
    const signatoriesData = JSON.parse(
        localStorage.getItem("signatoriesTableData")
    );
    if (signatoriesData) {
        const $signatoriesTableBody = $("#signatories_table tbody");

        // Iterate over stored data and append rows to the table
        signatoriesData.forEach(function (row) {
            const newRow = $("<tr></tr>");
            newRow.append(`<td contenteditable='true'>${row.description}</td>`);
            newRow.append(`<td contenteditable='true'>${row.name}</td>`);
            newRow.append(
                `<td style="display: none;">${row.selectedNameId}</td>`
            );
            newRow.append(`<td contenteditable='true'>${row.position}</td>`);

            const removeButton = $("<button></button>")
                .text("Remove")
                .addClass("btn btn-danger btn-sm")
                .on("click", function () {
                    $(this).closest("tr").remove();
                    updateLocalStorage();
                });

            newRow.append($("<td></td>").append(removeButton));
            $signatoriesTableBody.append(newRow);
        });
    }
}

function appendToSignatoriesTable() {
    const $descriptionInput = $("#description_input");
    const $nameSelect = $("#name_select");
    const $positionInput = $("#position_input");
    const $signatoriesTableBody = $("#signatories_table tbody");

    // Get the values from the input fields
    const description = $descriptionInput.val().trim();
    const selectedName = $nameSelect.find("option:selected");
    const name = selectedName.text();
    const selectedNameId = selectedName.val();
    const position = $positionInput.val().trim();

    const modalSignatoryDiv = $("#modalSignatoryDiv");

    // Validate the required fields
    if (!description || !selectedNameId) {
        modalSignatoryDiv.addClass("has-error");
        toastr.error("Please select a person before adding a signatory.");
        $("#name_select").select2("open");
        return; // Exit the function if validation fails
    }

    modalSignatoryDiv.removeClass("has-error");

    // Create a new table row
    const newRow = $("<tr></tr>");

    // Insert cells with the values
    const descriptionCell = $("<td contenteditable='true'></td>").text(
        description
    );
    const nameCell = $("<td contenteditable='true'></td>").text(name);
    const nameIdCell = $("<td></td>")
        .text(selectedNameId)
        .css("display", "none");
    const positionCell = $("<td contenteditable='true'></td>").text(position);

    // Create the "Remove" button and add the click event to remove the row
    const removeButton = $("<button></button>")
        .text("Remove")
        .addClass("btn btn-danger btn-sm")
        .on("click", function () {
            $(this).closest("tr").remove(); // Remove the row when the button is clicked
            updateLocalStorage(); // Update localStorage after removing the row
        });
    const actionCell = $("<td></td>").append(removeButton);

    // Append cells to the row
    newRow.append(
        descriptionCell,
        nameCell,
        nameIdCell,
        positionCell,
        actionCell
    );

    // Append the row to the table's tbody
    $signatoriesTableBody.append(newRow);

    // Clear the input fields
    $descriptionInput.val("");
    $nameSelect.val(""); // Reset the select to the first option
    $positionInput.val("");

    // Update localStorage with the table data
    updateLocalStorage();
}

function updateLocalStorage() {
    const tableData = [];

    // Iterate over table rows and store data in an array
    $("#signatories_table tbody tr").each(function () {
        const cells = $(this).find("td");
        const rowData = {
            description: cells.eq(0).text(),
            name: cells.eq(1).text(),
            selectedNameId: cells.eq(2).text(),
            position: cells.eq(3).text(),
        };
        tableData.push(rowData);
    });

    // Save table data to localStorage
    localStorage.setItem("signatoriesTableData", JSON.stringify(tableData));
}

// Use event delegation to handle the "Add Person" button click
$(document).on("click", "#add_person_button_signatories", function () {
    appendToSignatoriesTable();
    load_allowed_dropdown();
});

// Handle the "Print" button click
$("#print_button").on("click", function () {
    // Get the selected value from the "print_options_select" dropdown
    const selectedPrintOption = $("#print_options_select").val();

    // Get the values from the table
    const tableValues = [];
    $("#signatories_table tbody tr").each(function () {
        const rowValues = {
            description: $(this).find("td:eq(0)").text(),
            name: $(this).find("td:eq(1)").text(),
            id: $(this).find("td:eq(2)").text(), // Include the hidden ID
            position: $(this).find("td:eq(3)").text(),
        };
        tableValues.push(rowValues);
    });

    // Construct the URL with query parameters
    const printUrl = bpath + "faculty-portal/print-report-of-grades"; // Replace with your print page URL
    const queryParams = `?option=${selectedPrintOption}&data=${JSON.stringify(
        tableValues
    )}&selectedSchoolYear=${selectedSchoolYear}&selectedSemester=${selectedSemester}&selectedSubject=${selectedSubject}&selectedSection=${selectedSection}`;
    const fullUrl = printUrl + queryParams;

    // Open a new tab with the constructed URL
    window.open(fullUrl, "_blank");

    // Optionally, you can implement the actual printing logic on the print page
});
