var  _token = $('meta[name="csrf-token"]').attr('content');
var searchCandidate_filter = '';
var position_jobReference = '';
var finalListPositionID = 0;
$(document).ready(function () {
    bpath = __basepath + "/";
    $('.ramarks_div').hide();

    _thisSelect();
    onChange_function();
    fetch_Select_applicant()
    _onClick_function();
    onSubmit();
    cancel();
    fetched_rated_position()

    view_ratedApplicant_click();
    rate_used();
    // alert('yawa')

});
function _thisSelect(){
    $('#pos_cat').select2({
        placeholder: "Select Position ",
        closeOnSelect: true,

    });

    $('#active_position').select2({
        placeholder: "Select Position ",
        closeOnSelect: true,
        allowClear: true
        
    });
    $('#interview_status').select2({
        placeholder: "Select Status ",
        closeOnSelect: true,

    });
    $('#interview_position').select2({
        placeholder: "Select position ",
        closeOnSelect: true,

    });
    $('#position').select2({
        placeholder: "Select position ",
        closeOnSelect: true,

    });

    $('#status_rated').select2({
        placeholder: "Select Status ",
        closeOnSelect: true,

    });

    $('.noted_select').select2({
        placeholder: "Select Employee",
        closeOnSelect: true
    });

    $('#prepared_select').select2({
        placeholder: "Select Employee",
        closeOnSelect: true,

    });

    $('#prepared_designation_select').select2({
        placeholder: "Select Disignation",
        closeOnSelect: true,

    });

    $('.noted_designation_select').select2({
        placeholder: "Select Designation",
        closeOnSelect: true,

    });
}

function onChange_function(){
    $("body").on('change', '#position', function () {
        var position_id = $(this).val();
        var status_id = $('#status_rated').val();
        fetched_rated_applicants(jobref_no, top_id, status_id);
    });
    $("body").on('change', '#status_rated', function () {
        var status_id = $(this).val();
        var position_id = $('#position').val();
        fetched_rated_applicants(jobref_no, top_id, status_id);
    });

    $("body").on('change', '#active_position', function () {
        finalListPositionID = $(this).val();
        fetch_Select_applicant(finalListPositionID)
        searchCandidate_filter = '';
        position_jobReference = '';
        $('#searchCandidate_filter').val('');

        $('#applicantFinalListed_container').html(`<div class="col-span-12 h-[70vh] flex items-center justify-center">
                                            <div class="text-center">
                                                <div class="mt-3">
                                                    <div class="font-medium">No Selected Position!</div>
                                                    <div class="text-slate-500 mt-1">Please select a Position to start rating.</div>
                                                </div>
                                            </div>
                                        </div>`);

    });

    $("#rated_check").on("click", function(){
        var status_id = $('#status_rated').val();
        var position_id = $('#position').val();

        var rated_check_in_value;

        if($(this).is(":checked") || $("#rated_check").is(":checked")) {

            rated_check_in_value =  $('#rated_check_in').val(1);

        } else {

            rated_check_in_value = $('#rated_check_in').val(0);
        }

        fetched_rated_applicants(jobref_no, top_id, status_id);

    });

}

var interview_date = null;
var counter = 1;

function gatherSignatoriesData() {
    const signatoriesData = [];

    $('.signatories_label_div').each(function() {
        const label = $(this).find('.editable-label').text().trim().replace(/[^a-zA-Z\s]+|:/g, '');

        // Check if the label already exists in the signatoriesData array
        let existingLabelEntry = signatoriesData.find(entry => entry.signatory_label === label);

        // If the label doesn't exist yet, create a new entry for it
        if (!existingLabelEntry) {
            existingLabelEntry = {
                signatory_label: label,
                signatories: []
            };
            signatoriesData.push(existingLabelEntry);
        }

        $(this).find('.signer_div').each(function() {
            // Collect values from the current signer div
            const notedSelect = $(this).find('.noted_select').val();
            const academicExtension = $(this).find('.academic_extension').val() || null;
            const designation = $(this).find('.noted_designation_select').val();

            // Add the collected values to the existing signatory group
            existingLabelEntry.signatories.push({
                notedSelect: notedSelect,
                academicExtension: academicExtension,
                designation: designation
            });
        });
    });

    console.log(signatoriesData); // For debugging purposes
    return signatoriesData;
}


