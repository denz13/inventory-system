var _token = $('meta[name="csrf-token"]').attr("content");
var user_id_global;
var user_agency_id;
var tbldata_manage_users;
var modal_designation_id;
var modal_position_id;
var modal_rc_id;
var modal_employee_id;
var modal_employment_type;
var filter_employment_type;
var modal_employee_status;
var modal_sp_id;
var modal_pa_id;
var user_id;
var global_agency_id;
var filterTimeout;
var groupSearch = "";
var currentPage = 1;
var totalPages = 1;
var filter = "";
var perPage = 10;
var page = 1;
var user_agency_global;
var empploy_typeID = 0;
$(document).ready(function () {
    bpath = __basepath + "/";
    load_datatable();
    load_accounts();
    load_user_id();
    reload_dropdowns();
    handle_print();
    fetchUsers(page, filter, perPage);
    load_allowed_dropdown();
    populateTableFromLocalStorage();

    // Call the loadSettingsData function when the document is ready
    loadSettingsData();
    loadEmploymentType();
});

$(document).on("select2:open", function (e) {
    document
        .querySelector(`[aria-controls="select2-${e.target.id}-results"]`)
        .focus();
});

function appendToSignatoriesTable() {
    const $descriptionInput = $("#description_input");
    const $nameSelect = $("#name_select");
    const $positionInput = $("#position_input");
    const $signatoriesTableBody = $("#signatories_table tbody");

    // Get the values from the input fields
    const description = $descriptionInput.val();
    const name = $nameSelect.find("option:selected").text();
    const position = $positionInput.val();

    // Get the selected name's ID
    const selectedNameId = $nameSelect.val();

    // Validate the required fields
    if (description.trim() === "") {
        alert("Please fill out Description and select a Name.");
        return; // Exit the function if validation fails
    }

    // Create a new table row
    const newRow = $("<tr></tr>");

    // Insert cells with the values
    const descriptionCell = $("<td></td>").text(description);
    const nameCell = $("<td></td>").text(name);

    // Hidden cell for the selected name's ID
    const nameIdCell = $("<td></td>")
        .text(selectedNameId)
        .css("display", "none"); // Hide this cell

    const positionCell = $("<td></td>").text(position);

    // Create the "Remove" button and add the click event to remove the row
    const removeButton = $("<button></button>")
        .text("Remove")
        .addClass("btn btn-danger btn-sm")
        .on("click", function () {
            $(this).closest("tr").remove(); // Remove the row when the button is clicked
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
}

// Use event delegation to handle the "Add Person" button click
$(document).on("click", "#add_person_button_signatories", function () {
    appendToSignatoriesTable();
    load_allowed_dropdown();
});

function load_allowed_dropdown() {
    name_select = $("#name_select").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
    });
}

function handle_print() {
    $(document).on("click", "#account_coe_btn", function () {
        user_id = $(this).data("usr-id");
        global_agency_id = $(this).data("agency-id");
    });

    // Handle the "Print" button click
    $("#print_button").on("click", function () {
        // Get the selected value from the "print_options_select" dropdown
        // const user_id = $(this).data('usr-id');
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
        const printUrl = bpath + "admin/print-certificate-of-employment"; // Replace with your print page URL
        const queryParams = `?option=${selectedPrintOption}&employee_id=${user_id}&data=${JSON.stringify(
            tableValues
        )}`;
        const fullUrl = printUrl + queryParams;

        // Open a new tab with the constructed URL
        window.open(fullUrl, "_blank");

        // Optionally, you can implement the actual printing logic on the print page
    });
}

function load_datatable() {
    try {
        /***/
        tbldata_manage_users = $("#dt__manage_users")
            .DataTable({
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

                columnDefs: [{ className: "dt-head-center", targets: [6] }],
            })
            .on("draw", function () {
                //console.log("drawing");
                if (!tbldata_manage_users.data().any()) {
                    $("#dt__manage_users").children().hide();
                } else {
                    $("#dt__manage_users").children().show();
                }
            });

        modal_designation_id = $("#modal_designation_id").select2({
            placeholder: "Select Designation",
            allowClear: true,
            closeOnSelect: true,
        });

        modal_position_id = $("#modal_position_id").select2({
            placeholder: "Select Position",
            allowClear: true,
            closeOnSelect: true,
        });

        modal_rc_id = $("#modal_rc_id").select2({
            placeholder: "Select Responsibility Center",
            allowClear: true,
            closeOnSelect: true,
        });

        modal_employee_id = $("#modal_employee_id").select2({
            allowClear: true,
            closeOnSelect: true,
        });

        modal_sp_id = $("#modal_sp_id").select2({
            placeholder: "Select Separation Cause",
            allowClear: true,
            closeOnSelect: true,
        });

        modal_pa_id = $("#modal_pa_id").select2({
            placeholder: "Select Place Assignment",
            allowClear: true,
            closeOnSelect: true,
        });

        /***/
    } catch (err) {}
}

