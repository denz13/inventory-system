var base_url = window.location.origin;
var doc_file_id;

$(document).ready(function (){

    bpath = __basepath + "/";
    load_document_count();
});

$("body").on('click', '#btn_viewAttachments', function (){

    let docID = $(this).data('trk-no');


    $.ajax({
        url: bpath + 'docs-view/load',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function(response) {

            var data = JSON.parse(response);

            if(data.length > 0) {

                loadDocViewAttachments(data);
            }else
            {
                swal({
                    type: 'info',
                    title: 'Attachments Information',
                    // text: document_message,
                    html:
                        '<div class="intro-y p-5">'+
                        '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
                            '<div class="text-justify mb-4">No Uploaded Attachments Found!</div>'+
                        '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
                        '</div>',
                });
            }
        }
    });
});

$("body").on('click', '#btn_markAsComplete', function (){

    let docID = $(this).data('trk-no');

    let _is_admin = $(this).data('admin');

    markAsComplete(docID, _is_admin);

});

function loadDocViewAttachments(data){
    var filename = '';
    var added_files = '';
    var Added_attachments = '';
    var Original_attachments = '';
    var add_attachment_button = '';

    for (let o = 0; o<data.length; o++)
    {
        var path = data[o]['path'];
        var count = data[o]['view_count'];
        var doc_attachment_id = data[o]['id'];
        doc_file_id = data[o]['doc_file_id'];
        var File_name = data[o]['name'];
        var added_attachments = data[o]['added_attachments'];
        var full_name = data[o]['full_name'];
        var date_created = data[o]['date_created'];


        var if_authenticated = data[o]['check_login'];

        // if(if_authenticated == true)
        // {
        //     add_attachment_button =  '<button id="btn_add_document_attachments" data-tracking-number="'+doc_file_id+'" class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">'+
        //                             '<span class="truncate mr-5">Add Document Attachment(s)</span>'+
        //                             '<span class="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5"> <i class="fa fa-plus-circle w-4 h-4"></i> </span>'+
        //                             '</button>';
        // }else{
        //     add_attachment_button;
        // }

        var view_count = 0;
        if (count == null)
        {
            view_count = 0;
        }else
        {
            view_count = count;
        }


        if(added_attachments == 0)
        {
            filename +="<a id='attachment_count_view' data-doc-att-id='"+doc_attachment_id+"' class='flex items-center mb-2' href='/documents/download-documents/"+path+"' target='_blank'>"+
                "<div style='text-align: left; padding-left: 0.75rem; padding-right: 0.75rem' class='text-toldok2 underline decoration-dotted whitespace-nowrap'>" + File_name +  "</div>"+
                "<div style='padding-left: 0.75rem; padding-right: 0.75rem' class='ml-auto'>" +view_count+ "</div>"+
                "</a>";

            Original_attachments = '<div style="border-radius: 0.375rem;" class="alert-primary show p-3">Original Attachment(s)</div>'+
                                    '<div class="flex pl-3 pr-3 mt-3">'+
                                        '<div>File Name</div>'+
                                        '<div class="ml-auto">File Views</div>'+
                                    '</div>' +
                                    '<div class="border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"></div>'+
                                        filename+
                                    '<div class="border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"></div>';

        }else if(added_attachments == 1)
        {
            added_files +=  "<div id='attachment_count_view' data-doc-att-id='"+doc_attachment_id+"' class='flex items-center mb-2 tooltip' title='"+full_name+"'>"+
                                "<a style='text-align: left; padding-left: 0.75rem; padding-right: 0.75rem' class='text-toldok2 underline decoration-dotted whitespace-nowrap' href='/documents/download-documents/"+path+"' target='_blank'>" + File_name +  "</a>"+
                                "<a id='view_creator' data-tw-toggle='modal' data-tw-target='#added_documents_creator' " +
                                    "data-doc-creator='"+full_name+"' " +
                                    "data-doc-filename='"+File_name+"' " +
                                    "data-doc-created='"+date_created+"' " +
                                    "style='padding-left: 0.75rem; padding-right: 0.75rem' " +
                                "href='javascript:;'><div class='ml-2 fa-solid fa-circle-info text-primary'></div>" +
                                "</a>"+
                                "<div style='padding-left: 0.75rem; padding-right: 0.75rem' class='ml-auto'>" +view_count+ "</div>"+
                            "</div>";

            Added_attachments = '<div style="border-radius: 0.375rem;" class="alert-dark show p-3">Added Attachment(s)</div>'+
                                '<div class="flex pl-3 pr-3 mt-3">'+
                                    '<div>File Name</div>'+
                                    '<div class="ml-auto">File Views</div>'+
                                '</div>' +
                                '<div class="border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"></div>'+
                                    added_files+
                                '<div class="border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"></div>';
        }
    }

    swal({
        type: 'info',
        title: 'Attachment(s) Information',
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: true,
        // timer: 6000,
        // showCancelButton: true,
        showConfirmButton: false,
        // cancelButtonText: 'Close',
        // cancelButtonColor: '#0000b5',
        html:
        '<div class="col-span-12 md:col-span-6 lg:col-span-4 mt-2">'+
        '<div class="intro-y p-5 mt-12 sm:mt-5">'+

            //Original Attachments
                Original_attachments+

            //Added Attachments
                Added_attachments+

            /*      Button Area     */
            add_attachment_button+
            // '<button id="btn_add_document_attachments" data-tracking-number="'+doc_file_id+'" class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">'+
            // '<span class="truncate mr-5">Add Document Attachment(s)</span>'+
            // '<span class="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5"> <i class="fa fa-plus-circle w-4 h-4"></i> </span>'+
            // '</button>'+
            // '<button id="btn_ViewAttachmentTrackingRecord" data-tracking-number="'+doc_file_id+'" class="btn btn-outline-secondary w-full border-slate-300 dark:border-darkmode-300 border-dashed relative justify-start mb-2">'+
            //     '<span class="truncate mr-5">View Tracking Record</span>'+
            //     '<span class="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5"> <i class="fa fa-arrow-circle-right w-4 h-4"></i> </span>'+
            // '</button>'+
        '</div>'+
    '</div>',
    });
}

