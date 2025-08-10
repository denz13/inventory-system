var  _token = $('meta[name="csrf-token"]').attr('content');
var tblhiring_list,hiring;
var  element_button = document.getElementById("btn_save"),element_span = document.getElementById("text_count");
var id_deleted,temp_panels=[];
var refference_num,trigger_delete;

$(document).ready(function(){

    bpath = __basepath + "/";

    load_table();
    display_data();
    Save_Button();
    dropdown();
    open_modal();
    cancel();
    initialize_data();
    enable_delete_modal();
    delete_modal();
    filter_status();
    check_text_length();
    enable_close_positionstatus();
    $("#hiring_form")[0].reset();

});

//======================================================================================================================
//load the data table
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

//display the data in the databale
function display_data()
{
    $.ajax({
        type: "POST",
        url: bpath = "/hiring/load-hiring-list",
        data: {_token:_token},

        success:function(data){

            tblhiring_list.clear().draw();

            try
            {
                var data = JSON.parse(data);

                if(data.length > 0)
                {
                    for(var i=0;i<data.length;i++) {

                        let hiring_id = data[i]['hiring_id'];
                        let position = data[i]['position'];
                        let descriptions = data[i]['descriptions'];
                        let salarygrade = data[i]['salarygrade'];
                        let salaryrate = data[i]['salaryrate'];
                        let entrydate = data[i]['hiring_start'];
                        let todate = data[i]['hiring_until'];
                        let position_id = data[i]['position_id'];
                        let salarygrade_id = data[i]['salarygrade_id'];
                        let description_title = data[i]['description_title'];
                        let pos_type = data[i]['pos_type'];
                        let pos_type_id = data[i]['pos_type_id'];
                        let ref_num = data[i]['ref_num'];
                        let status = data[i]['status'];

                        var cd = "";
                        cd = '' +
                        '<tr>'+
                                '<td hidden>'+hiring_id+'</td>'+
                                '<td class="">'+position+'</td>'+
                                '<td class="" hidden>'+pos_type+'</td>'+
                                '<td hidden>'+position_id+'</td>'+
                                '<td class="tooltip cursor-pointer" title="'+descriptions+'">'+description_title+'</td>'+
                                '<td class="">'+'Php '+salaryrate+'</td>'+
                                '<td class="">'+salarygrade+'</td>'+
                                '<td hidden>'+salarygrade_id+'</td>'+
                                '<td class="">'+entrydate+''+'-'+''+todate+'</td>'+
                                '<td class="rounded-md">'+
                                '<div class="w-2 h-2 bg-success rounded-full mr-3"><span class="ml-6 text-success">'+check_active(status)+'</span></div> </td>'+
                                // '<td class="">'+todate+'</td>'+
                                '<td class="text-center">'+
                                '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                '<div class="dropdown-menu w-40">'+
                                    '<div class="dropdown-content">'+
                                    '<button id="'+hiring_id+'" type="button" data-postion = "'+position_id+'" data-description="'+descriptions+'" data-salaryrate="'+salaryrate+'" data-salarygrade="'+salarygrade_id+'" data-from="'+entrydate+'" data-to="'+todate+'" data-postype="'+pos_type_id+'" data-ref="'+ref_num+'" class="w-full dropdown-item btn_update_hiring_list" data data-tw-toggle="modal" data-tw-target="#hiring_modal"><i class="fa-solid fa-pen-to-square text-success"></i> <span class="ml-2">Update</span> </button>'+
                                    '<button id="'+hiring_id+'" type="button" class="w-full dropdown-item btn_delete_data" ><i class="fa fa-trash text-danger"></i><span class="ml-2">Delete </span></button>'+
                                    '<button id="'+hiring_id+'" type="button" class="w-full dropdown-item btn_close_position" ><i class="fa fa-lock  text-dark"></i><span class="ml-2">Close position</span></button>'
                                    '</div>'+
                                '</div>'+
                           ' </td>'+
                        '</tr>'+
                        '';

                        tblhiring_list.row.add($(cd)).draw();

                    }
                }

            } catch(error)
            {
                console.log(error);
            }
        }
    });
}

function check_active(active)
{
    if(active == 1)
    {
        active = "Open"
        return active;
    }
}
//======================================================================================================================

//load the dropdown
function dropdown()
{
    $('#filter_status').select2({
        placeholder: "Filter position status",
        closeOnSelect: true,
    });

    $('#position').select2({
        placeholder: "Select Position",
        closeOnSelect: true,
    });

    $('#salary_grade').select2({
        placeholder: "Select Salary Grade",
        closeOnSelect: true,
    });

    $('#post_type').select2({
        placeholder: "Position Type",
        closeOnSelect: true,
    });

    $('#panel').select2({
        placeholder: "Select Panel",
        closeOnSelect: true,
    });

}

//open the modal
function open_modal()
{
    $("#btn_hiringopen_modal").on('click',function(e){
        element_button.innerText = "Save";
    });
}