function _onClick_function(){

    $('#signatory_form').on('submit', function(event) {
        event.preventDefault();
    
        const signatoriesData = gatherSignatoriesData();
    
        // Clear existing hidden inputs before appending new ones
        $('#signatory_form').find('.signatories-hidden-input').remove();
    
        signatoriesData.forEach(function(labelData, labelIndex) {
            const label = labelData.signatory_label;
    
            labelData.signatories.forEach(function(data, signerIndex) {
                // Append hidden inputs for each signatory under each label
                $('#signatory_form').append(`
                    <input type="hidden" name="signatories[${labelIndex}][signatory_label]" value="${label}" class="signatories-hidden-input">
                    <input type="hidden" name="signatories[${labelIndex}][signatories][${signerIndex}][notedSelect]" value="${data.notedSelect}" class="signatories-hidden-input">
                    <input type="hidden" name="signatories[${labelIndex}][signatories][${signerIndex}][academicExtension]" value="${data.academicExtension}" class="signatories-hidden-input">
                    <input type="hidden" name="signatories[${labelIndex}][signatories][${signerIndex}][designation]" value="${data.designation}" class="signatories-hidden-input">
                `);
            });
        });
    
        this.submit(); // Submit the form after appending the hidden inputs
    });
    
    $("body").on('click', '.printSummary', function (e) {
        e.stopPropagation();
        counter = 1;
         var authen = $(this).data('user');
         var panels =  $(this).data('panels');
         var job_ref = $(this).data('job-ref');
         var position =  $(this).data('position');

        //  console.log('authen: ' + authen);
        //  console.log('panels: ' + panels);
        //  console.log('job_ref: ' + job_ref);
        //  console.log('position: ' + position);

        $("#jobRefNo").val(job_ref);
        $("#sig_modal_position").val(position);
        $("#user").val(authen);
         
         $('#prepared_select').val(authen).trigger('change');

        $('.signers_list_div.noted').html(panels);

        $('.noted_select').select2({
            placeholder: "Select Employee",
            closeOnSelect: true
        });

        $('.noted_designation_select').select2({
            placeholder: "Select Designation",
            closeOnSelect: true
        });
    });

    $("body").on('click', '.add_signer', function () {
        var signatories = $(this).closest('div.signatories_label_div');
        var signers_list_div = signatories.find('div.signers_list_div');
        
        $.ajax({
            type: "GET",
            url: bpath + "rating/load-employee-profile",
            beforeSend: function() {
                signers_list_div.find('.signer_div').prop('disabled', true);
                signers_list_div.append(`
                    <div class="border px-8 py-5 rounded p-2 mt-2 relative signer_div opacity-50 beforeSend_loading">
                        <div class="border-b pb-3 flex">
                            <div class="w-full text-center">
                                <i class="fa fa-spinner fa-spin fa-3x fa-fw text-slate-500 fa-beat"></i>
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                `);
            },
            dataType: "json",
            success: function (response) {
                signers_list_div.find('.signer_div.beforeSend_loading').remove().prop('disabled', false);
    
                signers_list_div.append(`
                    <div class="border px-8 py-5 rounded p-2 mt-2 relative signer_div">
                        <div class="border-b pb-3 flex">
                            <div class="w-3/4 mr-1">
                                <select name="noted_select" id="noted_select${counter}" class="select2 noted_select w-full">
                                    <option></option>
                                    ${response.profile}
                                </select>
                            </div>
                            <div class="w-1/4">
                                <input id="academic_extension" name="academic_extension" type="text" class="form-control text-center h-full academic_extension" placeholder="ex. PhD">
                            </div>
                        </div>
                        <div class="mt-3">
                            <select name="noted_designation_select" id="noted_designation_select${counter}" class="select2 w-full text-center noted_designation_select">
                                <option></option>
                                ${response.designation}
                            </select>
                        </div>
                        <div class="absolute" style="top: 0; right: 0;">
                            <a href="javascript:;" class="remove_this_singner"> 
                                <i class="fa-solid fa-xmark w-4 h-4 text-slate-400"></i>
                            </a>
                        </div>
                    </div>
                `);
    
                $('#noted_select'+counter).select2({
                    placeholder: "Select Employee",
                    closeOnSelect: true
                });

                $('#noted_designation_select'+counter).select2({
                    placeholder: "Select Designation",
                    closeOnSelect: true
                });


                counter++;
            }
        });
    });

    $("body").on('click', '.add_signatories_label', function () {
        var signatories_div_holder = $('.signatories_div_holder');
        
        console.log(signatories_div_holder);
        
        $.ajax({
            type: "GET",
            url: bpath + "rating/load-employee-profile",
            beforeSend: function() {
                signatories_div_holder.append(`
                    <div class="border px-8 py-5 rounded p-2 mt-2 relative signer_div opacity-50 beforeSend_loading">
                        <div class="border-b pb-3 flex">
                            <div class="w-full text-center">
                                <i class="fa fa-spinner fa-spin fa-3x fa-fw text-slate-500 fa-beat"></i>
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                `);
            },
            dataType: "json",
            success: function (response) {
                signatories_div_holder.find('.signer_div.beforeSend_loading').remove();
    
                signatories_div_holder.append(`<div class="mt-3 border rounded p-2 signatories_label_div">
                     <div class="flex">
                        <div class="font-medium editable-label w-24 text-left p-2" data-placeholder="Ex, Prepared By" contenteditable="true"></div>    
                        <a href="javascript:;" class="remove_signatories_label_div ml-auto text-danger"><i class="fa-solid fa-xmark w-4 h-4 text-slate-400"></i></a>                       
                    </div> 
                    <div class="signers_list_div noted">
                    
                        <div class="border px-8 py-5 rounded p-2 mt-2 relative signer_div">
                            <div class="border-b pb-3 flex">
                                <div class="w-3/4 mr-1">
                                    <select id="noted_select${counter}" name="noted_select" class="select2 noted_select w-full">
                                        <option></option>
                                        ${response.profile}
                                    </select>
                                </div>
                                <div class="w-1/4">
                                    <input id="academic_extension" name="academic_extension" type="text" class="form-control text-center h-full academic_extension" placeholder="ex. PhD">
                                </div>
                            </div>
                            <div class="mt-3">
                                <select id="noted_designation_select${counter}" name="noted_designation_select" class="select2 w-full text-center noted_designation_select">
                                    <option></option>
                                    ${response.designation}
                                </select>
                            </div>
                            <div class="absolute" style="top: 0; right: 0;">
                                <a href="javascript:;" class="remove_this_singner"> 
                                    <i class="fa-solid fa-xmark w-4 h-4 text-slate-400"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                     <div class="flex">
                            <div class="ml-auto">
                                <label class="mr-1 whitespace-nowrap">Add Signatories</label>    
                                <a href="javascript:;" class="add_signer ml-auto btn btn-secondary h-8 w-8 mt-2"> <i class="fa fa-plus w-4 h-4 text-success"></i> </a>
                                                           
                            </div>
                        </div>
                </div> `);
    
                $('#noted_select'+counter).select2({
                    placeholder: "Select Employee",
                    closeOnSelect: true
                });

                $('#noted_designation_select'+counter).select2({
                    placeholder: "Select Designation",
                    closeOnSelect: true
                });


                counter++;
            }
        });
    });
    
    $("body").on('click', '.remove_this_singner', function () {
        $(this).closest('div.signer_div').remove();
    });

    $("body").on('click', '.remove_signatories_label_div', function () {
        var signatories_label_div = $(this).closest('div.signatories_label_div').remove();
    });

    $("body").on('change', '#prepared_select', function (e) { 
        e.preventDefault();
    
        var signer_div = $(this).closest('div.signer_div');
        var disignation = signer_div.find('#prepared_designation_select');
        var agencyID = $(this).val();
        // console.log($(this).val());

        $.ajax({
            type: "GET",
            url: bpath +"rating/load-employee-designation",
            data: {agencyID: agencyID},
            dataType: "json",
            success: function (response) {
                disignation.val(response).trigger('change');
            }
        });

        

    });
    
    $("body").on('change', '.noted_select', function (e) { 
        e.preventDefault();
    
        var signer_div = $(this).closest('div.signer_div');
        var designation = signer_div.find('.noted_designation_select');
        var agencyID = $(this).val();

        $.ajax({
            type: "GET",
            url: bpath +"rating/load-employee-designation",
            data: {agencyID: agencyID},
            dataType: "json",
            success: function (response) {
                designation.val(response).trigger('change');
            }
        });

        

    });

    let debounceTimer;

    $("body").on('input', '#searchCandidate_filter', function () {
        searchCandidate_filter = $(this).val();
        
        clearTimeout(debounceTimer);

        if(position_jobReference != ''){
            debounceTimer = setTimeout(function () {
                fetching_finalListing(position_jobReference, searchCandidate_filter);
            }, 500);
        }
        
    });

    //======================================      hangang Dito muna TAyo mga loooooool =================================================//
    
    //Hire Class Button
    $("body").on('click', '.hired_class', function(){

        $('.hireNotify_btn').text('Hire and Notify');
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        let rated_id = $(this).data('rated-id')
        let shortList_id = $(this).data('shortlist-id')
        let applicant_id = $(this).data('applicant-id')
        let position_name = $(this).data('position-name')
        let salaryGrade = $(this).data('salary-grade')
        let applicantEmail = $(this).data('applicant-email')
        let ref_num = $(this).data('job-ref')
        let position_id = $(this).data('position-id')
        let name = $(this).data('name')

        $('#notifier-header').text('Hired For :  ' + position_name +' ('+ salaryGrade+')');

        $('#applicant-name').text('Applicant Name : ' + name);

        $('#position-name').val(position_name);
        $('#rated-id').val(rated_id);
        $('#job-ref').val(ref_num);
        $('#applicant-id').val(applicant_id);
        $('#position-id').val(position_id);
        $('#applicantEmail').val(applicantEmail.trim());

        $('#shortList_id').val(shortList_id);

        const notify_hire_Modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#hire_modal"));
        notify_hire_Modal.show();
        

    })

    // Disapprove Class Button
    $("body").on('click', '.disapprove_class', function(){
        
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        let rated_id = $(this).attr('id');
        let notify = $(this).data('notify');
        let status = $(this).data('status');

        let status_id = $('#status_rated').val();
        let positionRated_id = $('#position').val();

        if(notify != 0 && status === 22){

                Swal.fire({
                    title: '<strong>Can'+"'t"+' Disapprove</strong>',
                    icon: 'warning',
                    html:
                      'Applicant interview is already <b>Notified</b> by the Head',
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText:
                      'Ok',
                    confirmButtonAriaLabel: 'Thumbs up, Ok',

                  })

        }else{

            $.ajax({
                url:  bpath + 'rating/disapprove-applicant/'+rated_id,
                method: 'get',
                data: {_token:_token,
                        },
                success: function (response) {
                    console.log(response.status);

                    if(response.status == 200){
                        __notif_show( 1," Applicant Disapproved");

                        fetched_rated_applicants(jobref_no, top_id, status_id);
                        _thisSelect()
                        load_activity_logs();
                    }

                }
            });

        }

    })

    // Change Status Button
    $("body").on('click', '._changeStat', function () {
        
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        let rates_id = $(this).attr('id')
        let position = $(this).data('position-id')
        let status_id = $('#status_rated').val();
        let positionRated_id = $('#position').val();

        $.ajax({
            url:  bpath + 'rating/change-status/'+rates_id+'/'+position,
            method: 'get',
            data: {_token:_token,
                    },
            success: function (response) {
                console.log(response.status);

                if(response.status == 200){
                    __notif_show( 1," Status Change Successfully ");

                    fetched_rated_applicants(jobref_no, top_id, status_id);
                    _thisSelect();
                    load_activity_logs();
                }

            }
        });
    });

    // End Contruct Button
    $("body").on('click', '.end_contruct', function () {
        
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        let ratess_id = $(this).attr('id')
        let positions_ids = $(this).data('position-id')
        let applicant_id = $(this).data('applicant-id')
        let status_id = $('#status_rated').val();
        let positionRated_id = $('#position').val();

        swal({
            title: "Are you sure?",
            text: "This Action will end this Employee's Contruct",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No, cancel",
          }).then((result) => {

            console.log(result);
            if (result.value) {
               
                $.ajax({
                    url:  bpath + 'rating/end-contruct',
                    method: 'get',
                    data: {_token:_token, applicant_id:applicant_id,
                            ratess_id:ratess_id,
                            positions_ids:positions_ids,
                            },
                    success: function (response) {
                        
                        if(response.status == 200){
                            __notif_show( 1,"Contruct Ends Successfully ");
        
                            fetched_rated_applicants(jobref_no, top_id, status_id);
                            _thisSelect();
                            load_activity_logs();
                        }
        
                    }
                });
            } else if(result.dismiss === "cancel") {
              swal("Cancelled", "The Employee is safe :)", "error");
            }
          });



       
    });

    //Proceed to final listed Button
    $("body").on('click','.proceed', function () {

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        interview_date = $(this).data('inter-date');

        if($(this).hasClass('dateSched')) {
            $('#interview_datesss').val(interview_date);
        }else{
            $('#interview_datesss').val('');
            interview_date = null;
        }
        
        let rated_doneID = $(this).attr('id');
        let positions_ids = $(this).data('position-id');
        let applicant_name = $(this).data('applicant-name');
        let position_name = $(this).data('position-name');
        let job_ref = $(this).data('job-ref');
        let applicant_id = $(this).data('applicant-id');


        $('#applicant_name').text(applicant_name);
        $('#rated_id').val(rated_doneID);
        $('#position_id').val(positions_ids);
        $('#job_ref').val(job_ref);
        $('#applicant_id').val(applicant_id);
        $('#notifier_header').text(position_name);
        $('#interview_datesss').val(interview_date);

            const notify_Modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#notifyier_modal"));
            notify_Modal.show();
    });

    //Undo Processing
    $("body").on('click', '.undo', function () {

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        let rates_id = $(this).attr('id')
        let job_ref = $(this).data('job-ref')
        let status = $(this).data('status')

        console.log(rates_id, job_ref, status);
        $.ajax({
            url:  bpath + 'rating/undo-select',
            method: 'get',
            data: {_token:_token,job_ref:job_ref,rates_id:rates_id, status:status
                    },
            success: function (response) {
                console.log(response.status);

                if(response.status == 200){
                    __notif_show( 1," Undo Changes Successfully ");

                    fetching_finalListing(job_ref, searchCandidate_filter)
                    
                }

            }
        });
    });

    //Final Listed Applicant Pass
    $("body").on('click',' .listed_pass', function () {

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();


        let id = $(this).attr('id')
        let name = $(this).data('name')
        let job_ref = $(this).data('job-ref')
        let remarks = $(this).data('remarks')
        let aplicant_profile_pic = $(this).data('aplicant-profile')
        let pos_id = $('#active_position').val();

        $('#selection_modal_image').attr('src', aplicant_profile_pic)
        $('#select_applicantName').text(name)
        $('#remarks').text(remarks);
        $('#listed_id').val(id);
        $('#job_ref').val(job_ref);
        $('#applicantName_input').val(name);

        if($(this).text().trim() == 'Mark as Qualified') {
            $('#select_save').text('Mark as Qualified').removeClass('btn-danger').addClass('btn-primary');
        }else {
            $('#select_save').text('Return').removeClass('btn-primary').addClass('btn-danger');
        }

    });

    //Final Select Save
    $("body").on('click', '#select_save', function () {

        let liste_id =  $('#listed_id').val();
        let job_ref =  $('#job_ref').val();
        let pres_notes =  $('#pres_notes').val();
        let name =  $('#select_applicantName').text();
        let text = $(this).text();

        $.ajax({
            url:  bpath + 'rating/select-applicant',
            method: 'get',
            data: {_token:_token, pres_notes:pres_notes, liste_id:liste_id, text:text.trim(), job_ref:job_ref,
                    },
            success: function (response) {

                if(response.status == 200){
                    __notif_show( 1, name+"  "+response.message);

                    $('#pres_notes').val("");
                    const select_Modal = tailwind.Modal.getInstance(document.querySelector("#selection_modal"));
                    select_Modal.hide();

                    fetching_finalListing(job_ref, searchCandidate_filter)
                    load_activity_logs();
                }

            }
        });
    });

    //On Click Rater info
    $("body").on('click','.rater_click', function () {

        if ($(this).hasClass('bg-primary')) {
            $(this).removeClass('bg-primary');
            $(this).removeClass('text-white');
            $(this).find('.r_post').addClass('text-slate-500').removeClass('text-white');
            $(this).find('.points').addClass('text-slate-600 dark:text-slate-500').removeClass('text-white');

            $('.crit_points_class').html('');
            $('.ramarks_div').hide();

        }else{
            $('.rater_click').removeClass('bg-primary');
            $('.rater_click').removeClass('text-white');
            $('.rater_click').find('.r_post').addClass('text-slate-500').removeClass('text-white');
            $('.rater_click').find('.points').addClass('text-slate-600 dark:text-slate-500').removeClass('text-white');

            $(this).addClass('bg-primary');
            $(this).find('.r_post').removeClass('text-slate-500').addClass('text-white');
            $(this).find('.points').removeClass('text-slate-600 dark:text-slate-500').addClass('text-white');

            $(this).addClass('text-white');

            let rater_id = $(this).attr('id');
            let rater_name = $(this).data('rater-name');
            let rater_points = $(this).data('points');
            let check_value = $(this).data('check-value');
            let applicant_id = $('#applicant_id').val();
            let job_ref = $('#job_ref').val();
            let short_list = $('#short_listID').val();

            $('.crit_points_class').html('');
            $('.ramarks_div').hide();
            $.ajax({
                url:  bpath + 'rating/rater-criteria-points',
                method: 'get',
                data: {_token:_token,rater_id,applicant_id,job_ref,short_list,check_value,
                        },
                success: function (response) {

                    $('#crit_points_'+rater_id).html(response.criteria);
                    $('#rater_remark').text(response.remark);

                    $('#rater_name').text('Rated By:  '+rater_name);
                    $('#rater_point').text(rater_points);
                    $('#ramarks_div_'+rater_id).show();
                }
            });
        }
        

    });

    //On Click Criteria Info
    $("body").on('click','.tr_criteria', function () {
        let crit_id = $(this).attr('id')
        let crit_name = $(this).data('criteria-name')
        let rater_agency_id = $(this).data('rater-agency-id')
        let _applicant_id = $('#applicant_id').val()
        let _job_ref = $('#job_ref').val()
        let _short_listID = $('#short_listID').val()

        $('#criter_name').text(crit_name);

        const area_rater_infoModal = tailwind.Modal.getInstance(document.querySelector("#aria_rate_info_modal"));
        area_rater_infoModal.show();

        $.ajax({
                url:  bpath + 'rating/rater-aria-points',
                method: 'get',
                data: {_token:_token,crit_id,rater_agency_id,_applicant_id,_job_ref,_short_listID,
                        },
                success: function (response) {

                    $('#raterArea_points_div').html(response);
                }
            });
    });

    //Remove Applicant
    $("body").on('click', '.remove_applicant', function () {
        let position = $('#position').val();
        let status_id = $('#status_rated').val();
        let rated_id = $(this).attr('id');
        let job_ref = $(this).data('job-ref');

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove it!'
          }).then((result) => {
            if (result.value == true) {
              $.ajax({
                    url:  bpath + 'rating/remove-applicant',
                    method: 'get',
                    data: {_token:_token, rated_id:rated_id, job_ref:job_ref,
                            },
                    success: function (response) {

                        if(response.status == 200){
                            __notif_show( -1,"Applicant Remove Successfuly");
                            
                            if(response.count > 0){
                                fetched_rated_applicants(jobref_no, top_id, status_id);
                            }else{
                                fetched_rated_position();
                            }

                           
                        }else{
                            swal("Warning!", "Remove Unsuccessful.", "warning");
                        }

                    }
                });
            }

        })
    });

    $("body").on('click', '.noteClick', function () {
        
        var notes = $(this).data('heads-note');

        swal({
            title: '<span style="font-size: 14px;">Agency Head Notes</span>',
            text: notes,
            timer: 2000
          });

        
    });

    //Click Action Button
    $("body").on('click', '.action_by', function () {

        var procedure_image = $(this).data('proceed-by-image');
        var procedure_name = $(this).data('proceded-by-name');
        var position_name = $(this).data('position-name');

        $('#proceedure_image').attr('src', procedure_image);
        $('#proceedure_name').text(procedure_name);
        $('#position_name').text(position_name);

       const action_by_Modal = tailwind.Modal.getInstance(document.querySelector("#action_by_modal"));
       action_by_Modal.show();
    });

    var applicantID;
    var job_refer;

    $("body").on('click', '.attached_file', function () {
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide()

        var applicant_name = $(this).data('applicant-name');
        var applicant_image = $(this).data('applicant-image');
        applicantID = $(this).data('applicant-id');
        job_refer = $(this).data('job-ref');
        divName = 'attachedFile-div';

        let ratedApplicant_id = $(this).attr('id');
        let position_id = $(this).data('position-id');
        let shortList_id = $(this).data('shortlist-id');
        let position_name = $(this).data('position-name')


        $('.add-attachment').attr({
            'id': ratedApplicant_id,
            'data-applicant-name': applicant_name,
            'data-position-id': position_id,
            'data-position-name': position_name,
            'data-applicant-id': applicantID,
            'data-job-ref': job_refer,
            'data-shortlist-id': shortList_id
        });

        $('#applicant_modal_image').attr('src', applicant_image);
        $('#applicantName').text(applicant_name);
        $('#applicant-idl').val(applicantID);

        // console.log(applicantID, job_refer);

        load_attached_files(applicantID, job_refer, divName);

        const file_attached_Modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#file_attached_modal"));
        file_attached_Modal.show();
    });

    $("body").on('click', '.remove_file', function () {
        var files_id = $(this).data('file-id');

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove it!'
          }).then((result) => {
            if (result.value == true) {
              $.ajax({
                    url:  bpath + 'rating/remove-file-attached',
                    method: 'get',
                    data: { _token:_token, 
                            files_id:files_id
                           },
                    success: function (response) {

                        if(response.status == 200){
                            __notif_show( -1,"File Remove Successfuly");
                            
                            load_attached_files(applicantID, job_refer, divName);

                           
                        }else{
                            swal("Warning!", "Remove Unsuccessful.", "warning");
                        }

                    }
                });
            }

        })
    });

    $("body").on('click', '.sendFile_class', function () {

        // $('.required_h_Class').addClass('hidden');

        $('.hireNotify_btn').text('Send');

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide()

        let ratedApplicant_id = $(this).attr('id');
        let Applicant_id = $(this).data('applicant-id');
        let jobRef = $(this).data('job-ref');
        let position_id = $(this).data('position-id');
        let shortList_id = $(this).data('shortlist-id');
        let salaryGrade = $(this).data('salary-grade')
        let applicantEmail = $(this).data('applicant-email')

        let applicant_name = $(this).data('applicant-name')
        let position_name = $(this).data('position-name')

        $('#notifier-header').text('Applying for :  ' + position_name+' ('+ salaryGrade+')');

        $('#applicant-name').text('Send File To : ' + applicant_name);


        $('#position-name').val(position_name);
        $('#rated-id').val(ratedApplicant_id);
        $('#applicant-id').val(Applicant_id);
        $('#job-ref').val(jobRef);
        $('#position-id').val(position_id);
        $('#shortList_id').val(shortList_id);
        $('#notif-code').val("notification-only");
        $('#applicantEmail').val(applicantEmail.trim());

        const hire_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#hire_modal"));
        hire_modal.show();
    });

    $("body").on('click', '.add-attachment', function () {
        divName = 'files-div';
        $('.hireNotify_btn').text('Send');

        let ratedApplicant_id = $(this).attr('id');
        let Applicant_id = $(this).data('applicant-id');
        let jobRef = $(this).data('job-ref');
        let position_id = $(this).data('position-id');
        let shortList_id = $(this).data('shortlist-id');

        let applicant_name = $(this).data('applicant-name')
        let position_name = $(this).data('position-name')

        $('#notifier-header').text('Applying for :  ' + position_name);

        $('#applicant-name').text('Send File To : ' + applicant_name);


        $('#position-name').val(position_name);
        $('#rated-id').val(ratedApplicant_id);
        $('#applicant-id').val(Applicant_id);
        $('#job-ref').val(jobRef);
        $('#position-id').val(position_id);
        $('#shortList_id').val(shortList_id);
        $('#notif-code').val("notification-only");

        const hire_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#hire_modal"));
        hire_modal.show();
    });

    var viewFiles = false;
    var divName = '';
    $("body").on('click', '.sent-files', function () {
        applicantID = $('#applicant-id').val();
        job_refer = $('#job-ref').val();
        var this_ = $(this).find('span.ggg');
        divName = 'files-div';

        $('.hireNotify_btn').text('Send');

        viewFiles = !viewFiles;
        
        if (viewFiles) {
            load_attached_files(applicantID, job_refer, divName);
            $('#single-file-upload').hide();
            this_.text('Add File/s');

        } else {
            
            $('#single-file-upload').show();
            $('#files-div').html('');
            this_.text('Sent File/s');
        }
          
    });
    
}


