var _token = $('meta[name="csrf-token"]').attr("content");
var lite_picker = '';
var typingTimer = '',doneTypingInterval = 1000,search = {Input:''};

const posting = {Id:''},from = {Date:''},to = {Date:''},place = {Assignment:''},page={Pagination:''}, filter = {Page:''}, settings = {Stat:''},
      post = {Date:''}, close = {Date:''}, infinite = {Scroll:1}, hiring = {Search:''}, log_Start = {Date:''}, log_End = {Date:''}
      repost ={Id:''};

const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#create_hiring"));
const myDeleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal-preview"));
const myOpenModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#success-modal-preview"));
const myRepostModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#repost_modal"));
const myDropdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#drp_down"));
const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#error_modal"));
const drp_down_activity_date = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#drp_down_acitivity_log"));


$(function(){

    //initialization
    initializeDateEntry('entry_date');
    initialize_select2('place_assignment','Enter place of assignment');
    initialize_select2('position_title','Enter position title');
    initialize_select2('sg','Select Salary Grade');
    initialize_select2('step','Select Salary Step');
    initialize_select2('assign_hrmo','Select Human Resource');
    initialize_select2('panel','Select panels');
    initialize_multiple_select2('panel','Select panels');
    initialize_select2('filter_page','Filter page');

    //preload data
    fetchPosition();
    fetchPlaceAssign();
    fetchSalaryGrade();
    fetchSalaryStep();
    selectStep();
    selectCompetencies();
    //
    loadModal();
    change_table_border_color();
    add_document_requirements();
    savedData();
    triggerReplicateModal();
    replicateData();
    dismissModal();
    fetchPosting();
    filterSearch();
    filterSearchDate();
    paginationNavigation();
    filterNumPages();
    selectSettings();
    cancelFilterSearch();
    viewPosting();
    editPosting();
    openPostionHiring();
    loadDeleteModal();
    deletePositionHiring();
    printHiring();
    exportAsExcel();
    delete_saved_job_documents();
    displayActivityLogs();
    scrollActivityLogs();
    searchActivityLog();
    filterActivityLogDate();
    closeActivityLogDate();
});

// initialize the dropdown
function initialize_select2(id,text)
{
    $('#' + id).select2({
        placeholder: text,
        closeOnSelect: true,
        allowClear:true,
    });
}

function initialize_multiple_select2(id,text)
{
    $('#'+id).select2({
        placeholder: text,
        closeOnSelect: true,
    });
}

function initializeDateEntry(id)
{
    lite_picker = new Litepicker({
        element: document.getElementById(id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        initialDate:new Date(),
        startDate: new Date(),
        format: 'MMMM DD, YYYY',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });

}


//check if the table input is not empty
function change_table_border_color()
{
    try{

        $("#dt_job_documents").on("change","input", function(){

            let $doc_req_input = $(this).closest('tr').find('td #doc_requirement_input'),
                $doc_type = $(this).closest('tr').find('td #doc_requirement_type_input');

            //check the document input
            $doc_req_input.each(function() {
               if( $(this).val().trim() == '' )
               {
                    $(this).css('border-color', ' #ff0000');

               } else if($(this).val().trim() != ''){

                    $(this).css('border-color', '');
               }
            });

             //check the document type
            $doc_type.each(function() {
                if( $(this).val().trim() == ''){

                    $(this).css('border-color', '#ff0000');

                } else if ($(this).val().trim() !=''){

                    $(this).css('border-color', '');
                }
             });
        });

    }catch(error)
    {
       console.log(error);
    }
}

function check_table_input()
{
    let last = $("#dt_job_documents").find('tr');

    var emptyInputs = last.find("input").filter(function() {
    return this.value === "";
    });

    if ( emptyInputs.length != 0) {

        return false;
        } else {
        return true;
        }
}

//fetcht the position
function fetchPosition()
{
    $.ajax({
        type: "POST",
        url: "/rsp_hiring/fetch-position",
        data:{_token},

        success:function(response){

            if(response.status === true)
            {
                let data = response.data,
                    option = '';

                $.map(data,function(value){
                    option = new Option(value.position,value.id,false,false);
                    $("#position_title").append(option).trigger("change");
                });
            }
        }

    });
}

//fetch the place of assignment
function fetchPlaceAssign()
{
    $.ajax({
        type: "POST",
        url: "/rsp_hiring/place-assigment",
        data:{_token},

        success:function(response){
            if(response.status === true)
            {
                let data = response.data,
                    option = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){
                        option = new Option(value.place_assignment,value.id,false,false);
                        $("#place_assignment").append(option).trigger("change");
                    });
                }
            }
        }
    });
}

