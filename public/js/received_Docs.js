
$(document).ready(function () {

    bpath = __basepath + "/";

    load_receivedDocsDataTable();
    load_receivedDocs();

});

var _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_incomingDocs;
var tbl_data_added_attachments;
var tbl_data_original_attachments;
var received_document_tracking_number;

function load_receivedDocsDataTable() {

    try {
        /***/
        tbl_data_incomingDocs = $('#dt__receivedDocs').DataTable({
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

            columnDefs:
                [
                    { className: "dt-head-center", targets: [3, 7, 8] },
                ],
        });


        tbl_data_original_attachments = $('#dt_received_original_attachments').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-2 babaw sa show'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-1 obos sa show'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            // renderer: 'bootstrap',
            // "info": false,
            // "bInfo":true,
            // "bJQueryUI": true,
            // "bProcessing": true,
            // "bPaginate" : true,
            // "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            // "iDisplayLength": 10,
            // "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [2] },
                ],
        });

        tbl_data_added_attachments = $('#dt_received_added_attachments').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-2 babaw sa show'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-1 obos sa show'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            // renderer: 'bootstrap',
            // "info": false,
            // "bInfo":true,
            // "bJQueryUI": true,
            // "bProcessing": true,
            // "bPaginate" : true,
            // "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            // "iDisplayLength": 10,
            // "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [3] },
                ],
        });

        /***/

        add_users_to_trail = $('.select2-multiple').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

        $('#forward_received_emp_List').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

    } catch (err) { }
}