//cancel button
function cancel()
{
    $("#btn_cancel").on("click",function(){
        $("#hiring_form")[0].reset();
        dropdown();
        element_span.innerText = "1";
        clear_border_color();
    });
}
//clear the border color
function clear_border_color()
{

        $("#position").css('border-color', '');
        $("#salary_grade").css('border-color', '');
        $("#salary_rate").css('border-color', '');
        $("#entry_date").css('border-color', '');
        $("#text_description").css('border-color', '');
        $("#post_type").css('border-color', '');
        $("#panel").css('border-color', '');
}
//======================================================================================================================

//validate the input
function check_position(position)
{
    if(position.trim() != "")
    {
        $('#position').select2({
            placeholder: "Select Position",
            closeOnSelect: true,
        });
        return true;
    }else
    {
        $('#position').select2({
            theme: "error",
            placeholder: "Position is required",
        });
        return false;
    }
}

function check_salary_grade(grade)
{
    if(grade.trim()!="")
    {
        $("#salary_grade").select2({
            placeholder: "Select Salary Grade",
            closeOnSelect: true,
        });
        return true;
    } else{

        $("#salary_grade").select2({
            theme: "error",
            placeholder: "Salary grade is required",
        });

        return false;
    }
}

function check_pos_type(pos_type)
{
    if(pos_type.trim()!="")
    {
        $("#post_type").select2({
            placeholder: "Position Type",
            closeOnSelect: true,
        });

        return true;
    } else{

        $("#post_type").select2({
            theme: "error",
            placeholder: "Position type is required",
        });

        return false;
    }
}

function check_panels(panel)
{
    if(panel!="")
    {
        $("#panel").select2({
            placeholder: "Select Panel",
            closeOnSelect: true,
        });
        return true;
    } else{

        $("#panel").select2({
            theme: "error",
            placeholder: "Panels is required",
        });

        $(this).css('border-color', '#ff0000');

        return false;
    }
}

function check_salary_rate(rate)
{
    if(rate.trim()!="")
    {
        $("#salary_rate").css('border-color', '');
        return true;
    } else{
        $("#salary_rate").css('border-color', ' #ff0000');
        return false;
    }
}

function checkdate(date)
{
    if(date.trim() != "")
    {
        $("#entry_date").css('border-color', '');
        return true;
    } else{
        $("#entry_date").css('border-color', ' #ff0000');
        return false;
    }
}

function check_description(descript)
{
    if(descript.trim() != "")
    {
        $("#text_description").css('border-color', ' ');
        return true;
    }
    else{
        $("#text_description").css('border-color', ' #ff0000');
        return false;
    }
}

//check the lenght of the  text description
function check_text_length()
{
        $("#text_description").keyup(function(event){
            let text = $(this).val().length;
            $("#text_count").text(text);

            if(text > 500)
            {
                $("#text_description").css('border-color', ' #ff0000');

            } else if(text <= 500){
                $("#text_description").css('border-color', '');

            } else if(text == 0){
                $("#text_description").css('border-color', '');

            }
        });
}
//function check length
function check_length(text)
{
    if(text.length>500)
    {
        return false;
    } else{
        return true;
    }
}
//=================================================================================================================
//notification for the delete status
function delete_notif()
{
    try{
        display_data();
    __notif_show(1,"Successfully deleted");
    const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
    delete_modal.hide();
    }catch(error)
    {
        console.log(error);
    }
}
//=================================================================================================================
//fiter the status
function filter_status()
{
    $("#filter_status").on('change',function(){
        if($(this).val == 0)
        {
            alert("0");
        } else{
            alert("1");
        }
    });
}





//====================================================================================================================
//trigger the button for save
function Save_Button()
{
    $("#btn_save").on("click",function(e){
        e.preventDefault(e);

        if(element_button.innerText == "Save")
        {
            Save_Data();
        } else{
            update_data();
        }
    });
}

