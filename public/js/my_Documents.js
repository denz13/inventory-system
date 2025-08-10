$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
var _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_createdDocs;
var tbl_data_emplList;
var tbl_data_my_docs_original_attachments;
var tbl_data__my_docs_added_attachments;
var tbl_data_groupList;
var tbl_data_rcList;
var values = [];
var is_sortable;
var pondFiles;
var array_rcID = [];
var array_groupID = [];
var track_number = "";
var rc_modal_docs_type;
var rc_modal_docs_type1;
var checked_Box_Value;
var markEndTrail_Value;
var sendDocs_modal_user_list;
var sendDocs_modal_user_list2;
var sendDocs_modal_group_list;
var sendDocs_modal_rc_list;
var checkedBox_ShowAuthorName;
var error_counter;
var is_markEndTrail = document.getElementById("btn__modalEndTrail");
var is_sendToAll = document.getElementById("btn_sendToAll")
var is_showAuthor = document.getElementById("checkBox_shoAuthor");
var checkbox_sendToAll = document.querySelector("input[name=btn_sendToAll]");
var ul = document.getElementById("track_table");
var timeout = null;
var my_document_tracking_number;

$(document).ready(function () {

    bpath = __basepath + "/";

    ComposeNewDocuments();
    bindSelect2();

    //Insert New Document Function
    insert_newDocuments();

    //Initialize all My Documents DataTables
    load_createdDocsDataTable();

    //Populate Created Documents DataTables
    load_createdDocs();

    //Update function for created documents
    update_createDocs();

    //Delete function for created documents
    softDelete_CreatedDocs();

    //Populate Employee List DataTables
    load_empList();

    //Fast Send Documents
    FastSend_Documents();

    //Trail Send Documents
    TrailSend_Documents();

    //Delete Temporary uploaded Files if canceled
    deleteIfCanceled();

    //Select2 Input Validator
    select2_input_validator();

    //Select2 On Change Handler
    //select2_on_change_handler();



});

$('.groupList li[data-name]').click(function () {
    $('#btn_userORgroup').show();
    $('#input_holder').text($(this).data('name'));
    switchButtonLabel();
});

function bindSelect2(){

    //Set Document Type value after each clicked
    $('#document_type_submitted_old').change(function () {

        let doc_type_val = $(this).val();

        if (doc_type_val !== '2')
        {
            $('.div_document_Attachment_old').show();
        }
        else
        {
            $('.div_document_Attachment_old').hide();
        }

    });

    $('#document_type_submitted_old').select2({});
    $('#document_type_old').select2({
        placeholder: 'Select Type of Document'
    });
    $('#document_level_old').select2({
        placeholder: 'Select Level of Document'
    });
    $('#document_pub_pri_file_old').select2({
        placeholder: 'Select Document Privacy Type'
    });


}

function ComposeNewDocuments() {

    const documentAttachmentOld    = document.querySelector('input[id="document_uploaded_old"]');
    const uploadedAttachmentsOld   = FilePond.create(documentAttachmentOld, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',

        // Enable client-side processing
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {
                // Simulate successful upload after a delay
                setTimeout(() => {
                    load(file); // Simulate successful upload
                }, 1000);
            },
            revert: (uniqueFileId, load, error) => {
                // Handle file removal
                // Implement your file deletion logic here
            },
        },
    });

    $('body').on('click', '.add_documents_btn', function () {

        const thisButton    = $(this);
        const formData      = new FormData();
        const files         = uploadedAttachmentsOld.getFiles(); // Get all uploaded files
        const documentCopyType      = $('#document_type_submitted_old').val();
        const documentTitle         = $('#document_title_old').val();
        const documentDescription   = $('#message_old').val();
        const documentType          = $('#document_type_old').val();
        const documentLevel         = $('#document_level_old').val();
        const documentPrivacy       = $('#document_pub_pri_file_old').val();

        // Validation checks
        if (!documentTitle.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Title is required');
            return; // Prevent AJAX call if documentTitle is empty
        }
        if (!documentDescription.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Description is required');
            return; // Prevent AJAX call if documentDescription is empty
        }
        if (!documentType.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Type is required');
            return; // Prevent AJAX call if documentTitle is empty
        }
        if (!documentLevel.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Level is required');
            return; // Prevent AJAX call if documentDescription is empty
        }
        if (!documentPrivacy.trim()) {
            __notif_show(-1, 'Oooopss...', 'Document Privacy is required');
            return; // Prevent AJAX call if documentDescription is empty
        }

        // Append data based on documentCopyType
        if (documentCopyType !== '2') {
            if (files.length > 0) {
                // Append all files to FormData
                files.forEach(fileItem => {
                    formData.append('fileAttachments[]', fileItem.file); // Use fileItem.file
                });
                // Append other form data
                formData.append('documentCopyType', documentCopyType);
                formData.append('documentTitle', documentTitle);
                formData.append('documentDescription', documentDescription);
                formData.append('documentType', documentType);
                formData.append('documentLevel', documentLevel);
                formData.append('documentPrivacy', documentPrivacy);
            } else {

                __notif_show(-1, 'Oooopss...', 'Soft copy documents need attachments.');
                return; // Prevent AJAX call if no files are selected
            }
        }
        else
        {
            // Append only other form data if no files
            formData.append('documentCopyType', documentCopyType);
            formData.append('documentTitle', documentTitle);
            formData.append('documentDescription', documentDescription);
            formData.append('documentType', documentType);
            formData.append('documentLevel', documentLevel);
            formData.append('documentPrivacy', documentPrivacy);
        }

        // Send the FormData using AJAX
        $.ajax({
            url: '/documents/inbox/compose-my-documents', // Replace with your actual upload URL
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                thisButton.prop('disabled', true);
                thisButton.html('Saving...');
            },
            success: function (response) {
                console.log('Files uploaded successfully:', response.message);

                if(response.status === 200)
                {
                    // Remove uploaded files from FilePond
                    removeUploadedAttachments(uploadedAttachmentsOld);
                    $('#document_title_old').val(null);
                    $('#message_old').val(null);
                    $('#document_type_old').val(null).trigger('change');
                    $('#document_level_old').val(null).trigger('change');
                    $('#document_pub_pri_file_old').val(null).trigger('change');

                    __modal_hide('create_document_old');

                    load_createdDocs();
                }


                thisButton.prop('disabled', false);
                thisButton.html('Save');
            },
            error: function (xhr, status, error) {
                console.error('File upload failed:', error);
                // Handle error response
                thisButton.prop('disabled', false);
                thisButton.html('Save');
            }
        });
    });
}

function removeUploadedAttachments(uploadedFiles) {
    if (uploadedFiles) {
        let files = uploadedFiles.getFiles();
        if (files.length > 0) {
            uploadedFiles.processFiles().then(() => {
                uploadedFiles.removeFiles();
            });
        }
    }
}


function switchButtonLabel() {
    var label = $('#input_holder').text();

    if (label === 'Group/s') {
        $('#btn_Group').show();
        $('#btn_User').hide();
    } else if (label === 'Employee/s') {
        $('#btn_User').show();
        $('#btn_Group').hide();
    }
}

//Set Document Type value after each clicked
$('#document_type_submitted').change(function () {

    let doc_type_val = $(this).val();

    if (doc_type_val == 1) {
        $('#div_document_Attachment').show();
    } else if (doc_type_val == 2) {
        $('#div_document_Attachment').hide();
    } else {
        $('#div_document_Attachment').show();
    }

});