function load_receivedDocs() {
    showLoading();
    $.ajax({
        url: bpath + 'documents/received/received-docs/load',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {

            tbl_data_incomingDocs.clear().draw();
            /***/

            var data = JSON.parse(data);

            //.log(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    /***/

                    //.log();

                    var release_type = data[i]['release_type'];
                    let trail_button = '';
                    let for_action_button = '';
                    let release_button = '';
                    var attachments = '';
                    let receive_action = data[i]['action'];

                    var createdDoc_id = data[i]['id'];
                    var track_number = data[i]['track_number'];
                    var track_id = data[i]['track_id'];
                    var name = data[i]['name'];
                    var desc = data[i]['desc'];
                    var type = data[i]['type'];
                    var status = data[i]['status'];
                    var status_class = data[i]['class'];
                    var level = data[i]['level'];
                    var type_submitted = data[i]['type_submitted'];
                    var base_url = window.location.origin;
                    var tool_tip_title = '';
                    var note = data[i]['note'];
                    var original_note = data[i]['original_note'];
                    var doc__from = data[i]['__from'];

                    var message_icon = '';
                    var level_class = data[i]['level_class'];
                    var sender = data[i]['sender'];

                    var doc_type = data[i]['doc_type'];
                    var doc_type_id = data[i]['doc_type_id'];

                    var action = data[i]['action'];
                    var seen = data[i]['seen'];

                    var seen_done = '';
                    if (seen == 0) {
                        seen_done = '<div  class="w-2 h-2 flex items-center justify-center text-xs text-white rounded-full bg-danger font-medium"></div>';
                    }

                    if (type_submitted == "Both") {
                        type_submitted = "Hard Copy, Soft Copy";
                        attachments += '<a id="btn_received_viewAttachments" href="javascript:;" data-trk-no="' + track_number + '" data-doc-sender="' + sender + '"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-' + status_class + '"></i>' + type_submitted + '</div></a>';
                    }

                    else if (type_submitted == "Soft Copy") {
                        attachments += '<a id="btn_received_viewAttachments" href="javascript:;" data-trk-no="' + track_number + '" data-doc-sender="' + sender + '"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-' + status_class + '"></i>' + type_submitted + '</div></a>';
                    }

                    else if (type_submitted == "Hard Copy") {
                        attachments += '<a id="btn_received_viewAttachments" href="javascript:;" data-trk-no="' + track_number + '" data-doc-sender="' + sender + '"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-' + status_class + '"></i>' + type_submitted + '</div></a>';

                        // attachments += '<a id="btn_received_view_hard_Copy" href="javascript:;" data-trk-no="'+track_number+'" data-doc-sender="'+sender+'"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-'+status_class+'"></i>'+type_submitted+'</div></a>';
                    }

                    if (release_type == 0) {

                        //Not trail send
                        trail_button += '<a id="btn_no_trail" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '" title="No available trail"> <i class="fa fa-times  w-4 h-4 mr-2 text-secondary"></i> Trail </a>'
                        release_button += "<a id='btn_fowardDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip ' data-tw-toggle='modal' data-tw-target='#forward_Docs' title='Forward' data-trk-no='" + track_number + "'> <i class='fa fa-share-square text-success'></i> </a>";
                        // release_button += '<a id="btn_no_release" disabled="true" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Unable to release" data-trk-no="'+track_number+'"><i class="icofont-upload-alt tex-secondary"></i> </a>'
                        for_action_button += '<a id="for_action_button" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="No available trail" href="javascript:;" data-trk-no="' + track_number + '" data-doc-typ="' + doc_type + '" data-doc-tid="' + doc_type_id + '" data-trk-id="' + track_id + '"><i class="fa fa-info text-secondary"></i></a>';
                    }

                    else if (receive_action == 1) {
                        trail_button += '<a id="view_trail" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '" title="No available trail" data-tw-toggle="modal" data-tw-target="#view_track"> <i class="icofont-foot-print  w-4 h-4 mr-2 text-success "></i> Trail </a>'
                        release_button += '<a id="btn_cant_release" disabled="true" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Already received the document, Unable to release" data-trk-no="' + track_number + '"><i class="icofont-upload-alt tex-secondary"></i> </a>'
                        for_action_button += '<a id="for_action_button" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="view trail" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_signatories_modal" data-trk-no="' + track_number + '" data-doc-typ="' + doc_type + '" data-doc-tid="' + doc_type_id + '" data-trk-id="' + track_id + '"><i class="fa fa-info text-primary"></i></a>';
                    }

                    else {
                        trail_button += '<a id="update_trail" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '" title="No available trail" title="Edit trail" data-tw-toggle="modal" data-tw-target="#add_new_track"> <i class="icofont-foot-print w-4 h-4 mr-2 text-success"></i> Trail </a>'
                        //
                        release_button += '<a id="btn_releaseDocs_release" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Release" data-trk-no="' + track_number + '"><i class="icofont-upload-alt text-success"></i> </a>'

                        for_action_button += '<a id="for_action_button" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="view trail" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_signatories_modal" data-trk-no="' + track_number + '" data-doc-typ="' + doc_type + '" data-doc-tid="' + doc_type_id + '" data-trk-id="' + track_id + '"><i class="fa fa-info text-primary"></i></a>';
                    }


                    // if(release_type == 0) {

                    //     //Not trail send
                    //     trail_button += '<a id="btn_no_trail" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="No available trail" href="javascript:;" data-trk-no="'+track_number+'"><i class="icofont-foot-print tex-secondary "></i></a>'

                    //     release_button += "<a id='btn_fowardDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip ' data-tw-toggle='modal' data-tw-target='#forward_Docs' title='Forward' data-trk-no='"+track_number+"'> <i class='fa fa-share-square text-success'></i> </a>";

                    //     // release_button += '<a id="btn_no_release" disabled="true" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Unable to release" data-trk-no="'+track_number+'"><i class="icofont-upload-alt tex-secondary"></i> </a>'

                    // }

                    // else if(receive_action == 1){
                    //     trail_button += '<a id="view_trail" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="view trail" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_track" data-trk-no="'+track_number+'"><i class="icofont-foot-print text-success"></i></a>'
                    //     release_button += '<a id="btn_cant_release" disabled="true" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Already received the document, Unable to release" data-trk-no="'+track_number+'"><i class="icofont-upload-alt tex-secondary"></i> </a>'

                    // }

                    // else {
                    //     trail_button += '<a id="update_trail" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Edit trail" href="javascript:;" data-tw-toggle="modal" data-tw-target="#add_new_track" data-trk-no="'+track_number+'"><i class="icofont-foot-print text-success"></i></a>'
                    //     release_button += '<a id="btn_releaseDocs_release" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Release" data-trk-no="'+track_number+'"><i class="icofont-upload-alt text-success"></i> </a>'

                    // }

                    if (note || original_note) {
                        message_icon = 'fa-solid fa-message text-primary';
                        tool_tip_title = 'Has Message';

                    }

                    else {
                        message_icon = 'fa-regular fa-message text-secondary';
                        tool_tip_title = 'No Message';
                        note = 'no message attached!';
                        original_note = 'no message attached!';
                    }

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td style="display: none" class="createdDoc_id">' +
                        createdDoc_id +
                        '</td>' +

                        //Document Tracking Number Here
                        '<td style="display: none" class="track_number">' +
                        track_number +
                        '</td>' +

                        //Document Tracking Number Here
                        '<td><a href="' + base_url + '/track/doctrack/' + track_number + '" target="_blank" class="underline decoration-dotted whitespace-nowrap">#' +
                        track_number + '</a>' +
                        '</td>' +


                        //Document Title Here
                        '<td class="name ">' +

                        '<div id="open_received_title" data-doc-desc="' + desc + '" data-doc-title="' + name + '" data-trk-name="' + name + '" class="whitespace-nowrap type">' +
                        '<a href="javascript:;" class="text">' + name + '</a>' +
                        '</div>' +
                        '<span class="hidden">' + name + '</span>' +

                        '<div class="text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 text level">' + doc__from + '</div>' +

                        '<span class="hidden">' + doc__from + '</span>' +

                        '</td>' +


                        //Document Message Here
                        '<td class="desc flex items-center justify-center">' +
                        '<a id="btn_open_message" href="javascript:;" data-doc-from="' + doc__from + '" data-trk-no="' + track_number + '" data-doc-message="' + note + '" data-orig-note="' + original_note + '" class="tooltip" title="' + tool_tip_title + '"> <div class="flex items-center whitespace-nowrap "><i class="w-5 h-5 pt-3 pb-3 ' + message_icon + '"></i></div></a>' +
                        '<span class="hidden">' + note + '</span>' +
                        '</td>' +


                        //Document Type and Level Here
                        '<td >' +
                        '<div class="whitespace-nowrap type">' + type + '</div>' +
                        '<span class="hidden">' + type + '</span>' +
                        '<div class="text-slate-500 text-xs whitespace-nowrap text-' + level_class + ' mt-0.5 level">' + level + '</div>' +
                        '<span class="hidden">' + level + '</span>' +
                        '</td>' +

                        //Document Status Here
                        '<td class="status">' +

                        '<div class="flex items-center whitespace-nowrap text-' + status_class + '"><div class="w-2 h-2 bg-' + status_class + ' rounded-full mr-3"></div>Received</div>' +
                        '<span class="hidden">' + status + '</span>' +

                        '</td>' +

                        //Document Attachments Here
                        '<td class="type_submitted">' +

                        attachments +
                        '<span class="hidden">' + type_submitted + '</span>' +

                        '</td>' +

                        //Document Trail Here
                        '<td class="release">' +

                        '<div class="flex justify-center">' +
                        for_action_button +
                        '</div>' +

                        '</td>' +

                        //Document Actions Here
                        '<td>' +
                        '<section>' +
                        '<div style="float: right;">' + seen_done + '</div>' +
                        '<div class="flex justify-center items-center">' +
                        release_button +
                        '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">' +
                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>' +
                        '<div class="dropdown-menu w-40">' +
                        '<div class="dropdown-content">' +
                        trail_button +
                        '<a id="btn_showDetails" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '" data-trk-id="' + track_id + '"> <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details </a>' +
                        '<a id="div_scanner_return" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa fa-retweet w-4 h-4 mr-2 text-danger"></i> Return </a>' +
                        '<a id="div_scanner_hold" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa fa-ban w-4 h-4 mr-2 text-pending"></i> Hold </a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +

                        '</section>' +
                        '</td>' +
                        '</tr>' +
                        '';

                    tbl_data_incomingDocs.row.add($(cd)).draw();
                    /***/
                }

            }
            hideLoading();
        }
    });
}