function fetch_Select_applicant(finalListPositionID){
    $.ajax({
        url:  bpath + 'rating/fetched/select-applicant',
        type: "get",
        data: {
            _token: _token,position_id:finalListPositionID,
        }, 
        beforeSend: function(){
            $('.finalListPosition_container').html(`<div class="border rounded cursor-pointer">
                <div class="flex flex-col lg:flex-row items-center p-5">
                    <div class="lg:mr-auto text-center lg:text-left mt-3 lg:mt-0" style="width:100%;">
                        <div class="font-medium text-center text-slate-400"> <i class="fa-solid fa-spinner fa-spin text-slate-400"></i> </div>
                        <div class="text-slate-500 truncate text-xs mt-0.5"></div>
                        <div class="text-xs mt-1 border-t pt-1">
                            <span class="text-slate-500"></span> 
                            <span class="font-bold cursor-pointer"></span>
                        </div>
                    </div>                                       
                </div>
            </div>`);
        },
        success: function(data) {

            $('.finalListPosition_container').html(data);
           
        }
    });
}

function fetching_finalListing(position_ref, searchCandidate_filter){
    $.ajax({
        url:  bpath + 'rating/fetched/listed-modal-applicant',
        type: "get",
        data: {
            _token: _token, 
            searchCandidate_filter: searchCandidate_filter, 
            position_ref:position_ref,
        },
        beforeSend: function(){
            $('#applicantFinalListed_container').html(`<div class="col-span-12 h-[70vh] flex items-center justify-center">
                                            <div class="text-center">
                                                <div class="mt-3">
                                                    <div class="font-medium"><i class="fa-solid fa-spinner fa-spin text-slate-400"></i> </div>
                                                    <div class="text-slate-500 mt-1">Loading Candidate ...</div>
                                                </div>
                                            </div>
                                        </div>`);
        },
        success: function(data) {

            $('#applicantFinalListed_container').html(data);

        }
    });
}

