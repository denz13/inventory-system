var _token = $('meta[name="csrf-token"]').attr('content');
var survey_table = '',deleted_evaluatee_id = '',deleted_evaluatee_ref_id = '', deleted_status='';
var survey_tb = '',evaluator_id_survey = '',ref_id='';
const create_modal_survey = {globalModal:tailwind.Modal.getInstance(document.querySelector("#create_survey_modal"))};
const delete_evaluatee_modal ={globalDelete:tailwind.Modal.getInstance(document.querySelector("#delete_evaluatee"))}
var filter_val = '',temp_evaluator_id = '',triggetUpdate = { globalValue:""};
var temp_question = {globalQuestion: []},temp_survey_id = {globalSurveyId:[]},eval_Id = {EvaluatorId:''};
var request_id = {globalId:''},request_refId = {globalRefId:''},request_stat = {globalStat:''};

$(document).ready(function(){

    bpath = __basepath + "/";

    load_dataTable();
    loadEvaluatorData();
    load_survey_select2();
    load_employee_evaluator();
    load_competencyList();

    check_editor();
    press_enter_survey();
    select_competencyList();
    delete_survey_row();
    saved_survey_training();
    cancel_survey_modal();

    //responsible for the trigger of the child info
    show_list();

    //filter the data on the list
    filter_data();
    trigger_update();

    //delete evaluatee
    pass_delete_data();
    trigger_delete();

    //send request
    refferenceId();
    sendRequest();
    cancel_request_form();

    //display trail
    displayTrailList();

});


//load the evaluator datatable accessible in any scripts
$.fn.extend({

    loadEvaluator: function(){
        $.ajax({
            url: bpath + "employee_ratings/display/survey/data",
            type: "POST",
            data: {_token},

            success:function(response)
            {
                survey_tb.clear().draw();

                if(response!='')
                {
                    const data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        for(let x = 0;x<data.length;x++)
                        {
                            const id = data[x]["id"],
                                  evaluator = data[x]["evaluator"],
                                  position = data[x]["position"],
                                  eval_id = data[x]["eval_id"],
                                  question_id =  data[x]["question_id"],
                                  image_path = data[x]["image"],
                                  count = data[x]["count"],
                                  office = data[x]["department"],

                                  ok = 'Pending';

                            const cd = `
                                    <tr class="inbox__item intro-x bg-white hover:bg-gray-100 transition duration-150 ease-in-out">
                                        <td class="inbox__item--time py-3 px-4 whitespace-nowrap">
                                            <button id="btn_survey_list" class="btn_survey_list"  data-question_id="${question_id}" data-eval_id="${eval_id}" data-identificator="${id}"><i id="survey_list" class="fa fa-users text-success"></i></button>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                        <div class="w-9 h-9 image-fit zoom-in">
                                            <img alt="Midone - HTML Admin Template" class="rounded-lg border-white shadow-md tooltip" data-action="zoom" src="${image_path}">
                                                </div>
                                                    <div class="ml-4 mr-auto">
                                                        <div class="font-medium">${evaluator}</div>
                                                    <div class="text-slate-800 text-xs mt-0.5 normal-case">${position}</div>
                                                </div>
                                        </div>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap count_td">
                                            ${count}
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                           ${office}
                                        </td>

                                    </tr>`;

                                survey_tb.row.add($(cd)).draw();
                        }
                    }
                }
            }
        });
    }
});

//accessible function in any scripts global function
$.fn.extend({

    savedSurvey: function(question,evaluatee,evaluator,title,temp_survey_id,evlauatorid,training_date,training_accomplishment)
    {
        $.ajax({
            url: bpath + 'employee_ratings/saved/created/survey-data',
            type: "POST",
            data: {_token,question,evaluatee,evaluator,title,temp_survey_id,evlauatorid,training_date,training_accomplishment},
            dataType: 'json',

            success:function(response){
                if(response.status == true)
                {
                    __notif_show(1,'',response.message);
                }else
                {
                    __notif_show(-1,'',response.message);
                }
            }

        });
    }
});