$("body").on('click', '#attachment_count_view', function (){

    let document_attachment_id = $(this).data('doc-att-id');

    $.ajax({
        url: bpath + 'count/docs/view',
        type: "POST",
        data: {
            _token: _token,
            document_attachment_id:document_attachment_id,
        },
        success: function(response) {

            // if(response.status == 200)
            // {
            //     load_receivedDocs();
            //     load_publicFiles();
            // }
        }
    });

});

$("body").on('click', '#btn_showIncomingDetails', function (){

    let docID = $(this).data('trk-no');

    $.ajax({
        url: bpath + 'documents/incoming/incoming-docs-details/load',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function(response) {

            var data = JSON.parse(response);

            if(data.length > 0) {
                loadDocDetails(data);
                load_document_count();
            }
        }
    });
});

$("body").on('click', '#btn_showDetails', function (){

    let docID = $(this).data('trk-no');
    let track_id = $(this).data('trk-id');

    $.ajax({
        url: bpath + 'docs-details/load',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
            track_id:track_id,
        },
        success: function(response) {

            var data = JSON.parse(response);

            if(data.length > 0) {
                loadDocDetails(data);
            }
        }
    });
});

$("body").on('click', '#view_creator', function (){
    let full_name = $(this).data('doc-creator');
    let file_name = $(this).data('doc-filename');
    let date_created = $(this).data('doc-created');

    let attachment_data =
        '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Added by: <div class="ml-2">'+full_name+'</div></div>'+
        '<div class="flex items-center mt-3"><i class="fa-regular fa-clipboard w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Document Name: <div class="underline decoration-dotted ml-2">'+file_name+'</div></div>'+
        '<div class="flex items-center mt-3"><i class="fa-regular fa-calendar w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Date Added: <div class="ml-2">'+date_created+'</div></div>';

    $("#public_files_added_documents_creator_details").html(attachment_data);

});

