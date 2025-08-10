var  _token = $('meta[name="csrf-token"]').attr('content');
var position_tb_id, position_deleted_data_id, btn_saved_text_position =  document.getElementById("saved_position_add");
const create_position_modal = tailwind.Modal.getInstance(document.querySelector("#add_position"));
const delete_position_modal = tailwind.Modal.getInstance(document.querySelector("#delete_position_modal"));

$(document).ready(function() {

    bpath = __basepath + "/";

    load_position_table_table();
    load_position_data();
    open_position_modal();
    create_position();
    cancel_add_position();
    view_pos_details();
    open_delete_modal();
    delete_position_data();
});


function cancel_add_position()
{
    $("#cancel_position_modal").on('click',function(){
        $("#create_position").val(''),
        $("#position_desc").val('');
    });
}




//====================================================================================================================
function load_position_table_table()
{
    try
    {
		/***/
		position_tb_id = $('#position_display_table').DataTable({
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
                    { className: "dt-head-center", targets: [] },
                ],
		});
	}catch(err){
        console.log(err);
     }
}


function load_position_data()
{
    showLoading();
    $.ajax({
        type: "GET",
        url:  bpath + "rsp_hiring/display-position-details",
        data: {_token},

        success: function(response) {

        position_tb_id.clear().draw();

        let data = JSON.parse(response);

            if(data.length > 0)
            {
                for(let x=0;x<data.length;x++)
                {
                    let id = data[x]['id'],
                        emp_position = data[x]['emp_position'],
                        desc = data[x]['description'];
                        full_desc = data[x]["descrpt"];


                        if(desc == null)
                        {
                            desc = "No description yet";
                        }

                    let draw = "";
                        draw = '' +
                                '<tr>'+
                                    '<td class ="">'+emp_position+'</td>'+
                                    '<td class="tooltip cursor-pointer" title="'+full_desc+'">'+desc+'</td>' +
                                    '<td>'+
                                        '<div class="flex justify-center items-center">'+
                                            '<div id="drop_down_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                            '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                            '<div class="dropdown-menu w-40 zoom-in tooltip">'+
                                                '<div class="dropdown-content">'+
                                                '<button id="'+id+'" type="button" class="w-full dropdown-item btn_position_data_details"><i class="fa fa-circle-info text-success"></i><span class="ml-2">Details</span></button>'+
                                                '<button id="'+id+'" type="button" class="w-full dropdown-item btn_delete_data_position" ><i class="fa fa-trash text-danger"></i><span class="ml-2">Delete</span></button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</td>' +
                                '</tr>'+'';

                    position_tb_id.row.add($(draw)).draw();
                }
            }
            hideLoading();
        }
    });
}

//validate the position if empty or not
function check_position()
{
    if ($("#create_position").val().trim()!="")
    {
        $("#create_position").css('border-color', '');
        return true;
    } else{
        $("#create_position").css('border-color', '#ff0000');
        return false;
    }
}
//validate the position description if empty or not
function check_pos_desc()
{
    if ($("#position_desc").val().trim()!="")
    {
        $("#position_desc").css('border-color', '');
        return true;
    } else{
        $("#position_desc").css('border-color', '#ff0000');
        return false;
    }
}

function open_position_modal()
{
    $("#btn_hiringopen_modal").on('click',function(){
        btn_saved_text_position.innerText = 'Saved'
    });
}


//trigger the saved button
function create_position()
{
    $("#saved_position_add").on('click',function(){

        let pos = $("#create_position").val(),
            pos_desc = $("#position_desc").val();

            if(check_position())
            {
                if(check_pos_desc())
                {
                    if(btn_saved_text_position.innerText == 'Saved')
                    {
                        saved_created_position(pos,pos_desc);
                    }
                    else if(btn_saved_text_position.innerText == 'Update')
                    {
                        update_position_data(position_deleted_data_id,pos,pos_desc)
                    }
                }
                else
                {
                    __notif_show(-1,'Please fill the position description first');
                }
            }
            else
            {
                __notif_show(-1,'Please fill the position first');
            }
    });
}

function saved_created_position(position,desc)
{
    $.ajax({
        type:  "POST",
        url: bpath + "rsp_hiring/saved-position",
        data: {_token,position,desc},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,response.message);
                $("#create_position").val(''),
                $("#position_desc").val('');
                load_position_data();
            }
            else if(response.status == false)
            {
                __notif_show(-1,response.message);
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}
//=====================================================================================================================================

function view_pos_details()
{
    $("body").on('click',".btn_position_data_details",function(){
        let id = $(this).attr('id');
        btn_saved_text_position.innerText = 'Update';
        display_position_data(id)
        position_deleted_data_id = id;
    });
}

function display_position_data(id)
{
    $.ajax({
        type: 'GET',
        url: bpath + "rsp_hiring/view-position-details",
        data: {_token,id},

        success:function(response)
        {
            let data = JSON.parse(response);
            if(data!=null)
            {
                let position = data['position'],
                desc = data['desc'];

                create_position_modal.show();
                $("#create_position").val(position);
                $("#position_desc").val(desc);
            }
        }
    });
}

//delete the position data
function open_delete_modal()
{
    $("body").on('click',".btn_delete_data_position",function(){

        let id = $(this).attr('id');

        position_deleted_data_id = id;

        delete_position_modal.show();
    });
}


function delete_position_data()
{
    $("#btn_delete_position_data").on('click',function(){
        delete_data_position(position_deleted_data_id);
    });
}

function delete_data_position(id)
{
    $.ajax({
        type: "POST",
        url: bpath + "rsp_hiring/delete-position",
        data: {_token,id},
        dataType: "json",

        success: function(response)
        {
            if(response.status == true)
            {
                load_position_data();
                delete_position_modal.hide();
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}


function update_position_data(id,pos,desc)
{
    $.ajax({
        type : "POST",
        url: bpath+ "rsp_hiring/update-position-data",
        data: {_token,id,pos,desc},
        dataType:'json',

        success:function(response)
        {
            if(response.status == true)
            {
                load_position_data();
                __notif_show(1,response.message);
            }
            else if(response.status == false)
            {
                __notif_show(1,response.message);
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }

    });
}