//fetch the salary grade
function fetchSalaryGrade()
{
    $.ajax({
        type:"POST",
        url: "/rsp_hiring/fetch/salarygrade",
        data:{_token},

        success:function(response)
        {
            if(response.status === true)
            {
                let data = response.data,
                    option = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){
                        option = new Option(value.stepname,value.id,false,false);
                        $("#sg").append(option).trigger("change");
                    });
                }
            }
        }
    });
}

//fetch the salary step
function fetchSalaryStep()
{
    $.ajax({
        type:"POST",
        url: "/rsp_hiring/fetch/salarystep",
        data:{_token},

        success:function(response)
        {
            if(response.status === true)
            {
                let data = response.data,
                    option = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){
                        option = new Option(value.stepname,value.id,false,false);
                        $("#step").append(option).trigger("change");
                    });
                }
            }
        }
    });
}

//trigger when the step is selected
function selectStep()
{
    $("#step").on('select2:select',function(){

        let sg = $("#sg").val(),
            step = $("#step").val();

        getMonthlySalary(sg,step);
    });
}

//get the monthly salary
function getMonthlySalary(sg,step_num)
{
    $.ajax({
        type:"POST",
        url: "/rsp_hiring/get/monthly-salary",
        data:{_token,sg,step_num},

        success:function(response)
        {
            if(response.status === true)
            {
                let salary = response.data;

                if(salary)
                {
                    $("#monthly_salary").val(salary);
                }
            }
        }

    });
}

//trigger when the position is click
function selectCompetencies(){
    $("#position_title").on("select2:select",function(){
        let positionId = $(this).val();
        let sgId = $('#sg').val();
        
        if(sgId != ''){
            fetchComplementencies(positionId, sgId);
        }
    });

    $("#sg").on("select2:select",function(){
        let sgId = $(this).val();
        let positionId = $('#position_title').val();
        
        if(positionId != ''){
            fetchComplementencies(positionId, sgId);
        }
        
    });
}

