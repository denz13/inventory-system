$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    load_CSC_Clearance_List();
    load_Custom_Clearance_List();
    my_clearance_actions();
    loadMyClearance();
    select2Handler();
});

function select2Handler(){

    $('#immediate_supervisor').select2({
        placeholder: "Select your Immediate Head / Supervisor",
        closeOnSelect: true,
        allowClear: true,
    });
    $('#custom_immediate_supervisor').select2({
        placeholder: "Select your Immediate Head / Supervisor",
        closeOnSelect: true,
        allowClear: true,
    });
}

function load_CSC_Clearance_List(){

    const csc_clearance_list    = $('.csc_clearance_list');
    csc_clearance_list.empty();

    $.ajax({
        url: '/clearance/load-csc-forms',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            csc_clearance_list.append(`<div class="intro-y col-span-12 md:col-span-6 xl:col-span-4 box flex justify-center items-center h-64">
                                            <div class="">
                                                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
                                                    <circle cx="15" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                                                        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="105" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                            </div>
                                        </div>`
            );
        },
        success: function (response) {

            csc_clearance_list.empty();
            if(response.data.length > 0)
            {
                let clearanceDescription = `
                                Employees who are retiring, being separated, transferring to other agencies, leaving the Philippines and going on maternity leave of absence shall prepare this form in quadruplicate.
                                <br>
                                This clearance should be duly accomplished before paying the last salary or any money due the employees.`;

                response.data.forEach(function (item) {
                    const csc_clearances = `
                    <div style="background-color: #f6f6f6" class="intro-y col-span-3 box">
                        <div class="p-5">
                            <div class="flex items-center">
                                <a href="javascript:;" class="block font-medium text-base">${item.title}</a>
                                <a href="javascript:;" class="ml-auto cursor-pointer btn_clearance_info"
                                    data-modal-header="${item.title}"
                                    data-modal-desc="${clearanceDescription}"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                </a>
                            </div>

                            <div class="flex text-slate-500 truncate text-xs"> <a class="text-primary inline-block truncate" href="javascript:;"> Agency <span class="mx-1">•</span> ${item.agency_list.agency_name}</a></div>
                            <div class="text-slate-600 dark:text-slate-500 text-justify mt-2 hidden">

                            </div>
                        </div>
                        <div class="flex items-center px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400">
                            <button class="btn btn-secondary mr-auto hidden"
                                data-clearance-id="${item.id}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                View Form
                            </button>
                            <button class="btn btn-primary ml-auto btn_get_csc_copy"
                                data-clearance-id="${item.id}"
                                data-clearance-type="${item.type}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4 mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                Get a copy
                            </button>
                        </div>
                    </div>
                    `;
                    csc_clearance_list.append(csc_clearances);

                });
            }
            else
            {
                const csc_clearances = `
                    <div style="background-color: #f6f6f6" class="intro-y col-span-12 md:col-span-6 xl:col-span-4 box">
                        <div class="p-5">
                            <a href="javascript:;" class="block text-center text-slate-400 text-base mt-5">No clearance found</a>
                        </div>

                    </div>
                    `;
                csc_clearance_list.append(csc_clearances);
            }


        },
    });

}
function load_Custom_Clearance_List(){

    const custom_clearance_list    = $('.custom_clearance_list_div');
    custom_clearance_list.empty();

    $.ajax({
        url: '/clearance/load-custom-forms',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            custom_clearance_list.append(`<div class="intro-y col-span-12 md:col-span-6 xl:col-span-4 box flex justify-center items-center h-64">
                                            <div class="">
                                                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
                                                    <circle cx="15" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                                                        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="105" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                            </div>
                                        </div>`
            );
        },
        success: function (response) {

            custom_clearance_list.empty();
            if(response.data.length > 0)
            {
                let clearanceDescription = `
                                `;

                response.data.forEach(function (item) {

                    const customClearances = `
                    <div style="background-color: #f6f6f6" class="intro-y col-span-3 box">
                        <div class="p-5">
                            <div class="flex items-center">
                                <a href="javascript:;" class="block font-medium text-base">${item.title}</a>
                                <a href="javascript:;" class="ml-auto cursor-pointer btn_clearance_info"
                                    data-modal-header="${item.title}"
                                    data-modal-desc="${clearanceDescription}"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                </a>
                            </div>
                            <div class="flex text-slate-500 truncate text-xs"> <a class="text-primary inline-block truncate" href="javascript:;"> Agency <span class="mx-1">•</span> ${item.agency_list.agency_name}</a></div>
                        </div>
                        <div class="flex items-center px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400">
                            <button class="btn btn-primary ml-auto btn_get_custom_clearance_copy"
                                data-clearance-id="${item.id}"
                                data-clearance-type="${item.type}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4 mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                Get a copy
                            </button>
                        </div>
                    </div>
                    `;
                    custom_clearance_list.append(customClearances);

                });
            }
            else {
                const csc_clearances = `
                    <div style="background-color: #f6f6f6" class="intro-y col-span-12 md:col-span-6 xl:col-span-4 box">
                        <div class="p-5">
                            <a href="javascript:;" class="block text-center text-slate-400 text-base mt-5">No clearance found</a>
                        </div>

                    </div>
                    `;
                custom_clearance_list.append(csc_clearances);
            }
        },
    });

}