//Initialize all My Documents DataTables
function load_createdDocsDataTable() {
    try {
        /***/
        tbl_data_createdDocs = $('#dt__createdDocs').DataTable({
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
                    { className: "dt-head-center", targets: [3, 7] },
                ],
        });

        tbl_data_emplList = $('#dt__employeeList').DataTable({
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
            "aLengthMenu": [[5, 25, 50, 100, 150, 200, 250, 300, -1], [5, 25, 50, 100, 150, 200, 250, 300, "All"]],
            "iDisplayLength": 5,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [2] },
                ],
        });

        tbl_data_groupList = $('#dt__groupList').DataTable({
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
            "aLengthMenu": [[5, 25, 50, 100, 150, 200, 250, 300, -1], [5, 25, 50, 100, 150, 200, 250, 300, "All"]],
            "iDisplayLength": 5,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [2] },
                ],
        });

        tbl_data_rcList = $('#dt__rcList').DataTable({
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
            "aLengthMenu": [[5, 25, 50, 100, 150, 200, 250, 300, -1], [5, 25, 50, 100, 150, 200, 250, 300, "All"]],
            "iDisplayLength": 5,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [4] },
                ],
        });

        tbl_data_my_docs_original_attachments = $('#dt__my_docs_original_attachments').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-2 babaw sa show'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-1 obos sa show'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",

            columnDefs:
                [
                    { className: "dt-head-center", targets: [2] },
                ],
        });

        tbl_data__my_docs_added_attachments = $('#dt__my_docs_added_attachments').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-2 babaw sa show'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-1 obos sa show'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",

            columnDefs:
                [
                    { className: "dt-head-center", targets: [3] },
                ],
        });

        sendDocs_modal_group_list = $('.select2-multiple').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

        sendDocs_modal_rc_list = $('.select2-multiple').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

        sendDocs_modal_user_list = $('.select2-multiple').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

        sendDocs_modal_user_list2 = $('.select2-multiple-new').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
            width: "100%",
        });

        /***/
    } catch (err) { }
}

//Populate Created Documents DataTables
function load_createdDocs(page = 1) {
    const searchQuery = $('#searchBox').val();
    const perPage = $('#perPageSelect').val();

    $.ajax({
        url: bpath + 'documents/created-docs/load',
        type: "POST",
        data: {
            _token: _token,
            filter_data: searchQuery,
            page: page,
            perPage: perPage
        },
        success: function(response) {
            const tbody = $('#dt__createdDocsNotDataTable tbody');
            tbody.empty();

            if (response.data.length > 0) {
                response.data.forEach(function(data) {
                    var send_Button = '';
                    var edit_Button = '';
                    var mark_Button = '';
                    var delete_Button = '';
                    var print_qr = '';
                    var returned_details = '';
                    var createdDoc_id = data['id'];
                    var track_number = data['track_number'];
                    var name = data['name'];
                    var desc = data['desc'];
                    var type = data['type'];
                    var type_id = data['type_id'];
                    var status = data['status'];
                    var status_class = data['class'];
                    var level = data['level'];
                    var level_id = data['level_id'];
                    var type_submitted = data['type_submitted'];
                    var base_url = window.location.origin;
                    var total_recipients = data['recipients'];
                    var display_type = data['display_type'];
                    var returned__by = data['doc_track_creator'];
                    var doc_track_created_date = data['doc_track_created_date'];
                    var level_class = data['level_class'];
                    var doc_track_note = data['doc_track_note'];
                    var _is_admin = data['_is_admin'];

                    var tool_tip_title = '';
                    var message_icon = '';

                    if (type_submitted === "Both") {
                        type_submitted = "Hard Copy, Soft Copy";
                    }

                    // Button logic based on status
                    if (status === "Completed") {
                        send_Button += "<a id='btn_fowardDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip ' data-tw-toggle='modal' data-tw-target='#forward_Docs' title='Forward' data-trk-no='" + track_number + "'> <i class='fa fa-share-square text-success'></i> </a>";
                        edit_Button = '';
                        delete_Button = '';
                        print_qr += '<a id="btn_print_qr" href="' + base_url + '/print-qr/' + track_number + '/pos_top_right" target="_blank" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa-solid fa-print w-4 h-4 mr-2 text-primary"></i> Print QR </a>';
                        mark_Button += "<a id='btn_markAsComplete' href='javascript:;' data-admin='" + _is_admin + "' data-doc-desc='" + desc + "' data-doc-name='" + name + "' class='dropdown-item' data-trk-no='" + track_number + "'> <i class='fa fa-check-square w-4 h-4 mr-2 text-success'></i> Change Status </a>";
                    }
                    else if (status === "Outgoing") {
                        send_Button += "<a id='btn_fowardDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip ' data-tw-toggle='modal' data-tw-target='#forward_Docs' title='Forward' data-trk-no='" + track_number + "'> <i class='fa fa-share-square text-success'></i> </a>";
                        print_qr += '<a id="btn_print_qr" href="' + base_url + '/print-qr/' + track_number + '/pos_top_right" target="_blank" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa-solid fa-print w-4 h-4 mr-2 text-primary"></i> Print QR </a>';
                        mark_Button += "<a id='btn_markAsComplete' href='javascript:;' data-admin='" + _is_admin + "' data-doc-desc='" + desc + "' data-doc-name='" + name + "' class='dropdown-item' data-trk-no='" + track_number + "'> <i class='fa fa-check-square w-4 h-4 mr-2 text-success'></i> Change Status </a>";
                    }
                    else if (status === "Hold") {
                        send_Button += '<a id="btn_fowardDocs" disabled="true" href="javascript:;" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" data-tw-toggle="modal" data-tw-target="#hold_docs_info" title="Held documents cannot be released" data-trk-no="' + track_number + '"> <i class="fa fa-share-square text-secondary"></i> </a>';
                        print_qr += '<a id="btn_print_qr" href="' + base_url + '/print-qr/' + track_number + '/pos_top_right" target="_blank" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa-solid fa-print w-4 h-4 mr-2 text-primary"></i> Print QR </a>';
                        mark_Button += "<a id='btn_markAsComplete' href='javascript:;' data-admin='" + _is_admin + "' data-doc-desc='" + desc + "' data-doc-name='" + name + "' class='dropdown-item' data-trk-no='" + track_number + "'> <i class='fa fa-check-square w-4 h-4 mr-2 text-success'></i> Change Status </a>";
                        returned_details += "<div class='text-slate-500 text-xs whitespace-nowrap text-secondary mt-0.5 level'>" + returned__by + "</div><span class='hidden'>" + returned__by + "</span>";
                    }
                    else if (status === "Pending") {
                        send_Button += "<a id='btn_sendDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip' data-tw-toggle='modal' data-tw-target='#send_CreatedDocs' title='Send' data-trk-no='" + track_number + "'> <i class='fa fa-paper-plane text-success'></i> </a>";
                        edit_Button += "<a id='btn_updateCreatedDocs' href='javascript:;' " +
                            "data-copy-type='" + type_submitted + "' " +
                            "data-doc-level='" + level + "' " +
                            "data-display-type='" + display_type + "' " +
                            "data-doc-type='" + type + "' " +
                            "data-doc-type-id='" + type_id + "' " +
                            "data-doc-level-id='" + level_id + "' " +
                            "data-doc-desc='" + desc + "' " +
                            "data-doc-name='" + name + "' " +
                            "class='dropdown-item' data-trk-no='" + track_number + "' data-tw-toggle='modal' data-tw-target='#update_CreatedDocs'> <i class='fa fa-edit w-4 h-4 mr-2 text-success'></i> Edit </a>";
                        print_qr += '<a id="btn_print_qr" href="' + base_url + '/print-qr/' + track_number + '/pos_top_right" target="_blank" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa-solid fa-print w-4 h-4 mr-2 text-primary"></i> Print QR </a>';
                        mark_Button = "";
                        delete_Button += "<a id='btn_deleteDocs' href='javascript:;' data-doc-desc='" + desc + "' data-doc-name='" + name + "' class='dropdown-item' data-trk-no='" + track_number + "'> <i class='fa fa-trash-alt w-4 h-4 mr-2 text-danger'></i> Delete </a>";
                    }
                    else if (status === "Return") {
                        status = "Returned";
                        send_Button += "<a id='btn_sendDocs' href='javascript:;' class='w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip' data-tw-toggle='modal' data-tw-target='#send_CreatedDocs' title='Send' data-trk-no='" + track_number + "'> <i class='fa fa-paper-plane text-success'></i> </a>";
                        edit_Button += "<a id='btn_updateCreatedDocs' href='javascript:;' " +
                            "data-copy-type='" + type_submitted + "' " +
                            "data-doc-level='" + level + "' " +
                            "data-display-type='" + display_type + "' " +
                            "data-doc-type='" + type + "' " +
                            "data-doc-type-id='" + type_id + "' " +
                            "data-doc-level-id='" + level_id + "' " +
                            "data-doc-desc='" + desc + "' " +
                            "data-doc-name='" + name + "' " +
                            "class='dropdown-item' data-trk-no='" + track_number + "' data-tw-toggle='modal' data-tw-target='#update_CreatedDocs'> <i class='fa fa-edit w-4 h-4 mr-2 text-success'></i> Edit </a>";
                        print_qr += '<a id="btn_print_qr" href="' + base_url + '/print-qr/' + track_number + '/pos_top_right" target="_blank" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa-solid fa-print w-4 h-4 mr-2 text-primary"></i> Print QR </a>';
                        mark_Button = "";
                        delete_Button += "<a id='btn_deleteDocs' href='javascript:;' data-doc-desc='" + desc + "' data-doc-name='" + name + "' class='dropdown-item' data-trk-no='" + track_number + "'> <i class='fa fa-trash-alt w-4 h-4 mr-2 text-danger'></i> Delete </a>";
                    }

                    if (desc) {
                        message_icon = 'fa-solid fa-circle-info text-primary';
                        tool_tip_title = 'Has a Document Description';
                    } else {
                        message_icon = 'fa-solid fa-circle-info text-secondary';
                        tool_tip_title = 'No Document Description';
                    }

                    var tr = $('<tr>').addClass('intro-x');
                    tr.append($('<td>').addClass('createdDoc_id').hide().text(createdDoc_id));
                    tr.append($('<td>').addClass('track_number').hide().text(track_number));
                    tr.append($('<td>').html('<a id="track_document" data-track-number="' + track_number + '" href="' + base_url + '/track/doctrack/' + track_number + '" target="_blank" class="underline decoration-dotted whitespace-nowrap">#' + track_number + '</a>'));
                    tr.append($('<td>').addClass('name swal_name_tbl').attr({
                        'data-status-class': status_class,
                        'data-trk-number': track_number,
                        'data-trk-name': name,
                        'data-doc-status': status,
                        'data-total-recipients': total_recipients
                    }).html('<a data-trk-name="' + name + '" href="javascript:;">' + name.substr(0, 50) + "..." + '</a><span class="hidden">' + name + '</span>'));

                    tr.append($('<td>').addClass('type_submitted').html(
                        '<a id="btn_open_my_message" href="javascript:;" data-trk-no="' + track_number + '" data-doc-message="' + desc + '" class="tooltip" title="' + tool_tip_title + '"> <div class="flex justify-center whitespace-nowrap "><i class="w-5 h-5 pt-3 pb-3 ' + message_icon + '"></i></div></a>' +
                        '<span class="hidden">' + desc + '</span>'
                    ));

                    tr.append($('<td>').html(
                        '<div class="whitespace-nowrap type">' + type + '</div>' +
                        '<span class="hidden">' + type + '</span>' +
                        '<div class="text-slate-500 text-xs whitespace-nowrap text-' + level_class + ' mt-0.5 level">' + level + '</div>' +
                        '<span class="hidden">' + level + '</span>'
                    ));

                    tr.append($('<td>').addClass('status').html(
                        '<div class="flex items-center whitespace-nowrap text-' + status_class + '">' +
                        '<div class="w-2 h-2 bg-' + status_class + ' rounded-full mr-3"></div>' +
                        '<a id="btn_my_docs_status" data-status-class="' + status_class + '" data-returned-by="' + returned__by + '" data-date-returned="' + doc_track_created_date + '" data-returned-note="' + doc_track_note + '" data-doc-status="' + status + '" href="javascript:;" class="">' + status + '</a>' +
                        '</div>' +
                        '<span class="hidden">' + status + '</span>'
                    ));

                    tr.append($('<td>').addClass('type_submitted').html(
                        '<a id="btn_myDocuments_viewAttachments" href="javascript:;" data-trk-no="' + track_number + '"> <div class="flex items-center whitespace-nowrap "><i class="fa fa-folder w-4 h-4 mr-2 text-' + status_class + '"></i>' + type_submitted + '</div></a>' +
                        '<span class="hidden">' + type_submitted + '</span>'
                    ));

                    tr.append($('<td>').html(
                        '<div class="flex justify-center items-center">' +
                        send_Button +
                        '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">' +
                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>' +
                        '<div class="dropdown-menu w-40">' +
                        '<div class="dropdown-content">' +
                        edit_Button +
                        '<a id="btn_showDetails" href="javascript:;" class="dropdown-item" data-trk-no="' + track_number + '"> <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details </a>' +
                        print_qr +
                        mark_Button +
                        delete_Button +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    ));

                    tbody.append(tr);
                });
            }

            updatePagination(response);
        }
    });
}

