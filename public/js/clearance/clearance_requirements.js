$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let cscCurrentPage = 1; // Initialize the current page
let semCurrentPage = 1; // Initialize the current page
const doneTypingInterval = 1000; // 1 second
let typingTimer;

$(document).ready(function () {

    fetchCreatedCSCClearance();
    fetchCreatedSemestralClearance();
    lackingRequirementActions();
    smartFilters();

});


/** FUNCTION FOR FETCHING CREATED CSC CLEARANCE */
function fetchCreatedCSCClearance(page, filters) {
    const cscDivElementID = $('#csc_clearance_list');
    cscDivElementID.empty();
    $.ajax({
        url: '/clearance/load/created/csc/clearance?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            boxLoadingSpinner(cscDivElementID);
        },
        success: function (data) {
            if (data.clearance.length > 0) {
                cscDivElementID.empty();
                data.clearance.forEach(function (item) {
                    const csc_clearance = `
                        <div class="relative my-4 btn_csc_view_details rounded-md"
                            data-clearance-id="${item.clearance_id}"
                            data-clearance-name="${item.clearance_name}"
                            data-clearance-hour="${item.clearance_time_created}"
                            data-clearance-date="${item.clearance_date_created}"
                            >
                            <div class="event p-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center border border-dashed dark:border-darkmode-400 rounded-md">
                                <div class="w-2 h-2 bg-${item.status_class} rounded-full mr-3"></div>
                                <div class="pr-10">
                                    <div class="font-medium">${item.clearance_name}</div>
                                     <div class="mt-0.5"> <span class="text-slate-500 text-xs">Status:</span> <span class="text-${item.status_class} text-xs">${item.clearance_status}</span> </div>
                                    <div class="text-slate-500 text-xs mt-0.5"> <span class="">${item.clearance_date_created}</span> <span class="mx-1">•</span> ${item.clearance_time_created} </div>
                                </div>
                            </div>
                            <a class="flex items-center text-slate-500 absolute top-0 bottom-0 my-auto right-0 mr-4" href="javascript:;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse w-4 h-4"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                            </a>
                        </div>
                    `;
                    cscDivElementID.append(csc_clearance);
                });
            }else
            {
                cscDivElementID.empty();
                boxNoResult(cscDivElementID, 'No data found..');
            }

            const previousPageButton = $('#csc_prev');
            const nextPageButton = $('#csc_next');
            if (data.current_page === 1) {
                previousPageButton.prop('disabled', true);
                previousPageButton.addClass('text-slate-400');
            } else {
                previousPageButton.prop('disabled', false);
                previousPageButton.removeClass('text-slate-400');
            }
            if (data.current_page === data.last_page) {
                nextPageButton.prop('disabled', true);
                nextPageButton.addClass('text-slate-400');
            } else {
                nextPageButton.prop('disabled', false);
                nextPageButton.removeClass('text-slate-400');
            }

            $('#csc_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();

            // Update the current page
            cscCurrentPage = data.current_page;
        }
    });
}

