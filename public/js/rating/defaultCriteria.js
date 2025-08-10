var  _token = $('meta[name="csrf-token"]').attr('content');

var tbl_PositionPoints;
var tbl_savedCriteria;

var position_pointsS2;

var search_setupFilter = '';
var DefaulCriteria_searchFilter = '';
var per_page = 1;

var currentPage = 1;
var totalPages = 1;
var perPage = 10;
var page = 1;
var defaultCriteriaSearchTimeout;
$(document).ready(function () {

    $('#defaultSG_setup_mdl').prop('disabled', true);

    bpath = __basepath + "/";
    nav_linkFunction()
    clicking_Action();
    loadCriteria();
    select2_setup();
    save_setupPositionCriteria();
    submit_removeDefaultCriteriaData();
    onSubmit_functions();
    searchAndPagination_functions();

});

function select2_setup() {
    $('#defaultPostion_setup_mdl').select2({
        placeholder: "Select Position",
        closeOnSelect: true,
        allowClear: true
    });

    $('#defaultSG_setup_mdl').select2({
        placeholder: "Select Salary Grade",
        closeOnSelect: true,
        allowClear: true
    });
}

var position_ID, position_Name;
 // Function to update active tab and button text
 function updateActiveTabAndButton(buttonText) {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    // $('#AddTabs_btn').text(buttonText);
}

function nav_linkFunction(){

    // Function to handle tab clicks and call the appropriate load function
    $("body").on("click", ".criteriaTablist", function (e) {
        e.preventDefault();

        $(".criteriaTablist").removeClass("active");
        $(this).addClass("active");

        const tabId = $(this).closest("li").attr("id");

        page = 1;

        switch (tabId) {
            case "criteria-tab":
                loadCriteria();
                break;
            case "sub-criteria-tab":
                loadSubCriteriaData();
                break;
            case "account-and-profile-tab":
                loadDefaultCriteria();
                break;
            default:
                console.log("Unknown tab");
                break;
        }
    });


    // Button click Action
    $("body").on('click', '#AddTabs_btn', function () {
        if ($('.loadCriteria_tab').hasClass('active')) {
            $('#addAndUpdate_header').text('Add Criteria');
            $('#critID').val(0);
            $('#addCriteriaForm')[0].reset();
            open_modal('#addCriteria_modal');
            $('#add_criteria_btn').text('Save')
        } else if ($('.loadDefaultCriteria_tab').hasClass('active')) {
            open_modal('#setupDefaultPositionModal');
            load_PositionOnSelect();
        }else if($('.loadSubCriteria_tab').hasClass('active')){
            $('#subCritID').val(0);
            $('#sub_Criteria').val('');
            $('#sub_percent_point').val('');
            open_modal('#addSubCriteria_modal');
        }
    });

}

function load_qualifications(){
    $.ajax({
        type: "GET",
        url: bpath + "rating/load-position-qualifications",
        dataType: "json",
        success: function (response) {
            
        }
    });
}

function onSubmit_functions() {
    // ADD CRITERIA
    $("#addCriteriaForm").submit(function (e) {
        e.preventDefault();

        const fd = new FormData(this);
        if(blockEmptyCriteria_details()){
            $.ajax({
                url:  bpath + 'rating/add-criteria',
                method: 'post',
                data: fd,
                cache:false,
                contentType: false,
                processData: false,
                dataType: 'json',

                success: function (r) {
                    if(r.status == 200){
                    __notif_show( 1,"criteria Save Successfully");
                    $('#critID').val(0);
                    $('#addCriteriaForm')[0].reset();
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#addCriteria_modal'));
                    mdl.hide();
                    loadCriteria();
                    dropdown();
                    }
                }
            });
        }

    });

    $("#addSubCriteriaForm").submit(function (e) { 
        e.preventDefault();
        
        const addSubCriteriaForm = $(this);
        if (
            $('#sub_Criteria').val() !== '' &&
            $('#sub_percent_point').val() !== '' && 
            !isNaN($('#sub_percent_point').val())
        ) 
        {
            $.ajax({
                type: "POST",
                url: bpath + "rating/save-sub-criteria",
                data: addSubCriteriaForm.serialize(),
                dataType: "json",
                beforeSend: function(){
                    $('#add_Subcriteria_btn').prop('disabled', true).html(`
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
                        </svg>
                    `);
                },
                success: function (response) {
                    if(response.status === 200) {
                        $('#add_Subcriteria_btn').prop('disabled', false).html('Save');
                        __notif_show(1, 'Sub-Criteria Added Successfully.');
                        loadSubCriteriaData();
                        close_modal('#addSubCriteria_modal');
                    }
                   
                }
            });
        }
        
    });

}

function blockEmptyCriteria_details() {
    var criteria_name = $('#criteria');
    var rating_base = $('#rating_base');

    var isCriteriaValid = criteria_name.val() !== '';
    var isRatingBaseValid = rating_base.val() !== '';

    // Update border colors based on validity
    criteria_name.css('border-color', isCriteriaValid ? '' : 'red');
    rating_base.css('border-color', isRatingBaseValid ? '' : 'red');

    // Return true only if both inputs are valid
    return isCriteriaValid && isRatingBaseValid;
}

