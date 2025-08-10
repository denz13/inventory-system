var _token = $('meta[name="csrf-token"]').attr('content');
var  open = false,ids,ref_num,applicant_id,shortlisted_id;
var btn_save_applicant_text = document.getElementById("btn_save_applicant_info");
const myAccordion = tailwind.Accordion.getOrCreateInstance(document.querySelector("#faq-accordion-2"));
const applicant_details_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#applicant_details'));

$(document).ready(function(){

    bpath = __basepath + "/";

    load_drop_down_status();
    short_listed();
    applicant_details();
    open_accordion();
    cancel_modal();
    save_info();
    filter();
    enable_date();
});



function load_drop_down_status()
{
    $('#status_details').select2({
        placeholder: "Update the status",
        closeOnSelect: true,
    });

    $('#filter').select2({
        placeholder: "Change status",
        closeOnSelect: true,
    });

    $('#exam_result').select2({
        placeholder: "Select the examination result",
        closeOnSelect: true,
    });

}
function load_table(id)
{
    try{
		/***/
		 $(id).DataTable({
			dom:
				"<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
				"<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
				"<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
			renderer: 'bootstrap',
			"info": false,
		    "bInfo":true,
		    "bJQueryUI": true,
		    "bProcessing": true,
		    "bPaginate" : true,
		    "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
		    "iDisplayLength": 10,
		    "aaSorting": [],

            // columnDefs:
            //     [
            //         { className: "dt-head-center", targets: [] },
            //     ],
		});
	}catch(err){
        console.log(err);
     }
}