/** FUNCTION FOR FETCHING CREATED SEMESTRAL CLEARANCE */
function fetchCreatedSemestralClearance(page, filters) {

    const semDivElementID = $('#sem_clearance_list');
    semDivElementID.empty();

    $.ajax({
        url: '/clearance/load/created/sem/clearance?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            boxLoadingSpinner(semDivElementID);

        },
        success: function (data) {

            if(data.clearance.length > 0)
            {
                semDivElementID.empty();
                data.clearance.forEach(function (item){

                    const csc_clearance =`
                            <div class="relative my-4 rounded-md btn_sem_view_details"
                                data-clearance-id="${item.clearance_id}"
                                data-clearance-name="${item.clearance_name}"
                                data-clearance-hour="${item.clearance_time_created}"
                                data-clearance-date="${item.clearance_date_created}"
                                >
                                <div class="event p-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 flex items-center border border-dashed dark:border-darkmode-400 rounded-md">
                                    <div class="w-2 h-2 bg-${item.status_class} rounded-full mr-3"></div>
                                    <div class="pr-10">
                                        <div class="font-medium">${item.clearance_name}</div>
                                            <div class="mt-0.5"> <span class="text-slate-500 text-xs">Status:</span> <span class="text-${item.status_class} text-xs">${item.clearance_status}</span> </div>
                                        <div class="text-slate-500 text-xs mt-0.5"> <span class="">${item.clearance_date_created}</span> <span class="mx-1">•</span> ${item.clearance_time_created} </div>
                                    </div>
                                </div>
                                <a class="flex items-center text-slate-500 absolute top-0 bottom-0 my-auto right-0 mr-4" href="javascript:;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse w-4 h-4"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                                </a>
                            </div>
                        `;

                    semDivElementID.append(csc_clearance);
                });
            }else
            {
                semDivElementID.empty();
                boxNoResult(semDivElementID, 'No data found..');
            }

            $('#sem_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();


            const previousPageButton = $('#sem_prev');
            const nextPageButton = $('#sem_next');
            if (data.current_page === 1) {
                previousPageButton.prop('disabled', true);
                previousPageButton.addClass('text-slate-400');
            } else {
                previousPageButton.prop('disabled', false);
                previousPageButton.removeClass('text-slate-400');
            }
            if (data.current_page === data.last_page) {
                nextPageButton.prop('disabled', true);
                nextPageButton.addClass('text-slate-400');
            } else {
                nextPageButton.prop('disabled', false);
                nextPageButton.removeClass('text-slate-400');
            }

            $('#sem_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();

            // Update the current page
            semCurrentPage = data.current_page;
        }
    });
}

/** FUNCTION FOR FETCHING DOCUMENTS LIST */
function fetchDocumentList(page, filters){

    const documentsDivElementID = $('#document_list');
    const documentsEmptyDiv     = $('#document_list_empty');
    const paginationID          = $('#clearance_document_pagination');
    documentsDivElementID.empty();
    documentsEmptyDiv.empty();
    paginationID.empty();
    $.ajax({
        url: '/clearance/load/documents?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            customDocumentsLoading(documentsEmptyDiv);

        },
        success: function (data) {

            if(data.documents.length > 0)
            {
                documentsDivElementID.show();
                documentsEmptyDiv.hide();
                $('.default_view').hide();

                data.documents.forEach(function (item){
                    const documents = `<div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2">
                                            <div class="file box rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                                                <a href="javascript:;" class="w-3/5 file__icon file__icon--empty-directory mx-auto btn_view_document_details"
                                                data-document-id="${ item.document_id }"
                                                data-document-name="${ item.document_name }"
                                                data-document-desc="${ item.document_desc }"
                                                data-document-created="${ item.document_created_at }"

                                                data-clearance-id="${ item.clearance_id }"
                                                data-clearance-name="${ item.clearance_name }"
                                                data-clearance-time-created="${ item.clearance_time_created }"
                                                data-clearance-date-created="${ item.clearance_date_created }"
                                                >
                                                </a>
                                                <a href="javascript:;" class="block font-medium mt-4 text-center truncate">${ item.document_name }</a>
                                                <div class="text-slate-500 text-xs text-center mt-0.5">${ item.document_desc }</div>
                                                <div id="document_list_dd" class="absolute top-0 right-0 mr-2 mt-3 dropdown ml-auto">
                                                    <a class="dropdown-toggle w-5 h-5 block" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="more-vertical" data-lucide="more-vertical" class="lucide lucide-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                    </a>
                                                    <div class="dropdown-menu w-40">
                                                        <ul class="dropdown-content">
                                                            <li>
                                                                <a href="javascript:;" class="dropdown-item btn_edit_file"
                                                                     data-document-id="${ item.document_id }"
                                                                     data-clearance-id="${ item.clearance_id }"
                                                                     data-document-name="${ item.document_name }"
                                                                     data-document-desc="${ item.document_desc }"
                                                                     data-signatory-primary-id="${ item.signatory_primary_id }"
                                                                    >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen w-4 h-4 mr-2"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>
                                                                    Edit File
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="javascript:;" class="dropdown-item btn_delete_file text-danger"
                                                                     data-document-id="${ item.document_id }"
                                                                     data-clearance-id="${ item.clearance_id }"
                                                                     >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                                    Delete File
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                           </div>
                                       </div>`;
                    documentsDivElementID.append(documents);
                });

                updateClearanceListPaginationLinks(data,paginationID,'');
            }else
            {
                documentsDivElementID.hide();
                documentsEmptyDiv.show();
                emptyDocuments(documentsEmptyDiv);
            }

            $('.document_loading_icon').remove();
        }
    });

}

