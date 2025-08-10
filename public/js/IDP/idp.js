var  _token = $('meta[name="csrf-token"]').attr('content');
var temp_pos_id_idp,temp_depart_idp,temp_desig_idp;

$(document).ready(function(){

    bpath = __basepath + "/";

    get_designation_position();
    // cancel_modal();
    add_idp_row();
    add_sub_content();
    remove_idp_sub_row();
    remove_idp_row();
    save_idp_info();
    add_second_tbl_row();
    remove_second_tbl_row();
    idp_load_select2();
    //edit the job desc
    edit_jod_descriptio();
    //save the edit
    edit_job_desc();
});



// function cancel_modal()
// {
//     $("#btn_idp_cancel").on('click',function(){

//         $("#emp_position").val('');
//         $("#emp_designation").val('');
//         $("#dept").val('');
//         $("#emp_name").val(null).trigger('change');

//     });
// }

//function load select2 in idp
function idp_load_select2()
{
    $('#edit_pos').select2({
        placeholder: "Select position",
        closeOnSelect: true,
    });
    $('#edit_desig').select2({
        placeholder: "Select designation",
        closeOnSelect: true,
    });
    $('#edit_unit_department').select2({
        placeholder: "Select unit department",
        closeOnSelect: true,
    });
    $('#edit_department_head').select2({
        placeholder: "Select department head",
        closeOnSelect: true,
    });
}

// adding and deleting of row first table
function add_idp_row()
{
    $("#add_sub_content").on('click',function(){

        let row = '';

        row =   '<tr>' +
                    '<td class="border-r">' +
                        '<textarea id="idp_title" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border" placeholder="Enter details" ></textarea>' +
                    '</td>' +
                    '<td class="border-r">' +
                    '<input id="idp_type" type="text" class="form-control" placeholder="type">'+
                    '</td>'+
                    '<td id="sub_content" class="!px-2 sub_content">' +
                        '<div class="input-group">' +
                            '<div class="input-group-text"> <i class="fa fa-feather div_class"></i> </div>' +
                            '<input type="idp_content" class="form-control min-w-[6rem] idp_content" placeholder="content">' +
                            '<button class="ml-2" id="btn_idp_remove_row" type="button"><i class="fa fa-circle-xmark"></i></button>'+
                            '<button class="ml-2" id="add_sub_content_2" type="button"><i class="fa fa-circle-plus text-success"></i></button>'+
                        '</div>' +
                    '</td>' +
                    '<td>' +
                        '<button class="ml-2" id="btn_row_idp_remove" type="button"> <i class="fa fa-trash text-danger"></i> </button>' +
                    '</td>' +
                '</tr>';

        $("#area_dev_tb").append(row);
    });
}

function add_sub_content()
{
    $("#area_dev_tb").on('click','#add_sub_content_2',function(){

        let row = '';

        row =   '<div class="input-group mt-2">'
                   + '<div class="input-group-text"> <i class="fa fa-feather div_class"></i> </div>'+
                    '<input id="idp_content" type="text" class="form-control min-w-[6rem] idp_content" placeholder="content">'
                   + '<button class="ml-2" id="btn_idp_remove_row" type="button"><i class="fa fa-circle-xmark text-dark"></i></button>'+
                    '<button class="ml-2" id="add_sub_content_2" type="button"><i class="fa fa-circle-plus text-success"></i></button>'+
                '</div>';

        $(this).closest('td').append(row);
    });

}

function remove_idp_sub_row()
{
    $("#area_dev_tb").on('click','#btn_idp_remove_row',function(){
        $(this).closest('div').remove();
    });
}

function remove_idp_row()
{
    $("#area_dev_tb").on('click','#btn_row_idp_remove',function(){
        $(this).closest('tr').remove();
    });
}
//end