$("body").on('click', '#update_trail', function () {

    let docID = $(this).data('trk-no');
    $('#send_DocCode').val(docID)
    load_trails(docID);
});


$("body").on('click', '#view_trail', function () {

    let docID = $(this).data('trk-no');
    $('#view_DocCode').val(docID);
    load_trails(docID);
});

function load_trails(docID) {
    $.ajax({
        url: bpath + 'documents/received/load/trail',
        type: "POST",
        data: {
            _token: _token,
            docID: docID,
        },
        success: function (response) {
            var data = JSON.parse(response);
            //.log(data);
            $("#load_trail_record").html(data.release_to);
            $("#view_loaded_trail_record").html(data.release_to);
            //__notif_load_data(__basepath + "/");
        }
    });
}

$("body").on('click', '#add_track_modal_button', function () {

    let docID = $('#send_DocCode').val();
    var new_trail = [];

    $('#receive_modal_add_trail :selected').each(function (i, selected) {
        new_trail[i] = $(selected).val();
    });
    //.log(new_trail);

    $.ajax({
        url: bpath + 'documents/received/add/trail',
        type: "POST",
        data: {
            _token: _token,
            docID: docID,
            new_trail: new_trail,
        },
        success: function (response) {
            var data = JSON.parse(response);
            //.log(data);
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_new_track'));
            mdl.hide();
        }
    });
});

