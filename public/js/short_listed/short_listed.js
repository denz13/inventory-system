var _token = $('meta[name="csrf-token"]').attr('content');
var  open = false,ids,ref_num,applicant_id,shortlisted_id,date_val,update_status;
var btn_save_applicant_text = document.getElementById("btn_save_applicant_info");
var table,jobref,applicant_emails;
var email_user = {GlobalUser:''};
var filter_status_data;
var filepond_send_mail = FilePond.find(document.getElementById(email_attachments));
const myAccordion = tailwind.Accordion.getOrCreateInstance(document.querySelector("#Stat_info"));
const myAccordion_attachments = tailwind.Accordion.getOrCreateInstance(document.querySelector("#Attachments"));
const myAccordion_edit = tailwind.Accordion.getOrCreateInstance(document.querySelector("#edit_applicant"));
const applicant_details_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#applicant_details'));
const send_email_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_email_notification'));

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
    open_child_rows();
    show_child_details();
    format();
    //for email notification functions
    send_email_notif();
    open_send_email_modal();
    cancel_send_email_modal();
});

//initialize the select2
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

//load the datatble
function load_table()
{
    try{
		/***/
		 table = $('#tb_short_listed').DataTable({
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

//load the data of short listed applicant
function short_listed(stat)
{

    $.ajax({
        type: "GET",
        url: bpath + "hiring/short-listed-list",
        data: {_token,stat},

        success:function(response)
        {
            $('#short_listed_table').html(response);
            load_table();
        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}

//load the attachment of the applicant
function load_application(id,job_ref)
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/load-attachments",
        data:{_token,id,job_ref},

        success:function(response)
        {
            if(response!='')
            {
                let data = JSON.parse(response);

                if(data.length > 0)
                {
                    for(let i=0;i<data.length;i++)
                    {
                        let attachment = data[i]['attachment'],
                            attachment_type = data[i]['attachment_type'],
                            attachment_id = data[i]['id'];

                        let cd = "";
                        cd = '' +
                        '<div class="box px-3 py-3 mb-3 flex items-center zoom-in">'+
                            '<div class="ml-4 mr-auto">'+
                                '<div class="font-medium">'+ attachment +'</div>'+
                                '<div class="text-slate-500 text-xs mt-0.5" style="font-size: 11px">'+ attachment_type + '</div>' +
                            '</div>'+
                            '<a target="_blank" href="/hiring/view-attachment/'+attachment_id+'" class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium mr-2">'+
                                '<i class="fa fa-eye dark:text-slate-500"></i>' +
                            '</a>'+
                            '<a target="_blank" href="/hiring/download-attachment/'+attachment_id+'" class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium">'+
                            '<i class="fa fa-download"></i>' +
                        '</a>'+ '';

                        $(".applicant_attachment").append(cd);
                    }
                } else
                {
                    let cd = "";

                        cd = '' +
                        '<div class="intro-y  p-5 ">' +
                        ' <div id = "applicant_details_tb" class="overflow-x-auto scrollbar-hidden pb-10">' +
                            '<div> No attachment is available </div>' +
                            '</div>' +
                        '</div>';
                        $(".applicant_attachment").append(cd);
                }
            }

        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//load the details in the short listed
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
        let email = $(this).data("email");

        // __dropdown_close("#shortlisted_drop_down");

        //change the color
        if(status_code == 11 || status_code == "")
        {
            status_code = 'Approved';
            $("#status").css("color","#8DCE2A");
        }
        else if (status_code == 10)
        {
            status_code = 'Waiting'
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

        //responsible for loading the attachments
        $(".applicant_attachment").empty();
        load_application(applicants_id,jobref_num);


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
        applicant_emails = email;
        email_user.GlobalUser = applicants_name;

        applicant_details_modal.show();
        myAccordion.hide();
        myAccordion_attachments.hide();
        myAccordion_edit.hide();

    });
}
//get the applied position
function get_applied_position(ref_num)
{
    $.ajax({
        type: "POST",
        url : bpath + "hiring/get-applicant-position",
        data: {_token,ref_num},
        dataType: "json",

        success: function(response)
        {
            if(response.status == true)
            {
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
    if(date_val == "16")
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
    else
    {
        return true;
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
        date_val = result;

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
        myAccordion_attachments.hide();
        myAccordion_edit.hide();
        load_drop_down_status();

    });
}

//saved the application
function save_info()
{
    let sched = "#appointment_shcedule",status = "#status_details",exam = "#exam_result",
        stat = '';

    $("#btn_save_applicant_info").on("click",function(){

        if(btn_save_applicant_text.innerText == 'Save')
        {
            if(validate_date(sched))
            {
                if(validate_status(exam))
                {
                   if( validate_status(status))
                   {
                    stat = "11";
                    appoint_sched();
                    update_list(applicant_id);
                    short_listed(stat);
                    myAccordion.hide();
                    myAccordion_attachments.hide();
                    myAccordion_edit.hide();
                    open = false;
                    $("#status_details").val(null).trigger('change');
                    $("#exam_result").val(null).trigger('change');
                    $("#appointment_shcedule").val('');
                    $("#notes").val('');
                    applicant_details_modal.hide();
                   }

                }
            }
        }
        else
        {
            if(validate_date(sched))
            {
                if(validate_status(exam))
                {
                   if( validate_status(status))
                   {
                    stat = "10";
                    update_shorlisted_applicant(shortlisted_id);
                    short_listed(stat);
                    myAccordion.hide();
                    myAccordion_attachments.hide();
                    myAccordion_edit.hide();
                    open = false;
                    $("#status_details").val(null).trigger('change');
                    $("#appointment_shcedule").val('');
                    $("#notes").val('');
                    applicant_details_modal.hide();
                   }

                }
            }
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

    $.ajax({
        type: "POST",
        url: bpath + "hiring/appoint-interview-sched",
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
        url: bpath + "hiring/update-shortlisted-applicant",
        data:{_token,id,notes,date,stat,ref_num,ids},
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
        url: bpath + "hiring/update-applicant-status",
        data:{_token,id,stat},
        dataType: "json",
    });
}

//============================================================================
function filter()
{
    $("#filter").on('change',function(){

        let stat = $(this).val();
        filter_status_data = stat;

        short_listed(stat);

        if(stat == 11 || stat == "")
        {
            retrieve_applicant_data(stat);
            $("#btn_send_email_notification").show();

        } else if(stat == 10)
        {
            retrieved_shortlisted_data(stat);
            $("#btn_send_email_notification").hide();
        }

    });

}

//*================*//
//responsible for the showing of the child information
function open_child_rows()
{
    $("#short_listed_table").on('click','.btn_child_applicant_info',function(){

        jobref = $(this).data("jobref");
        let tr = $(this).closest('tr');
        let row = table.row(tr);

        if(row.child.isShown())
        {
            row.child.hide();
            tr.removeClass('shown');
            $(this).addClass('fa fa-user-plus');
            $(this).css({color: "#9ed644"});

        }
        else {

            table.rows().eq(0).each( function ( idx ) {
                var row = table.row( idx );
                if ( row.child.isShown() ) {
                     row.child.hide();
                    }
                    $(this).addClass('fa fa-user-plus');
                    $(this).css({color: "#9ed644"});
                });

                $(this).addClass("fa fa-user-minus");
                $(this).css({color: "red"});
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
        }
    });
}

//responsible for showing the details
function show_child_details()
{
    $("short_listed_table").on('requestChild.dt',function(e, row){
        row.child(format(row.data())).show();
    })
}

// retreived the data from the applicant list
function retrieve_applicant_data(stat)
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/applicant-info",
        data: {_token,stat,jobref},

        success:function(response)
        {
            if(response != "")
            {
                $(".applicant_details_tb").empty();

                let data = JSON.parse(response);
                if(data.length > 0)
                {
                        for(let i=0; i<data.length;i++)
                        {
                            let applicant_image = data[i]['applicant_image'],
                                applicant_name = data[i]['applicant_name'],
                                applicant_email = data[i]['applicant_email'],
                                applicant_status = data[i]["applicant_status"],
                                id = data[i]['id'],
                                applicant_list_id = data[i]['applicant_list_id'],
                                ref_num = data[i]['ref_num'],
                                pos_title = data[i]['pos_title'],
                                agency = data[i]['agency'],
                                comments = data[i]['comments'],
                                date_approved = data[i]['date_approved'],
                                date_applied = data[i]['date-applied'],
                                approved = data[i]['approved'];

                            if(applicant_status == 'Approved')
                            {
                                color = "text-success";
                            }

                            let cd = '';

                                        cd = '' +
                                            '<div class="box px-2 py-2 flex mb-3 items-center w-70">'+
                                            '<div class="w-9 h-9 image-fit zoom-in">' +
                                            '<img alt="Midone - HTML Admin Template" class="rounded-lg border-white shadow-md tooltip" data-action="zoom" src="'+applicant_image+'">' +
                                                    '</div>' +
                                            '<div class="ml-4 mr-auto">'+
                                                '<div class="font-medium">'+ applicant_name +'</div>'+
                                                '<div class="text-slate-500 text-xs mt-0.5" style="font-size: 11px">'+ applicant_email + '</div>' +
                                            '</div>'+
                                            '<button id="'+id+'" class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium mr-2 btn_details_data" data-applicant_id="'+applicant_list_id+'" data-name="'+applicant_name+'" data-ref-num="'+ref_num+'"  data-job="'+pos_title+'" data-agency="' +agency+ '" data-comments="' +comments+'" data-status="'+applicant_status+'"  data-date-approved="'+date_approved+'"  data-date-applied="' +date_applied+'" data-approved="' +approved+ '" data-image="'+applicant_image+'" data-email="'+applicant_email+'">'+
                                                '<i class="fa fa-eye dark:text-slate-500"></i>' +
                                            '</button>'+'';

                                        $("#applicant_details_tb").append(cd);
                        }
                }
            } else
            {
                let cd = "";
                cd = '' + '<div> No applicant found yet </div>';

                $("#applicant_details_tb").append(cd);
            }
        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,

    });
}

// retreived the data from the tbl shortlisted
function retrieved_shortlisted_data(stat)
{
    showLoading();
    $.ajax({
        type: "POST",
        url: bpath + "hiring/applicant-info",
        data: {_token,stat,jobref},

        success:function(response)
        {
            let cd = '';
            if(response != "")
            {
                $(".applicant_details_tb").empty();

                let data = JSON.parse(response);
                if(data.length > 0)
                {
                        for(let x=0; x<data.length;x++)
                        {
                            let applicant_id = data[x]['applicant_id'],
                            applicant_image = data[x]['applicant_image'],
                            applicant_name = data[x]['applicant_name'],
                            applicant_email = data[x]['applicant_email'],
                            applicant_status = data[x]["applicant_status"],
                            ref_num = data[x]["ref_num"],
                            pos_title = data[x]["pos_title"],
                            agency = data[x]["agency"],
                            comments = data[x]["comments"],
                            status = data[x]["status"],
                            date_approved = data[x]["date_approved"],
                            date_applied = data[x]["date_applied"],
                            approved = data[x]["approved"],
                            image = data[x]["image"],
                            rate_sched = data[x]["rate-sched"],
                            stat = data[x]["stat"],
                            shortlisted_id = data[x]["shortlisted_id"],
                            exam = data[x]["exam"];


                                if(applicant_status == 'Waiting')
                                {
                                    color = "text-pending";
                                }

                                    cd = '' +
                                    '<div class="box px-2 py-2 flex mb-3 items-center w-70">'+
                                    '<div class="w-9 h-9 image-fit zoom-in">' +
                                    '<img alt="Midone - HTML Admin Template" class="rounded-lg border-white shadow-md tooltip" data-action="zoom" src="'+applicant_image+'">' +
                                            '</div>' +
                                    '<div class="ml-4 mr-auto">'+
                                        '<div class="font-medium">'+ applicant_name +'</div>'+
                                        '<div class="text-slate-500 text-xs mt-0.5" style="font-size: 11px">'+ applicant_email + '</div>' +
                                    '</div>'+
                                    '<button id="" class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium mr-2 btn_details_data" data-applicant_id="'+applicant_id+'" data-name="'+applicant_name+'" data-ref-num="'+ref_num+'" data-job="'+pos_title+'" data-agency="'+agency+'" data-comments="'+comments+'" data-status="'+stat+'" data-date-approved="'+date_approved+'"  data-date-applied="'+date_applied+'" data-approved="'+approved+'" data-image="'+image+'" data-rate-sched="'+rate_sched+'" data-stat="'+stat+'" data-shortlisted-id="'+shortlisted_id+'"  data-exam="'+exam+'" data-email="'+applicant_email+'">'+
                                        '<i class="fa fa-eye dark:text-slate-500"></i>' +
                                    '</button>'+'';

                                $("#applicant_details_tb").append(cd);

                        }
                }

            } else
            {
                let cd = "";
                cd = '' + '<div> No applicant found yet </div>';

                $("#applicant_details_tb").append(cd);
            }
            hideLoading();
        }
        , error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,

    });
}

function format()
{
    if(filter_status_data == 11 || filter_status_data == null)
    {
        retrieve_applicant_data(filter_status_data);
    } else
    {
        retrieved_shortlisted_data(filter_status_data);
    }

    return '<div class="intro-y  box p-5">' +
                 '<div class="font-bold mb-2 text-center">List of Applied Applicants</div>' +
                ' <div id = "applicant_details_tb" class="overflow-x-auto scrollbar-hidden pb-10">' +
                    '</div>' +
                '</div>';
}

//*================*//
//open the modal for the sending of emails

function open_send_email_modal()
{
    $("#btn_send_email_notification").on('click',function(){
        $("#email_to").val(applicant_emails);
        $("#user_name").val(email_user.GlobalUser);
    });
}

function cancel_send_email_modal()
{
    $("#btn_cancel_email_notif").on('click',function(){

        $("#email_attachment")[0].reset();

        const send_email_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_email_notification'));
        send_email_modal.hide();
        remove_file_email_upload();
    })
}

//*================*//
//validate each input
function validateEmail(email)
{
    let eamilreg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return eamilreg.test(email);
}

//check the input of the email if empty or not
function check_mail()
{
    if($("#email_to").val().trim() != "")
    {
        $("#email_to").css('border-color', '');
        return true;
    } else
    {
        $("#email_to").css('border-color', '#ff0000');

        return false;
    }
}

//check the input of the message title if empty or not
function check_messageTitle()
{
    if($("#email_title").val().trim() != "")
    {
        $("#email_title").css('border-color', '');
        return true;
    } else
    {
        $("#email_title").css('border-color', '#ff0000');

        return false;
    }
}

//check the input of the message content if empty or not
function check_messageContent()
{
    if($("#email_mesages").val().trim() != "")
    {
        $("#email_mesages").css('border-color', '');
        return true;
    } else
    {
        $("#email_mesages").css('border-color', '#ff0000');

        return false;
    }
}

//check the input of the closing remarks if empty or not
function check_closingRemarks()
{
    if($("#email_closing_tag").val().trim() != "")
    {
        $("#email_closing_tag").css('border-color', '');
        return true;
    } else
    {
        $("#email_closing_tag").css('border-color', '#ff0000');

        return false;
    }
}


//send email verification
function send_email_notif()
{
    $("#email_attachment").submit(function(e){
        e.preventDefault();

        let email = $("#email_to").val();
        if(check_mail())
        {
            if(validateEmail(email))
            {
                // if(check_messageTitle())
                // {
                    if(check_messageContent())
                    {
                        // if( check_closingRemarks())
                        // {
                            const form = new FormData(this);
                            saved_email_attachments(form);
                            send_email(form);
                            remove_file_email_upload();

                        // }
                    }
                // }

            } else
            {
                __notif_show(-1,'','Please provide a valid email')
            }
        }
    });
}

//sending the email notification
function send_email(form)
{
    show_loading_email_animation();
    $.ajax({
        type: "POST",
        url:  bpath + "hiring/send-email-notif",
        data:form,
        processData: false,
        caches: false,
        contentType: false,
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                $("#email_attachment")[0].reset();
                __notif_show(1,'',response.message);
                send_email_modal.hide();
                hide_loading_email_animation();
            } else
            {
                __notif_show(-1,'',response.message);
                hide_loading_email_animation();
            }
        }
    });
}

//saving the attachment in the database
function saved_email_attachments(form)
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/saved/attachments-emails",
        data: form,
        processData: false,
        caches: false,
        contentType: false,
        dataType: "json",
    });
}

//*==================================*//
//file pond configuration
//getting the files in the computer

FilePond.registerPlugin(
    // validates the size of the file

    // FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
);

const email_attachment = document.querySelector('input[id="email_attachments"]');
const email_attachment_pond = FilePond.create((email_attachment), {

    credits: false,
    allowMultiple: true,
    maxTotalFileSize: "5MB",
    labelFileProcessingComplete: "Uploaded successfully",
    labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
    labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
    // allowFileTypeValidation: true,
    // acceptedFileTypes: ['image/png'],
});

email_attachment_pond.setOptions({
    server: {
        process: "/hiring/tmp/files-upload",
        revert: "/hiring/tmp/file-delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

//remove the file after the uploading or canceling
function remove_file_email_upload() {
    if (email_attachment_pond) {
        var files = email_attachment_pond.getFiles();
        if (files.length > 0) {
            email_attachment_pond.processFiles().then(() => {
                email_attachment_pond.removeFiles();
            });
        }
    }
}

/*========================= Loading Email Animation ====================================*/
function show_loading_email_animation()
{
     // Show overlay and loader
     $('#overlay').show();
     $('#loader').show();
}

//hide the loading animation
function hide_loading_email_animation()
{
    $('#overlay').hide();
    $('#loader').hide();
}




