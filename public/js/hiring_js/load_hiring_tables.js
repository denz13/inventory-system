var  _token = $('meta[name="csrf-token"]').attr('content');
var tblhiring_list;
var id,trigger_delete, delete_id,close,position_status,position_refference_id;
var btn_text = document.getElementById("btn_save_position"), btn_delete_text = document.getElementById("delete_button_modal");


$(document).ready(function(){

    bpath = __basepath + "/";

    load_table();
    display_hiring_position();
    display_details();
    open_delete_modal();
    delete_modal();
    btn_delete_stat();
    filter_change();
    refresh();
     //remove the data in the table
     remove_list_table();
    //get the competencies
    // get_competency();
    delete_saved_job_documents();
    //export the pdf file
    export_position_hiring_excel();
});

function load_table()
{
    try{
		/***/
		tblhiring_list = $('#dt_hriring').DataTable({
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

            columnDefs:
                [
                    { className: "dt-head-center", targets: [8] },
                ],
		});
	}catch(err){
        console.log(err);
    }
}


function display_hiring_position(filter)
{
    let temp = [], notif = [];
    showLoading();

        $.ajax({
        type: "GET",
        url: bpath + "hiring/load-position",
        data:{_token:_token,filter:filter},

        success:function(data)
        {

            tblhiring_list.clear().draw();

            var data = JSON.parse(data);

            if(data.length > 0){

                for(var i=0;i<data.length;i++)
                {
                    let id = data[i]['id'];
                    let agency = data[i]['agency'];
                    let agency_title = data[i]['agency_title'];
                    let pos_title = data[i]['pos_title'];
                    let pos_title_id = data[i]['pos_title_id'];
                    let sg = data[i]['sg'];
                    let salary = data[i]['salary'];
                    let eligibility = data[i]['eligibility'];
                    let education = data[i]['education'];
                    let training = data[i]['training'];
                    let work_ex = data[i]['work_ex'];
                    let pos_type = data[i]['pos_type'];
                    let competency = data[i]['competency'];
                    let plantilla = data[i]['plantilla'];
                    let post_date = data[i]['post_date'];
                    let close_date = data[i]['close_date'];
                    let post_orig_date = data[i]["orig_post_date"];
                    let close_orig_date = data[i]["orig_close_date"];
                    let remarks = data[i]['remarks'];
                    let doc_req = data[i]['doc_req'];
                    let ref_num = data[i]['ref_num'];
                    let ref_id = data[i]["ref_id"];
                    let status = data[i]['status'];
                    let step = data[i]["step"];
                    let email_through = data[i]['email_through'];
                    var email_add = data[i]['email_add'];
                    var address = data[i]['address'];
                    var pos_info = data[i]['pos_info'];
                    var notif_color = data[i]['notif_color'];
                    let encrypt_ref_num = data[i]["encrypt_ref_num"];
                    let qualification = data[i]["qualification"];
                    let applicants = data[i]["applicants"];

                    //Added by Montz
                    var doc_requirements = data[i]['doc_requirements'];

                        if(pos_info!=null)
                        {
                            temp.push(pos_info);
                        }

                        if(notif_color!=null)
                        {
                            notif.push(notif_color);
                        }

                    if(status == 13)
                    {
                        status = "Available";
                        text = "text-success";
                        close = "Close";
                        lock = "fa fa-lock text-dark";
                    } else if(status == 14)
                    {
                        status = "Closed";
                        text = "text-danger";
                        close = "Open";
                        lock = "fa fa-unlock text-dark";
                    } else
                    {
                        status = "Pending";
                        text = "text-pending";
                        close = "Open";
                        lock = "fa fa-unlock text-dark";
                    }

                    var cd = "";
                    cd = '' +
                    '<tr>'+
                            '<td hidden>'+id+'</td>'+
                            '<td class="tooltip cursor-pointer" title="'+agency_title+'">'+agency+'</td>'+
                            '<td >'+pos_title+'</td>'+
                            '<td hidden>'+pos_title_id+'</td>'+
                            '<td >'+plantilla+'</td>'+
                            '<td >'+post_orig_date+'</td>'+
                            '<td >'+close_orig_date+'</td>'+
                            '<td class="'+text+'">'+status+'</td>'+
                            '<td class="w-auto">'+
                            '<div class="flex justify-center items-center">'+
                            '<a id="'+ref_id+'" target="_blank" href="/hiring/print-position-hiring/'+ref_id+'" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Print"> <i class="icofont-print"></i></a>'+
                            '<div id="drop_down_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                            '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                            '<div class="dropdown-menu w-40 zoom-in tooltip">'+
                                '<div class="dropdown-content">'+
                                '<button id="'+id+'" type="button" class="w-full dropdown-item btn_details_data" data-tw-toggle="modal" data-tw-target="#new_hiring_modal" data-id="'+id+'" data-agency="'+agency_title+'" data-pos_title="'+pos_title_id+'" data-sg="'+sg+'"  data-step="'+step+'" data-salary="'+salary+'" data-plantilla="'+plantilla+'" data-eligibility="'+eligibility+'" data-education="'+education+'" data-training="'+training+'" data-work="'+work_ex+'" data-post_type="'+pos_type+'" data-competency="'+competency+'" data-post_date="'+post_date+'" data-close_date="'+close_date+'" data-remarks="'+remarks+'" data-doc_req="'+doc_req+'" data-ref_num="'+ref_num+'" data-doc-req="'+doc_requirements+'" data-email="'+email_through+'" data-email-add="'+email_add+'" data-address="'+address+'" data-ref-num="'+ref_num+'" data-qualification="'+qualification+'" data-applicants="'+applicants+'" ><i class="fa fa-circle-info text-success"></i> <span class="ml-2">Details</span> </button>'+
                                '<button id="'+id+'" type="button" class="w-full dropdown-item btn_delete_data" ><i class="fa fa-trash text-danger"></i><span class="ml-2">Delete</span></button>'+
                                '<button id="'+id+'" type="button" class="w-full dropdown-item btn_delete_stat"  data-closing_date="'+close_date+'" data-posting_date="'+post_date+'"  data-status = "'+status+'"> <i class="'+lock+'"></i></i><span class="ml-2">'+close+'</span></button>'+
                                '<a id="print_new" target="_blank" href="/hiring/print-new-position/'+ref_id+'" class="w-full dropdown-item"><i class="icofont-print text-dark"></i><span class="ml-2">Request for CSC</span></a>'+
                                '<a id="print_new_excel" target="_blank" href="/hiring/export-position-hiring/'+ref_id+'" class="w-full dropdown-item"><i class="fa fa-file-csv text-success"></i><span class="ml-2">Export Excel</span></a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                       ' </td>'+
                    '</tr>'+
                    '';

                    tblhiring_list.row.add($(cd)).draw();
                }
            }
            for(let i=0;i<temp.length;++i)
            {
                    // let pos = JSON.stringify(temp[i]).slice(16).replace(/[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
                    let pos = temp[i];
                    // __notif_show(1,pos,"This hiring position is "+notif[i]);
                    notification_color(notif[i],pos,"This hiring position is "+notif[i]);
            }
            hideLoading();
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        },
    });
}