$("body").on('click', '#btn_no_trail', function () {
    swal({
        type: 'info',
        title: 'Trail Information',
        text: "There is no trail for this tracking number!",
        confirmButtonColor: '#1e40af',
    });
});

$("body").on('click', '#btn_cant_release', function () {
    swal({
        type: 'info',
        title: 'Action Information',
        text: "Already received the document, unable to release!",
        confirmButtonColor: '#1e40af',
    });
});

$("body").on('click', '#btn_no_release', function () {
    swal({
        type: 'info',
        title: 'Action Information',
        text: "Already received the document, unable to release!",
        confirmButtonColor: '#1e40af',
    });
});

$("body").on('click', '#btn_open_message', function () {

    let your_message = $(this).data('doc-message');
    let sender_message = $(this).data('orig-note');
    let doc_from = $(this).data('doc-from');

    received_document_message(your_message, sender_message, doc_from);

});

$("body").on('click', '#btn_foward_received_Docs', function () {
    let tracking_number = $(this).data('trk-no');
    $('#forward_received_DocCode').val(tracking_number);
});

$("body").on('click', '#btn_forward_received_docs', function () {
    let tracking_number = $('#forward_received_DocCode').val();
    let forward_as = $('#doc_received_forwardAs').val();
    let forward_note = $('#forward_received_note').val();
    let forward_to = $('#forward_received_emp_List').val();

    let forward_data = {
        _token: _token,
        tracking_number: tracking_number,
        forward_as: forward_as,
        forward_note: forward_note,
        forward_to: forward_to,
    }

    // //.log(forward_data);

    $.ajax({
        type: "POST",
        url: bpath + 'forward-docs',
        data: forward_data,
        success: function (response) {

            if (response.status == 200) {
                __notif_load_data(__basepath + "/");
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#forward_received_Docs'));
                mdl.hide();
            } else {
                __notif_load_data(__basepath + "/");
            }
        }
    });
});

