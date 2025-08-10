var doc_settings_legend_list;

$(document).ready(function() {

    bpath = __basepath + "/";

    load_docSettingsDataTable();

    load_doc_Type('');
    insert_DocumentType();
    update_DocumentType();
    softDelete_DocumentType();

    load_doc_Level('');
    insert_DocumentLevel();
    update_DocumentLevel();
    softDelete_DocumentLevel();
});


var  _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_docType;
var tbl_data_docLevel;


function load_docSettingsDataTable() {

    try{
        /***/
        tbl_data_docType = $('#dt__docType').DataTable({
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
                    { className: "dt-head-center", targets: [ 3 ] },
                ],
        });

        tbl_data_docLevel = $('#dt__docLevel').DataTable({
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
            "reponsive": true,

            columnDefs:
                [
                    { className: "dt-head-center", targets: [ 3,4 ] },
                ],
        });

        // doc_settings_legend_list = $('#legend_list').select2({
        //     allowClear: true,
        //     closeOnSelect: true,
        //     width: "100%",
        // });

        /***/
    }catch(err){  }
}

//docs Type
function load_doc_Type() {

    $.ajax({
        url: bpath + 'admin/document-type/load',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function(data) {

            tbl_data_docType.clear().draw();
            /***/
            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/

                    var id = data[i]['id'];
                    var doc_type = data[i]['doc_type'];
                    var doc_desc = data[i]['doc_desc'];

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td style="display: none" class="docType_id">' +
                        id+
                        '</td>' +

                        '<td class="docType">' +
                        doc_type+
                        '</td>' +

                        '<td class="docType_desc">' +
                        doc_desc+
                        '</td>' +

                        '<td class="w-auto">' +
                        '<div class="flex justify-center items-center">'+
                        '<button id="btn_updateDocType" type="button" class="btn btn-outline-secondary flex items-center mr-2" ' +
                        'data-tw-toggle="modal" data-tw-target="#update_DocumentType"><i class="fa fa-edit text-success"></i></button>'+
                        '<button type="button" class="flex items-center btn btn-outline-secondary btn_deleteDocType"><i class="fa fa-trash text-danger"></i></button>'+
                        '</div>'+
                        '</td>' +

                        '</tr>' +
                        '';

                    tbl_data_docType.row.add($(cd)).draw();
                    /***/

                }

            }
        }

    });
}

