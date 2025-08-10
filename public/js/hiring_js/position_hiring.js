var  _token = $('meta[name="csrf-token"]').attr('content');
var filter = $("#filter_status").val();
var competencies_data_arr = [];
const myAccordion3 = tailwind.Accordion.getOrCreateInstance(document.querySelector("#faq-accordion-3"));
const myAccordion4 = tailwind.Accordion.getOrCreateInstance(document.querySelector("#faq-accordion-4"));
const myAccordion5_competencies = tailwind.Accordion.getOrCreateInstance(document.querySelector("#faq-accordion-3_competencies"));

$(document).ready(function(){

    bpath = __basepath + "/";

    load_select2();
    add_position();
    cancel_modal();
    check_text_length_remarks();

    //Added by Montz
    add_document_requirements();
    change_table_border_color();
    //trigger the select2 step
    trigger_salary();
    //triger the change in the input
    change_competencies_input();
    //add data using select2 to table
    save_slect2_competencies_input();
    //remove the data in the table
    remove_list_table();
    //enter the competencies data through input
    save_input_competencies();
    myAccordion3.hide();
    myAccordion4.hide();
    myAccordion5_competencies.hide();
    open_competencies_info();

    show_history_input_eligibility();

});


//trigger the open in the competencies================================================================================================================
function open_competencies_info()
{
    $("#faq-accordion-3_competencies").on('click',function(){
        $("#competency").val('').trigger("change");
    });
}

//show notification ===============================================================================================
function notification(message)
{
    __notif_show(1,message);
    const hiring_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#new_hiring_modal'));
    hiring_modal.hide();
}

// load the select2 ===============================================================================================
function load_select2()
{
    $('#position_title').select2({
        placeholder: "Select position title",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#salarygrade').select2({
        placeholder: "Select salary grade",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#position_type').select2({
        placeholder: "Select type of position",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#ratees').select2({
        placeholder: "Select list of panel",
        closeOnSelect: true,
    });

    $('#filter_status').select2({
        placeholder: "Select display position",
        closeOnSelect: true,
    });

    $('#hrmo_head').select2({
        placeholder: "Select the head of the HRMO",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#competency').select2({
        placeholder: "Select list of competencies",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#step').select2({
        placeholder: "Select step",
        closeOnSelect: true,
        allowClear:true,
    });

    $('#tranche').select2({
        placeholder: "Select tranche",
        closeOnSelect: true,
    });

    $('#eligibility').select2({
        placeholder: "Enter Eligibility",
        tags:true,
        allowClear:true,
        closeOnSelect: true,
    });

    $('#item_no').select2({
        placeholder: "Enter Plantilla no#",
        tags:true,
        allowClear:true,
        multiple:false,
        closeOnSelect: true,
    });

    $('#education').select2({
        placeholder: "Enter Education",
        tags:true,
        allowClear:true,
        multiple:false,
        closeOnSelect: true,
    });

    $('#training').select2({
        placeholder: "Enter training",
        tags:true,
        allowClear:true,
        multiple:false,
        closeOnSelect: true,
    });

    $('#work_ex').select2({
        placeholder: "work_ex",
        tags:true,
        allowClear:true,
        multiple:false,
        closeOnSelect: true,
    });
}