function updatePagination(response) {
    const pagination = $('#pagination');
    pagination.empty();
    const totalPages = response.pagination.last_page;
    const currentPage = response.pagination.current_page;
    const perPage = response.pagination.per_page;
    const totalEntries = response.pagination.total;
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, totalEntries);

    const createPageItem = (page, label = page, isDisabled = false, isActive = false) => `
        <li class="page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}">
            <a class="page-link" href="javascript:;" onclick="${!isDisabled ? `load_createdDocs(${page})` : ''}">${label}</a>
        </li>`;

    // First page and previous
    pagination.append(createPageItem(1, 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>', 
        currentPage === 1));
    pagination.append(createPageItem(currentPage - 1, 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>', 
        currentPage === 1));

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(createPageItem(i, i, false, i === currentPage));
    }

    // Next and last page
    pagination.append(createPageItem(currentPage + 1, 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>', 
        currentPage === totalPages));
    pagination.append(createPageItem(totalPages, 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>', 
        currentPage === totalPages));

    // Update summary text
    $('#summary').html(`Showing ${from} to ${to} of ${totalEntries} entries`);
}

//Initial load
$(document).ready(function() {
    load_createdDocs();
});

//Select2 On Change Handler
function select2_on_change_handler() {

    $('#document_type').on('select2:select', function (e) {
        // Do something
        $('#document_type').select2({
            theme: "default"
        });
    });

    $('#document_level').on('select2:select', function (e) {
        // Do something
        $('#document_level').select2({
            theme: "default"
        });
    });

    $('#document_pub_pri_file').on('select2:select', function (e) {
        // Do something
        $('#document_pub_pri_file').select2({
            theme: "default"
        });
    });
}

//Select2 Validator
function select2_input_validator() {

    let validation;

    let get_document_copy_type = $('#document_type_submitted').val();
    let get_document_type = $('#document_type').val();
    let get_document_level = $('#document_level').val();
    let private_public_file = $('#document_pub_pri_file').val();

    if (get_document_copy_type.trim() == "") {
        validation = false;
    } else {
        validation = true;
    }

    if (get_document_type.trim() == "") {
        validation = false;
        $('#document_type').select2({
            theme: "error",
            placeholder: "Document Type is required",
        });

    } else {
        validation = true;
        $('#document_type').select2({
            theme: "default"
        });
    }

    if (get_document_level.trim() == "") {
        validation = false;
        $('#document_level').select2({
            theme: "error",
            placeholder: "Document Level is required",
        });
    } else {
        validation = true;
        $('#document_level').select2({
            theme: "default"
        });
    }

    if (private_public_file.trim() == "") {
        validation = false;
        $('#document_pub_pri_file').select2({
            theme: "error",
            placeholder: "Document Display Type is required",
        });

    } else {
        validation = true;
        $('#document_pub_pri_file').select2({
            theme: "default"
        });
    }

    return validation;
}