function load_attached_files(applicant_id, jobref, divName) {

    $.ajax({
        type: "get",
        url: bpath + "rating/load-attached-files",
        data: {_token:_token, applicant_id:applicant_id, jobref:jobref},
        success: function (response) {

            $('#' + divName).html(response);
            
        }
    });
}

function cancel(){
    finalListPositionID = $('#active_position').val();
    $("body").on('click' ,'#btn_cancel_listed_modal', function () {

        $('#files-div').html('');
        fetch_Select_applicant(finalListPositionID)
    });
    $("body").on('click', '#btn_cancel_mnotify_modal', function () {

        $('input[type="datetime-local"]').val('');
    });
}

var jobref_no;
var top_id = 'all';
var status_id = 'all';
function view_ratedApplicant_click() {
    
    $('body').on('click', '.view_rated_applicant', function () {

            jobref_no = $(this).attr('id');
            var tbl_ratedPosition = $('#tbl_ratedPosition').DataTable();
            
            var tr = $(this);
            var row = tbl_ratedPosition.row(tr);
    
            if (row.child.isShown()) {
                
                row.child.hide();
                tr.removeClass('shown');
                
                tr.removeClass('selected-row');
            } else {
               
                tbl_ratedPosition.rows().eq(0).each(function (idx) {
                    var row = tbl_ratedPosition.row(idx);
                    if (row.child.isShown()) {
                        row.child.hide();
                        
                        $('.view_rated_applicant.shown').removeClass('selected-row');
                    }
                });
    
                row.child(format(row.data())).show();
                tr.addClass('shown');                
                tr.addClass('selected-row');
            }
       
    });

  

    $("body").on('change', '.topsss_select', function (e) {
        e.preventDefault();

        top_id = $(this).val();
        fetched_rated_applicants(jobref_no, top_id, status_id);
        
    });

    $('body').on('click', '.ratingStatus_select', function (e) {
        e.preventDefault();

        status_id = $(this).val();
        fetched_rated_applicants(jobref_no, top_id, status_id);

    });

    $("body").on('click', '.positionFinalListed', function () {
        var positionFinalListed = $(this);
        
        let rated_doneID = positionFinalListed.attr('id');
        position_jobReference = positionFinalListed.data('job-ref')
        let position_name = positionFinalListed.data('position-name')
        $('#header_name').text('Position :  '+ position_name)

        // First, remove the styles and reset the class for all other .positionFinalListed elements
        $('.positionFinalListed').not(positionFinalListed).removeClass('text-white bg-primary')
            .find('.salaryGrade_finalListed, .candidate_finalListed').addClass('text-slate-500');
        
        // Then, toggle the clicked item (positionFinalListed)
        positionFinalListed.find('.salaryGrade_finalListed').removeClass('text-slate-500');
        positionFinalListed.find('.candidate_finalListed').removeClass('text-slate-500');
        positionFinalListed.addClass('text-white bg-primary');

        fetching_finalListing(position_jobReference, searchCandidate_filter)
    });
    

}

