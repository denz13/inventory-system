var  _token = $('meta[name="csrf-token"]').attr('content');

var filterTimeout;
var searchFilter = "";
var search_setupFilter = "";
var currentPage = 1;
var totalPages = 1;
var perPage = 10;
var page = 1;
var per_page = 1;
var search_positionTag_value = '';

$(document).ready(function () {
    bpath = __basepath + "/";
    clickHandler_function();
    submitHandler_function()
    searchEngine();
    select2_setup();
    view_position_competency();
    removeSetupCompetency();
    ClickhandlerOfCompetencyTagingPosition();
    setupScrollListener();
    competencyTablistContainer();
    CompetencyType_function();
    loadCompetencies_tabList();

});
{

    function loadCompetencies_tabList() {
        // Get the active tab
        const activeTab = $('.compentency_tab.active');
        if (!activeTab.length) return;
        
        const tabId = activeTab.closest('li').attr('id');
        handleTabSwitch(tabId);
    }

    function competencyTablistContainer() {
        $("body").on('click', '.compentency_tab', function (e) {
            e.preventDefault();

            $('.positionQualification').removeClass('active');
            $(this).addClass('active');

            const tabId = $(this).closest('li').attr('id');
            handleTabSwitch(tabId);
        });
    }

    // New shared function to handle tab switching logic
    function handleTabSwitch(tabId) {
        switch(tabId) {
            case 'compretency_type-tab':
                $('.searchComp').prop('disabled', true).val('');
                $('#addCompetency').hide();
                $('#show_dataCount').hide();
                searchFilter = "";
                page = 1;
                
                Promise.resolve()
                    .then(() => {
                        showLoadingState('#loadCompetencyType_container');
                        return loadCompetencyType_page();
                    })
                    .then(() => {
                        loadCompetenciesType_index();
                    })
                    .catch(error => {
                        console.error('Error loading competencies:', error);
                        __notif_show(0, 'Error loading competencies');
                    });
                break;

            case 'competency-tab':
                searchFilter = "";
                // $('#addCompetency').show().text('Add New Competency');
                $('#addCompetency').hide();
                $('#show_dataCount').show();
                $('.searchComp').prop('disabled', false).val('');
                page = 1;
                loadCompetencies_index();
                break;

            case 'competency_qualification-tab':
                searchFilter = "";
                $('.searchComp').prop('disabled', false).val('');
                $('#addCompetency').show().text('Setup Competency');
                $('#show_dataCount').show();
                page = 1;
                loadQualifications_index();
                break;
            
            default:
                $('.searchComp').prop('disabled', true).val('');
                $('#addCompetency').hide();
                $('#show_dataCount').hide();
                page = 1;
                
                Promise.resolve()
                    .then(() => {
                        showLoadingState('#loadCompetencyType_container');
                        return loadCompetencyType_page();
                    })
                    .then(() => {
                        loadCompetenciesType_index();
                    })
                    .catch(error => {
                        console.error('Error loading competencies:', error);
                        __notif_show(0, 'Error loading competencies');
                    });
                break;
        }
    }

    function loadCompetencyType_page() {
        return new Promise((resolve) => {
            $("#rsp_tbl_div").html(`
                <div class="intro-y col-span-12">
                    <div class="intro-y grid grid-cols-11 gap-5 mt-5">
                        <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
                            <div class="box p-5 rounded-md">
                                <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                    <div class="font-medium text-base truncate">Competency Types</div>
                                    <a id="addCompetencyType_btn" href="javascript:;" class="flex items-center ml-auto text-primary">
                                        <i data-lucide="edit" class="w-4 h-4 mr-2"></i>
                                        Add Competency Type
                                    </a>
                                </div>
                            </div>
                            <div class="mt-5 loadCompetencyType_container scrollbar-hidden" style="overflow-y: auto; height: calc(100vh - 350px);">
                            </div>
                        </div>
                        <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
                            <div class="box p-5 rounded-md h-full">
                                <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                    <div class="font-medium text-base truncate">Competencies</div>
                                    <a href="javascript:;" id="addCompetency_btn" class="flex items-center ml-auto text-primary"> 
                                        <i class="fa-solid fa-plus mr-2 h-3 w-3"></i> 
                                        Add Competency
                                    </a>
                                </div>
                                <div class="p-5 competency-item-container overflow-y-auto h-full">
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
                                            <div class="text-slate-500">Competencies will be loaded here</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            resolve();
        });
    }
    
    //function for loading state
    function showLoadingState(container_id) {
        $(container_id).html(`
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
    
    var selectedCompetencies = [];
    var competencyTypeId = 0;
    var databaseCompetencies = [];
    function CompetencyType_function(){
        
        $("body").on('click', '#addCompetencyType_btn', function() {
            $('#compTypeID').val(0);
            $('#competency_type').val('');
            $('#compType_desc').val('');
            open_modal("#addCompetencyTypeModal");
        });
    
        $('#addCompetencyTypeForm_mdl').submit(function (e) {
            e.preventDefault();
    

            if($('#competency_type').val() === ''){
                $('#competency_type').css('border-color', 'red');
                __notif_show(-3, 'Competency Type is required');
                return;
            }

            const fd = $(this);
            $.ajax({
                type: "POST",
                url: bpath +"rsp-competency/add-competency-type",
                data: fd.serialize(),
                dataType: "json",
                beforeSend: function(){
                    $('#saveCompetencyTypeBtn').html('<i class="fa-solid fa-spinner fa-spin mr-2"></i><span class="fa-fade">Saving</span>');
                },
                success: function (response) {
                    if (response.status === 200) {
                        __notif_show(1, response.msg);
                        loadCompetenciesType_index();

                        close_modal("#addCompetencyTypeModal");
                        clearInputs();

                        $('.competency-item-container').html(`<div class="h-full flex items-center justify-center">
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
                                            <div class="text-slate-500">Competencies will be loaded here</div>
                                        </div>
                                    </div>`)
                    } else {
                        __notif_show(-3, response.msg);
                    }
                    $('#saveCompetencyTypeBtn').html('Save');
                },
                error: function (xhr, status, error) {
                    __notif_show(-1, 'An error occurred: ' + error);
                    $('#saveCompetencyTypeBtn').html('Save');
                }
            });
            
        });
    
        $("body").on('click', '.edit_competency_type', function(e) {
            e.stopPropagation();
            competencyTypeId = $(this).data('competency-type-id');
            let competencyTypeName = $(this).data('competency-type-name');
            let competencyTypeDesc = $(this).data('competency-type-description');
            
            $('#compTypeID').val(competencyTypeId);
            $('#competency_type').val(competencyTypeName);
            $('#compType_desc').val(competencyTypeDesc);
            
            open_modal("#addCompetencyTypeModal");
        });
    
        $("body").on('click', '.delete_competency_type', function(e) {
            e.stopPropagation();
            competencyTypeId = $(this).data('competency-type-id');
            
    
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
                        url: bpath + "rsp-competency/delete-competency-type",
                        data: {
                            _token: _token,
                            competency_type_id: competencyTypeId
                        },
                        dataType: "json",
                        success: function(response) {
                            if (response.status === 200) {
                                
                                Swal.fire({
                                    title: 'Deleted!',
                                    text: response.message,
                                    type: 'success',
                                    timer: 1000,
                                    showConfirmButton: true,
                                    timerProgressBar: true,
                                });
                                loadCompetenciesType_index();
                            } else {
                                Swal.fire(
                                    'Error!',
                                    response.message,
                                    'error'
                                );
                            }
                        },
                        error: function(xhr) {
                            Swal.fire(
                                'Error!',
                                'An error occurred while deleting',
                                'error'
                            );
                        }
                    });
                }
            });
        });

        $('body').on('input', '#competency_type', function () {
            $(this).css('border-color', '');
        });

        $('body').on('click', '#close_addCompetencyTypeModal', function () {
            $('#competency_type').css('border-color', '');
            clearInputs();
        });

        $('body').on('click', '.competency_type_item', function () {
            selectedCompetencies = [];
        
            const compTypeCompetencies = $(this).attr('data-comp-type-competency');
        
            try {
                // Parse the competencies data
                const selecteCompetencies = JSON.parse(compTypeCompetencies);
        
                // Map the competencies with their standards
                selectedCompetencies = selecteCompetencies.map(qual => ({
                    competency_id: qual.competencyID,
                    competency_name: qual.comp_name,
                }));
        
                console.log('competency_type_item: ', selectedCompetencies);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                console.error("Raw Data:", compTypeCompetencies);
                selectedCompetencies = [];
            }
        
            // Save initial competencies state for reset
            databaseCompetencies = [...selectedCompetencies];
        
            // Update UI styles
            $('.competency_type_item .box').removeClass('bg-primary/10 border-primary');
            $(this).find('.box').addClass('bg-primary/10 border-primary');
        
            competencyTypeId = $(this).data('competency-type-id');
            loadCompTypeCompetencies(competencyTypeId);
        });
        

        $('body').on('click', '#closeAddCompTypeCompetency_mdl, #cancelAddCompTypeCompetency_mdl', function () {
            console.log('Before reset: selectedCompetencies:', selectedCompetencies);
            console.log('databaseCompetencies: ', databaseCompetencies);
        
            // Reset selectedCompetencies to databaseCompetencies
            selectedCompetencies = [...databaseCompetencies];
        
            console.log('After reset: selectedCompetencies:', selectedCompetencies);
        
            // Clear and rebuild the selected competencies list
            $('.comp_type_competency_selected_list').empty();
            if (selectedCompetencies.length === 0) {
                $('.comp_type_competency_selected_list').append(`
                    <div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagCompetency">
                        No Competency Selected                
                    </div>`);
                $('#saveAddCompTypeCompetency').prop('disabled', true);
            } else {
                selectedCompetencies.forEach(competency => {
                    $('.comp_type_competency_selected_list').append(`
                        <div data-tag-competency-id="${competency.competency_id}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagCompetencyList">
                            <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                            ${competency.competency_name}
                            <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                                <a href="javascript:;" data-r-competency-id="${competency.competency_id}" class="removeSelectedCompTag">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        icon-name="trash-2"
                                        data-lucide="trash-2"
                                        class="lucide lucide-trash-2 w-4 h-4 mr-1">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </a>
                            </span>
                        </div>`);
                });
                $('#saveAddCompTypeCompetency').prop('disabled', false);
            }
        
            // Reset loaded competencies styles
            $('.loadCompTypeCompetencies_div .loaded_competency')
                .removeClass('bg-primary/10 border-primary text-primary')
                .addClass('bg-slate-100');
        
            $('.loadCompTypeCompetencies_div .loaded_competency .circle_check')
                .html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');
        });
        

        $('body').on('click', '#addCompTypeCompetency_btn', function () {
            open_modal("#addCompTypeCompetency_mdl");
            loadCompetencies_toAddCompTypeCompetency_mdl();
        });

        $("body").on('click', '#addCompetency_btn', function () {
            if (competencyTypeId === 0) {
                __notif_show(-3, 'Please Select Competency Type');
                return;
            }

            $('#competencyTypeID').val(competencyTypeId);
            $('#compID').val(0);

            // Open the modal
            open_modal("#addCompetencyModal");
            
            // // Clear existing competencies before appending
            // $('.comp_type_competency_selected_list').empty();
        
            // // Reset variables for loading
            // competencyPage = 1;
            // competencyLoading = false;
            // competencyHasMorePages = true;
        
            // // Load competencies
            // loadCompetencies_toAddCompTypeCompetency_mdl();
        
            // // Iterate over selectedCompetencies array
            // if(selectedCompetencies.length > 0) {
            //     selectedCompetencies.forEach(function (competency) {
            //         $('.comp_type_competency_selected_list').append(`
            //             <div data-tag-competency-id="${competency.competency_id}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagCompetencyList">
            //                 <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
            //                 ${competency.competency_name}
            //                 <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
            //                     <a href="javascript:;" data-r-competency-id="${competency.competency_id}" class="removeSelectedCompTag">
            //                         <svg xmlns="http://www.w3.org/2000/svg"
            //                             width="24"
            //                             height="24"
            //                             viewBox="0 0 24 24"
            //                             fill="none"
            //                             stroke="currentColor"
            //                             stroke-width="2"
            //                             stroke-linecap="round"
            //                             stroke-linejoin="round"
            //                             icon-name="trash-2"
            //                             data-lucide="trash-2"
            //                             class="lucide lucide-trash-2 w-4 h-4 mr-1">
            //                             <polyline points="3 6 5 6 21 6"></polyline>
            //                             <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            //                             <line x1="10" y1="11" x2="10" y2="17"></line>
            //                             <line x1="14" y1="11" x2="14" y2="17"></line>
            //                         </svg>
            //                     </a>
            //                 </span>
            //             </div>
            //         `);
            //     });
            // }

            // if (selectedCompetencies.length === 0) {
            //     // Append the "No Position Selected" message
            //     $('.comp_type_competency_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagCompetency">
            //         No Competency Selected                
            //     </div>`);
            //     $('#saveAddCompTypeCompetency').prop('disabled', true);
            // } else {
            //     $('#saveAddCompTypeCompetency').prop('disabled', false);
            // }
            
        

            // $('#compTypeSelected_count').html(selectedCompetencies.length);
        });

        let debounceTimeout;
        $('.loadCompTypeCompetencies_div').on('scroll', function () {
            clearTimeout(debounceTimeout);
            const element = $(this);
    
            debounceTimeout = setTimeout(function () {
                if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight - 100) {
    
                    if(!competencyLoading && competencyHasMorePages){
                        loadCompetencies_toAddCompTypeCompetency_mdl();
                    }
                }
            }, 200);
        });

        $("body").on('click', '.loaded_competency', function () {
            // Get the current item
            const _this = $(this);
            var icon = _this.find('.circle_check');
            let competencyId = _this.data('competency-id');
            let competencyName = _this.data('competency-name');
            
            // Check if this item is already selected
            if (_this.hasClass('bg-primary/10')) {
                // Remove highlight and icon styles
                _this.removeClass('bg-primary/10 border-primary text-primary').addClass('bg-slate-100');
                icon.html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');

                $('.comp_type_competency_selected_list').find('.tagCompetencyList[data-tag-competency-id="'+competencyId+'"]').remove();
        
                // Remove from the selectedCompetencies array
                selectedCompetencies = selectedCompetencies.filter(comp => comp.competency_id !== competencyId);
            } else {
                // Add highlight and icon styles
                _this.addClass('bg-primary/10 border-primary text-primary').removeClass('bg-slate-100');
                icon.html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>');
        
                $('.comp_type_competency_selected_list').find('.noTagCompetency').remove();
                // Add to the selectedCompetencies array
                selectedCompetencies.push({
                    competency_id: competencyId,
                    competency_name: competencyName
                });

                 $('.comp_type_competency_selected_list').append(`<div data-tag-competency-id="${competencyId}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagCompetencyList">
                    <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                    ${competencyName}
                    <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                        <a href="javascript:;" data-r-competency-id="${competencyId}" class="removeSelectedCompTag">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                icon-name="trash-2"
                                data-lucide="trash-2"
                                class="lucide lucide-trash-2 w-4 h-4 mr-1">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </a>
                    </span>
                </div>`);

            }

            $('#compTypeSelected_count').text(selectedCompetencies.length);

            // Check if there are no selected positions
            if (selectedCompetencies.length === 0) {
                // Append the "No Position Selected" message
                $('.comp_type_competency_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagCompetency">
                    
                    No Competency Selected                
                </div>`);
                $('#saveAddCompTypeCompetency').prop('disabled', true);
            } else {
                $('#saveAddCompTypeCompetency').prop('disabled', false);
            }

        });

        $("body").on('click', '#saveAddCompTypeCompetency', function () {
            $.ajax({
                type: "POST",
                url: bpath + "rsp-competency/add-comp-type-competency",
                data: {
                    _token: _token,
                    competency_type_id: competencyTypeId,
                    competencies: selectedCompetencies
                },
                dataType: "json",
                success: function (response) {
                    if (response.status === 200) {
                        __notif_show(1, response.message);
                        loadCompTypeCompetencies(competencyTypeId);
                        close_modal("#addCompTypeCompetency_mdl");
                        clearInputs();
                         // Sync databaseCompetencies with selectedCompetencies
                            databaseCompetencies = [...selectedCompetencies];
                            
                            // Reset selectedCompetencies from databaseCompetencies
                            selectedCompetencies = [...databaseCompetencies];
                    } else {
                        __notif_show(-3, response.message);
                    }
                }
            });
        });

        $("body").on('click', '.delete_comp_type_competency', function () {

            let comp_type_competencyID = $(this).data('comp-type-competency-id');
            let comp_ID = $(this).data('competency-id');
            
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
                        url: bpath + "rsp-competency/delete-comp-type-competency",
                        data: {
                            _token: _token,
                            comp_ID: comp_ID
                        },
                        dataType: "json",
                        success: function(response) {
                            if (response.status === 200) {

                                Swal.fire({
                                    title: 'Deleted!',
                                    text: response.message,
                                    type: 'success',
                                    timer: 1000,
                                    showConfirmButton: true,
                                    timerProgressBar: true,
                                });
                        
                                // selectedCompetencies = selectedCompetencies.filter(function(competency) {
                                //     return competency.competency_id !== comp_ID;
                                // });

                                // databaseCompetencies = selectedCompetencies;
                                loadCompTypeCompetencies(competencyTypeId);
                            } else {
                                Swal.fire(
                                    'Error!',
                                    response.message,
                                    'error'
                                );
                            }
                        },
                        error: function(xhr) {
                            Swal.fire(
                                'Error!',
                                'An error occurred while deleting',
                                'error'
                            );
                        }
                    });
                }
            });

        });

        $("body").on('click', '.removeSelectedCompTag', function () {
            var selecetedCompetencyID = $(this).data('r-competency-id');
            
            // Remove the item from the selected list
            $(`.comp_type_competency_selected_list div[data-tag-competency-id="${selecetedCompetencyID}"]`).remove();
            
            // Find the index of the item in selectedCompetencies
            var existingIndex = selectedCompetencies.findIndex(function (item) {
                return item.competency_id === selecetedCompetencyID;
            });
        
            if (existingIndex !== -1) {
                // Remove the item from the array
                selectedCompetencies.splice(existingIndex, 1);
        
                // Remove the styles and reset the icon
                var loaded_competency = $(`.loaded_competency[data-competency-id="${selecetedCompetencyID}"]`);
                var loaded_icon = loaded_competency.find('.circle_check');
        
                loaded_competency.removeClass('bg-primary/10 border-primary text-primary');
                loaded_icon.html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');
            }
        
            // Update the count in #compTypeSelected_count
            $('#compTypeSelected_count').text(selectedCompetencies.length);
        
            // Check if there are no selected positions
            if (selectedCompetencies.length === 0) {
                // Append the "No Position Selected" message
                $('.comp_type_competency_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagCompetency">
                    
                    No Competency Selected                
                </div>`);
                $('#saveAddCompTypeCompetency').prop('disabled', true);
            } else {
                $('#saveAddCompTypeCompetency').prop('disabled', false);
            }
        });
    }
    
    function loadCompetenciesType_index(){
        $.ajax({
            type: "GET",
            url: bpath +"rsp-competency/load-competency-types",
            data: {
                _token: _token,
                page:page,
                searchFilter: searchFilter,
                perPage:perPage,
            },
            beforeSend: function(){
    
                showLoadingState('.loadCompetencyType_container');
                        
            },
            dataType: "json",
            success: function (response) {
    
                $('.loadCompetencyType_container').html(response.loadCompetencyTypes);
                totalPages = response.last_page;
                 currentPage = response.current_page;
    
            }
        });
    }

    function loadCompTypeCompetencies(competencyTypeId){
        $.ajax({
            type: "GET",
            url: bpath +"rsp-competency/load-comp-type-competencies",
            data: {
                competency_type_id: competencyTypeId
            },
            beforeSend: function(){
                $('.competency-item-container').html(`<div class="h-full flex items-center justify-center">
                    <div class="text-center">
                            <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-12 h-12">
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
                            <div class="text-slate-500 fa fa-beat">Finding Competency ...</div>
                        
                        </div>
                    </div>
                `);
            },
            dataType: "json",
            success: function (response) {
                $('.competency-item-container').html(response.loadCompetencies);
            }
        });             
    }

        let competencyLoading = false;
        let competencyHasMorePages = true;
        let competencyPage = 1;

    function loadCompetencies_toAddCompTypeCompetency_mdl() {
        if (competencyLoading || !competencyHasMorePages) return;
    
        competencyLoading = true; // Set loading flag
        var searchCompetencies = $('.search_comp_type_competency').val(); // Get search input
    
        $.ajax({
            type: "GET",
            url: bpath + "rsp-competency/load-selection-of-competencies",
            data: {
                page: competencyPage,
                searchFilter: searchCompetencies,
            },
            beforeSend: function () {
                // Display loading message
                const noMoreMessage = `
                    <div class="flex items-center justify-center text-center text-slate-500 py-4 no-more-message">
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
                    </div>`;
    
                if (competencyPage === 1) {
                    $('.loadCompTypeCompetencies_div').html(noMoreMessage); // Replace content
                } else {
                    $('.loadCompTypeCompetencies_div').append(noMoreMessage); // Append message
                }
            },
            success: function (response) {
                // Remove loading message
                $('.loadCompTypeCompetencies_div .no-more-message').remove();
    
                if (competencyPage === 1) {
                    $('.loadCompTypeCompetencies_div').html(response.loadSelectionCompetencies); // Load first page
                } else {
                    $('.loadCompTypeCompetencies_div').append(response.loadSelectionCompetencies); // Append subsequent pages
                }
    
                competencyHasMorePages = response.has_more; // Update pagination flag
                if (competencyHasMorePages) competencyPage++;
                competencyLoading = false; // Reset loading flag
    
                console.log('selectedCompetencies: '+ selectedCompetencies);
                
                // Highlight previously selected competencies
                if (selectedCompetencies.length > 0) {
                    selectedCompetencies.forEach(comp => {
                        var compTypeItem = $(`.loadCompTypeCompetencies_div .loaded_competency[data-competency-id="${comp.competency_id}"]`);
                        if (compTypeItem.length > 0) {
                            compTypeItem
                                .addClass('bg-primary/10 border-primary text-primary') // Apply active styles
                                .removeClass('bg-slate-100');
                            compTypeItem.find('.circle_check')
                                .html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>'); // Update icon
                        }
                    });
                }
            },
            error: function () {
                $('.loadCompTypeCompetencies_div').find('.no-more-message').remove();
                competencyLoading = false; // Reset loading flag on error
            }
        });
    }
        
        

    // Search handler with debounce
    $('body').on('input', '.search_comp_type_competency', function() {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            competencyPage = 1;
            competencyHasMorePages = true;
            $('.loadCompTypeCompetencies_div').find('.text-slate-500').remove(); // Remove "No more data" message
            loadCompetencies_toAddCompTypeCompetency_mdl();
        }, 500);
    });

    // Scroll handler with debounce
    $('.loadCompTypeCompetencies_div').on('scroll', function() {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
            const element = $(this);
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight - 100) {
                if (competencyHasMorePages && !competencyLoading) {
                    loadCompetencies_toAddCompTypeCompetency_mdl();
                }
            }
        }, 200);
    });
    
    function select2_setup() {
        $('#postion_setup_mdl').select2({
            placeholder: "Select Position",
            closeOnSelect: true,
            allowClear: true
        });
    
        $('#SG_setup_mdl').select2({
            placeholder: "Select Salary Grade",
            closeOnSelect: true,
            allowClear: true
        });
    }
    
    var compID_delete;
    var _this_mismo_delete;
    var compCode_delete;
    var removeComp_id, removeComp_name;
    // Remove Competency Data Handler
    function removeSetupCompetency() {
    
        $("body").on('click', '.deleteCompetency', function () {
    
            // console.log('deleteCompetency');
            compID_delete = $(this).data('comp-id');
            compCode_delete = 'competency-delete'; // Corrected assignment
            _this_mismo_delete = $(this);
            open_modal("#delete-rsp-modal");
    
        });
    
    
        $("body").on('click', '.removequalificationSetup', function (e) {
            e.stopPropagation(); 
    
            console.log('removequalificationSetup');
            compID_delete = $(this).data('position-id');
            compCode_delete = 'removequalificationSetup-delete'; // Corrected assignment
            _this_mismo_delete = $(this); 
            open_modal("#delete-rsp-modal");
    
        });
    
        var _this_removePositionCompetencySetup
        $("body").on('click', '.removePositionCompetencySetup', function () {
    
            removeComp_id = $(this).data('compid');
            removeComp_name = $(this).data('compname');
            
    
            compID_delete = $(this).data('setup-id');
            compCode_delete = 'removePositionCompetencySetup-delete'; // Corrected assignment
            _this_mismo_delete = $(this); 
            open_modal("#delete-rsp-modal");
    
        });
    
        $("body").on('click', '#delete_rsp_Data', function (e) {
            e.preventDefault();
            
            $.ajax({
                type: "POST",
                url: bpath + "rsp-competency/delete-competency",
                data: {_token: _token, _compID: compID_delete, compCode_delete: compCode_delete},
                dataType: "json",
                beforeSend: function() {
                    _this_mismo_delete.html('<span class="fa-fade">Removing...</span>');
                },
                success: function (response) {
                    close_modal("#delete-rsp-modal"); 
                    if (response.status === 200) {
                        if (compCode_delete.trim() === 'competency-delete') {
                            loadCompetencies_index();
                            clearInputs();  
                        } else if (compCode_delete.trim() === 'removequalificationSetup-delete') {
                            loadQualifications_index();
                        } else if (compCode_delete.trim() === 'removePositionCompetencySetup-delete') {
                            var arithmetic_opereation = '-';
                            var competencyCount = parseInt(0);
        
                            findSelected_row(arithmetic_opereation, competencyCount);
        
                            if (Array.isArray(compIdsArray) && Array.isArray(compNameArray)) {
                                removeComp_id = removeComp_id.toString();
        
                                compIdsArray = compIdsArray.filter(function(item) {
                                    return item.toString() !== removeComp_id;
                                });
        
                                compNameArray = compNameArray.filter(function(item) {
                                    return item !== removeComp_name;
                                });
        
                            } else {
                                console.error("compIdsArray or compNameArray is not an array.");
                            }
        
                            var shown_tr = $('.qualification_row.selected-row');
                            
                            shown_tr.data('comp-names', compNameArray.join(','))
                                    .data('comp-ids', compIdsArray.join(','));
    
                                      // Update the DOM attributes directly
                            shown_tr.attr('data-comp-names', compNameArray.join(','))
                            .attr('data-comp-ids', compIdsArray.join(','));
                            
                            defaultCompIdsArray   = [];
                            defaultCompNameArray  = [];
    
                            defaultCompIdsArray = compIdsArray;
                            defaultCompNameArray = compNameArray;
                            fetch_position_competency();
                        }
                        __notif_show(1, response.msg);
                                        
                    } else {
                        __notif_show(-3, response.msg);
                    }
                    _this_mismo_delete.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete');
                }
            });
        });
    }
    
    function findSelected_row(arithmetic_operation, competencyCount) {
        var selected_row = $('.qualification_row.selected-row.shown');
        var competenciesCount_td_a = selected_row.find('td a.competenciesCount');
    
        var competenciesCount = parseInt(competenciesCount_td_a.text().trim());
    
        var newCompetenciesCount;
        if(competencyCount == 0) {
            if (arithmetic_operation === '+') {
                newCompetenciesCount = competenciesCount + 1;
            } else if (arithmetic_operation === '-') {
                newCompetenciesCount = competenciesCount - 1;
            } else if (arithmetic_operation === '*') {
                newCompetenciesCount = competenciesCount * 1; // Usually you would multiply by another value
            } else if (arithmetic_operation === '/') {
                newCompetenciesCount = competenciesCount / 1; // Usually you would divide by another value
            }
        }else{
            newCompetenciesCount = competencyCount;
        }
       
    
        competenciesCount_td_a.text(newCompetenciesCount);
    }
    
    
    
    var isHandlingChange = false;
    function clickHandler_function(){

    
        $("body").on('click', '#addCompetency', function () {
            $('#compID').val(0);
            clearInputs();
            var df = $('.compList_div').html('');
    
            // if($(this).text().trim() == 'Add New Competency'){
            //     open_modal("#addCompetencyModal");
            // }else 
            if($(this).text().trim() == 'Setup Competency'){
    
                $('#setupTitle').text('Setup Competency');
                comp_setup = 'loadQualifications';
                open_modal("#setupCompetencyModal");
                load_setupPosition();
                $('#postion_setup_mdl').val('').trigger('change').prop('disabled', false);
            }
            
        });
    
        $("body").on('click', '.editCompetency', function () {

            let compID = $(this).data('comp-id');
            let competency = $(this).data('comp-competency');
            let comp_desc = $(this).data('comp-desc');
            let comp_points = $(this).data('comp-points');
            let comp_type_id = $(this).data('comp-type-id');
            // console.log(compID);
            $('#compID').val(compID);
            $('#competency').val(competency);
            $('#comp_desc').val(comp_desc);
            $('#comp_points').val(comp_points);
            $('#competencyTypeID').val(comp_type_id);
            open_modal("#addCompetencyModal");
        });
    
        $("body").on('click', '#cancelDeleteModal', function () {
            clearInputs();
            _this_mismo_delete.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete');
        });
    
        $("body").on('click','#cancelDeleteModal', function () {
            clearInputs();
            _this_mismo_delete.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete');
        });
    
        $("#postion_setup_mdl").change(function (e) { 
            e.preventDefault();
        
            if (isHandlingChange) return;
        
            var sg_idValue = $('#SG_setup_mdl').val();

            var _thisVal = $(this).val();
            if (_thisVal !== '' && sg_idValue != '') {
                $('#selectCompFooter_div').removeClass('hidden');
                $('#selectCompHeader_div').removeClass('hidden');
                loadCompetency_mdl(_thisVal, sg_idValue);
            } else {
                check_competency = [];
                check_competencyText = [];
                $('.comp_selected_list').html('');
                $('#countSelected').text('0');
                $('#selectCompFooter_div').addClass('hidden');
                $('#selectCompHeader_div').addClass('hidden');
                $('.compList_div').html('');
                $('.save_setupBtn_div').html('');
                $('.comp_selected_list').html('');
            }
        });

        $("#SG_setup_mdl").change(function (e) { 
            e.preventDefault();
        
            if (isHandlingChange) return;
        
            var positionValue = $('#postion_setup_mdl').val();
            
            var _thisVal = $(this).val();
            if (_thisVal !== '' && positionValue != '') {
                $('#selectCompFooter_div').removeClass('hidden');
                $('#selectCompHeader_div').removeClass('hidden');
                loadCompetency_mdl(positionValue, _thisVal);
            } else {
                check_competency = [];
                check_competencyText = [];
                $('.comp_selected_list').html('');
                $('#countSelected').text('0');
                $('#selectCompFooter_div').addClass('hidden');
                $('#selectCompHeader_div').addClass('hidden');
                $('.compList_div').html('');
                $('.save_setupBtn_div').html('');
                $('.comp_selected_list').html('');
            }
        });
    
        // Handle click event for .comp_row
        $("body").on('click', '.comp_row', function () {
            console.log('Before adding in .comp_row click event, compNameArray:', compNameArray);
        
            var targetSelector = $(this).attr('target');
            var checkbox = $(targetSelector);
            var compText = $(this).find('.comp_text_div').text();
            
            handleCheckboxToggle(checkbox, compText);
        
            console.log('After handling checkbox toggle, compNameArray:', compNameArray);
        });
        
        $("body").on('click', '#cancel_Modal', function () {
    
            $('#postion_setup_mdl').val('').trigger('change').prop('disabled', false);
            $('.compList_div').html('');
    
            compIdsArray = defaultCompIdsArray.slice();
            compNameArray = defaultCompNameArray.slice();
        
            clearSetupField();
        });
    
        $("body").on('click', '#saveSetupCompetencyBtn', function (e) {
            e.preventDefault();
            saveCompetency();
        });
    
        var typingTimer;
    
        $('body').on('click', '.prev_page', function() {
            // alert('Prev page clicked');
            var positionID = $('#postion_setup_mdl').val();
            // console.log('Position ID:', positionID);
            var sg_idValue = $('#SG_setup_mdl').val();
    
            if (positionID != '') {
                clearTimeout(typingTimer);
                if (per_page > 1) {
                    per_page--;
                    loadCompetency_mdl(positionID, sg_idValue);
                }
            } else {
                __notif_show(-3, 'Please Select Position');
            }
    
        });
    
        $('body').on('click', '.next_page', function(e) {
            e.preventDefault();
            // alert('Next page clicked');
            var positionID = $('#postion_setup_mdl').val();
            var sg_idValue = $('#SG_setup_mdl').val();
            // console.log('Position ID:', positionID);
    
            if (positionID != '') {
                clearTimeout(typingTimer);
                per_page++;
                loadCompetency_mdl(positionID, sg_idValue);
            } else {
                __notif_show(-3, 'Please Select Position');
            }
    
        });    
        
    }
    
    // qualification row click event
    var position_ID;
    var position_name;

    var SalaryG_ID;
    var SalaryG_name;

    var compNameArray;
    var compIdsArray;
    var comp_setup = '';
    var defaultCompIdsArray = [];
    var defaultCompNameArray = [];
    
    function submitHandler_function() {
        $('#addCompetencyForm_mdl').on('submit', function (e) {
            e.preventDefault();
            
            // Reset validation styles
            $('#competency').css('border', '');
            $('.competencyRequire').removeClass('text-danger').addClass('text-slate-500');
    
            if ($('#competency').val() !== '') {
                const fd = $(this);
                $.ajax({
                    type: "POST",
                    url: bpath +"rsp-competency/add-competency",
                    data: fd.serialize(),
                    dataType: "json",
                    beforeSend: function(){
                        $('#saveCompetencyBtn').html('<i class="fa-solid fa-spinner fa-spin mr-2"></i><span class="fa-fade">Saving</span>');
                    },
                    success: function (response) {
                        if (response.status === 200) {
                            __notif_show(1, response.msg);
                            loadCompTypeCompetencies(competencyTypeId);
                            close_modal("#addCompetencyModal");
                            clearInputs();
                            $('#competencyTypeID').val(0);
                            $('#compID').val(0);
                        } else {
                            __notif_show(-3, response.msg);
                        }
                        $('#saveCompetencyBtn').html('Save');
                    },
                    error: function (xhr, status, error) {
                        __notif_show(-1, 'An error occurred: ' + error);
                        $('#saveCompetencyBtn').html('Save');
                    }
                });
            } else {
                $('#competency').css('border', '1px solid red');
                $('.competencyRequire').removeClass('text-slate-500').addClass('text-danger');
            }
        });
    
       
    }
    
    function view_position_competency() {
        // Handler for clicking on a row
        $("body").on('click', '.qualification_row', function () {
            position_ID = $(this).data('position-id');
            position_name = $(this).data('position-name');

            SalaryG_ID = $(this).data('sg-id');
            SalaryG_name = $(this).data('sg-name');
        
            // Clear the arrays
            defaultCompIdsArray = [];
            defaultCompNameArray = [];
            check_competency = [];
            check_competencyText = [];
            compNameArray = [];
            compIdsArray = [];
        
            var tr = $(this);
            var icon = tr.find('.fa-chevron-right');
        
            $('#positionid').val(position_ID);
            $('.position_compRow').remove();
            $('.qualification_row').not(tr).removeClass('shown light-blue-bg selected-row');
            $('.fa-chevron-right').css('transform', 'rotate(0deg)');
        
            if (tr.hasClass('shown')) {   
                tr.removeClass('shown selected-row light-blue-bg');
                icon.css('transform', 'rotate(0deg)');
            } else {
                $('.qualification_row.shown').removeClass('shown selected-row');
        
                var compNames = tr.data('comp-names');
                var compIds = tr.data('comp-ids');
        
                if (typeof compNames === 'string') {
                    compNameArray = compNames.split(',');
                    defaultCompNameArray = compNames.split(',');
                } else {
                    compNameArray = compNames ? [compNames] : [];
                    defaultCompNameArray = compNames ? [compNames] : [];
                }
        
                if (typeof compIds === 'string') {
                    compIdsArray = compIds.split(',');
                    defaultCompIdsArray = compIds.split(',');
                } else {
                    compIdsArray = compIds ? [compIds] : [];
                    defaultCompIdsArray = compIds ? [compIds] : [];
                }
        
                tr.after(positionCompetencyFormat());
                tr.addClass('shown selected-row light-blue-bg');
                icon.css('transform', 'rotate(90deg)');
            }
        });
    
        $('body').on('click', '.add_postComp', function () {
            comp_setup = 'add_postComp';
        
            check_competency = defaultCompIdsArray.slice(); // Copy the array
            check_competencyText = defaultCompNameArray.slice(); // Copy the array

        
            // Generate HTML for the selected list
            var comp_selected_list = '';
            for (var i = 0; i < check_competency.length; i++) {
                comp_selected_list += `<a href="javascript:;" class="flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap">
                                            <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                                            ${check_competencyText[i]}
                                        </a>`;
            }
            
            $('#countSelected').text(check_competency.length);
            $('.comp_selected_list').html(comp_selected_list);
        
            $('#setupTitle').text('Add/Remove Competency');
            $('#postion_setup_mdl').html('<option value="' + position_ID + '">' + position_name + '</option>');
            $('#SG_setup_mdl').html('<option value="' + SalaryG_ID + '">' + SalaryG_name + '</option>');

            $('#postion_setup_mdl').val(position_ID).trigger('change').prop('disabled', true);
            $('#SG_setup_mdl').val(SalaryG_ID).trigger('change').prop('disabled', true);

            open_modal('#setupCompetencyModal');
        });
        
    }
    
    function positionCompetencyFormat() {
    
        fetch_position_competency();
    
        return `<tr class="position_compRow expanded-row bg-lightblue-100">
                    <td colspan="5">
                        <div class="border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1 mt-5 ">
                        
                            <div class="flex justify-end items-center mb-4 pr-4 pl-4">
                                <a data-position-name="${position_name}" href="javascript:;" class="flex items-center whitespace-nowrap mr-5 add_postComp text-primary"
                                    onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                                    <i class="fa-solid fa-plus text-primary w-4 h-4 mr-2"></i>
                                    Add/Remove Competency
                                </a>
                            </div>
    
                            <div class="overflow-x-auto pr-4 pl-4">
                                <table id="positionCompetency_tbl-${position_ID}" class="table table-report -mt-2 table-hover">
                                    <thead>
                                        <th class="text-left whitespace-nowrap">COMPETENCY</th>
                                        <th class="text-left whitespace-nowrap">TYPE</th>
                                        <th class="text-center whitespace-nowrap">Action</th>
                                    </thead>
                                    <tbody>
    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </td>
                </tr>`;
    }
    
    function fetch_position_competency(){
    
        $.ajax({
            url:  bpath +'rsp-competency/fetch-position-competency',
            type: "get",
            data: {
            _token: _token, position_ID:position_ID
            },
            dataType: 'json',
            success: function (response) {
    
            var arithmetic_operation = 'normalize';
            var competenciesCount = parseInt(response.rsp_qualificationsetupCount);
    
            findSelected_row(arithmetic_operation, competenciesCount)
            
                $('#positionCompetency_tbl-'+position_ID+' > tbody' ).html(response.loadPositionCompetency);
                
            }
        });
    
    
    }
    
    function clearSetupField() {
    
        check_competency = [];
        check_competencyText = [];
    
        $('#countSelected').text('0');
        $('#postion_setup_mdl').val('').trigger('change').prop('disabled', false);
        $('#selectCompFooter_div').addClass('hidden');
        $('#selectCompHeader_div').addClass('hidden');
        $('.compList_div').html('');
        $('.save_setupBtn_div').html('');
        $('.comp_selected_list').html('');
    }
    
    function clearInputs(){
        $('#compID').val(0);
        $('#competency').val('');
        $('#comp_desc').val('');
        $('#comp_points').val('');
        $('#compTypeID').val(0);
        $('#competency_type').val('');
        $('#compType_desc').val('');
        compID_delete = '';
    }
    
    function loadCompetencies_index(){
        $.ajax({
            type: "get",
            url: '/rsp-competency/load-competencies',
            data:{_token: _token,
                page:page,
                searchFilter: searchFilter,
                perPage:perPage,
            },
            dataType: 'json',
            beforeSend: function (){
              
                    showLoadingState('#rsp_tbl_div');
                    $('#show_dataCount').html('<span class="fa-fade">Showing Data...</span>');
               
            },
            success: function (response) {
                $('#rsp_tbl_div').html(response.competency_html);
    
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
                $("#show_dataCount").html(showingInfo);
    
                let paginationId = $('#pagination_compentency');
                 let paginationSummaryId = $('#show_dataCount');
    
                updateClearanceListPaginationLinks(response.current_page, response.last_page, paginationId, paginationSummaryId)
    
                var paginationContainer = $(".pagination");            
    
                
            }
        });
    }
    
    function load_setupPosition(){
        $.ajax({
            type: "get",    
            url: bpath + "rsp-competency/load-setup-position",
            dataType: "json",
            success: function (response) {
                
                $('.postion_setup_mdl').append(response);
                
            }
        });
    }
    
    // Qualificationss
    
    function loadQualifications_index(){
        $.ajax({
            type: "get",
            url: '/rsp-competency/load-qualifications',
            data:{_token: _token,
                page:page,
                searchFilter: searchFilter,
                perPage:perPage,
            },
            dataType: 'json',
    
            beforeSend: function (){
                // $('#rsp_tbl_div').html('<div style="display: flex; justify-content: center; align-items: center; height: 100%;">Loading <i class="fa-solid fa-ellipsis fa-fade ml-1 mt-3"></i></div>');
                showLoadingState('#rsp_tbl_div');
                $('#show_dataCount').html('<span class="fa-fade">Showing Data...</span>');
            },
            success: function (response) {
                $('#rsp_tbl_div').html(response.qualifications_html);
    
                 totalPages = response.last_page;
                 currentPage = response.current_page;
                 
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
    
                $("#show_dataCount").html(showingInfo);
    
                let paginationId = $('#pagination_compentency');
                let paginationSummaryId = $('#show_dataCount');
                
                updateClearanceListPaginationLinks(response.current_page, response.last_page, paginationId, paginationSummaryId)
                  
                
            }
        });
    }
    
    var check_competency = [];
    var check_competencyText = [];
    
    function handleCheckboxToggle(checkbox, compText) {
        var wasChecked = checkbox.prop('checked');
        var isChecked = !wasChecked;
    
        checkbox.prop('checked', isChecked);
    
        var checkboxValue = checkbox.val();
    
        if (isChecked) {
            if (!check_competency.includes(checkboxValue)) {
                check_competency.push(checkboxValue);
                check_competencyText.push(compText);
            }
        } else {
            var index = check_competency.indexOf(checkboxValue);
            if (index > -1) {
                check_competency.splice(index, 1);
                check_competencyText.splice(index, 1);
            }
        }
    
        var selected_count = check_competency.length;
    
        var comp_selected_list = '';
        for (var i = 0; i < check_competency.length; i++) {
            comp_selected_list += `<a href="javascript:;" class="flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap">
                                        <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                                        ${check_competencyText[i]}
                                    </a>`;
        }
    
        $('#countSelected').text(selected_count);
        $('.comp_selected_list').html(comp_selected_list);
    }
    
    function saveCompetency() {
        var position = $('#postion_setup_mdl').val();
        var setup_sg_ID = $('#SG_setup_mdl').val();
        if (check_competency.length > 0) {
            $.ajax({
                type: "POST",
                url: bpath + "rsp-competency/save-setup/competency",
                data: {
                    _token: _token,
                    setup_sg_ID: setup_sg_ID,
                    position: position,
                    check_competency: check_competency
                },
                dataType: "json",
                success: function (response) {
                    if (response.status === 'success') {
                        $('#countSelected').text('0');
                        $('.comp_selected_list').html('No competency selected');
                        $('.compList_div').html('');
                        $('#selectCompFooter_div').addClass('hidden');
                        $('#selectCompHeader_div').addClass('hidden');
                        isHandlingChange = true;
                        $('#postion_setup_mdl option:selected').remove();
                        $('#postion_setup_mdl').val('').trigger('change');
                        isHandlingChange = false;
    
                        if (comp_setup == 'loadQualifications') {
                            loadQualifications_index();
                        } else if (comp_setup == 'add_postComp') {
                            
                            defaultCompNameArray = check_competencyText.slice();
                            defaultCompIdsArray = check_competency.slice();
    
                            var shown_tr = $('.qualification_row.selected-row');
                            shown_tr.data('comp-names', defaultCompNameArray.join(','))
                                    .data('comp-ids', defaultCompIdsArray.join(','));
                            
                            fetch_position_competency();
                        }
                        check_competency = [];
                        check_competencyText = [];
                        
                        close_modal('#setupCompetencyModal');
                        __notif_show(1, response.message);
                    }
                },
                error: function (xhr) {
                    console.log('AJAX error');
                    var response = JSON.parse(xhr.responseText);
                    __notif_show(-3, 'An error occurred: ' + response.message);
                }
            });
        } else {
            console.log('No competencies selected');
            __notif_show(-3, 'No competencies selected');
        }
    }
    
    function loadCompetency_mdl(positionID, sg_idValue){
        $.ajax({
            type: "get",
            url: bpath +"rsp-competency/load-competency-mdl",
            data: {_token: _token, 
                    searchCompetency_mdl: search_setupFilter, 
                    positionID: positionID,
                    sg_idValue: sg_idValue,
                    page: per_page},
            dataType: "json",
            beforeSend: function(){
    
                $('.compList_div').html(`<div class="col-span-12 items-center">
                            
                            <div class="text-center text-xs mt-2"><svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
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
                        </svg> </div>
                        </div>`);
            },
            success: function (response) {
                $('.compList_div').html(response.load_competency_mdl);
    
                var compCheckbox = $('.compList_div').find('.conpetency_checkbox');
                if (compCheckbox.length > 0 && check_competency.length > 0) {
                    compCheckbox.each(function () {
                        var _thischeckbox = $(this);
                        if (check_competency.includes(_thischeckbox.val())) {
                            _thischeckbox.prop('checked', true);
                        } else {
                            _thischeckbox.prop('checked', false);
                        }
                    });
                }
    
                $('.save_setupBtn_div').html('<button href="javascript:;" id="saveSetupCompetencyBtn" class="btn btn-primary mt-5 ml-auto">Save</button>');
    
                const previousPageButton = $('#prev_page');
                const nextPageButton = $('#next_page');
                if (response.current_page === 1) {
                    previousPageButton.prop('disabled', true);
                } else {
                    previousPageButton.prop('disabled', false);
                }
                if (response.current_page === response.last_page) {
                    nextPageButton.prop('disabled', true);
                } else {
                    nextPageButton.prop('disabled', false);
                }
    
                $('.competency_mdlShowingData').html(response.summary);
            }
        });
    }
    
    
    function setupScrollListener() {
        let debounceTimeout;
    
        $('.loadTagPosition_div').off('scroll').on('scroll', function () {
            clearTimeout(debounceTimeout);
            const element = $(this);
    
            debounceTimeout = setTimeout(function () {
                if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight - 100) {
                    if (!loading && hasMorePages) {
                        load_positions();
                    }
                }
            }, 300);
        });
    }
    
    var comp_tagPositions = [];
    var competency_tag_id;
    function ClickhandlerOfCompetencyTagingPosition(){
    
        // $("body").on('click', '.competency_tagPosition', function () {
        //     comp_tagPositions = [];
    
        //     competency_tag_id = $(this).data('comp-id');
        //     competency_tag_name = $(this).data('comp-name');
        //     load_positions();
        //     $('.competencyName_header').text(competency_tag_name+` - (TAG's)`)
        //     open_modal("#tagPosition_mdl");
    
        // });
    
        $("body").on('input', '.search_position_tag', function () {
            search_positionTag_value = $(this).val().trim();
            clearTimeout(this.delayTimer);
            
            this.delayTimer = setTimeout(function () {
                page = 1; 
                hasMorePages = true;
                load_positions();
                setupScrollListener(); // Reattach scroll listener after new search
            }, 500);
        });
    
        $("body").on('click', '.loaded_position', function () {
            var position_id = $(this).data('pos-id');
            var position_name = $(this).data('pos-name');    
            var icon = $(this).find('.circle_check');
        
            // Check if the comp_tagPositions array already contains the item with the same compid and position_id
            var existingIndex = comp_tagPositions.findIndex(function (item) {
                return item.compid === competency_tag_id && item.position_id === position_id;
            });
        
    
            if (existingIndex !== -1) {
                comp_tagPositions.splice(existingIndex, 1);
    
        
                $(this).removeClass('border-primary text-primary');
                icon.html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');
    
        
                $(`.comp_selected_list div[data-tag-position-id="${position_id}"]`).remove();
    
            } else {
                comp_tagPositions.push({
                    compid: competency_tag_id,
                    positionName: position_name,
                    position_id: position_id
                });            
                
    
                $(this).addClass('border-primary text-primary');
                icon.html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>');
    
                $('.comp_selected_list').find('.noTagPosition').remove();
                
                $('.comp_selected_list').append(`<div data-tag-position-id="${position_id}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagPosionList">
                    <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                    ${position_name}
                    <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                        <a href="javascript:;" data-r-position-id="${position_id}" class="removeSelectedTag">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor"
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                icon-name="trash-2" 
                                data-lucide="trash-2" 
                                class="lucide lucide-trash-2 w-4 h-4 mr-1">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </a>
                    </span>
                </div>`);
            }
        
            if (comp_tagPositions.length === 0) {
                $('.comp_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagPosition">
                    
                    No Position Selected                
                </div>`);
                $('#saveCompPositionTag').prop('disabled', true);
            } else {
                $('#saveCompPositionTag').prop('disabled', false);
            }
            
            $('#countTagSelected').text(comp_tagPositions.length);
        });
        
        $("body").on('click', '.removeSelectedTag', function () {
            var selecetedPositionID = $(this).data('r-position-id');
            
            // Remove the item from the selected list
            $(`.comp_selected_list div[data-tag-position-id="${selecetedPositionID}"]`).remove();
            
            // Find the index of the item in comp_tagPositions
            var existingIndex = comp_tagPositions.findIndex(function (item) {
                return item.compid === competency_tag_id && item.position_id === selecetedPositionID;
            });
        
            if (existingIndex !== -1) {
                // Remove the item from the array
                comp_tagPositions.splice(existingIndex, 1);
        
                // Remove the styles and reset the icon
                var loaded_position = $(`.loaded_position[data-pos-id="${selecetedPositionID}"]`);
                var loaded_icon = loaded_position.find('.circle_check');
        
                loaded_position.removeClass('border-primary text-primary');
                loaded_icon.html('<i class="fa-regular fa-circle-check h-4 w-4"></i>');
            }
        
            // Update the count in #countTagSelected
            $('#countTagSelected').text(comp_tagPositions.length);
        
            // Check if there are no selected positions
            if (comp_tagPositions.length === 0) {
                // Append the "No Position Selected" message
                $('.comp_selected_list').append(`<div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagPosition">
                    
                    No Position Selected                
                </div>`);
                $('#saveCompPositionTag').prop('disabled', true);
            } else {
                $('#saveCompPositionTag').prop('disabled', false);
            }
        
        });
    
        $("body").on('click', '#saveCompPositionTag', function () {
    
            $.ajax({
                type: "POST",
                url: "/rsp-competency/save-tag-position",
                data: {comp_tagPositions:comp_tagPositions},
                dataType: "json",
                beforeSend: function (){
                    $('#saveCompPositionTag').prop('disabled', true).html(`
                        Saving 
                        <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                            <g fill="none" fill-rule="evenodd">
                                <g transform="translate(1 1)" stroke-width="4">
                                    <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                    <path d="M36 18c0-9.94-8.06-18-18-18">
                                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                    </path>
                                </g>
                            </g>
                        </svg>`);
                },
                success: function (response) {
                    $('#saveCompPositionTag').prop('disabled', false).html(`Save`);
                    if(response.status == 200){
                        __notif_show(1, response.message);
                        page = 1;
                        loadCompetencies_index();
                    }else{
                        __notif_show(-3, response.message);
                    }
                }
            });
            
        });
    
        let debounceTimeout;
        $('.loadTagPosition_div').on('scroll', function () {
            clearTimeout(debounceTimeout);
            const element = $(this);
    
            debounceTimeout = setTimeout(function () {
                if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight - 100) {
    
                    if(!loading && hasMorePages){
                        load_positions();
                    }else{
                        console.log("oh noooo");
                        
                        $('.loadTagPosition_div').append(`
                            <div class="loadMoreLoading intro-x box p-2 mt-2 border bg-slate-100 cursor-pointer py-3 ml-4 flex justify-center items-center h-32">
                                <div class="font-medium text-center">
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
                        `);
                    }
                    
                }else{
                    console.log('why not use');
                    
                }
            }, 200);
        });
    
        $("body").on('click', '#cancelTagPosition_mdl, #closeTagPosition_mdl', function () {
            // alert('clicked');
            $('.comp_selected_list').html('');
            $('.loadTagPosition_div').html('');
            $('#countSelected').text('0');
            $('.search_position_tag').val('');
            search_positionTag_value = '';
            page = 1;
            comp_tagPositions = [];        
            defaultCompIdsArray = [];
            defaultCompNameArray = [];
        });
        
    }
    
    let loading = false;
    let hasMorePages = true;
    
    
    function load_positions() {
        if (!hasMorePages || loading) return;
        loading = true;
    
        $.ajax({
            type: "GET",
            url: "/rsp-competency/load-positions",
            data: {
                search_positionTag_value: search_positionTag_value,
                competency_id: competency_tag_id,
                page: page
            },
            beforeSend: function() {
                if (page === 1) {
                    $('.loadTagPosition_div').html(`
                        <div class="flex items-center justify-center h-full firstLoad">
                            <div class="loaded_position box p-2 mt-2 border bg-slate-100 cursor-pointer py-3 flex items-center justify-center">
                                <svg width="50" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
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
                    `);
                } else {
                        $('.loadTagPosition_div').append(`
                            <div class="loadMoreLoading intro-x box p-2 mt-2 border bg-slate-100 cursor-pointer py-3 ml-4 flex justify-center items-center h-32">
                                <div class="font-medium text-center">
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
                        `);
                    
                    
                }
            },
            dataType: 'json',
            success: function(response) {
                $('.loadTagPosition_div').find('.loadMoreLoading').remove();
                $('.loadTagPosition_div').find('.firstLoad').remove();
                if (page === 1) {
                    $('.loadTagPosition_div').html(response.loadPosition);
                } else {
                    $('.loadTagPosition_div').append(response.loadPosition);
                }
    
                if (response.has_more) {
                    page++;
                }
    
                hasMorePages = response.has_more;
    
                if (comp_tagPositions.length === 0) {
                    comp_tagPositions = response.comp_tagPositions;
                }
    
                loading = false;
    
                if (comp_tagPositions.length > 0) {
                    $('#saveCompPositionTag').prop('disabled', false);
                } else {
                    $('.comp_selected_list').append(`
                        <div class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative noTagPosition">
                            No Position Selected
                        </div>
                    `);
                    $('#saveCompPositionTag').prop('disabled', true);
                }
    
                $('.comp_selected_list').empty();
                comp_tagPositions.forEach(function(tagPosition) {
                    var loaded_position = $('.loadTagPosition_div').find(`.loaded_position[data-pos-id="${tagPosition.position_id}"]`);
                    loaded_position.addClass('border-primary text-primary');
                    loaded_position.find('.circle_check').html('<i class="fa-regular text-success fa-circle-check h-4 w-4"></i>');
    
                    $('.comp_selected_list').append(`
                        <div data-tag-position-id="${tagPosition.position_id}" class="cursor-pointer flex items-center px-3 py-2 mt-2 rounded-md whitespace-nowrap relative tagPosionList">
                            <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                            ${tagPosition.positionName}
                            <span class="text-danger box p-2 absolute items-center flex top-1/2 right-0 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                                <a href="javascript:;" data-r-position-id="${tagPosition.position_id}" class="removeSelectedTag">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor"
                                        stroke-width="2" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        icon-name="trash-2" 
                                        data-lucide="trash-2" 
                                        class="lucide lucide-trash-2 w-4 h-4 mr-1">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </a>
                            </span>
                        </div>
                    `);
                });
    
                $('#countTagSelected').text(comp_tagPositions.length);
                
            },
            error: function () {
                $('.loadTagPosition_div').find('.loadMoreLoading, .firstLoad').remove();
                loading = false;
            }
        });
    }
    // ==============  PAGINATION  ================= //
    
    function searchEngine(){
        $("body").on("input", ".searchComp", function () {
            searchval = $(this).val();
    
            clearTimeout(filterTimeout);
    
                filterTimeout = setTimeout(function () {
                    searchFilter = searchval;
                    if($('#addCompetency').text().trim() == 'Add New Competency'){
                        loadCompetencies_index();
                    }else{
                        loadQualifications_index()
                    }
                   
                }, 1000);
            
        });
    
        $("body").on("change", ".comp-listPage", function () {
            perPage = $(this).val();
            if($('#addCompetency').text().trim() == 'Add New Competency'){
                loadCompetencies_index();
            }else{
                loadQualifications_index()
            }
        });
        
        $("body").on('input', '.searchcompetency_mld', function () {
    
            var filtering = $(this).val();
            var postion_setup_mdl = $('#postion_setup_mdl').val();
            var sg_idValue = $('#SG_setup_mdl').val();

            clearTimeout(filterTimeout);
        
            filterTimeout = setTimeout(function () {
                search_setupFilter = filtering;
                loadCompetency_mdl(postion_setup_mdl, sg_idValue);
            }, 500);
            
        });
    
        // Function to handle pagination_compentency click
        $("body").on("click", ".pagination a.page-link", function (e) {
            e.preventDefault();
            page = $(this).data("page");
            clearTimeout(filterTimeout);
    
            if($('#addCompetency').text().trim() == 'Add New Competency'){
                loadCompetencies_index();
            }else if($('#addCompetency').text().trim() == 'Setup Competency'){
                loadQualifications_index();
            }else if($('#addCompetency').text().trim() == 'Add Competency Type'){
                loadCompetenciesType_index();
            }
            
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