function blockEmptyCriteria_details() {
    var criteria_name = $('#criteria');
    var rating_base = $('#rating_base');

    var isCriteriaValid = criteria_name.val() !== '';
    var isRatingBaseValid = rating_base.val() !== '';

    // Update border colors based on validity
    criteria_name.css('border-color', isCriteriaValid ? '' : 'red');
    rating_base.css('border-color', isRatingBaseValid ? '' : 'red');

    // Return true only if both inputs are valid
    return isCriteriaValid && isRatingBaseValid;
}

function loadCriteria(){
    $.ajax({
        url: bpath + 'rating/fetch-criteria',
        type: "get",
        data: {
            _token: _token, 
            DefaulCriteria_searchFilter:DefaulCriteria_searchFilter,
            perPage:perPage,
            page:page,
        },
        beforeSend: function() {
            $('#tbl_criteria_div').html(`
                <div class="text-center" style="display: flex; justify-content: center; align-items: center; height: 100%;">
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
            `);
            // Display loading icon in button and disable it
            $('#AddTabs_btn').prop('disabled', true).html(`
                Loading
                <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="4">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                            </path>
                        </g>
                    </g>
                </svg>
            `);
        },
        success: function(data) {
            $('#tbl_criteria_div').html(data.criterias);
            $('#AddTabs_btn').prop('disabled', false).html('Add New Criteria');

            $('nav[role="navigation"]').html('')
            // Update pagination links
            totalPages = data.last_page;
            currentPage = data.current_page;

             // Update showing entries information
             var startIndex =
             (data.current_page - 1) * data.per_page + 1;
               var endIndex = Math.min(
                   data.current_page * data.per_page,
                   data.total
               );
             var showingInfo =
             "Showing " +
                 startIndex +
             " to " +
             endIndex +
             " of " +
             data.total +
             " entries";
           $("#show_dataCount").html(showingInfo);

           let paginationId = $('#pagination_criterias');
            let paginationSummaryId = $('#show_dataCount');

           updateClearanceListPaginationLinks(data.current_page, data.last_page, paginationId, paginationSummaryId);

        }
    });
}