//refresh the datable()
function refresh()
{
    $("#refresh").on('click',function(){
        check_filter_status();
    });
}

//display the data when the modal is open
function display_details()
{
    $("body").on('click','.btn_details_data',function()
    {
        __dropdown_close("#drop_down_close");

        var hiring_id = $(this).attr("id");
            agencys = $(this).data("agency"),
            pos_title_ids = $(this).data("pos_title"),
            sg = $(this).data("sg"),
            step = $(this).data("step"),
            salary = $(this).data("salary"),
            plantilla = $(this).data("plantilla"),
            eligibility = $(this).data("eligibility"),
            education = $(this).data("education"),
            training = $(this).data("training"),
            work = $(this).data("work"),
            post_type = $(this).data("post_type"),
            competency = $(this).data("competency"),
            post_date = $(this).data("post_date"),
            close_date = $(this).data("close_date"),
            remarks = $(this).data("remarks"),
            doc_req = $(this).data("doc_req");
            ref_num = $(this).data("ref_num");
            email_through = $(this).data("email");
            email_add = $(this).data("email-add");
            address = $(this).data("address");
            job_refference = $(this).data("ref-num");
            date = post_date +'-'+ close_date;
            id = hiring_id;
            position_refference_id = job_refference;
            qualification = $(this).data("qualification");
            applicants = $(this).data("applicants");


        //instantiate the data
        $("#assign").val(agencys);
        $("#position_title").val(pos_title_ids).trigger("change");
        $("#hrmo_head").val(email_through).trigger("change");
        $("#salarygrade").val(sg).trigger("change");
        $("#step").val(step).trigger("change");
        $("#monthly_salary").val(salary);
        $("#item_no").val(plantilla).trigger("change");
        $("#eligibility").val(eligibility).trigger("change");
        $("#education").val(education).trigger("change");
        $("#training").val(training).trigger("change");
        $("#work_ex").val(work).trigger("change");
        $("#position_type").val(post_type).trigger("change");
        $("#competency").val(competency).trigger("change");
        $("#date_entry").val(date);
        $("#remarks").val(remarks);
        $("#doc_req").val(doc_req);
        $("#email_address").val(email_add);
        $("#address").val(address);
        $("#qulaification").val(qualification);
        $("#applicants").val(applicants);
        btn_text.innerText = "Update";
        get_different_panels(ref_num);
        get_different_competency_list(ref_num);

        //Added by Montz
        load_job_documents(ref_num);
    });
}


