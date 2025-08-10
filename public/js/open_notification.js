var  _token = $('meta[name="csrf-token"]').attr('content');
var base_url = window.location.origin;
var doc_file_id,hiring_notif_id,seen_stat;
const hiring_notif_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#notif_click_info'));


$(document).ready(function (){

    bpath = __basepath + "/";

    // load_top_bar_profile();

    toggle_modal_application_notifications();

    toggle_notification_bell();

    load_applicants_notification();

    load_employee_documents();

    load_Panels_Notif();

    load_hiring_notif_click();

    seen_Notification();
    see_attachment();

    // load_selected_notification();

    // load_hired_applicant_notification();

    // _onClick_hiredNotification();

    // closeHired_modal();

    // seen_notification();

});

// function load_top_bar_profile(){
    //
    //     $.ajax({
    //         url: bpath + 'my/load/profile',
    //         type: "POST",
    //         data: { _token, },
    //         success: function(response) {
    //
    //             var data = JSON.parse(response);
    //             // //.log(data);
    //
    //             if(data.length > 0) {
    //                 for (var i = 0; i < data.length; i++) {
    //
    //                     let last_name = data[i]['last_name'];
    //                     let first_name = data[i]['first_name'];
    //                     let mid_name = data[i]['mid_name'];
    //                     let position = data[i]['position'];
    //                     let profile_pic = data[i]['profile_pic'];
    //
    //                     let hmtl_data = '<img alt="Relax" class="rounded-full" src="'+profile_pic+'">';
    //                     $('#top_bar_profile').html(hmtl_data);
    //                 }
    //             }
    //         }
    //     });
    // }

    // $("body").on('click', '#btn_openDocument_Notification', function (){
    //
    //     let notif_type = $(this).data('notif-type');
    //     let full_name = $(this).data('fullname');
    //     let notif_title = $(this).data('notif-title');
    //     let notif_content = $(this).data('notif-content');
    //     let date_created = $(this).data('date-created');
    //     let notif_id = $(this).data('notif-id');
    //
    //     loadNotificationDetails(notif_type, notif_title, notif_content, full_name, date_created);
    //
    //     $.ajax({
    //         url: bpath + 'notification/details/load',
    //         type: "POST",
    //         data: {
    //             _token: _token,
    //             notif_id:notif_id,
    //         },
    //         success: function(response) {
    //
    //             // var data = JSON.parse(response);
    //             $('.__notification').load(location.href+' .__notification');
    //
    //
    //         }
    //     });
    //
    // });
    //
    // $("body").on('click', '#btn_openGroup_Notification', function (){
    //
    //     let notif_type = $(this).data('notif-type');
    //     let full_name = $(this).data('fullname');
    //     let notif_title = $(this).data('notif-title');
    //     let notif_content = $(this).data('notif-content');
    //     let date_created = $(this).data('date-created');
    //     let notif_id = $(this).data('notif-id');
    //
    //     loadNotificationDetails(notif_type, notif_title, notif_content, full_name, date_created);
    //
    //     $.ajax({
    //         url: bpath + 'notification/details/load',
    //         type: "POST",
    //         data: {
    //             _token: _token,
    //             notif_id:notif_id,
    //         },
    //         success: function(response) {
    //
    //             // var data = JSON.parse(response);
    //
    //         }
    //     });
    //
    // });

    // function loadNotificationDetails(notif_type, notif_title, notif_content, full_name, date_created){
    //
    //     let notification_Details = '';
    //     let confirm_Button = '';
    //     let pre_confirm = true;
    //
    //     if (notif_type == "document")
    //     {
    //         confirm_Button +=
    //             "Open <span class='ml-2 fa fa-arrow-circle-right'></span>"
    //
    //     }else {
    //         pre_confirm = false;
    //     }
    //
    //     notification_Details +=
    //         "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i>  <span class='font-medium whitespace-nowrap ml-1'>"+ notif_title +"</span></div>" +
    //         "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-user text-slate-500 mr-2'></i><span class='ml-1'>"+ full_name +"</span></div>" +
    //         "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-clock text-slate-500 mr-2'></i><span class='ml-1'>"+ date_created +"</span></div>" +
    //         "<div class='flex justify-start mt-3'> <i class='w-4 h-4 fa fa-message text-slate-500 mt-1 mr-2'></i><span style='text-align: left' class='ml-1'>"+ notif_content +"</span></div>"
    //
    //
    //     // notification_Details +=
    //     //     "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i>  <span class='font-medium whitespace-nowrap ml-1'>"+ data['notification_subject'] +"</span></div>" +
    //     //     "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-user text-slate-500 mr-2'></i><span class='ml-1'>"+full_name+"</span></div>" +
    //     //     "<div class='flex justify-start items-center mt-3'> <i class='w-4 h-4 fa fa-clock text-slate-500 mr-2'></i><span class='ml-1'>"+data['notification_created']+"</span></div>" +
    //     //     "<div class='flex justify-start mt-3'> <i class='w-4 h-4 fa fa-message text-slate-500 mt-1'></i><span class='flex justify-start items-center'>"+data['notification_content']+"</span></div>"
    //
    //     swal({
    //         title: 'Notification Details ',
    //         type: 'info',
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         showCloseButton: true,
    //         showConfirmButton: pre_confirm,
    //         confirmButtonText: '<div>'+confirm_Button+'</div>',
    //         confirmButtonColor: '#1e40af',
    //         timer: 6000,
    //         // footer: '<div>'+confirm_Button+'</div>',
    //         html:
    //             '<div class="rounded-md p-5">' +
    //             '   <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5"></div>' +
    //                     notification_Details +
    //             '</div>',
    //     }).then((result) => {
    //         //.log(result);
    //         if (result.value == true) {
    //             //Action
    //             action(notif_type);
    //         }
    //     });
    // }
    //
    // function action(notif_type) {
    //     if (notif_type == "document")
    //     {
    //         window.location.href = base_url + '/documents/incoming';
    //
    //     }else if (notif_type == "group")
    //     {
    //         window.location.href = base_url;
    //
    //     }else
    //     {
    //         window.location.href = base_url;
    //     }
    // }
