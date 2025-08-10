var _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_publicFiles;

$(document).ready(function () {

    bpath = __basepath + "/";
    load_publicFilesDataTable();
    load_publicFiles();

});

function load_publicFilesDataTable() {

    try {
        tbl_data_publicFiles = $('#dt__publicFiles').DataTable({
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
                    { className: "dt-head-center", targets: [2, 4, 5, 6] },
                ],
        });
    } catch (e) { }
}

function load_publicFiles() {
    $.ajax({
        url: __basepath + '/public-files',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {

            tbl_data_publicFiles.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    /***/
                    var send_Button = '';
                    var createdDoc_id = data[i]['id'];
                    var track_number = data[i]['track_number'];
                    var name = data[i]['name'];
                    var desc = data[i]['desc'];
                    var type = data[i]['type'];
                    var status = data[i]['status'];
                    var status_class = data[i]['class'];
                    var level = data[i]['level'];
                    var type_submitted = data[i]['type_submitted'];
                    var base_url = window.location.origin;
                    var total_recipients = data[i]['recipients'];

                    var level_class = data[i]['level_class'];

                    var tool_tip_title = '';
                    var message_icon = '';

                    if (type_submitted === "Both") {
                        type_submitted = "Hard Copy, Soft Copy";
                    }

                    if (desc) {
                        message_icon = 'fa-solid fa-comment text-primary';
                        tool_tip_title = 'Has Message';

                    } else {
                        message_icon = 'fa-regular fa-comment text-secondary';
                        tool_tip_title = 'No Message';
                    }

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr class="inbox__item intro-x">' +

                        '<td style="display: none" class="createdDoc_id">' +
                        createdDoc_id +
                        '</td>' +

                        '<td style="display: none" class="track_number">' +
                        track_number +
                        '</td>' +

                        '<td><a href="' + base_url + '/track/doctrack/' + track_number + '" target="_blank" class="underline decoration-dotted whitespace-nowrap">#' +
                        track_number + '</a>' +
                        '</td>' +

                        '<td id="public_files_document_name" data-trk-number="' + track_number + '" data-trk-name="' + name + '" data-total-user="' + total_recipients + '" data-doc-status="' + status + '">' +
                        '<a data-trk-name="' + name + '" href="javascript:;">' +
                        name.substr(0, 20) +
                        '</a>' +

                        '</td>' +

                        '<td class="desc flex items-center justify-center">' +

                        '<a id="btn_public_message" href="javascript:;" data-trk-no="' + track_number + '" data-doc-message="' + desc + '"  class="tooltip" title="' + tool_tip_title + '" class="flex justify-center items-center whitespace-nowrap text-' + status_class + '"><i class="w-5 h-5 pt-3 pb-3 ' + message_icon + '"></i></a>' +

                        '</td>' +

                        '<td >' +
                        '<div class="whitespace-nowrap type">' + type + '</div>' +
                        '<div class="text-slate-500 text-xs whitespace-nowrap text-' + level_class + ' mt-0.5 level">' + level + '</div>' +
                        '</td>' +

                        '<td class="status">' +

                        '<div class="flex justify-center items-center whitespace-nowrap text-' + status_class + '"><div class="w-2 h-2 bg-' + status_class + ' rounded-full mr-3"></div>' + status + '</div>' +

                        '</td>' +

                        '<td class="type_submitted">' +

                        '<a id="btn_viewAttachments" href="javascript:;" data-trk-no="' + track_number + '"> <div class="flex justify-center items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-' + status_class + '"></i>' + type_submitted + '</div></a>' +
                        '</td>' +

                        '<td>' +
                        '<div class="flex justify-center items-center">' +
                        send_Button +
                        '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">' +
                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>' +
                        '<div class="dropdown-menu w-40">' +
                        '<div class="dropdown-content">' +
                        '<a id="btn_showDetails" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details </a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +

                        '</tr>' +
                        '';

                    tbl_data_publicFiles.row.add($(cd)).draw();
                    /***/
                }

                // $(".tooltip").tooltips();
            }
        }
    });
}

$("body").on('click', '#public_files_document_name', function () {

    let name = $(this).data('trk-name');
    let doc_status = $(this).data('doc-status');
    let trackNumber = $(this).data('trk-number');
    let total_recipients = $(this).data('total-user');

    loadName(name, trackNumber, doc_status, total_recipients);

});

//Open Message
$("body").on('click', '#btn_public_message', function () {

    let document_message = $(this).data('doc-message');

    if (document_message != null) {
        swal({
            type: 'info',
            title: 'Document Message',
            // text: document_message,
            html:
                '<div class="intro-y p-5">' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '<div class="text-justify mb-4">' + document_message + '</div>' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '</div>',
        });
    } else {
        swal({
            type: 'warning',
            title: 'Document Message',
            html:
                '<div class="intro-y p-5">' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '<div class="text-justify  mb-4">Document has no message attached!</div>' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '</div>',
        });
    }
});