function loadDocDetails(data){
    var fileDetails = '';
    var statsClass = '';
    var stats = '';
    var attachment = '';
    var docStats_class = '';
    var level_class = '';
    var doc_tracking_number = '';

    for (let i = 0; i < data.length; i++) {

        if (data[i]['active'] == 1)
        {
            stats = 'Active';
        }else {
            stats = 'In-Active';
        }

        if(data[i]['type_submitted'] === "Both")
        {
            attachment = 'Hard Copy, Soft Copy';
        }

        doc_tracking_number = data[i]['track_number'];
        level_class += "bg-"+data[i]['class_level']+"/20 text-"+data[i]['class_level']+" rounded px-2 ml-2 mr-2";
        docStats_class += "bg-"+data[i]['class']+"/20 text-"+data[i]['class']+" rounded px-2 ml-1";
        statsClass += "bg-success/20 text-success rounded px-2 ml-1";

        fileDetails +=
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i> Name:         <span class='ml-2 text-justify'>"+ data[i]['name'] +"</span> </div>" +
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i> Tracking Number: <a href='javascript:;' class='underline decoration-dotted ml-2'>"+ doc_tracking_number +"</a> </div>" +
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i> Type:<span class='ml-2'>"+ data[i]['type'] +"</span></div>" +
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i> Level:<span class='"+level_class+"'>"+ data[i]['level'] +"<span class='ml-1'>- "+data[i]['desc_level']+"</span></div>" +
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-clipboard text-slate-500 mr-2'></i> Status:<span class='"+docStats_class+"'>"+ data[i]['status'] +"</span></div>"+
            // "<div class='flex items-center mt-3'> <i class='w-4 h-4 fa fa-user text-slate-500 mr-2'></i> From:<span class='ml-2'>"+ data[i]['__from'] +"</span></div>"

            '<div class=" p-5 mt-5">'+
                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 pb-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"> <i  class="fa fa-clipboard w-4 h-4 text-slate-500 ml-auto"></i> Name</div>'+
                        '<div class="mt-1 pl-3">'+ data[i]['name'] +'</div>'+
                    '</div>'+
                '</div>'+
                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"><i class="fa fa-clipboard w-4 h-4 text-slate-500 ml-auto"></i>  Tracking Number</div>'+
                        '<div class="mt-1 pl-3">'+ doc_tracking_number +'</div>'+
                    '</div>'+
                '</div>'+

                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"><i class="fa fa-clipboard w-4 h-4 text-slate-500 ml-auto"></i>  Type</div>'+
                        '<div class="mt-1 pl-3">'+ data[i]['type'] +'</div>'+
                    '</div>'+
                '</div>'+

                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"><i class="fa fa-clipboard w-4 h-4 text-slate-500 ml-auto"></i>  Level</div>'+
                        '<div class="mt-1 pl-3"><span class="'+level_class+'">'+ data[i]['level'] +'<span class="ml-1">- '+data[i]['desc_level']+'</span></div>'+
                    '</div>'+
                '</div>'+

                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"><i class="fa fa-clipboard w-4 h-4 text-slate-500 ml-auto"></i>  Status</div>'+
                        '<div class="mt-1 pl-3"><span class="'+docStats_class+'">'+ data[i]['status'] +'</span></div>'+
                    '</div>'+
                '</div>'+

                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">'+
                    '<div style="text-align: left">'+
                        '<div class="text-slate-500"><i class="fa fa-user w-4 h-4 text-slate-500 ml-auto"></i>  From</div>'+
                        '<div class="mt-1 pl-3"><span class="ml-2">'+ data[i]['__from'] +'</span></div>'+
                    '</div>'+
                '</div>'+

            '</div>'

        }

    swal({
        title: 'Document Details',
        text: "choose action to proceed.",
        type: 'info',
        confirmButtonColor: '#1e40af',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: '<i class="fa fa-tasks w-3 h-3 mr-2"></i>Done',
        html:
            '<div class="rounded-md mt-1">' +
            '   <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5"></div>' +
                    fileDetails +
            '<button id="btn_ViewAttachmentTrackingRecord" data-tracking-number="'+doc_tracking_number+'" class="btn btn-outline-secondary w-full border-slate-300 dark:border-darkmode-300 border-dashed relative justify-start mt-5">'+
                '<span class="truncate mr-5">View Tracking Record</span>'+
                '<span class="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5"> <i class="fa fa-arrow-circle-right w-4 h-4"></i> </span>'+
            '</button>'+
            '</div>',
    });
}

