$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let documentPond;
let orderUpdated = false; // Flag to control reordering updates

$(document).ready(function () {

    $('.clearance_id').val(null);

    clearanceListActions();
    addUpdateSignatory();
    select2Handler();

    loadCreatedClearances();

    customClearanceActions();

    const filePondElement   = document.querySelector(`input[id='document_attachments']`);

    documentPond = FilePond.create(filePondElement, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',
        acceptedFileTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
            'application/msword', // Word (.doc)
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
            'application/vnd.ms-excel', // Excel (.xls)
            'image/jpeg', // JPEG image
            'image/png', // PNG image
            'image/gif'  // GIF image
        ],

        // Enable client-side processing
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {
                // Simulate a delay before uploading the file (for testing purposes)
                setTimeout(() => {
                    // Simulate successful upload
                    load(file);
                }, 1000);
            },
            revert: (uniqueFileId, load, error) => {
            },
        },
    });

});

function select2Handler(){

    $('.selected_employee').select2({
        placeholder: "Select Employee",
        closeOnSelect: true,
        cancelable: true,
    });
    $('.selected_employee_custom_sign').select2({
        placeholder: "Select Employee",
        closeOnSelect: true,
        cancelable: true,
    });

    $('.selected_employee_2').select2({
        placeholder: "Select Employee",
        closeOnSelect: true,
        cancelable: true,
    });

    // Initialize Select2
    $('.select_tag').select2({
        placeholder: "Select Employees",
        closeOnSelect: false, // Allow multiple selection
        allowClear: true,
    });

}

function loadCreatedClearances(){
    const clearance_list_table = $('.clearance_list_table tbody');
    clearance_list_table.empty();

    $.ajax({
        url: '/clearance/load-created-clearance',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            clearance_list_table.empty();

            if(response.transactions.length > 0){
                response.transactions.forEach(function (transaction) {

                    let status_button;
                    let action_button;

                    if(transaction.status === '13'){
                        status_button = `
                                <div class="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md">Open</div>
                                <div class="form-switch w-full sm:w-auto mt-3 sm:mt-0">
                                    <input data-clearance-id="${ transaction.clearance_id }" id="status_check" class="form-check-input mr-0 ml-3" checked type="checkbox">
                                </div>`;
                        action_button = `
                            <a class="flex items-center mr-3 text-slate-400 btn_disabled " href="javascript:;"
                                    data-clearance-id="${ transaction.clearance_id }"
                                    data-clearance-title="${ transaction.clearance_title }"
                                    data-clearance-type="${ transaction.clearance_type_id }"
                                    data-clearance-agency="${ transaction.clearance_agency_id }"
                                    data-clearance-sem="${ transaction.sem }"
                                    data-clearance-year="${ transaction.year }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                    Edit
                                </a>
                              <a class="flex items-center text-slate-400 btn_disabled  mr-3" href="javascript:;"
                                   data-clearance-id="${ transaction.clearance_id }"
                                    data-clearance-title="${ transaction.clearance_title }"
                                    data-clearance-type="${ transaction.clearance_type_id }"
                                    data-clearance-agency="${ transaction.clearance_agency_id }"
                                    data-clearance-sem="${ transaction.sem }"
                                    data-clearance-year="${ transaction.year }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-1"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                    View
                                </a>
                              <a class="flex items-center text-slate-400 btn_disabled " href="javascript:;"
                                data-clearance-id="${ transaction.clearance_id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                Delete
                            </a>`;
                    }
                    else {
                        status_button = `
                                <div class="ml-2 px-2 py-0.5 bg-danger/20 text-danger text-xs rounded-md">Close</div>
                                <div class="form-switch w-full sm:w-auto mt-3 sm:mt-0">
                                    <input data-clearance-id="${ transaction.clearance_id }" id="status_check" class="form-check-input mr-0 ml-3" type="checkbox">
                                </div>`;
                        action_button = `
                            <a class="flex items-center mr-3 btn_edit_clearance_setup" href="javascript:;"
                                    data-clearance-id="${ transaction.clearance_id }"
                                    data-clearance-title="${ transaction.clearance_title }"
                                    data-clearance-type="${ transaction.clearance_type_id }"
                                    data-clearance-agency="${ transaction.clearance_agency_id }"
                                    data-clearance-sem="${ transaction.sem }"
                                    data-clearance-year="${ transaction.year }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                    Edit
                                </a>
                              <a class="flex items-center text-primary/80 mr-3 btn_view_signatories" href="javascript:;"
                                   data-clearance-id="${ transaction.clearance_id }"
                                    data-clearance-title="${ transaction.clearance_title }"
                                    data-clearance-type="${ transaction.clearance_type_id }"
                                    data-clearance-agency="${ transaction.clearance_agency_id }"
                                    data-clearance-sem="${ transaction.sem }"
                                    data-clearance-year="${ transaction.year }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info w-4 h-4 mr-1"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                                    View
                                </a>
                              <a class="flex items-center text-danger btn_remove_created_clearance" href="javascript:;"
                                data-clearance-id="${ transaction.clearance_id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                Delete
                            </a>`;
                    }

                    const transactionList = `
                     <tr class="intro-x">
                        <td class="">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_title }</a>
                             <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.clearance_type }</div>
                        </td>
                        <td class="text-center">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_agency }</a>
                        </td>
                        <td class="text-center">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.year }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.sem } Semester</div>
                        </td>
                        <td class="text-center">
                            <div class="flex justify-center items-center">
                                ${ status_button }
                            </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                              ${ action_button }
                            </div>
                        </td>
                     </tr>
                    `;
                    clearance_list_table.append(transactionList); // Append curriculum row to the table

                });
            }
            else{
                tableRowNoResult(clearance_list_table,'No data found.', 5);
            }
        },
        complete: function () {

        }
    });

}