function reload_dropdowns() {
    modal_designation_id = $("#modal_designation_id").select2({
        placeholder: "Select Designation",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_position_id = $("#modal_position_id").select2({
        placeholder: "Select Position",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_rc_id = $("#modal_rc_id").select2({
        placeholder: "Select Responsibility Center",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employee_id = $("#modal_employee_id").select2({
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employment_type = $("#modal_employment_type").select2({
        placeholder: "Select Employment Type",
        allowClear: true,
        closeOnSelect: true,
    });

    filter_employment_type = $("#filter_employment_type").select2({
        placeholder: "Filter Employment Type",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employee_status = $("#modal_employee_status").select2({
        placeholder: "Select Employment Status",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_sp_id = $("#modal_sp_id").select2({
        placeholder: "Select Separetion Cause",
        allowClear: true,
        closeOnSelect: true,
    });
    modal_pa_id = $("#modal_pa_id").select2({
        placeholder: "Select Place Assignment",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_account_role_name = $("#modal_account_role_namedd").select2({
        placeholder: "Select User Role",
        allowClear: true,
        closeOnSelect: true,
    });
}

function load_accounts(filter_data) {
    showLoading();
    $.ajax({
        url: bpath + "admin/manage/user/load",
        type: "POST",
        data: {
            _token: _token,
            filter_data: filter_data,
        },
        success: function (data) {
            tbldata_manage_users.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    /***/
                    var account_id = data[i]["account_id"];
                    var agency_id = data[i]["agency_id"];
                    var name = data[i]["name"];
                    var deleted = data[i]["deleted"];
                    var last_seen = data[i]["last_seen"];
                    var username = data[i]["username"];
                    var can_delete = data[i]["can_delete"];
                    var read = 1;

                    var cd = "";
                    /***/

                    var cd = `
                                <tr>
                                    <td style="display: none">
                                        <input class="form-check-input user_check[]" name="user_check" type="checkbox" value="${agency_id}" id="user_check[]">
                                    </td>
                                    <td style="display: none" class="user_id">${agency_id}</td>
                                    <td class="w-auto">${name}</td>
                                    <td>${last_seen}</td>
                                    <td>${deleted}</td>
                                    <td>
                                        <span class="text">${username}</span>
                                    </td>
                                    <td class="w-auto">
                                        <div class="flex justify-center items-center">
                                            <a id="account_details_btn" href="javascript:;" data-usr-id="${account_id}" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Details">
                                                <i class="fa fa-info text-slate-500 text-success"></i>
                                            </a>
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                                <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                                    <i class="fa fa-ellipsis-h items-center text-center text-primary"></i>
                                                </a>
                                                <div id="account_action_dropdown" class="dropdown-menu w-40">
                                                    <div class="dropdown-content">
                                                        <a id="btn_print_cert_of_employment" href="javascript:;" class="dropdown-item" data-usr-id="${account_id}">
                                                            <i class="fa fa-file w-4 h-4 mr-2 text-success"></i> COE
                                                        </a>
                                                        <a id="btn_showIncomingDetails" href="javascript:;" class="dropdown-item" data-usr-id="${account_id}">
                                                            <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details
                                                        </a>
                                                        ${can_delete}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `;

                    tbldata_manage_users.row.add($(cd)).draw();

                    /***/
                }
            }
            hideLoading();
        },
    });
}

function load_user_id(user_id) {
    showLoading();

    $.ajax({
        url: bpath + "admin/manage/user/load/id",
        type: "POST",
        data: {
            _token: _token,
            user_id: user_id,
        },
        success: function (data) {
            var data = JSON.parse(data);

            $("#div_user_details").empty();
            $("#div_user_profile").empty();
            $("#div_user_employment").empty();

            $("#filer_Active").empty();
            $("#filer_Inactive").empty();
            $("#filer_ActiveToday").empty();
            $("#filer_Users").empty();
            $("#filer_Employees").empty();
            $("#filer_Applicants").empty();
            $("#filer_Admin").empty();
            $("#filer_Unused").empty();

            $("#filer_newAccount").empty();
            $("#filer_Verified").empty();
            $("#filer_Unverified").empty();
            $("#filer_Missing").empty();

            $("#div_user_details").append(data.user_info);
            $("#div_user_profile").append(data.profile_info);
            $("#div_user_employment").append(data.employment_info);

            $("#filer_Active").append(data.accounts_Active + " User(s)");
            $("#filer_Inactive").append(data.accounts_Inactive + " User(s)");
            $("#filer_ActiveToday").append(
                data.accounts_ActiveToday + " User(s)"
            );
            $("#filer_Users").append(
                data.accounts_Users +
                    " User(s) / " +
                    data.accounts_UsersRemoved +
                    " Removed "
            );
            $("#filer_Employees").append(data.accounts_Employees + " User(s)");
            $("#filer_Applicants").append(
                data.accounts_Applicants + " User(s)"
            );
            $("#filer_Admin").append(data.accounts_Admin + " User(s)");
            $("#filer_Unused").append(data.accounts_Guest + " User(s)");

            $("#filer_newAccount").append(
                data.accounts_newAccounts + " User(s)"
            );
            $("#filer_Verified").append(data.accounts_Verified + " User(s)");
            $("#filer_Unverified").append(
                data.accounts_Unverified + " User(s)"
            );
            $("#filer_Missing").append(data.accounts_Missing + " User(s)");

            user_id_global = data.user_id_global;
            user_agency_id = data.user_agency_id;

            __notif_load_data(__basepath + "/");

            hideLoading();
        },
    });
}

$("body").on("click", "#add_new_account", function () {
    clear_fields();
});

$("body").on("click", ".no_user_priv", function () {
    clear_fields();

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

$("body").on("click", "#account_details_btn", function (ev) {
    user_id = $(this).data("usr-id");
    user_id_global = $(this).data("usr-id");

    user_agency_id = $(this).data("agency-id");

    load_user_id(user_agency_id);
});

$("body").on("click", "#account_remove_btn", function (ev) {
    // Prevent the default behavior of the event
    ev.preventDefault();

    user_agency_id = $(this).data("agency-id");

    // Show a SweetAlert dialog with a dropdown for user choice
    Swal.fire({
        title: "Select Action",
        type: "info",
        html:
            '<div style="margin-bottom: 10px;">This action will remove or recover the user.</div>' +
            '<select id="action-select" class="form-select mt-2 sm:mr-2">' +
            '<option value="remove">Remove</option>' +
            '<option value="recover">Recover</option>' +
            "</select>",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            // User confirmed the action
            var action = $("#action-select").val();
            var active = action === "remove" ? 0 : 1; // Set active based on user choice

            // Make an AJAX request to perform the operation
            $.ajax({
                url: bpath + "admin/manage/user/remove/id",
                type: "POST",
                data: {
                    _token: _token,
                    user_agency_id: user_agency_id,
                    active: active,
                },
                success: function (response) {
                    // Handle success response
                    load_user_id(user_id_global);
                    // Optionally, you can reload the page or update the UI as needed
                    fetchUsers(page, filter, perPage);
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    console.error("Error:", error);
                },
            });
        }
    });
});

$("body").on("click", "#account_delete_btn", function (ev) {
    // Prevent the default behavior of the event
    ev.preventDefault();

    user_agency_id = $(this).data("agency-id");

    // Show a SweetAlert dialog with an input field for the password
    Swal.fire({
        title: "Enter Password",
        type: "info",
        html:
            '<div style="margin-bottom: 10px;">This action is irreversible.</div>' +
            '<div class="mt-3 sm:mt-0 relative text-slate-500">' +
            '<i style="cursor: pointer" class="fas fa-eye w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0 toggle-password"></i>' +
            '<input id="swal-password-input" type="password" class="form-control sm:w-full box pl-10 password-input"' +
            'placeholder="Enter your password.">' +
            "</div>",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            // User confirmed the action
            var password = $("#swal-password-input").val();

            // Make an AJAX request to perform the operation
            $.ajax({
                url: bpath + "admin/manage/user/delete/id",
                type: "POST",
                data: {
                    _token: _token,
                    user_agency_id: user_agency_id,
                    password: password,
                },
                success: function (response) {
                    if (response.success) {
                        // Show success SweetAlert
                        Swal.fire({
                            title: "Success",
                            type: "success",
                            text: response.message,
                        });
                        // Optionally, you can reload the page or update the UI as needed
                        fetchUsers(page, filter, perPage);
                        load_user_id();
                    } else {
                        // Show error SweetAlert
                        Swal.fire({
                            title: "Error",
                            type: "error",
                            text: response.message,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    console.error("Error:", error);
                },
            });
        }
    });
});

// Toggle password visibility when the eye icon is clicked
$("body").on("click", ".toggle-password", function () {
    var passwordInput = $(".password-input");
    var icon = $(this);

    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
        icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        passwordInput.attr("type", "password");
        icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});

$("body").on("click", "#sync_data_account_profile_employee", function (ev) {
    showLoading();

    // Check if the anchor element exists
    const anchorElement = document.getElementById("load_account_edit");
    let dataAccId = null;

    if (anchorElement) {
        // Get the value of data-acc-id attribute
        dataAccId = anchorElement.getAttribute("data-acc-id");
    } else {
        console.log("Anchor element not found.");
    }

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/sync/account/profile/employee/temp",
            type: "POST",
            data: {
                _token: _token,
                includ_account: dataAccId,
            },
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data);
                __notif_load_data(__basepath + "/");
                hideLoading();
            },
        });
    }
});

$("body").on("click", "#sync_data_correction", function (ev) {
    showLoading();

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url:
                bpath + "admin/manage/sync/account/profile/employee/correction",
            type: "POST",
            data: {
                _token: _token,
            },
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data);
                __notif_load_data(__basepath + "/");
                hideLoading();
            },
        });
    }
});

$("body").on("click", "#export_data_account_profile_employee", function (ev) {
    // showLoading();
    // $.ajax({
    // 	url: bpath + 'admin/manage/sync/account/profile/employee/temp',
    // 	type: "POST",
    // 	data: {
    // 		_token: _token,
    // 	},
    // 	success: function(data) {
    //         var data = JSON.parse(data);
    //         //__notif_load_data(__basepath + "/");
    //         hideLoading();
    //         //location.reload();
    //     }
    // });
});

$("body").on("click", "#load_account_edit", function (ev) {
    account_id = $(this).data("acc-id");

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/edit/account/id",
            type: "POST",
            data: {
                _token: _token,
                account_id: account_id,
            },
            success: function (data) {
                var data = JSON.parse(data);

                clear_fields();

                $("#modal_account_id").val(data["load_account"]["id"]);

                $("#account_modal_id").val(data["load_account"]["id"]);
                $("#modal_account_agency_id").val(
                    data["load_account"]["employee"]
                );
                $("#modal_account_first_name").val(
                    data["load_account"]["firstname"]
                );
                $("#modal_account_last_name").val(
                    data["load_account"]["lastname"]
                );
                $("#modal_account_active_date").val(data["active_date"]);
                $("#modal_account_expire_date").val(data["expire_date"]);
                $("#modal_account_username").val(
                    data["load_account"]["username"]
                );
                $("#modal_account_password").val(data["password_tex"]);
                $("#modal_account_role_namedd")
                    .val(data["load_account"]["role_name"])
                    .trigger("change");
                $("#modal_account_last_seen").val(
                    data["load_account"]["last_seen"]
                );
                $("#account_status_modal_title").empty();
                $("#account_status_modal_title").append(data.go_no_go);
            },
        });
    }
});

$("body").on("click", "#load_profile_edit", function (ev) {
    profile_id = $(this).data("pro-id");

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/edit/profile/id",
            type: "POST",
            data: {
                _token: _token,
                profile_id: profile_id,
            },
            success: function (data) {
                var data = JSON.parse(data);

                $("#profile_modal_id").val(data["load_profile"]["id"]);

                $("#modal_profile_last_name").val(
                    data["load_profile"]["lastname"]
                );
                $("#modal_profile_first_name").val(
                    data["load_profile"]["firstname"]
                );
                $("#modal_profile_mid_name").val(data["load_profile"]["mi"]);
                $("#modal_profile_name_extension").val(
                    data["load_profile"]["extension"]
                );
                $("#modal_profile_date_birth").val(
                    data["load_profile"]["dateofbirth"]
                );
                $("#modal_application_gender").val(data["load_profile"]["sex"]);
                $("#modal_profile_civil_status").val(
                    data["load_profile"]["civilstatus"]
                );
                $("#modal_profile_height").val(data["load_profile"]["height"]);
                $("#modal_profile_weight").val(data["load_profile"]["weight"]);
                $("#modal_profile_blood_type").val(
                    data["load_profile"]["bloodtype"]
                );
                $("#modal_profile_gsis").val(data["load_profile"]["gsis"]);
                $("#modal_profile_pagibig").val(
                    data["load_profile"]["pagibig"]
                );
                $("#modal_profile_philhealth").val(
                    data["load_profile"]["philhealth"]
                );
                $("#modal_profile_tin").val(data["load_profile"]["tin"]);
                $("#modal_profile_agency").val(
                    data["load_profile"]["agencyid"]
                );
                $("#modal_profile_age").val(data["load_profile"]["agencyid"]);
                $("#modal_profile_tel_number").val(
                    data["load_profile"]["telephone"]
                );
                $("#modal_profile_mobile_number").val(
                    data["load_profile"]["mobile_number"]
                );
                $("#modal_profile_email").val(data["load_profile"]["email"]);
                $("#modal_profile_place_birth").val(
                    data["load_profile"]["placeofbirth"]
                );
                $("#profile_print_modal_title").empty();
                $("#profile_print_modal_title").append(
                    data["profile_pint_and_title"]
                );
            },
        });
    }
});