$("body").on('click', '#btn_incomingDocs_receive', function (){

    let docID = $(this).data('trk-no');
    let track_id = $(this).data('trk-id');
    //incoming_Receivedocs(docID);

    load_document_details(docID,track_id);


    load_notification(docID);
});

function load_document_details(docID,track_id){
    //load notification from the user
    $.ajax({
        url: bpath + 'documents/incoming/doc/details',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function (data) {

            var data = JSON.parse(data);
            //.log(data);
            receive_action(data,track_id);
            //release_action(data);

        }
    });
}

function load_notification(docID){
    //load notification from the user
    $.ajax({
        url: bpath + 'incoming-update-notification',
        type: "POST",
        data: {
            _token: _token,
            subject_id:docID,
        },
        success: function (data) {
            if (data.status === 200)
            {
                $('.__notification').load(location.href+' .__notification');
            }
        }
    });
}

function receive_action(data,track_id){
    var doc_track =data['getDoc']['track_number'];
    var optionValue = data['option_Value'];

    swal({
        title: 'Receive Document',
        text: "choose action to proceed.",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
        '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">'+
        '<div class=" text-center">'+
            '<div class="flex pt-5">'+
                '<div class="w-full flex flex-col lg:flex-row items-center">'+
                    '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">'+
                    '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>'+
                        '<a href="javascript:;" class="font-medium">'+data['getDoc']['track_number']+'</a>'+

                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="text-center lg:text-left p-5">'+
                '<div class="text-slate-500 text-xs mt-2">Title</div>'+
                '<div class="font-medium">'+data['getDoc']['name']+'</div>'+
                '<div class="text-slate-500 text-xs mt-2">Description</div>'+
                '<div class="">'+data['getDoc']['desc']+'</div>'+

                '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-3">'+
                '<label  class="text-slate-500 text-xs mt-0.5">Receive as</label>'+

                    '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-1 zoom-in">'+
                        optionValue+
                    '</select>'+
                '</div>'+
                '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">'+
                '<label  class="text-slate-500 text-xs mt-0.5">Note</label>'+
                    '<textarea id="swal_receive_message" class="form-control swal_receive_message mt-1 zoom-in" name="swal_receive_message" placeholder="Add a message" value=""></textarea>'+
                '</div>'+

                '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">'+
                    '<label  class="text-slate-500 text-xs mt-0.5">Action</label>'+
                    '<select id="swal_receive_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select mt-1 swal_receive_message zoom-in">'+
                        '<option value="6"> Receive</option>'+
                    '</select>'+
                '</div>'+
            '</div>'+

        '</div>'+
    '</div>',
        preConfirm:function(){
            doc_sendAstype = $('#doc_sendAs').find(':selected').data('ass-type');
            doc_sendAs= $('#doc_sendAs').val();
            swal_receive_message= $('#swal_receive_message').val();
            swal_receive_action= $('#swal_receive_action').val();

        }}).then((result) => {
            if (result.value == true) {
                var acpre = '';
                var acpass = '';
                if(swal_receive_action == 6){
                    acpre = 'Receive';
                    acpass = 'Received';
                }else if(swal_receive_action == 5){
                    acpre = 'Hold';
                    acpass = 'Hold';
                }else{
                    acpre = 'Return';
                    acpass = 'Returned';
                }

                swal({
                    text:"Document is now on "+acpre+" files!",
                    title:"Document successfully "+acpass+"!",
                    type:"success",
                    confirmButtonColor: '#1e40af',
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });

                //Action

                incoming_receive_action(doc_track,track_id,swal_receive_message,swal_receive_action,doc_sendAstype,doc_sendAs);
                //load_incomingDocs();


            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal({
                    title:"Cancelled",
                    text:"No action taken!",
                    type:"error",
                    confirmButtonColor: '#1e40af',
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });
                //Action

            }
        });
        load_document_count();
}