function received_document_message(your_message, sender_message, document_author) {

    let you = '';

    if (!sender_message) {
        sender_message = 'No message attached!'
    }
    if (your_message != null || sender_message != null) {
        if (your_message) {
            // you = '<div class="text-justify mb-4"><span class="fa-regular fa-message"></span><span class="ml-2">You: '+your_message+' </span></div>';
            you = '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">' +
                '<div>' +
                '<div class="text-slate-500">Message</div>' +
                '<div class="mt-1 pl-3">You: ' + your_message + ' </div>' +
                '</div>' +
                '<i data-lucide="user" class="w-4 h-4 text-slate-500 ml-auto"></i> ' +
                '</div>';

        }
        swal({
            type: 'info',
            title: 'Document Message',
            // text: document_message,
            confirmButtonColor: '#1e40af',
            confirmButtonText: '<i class="fa fa-message w-3 h-3 mr-2"></i>Done',
            html:
                // '<div class="intro-y p-5">'+
                // '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
                // '<div class="text-justify mb-4"><span class="fa-solid fa-user"></span><span class="ml-2">Author: '+document_author+' </span></div>' +
                // '<div class="text-justify mb-4"><span class="fa-solid fa-message"></span><span class="ml-2">Message: '+sender_message+' </span></div>'+
                // you+
                // '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400"></div>'+
                // '</div>',
                '<div class=" p-5 mt-5">' +
                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 pb-5">' +
                '<div style="text-align: left">' +
                '<div class="text-slate-500"> <i  class="fa fa-user w-4 h-4 text-slate-500 ml-auto"></i> Author</div>' +
                '<div class="mt-1 pl-3">' + document_author + '</div>' +
                '</div>' +
                '</div>' +
                '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">' +
                '<div style="text-align: left">' +
                '<div class="text-slate-500"><i class="fa fa-message w-4 h-4 text-slate-500 ml-auto"></i>  Message</div>' +
                '<div class="mt-1 pl-3">' + sender_message + '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
        });
    } else {
        swal({
            type: 'warning',
            title: 'Document Message',
            confirmButtonColor: '#1e40af',
            confirmButtonText: '<i class="fa fa-message w-3 h-3 mr-2"></i>Done',
            html:
                '<div class="intro-y p-5">' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '<div class="text-justify  mb-4">Document has no message attached!</div>' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400"></div>' +
                '</div>',
        });
    }
}

$("body").on('click', '#open_received_title', function () {

    let doc_title = $(this).data('doc-title');
    let doc_details = $(this).data('doc-desc');
    swal({
        type: 'info',
        title: 'Document Details',
        confirmButtonColor: '#1e40af',
        confirmButtonText: '<i class="fa fa-file w-3 h-3 mr-2"></i>Done',
        // text: document_message,
        html:
            // '<div class="intro-y p-5">'+
            // '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>'+
            // '<div class="text-justify mb-4"><span class="fa-solid fa-clipboard"></span>'+
            // '<span class="ml-2">Title</span>'+
            // '<span class="ml-2">'+doc_title+' </span>'+
            // '</div>' +
            // // '<div class="text-justify mb-4"><span class="fa-solid fa-message"></span><span class="ml-2">Message: '+sender_message+' </span></div>'+
            // // you+
            // '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400"></div>'+
            // '</div>',
            '<div class=" p-5 mt-5">' +
            '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">' +
            '<div style="text-align: left">' +
            '<div class="text-slate-500"> <i  class="fa fa-file w-4 h-4 text-slate-500 ml-auto"></i> Title</div>' +
            '<div class="mt-1 pl-3">' + doc_title + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="flex items-center border-b border-slate-200 dark:border-darkmode-400 py-5">' +
            '<div style="text-align: left">' +
            '<div class="text-slate-500"><i class="fa fa-file w-4 h-4 text-slate-500 ml-auto"></i>  Description</div>' +
            '<div class="mt-1 pl-3">' + doc_details + '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
    });
});

$("body").on('click', '#btn_received_viewAttachments', function () {

    received_document_tracking_number = $(this).data('trk-no');

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#received_modal_add_attachments'));
    mdl.toggle();

    // //.log(received_document_tracking_number);

    load_received_attached_documents();

});