function loadMyClearance(){

    const my_clearance_table    = $('.my_clearance_table tbody');
    const colspan               = 6;
    my_clearance_table.empty();

    return $.ajax({
        url: '/clearance/load-my-clearance',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            my_clearance_table.empty();
            if(response.data.length > 0)
            {
                response.data.forEach(function (item) {

                    let clearance_submission    = '';
                    let clearance_tracking      = '';
                    let clearance_type          = item.clearance_data.type;
                    let viewer_type             = 'OWNER';
                    let effectivityPeriod;
                    let printLink               = '';

                    console.log(clearance_type);

                    if(item.status === '15') {

                                clearance_tracking = `
                                    <a href="javascript:;" class="dropdown-item bnt_track_my_clearance"
                                        data-clearance-id="${item.clearance_id}"
                                        data-tracking-id="${item.tracking_id}"
                                        data-clearance-type="${clearance_type}"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-search w-4 h-4 mr-1"><path d="M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1"/><path d="m21 21-1.9-1.9"/><circle cx="17" cy="17" r="3"/></svg>
                                        Track
                                    </a>`;

                                clearance_submission = `
                                    <a class="flex items-center text-danger whitespace-nowrap btn_cancel_clearance_request" href="javascript:;"
                                       data-clearance-employee-id="${item.id}"
                                        data-clearance-id="${item.clearance_id}"
                                        data-tracking-id="${item.tracking_id}"
                                        data-clearance-type="${item.clearance_data.type}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-left-right" data-lucide="arrow-left-right" class="lucide lucide-arrow-left-right w-4 h-4 mr-1"><polyline points="17 11 21 7 17 3"></polyline><line x1="21" y1="7" x2="9" y2="7"></line><polyline points="7 21 3 17 7 13"></polyline><line x1="15" y1="17" x2="3" y2="17"></line></svg>
                                        Cancel Clearance
                                    </a>`;
                    }
                    else if(item.status === '7') {

                        clearance_tracking = `
                                <a href="javascript:;" class="dropdown-item bnt_track_my_clearance"
                                    data-clearance-id="${item.clearance_id}"
                                    data-tracking-id="${item.tracking_id}"
                                    data-clearance-type="${clearance_type}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-search w-4 h-4 mr-1"><path d="M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1"/><path d="m21 21-1.9-1.9"/><circle cx="17" cy="17" r="3"/></svg>
                                    Track
                                 </a>`;


                        if(clearance_type === 1){
                            printLink = '/clearance/print-csc-form';
                        }

                        if(clearance_type === 2){
                            printLink = '/clearance/print-custom-form';
                        }

                        clearance_submission = `
                                <a class="flex items-center text-primary whitespace-nowrap" href="${printLink}/${item.clearance_id}/${item.tracking_id}/${viewer_type}/${item.employee_id}" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer-check w-4 h-4 mr-1"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5"/><path d="m16 19 2 2 4-4"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/></svg>
                                    Print Clearance
                                </a>`;


                    }
                    else {
                        clearance_submission = `
                                <a class="flex items-center text-primary whitespace-nowrap btn_submit_clearance_request" href="javascript:;"
                                    data-clearance-employee-id="${item.id}"
                                    data-clearance-id="${item.clearance_id}"
                                    data-tracking-id="${item.tracking_id}"
                                    data-clearance-type="${item.clearance_data.type}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-left-right" data-lucide="arrow-left-right" class="lucide lucide-arrow-left-right w-4 h-4 mr-1"><polyline points="17 11 21 7 17 3"></polyline><line x1="21" y1="7" x2="9" y2="7"></line><polyline points="7 21 3 17 7 13"></polyline><line x1="15" y1="17" x2="3" y2="17"></line></svg>
                                    Submit Clearance
                                </a>`;
                    }

                    if(item.effectivity_period){
                        effectivityPeriod = item.effectivity_period.split(' ')[0]
                    }

                    const my_clearance = `
                    <tr class="intro-x">
                        <td class="w-40 !py-4"> <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">${item.tracking_id}</a> </td>
                        <td class="w-40">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${item.clearance_data.title}</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${item.clearance_data.clearance_type.description}</div>
                        </td>
                        <td class="text-center w-40">
                           <a href="javascript:;" class="font-medium whitespace-nowrap">${item.clearance_data.agency_list.agency_name}</a>
                        </td>
                        <td class="text-center">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${item.clearance_data.year}</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${item.clearance_data.sem} Semester</div>
                        </td>
                        <td class="text-center">
                            <div class="flex items-center justify-center whitespace-nowrap text-${item.status_codes.class}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-1"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                ${item.status_codes.name}
                            </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center justify-start items-center">

                                 <div id="my_clearance_dd" class="w-8 h-8 mr-5 rounded-full flex items-center justify-center border dark:border-darkmode-400 text-slate-400 zoom-in dropdown">
                                        <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                            <svg class="svg-inline--fa fa-ellipsis items-center text-center text-primary" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                <path fill="currentColor" d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"></path>
                                            </svg>
                                        </a>
                                        <div class="dropdown-menu w-40">
                                            <div class="dropdown-content">

                                                ${clearance_tracking}

                                                <a href="javascript:;" class="dropdown-item btn_view_details"
                                                    data-clearance-employee-id="${item.id}"
                                                    data-clearance-id="${item.clearance_id}"
                                                    data-tracking-id="${item.tracking_id}"
                                                    data-clearance-type="${clearance_type}"
                                                    data-immediate-head="${item.clearance_signature_track.immediate_head}"
                                                    data-other-purpose="${item.other_purpose}"
                                                    data-purpose="${item.purpose}"
                                                    data-status="${item.status}"
                                                    data-office-assignment="${item.office_assignment}"
                                                    data-effectivity-period="${effectivityPeriod}"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-1"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                                    View Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                 ${clearance_submission}
                            </div>
                        </td>
                    </tr>
                    `;
                    my_clearance_table.append(my_clearance);
                });
            }
            else
            {
                let message = 'No clearance found.';
                noResult(my_clearance_table, message, colspan)
            }
        },
    });

}