function incoming_receive_action(docID,track_id,note,action,doc_sendAstype,doc_sendAs){

    $.ajax({
        url: bpath + 'documents/incoming/take/action',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
            track_id:track_id,
            note:note,
            action:action,
            doc_sendAstype:doc_sendAstype,
            doc_sendAs:doc_sendAs,
        },
        success: function(response) {
            var data = JSON.parse(response);
            //.log(data);
            if(data.status == 200)
            {
                load_incomingDocs();
            }
            load_document_count();
            //__notif_load_data(__basepath + "/");
        }
    });

}

function markAsComplete(docID, _is_admin){

    let select_options = '';
    if(_is_admin == "Admin")
    {
        select_options = '<select id="swal_mark_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select sm:mr-2 swal_receive_message">'+
                        '<option value="1">Pending</option>'+
                        '<option value="2">Outgoing</option>'+
                        '<option value="7">Completed</option>'+
                        '</select>';
    }else
    {
        select_options = '<select id="swal_mark_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select sm:mr-2 swal_receive_message">'+
            '<option value="2">Outgoing</option>'+
            '<option value="7">Completed</option>'+
            '</select>';
    }
    swal({
        title: 'Update Status',
        text: "choose action to proceed.",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: 'Done',
        footer: '<a href="#">Are you facing any issue?</a>',
        html:
            '<div>'+
                '<div class="mr-2">'+
                    '<label class="form-label w-full flex flex-col sm:flex-row">Tracking Number <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>'+
                    '<input id="send_DocCode" disabled name="send_DocCode" type="text" value="'+docID+'" class="form-control">'+
                '</div>'+
                '</div>'+
                '<div>'+
                    '<label class="form-label w-full flex flex-col sm:flex-row mt-2">Action <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>'+
                    '<div class="mt-2">'+
                        select_options+
                '</div>'+
            '</div>',

        preConfirm:function(){
            swal_mark_action = $('#swal_mark_action').val();
        },
    }).then((result) => {
        if (result.value === true) {
            var acpre = '';
            var acpass = '';

            if (swal_mark_action == 1)
            {
                acpre = 'Pending';
                acpass = 'Mark as Pending';

            } else if(swal_mark_action == 2)
            {
                acpre = 'Outgoing';
                acpass = 'Mark as Outgoing';

            }else
            {
                acpre = 'Complete';
                acpass = 'Mark as Complete';
            }

            swal({
                title:"Status "+acpre+"!",
                text:"Document "+acpass+"!",
                type:"success",
                confirmButtonColor: '#1e40af',
                    timer: 500
            });
            //Action
            update_as_complete(docID, swal_mark_action);
            load_createdDocs();

        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal({
                title:"Cancelled",
                text:"No action taken!",
                type:"error",
                confirmButtonColor: '#1e40af',
                    timer: 500
            });
            //Action

        }
    });
}

function update_as_complete(docID, swal_mark_action){
    $.ajax({
        url: bpath + 'documents/docs-mark-as-complete',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
            swal_mark_action:swal_mark_action,
        },
        success: function(response) {
            if(response.status === 200)
            {
                __notif_load_data(__basepath + "/");
                load_createdDocs();
            }else {
                __notif_load_data(__basepath + "/");
            }
        }
    });
}