//get the panels
function get_different_panels(ref_num)
{
    $.ajax({
        type: "GET",
        url: bpath + "hiring/get-panel",
        data:{_token:_token,id:ref_num},
        dataType: "text",
        success:function(data)
        {
            let arr = [];
            let panel = JSON.parse(data);

            for(i=0; i<panel.length;i++)
            {
                let panels = panel[i]['get_panel'];
                arr.push(panels);
            }

            $('#ratees').val(arr).trigger("change");
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
                 } ,
    });
}

//get the list of competencies
function get_different_competency_list(ref_num)
{
    $.ajax({
        type: "GET",
        url: bpath + "hiring/get-competency-list",
        data: {_token,ref_num},
        dataType: "text",

        success:function(response)
        {
            let data = JSON.parse(response),
                 row = '';

            $("#competencies_tb td").remove();

            for(let x=0;x<data.length;x++)
            {
                let datas = data[x]['comp_list'],
                    id = data[x]['id'];

                    row = '<tr>'+
                                '<td hidden><label id="id_details" class="id_details">'+id+'</label></td>'+
                                '<td><label id="comp_lbl_deatils" class="comp_lbl_deatils">'+datas+'</label></td>'+
                                '<td><button id="btn_delete_competencies_list" class="ml-2" id="btn_delete_competencies_list" type="button"> <i class="fa fa-trash-alt"></i> </button></td>'+
                            '</tr>'+
                            '';
                    $("#competencies_tb").append(row);
            }
        }
    });
}