//fetch the comnpetencies
function fetchComplementencies(id, sg)
{
    try
    {
        let tbl_competency = $("#competencies_list");
        let qualificationAccordion_div = $('.qualificationAccordion_div');

        $.ajax({
            type:"POST",
            url: "/rsp_hiring/fetch/competencies",
            data:{_token,id, sg},

            success:function(response){

                console.log(response.qualifications);
                if(response.status === true)
                {
                    let data = response.competencies;
                    let qual = response.qualifications;
                        cd = '';

                    tbl_competency.empty();
                    qualificationAccordion_div.empty();

                    tbl_competency.append(data);
                    qualificationAccordion_div.html(qual);
                    // if(data.length > 0)
                    // {
                    //     $.map(data,function(value){

                    //         cd += `<div class="intro-y">
                    //                     <div class="inbox__item inbox__item--active inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400">
                    //                         <div class="flex px-5 py-3">
                    //                             <div class="w-72 flex-none flex items-center mr-5">
                    //                                 <div class="inbox__item--sender truncate ml-3">${value.competency}</div>
                    //                             </div>
                    //                         </div>
                    //                     </div>
                    //                 </div>`;
                    //     });

                    //     tbl_competency.append(cd);

                    // } else
                    // {
                    //     cd = `<div class="intro-y">
                    //                 <div class="inbox__item inbox__item--active inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400">
                    //                     <div class="flex px-5 py-3">
                    //                         <div class="w-72 flex-none flex items-center justify-center mr-5">
                    //                             <div class="inbox__item--sender ml-3 text-center">No selected position / No competency added</div>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>`;

                    //     tbl_competency.append(cd);
                    // }
                } else
                {
                    tbl_competency.empty();

                    cd = `<div class="intro-y">
                                <div class="inbox__item inbox__item--active inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400">
                                    <div class="flex px-5 py-3">
                                        <div class="w-72 flex-none flex items-center justify-center mr-5">
                                            <div class="inbox__item--sender ml-3 text-center">No selected position / No competency added</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                    tbl_competency.append(cd);
                }
            }

        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//Added by MONTZ
function add_document_requirements(){

    $("body").on('click', '#add_document_requirements', function (){
        add_row_work_exp();
    });

    $('#dt_job_documents tbody').on('click','.delete',function(){
        $(this).parent().parent().parent().remove();

    });
}

function add_row_work_exp(){

    var tr=
        '<tr class="hover:bg-gray-200 ">'+
            '<td style="width:"><input  id="doc_requirement_input" name="doc_requirement[]" type="text" class="form-control" placeholder="Document requirements"></td>'+
            '<td style="width:"><input  id="doc_requirement_type_input" name="doc_requirement_type[]" type="text" class="form-control" placeholder="Type of document requirements"></td>'+
            '<td style="width: 10%">' +
                '<div class="flex justify-center items-center">' +
                '<a href="javascript:void(0);" class="delete text-center"><i  class="w-4 h-4 text-danger fa-solid fa-trash"></i></a>' +
                '</div>'+
            '</td>'+
        '</tr>';

    $('#dt_job_documents tbody').append(tr);
};
// END //

//clear data
function clearData()
{
    $("#hiring_form")[0].reset();
    initialize_select2('place_assignment','Enter place of assignment');
    initialize_select2('position_title','Enter position title');
    initialize_select2('sg','Select Salary Grade');
    initialize_select2('step','Select Salary Step');
    initialize_select2('assign_hrmo','Select Human Resource');
    initialize_select2('panel','Select panels');
    initialize_multiple_select2('panel','Select panels');
    $('#dt_job_documents tbody tr').detach();
    $('#competencies_list').empty();
    posting.Id = '';
}

//cancel the data
function dismissModal()
{
    $("#btn_dismiss").on('click',function(){
        clearData();
    });
}

//active the tab
function activeTab()
{
    $('#btn_position_info').addClass('active');
    $('#example-tab-5').addClass('active');
    $('#salary_info').removeClass('active');
    $('#example-tab-6').removeClass('active');
    $('#btn_instruction').removeClass('active');
    $('#example-tab-7').removeClass('active');
}

//click to open the modal position hiring
function loadModal()
{
    $("#btn_load_modal").on("click",function(){
        //relaod the following
        activeTab();
        $('#dt_job_documents tbody tr').detach();
    });
}

//validation on the select2 single
function validateSingleSelect2Data(id,text)
{
    if($('#'+id).val().trim() !== '')
    {
        $('#'+id).select2({
            placeholder: text,
            closeOnSelect: true,
            allowClear:true,
        });

        return true;

    } else
    {
        $('#'+id).select2({
            theme: "error",
            placeholder: text,
        });

        __notif_show(-1,'',text);

        return false;
    }
}

function validateMultipleSelect2Data(id,text)
{
    if($('#'+id).val().length > 0)
    {
        $('#'+id).select2({
            placeholder: text,
            closeOnSelect: true,
        });

        return true;

    } else
    {
        $('#'+id).select2({
            theme: "mali",
            placeholder: text,
        });

        __notif_show(-1,'',text);

        return false;
    }
}

function validateInput(id,lbl)
{

    if($('#'+id).val().trim()!=='')
    {
        $('#'+id).removeClass('border-danger');
        return true;

    } else
    {
        $('#'+id).addClass('border-danger');
        __notif_show(-1,'',"You forgot to fill the"+' '+ $('#'+lbl).text() )
        return false;
    }
}

//check if the table input is not empty
function count_row()
{
    row = $("#dt_job_documents tr").length;

    if(row=='')
    {
        __notif_show(-1,"Please fill up the documents requirements");
        return false;
    }

    return true;

}

function validateFields(fields) {
    for (let field of fields) {
        let { id, type, label } = field;
        
        if (type === 'select2-single' && !validateSingleSelect2Data(id, label)) return false;
        if (type === 'select2-multiple' && !validateMultipleSelect2Data(id, label)) return false;
        if (type === 'input' && !validateInput(id, label)) return false;
    }
    return true;
}

//saved the data
function savedData() {
    $("#hiring_form").submit(function (e) {
        e.preventDefault();
        
        try {
            let fieldsToValidate = [
                { id: 'position_title', type: 'select2-single', label: 'Enter position title' },
                { id: 'place_assignment', type: 'select2-single', label: 'Enter place of assignment' },
                { id: 'plantilla_no', type: 'input', label: 'lbl_plantilla' },
                // { id: 'eligibility', type: 'input', label: 'lbl_eligibility' },
                { id: 'assign_hrmo', type: 'select2-single', label: 'Select Human Resource' },
                { id: 'email_address', type: 'input', label: 'lbl_email_address' },
                { id: 'address', type: 'input', label: 'lbl_address' },
                { id: 'entry_date', type: 'input', label: 'lbl_entry_date' },
                { id: 'panel', type: 'select2-multiple', label: 'Select panels' },
                // { id: 'education', type: 'input', label: 'lbl_education' },
                // { id: 'training', type: 'input', label: 'lbl_training' },
                // { id: 'work_ex', type: 'input', label: 'lbl_work_ex' },
                { id: 'sg', type: 'select2-single', label: 'Select Salary Grade' },
                { id: 'step', type: 'select2-single', label: 'Select Salary Step' },
                { id: 'monthly_salary', type: 'input', label: 'lbl_monthly_salary' },
                { id: 'remarks', type: 'input', label: 'lbl_remarks' },
                { id: 'qualification_info', type: 'input', label: 'lbl_qualification_info' },
                { id: 'applicant_info', type: 'input', label: 'lbl_applicant_info' }
            ];

            if (!validateFields(fieldsToValidate)) return;
            if (!count_row() || !check_table_input()) return;
                       
            let data = $(this).serializeArray(),
                id = posting.Id,
                btn_hiring = $('#btn_hiring');
                
            data.push({ name: "id", value: id });

            $.ajax({
                type: "POST",
                url: "/rsp_hiring/save/data",
                data: data,
                beforeSend: function () {
                    btn_hiring.prop('disabled', true).html(`Save <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
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
                    btn_hiring.prop('disabled', false).html('Save');

                    if (response.status) {
                        myModal.hide();
                        clearData();
                        fetchPosting(page.Pagination, filter.Page, search.Input, from.Date, to.Date, place.Assignment, settings.Stat);

                        let messages = {
                            '13': "Successfully save.",
                            '1': "The hiring process for this position is currently on hold because the posting dates are set in advance.",
                            'default': "The hiring process for this position has been closed because the posting dates have expired."
                        };

                        let message = messages[response.hiring_status] || messages['default'];
                        let code = response.hiring_status === '13' ? 1 : (response.hiring_status === '1' ? -1 : -3);
                        __notif_show(code, '', message);
                    } else {
                        errorModal.show();
                        $("#error_text").text(response.message);
                    }
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    });
}

//trigger to display the replicate modal
function triggerReplicateModal()
{
    $("body").on("click",".btn_replicate",function(){

        repost.Id = $(this).attr('id');
    });
}

//replcate the data
function replicateData()
{
    $("#btn_repost_posting").on("click",function(){

        $.ajax({
            type:"POST",
            url:"/rsp_hiring/replicate/position/hiring",
            data:{id:repost.Id},
            success:function(response){
                if(response.status === true)
                {
                    __notif_show(1,'',response.message);
                    myRepostModal.hide();
                }
                else if(response.status === false)
                {
                    errorModal.show();
                    $("#error_text").text(response.message);
                }
            }
        });
    });
}

//fetch the posting
function fetchPosting(page,filter_page,search,from_date,to_date,assign_place,status)
{
    try
    {
        let tbl = $("#hiring_list"),
            loading = $("#loading_icon"),
            summary = $("#summary");

        $.ajax({
            type:"POST",
            url: "/rsp_hiring/fetch-posting",
            data:{_token,page,filter_page,
                    search:search,from_date,
                    to_date,assign_place,status
            },
            beforeSend:function(){

                tbl.empty();
                summary.empty();
                loading.empty();

                let cd = `<div>
                            <div class="flex items-start px-5 pt-5">
                                <div class="w-full flex flex-col lg:flex-row items-center justify-center">
                                    <div class="mb-3">
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
                            </div>
                        </div>`;

                    loading.append(cd);
            },
            success:function(response){

                if(response.status === true)
                {
                    tbl.empty();
                    loading.empty();
                    summary.empty();

                    let data = response.posting,
                        entry_num = response.summary,
                        pagination = {
                            'current_page':response.current_page,
                            'last_page':response.last_page,
                            'per_page':response.per_page,
                            'total':response.total};
                        cd = '';


                    if(data.length > 0)
                    {
                        $.map(data,function(value){

                            cd += `<div class="intro-y col-span-12 sm:col-span-6 2xl:col-span-4">
                                        <div class="box zoom-in">
                                            <div class="flex items-start px-2 pt-5">
                                                <div class="w-full flex flex-col lg:flex-row items-center">
                                                    <div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                        <div class="dropdown inline-block" data-tw-placement="right-start">
                                                            <button class="dropdown-toggle font-medium" aria-expanded="false" data-tw-toggle="dropdown">${value.position}</button>
                                                            <div class="dropdown-menu w-60">
                                                                <ul class="dropdown-content">
                                                                    <div class="p-2 text-xs flex">
                                                                        ${value.full_pos}
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div class="font-medium text-slate-500 text-xs mt-0.5">${value.plantilla}</div>
                                                    </div>
                                                </div>
                                                <div class="flex absolute right-0 top-0 mr-5 mt-3">
                                                    <div class="mr-2">
                                                        ${value.check_box}
                                                    </div>
                                                    ${value.export_settings}
                                                </div>
                                            </div>
                                            <div class="text-center lg:text-left p-5 text-xs">
                                                <div class="dropdown inline-block" data-tw-placement="right-start">
                                                    <div class="dropdown-toggle font-medium h-10" aria-expanded="false" data-tw-toggle="dropdown">${value.education}</div>
                                                    <div class="dropdown-menu w-60">
                                                        <ul class="dropdown-content">
                                                            <div class="text-justify leading-relaxed text-xs p-3">
                                                                ${value.full_educ}
                                                                ${value.training}
                                                                ${value.work_ex}
                                                            </div>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                                                    <div class="mr-auto flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-house w-3 h-3 mr-2"><path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>
                                                        ${value.agency}
                                                    </div>
                                                    <div class="flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar w-3 h-3 mr-2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                                                        <div class="dropdown inline-block" data-tw-placement="right-start">
                                                            <button class="dropdown-toggle font-medium" aria-expanded="false" data-tw-toggle="dropdown">View posting date</button>
                                                            <div class="dropdown-menu w-60">
                                                                <ul class="dropdown-content">
                                                                    <div class="p-2 text-xs font-semibold">
                                                                        ${value.post_date} - ${value.close_date}
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                                    <div class="flex mr-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-philippine-peso w-3 h-3 mr-1"><path d="M20 11H4"/><path d="M20 7H4"/><path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7"/></svg>
                                                        ${value.salary}
                                                    </div>
                                                    <div class="flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-timer-reset w-4 h-4 mr-2"><path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></svg>
                                                        <span class="mr-1">Days left:</span><span class="font-semibold">${value.diff_days}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center p-3 border-t border-slate-200/60 dark:border-darkmode-400" style="justify-content:space-between;">
                                                <div class="flex justify-center items-center">
                                                    <button id="${value.id}" class="py-1 px-4 rounded-full text-xs btn-secondary-soft cursor-pointer font-medium mr-2 ${value.view} btn_viewing" data-tw-toggle="modal" data-tw-target="#create_hiring" data-pos_title="${value.pos_title}" data-agency="${value.place_assignment}" data-item="${value.plantilla}" data-eligibility="${value.eligibility}" data-hrmo="${value.hrmo}" data-email="${value.email_add}" data-address="${value.address}" data-post="${value.post_date}" data-close="${value.close_date}" data-panels="${value.panels}" data-educ="${value.full_educ}" data-training="${value.training}" data-work="${value.work_ex}" data-salary="${value.salary_grade}" data-step="${value.step}" data-monthly_salary="${value.salary}" data-doc="${value.doc_req}" data-doc_type="${value.doc_type}" data-remarks="${value.remarks}" data-qualification="${value.qualification}" data-applicants="${value.applicants}">View</button>
                                                    <div class="py-1 px-2 rounded-full text-xs ${value.bg_color} cursor-pointer font-medium">${value.stat}</div>
                                                </div>
                                                <div class="flex items-center" style="justify-content:space-between;">
                                                    <a id="${value.id}" class="flex items-center mr-1 btn_edit_posting text-xs font-medium ${value.edit}" href="javascript:;" data-tw-toggle="modal" data-tw-target="#create_hiring" data-pos_title="${value.pos_title}" data-agency="${value.place_assignment}" data-item="${value.plantilla}" data-eligibility="${value.eligibility}" data-hrmo="${value.hrmo}" data-email="${value.email_add}" data-address="${value.address}" data-post="${value.post_date}" data-close="${value.close_date}" data-panels="${value.panels}" data-educ="${value.full_educ}" data-training="${value.training}" data-work="${value.work_ex}" data-salary="${value.salary_grade}" data-step="${value.step}" data-monthly_salary="${value.salary}" data-doc="${value.doc_req}" data-doc_type="${value.doc_type}" data-remarks="${value.remarks}" data-qualification="${value.qualification}" data-applicants="${value.applicants}">
                                                        <i data-lucide="check-square" class="w-4 h-4 text-xs"></i> Edit
                                                    </a>
                                                    <a id="${value.id}" class="flex items-center mr-1 btn_replicate text-xs font-medium ${value.replicate}" href="javascript:;" data-tw-toggle="modal" data-tw-target="#repost_modal">
                                                        <i data-lucide="check-square" class="w-4 h-4 text-xs"></i> Re-publish
                                                    </a>
                                                    <a id="${value.id}" class="flex items-center mr-1 ${value.btn_color} text-xs font-medium btn_delete_hiring" href="javascript:;" data-post="${value.post_date}" data-close="${value.close_date}">
                                                        <i data-lucide="trash-2" class="w-4 h-4 text-xs"></i> ${value.btn_text}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                        });

                        tbl.append(cd);
                        summary.append(entry_num);
                        paginationLink(pagination,'#pagination');

                    } else
                    {
                        tbl.empty();
                        loading.empty();

                        cd = `<div class="box w-full">
                                    <div class="flex items-start px-5 pt-5">
                                        <div class="w-full flex flex-col lg:flex-row items-center justify-center">
                                            <div class="mb-3 font-semibold">No available data</div>
                                        </div>
                                    </div>
                                </div>`;

                        loading.append(cd);
                    }
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//filter posting through search
function filterSearch()
{
    $("#search_hiring").on("input",function(){

        search.Input = $(this).val();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            fetchPosting(1,filter.Page,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);
        },doneTypingInterval);
    });
}

//more filter search
function filterSearchDate()
{
    $("#filter_position_hiring").on("click",function(){

        from.Date = $("#filter_date_start").val(),
        to.Date = $("#filter_date_end").val(),
        place.Assignment = $("#filter_place").val();

        fetchPosting(1,null,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);
        $("filter_date_start").val(''),
        $("filter_date_end").val(''),
        place.Assignment = '';
        myDropdown.hide();
    });
}

//create pagination link
function paginationLink(data,target)
{
    const paginationLinks = $(target);
    paginationLinks.empty();
    const currentPage = data['current_page'];
    const lastPage = data['last_page'];
    const perPage = data['per_page'];
    const totalDataCount = data['total'];

    if (totalDataCount <= perPage) {
        return;
    }

    if (currentPage > 1) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="javascript:;" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }
}

//navigate the pagination
function paginationNavigation()
{
    $("body").on("click","#pagination a",function(){
        page.Pagination = $(this).data('page');
        fetchPosting(page.Pagination,filter.Page,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);
    });
}

//filter the number of pages
function filterNumPages()
{
    $("#filter_page").on("select2:select",function(){
        filter.Page = $(this).val();
        fetchPosting(page.Pagination,filter.Page,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);
    });
}

//select settings
function selectSettings() {

    const buttons = ["#btn_settings_ongoing", "#btn_settings_pending", "#btn_settings_close", "#btn_settings_deleted"];
    let btn = $("#btn_delete_hiring");

    $(".btn_settings").on("click", function() {
        let settings_id = $(this).attr('id');

        // Remove the class from all buttons
        buttons.forEach(btn => {
            $(btn).removeClass("btn-rounded btn-primary-soft");
        });

        // Change the status based on the buttons
        settings.Stat = $(this).data('settings');
        $('#pagination').empty();
        fetchPosting(null,null,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);

        // Add the class only to the clicked button
        $('#' + settings_id).addClass("btn-rounded btn-primary-soft");
    });
}

//cancel filter search
function cancelFilterSearch()
{
    $("#filter_cancel").on("click",function(){
        myDropdown.hide();
        place.Assignment = '';
        $("#filter_date_start").val('');
        $("#filter_date_end").val('');
        $("#filter_place").clear();
    });
}

//display the posting data
function postingData(data)
{
    let pos = data.pos_title,
        agency = data.agency,
        plantilla = data.item,
        eligibility = data.eligibility,
        hrmo = data.hrmo,
        email = data.email,
        address = data.address,
        post_date = data.post,
        close_date = data.close,
        panel = data.panels,
        split = panel.split(','),
        education = data.educ,
        training = data.training,
        work_ex = data.work,
        salary_grade = data.salary,
        step = data.step;
        salary = data.monthly_salary,
        doc_req = data.doc,
        split_doc = doc_req.split(',');
        doc_type = data.doc_type,
        split_doc = doc_type.split(','),
        remarks = data.remarks,
        qualification = data.qualification,
        applicants = data.applicants,

        posting.Id = data.id;
        lite_picker.setDateRange(post_date,close_date);

        $("#position_title").val(pos).trigger('change');
        $("#place_assignment").val(agency).trigger('change');
        $("#plantilla_no").val(plantilla);
        $("#eligibility").val(eligibility);
        $("#assign_hrmo").val(hrmo).trigger('change');
        $("#email_address").val(email);
        $("#address").val(address);
        $("#education").val(education);
        $("#training").val(training);
        $("#work_ex").val(work_ex);
        $("#panel").val(split).trigger('change');
        $("#sg").val(salary_grade).trigger('change');
        $("#step").val(step).trigger('change');
        $("#monthly_salary").val(salary);
        $("#remarks").val(remarks);
        $("#qualification_info").val(qualification);
        $("#applicant_info").val(applicants);

        load_job_documents(posting.Id);
        fetchComplementencies(pos, salary_grade);
        activeTab();
}

//view the data in the posting pf position
function viewPosting()
{
    $("body").on("click",".btn_viewing",function(){

        let data = {
            id: $(this).attr('id'),
            pos_title : $(this).data('pos_title'),
            agency : $(this).data('agency'),
            item : $(this).data('item'),
            eligibility : $(this).data('eligibility'),
            hrmo : $(this).data('hrmo'),
            email : $(this).data('email'),
            address : $(this).data('address'),
            post : $(this).data('post'),
            close : $(this).data('close'),
            panels : $(this).data('panels'),
            educ : $(this).data('educ'),
            training : $(this).data('training'),
            work : $(this).data('work'),
            salary : $(this).data('salary'),
            step : $(this).data('step'),
            monthly_salary : $(this).data('monthly_salary'),
            doc : $(this).data('doc'),
            doc_type : $(this).data('doc_type'),
            remarks : $(this).data('remarks'),
            qualification : $(this).data('qualification'),
            applicants : $(this).data('applicants'),
        };
        $("#btn_hiring").addClass('hidden');
        postingData(data);
    });
}

//click the edit button
function editPosting()
{
    $("body").on("click",".btn_edit_posting",function(){

        let data = {
            id: $(this).attr('id'),
            pos_title : $(this).data('pos_title'),
            agency : $(this).data('agency'),
            item : $(this).data('item'),
            eligibility : $(this).data('eligibility'),
            hrmo : $(this).data('hrmo'),
            email : $(this).data('email'),
            address : $(this).data('address'),
            post : $(this).data('post'),
            close : $(this).data('close'),
            panels : $(this).data('panels'),
            educ : $(this).data('educ'),
            training : $(this).data('training'),
            work : $(this).data('work'),
            salary : $(this).data('salary'),
            step : $(this).data('step'),
            monthly_salary : $(this).data('monthly_salary'),
            doc : $(this).data('doc'),
            doc_type : $(this).data('doc_type'),
            remarks : $(this).data('remarks'),
            qualification : $(this).data('qualification'),
            applicants : $(this).data('applicants'),
        };
        $("#btn_hiring").removeClass('hidden');
        postingData(data);
    });
}

//delete the posting
function loadDeleteModal()
{
    $('body').on('click','.btn_delete_hiring',function(){
        post.Date = $(this).data('post'),
        close.Date = $(this).data('close');

        posting.Id = $(this).attr('id');

        //load the delete modal
        if((settings.Stat == '' || settings.Stat == "ongoing") || (settings.Stat == "pending" || settings.Stat == "close"))
        {
            myDeleteModal.show();
        } else if(settings.Stat == "deleted")
        {
            myOpenModal.show();
        }
    })
}

function openPostionHiring()
{
    $("#btn_restore_position").on("click",function(){
        type = 'restore';

        closePositionHiring(posting.Id,type,post.Date,close.Date);
    });
}

//delete the position hiring
function deletePositionHiring()
{
    $("#btn_delete_position_hiring").on('click',function(){
        type = 'delete';
        closePositionHiring(posting.Id,type,post.Date,close.Date);
        myDeleteModal.hide();
    });
}

function closePositionHiring(id,type,post,close)
{
    $.ajax({
        type:"POST",
        url: "/rsp_hiring/delete/position/hiring",
        data:{_token,id,type,post,close},
        dataType:'json',

        success:function(response){
            if(response.status === true)
            {
                __notif_show(response.code,'',response.message);
                fetchPosting(page.Pagination,filter.Page,search.Input,from.Date,to.Date,place.Assignment,settings.Stat);
            }
            else if(response.status === false )
            {
                errorModal.show();
                $("#error_text").text(response.message);
            }
        }
    });
}

//print the position hiring
function printHiring()
{
    $("body").on("click",".btn_export",function(){

        let url = '',
            id = $(this).attr('id'),
            export_type = $(this).data('export');


        if(export_type == 'pdf')
        {
            url = `/rsp_hiring/export/${id}/${export_type}`;
        } else
        {
            url = `/rsp_hiring/export/${id}/${export_type}`;
        }
        window.open(url,'_blank');
    });
}

//export multiple excel file
function exportAsExcel()
{
    $("#btn_export_excel").on("click",function(){

        let url = '',
            check_export = $('.export_excel'),
            export_excel = [];

        if(check_export.is(':checked'))
        {
            $('.export_excel:checked').each(function(e){

                let id = $(this).attr('id');
                export_excel.push(id);
            });

            if(export_excel.length > 0)
            {
                url = `/rsp_hiring/multiple/excel/export/${export_excel}`;
                window.open(url,'_blank');
            }
        }
    });
}

// montz
function load_job_documents(id){
    $.ajax({
        type: "POST",
        url: "/rsp_hiring/load/documents/requirements",
        data: {_token, id},

        success: function (response) {

            if(response.status === true)
            {
                let data = response.doc;

                if(data.length > 0)
                {
                    $('#dt_job_documents tbody tr').detach();
                    $('#dt_job_documents tbody').append(data);
                }
            }

        }
    });
}

function delete_saved_job_documents(){

    $("body").on('click', '.delete_saved_doc_req', function (){

        let id = $(this).data('doc-id');
        let ref_num = $(this).data('ref-num');

        $.ajax({
            type: "POST",
            url: "/rsp_hiring/delete/documents/requirements",
            data: {_token, id},

            success: function (response) {
                if(response.status === true)
                {
                    __notif_show(1,'','Successfully deleted');
                    load_job_documents(ref_num);
                }
            }
        });
    });
}

//fetch the activity logs
function activityLogs(page,search,start_date,end_date)
{
    let cd = '',
        tbdy = $("#activity_tbdy"),
        loading = $("#loading"),
        not_found = $("#not_found");

    $.ajax({
        type:"GET",
        url: "/rsp_hiring/position/hiring/logs",
        data:{page,search,start_date,end_date},
        beforeSend:function(){
            loading.show();
            not_found.hide();
        },
        success:function(response){

            if(response === '' || response === undefined)
            {
                not_found.show();
            }

            if(response.status === true)
            {
                let data = response.data,
                    next_page = response.next_page,
                    has_page = response.more_pages;

                loading.hide();
                not_found.hide();

                if(data.length > 0)
                {
                    $.map(data,function(logs){
                        $.map(logs,function(value){
                            cd = `<div class="px-5 py-3 mb-3 mt-2 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400">
                                        <div class="text-xs flex items-center ml-4 mr-auto">
                                            <div class="font-medium mr-2">Id:</div>
                                            <div class="text-slate-500 text-xs">${value.subject_id}</div>
                                        </div>
                                        <div class="text-xs flex items-center ml-4 mr-auto">
                                            <div class="font-medium mr-2">user:</div>
                                            <div class="text-slate-500 text-xs font-semibold">${value.user}</div>
                                        </div>
                                        <div class="text-xs flex items-center ml-4 mr-auto">
                                            <div class="font-medium mr-2">Data:</div>
                                            <div class="text-slate-500 text-xs justify-start">${value.data}</div>
                                        </div>
                                        <div class="text-xs flex items-center ml-4 mr-auto">
                                            <div class="font-medium mr-2">Timestamp:</div>
                                            <div class="text-slate-500 text-xs">${value.timestamp}</div>
                                        </div>
                                        <div class="text-xs flex items-center ml-4 mr-auto">
                                            <div class="font-medium mr-2">Action:</div>
                                            <div class="text-slate-500 text-xs ${value.text_color}">${value.action}</div>
                                        </div>
                                    </div>`;

                                    tbdy.append(cd);
                        });
                    });

                    if(has_page)
                    {
                        page = next_page;
                    } else
                    {
                        $(window).off('scroll');
                        loading.hide();
                    }
                }
            } else
            {

            }

        }
    });
}

//display the logs
function displayActivityLogs()
{
    $("#btn_activity_logs").on("click",function(){

        infinite.Scroll = 1;
        hiring.Search = '';
        log_Start.Date = '';
        log_End.Date = '';
        $("#search_hiring_activity_logs").val('');
        $("#hiring_activity_logs_date_start").val('');
        $("#hiring_activity_logs_date_end").val('');
        $("#activity_tbdy").empty();
        activityLogs();
    });
}

//enable the infinite scroll on the activity log
function scrollActivityLogs()
{
    $("#activity_tbdy").on('scroll',function(){
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 100) {
            infinite.Scroll++;
            activityLogs(infinite.Scroll,hiring.Search,log_Start.Date,log_End.Date);
        }
    });
}

//search the activity log
function searchActivityLog()
{
    $("#search_hiring_activity_logs").on("input",function(){

        hiring.Search = $(this).val();
        infinite.Scroll = 1;

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            $("#activity_tbdy").empty();
            activityLogs(infinite.Scroll,hiring.Search,log_Start.Date,log_End.Date);
        },doneTypingInterval);
    });
}

//filter the data base on the date
function filterActivityLogDate()
{
    $("#filter_hiring_activity_logs").on("click",function(){

        log_Start.Date = $("#hiring_activity_logs_date_start").val();
        log_End.Date = $("#hiring_activity_logs_date_end").val();
        infinite.Scroll = 1;

        $("#activity_tbdy").empty();
        activityLogs(infinite.Scroll,hiring.Search,log_Start.Date,log_End.Date);
        drp_down_activity_date.hide();
    });
}

//close the filter date on the activity log
function closeActivityLogDate()
{
    $("#cancel_hiring_activity_logs").on("click",function(){
        $("#hiring_activity_logs_date_start").val('');
        $("#hiring_activity_logs_date_end").val('');
        drp_down_activity_date.hide();
    });
}