//global function to temporarily store data of the questionaaire and its id
$.fn.extend({

    StoreValues: function(){
        $("#survey_tbody tr").each(function(i)
        {
            let  question = $(this).find("td #question_textarea").val(),
                 temp_id = $(this).find("td #survey_id").text();

                if((temp_question.globalQuestion[i]!=question && temp_survey_id.globalSurveyId[i]!=temp_id))
                {
                    temp_question.globalQuestion.push(question);
                    temp_survey_id.globalSurveyId.push(temp_id);
                }
        });
    }
});

//intialize the functions
window.customFunction = $.fn.savedSurvey;
window.store_survey_question = $.fn.StoreValues;
window.loadEvaluatorData = $.fn.loadEvaluator;


//**=============================================**//
function load_dataTable()
{
    try{
		/***/
        survey_tb = $('#tbl_question_list').DataTable({
            dom:
            "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
            "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
            "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
        renderer: 'bootstrap',
        "info": false,
        "bInfo": true,
        "bJQueryUI": true,
        "bProcessing": true,
        "bPaginate": true,
        "aLengthMenu": [[10, 25, 50, 100, 150, 200, 250, 300, -1], [10, 25, 50, 100, 150, 200, 250, 300, "All"]],
        "iDisplayLength": 10,
        "aaSorting": [],

        // Your columnDefs and other configuration options go here

        // Custom classes for DataTable elements
        "sDom": '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
        "sPaginationType": "full_numbers",
		});
	}catch(err){
        console.log(err);
     }
}
//**=============================================**//

//load the data of the check editor
function check_editor()
{
        ClassicEditor
        .create(document.querySelector('#editor_textarea_survey'), {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            language: 'en'
        })
        .then(editor => {
            survey_content = editor
        })
        .catch(error => {
            console.error('Error initializing editor:', error);
        });
}
//initalize the select 2
function load_survey_select2()
{
    $('#rc_survey').select2({
        placeholder: "Select evaluator",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#target_survey').select2({
        placeholder: "Select evaluatees",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#competencies_list').select2({
        placeholder: "Select Competencies",
        closeOnSelect: true,
        allowClear:true,
    });
}

//**=============================================**//
//read the enter keys on the keyboard
function press_enter_survey()
{
    $('#editor').keypress(function(event){

        let keycode = event.keyCode || event.which;
        let survey_val = survey_content.getData();

        if(keycode == 13)
        {
            append_survey_question(survey_val);
            load_ratingVal();
            survey_content.setData('');
        }
    });
}

//append the value of the checked editor in the table
function append_survey_question(val)
{
    let cd ='',temp_id = 0;

    cd = '<tr class="tr_clone">'+
         '<td hidden><label id="survey_id">'+temp_id+'</label></td>' +
         '<td><label id="question_survey"  class="question_survey w-20" editable-label contenteditable="true">'+val+'</label></td>' +
         '<td hidden><textarea id="question_textarea" class="question_textarea">'+val+'</textarea></td>' +
         '<td> <button class="ml-2" id="btn_delete_survey_questionnaire_val" type="button"> <i class="fa fa-trash-alt"></i> </button> </td>'+
        '</tr>' + '';

        $("#survey_tbody").append(cd);
}

//delete the selected row
function delete_survey_row()
{
    $("body").on('click','#btn_delete_survey_questionnaire_val',function(){

        let id = $(this).closest('tr').find("td #survey_id").text();

        if(id!==0 || id!==null)
        {
            deleteQuestionnaire(id);
            $(this).closest('tr').remove();
        } else
        {
            $(this).closest('tr').remove();
        }
    });
}