function emptyDocuments(documentsEmptyDiv){
    const divElement = `<div class="w-32 h-32 flex-none image-fit rounded-full overflow-hidden mx-auto">
                            <img alt="Empty Documents" src="/dist/images/empty.webp">
                        </div>
                        <div class="text-center items-center">
                            <div class="font-medium">No Documents Found</div>
                            <a href="javascript:;" class="text-slate-500 mt-2 btn_add_new_document">Please click <strong class="text-primary">Add New Document</strong> Button to create new.</a>
                        </div>`;

    documentsEmptyDiv.html(divElement);
}
function customDocumentsLoading(documentsEmptyDiv){

    const divElement = `<div class="p-3 w-full flex justify-center cursor-pointer document_loading_icon">
                            <div class="text-center">
                            <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>
                        </div>`;

    documentsEmptyDiv.html(divElement);
}


/** FUNCTION FOR LACKING REQUIREMENTS ACTIONS */
function lackingRequirementActions(){

    let filters = {};

    $('body').on('click', '.btn_clearance_details', function (){

        let clearance_id    = $(this).data('clearance-id');
        let clearance_name  = $(this).data('clearance-name');

        filters.clearance_id;

        fetchClearanceDocuments(1, filters);

    });
    $('body').on('click', '.btn_save_document', function (){

        let clearance_id   = $('.input_clearance_id_mdl').val();
        let document_id    = $('.input_document_id_mdl').val();
        let document_title = $('.document_title').val().trim();
        let document_desc = $('.document_desc').val().trim();
        let signatory_primary_id = $('.designation_select').val();
        let this_button    = $(this);


        // Validate required fields
        if (!signatory_primary_id) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select a Designation.'
            });

            $('.designation_select').addClass('border-danger');
            return false;
        }else
        {
            $('.designation_select').removeClass('border-danger');
        }
        if (!document_title) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a Document Title.'
            });
            $('.document_title').addClass('border-danger');
            return false;
        }else
        {
            $('.document_title').removeClass('border-danger');
        }
        if (!document_desc) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a Document Description.'
            });
            $('.document_desc').addClass('border-danger');
            return false
        }else
        {
            $('.document_desc').removeClass('border-danger');
        }

        $.ajax({
            url: '/clearance/create-required-documents',
            type: 'POST',
            data: { clearance_id, document_id, document_title, document_desc, signatory_primary_id },
            dataType: 'json',
            beforeSend: function () {
                this_button.html('Saving...');
                this_button.prop('disabled', true);
            },
            success: function (data) {

                if(data.success)
                {
                    Swal.fire({
                        icon:  'success',
                        title: 'Success',
                        text:  'Documents created successfully',
                        showConfirmButton: false,
                        timerProgressBar: true,
                        timer: 1000  // Close the alert after 1 second
                    });

                    this_button.html('Save');
                    this_button.prop('disabled', false);

                    $('.input_clearance_id_mdl').val(null);
                    $('.document_title').val(null);
                    $('.document_desc').val(null);
                    $('.designation_select').val(null);
                    __modal_hide('add_document_mdl');

                    $('.document_title').removeClass('border-danger');
                    $('.document_desc').removeClass('border-danger');
                    $('.designation_select').removeClass('border-danger');

                    filters.clearance_id = clearance_id;
                    fetchDocumentList(1, filters);
                }
            }
        });
    });

    $('body').on('click', '.btn_pill_csc', function (){

        $('.document_content_div').hide();
        fetchCreatedCSCClearance();

    });
    $('body').on('click', '.btn_pill_sem', function (){

        $('.document_content_div').hide();
        fetchCreatedSemestralClearance();

    });

    $('#csc_prev').click(function () {
        if (cscCurrentPage > 1) {
            filters.search_clearance = $('#search_csc_clearance').val();
            fetchCreatedCSCClearance(cscCurrentPage - 1, filters);
        }
    });
    $('#csc_next').click(function () {
        filters.search_clearance = $('#search_csc_clearance').val();
        fetchCreatedCSCClearance(cscCurrentPage + 1, filters);
    });

    $('#sem_prev').click(function () {
        if (semCurrentPage > 1) {
            filters.search_clearance = $('#search_sem_clearance').val();
            fetchCreatedSemestralClearance(semCurrentPage - 1, filters);
        }
    });
    $('#sem_next').click(function () {
        filters.search_clearance = $('#search_sem_clearance').val();
        fetchCreatedSemestralClearance(semCurrentPage + 1, filters);
    });

    $('body').on('click', '.btn_csc_view_details', function (){
        // Remove the class from all elements
        $('.btn_csc_view_details').removeClass('bg-primary');
        $('.btn_csc_view_details .font-medium, .btn_csc_view_details .text-slate-500, .btn_csc_view_details .text-xs').removeClass('text-white');

        // Add the class to the clicked element
        $(this).addClass('bg-primary');
        $(this).find('.font-medium, .text-slate-500, .text-xs').addClass('text-white');

        // Get the data attributes from the clicked element
        let clearance_id    = $(this).data('clearance-id');
        let clearance_name  = $(this).data('clearance-name');
        let clearance_hour  = $(this).data('clearance-hour');
        let clearance_date  = $(this).data('clearance-date');
        let clearance_type  = 1;

        // Update the UI elements with the data
        $('.input_clearance_id').val(clearance_id);
        $('.label_clearance_title').text(clearance_name);
        $('.label_hour').text(clearance_hour);
        $('.label_date').text(clearance_date);
        $('.document_content_div').show();

        fetchMyDesignation(clearance_type);

        filters.clearance_id = clearance_id;
        fetchDocumentList(1, filters);

        $('.btn_add_new_document').show();

    });
    $('body').on('click', '.btn_sem_view_details', function (){
        // Remove the class from all elements
        $('.btn_sem_view_details').removeClass('bg-primary');
        $('.btn_sem_view_details .font-medium, .btn_sem_view_details .text-slate-500, .btn_sem_view_details .text-xs').removeClass('text-white');

        // Add the class to the clicked element
        $(this).addClass('bg-primary');
        $(this).find('.font-medium, .text-slate-500, .text-xs').addClass('text-white');

        // Get the data attributes from the clicked element
        let clearance_id    = $(this).data('clearance-id');
        let clearance_name  = $(this).data('clearance-name');
        let clearance_hour  = $(this).data('clearance-hour');
        let clearance_date  = $(this).data('clearance-date');
        let clearance_type  = 2;

        // Update the UI elements with the data
        $('.input_clearance_id').val(clearance_id);
        $('.label_clearance_title').text(clearance_name);
        $('.label_hour').text(clearance_hour);
        $('.label_date').text(clearance_date);
        $('.document_content_div').show();

        fetchMyDesignation(clearance_type);
        filters.clearance_id = clearance_id;
        fetchDocumentList(1, filters);

        $('.btn_add_new_document').show();
    });

    $('body').on('click', '.btn_add_new_document', function (){

        $('.input_clearance_id_mdl').val(null);
        $('.input_document_id_mdl').val(null);
        $('.document_title').val(null);
        $('.document_desc').val(null);

        let clearance_id = $('.input_clearance_id').val();
        $('.input_clearance_id_mdl').val(clearance_id);
        __modal_toggle('add_document_mdl');
    });

    $('body').on('click', '.btn_edit_file', function (){

        let document_id   = $(this).data('document-id');
        let clearance_id  = $(this).data('clearance-id');
        let document_name = $(this).data('document-name');
        let document_desc = $(this).data('document-desc');
        let signatory_primary_id = $(this).data('signatory-primary-id');

        __dropdown_close('#document_list_dd');

        $('.input_clearance_id_mdl').val(clearance_id);
        $('.input_document_id_mdl').val(document_id);
        $('.document_title').val(document_name);
        $('.document_desc').val(document_desc);
        $('.designation_select').val(signatory_primary_id);

        __modal_toggle('add_document_mdl');
    });
    $('body').on('click', '.btn_delete_file', function (){

        let document_id   = $(this).data('document-id');
        let clearance_id  = $(this).data('clearance-id');
        __dropdown_close('#document_list_dd');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this document? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/remove/created-documents',
                    type: 'POST',
                    data: { document_id },
                    dataType: 'json',
                    beforeSend: function () {

                    },
                    success: function (response) {

                        if(response.isDeleted)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Removed successfully!',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });

                            filters.clearance_id = clearance_id;
                            fetchDocumentList(1, filters);
                        }else
                        {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Oooopss...',
                                text: 'Something went wrong',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });
                        }
                    },
                });

            }
        });

    });
    $('body').on('click', '.btn_view_document_details', function (){

        let document_id   = $(this).data('document-id');
        let document_name = $(this).data('document-name');
        let document_desc = $(this).data('document-desc');
        let clearance_name = $(this).data('clearance-name');
        let clearance_time_created = $(this).data('clearance-time-created');
        let clearance_date_created = $(this).data('clearance-date-created');

        $('.label_document_name').text(document_name);
        $('.label_document_desc').text(document_desc);
        $('.label_clearance_name').text(clearance_name);
        $('.label_clearance_time_created').text(clearance_time_created);
        $('.label_clearance_date_created').text(clearance_date_created);

        __modal_toggle('document_details_mdl');
    });
}