// Step 1.) Insert New Document Function
function insert_newDocuments() {

    $('#form_createDocs').submit(function (event) {
        event.preventDefault();

        let form = $(this);
        let size = 0;

        var files = pond.getFiles();
        let fileLength = files.length;
        var document_file_name = [];
        var document_folder = [];
        var _default_folder = '';
        var folder_name = '';
        var folder = '';
        var file_name = '';
        var form_data = {};

        //Loop Uploaded Document Attachments
        $.each(files, function (i, val) {
            _default_folder = val.serverId
            file_name = val.filename

            folder = _default_folder.split("<");
            folder_name = folder[0];

            document_file_name.push(file_name);
            document_folder.push(folder_name);
        });

        form_data = {
            _token: _token,
            document_type_submitted: $('#document_type_submitted').val(),
            document_title: $('#document_title').val(),
            message: $('#message').val(),
            document_type: $('#document_type').val(),
            document_level: $('#document_level').val(),
            document_pub_pri_file: $('#document_pub_pri_file').val(),
            document_file_name, document_folder,
        }

        let getDocCopyType = $('#document_type_submitted').val();

        // if (getDocCopyType == 1) {
        //
        //     //if Document was Soft Copy
        //     validate_File_Uploaded(size, files, fileLength, form_data);
        //
        // }else if (getDocCopyType == 3){
        //
        //     //if Document was Both Soft Copy and Hard Copy
        //     validate_File_Uploaded(size, files, fileLength, form_data);
        //
        // }
        // else{
        //
        //     //if Document was Hard Copy
        //     uploadFilesToDB(form_data);
        //
        // }

        if (select2_input_validator()) {
            if (getDocCopyType == 1) {

                //if Document was Soft Copy
                validate_File_Uploaded(size, files, fileLength, form_data);

            } else if (getDocCopyType == 3) {

                //if Document was Both Soft Copy and Hard Copy
                validate_File_Uploaded(size, files, fileLength, form_data);

            }
            else {

                //if Document was Hard Copy
                uploadFilesToDB(form_data);

            }
            // console.log('validation passed');
            // __notif_show(1, 'Success', 'validation passed');
        } else {
            console.log('validation failed');
            __notif_show(-1, 'Warning', 'Please fill-up all input fields provided.');
            // console.log(files);
        }

    });
}

//Step 2.) Validate uploaded files, Validate file size
function validate_File_Uploaded(size, files, fileLength, form_data) {
    if (fileLength > 0) {

        var getFileTotalSize = files[0].fileSize;

        $.each(files, function (key, file) {
            size += getFileTotalSize;
        });

        var finalSizeValue = convertToHumanFileSize_original_doc(size);

        pond.processFiles().then(() => {

            //if Size is less than or equal to 25mb

            if (size <= 26214400) {
                uploadFilesToDB(form_data);

            } else {
                __notif_show(-3, "File too Large", "File size uploaded: " + finalSizeValue);
            }
        });

    } else {
        __notif_show(-2, "File Missing!!", "Missing Attachments!");
    }
}

//Step 3.) Upload created files to Database if pass for validation
function uploadFilesToDB(form_data) {

    $.ajax({
        type: "POST",
        url: bpath + 'documents/docs-insert',
        data: form_data,
        success: function (response) {

            if (response.status == 200) {
                __notif_show(1, "Success", "Created successfully");
                // __notif_load_data(__basepath + "/");
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#create_document'));
                mdl.hide();

                load_createdDocs();
                $('#create_document').find('input').val("");
                $('#message').val("");
                removeUploaded_original_Files();
                $('#div_document_Attachment').show();

                $('.myDocs_counter').load(location.href + ' .myDocs_counter');
                select2_clear_input_fields();
            } else {
                __notif_show(-1, "Warning", "Something went wrong");
            }

        }
    });
}

//Delete Temporary uploaded Files if canceled
function deleteIfCanceled() {
    $("body").on('click', '#cancel_documents_btn', function () {

        let files = pond.getFiles();
        let doc_folder_name = '';
        let trim_folder = '';
        let doc_final_folder_name = '';
        let array_doc_folder = [];

        $.each(files, function (i, val) {
            doc_folder_name = val.serverId

            trim_folder = doc_folder_name.split("<");
            doc_final_folder_name = trim_folder[0];

            array_doc_folder.push(doc_final_folder_name);
        });


        $('#div_document_Attachment').show();

        select2_clear_input_fields();

        // console.log(documentFolder);

        $.ajax({
            url: bpath + 'documents/tmp-delete-canceled',
            type: "POST",
            data: {
                array_doc_folder: array_doc_folder,
                _token: _token
            },
            success: function (data) {
                removeUploaded_original_Files();
            }
        });

    });
}

//Clear Select-2 Single input fields
function select2_clear_input_fields() {
    $('#document_type').val(null).trigger('change');
    $('#document_level').val(null).trigger('change');
    $('#document_pub_pri_file').val(null).trigger('change');
    // $('#document_type_submitted').val(null).trigger('change');
    $('#document_title').val(null).trigger('change');
    $('#message').val(null).trigger('change');
}

//Update function for created documents
function update_createDocs() {
    $("body").on('click', '#btn_updateCreatedDocs', function (e) {

        var _this = $(this).closest('tr');
        let document_ID = $(this).data('trk-no');
        let docName = $(this).data('doc-name');
        let message = $(this).data('doc-desc');
        let display_type_name = $(this).data('display-type');
        let doc_type = $(this).data('doc-type');
        var doc_type_id = $(this).data('doc-type-id');
        let doc_level = $(this).data('doc-level');
        let doc_level_id = $(this).data('doc-level-id');
        let doc_copy_type = $(this).data('copy-type');
        let display_type = '';

        if (display_type_name == 1) {
            display_type = "Private File";
            display_type_name = "1";
        } else {
            display_type = "Public File";
            display_type_name = "0";
        }

        $('#up_document_ID').val(document_ID);
        $('#up_document_title').val(docName);
        $('#up_message').val(message);

        $('#_update_document_type').select2({
            placeholder: doc_type,
        });

        $('#_update_document_level').select2({
            placeholder: doc_level
        });

        $('#_update_document_pub_pri_file').select2({
            placeholder: display_type
        });

        $('#_update_document_type_submitted').val(doc_copy_type);

        $('#_update_document_type').val(doc_type_id);

        $('#_update_document_level').val(doc_level_id);

        $('#_update_document_pub_pri_file').val(display_type_name);
    });


    //Update Created Documents Modal
    $('#form_updateCreatedDocs').submit(function (e) {
        e.preventDefault();

        let update_form_data = [];

        // if ( $('#_update_document_type').val() == "" ||  $('#_update_document_level').val() == "" || $('#_update_document_pub_pri_file').val() == "")
        // {
        //     $('#_update_document_type').select2({
        //         theme: "error",
        //         placeholder: "Document type is required",
        //     });
        //     $('#_update_document_level').select2({
        //         theme: "error",
        //         placeholder: "Document level is required",
        //     });
        //     $('#_update_document_pub_pri_file').select2({
        //         theme: "error",
        //         placeholder: "Document display type is required",
        //     });
        // }else {
        //     $('#_update_document_type').select2({
        //         theme: "default"
        //     });
        //     $('#_update_document_level').select2({
        //         theme: "default"
        //     });
        //     $('#_update_document_pub_pri_file').select2({
        //         theme: "default"
        //     });

        // update_form_data = {
        //     _token:_token,
        //     document_id: $('#up_document_ID').val(),
        //     document_title: $('#up_document_title').val(),
        //     message: $('#up_message').val(),
        //
        //     document_type: $('#_update_document_type').val(),
        //
        //     document_level: $('#_update_document_level').val(),
        //
        //     document_pub_pri_file: $('#_update_document_pub_pri_file').val(),
        // }

        update_form_data = {
            _token: _token,
            document_id: $('#up_document_ID').val(),
            document_title: $('#up_document_title').val(),
            message: $('#up_message').val(),

            document_type: $('#_update_document_type').val(),

            document_level: $('#_update_document_level').val(),

            document_pub_pri_file: $('#_update_document_pub_pri_file').val(),
        }

        // console.log(update_form_data);
        $.ajax({
            url: bpath + 'documents/docs-update',
            type: "POST",
            data: update_form_data,

            success: function (data) {

                if (data.status == 200) {
                    __notif_load_data(__basepath + "/");
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_CreatedDocs'));
                    mdl.hide();
                    load_createdDocs();
                    $('#update_CreatedDocs').find('input').val("");
                    clear_updated_fields();
                } else {
                    __notif_show(-1, 'Warning', 'Server Error.');
                }
            }
        });
    });
}