var positionCriteriaID = null, delete_id, delete_code, criteriaCount;
var sg_ID = '';
function clicking_Action(){

    // delete Sub-criteria
    $("body").on("click", ".deleteSub-Criteria_btn", function (e) {
        e.preventDefault();
        
        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value == true) {

                var sub_criteriaID = $(this).attr('id');

                $.ajax({
                    url:  bpath + 'rating/delete-sub-criteria',
                    method: 'POST',
                    data: {
                        _token:_token,
                        sub_criteriaID: sub_criteriaID,
                    },
                    cache: false,
                    success: function (data) {
                        
                        var status = data.status;
                        
                        if(status == 200){
                            swal("Deleted!", "Sub-Criteria has been deleted Successfully.", "success");
                            __notif_show( 1,"Successfully Deleted!");
                            loadSubCriteriaData();


                        }else{
                            swal("Warning!", data.message, "warning");
                        }
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        })
    });

    $("body").on('click', '.editSub-Criteria_btn', function () {
        var subCriteriaID = $(this).attr('id');
        var sub_Criteria = $(this).data('sub-criteria');
        var sub_percent_point = $(this).data('percent-point');

        $('#subCritID').val(subCriteriaID);
        open_modal('#addSubCriteria_modal');

        $('#sub_Criteria').val(sub_Criteria);
        $('#sub_percent_point').val(sub_percent_point);

    });

    // EDIT CRITERIA
        $("body").on('click', '.editCriteria_btn', function () {

            let dropdownToggle = $(this).closest('.dropdown-menu').prev();
            dropdownToggle.attr('aria-expanded', 'false');
            $(this).closest('.dropdown-menu').hide();
                    
            var crit_id = $(this).attr('id');
            var criteria = $(this).data('criteria');
            var maxrate = $(this).data('max-rate');
            var percent_point = $(this).data('percent-point');
            var rate_base = $(this).data('rate-base');
            
            $('#addAndUpdate_header').text('Update Criteria');
            $('#add_criteria_btn').text('Update')
            $('#rating_base').val(rate_base.toString()).trigger('change')

            $('#criteria').val(criteria);
            $('#maxrate').val(maxrate);
            $('#percent_point').val(percent_point);
            $('#critID').val(crit_id);
            open_modal('#addCriteria_modal');

        });

    //DELETE CRITERIA
        $("body").on("click", ".deleteCriteria_btn", function (ev) {
            ev.preventDefault();

            let dropdownToggle = $(this).closest('.dropdown-menu').prev();
            dropdownToggle.attr('aria-expanded', 'false');
            $(this).closest('.dropdown-menu').hide();

            swal({
                container: 'my-swal',
                title: 'Are you sure?',
                text: "It will permanently deleted !",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value == true) {

                let criteria_id = $(this).attr('id');

                    
                    $.ajax({
                        url:  bpath + 'rating/delete-criteria',
                        method: 'POST',
                        data: {
                            _token:_token,
                            criteria_id: criteria_id,
                        },
                        cache: false,
                        success: function (data) {
                            
                            var status = data.status;
                            
                            if(status == 200){
                                swal("Deleted!", "your Criteria has been deleted Successfully.", "success");
                                __notif_show( 1,"Successfully Deleted!");
                                loadCriteria();


                            }else{
                                swal("Warning!", "Deleter Unsuccessful.", "warning");
                            }
                        }
                    });
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swal("Cancelled", "Your data is safe :)", "error");
                }
            })
        });

    // on Change Actions
        $("#defaultPostion_setup_mdl").change(function (e) {
            e.preventDefault();
            positionCriteria_value = [];

            position_ID = $(this).val();
            if(position_ID != ''){

                $('#defaultSG_setup_mdl').prop('disabled', false);
                
                // loadCriteria_mdl(position_ID);
            }else{
               
                $('#defaultSG_setup_mdl').prop('disabled', true);
                $('#defaultSG_setup_mdl').val('').trigger('change');

                $('.save_setupPositionCriteriaBtn_div').html('');
                $('.criteriaList_div').html('');
                $('#selectCriteriaHeader_div').addClass('hidden');
                $('#selectCompFooter_div').addClass('hidden');
            }            
        });

        $("body").on('change', '#defaultSG_setup_mdl', function () {
            sg_ID = $(this).val();
            position_ID = $('#defaultPostion_setup_mdl').val();
            if(sg_ID != '' && position_ID != ''){
                loadCriteria_mdl(position_ID);
            }else{
                $('.save_setupPositionCriteriaBtn_div').html('');
                $('.criteriaList_div').html('');
                $('#selectCriteriaHeader_div').addClass('hidden');
                $('#selectCompFooter_div').addClass('hidden');
            }
        });
        
    //Begin Setup Position Row Click Action
        $("body").on('click', '.setupPosition_row', function () {
            position_ID = $(this).data('position-id');
            position_Name = $(this).data('position-name');
            var tr = $(this);


            var icon = tr.find('.fa-chevron-right');
            criteriaCount = tr.find('.criteriaCount');
            $('#positionid').val(position_ID);
            $('.position_compRow').remove();
            $('.qualification_row').not(tr).removeClass('shown light-blue-bg selected-row');
            $('.fa-chevron-right').css('transform', 'rotate(0deg)');

            if (tr.hasClass('shown')) {
                tr.removeClass('shown selected-row light-blue-bg');
                icon.css('transform', 'rotate(0deg)');
            } else {
                tr.after(DefaultPositionCriteriaFormat());
                tr.addClass('shown selected-row light-blue-bg');
                icon.css('transform', 'rotate(90deg)');
            }
        });

        $("body").on("click", ".editPositionSetup", function (e) {
            e.stopPropagation();
        
            var position_id = $(this).data("position-id");
            open_modal('#setupDefaultPositionModal');
            load_PositionOnSelect();
        
            // console.log('position_id' + position_id);
            
            // Set timeout before triggering the change event
            setTimeout(function() {
                $('#defaultPostion_setup_mdl').val(position_id).trigger('change');
            }, 500); // Adjust the delay time (in milliseconds) if needed
        });

        $("body").on('click', '.removePositionSetup', function (e) {
            e.stopPropagation();
            alert('delete Natu ni bai')
        });
    //End Setup Position Row Click Action

    // Handle click event for .criteria_mdl_row
        $("body").on('click', '.criteria_mdl_row', function () {
            var div = $(this);
            var targetSelector = div.attr('target');
            var CriteriaCheckbox_target = $(targetSelector);
            var Criteria_name = div.find('.criteria_text_div').text().trim();

            var rateBase = div.data('rate-base');
            
            
            positionCriteriaID = targetSelector;
            
            var selectedCriterion = positionCriteria_value.find(criteria => criteria.criteria_id === positionCriteriaID);

            
            if (selectedCriterion && selectedCriterion.criteria_points !== undefined) {
                console.log('Selected criterion with points: ', selectedCriterion.criteria_points);
                
                
                div.find('.criteriaPercentPoints').text(selectedCriterion.criteria_points);
            } else {
                console.log('No criterion found or points are undefined');
            }

            
            var icon = div.find('.criteria_mdl_chevron');
            $('.criteria_mdl_chevron').css('transform', 'rotate(0deg)');
            $('.criteriaCompRow').remove();
            $('.criteria_mdl_row').not(div).removeClass('shown selected-row');
            $('.criteria_mdl_contender').css('background-color', '');

            
            if (div.hasClass('shown')) {
                div.removeClass('shown selected-row');
                icon.css('transform', 'rotate(0deg)');
            } else {
                div.after(criteriaCompetencyFormat(rateBase));
                div.addClass('shown selected-row');
                div.find('.criteria_mdl_contender').css('background-color', '#E2FAF9');
                icon.css('transform', 'rotate(90deg)');
            }
        });

        $("body").on('click', '.criteria_mld_checkbox', function (e) {
            e.stopPropagation();

            var _thisCheckbox = $(this);
            var Criteria_name = _thisCheckbox.closest('.criteria_mdl_row').find('.criteria_text_div').text().trim();
            var CriteriaCheckboxValue = _thisCheckbox.val();

            var Criteria_Points = _thisCheckbox.closest('.criteria_mdl_row').find('.criteriaPercentPoints').text().trim();
            var Criteria_raters = _thisCheckbox.closest('.criteria_mdl_row').find('.rater_span').text().trim();

            var isChecked = _thisCheckbox.prop('checked');
        
            if (isChecked) {
                if (!positionCriteria_value.some(criteria => criteria.criteria_id === CriteriaCheckboxValue)) {
                    positionCriteria_value.push({
                        criteria_id: CriteriaCheckboxValue,
                        criteria_points: Criteria_Points,
                        criteria_raters: Criteria_raters,
                        name: Criteria_name,                        
                        competencies: []
                    });
                }
            } else {
                var index = positionCriteria_value.findIndex(criteria => criteria.criteria_id === CriteriaCheckboxValue);
                if (index > -1) {
                    positionCriteria_value.splice(index, 1);
                }
            }
            console.log(positionCriteria_value);
            
        });

        $("body").on('click', '.set_point_mdl', function (e) {
            e.stopPropagation();
            var criteriaName = $(this).data('criteria-name');
            $('#setPoints_header').html(criteriaName+ ' <em id="pointVal"></em>');
            open_modal('#set_points_modal')
        });

        $("body").on('input', '#crit_points', function () {
            var points = $(this).val();
            if(points != ''){
                $('#pointVal').text('('+points+'%)');
            }else{
                $('#pointVal').text('');
            }


        });

        $("body").on('click', '#setCriteriasCompetencies_btn', function () {
            alert('Save nato ni')
        });

        $("body").on("click", ".removePositionCriteriaSetup", function () {
            delete_id = $(this).data('setup-criteria-id');
            delete_code ='removePositionCriteriaSetup';
            $('#delete_id').val(delete_id);
            $('#deleteCode').val('removePositionCriteriaSetup');
            open_modal('#delete-modal');
        });

        // Attach the event handler for input events on all .criteriaPercentPoints elements
        $("body").on('input', '.criteriaPercentPoints', function () {
            let value = parseFloat(this.innerText.replace('%', ''));
            if (isNaN(value)) value = 0;
            
        });

        $("body").on('blur', '.criteriaPercentPoints', function () {

            let value = parseFloat(this.innerText.replace('%', ''));
            if (isNaN(value)) {
                this.innerText = '';
            } else {
                if(value !=0){
                    this.innerText.replace('%', '');
                    this.innerText = value + '%';
                }else{
                    this.innerText = '';
                }
               
            }

            var Criteria_val = $(this).closest('.criteria_mdl_row').find('.criteria_mld_checkbox').val();    
            var criterion = positionCriteria_value.find(criteria => criteria.criteria_id === Criteria_val);
    
            if (criterion) {
                
                criterion.criteria_points = this.innerText;
            } else {
                __notif_show(-3, 'No criteria found');
            }
            
            
            
        });

        let debounceTimeout;

        $("body").on('input', '.searchcompetency_mld', function () {
            search_setupFilter = $(this).val();
            positionID = $('#defaultPostion_setup_mdl').val();
            clearTimeout(debounceTimeout);
            
            debounceTimeout = setTimeout(function () {
                loadCriteria_mdl(positionID);
            }, 500);
        });

        $("body").on("click", '.dropdown-toggle', function(event) {
            event.stopPropagation();
        });

        $("body").on('click', '.choose_rater', function () {
            var rater = $(this).data('rater');
            var criteria_id = $(this).data('criteria-id').toString();
            var rater_text = '';
        
            if (rater === 'panels') {
                rater_text = 'Panels';
            } else if (rater === 'hr') {
                rater_text = 'HR';
            } else if (rater === 'both') {
                rater_text = 'Both';
            }
        
            
            var criteria_row = $('body').find('.criteria_mdl_row[target="' + criteria_id + '"]');
            var rater_span = criteria_row.find('span#rater_span');
        
            
            if (rater_span.length) {
                rater_span.text('(' + rater_text + ')');
            }
        
            
            var dropdown_menu = $(this).closest('.dropdown-menu');
            dropdown_menu.removeClass('show');
        
            
            var criteria_val = criteria_row.find('.criteria_mld_checkbox').val();
        
            
            var criterion = positionCriteria_value.find(function (criteria) {
                return criteria.criteria_id.toString() === criteria_id;
            });
        
            if (criterion) {
                
                criterion.criteria_raters = '(' + rater_text + ')';
            } else {
                __notif_show(-3, 'The criterion has not been selected.');
            }
        
        });

        var preventCheckboxToggle = false;

        // Handle click event for .critCompCheckbox
        $("body").on('click', '.critCompCheckbox', function () {
            if (preventCheckboxToggle) {
                preventCheckboxToggle = false; 
                return;
            }

            var _this = $(this);
            var criteriaRow = $('.criteria_mdl_row.shown.selected-row');
            var competency_points = _this.find('em.competency_mdlPoints').text().trim();
            
            // console.log('competency_points: ' + competency_points);
            
            if (criteriaRow.find('input.criteria_mld_checkbox[type="checkbox"]').is(':checked')) {
                var competency_id = _this.data('competency-id');
                var CompetencyCheckbox_target = $('#comp_box' + competency_id);
                var Competency_name = _this.find('.competency_mdlText').text().trim();

                if (CompetencyCheckbox_target.length === 0) {
                    console.error('No element found for selector: #comp_box' + competency_id);
                    return;
                }

                // Use the global positionCriteriaID
                getCriteriaCompetency(positionCriteriaID, CompetencyCheckbox_target, Competency_name, competency_points, toggleCheckbox = true);
            } else {
                var criteria_mld_checkbox = criteriaRow.find('input.criteria_mld_checkbox[type="checkbox"]');
                var Criteria_name = criteriaRow.find('.criteria_text_div').text().trim();
                var Criteria_Points = criteriaRow.find('.criteriaPercentPoints').text().trim();
                var Criteria_rater = criteriaRow.find('.rater_span').text().trim();
                var isChecked = criteria_mld_checkbox.prop('checked');
                CriteriaCheckboxValue = criteria_mld_checkbox.val();
                
                 // Update the criteria data based on the final checked state
                if (!isChecked) {
                    
                    criteria_mld_checkbox.prop('checked', true);
                    
                    if (!positionCriteria_value.some(criteria => criteria.criteria_id === CriteriaCheckboxValue)) {
                        positionCriteria_value.push({
                            criteria_id: CriteriaCheckboxValue,
                            criteria_points: Criteria_Points,
                            criteria_raters: Criteria_rater,
                            name: Criteria_name,                            
                            competencies: [] 
                        });
                        positionCriteria_text.push(Criteria_name);
                    }
                } else {
                    
                    var index = positionCriteria_value.findIndex(criteria => criteria.criteria_id === CriteriaCheckboxValue);
                    if (index > -1) {
                        p.splice(index, 1);
                        positionCriteria_text.splice(index, 1);
                    }
                }

                var competency_id = _this.data('competency-id');
                var CompetencyCheckbox_target = $('#comp_box' + competency_id);
                var Competency_name = _this.find('.competency_mdlText').text().trim();

                if (CompetencyCheckbox_target.length === 0) {
                    console.error('No element found for selector: #comp_box' + competency_id);
                    return;
                }

                
                getCriteriaCompetency(positionCriteriaID, CompetencyCheckbox_target, Competency_name, competency_points, toggleCheckbox = true);
            }
            // console.log(positionCriteria_value);
            
        });

        $("body").on('click', '.competency_mdlPoints', function (e) {
            e.stopPropagation();
            preventCheckboxToggle = true;
        });
        
        $("body").on('input', '.competency_mdlPoints', function (e) {
            var criterion = positionCriteria_value.find(criteria => criteria.criteria_id === positionCriteriaID);
        
            if (criterion && criterion.criteria_raters === '(HR)') {
                let value = parseFloat(this.innerText.replace('%', ''));
                if (isNaN(value)) value = 0;
        
                var competency_ContentHolder = $(this).closest('div.competency_ContentHolder');
                var critCompCheckboxes = competency_ContentHolder.find('div.critCompCheckbox[data-criteria-id="' + criterion.criteria_id + '"]');
                
                
                var criteria_points = typeof criterion.criteria_points === 'string' 
                    ? parseFloat(criterion.criteria_points.replace('%', '')) 
                    : parseFloat(criterion.criteria_points);
        
                var competency_mdlPointsSum = 0;
                
                console.log('critCompCheckboxes: '+critCompCheckboxes.length);
                
                if (critCompCheckboxes.length > 0) {
                    $.each(critCompCheckboxes, function (index, critCompCheckbox) {
                        var competency_mdlPoints = parseFloat($(critCompCheckbox).find('em.competency_mdlPoints').text().replace('%', '').trim());
                       
                        
                        if (!isNaN(competency_mdlPoints)) {
                            competency_mdlPointsSum += competency_mdlPoints;
                        }
                    });
                }

             
                if (competency_mdlPointsSum > criteria_points) {
                    this.innerText = 0;
                }else{
                    this.innerText = value + '%';
                }
        
                setCaretToEnd(this);
            }        
            
        });
                
        $("body").on('blur', '.competency_mdlPoints', function (e) {
            
            var criterion = positionCriteria_value.find(criteria => criteria.criteria_id === positionCriteriaID);

            if(criterion){
                if(criterion.criteria_raters == '(HR)'){
                    let value = parseFloat(this.innerText.replace('%', ''));
                    if (isNaN(value)) {
                        this.innerText = '';
                    } else {
                        if(value !=0){
                            this.innerText = value + '%';
                        }else{
                            this.innerText = '';
                        }
                       
                    }
                    
                }

                var competency_points = $(this).text().trim();
            
                var competency_id = $(this).data('competency-id');
                var critCompCheckbox = $(this).closest('.critCompCheckbox');
                
                // Find the checkbox and competency name
                var CompetencyCheckbox_target = critCompCheckbox.find('#comp_box' + competency_id);
                var Competency_name = critCompCheckbox.find('.competency_mdlText').text().trim();
    
                // Ensure the checkbox element exists
                if (CompetencyCheckbox_target.length === 0) {
                    console.error('No element found for selector: #comp_box' + competency_id);
                    return;
                }
    
                getCriteriaCompetency(positionCriteriaID, CompetencyCheckbox_target, Competency_name, competency_points, toggleCheckbox = false);
                
                
            }
            console.log('blur: ');
            console.log(positionCriteria_value);
            
        });
        
}