// validate the user input =================================================================================================================

    function assignment()
    {
        if ($("#assign").val().trim()!="")
        {
            $("#assign").css('border-color', '');
            return true;
        } else{
            $("#assign").css('border-color', '#ff0000');
            return false;
        }
    }

    // function salary()
    // {
    //         if ($("#monthly_salary").val().trim()!=" ")
    //         {
    //             $("#monthly_salary").css('border-color', '');
    //             return true;
    //         } else{
    //             $("#monthly_salary").css('border-color', '#ff0000');
    //             return false;
    //         }
    // }

    function check_salary()
    {
        if ($("#monthly_salary").val().trim()!="")
        {
            $("#monthly_salary").css('border-color', '');
            return true;
        } else{
            $("#monthly_salary").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_eligibilty()
    {
        if ($("#eligibility").val().trim()!="")
        {
            $("#eligibility").css('border-color', '');
            return true;
        } else{
            $("#eligibility").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_training()
    {
        if ($("#training").val().trim()!="")
        {
            $("#training").css('border-color', '');
            return true;
        } else{
            $("#training").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_workex()
    {
        if ($("#work_ex").val().trim()!="")
        {
            $("#work_ex").css('border-color', '');
            return true;
        } else{
            $("#work_ex").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_entrydate()
    {
        if ($("#date_entry").val().trim()!="")
        {
            $("#date_entry").css('border-color', '');
            return true;
        } else{
            $("#date_entry").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_remarks()
    {
        if ($("#remarks").val().trim()!="")
        {
            $("#remarks").css('border-color', '');
            return true;
        } else{
            $("#remarks").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_doc()
    {
        // if ($("#doc_req").val().trim()!="")
        // {
        //     $("#doc_req").css('border-color', '');
        //     return true;
        // } else{
        //     $("#doc_req").css('border-color', '#ff0000');
        //     return false;
        // }
        return true;
    }

    //validattion for drop down
    function check_position()
    {
        if($("#position_title").val().trim() != "")
        {
            $('#position_title').select2({
                placeholder: "Select Position title",
                closeOnSelect: true,
            });
            return true;

        }else{

            $('#position_title').select2({
                theme: "error",
                placeholder: "This field is required",
            });

            return false;
        }
    }

    function check_salarygrade()
    {
        if($("#salarygrade").val().trim()!= "")
        {
            $('#salarygrade').select2({
                placeholder: "Select Select Salary grade",
                closeOnSelect: true,
            });
            return true;
        }
         else{

            $('#salarygrade').select2({
                theme: "error",
                placeholder: "This field is required",
            });

            __notif_show(-1,'','Please fill the fields under the salary info')
            return false;
        }
    }

    function check_education()
    {
        if($("#education").val().trim() != "")
        {
            $("#education").css('border-color', '');
            return true;
        } else{
            $("#education").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_email_address()
    {
        if($("#email_address").val().trim() != "")
        {
            $("#email_address").css('border-color', '');
            return true;
        } else{
            $("#email_address").css('border-color', '#ff0000');
            __notif_show(-1,'','Please fill the fields under the contact info')
            return false;
        }
    }

    function check_address()
    {
        if($("#address").val().trim() != "")
        {
            $("#address").css('border-color', '');
            return true;
        } else{
            $("#address").css('border-color', '#ff0000');
            return false;
        }
    }

    function check_pos_type()
    {
        if($("#position_type").val().trim() != "")
        {
            $('#position_type').select2({
                placeholder: "Select Position type",
                closeOnSelect: true,
            });
            return true;
        } else{

            $('#position_type').select2({
                theme: "error",
                placeholder: "This field is required",
            });

            return false;
        }
    }

    function check_competency()
    {
        if ($("#competency").val() !="")
        {
            $('#competency').select2({
                placeholder: "Select list of competencies",
                closeOnSelect: true,
            });
            return true;
        } else{
                $('#competency').select2({
                theme: "error",
                placeholder: "This field is required",
            });
            return false;
        }
    }

    function check_hrmo()
    {
        if($("#hrmo_head").val()!= "")
        {
            $('#hrmo_head').select2({
                placeholder: "Select the head of the HRMO",
                closeOnSelect: true,
            });
            return true;
        } else{

            $('#hrmo_head').select2({
                theme: "error",
                placeholder: "This field is required",
            });

            return false;
        }
    }

    //validation for the history
function validate_history(id,placeholder)
{
    let select = $('#'+id).val();

        if(select!='')
        {
            $('#'+id).select2({
                placeholder: placeholder,
                tags:true,
                allowClear:true,
                multiple:false,
                closeOnSelect: true,
            });
            return true;
        } else
        {
            $('#'+id).select2({
                placeholder:placeholder,
                theme: "error",
                tags:true,
                allowClear:true,
                multiple:false,
                closeOnSelect: true,
            });

            return false;
        }
}

//check the lenght of the  text description
function check_text_length_remarks()
{
        $("#remarks").keyup(function(event){
            let text = $(this).val().length;
            $("#text_remark").text(text);

            if(text > 1000)
            {
                $("#remarks").css('border-color', ' #ff0000');

            } else if(text <= 1000){
                $("#remarks").css('border-color', '');

            } else if(text == 0){
                $("#remarks").css('border-color', '');

            }
        });
}

//function check length
function check_length()
{
    let remarks = $("#remarks").val();
        // doc_req = $("#doc_req").val(),
        // competency = $("#competency_details").val();

    if(remarks.length > 1000)
    {
        $("#remarks").css('border-color', ' #ff0000');
        return false;
    }
    else
    {
        $("#remarks").css('border-color', '');
        $("#doc_req").css('border-color', '');
        return true;
    }
}

//trigger the competencies enter in the form input to select 2
function change_competencies_input()
{
    $("#change_input_competencies").on('click',function(){

        if( $('#change_input_competencies').is(':checked') ){
            $("#competency_input").prop('hidden',false);
            $("#competency").select2().next().hide();
            $("#competency_input").val('');
        }
        else{
            $("#competency_input").prop('hidden',true);
            $("#competency").select2().next().show();
            $("#competency").select2().val('').trigger('change');
            $('#competency').select2({
                placeholder: "Select list of competencies",
                closeOnSelect: true,
            });
        }

    });
}

//save the competencies through select2 input
function save_slect2_competencies_input()
{
    $("#competency").on('select2:select',function(){
        let val = $('#competency').find(':selected').text();
        add_row_list_competencies(val);
    });
}

//save the data through the input
function save_input_competencies()
{
    $("#competency_input").keypress(function(event){
        let keycode = event.keyCode || event.which;
        let data = $("#competency_input").val();
        if(keycode == '13')
        {
            add_row_list_competencies(data);
        }
    });
}
//automatically add  row in the table
function add_row_list_competencies(val)
{
    let row = '',
        data = '0';

    row = '<tr>'+
            '<td hidden><label id="id_details" class="id_details">'+data+'</label></td>'+
            '<td><label id="comp_lbl_deatils" class="comp_lbl_deatils">'+val+'</label></td>'+
            '<td><button class="ml-2" id="btn_delete_competencies_list" type="button"> <i class="fa fa-trash-alt"></i> </button></td>'+
          '</tr>'+
          '';

          $("#competencies_tb").append(row);
}

//get the data from the data table
function get_comp_data_table()
{
    var temp_var = [];
    $("#competencies_tb tr").each(function(i){
        let data = $(this).find("td #comp_lbl_deatils").text();
        if(i!='')
        {
            if(temp_var[i]!=data)
            {
                temp_var.push(data);
            }

        }
    });
}

//remove the data form the table in the table list
function remove_list_table()
{
    $("body").on('click','#btn_delete_competencies_list',function(){
        $(this).closest('tr').remove();
    });
}

// checking of the input fields ===================================================================================================================================
 function add_position()
{
    $("#btn_save_position").on("click",function(){

        if(assignment())
        {
            if(check_position())
            {
                if(validate_history('item_no','Enter plantilla no'))
                {
                    if(validate_history('eligibility','Enter Eligibility'))
                    {
                        if(validate_history('education','Enter Education'))
                        {
                            if(validate_history('training','Enter training'))
                            {
                                if(validate_history('work_ex','Work related'))
                                {
                                    if(check_pos_type())
                                    {
                                        if(check_entrydate())
                                        {
                                            if(check_salarygrade())
                                            {
                                                if(check_salary())
                                                {
                                                    if(count_competencies_row())
                                                    {
                                                        if(check_email_address())
                                                        {
                                                            if(check_address())
                                                            {
                                                                if(check_hrmo())
                                                                {
                                                                    if(check_remarks())
                                                                    {
                                                                        if(check_doc())
                                                                        {
                                                                            if(check_length())
                                                                            {
                                                                                if(count_row())
                                                                                {
                                                                                    if(check_table_input())
                                                                                    {
                                                                                        if(btn_text.innerText == "Save")
                                                                                        {
                                                                                            save_hiring_position();
                                                                                            show_history_input_eligibility();
                                                                                        } else
                                                                                        {
                                                                                            update_data();
                                                                                            $("#competency_input").prop('hidden',true);
                                                                                            show_history_input_eligibility();
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

//close the modal and remove the red border
function cancel_modal()
{
    $("#btn_cancel_position").on('click',function(){
        btn_text.innerText = "Save";
        $("#pisition_form")[0].reset();
        load_select2();
        $("#assign").css('border-color', '');
        $("#monthly_salary").css('border-color', '');
        $("#item_no").css('border-color', '');
        $("#eligibility").css('border-color', '');
        $("#training").css('border-color', '');
        $("#work_ex").css('border-color', '');
        $("#competency").css('border-color', '');
        $("#date_entry").css('border-color', '');
        $("#remarks").css('border-color', '');
        $("#doc_req").css('border-color', '');
        $("#email_address").css('border-color', '');
        $("#address").css('border-color', '');
         //remove the append td
         $("#dt_job_documents td").remove();
         $("#competencies_tb td").remove();
         $('#dt_job_documents tbody tr').detach();

         myAccordion3.hide();
         myAccordion4.hide();
         myAccordion5_competencies.hide();
    });
}

// saved the data for position hiring ===================================================================================================================================
function save_hiring_position() {

    //competencies
    let temp_var = [];

    $("#competencies_tb tr").each(function(i){
        let data = $(this).find("td #comp_lbl_deatils").text();
        if(i!='')
        {
            if(temp_var[i]!=data)
            {
                temp_var.push(data);
            }

        }
    });

    //Document Requirements
    let td_doc_requirement = [],td_doc_requirement_type = [];

    $('input[name="td_doc_requirement[]"]').each(function (i, _doc_requirement) {
        if(!$(_doc_requirement).val() == "")
        {
            td_doc_requirement[i] = $(_doc_requirement).val();
        }
    });

    $('input[name="td_doc_requirement_type[]"]').each(function (i, _doc_requirement_type) {
        if(!$(_doc_requirement_type).val() == "")
        {
            td_doc_requirement_type[i] = $(_doc_requirement_type).val();
        }
    });

    let assign = $("#assign").val(),
        position_title = $("#position_title").val(),
        salarygrade = $("#salarygrade").val(),
        monthly_salary = $("#monthly_salary").val(),
        item_no = $("#item_no").val(),
        eligibility = $("#eligibility").val(),
        education = $("#education").val(),
        training = $("#training").val(),
        work_ex = $("#work_ex").val(),
        competency = $("#competency").val(),
        position_type = $("#position_type").val(),
        date_entry = $("#date_entry").val(),
        ratees = $("#ratees").val(),
        remarks = $("#remarks").val(),
        hrmo = $("#hrmo_head").val(),
        email_ad = $("#email_address").val(),
        address = $("#address").val();
        step = $("#step").val();
        qulaification = $("#qulaification").val();
        applicants = $("#applicants").val();

    //split the date
    const split_from = date_entry.split("-");

    $.ajax({

        type: "POST",
        url: bpath + "hiring/save-position",
        data:{assign:assign,
            position_title:position_title,
            salarygrade:salarygrade,
            monthly_salary:monthly_salary,
            item_no:item_no,
            eligibility:eligibility,
            education:education,
            training:training,
            work_ex:work_ex,
            competency:competency,
            position_type:position_type,
            hrmo:hrmo,
            post_date:split_from[0],
            close_date:split_from[1],
            ratees:ratees,
            remarks:remarks,
            td_doc_requirement,
            td_doc_requirement_type,
            email_ad,
            step,
            address,
            temp_var,
            qulaification,
            applicants,
            _token:_token},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                notification(1,'',response.message);
                $("#pisition_form")[0].reset();
                load_select2();
                filter = 13;
                $("#filter_status").val(filter).trigger("change");
                display_hiring_position(filter);
                //remove the append td
                $('#dt_job_documents tbody tr').detach();
                $("#competencies_tb td").remove();
                myAccordion3.hide();
                myAccordion4.hide();
                myAccordion5_competencies.hide();
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}


//get the salary based on the step
function get_monthly_salary(sg,step)
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/get-salaries",
        data: {_token,sg,step},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                // let get_salary = JSON.stringify(response.message).slice(10).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
                let get_salary = response.message;
                $("#monthly_salary").val(get_salary);
            }
        }
    });
}
//trigger the select 2 to get the salary
function trigger_salary()
{
    $("#step").on('select2:select',function()
    {
        let sg = $("#salarygrade").val(),
            step = $("#step").val();

            get_monthly_salary(sg,step);
    });
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
        '<tr class="hover:bg-gray-200">'+
            '<td style="width:"><input  id="doc_requirement_input" name="td_doc_requirement[]" type="text" class="form-control" placeholder="Document requirements"></td>'+
            '<td style="width:"><input  id="doc_requirement_type_input" name="td_doc_requirement_type[]" type="text" class="form-control" placeholder="Type of document requirements"></td>'+
            '<td style="width: 10%">' +
                '<div class="flex justify-center items-center">' +
                '<a href="javascript:void(0);" class="delete text-center"><i  class="w-4 h-4 text-danger fa-solid fa-trash"></i></a>' +
                '</div>'+
            '</td>'+
        '</tr>';

    $('#dt_job_documents tbody').append(tr);
};

//count the row and check if there are no row available
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

function count_competencies_row()
{
    row = $("#competencies_tb tr").length;

    if(row == '1')
    {
        __notif_show(-1,"Please fill up Competencies requirements");
        return false;
    }

    return true;
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

//update the save input
function show_history_input_eligibility(type)
{
    let cd = '';

    $.ajax({
        url: bpath + 'hiring/display/history/input',
        type: 'GET',
        data:{_token,type},

        success:function(response)
        {
            $("#eligibility").html('<option value="" selected></option>');
            $("#item_no").html('<option value="" selected></option>');
            $("#education").html('<option value="" selected></option>');
            $("#training").html('<option value="" selected></option>');
            $("#work_ex").html('<option value="" selected></option>');

            if(response != '')
            {
                let data  = JSON.parse(response);

                if(!$.isEmptyObject(data))
                {
                    if(data.length > 0)
                     {
                            for(x=0;x<data.length;x++)
                            {
                                let  option = data[x]['option'];

                                cd = '' +
                                    '<option value="'+option+'">'+option+'</option>'

                                    $("#eligibility").append(cd);
                                    $("#item_no").append(cd);
                                    $("#education").append(cd);
                                    $("#training").append(cd);
                                    $("#work_ex").append(cd);
                            }
                    }
                }

            }
        }
    });
}