function clear_updated_fields() {
    $('#up_document_ID').val("");
    $('#up_document_title').val("");
    $('#up_message').val("");

    $('#_update_document_type').val(null).trigger('change');
    $('#_update_document_level').val(null).trigger('change');
    $('#_update_document_pub_pri_file').val(null).trigger('change');

}

//Delete function for created documents
function softDelete_CreatedDocs() {
    $("body").on('click', '#btn_deleteDocs', function (e) {
        e.preventDefault();

        var docID = $(this).data('trk-no');

        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "File will be deleted, but can be found in trash bin !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value === true) {
                swal("Deleted!", "Document type has been deleted.", "success");

                var tablename = $(this).closest('table').DataTable();
                tablename
                    .row($(this)
                        .parents('tr'))
                    .remove()
                    .draw();

                $.ajax({
                    url: bpath + 'documents/docs-delete',
                    type: "POST",
                    data: {
                        _token: _token,
                        docID: docID,
                    },
                    success: function (data) {
                        __notif_load_data(__basepath + "/");
                        load_createdDocs();
                    },
                    cache: false,
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Your file is safe :)", "error");
            }
        });
    });
}

//Populate Employee List DataTables
function load_empList() {
    $.ajax({
        url: bpath + 'documents/employee-list/load',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {

            tbl_data_emplList.clear().draw();
            /***/
            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    /***/

                    var fullname = '';
                    var agencyid = data[i]['agencyid'];
                    var lastname = data[i]['lastname'];
                    var firstname = data[i]['firstname'];
                    var midname = data[i]['mi'];

                    if (midname) {
                        var mi = midname.substring(0, 1);
                    }


                    if (mi) {
                        fullname = lastname + ", " + firstname + " " + mi + ".";
                    } else {
                        fullname = lastname + ", " + firstname + " " + mi;
                    }


                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td class="agencyid">' + agencyid + '</td>' +

                        '<td class="fullname">' +
                        fullname +
                        '</td>' +

                        '<td class="w-auto">' +
                        '<div class="flex justify-center items-center">' +
                        '<button id="btn_addEmpTracks" type="button" class="flex items-center btn btn-outline-secondary"><i class="fa fa-user-plus text-success"></i></button>' +
                        '</div>' +
                        '</td>' +

                        '</tr>' +
                        '';

                    tbl_data_emplList.row.add($(cd)).draw();
                    /***/
                }
            }
        }
    });
}

// //Populate Group List DataTables
// function load_groupList() {
//     $.ajax({
//         url: bpath + 'documents/group-list/load',
//         type: "POST",
//         data: {
//             _token: _token,
//         },
//         success: function(data) {
//
//             tbl_data_groupList.clear().draw();
//             /***/
//             var data = JSON.parse(data);
//             if(data.length > 0) {
//                 for(var i=0;i<data.length;i++) {
//
//                     /***/
//
//                     var groupID = data[i]['id'];
//                     var group_name = data[i]['group_name'];
//                     var lastname = data[i]['lastname'];
//                     var firstname = data[i]['firstname'];
//
//                     var midname = data[i]['midname'];
//
//                     var mi = midname.substring(0,1);
//
//                     if (mi)
//                     {
//                         var fullname = lastname+", "+firstname+" "+mi+".";
//                     }else {
//                         var fullname = lastname+", "+firstname+" "+mi;
//                     }
//
//
//                     var cd = "";
//                     /***/
//
//                     cd = '' +
//                         '<tr >' +
//
//                         '<td class="groupID hidden">' + groupID + '</td>' +
//
//                         '<td class="group_name">' + group_name + '</td>' +
//
//                         '<td class="fullname">' +
//                         fullname+
//                         '</td>' +
//
//                         '<td class="w-auto">' +
//                         '<div class="flex justify-center items-center">'+
//                         '<button id="btn_addGroupTracks" type="button" class="flex items-center btn btn-outline-secondary"><i class="fa fa-user-plus text-success"></i></button>'+
//                         '</div>'+
//                         '</td>' +
//
//                         '</tr>' +
//                         '';
//
//                     tbl_data_groupList.row.add($(cd)).draw();
//                     /***/
//                 }
//             }
//         }
//     });
// }
//
// //Populate RC List DataTables
// function load_rcList() {
//     $.ajax({
//         url: bpath + 'documents/rc-list/load',
//         type: "POST",
//         data: {
//             _token: _token,
//         },
//         success: function(data) {
//
//             tbl_data_rcList.clear().draw();
//             /***/
//             var data = JSON.parse(data);
//
//             if(data.length > 0) {
//                 for(var i=0;i<data.length;i++) {
//
//                     /***/
//                     var responid = data[i]['responid'];
//                     var centername = data[i]['centername'];
//                     var department = data[i]['department'];
//                     var descriptions = data[i]['descriptions'];
//                     var head = data[i]['head'];
//                     var head_name = data[i]['head_name'];
//
//                     var cd = "";
//                     /***/
//
//                     cd = '' +
//                         '<tr >' +
//
//                         '<td style="display: none" class="rc_id">' +
//                         responid+
//                         '</td>' +
//
//                         '<td>' +
//                         centername+
//                         '</td>' +
//
//                         '<td>' +
//                         descriptions+
//                         '</td>' +
//
//                         '<td>' +
//                         department+
//                         '</td>' +
//
//                         '<td>' +
//                         head_name+
//                         '</td>' +
//
//                         '<td class="w-auto">' +
//                         '<div class="flex justify-center items-center">'+
//                         '<button id="btn_addRCTracks" type="button" class="flex items-center btn btn-outline-secondary" data-rc-name="'+centername+'" data-rc-id="'+responid+'"><i class="fa fa-user-plus text-success"></i></button>'+
//                         '</div>'+
//                         '</td>' +
//
//                         '</tr>' +
//                         '';
//
//                     tbl_data_rcList.row.add($(cd)).draw();
//
//                     /***/
//                 }
//             }
//         }
//     });
// }

//Open Document Status
$("body").on('click', '#btn_my_docs_status', function () {

    let doc_status = $(this).data('doc-status');
    let returned_by = $(this).data('returned-by');
    let status_class = $(this).data('status-class');
    let returned_date = $(this).data('date-returned');
    let returned_message = $(this).data('returned-note');

    if (doc_status == "Returned") {
        const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#my_docs_status_modal'));
        modal.toggle();


        let html_data =
            '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Returned by: <div class="ml-2">' + returned_by + '</div></div>' +
            '<div class="flex items-center mt-3"><i class="fa-regular fa-clock w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Date Returned: <div class="ml-2">' + returned_date + '</div></div>' +
            '<div class="flex items-center mt-3"><i class="fa-solid fa-clipboard-check w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Status: <span class="bg-' + status_class + '/20 text-' + status_class + ' rounded px-2 ml-1">' + doc_status + '</span></div>' +
            '<div class="flex items-center mt-3"><i class="fa-regular fa-comment w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Message: <div class="ml-2">' + returned_message + '</div></div>'
            ;
        $('#load_returned_docs_details').html(html_data);

    } else if (doc_status == "Completed") {
        const modal_completed = tailwind.Modal.getOrCreateInstance(document.querySelector('#my_docs_completed_modal'));
        modal_completed.toggle();

    } else if (doc_status == "Outgoing") {
        const modal_on_going = tailwind.Modal.getOrCreateInstance(document.querySelector('#my_docs_outgoing_modal'));
        modal_on_going.toggle();
    }
    else if (doc_status == "Pending") {
        const modal_pending = tailwind.Modal.getOrCreateInstance(document.querySelector('#my_docs_pending_modal'));
        modal_pending.toggle();
    }
});
//Open Message
$("body").on('click', '#btn_open_my_message', function () {

    let document_message = $(this).data('doc-message');

    if (document_message != null) {
        swal({
            type: 'info',
            title: 'Document Description',
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
            title: 'Document Description',
            html:
                '<div class="intro-y p-5">' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '<div class="text-justify  mb-4">Document has no description attached!</div>' +
                '<div class="flex text-slate-500 border-t border-slate-200/60 dark:border-darkmode-400 pb-3 mb-3"></div>' +
                '</div>',
        });
    }
});

