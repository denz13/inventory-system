$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    loadClearanceToReview();
    reviewClearanceActions();

});

function loadClearanceToReview(){

    const clearance_review_table    = $('.clearance_review_table tbody');
    clearance_review_table.empty();

    return $.ajax({
        url: '/clearance/load-clearance-to-review',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            clearance_review_table.empty();

            if(response.toReviewData.length > 0) {
                response.toReviewData.forEach(function (item) {

                    let signatoryFullName   = item.signatoryFullName;
                    let profilePicture      = item.profilePicture;
                    let employee_id         = item.employee_id;
                    let clearanceTitle      = item.clearanceTitle;
                    let clearanceType       = item.clearanceType;
                    let clearanceTypeId     = item.clearanceTypeId;
                    let agency_name         = item.agency_name;
                    let tracking_id         = item.tracking_id;
                    let clearance_id        = item.clearance_id;
                    let pos_sg_step         = item.pos_sg_step;
                    let purpose             = item.purpose;
                    let other_purpose       = item.other_purpose;
                    let date_applied        = item.date_applied;
                    let effectivity_period  = item.effectivity_period;
                    let office_assignment   = item.office_assignment;

                    const table_row = `
                     <tr class="intro-x">
                        <td class="!py-3.5">
                            <div class="flex items-center">
                                <div class="w-9 h-9 image-fit zoom-in">
                                    <img alt="${signatoryFullName.toUpperCase()}" data-action="zoom" class="rounded-lg border-white shadow-md" src="${profilePicture}">
                                </div>
                                <div class="ml-4">
                                    <a href="javascript:;" class="font-medium whitespace-nowrap">${signatoryFullName.toUpperCase()}</a>
                                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${employee_id}</div>
                                </div>
                            </div>
                        </td>
                        <td class="w-40 !py-4"> <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">${tracking_id}</a> </td>
                        <td class="text-left">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${clearanceTitle}</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${clearanceType}</div>
                        </td>
                        <td class="text-center capitalize">${agency_name}</td>
                        <td class="text-center capitalize">
                            <a href="javascript:;" class="font-medium whitespace-nowrap text-${item.clearanceStatusClass}">${item.clearanceStatusName}</a>
                        </td>
                        <td class="table-report__action ">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center whitespace-nowrap mr-5 btn_view_clearance_details" href="javascript:;"
                                    data-tracking-id="${tracking_id}"
                                    data-employee-name="${signatoryFullName.toUpperCase()}"
                                    data-pos-sg-step="${pos_sg_step ?? 'Not set yet' }"
                                    data-agency="${agency_name}"
                                    data-purpose="${purpose}"
                                    data-other-purpose="${other_purpose}"
                                    data-date-applied="${date_applied}"
                                    data-effectivity-period="${effectivity_period}"
                                    data-office-assignment="${office_assignment}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-1"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                    View Details
                                 </a>
                                <a class="flex items-center text-primary mr-3 btn_review_clearance" href="javascript:;"
                                    data-clearance-id="${clearance_id}"
                                    data-tracking-id="${tracking_id}"
                                    data-clearance-type="${clearanceTypeId}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-plus w-4 h-4 mr-1"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>
                                    Review
                                </a>
                            </div>
                        </td>
                     </tr>
                    `;
                    clearance_review_table.append(table_row);
                });
            }
            else {
                let message = 'There is no clearance to review.';
                tableRowNoResult(clearance_review_table, message, 7);
            }
        },
    });

}
function loadCSCClearanceSignatoryTrack(clearance_id, tracking_id){

    const modal_review_signatory = $('.modal_review_signatory');
    modal_review_signatory.empty();

    $.ajax({
        url: '/clearance/load-csc-clearance-signatory-activity-review',
        type: 'POST',
        data: {
            clearance_id,
            tracking_id
        },
        dataType: 'json',
        beforeSend: function () {
            modal_review_signatory.append(`
             <div class="intro-x relative flex items-center">
                <div class="box bg-slate-100  px-5 py-3 ml-4 flex-1">
                        <div class="flex items-center text-center">
                            <div class="text-slate-400">Loading...</div>
                        </div>
                    </div>
                </div>
             </div>`);
        },
        success: function (response) {
            modal_review_signatory.empty();

            if(response.signatory_list.length > 0)
            {
                response.signatory_list.forEach(function (item) {

                    let canDoActions    = item.canDoActions;
                    let signatoryStatus = item.signatureStatus;
                    let action_data     = item.action_data;
                    let action_buttons;

                    if(item.tr_id === 'IV' && item.td_id === null){
                        legalOfficer = true;
                    }
                    else {
                        legalOfficer = false;
                    }

                    console.log(signatoryStatus);

                    if(signatoryStatus === '11'){
                        action_buttons = `<button class="btn btn-danger-soft text-danger px-2 ml-auto btn_mdl_return_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="4"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-2 w-4 h-4 mr-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                                                Return
                                            </button>`;
                    }
                    else if(signatoryStatus === '1'){
                        action_buttons = `<button class="btn btn-primary-soft text-primary px-2 ml-auto btn_mdl_approve_disapprove_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="11"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-4 h-4 mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                                Approve
                                            </button>
                                            <button class="btn btn-secondary-soft px-2 ml-4 btn_mdl_approve_disapprove_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="12"
                                                data-action-data="${action_data}"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-off w-4 h-4 mr-2"><line x1="2" y1="2" x2="22" y2="22"/><path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35"/><path d="M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17"/></svg>
                                                Disapprove
                                            </button>`;
                    }
                    else{
                        action_buttons = ``;
                    }

                    let actionBox    = '';
                    if(canDoActions) {
                        actionBox    = `
                        <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                            <div class="flex items-center">
                                <div class="font-medium">${item.signatoryFullName}</div>
                                <div class="text-xs font-medium ml-auto">${item.date_acted}</div>
                            </div>
                            <div class="font-medium text-xs whitespace-nowrap mt-0.5 w-72 truncate">${item.office_name}</div>
                            <div class="text-${item.status_class} font-medium mt-1">${item.status_name.toUpperCase()}</div>
                            <div class="flex items-center">
                                ${ action_buttons }
                            </div>
                            <div class="mt-4 border-t border-slate-200/60 dark:border-darkmode-400 rounded-md note_div hidden">
                                <div class="${legalOfficer ? '' : 'hidden'} legal_officer_div">
                                    <div class="form-check mt-2">
                                        <input id="radio-switch-1" class="form-check-input radio_legal" type="radio" name="vertical_radio_button" value="1" ${action_data === '1' ? 'checked' : ''}>
                                        <label class="form-check-label">With pending administrative case</label>
                                    </div>
                                    <div class="form-check mt-2">
                                        <input id="radio-switch-2" class="form-check-input radio_legal" type="radio" name="vertical_radio_button" value="2" ${action_data === '2' ? 'checked' : ''}>
                                        <label class="form-check-label">With ongoing investigation (no formal charge yet)</label>
                                    </div>
                                </div>
                                <div class="mt-2 flex items-center">
                                    <input type="text" class="form-control hidden mdl_action_status">
                                    <input type="text" class="form-control mdl_note" placeholder="Type your message ...">
                                    <button class="btn btn-secondary text-primary ml-2 px-2 btn_mdl_disapprove_clearance"
                                        data-sign-track-id="${item.signatory_id}"
                                        data-clearance-id="${item.clearance_id}"
                                        data-tracking-id="${item.tracking_id}"
                                        data-clearance-type="${item.clearanceType}"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send w-4 h-4 mr-2"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>`;
                    }
                    else {
                        actionBox    = `
                            <div class="box bg-slate-200  px-5 py-3 ml-4 flex-1">
                                    <div class="flex items-center">
                                        <div class="text-slate-400">${item.signatoryFullName}</div>
                                        <div class="text-xs text-slate-400 ml-auto">${item.date_acted}</div>
                                    </div>
                                    <div class="text-slate-400 text-xs whitespace-nowrap mt-0.5 w-72 truncate">${item.office_name}</div>
                                    <div class="text-${item.status_class} mt-1">${item.status_name.toUpperCase()}</div>
                                </div>
                            </div>`;
                    }

                    let signatureStatus = item.signatureStatus;


                    const signatory_list = `
                        <div class="intro-x relative flex items-center ${item.clearingOfficerID} mb-3 ">
                            <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                    <img alt="Profile Picture" src="${item.profilePicture}">
                                </div>
                            </div>
                            ${actionBox}
                        </div>`;
                    modal_review_signatory.append(signatory_list);

                    // Scroll into view or highlight if it's the logged clearing officer
                    if (item.clearingOfficerID === item.loggedClearingOfficer) {
                        // Scroll the element into view
                        $(`.${item.clearingOfficerID}`).get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                });
            }
            else {
                let message = 'No clearance found.';
            }
        },
    });

}
function loadCustomClearanceSignatoryTrack(clearance_id, tracking_id){

    const modal_review_custom_signatory = $('.modal_review_signatory');
    modal_review_custom_signatory.empty();

    $.ajax({
        url: '/clearance/load-custom-clearance-signatory-activity-review',
        type: 'POST',
        data: {
            clearance_id,
            tracking_id
        },
        dataType: 'json',
        beforeSend: function () {
            modal_review_custom_signatory.append(`
             <div class="intro-x relative flex items-center">
                <div class="box bg-slate-100  px-5 py-3 ml-4 flex-1">
                        <div class="flex items-center text-center">
                            <div class="text-slate-400">Loading...</div>
                        </div>
                    </div>
                </div>
             </div>`);
        },
        success: function (response) {
            modal_review_custom_signatory.empty();

            if(response.signatory_list.length > 0)
            {
                response.signatory_list.forEach(function (item) {

                    let canDoActions    = item.canDoActions;
                    let action_data     = item.action_data;
                    let action_buttons  = '';
                    let signatoryStatus = item.signatureStatus;

                    if(signatoryStatus === '11'){
                        action_buttons = `<button class="btn btn-danger-soft text-danger px-2 ml-auto btn_mdl_return_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="4"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-2 w-4 h-4 mr-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                                                Return
                                            </button>`;
                    }
                    else if(signatoryStatus === '1'){
                        action_buttons = `<button class="btn btn-primary-soft text-primary px-2 ml-auto btn_mdl_approve_disapprove_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="11"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-4 h-4 mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                                Approve
                                            </button>
                                            <button class="btn btn-secondary-soft px-2 ml-4 btn_mdl_approve_disapprove_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-action-status="12"
                                                data-action-data="${action_data}"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-off w-4 h-4 mr-2"><line x1="2" y1="2" x2="22" y2="22"/><path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35"/><path d="M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17"/></svg>
                                                Disapprove
                                            </button>`;
                    }
                    else{
                        action_buttons = ``;
                    }

                    let actionBox    = '';
                    if(canDoActions) {
                        actionBox    = `
                        <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                            <div class="flex items-center">
                                <div class="font-medium">${item.signatoryFullName}</div>
                                <div class="text-xs font-medium ml-auto">${item.date_acted}</div>
                            </div>
                            <div class="font-medium text-xs whitespace-nowrap mt-0.5 w-72 truncate">${item.office_name}</div>
                            <div class="text-${item.status_class} font-medium mt-1">${item.status_name.toUpperCase()}</div>
                            <div class="flex items-center">
                                ${ action_buttons }
                            </div>
                            <div class="mt-4 border-t border-slate-200/60 dark:border-darkmode-400 rounded-md note_div hidden">
                                <div class="mt-2 flex items-center">
                                    <input type="text" class="form-control hidden mdl_action_status">
                                    <input type="text" class="form-control mdl_note" placeholder="Type your message ...">
                                    <button class="btn btn-secondary text-primary ml-2 px-2 btn_mdl_disapprove_clearance"
                                        data-sign-track-id="${item.signatory_id}"
                                        data-clearance-id="${item.clearance_id}"
                                        data-tracking-id="${item.tracking_id}"
                                        data-clearance-type="${item.clearanceType}"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send w-4 h-4 mr-2"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>`;
                    }
                    else {
                        actionBox    = `
                            <div class="box bg-slate-200  px-5 py-3 ml-4 flex-1">
                                    <div class="flex items-center">
                                        <div class="text-slate-400">${item.signatoryFullName}</div>
                                        <div class="text-xs text-slate-400 ml-auto">${item.date_acted}</div>
                                    </div>
                                    <div class="text-slate-400 text-xs whitespace-nowrap mt-0.5 w-72 truncate">${item.office_name}</div>
                                    <div class="text-${item.status_class} mt-1">${item.status_name.toUpperCase()}</div>
                                </div>
                            </div>`;
                    }

                    const signatory_list = `
                        <div class="intro-x relative flex items-center ${item.clearingOfficerID} mb-3 ">
                            <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                    <img alt="Profile Picture" src="${item.profilePicture}">
                                </div>
                            </div>
                            ${actionBox}
                        </div>`;
                    modal_review_custom_signatory.append(signatory_list);

                    // Scroll into view or highlight if it's the logged clearing officer
                    if (item.clearingOfficerID === item.loggedClearingOfficer) {
                        // Scroll the element into view
                        $(`.${item.clearingOfficerID}`).get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                });
            }
            else {
                let message = 'No clearance found.';
            }
        },
    });

}




function reviewClearanceActions(){

    $('body').on('click', '.btn_review_clearance', function (){

        let clearance_id    = $(this).data('clearance-id');
        let tracking_id     = $(this).data('tracking-id');
        let clearanceType   = $(this).data('clearance-type');

        __modal_toggle('signatory_review_mdl');

        if(clearanceType === 1){
            loadCSCClearanceSignatoryTrack(clearance_id, tracking_id);
        }
        if(clearanceType === 2){
            loadCustomClearanceSignatoryTrack(clearance_id, tracking_id);
        }


    });

    $('body').on('click', '.btn_mdl_approve_disapprove_clearance', function (){

        let signature_track_id  = $(this).data('sign-track-id');
        let clearance_id        = $(this).data('clearance-id');
        let tracking_id         = $(this).data('tracking-id');
        let action_status       = $(this).data('action-status');
        let action_data         = $(this).data('action-data');
        let clearanceType       = $(this).data('clearance-type');
        let noteDiv             = $(this).closest('div').next('.note_div');

        let radio_legal         = $(this).closest('.note_div').find('input[name="vertical_radio_button"]:checked');
        let radio_legal_val     = radio_legal.val();
        $('.mdl_action_status').val(null);
        $('.mdl_action_status').val(action_status);

        if(action_status === 11) {

            $.ajax({
                url: '/clearance/approve-disapprove-clearance',
                type: 'POST',
                data: {
                    signature_track_id,
                    action_status,
                    clearance_id,
                    tracking_id,
                },
                dataType: 'json',
                beforeSend: function () {

                },
                success: function (response) {
                    if (response.success) {

                        if(clearanceType === 1){
                            loadCSCClearanceSignatoryTrack(clearance_id, tracking_id);
                        }
                        if(clearanceType === 2){
                            loadCustomClearanceSignatoryTrack(clearance_id, tracking_id);
                        }

                    }
                }
            });

        }
        else {
            if(!action_data) {
                radio_legal.prop('checked', false);
            }
            noteDiv.toggle();
        }

    });

    $('body').on('click', '.btn_mdl_disapprove_clearance', function (){

        let thisButton          = $(this);
        let signature_track_id  = $(this).data('sign-track-id');
        let clearance_id        = $(this).data('clearance-id');
        let tracking_id         = $(this).data('tracking-id');
        let action_status       = $('.mdl_action_status').val();
        let is_legal_officer    = $(this).data('is-legal-officer');
        let clearanceType       = $(this).data('clearance-type');
        let clearingOfficerNote = $(this).closest('.note_div').find('.mdl_note')
        let radioButton         = $(this).closest('.note_div').find('input[name="vertical_radio_button"]:checked');
        let radioValue;
        let clearingOfficerNoteValue = clearingOfficerNote.val();


        if(clearingOfficerNoteValue) {

            clearingOfficerNote.removeClass('border-danger');

            if (is_legal_officer) {
                radioValue = radioButton.val();
                if (!radioValue) {
                    // Add text-danger class to labels
                    $('.form-check-label').addClass('text-danger');
                    return; // Stop further execution if no radio button is selected
                } else {
                    // Remove text-danger class if a radio button is selected
                    $('.form-check-label').removeClass('text-danger');
                }
            }

            $.ajax({
                url: '/clearance/approve-disapprove-clearance',
                type: 'POST',
                data: {
                    signature_track_id,
                    action_status,
                    clearance_id,
                    tracking_id,
                    clearingOfficerNoteValue,
                    radioValue,
                },
                dataType: 'json',
                beforeSend: function () {
                    thisButton.prop('disabled', true);
                    thisButton.text('Sending...');
                },
                success: function (response) {
                    if (response.success)
                    {
                        thisButton.prop('disabled', false);
                        thisButton.text('Send');

                        if(clearanceType === 1){
                            loadCSCClearanceSignatoryTrack(clearance_id, tracking_id);
                        }
                        if(clearanceType === 2){
                            loadCustomClearanceSignatoryTrack(clearance_id, tracking_id);
                        }
                    }
                }
            });

        }
        else {
            clearingOfficerNote.addClass('border-danger');
            __notif_show(-1, 'Ooopss..', 'Please add message when returning a request.');
        }

    });
    $('body').on('click', '.btn_mdl_return_clearance', function (){

        let thisButton          = $(this);
        let signature_track_id  = $(this).data('sign-track-id');
        let clearance_id        = $(this).data('clearance-id');
        let tracking_id         = $(this).data('tracking-id');
        let action_status       = $(this).data('action-status');
        let is_legal_officer    = $(this).data('is-legal-officer');
        let clearanceType       = $(this).data('clearance-type');
        let clearingOfficerNote = $(this).closest('.note_div').find('.mdl_note')
        let noteDiv             = $(this).closest('div').next('.note_div');
        noteDiv.toggle();

        $('.mdl_action_status').val(action_status);
        $('.legal_officer_div').hide();

        /*if(clearingOfficerNoteValue) {

            clearingOfficerNote.removeClass('border-danger');

            if (is_legal_officer) {
                radioValue = radioButton.val();
                if (!radioValue) {
                    // Add text-danger class to labels
                    $('.form-check-label').addClass('text-danger');
                    return; // Stop further execution if no radio button is selected
                } else {
                    // Remove text-danger class if a radio button is selected
                    $('.form-check-label').removeClass('text-danger');
                }
            }

            $.ajax({
                url: '/clearance/approve-disapprove-clearance',
                type: 'POST',
                data: {
                    signature_track_id,
                    action_status,
                    clearance_id,
                    tracking_id,
                    clearingOfficerNoteValue,
                    radioValue,
                },
                dataType: 'json',
                beforeSend: function () {
                    thisButton.prop('disabled', true);
                    thisButton.text('Sending...');
                },
                success: function (response) {
                    if (response.success)
                    {
                        thisButton.prop('disabled', false);
                        thisButton.text('Send');

                        if(clearanceType === 1){
                            loadCSCClearanceSignatoryTrack(clearance_id, tracking_id);
                        }
                        if(clearanceType === 2){
                            loadCustomClearanceSignatoryTrack(clearance_id, tracking_id);
                        }
                    }
                }
            });

        }else
        {
            clearingOfficerNote.addClass('border-danger');
        }*/

    });

    $('body').on('click', '.btn_view_clearance_details', function (){


        let tracking_id         = $(this).data('tracking-id');
        let signatoryFullName   = $(this).data('employee-name');
        let pos_sg_step         = $(this).data('pos-sg-step');
        let agency_name         = $(this).data('agency');
        let purpose             = $(this).data('purpose');
        let other_purpose       = $(this).data('other-purpose');
        let date_applied        = $(this).data('date-applied');
        let effectivity_period  = $(this).data('effectivity-period');
        let office_assignment   = $(this).data('office-assignment');

        $('.label_tracking_number').text(tracking_id);
        $('.label_employee_name').text(signatoryFullName);
        $('.label_pos_sg_step').text(pos_sg_step);
        $('.label_agency').text(agency_name);
        $('.label_purpose').text(purpose);

        if (date_applied){
            $('.label_date_applied').text(formatDate(date_applied));
        }
        if (effectivity_period){
            $('.label_effectivity').text(formatDate(effectivity_period));
        }

        $('.label_office').text(office_assignment);

        __modal_toggle('clearance_details_mdl');
    });




    $('body').on('click', '.btn_reload_clearance_list', function () {
        const icon = $(this).find('svg');

        // Add spin animation
        icon.addClass('spin-animation');

        // Start the AJAX request
        loadClearanceToReview()
            .done(function(response) {
                // Handle successful response (populate the document list)
            })
            .fail(function() {
                // Optionally handle errors here
                console.error('Failed to load clearance documents.');
            })
            .always(function() {
                // Remove spin animation once the AJAX request completes (success or failure)
                icon.removeClass('spin-animation');
            });
    });

}