function setCaretToEnd(el) {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(el.childNodes[0], el.innerText.length - 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function handleCheckboxClick(_this) {
    var criteria_points = $('#criteria_points');
    if ($(_this).is(':checked')) {
        criteria_points.prop('disabled', true).val(10);
    } else {
        criteria_points.prop('disabled', false).val('');
    }
}

function DefaultPositionCriteriaFormat() {

    fetch_DefaultPosition_criteria();

    return `<tr class="position_compRow expanded-row bg-lightblue-100">
                <td colspan="5">
                    <div class="border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1 mt-5 ">

                        <div class="overflow-x-auto pr-4 pl-4">
                            <table id="DefaultPositionCriteria_tbl-${position_ID}" class="table table-report -mt-2 table-hover">
                                <thead>
                                    <th class="whitespace-nowrap">Criteria/s</th>
                                    <th class="text-center whitespace-nowrap">Points</th>
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

function load_PositionOnSelect(){
    $.ajax({
        type: "get",
        url: bpath + "rating/load-position-on-select",
        dataType: "json",
        success: function (response) {

            $('#defaultPostion_setup_mdl').append(response);

        }
    });
}

function loadCriteria_mdl(positionID){
    $.ajax({
        type: "get",
        url: bpath +"rating/load-criteria-mdl",
        data: {_token: _token,
            search_setupFilter: search_setupFilter,
                positionID: positionID,
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
            
            criteriaData = response.positionCriteria_value;
            
            if(search_setupFilter == ''){
                initializeCriteriaData(criteriaData);
            }
            
                
            $('.criteriaList_div').html(response.load_criteria_mdl);

            $('#selectCriteriaHeader_div').removeClass('hidden');
            $('#selectCompFooter_div').removeClass('hidden');

            $('.save_setupPositionCriteriaBtn_div').html('<button href="javascript:;" id="savePositions_criteriaCompetecyBtn" class="btn btn-primary mt-5 ml-auto">Save</button>');

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

function fetch_DefaultPosition_criteria(){

    $.ajax({
        url:  bpath +'rating/fetch/default/position-Criteria',
        type: "get",
        data: {
            _token: _token, position_ID:position_ID
        },
        dataType: 'json',
        success: function (response) {

            $('#DefaultPositionCriteria_tbl-'+position_ID+' > tbody' ).html(response);
            
        }
    });


}

function loadDefaultCriteria(){
        $.ajax({
            type: "get",
            url: bpath + 'rating/load-default-criteria',
            data: {
                DefaulCriteria_searchFilter:DefaulCriteria_searchFilter,
                perPage:perPage,
                page:page,
            },
            beforeSend: function() {
                // Display loading icon in #tbl_criteria_div
                $('#tbl_criteria_div').html(`
                    <div class="text-center" style="display: flex; justify-content: center; align-items: center; height: 100%;">
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
                `);

                // Display loading icon in button and disable it
                $('#AddTabs_btn').prop('disabled', true).html(`
                    Loading
                    <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                        <g fill="none" fill-rule="evenodd">
                            <g transform="translate(1 1)" stroke-width="4">
                                <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                </path>
                            </g>
                        </g>
                    </svg>
                `);
            },
            success: function(response) {
                
                $('#tbl_criteria_div').html(response.defaultCritria);
                $('#AddTabs_btn').prop('disabled', false).html('Set Position Criteria');
                $('nav[role="navigation"]').html('')
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

            let paginationId = $('#pagination_criterias');
                let paginationSummaryId = $('#show_dataCount');

            updateClearanceListPaginationLinks(response.current_page, response.last_page, paginationId, paginationSummaryId);
                },
                error: function(xhr, status, error) {
                    // Handle error response
                    $('#AddTabs_btn').html('Set Default Position');
                    __notif_show(-3, 'An error occurred:', status, error)
                }
            });


}

function loadSubCriteriaData(){

    $.ajax({
        url:  bpath + 'rating/load-sub-criterias',
        method: 'get',
        data: {
            _token:_token,
            DefaulCriteria_searchFilter:DefaulCriteria_searchFilter,
            perPage:perPage,
            page:page,
        }, beforeSend: function() {            
            $('#tbl_criteria_div').html(`
                <div class="text-center" style="display: flex; justify-content: center; align-items: center; height: 100%;">
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
            `);

            $('#AddTabs_btn').prop('disabled', true).html(`
                Loading
                <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="4">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                            </path>
                        </g>
                    </g>
                </svg>
            `);
        },
        success: function (response) {
                    
            $('#tbl_criteria_div').html(response.subCriterias)
            $('#AddTabs_btn').prop('disabled', false).html('Add Sub-Criteria');

            $('nav[role="navigation"]').html('')
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

           let paginationId = $('#pagination_criterias');
            let paginationSummaryId = $('#show_dataCount');

           updateClearanceListPaginationLinks(response.current_page, response.last_page, paginationId, paginationSummaryId);

        },
        error: function(xhr, status, error) {
            $('#AddTabs_btn').html('Add Sub-Criteria');
            __notif_show(-3, 'An error occurred:', status, error)
        }
    });
}

function criteriaCompetencyFormat(rateBase) {
    competencyCriteria_format(rateBase);
    return `<div class="criteriaCompRow expanded-row bg-slate-100 overflow-x">
                <div class="col-">
                    <div class="border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1">
                        <div class="competency_ContentHolder overflow-x-auto pr-4 pl-4 px-10" data-criteria-id="${positionCriteriaID}"></div>
                    </div>
                </div>
            </div>`;
}

function competencyCriteria_format(rateBase) {
    $.ajax({
        type: "GET",
        url: bpath + "rating/load-criteria-competency-mdl",
            data:   {
                        _token, position_ID: position_ID, 
                        positionCriteriaID: positionCriteriaID,
                        rateBase: rateBase
                    },
        success: function (response) {
            $('.competency_ContentHolder').html(response);
            
            var selectedCriterion = positionCriteria_value.find(criteria => criteria.criteria_id === positionCriteriaID);

            setTimeout(function() {
                if (selectedCriterion) {

                    var percent = '';
                    if(selectedCriterion.criteria_raters == "(HR)"){
                        percent = '%';
                    }
                    // console.log('selectedCriterion:  '+selectedCriterion);

                    // Process competencies as before
                    selectedCriterion.competencies.forEach(function(comp) {
                        if (comp) {
                            var checkbox = $('input[type="checkbox"].competency_checkbox_mdl[value="' + comp.competency_id + '"]');
                            if (checkbox.length > 0) {
                                var critCompCheckbox = checkbox.closest('div.critCompCheckbox');
                                checkbox.prop('checked', true);
                                var competency_mdlPoints = critCompCheckbox.find('.competency_mdlPoints');
                                competency_mdlPoints.text(comp.competency_Points + percent || '');
                            } else {
                                __notif_show(-3, 'Checkbox not found');
                            }
                        } else {
                            console.log("Inconsistent competency object structure: ", comp);
                            __notif_show(-3, 'Inconsistent competency data');
                        }
                    });
                }
            }, 100);

            console.log('competencyCriteria_format: '+ positionCriteria_value);
            
        }
    });
}

function initializeCriteriaData(criteriaData) {
    positionCriteria_value = criteriaData;

    console.log('initializeCriteriaData: ');
    console.log(criteriaData);
    console.log(positionCriteria_value);
    
    
    
}

var positionCriteria_value = [];
var positionCriteria_text = [];


function getCriteriaCompetency(criteriaID, CompetencyCheckbox_target, Competency_name, competency_points, toggleCheckbox) {
    if (toggleCheckbox) {
        var wasChecked = CompetencyCheckbox_target.prop('checked');
        var isChecked = !wasChecked;
        CompetencyCheckbox_target.prop('checked', isChecked);
    }

    var CompetencyCheckboxValue = CompetencyCheckbox_target.val();
    var criterion = positionCriteria_value.find(criteria => criteria.criteria_id === criteriaID);

    if (criterion) {
        var isChecked = CompetencyCheckbox_target.prop('checked'); // Updated checked state

        if (isChecked) {
            // Add competency if it doesn't exist
            var existingCompetency = criterion.competencies.find(comp => comp.competency_id === CompetencyCheckboxValue);
            if (!existingCompetency) {
                criterion.competencies.push({
                    competency_id: CompetencyCheckboxValue,
                    competency_name: Competency_name,
                    competency_Points: competency_points
                });
            } else {
                // If the competency exists, you can update the points if needed
                existingCompetency.competency_Points = competency_points || '0';
            }
        } else {
            // Remove competency if it's unchecked
            var index = criterion.competencies.findIndex(comp => comp.competency_id === CompetencyCheckboxValue);
            if (index > -1) {
                criterion.competencies.splice(index, 1);
            }
        }
    } else {
        // Handle the case when no criteria is found
        __notif_show(-3, 'No criteria found');
    }

    // console.log('getCriteriaCompetency: '+ positionCriteria_value);
    
}

function save_setupPositionCriteria(){
    $("body").on('click', '#savePositions_criteriaCompetecyBtn', function (e) {
        e.preventDefault();

        if( validatePositionCriteria_setup()){
            $.ajax({
                type: "POST",
                url: bpath + "rating/save-position-criteria",
                data: { _token: _token,
                        position_ID:position_ID,
                        positionCriteria_value: positionCriteria_value},
                dataType: "json",
                beforeSend: function(){
                    $("#savePositions_criteriaCompetecyBtn").prop('disabled', true).html(`
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
                    </svg>
                `);
                },
                success: function (response) {
                    if(response.status === 200) {
                        __notif_show(1, response.message);
                        positionCriteria_value = [];
                        $('.save_setupPositionCriteriaBtn_div').html('');
                        
                        $('.criteriaList_div').html('');

                        $('#selectCriteriaHeader_div').addClass('hidden');
                        $('#selectCompFooter_div').addClass('hidden');
            
                        $('#defaultPostion_setup_mdl').val('').trigger('change');
                        close_modal('#setupDefaultPositionModal');
                        loadDefaultCriteria();

                    }else{
                        __notif_show(-3, response.message);
                    }
                    $("#savePositions_criteriaCompetecyBtn").prop('disabled', false).html('Save');
                }
                
            });
        }

    });
}

function validatePositionCriteria_setup() {

    if (positionCriteria_value.length > 0) {
        var totalCriteriaPoints = 0;

        // console.log('validatePositionCriteria_setup: ');
        
        // console.log(positionCriteria_value);
        
        $.each(positionCriteria_value, function(index, positionCriteria) {
            var criteriaPoints = positionCriteria['criteria_points'];
            if (criteriaPoints) {
                // Remove the '%' sign and convert to a number
                criteriaPoints = parseFloat(criteriaPoints.replace('%', ''));
                
                // Add to the total
                totalCriteriaPoints += criteriaPoints;
            }
        });

        if(totalCriteriaPoints > 100){
            // console.log('Total Criteria Points False:', totalCriteriaPoints);
            __notif_show(-3, "Points must not exceed 100%");
            return false;
        }else{
            // console.log('Total Criteria Points True:', totalCriteriaPoints);
            return true;
        }
        
    }else{
        __notif_show(-3, "Please Choose Criteria For the Selected Position");
        return false;
    }
}

function submit_removeDefaultCriteriaData(){

    $("#deleteModal_form").submit(function (e) {
        e.preventDefault();

        const fd = new FormData(this);
        $.ajax({
            url:  bpath + 'rating/remove-default-criteria-setup',
            method: 'post',
            data: fd,
            cache:false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                if(data.status == 200){
                    if (delete_code == 'removePositionCriteriaSetup') {
                        __notif_show(1, data.message);
                        $('#delete_id').val('');
                        $('#deleteCode').val('');
                        close_modal("#delete-modal");
                        findPosition();
                        
                        fetch_DefaultPosition_criteria()
                    }
                }else{
                    __notif_show(-3, data.message);
                }
                
            }
        });
    });


}

function appendPercent(element) {
    var text = element.textContent.trim();
    var numericValue = text.replace(/[^0-9]/g, '').trim();

    if (numericValue !== '') {
        element.removeAttribute('data-placeholder');

            // Only update the text content if it changes to avoid disrupting the cursor
        if (element.textContent !== numericValue + '%') {
            element.textContent = numericValue + '%';
            
            // Restore cursor position to the end of the text
            var range = document.createRange();
            var selection = window.getSelection();
            
            range.setStart(element.childNodes[0], element.textContent.length - 1); // Place cursor before %
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }

    }else{
        element.setAttribute('data-placeholder', 'Set Points');
    }
  
}

function findPosition() {
    var criteriaCounting = parseInt(criteriaCount.text().trim(), 10); // Convert to integer
    var newCount = criteriaCounting - 1;
    criteriaCount.text(newCount);
    if(newCount == 0){
        loadDefaultCriteria()
    }
     // Update the text with the new count
}

// Function to handle row click but prevent dropdown click from propagating
function openCriteriaCompRow(event, rowElement) {
    // Check if the click target is part of the dropdown to prevent row opening
    if (!$(event.target).closest('.dropdown').length) {
        // Your logic to open the criteriaCompRow
        // console.log('Row clicked:', rowElement);
    }
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

function searchAndPagination_functions() {
    
    $("body").on('input', '.DefaulCriteria_searchFilter', function () {
        clearTimeout(defaultCriteriaSearchTimeout);
        
       
            DefaulCriteria_searchFilter = $(this).val();
            
            page = 1;
            defaultCriteriaSearchTimeout = setTimeout(() => {
                    
                if ($(".loadCriteria_tab").hasClass("active")) {
                    loadCriteria();
                } else if ($(".loadSubCriteria_tab").hasClass("active")) {
                    loadSubCriteriaData();
                } else if ($(".loadDefaultCriteria_tab").hasClass("active")) {
                    loadDefaultCriteria();
                }
            }, 500);
       
    });

    $("body").on("click", ".pagination a.page-link", function (e) {
        e.preventDefault();
        page = $(this).data("page");

        clearTimeout(defaultCriteriaSearchTimeout);

        if ($(".loadCriteria_tab").hasClass("active")) {
            loadCriteria();
        } else if ($(".loadSubCriteria_tab").hasClass("active")) {
            loadSubCriteriaData();
        } else if ($(".loadDefaultCriteria_tab").hasClass("active")) {
            loadDefaultCriteria();
        }
        
    });

    $("body").on("change", ".comp-listPage", function () {
        perPage = $(this).val();
        if ($(".loadCriteria_tab").hasClass("active")) {
            loadCriteria();
        } else if ($(".loadSubCriteria_tab").hasClass("active")) {
            loadSubCriteriaData();
        } else if ($(".loadDefaultCriteria_tab").hasClass("active")) {
            loadDefaultCriteria();
        }
    });
}