//Send Button click
$("body").on('click', '#btn_sendDocs', function () {

    let docID = $(this).data('trk-no');
    $('#send_DocCode').val(docID);

});

//Button Create Documents On-CLick
$("body").on('click', '#create_documents', function () {


    $('#div_document_Attachment').show();

    $('#document_type').select2({
        placeholder: "Select Document Type"
    });

    $('#document_level').select2({
        placeholder: "Select Document Level"
    });

    $('#document_pub_pri_file').select2({
        placeholder: "Select Document Display Type"
    });

    $('#document_type_submitted').select2({
        // placeholder: "Select Document Copy Type"
    });

    $('#document_type_submitted').val(1);

});

//Button Add Employee's to Trail Send
$("body").on('click', '#btn_addEmpTracks', function () {

    var _this = $(this).closest('tr');
    let agencyid = _this.find('.agencyid').text();
    let fullname = _this.find('.fullname').text();
    $('#send_toUser').show();
    $('#div__track_list').show();

    var addTrack = '<li id="myList" data-position="" data-id="' + agencyid + '">' +
        '<a href="#" class="form-control grid grid-cols-2 mt-2 p-2">' +
        '<div class="flex items-center">' + fullname + '</div>' +
        '<div class="flex justify-end">' +
        '<button id="removeTracks" type="button" class="flex items-center btn btn-outline-secondary"><i class="fa fa-user-minus text-danger"></i></button>' +
        '</div>' +
        '</li>' +
        '</a>'

    $('#track_table').append(addTrack);

    var tablename = $(this).closest('table').DataTable();
    tablename
        .row($(this)
            .parents('tr'))
        .remove()
        .draw();

    values.push(agencyid);
    console.log(values);
});

//Button Remove Employee's to Trail Send
$("body").on('click', '#removeTracks', function () {
    var userID_index = $(this).closest("li").attr("data-id").split(":");
    var that = this;

    values.splice(userID_index, 1);
    $(that).closest("li").remove();

    if (values.length === 0) {
        $('#div__track_list').hide();
    }
    console.log(values);
});

//Button Add Group's to Trail Send
$("body").on('click', '#btn_addGroupTracks', function () {

    var _this = $(this).closest('tr');
    let groupID = _this.find('.groupID').text();
    let groupIndex = groupID + "-groupID";
    let group_name = _this.find('.group_name').text();
    $('#send_toGroup').show();
    $('#div__track_list').show();

    var addTrack = '<li id="mygroupList" data-grp-index="' + groupIndex + '" data-position="" data-grp-id="' + groupID + '">' +
        '<a href="#" class="form-control grid grid-cols-2 mt-2 p-2">' +
        '<div class="flex items-center">' + group_name + '</div>' +
        '<div class="flex justify-end">' +
        '<button id="removeGroupTracks" type="button" class="flex items-center btn btn-outline-secondary" data-grp-id="' + groupID + '"><i class="fa fa-minus text-danger"></i></button>' +
        '</div>' +
        '</li>' +
        '</a>'

    $('#track_table').append(addTrack);

    var tablename = $(this).closest('table').DataTable();
    tablename
        .row($(this)
            .parents('tr'))
        .remove()
        .draw();

    array_groupID.push(groupIndex);
    console.log(array_groupID);
});

//Button Remove Group's to Trail Send
$("body").on('click', '#removeGroupTracks', function () {

    var groupID_index = $(this).closest("li").attr("data-grp-index").split(":");
    var that = this;

    array_groupID.splice(groupID_index, 1);

    $(that).closest("li").remove();

    if (array_groupID.length === 0) {
        $('#div__track_list').hide();
    }
    console.log(array_groupID);
});

//Button Add RC's to Trail Send
$("body").on('click', '#btn_addRCTracks', function () {

    let rcID = $(this).data('rc-id');
    let rcName = $(this).data('rc-name');
    let rcIndex = rcID + "-rcID";

    $('#div__track_list').show();

    var addTrack = '<li id="myrcList" data-rc-index="' + rcIndex + '" data-position="" data-rc-id="' + rcID + '">' +
        '<a href="#" class="form-control grid grid-cols-2 mt-2 p-2">' +
        '<div class="flex items-center">' + rcName + '</div>' +
        '<div class="flex justify-end">' +
        '<button id="removeRCTracks" type="button" class="flex items-center btn btn-outline-secondary"><i class="fa fa-minus text-danger"></i></button>' +
        '</div>' +
        '</li>' +
        '</a>'

    $('#track_table').append(addTrack);

    var tablename = $(this).closest('table').DataTable();
    tablename
        .row($(this)
            .parents('tr'))
        .remove()
        .draw();

    array_rcID.push(rcIndex);
    console.log(array_rcID);
});

//Button Remove RC's to Trail Send
$("body").on('click', '#removeRCTracks', function () {

    var rcID_index = $(this).closest("li").attr("data-rc-index").split(":");
    var that = this;

    array_rcID.splice(rcID_index, 1);
    $(that).closest("li").remove();

    if (array_rcID.length === 0) {
        $('#div__track_list').hide();
        $('#div__modalEndTrail').hide();
    }
    console.log(array_rcID);
});

//Radio Button for Add Employee's Trail Send
$("body").on('click', '#radioBtn_emps', function () {
    $('#btn__openModalEmpList').show();
    $('#btn__openModalGroupList').hide();
    $('#btn__openModalRCList').hide();
    values = [];
    array_rcID = [];
    array_groupID = [];
    $('#track_table').empty();
    $('#div__track_list').hide();
    $('#div__modalEndTrail').hide();
    load_empList();
});

//Radio Button for Add Group's Trail Send
$("body").on('click', '#radioBtn_groups', function () {
    $('#btn__openModalGroupList').show();
    $('#btn__openModalEmpList').hide();
    $('#btn__openModalRCList').hide();
    values = [];
    array_rcID = [];
    array_groupID = [];
    $('#track_table').empty();
    $('#div__track_list').hide();
    $('#div__modalEndTrail').hide();
    load_groupList();
});

//Radio Button for Add RC's Trail Send
$("body").on('click', '#radioBtn_rc', function () {
    $('#btn__openModalRCList').show();
    $('#btn__openModalEmpList').hide();
    $('#btn__openModalGroupList').hide();
    values = [];
    array_rcID = [];
    array_groupID = [];
    $('#track_table').empty();
    $('#div__track_list').hide();
    $('#div__modalEndTrail').hide();
    load_rcList();
});

//Button for Opening Modal Employee's List
$("body").on('click', '#btn__openModalEmpList', function () {
    $('#div__modalEndTrail').show();
    $(is_markEndTrail).prop('checked', false);
    is_sortable = false;

});

//Button for Opening Modal Group's List
$("body").on('click', '#btn__openModalGroupList', function () {
    $('#div__modalEndTrail').show();
    $(is_markEndTrail).prop('checked', false);
});

