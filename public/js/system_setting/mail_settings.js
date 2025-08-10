var _token = $('meta[name="csrf-token"]').attr('content');
var configure_id,delete_mail_id;
var table,btn_saved_configure = document.getElementById("btn-saved-configure-email");
const config_modal = tailwind.Modal.getInstance(document.querySelector("#configure_email"));
const delete_mail_modal_config = tailwind.Modal.getInstance(document.querySelector("#delete-mail-config"));


$(document).ready(function(){

    bpath = __basepath + "/";

    save_configure_email();
    load_datatable();
    display_configure_email();
    display_data_selected();
    cancel_display_modal();
    delete_mail_config();
    open_delete_mail_modal();

    //check the email if active or not
    check_active_email_not();

});


//**================= **//
//load the data in the datable
//**================= **//
function load_datatable()
{
    try{
		/***/
		 table = $('#mail_config').DataTable({
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

function display_configure_email()
{
        $.ajax({

            type: "POST",
            url: bpath + "admin/display-config/data",
            data: {_token },

            success:function(response){

            table.clear().draw();

                if(response!='')
                {
                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                            for(let x=0;x < data.length;x++)
                            {
                                let id = data[x]['id'],
                                    driver = data[x]['driver'],
                                    host = data[x]['host'],
                                    port = data[x]['port'],
                                    username = data[x]['username'],
                                    password = data[x]['password'],
                                    passwordz = data[x]['passwordz'],
                                    encryption = data[x]['encryption'],
                                    name_mail = data[x]['name'];
                                var active_email_stat = data[x]["active"];
                                    console.log(active_email_stat);
                                let cd = '';
                                    cd = ''+
                                            '<tr>'+
                                                '<td class="hidden">'+id+'</td>'+
                                                '<td>'+name_mail+'</td>'+
                                                '<td>'+username+'</td>'+
                                                '<td>'+passwordz+'</td>'+
                                                '<td>'+encryption+'</td>'+
                                                '<td><div class="form-check form-switch"><input id="'+id+'" class="'+icon_beat(active_email_stat)+' form-check-input click_activate_mail" type="checkbox" data-stat = '+active_email_stat+' '+checked_if_active(active_email_stat)+'>'+
                                                '<label class="form-check-label leading-relaxed text-slate-500 text-xs" for="preorder-active">Click to activate the email set-up </label></div></td>'+
                                                '<td>'+
                                                    '<div class="flex justify-center items-center">'+
                                                    '<div id="drop_down_mail_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                                    '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                                    '<div class="dropdown-menu w-40 zoom-in tooltip">'+
                                                        '<div class="dropdown-content">'+
                                                        '<button id="'+id+'" type="button" class="w-full dropdown-item btn_display_configure_email" data-tw-toggle="modal" data-tw-target="#configure_email" data-driver='+driver+' data-host='+host+' data-port='+port+' data-username='+username+' data-password='+password+' data-encryption='+encryption+' data-name="'+name_mail+'" ><i class="fa fa-circle-info text-success"></i><span class="ml-2">Details</span></button>'+
                                                        '<button id="'+id+'" type="button" class="w-full dropdown-item btn_delete_mail_config" ><i class="fa fa-trash text-danger"></i><span class="ml-2">Delete</span></button>'+
                                                    '</div>'+
                                                '</td>'+
                                            '</tr>'+ '';

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



function display_data_selected()
{
    $("body").on('click','.btn_display_configure_email',function(){

        __dropdown_close("#drop_down_mail_close");
        let id = $(this).attr("id"),
            driver = $(this).data("driver"),
            host = $(this).data("host"),
            port = $(this).data("port"),
            username = $(this).data("username"),
            password = $(this).data('password'),
            encryption = $(this).data('encryption');
            mail_name = $(this).data('name');
            $("#mail_driver").val(driver);
            $("#mail_host").val(host);
            $("#mail_port").val(port);
            $("#mail_username").val(username);
            $("#mail_password").val(password);
            $("#mail_encryption").val(encryption);
            $("#mail_name").val(mail_name);

            configure_id = id;
            btn_saved_configure.innerText = 'Update';
    });
}

function cancel_display_modal()
{
    $("#btn_configure_cancel").on('click',function(){
        $("#config_form")[0].reset();
        $("#mail_driver").css('border-color', '');
        $("#mail_host").css('border-color', '');
        $("#mail_port").css('border-color', '');
        $("#mail_username").css('border-color', '');
        $("#mail_password").css('border-color', '');
        $("#mail_encryption").css('border-color', '');
        btn_saved_configure.innerText = 'Saved';
    });
}


//**================= **//
//save the configure email settings
function save_configure_email()
{
    $("#btn-saved-configure-email").on('click',function(){

        let driver = $("#mail_driver").val(),
            host = $("#mail_host").val(),
            port = $("#mail_port").val(),
            username = $("#mail_username").val(),
            password = $("#mail_password").val(),
            encrypt = $("#mail_encryption").val();
            mail_name = $("#mail_name").val();

        if(check_driver_input())
        {
            if(check_host_input())
            {
                if(check_port_input())
                {
                    if(check_email_is_valid(username))
                    {
                        if(check_username_input())
                        {
                            if(check_password_input())
                            {
                                if(check_encryption_input())
                                {
                                    if(btn_saved_configure.innerText =='Saved')
                                    {
                                        save_condifure_data_database(driver,host,port,username,password,encrypt,mail_name);
                                    }
                                    else if(btn_saved_configure.innerText == 'Update')
                                    {
                                        update_configure_data(configure_id,driver,host,port,username,password,encrypt,mail_name);
                                    }
                                }
                            }
                        }
                    } else
                    {
                        __notif_show(-1,'','Please provide a valid email');
                    }
                }
            }
        }

    });
}


//open the modal for the deletetion of mail config
function open_delete_mail_modal()
{
    $("body").on('click','.btn_delete_mail_config',function(){
        __dropdown_close("#drop_down_mail_close");
        let id = $(this).attr("id");
        delete_mail_id = id;
        delete_mail_modal_config.show();
    });
}


//delete the data in the mail configuration
function delete_mail_config()
{
    $("#delete_mail_configure").on('click',function(){
        deletion_mail_data(delete_mail_id);
    });
}


//responsible for the saving of actual data
function save_condifure_data_database(driver,host,port,username,password,encrypt,name)
{
    $.ajax({

        type: "POST",
        url: bpath + "admin/configure/save",
        data: {_token,driver,host,port,username,password,encrypt,name},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,response.message)
                config_modal.hide();
                display_configure_email();
                $("#config_form")[0].reset();
            } else
            {
                __notif_show(-1,response.message)
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//update the configuration of the email
function update_configure_data(id,driver,host,port,username,password,encrypt,name)
{
    $.ajax({
        type: "POST",
        url: bpath + "admin/update-confi/data",
        data:{_token,id,driver,host,port,username,password,encrypt,name},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                __notif_show(1,response.message)
                config_modal.hide();
                display_configure_email();
                $("#config_form")[0].reset();

            } else
            {
                __notif_show(1,response.message)
                config_modal.hide();
            }
        }
    });
}

//responsilbe for the deletion of data
function deletion_mail_data(id)
{
    $.ajax({
        url: bpath + 'admin/delete-mail-config',
        type: "DELETE",
        data: {_token,id},
        dataType: "json",

        success:function(response)
        {
            if(response.status == true)
            {
                console.log('deleted na');
                display_configure_email();
                __notif_show(1,'',response.message);
                delete_mail_modal_config.hide();
            } else
            {
                __notif_show(-1,'',response.message);
                delete_mail_modal_config.hide();
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}


//**================= **//




//**================= **//
//validating the user input
function check_driver_input()
{
    if( $("#mail_driver").val().trim() != "")
    {
        $("#mail_driver").css('border-color', '');
            return true;
    } else
    {
        $("#mail_driver").css('border-color', '#ff0000');
        return false;
    }
}

function check_host_input()
{
    if( $("#mail_host").val().trim() != "")
    {
        $("#mail_host").css('border-color', '');
            return true;
    } else
    {
        $("#mail_host").css('border-color', '#ff0000');
        return false;
    }
}

function check_port_input()
{
    if( $("#mail_port").val().trim() != "")
    {
        $("#mail_port").css('border-color', '');
            return true;
    } else
    {
        $("#mail_port").css('border-color', '#ff0000');
        return false;
    }
}

function check_username_input()
{
    if( $("#mail_username").val().trim() != "")
    {
        $("#mail_username").css('border-color', '');
            return true;
    } else
    {
        $("#mail_username").css('border-color', '#ff0000');
        return false;
    }
}

function check_password_input()
{
    if( $("#mail_password").val().trim() != "" )
    {
        $("#mail_password").css('border-color', '');
            return true;
    } else
    {
        $("#mail_password").css('border-color', '#ff0000');
        return false;
    }
}

function check_encryption_input()
{
    if( $("#mail_encryption").val().trim() != "" )
    {
        $("#mail_encryption").css('border-color', '');
            return true;
    } else
    {
        $("#mail_encryption").css('border-color', '#ff0000');
        return false;
    }
}

function check_email_is_valid(email)
{
    let eamilreg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return eamilreg.test(email);
}

//**================= **//

//check the active email
function check_active_email_not()
{
    $("body").on('click','.click_activate_mail',function(){

        let stat = $(this).data("stat");
        let mail_id = $(this).attr("id");

        if(stat == 1)
        {
            change_mail_stat(mail_id,stat);
            display_configure_email();
        } else
        {
            change_mail_stat(mail_id,stat);
            display_configure_email();
        }
    });
}

function change_mail_stat(id,stat)
{
    $.ajax({
        type: "POST",
        url: bpath + "admin/update-active/status",
        data:{_token,id,stat},
        dataType: "json",

        success:function(response)
        {
            if(response.message == true)
            {
                __notif_show(1,'',response.message);
            } else
            {
                __notif_show(-1,'',response.message);
            }
        }
    });
}

// reponsible for the automatic con of the radio button
function checked_if_active(active)
{
    let checked = " ";

    if(active == 1)
    {
        checked = "checked";
    } else

    {
        checked = "";
    }

    return checked;
}

// animate the button
function icon_beat(active)
{
    let beat= " ";

    if(active == 1)
    {
        beat = "fa-beat";
    } else

    {
        beat = "";
    }

    return beat;
}
//**================= **//