//========================================== end
function add_second_tbl_row()
{
    $("#btn_add_second_row").on('click',function(){
        let row = '';

            row = '<tr>' +
                     '<td> <textarea id="" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border" placeholder="Enter details" ></textarea> </td>' +
                     '<td> <textarea id="" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border" placeholder="Enter details" ></textarea> </td>' +
                     '<td> <textarea id="" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border" placeholder="Enter details" ></textarea> </td>' +
                     '<td> <textarea id="" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border" placeholder="Enter details" ></textarea> </td>' +
                     '<td> <button class="ml-2" id="btn_remove_second_tbl" type="button"> <i class="fa fa-trash text-danger"></i> </button> </td>' +
                  '</tr>';

        $("#dev_need_tb").append(row);

    });
}


function remove_second_tbl_row()
{
    $("#dev_need_tb").on('click','#btn_remove_second_tbl',function(){
        $(this).closest('tr').remove();
    });
}
//========================================== end

// save the info=====================================
function save_idp_info()
{
    $("#btn_save_idp_info").on("click",function(){

        let temp_title = [],
            temp_type = [],
            temp_content = [],
            temp_subcontent = [];

       $("#area_dev_tb tr").each(function(i){
            let title = $(this).find("td #idp_title").val(),
                type = $(this).find("td #idp_type").val(),
                content = $(this).closest('tr').find(".idp_content").val();

                if(i != '')
                {
                    if((title !=null && type !=null) && (content!=null))
                    {
                        temp_title.push(title);
                        temp_type.push(type);

                        $(this).closest('tr').find(".idp_content").each(function(){
                            let sub_content = $(this).closest('div').find(".idp_content").val();
                            temp_content.push(sub_content);
                    });
                    temp_subcontent.push(temp_content);
                    temp_content = [];
                    }
                }
       });

       console.log(temp_title,temp_type,temp_subcontent);
    });
}

//function open the edit job desvription modal in the IDP =======================================================
function edit_jod_descriptio()
{
    $("#job_desc_edit").on('click',function(){
        $("#edit_pos").val(temp_pos_id_idp).trigger("change");
        $("#edit_unit_department").val(temp_depart_idp).trigger("change");
        $("#edit_desig").val(temp_desig_idp).trigger("change");
    });
}

//save the edited position =======================================================================================
function edit_job_desc()
{
    $("#btn_save_edit_pos").on('click',function(){

        let pos = $("#edit_pos").val(),
            dept = $("#edit_unit_department").val(),
            desig = $("#edit_desig").val();

            console.log(pos,dept,desig);
    });
}

//trigger to save the data from the database
function update_job_desc(pos,dept,desig)
{
    $.ajax({
        type: "POST",
        url: bpath + "IDP/update-job-description",
        data: {_token,pos,dept,desig},
        dataType: "json",

        success:function(response)
        {

        }

    });
}

//========================================================================================================================

function get_designation_position()
{
    $.ajax({
        type: "POST",
        url: bpath + "IDP/get-position",
        data: {_token},

        success: function(response)
        {
                if(!$.isEmptyObject(response))
                {
                    let data = JSON.parse(response);

                    let position_idp = data['position'],
                        designation_idp = data['designation'],
                        department_idp = data['department'],
                        employee_name_idp = data['name'],
                        pic_id = data['pic'];

                    let pos_id_idp  =data['pos_id'],
                        desig_id = data['desig_id'],
                        dept = data['dept'];

                        if(!position_idp)
                        {
                             position_idp = 'No data found !';
                             pos_id = '';
                        }

                          if(!designation_idp)
                        {
                             designation_idp = 'No data found !';
                             desig_id = ''
                        }

                         if(!department_idp)
                        {
                             department_idp = 'No data found !';
                             dept = '';
                        }

                        if(!employee_name_idp)
                        {
                            employee_name_idp = 'No data found';
                        }

                        temp_pos_id_idp = pos_id_idp;
                        temp_depart_idp = dept;
                        temp_desig_idp = desig_id;

                        $("#emp_position").text(position_idp);
                        $("#emp_designation").text(designation_idp);
                        $("#dept").text(department_idp);
                        $("#emp_name").text(employee_name_idp);
                        $("#img_profile_pic").attr("src",pic_id);
                }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        } ,
    });
}