//Button for Opening Modal RC's List
$("body").on('click', '#btn__openModalRCList', function () {
    $('#div__modalEndTrail').show();
    $(is_markEndTrail).prop('checked', false);
});

//Tab for Opening Trail Send
$("body").on('click', '#modal_rd_tab_trail_send', function () {
    $('#btn_TrailRelease').show();
    $('#btn_FastRelease').hide();
    sendDocs_modal_user_list.val(null).trigger('change');
    sendDocs_modal_group_list.val(null).trigger('change');
    sendDocs_modal_rc_list.val(null).trigger('change');
});

//Tab for Opening Fast Send
$("body").on('click', '#modal_rd_tab_fast_send', function () {
    $('#btn_FastRelease').show();
    $('#btn_TrailRelease').hide();
    sendDocs_modal_user_list.val(null).trigger('change');
    sendDocs_modal_group_list.val(null).trigger('change');
    sendDocs_modal_rc_list.val(null).trigger('change');
});

//For Testing Purpose Only!
$("body").on('click', '#btn_Test', function () {
    // docDetails();
    console.log(values, array_rcID, array_groupID);
});

// //Track Documents
// $("body").on('click', '#track_document', function (){
//
//     let track_number = $(this).data('track-number');
//     load_document_recipients(track_number);
// });

//Sortable List for Trail Send
$(function () {
    $("#track_table").sortable({

        update: function (event, ui) {
            $(this).children().each(function (index) {
                $(this).attr('data-position', (index + 1)).addClass('updated');
            });

            if ($('#radioBtn_emps').is(":checked")) {
                saveEmpsTrackOrder();
            } else if ($('#radioBtn_groups').is(":checked")) {
                saveGroupsTrackOrder();
            } else if ($('#radioBtn_rc').is(":checked")) {
                saveRCTrackOrder();
            }
        }
    });
});

//Save Track Order for Employee's
function saveEmpsTrackOrder() {
    values = [];
    $('.updated').each(function () {
        values.push([$(this).attr('data-id')]);
        $(this).removeClass('updated');
    });
    is_sortable = true;
    console.log(values);
}

//Save Track Order for Group's
function saveGroupsTrackOrder() {
    array_groupID = [];
    $('.updated').each(function () {
        array_groupID.push([$(this).attr("data-grp-index")]);
        $(this).removeClass('updated');
    });
    // console.log(array_groupID);
}

//Save Track Order for RC's
function saveRCTrackOrder() {
    array_rcID = [];
    $('.updated').each(function () {
        array_rcID.push([$(this).attr("data-rc-index")]);
        $(this).removeClass('updated');
    });
    // console.log(array_rcID);
}

//Fast Send Documents
function FastSend_Documents() {

    // $('#form_sendCreatedDocs').submit(function (event){
    //    event.preventDefault();
    //
    //    $data = [];
    //    var selectedGroup = document.getElementById("grp_List").selectedIndex;
    //    var selectedRC = document.getElementById("rc__list").selectedIndex;
    //    var senderID = $('#doc_sendAs').find(":selected").val();
    //
    //    is_checkSendToAll();
    //    is_checkShowAuthorName();
    //
    //    let docID = $('#send_DocCode').val();
    //    let release_date = $('#release_date').val();
    //    let receive_date = $('#receive_date').val();
    //    let employee = $('#emp_List').val();
    //    let groups = $('#grp_List').val();
    //    let RC = $('#rc__list').val();
    //
    //    var ass_from_type = $('#doc_sendAs').find(":selected").attr('data-ass-type');
    //    let note = $('#send_doc_note').val();
    //
    //
    //     $.ajax({
    //         type: "POST",
    //         url: bpath + 'documents/docs-fast-send',
    //         data: {
    //             _token: _token,
    //             data:values,
    //             docID:docID,
    //             note:note,
    //             release_date:release_date,
    //             receive_date:receive_date,
    //             employee:employee,
    //             groups:groups,
    //             RC:RC,
    //             sendToAll:checked_Box_Value,
    //             showAuthor:checkedBox_ShowAuthorName,
    //             senderID:senderID,
    //             __from:ass_from_type,
    //         },
    //         success:function (response) {
    //             if (response.status === 200)
    //             {
    //                 //update Document Status
    //                 $.ajax({
    //                     type: "POST",
    //                     url: bpath + 'documents/docs-updateDocStats',
    //                     data: {
    //                         _token: _token,
    //                         docID:docID,
    //                     },
    //                     success:function (response) {
    //
    //                         __notif_show( 1, "Success", "Document sent successfully!");
    //                         const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_CreatedDocs'));
    //                         mdl.hide();
    //
    //                         docDetails(docID);
    //                         $('#send_toUser').hide();
    //
    //                         $('#btn_sendToAll').prop("checked", false);
    //                         $('#checkBox_shoAuthor').prop("checked", false);
    //                         showFastSendDiv();
    //                         sendDocs_modal_user_list.val(null).trigger('change');
    //                         sendDocs_modal_group_list.val(null).trigger('change');
    //                         sendDocs_modal_rc_list.val(null).trigger('change');
    //
    //                         $('.__notification').load(location.href+' .__notification');
    //                         $('.incoming_counter').load(location.href+' .incoming_counter');
    //
    //                         load_createdDocs();
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // });

    $("body").on('click', '#btn_FastRelease', function () {

        var senderID = $('#doc_sendAs').find(":selected").val();

        is_checkSendToAll();
        is_checkShowAuthorName();

        let docID = $('#send_DocCode').val();
        let release_date = $('#release_date').val();
        let receive_date = $('#receive_date').val();
        let employee = $('#emp_List').val();
        let groups = $('#grp_List').val();
        let RC = $('#rc__list').val();

        var ass_from_type = $('#doc_sendAs').find(":selected").attr('data-ass-type');
        let note = $('#send_doc_note').val();

        $.ajax({
            type: "POST",
            url: bpath + 'documents/docs-fast-send',
            data: {
                _token: _token,
                data: values,
                docID: docID,
                note: note,
                release_date: release_date,
                receive_date: receive_date,
                employee: employee,
                groups: groups,
                RC: RC,
                sendToAll: checked_Box_Value,
                showAuthor: checkedBox_ShowAuthorName,
                senderID: senderID,
                __from: ass_from_type,
            },
            success: function (response) {
                if (response.status === 200) {
                    __notif_show(1, "Success", "Document sent successfully!");
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_CreatedDocs'));
                    mdl.hide();

                    docDetails(docID);
                    $('#send_toUser').hide();

                    $('#btn_sendToAll').prop("checked", false);
                    $('#checkBox_shoAuthor').prop("checked", false);
                    showFastSendDiv();
                    sendDocs_modal_user_list.val(null).trigger('change');
                    sendDocs_modal_group_list.val(null).trigger('change');
                    sendDocs_modal_rc_list.val(null).trigger('change');

                    $('.__notification').load(location.href + ' .__notification');
                    $('.incoming_counter').load(location.href + ' .incoming_counter');

                    load_createdDocs();
                }
            }
        });
    });
}

//Trail Send Documents
function TrailSend_Documents() {
    $("body").on('click', '#btn_TrailRelease', function () {

        var senderID = $('#doc_sendAs').find(":selected").val();

        isMarkEndOfTrail();

        let docID = $('#send_DocCode').val();
        let receive_date = $('#receive_date').val();

        var ass_from_type = $('#doc_sendAs').find(":selected").attr('data-ass-type');
        let note = $('#send_note').val();
        let expected_receive_date = $('#expected_receive_date').val();
        let expected_release_date = $('#expected_release_date').val();


        $.ajax({
            type: "POST",
            url: bpath + 'documents/docs-trail-send',
            data: {
                _token: _token,
                docID: docID,
                note: note,
                receive_date: receive_date,
                sendToEmps: values,
                is_sortable: is_sortable,
                sendToGroups: array_groupID,
                sendToRC: array_rcID,
                endTrail: markEndTrail_Value,
                senderID: senderID,
                __from: ass_from_type,
                expected_receive_date: expected_receive_date,
                expected_release_date: expected_release_date,
            },
            success: function (response) {
                var data = JSON.parse(response);
                console.log(data);

                if (data.status == 'success') {
                    __notif_show(1, "Success", "Document sent successfully!");
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_CreatedDocs'));
                    mdl.hide();
                    load_createdDocs();
                    $('.__notification').load(location.href + ' .__notification');
                    $('.incoming_counter').load(location.href + ' .incoming_counter');

                }

            }
        });
    });

}