function my_clearance_actions(){

    $('body').on('click', '.btn_get_csc_copy', function (){

        resetModal();

        let thisButton      = $(this);
        let clearance_id    = thisButton.data('clearance-id');
        let clearance_type  = thisButton.data('clearance-type');

        $('.text_required').removeClass('text-danger').addClass('text-slate-500');

        $('.mdl_input_clearance_id').val(clearance_id);
        $('.mdl_input_clearance_type').val(clearance_type);

        $('.reminder_div').hide();
        $('.btn_submit_request').text('Update').prop('disabled', false);
        $('.immediate_supervisor').prop('disabled', false);
        $('.purpose_checkbox').prop('disabled', false);
        $('.purpose_others').prop('disabled', false);
        $('.effectivity_period').prop('disabled', false);
        $('.office_assigned').prop('disabled', false);

        $('.text_required').removeClass('text-danger').addClass('text-slate-500');
        $('.purpose_div').removeClass('border-danger');
        $('.effectivity_period').removeClass('border-danger');
        $('.office_assigned').removeClass('border-danger');

        $('.btn_submit_request').text('Submit');

        __modal_toggle('immediate_supervisor_mdl');

    });
    $('body').on('click', '.bnt_track_my_clearance', function (){

        __dropdown_close('#my_clearance_dd');
        let clearance_id    = $(this).data('clearance-id');
        let tracking_id     = $(this).data('tracking-id');
        let clearance_type  = $(this).data('clearance-type');

        loadSignatoryTrackingActivity(clearance_id, tracking_id, clearance_type);

        __modal_toggle('signatory_tracking_mdl');
    });
    $('body').on('click', '.btn_view_details', function (){

        __dropdown_close('#my_clearance_dd');
        let clearance_id    = $(this).data('clearance-id');
        let clearance_employee_id    = $(this).data('clearance-employee-id');
        let tracking_id     = $(this).data('tracking-id');
        let clearance_type  = $(this).data('clearance-type');


        let immediate_head      = $(this).data('immediate-head');
        let other_purpose       = $(this).data('other-purpose');
        let purpose             = $(this).data('purpose');
        let office_assignment   = $(this).data('office-assignment');
        let effectivity_period  = $(this).data('effectivity-period');
        let request_status      = $(this).data('status');

        $('.text_required').removeClass('text-danger').addClass('text-slate-500');
        $('.purpose_div').removeClass('border-danger');
        $('.effectivity_period').removeClass('border-danger');
        $('.office_assigned').removeClass('border-danger');


        $('.immediate_supervisor').val(immediate_head).trigger('change');
        $('.mdl_input_tracking_id').val(tracking_id);
        $('.mdl_input_clearance_employee_id').val(clearance_employee_id);
        $('.mdl_input_clearance_id').val(clearance_id);
        $('.mdl_input_clearance_type').val(clearance_type);

        if(clearance_type === 1){
            if(request_status === 15 || request_status === 7) {
                $('.reminder_div').show();
                $('.btn_submit_request').text('Update').prop('disabled', true);
                $('.btn_submit_request').removeClass('btn-primary').addClass('btn-secondary');
                $('.immediate_supervisor').prop('disabled', true);
                $('.purpose_checkbox').prop('disabled', true);
                $('.purpose_others').prop('disabled', true);
                $('.effectivity_period').prop('disabled', true);
                $('.office_assigned').prop('disabled', true);

            }
            else {
                $('.reminder_div').hide();
                $('.btn_submit_request').text('Update').prop('disabled', false);
                $('.btn_submit_request').removeClass('btn-secondary').addClass('btn-primary');
                $('.immediate_supervisor').prop('disabled', false);
                $('.purpose_checkbox').prop('disabled', false);
                $('.purpose_others').prop('disabled', false);
                $('.effectivity_period').prop('disabled', false);
                $('.office_assigned').prop('disabled', false);
            }
            if (purpose) {
                // Check the matching radio button
                $(`.purpose_checkbox[value="${purpose}"]`).prop('checked', true);

                // If purpose is 'OTHERS', show the text input and populate it
                if (purpose === 'OTHERS') {
                    $('.purpose_others_div').removeClass('hidden');
                    $('.purpose_others').val(other_purpose);
                } else {
                    // Hide the other purpose input if it's not 'OTHERS'
                    $('.purpose_others_div').addClass('hidden');
                    $('.purpose_others').val('');
                }
            }

            $('.effectivity_period').val(effectivity_period);
            $('.office_assigned').val(office_assignment);

            __modal_toggle('immediate_supervisor_mdl');
        }
        else if(clearance_type === 2){

            __modal_toggle('custom_clearance_immediate_supervisor_mdl');
            resetModalInputs();

            $('.mdl_input_custom_clearance_employee_id').val(clearance_employee_id);
            $('.mdl_input_custom_clearance_id').val(clearance_id);
            $('.mdl_input_custom_clearance_type').val(clearance_type);
            $('.mdl_input_custom_tracking_id').val(tracking_id);

            $('.custom_immediate_supervisor').val(immediate_head).trigger('change');

            if(request_status === 15 || request_status === 7) {
                $('.custom_reminder_div').show();
                $('.custom_reminder_div').html(`
                <div class="bg-warning/20 dark:bg-darkmode-600 border border-warning dark:border-0 rounded-md relative p-5">
                            <h2 class="text-lg font-medium">
                                Friendly Reminder:
                            </h2>
                            <div class="leading-relaxed text-xs mt-2 text-slate-600 dark:text-slate-500">
                                <div>Once a clearance has been submitted, it can’t be edited unless it’s cancelled. </div>
                                <div class="mt-2">Please make sure all details are correct before submission!</div>
                            </div>
                        </div>
`);

                $('.btn_submit_custom_request').text('Update').prop('disabled', true);
                $('.btn_submit_custom_request').removeClass('btn-primary').addClass('btn-secondary');
                $('.custom_immediate_supervisor').prop('disabled', true);

            }
            else{
                $('.custom_reminder_div').hide();
                $('.btn_submit_custom_request').text('Update').prop('disabled', false);
                $('.btn_submit_custom_request').removeClass('btn-secondary').addClass('btn-primary');
                $('.custom_immediate_supervisor').prop('disabled', false);
            }
        }
    });


    $('body').on('click', '.btn_submit_clearance_request', function (){

        let thisButton              = $(this);
        let clearance_employee_id   = $(this).data('clearance-employee-id');
        let clearance_type          = $(this).data('clearance-type');
        let clearanceID            = $(this).data('clearance-id');
        let tracking_id             = $(this).data('tracking-id');


        $.ajax({
            url: '/clearance/submit-my-clearance-request',
            type: 'POST',
            data: {
                clearance_employee_id,
                clearance_type,
                clearanceID,
                tracking_id,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Processing...');
            },
            success: function (response) {

                thisButton.prop('disabled', false);
                thisButton.text('Submit Clearance');

                if (response.success)
                {
                    loadMyClearance();

                }else
                {
                    __notif_show(-1, 'Oooops..', response.message);
                }

            },
            complete: function () {

            }
        });

    });
    $('body').on('click', '.btn_cancel_clearance_request', function (){

        let thisButton              = $(this);
        let clearance_employee_id   = $(this).data('clearance-employee-id');
        let clearance_type          = $(this).data('clearance-type');
        let clearance_id            = $(this).data('clearance-id');
        let tracking_id             = $(this).data('tracking-id');

        $('.mdl_input_clearance_employee_id').val(clearance_employee_id);
        $('.mdl_input_clearance_type').val(clearance_type);
        $('.mdl_input_clearance_id').val(clearance_id);
        $('.mdl_input_tracking_id').val(tracking_id);

        __modal_toggle('cancel_clearance_modal');

    });

    $('body').on('click', '.mdl_btn_proceed', function (){

        let thisButton = $(this);
        let clearance_employee_id   = $('.mdl_input_clearance_employee_id').val();
        let clearance_type          = $('.mdl_input_clearance_type').val();
        let clearance_id            = $('.mdl_input_clearance_id').val();
        let tracking_id             = $('.mdl_input_tracking_id').val();

        $.ajax({
            url: '/clearance/cancel-my-clearance-request',
            type: 'POST',
            data: {
                clearance_employee_id,
                clearance_type,
                clearance_id,
                tracking_id,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Processing...');
            },
            success: function (response) {

                thisButton.prop('disabled', false);
                thisButton.text('Ok, proceed');

                if (response.success)
                {
                    __modal_hide('cancel_clearance_modal');
                    loadMyClearance();

                }else
                {
                    __notif_show(-1, 'Oooops..', response.message);
                }

            },
            complete: function () {

            }
        });

    });

    // Show/Hide "Other Mode of Separation" text input
    $('input[name="csc_request_purpose"]').on('change', function () {
        if ($(this).val() === 'OTHERS') {
            $('.purpose_others').closest('div').removeClass('hidden');
        } else {
            $('.purpose_others').closest('div').addClass('hidden');
            $('.purpose_others').val(''); // Clear the input if hidden
        }
    });


    $('body').on('click', '.btn_submit_request', function (){

        let thisButton = $(this);
        let validated = true;

        // Validate Immediate Supervisor
        if (!$('#immediate_supervisor').val()) {
            $('.text_required').addClass('text-danger');
            validated = false;
        } else {
            $('.text_required').removeClass('text-danger').addClass('text-slate-500');
        }

        // Validate Purpose
        if (!$('input[name="csc_request_purpose"]:checked').val()) {
            $('.purpose_div').addClass('border-danger');
            validated = false;
        } else {
            $('.purpose_div').removeClass('border-danger').addClass('border-slate-200/60 dark:border-darkmode-400');
        }

        // Check if "Others" is selected and if so, validate the "other_purpose" field
        if ($('input[name="csc_request_purpose"]:checked').val() === 'OTHERS' && !$('.purpose_others').val()) {
            $('.purpose_others_div').addClass('border-danger');
            validated = false;
        } else {
            $('.purpose_others_div').removeClass('border-danger');
        }

        // Validate Immediate Supervisor
        if (!$('.effectivity_period').val()) {
            $('.effectivity_period').addClass('border-danger');
            validated = false;
        } else {
            $('.effectivity_period').removeClass('border-danger');
        }

        // Validate Immediate Supervisor
        if (!$('.office_assigned').val()) {
            $('.office_assigned').addClass('border-danger');
            validated = false;
        } else {
            $('.office_assigned').removeClass('border-danger');
        }

        // Collect form data
        let formData = {
            clearance_employee_id : $('.mdl_input_clearance_employee_id').val(),
            tracking_id :  $('.mdl_input_tracking_id').val(),
            clearance_id : $('.mdl_input_clearance_id').val(),
            clearance_type : $('.mdl_input_clearance_type').val(),
            immediate_supervisor: $('#immediate_supervisor').val(),
            purpose: $('input[name="csc_request_purpose"]:checked').val(),
            other_purpose: $('.purpose_others').val(),
            effectivity_period: $('.effectivity_period').val(),
            office_assigned: $('.office_assigned').val(),
        };

        if(validated)
        {
            $.ajax({
                url: '/clearance/create-my-csc-request',
                type: 'POST',
                data: formData,
                dataType: 'json',
                beforeSend: function () {
                    thisButton.prop('disabled', true);
                    thisButton.text('Processing...');
                },
                success: function (response) {

                    thisButton.prop('disabled', false);
                    thisButton.text('Submit');

                    if(response.success){

                        __swalSuccess(response.message);
                        loadMyClearance();
                    }
                    else {
                        __swalError(response.message);
                    }

                    resetModal();
                    __modal_hide('immediate_supervisor_mdl');

                },
                complete: function () {

                }
            });
        }

    });


    $('body').on('click', '.btn_view_sign_history', function (){

        let sign_track_id   = $(this).data('sign-track-id');
        let clearance_id    = $(this).data('clearance-id');
        let tracking_id     = $(this).data('tracking-id');
        let signatory       = $(this).data('signatory');
        let thisButton      = $(this);

        const box_signature_history = $(this).closest('.intro-x').next('.box_signature_history');
        box_signature_history.empty();
        box_signature_history.toggle();

        $.ajax({
            url: '/clearance/view-signatory-history',
            type: 'POST',
            data: { sign_track_id },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
            },
            success: function (response) {

                box_signature_history.empty();
                thisButton.prop('disabled', false);
                if(response.signatureHistory.length > 0)
                {
                    response.signatureHistory.forEach(function (item) {
                        const signature_history_data = `
                            <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md zoom-in p-2 mt-2">
                                <div class="flex items-center">
                                    <div class="font-medium text-${item.actionClass}">${item.actions.toUpperCase()}</div>
                                    <div class="text-xs text-slate-500 ml-auto">${item.created_at}</div>
                                </div>
                                <div style="width: 21rem" class="text-slate-500 text-xs text-justify mt-0.5">${item.note ?? ''}</div>
                            </div>`;
                        box_signature_history.append(signature_history_data);
                    });
                }
                else {
                    const signature_history_data = `
                            <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md bg-slate-50 p-2 mt-2">
                                <div class="flex justify-center items-center">
                                   <div class="text-slate-500 text-xs text-center whitespace-nowrap mt-0.5 w-72 truncate">No history yet.</div>
                                </div>
                            </div>`;
                    box_signature_history.append(signature_history_data);
                }
            }
        });
        /*<div className="w-full border-t border-slate-200/60 dark:border-darkmode-400 mt-1"></div>*/
    });


    $('body').on('click', '.btn_reload_my_clearance', function () {
        const icon = $(this).find('svg');

        // Add spin animation
        icon.addClass('spin-animation');

        // Start the AJAX request
        loadMyClearance()
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

    $('body').on('click', '.btn_clearance_info', function (){

        let modalHeader = $(this).data('modal-header');
        let modalDesc   = $(this).data('modal-desc');
        $('.modal_header').text(modalHeader);
        $('.modal_desc').html(modalDesc);
        __modal_toggle('clearance_info_modal');
    });

    $('body').on('click', '.btn_get_custom_clearance_copy', function (){

        let clearanceID     = $(this).data('clearance-id');
        let clearanceType   = $(this).data('clearance-type');

        resetModalInputs();

        $('.mdl_input_custom_clearance_id').val(clearanceID);
        $('.mdl_input_custom_clearance_type').val(clearanceType);
        $('.btn_submit_custom_request').prop('disabled', false);
        $('.btn_submit_custom_request').text('Submit');

        __modal_toggle('custom_clearance_immediate_supervisor_mdl');
    });
    $('body').on('click', '.btn_submit_custom_request', function (){

        let thisButton      = $(this);
        let clearance_employee_id     = $('.mdl_input_custom_clearance_employee_id').val();
        let clearanceID     = $('.mdl_input_custom_clearance_id').val();
        let trackingID      = $('.mdl_input_custom_tracking_id').val();
        let clearance_type  = $('.mdl_input_custom_clearance_type').val();
        let immediateHead   = $('.custom_immediate_supervisor').val();

        if(!immediateHead){
            $('.custom_reminder_div').show();
            $('.reminder_message').text('Immediate Supervisor is Required!');
        }
        else{

            $.ajax({
                url: '/clearance/create-custom-request',
                type: 'POST',
                data: {
                    clearance_employee_id,
                    clearanceID,
                    trackingID,
                    clearance_type,
                    immediateHead,
                },
                dataType: 'json',
                beforeSend: function () {

                    thisButton.prop('disabled', true);
                    thisButton.text('Processing...');

                },
                success: function (response) {

                    thisButton.prop('disabled', false);
                    thisButton.text('Submit');
                    $('.custom_reminder_div').hide();
                    $('.reminder_message').text(null);

                    if(response.success){

                        __swalSuccess(response.message);
                        resetModalInputs();
                        loadMyClearance();
                    }
                    else {
                        __swalError(response.message);
                    }

                    __modal_hide('custom_clearance_immediate_supervisor_mdl');
                },
            });

        }
    });

    $('body').on('click', '.btn_mdl_resubmit_clearance', function (){

        let thisButton      = $(this);
        let signTrackID     = $(this).data('sign-track-id');
        let clearanceID     = $(this).data('clearance-id');
        let trackingID      = $(this).data('tracking-id');
        let clearanceType   = $(this).data('clearance-type');
        let clearanceOfficer= $(this).data('clearing-officer');
        let actionStatus    = $(this).data('action-status');

        $.ajax({
            url: '/clearance/resubmit-request',
            type: 'POST',
            data: {
                signTrackID,
                clearanceID,
                trackingID,
                clearanceType,
                clearanceOfficer,
                actionStatus,
            },
            dataType: 'json',
            beforeSend: function () {

                thisButton.prop('disabled', true);
                thisButton.text('Processing...');

            },
            success: function (response) {

                thisButton.prop('disabled', false);
                thisButton.text('Resubmit');
                $('.custom_reminder_div').hide();
                $('.reminder_message').text(null);

                if(response.success){
                    __swalSuccess(response.message);

                    loadSignatoryTrackingActivity(clearanceID, trackingID, clearanceType);

                }
                else {
                    __swalError(response.message);
                }
            },
        });

    });
}

function resetModalInputs() {
    $('.mdl_input_custom_clearance_employee_id').val(null);
    $('.mdl_input_custom_clearance_id').val(null);
    $('.mdl_input_custom_tracking_id').val(null);
    $('.mdl_input_custom_clearance_type').val(null);
    $('.custom_immediate_supervisor').val(null).trigger('change');
}

function resetModal() {
    // Reset immediate supervisor select2 dropdown
    $('#immediate_supervisor').val(null).trigger('change'); // Clear select2 selection

    // Clear all radio buttons
    $('input[name="csc_request_purpose"]').prop('checked', false);

    // Hide and clear the "purpose_others" field
    $('.purpose_others').val('').closest('div').addClass('hidden');

    // Clear the effectivity date
    $('.effectivity_period').val('');

    // Clear the office assigned text input
    $('.office_assigned').val('');

    // Clear any hidden input fields
    $('.mdl_input_clearance_id').val('');
    $('.mdl_input_clearance_type').val('');
}


function loadSignatoryTrackingActivity(clearance_id, tracking_id, clearance_type){

    const modal_sign_track_activity = $('.modal_sign_track_activity');
    modal_sign_track_activity.empty();

    $.ajax({
        url: '/clearance/load-my-clearance-signatory-activity',
        type: 'POST',
        data: {
            clearance_id,
            tracking_id,
            clearance_type
        },
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            let action_buttons  = '';

            modal_sign_track_activity.empty();
            if(response.signatory_list.length > 0)
            {
                response.signatory_list.forEach(function (item) {

                    if(item.signature_status === '4' || item.signature_status === '12'){

                        action_buttons = `<button class="btn btn-secondary-soft text-primary px-2 ml-auto mr-2 btn_mdl_resubmit_clearance"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-clearance-type="${item.clearanceType}"
                                                data-clearing-officer="${item.clearingOfficer}"
                                                data-action-status="1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-2 w-4 h-4 mr-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                                                Resubmit
                                            </button>
                                            <button class="btn btn-secondary-soft px-2 btn_view_sign_history"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-signatory="${item.signatoryFullName.toUpperCase()}"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-of-contents w-4 h-4 mr-2"><path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/></svg>
                                                View History
                                            </button>`;
                    }
                    else {
                        action_buttons = `<button class="btn btn-secondary px-2 ml-auto box btn_view_sign_history"
                                                data-sign-track-id="${item.signatory_id}"
                                                data-clearance-id="${item.clearance_id}"
                                                data-tracking-id="${item.tracking_id}"
                                                data-signatory="${item.signatoryFullName.toUpperCase()}"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-of-contents w-4 h-4 mr-2"><path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/></svg>
                                                View History
                                            </button>`;
                    }

                    const my_clearance_sign_activity = `
                    <div class="intro-x relative flex items-center mb-3">
                        <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                <img alt="Profile Picture" src="${item.profilePicture}">
                            </div>
                        </div>
                        <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                            <div class="flex items-center">
                                <div class="font-medium">${item.signatoryFullName.toUpperCase()}</div>
                                <div class="text-xs text-slate-500 ml-auto">${item.date_acted}</div>
                            </div>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5 w-72 truncate">${item.office_name}</div>
                            <div class="text-${item.status_class} mt-1">${item.status_name.toUpperCase()}</div>
                            <div class="flex items-center">
                                ${ action_buttons }
                            </div>
                        </div>
                    </div>
                    <div style="margin-left: 3.5rem" class="box px-5 py-3 mb-8 flex-1 hidden box_signature_history"></div>
                    `;
                    modal_sign_track_activity.append(my_clearance_sign_activity);
                });
            }
            else
            {
                let message = 'No clearance found.';
                modal_sign_track_activity.append(`
                    <div class="intro-x relative flex items-center mb-3">
                        <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                            <div class="flex items-center">
                                <div class="font-medium">${message}</div>
                            </div>
                        </div>
                    </div>
                `);
            }


        },
    });

}

/** FUNCTION FOR TABLE DYNAMIC NO RESULTS AND LOADING SPINNER */
function noResult(tableBody, message, colspan){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="${colspan}" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}