function loadCSC_II_Signatories(clearance_id){

    const csc_ii_div    = $('.csc_ii_div');
    csc_ii_div.empty();

    $.ajax({
        url: '/clearance/load-csc-ii-signatory',
        type: 'POST',
        data: { clearance_id },
        dataType: 'json',
        beforeSend: function () {
            csc_ii_div.append(`<div class="loading_icon">
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
                                </div>`
                                );
        },
        success: function (response) {

            csc_ii_div.empty();
            let csc_ii_data = response.csc_ii_data;
            csc_ii_div.html(csc_ii_data);
        },
        complete: function () {

        }
    });

}
function loadCSC_III_Signatories(clearance_id){

    const csc_iii_table = $('.csc_iii_table tbody');
    csc_iii_table.empty();

    $.ajax({
        url: '/clearance/load-csc-iii-signatory',
        type: 'POST',
        data: { clearance_id },
        dataType: 'json',
        beforeSend: function () {
            csc_iii_table.append(`<tr>
                                    <td colspan="5">
                                        <div class="flex justify-center">
                                           <div>
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
                                        </div>
                                    </td>
                                  </tr>`
                                );
        },
        success: function (response) {

            csc_iii_table.empty();
            let csc_iii_table_row = response.csc_iii_table_row;

            csc_iii_table.html(csc_iii_table_row);
        },
        complete: function () {

        }
    });

}
function loadCSC_IV_Signatories(clearance_id){

    const csc_table_div = $('.csc_table_div');
    csc_table_div.empty();

    $.ajax({
        url: '/clearance/load-csc-iv-signatory',
        type: 'POST',
        data: { clearance_id },
        dataType: 'json',
        beforeSend: function () {
            csc_table_div.append(`<div class="flex justify-center">
                                       <div>
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

            csc_table_div.empty();
            let csc_iv_table     = response.csc_iv_table;
            csc_table_div.html(csc_iv_table);
        },
        complete: function () {

        }
    });

}
function loadCSC_V_Signatories(clearance_id){

    const certification_div    = $('.certification_div');
    certification_div.empty();

    $.ajax({
        url: '/clearance/load-csc-v-signatory',
        type: 'POST',
        data: { clearance_id },
        dataType: 'json',
        beforeSend: function () {
            certification_div.append(`<div class="loading_icon">
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
                                </div>`
            );
        },
        success: function (response) {

            certification_div.empty();
            let certification_data = response.certification_div;
            certification_div.html(certification_data);
        },
        complete: function () {

        }
    });

}


function addUpdateSignatory(){

    $('body').on('click', '.btn_add_new_csc_row', function (){

        let table_row_id = $(this).data('tr-id');
        let modal_header = $(this).data('modal-header');
        $('.table_row_id').val(table_row_id);
        $('.modal_header').text(table_row_id+' - '+modal_header);

        if (table_row_id === 'V' || table_row_id === 'IV' || table_row_id === 'II' ) {
            $('.office_category_div').hide();
            $('.office_name_div').removeClass('col-span-6').addClass('col-span-12');
        } else {
            $('.office_category_div').show();
            $('.office_name_div').removeClass('col-span-12').addClass('col-span-6');
        }

        $('.signatory_id').val(null);
        $('.office_category').val(null);
        $('.office_name').val(null);
        $('.selected_employee').val(null).trigger('change');
        $('.employee_extension').val(null).trigger('change');

        __modal_toggle('add_new_csc_row_mdl');

    });
    $('body').on('click', '.btn_add_new_csc_iv_row', function (){

        let table_row_id    = $(this).data('tr-id');
        let table_data_id   = $(this).data('td-id');
        let agency_office   = $(this).data('office-name');
        let modal_header    = $(this).data('modal-header');
        $('.table_row_id_2').val(table_row_id);
        $('.table_data_id_2').val(table_data_id);
        $('.agency_office_name_2').val(agency_office);


        if(table_data_id === 'IV.1')
        {
            $('.agency_office_name_div').hide();
            $('.agency_office_name_2').val(null);
        }


        $('.signatory_id_2').val(null);
        $('.selected_employee_2').val(null).trigger('change');
        $('.employee_extension_2').val(null).trigger('change');

        __modal_toggle('add_new_csc_iv_row_mdl');
    });

    $('body').on('click', '.btn_update_csc_signatory', function (){

        let table_row_id        = $(this).data('tr-id');
        let signatory_id        = $(this).data('signatory-id');
        let office_category     = $(this).data('office-cat');
        let office_name         = $(this).data('office-name');
        let clearing_officer    = $(this).data('clearing-officer');
        let clearing_extension  = $(this).data('clearing-extension');

        const headers = {
            'II': 'CLEARANCE FROM WORK-RELATED ACCOUNTABILITIES',
            'III': 'CLEARANCE FROM MONEY AND PROPERTY ACCOUNTABILITIES',
            'IV': 'CERTIFICATE OF NO PENDING ADMINISTRATIVE CASE',
            'V': 'CERTIFICATION'
        };

        if (table_row_id === 'V' || table_row_id === 'IV' || table_row_id === 'II' ) {
            $('.office_category_div').hide();
            $('.office_name_div').removeClass('col-span-6').addClass('col-span-12');
        } else {
            $('.office_category_div').show();
            $('.office_name_div').removeClass('col-span-12').addClass('col-span-6');
        }

        const modal_header = headers[table_row_id] || 'Default Header';

        $('.modal_header').text(table_row_id+' - '+modal_header);

        $('.table_row_id').val(table_row_id);
        $('.signatory_id').val(signatory_id);
        $('.office_category').val(office_category);
        $('.office_name').val(office_name);
        $('.selected_employee').val(clearing_officer).trigger('change');
        $('.employee_extension').val(clearing_extension);

        __modal_toggle('add_new_csc_row_mdl');
    });
    $('body').on('click', '.btn_update_csc_iv_signatory', function (){

        let table_row_id        = $(this).data('tr-id');
        let table_data_id       = $(this).data('td-id');
        let agency_office       = $(this).data('office-name');
        let signatory_id        = $(this).data('signatory-id');
        let clearing_officer    = $(this).data('clearing-officer');
        let clearing_extension  = $(this).data('clearing-extension');


        $('.table_row_id_2').val(table_row_id);
        $('.table_data_id_2').val(table_data_id);
        $('.agency_office_name_2').val(agency_office);
        $('.signatory_id_2').val(signatory_id);
        $('.selected_employee_2').val(clearing_officer).trigger('change');
        $('.employee_extension_2').val(clearing_extension);

        __modal_toggle('add_new_csc_iv_row_mdl');
    });

    $('body').on('click', '.bnt_save_csc_signatory', function (){

        let thisButton      = $(this);

        let office_category     = $('.office_category').val();
        let office_name         = $('.office_name').val();
        let selected_employee   = $('.selected_employee').val();
        let employee_extension  = $('.employee_extension').val();
        let signatory_id        = $('.signatory_id').val();
        let table_row_id        = $('.table_row_id').val();
        let clearance_id        = $('.clearance_id').val();

        $.ajax({
            url: '/clearance/create-csc-signatory',
            type: 'POST',
            data: { office_category, office_name, selected_employee, employee_extension, signatory_id, table_row_id, clearance_id },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Saving...');
            },
            success: function (response) {

                if (response.success)
                {
                    thisButton.prop('disabled', false);
                    thisButton.text('Save');

                    const actions = {
                        'II': () => {
                            loadCSC_II_Signatories(clearance_id);
                            __modal_hide('add_new_csc_row_mdl');
                        },
                        'III': () => {
                            loadCSC_III_Signatories(clearance_id);
                        },
                        'IV': () => {
                            loadCSC_IV_Signatories(clearance_id);
                        },
                        'V': () => {
                            loadCSC_V_Signatories(clearance_id);
                            __modal_hide('add_new_csc_row_mdl');
                        }
                    };

                    if (actions[table_row_id]) {
                        actions[table_row_id]();
                    }


                    $('.office_category').val(null);
                    $('.office_name').val(null);
                    $('.selected_employee').val(null).trigger('change');
                    $('.employee_extension').val(null);

                }

            },
            complete: function () {

            }
        });

    });
    $('body').on('click', '.bnt_save_csc_iv_signatory', function (){

        let thisButton              = $(this);
        let clearance_id            = $('.clearance_id').val();
        let table_row_id_2          = $('.table_row_id_2').val();
        let table_data_id_2         = $('.table_data_id_2').val();
        let agency_office           = $('.agency_office_name_2').val();
        let signatory_id_2          = $('.signatory_id_2').val();
        let selected_employee_2     = $('.selected_employee_2').val();
        let employee_extension_2    = $('.employee_extension_2').val();

        $.ajax({
            url: '/clearance/create-csc-iv-signatory',
            type: 'POST',
            data: {
                clearance_id,
                table_row_id_2,
                table_data_id_2,
                agency_office,
                signatory_id_2,
                selected_employee_2,
                employee_extension_2,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Saving...');
            },
            success: function (response) {

                if (response.success)
                {
                    thisButton.prop('disabled', false);
                    thisButton.text('Save');

                    loadCSC_IV_Signatories(clearance_id);
                    __modal_hide('add_new_csc_iv_row_mdl');

                    $('.table_row_id_2').val(null);
                    $('.signatory_id_2').val(null);
                    $('.selected_employee_2').val(null).trigger('change');
                    $('.employee_extension_2').val(null);

                }

            },
            complete: function () {

            }
        });

    });


    $('body').on('click', '.btn_toggle_delete_csc_signatory', function (){

        let signatory_id    = $(this).data('signatory-id');
        let table_row_id    = $(this).data('tr-id');
        $('.mdl_delete_signatory_id').val(signatory_id);
        $('.mdl_table_row_id').val(table_row_id);
        __modal_toggle('delete_csc_modal');

    });
    $('body').on('click', '.mdl_btn_delete_csc_signatory', function (){

        let thisButton = $(this);
        let signatory_id  = $('.mdl_delete_signatory_id').val();
        let table_row_id  = $('.mdl_table_row_id').val();
        let clearance_id  = $('.clearance_id').val();

        $.ajax({
            url: '/clearance/delete-csc-iii-signatory',
            type: 'POST',
            data: { signatory_id },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Deleting...');
            },
            success: function (response) {

                if (response.success)
                {
                    thisButton.prop('disabled', false);
                    thisButton.text('Delete');

                    const delete_actions = {
                        'II': () => {
                            loadCSC_II_Signatories(clearance_id);
                            __modal_hide('add_new_csc_row_mdl');
                        },
                        'III': () => {
                            loadCSC_III_Signatories(clearance_id);
                        },
                        'IV': () => {
                            loadCSC_IV_Signatories(clearance_id);
                        },
                        'V': () => {
                            loadCSC_V_Signatories();
                            __modal_hide('add_new_csc_row_mdl');
                        }
                    };

                    if (delete_actions[table_row_id]) {
                        delete_actions[table_row_id]();
                    }


                    $('.mdl_delete_signatory_id').val(null);
                    __modal_hide('delete_csc_modal');

                }

            },
            complete: function () {

            }
        });
    });

}

function clearanceListActions(){

    $('body').on('click', '.btn_add_new_clearance', function (){
        __modal_toggle('create_new_clearance_mdl');
    });

    $('body').on('click', '.mdl_btn_create_new_clearance', function (){

        let thisButton          = $(this);
        let clearance_id        = $('.clearance_id').val();
        let clearance_type      = $('.clearance_type').val();
        let clearance_agency    = $('.clearance_agency').val();
        let clearance_title     = $('.clearance_title_').val();
        let clearance_semester  = $('.clearance_semester').val();
        let clearance_year      = $('.clearance_year').val();

        $.ajax({
            url: '/clearance/create-new-clearance',
            type: 'POST',
            data: {
                clearance_id,
                clearance_type,
                clearance_agency,
                clearance_title,
                clearance_semester,
                clearance_year,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Saving...');
            },
            success: function (response) {
                if (response.success)
                {
                    $('.clearance_id').val(null);
                    $('.clearance_type').val(null);
                    $('.clearance_agency').val(null);
                    $('.clearance_title').val(null);
                    $('.clearance_semester').val(null);
                    $('.clearance_year').val(null);

                    thisButton.prop('disabled', false);
                    thisButton.text('Save');

                    loadCreatedClearances();

                    __modal_hide('create_new_clearance_mdl');
                }
            },
            complete: function () {

            }
        });

    });

    $('body').on('click', '.btn_edit_clearance_setup', function (){

        let thisButton          = $(this);
        let clearance_id        = $(this).data('clearance-id');
        let clearance_type      = $(this).data('clearance-type');
        let clearance_agency    = $(this).data('clearance-agency');
        let clearance_title     = $(this).data('clearance-title');
        let clearance_semester  = $(this).data('clearance-sem');
        let clearance_year      = $(this).data('clearance-year');

        __modal_toggle('create_new_clearance_mdl');

        $('.clearance_id').val(clearance_id);
        $('.clearance_type').val(clearance_type);
        $('.clearance_agency').val(clearance_agency);
        $('.clearance_title_').val(clearance_title);
        $('.clearance_semester').val(clearance_semester);
        $('.clearance_year').val(clearance_year);

    });

    $('body').on('click', '.btn_view_signatories', function (){

        let thisButton          = $(this);
        let clearance_id        = $(this).data('clearance-id');
        let clearance_type      = $(this).data('clearance-type');
        let clearance_agency    = $(this).data('clearance-agency');
        let clearance_title     = $(this).data('clearance-title');
        let clearance_semester  = $(this).data('clearance-sem');
        let clearance_year      = $(this).data('clearance-year');

        $('.clearance_id').val(clearance_id);

        /** VIEW CIVIL SERVICE CLEARANCE FORM */
        if(clearance_type === 1) {

            $('.clearance_title').text(clearance_title);
            $('.clearance_setup_div').show();
            $('.clearance_csc_setup_div').show();
            $('.clearance_custom_setup_div').hide();
            $('.clearance_list_div').hide();

            loadCSC_II_Signatories(clearance_id);
            loadCSC_III_Signatories(clearance_id);
            loadCSC_IV_Signatories(clearance_id);
            loadCSC_V_Signatories(clearance_id);

        }else if(clearance_type === 2) {

            let filters = {};
            orderUpdated = true;
            $('.clearance_title').text(clearance_title);
            $('.clearance_setup_div').show();
            $('.clearance_custom_setup_div').show();
            $('.clearance_csc_setup_div').hide();
            $('.clearance_list_div').hide();
            filters.clearance_id = $('.clearance_id').val();

            loadCustomClearanceSignatories(1, filters);
            loadCustomClearanceApprovingSignatories(1, filters);
            loadCustomClearanceDocuments(1, filters);


        }


    });

    $('body').on('click', '.btn_back_to_list', function (){

        $('.clearance_id').val(null);
        $('.clearance_list_div').show();
        $('.clearance_setup_div').hide();
        $('.clearance_custom_setup_div').hide();
    });

    $('body').on('click', '.btn_remove_created_clearance', function (){

        let clearanceID = $(this).data('clearance-id');
        $('.mdl_delete_clearance_id').val(clearanceID);

       __modal_toggle('delete_created_clearance_mdl');
    });

    $('body').on('click', '.mdl_btn_delete_created_clearance', function (){

        let thisButton      = $(this);
        let clearance_id    = $('.mdl_delete_clearance_id').val();

        $.ajax({
            url: '/clearance/delete-created-clearance',
            type: 'POST',
            data: {
                clearance_id,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Deleting...');
            },
            success: function (response) {
                if (response.success)
                {
                    $('.mdl_delete_clearance_id').val(null);

                    thisButton.prop('disabled', false);
                    thisButton.text('Delete');

                    loadCreatedClearances();

                    __modal_hide('delete_created_clearance_mdl');
                }
            },
            complete: function () {

            }
        });

    });

    $('body').on('click', '#status_check', function () {
        let thisButton = $(this);
        let clearance_id = thisButton.data('clearance-id'); // Retrieve clearance ID

        // Toggle the checkbox value (e.g., checked = 1, unchecked = 0)
        let clearance_status = thisButton.prop('checked') ? 1 : 0;

        $.ajax({
            url: '/clearance/update/status',
            type: 'POST',
            data: {
                clearance_id: clearance_id,
                clearance_status: clearance_status,
            },
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // CSRF token for Laravel
            },
            beforeSend: function () {
                // Disable the button and show loading Swal
                thisButton.prop('disabled', true);

                Swal.fire({
                    title: 'Updating Status...',
                    text: 'Please wait while we update the clearance status.',
                    icon: 'info',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading(); // Show loading indicator
                    }
                });
            },
            success: function (response) {
                if (response.status === 'success') {
                    // Show success message with Swal
                    Swal.fire({
                        title: 'Status Updated!',
                        text: 'Clearance status updated successfully.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Reload the data (optional function)
                    loadCreatedClearances();
                } else {
                    // Show error message if status is not 'success'
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error updating clearance status.',
                        icon: 'error',
                        showConfirmButton: true
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An unexpected error occurred.',
                    icon: 'error',
                    showConfirmButton: true
                });
            },
            complete: function () {
                // Re-enable the button and close the Swal loader
                thisButton.prop('disabled', false);
                Swal.close();
            }
        });
    });

    $('body').on('click', '.btn_disabled', function (){
        Swal.fire({
            title: 'Oopps!',
            text: 'Clearance cannot be edited once open.',
            icon: 'warning',
            showConfirmButton: true
        });
    });


}


/** CUSTOM CLEARANCE */
function loadCustomClearanceSignatories(page, filters){
    const custom_clearance_sign = $('.custom_clearance_sign tbody');
    custom_clearance_sign.empty();

    let tableSelector   = '.custom_clearance_sign';
    let colspan         = getTableColspan(tableSelector);

    $.ajax({
        url: '/clearance/load-custom-signatory?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            custom_clearance_sign.append(`<tr>
                                    <td colspan="${colspan}">
                                        <div class="flex justify-center">
                                           <div>
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
                                        </div>
                                    </td>
                                  </tr>`
            );
        },
        success: function (response) {

            custom_clearance_sign.empty();

            if(response.signatories.length > 0){
                response.signatories.forEach(function (item){

                    let document_action;

                    if(item.clearanceDocumentsCount > 0){
                        document_action  = `
                                            <div
                                                data-document-id="${ item.documentID }"
                                                data-profile-picture="${ item.profilePicture }"
                                                data-clearing-officer-primary-id="${ item.customSignatoryID }"
                                                data-clearing-officer-id="${ item.clearingOfficerID }"
                                                data-clearing-name="${ item.clearingOfficerName }"
                                                data-position-designation="${ item.pos_designation_div }"
                                                data-modal-header="ADD DOCUMENTS"
                                                class="mr-2 w-20 cursor-pointer btn_add_documents border border-dashed dark:border-darkmode-400 rounded-md relative px-2 p-1">
                                                <div class="w-full flex justify-center">
                                                    <div class="truncate text-center text-slate-600 font-medium">Add</div>
                                                </div>
                                            </div>
                                            <div data-document-id="${ item.documentID }"
                                                 data-clearing-officer-id="${ item.customSignatoryID }"
                                                 class="w-20 cursor-pointer btn_view_documents border border-dashed dark:border-darkmode-400 rounded-md relative px-4 p-1">
                                                <div class="w-full flex justify-center">
                                                    <div class="truncate text-center text-primary/80 font-medium">View</div>
                                                </div>
                                                <div class="w-4 h-4 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-primary font-medium -mt-1 -mr-1">${ item.clearanceDocumentsCount }</div>
                                            </div>`;
                    }
                    else {
                        document_action  = `<div
                                                data-document-id="${ item.documentID }"
                                                data-profile-picture="${ item.profilePicture }"
                                                data-clearing-officer-primary-id="${ item.customSignatoryID }"
                                                data-clearing-officer-id="${ item.clearingOfficerID }"
                                                data-clearing-name="${ item.clearingOfficerName }"
                                                data-position-designation="${ item.pos_designation_div }"
                                                data-modal-header="ADD DOCUMENTS"
                                                class="mr-2 w-20 cursor-pointer btn_add_documents border border-dashed dark:border-darkmode-400 rounded-md relative px-2 p-1">
                                                <div class="w-full flex justify-center">
                                                    <div class="truncate text-center text-slate-600 font-medium">Add</div>
                                                </div>
                                            </div>
                                            <div data-document-id="${ item.documentID }"
                                                 data-clearing-officer-id="${ item.customSignatoryID }"
                                                 data-profile-picture="${ item.profilePicture }"
                                                 data-clearing-officer-primary-id="${ item.customSignatoryID }"
                                                 data-clearing-officer-id="${ item.clearingOfficerID }"
                                                 data-clearing-name="${ item.clearingOfficerName }"
                                                 data-position-designation="${ item.pos_designation_div }"
                                                 class="w-20 cursor-pointer border border-dashed dark:border-darkmode-400 rounded-md relative px-4 p-1">
                                                <div class="w-full flex justify-center">
                                                    <div class="truncate text-center text-slate-400 font-medium">View</div>
                                                </div>
                                            </div>`;
                    }
                    const tableRow = `
                            <tr class="intro-x">
                                <td>${ item.officeName }</td>
                                <td>
                                    <a href="javascript:;" class="font-medium whitespace-nowrap">${ item.clearingOfficerName }</a>
                                    ${ item.pos_designation_div }
                                </td>
                                <td class="text-center">
                                    <div class="flex justify-center items-center">
                                        ${ document_action }
                                    </div>
                                </td>
                                <td class="table-report__action w-20">
                                    <div class="flex justify-center items-center">
                                        <a class="flex items-center mr-3 btn_update_custom_signatory"
                                            data-modal-header="CLEARANCE SIGNATORIES"
                                            data-custom-signatory-id="${ item.customSignatoryID }"
                                            data-clearing-officer-id="${ item.clearingOfficerID }"
                                            data-name-extension="${ item.officerNameExtension }"
                                            data-office-name="${ item.officeName }"
                                            data-tr-id="${ item.tr_id }"
                                            href="javascript:;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen w-4 h-4 mr-1"><path d="M2 21a8 8 0 0 1 10.821-7.487"></path><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"></path><circle cx="10" cy="8" r="5"></circle></svg>
                                        </a>
                                        <a class="flex items-center text-danger btn_toggle_delete_custom_signatory"  data-custom-signatory-id="${ item.customSignatoryID }" href="javascript:;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </a>
                                    </div>
                                </td>
                            </tr>`;

                    custom_clearance_sign.append(tableRow);
                });
            }
            else {
                custom_clearance_sign.append(`<tr>
                                    <td colspan="${colspan}">
                                        <div class="flex justify-center">
                                           <div>
                                               <div class="text-slate-400 text-xs text-center mt-0.5">No data found.</div>
                                           </div>
                                        </div>
                                    </td>
                                  </tr>`
                );
            }
        },
        complete: function () {

        }
    });
}
function loadCustomClearanceApprovingSignatories(page, filters) {
    const custom_clearance_approving_sign = $('.custom_clearance_approving_sign tbody');
    custom_clearance_approving_sign.empty();

    let tableSelector = '.custom_clearance_sign';
    let colspan = getTableColspan(tableSelector);

    $.ajax({
        url: '/clearance/load-custom-approving-signatory?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            custom_clearance_approving_sign.append(`
                <tr>
                    <td colspan="${colspan}">
                        <div class="flex justify-center">
                            <div>
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
                        </div>
                    </td>
                </tr>`);
        },
        success: function (response) {
            custom_clearance_approving_sign.empty();
            if (response.signatories.length > 0) {
                response.signatories.forEach(function (item, index) {
                    const tableRow = `
                        <tr data-custom-signatory-id="${item.customSignatoryID}">
                            <td class="w-12 border-r">${index + 1}</td>
                            <td>${item.officeName}</td>
                            <td>
                                <a href="javascript:;" class="font-medium whitespace-nowrap">${item.clearingOfficerName}</a>
                                ${item.pos_designation_div}
                            </td>
                            <td class="table-report__action w-20 border-r">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3 btn_update_custom_signatory"
                                        data-modal-header="CLEARANCE SIGNATORIES"
                                        data-custom-signatory-id="${item.customSignatoryID}"
                                        data-clearing-officer-id="${item.clearingOfficerID}"
                                        data-name-extension="${item.officerNameExtension}"
                                        data-office-name="${item.officeName}"
                                        data-tr-id="${item.tr_id}"
                                        href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen w-4 h-4 mr-1"><path d="M2 21a8 8 0 0 1 10.821-7.487"></path><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"></path><circle cx="10" cy="8" r="5"></circle></svg>
                                    </a>
                                    <a class="flex items-center text-danger btn_toggle_delete_custom_signatory" data-tr-id="${item.tr_id}" data-custom-signatory-id="${item.customSignatoryID}" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </a>
                                </div>
                            </td>
                            <td class="table-report__action w-20 cursor-pointer">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center text-slate-500 btn_reorder" data-custom-signatory-id="${item.customSignatoryID}" href="javascript:;">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
                                    </a>
                                </div>
                            </td>
                        </tr>`;
                    custom_clearance_approving_sign.append(tableRow);
                });
            } else {
                custom_clearance_approving_sign.append(`
                    <tr>
                        <td colspan="${colspan}">
                            <div class="flex justify-center">
                                <div class="text-slate-400 text-xs text-center mt-0.5">No data found.</div>
                            </div>
                        </td>
                    </tr>`);
            }
        },
        complete: function () {
            updateIndex();
            if (orderUpdated) { // Only update the database if an order change was flagged
                updateOrderInDatabase();
                orderUpdated = false; // Reset the flag
            }
        }
    });
}
function loadCustomClearanceDocuments(page, filters){
    const document_list_div = $('.document_list_div');
    document_list_div.empty();

    // Return the AJAX request object
    return $.ajax({
        url: '/clearance/load-custom-clearance-documents?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        success: function (response) {

            document_list_div.empty();

            if(response.clearanceDocumentData.length > 0){
                response.clearanceDocumentData.forEach(function (item){

                    let documentLink;

                    if (item.attachments){
                        documentLink = `<a href="${ item.attachments }" target="_blank" class="w-3/5 file__icon file__icon--file mx-auto">
                                            <div class="file__icon__file-name">FILE</div>
                                        </a>`;
                    }
                    else {
                        documentLink = `<a href="javascript:;" class="w-3/5 file__icon file__icon--file mx-auto">
                                            <div class="file__icon__file-name">FILE</div>
                                        </a>`;
                    }

                    const documents =  `
                        <div class="intro-y md:col-span-2">
                            <div class="file box rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                                ${ documentLink }
                                <a href="javascript:;" class="block font-medium mt-4 text-center truncate">${ item.documentName }</a>
                                <div class="text-slate-500 text-xs text-center mt-0.5">Documents Required by:</div>
                                <div class="text-slate-500 font-medium text-xs text-center mt-0.5">${ item.clearingOfficerName }</div>
                                <div class="text-slate-500 text-xs text-center mt-0.5 border-t border-slate-200/60 dark:border-darkmode-400">${ item.officeName }</div>
                                <div id="document_dropdown" class="absolute top-0 right-0 mr-2 mt-3 dropdown ml-auto">
                                    <a class="dropdown-toggle w-5 h-5 block" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="more-vertical" data-lucide="more-vertical" class="lucide lucide-more-vertical w-5 h-5 text-slate-500">
                                            <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                                        </svg>
                                    </a>
                                    <div class="dropdown-menu w-40">
                                        <ul class="dropdown-content">
                                            <li>
                                                <a href="javascript:;"
                                                    data-document-attachment="${ item.attachments }"
                                                    data-document-id="${ item.documentID }"
                                                    data-document-name="${ item.documentName }"
                                                    data-document-desc="${ item.documentDesc }"
                                                    data-clearing-officer="${ item.clearingOfficerName }"
                                                    data-profile-picture="${ item.profilePicture }"
                                                    data-modal-header="UPDATE DOCUMENTS"
                                                    class="dropdown-item btn_edit_document_attachments">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-pen-line w-4 h-4 mr-2">
                                                        <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><path d="M8 18h1"/>
                                                    </svg>
                                                    Edit File
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;" class="dropdown-item text-danger btn_delete_document_attachments"
                                                    data-document-id="${ item.documentID }"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash w-4 h-4 mr-2">
                                                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                    </svg>
                                                    Delete File
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                    document_list_div.append(documents);
                });
            } else {
                const documents =  `
                    <div class="intro-y col-span-12 p-8">
                         <div class="text-slate-400 text-xs text-center mt-0.5">No data found.</div>
                    </div>`;

                document_list_div.append(documents);
            }
        }
    });
}