function incoming_Receivedocs(docID){


    swal({
        title: 'Receive Document',
        text: "choose action to proceed.",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: 'Done',
        footer: '<a href="#">Are you facing any issue?</a>',
        html:
        '<div>'+
        '<div class="mr-2">'+
            '<label class="form-label w-full flex flex-col sm:flex-row">Tracking Number <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>'+
            '<input id="send_DocCode" disabled name="send_DocCode" type="text" value="'+docID+'" class="form-control">'+
        '</div>'+
        '</div>'+
        '<div class="col-span-12 sm:col-span-6 mt-2">'+
            '<label class="form-label w-full flex flex-col sm:flex-row"> Note <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Add comment</span> </label>'+
            '<textarea id="swal_receive_message" class="form-control swal_receive_message" name="swal_receive_message" placeholder="Type your message" value="" minlength="10" required=""></textarea>'+
        '</div>'+
        '<div>'+
            '<label class="form-label w-full flex flex-col sm:flex-row">Action <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>'+
            '<div class="mt-2">'+
                '<select id="swal_receive_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select mt-2 sm:mr-2 swal_receive_message">'+
                    '<option value="6">Receive</option>'+
                    '<option value="8">Release</option>'+
                    '<option value="5">Hold</option>'+
                    '<option value="4">Return</option>'+
                '</select>'+
            '</div>'+
        '</div>',
        preConfirm:function(){
            swal_receive_message= $('#swal_receive_message').val();
            swal_receive_action= $('#swal_receive_action').val();
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = '';
            var acpass = '';
            if(swal_receive_action == 6){
                acpre = 'Receive';
                acpass = 'Received';
            }else if(swal_receive_action == 5){
                acpre = 'Hold';
                acpass = 'Hold';
            }else{
                acpre = 'Return';
                acpass = 'Returned';
            }

            swal({
                title:"Document is now on "+acpre+"!",
                text:"Document successfully "+acpass+"!",
                type:"success",
                confirmButtonColor: '#1e40af',
                    timer: 500

            });
            //Action
            incoming_receive_action(docID,swal_receive_message,swal_receive_action);

            load_incomingDocs();

        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal({
                title:"Cancelled",
                text:"No action taken!",
                type:"error",
                confirmButtonColor: '#1e40af',
                    timer: 500
            });
            //Action

        }
    })


}

$("body").on('click', '.swal_name_tbl', function (){

    let name = $(this).data('trk-name');
    let doc_status = $(this).data('doc-status');
    let trackNumber = $(this).data('trk-number');
    let total_recipients = $(this).data('total-recipients');
    let status_class = $(this).data('status-class');

    loadName(name, trackNumber, doc_status, total_recipients, status_class);
});