$("body").on("click", "#load_employee_edit", function (ev) {
    employee_id = $(this).data("emp-id");

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/edit/employee/id",
            type: "POST",
            data: {
                _token: _token,
                employee_id: employee_id,
            },
            success: function (data) {
                var data = JSON.parse(data);
                clear_fields();

                $("#modal_update_emp_id").val(data["load_employee"]["id"]);

                $("#modal_employment_type").val(
                    data["load_employee"]["employment_type"]
                );
                $("#modal_start_date").val(data["load_employee"]["start_date"]);
                $("#modal_end_date").val(data["load_employee"]["end_date"]);

                $("#modal_designation_id").val(
                    data["load_employee"]["designation_id"]
                );

                $("#modal_position_id").val(
                    data["load_employee"]["position_id"]
                );
                $("#modal_rc_id").val(data["load_employee"]["office_id"]);
                $("#modal_salary").val(data["load_employee"]["salary_amount"]);
                $("#modal_employee_status").val(
                    data["load_employee"]["status"]
                );
                $("#modal_sp_id").val(data["load_employee"]["separation_id"]);
                $("#modal_pa_id").val(data["load_employee"]["place_assign"]);

                console.log(data["load_employee"]["place_assign"]);
                var new_Data = new Option(
                    data["load_employee"]["agency_id"],
                    data["load_employee"]["agency_id"],
                    true,
                    true
                );
                modal_employee_id.append(new_Data).trigger("change");
                modal_employee_id.val(data["load_employee"]["agency_id"]);
                modal_employee_id.trigger("change");
                modal_designation_id.trigger("change");
                modal_position_id.trigger("change");
                modal_employment_type.trigger("change");
                modal_rc_id.trigger("change");
                modal_employee_status.trigger("change");
                modal_sp_id.trigger("change");
                modal_pa_id.trigger("change");
            },
        });
    }
});

$("body").on("click", "#load_account_nodata", function (ev) {
    clear_fields();
});

$("body").on("click", "#load_employee_no_data", function (ev) {
    clear_fields();
});

$("body").on("click", "#load_profile_nodata", function (ev) {
    clear_fields();
});

$("body").on("click", "#load_account_save", function (ev) {
    ev.preventDefault();

    $(this).prop("disabled", true);
    account_id = $("#account_modal_id").val();
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/save/account",
            type: "POST",
            data: {
                _token: _token,
                account_id: account_id,
                modal_account_agency_id: $("#modal_account_agency_id").val(),
                modal_account_first_name: $("#modal_account_first_name").val(),
                modal_account_last_name: $("#modal_account_last_name").val(),
                modal_account_acti: $("#modal_account_acti").val(),
                modal_account_expi: $("#modal_account_expi").val(),
                modal_account_username: $("#modal_account_username").val(),
                modal_account_password: $("#modal_account_password").val(),
                modal_account_role_name: $("#modal_account_role_namedd").val(),
                modal_account_last_seen: $("#modal_account_last_seen").val(),
                modal_account_verify: $("#modal_account_verify").val(),
                modal_account_verified_at: $("#modal_account_verified").val(),
                modal_account_active_date: $(
                    "#modal_account_active_date"
                ).val(),
                modal_account_expire_date: $(
                    "#modal_account_expire_date"
                ).val(),
            },
            beforeSend: function () {
                // Add loading icon
                $("#load_account_save").html(
                    '<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-5 h-5"> <g fill="none" fill-rule="evenodd" stroke-width="4"> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> </g> </svg>'
                );
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#account_modal"));
                mdl.hide();

                __notif_load_data(__basepath + "/");

                clear_fields();
                load_user_id(user_id_global);
                fetchUsers(page, filter, perPage);
            },
            complete: function () {
                // Remove loading icon and enable the button
                $("#load_account_save").html("Save").prop("disabled", false);
            },
        });
    }
});

