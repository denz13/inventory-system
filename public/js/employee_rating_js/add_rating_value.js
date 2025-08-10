var _token = $('meta[name="csrf-token"]').attr('content');
var temp_rating = [], temp_adjectival = [], temp_rating_desc = [],temp_id = [],rating_ref_id = '';
var ref_delete_id = '',active_rating_stat = '';
var table,btn_save_rating_value = document.getElementById("btn_save_rating_value");
const rating_value_modal = tailwind.Modal.getInstance(document.querySelector("#add_spms"));
const delete_rating_modal = tailwind.Modal.getInstance(document.querySelector("#delete_spms_config"));



$(document).ready(function(){

    bpath = __basepath + "/";

    load_datatable();
    load_spms_data();

    add_rating_value();
    open_delete_spms_modal();
    delete_rating_spms_data();
    cancel_rating_modal();
    save_input_rating();
    remove_list_rating();
    display_rating_data();
    activate_spms_rating();

});


//**=============**//
//initialize the datatable
function load_datatable()
{
    try{
		/***/
		 table = $('#spms_dt').DataTable({
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

function load_spms_data()
{
    $.ajax({
        url: bpath + 'employee_ratings/load/spms/data',
        type: 'POST',
        data:{_token},

        success:function(response)
        {
            table.clear().draw();

            if(response != '')
            {
                let data = JSON.parse(response);

                if(data.length > 0)
                {
                    for(x=0;x<data.length;x++)
                    {

                        const ref_id = data[x]['ref_id'],
                            active = data[x]['active'],
                            rating_scale = data[x]['rating_scale'],
                            rating_value = data[x]['rating_value'],
                            updateButton = data[x]["updateButton"],
                            deleteButton = data[x]["deleteButton"],
                            changestatus = data[x]["changestatus"];

                        let cd = '';

                            cd = ''+
                                    '<tr>' +
                                        '<td class="font-bold">'+rating_value+'</td>'+
                                        '<td class="font-bold">'+rating_scale+'</td>'+
                                        '<td>'+
                                                changestatus +
                                        '</td>'+
                                        '<td class="'+check_stat_color(active)+'">'+check_rating_status(active)+'</td>' +
                                        '<td>'+
                                            '<div class="flex justify-center items-center">'+
                                            '<div id="drop_down_close_rating" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                            '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                            '<div class="dropdown-menu w-40 zoom-in tooltip ">'+
                                                '<div class="dropdown-content">'+
                                                    updateButton +
                                                    deleteButton +
                                            '</div>'+
                                         '</td>'+
                                    +'</tr>'+' ';

                            table.row.add($(cd)).draw();
                    }
                }
            }
        },
        error: function(xhr, status, error) {
        console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}


//**=============**//
//validate the input
function check_rating_input(id)
{
    if ($(id).val().trim() != '' )
    {
        $(id).css('border-color','#e2e8f0');
        return true
    } else
    {
        $(id).css('border-color','#ff0000');
        return false
    }
}


//**=============**//
//trigger the button to add the value
function add_rating_value()
{
    $("#btn_save_rating_value").on('click',function(){

        let instruction = "#rating_instruction",
            rating_instruction = $("#rating_instruction").val();

        if(check_rating_input(instruction))
        {
            if(count_rating_table())
            {
                if(btn_save_rating_value.innerText == 'Saved')
                {
                    store_rating_data();
                    saved_rating_data(rating_instruction,rating_ref_id);
                    $('#spms_table tbody tr').detach();
                    clear_array();
                } else
                {
                    store_rating_data();
                    update_rating_data(rating_ref_id,rating_instruction);
                    clear_array();
                }

            }
        }
    });
}

//open the delete modal and pass the id
function open_delete_spms_modal()
{
    $("body").on("click",".btn_delete_spms_config",function()
    {
        __dropdown_close("#drop_down_close_rating");
        let id = $(this).attr("id");
        ref_delete_id = id;
    });
}

//trigger the delete function of the data
function delete_rating_spms_data()
{
    $("#delete_spms_rating").on("click",function(){
        delete_rating_data(ref_delete_id);
    });
}

//cancel the modal
function cancel_rating_modal()
{
    $("#btn_cancel_rating_value").on('click',function(){
        clear_array();
        btn_save_rating_value.innerText = 'Saved';
        $("#rating_form")[0].reset();
        $("#rating_val").css('border-color','');
        $("#adjectival").css('border-color','');
        $("#rating_desc").css('border-color','');
        $("#rating_instruction").css('border-color','');
        $('#spms_table tbody tr').detach();
    });
}

//check the status
function check_rating_status(active)
{
    if(active == 1)
    {
        active = 'in-used';
    } else
    {
        active = 'in-active';
    }

    return active;
}

//chcek the status color
function check_stat_color(active)
{
    if(active == 1)
    {
        color = 'text-success';
    } else
    {
        color = 'text-danger';
    }

    return color;
}

//check the icon beat
function check_icon_beat(active)
{
    if(active == 1)
    {
        beat = 'fa-beat';
    } else
    {
        beat = '';
    }

    return beat;
}

//check the checked
function checked_rating(active)
{
    if(active == 1)
    {
        checked = 'checked';
    } else
    {
        checked = '';
    }

    return checked;
}

function clear_array()
{
    temp_rating = [];
    temp_adjectival = [];
    temp_rating_desc = [];
    temp_id = [];
}

//count the lenght of the table
function count_rating_table()
{
    row = $("#spms_table tr").length;

    if(row == '1')
    {
        __notif_show(-1,'','Make sure to fill the fields first');
        return false;
    } else
    {
        return true;
    }
}

//**=============**//
//append the data into the datatble
function rating_val_append(rating,adjectival,desc)
{
    let row = '';
    let val =0;
        row = '<tr>'+
                '<td hidden><label id="rating_id" class="rating_vals">'+val+'</label></td>'+
                '<td><label id="rating_vals" class="rating_vals">'+rating+'</label></td>'+
                '<td><label id="adjectivals" class="adjectivals">'+adjectival+'</label> </td>'+
                '<td style="word-wrap:break-word"><label id="rating_descs" class="rating_descs">'+desc+'</label></td>'+
                '<td><button class="ml-2" id="btn_delete_rating_val" type="button"> <i class="fa fa-trash-alt"></i> </button></td>'+
              +'</tr>'
                +'';

        $("#spms_table").append(row);
}

//save the append data in the table
function save_input_rating()
{
    $(document).on('keypress',function(event){
        let keycode = event.keyCode || event.which;
        let rating = $("#rating_val").val(),
            adjectival = $("#adjectival").val(),
            desc = $("#rating_desc").val(),
            rating_val = "#rating_val",
            adjectival_val = "#adjectival",
            rating_desc = "#rating_desc";

        if(keycode == 13)
        {

            if(check_rating_input(rating_val))
            {
                if(check_rating_input(adjectival_val))
                {
                    if(check_rating_input(rating_desc))
                    {
                        rating_val_append(rating,adjectival,desc);
                        $("#rating_form")[0].reset();
                    }
                }
            }
        }
    });
}

//delete the selected data
function remove_list_rating()
{
    $("body").on('click','#btn_delete_rating_val',function(){
        $(this).closest('tr').remove();
    });
}

//store the data from the table in a variable
function store_rating_data()
{
    $("#spms_table tr").each(function(i){

        let rating_val = $(this).find("td #rating_vals").text(),
            adjectival = $(this).find("td #adjectivals").text(),
            rating_desc = $(this).find("td #rating_descs").text();
            rating_id = $(this).find("td #rating_id").text();

        if(i != '')
        {
            if( (temp_rating[i]!=rating_val && temp_adjectival[i]!=adjectival) && temp_rating_desc[i]!= rating_desc && temp_id[i]!=rating_id)
            {
                temp_rating.push(rating_val);
                temp_adjectival.push(adjectival);
                temp_rating_desc.push(rating_desc);
                temp_id.push(rating_id);
            }
        }

    });
}
//**=============**//
//responsible for the storing of data in the database
function saved_rating_data(surveyInstruction,surveyInstruction_id)
{
    $.ajax({
        url: bpath + "employee_ratings/save/rating/data",
        type: "POST",
        data:{_token,temp_rating,temp_adjectival,temp_rating_desc,temp_id,surveyInstruction,surveyInstruction_id},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,'',response.message);
                $("#rating_form")[0].reset();
                rating_value_modal.hide();
                load_spms_data();
            } else if(response.status == false)
            {
                __notif_show(-1,'',response.message);

            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}
//**=============**//
//responsible for the displaying of data in for update
function display_rating_data()
{
    $("body").on('click','.btn_display_rating_scale',function()
    {
        __dropdown_close("#drop_down_close_rating");

        let id = $(this).attr('id'),
            active = $(this).data('stat'),
            rating_instruction_id = $(this).data("instruction_id");
            rating_instruction = $(this).data("instruction");

        $("#rating_instruction").val(rating_instruction);

        active_rating_stat = active;
        rating_ref_id = id;

        btn_save_rating_value.innerText = 'Update';
        get_rating_data(id);
    });
}

//get the data and append in the modal
function get_rating_data(ref_id)
{
    $.ajax({
        url: bpath + "employee_ratings/load/rating/data",
        type: "POST",
        data:{_token,ref_id},
        dataType: "json",

        success:function(data)
        {
            let cd = '';
            $('#spms_table tbody tr').detach();
            if(data != '')
            {
                let val = JSON.parse(JSON.stringify(data));

                for(x=0;x<val.length;x++)
                {
                    let id = val[x]['id'],
                        ref_id = val[x]['ref_id'],
                        rating = val[x]['rating'],
                        adjectival = val[x]['adjectival'],
                        desc = val[x]['desc'];

                    cd = ''+
                        '<tr>' +
                        '<td hidden><label id="rating_id" class="rating_vals">'+id+'</label></td>'+
                            '<td><label id="rating_vals" class="rating_vals">'+rating+'</label></td>'+
                            '<td><label id="adjectivals" class="adjectivals">'+adjectival+'</label> </td>'+
                            '<td style="word-wrap:break-word"><label id="rating_descs" class="rating_descs">'+desc+'</label></td>'+
                        '<td><button class="ml-2" id="btn_delete_rating_val" type="button"> <i class="fa fa-trash-alt"></i> </button></td>'+
                        '</tr>'+ '';

                        $("#spms_table").append(cd);
                }
            }
        }
    });
}
//update the application
function update_rating_data(ref_id,ratingInstruction)
{
    $.ajax({
        url: bpath + "employee_ratings/update/rating.data",
        type: "POST",
        data:{_token,ref_id,temp_rating,temp_adjectival,temp_rating_desc,temp_id,active_rating_stat,ratingInstruction},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,'',response.message);
                $("#rating_form")[0].reset();
                rating_value_modal.hide();
                load_spms_data();
            } else
            {
                __notif_show(-1,'',response.message);
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//delete the rating data
function delete_rating_data(ref_id)
{
    $.ajax({

    url: bpath + "employee_ratings/delete/spms/data",
    type: "POST",
    data:{_token,ref_id},
    dataType: "json",

    success:function(response)
    {
        if(response.status == true)
        {
            __notif_show(1,'',response.message);
            delete_rating_modal.hide();
            load_spms_data();
        } else
        {
            __notif_show(-1,'',response.message);
            delete_rating_modal.hide();
        }
    },
    error: function(xhr, status, error) {
        console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
    }

    });
}

//function click to activate
function activate_spms_rating()
{
    $("body").on('click','.activate_spms',function(){
       let active = $(this).data('stat'),
           id = $(this).attr("id");
       check_active_rating_stat(id,active);
    });
}

//responsible for the activating the active button
function check_active_rating_stat(ref_id,active)
{
    $.ajax({
        url: bpath + "employee_ratings/activate/spms/rating",
        type: "POST",
        data: {_token,ref_id,active},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,'',response.message);
                load_spms_data();
            }
        }
    });
}