function customClearanceActions(){

    let filters = {};

    $('body').on('click', '.btn_add_new_csc_custom_row', function (){

        let modalHeader = $(this).data('modal-header');
        let tableRowID  = $(this).data('tr-id');

        $('.custom_modal_header').text(modalHeader);
        $('.input_custom_clearance_tr').val(tableRowID);

        $('.input_custom_clearance_id').val(null);
        $('.custom_office_name').val(null);
        $('.selected_employee_custom_sign').val(null).trigger('change');
        $('.employee_extension_custom').val(null);


        __modal_toggle('add_new_custom_sign_row_mdl');

    });
    $('body').on('click', '.btn_update_custom_signatory', function (){

        let modalHeader             = $(this).data('modal-header');
        let customSignatoryID       = $(this).data('custom-signatory-id');
        let clearingOfficerID       = $(this).data('clearing-officer-id');
        let officeName              = $(this).data('office-name');
        let officerNameExtension    = $(this).data('name-extension');
        let tr_id                   = $(this).data('tr-id');

        $('.input_custom_clearance_id').val(null);
        $('.input_custom_clearance_tr').val(null);

        $('.input_custom_clearance_id').val(customSignatoryID);
        $('.input_custom_clearance_tr').val(tr_id);

        $('.custom_office_name').val(officeName);
        $('.employee_extension_custom').val(officerNameExtension);
        $('.selected_employee_custom_sign').val(clearingOfficerID).trigger('change');
        $('.custom_modal_header').text(modalHeader);

        __modal_toggle('add_new_custom_sign_row_mdl');

    });
    $('body').on('click', '.btn_toggle_delete_custom_signatory', function (){

        let customClearanceID   = $(this).data('custom-signatory-id');
        let customClearanceTrID = $(this).data('tr-id');
        $('.mdl_delete_custom_signatory_id').val(customClearanceID);
        $('.mdl_delete_custom_signatory_tr_id').val(customClearanceTrID);

        __modal_toggle('delete_custom_signatory_mdl');

    });
    $('body').on('click', '.bnt_save_custom_signatory', function () {

        let thisButton          = $(this);
        let clearanceID         = $('.clearance_id').val();
        let clearingID          = $('.selected_employee_custom_sign').val();
        let nameExtension       =  $('.employee_extension_custom').val();
        let officeName          = $('.custom_office_name').val();
        let customSignatoryID   =  $('.input_custom_clearance_id').val();
        let tableRowID          =  $('.input_custom_clearance_tr').val();

        $.ajax({
            url: '/clearance/create-custom-signatory',
            type: 'POST',
            data: {
                customSignatoryID,
                clearanceID,
                clearingID,
                nameExtension,
                officeName,
                tableRowID,
            },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Saving...');
            },
            success: function (response) {
                if (response.success) {
                    // Clear input fields
                    $('.selected_employee_custom_sign').val(null).trigger('change');
                    $('.custom_office_name').val('');

                    // Hide modal
                    filters.clearance_id = $('.clearance_id').val();

                    if(tableRowID === 'I'){
                        loadCustomClearanceSignatories(1, filters);
                    }

                    if(tableRowID === 'II'){
                        loadCustomClearanceApprovingSignatories(1, filters);
                    }

                    $('.alert_div').empty();
                    __modal_hide('add_new_custom_sign_row_mdl');
                    __swalSuccess('Signatory added successfully!');

                } else if (response.errors) {
                    // Display server-side validation errors
                    $.each(response.errors, function (key, value) {
                        $('.alert_div').append(
                            `<div class="alert my-4 alert-outline-warning alert-dismissible show flex items-center bg-warning/20 dark:bg-darkmode-400 dark:border-darkmode-400 mn-4" role="alert">
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="alert-triangle" data-lucide="alert-triangle" class="lucide lucide-alert-triangle w-6 h-6 mr-3"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                                <span class="text-slate-800 dark:text-slate-500 label_alert_message">${ value[0] }</span>
                                <button type="button" class="btn-close dark:text-white" data-tw-dismiss="alert" aria-label="Close"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>
                            </div>`
                        );
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors (e.g., network issues, server error)
                alert('An error occurred while saving the signatory. Please try again.');
            },
            complete: function () {
                thisButton.prop('disabled', false);
                thisButton.text('Save');
            }
        });
    });
    $('body').on('click', '.mdl_btn_delete_custom_signatory', function (){

        let thisButton        = $(this);
        let customClearanceID   = $('.mdl_delete_custom_signatory_id').val();
        let customClearanceTrID =  $('.mdl_delete_custom_signatory_tr_id').val();

        $.ajax({
            url: '/clearance/delete-custom-signatory',
            type: 'POST',
            data: { customClearanceID },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Deleting...');
            },
            success: function (response) {
                if(response.success){

                    $('.mdl_delete_custom_signatory_id').val(null);
                    __modal_hide('delete_custom_signatory_mdl');
                    __swalSuccess(response.message);

                    filters.clearance_id = $('.clearance_id').val();

                    if(customClearanceTrID === 'I'){
                        loadCustomClearanceSignatories(1, filters);
                    }
                    if(customClearanceTrID === 'II'){
                        // Set orderUpdated flag to true to update the order after reloading
                        orderUpdated = true;
                        loadCustomClearanceApprovingSignatories(1, filters);
                    }

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors (e.g., network issues, server error)
                alert('An error occurred while saving the signatory. Please try again.');
            },
            complete: function () {
                thisButton.prop('disabled', false);
                thisButton.text('Delete');
            }
        });
    });

    $('body').on('click', '.btn_view_documents', function (){

        let documentID          = $(this).data('document-id');

        filters.clearance_id = $('.clearance_id').val();
        filters.signatory_primary_id = $(this).data('clearing-officer-id');

        loadCustomClearanceDocuments(1, filters);


    });
    $('body').on('click', '.btn_add_documents', function (){

        let documentClearanceID         = $('.clearance_id').val();
        let clearingOfficerPrimaryID    = $(this).data('clearing-officer-primary-id');
        let clearingOfficerID           = $(this).data('clearing-officer-id');
        let clearingOfficerName         = $(this).data('clearing-name');
        let profilePicture              = $(this).data('profile-picture');
        let modalHeader                 = $(this).data('modal-header');
        let pos_designation_div         = $(this).data('position-designation');

        $('.input_doc_clearance_id').val(null);
        $('.input_clearing_officer_id').val(null);
        $('.input_document_id').val(null);
        $('.document_name').val(null);
        $('.document_description').val(null);


        $('.document_modal_header').text(modalHeader);
        $('.clearing_officer_name').text(clearingOfficerName);
        $('.clearing_officer_designation').html(pos_designation_div);
        $('.input_doc_clearance_id').val(documentClearanceID);
        $('.input_clearing_officer_primary_id').val(clearingOfficerPrimaryID);
        $('.input_clearing_officer_id').val(clearingOfficerID);
        $('.profile_picture').attr("src", profilePicture);

        documentPond.removeFiles();
        __modal_toggle('add_new_document_mdl');

    });


    $('body').on('click', '.bnt_save_clearance_documents', function (){

        const formData  = new FormData();
        let thisButton  = $(this);

        if (typeof documentPond !== 'undefined') {

            let uploadedFile = documentPond.getFile();

            if (uploadedFile) {
                formData.append('documentAttachment', uploadedFile.file);
            }

            formData.append('input_doc_clearance_id', $('.input_doc_clearance_id').val());
            formData.append('clearing_officer_id', $('.input_clearing_officer_id').val());
            formData.append('clearingOfficerPrimaryID', $('.input_clearing_officer_primary_id').val());
            formData.append('document_id', $('.input_document_id').val());
            formData.append('document_name', $('.document_name').val());
            formData.append('document_description', $('.document_description').val());

            $.ajax({
                url: '/clearance/create-documents',
                type: 'POST',
                data: formData,
                contentType: false, // Set contentType to false
                processData: false, // Prevent jQuery from processing the data
                dataType: 'json',
                beforeSend: function () {
                    thisButton.prop('disabled', true);
                    thisButton.html('Saving...');
                },
                success: function (response) {
                    if (response.success){

                        thisButton.prop('disabled', false);
                        thisButton.html('Save');

                        $('.input_doc_clearance_id').val(null);
                        $('.input_clearing_officer_id').val(null);
                        $('.input_clearing_officer_primary_id').val(null);
                        $('.document_name').val(null);
                        $('.document_description').val(null);

                        __modal_toggle('add_new_document_mdl');
                        __removeUploadedFilePond();

                        filters.clearance_id = $('.input_doc_clearance_id').val();

                        loadCustomClearanceDocuments(1, filters);
                        loadCustomClearanceSignatories(1, filters);
                    }
                }
            });

        }
    });
    $('body').on('click', '.btn_edit_document_attachments', function (){

        let documentClearanceID         = $('.clearance_id').val();
        let documentAttachment          = $(this).data('document-attachment');
        let documentID                  = $(this).data('document-id');
        let documentName                = $(this).data('document-name');
        let modalHeader                 = $(this).data('modal-header');
        let documentDesc                = $(this).data('document-desc');
        let clearingOfficer             = $(this).data('clearing-officer');
        let profilePicture              = $(this).data('profile-picture');

        __dropdown_close('#document_dropdown');
        $('.document_modal_header').text(modalHeader);
        $('.clearing_officer_name').text(clearingOfficer);
        $('.profile_picture').attr("src", profilePicture);
        $('.document_name').val(documentName);
        $('.document_description').val(documentDesc);
        $('.input_document_id').val(documentID);

        __modal_toggle('add_new_document_mdl');

        documentPond.removeFiles();
        if (documentPond && documentAttachment) {
            documentPond.addFile(documentAttachment);
        }
    });


    $('body').on('click', '.btn_reload_documents_list', function () {
        const icon = $(this).find('svg');
        // Add spin animation
        icon.addClass('spin-animation');

        // Set the clearance_id in filters
        filters.signatory_primary_id = null;
        filters.clearance_id = $('.clearance_id').val();

        // Start the AJAX request
        loadCustomClearanceDocuments(1, filters)
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
    $('body').on('click', '.toggle-collapse', function () {
        const icon = $(this);
        const content = icon.closest('.border').find('.collapsible-content');

        // Toggle visibility
        content.slideToggle();

        // Toggle rotation of the SVG icon for visual indication
        icon.toggleClass('transform rotate-180');
    });


    $('body').on('click', '.btn_delete_document_attachments', function () {

        const thisButton    = $(this);
        let documentID      = thisButton.data('document-id');

        $('.mdl_delete_document_id').val(null);
        $('.mdl_delete_document_id').val(documentID);

        __dropdown_close('#document_dropdown');
        __modal_toggle('delete_document_attachment_mdl');

    });
    $('body').on('click', '.mdl_btn_delete_document_attachment', function (){

        const thisButton    = $(this);
        let documentID      =  $('.mdl_delete_document_id').val();

        $.ajax({
            url: '/clearance/delete-document-attachment',
            type: 'POST',
            data: { documentID },
            dataType: 'json',
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.text('Deleting...');
            },
            success: function (response) {
                if(response.success){

                    $('.mdl_delete_document_id').val(null);
                    __modal_hide('delete_document_attachment_mdl');
                    __swalSuccess(response.message);

                    filters.clearance_id = $('.clearance_id').val();
                    loadCustomClearanceDocuments(1, filters);

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors (e.g., network issues, server error)
                alert('An error occurred while saving the signatory. Please try again.');
            },
            complete: function () {
                thisButton.prop('disabled', false);
                thisButton.text('Delete');
            }
        });

    });


    // Enable sorting on tbody rows with a handle (btn_reorder)
    $(".custom_clearance_approving_sign tbody").sortable({
        handle: ".btn_reorder", // Set the handle to the .btn_reorder element
        helper: fixHelperModified,
        stop: function(event, ui) {
            updateIndex(); // Update any displayed index in the UI
            updateOrderInDatabase(); // Call the function to update the database
        }
    }).disableSelection();

}


/** Function to update the row order in the database */
function updateOrderInDatabase() {
    let order = [];
    $(".custom_clearance_approving_sign tbody tr").each(function(index, element) {
        let id = $(element).data('custom-signatory-id');
        order.push({ id: id, position: index + 1 });
    });

    // Send AJAX request to update order in the database
    $.ajax({
        url: '/clearance/update-order',
        method: 'POST',
        data: JSON.stringify(order),
        contentType: 'application/json',
        success: function(response) {
            let filters = {};
            filters.clearance_id = $('.clearance_id').val();
            //loadCustomClearanceApprovingSignatories(1, filters);
            console.log("Order updated successfully:", response);
        },
        error: function(xhr, status, error) {
            console.error("Error updating order:", error);
        }
    });
}

/** Optional helper function to keep row size consistent while dragging */
function fixHelperModified(e, tr) {
    let originals = tr.children();
    let helper = tr.clone();

    helper.children().each(function(index) {
        $(this).width(originals.eq(index).width());
    });
    return helper;
}

/** Callback function to handle reordering actions after drop */
function updateIndex() {
    $('.custom_clearance_approving_sign tbody tr').each(function(index) {
        $(this).find('td').first().text(index + 1); // Updates the first <td> in each row with the new index
    });
}

function loadResponsibilityCenter(){

}
