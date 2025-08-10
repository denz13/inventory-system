$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    loadCompleteClearance();
    completedClearanceActions();

});


function loadCompleteClearance(){

    const clearance_completed_table    = $('.clearance_completed_table tbody');
    clearance_completed_table.empty();

    $.ajax({
        url: '/clearance/load-clearance-completed',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            clearance_completed_table.empty();
            if(response.completedClearance.length > 0)
            {
                response.completedClearance.forEach(function (item) {

                    console.log(item);

                    let signatoryFullName   = item.signatoryFullName;
                    let profilePicture      = item.profilePicture;
                    let employee_id         = item.employee_id;
                    let clearanceTitle      = item.clearanceTitle;
                    let clearanceType       = item.clearanceType;
                    let agency_name         = item.agency_name;
                    let tracking_id         = item.tracking_id;
                    let clearance_id        = item.clearance_id;
                    let pos_sg_step         = item.pos_sg_step;
                    let purpose             = item.purpose;
                    let other_purpose       = item.other_purpose;
                    let date_applied        = item.date_applied;
                    let effectivity_period  = item.effectivity_period;
                    let office_assignment   = item.office_assignment;
                    let dateAccomplished    = item.dateAccomplished;
                    let clearanceStatus     = item.clearanceStatus;
                    let statusClass         = item.statusClass;
                    let viewer_type         = 'ADMIN';

                    if(item.clearanceTypeId === 1){
                        print_clearance_url = `/clearance/print-csc-form/${clearance_id}/${tracking_id}/${viewer_type}/${employee_id}`;
                    }
                    else{
                        print_clearance_url = `/clearance/print-custom-form/${clearance_id}/${tracking_id}/${viewer_type}/${employee_id}`;
                    }

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
                        <td class="text-center font-medium capitalize">${agency_name}</td>
                        <td class="text-center capitalize">
                            <a href="javascript:;" class="font-medium text-${statusClass} whitespace-nowrap">${clearanceStatus.toUpperCase()}</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${dateAccomplished}</div>
                        </td>
                        <td class="table-report__action ">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center whitespace-nowrap mr-5 btn_view_completed_clearance_details" href="javascript:;"
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
                                <a class="flex items-center text-primary mr-3" target="_blank"
                                    href="${ print_clearance_url }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4 mr-1"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                    View
                                </a>
                            </div>
                        </td>
                     </tr>
                    `;
                    clearance_completed_table.append(table_row);
                });
            }
            else
            {
                let message = 'No clearance found.';
                tableRowNoResult(clearance_completed_table, message, 7);
            }


        },
    });

}
function completedClearanceActions(){

    $('body').on('click', '.btn_view_completed_clearance_details', function (){


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
        $('.label_office').text(office_assignment);

        if (date_applied){
            $('.label_date_applied').text(formatDate(date_applied));
        }

        if (effectivity_period){
            $('.label_effectivity').text(formatDate(effectivity_period));
        }

        __modal_toggle('completed_clearance_details_mdl');
    });

}