$("body").on("click", "#load_profile_save", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    $(this).prop("disabled", true);
    profile_id = $("#profile_modal_id").val();

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/save/profile",
            type: "POST",
            data: {
                _token: _token,
                profile_id: profile_id,
                user_id_global: user_id_global,
                modal_profile_last_name: $("#modal_profile_last_name").val(),
                modal_profile_first_name: $("#modal_profile_first_name").val(),
                modal_profile_mid_name: $("#modal_profile_mid_name").val(),
                modal_profile_name_extension: $(
                    "#modal_profile_name_extension"
                ).val(),
                modal_profile_date_birth: $("#modal_profile_date_birth").val(),
                modal_application_gender: $("#modal_application_gender").val(),
                modal_profile_civil_status: $(
                    "#modal_profile_civil_status"
                ).val(),
                modal_profile_height: $("#modal_profile_height").val(),
                modal_profile_weight: $("#modal_profile_weight").val(),
                modal_profile_blood_type: $("#modal_profile_blood_type").val(),
                modal_profile_gsis: $("#modal_profile_gsis").val(),
                modal_profile_pagibig: $("#modal_profile_pagibig").val(),
                modal_profile_philhealth: $("#modal_profile_philhealth").val(),
                modal_profile_tin: $("#modal_profile_tin").val(),
                modal_profile_agency: $("#modal_profile_agency").val(),
                modal_profile_place_birth: $(
                    "#modal_profile_place_birth"
                ).val(),
                modal_profile_tel_number: $("#modal_profile_tel_number").val(),
                modal_profile_mobile_number: $(
                    "#modal_profile_mobile_number"
                ).val(),
                modal_profile_email: $("#modal_profile_email").val(),
            },
            beforeSend: function () {
                // Add loading icon
                $("#load_profile_save").html(
                    '<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-5 h-5"> <g fill="none" fill-rule="evenodd" stroke-width="4"> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> </g> </svg>'
                );
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#profile_modal")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                load_user_id(user_id_global);
                fetchUsers(page, filter, perPage);

                clear_fields();
            },
            complete: function () {
                // Remove loading icon and enable the button
                $("#load_profile_save").html("Save").prop("disabled", false);
            },
        });
    }
});

$("body").on("click", "#load_employee_save", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    // $(this).prop("disabled", true);

    employee_id = $("#modal_update_emp_id").val();

    var include_to_sr = 0;
    if ($('#include_to_sr').is(':checked')) {
        include_to_sr = 1;
    }

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/load/save/employee",
            type: "POST",
            data: {
                _token: _token,
                user_id_global: user_id_global,
                user_agency_global: user_agency_global,
                employee_id: employee_id,
                modal_employee_id: $("#modal_employee_id").val(),
                modal_employment_type: $("#modal_employment_type").val(),
                modal_start_date: $("#modal_start_date").val(),
                modal_end_date: $("#modal_end_date").val(),
                modal_designation_id: $("#modal_designation_id").val(),
                modal_position_id: $("#modal_position_id").val(),
                modal_rc_id: $("#modal_rc_id").val(),
                modal_salary: $("#modal_salary").val(),
                modal_employee_status: $("#modal_employee_status").val(),
                modal_sp_id: $("#modal_sp_id").val(),
                modal_pa_id: $("#modal_pa_id").val(),
                include_to_sr: include_to_sr
            },
            beforeSend: function () {
                // Add loading icon
                $("#load_employee_save").html(
                    '<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-5 h-5"> <g fill="none" fill-rule="evenodd" stroke-width="4"> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate> <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate> </circle> </g> </svg>'
                );
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#employee_modal")
                );
                mdl.hide();
                __notif_load_data(__basepath + "/");
                load_user_id(user_id_global);
                fetchUsers(page, filter, perPage);
                clear_fields();
            },
            complete: function () {
                // Remove loading icon
                $("#load_employee_save").html("Save").prop("disabled", false);
            },
        });
    }
});

$("body").on("click", "#modal_btn_new_account", function (ev) {
    clear_fields();
});

function clear_fields() {
    $("#modal_account_id").val("");
    $("#account_modal_id").val("");
    $("#modal_account_agency_id").val("");
    $("#modal_account_first_name").val("");
    $("#modal_account_last_name").val("");
    $("#modal_account_active_date").val("");
    $("#modal_account_expire_date").val("");
    $("#modal_account_username").val("");
    $("#modal_account_password").val("");
    $("#modal_account_role_namedd").val("");
    $("#modal_account_last_seen").val("");

    $("#profile_modal_id").val("");

    $("#modal_profile_last_name").val("");
    $("#modal_profile_first_name").val("");
    $("#modal_profile_mid_name").val("");
    $("#modal_profile_name_extension").val("");
    $("#modal_profile_date_birth").val("");
    $("#modal_application_gender").val("");
    $("#modal_profile_civil_status").val("");
    $("#modal_profile_height").val("");
    $("#modal_profile_weight").val("");
    $("#modal_profile_blood_type").val("");
    $("#modal_profile_gsis").val("");
    $("#modal_profile_pagibig").val("");
    $("#modal_profile_philhealth").val("");
    $("#modal_profile_tin").val("");
    $("#modal_profile_agency").val("");
    $("#modal_profile_age").val("");
    $("#modal_profile_tel_number").val("");
    $("#modal_profile_mobile_number").val("");
    $("#modal_profile_email").val("");
    $("#modal_profile_place_birth").val("");

    $("#modal_update_emp_id").val("");

    $("#modal_employee_id").val("");
    $("#modal_employment_type").val("");
    $("#modal_start_date").val("");
    $("#modal_end_date").val("");
    $("#modal_designation_id").val("");
    $("#modal_position_id").val("");
    $("#modal_rc_id").val("");
    $("#modal_salary").val("");
    $("#modal_employee_status").val("");

    $("#modal_sp_id").val("");
    $("#modal_pa_id").val("");

    $("#modal_employee_id").load(location.href + " #modal_employee_id");

    modal_designation_id.val(null).trigger("change");
    modal_position_id.val(null).trigger("change");
    modal_rc_id.val(null).trigger("change");
    modal_employment_type.val(null).trigger("change");
    modal_employee_status.val(null).trigger("change");
    modal_sp_id.val(null).trigger("change");
    modal_pa_id.val(null).trigger("change");
    modal_account_role_name.val(null).trigger("change");
}