function fetched_rated_position(){
    var rated_check_in_value;
    if($("#rated_check").is(":checked")) {

        rated_check_in_value = 1;

    } else {

        rated_check_in_value = 0;
    }

    $.ajax({
        url:  bpath + 'rating/fetched/rated-position',
        type: "get",
        data: {
            _token: _token,
        },

        beforeSend: function () {
            $('#ratedApplicant_div').empty().append(`
                <div class="flex justify-center items-center h-40">
                    <svg width="40" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8 animate-spin">
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
            `);
        },
        success: function(data) {

            $('#ratedApplicant_div').html(data);
            load_activity_logs();
            $('#tbl_ratedPosition').DataTable({
                dom:
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
                    renderer: 'bootstrap',
                    "info": false,
                    "bInfo":true,
                    "bJQueryUI": true,
                    "bProcessing": true,
                    "bPaginate" : true,
                    "aLengthMenu": [[5,10,25,50,100,150,200,250,300,-1], [5,10,25,50,100,150,200,250,300,"All"]],
                    "iDisplayLength": 5,
                    "aaSorting": [],
            });

        }
    });
}

function format () {

    fetched_rated_applicants(jobref_no, top_id, status_id);

        return `<div class="intro-y col-span-12 flex flex-wrap xl:flex-nowrap items-center mt-2">
                
                <div class="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div class="w-full mt-3 xl:mt-0 flex-1">
                        <div class="form-check form-switch mr-4">

                            <label class="mr-2">Top List</label>
                        
                            <select class="topsss_select w-48 xl:w-auto form-select box">
                                <option value="all">All</option>
                                <option value="1">Top 1</option>
                                <option value="2">Top 2</option>
                                <option value="3">Top 3</option>
                                <option value="4">Top 4</option>
                                <option value="5">Top 5</option>
                                <option value="6">Top 6</option>
                                <option value="7">Top 7</option>
                                <option value="8">Top 8</option>
                                <option value="9">Top 9</option>
                                <option value="10">Top 10</option>
                            </select>
                            
                        </div>

                        

                    </div>
                    
                    <div class="form-check form-switch mr-4">

                            <label class="mr-2">Status</label>
                        
                            <select class="ratingStatus_select w-48 xl:w-auto form-select box">
                                
                               
                            </select>
                            
                        </div>
                </div>               


            </div>

            

            <div class="overflow-x-auto">
                <table id="tbl_applicant_rated-${jobref_no}" class="table table-report -mt-2">
                    <thead>
                        <th class="text-center whitespace-nowrap"> # </th>
                        <th class="text-center whitespace-nowrap"> Applicant Name </th>
                        <th class="text-center whitespace-nowrap"> Rating Status </th>
                        <th class="text-center whitespace-nowrap"> Points </th>
                        <th class="text-center whitespace-nowrap"> Action </th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>`;
}