//====================================================================================================
function load_Panels_Notif()
{
    $.ajax({
        type: "POST",
        url: bpath + 'load/panel/notification',
        data: {_token},
        dataType: 'json',

        success: function(response)
        {
            $('.load_panel_notif').empty();
            $(".load_panel_notif").html(response);
        },
        error: function(xhr, status, error) {
                console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
            }
    });
}


function load_hiring_notif_click()
{
    $('body').on( 'click' ,'.hiring_notif', function(){

        __dropdown_close('#__notification');

        hiring_notif_modal.show();

        let id = $(this).data("notif-id"),
            name = $(this).data("notif-name"),
            content = $(this).data("notif-content"),
            pic = $(this).data("notif-pic"),
            time = $(this).data("notif-time");
            pos = $(this).data("target-id");
            email = $(this).data("email");
            seen = $(this).data("seen");
            attach_code = $(this).data("attach-code");

            hiring_notif_id = id;
            seen_stat = seen;



        display_content_Info(id,content,name,pic,time,pos,email,attach_code);
    });
}

function seen_Notification()
{
    $("#notif_cancel").on("click",function(e){
        hiring_notif_modal.hide();
        update_seen(hiring_notif_id,seen_stat);
        $('.__notification_bell_div').load(location.href+' .__notification_bell_div');
        load_Panels_Notif();
    });
}