function load_received_attached_documents() {

    let received_add_attachment_button = '';
    tbl_data_original_attachments.clear().draw();
    tbl_data_added_attachments.clear().draw()

    received_add_attachment_button = '<button id="btn_received_add_document_attachments" data-tracking-number="' + received_document_tracking_number + '" class="w-auto ml-auto btn btn-primary mb-5 col-span-12 sm:col-span-6">' +
        '<span class="truncate">Add Document Attachment(s)</span> <i class="fa-solid fa-circle-plus w-4 h-4 ml-2"></i>';


    $('#received_add_attachments_div').html(received_add_attachment_button);

    $.ajax({
        url: bpath + 'documents/attachments/load',
        type: "POST",
        data: {
            _token: _token,
            docID: received_document_tracking_number,
        },
        success: function (response) {

            var data = JSON.parse(response);

            if (data.length > 0) {

                // populate_received_docs_attachments(data); //OK na ni siya
                populate_received_docs_attachments_data_table(data);
                $('#div_dt_received_original_attachments').show();
                $('#div_dt_received_added_attachments').show();
                $('#received_if_no_files_attached').hide();

            } else {
                $('#div_dt_received_original_attachments').hide();
                $('#div_dt_received_added_attachments').hide();
                $('#received_if_no_files_attached').show();
                // $('#div_dt__my_docs_original_attachments').hide();

                let html_data = '<div class="alert alert-danger alert-dismissible show flex items-center mb-2" role="alert">' +
                    '<i class="fa-solid fa-circle-exclamation mr-5"></i> No document attachment(s) found!</div>';

                $('#received_if_no_files_attached').html(html_data);
            }
        }
    });
}

function populate_received_docs_attachments_data_table(data) {

    var Original_attachments = '';

    for (let o = 0; o < data.length; o++) {


        let link = data[o]['link'];
        var path = data[o]['path'];
        var count = data[o]['view_count'];
        var doc_attachment_id = data[o]['id'];
        doc_file_id = data[o]['doc_file_id'];
        var File_name = data[o]['name'];
        var added_attachments = data[o]['added_attachments'];
        var full_name = data[o]['full_name'];
        var date_created = data[o]['date_created'];
        var Note = data[o]['description'];
        var logged_user = data[o]['logged_user'];
        var created_by = data[o]['created_by']
        var link_btn = '';
        var download_btn = '';

        if (link) {
            link_btn = '<a id="btn_download_public_files" href="' + link + '" target="_blank" type="button" class="btn btn-outline-secondary tooltip" title="File has link"><i class="fa-solid fa-link text-success"></i></a>';
        } else {
            link_btn = '';
        }

        if (path) {
            download_btn = '<a id="btn_download_public_files" href="/documents/download-documents/' + path + '" target="_blank" data-att-path="' + path + '" type="button" class="btn btn-outline-secondary tooltip" title="Download File"><i class="fa-solid fa-download text-success"></i></a>';
        } else {
            download_btn = ''
        }

        if (Note == null) {
            Note = "No data"
        }

        if (added_attachments == 0) {

            var cd = "";
            /***/

            cd = '' +
                '<tr >' +

                '<td>' +
                full_name +
                '</td>' +

                '<td>' +
                '<a id="attachment_count_view" data-doc-att-id="' + doc_attachment_id + '" class="flex items-center mb-2">' +
                '<div class="underline decoration-dotted whitespace-nowrap text-justify">' + File_name + '</div>' +
                '</a>' +
                '<span class="hidden">' + File_name + '</span>' +
                '</td>' +

                '<td>' +
                '<div class="flex justify-center items-center">' +
                link_btn +
                download_btn +
                '</div>' +
                '</td>' +

                '</tr>' +
                '';

            tbl_data_original_attachments.row.add($(cd)).draw();

            $('#div_dt__added_attachments').hide();
        }

        else if (added_attachments == 1) {

            $('#div_dt__added_attachments').show();

            var cd = "";
            /***/

            cd = '' +
                '<tr >' +

                '<td>' +
                full_name +
                '</td>' +

                '<td>' +
                '<div class="underline decoration-dotted text-justify"><a href="/documents/download-documents/' + path + '" target="_blank">' + File_name + '</a></div>' +
                '</td>' +

                '<td>' +
                '<div class="text-justify">' + Note + '</div>' +
                '</td>' +

                //Document Actions Here
                '<td>' +
                '<div class="flex justify-center items-center">' +
                '<button id="btn_delete_attached_docs" data-doc-identifier="received_docs" data-file-id="' + doc_attachment_id + '" data-logged-user="' + logged_user + '" data-created-by="' + created_by + '" data-att-path="' + path + '" type="button" class="btn btn-outline-secondary"><i class="fa fa-trash text-danger"></i></button>' +
                '<a id="btn_download_public_files" href="/documents/download-documents/' + path + '" target="_blank" data-att-path="' + path + '" type="button" class="btn btn-outline-secondary tooltip ml-1" title="Download File"><i class="fa-solid fa-download text-success"></i></a>' +
                '</div>' +
                '</td>' +

                '</tr>' +
                '';

            tbl_data_added_attachments.row.add($(cd)).draw();
        }

        let orig_attachment_data =
            '<div class="col-span-12 md:col-span-6 lg:col-span-4 mt-2">' +
            Original_attachments +
            '</div>';

        $('#original_attachment_div').html(orig_attachment_data);
    }
}