// responsible for the update of data
function update_data()
{
    let temp_var = [],
        temp_id = [];

    $("#competencies_tb tr").each(function(i){
        let data = $(this).find("td #comp_lbl_deatils").text(),
            id = $(this).find("td #id_details").text();
        if(i!=null)
        {
            if(data!='' && id!='')
            {
                temp_var.push(data);
                temp_id.push(id);
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

    let agency = $("#assign").val(),
        position_title =  $("#position_title").val(),
        salarygrade = $("#salarygrade").val(),
        step = $("#step").val();
        monthly_salary =  $("#monthly_salary").val(),
        position_type =  $("#position_type").val(),
        date = $("#date_entry").val(),
        eligibility = $("#eligibility").val(),
        education = $("#education").val(),
        training = $("#training").val(),
        work = $("#work_ex").val(),
        competency = $("#competency").val(),
        plantilla = $("#item_no").val(),
        remarks =  $("#remarks").val(),
        doc_req =  $("#doc_req").val();
        panel = $("#ratees").val(),
        email_through = $("#hrmo_head").val();
        email_add = $("#email_address").val();
        address = $("#address").val();
        qualification = $("#qulaification").val();
        applicants = $("#applicants").val();

        //split the date
        const split_from = date.split("-");

    $.ajax({
        type: 'POST',
        url: bpath + "hiring/update-hiring-position",
        data:{_token:_token,
            ids:id,
            agencys: agency,
            position_titles: position_title,
            salarygrades: salarygrade,
            monthly_salarys: monthly_salary,
            position_types: position_type,
            post_dates: split_from[0],
            close_dates: split_from[1],
            eligibility:eligibility,
            education:education,
            training:training,
            work:work,
            competency:competency,
            plantilla:plantilla,
            remarks:remarks,
            doc_req:doc_req,
            panels:panel,
            ref_num:ref_num,
            hrmo:email_through,
            email_add,
            address,
            step,
            td_doc_requirement,
            td_doc_requirement_type,
            position_refference_id,
            temp_var,
            temp_id,
            qualification,
            applicants
        },
        dataType: "json",
        success: function(response)
        {
            if(response.status==true)
            {
                $("#pisition_form")[0].reset();
                load_select2();
                notification(response.message);
                btn_text.innerText = "Save";
                check_filter_status();
                $("#pisition_form")[0].reset();
                //remove the append td
                $('#dt_job_documents tbody tr').detach();
                $("#competencies_tb td").remove();
                myAccordion3.hide();
                myAccordion4.hide();
                myAccordion5_competencies.hide();
            }
        }, error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
                 } ,
    })
}

//main method for the deletion and the changing of the status
function delete_modal()
{
    $("#delete_button_modal").on('click',function(){

        if(trigger_delete == 0)
        {
            delete_data();
            delete_notif("Successfully Deleted");
        } else if (trigger_delete == 1)
        {
            delete_stat_data();
        }

    });
}

//responsible for the clicking of the delete button
function open_delete_modal()
{
    $("body").on('click','.btn_delete_data',function(){

        __dropdown_close("#drop_down_close");

        $("#delete_icon").show();
        $("#success_icon").hide();

        const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
        delete_modal.show();
        delete_message();
        btn_delete_text.innerText = "Delete";
        trigger_delete = 0;
         delete_id = $(this).attr("id");
    });
}

//responsible for the deletion of data
function delete_data()
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/delete-position-hiring",
        data: {_token:_token,id:delete_id},
        dataType: "json",
        success:function(response)
        {
        }
    });
}

//responsible for the clicking of the close or open button indentify where the icon is check or delete
function btn_delete_stat()
{
    $("body").on('click','.btn_delete_stat',function(){
        delete_id = $(this).attr("id");
        closing_date = $(this).data("closing_date");
        posting_date = $(this).data("posting_date");
        position_status = $(this).data("status");

        __dropdown_close("#drop_down_close");

        if(position_status == "Closed")
        {
            $("#delete_icon").hide();
            $("#success_icon").show();
        }
        else if(position_status == "Pending")
        {
            $("#delete_icon").hide();
            $("#success_icon").show();
        }
        else
        {
            $("#delete_icon").show();
            $("#success_icon").hide();
        }

        delete_stat_message();
        const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
        delete_modal.show();
        trigger_delete = 1;
    });
}

//responsible for the changing the status of data
function delete_stat_data()
{
    $.ajax({
        type: "POST",
        url: bpath + "hiring/delete-hiring-status",
        data: {_token:_token,id:delete_id,
            close:close,closing_date:closing_date,
            posting_date:posting_date,position_status:position_status},

        success: function(response)
        {
            if(response.status==false)
            {
                __notif_show(-1,response.message)
                const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
                delete_modal.hide();
                check_filter_status();

            } else
            {
                __notif_show(1,response.message)
                const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
                delete_modal.hide();
                check_filter_status();
            }
        }
    });
}

