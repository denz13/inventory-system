var  _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_incomingDocs;
$(document).ready(function (){

    bpath = __basepath + "/";

    load_incomingDocsDataTable();
    load_incomingDocs();

});



function load_incomingDocsDataTable(){

    try{
        /***/
        tbl_data_incomingDocs = $('#dt__incomingDocs').DataTable({
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
                    { className: "dt-head-center", targets: [ 3, 7 ] },
                ],
        });
        /***/
    }catch(err){  }
}

function load_incomingDocs() {

    $.ajax({
        url: bpath + 'documents/incoming/incoming-docs/load',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function(data) {

            tbl_data_incomingDocs.clear().draw();

            /***/
            var data = JSON.parse(data);


            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/

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

                    var note = data[i]['note'];
                    var doc__from = data[i]['__from'];


                    var tool_tip_title = '';
                    var message_icon = '';

                    var rec_action_id = '';
                    var level_class = data[i]['level_class'];
                    var action = data[i]['action'];
                    var seen = data[i]['seen'];

                    var action_done = '';
                    if(seen == 0) {
                        action_done = '<div  class="w-2 h-2 flex items-center justify-center text-xs text-white rounded-full bg-danger font-medium"></div>';
                    }



                    if (type_submitted === "Both")
                    {
                        rec_action_id = 'btn_incomingDocs_receive';
                        type_submitted = "Hard Copy, Soft Copy";

                    }else if(type_submitted === "Soft Copy")
                    {
                        rec_action_id = 'btn_incomingDocs_receive';

                    }else
                    {

                        rec_action_id = 'btn_incomingDocs_receive';

                    }

                    if (note)
                    {
                        message_icon = 'fa-solid fa-message text-primary';
                        tool_tip_title = 'Has Message';

                    }else
                    {
                        message_icon = 'fa-regular fa-message text-secondary';
                        tool_tip_title = 'No Message';
                        note = 'no message attached!';
                    }

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td style="display: none" class="createdDoc_id">' +
                        createdDoc_id+
                        '</td>' +

                        '<td style="display: none" class="track_number">' +
                        track_number+
                        '</td>' +

                        '<td><a href="'+base_url+'/track/doctrack/'+track_number+'" target="_blank" class="underline decoration-dotted whitespace-nowrap">#'+
                        track_number+'</a>'+
                        '</td>' +

                        '<td class="name">' +
                            '<span class="text">'+name+'</span>'+
                        '</td>' +

                        '<td class="desc flex items-center justify-center">' +
                            '<a id="btn_incoming_message" href="javascript:;" data-doc-from="'+doc__from+'" data-trk-no="'+track_number+'" data-doc-message="'+note+'" class="tooltip" title="'+tool_tip_title+'"> <div class="flex items-center whitespace-nowrap "><i class="w-5 h-5 pt-3 pb-3 '+message_icon+'"></i></div></a>' +
                        '</td>' +

                        '<td >'+
                                '<div class="whitespace-nowrap type">'+type+'</div>'+
                                '<div class="text-slate-500 text-xs whitespace-nowrap text-'+level_class+' mt-0.5 level">'+level+'</div>'+
                        '</td>' +

                        '<td class="status">'+

                            '<div class="flex items-center whitespace-nowrap text-'+status_class+'"><div class="w-2 h-2 bg-'+status_class+' rounded-full mr-3"></div>'+status+'</div>' +

                        '</td>' +

                        '<td class="type_submitted">' +
                        // '   <a id="btn_viewAttachments" href="javascript:;" data-trk-no="'+track_number+'"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-'+status_class+'"></i>'+type_submitted+'</div></a>' +
                        '   <a href="javascript:;" data-trk-no="'+track_number+'"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-'+status_class+'"></i>'+type_submitted+'</div></a>' +
                        '</td>' +

                        '<td>' +

                            '<section>'+
                                '<div style="float: right;">'+action_done +'</div>'+
                                '<div class="flex justify-center items-center">'+
                                    '<a id="'+rec_action_id+'" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Receive" data-trk-id="'+track_id+'" data-trk-no="'+track_number+'"><i class="icofont-inbox text-success"></i> </a>'+
                                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                        '<div class="dropdown-menu w-40">'+
                                            '<div class="dropdown-content">'+
                                                '<a id="btn_showIncomingDetails" href="javascript:;" class="dropdown-item" data-trk-no="'+track_number+'"> <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details </a>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</section>'+
                        '</td>' +
                        '</tr>' +
                        '';

                        tbl_data_incomingDocs.row.add($(cd)).draw();
                    /***/
                }
            }
        }
    });
}

//Open Message
$("body").on('click', '#btn_incoming_message', function (){

    let sender_message = $(this).data('doc-message');
    let your_message = "";
    let doc_from = $(this).data('doc-from');

    document_message(your_message, sender_message, doc_from);
});