function fetchMyDesignation(clearance_type){

    $.ajax({
        url: '/clearance/fetch-my-designations',
        type: "POST",
        data: { clearance_type },
        beforeSend: function () {

        },
        success: function (response) {
            $('.designation_select').empty();

            // Populate the select element with the new options
            response.designations.forEach(function (item) {

                if (item.signatory_primary_id && item.designation_name) {
                    $('.designation_select').append(`<option value="${item.signatory_primary_id}">${item.designation_name}</option>`);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.error('Error fetching designations:', textStatus, errorThrown);
        }
    });

}

/** FUNCTION FOR TABLE DYNAMIC NO RESULTS AND LOADING SPINNER */
function noResult(tableBody, message){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="7" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}
function loadingSpinner(tableBody, colspan){

    let loadingRow = `
                     <tr id="loading-row" class="intro-x loading-row">
                        <td colspan="${ colspan }" class="w-full text-center">
                            <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
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
                        </td>
                     </tr>`;
    tableBody.append(loadingRow);

}
function boxLoadingSpinner(divElement){

    let spinner = `<div class="my-4 loadingSpinner">
                        <div class="p-3 w-full flex justify-center cursor-pointer">
                            <div class="text-center">
                                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>
                            </div>
                        </div>
                     </div>`;
    divElement.append(spinner);
}
function boxNoResult(divElement, message){
    let spinner = `<div class="my-4 border border-dashed dark:border-darkmode-400 rounded-md">
                        <div class="p-3 w-full flex justify-center cursor-pointer">
                            <div class="text-center">
                                <div class="text-slate-400 text-xs">${message}</div>
                            </div>
                        </div>
                     </div>`;
    divElement.append(spinner);
}

/** FUNCTION FOR UPDATING TABLE PAGINATION */
function updateClearanceListPaginationLinks(data, paginationId, paginationSummaryId) {

    const paginationLinks = paginationId;
    paginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;

    // Add "Chevrons Left" link
    if (currentPage > 1) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

}


/** FUNCTION FOR SMART FILTERS */
function smartFilters(){

    let filters = {};
    // Event handler for filter search input
    $('#search_csc_clearance').on('keyup', function (event) {

        clearTimeout(typingTimer);
        filters.search_clearance = $(this).val();

        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchCreatedCSCClearance(1, filters);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchCreatedCSCClearance(1, filters);
            }, doneTypingInterval);
        }
    });
    $('#search_sem_clearance').on('keyup', function (event) {

        clearTimeout(typingTimer);
        filters.search_clearance = $(this).val();

        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
                fetchCreatedSemestralClearance(1, filters);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchCreatedSemestralClearance(1, filters);
            }, doneTypingInterval);
        }
    });

    /** CLEARANCE DOCUMENTS Event handler for pagination links  */
    $('body').on('click', '#clearance_document_pagination a', function (event) {
        event.preventDefault();

        const page = $(this).data('page');

        filters.clearance_id = $('.input_clearance_id').val();
        fetchDocumentList(page, filters);
    });

}