$("body").on('click', '#btn_received_add_document_attachments', function () {

    let tracking_number = $(this).data('tracking-number');
    $('#document_identifier').val("received_docs");

    $('#attach_document_form_value').val(tracking_number);
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#attach_document_modal'));
    mdl.toggle();

});

// $("body").on('click', '#btn_received_view_hard_Copy', function (){
//
//     const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#received_modal_hard_copy'));
//     mdl.toggle();
//
//     let html_data =
//         '<div class="col-span-12 2xl:col-span-3">'+
//             '<div class="pb-10">'+
//                 '<div class="grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">'+
//                     '<div class="col-span-12 md:col-span-6 xl:col-span-12 2xl:mt-8">'+
//                         '<div class="intro-x flex items-center h-10">'+
//                             '<h2 class="text-lg font-medium truncate mr-auto">'+
//                                 'Important Notes'+
//                             '</h2>'+
//                             '<button data-carousel="important-notes" data-target="prev" class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2">'+
//                                 '<i class="fa-solid fa-caret-left w-4 h-4"></i></button>'+
//                             '<button data-carousel="important-notes" data-target="next" class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2">'+
//                                 '<i class="fa-solid fa-caret-right w-4 h-4"></i></button>'+
//                         '</div>'+
//                         '<div class="mt-5 intro-x">'+
//                             '<div class="box zoom-in">'+
//                                 '<div class="tiny-slider" id="important-notes">'+
//                                     '<div class="p-5">'+
//                                         '<div class="text-base font-medium truncate">Lorem Ipsum is simply dummy text</div>'+
//                                         '<div class="text-slate-400 mt-1">20 Hours ago</div>'+
//                                         '<div class="text-slate-500 text-justify mt-1">Sample</div>'+
//                                         '<div class="font-medium flex mt-5">'+
//                                             '<button type="button" class="btn btn-secondary py-1 px-2">View Notes</button>'+
//                                             '<button type="button" class="btn btn-outline-secondary py-1 px-2 ml-auto ml-auto">Dismiss</button>'+
//                                         '</div>'+
//                                     '</div>'+
//                                 '</div>'+
//                             '</div>'+
//                         '</div>'+
//                     '</div>'+
//                 '</div>'+
//             '</div>'+
//         '</div>';
//
//     $('#hard_copy_div').html(html_data);
// });


