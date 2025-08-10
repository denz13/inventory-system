var  _token = $('meta[name="csrf-token"]').attr('content');
var modal_designation_id2;
var modal_position_id2;
var modal_rc_id2;
var modal_employee_id2;
var modal_employment_type2;
var modal_employee_status2;
var modal_sp_id2;
var modal_pa_id2;
var sr_signatory_name;
var sr_signatory_designationOrPost;
var modal_sg;
var modal_sg_step;
var modal_agency_branch;
var employmentSalary_frequency;
var Salary_frequency;
$(document).ready(function () {
    _onclick_sr();
    add_previous_sr();
    cancelModal();
    _onChange();
    // _onSubmitFunction();
});
function reload_sr_select2() {


    modal_designation_id2 = $('#modal_designation_id2').select2({
        placeholder: "Select Designation",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_position_id2 = $('#modal_position_id2').select2({
        placeholder: "Select Position",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_rc_id2 = $('#modal_rc_id2').select2({
        placeholder: "Select Responsibility Center",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employee_id2 = $('#modal_employee_id2').select2({
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employment_type2 = $('#modal_employment_type2').select2({
        placeholder: "Select Employment Type",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_employee_status2 = $('#modal_employee_status2').select2({
        allowClear: true,
        closeOnSelect: true,
    });

    modal_sp_id2 = $('#modal_sp_id2').select2({
        placeholder: "Select Separetion Cause",
        allowClear: true,
        closeOnSelect: true,
    });
    modal_pa_id2 = $('#modal_pa_id2').select2({
        placeholder: "Select Place Assignment",
        allowClear: true,
        closeOnSelect: true,
    });

    sr_signatory_name = $('#sr_signatory_name').select2({
        placeholder: "Select Employee",
        allowClear: true,
        closeOnSelect: true,
    });

    Salary_frequency = $('#Salary_frequency').select2({
        placeholder: "Select Salary Frequency",
        allowClear: true,
        closeOnSelect: true,
    });

    sr_signatory_designationOrPost = $('#sr_signatory_designationOrPost').select2({
        placeholder: "Select Position",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_sg = $('#modal_sg').select2({
        placeholder: "Select Salary Grade",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_sg_step = $('#modal_sg_step').select2({
        placeholder: "Select Grade Step",
        allowClear: true,
        closeOnSelect: true,
    });

    modal_agency_branch = $('#modal_agency_branch').select2({
        placeholder: "Select Branch",
        allowClear: true,
        closeOnSelect: true,
    });

    employmentSalary_frequency = $('#employmentSalary_frequency').select2({
        placeholder: "Select Frequency",
        allowClear: true,
        closeOnSelect: true,
    });

    
}
var emp_agency_id = '';
var emp_date_start = '';
var emp_date_end = '';
var emp_salary = '';
var emp_separation = '';
var emp_place_assign = '';
var emp_employment_type = '';
var emp_position = '';
var emp_designation = '';
var emp_res_center = '';
var emp_sg = '';
var emp_sg_step = '';
var emp_agency_branch = '';
var addRecord = false;

var emp_history_id = '';
var history_action = '';
var emp_salary_frequency

function _onclick_sr() {
    
    $("body").on("click", "#service_record_btn", function () {
        let agency_id = $(this).data("agency-id");
        let crypt_agency_id = $(this).data("crypt-agency-id");
        let employee_name = $(this).data("employee");

        emp_agency_id = agency_id;

        $("#sr_header").text(" Service Record - " + employee_name);
        // $('#print_sr').attr('href', '/admin/print-sr/' + crypt_agency_id );
        $("#emp_agency_id").val(emp_agency_id);
        load_employee_record(emp_agency_id);
    });

    $("body").on("click", "#edit_sr_history", function () {
        history_action = "update-history";

        emp_history_id = $(this).data("history-id");
        emp_date_start = $(this).data("date-start");
        emp_date_end = $(this).data("date-end");
        emp_salary = $(this).data("salary");
        emp_separation = $(this).data("separation");
        emp_place_assign = $(this).data("place-assigned");
        emp_designation = $(this).data("designation");
        emp_employment_type = $(this).data("employment-type");
        emp_position = $(this).data("position");
        emp_res_center = $(this).data("responcibility-center");
        emp_sg = $(this).data("sg");
        emp_sg_step = $(this).data("sg-step");
        emp_agency_branch = $(this).data("agency-branch");
        emp_salary_frequency = $(this).data("salary-frequency");

        loadPreviousRecord();

        $("#emp_history_id").val(emp_history_id);

        $("#i_icon").removeClass("fa fa-plus").addClass("fa fa-undo");
        $("#record_lbl").text("Back Service Record");

        addRecord = true;
    });

    $("body").on("click", "#remove_sr_history", function () {
        var _history_id = $(this).data("history-id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "post",
                    url: "/admin/remove/history",
                    data: { _token: _token, _history_id: _history_id },
                    success: function (response) {
                        if (response.status == 200) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Employee Employment History has been deleted.",
                                icon: "success",
                            }).then(() => {
                                load_employee_record(emp_agency_id);
                            });
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "An error occurred while deleting the file.",
                                icon: "error",
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Error!",
                            text: "An error occurred while deleting the file.",
                            icon: "error",
                        });
                    },
                });
            }
        });
    });

    $("body").on("click", "#save_modal_add_branch", function (ev) {
        ev.preventDefault();

        var branch_name = $("#modal_branch_name").val();
        var branch_desc = $("#modal_branch_description").val();

        if (branch_name.trim() !== '') {
            $.ajax({
                url: bpath + "admin/add/agency/branch",
                type: "POST",
                data: {
                    _token: _token,
                    branch_name: branch_name,
                    branch_desc: branch_desc,
                },
                success: function (data) {
                    $("#modal_agency_branch").empty();
                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_second_add_branch")
                    );
                    __notif_load_data(__basepath + "/");
                    $("#modal_agency_branch").append(data.option_branch);
                    reload_dropdowns();
                    $("#modal_agency_branch").val(data.branch_id).trigger("change");
                    $("#modal_branch_name").val("");
                    $("#modal_branch_description").val("");
                    // $('.btn').removeAttr('disabled');
                    mdl.hide();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                    // Handle error appropriately, e.g., show error message to the user
                }
            });
        }
    });

    $("body").on("click", "#add_service_record", function () {
        var prev_record_lbl = $(this).find("#record_lbl");
        var i_icon = $(this).find("#i_icon");
        history_action = "";
        if (!addRecord) {
            i_icon.removeClass("fa fa-plus").addClass("fa fa-undo");
            prev_record_lbl.text("Back Service Record");
            
            loadPreviousRecord();
            $('#employmentSalary_frequency').val('annual').trigger('change');
        } else {
            clear_dataValues();
            addRecord = addRecord;
            i_icon.removeClass("fa fa-undo").addClass("fa fa-plus");
            prev_record_lbl.text("Add Previous Record");
            load_employee_record(emp_agency_id);
        }
        addRecord = !addRecord;
    });

    $("body").on("click", "#editPresent_lnp_sr", function () {
        // let emp_date_created_at = $(this).data("date-created");
        load_present_lnp_sr();

        const lnp_Modal = tailwind.Modal.getOrCreateInstance(
            document.querySelector(
                "#employee_lnp_present_sr_modal"
            )
        );
        lnp_Modal.show();

        $("#emp_lnp_agency_id").val(emp_agency_id);

        
    });

    $("body").on('click', '#movePresent_sr_toHistory', function () {
        
        Swal.fire({
            title: "Note!",
            text: "This Record will be move to Employment History",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1E40AF",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continue",
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "post",
                    url: "/admin/move-to-history",
                    data: {_token: _token, emp_agency_id:emp_agency_id},
                    dataType: "json",
                    success: function (response) {
                        if(response.status == 200){
                            __notif_show(1, 'Data Successfully move history')
                            load_employee_record(emp_agency_id)
                        }else{
                            __notif_show(-1, 'Data Successfully move history')
                        }
                    }
                });
            }
        });
    });

    $("#add_lnp_present_sr").submit(function (e) {
        e.preventDefault();
        var fd = $(this);
        if (check_lwp_record()) {
            $.ajax({
                type: "post",
                url: "/admin/save-lnp-present",
                data: fd.serialize(),
                success: function (response) {
                    if (response.status == 200) {
                        __notif_show(
                            1,
                            "Present Leave NP Successfully Updated"
                        );

                        const lnp_Modal = tailwind.Modal.getOrCreateInstance(
                            document.querySelector(
                                "#employee_lnp_present_sr_modal"
                            )
                        );
                        lnp_Modal.hide();

                        $('.lwp_div_container').html(`<div class="col-span-12 2xl:col-span-3 box p-2 cursor-pointer">
                                    <div id="add_lwp_date" class="font-medium text-base border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4 pb-4 flex items-center justify-center h-full">
                                        <i class="fa-solid fa-plus h-5 w-5 text-slate-400"></i>
                                    </div>
                                </div>`);
                    }else{
                        __notif_show(-1, response.message);
                    }
                },
            });
        }
    });

    $("body").on("click", "#print_sr", function () {
        reload_sr_select2();
        $("#emp_printSR_agency_id").val(emp_agency_id);
        const print_sr_Modal = tailwind.Modal.getOrCreateInstance(
            document.querySelector("#print_sr_modal")
        );
        print_sr_Modal.show();
    });

    $("body").on("click", ".signatory_radio_option", function () {
        var sr_signatory_agencyID = $("#sr_signatory_name").val();
        var sr_radio_value = $(this).val().trim();
        if (sr_radio_value == "position") {
            $("#sr_signatory_designationOrPost").select2({
                placeholder: "Select Position",
                allowClear: true,
                closeOnSelect: false,
            });
        } else {
            $("#sr_signatory_designationOrPost").select2({
                placeholder: "Select Designation",
                allowClear: true,
                closeOnSelect: false,
            });
        }
        sr_radio_option(sr_radio_value, sr_signatory_agencyID);
    });

    $("body").on("click", ".remove-sr-row", function () {
        $(this).closest("tr").remove();
    });

    $("body").on("click", "#add_emp_signatories", function () {
        addToSignatory_table();
    });
}

function sr_radio_option(sr_radio_value, sr_signatory_agencyID) {
    $.ajax({
        type: "get",
        url: "/admin/sr-print-radio-option",
        data: {
            _token: _token,
            sr_radio_value: sr_radio_value,
            emp_agency_id: sr_signatory_agencyID,
        },
        dataType: "json",
        success: function (data) {
            $("#sr_signatory_designationOrPost").empty();
            $("#sr_signatory_designationOrPost").append(data.load_option);
            $("#sr_signatory_designationOrPost")
                .val(data.load_option_id)
                .trigger("change");
        },
    });
}

function _onChange() {

    $("body").on("change", "#modal_end_date2", function () {
        var start_date = $("#modal_start_date2");
        var end_date = $(this);
        var st_d_val = start_date.val();
        var en_d_val = end_date.val();

        var startDateObj = new Date(st_d_val);
        var endDateObj = new Date(en_d_val);

        if (st_d_val !== "") {
            if (startDateObj > endDateObj) {
                // Compare Date objects directly
                start_date.css("border-color", "red");
            } else {
                start_date.css("border-color", "");              
            }
        } else {
            start_date.css("border-color", "red");
        }
    });

    $("body").on("change", "#modal_start_date2", function () {
        var end_date = $("#modal_end_date2");
        var start_date = $(this);
        var st_d_val = start_date.val();
        var end_d_val = end_date.val();

        var startDateObj = new Date(st_d_val);
        var endDateObj = new Date(end_d_val);

        if (end_d_val !== "") {
            if (startDateObj > endDateObj) {
                start_date.css("border-color", "red");
                end_date.css("border-color", "red");
            } else {
                end_date.css("border-color", "");
                start_date.css("border-color", "");
               
            }
        } 
    });

    $("body").on("change", "#sr_signatory_designationOrPost", function () {
        var selected_designation_position = $(this)
            .find("option:selected")
            .text();
        var selected_name = $("#sr_signatory_name")
            .find("option:selected")
            .text();
        var id = $(this).val();
        var signatory_description = $("#signatory_description").val().trim();
    });

    $("body").on("change", "#sr_signatory_name", function () {
        var employee_agency_id = $(this).val();
        var sr_radio_options = $(
            "input[name='desc_post_option']:checked"
        ).val();

        if (typeof sr_radio_options === "undefined") {
            var sr_position_radio_options = $(
                "input[name='desc_post_option'][value='position']"
            );
            sr_position_radio_options.prop("checked", true);
            sr_radio_options = sr_position_radio_options.val();
        }

        sr_radio_option(sr_radio_options, employee_agency_id);
    });

    $("body").on('change', '#modal_sg_step', function () {
        var step_val = $(this).val();
        var sg_val = $('#modal_sg').val();
        loadSalary(step_val, sg_val);
    });

    $("body").on('change', '#modal_sg', function () {
        var sg_val = $(this).val();
        var step_val = $('#modal_sg_step').val();
        loadSalary(step_val, sg_val);
    });

    $("body").on('click', '#add_lwp_date', function () {

        var lwp_date = $(this);
        $.ajax({
            type: "get",
            url: "/admin/lwp/load-leave-type",
            dataType: "json",
            success: function (response) {
                let lwp_html = '';
                
                lwp_html += `<div class="col-span-12 sm:col-span-4 2xl:col-span-3 box p-2 cursor-pointer relative leave_without_pay_div_container">
                                <div class="font-medium text-base">
                                
                                    <label class="text-xs text-slate-500 italic"> dd/mm/yyyy </label>
                                    <input name="leaveNoPayId[]" value="0" type="hidden" class="form-control leaveNoPayId">                                                                               
                                    <input name="leave_without_pay[]" type="date" class="form-control leave_without_pay" placeholder="Leave W/out Pay">
                                    
                                    <div class="flex mt-2 justify-between leave_type_div_container">
                                        <input name="lwp_leaveTypeID[]" value="" type="hidden" class="form-control lwp_leaveTypeID"> 
                                        
                                        <div class="text-slate-500 text-xs truncate leave_type_div_display">Leave Type</div>
                                        
                                        <div class="dropdown mt-0 ml-auto">
                                            <a href="javascript:;" class="dropdown-toggle chevron_icon_tag" data-tw-toggle="dropdown">
                                                <i class="fas fa-chevron-down h-3 w-3 text-slate-200"></i>
                                            </a>
        
                                            <div class="dropdown-menu w-40">
                                                <ul class="dropdown-content overflow-y-auto h-32">`;
    
                                                response.forEach(item => {
                                                    lwp_html += `<li class="leave_type_dropdown" data-value="${item.id}"> 
                                                                    <a href="javascript:;" class="dropdown-item text-xs">${item.type_name}</a> 
                                                                </li>`;
                                                });
                                                
                                                lwp_html += `</ul>
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                            
                                <div id="remove_lwp_div" class="tooltip w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg> 
                                </div>
                            </div>`;
                
                            
                            lwp_date.parent().before(lwp_html);
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
    

    var _this_chevronIcon;
    var leave_type_div_display;
    var lwp_leaveTypeID;

    $("body").on('click', '.chevron_icon_tag', function () {
        _this_chevronIcon = $(this);
        var leave_type_div_container = $(this).closest('.leave_type_div_container');
        leave_type_div_display = leave_type_div_container.find('.leave_type_div_display');
        lwp_leaveTypeID = leave_type_div_container.find('.lwp_leaveTypeID');
    });

    $("body").on('click', '.leave_type_dropdown', function () {
        var leave_type_text = $(this).text().trim();
        var leave_typeID = $(this).data('value');
    
        leave_type_div_display.html(leave_type_text);
        lwp_leaveTypeID.val(leave_typeID);
        
        $(this).closest('.dropdown-menu').removeClass('show');

    });

    $("body").on('click', '#remove_lwp_div', function () {
        $(this).closest('.leave_without_pay_div_container').remove();
    });

}

function loadSalary(step_val, sg_val){

    if (step_val !== '' && sg_val !== '') {
        $.ajax({
            type: "GET",
            url: "/admin/sr-load-salary",
            data: { step_val: step_val, sg_val: sg_val },
            success: function (response) {
                $('#previous_salary').val(response.salary)
            },
            error: function (xhr, status, error) {
                // Handle error
                console.error("Error occurred: ", error);
            }
        });
    }

}

function addToSignatory_table() {
    var selected_designation_position = $("#sr_signatory_designationOrPost")
        .find("option:selected")
        .text()
        .trim();
    var selected_name = $("#sr_signatory_name")
        .find("option:selected")
        .text()
        .trim();
    var signatory_description = $("#signatory_description").val().trim();
    // Check if a row with the same signatory_description already exists

    if (validatePrint_sintories_value()) {
        var check_description = $(
            "#sr_signatories_table label#td_signatory_description"
        )
            .filter(function () {
                return $(this).text().trim() === signatory_description;
            })
            .closest("tr");

        var check_selectedName = $(
            "#sr_signatories_table label#sr_signatory_name"
        )
            .filter(function () {
                return $(this).text().trim() === selected_name;
            })
            .closest("tr");

        if (check_description.length > 0) {
            // Update existing row
            check_description
                .find("label#td_selected_name")
                .text(selected_name);
            check_description
                .find("label#td_selected_designation_position")
                .text(selected_designation_position);
        } else {
            // Add new row
            if (check_selectedName.length > 0) {
                alert(selected_name + " is already listed as signatory");
            } else {
                $("#sr_signatories_table").append(`<tr>
                        <td>
                            <input name="signatory_descriptions[]" class="hidden" value="${signatory_description}">
                            <label id="td_signatory_description">
                                ${signatory_description}
                            </label>

                        </td>
                        <td>
                            <input name="signatory_name[]" class="hidden" value="${selected_name}">
                            <label id="td_selected_name">
                            ${selected_name}
                            </label>

                        </td>
                        <td>
                            <input name="selected_designation_position[]" class="hidden" value="${selected_designation_position}">
                            <label id="td_selected_designation_position">
                                ${selected_designation_position}
                            </label>
                        </td>
                        <td class="remove-sr-row text-danger underline cursor-pointer">remove</td>
                    </tr>`);
            }
        }
    }
}

function validatePrint_sintories_value() {
    var returnValue = true;

    var selected_designation_position = $("#sr_signatory_designationOrPost");
    var selected_name = $("#sr_signatory_name");
    var signatory_description = $("#signatory_description");

    var desc_borderColor = "";
    selected_designation_position.select2({
        placeholder: "Select Position",
        allowClear: true,
        closeOnSelect: false,
    });

    selected_name.select2({
        placeholder: "Select Position",
        allowClear: true,
        closeOnSelect: false,
    });

    if (
        selected_designation_position.val() === null ||
        selected_designation_position.val().trim() === ""
    ) {
        selected_designation_position.select2({
            theme: "error",
            placeholder: "This field is required",
        });
        returnValue = false;
    }

    if (selected_name.val() === null || selected_name.val().trim() === "") {
        selected_name.select2({
            theme: "error",
            placeholder: "This field is required",
        });
        returnValue = false;
    }

    if (
        signatory_description.val() === null ||
        signatory_description.val().trim() === ""
    ) {
        desc_borderColor = "red";
        returnValue = false;
    }

    signatory_description.css("border-color", desc_borderColor);
    return returnValue;
}

function load_present_lnp_sr() {
    $(".lwp_div_container").html(`<div class="col-span-12 2xl:col-span-3 box p-2 cursor-pointer">
                                    <div id="add_lwp_date" class="font-medium text-base border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4 pb-4 flex items-center justify-center h-full">
                                        <i class="fa-solid fa-plus h-5 w-5 text-slate-400"></i>
                                    </div>
                                </div>`);
    $.ajax({
        type: "get",
        url: "/admin/load/present-sr-lnp",
        data: {
            _token: _token,
            emp_agency_id: emp_agency_id,
        },
        success: function (response) {
            $(".lwp_div_container").prepend(response);
        },
    });
}

function loadPreviousRecord() {
    $.ajax({
        type: "get",
        url: "/admin/load/record-data",

        data: {
            _token: _token,
            emp_agency_id: emp_agency_id,
            emp_history_id: emp_history_id,
            emp_date_start: emp_date_start,
            emp_date_end: emp_date_end,
        },
        success: function (response) {
            let designation = '';
            let agency_branch = '';

            if(response.active_agency == 1){
                agency_branch =   `<div class="col-span-12 sm:col-span-12">
                    <label for="modal_agency_branch" class="form-label">Agency Branch</label>
                    <div class="input-group flex-1">
                        <select class="w-full" id="modal_agency_branch" name="modal_agency_branch">
                            <option></option>
                            ${response.agency_branch}
                        </select>
                        <div class="pl-5">
                            <a href="javascript:;"
                                class="btn btn-outline-secondary"
                                data-tw-toggle="modal"
                                data-tw-target="#modal_second_add_branch">
                                <i class="fa fa-plus text-success w-4 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>`;

                designation =   `<div class="col-span-12 sm:col-span-12">
                <label for="modal-form-2" class="form-label">Designation</label>
                <div class="input-group flex-1">
                    <select class="w-full" id="modal_designation_id2" name="modal_designation_id2">
                        <option></option>
                        ${response.emp_disignation}
                    </select>
                    <div class="pl-5">
                        <a href="javascript:;"
                            class="btn btn-outline-secondary"
                            data-tw-toggle="modal"
                            data-tw-target="#modal_second_add_designation">
                            <i class="fa fa-plus text-success w-4 h-5"></i>
                        </a>
                    </div>
                </div>
            </div>`;
            }
            $("#sr_modal_body").html(`
                <div class="grid grid-cols-12 gap-4 gap-y-3">

                    <input id="emp_history_id" name="emp_history_id" type="hidden" value="${emp_history_id}" class="form-control">

                    ${agency_branch}


                    <div class="col-span-12 sm:col-span-6">
                        <label for="modal-form-1" class="form-label">Start Date</label>
                        <input id="modal_start_date2" name="modal_start_date2" type="date" class="form-control" placeholder="Start Date">
                    </div>

                    <div class="col-span-12 sm:col-span-6">
                        <label for="modal-form-2" class="form-label">End Date</label>
                        <input id="modal_end_date2" name="modal_end_date2" type="date" class="form-control" placeholder="End Date">
                    </div>

                    <div class="col-span-12 sm:col-span-12">
                        <label for="modal-form-2" class="form-label">Employment Type</label>
                        <div class="input-group flex-1">
                            <select class="w-full" id="modal_employment_type2" name="modal_employment_type2">
                                <option></option>
                                ${response.emp_type}
                            </select>
                            <div class="pl-5">
                                <a href="javascript:;"
                                    class="btn btn-outline-secondary"
                                    data-tw-toggle="modal"
                                    data-tw-target="#modal_second_add_employment_type">
                                    <i class="fa fa-plus text-success w-4 h-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-12">
                        <label for="modal-form-2" class="form-label">Position</label>
                        <div class="input-group flex-1">
                            <select class="w-full" id="modal_position_id2" name="modal_position_id2">
                                <option></option>
                                ${response.emp_position}
                            </select>
                            <div class="pl-5">
                                <a href="javascript:;"
                                    class="btn btn-outline-secondary"
                                    data-tw-toggle="modal"
                                    data-tw-target="#modal_second_add_position">
                                    <i class="fa fa-plus text-success w-4 h-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    ${designation}


                    ${response.emp_SG}

                    <div class="col-span-12 sm:col-span-12 mt-2">
                         <label for="validation-form-6" class="form-label w-full flex flex-col sm:flex-row">Previous Salary</label>
                        <div class="input-group flex-1">
                            <input id="previous_salary" name="previous_salary" type="number" step="any" class="form-control" placeholder="Previous Salary" value="0">
                            <div class="pl-5 w-full">
                                <select class="w-full" id="employmentSalary_frequency" name="employmentSalary_frequency">
                                    <option value="annual">Per/Year</option>
                                    <option value="monthly">Per/Month</option>
                                    <option value="daily">Per/Day</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-12 mt-2">
                        <label for="modal-form-2" class="form-label">Separation Cause</label>
                        <div class="input-group flex-1">
                            <select class="w-full"id="modal_sp_id2" name="modal_sp_id2">
                                <option></option>
                                ${response.emp_separation}
                            </select>
                            <div class="pl-5">
                                <a href="javascript:;"
                                    class="btn btn-outline-secondary"
                                    data-tw-toggle="modal"
                                    data-tw-target="#modal_add_separation">
                                    <i class="fa fa-plus text-success w-4 h-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>


                    <div class="col-span-12 sm:col-span-12 mt-2">
                        <label for="modal-form-2" class="form-label">Place Assignment</label>
                        <div class="input-group flex-1">
                            <select class="w-full"id="modal_pa_id2" name="modal_pa_id2">
                                <option></option>
                                ${response.emp_placeOf_assignment}
                            </select>
                            <div class="pl-5">
                                <a href="javascript:;"
                                    class="btn btn-outline-secondary"
                                    data-tw-toggle="modal"
                                    data-tw-target="#modal_add_placeAssignment">
                                    <i class="fa fa-plus text-success w-4 h-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 border border-slate-200 box p-2">

                        <div id="leave_wp_div" class="col-span-12 sm:col-span-12">
                            <div class="flex mb-4 items-center">
                                <label class="">Leave W/out Pay</label>
                        </div>

                        <div class="col-span-12">
                            <div class="grid grid-cols-12 gap-5 mt-5 lwp_div_container">
                                
                            ${response.Leave_without_pay}

                                <div class="col-span-12 sm:col-span-4 2xl:col-span-3 box p-2 cursor-pointer">
                                    <div id="add_lwp_date" class="font-medium text-base border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4 pb-4 flex items-center justify-center h-full">
                                        <i class="fa-solid fa-plus h-5 w-5 text-slate-400"></i>
                                    </div>
                                </div>

                            </div>
                        </div>  
                    
                    </div>                      

                </div>

            `);

            reload_sr_select2();

            $("#modal_start_date2").val(emp_date_start.trim());
            $("#modal_end_date2").val(emp_date_end.trim());
            $("#modal_employment_type2")
                .val(emp_employment_type)
                .trigger("change");
            $("#modal_designation_id2").val(emp_designation).trigger("change");
            $("#modal_position_id2").val(emp_position).trigger("change");
            $("#modal_rc_id2").val(emp_res_center).trigger("change");
            $("#previous_salary").val(emp_salary);
            $("#modal_sp_id2").val(emp_separation).trigger("change");
            $("#modal_pa_id2").val(emp_place_assign).trigger("change");
            $("#modal_sg").val(emp_sg).trigger("change");
            $("#modal_agency_branch").val(emp_agency_branch).trigger("change");
            $("#modal_sg_step").val(emp_sg_step).trigger("change");
            $("#employmentSalary_frequency").val(emp_salary_frequency).trigger("change");

            $("#sr_footer").html(
                '<button id="sr_cancel_btn" type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">Cancel</button>' +
                    '<button id="sr_load_employee_save" type="submit" class="btn btn-primary w-20">Save</button>'
            );

            $("#print_sr").addClass("hidden");
        },
    });
}

function load_employee_record(emp_agency_id){
    $.ajax({
        type: "get",
        url: "/admin/load/employee-record",
        data: {_token:_token, agency_id:emp_agency_id},
        beforeSend: function() {
            $('#sr_modal_body').html('<i id="loading_spinner" class="fa-solid fa-spinner fa-spin"></i>');
        },
        success: function (response) {
            $('#sr_modal_body').html(response);
            $('#sr_footer').html('<button id="sr_cancel_btn" type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">Cancel</button>');
            $('#print_sr').removeClass('hidden');
            
        }
    });
}

function add_previous_sr(){

    $("#add_previous_sr").submit(function (e) {
        e.preventDefault();

        var fd = $(this);
        if(inputChecker()){

            if(check_lwp_record()){
                $.ajax({
                    type: "post",
                    url: "/admin/add-previous-sr",
                    data: fd.serialize(),
                    success: function (response) {

                        if(response.status == 200) {
                            if(history_action != ''){
                                __notif_show(1,"Previous Record Updated Successfully");
                            }else{
                                __notif_show(1,"Previous Record Added Successfully");
                            }
                            load_employee_record(emp_agency_id);


                            $('#i_icon').removeClass('fa fa-undo').addClass('fa fa-plus');
                            $('#record_lbl').text('Add Previous Record');

                            clear_dataValues();


                        }else{
                            // alert(response.message);
                            __notif_show(-1, response.message);
                        }

                        addRecord = !addRecord;

                    }
                });
            }
            
           
        }


    });

    $("body").on('change', '.leave_without_pay', function () {
        check_lwp_record();
    });
}

function check_lwp_record() {
    var lwpDivs = $('.lwp_div_container').find('input.leave_without_pay');
    var noDuplicates = true;

    if (lwpDivs.length > 0) {
        var valueMap = {};

        lwpDivs.each(function() {
            var inputValue = $(this).val();

            if (valueMap[inputValue]) {
                valueMap[inputValue].push($(this));
            } else {
                valueMap[inputValue] = [$(this)];
            }
        });

        console.log(valueMap);
        

        $.each(valueMap, function(key, elements) {
            if (elements.length > 1) {
                noDuplicates = false;
                elements.forEach(function(el) {
                    el.css('border', '2px solid red');
                });
            } else {
                elements[0].css('border', '');
            }
        });
    }

    return noDuplicates;
}

function inputChecker() {
    var modal_start_date2 = $('#modal_start_date2');
    var modal_end_date2 = $('#modal_end_date2');
    var modal_employment_type2 = $('#modal_employment_type2');
    var modal_position_id2 = $('#modal_position_id2');
    var modal_rc_id2 = $('#modal_rc_id2');
    var previous_salary = $('#previous_salary');
    var modal_sp_id2 = $('#modal_sp_id2');

    var isValid = true;

    // Check start date
    if (modal_start_date2.val() == '') {
        modal_start_date2.css('border-color', 'red');
        isValid = false;
    } else {
        modal_start_date2.css('border-color', '');
    }

    // Check end date
    if (modal_end_date2.val() == '') {
        modal_end_date2.css('border-color', 'red');
        isValid = false;
    } else if (modal_end_date2.val() < modal_start_date2.val()) {
        modal_end_date2.css('border-color', 'red');
        isValid = false;
        // You might want to display a message to the user informing them that end date cannot be earlier than start date
    } else {
        modal_end_date2.css('border-color', '');
    }

    // Check employment type
    if (modal_employment_type2.val() == '') {
        $('#modal_employment_type2').select2({
            theme: "error",
            placeholder: "This field is required",
        });
        isValid = false;
    }else{
        $('#modal_employment_type2').select2({
            placeholder: "Select Your Previous Employment Type",
            allowClear: true,
            closeOnSelect: false,
        });
    }

    // Check position
    if (modal_position_id2.val() == '') {
        $('#modal_position_id2').select2({
            theme: "error",
            placeholder: "Your Previous Position is required",
        });
        isValid = false;
    }else{
        $('#modal_position_id2').select2({
            placeholder: "Select Your Previous Position",
            allowClear: true,
            closeOnSelect: false,
        });
    }

    // // Check responsibility center
    // if (modal_rc_id2.val() == '') {
    //     $('#modal_rc_id2').select2({
    //         theme: "error",
    //         placeholder: "Your Previous Office is required",
    //     });
    //     isValid = false;
    // }else{
    //     $('#modal_rc_id2').select2({
    //         placeholder: "Select Previous Office",
    //         allowClear: true,
    //         closeOnSelect: false,
    //     });
    // }

    // Check previous salary
    if (previous_salary.val() == '' || previous_salary.val() == 0) {
        previous_salary.css('border-color', 'red');
        isValid = false;
    } else {
        previous_salary.css('border-color', '');
    }

    // // Check separation cause
    // if (modal_sp_id2.val() == '') {
    //     $('#modal_sp_id2').select2({
    //         theme: "error",
    //         placeholder: "Your Separation Cause is required",
    //     });
    //     isValid = false;
    // }else{
    //     $('#modal_sp_id2').select2({
    //         placeholder: "Select Separation Cause",
    //         allowClear: true,
    //         closeOnSelect: false,
    //     });
    // }

    return isValid;
}

function cancelModal(){
    $("body").on('click', '#sr_cancel_btn', function () {
        clear_dataValues();
    });
}

function clear_dataValues(){
        emp_history_id = '';
        emp_date_start = '';
        emp_date_end = '';
        emp_salary = '';
        emp_separation = '';
        emp_place_assign = '';
        emp_employment_type = '';
        emp_position = '';
        emp_designation = '';
        emp_res_center = '';
        emp_agency_branch = '';
        history_action = '';
}

function present_LNP_checker() {
    var zeroValueCount = 0;

    $('#present_lnp_sr').each(function() {
        var inputValue = $(this).val();

        if (parseInt(inputValue) === 0) {
            zeroValueCount++;
        }
    });

    var inputCount = $('#present_lnp_sr').length;
    if (zeroValueCount !== inputCount) {

        return true;
    } else {
        __notif_show(-1,"Update Failed");
        return false;

    }
}