//saved the data when the button saved is click and validate before saving
function saved_survey_training()
{
    $("#btn_save_survey_training").on('click',function(){
        let target_survey = 'target_survey', rc_survey = 'rc_survey';
        let evaluator = $("#rc_survey").val(),evaluatee = $("#target_survey").val();
        let title = $("#title_training_course").val(),
            training_date = $("#date_survey_training").val(),
            training_accomplishment = $("#date_survey_accomplishment").val();

        if(triggetUpdate.globalValue === "Saved")
            {
                if(validate_survey_dept(rc_survey,"Select Evaluator"))
                {
                    if(validate_survey_dept(target_survey,"Select Evaluatee"))
                    {
                        if(count_survey_row())
                        {
                                store_survey_question();
                                customFunction(temp_question.globalQuestion,evaluatee,evaluator,title,temp_survey_id.globalSurveyId,temp_evaluator_id,training_date
                                    ,training_accomplishment);
                                $('#survey_question_table tbody tr').detach();
                                $("#form_survey")[0].reset();
                                survey_content.setData('')
                                clear_array_fields();
                                create_modal_survey.globalModal.hide();
                                loadEvaluatorData();
                                load_survey_select2();
                        }
                    }

                }
             }
    });
}

//cancel the survey modal
function cancel_survey_modal()
{
    $("#btn_cancel_survey_modal").on('click',function(){

        // $('#survey_question_table tbody tr').detach();
        $('#survey_question_table tbody').empty();
        $("#form_survey")[0].reset();
        load_survey_select2();
        clear_array_fields();
        survey_content.setData('');
    });
}

//clear the content of the array
function clear_array_fields()
{
    temp_question.globalQuestion = [];
    temp_survey_id.globalSurveyId = [];
}
//**=============================================**//