var notification_content;
function display_content_Info(id,content,name,pic,time,pos,email,attach_code)
{
    $.ajax({
        type: 'POST',
        url: bpath + 'display/notif/info',
        data: {_token,id,content,name,pic,time,pos,email,attach_code},
        dataType: 'json',

        success: function(response)
        {
            notification_content = response.content;
            // console.log(response);
            var attachments = response.attach_code;

            console.log(attachments);

            if (attachments != '' && attachments != 0 && attachments != null) {
                $('#attachment')
                    .addClass('text-primary cursor-pointer see_attachment')
                    .attr('data-attachments', attachments)
                    .css('text-decoration', 'none') // Initial text-decoration: none
                    .on('mouseover', function() {
                        $(this).css('text-decoration', 'underline');
                    })
                    .on('mouseout', function() {
                        $(this).css('text-decoration', 'none');
                    })
                    .text('View Attachments');
            } else {
                $('#attachment')
                    .removeClass('text-primary cursor-pointer see_attachment')
                    .removeAttr('data-attachments')
                    .css('text-decoration', 'none')
                    .off('mouseover')
                    .off('mouseout') 
                    .text('No File/s Attach');
            }

            if(response.status == true)
            {
                $("#notif_name_id").text(response.name);
                $("#notif_image").attr("src",response.pic);
                $("#notif_info_content").text(notification_content);
                $('#notif_time').text(response.time);
                $("#position_notif").text(response.position);
                $("#email").text(response.email);                
                

                $('.__notification_bell_div').load(location.href+' .__notification_bell_div');
            }
        },
        error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}


function update_seen(id,seen)
{
    $.ajax({
        type: 'POST',
        url: bpath + 'notification/status/update',
        data: {_token,id,seen},
        dataType: 'json',

        success:function()
        {

        },
        // error: function(xhr, status, error) {
        //     console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        // }
    });
}

var isContentVisible = false;
function see_attachment(){
    $("body").on('click', '.see_attachment', function () {
        var attach_code = $(this).data('attachments');

        $.ajax({
            type: "get",
            url: "/see/document-attachment",
            data: {_token: _token, attach_code: attach_code},
            success: function (response) {

               

                    if (isContentVisible) {

                        $("#notif_info_content").html(notification_content);
                        isContentVisible = !isContentVisible;
                        $('#attachment').text('View Attachments');
    
                    } else {
    
                        $("#notif_info_content").html(response);
                        isContentVisible = true;
    
                        $('#attachment').text('View Notification Content');
                    }

                

               
            }
        });
    });
}


//===================================================================================================================

$("body").on('click', '#clear_all_notif', function (){

    $.ajax({
        url: bpath + 'notification/clear/all',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function(response) {

            if (response.status == 200)
            {
                // $('.__notification').load(location.href+' .__notification');
                location.reload();
            }
        }
    });
});

function toggle_modal_application_notifications(){

    $('body').on('click', '.btn_notif_show_details', function (){

        __dropdown_close('#__notification');

        let notification_id = $(this).data('notification-id');
        let sender_id = $(this).data('sender-id');
        let notif_type = $(this).data('notif-type');

        $.ajax({
            url: bpath + 'notification/get/details',
            type: "POST",
            data: { _token, notification_id, sender_id },
            success: function(response) {

                if(response)
                {
                    let data = JSON.parse(response);

                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#applicants_notification_mdl'));
                    mdl.toggle();

                    $('.__notification_bell_div').load(location.href+' .__notification_bell_div');

                    load_employee_documents();

                    let profile_pic = data['profile_pic'];
                    let first_name = data['first_name'];
                    let last_name = data['last_name'];
                    let extension = data['extension'];
                    let notif_content = data['notif_content'];
                    let notif_sender = data['notif_sender'];
                    let date_created = data['date_created'];
                    let email = data['email'];
                    let position = data['position'];
                    let sender_designation_position = data['sender_designation_position'];
                    let full_name = '';

                    if(extension == '' || extension == 'N/A')
                    {
                         full_name = first_name +" "+last_name;
                    }else
                    {
                         full_name = first_name +" "+last_name +" "+ extension;
                    }

                    if(notif_type == 'applicants')
                    {
                        $('.position_div').show();

                    }else if(notif_type == 'user')
                    {
                        $('.position_div').hide();
                    }

                    $('#mdl_notif_position').text(position);
                    $('#mdl_notif_desig_pos').text(sender_designation_position);
                    $('#mdl_notif_full_name').text(full_name);
                    $('#mdl_notif_email').text(email);
                    $('#mdl_notif_content').text(notif_content);
                    $('#mdl_notif_profile_pic').attr('src', profile_pic);
                }

            }
        });
    });

}

function toggle_notification_bell(){

    $('body').on('click', '.__notificationBell', function (){
        // load_applicants_notification();
    });

    $('body').on('click', '.close_applicants_notif_mdl', function (){

        load_applicants_notification();

    });

}

function load_applicants_notification(){

    $.ajax({
        url: bpath + 'notification/for/applicants',
        type: "POST",
        data: {_token},
        success: function (response)
        {
            if (response)
            {
                let data = JSON.parse(response);
                let applicants_notification = data['applicants_notification'];

                $('.__notification_div').empty();

                $('.__notification_div').html(applicants_notification);

            }
        }
    });
}

function load_employee_documents(){

    $.ajax({
        url: bpath + 'notification/documents',
        type: "POST",
        data: {_token},
        success: function (response)
        {
            if (response)
            {
                let data = JSON.parse(response);
                let emp_doc_notification_html = data['emp_doc_notification_html'];

                $('.load_document_notifications').empty();

                 $('.load_document_notifications').html(emp_doc_notification_html);

            }
        }
    });
}

//========================RRROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOYYYYYYYYYYYYYYYYYYYYYYYY/=======================//

// function load_hired_applicant_notification(){
//     $.ajax({
//         url: bpath + 'notification/hired-applicant',
//         method: 'get',
//         data: {_token:_token},
//         success: function (response)
//         {
//             $('.__hired_notif_div').html(response);

//         }
//     });
// }

// function _onClick_hiredNotification(){
//     $("body").on('click', '.view_hired_notif', function () {
//         let notif_content = $(this).data('notif-content');
//         let notification_id = $(this).data('notification-id');
//         let sender_id = $(this).data('sender-id');
//         let sender_position = $(this).data('sender-position');
//         let sender_email = $(this).data('sender-email');
//         let time_sent = $(this).data('time-sent');
//         let profile_pic = $(this).data('prof-pic');
//         let profile_name = $(this).data('profile-name');

//         $('#sender_image').attr('src', profile_pic);
//         $('#sender_position').text(sender_position);
//         $('#sender_email').text(sender_email);
//         $('#time_sent').text(time_sent);
//         $('#notif_content').text(notif_content);
//         $('#sender_name').text(profile_name);

//         const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#notif_hired_Applicant'));
//         mdl.toggle();
//         // alert(notif_content +'-- '+notification_id+'-- '+sender_id);
//         $.ajax({
//             url: bpath + 'notification/interview-update/'+notification_id,
//             method: 'post',
//             data: {_token:_token},
//             success: function (response)
//             {console.log(response);
//                 if(response.status == "success"){


//                 }


//             }
//         });
//     });
// }
// function closeHired_modal(){
//     $("body").on('click', '.closeHired_modal', function () {
//         load_hired_applicant_notification();
//         load_selected_notification();
//     });
// }

// function load_selected_notification(){
//     $.ajax({
//         url: bpath + 'notification/selected-applicant',
//         method: 'get',
//         data: {_token:_token},
//         success: function (response)
//         {
//             // console.log(response);
//             $('._seleted_notification').html(response);

//         }
//     });
// }