$("body").on("click", "#save_modal_add_designation", function (ev) {
    // clear_fields();
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/designation",
            type: "POST",
            data: {
                _token: _token,
                modal_desig_name: $("#modal_desig_name").val(),
                modal_desig_description: $("#modal_desig_description").val(),
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_second_add_designation")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_designation_id").empty();
                $("#modal_designation_id").append(data.option_des);
                $("#modal_designation_id2").append(data.option_des);
                $("#modal_designation_id2").val(data.des_id).trigger("change");

                reload_dropdowns();

                $("#modal_desig_name").val("");
                $("#modal_desig_description").val("");
                //$('.btn').removeAttr('disabled');
            },
        });
    }
});

$("body").on("click", "#save_modal_add_position", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/position",
            type: "POST",
            data: {
                _token: _token,
                modal_position_name: $("#modal_position_name").val(),
                modal_position_description: $(
                    "#modal_position_description"
                ).val(),
            },
            success: function (data) {
                var data = JSON.parse(data);

                //  console.log(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_second_add_position")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_position_id").empty();
                $("#modal_position_id").append(data.option_pos);
                $("#modal_position_id2").append(data.option_des);
                $("#modal_position_id2").val(data.pos_id).trigger("change");

                reload_dropdowns();

                $("#modal_position_name").val("");
                $("#modal_position_description").val("");
                //$('.btn').removeAttr('disabled');
            },
        });
    }
});

$("body").on("click", "#save_modal_add_rc", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/rc",
            type: "POST",
            data: {
                _token: _token,
                modal_rc_name: $("#modal_rc_name").val(),
                modal_rc_description: $("#modal_rc_description").val(),
            },
            success: function (data) {
                var data = JSON.parse(data);

                console.log(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_second_add_respon")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_rc_id").empty();
                $("#modal_rc_id").append(data.option_rc);

                reload_dropdowns();

                $("#modal_rc_name").val("");
                $("#modal_rc_description").val("");
                //$('.btn').removeAttr('disabled');
            },
        });
    }
});

$("body").on("click", "#save_modal_add_employment_type", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/emloyement/type",
            type: "POST",
            data: {
                _token: _token,
                modal_employment_type_name: $(
                    "#modal_employment_type_name"
                ).val(),
                modal_employment_type_description: $(
                    "#modal_employment_type_description"
                ).val(),
            },
            success: function (data) {
                var data = JSON.parse(data);

                console.log(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_second_add_employment_type")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_employment_type").empty();
                $("#modal_employment_type").append(data.option_et);

                reload_dropdowns();

                $("#modal_employment_type_name").val("");
                $("#modal_employment_type_description").val("");
                //$('.btn').removeAttr('disabled');
            },
        });
    }
});

$("body").on("click", ".btn_delete_account", function (ev) {
    ev.preventDefault();

    account_id = $(this).data("ac-id");

    // console.log(account_id);

    const account_action_dropdown = tailwind.Dropdown.getOrCreateInstance(
        document.querySelector("#account_action_dropdown")
    );
    account_action_dropdown.hide();

    swal({
        title: "Are you sure?",
        text: "It will remove this account!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
    }).then((result) => {
        if (result.value == true) {
            swal({
                text: "Account Deactivated!",
                title: "Account successfully removed!",
                type: "success",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });

            tbldata_manage_users.row($(this).parents("tr")).remove().draw();

            $.ajax({
                url: "account/remove",
                type: "POST",
                data: {
                    _token: _token,
                    type: 1,
                    account_id: account_id,
                },
                cache: false,
                success: function (data) {
                    // console.log(data);
                    var data = JSON.parse(data);
                    __notif_load_data(__basepath + "/");
                    load_accounts("");
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
        }
    });
});

$("body").on("click", "#save_modal_add_sp", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    var modal_sp_cause = $("#modal_sp_cause").val();
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/sp",
            type: "POST",
            data: {
                _token: _token,

                modal_sp_cause: modal_sp_cause,
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_add_separation")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_sp_id").empty();
                $("#modal_sp_id").append(data.option_sp);

                $("#modal_sp_id").val(data.sp_id).trigger("change");
                $("#modal_sp_id2").append(
                    '<option value="' +
                        data.sp_id +
                        '">' +
                        modal_sp_cause +
                        "</option>"
                );
                $("#modal_sp_id2").val(data.sp_id).trigger("change");

                reload_dropdowns();

                $("#modal_sp_cause").val("");
                $(".btn").removeAttr("disabled");
            },
        });
    }
});

$("body").on("click", "#save_modal_add_pa", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    var modal_place_assign = $("#modal_place_assign").val();

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/pa",
            type: "POST",
            data: {
                _token: _token,

                modal_place_assign: modal_place_assign,
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_add_placeAssignment")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_pa_id").empty();
                $("#modal_pa_id").append(data.option_pa);

                $("#modal_pa_id").val(data.pa_id).trigger("change");

                $("#modal_pa_id2").append(
                    '<option value="' +
                        data.pa_id +
                        '">' +
                        modal_place_assign +
                        "</option>"
                );
                $("#modal_pa_id2").val(data.pa_id).trigger("change");

                reload_dropdowns();

                $("#modal_place_assign").val("");
                $(".btn").removeAttr("disabled");
            },
        });
    }
});

$("body").on("click", "#save_modal_add_pa_campus", function (ev) {
    ev.preventDefault();
    //$('.btn').prop('disabled', true);
    var modal_place_assign = $("#modal_place_assign_campus").val();

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: bpath + "admin/manage/save/pa/campus",
            type: "POST",
            data: {
                _token: _token,

                modal_place_assign: modal_place_assign,
            },
            success: function (data) {
                var data = JSON.parse(data);

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_add_placeAssignment")
                );
                mdl.hide();

                __notif_load_data(__basepath + "/");

                $("#modal_pa_id").empty();
                $("#modal_pa_id").append(data.option_pa);

                $("#modal_pa_id").val(data.pa_id).trigger("change");

                $("#modal_pa_id2").append(
                    '<option value="' +
                        data.pa_id +
                        '">' +
                        modal_place_assign +
                        "</option>"
                );
                $("#modal_pa_id2").val(data.pa_id).trigger("change");

                reload_dropdowns();

                $("#modal_place_assign").val("");
                $(".btn").removeAttr("disabled");
            },
        });
    }
});

