var _token = $('meta[name="csrf-token"]').attr('content');
var Idemployee='',surveyTitle='',employeeId='',refId='',EvaluatorId='',training_date_update = '',
    training_accomplishment_update = '';
var ratedStatus = {globalRatedStatus:""};

$(document).ready(function (){

    bpath = __basepath + "/";

     removeDataHolder();
     addDataholder();
     OpenUpdate_modal();
     update_data();

     //trigeer to rate the employee
     rateEmployee();

});
/**remove the place holder in the evaluatee page info**/
function removeDataHolder()
{
    $("body").on("focus",".other_specify_rate",function(){

        let val = $(this).text();

        if(val !== null || val!=="")
        {
            $(this).removeAttr("data-placeholder");
        }

    });
}

//**==========================================================**//

/**add the place holder in the evaluatee page info**/
function addDataholder()
{
    $("body").on("focusout",".other_specify_rate",function(){

        let val = $(this).text();

        if(val === null || val==="")
        {
            $(this).attr("data-placeholder","Place your rate");
        }
    });
}

 //**======================================================================**//

/**trigger the modal to open**/
function OpenUpdate_modal()
{
    $("body").on("click",".btn_update_evaluatee", function(){

            //initialize the variable
            Idemployee = $(this).attr("id");
            EvaluatorId = $(this).data("id_evaluator");
            surveyTitle = $(this).data("title");
            employeeId = $(this).data("agency_id");
            rating_status = $(this).data("rating_status");
            refId = $(this).data("ref_id");
            training_date_update = $(this).data("training_date");
            training_accomplishment_update = $(this).data("training_accomplishment");
            ratedStatus.globalRatedStatus  = rating_status;
            __dropdown_close("#drop_down_evaluatee_close");
            //clear the value of the temporary variable
            temp_question.globalQuestion = [];
            temp_survey_id.globalSurveyId = [];

            triggetUpdate.globalValue = "Update";
            $("#title_training_course").val(surveyTitle);
            $("#date_survey_training").val(training_date_update),
            $("#date_survey_accomplishment").val(training_accomplishment_update);
            //display the profile info and survey question of the eveluatee
            displayProfile(Idemployee,employeeId);
            displaySurvey_questionnaire(refId);
    });
}

//**==========================================================**//

/**triger to show the evaluator**/
function displayProfile(id,eval_id)
{
    $.ajax({
        url: bpath + "employee_ratings/display/evaluator",
        type: "POST",
        data:{_token,id,eval_id},

        success:function(response)
        {
            if((response.evaluator!=='' || response.evaluator!==null) && (response.evaluatee!=='' || response.evaluatee!==null))

            $("#rc_survey").val(response.evaluator).trigger("change");
            $("#target_survey").val(response.evaluatee).trigger("change");
        }

    });
}

/**triger to show the survey questionnaire details**/
function displaySurvey_questionnaire(ref_id)
{
    $('#survey_question_table tbody').empty();
    $.ajax({
        url: bpath + "employee_ratings/display/survey/questionnaire",
        type: "POST",
        data:{_token,ref_id},

        success:function(response)
        {
            if(response!=='' || response!==null)
            {
                let data = JSON.parse(response);

                if(data.length>0)
                {
                    for(let x=0;x<data.length;x++)
                    {
                        let id  = data[x]["id"],
                            indicators = data[x]["indicators"];

                        const cd =  `
                                    <tr>
                                        <td hidden><label id="survey_id">${id}</label></td>
                                        <td><label id="question_survey"  class="question_survey w-20" contenteditable="true">${indicators}</label></td>
                                        <td hidden><textarea id="question_textarea" class="question_textarea">${indicators}</textarea></td>
                                        <td><button class="ml-2" id="btn_delete_survey_questionnaire_val" type="button"> <i class="fa fa-trash-alt"></i></button></td>
                                    </tr>`;

                        $("#survey_tbody").append(cd);
                    }
                }
            }
        }

    });
}

//**==========================================================**//

/**trigger the data to be updated in the database**/
function update_survey(question,title,refer_id,questionId,target_emp,evaluator,eval_id,training_date,accomplishment_date,stat)
{
    $.ajax({
        url: bpath + "employee_ratings/update/evaluatee/data",
        type: "POST",
        data:{_token,question,
               title,refer_id,
               questionId,target_emp,
               evaluator,eval_id,training_date
               ,accomplishment_date,stat},
        dataType: "json",

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                loadEvaluatorData();
            }
            else if(response.status === false)
            {
                __notif_show(-1,'',response.message);
            }
            else
            {
                __notif_show(-1,'',response.message);
            }
        }

    });
}

/**event trigger to update data**/
function update_data()
{
    $("#btn_save_survey_training").on("click",function(){

        let target_survey = 'target_survey', rc_survey = 'rc_survey';

        let evaluator_details = $("#rc_survey").val(),
            evaluatee_details = $("#target_survey").val(),
            title_details = $("#title_training_course").val(),
            training_date_details = $("#date_survey_training").val(),
            accomplishment_date = $("#date_survey_accomplishment").val();

            if(triggetUpdate.globalValue === "Update")
                {
                    if(validate_survey_dept(rc_survey,"Select Evaluator"))
                    {
                        if(validate_survey_dept(target_survey,"Select Evaluatee"))
                        {
                            if(count_survey_row())
                            {
                                    store_survey_question();
                                    update_survey(temp_question.globalQuestion,title_details,refId,temp_survey_id.globalSurveyId,evaluatee_details,evaluator_details,EvaluatorId,training_date_details,accomplishment_date,ratedStatus.globalRatedStatus);
                                    //empty the table and clear its fields
                                    $('#survey_question_table tbody').empty();
                                    $("#form_survey")[0].reset();
                                    survey_content.setData('');
                                    create_modal_survey.globalModal.hide();
                                    EvaluatorId = '';
                                    employeeId = '';
                                    refId = '';
                            }
                        }
                    }
                }
    });
}
//**==========================================================**//

/*Responsible for the rating of the evaluation of the employee*/

function savedEvaluateeRatingData()
{
    var formData = $('#ratingEvaluationForm').serialize();

    $.ajax({
        type: "POST",
        url: bpath + "employee_ratings/get/evaluatee/rating",
        data:formData,

        success: function (response) {

            if(response.status === true)
            {
                __notif_show(1,'',response.message);

                setTimeout(function(){
                    window.location.href = response.redirect;
                },1000);
            }
            else
            {
                __notif_show(-1,'',response.message);

                setTimeout(function(){
                    window.location.href = response.redirect;
                },1000);
            }
        }
    });
}

/*Click event for the rating of the employee*/

function rateEmployee()
{
    $("#btn_rate_evaluatee").on("click",function(e){
        e.preventDefault();
        savedEvaluateeRatingData();
    });
}

//**==========================================================**//
//for the update of the rating of the employee

function updateEvaluateeRatingData()
{

}