//load the data of short listed applicant
function short_listed(stat)
{
    let table_id = '#tb_short_listed';

    $.ajax({
        type: "GET",
        url: bpath = "/hiring/short-listed-list",
        data: {_token,stat},

        success:function(response)
        {
            $('#short_listed_table').html(response);
            load_table(table_id)
        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}


function applicant_details()
{
    $("body").on("click",".btn_details_data",function()
    {
        let id = $(this).attr("id");
        var applicants_id = $(this).data("applicant_id");
        var jobref_num = $(this).data("ref-num");
        let applicants_name = $(this).data("name");
        var position =  $(this).data("job");
        let aggency = $(this).data("agency");
        let comments = $(this).data("comments");
        let status_code = $(this).data("status");
        let date_applied = $(this).data("date-applied");
        let approved_by = $(this).data("approved");
        let approval_date = $(this).data("date-approved");
        let image = $(this).data("image");

        //change the color
        console.log(status_code);
        if(status_code == "Approved")
        {
            $("#status").css("color","#8DCE2A");
        }
        else if (status_code == "Waiting")
        {
            $("#status").css("color","#F38331");
        }

        //get the rate sched and status
        if(status_code == "Waiting")
        {
            let rate_sched = $(this).data("rate-sched"),
                stat = $(this).data("stat"),
                shortlisted = $(this).data("shortlisted-id"),
                exam_result = $(this).data("exam");

                $("#appointment_shcedule").val(rate_sched);
                $("#status_details").val(stat).trigger("change");
                $("#exam_result").val(exam_result).trigger("change");

                //change the button text
                btn_save_applicant_text.innerText = 'Update';
                shortlisted_id = shortlisted;

        } else
        {
            //clear the date input
            $("#appointment_shcedule").val('')
            btn_save_applicant_text.innerText = 'Save';
        }

        //load the applicant details in the modal
        $("#applicant_name").text(applicants_name);
        get_applied_position(position);
        $("#assign_aggency").text(aggency);
        $("#coments").text(comments);
        $("#status").text(status_code);
        $("#date-applied").text(date_applied);
        $("#approve_by").text(approved_by);
        $("#approval-date").text(approval_date);
        $("#image").attr("src",image);

        applicant_id = id;
        ids = applicants_id;
        ref_num = jobref_num;

        applicant_details_modal.show();
        myAccordion.hide();

    });
}

function get_applied_position(ref_num)
{
    $.ajax({
        type: "POST",
        url : bpath = "/hiring/get-applicant-position",
        data: {_token,ref_num},
        dataType: "json",

        success: function(response)
        {
            if(response.status == true)
            {
                console.log(response.message);
                position = JSON.stringify(response.message).slice(15).replace(/[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
                $("#applied_position").text(position);
            }
        }
    });
}


//click the hide or open
function open_accordion()
{
    $("#faq-accordion-2").on("click",function(){

        let status = $("#status").text();

        if(status === "Approved" )
        {
            $("#exam_result").prop('disabled', false);
        }
         else if(status === "Waiting" )
         {
            $("#exam_result").select2('enable',false);
         }

        open = true;
    });
}


//validate the date
function validate_date(sched)
{

    if($(sched).val().trim() != "")
    {
        $(sched).css('border-color', '');
        return true;

    }
    else if($(sched).val().trim() == "")
    {
        $(sched).css('border-color', '#ff0000');
        return false;
    }

}

//validate the status
function validate_status(status)
{
    if($(status).val().trim() != "")
    {
        $(status).select2({
            placeholder: "Update the status",
            closeOnSelect: true,
        });
        return true;
    }
    else if($(status).val().trim() == "")
    {
        $(status).select2({
            theme: "error",
            placeholder: "This field is required",
        });
        return false;
    }
}

//check the if pass or failed
function enable_date()
{
    
    $("#exam_result").on("change",function(){
        let result =  $(this).val();

        console.log(result);

        if(result == "16")
        {
            $("#appointment_shcedule").prop("disabled",false);
        }
        else if(result == "17")
        {
            $("#appointment_shcedule").prop("disabled",true);
            $("#appointment_shcedule").val('');
        }

    });
}

//cancel the modal
function cancel_modal()
{

    $("#btn_cancel_applicant_modal").on('click',function(){
        $("#status_details").val(null).trigger('change');
        $("#exam_result").val(null).trigger('change');
        $("#appointment_shcedule").val('');
        $("#notes").val('');
        myAccordion.hide();
    });
}

//saved the application
function save_info()
{
    let sched = "#appointment_shcedule",status = "#status_details",exam = "#exam_result",
        stat = '';

    $("#btn_save_applicant_info").on("click",function(){

        if(open == true)
        {
            if(validate_date(sched))
            {
                if(validate_status(exam))
                {
                    if(validate_status(status))
                    {
                        if(btn_save_applicant_text.innerText == 'Save')
                        {
                            stat = "11";
                            appoint_sched();
                            update_list(applicant_id);
                            short_listed(stat);
                            myAccordion.hide();
                            open = false;
                            $("#status_details").val(null).trigger('change');
                            $("#exam_result").val(null).trigger('change');
                            $("#appointment_shcedule").val('');
                            $("#notes").val('');
                            applicant_details_modal.hide();
                        }
                        else
                        {
                            stat = "10";
                            update_shorlisted_applicant(shortlisted_id);
                            short_listed(stat);
                            myAccordion.hide();
                            open = false;
                            $("#status_details").val(null).trigger('change');
                            $("#appointment_shcedule").val('');
                            $("#notes").val('');
                            applicant_details_modal.hide();
                        }

                    }
                }

            }
        }else
        {
            __notif_show(-1,"Please Click the edit first");
        }

    });
}

//save the applicant details the applicant details
function appoint_sched()
{
    let notes = $("#notes").val(),
        date = $("#appointment_shcedule").val(),
        stat = $("#status_details").val(),
        exam = $("#exam_result").val(),
        applied_date = $("#date-applied").text();

        console.log(exam);

    $.ajax({
        type: "POST",
        url: bpath="/hiring/applicant-rating-sched",
        data: {_token,ref_num,ids,notes,date,stat,applied_date,exam},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,"",response.message);
            } else
            {
                __notif_show(-1,response.message);
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}

//update the shortlisted applicant
function update_shorlisted_applicant(id)
{
    let notes = $("#notes").val(),
        date = $("#appointment_shcedule").val(),
        stat = $("#status_details").val();

    $.ajax({
        type: "POST",
        url: bpath = "/hiring/update-shortlisted-applicant",
        data:{_token,id,notes,date,stat},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,"",response.message);
            }
            else
            {
                __notif_show(-1,response.message);
            }
        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}

//update the status in the applicant list
function update_list(id)
{
    let stat = $("#status_details").val();
    $.ajax({
        type: "POST",
        url: bpath="/hiring/update-applicant-status",
        data:{_token,id,stat},
        dataType: "json",
    });
}

//============================================================================
function filter()
{
    $("#filter").on('change',function(){

        let stat = $(this).val();
        short_listed(stat);
    });

}