function status200() {
    if (response.status === 200) {
        __notif_load_data(__basepath + "/");
        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_CreatedDocs'));
        mdl.hide();

        //docDetails();
        $('#send_toUser').hide();
        $('#btn_sendToAll').prop("checked", false);
        $('#checkBox_shoAuthor').prop("checked", false);
        //showFastSendDiv();
        sendDocs_modal_user_list.val(null).trigger('change');
        sendDocs_modal_group_list.val(null).trigger('change');
        sendDocs_modal_rc_list.val(null).trigger('change');
        $('.__notification').load(location.href + ' .__notification');
        //load_createdDocs();
    } else {
        __notif_load_data(__basepath + "/");
    }
}

//Check if Button Send To all Clicked
function is_checkSendToAll() {
    if (is_sendToAll.checked === true) {
        checked_Box_Value = 1;
        console.log(checked_Box_Value);
    } else {
        checked_Box_Value = 0;
        console.log(checked_Box_Value);
    }
}

//Check if Button show Author Name Clicked
function is_checkShowAuthorName() {
    if (is_showAuthor.checked === true) {
        checkedBox_ShowAuthorName = 1;
        console.log(checkedBox_ShowAuthorName);
    } else {
        checkedBox_ShowAuthorName = 0;
        console.log(checkedBox_ShowAuthorName);
    }
}

//Button Send to all Event Listener
checkbox_sendToAll.addEventListener('change', function () {
    if (this.checked) {
        hideFastSendDiv();
        sendDocs_modal_user_list.val(null).trigger('change');
        sendDocs_modal_group_list.val(null).trigger('change');
        sendDocs_modal_rc_list.val(null).trigger('change');
        $('#emp_List').val("");
        $('#grp_List').val("");
        $('#rc__list').val("");
    } else {
        showFastSendDiv();
    }
});

//Show Fast Send Section
function showFastSendDiv() {
    $('.sendToEmployee').show();
    $('.sendToGroups').show();
    $('.sendToRC').show();
}

//Hide Fast Send Section
function hideFastSendDiv() {
    $('.sendToEmployee').hide();
    $('.sendToGroups').hide();
    $('.sendToRC').hide();
}

//Check if Mark End of trail was checked
function isMarkEndOfTrail() {
    if (is_markEndTrail.checked === true) {
        markEndTrail_Value = 1;
        // console.log(markEndTrail_Value);
    } else {
        markEndTrail_Value = 0;
        // console.log(markEndTrail_Value);
    }
}

$("body").on('click', '#btn_myDocuments_viewAttachments', function () {


    my_document_tracking_number = $(this).data('trk-no');

    // console.log(my_document_tracking_number);

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#my_Docs_modal_add_attachments'));
    mdl.toggle();

    // console.log(my_document_tracking_number);
    load_attached_my_documents();


});

function load_attached_my_documents() {

    let add_attachment_button = '';

    tbl_data_my_docs_original_attachments.clear().draw();
    tbl_data__my_docs_added_attachments.clear().draw()

    add_attachment_button = '<button id="btn_mydocs_add_document_attachments" data-tracking-number="' + my_document_tracking_number + '" class="w-auto ml-auto btn btn-primary mb-5 col-span-12 sm:col-span-6">' +
        '<span class="truncate">Add Document Attachment(s)</span> <i class="fa-solid fa-circle-plus w-4 h-4 ml-2"></i>';


    $('#my_docs_add_attachments_div').html(add_attachment_button);

    $.ajax({
        url: bpath + 'documents/attachments/load',
        type: "POST",
        data: {
            _token: _token,
            docID: my_document_tracking_number,
        },
        success: function (response) {

            var data = JSON.parse(response);

            console.log(data);
            if (data.length > 0) {

                populate_my_docs_attachments_data_table(data);
                $('#div_dt__my_docs_added_attachments').show();
                $('#div_dt__my_docs_original_attachments').show();
                $('#my_docs_no_attached').hide();

            } else {
                $('#div_dt__my_docs_added_attachments').hide();
                $('#div_dt__my_docs_original_attachments').hide();
                $('#my_docs_no_attached').show();

                let html_data = '<div class="alert alert-danger alert-dismissible show flex items-center mb-2" role="alert"> ' +
                    '<i class="fa-solid fa-circle-exclamation mr-5"></i> No document attachment(s) found! </div>';

                $('#my_docs_no_attached').html(html_data);
            }
        }
    });
}

function populate_my_docs_attachments_data_table(data) {

    var add_attachment_button = '';

    for (let o = 0; o < data.length; o++) {

        var path = data[o]['path'];
        var count = data[o]['view_count'];
        var doc_attachment_id = data[o]['id'];
        doc_file_id = data[o]['doc_file_id'];
        var File_name = data[o]['name'];
        var added_attachments = data[o]['added_attachments'];
        var full_name = data[o]['full_name'];
        var date_created = data[o]['date_created'];
        var Note = data[o]['description'];
        var has_file = data[o]['has_file'];
        var if_authenticated = data[o]['check_login'];

        let link = data[o]['link'];
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
                '<a id="attachment_count_view" data-doc-att-id="' + doc_attachment_id + '" class="flex items-center mb-2" href="/documents/download-documents/' + path + '" target="_blank">' +
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

            tbl_data_my_docs_original_attachments.row.add($(cd)).draw();

            $('#div_dt__my_docs_added_attachments').hide();
        }

        else if (added_attachments == 1) {

            $('#div_dt__my_docs_added_attachments').show();

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
                '<button id="btn_my_delete_attached_docs" data-att-path="' + path + '" type="button" class="btn btn-outline-secondary mr-2"><i class="fa fa-trash text-danger"></i></button>' +
                '<a id="btn_download_public_files" href="/documents/download-documents/' + path + '" target="_blank" data-att-path="' + path + '" type="button" class="btn btn-outline-secondary tooltip ml-1" title="Download File"><i class="fa-solid fa-download text-success"></i></a>' +
                '</div>' +
                '</td>' +

                '</tr>' +
                '';

            tbl_data__my_docs_added_attachments.row.add($(cd)).draw();
        }
    }
}

$("body").on('click', '#btn_my_delete_attached_docs', function () {

    tbl_data__my_docs_added_attachments.row($(this).parents('tr')).remove().draw();

    let attachment_path = $(this).data('att-path');

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
                load_attached_my_documents();
            }
        }
    });

});

$("body").on('click', '#btn_mydocs_add_document_attachments', function () {

    let tracking_number = $(this).data('tracking-number');
    $('#document_identifier').val("my_documents");

    $('#attach_document_form_value').val(tracking_number);
    const my_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#attach_document_modal'));
    my_modal.toggle();

});


$("body").on("click", "#btn_modal_load_to_print", function (ev) {
    // ev.preventDefault();



    // if(!ev.detail || ev.detail == 1){
    //     $.ajax({
    //         url: "load/summary/print",
    //         type: "POST",
    //         data: {
    //             _token: _token,
    //             modal_to: $("#modal_summray_from").val(),
    //             modal_from: $("#modal_summray_to").val(),
    //             modal_status: $("#modal_summray_status").val(),
    //         },
    //         success: function(data){

    //             // var data = JSON.parse(data);
    //             // console.log(data);
    //             const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#generate_summary_modal'));
    //             mdl.hide();

    //             // __notif_load_data(__basepath + "/");
    //         }
    //     });
    //     window.open('load/summary/print');
    // }
});