function appendToSignatoriesTable() {
    const $descriptionInput = $("#description_input");
    const $nameSelect = $("#name_select");
    const $positionInput = $("#position_input");
    const $signatoriesTableBody = $("#signatories_table tbody");

    // Get the values from the input fields
    const description = $descriptionInput.val();
    const name = $nameSelect.find("option:selected").text();
    const position = $positionInput.val();

    // Get the selected name's ID
    const selectedNameId = $nameSelect.val();

    // Validate the required fields
    if (description.trim() === "") {
        alert("Please fill out Description and select a Name.");
        return; // Exit the function if validation fails
    }

    // Create a new table row
    const newRow = $("<tr></tr>");

    // Insert cells with the values
    const descriptionCell = $("<td></td>").text(description);
    const nameCell = $("<td></td>").text(name);

    // Hidden cell for the selected name's ID
    const nameIdCell = $("<td></td>")
        .text(selectedNameId)
        .css("display", "none"); // Hide this cell

    const positionCell = $("<td></td>").text(position);

    // Create the "Remove" button and add the click event to remove the row
    const removeButton = $("<button></button>")
        .text("Remove")
        .addClass("btn btn-danger btn-sm")
        .on("click", function () {
            $(this).closest("tr").remove(); // Remove the row when the button is clicked
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
}

// Use event delegation to handle the "Add Person" button click
$(document).on("click", "#add_person_button_signatories", function () {
    appendToSignatoriesTable();
    load_allowed_dropdown();
});

// Handle the "Print" button click
$("#print_button").on("click", function () {
    // Get the selected value from the "print_options_select" dropdown
    // const user_id = $(this).data('usr-id');
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
    const printUrl = bpath + "admin/print-certificate-of-employment"; // Replace with your print page URL
    const queryParams = `?option=${selectedPrintOption}&employee_id=${user_id}&data=${JSON.stringify(
        tableValues
    )}`;
    const fullUrl = printUrl + queryParams;

    // Open a new tab with the constructed URL
    window.open(fullUrl, "_blank");

    // Optionally, you can implement the actual printing logic on the print page
});

function load_allowed_dropdown() {
    name_select = $("#name_select").select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
    });
}

$(document).on("click", "#account_coe_btn", function () {
    user_id = $(this).data("usr-id");
});