//message of the delete button
function delete_stat_message()
{
    if(close == "Close")
    {
    $("#lbl-warning").text("Are you sure that you want to close this position ?");
    $("#lbl-info").text("This position is no longer available");
        btn_delete_text.innerText = "Close";
        $("#delete_button_modal").css({backgroundColor:'#dc2626'});
        $("#delete_button_modal").css('border-color','#dc2626');

    } else if (close == "Open")
    {
        $("#lbl-warning").text("Are you sure that you want to open this position ?");
        $("#lbl-info").text("This position is will be available");
        btn_delete_text.innerText = "Open";
        $("#delete_button_modal").css( {backgroundColor:'#84cc16'} );
        $("#delete_button_modal").css('border-color','#84cc16');
    }
}

function delete_message()
{

        $("#lbl-warning").text("Are you sure that you want to delete this ?");
        $("#lbl-info").text("This record will be deleted");
        $("#delete_button_modal").css({backgroundColor:'#dc2626'});
        $("#delete_button_modal").css('border-color','#dc2626');
}

//delete notification
function delete_notif(message)
{
    notification(message);
    const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
    delete_modal.hide();
    check_filter_status();
}

//change the select down in the drop down
function filter_change()
{
    $("#filter_status").on('change',function(){
        let filter = $("#filter_status").val();
        display_hiring_position(filter);
    });
}

//responsible for the display of the datatable base on the select2
function check_filter_status()
{
    let check_filter = $("#filter_status").val();

    if(check_filter == 13)
    {
        check_filter = 13;
        display_hiring_position(check_filter);
    }
    else if (check_filter == 1)
    {
        check_filter = 1;
        display_hiring_position(check_filter);
    }
    else if (check_filter == 14)
    {
        check_filter = 14;
        display_hiring_position(check_filter);
    }
    else if (check_filter == '')
    {
        check_filter = '';
        display_hiring_position(check_filter);
    }
}


//Added by montz here
function load_job_documents(ref_num){
    $.ajax({
        type: "POST",
        url: bpath + "hiring/load/job/document/requirements",
        data: {_token, ref_num},

        success: function (response) {
            var data = JSON.parse(response);
            let job_doc_list = data['job_doc_list'];

            $('#dt_job_documents tbody tr').detach();
            $('#dt_job_documents tbody').append(job_doc_list);

        }
    });
}

function delete_saved_job_documents(){

    $("body").on('click', '.delete_saved_doc_req', function (){

        let job_doc_id = $(this).data('doc-id');
        let ref_num = $(this).data('ref-num');

        $.ajax({
            type: "POST",
            url: bpath + "hiring/delete/job/document/requirements",
            data: {_token, job_doc_id},

            success: function (response) {
                load_job_documents(ref_num);
            }
        });
    });

}

//Notification for the position hiring
function notification_color(code,head,body)
{
    if(head.trim() != "" || body.trim() != "")
    {
        if(code == 'close')
        {
             tc = '' +
            '<div id="__notif_content" class="toastify-content hidden flex text-danger"> <i class="far fa-check-circle notif_icon_1 text-success"></i>' +
            '	<div class="ml-4 mr-4">' +
            '		<div class="font-medium">' + head + '</div>' +
            '		<div class="text-slate-500 mt-1">' + body + '</div>' +
            '	</div>' +
            '</div>' +
             '';
        }
        if(code == 'pending')
        {
            tc = '' +
            '<div id="__notif_content" class="toastify-content hidden flex text-pending"> <i class="far fa-check-circle notif_icon_1 text-success"></i>' +
            '	<div class="ml-4 mr-4">' +
            '		<div class="font-medium">' + head + '</div>' +
            '		<div class="text-slate-500 mt-1">' + body + '</div>' +
            '	</div>' +
            '</div>' +
             '';
        }

        Toastify({ node: $(tc) .clone() .removeClass(
            "hidden")[0],
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#fff",
            stopOnFocus: true,
        }).showToast();

    }
}

//*=======*//
function export_position_hiring_excel()
{
    $("#print_new_excel").on('click',function(){
        alert("Hello");
    });
}










