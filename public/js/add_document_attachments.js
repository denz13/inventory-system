var _token = $('meta[name="csrf-token"]').attr('content');
// var tracking_number;
const attach_document = document.querySelector('input[id="attach_new_document"]');
const pond_attach_document = FilePond.create((attach_document),
    {
        credits: false,
    });

pond_attach_document.setOptions({
    server: {
        process: "/documents/tmp/attachments/upload",
        revert: "/documents/tmp-delete",
        headers: {
            'X-CSRF-TOKEN': _token
        },
    },
});

$(document).ready(function () {

    insert_document_attachments();

});

$("body").on('click', '#btn_add_document_attachments', function () {
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#attach_document_modal'));
    mdl.toggle();
    tracking_number = $(this).data('tracking-number');

});

//file size bytes to megabytes converter
function convertToHumanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB']
        : ['kB', 'MB', 'GB', 'TB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

function insert_document_attachments() {
    $('#attach_document_form').submit(function (event) {
        event.preventDefault();

        let attachment_files = pond_attach_document.getFiles();
        let attachment_fileLength = attachment_files.length;
        let _default_folder = '';
        let attachment_file_name = '';
        let attachment_folder = '';
        let attachment_folder_name = '';
        let attachment_document_file_name = [];
        let attachment_document_folder = [];
        let attachment_note = $('#added_attachment_note').val();

        let tracking_number = $('#attach_document_form_value').val();

        let document_identifier = $('#document_identifier').val();

        let attachment_data = {};
        let size = 0;

        //Loop Uploaded Document Attachments
        $.each(attachment_files, function (index, value) {
            _default_folder = value.serverId
            attachment_file_name = value.filename

            attachment_folder = _default_folder.split("<");
            attachment_folder_name = attachment_folder[0];

            attachment_document_file_name.push(attachment_file_name);
            attachment_document_folder.push(attachment_folder_name);
        });

        // //.log(attachment_document_folder);
        // //.log(attachment_document_file_name);
        attachment_data = {
            _token: _token,
            attachment_document_file_name,
            attachment_document_folder,
            tracking_number,
            attachment_note,
        }

        if (attachment_fileLength > 0) {

            let getFileTotalSize = attachment_files[0].fileSize;

            $.each(attachment_files, function (key, file) {
                size += getFileTotalSize;
            });

            let finalSizeValue = convertToHumanFileSize(size);

            pond_attach_document.processFiles().then(() => {

                //if Size is less than or equal to 25mb

                if (size <= 26214400) {
                    upload_file_Attachments(attachment_data, document_identifier);

                } else {
                    __notif_show(-3, "File too Large", "File size uploaded: " + finalSizeValue);
                }
            });

        } else {
            __notif_show(-2, "File Missing!!", "Missing Attachments!");
        }
    });
}

function upload_file_Attachments(attachment_data, document_identifier) {

    $.ajax({
        type: "POST",
        url: bpath + 'documents/attachments/insert/attachments',
        data: attachment_data,
        success: function (response) {
            __notif_show(1, "Success", "Added Successfully!");
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#attach_document_modal'));
            mdl.hide();
            removeUploadedFiles();

            $('#added_attachment_note').val("");

            if (document_identifier == "my_documents") {
                load_attached_my_documents();
            } else if (document_identifier == "received_docs") {
                load_received_attached_documents();
            }
            else if (document_identifier == "outgoing_docs") {
                load_outgoing_attachments();
            }
            else if (document_identifier == "hold_docs") {
                load_hold_attachments();
            }
            else if (document_identifier == "returned_docs") {
                load_returned_attachments();
            }

        }
    });
}

//remove uploaded files after success
function removeUploadedFiles() {
    if (pond_attach_document) {
        var files = pond_attach_document.getFiles();
        if (files.length > 0) {
            pond_attach_document.processFiles().then(() => {
                pond_attach_document.removeFiles();
                // //.log('Removed');
            });
        }
    }
}

$("body").on('click', '#cancel_attachments_btn', function () {
    removeUploadedFiles();
});

$("body").on('click', '#btn_delete_attached_docs', function () {

    let attachment_path = $(this).data('att-path');
    let file_id = $(this).data('file-id');
    let doc_identifier = $(this).data('doc-identifier');

    // //.log(doc_identifier);

    let logged_user = $(this).data('logged-user');
    let created_by = $(this).data('created-by');

    let is_equal = logged_user == created_by;

    if (is_equal == false) {
        __notif_show(-1, "Warning", "You cannot delete this file, please contact the author of this file!");

    } else {
        //Para delete sa data-table
        if (doc_identifier == "returned_docs") {
            tbl_data_returned_added_attachments.row($(this).parents('tr')).remove().draw();

        } else if (doc_identifier == "hold_docs") {
            tbl_data_hold_added_attachments.row($(this).parents('tr')).remove().draw();
        } else if (doc_identifier == "outgoing_docs") {
            tbl_data_outgoing_added_attachments.row($(this).parents('tr')).remove().draw();
        } else if (doc_identifier == "received_docs") {
            tbl_data_added_attachments.row($(this).parents('tr')).remove().draw();

        } else if (doc_identifier == "my_documents") {
            tbl_data__my_docs_added_attachments.row($(this).parents('tr')).remove().draw();
        }

        __notif_show(1, "Success", "File deleted successfully!");

        $.ajax({
            url: bpath + "documents/attachments/delete/attachments",
            type: "POST",
            data: {
                _token: _token,
                attachment_path,
            },
            cache: false,
            success: function (data) {
                if (data.status == 200) {
                    if (doc_identifier == "returned_docs") {
                        load_returned_attachments();


                    } else if (doc_identifier == "hold_docs") {
                        load_hold_attachments();


                    } else if (doc_identifier == "outgoing_docs") {
                        load_outgoing_attachments();


                    } else if (doc_identifier == "received_docs") {
                        load_received_attached_documents();


                    } else if (doc_identifier == "my_documents") {
                        load_attached_my_documents()

                    }
                }
            }
        });
    }
});