// Function to fetch and fill user data
function fetchUsers(page = 1, filter, perPage) {
    // Make an AJAX request to your Laravel route to get user data
    $.ajax({
        url: "/admin/manage/user/re-load",
        method: "GET",
        dataType: "json",
        data: {
            page: page,
            filter_data: filter, // Correct parameter name for filter
            groupSearch: groupSearch, // Correct parameter name for filter
            perPage: perPage,
            empploy_typeID:empploy_typeID,
        },
        beforeSend: function () {
            // Add loading icon
            $("#showingDataCount").html(
                '<svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>'
            );
        },
        success: function (response) {
            // Clear existing table rows
            $("#dt__manage_users_updated tbody").empty();

            // Iterate through each user in the response and append a new row to the table
            if (response.data.length === 0) {
                // Append a "No data found" row
                var noDataRow = `
                    <tr class="intro-y">
                        <td colspan="6" class="text-center">No data found</td>
                    </tr>
                `;
                $("#dt__manage_users_updated tbody").append(noDataRow);
            } else {
                $.each(response.data, function (index, user) {
                    var accountDetailsBtn =
                        user.deleted === "Usable"
                            ? `<a id="account_details_btn" href="javascript:;" data-usr-id="${user.account_id}" data-agency-id="${user.agency_id}" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Details">
                            <i class="fa fa-info text-slate-500 text-success"></i>
                        </a>`
                            : "";
                    var accountCOEBtn =
                        user.is_employee === "Yes" && user.deleted === "Usable"
                            ? `<a id="account_coe_btn" href="javascript:;" data-tw-toggle="modal" data-tw-target="#print_options_modal" data-usr-id="${user.agency_id}" class="dropdown-item" title="Print">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="printer" data-lucide="printer" class="lucide lucide-printer w-4 h-4 mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            Employement
                            </a>`
                            : "";

                    var accountServiceRecordBtn = `<a id="service_record_btn" href="javascript:;" data-agency-id="${user.agency_id}" data-crypt-agency-id="${user.crypt_agency_id}" data-employee="${user.name}" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip bg-white" title="Service Record" data-tw-toggle="modal" data-tw-target="#employee_sr_modal">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit-3" data-lucide="edit-3" class="lucide lucide-edit-3 block w-4 h-4"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                    </a>`;

                    var row = `
                        <tr class="intro-x">
                            <td>
                                <div class="text-center">
                                    <div class="w-10 h-10 image-fit zoom-in">
                                        <img alt="${
                                            user.name
                                        }" data-action="zoom" class="w-full rounded-md" src="${
                        user.profile_picture
                    }" title="Uploaded at ${user.uploadDate}">
                                    </div>
                                </div>
                            </td>
                            <td style="font-size: 0.8rem;">
                                <a href="#" class="font-medium whitespace-nowrap">${
                                    user.name
                                }</a>
                                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${
                                    user.agency_id
                                }</div>
                            </td>
                            <td class="w-40 text-center" style="font-size: 0.8rem;">${
                                user.last_seen
                            }</td>
                            <td style="font-size: 0.8rem;">
                                <div class="flex items-center justify-center ${
                                    user.deleted === "Usable"
                                        ? "text-primary"
                                        : "text-danger"
                                }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>${
                                        user.deleted
                                    }
                                </div>
                            </td>
                            <td class="text-center" style="font-size: 0.8rem;">${
                                user.username
                            }</td>
                            <td class="table-report__action w-24">
                                <div class="flex justify-center items-center">

                                    ${accountServiceRecordBtn}

                                    ${accountDetailsBtn}

                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action" style="position: relative;">
                                        <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                            <svg class="svg-inline--fa fa-ellipsis items-center text-center text-primary" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                <path fill="currentColor" d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"></path>
                                            </svg>
                                        </a>
                                        <div class="dropdown-menu w-40" id="_xoaqc0g9h">
                                            <div class="dropdown-content">

                                                ${accountCOEBtn}

                                                <a id="account_remove_btn" href="javascript:;" data-usr-id="${
                                                    user.account_id
                                                }" data-agency-id="${
                        user.agency_id
                    }" class="dropdown-item">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-2">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                    </svg>
                                                                    Remove/Recover
                                                                </a>
                                                <a id="account_delete_btn" href="javascript:;" data-usr-id="${
                                                    user.account_id
                                                }" data-agency-id="${
                        user.agency_id
                    }" class="dropdown-item">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-2">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                    </svg>
                                                                    Delete
                                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                    // Append the row to the table
                    $("#dt__manage_users_updated tbody").append(row);
                });
            }



            // Update pagination
            update_dropDownPagination(response.current_page, response.last_page);

            // Update showing data count
            // Update pagination links
            totalPages = response.last_page;
            currentPage = response.current_page;
            updatePagination(currentPage);

              // Update showing entries information
              var startIndex =
              (response.current_page - 1) * response.per_page + 1;
          var endIndex = Math.min(
              response.current_page * response.per_page,
              response.total
          );
            var showingInfo =
            "Showing " +
            startIndex +
            " to " +
            endIndex +
            " of " +
            response.total +
            " entries";
        $("#showingDataCount").text(showingInfo);


        },
        error: function (error) {
            console.error("Error fetching user data:", error);
        },
    });
}

function update_dropDownPagination(currentPage, totalPages) {
    var paginationContainer = $(".dropPagination");
    paginationContainer.empty();

    var dropdown =
        '<select class="pagination-dropdown form-select">';

    for (var i = 1; i <= totalPages; i++) {
        var selected = i === currentPage ? "selected" : "";
        dropdown +=
            '<option value="' +
            i +
            '" ' +
            selected +
            ">" +
           'Page/'+ i +
            "</option>";
    }

    dropdown += "</select>";

    paginationContainer.append(dropdown);
}

// Function to update pagination links
function updatePagination(currentPage) {
    var paginationContainer = $(".pagination");
    paginationContainer.empty();

    var startPage = Math.max(1, currentPage - 1);
    var endPage = Math.min(totalPages, startPage + 2);

    // Add "First" button
    if (currentPage > 1) {
        var firstLink =
            '<li class="page-item">' +
            '<a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a>' +
            "</li>";
        paginationContainer.append(firstLink);
    }

    // Add "Previous" button
    if (currentPage > 1) {
        var prevLink =
            '<li class="page-item">' +
            '<a class="page-link" href="#" data-page="' +
            (currentPage - 1) +
            '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a>' +
            "</li>";
        paginationContainer.append(prevLink);
    }

    // Add "..." before the dynamically generated pages if needed
    if (startPage > 1) {
        paginationContainer.append(
            '<li class="page-item"><a class="page-link" href="#">...</a></li>'
        );
    }

    // Add dynamically generated pages
    for (var i = startPage; i <= endPage; i++) {
        var activeClass = i === currentPage ? "active" : "";

        var pageLink =
            '<li class="page-item ' +
            activeClass +
            '">' +
            '<a class="page-link" href="#" data-page="' +
            i +
            '">' +
            i +
            "</a>" +
            "</li>";

        paginationContainer.append(pageLink);
    }

    // Add "..." after the dynamically generated pages if needed
    if (endPage < totalPages) {
        paginationContainer.append(
            '<li class="page-item"><a class="page-link" href="#">...</a></li>'
        );
    }

    // Add "Next" button
    if (currentPage < totalPages) {
        var nextLink =
            '<li class="page-item">' +
            '<a class="page-link" href="#" data-page="' +
            (currentPage + 1) +
            '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a>' +
            "</li>";
        paginationContainer.append(nextLink);
    }

    // Add "Last" button
    if (currentPage < totalPages) {
        var lastLink =
            '<li class="page-item">' +
            '<a class="page-link" href="#" data-page="' +
            totalPages +
            '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a>' +
            "</li>";
        paginationContainer.append(lastLink);
    }
}

// Function to handle pagination click
$(document).on("click", ".pagination a.page-link", function (e) {
    e.preventDefault();
    page = $(this).data("page");
    clearTimeout(filterTimeout);
    fetchUsers(page, filter, perPage);
});

// Function to handle pagination change
$(document).on("change", ".pagination-dropdown", function () {
    var selectedPage = $(this).val();
    fetchUsers(selectedPage, filter, perPage);
});

var filterTimeout;
// Function to handle filter input
$(document).on("input", ".box", function () {
    var filtering = $(this).val();

    clearTimeout(filterTimeout);

    filterTimeout = setTimeout(function () {
        filter = filtering;
        fetchUsers();
    }, 500);
});

// Function to handle items per page change
// $(document).on("change", ".w-20.form-select", function () {
//     perPage = $(this).val();
//     clearTimeout(filterTimeout);
//     fetchUsers();
// });

// Function to handle filter input
$(document).on("input", ".tbl_filter_users", function () {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(function () {
        empploy_typeID = $('#filter_employment_type').val();
        filter = $('.tbl_filter_users').val();
        fetchUsers(1, filter, perPage);
    }, 500);
});

// Function to handle items per page change
$(document).on("change", ".user-list-page-count", function () {
    perPage = $(this).val();
    clearTimeout(filterTimeout);
    fetchUsers(page, filter, perPage);
});

$("body").on("click", ".filter_div", function () {
    $(this)
        .addClass(" rounded-lg items-center  bg-primary text-white font-medium")
        .siblings()
        .removeClass(
            "flex rounded-lg items-center bg-primary text-white font-medium"
        );
        empploy_typeID = $('#filter_employment_type').val();
        filter = $('.tbl_filter_users').val();
    groupSearch = $(this).data("fil-value");
    fetchUsers(1, filter, perPage);
});

// Function to append the selected user's full name to the table
$("body").on("click", "#rp-add-person-button-signatories", function () {
    var selectedUser = $("#rp-name-select-signatory").val();
    var selectedUserName = $(
        "#rp-name-select-signatory option:selected"
    ).text();
    var newRow =
        "<tr>" +
        '<td><button class="btn-remove-signatory"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td>' +
        '<td class="rp-signatory" contenteditable="true"></td>' +
        '<td class="rp-name" contenteditable="true">' +
        selectedUserName +
        "</td>" +
        '<td class="rp-title" contenteditable="true"></td>' +
        "</tr>";
    $("#rp-signatories tbody").append(newRow);

    // Initialize SortableJS on the table tbody
    new Sortable(
        document
            .getElementById("rp-signatories")
            .getElementsByTagName("tbody")[0],
        {
            animation: 150, // Animation duration in milliseconds
            ghostClass: "sortable-ghost", // Class applied to the dragged item
            onEnd: function (evt) {
                // Callback function triggered when a drag operation ends
                // console.log('Dragged from index ' + evt.oldIndex + ' to index ' +
                //     evt.newIndex);
            },
        }
    );
    saveToLocalStorage();
});

// Function to remove table row when remove icon is clicked
$(document).on("click", ".btn-remove-signatory", function () {
    $(this).closest("tr").remove();
    saveToLocalStorage(); // Update local storage after removing row
});

// Function to save data to local storage
function saveToLocalStorage() {
    // Get the current data from the table
    var tableData = [];
    $("#rp-signatories tbody tr").each(function () {
        var rowData = {};
        $(this)
            .find("td")
            .each(function (index, element) {
                if (index === 1 || index === 2 || index === 3) {
                    // Include indices 1, 2, and 3
                    rowData["cell" + index] = $(element).text().trim();
                }
            });
        tableData.push(rowData);
    });

    // Save the data to local storage
    localStorage.setItem("tableData", JSON.stringify(tableData));
}

// Function to populate table with data from local storage on page load
function populateTableFromLocalStorage() {
    var storedData = localStorage.getItem("tableData");
    if (storedData) {
        var tableData = JSON.parse(storedData);
        $.each(tableData, function (index, rowData) {
            var newRow =
                "<tr>" +
                '<td><button class="btn-remove-signatory"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td>' +
                '<td class="rp-signatory" contenteditable="true">' +
                (rowData.cell1 || "") +
                "</td>" +
                '<td class="rp-name" contenteditable="true">' +
                (rowData.cell2 || "") +
                "</td>" +
                // Adjust index to 2
                '<td class="rp-title" contenteditable="true">' +
                (rowData.cell3 || "") +
                "</td>" +
                // Adjust index to 3
                "</tr>";
            $("#rp-signatories tbody").append(newRow);
        });
        // Initialize SortableJS on the table tbody
        new Sortable(
            document
                .getElementById("rp-signatories")
                .getElementsByTagName("tbody")[0],
            {
                animation: 150, // Animation duration in milliseconds
                ghostClass: "sortable-ghost", // Class applied to the dragged item
                onEnd: function (evt) {
                    // Callback function triggered when a drag operation ends
                    // console.log('Dragged from index ' + evt.oldIndex + ' to index ' +
                    //     evt.newIndex);
                },
            }
        );
    }
}

// Event listener to detect changes in the content of editable <td> elements
$("#rp-signatories tbody").on(
    "input",
    'td[contenteditable="true"]',
    function () {
        saveToLocalStorage(); // Update local storage when content changes
    }
);

$("body").on("click", "#rp-generateReport", function () {
    // Collect data from modal inputs and select elements
    var reportType = $("#report-type").val();
    var keywords = $("#keywords").val();
    var from = $("#rp_from").val();
    var to = $("#rp_to").val();
    var reportName = $("#rp-name-select-signatory").val();
    var reportSize = $("#report-size").val();
    var reportPlaceAssignment = $("#report-place-assignment").val();
    var signatories = [];
    var headers = [];

    // Get selected values from the employment type select
    var employmentTypes = $("#rp-employment-select-type").val(); // This will be an array of selected values

    // Iterate through each signatory row and collect data
    $("#rp-signatories tbody tr").each(function () {
        var signatory = {
            signatory: $(this).find(".rp-signatory").text(),
            name: $(this).find(".rp-name").text(),
            title: $(this).find(".rp-title").text(),
        };
        signatories.push(signatory);
    });

    // Iterate through each header row and collect data
    $("#rp-headers tbody tr").each(function () {
        var header = {
            title: $(this).find(".rp-title-text").text(),
        };
        headers.push(header);
    });

    // Convert signatories array to JSON string
    var signatoriesJSON = JSON.stringify(signatories);
    var headerJSON = JSON.stringify(headers);

    // Convert employmentTypes array to JSON string or comma-separated values
    var employmentTypesJSON = JSON.stringify(employmentTypes);

    // Construct the URL for the report
    var url =
        "/admin/generate-report?type=vw" +
        "&reportName=" +
        encodeURIComponent(reportName) +
        "&reportFrom=" +
        encodeURIComponent(from) +
        "&reportTo=" +
        encodeURIComponent(to) +
        "&reportType=" +
        encodeURIComponent(reportType) +
        "&reportKeywords=" +
        encodeURIComponent(keywords) +
        "&reportSize=" +
        encodeURIComponent(reportSize) +
        "&reportPlaceAssignment=" +
        encodeURIComponent(reportPlaceAssignment) +
        "&reportSignatories=" +
        encodeURIComponent(signatoriesJSON) +
        "&reportHeaders=" +
        encodeURIComponent(headerJSON) +
        "&employmentTypes=" +
        encodeURIComponent(employmentTypesJSON);

    // Open the URL in a new tab
    var newTab = window.open(url, "_blank");
});

// Function to load settings data and append it to the table
function loadSettingsData() {
    // Check if local data is present
    var localData = localStorage.getItem("settingsData");
    if (localData) {
        // If local data is present, load it
        loadSettingsFromLocal();
    } else {
        // Perform an AJAX request to fetch the settings data
        $.ajax({
            url: "/admin/load/system/settings", // Replace this with your actual route URL
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            dataType: "json",
            success: function (response) {
                // Check if the response is successful and contains data
                if (response.success && response.data) {
                    // Clear existing tbody content
                    $("#rp-headers tbody").empty();

                    // Loop through the settings data and append it to the table
                    $.each(response.data, function (key, value) {
                        // Append a new row to the table for each setting with editable input fields and a remove icon
                        var newRow =
                            "<tr>" +
                            '<td><button class="rp-remove-button"><i class="fa fa-trash remove-icon"></i></button></td>' +
                            '<td ><i class="fa fa-arrows"></i></td>' +
                            '<td class="rp-title-text" contenteditable="true">' +
                            value["value"] +
                            "</td>" +
                            "</tr>";
                        $("#rp-headers tbody").append(newRow);
                    });

                    // Save settings data to local storage
                    saveSettingsLocally(response.data);

                    // Initialize SortableJS on the table tbody
                    new Sortable(
                        document
                            .getElementById("rp-headers")
                            .getElementsByTagName("tbody")[0],
                        {
                            animation: 150, // Animation duration in milliseconds
                            ghostClass: "sortable-ghost", // Class applied to the dragged item
                            onEnd: function (evt) {
                                // Callback function triggered when a drag operation ends
                                // console.log('Dragged from index ' + evt.oldIndex + ' to index ' +
                                //     evt.newIndex);
                            },
                        }
                    );
                } else {
                    // Display an error message if the response does not contain data
                    console.error("Failed to load settings data");
                }
            },
            error: function (xhr, status, error) {
                // Display an error message if the AJAX request fails
                console.error("Error loading settings data:", error);
            },
        });
    }
}

// Save settings data to local storage
function saveSettingsLocally(data) {
    // Convert data to JSON string and save it to local storage
    localStorage.setItem("settingsData", JSON.stringify(data));
}

// Check if settings data exists in local storage and load it if not empty
function loadSettingsFromLocal() {
    var localData = localStorage.getItem("settingsData");
    if (localData) {
        // Parse JSON string to object
        var parsedData = JSON.parse(localData);
        // Append data to table
        $.each(parsedData, function (key, value) {
            var newRow =
                "<tr>" +
                '<td><button class="rp-remove-button"><i class="fa fa-trash remove-icon"></i></button></td>' +
                '<td><i class="fa fa-arrows"></i></td>' +
                '<td class="rp-title-text" contenteditable="true">' +
                value["value"] +
                "</td>" +
                "</tr>";
            $("#rp-headers tbody").append(newRow);
        });
    }
    // Initialize SortableJS on the table tbody
    new Sortable(
        document.getElementById("rp-headers").getElementsByTagName("tbody")[0],
        {
            animation: 150, // Animation duration in milliseconds
            ghostClass: "sortable-ghost", // Class applied to the dragged item
            onEnd: function (evt) {
                // Callback function triggered when a drag operation ends
                // console.log('Dragged from index ' + evt.oldIndex + ' to index ' +
                //     evt.newIndex);
            },
        }
    );
}

// Add click event listener to remove icon
// Function to update local storage data
function updateLocalStorageData() {
    // Create an array to hold the updated settings data
    var updatedData = [];

    // Iterate over each row in the table
    $("#rp-headers tbody tr").each(function () {
        var title = $(this).find(".rp-title-text").text(); // Get the text content of the title cell
        updatedData.push({ value: title }); // Push the title to the updated data array
    });

    // Save the updated data to local storage
    saveSettingsLocally(updatedData);
}

// Event listener for removing a row
$("body").on("click", ".rp-remove-button", function () {
    $(this).closest("tr").remove(); // Remove the row from the table
    updateLocalStorageData(); // Update local storage data after row removal
});

// Event listener for adding a row
$("body").on("click", "#rp-add-row-title", function () {
    var newRow =
        "<tr>" +
        '<td><button class=" rp-remove-button"><i class="fa fa-trash remove-icon"></i></button></td>' +
        '<td><i class="fa fa-arrows"></i></td>' +
        '<td class="rp-title-text" contenteditable="true"></td>' +
        "</tr>";
    $("#rp-headers tbody").append(newRow); // Append the new row to the table
});

// Event listener for editing the title
$("body").on("input", ".rp-title-text", function () {
    updateLocalStorageData(); // Update local storage data when the title is edited
});

function loadEmploymentType(){
    $.ajax({
        type: "get",
        url: bpath + "admin/load/employment/Type",
        success: function (response) {
            filter_employment_type.html('<option></option>'+response);
        }
    });
}

$("#filter_employment_type").change(function (e) {
    e.preventDefault();
    empploy_typeID = $(this).val();
        filter = $(".tbl_filter_users").val();
    fetchUsers(page = 1, filter, perPage)
});