function insert_DocumentType() {
    $('#form_docType').submit(function (e){
        e.preventDefault();

        let docType = $('#document_Type').val();
        let description = $('#desc').val();

        $.ajax({
            url: bpath + 'admin/document-type/insert',
            type: "POST",
            data: {
                _token: _token,
                docType:docType,
                description:description,
            },
            success: function(data) {
                __notif_load_data(__basepath + "/");

                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#new_DocType'));
                mdl.hide();

                load_doc_Type('');
                $('#new_DocType').find('input').val("");
            }
        });
    });
}
function update_DocumentType() {

    $("body").on('click', '#btn_updateDocType', function (e){

        var _this = $(this).closest('tr');
        let docID = _this.find('.docType_id').text();
        let documentType = _this.find('.docType').text();
        let desc = _this.find('.docType_desc').text();

        $('#up_document_Type').val(documentType);
        $('#up_desc').val(desc);
        $('#up_docID').val(docID);

    });

    $('#form_updateDocType').submit(function (e){
       e.preventDefault();

        let docID = $('#up_docID').val();
        let docType = $('#up_document_Type').val();
        let docDesc = $('#up_desc').val();

        $.ajax({
            url: bpath + 'admin/document-type/update',
            type: "POST",
            data: {
                _token: _token,
                docID:docID,
                docType:docType,
                docDesc:docDesc,
            },
            success: function(data) {
                __notif_load_data(__basepath + "/");
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_DocumentType'));
                mdl.hide();
                load_doc_Type('');
                $('#update_DocumentType').find('input').val("");
            }
        });
    });
}
function softDelete_DocumentType(){
    $("body").on('click', '.btn_deleteDocType', function (e) {
        e.preventDefault();
        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "It will permanently deleted !",
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

                var _this = $(this).closest('tr');
                docID = _this.find('.docType_id').text();

                $.ajax({
                    url: bpath + 'admin/document-type/delete',
                    type: "POST",
                    data: {
                        _token: _token,
                        docID: docID,
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

//docs Level
function load_doc_Level() {

    $.ajax({
        url: bpath + 'admin/document-level/load',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function(data) {

            tbl_data_docLevel.clear().draw();
            /***/
            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/

                    var id = data[i]['id'];
                    var doc_level = data[i]['doc_level'];
                    var desc = data[i]['desc'];
                    var legend = data[i]['legend'];

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td style="display: none" class="docLevel_id">' +
                        id+
                        '</td>' +

                        '<td class="docLevel">' +
                        doc_level+
                        '</td>' +

                        '<td class="docLevel_desc">' +
                        desc+
                        '</td>' +

                        '<td class="">' +

                        '<div class="flex justify-center items-center whitespace-nowrap text-'+legend+'"><div class="w-2 h-2 bg-'+legend+' rounded-full mr-3"></div></div>' +

                        '</td>' +

                        '<td class="w-auto">' +
                        '<div class="flex justify-center items-center">'+
                        '<button id="btn_updateDocLevel" type="button" class="btn btn-outline-secondary flex items-center mr-2" data-tw-toggle="modal" data-tw-target="#update_DocumentLevel"><i class="fa fa-edit text-success"></i></button>'+
                        '<button type="button" class="flex items-center btn btn-outline-secondary btn_deleteDocLevel"><i class="fa fa-trash text-danger"></i></button>'+
                        '</div>'+
                        '</td>' +

                        '</tr>' +
                        '';

                    tbl_data_docLevel.row.add($(cd)).draw();
                    /***/

                }

            }
        }

    });
}
function insert_DocumentLevel(){
    $('#form_docLevel').submit(function (e){
        e.preventDefault();

        let docLevel = $('#document_Level').val();
        let description = $('#level_desc').val();

        $.ajax({
            url: bpath + 'admin/document-level/insert',
            type: "POST",
            data: {
                _token: _token,
                docLevel:docLevel,
                description:description,
            },
            success: function(data) {
                __notif_load_data(__basepath + "/");
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#new_DocLevel'));
                mdl.hide();
                load_doc_Level('');
                $('#new_DocLevel').find('input').val("");
            }
        });
    });
}
function update_DocumentLevel(){
    $("body").on('click', '#btn_updateDocLevel', function (){

        var _this = $(this).closest('tr');
        let docID = _this.find('.docLevel_id').text();
        let documentLevel = _this.find('.docLevel').text();
        let desc = _this.find('.docLevel_desc').text();

        $('#up_docLevelID').val(docID);
        $('#up_document_Level').val(documentLevel);
        $('#up_descLevel').val(desc);

    });

    $('#form_updateDocLevel').submit(function (event){
        event.preventDefault();

        let docID = $('#up_docLevelID').val();
        let docLevel = $('#up_document_Level').val();
        let docDesc = $('#up_descLevel').val();
        let color = $('#legend_list').val();

        $.ajax({
            url: bpath + 'admin/document-level/update',
            type: "POST",
            data: {
                _token: _token,
                docID:docID,
                docLevel:docLevel,
                docDesc:docDesc,
                color:color,
            },
            success: function(data) {
                __notif_load_data(__basepath + "/");
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_DocumentLevel'));
                mdl.hide();
                load_doc_Level('');
                $('#update_DocumentLevel').find('input').val("");
            }
        });
    });
}
function softDelete_DocumentLevel(){
    $("body").on('click', '.btn_deleteDocLevel', function (e) {
        e.preventDefault();
        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value === true) {
                swal("Deleted!", "Document level has been deleted.", "success");

                var tablename = $(this).closest('table').DataTable();
                tablename
                        .row($(this)
                        .parents('tr'))
                        .remove()
                        .draw();

                var _this = $(this).closest('tr');
                docID = _this.find('.docLevel_id').text();

                $.ajax({
                    url: bpath + 'admin/document-level/delete',
                    type: "POST",
                    data: {
                        _token: _token,
                        docID: docID,
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

$("body").on('click', '#btn_docLevel', function (){
    //$("#gaga").load(location.href + " #gaga");
    load_doc_Level('');
});