function loadName(data, trackNumber, doc_status, total_recipients, status_class){
    //var ga = QrCode::size(200)->backgroundColor(255,55,0)->generate('W3Adda Laravel Tutorial');

    let recipients = '';

    if (total_recipients == 0)
    {
        recipients += '';

    }else
    {
        recipients += '<div class="flex items-center mt-2"> Recipient: <span class="ml-2 mr-2">'+total_recipients+'</span> person(s) </div>';
    }
    swal({
        title: 'Document QR Code',
        type: 'info',
        confirmButtonColor: '#1e40af',
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">'+
                '<div>'+
                    '<div class="p-5">'+
                        '<div class="p-5 image-fit zoom-in">'+
                        '<div id="qrcode" class="mt-4 flex justify-center rounded-md"></div>'+
                    '</div>'+
                    '<div class="text-slate-600 dark:text-slate-500 mt-5">'+

                        '<div class="flex items-center"> Title: <span class="ml-2 text-justify">'+data+'</span> </div>'+
                        '<div class="flex items-center mt-2"> Tracking Number: <span class="ml-2">'+trackNumber+'</span> </div>'+
                        recipients+
                        '<div class="flex items-center mt-2">  Status: <span class="bg-'+status_class+'/20 text-'+status_class+' rounded px-2 ml-1">'+ doc_status +'</span> </div>'+


                    '</div>'+
                    '</div>'+
                    '<div class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">'+
                    '<a class="flex items-center text-primary mr-auto" href="'+base_url+'/track/doctrack/'+trackNumber+'" target="_blank"> <i class="fa fa-map-marked w-4 h-4 mr-2 text-primary"></i> Track </a>'+
                    '<a class="flex items-center mr-3" href="'+base_url+'/print-qr/'+trackNumber+'/pos_top_right" target="_blank"> <i class="fa fa-print w-4 h-4 mr-2 text-primary"></i> Print </a>'+
                    '</div>'+
                '</div>'+
            '</div>',
    });

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: trackNumber,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

$("body").on('click', '#btn_ViewAttachmentTrackingRecord', function (){

    let tracking_number = $(this).data('tracking-number');
    window.open(base_url +'/track/doctrack/'+tracking_number, "_blank");
});


$("body").on('click', '#btn_scan_with_qr', function (){

    let docID = $(this).data('trk-no');
    incoming_Receivedocs_QR(docID);


});

function incoming_Receivedocs_QR(docID){
    var base_url = window.location.origin;

    swal({
        title: 'Scan QRcode!',
        text: "choose action to proceed.",
        type: '',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: 'Done',
        footer: '<a href="'+base_url+'/track/doctrack/'+docID+'" target="_blank">View Track Record</a>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
        '<div>'+
        '<div class="mr-2">'+
            '<label class="form-label w-full flex flex-col sm:flex-row">Tracking Number <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>'+
            '<input id="send_DocCode" disabled name="send_DocCode" type="text" value="'+docID+'" class="form-control">'+
        '</div>'+
        '</div>'+
        '<div class="col-span-12 sm:col-span-6 mt-2">'+
            '<label class="form-label w-full flex flex-col sm:flex-row"> QR <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Scan Qrcode</span> </label>'+
            '<input id="from_qr" name="from_qr" type="text" value="" class="form-control">'+
        '</div>',
        preConfirm:function(){
            from_qr= $('#from_qr').val();

                if(from_qr == ''){
                    Swal.showValidationMessage(`Please enter login and password`);

                }


        },
    }).then((result) => {
        if (result.value == true) {
            //Action


        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal({
                title:"Cancelled",
                text:"No action taken!",
                type:"error",
                confirmButtonColor: '#1e40af',
                    timer: 500
            });
            //Action

        }
    })

    focusfromqr();
}

function focusfromqr(){
    setTimeout(function() {

        document.getElementById('from_qr').focus();

      }, 500);
}

//For release action
$("body").on('click', '#btn_releaseDocs_release', function (){
    let docID = $(this).data('trk-no');
    //incoming_Receivedocs(docID);

    load_document_details_release(docID);

});

function load_document_details_release(docID){
    //load notification from the user
    $.ajax({
        url: bpath + 'documents/incoming/doc/details',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function (data) {

            var data = JSON.parse(data);
            //.log(data);
            //receive_action(data);
            release_action(data);
        }
    });
}

function release_action(data){
    var docID =data['getDoc']['track_number'];
    var optionValue = data['option_Value'];
    var release_to = data['release_to'];
    var created_at = data['created_at'];

    swal({
        title: 'Release Document ',
        text: "choose action to proceed.",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: '<i class="icofont-upload-alt w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
        '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">'+
        '<div class=" text-center">'+
            '<div class="flex pt-5">'+
                '<div class="w-full flex flex-col lg:flex-row items-center">'+
                    '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">'+
                    '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>'+
                        '<a href="javascript:;" class="font-medium">'+data['getDoc']['track_number']+'</a>'+

                    '</div>'+
                '</div>'+
                '<div class="absolute right-0 top-0 mr-5 mt-3 dropdown">'+
                    '<a href="javascript:;" class="font-medium"></a>'+
                '</div>'+
            '</div>'+
            '<div class="text-center lg:text-left p-5">'+
                '<div class="text-slate-500 text-xs mt-2">Title</div>'+
                '<div class="font-medium ml-2">'+data['getDoc']['name']+'</div>'+
                '<div class="text-slate-500 text-xs mt-2">Description</div>'+
                '<div class="ml-2">'+data['getDoc']['desc']+'</div>'+

                '<div class="form-check form-switch flex flex-col items-start mt-3">'+
                '<label for="post-form-5" class="text-slate-500 text-xs mt-0.5">Release as:</label>'+
                    '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-2 zoom-in">'+
                        optionValue+
                    '</select>'+
            '</div>'+
                '<div class="form-check form-switch flex flex-col items-start mt-3">'+
                '<label for="post-form-5" class="text-slate-500 text-xs mt-0.5">Action</label>'+
                '<select id="swal_release_action" name="swal_release_action" data-placeholder="Select your action" class="form-select mt-2  swal_release_action zoom-in">'+
                    '<option value="8"> Release</option>'+
                '</select>'+
            '</div>'+

                '<div class="form-check form-switch flex flex-col items-start mt-3">'+
                '<label for="post-form-5" class="text-slate-500 text-xs mt-0.5">Release to: (has trail)</label>'+
                '<select id="swal_release_to" name="swal_release_to" data-placeholder="Person on trail;" class="form-select mt-2  swal_release_to zoom-in">'+
                    release_to+
                '</select>'+
            '</div>'+
            '</div>'+

        '</div>'+
    '</div>',
        preConfirm:function(){

            doc_sendAstype = $('#doc_sendAs').find(':selected').data('ass-type');
            swal_release_to= $('#swal_release_to').val();
            swal_release_action= $('#swal_release_action').val();
            doc_sendAs= $('#doc_sendAs').val();
            swal_release_textarea= $('#swal_release_textarea').val();

        }}).then((result) => {
            if (result.value == true) {

                $.ajax({
                    url: bpath + 'documents/received/release/action',
                    type: "POST",
                    data: {
                        _token: _token,
                        docID:docID,
                        swal_release_to:swal_release_to,
                        swal_release_action:swal_release_action,
                        doc_sendAs:doc_sendAs,
                        swal_release_textarea:swal_release_textarea,
                        doc_sendAstype:doc_sendAstype,
                    },
                    success: function(data) {

                        var data = JSON.parse(data);
                        //.log(data);
                        if (data.status == 200)
                        {
                            load_receivedDocs();
                        }
                    }
                });



                swal({
                    text:"Document Released!",
                    title:"Document successfully released!",
                    type:"success",
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });

                //Action


            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal({
                    title:"Cancelled",
                    text:"No action taken!",
                    type:"error",
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });
                //Action

            }

        });
}

$("body").on('click', '#btn_return', function (){

    let docID = $(this).data('trk-no');

    $.ajax({
        url: bpath + 'docs-details/load',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function(response) {

            var data = JSON.parse(response);

            if(data.length > 0) {
                loadDocDetails(data);
            }
        }
    });
});

$("body").on('click', '#btn_hold', function (){

    let docID = $(this).data('trk-no');

    $.ajax({
        url: bpath + 'docs-details/load',
        type: "POST",
        data: {
            _token: _token,
            docID:docID,
        },
        success: function(response) {

            var data = JSON.parse(response);

            if(data.length > 0) {
                loadDocDetails(data);
            }
        }
    });
});

function document_message(your_message, sender_message, doc_from) {

    let you = '';

    if(!sender_message)
    {
        sender_message = 'No message attached!'
    }
    if (your_message != null || sender_message != null)
    {
        if (your_message)
        {
            you = '<div class="text-justify mb-4"><span class="fa-regular fa-message"></span><span class="ml-2">You: '+your_message+' </span></div>';
        }
        swal({
            type: 'info',
            title: 'Document Message',
            // text: document_message,
            html:
                '<div class="intro-y p-5">'+
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
                '<div class="text-justify mb-4"><span class="fa-solid fa-user"></span><span class="ml-2">From: '+doc_from+' </span></div>' +
                '<div class="text-justify mb-4"><span class="fa-solid fa-message"></span><span class="ml-2">Sender: '+sender_message+' </span></div>'+
                    you+
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400"></div>'+
                '</div>',
        });
    }else
    {
        swal({
            type: 'warning',
            title: 'Document Message',
            html:
                '<div class="intro-y p-5">'+
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
                '<div class="text-justify  mb-4">Document has no message attached!</div>'+
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400"></div>'+
                '</div>',
        });
    }

}


function load_document_count(){

    $.ajax({
        url: bpath + 'admin/load/document/count',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function(response) {
            var data = JSON.parse(response);
            $('#my_documents_count_div').empty();
            $('#my_documents_count_div').append(data.my_documents_count_div);

            $('#my_incoming_count_div').empty();
            $('#my_incoming_count_div').append(data.my_incoming_count_div);

            $('#my_received_count_div').empty();
            $('#my_received_count_div').append(data.my_received_count_div);


            $('#my_outgoing_count_div').empty();
            $('#my_outgoing_count_div').append(data.my_outgoing_count_div);

            $('#my_hold_count_div').empty();
            $('#my_hold_count_div').append(data.my_hold_count_div);


            $('#my_returned_count_div').empty();
            $('#my_returned_count_div').append(data.my_returned_count_div);

            $('#my_trash_count_div').empty();
            $('#my_trash_count_div').append(data.my_trash_count_div);


            // console.log(data);
        }
    });

}