function fetched_rated_applicants(jobref_no, top_id, status_id){
    showLoading();
    

    $.ajax({
        url:  bpath + 'rating/fetched/rated-applicant',
        type: "get",
        data: {
            _token: _token,
            jobref_no:jobref_no,
            tops_id:top_id,
            status_id:status_id
        },
        success: function(data) {

            $('#tbl_applicant_rated-'+jobref_no+' tbody').html(data.output);
            $('.ratingStatus_select').html(data.getStatus);

            $('.ratingStatus_select').val(status_id).trigger('change');

            


            var is_multiplied = data._is_multiplied;
            var _is_usePercent = data._is_usePercent;
            var is_hr = data.if_hr;
            if(_is_usePercent){
                $('#multiply_position').attr('disabled', true);
            }else{
                if(is_hr){
                    $('#multiply_position').attr('disabled', false);
                }else{
                    $('#multiply_position').attr('disabled', true);
                }
    
                if(is_multiplied){
                   $('#multiply_position').attr('checked', true);
                }else{
                    $('#multiply_position').attr('checked', false);
                }
            }            

            hideLoading();
            
        }
    });
}

function onSubmit(){

    $('#2ndInterview_form').submit(function (e) {
        e.preventDefault();

        const fd = new FormData(this);

        fd.append("interview_date", interview_date);

        let interviewDateInput = $('input[type="datetime-local"]');
        if(blockEmptyNotif()) {

            $.ajax({
                url: bpath + 'rating/notify-applicant',
                method: 'post',
                data: fd,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (data) {
                    let job_ref = $('#job_ref').val();
                    let name = $('label[id="applicant_name"]').text();
                    if (data.status == 200) {

                        interviewDateInput.css('border-color', '');
                        $('.requiredClass').removeClass('text-danger');
                        $('.requiredClass').addClass('text-slate-600');

                        interviewDateInput.val('');
                        __notif_show(1, name + " is Notified");
                        $('#2ndInterview_form')[0].reset();
                        fetched_rated_applicants(jobref_no, top_id, status_id);
                        const notify_Modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#notifyier_modal"));
                        notify_Modal.hide();
                        load_activity_logs();
                        
                    }
                }
            });
        }
    });

}