//saved the data
function Save_Data()
{
    let position = $("#position").val(),
        salary_grade = $("#salary_grade").val(),
        salary_rate = $("#salary_rate").val(),
        entry_date = $("#entry_date").val(),
        text_description = $("#text_description").val(),
        pos_type = $("#post_type").val(),
        panel = $("#panel").val();

        const split_from = entry_date.split("-");

    if(check_position(position))
    {
        if(check_salary_grade(salary_grade))
        {
            if(check_salary_rate(salary_rate))
            {
                if(check_pos_type(pos_type))
                {
                    if(checkdate(entry_date))
                    {
                        if(check_panels(panel))
                        {
                            if(check_description(text_description))
                            {
                                if(check_length(text_description))
                                {
                                    $.ajax({
                                        type: "POST",
                                        url: bpath = "/hiring/add-hiring",
                                        data:{position:position,
                                            salary_grade:salary_grade,
                                            salary_rate:salary_rate,
                                            hiring_start:split_from[0],
                                            hiring_until:split_from[1],
                                            text_description:text_description,
                                            pos_type:pos_type,
                                            temp_panels:panel,
                                            _token:_token},
                                        dataType: "json",
                                        success: function(response){
                                            if(response.status == true)
                                            {
                                                __notif_show(1,"Position Hiring",response.message);
                                                $("#hiring_form")[0].reset();
                                                dropdown();
                                                display_data();
                                                element_span.innerText = "1";


                                            }
                                        }
                                    });
                                }
                            }

                        }

                    }

                }

            }
        }

    }
}
//=================================================================================================================================
//pass the data from the data table up to the modal
function initialize_data()
{
    $("body").on('click','.btn_update_hiring_list',function()
    {
        element_button.innerText = "Update";

        let hiring_id = $(this).attr("id");
        postion = $(this).data("postion"),
        description = $(this).data("description"),
        salaryrate = $(this).data("salaryrate"),
        salarygrade = $(this).data("salarygrade"),
        from_date = $(this).data("from"),
        to = $(this).data("to"),
        pos_type = $(this).data("postype");
        ref_num = $(this).data("ref");

        //instantiate the input from the data table
         $("#position").val(postion).trigger("change");
         $("#salary_grade").val(salarygrade).trigger("change");
         $("#post_type").val(pos_type).trigger("change");
         $("#salary_rate").val(salaryrate);
         $("#text_description").val(description);
         $("#entry_date").val(from_date+'-'+to);
         hiring = hiring_id;
         get_panels(ref_num);
         refference_num = ref_num;
    });
}



//get the different panels
function get_panels(ref_num)
{
    $.ajax({
        type: "GET",
        url: bpath = "/hiring/get-panels",
        data: {ref_num:ref_num,_token:_token},
        dataType:'text',
        success:function(data)
        {
            let arr = [];
            let panel = JSON.parse(data);

            for(i=0; i<panel.length;i++)
            {
                let panels = panel[i]['get_panel'];
                arr.push(panels);
            }
            console.log(arr);
            $('#panel').val(arr).trigger("change");
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
                 } ,
    });
}

//update button
function update_data()
{
    let position = $("#position").val(),
        salary_grade = $("#salary_grade").val(),
        salary_rate = $("#salary_rate").val(),
        entry_date = $("#entry_date").val(),
        text_description = $("#text_description").val();
        pos_type = $("#post_type").val();
        const split_from = entry_date.split("-");
        panel = $("#panel").val();

    if(check_position(position))
    {
        if(check_salary_grade(salary_grade))
        {
            if(check_salary_rate(salary_rate))
            {
                if(checkdate(entry_date))
                {
                    if(check_description(text_description))
                    {
                        if(check_length(text_description))
                        {
                            if(check_pos_type(pos_type))
                            {
                                if(check_panels(panel))
                                {
                                    $.ajax({
                                        type: "POST",
                                        url: bpath = "/hiring/update-hiring-list",
                                        data: {
                                            hiring:hiring,
                                            position:position,
                                            salary_grade:salary_grade,
                                            salary_rate:salary_rate,
                                            text_description:text_description,
                                            hiring_start:split_from[0],
                                            hiring_until:split_from[1],
                                            pos_type:pos_type,
                                            update_panel:panel,
                                            refference_num:refference_num,
                                            _token:_token,},
                                        dataType: "json",
                                        success:function(response){
                                            console.log(response.status);
                                            if(response.status == true)
                                            {
                                                // delete_notif();
                                            }
                                        }

                                     });
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}
//delete button
function enable_delete_modal()
{
    $("body").on('click','.btn_delete_data',function(){

        id_deleted = $(this).attr('id');
        const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
        delete_modal.show();
        trigger_delete = 0;
        console.log(id_deleted);
    });
}

function delete_modal()
{
    $("#delete_button_modal").on("click",function(){

        if(trigger_delete == 0)
        {
            delete_hiring_list();

        } else if (trigger_delete == 1) {

            close_position();
        }
        delete_notif();
    });
}

//delete
function delete_hiring_list()
{
    $.ajax({
        type: "POST",
        url:  bpath = "/hiring/delete-hiring-list",
        data: {_token:_token,id:id_deleted},
        dataType: "json",
        success:function(response){

            if(response.status==true)
            {
                // delete_notif();
            }
        }
    });
}
//close the status of the position
function enable_close_positionstatus()
{
    $("body").on("click",".btn_close_position",function()
    {
        id_deleted = $(this).attr('id');
        const delete_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_modal'));
        delete_modal.show();
        trigger_delete = 1;
    })
}

function close_position()
{
    $.ajax({
        type: "POST",
        url: bpath =  "/hiring/update-hiring-status",
        data:{id:id_deleted,_token:_token},
        dataType: "text",
        success:function(response)
        {
            if(response.status==true)
            {
                // delete_notif();
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
                 } ,
    });
}