//**=============================================**//
//validate the input of department
function validate_survey_dept(id,placeholder)
{
    let current_val = $('#'+id).val();

    if(current_val!='')
    {
      $('#'+id).select2({
            placeholder: placeholder,
            closeOnSelect: true,
            allowClear:true,
        });
        return true;

    } else
    {
        $('#'+id).select2({
            theme: "error",
            placeholder: placeholder,
        });
        return false;
    }
}
//**=============================================**//
//count the table
function count_survey_row()
{
    let row = $("#survey_question_table tr").length;

    if(row!=1)
    {
        return true;
    } else
    {
        __notif_show(-1,'','Please indicate your survey');
        return false;
    }
}
//**=============================================**//
//show list of evaluators
function load_employee_evaluator()
{
    let cd = '';

       $("#rc_survey").append('');
       $("#target_survey").append('');

    $.ajax({
        url: bpath + "employee_ratings/load/evaluators",
        type: "POST",
        data:{_token},

        success:function(response)
        {
            if(response!='')
            {
                let data = JSON.parse(response);

              if(!$.isEmptyObject(data))
              {
                if(data.length > 0)
                {
                    for(x=0;x<data.length;x++)
                    {
                        let name = data[x]['name'],
                            id = data[x]["agency_id"];

                        cd = '' +
                        '<option value="">  </option>'
                        + '<option value="'+id+'"> '+name+' </option>';

                           $("#rc_survey").append(cd);
                           $("#target_survey").append(cd);
                    }
                }
              }
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//load the competency list
function load_competencyList()
{
    let cd = '';
    $("#competencies_list").append('');

    $.ajax({
        url: bpath + 'employee_ratings/load/competencies',
        type: 'POST',
        data: {_token},

        success:function(response){

            if(response!='')
            {
                let data = JSON.parse(response);

                if(data.length>0)
                {
                    for(x=0;x<data.length;x++)
                    {
                        let id = data[x]['id'],
                            skill = data[x]['skill'];

                        cd = '' + '<option value=""selected></option>' +
                                  '<option value='+id+'>'+skill+'</option>' + '';

                        $("#competencies_list").append(cd);
                    }
                }
            }
        }
    });
}

//load the rating list
function load_ratingVal()
{
    let cd = '';
    $(".rating_list").empty();
    $.ajax({
        url: bpath + 'employee_ratings/load/rating',
        type: 'POST',
        data: {_token},

        success:function(response)
        {
            if(response!='')
            {
                let data = JSON.parse(response);

                if(data.length>0)
                {
                    for(x=0;x<data.length;x++)
                    {
                        let rating = data[x]['rating'],
                            id = data[x]['id'];

                            cd  = ''+ '<option value=""selected></option>' +'<option value='+id+'>'+rating+'</option>' + '';
                            $(".rating_list").append(cd);
                    }
                }
            }

        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//**=============================================**//
//display the selected competency list
function select_competencyList()
{
    $("#competencies_list").on('select2:select',function(){
        let comp = $("#competencies_list").find(':selected').text();

        survey_content.setData(comp);
    });
}

//**=============================================**//

//responsible for displaying the information
function displayEvaluatee(evaluator_id,filter_val)
{
    showLoading();
    $("#evaluatee_dt").empty();
    $.ajax({
        url: bpath + "employee_ratings/display/evaluator/list",
        type: "POST",
        data: {_token,evaluator_id,filter_val},
        data_type: "json",

        success:function(response)
        {
            if(response !== '' || response !== null)
            {
                let data = JSON.parse(response);

                if(data.length > 0)
                {
                    for(let x=0;x<data.length;x++)
                    {
                        let id = data[x]["id"],
                            ref_id = data[x]["ref_id"],
                            profile = data[x]['profile'],
                            position = data[x]['position'],
                            title = data[x]['title'],
                            full_title = data[x]["full_title"],
                            date = data[x]["date"],
                            image = data[x]["image"],
                            status = data[x]["status"],
                            status_id = data[x]["status"],
                            agency_id = data[x]["agency_id"],
                            training_date = data[x]["training_date"],
                            training_accomplishment = data[x]["training_accomplishment"],
                            color_stat = '';

                            if(status == 15)
                            {
                                color_stat = "text-primary";
                                status = "Ongoing";
                            } else if (status == 1)
                            {
                                color_stat = "text-pending";
                                status = "Pending";
                            } else
                            {
                                color_stat = "text-success";
                                status = "Rated";
                            }


                        const cd = `<tr class="inbox__item intro-x bg-white hover:bg-gray-100 transition duration-150 ease-in-out ">
                                    <td><div class="flex items-center">
                                        <div class="w-9 h-9 image-fit zoom-in">
                                            <img alt="Midone - HTML Admin Template" class="rounded-lg border-white shadow-md tooltip" data-action="zoom" src="${image}">
                                                </div>
                                                    <div class="ml-4 mr-auto">
                                                        <div class="font-medium">${profile}</div>
                                                    <div class="text-slate-800 text-xs mt-0.5 normal-case">${position}</div>
                                                </div>
                                        </div>
                                    </td>
                                    <td>
                                        <a href="javascript:;" class="tooltip" title="${full_title}">${title}</a>
                                    </td>
                                    <td class="font-semibold">${date}</td>
                                    <td class="${color_stat}">${status}</td>
                                    <td>
                                        <div class="flex justify-center items-center">
                                            <a id="btn_send_request" target="_blank"  class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip btn_send_request" data-evaluatee_id="${id}" data-evaluatee_ref_id="${ref_id}" data-send_status="${status_id}" title="Send" data-tw-toggle="modal" data-tw-target="#btn_send_evaluator_request"><i class="fa-solid fa-paper-plane text-success fa-beat"></i></a>
                                            <div id="drop_down_evaluatee_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                            <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                             <div class="dropdown-menu w-40 zoom-in tooltip">
                                                 <div class="dropdown-content">
                                                 <a target="_blank" href="/employee_ratings/load/evaluatee/information-page/${id}/${agency_id}/${ref_id}" class="w-full dropdown-item btn_details_evaluatee"><i class="fa fa-circle-info text-success"></i> <span class="ml-2">Details</span> </a>
                                                 <button id="${evaluator_id_survey}" type="button" class="w-full dropdown-item btn_update_evaluatee" data-eval_id="${id}" data-agency_id="${agency_id}" data-title="${full_title}" data-ref_id="${ref_id}"  data-id_evaluator="${eval_Id.EvaluatorId}" data-training_date="${training_date}" data-training_accomplishment="${training_accomplishment}" data-rating_status="${status}" data-tw-toggle="modal" data-tw-target="#create_survey_modal"><i class="fa-regular fa-pen-to-square text-success"></i><span class="ml-2">Update</span></button>
                                                 <button id="${id}" type="button" class="w-full dropdown-item btn_delete_evaluatee" data-employee_status="${status_id}" data-delete_ref_id="${ref_id}" data-tw-toggle="modal" data-tw-target="#delete_evaluatee" ><i class="fa fa-trash text-danger"></i><span class="ml-2">Delete</span></button>
                                                 </div>
                                             </div>
                                        </div>
                                    </td>
                                   </tr>`;

                        $("#evaluatee_dt").append(cd);
                    }
                }
                  else
                    {
                        const empty = `<tr inbox__item intro-x bg-white hover:bg-gray-100 transition duration-150 ease-in-out>
                                        <td class="text-center"><i class="fa-solid fa-magnifying-glass fa-bounce text-warning w-5 h-5"></i><label class="ml-4 font-bold">No data found please try again !</label></td>
                                    </tr>`;
                        $("#evaluatee_dt").append(empty);
                    }
            }
            hideLoading();
        }
    });
}


//trigger the button to display child info
function show_list()
{
    $("#tbl_question_list").on('click','.btn_survey_list',function(){

        //id of the evaluator
        evaluator_id_survey = $(this).data("eval_id");
        eval_Id.EvaluatorId = $(this).data("identificator");

        let tr = $(this).closest('tr');
        let row = survey_tb.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            survey_tb.rows().eq(0).each( function ( idx )
            {
                var row = survey_tb.row( idx );
                    if ( row.child.isShown() )
                    {
                        row.child.hide();
                    }
            });
                row.child(format(row.data())).show();
                tr.addClass('shown');
        }

    });
}

//responsible for the showing of data
function format()
{
        displayEvaluatee(evaluator_id_survey,filter_val);


        return `<div class="intro-y box p-5 mt-5">
                    <div class="font-bold mb-5 text-center">List of Evaluatee</div>
                        <div class="w-48 relative text-slate-500">
                            <select class="w-48 xl:w-auto form-select box ml-2 filter_evaluatee mb-4">
                                    <option value="15">Ongoing</option>
                                    <option value="18">Rated</option>
                                    <option value="1">Pending</option>
                            </select>
                    </div>
                    <div class="overflow-x-auto scrollbar-hidden pb-10">
                        <table id="evaluatee_dt" class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap font-bold">Name</th>
                                    <th class="whitespace-nowrap font-bold">Title</th>
                                    <th class="whitespace-nowrap font-bold">Date</th>
                                    <th class="whitespace-nowrap font-bold">Status</th>
                                    <th class="whitespace-nowrap font-bold">Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>`;
}

//filter the list
function filter_data()
{
    $("body").on('click','.filter_evaluatee',function(){
        filter_val = $(this).val();
        //display the data base on the status
        displayEvaluatee(evaluator_id_survey,filter_val);
    });
}

//trihher to update the saved button
function trigger_update()
{
    $("#btn_hiringopen_modal").on("click",function(){
        triggetUpdate.globalValue = "Saved";
    });
}

//**=================================================================== **//

//delete the survey questionnaire of the employee
function deleteQuestionnaire(id)
{
    $.ajax({
        url: bpath+"employee_ratings/delete/survey/questionnaire",
        type: "POST",
        data:{_token,id},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,'',response.message)

            }
            else if(response.status == false)
            {
                __notif_show(-1,'',response.message)
            } else
            {
                __notif_show(-1,'',response.message)
            }
        }
    });
}

//**=================================================================== **//

//pass the id to the global variable
function pass_delete_data()
{
    $("body").on("click",".btn_delete_evaluatee",function(){
        let delete_id = $(this).attr("id"),
            deleted_ref_id = $(this).data("delete_ref_id"),
            stat = $(this).data("employee_status");

            deleted_evaluatee_id = delete_id;
            deleted_evaluatee_ref_id = deleted_ref_id;
            deleted_status = stat;
    });
}

//trigger to perfomr the deletion
function trigger_delete()
{
    $("#delete_evaluatee_btn").on("click",function(){
        delete_evaluatee(deleted_evaluatee_id,deleted_evaluatee_ref_id,deleted_status);
        loadEvaluatorData();
        delete_evaluatee_modal.globalDelete.hide();
    });
}

//delete from the database
function delete_evaluatee(id,ref_delete_id,empStatus)
{
    $.ajax({
        url: bpath + "employee_ratings/delete/evaluatee/info",
        type: "POST",
        data:{_token,id,ref_delete_id,empStatus},
        dataType: "json",

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                deleted_evaluatee_id = '';
                deleted_evaluatee_ref_id = '';
            }
            else
            {
                __notif_show(-1,'',response.message);
                deleted_evaluatee_id = '';
                deleted_evaluatee_ref_id = '';
            }
        }
    });
}

//**============================================================================================ **/


//saved request to the database
function savedRequest(request_id,request_refid,message,sentStat)
{
    $.ajax({
        url: bpath + "employee_ratings/send/evaluator/request",
        type: "POST",
        data:{_token,request_id,request_refid,message,sentStat},
        dataType: "json",

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                displayTrailList();
                loadEvaluatorData();
            }
            else
            {
                __notif_show(-1,'',response.message);
            }
        }
    });
}

//send request to the evaluator
function cancel_request_form()
{
    $("#btn_cancel_request_form").on("click",function(){
        request_id.globalId = '';
        request_refId.globalRefId = '';
        $("#request_form")[0].reset();
    });
}

//initialize the refference ID
function refferenceId()
{
    $("body").on("click",".btn_send_request",function(){

        let rating_id = $(this).data("evaluatee_id"),
            survey_refId = $(this).data("evaluatee_ref_id"),
            requestStat = $(this).data("send_status");

            request_id.globalId = rating_id;
            request_refId.globalRefId = survey_refId;
            request_stat.globalStat = requestStat;
    });
}

//trigger the send of request in the evaluator
function sendRequest()
{
    $("#btn_send_request_form").on("click",function(){

        let message = $("#message").val(),
            message_id = "#message";

        if(check_message(message_id))
        {
            savedRequest(request_id.globalId,request_refId.globalRefId,message,request_stat.globalStat)
            $("#request_form")[0].reset();
        }

    });
}

//check the mesasge content
function check_message(id)
{
    if($(id).val().trim()!=='' && $(id).val().trim()!==null )
    {
        $(id).css('border-color','#e2e8f0');
        return true;
    } else
    {
        $(id).css('border-color','#ff0000');
        return false;
    }
}


//display trail
function displayTrailList()
{
    $("#trail_list").empty();

    $.ajax({
        url: bpath + "employee_ratings/display/trial/list/",
        type: "GET",
        data:{_token},

        success:function(response)
        {
            if(response!='')
            {
                let data =JSON.parse(response);

                if(data.length>0)
                {
                    console.log(data);
                    for(let x=0;x<data.length;x++)
                    {
                        let request_status = '',text_color = '';

                        const id = data[x]["id"],
                              evaluator = data[x]["evaluator"],
                              evaluatee = data[x]["evaluatee"],
                              createdBy = data[x]["createdBy"],
                              status = data[x]["status"],
                              message = data[x]["message"];


                        if(status == 1)
                        {
                            request_status = 'sent';
                            text_color = "bg-pending";
                        }
                        else if(status == 18)
                        {
                            request_status = 'received'
                            text_color = "bg-success";
                        }

                        const  cd = `
                                <div class="relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                                <div class="intro-x relative flex items-center mb-3">
                                    <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5 zoom-in">
                                        <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden tool-tip" title="${evaluator}">
                                            <img alt="Midone - HTML Admin Template" src="${createdBy}">
                                        </div>
                                    </div>
                                    <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                                        <div class="flex items-center">
                                            <div class="font-semibold">Ratee:<span class="font-semibold ml-2">${evaluatee}</span></div>
                                            <div class=" py-1 px-2 text-slate-500 ml-auto rounded-full text-xs text-white cursor-pointer font-medium ${text_color}">${request_status}</div>
                                        </div>
                                        <div class="text-slate-500 mt-1">Messages:<span class="font-semibold ml-2">${message}</span></div>
                                    </div>
                                </div>`;

                        $("#trail_list").append(cd);
                    }
                }

            }
        }

    });
}









