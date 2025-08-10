var  _token = $('meta[name="csrf-token"]').attr('content');
var searchPositionFilter = '';
var currentPage = 1;
var totalPages = 1;
var perPage = 10;
var page = 1;
var per_page = 1;
$(document).ready(function () {
    qualificationSelect2_setup();
    loadPositionQualification();
    positionQualification_clickFunction();
    saveSetPositionQualification();
    saveSetStandardQualification();
    saveAddQualification();
    positionQualificationTablistContainer();
    deleteFunction();
    paginationQualificationPage();
});
{

    function loadPositionQualification(){
        $.ajax({
            type: "GET",
            url: "/rating/load-position-qualifications",
            data: {
                searchPositionFilter:searchPositionFilter,
                perPage: perPage,
                page: page
            },
            dataType: "json",
            beforeSend: function () {
                $("#positionQualification_load").html(`<div class="intro-y col-span-12">
                    <div class="box">
                        <div class="flex flex-col items-center justify-center h-24">
                             <div class="qualification-standard-container mt-2 p-4">
                                <div class="flex justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `);
            },
            success: function (response) {
                $("#positionQualification_load").html(response.loadPositionqualification);

                    // Update pagination links
                totalPages = response.last_page;
                currentPage = response.current_page;

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
                $("#positionQualificationShow_dataCount").html(showingInfo);

            let paginationId = $('#paginationQualification');
             let paginationSummaryId = $('#positionQualificationShow_dataCount');

            updateClearanceListPaginationLinks(response.current_page, response.last_page, paginationId, paginationSummaryId)
            }
        });
    }

    function loadPositionInterviewQualification_page(){


        $("#positionQualification_load").html(`
            <div class="intro-y col-span-12">
                <div class="intro-y grid grid-cols-11 gap-5 mt-5">
                    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
                        <div class="box p-5 rounded-md">
                            <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                <div class="font-medium text-base truncate">Qualifications</div>
                                <a id="addQualification_btn" href="javascript:;" class="flex items-center ml-auto text-primary">
                                    <i data-lucide="edit" class="w-4 h-4 mr-2"></i>
                                    Add Qualifications
                                </a>
                            </div>
                        </div>
                        <div class="mt-5 loadInterviewQualification_container scrollbar-hidden" style="overflow-y: auto; height: calc(100vh - 350px);">


                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
                        <div class="box p-5 rounded-md h-full">
                            <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                <div class="font-medium text-base truncate">Required Qualifications</div>
                                <a href="javascript:;" id="addQualificationStandard_btn" class="flex items-center ml-auto text-primary"> 
                                    <i data-lucide="plus" class="w-4 h-4 mr-2"></i> 
                                    Add Qualification Standard
                                </a>
                            </div>
                            <div class="p-5 qualification-standard-item-container overflow-y-auto h-full">
                                <div class="h-full flex items-center justify-center">
                                    <div class="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            class="w-16 h-16 mx-auto mb-4 text-slate-300" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" 
                                                stroke-linejoin="round" 
                                                stroke-width="1.5" 
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                        </svg>
                                        <div class="text-slate-500">Standards will be loaded here</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    function loadPositionInterviewQualification(){

        $.ajax({
            type: "GET",
            url: "/rating/load-position-interview-inqualifications",
            dataType: "json",
            beforeSend: function () {
                $(".loadInterviewQualification_container").html(`<div class="intro-y col-span-12">
                    <div class="box">
                        <div class="flex flex-col items-center justify-center h-24">
                            <div class="qualification-standard-container mt-2 p-4">
                                <div class="flex justify-center">
                                    <div class="fa-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `);
            },
            success: function (response) {
                $(".loadInterviewQualification_container").html(response.loadPositionInterviewQualifications);
            }
        });

    }

    function positionQualificationTablistContainer() {
        $("body").on('click', '.positionQualification', function (e) {
            e.preventDefault();

            $('.positionQualification').removeClass('active');
            $(this).addClass('active');

            const tabId = $(this).closest('li').attr('id');

            switch(tabId) {
                case 'qualification-standard-tab':
                    showLoadingState();
                    $('.positionQualification_searchFilter').prop('disabled', false);
                    $('#positionQualificationShow_dataCount').show();
                    $('#setInterviewQualification_btn').show();                  
                    $('.paginationQualification_div').show();
                    loadPositionQualification();
                    $('.perPage_selectQualificationPage').val(10).trigger('change');
                    break;

                case 'qualification-setup-tab':
                    showLoadingState();
                    searchPositionFilter = '';
                    page = 1;
                    
                    $('.positionQualification_searchFilter').prop('disabled', true).val('');
                    $('#positionQualificationShow_dataCount').hide();
                    $('#setInterviewQualification_btn').hide();                  
                    $('.paginationQualification_div').hide();
                    
                    Promise.resolve()
                        .then(() => {
                            loadPositionInterviewQualification_page();
                            return loadPositionInterviewQualification();
                        })
                        .catch(error => {
                            console.error('Error loading qualifications:', error);
                            __notif_show(0, 'Error loading qualifications');
                        });
                    break;

                default:
                    $('.positionQualification_searchFilter').prop('disabled', false);
                    $('#positionQualificationShow_dataCount').show();
                    $('#setInterviewQualification_btn').show();                  
                    $('.paginationQualification_div').show();
                    loadPositionQualification();
                    break;
            }
        });
    }

    //function for loading state
    function showLoadingState() {
        $("#positionQualification_load").html(`
            <div class="intro-y col-span-12">
                <div class="box">
                    <div class="flex flex-col items-center justify-center h-24">
                        <div class="qualification-standard-container mt-2 p-4">
                            <div class="flex justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    function qualificationSelect2_setup() {
        $('#positionSetInterQualification_mdl').select2({
            placeholder: "Select Position",
            closeOnSelect: true,
            allowClear: true
        });

        $('#SG_SetInterQualification_mdl').select2({
            placeholder: "Select Salary Grade",
            closeOnSelect: true,
            allowClear: true
        });
    }

    var selectedInterviewQualification = [];
    var position_qualification_id = 0;
    var interview_qualification_id = 0;
    var edit_Interview_qualification = false;

    function positionQualification_clickFunction(){
        let searchTimeout;
        $("body").on("input", ".positionQualification_searchFilter", function () {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                searchPositionFilter = $(this).val();
                loadPositionQualification();
            }, 300);
        });

        $("body").on('click', '#setInterviewQualification_btn', function () {
            edit_Interview_qualification = false;
            selectedInterviewQualification = [];
            $('#interviewQualification_loadDiv').removeClass('border border-slate-200/60 dark:border-darkmode-400').empty();
            $('#positionSetInterQualification_mdl').val('').trigger('change');
            $('#SG_SetInterQualification_mdl').val('').trigger('change');
            $('#positionqualification_id').val(0);
            open_modal("#setInterviewQualification_modal");
        });

        $('#SG_SetInterQualification_mdl').change(function (e) {
            e.preventDefault();
            if($(this).val() != '' && $('#positionSetInterQualification_mdl').val() != ''){

                loadInterviewQualification();
            }

        });

        $('#positionSetInterQualification_mdl').change(function (e) {
            e.preventDefault();

            const sgSelect = $('#SG_SetInterQualification_mdl');

            // Enable/disable the entire SG select based on position selection
            if ($(this).val()) {
                sgSelect.prop('disabled', false);
            } else {
                sgSelect.prop('disabled', true);
                sgSelect.val('').trigger('change');
                return;
            }

            // Enable all options by default
            sgSelect.find('option').prop('disabled', false);

            if ($(this).val()) {
                $.ajax({
                    type: "GET",
                    url: "/rating/get-position-on-change",
                    data: {
                        position_id: $(this).val()
                    },
                    dataType: "json",
                    success: function (response) {
                        // Only disable the option that matches sg_id
                        sgSelect.find(`option[value="${response.sg_id}"]`).prop('disabled', true);
                    }
                });
            }

            if($(this).val() != '' && sgSelect.val() != '') {
                loadInterviewQualification();
            }
        });

        $("body").on('click', '.edit_Interview_qualification', function () {
            // Clear previous selections
            selectedInterviewQualification = [];

            edit_Interview_qualification = true;
            // Get basic data
            const position_id = $(this).data('position-id');
            const sg_id = $(this).data('sg-id');
            position_qualification_id = $(this).data('position-qualification-id');

            // Set the position and salary grade
            $('#positionSetInterQualification_mdl').val(position_id).trigger('change');
            $('#SG_SetInterQualification_mdl').val(sg_id).trigger('change')

            const rawData = $(this).attr('data-selected-interview-qualification');
            $('#positionqualification_id').val(position_qualification_id);

            try {
                // Parse the qualifications data
                const selectedQualifications = JSON.parse(rawData);

                // Map the qualifications with their standards
                selectedInterviewQualification = selectedQualifications.map(qual => ({
                    interQualificationID: qual.interQualificationID,
                    interQualificationName: qual.interQualificationName,
                    position_qualification_id: position_qualification_id,
                    qualificationStandard: qual.qualificationStandard || []
                }));

                // Open the modal
                open_modal("#setInterviewQualification_modal");

                // Load and display qualifications
                loadInterviewQualification().then(() => {
                    $('#SG_SetInterQualification_mdl').find('option[value="'+sg_id+'"]').prop('disabled', false);
                })
                    .catch(error => {
                        console.error('Error loading qualifications:', error);
                        __notif_show(0, 'Error loading qualifications');
                    });
            

            } catch (error) {
                console.error("Error parsing JSON:", error);
                console.error("Raw Data:", rawData);
                selectedInterviewQualification = [];
            }
        });       

        $("body").on('click', '.loaded_InterviewQualification', function () {
            var interQualificationID = $(this).data('interview-qualification-id');
            var interQualificationName = $(this).data('interview-qualification-name');
            var icon = $(this).find('.circle_check');

            var parentElement = $(this);

            parentElement.toggleClass('expanded');

            if (parentElement.hasClass('expanded')) {
                loadQualificationStandard(interQualificationID, parentElement);
            } else {
                parentElement.next('.qualification-standard-container').slideUp(300, function() {
                    $(this).remove();
                });
            }

            var existingIndex = selectedInterviewQualification.findIndex(function (item) {
                return item.interQualificationID === interQualificationID && item.position_qualification_id === position_qualification_id;
            });

            $('#selectQualificationStandards').text('Select Qualification Standards').addClass('text-slate-600 dark:text-slate-300').removeClass('text-danger');
            if (existingIndex !== -1) {
                selectedInterviewQualification.splice(existingIndex, 1);


                $(this).removeClass('border-primary text-primary').addClass('border-slate-200');
                icon.html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');


                // $(`.comp_selected_list div[data-tag-position-id="${position_id}"]`).remove();

            } else {
                selectedInterviewQualification.push({
                    interQualificationID: interQualificationID,
                    interQualificationName: interQualificationName,
                    position_qualification_id: position_qualification_id,
                    qualificationStandard : [],
                });


                $(this).addClass('border-primary text-primary').removeClass('border-slate-200');
                icon.html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>');

                // $('.comp_selected_list').find('.noTagPosition').remove();

                // $('.comp_selected_list').append(`<div data-tag-position-id="${position_id}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagPosionList">
                //     <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                //     ${position_name}
                //     <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                //         <a href="javascript:;" data-r-position-id="${position_id}" class="removeSelectedTag">
                //             <svg xmlns="http://www.w3.org/2000/svg"
                //                 width="24"
                //                 height="24"
                //                 viewBox="0 0 24 24"
                //                 fill="none"
                //                 stroke="currentColor"
                //                 stroke-width="2"
                //                 stroke-linecap="round"
                //                 stroke-linejoin="round"
                //                 icon-name="trash-2"
                //                 data-lucide="trash-2"
                //                 class="lucide lucide-trash-2 w-4 h-4 mr-1">
                //                 <polyline points="3 6 5 6 21 6"></polyline>
                //                 <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                //                 <line x1="10" y1="11" x2="10" y2="17"></line>
                //                 <line x1="14" y1="11" x2="14" y2="17"></line>
                //             </svg>
                //         </a>
                //     </span>
                // </div>`);
            }

            if (selectedInterviewQualification.length === 0) {
                // $('.comp_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagPosition">

                //     No Position Selected
                // </div>`);
                $('#saveSetPositionQualification').prop('disabled', true);
            } else {
                $('#saveSetPositionQualification').prop('disabled', false);
            }

            console.log(selectedInterviewQualification);
            // $('#countTagSelected').text(selectedInterviewQualification.length);
        });

        $("body").on('click', '.closeSetInterviewQualification, .cancelSetInterviewQualification', function () {
            selectedInterviewQualification = [];

            $('.loaded_InterviewQualification').removeClass('border-primary text-primary  expanded').addClass('border-slate-100')
                .find('.circle_check').html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');

            $('.qualification-standard-container').remove();
            console.log(selectedInterviewQualification);
        });

        $("body").on('click', '.standard-checkbox', function () {
            const qualStandard_id = $(this).val();
            const qualStandard_name = $(this).data('standard-name');
            const $qualificationContainer = $(this).closest('.qualification-standard-container');
            const interQualificationID = $qualificationContainer.prev('.loaded_InterviewQualification').data('interview-qualification-id');

            // Find the qualification in the array
            const qualificationIndex = selectedInterviewQualification.findIndex(item =>
                item.interQualificationID === interQualificationID &&
                item.position_qualification_id === position_qualification_id
            );

            if (qualificationIndex !== -1) {

                if (!selectedInterviewQualification[qualificationIndex].qualificationStandard) {
                    selectedInterviewQualification[qualificationIndex].qualificationStandard = [];
                }

                if (this.checked) {

                    const standardExists = selectedInterviewQualification[qualificationIndex].qualificationStandard.some(
                        std => std.qualStandard_id === qualStandard_id
                    );

                    if (!standardExists) {
                        selectedInterviewQualification[qualificationIndex].qualificationStandard.push({
                            qualStandard_id: qualStandard_id,
                            qualStandard_name: qualStandard_name
                        });
                    }
                } else {

                    selectedInterviewQualification[qualificationIndex].qualificationStandard =
                        selectedInterviewQualification[qualificationIndex].qualificationStandard.filter(
                            std => std.qualStandard_id !== qualStandard_id
                        );
                }

                // Update UI
                const $container = $(this).closest('label');
                const $checkMark = $container.find('.check-mark');

                if (this.checked) {
                    $container.addClass('border-primary bg-primary-50');
                    $checkMark.removeClass('hidden');
                } else {
                    $container.removeClass('border-primary bg-primary-50');
                    $checkMark.addClass('hidden');
                }

                console.log('Updated selectedInterviewQualification:', selectedInterviewQualification);
            }
        });

        $("body").on('click', '#addQualification_btn', function () {
            open_modal("#addQualification_modal");
        });

        

        $("body").on('click', '.edit_added_Interview_qualification', function (e) {
            e.stopPropagation();
            interview_qualification_id = $(this).data('interview-qualification-id');
            $('#positionInterviewQualification_id').val(interview_qualification_id);
            $('#qualification_name').val($(this).data('interview-qualification-name'));
            $('#qualification_description').val($(this).data('interview-qualification-description'));
            open_modal("#addQualification_modal");
        });
        
        $("body").on('click', '.qualification_item', function () {
            // Remove active class from all items
            $('.qualification_item .box').removeClass('bg-primary/10 border-primary');
            
            $(this).find('.box').addClass('bg-primary/10 border-primary');
            
            interview_qualification_id = $(this).data('interview-qualification-id');
            loadQualificationStandard_item(interview_qualification_id);
        });

        $("body").on('click', '#addQualificationStandard_btn', function () {
            $('#interview_qualification_id_standard_mdl').val(0);
            if(interview_qualification_id === 0){
                __notif_show(-3, 'Please select qualification first');
                return;
            }

            open_modal("#addQualificationStandard_modal");
        });

        $("body").on('click', '.edit_Interview_qualification_standard', function () {
            interview_qualification_id = $(this).data('interview-qualification-id');
            let interview_qualification_standard_id = $(this).data('interview-qualification-standard-id');
            let interview_qualification_standard_name = $(this).data('interview-qualification-standard-name');
            let interview_qualification_standard_description = $(this).data('interview-qualification-standard-description');
            $('#interview_qualification_id_standard_mdl').val(interview_qualification_standard_id);
            $('#standardQualification_name').val(interview_qualification_standard_name);
            $('#standardQualification_description').val(interview_qualification_standard_description);
            open_modal("#addQualificationStandard_modal");
        });

        $("body").on('click', '#saveStandardQualification', function () {
            
            let interview_qualification_standard_id = $('#interview_qualification_id_standard_mdl').val();
            let standardQualification_name = $('#standardQualification_name').val();
            let standardQualification_description = $('#standardQualification_description').val();
            if(standardQualification_name === ''){
                $('#standardQualification_name').css('border-color', 'red');
                __notif_show(-3, 'Standard qualification name is required');
                return;
            }

            $('#standardQualification_name').css('border-color', '');
            $.ajax({
                type: "POST",
                url: "/rating/save-add-standard-qualification",
                data: {
                    _token: _token, 
                    interview_qualification_id: interview_qualification_id,
                    interview_qualification_standard_id: interview_qualification_standard_id,
                    standardQualification_name: standardQualification_name,
                    standardQualification_description: standardQualification_description
                },
                dataType: "json",
                success: function (response) {
                    if(response.success){
                        $('#standardQualification_name').val('');
                        $('#standardQualification_description').val('');
                        $('#interview_qualification_id_standard_mdl').val(0);
                        close_modal("#addQualificationStandard_modal");
                        loadQualificationStandard_item(interview_qualification_id);
                        __notif_show(1, 'Successfully add standard qualification');
                    }else{
                        __notif_show(-3, response.message || 'Error adding standard qualification');
                    }
                }
            });
        });

        $("body").on('click', '.delete_Interview_qualification_standard', function (e) {
            e.stopPropagation();
            let interview_qualification_standard_id = $(this).data('interview-qualification-standard-id');

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: "/rating/delete-interview-qualification-standard",
                        data: {
                            _token: _token,
                            interview_qualification_standard_id: interview_qualification_standard_id,
                        },
                        dataType: "json",
                        success: function (response) {
                            if(response.success){
                                loadQualificationStandard_item(interview_qualification_id);
                                __notif_show(1, 'Successfully remove Qualification Standard');
                            }else{
                                __notif_show(-3, response.message || 'Error removing Qualification Standard');
                            }                       }
                    });
                }
            });

        });

        $("body").on('click', '#cancelQualification, #closeaddQualification', function () {
            $('#qualification_name').val('');
            $('#qualification_description').val('');
            $('#positionInterviewQualification_id').val(0);
        });

        $("body").on('click', '#cancelStandardQualification, #closeaddStandardQualification', function () {
            $('#standardQualification_name').val('');
            $('#standardQualification_description').val('');
            $('#interview_qualification_id_standard_mdl').val(0);
        });

    }

    function loadQualificationStandard_item(interview_qualification_id){
        console.log('interview_qualification_id: ',interview_qualification_id);
        $.ajax({
            type: "GET",
            url: "/rating/load-qualification-standard-item",
            data: {
                interview_qualification_id: interview_qualification_id
            },
            dataType: "json",
            beforeSend: function(){
                $('.qualification-standard-item-container').html('<div class="text-center py-5 text-slate-500"><i class="fa fa-spinner fa-spin"></i></div>');
            },
            success: function (response) {
                $('.qualification-standard-item-container').html(response.qualificationStandards);
            }
        });
    }

    function saveSetPositionQualification() {
        $("body").on('click', '#saveSetPositionQualification', function () {
            // Get form values
            let positionSetInterQualification = $('#positionSetInterQualification_mdl').val();
            let SG_SetInterQualification = $('#SG_SetInterQualification_mdl').val();
            let positionqualification_id = $('#positionqualification_id').val();


            // Disable button and show loading state
            const $saveBtn = $(this);
            $saveBtn.prop('disabled', true)
                .html('<i class="fa fa-spinner fa-spin mr-2"></i>Saving...');

            if (filterPositionQualificationInput($(this))) {
                // Validate if qualifications are selected


                $.ajax({
                    type: "POST",
                    url: "/rating/save-set-qualification",
                    data: {
                        _token: _token,
                        positionSetInterQualification: positionSetInterQualification,
                        SG_SetInterQualification: SG_SetInterQualification,
                        positionqualification_id: positionqualification_id,
                        selectedInterviewQualification: selectedInterviewQualification
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response.success) {
                            close_modal("#setInterviewQualification_modal");
                            loadPositionQualification();
                            __notif_show(1, 'Successfully set interview qualification');

                            $('#interviewQualification_loadDiv').empty();
                            selectedInterviewQualification = [];
                            $('#positionSetInterQualification_mdl').val('').trigger('change');
                            $('#SG_SetInterQualification_mdl').val('').trigger('change');
                            $('#positionqualification_id').val(0);
                        } else {
                            __notif_show(0, response.message || 'Error saving qualifications');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Save Error:', error);
                        __notif_show(0, 'Error saving qualifications. Please try again.');
                    },
                    complete: function() {
                        // Reset button state
                        $saveBtn.prop('disabled', false).html('Save');
                    }
                });
            }
        });
    }

    function saveAddQualification(){
        $("body").on('click', '#saveQualification', function () {
            let qualification_name = $('#qualification_name');
            let description = $('#qualification_description').val();
            let positionInterviewQualification_id = $('#positionInterviewQualification_id').val();

            if(qualification_name.val() === ''){
                qualification_name.css('border-color', 'red');
                __notif_show(-3, 'Qualification name and description are required');
                return;
            }else{
                qualification_name.css('border-color', '');
                $.ajax({
                    type: "POST",
                    url: "/rating/save-add-qualification",
                    data: {
                        _token: _token,
                        qualification_name: qualification_name.val(),
                        description: description,
                        positionInterviewQualification_id: positionInterviewQualification_id
                    },
                    dataType: "json",
                    success: function (response) {
                        if(response.success){
                            
                            $('.qualification-standard-item-container').html(`
                                <div class="h-full flex items-center justify-center">
                                    <div class="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            class="w-16 h-16 mx-auto mb-4 text-slate-300" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" 
                                                stroke-linejoin="round" 
                                                stroke-width="1.5" 
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                        </svg>
                                        <div class="text-slate-500">Standards will be loaded here</div>
                                    </div>
                                </div>
                            `);

                            $('#qualification_name').val('');
                            $('#qualification_description').val('');
                            $('#positionInterviewQualification_id').val(0);
                            interview_qualification_id = 0;
                            close_modal("#addQualification_modal");
                            loadPositionInterviewQualification();
                            __notif_show(1, 'Successfully add qualification');
                        }else{
                            __notif_show(0, response.message || 'Error adding qualification');
                        }
                    }
                });
            }
        });
    }

    function deleteFunction(){
        $("body").on('click', '.delete_Interview_qualification_setup', function () {
            var positionQualification_id = $(this).data('position-qualification-id');

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: "/rating/delete-set-qualification",
                        data: {
                            _token: _token,
                            positionqualification_id: positionQualification_id,
                        },
                        dataType: "json",
                        success: function (response) {
                            if(response.success){
                                loadPositionQualification();
                                __notif_show(1, 'Successfully delete position qualification');
                                close_modal("#setInterviewQualification_modal");
                            }
                        }
                    });
                }
            });
        });

        $("body").on('click', '.delete_Interview_qualification', function (e) {
            e.stopPropagation();
            var interview_qualification_id = $(this).data('interview-qualification-id');
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: "/rating/delete-interview-qualification",
                        data: {
                            _token: _token,
                            interview_qualification_id: interview_qualification_id,
                        },
                        dataType: "json",
                        success: function (response) {
                            if(response.success){
                                loadPositionInterviewQualification();
                                __notif_show(1, 'Successfully delete Interview Qualification');
                            }                       }
                    });
                }
            });
        });

    }

    // Improved input validation
    function filterPositionQualificationInput(saveBtn) {
        const positionSetInterQualification = $('#positionSetInterQualification_mdl');
        const SG_SetInterQualification = $('#SG_SetInterQualification_mdl');
        let isValid = true;
        let errorMessages = [];

        console.log(positionSetInterQualification.val());
        console.log(SG_SetInterQualification.val());
        
        // Validate Position
        if (!positionSetInterQualification.val()) {
            positionSetInterQualification.select2({
                theme: "error",
                placeholder: "Please Select position",
            });
            errorMessages.push("Position is required");
            isValid = false;
            saveBtn.prop('disabled', false).html('Save');
        } else {
            positionSetInterQualification.select2({
                placeholder: "Select Position",
                closeOnSelect: true,
                allowClear: true
            });
        }
        // Validate Salary Grade
        if (!SG_SetInterQualification.val()) {
            SG_SetInterQualification.select2({
                theme: "error",
                placeholder: "Please Select SG",
            });
            errorMessages.push("Salary Grade is required");
            isValid = false;
        } else {
            SG_SetInterQualification.select2({
                placeholder: "Select Salary Grade",
                closeOnSelect: true,
                allowClear: true
            });
        }

        if (selectedInterviewQualification.length === 0) {
            // Update the header text and add warning message
            $('#selectQualificationStandards').text('Please Select Qualification').addClass('text-danger').removeClass('text-slate-600 dark:text-slate-300');
            errorMessages.push("Please select at least one qualification");
            isValid = false;
            saveBtn.prop('disabled', false).html('Save');
        }

        // Show error messages if any
        if (!isValid && errorMessages.length > 0) {
            __notif_show(-3, errorMessages.join('<br>'));
        }

        return isValid;
    }

    function loadInterviewQualification() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: "/rating/load-interview-qualification",
                dataType: "json",
                success: function (response) {
                    $("#interviewQualification_loadDiv").html(`
                        <div class="p-3 border-b border-slate-200/60 dark:border-darkmode-400">
                            <span id="selectQualificationStandards" class="italic font-medium text-slate-600 dark:text-slate-300">
                                Select Qualification Standards
                            </span>

                        </div>
                        ${response.loadInterviewQualification}
                    `);

                    $("#interviewQualification_loadDiv").addClass('border border-slate-200/60 dark:border-darkmode-400');

                    if (selectedInterviewQualification.length > 0) {
                        $('#saveSetPositionQualification').prop('disabled', false);

                        // Process each qualification
                        const promises = selectedInterviewQualification.map(qual => {
                            const qualElement = $('#interviewQualification_loadDiv')
                                .find(`.loaded_InterviewQualification[data-interview-qualification-id="${qual.interQualificationID}"]`);

                            if (qualElement.length) {
                                // Mark qualification as selected
                                qualElement.addClass('border-primary text-primary').removeClass('border-slate-200');
                                qualElement.find('.circle_check').html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>');

                                // Always expand if it has border-primary
                                qualElement.addClass('expanded');
                                
                                // Load standards container regardless of whether there are standards
                                return loadQualificationStandard(qual.interQualificationID, qualElement)
                                    .then(() => {
                                        // If there are standards, check them
                                        if (qual.qualificationStandard && qual.qualificationStandard.length > 0) {
                                            qual.qualificationStandard.forEach(standard => {
                                                setTimeout(() => {
                                                    const standardCheckbox = qualElement
                                                        .next('.qualification-standard-container')
                                                        .find(`.standard-checkbox[value="${standard.qualStandard_id}"]`);

                                                    if (standardCheckbox.length) {
                                                        standardCheckbox.prop('checked', true);
                                                        const container = standardCheckbox.closest('label');
                                                        container.addClass('border-primary bg-primary-50');
                                                        container.find('.check-mark').removeClass('hidden');
                                                    }
                                                }, 100);
                                            });
                                        }
                                    });
                            }
                            return Promise.resolve();
                        });

                        // Wait for all standards to be loaded and checked
                        Promise.all(promises).then(() => resolve());
                    } else {
                        $('#saveSetPositionQualification').prop('disabled', true);
                        resolve();
                    }
                },
                error: function(error) {
                    console.error('Error loading qualifications:', error);
                    reject(error);
                }
            });
        });
    }

    function saveSetStandardQualification(){
        $("body").on('click', '#saveSetStandardQualification', function () {
            $.ajax({
                type: "POST",
                url: "/rating/save-set-standard-qualification",
                data: {
                    _token: _token,
                    selectedInterviewQualification: selectedInterviewQualification,
                },
                dataType: "json",
                success: function (response) {
                    if(response.success){
                        close_modal("#setStandardQualification_modal");
                        loadPositionQualification();
                        __notif_show(1, 'Successfully set standard qualification');
                    }
                }
            });

        });
    }

    function loadQualificationStandard(interview_qualification_id, parentElement) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: "/rating/load-qualification-standard",
                data: {
                    _token: _token,
                    interview_qualification_id: interview_qualification_id
                },
                dataType: "json",
                success: function(response) {
                    // Remove any existing container
                    parentElement.next('.qualification-standard-container').remove();

                    // Add new container
                    parentElement.after(`
                        <div class="qualification-standard-container p-4 bg-gray-50 border border-gray-200">
                            <div class="standards-wrapper">
                                ${response.loadQualificationStandard}
                            </div>
                        </div>
                    `);

                    // Initialize checkbox handlers
                    initializeStandardCheckboxes();
                    resolve();
                },
                error: function(error) {
                    console.error('Error loading standards:', error);
                    reject(error);
                }
            });
        });
    }

    function initializeStandardCheckboxes() {
        $('.standard-checkbox').off('change').on('change', function() {
            const container = $(this).closest('label');
            if (this.checked) {
                container.addClass('border-primary bg-primary-50');
                container.find('.check-mark').removeClass('hidden');
            } else {
                container.removeClass('border-primary bg-primary-50');
                container.find('.check-mark').addClass('hidden');
            }
        });
    }

    // Add this to your edit handler
    function preSelectStandards(qualificationIndex) {
        if (qualificationIndex !== -1) {
            const standards = selectedInterviewQualification[qualificationIndex].qualificationStandard;
            standards.forEach(standard => {
                $(`.standard-checkbox[value="${standard.qualStandard_id}"]`)
                    .prop('checked', true)
                    .trigger('click');
            });
        }
    }

    function paginationQualificationPage(){
        $('body').on('change', '.perPage_selectQualificationPage', function(){
            perPage = $(this).val();
            loadPositionQualification();
        });
    }

    function updateClearanceListPaginationLinks(currentPage, lastPage, paginationId, paginationSummaryId) {

        const paginationLinks = paginationId;
        paginationLinks.empty(); // Clear the pagination links container
    
        // const currentPage = data.current_page;
        // const lastPage = data.last_page;
    
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

}