function rate_used(){

    $('body').on('click', '#multiply_position', function(){


        var if_check = $(this).is(":checked") ? true : false;

        $.ajax({
            type: "get",
            url: bpath + 'rating/multiply-to-position',
            data: {_token: _token, jobref_no: jobref_no, if_check:if_check},
            dataType: "json",           
            success: function (response) {
                if(response.status === 200) {
                    fetched_rated_applicants(jobref_no, top_id, status_id);
                }
            }
           });
    });
}

function load_activity_logs(){

    $.ajax({
        type: "get",
        url: bpath + "rating/activity-logs",
        data: {_token},
        success: function (response) {
            $('#activity_logsDiv').html(response);
        }
    });
}

function blockEmptyNotif(){
    var notif_b_date = $('#notif_b_date');
    var notif_date = $('#interview_datesss');
    var required_b_Class = $('.required_b_Class');
    var requiredClass = $('.requiredClass')

    if (notif_b_date.val() !== "" && notif_b_date.val() !== null) {
       
        notif_b_date.css('border-color', '');
        required_b_Class.removeClass('text-danger').addClass('text-slate-600');
    
        if (notif_date.val().trim() == null || notif_date.val().trim() == '') {
            notif_date.css('border-color', 'red');
            requiredClass.removeClass('text-slate-600').addClass('text-danger');
            return false;
        } else {
            notif_date.css('border-color', '');
            requiredClass.addClass('text-slate-600').removeClass('text-danger');
            return true;
        }
    } else {

        notif_b_date.css('border-color', 'red');
        required_b_Class.removeClass('text-slate-600').addClass('text-danger');
        if (notif_date.val() == null || notif_date.val() == '') {
            notif_date.css('border-color', 'red');
            requiredClass.removeClass('text-slate-600').addClass('text-danger');
        } else {
            notif_date.css('border-color', '');
            requiredClass.addClass('text-slate-600').removeClass('text-danger');
        }
        return false;
    }
   
    
    
    
}

function check_hireNotif_content(){
    var hire_notif = $('#hire_notif');
    var hire_email = $('#applicantEmail');
    var isValid = true;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check notification content
    if(hire_notif.val().trim() === '') {
        $('.required_c_Class').removeClass('text-slate-600').addClass('text-danger');
        hire_notif.css('border-color', 'red');
        isValid = false;
    } else {
        $('.required_c_Class').removeClass('text-danger').addClass('text-slate-600');
        hire_notif.css('border-color', '');
    }

    // Check email
    if(hire_email.val().trim() === '') {
        $('.required_email_Class').removeClass('text-slate-600').addClass('text-danger');
        hire_email.css('border-color', 'red');
        isValid = false;
    } else if (!emailRegex.test(hire_email.val().trim())) {
        $('.required_email_Class').removeClass('text-slate-600').addClass('text-danger');
        hire_email.css('border-color', 'red');
        __notif_show(3, "Please enter a valid email address");
        isValid = false;
    } else {
        $('.required_e_Class').removeClass('text-danger').addClass('text-slate-600');
        hire_email.css('border-color', '');
    }

    return isValid;
}




