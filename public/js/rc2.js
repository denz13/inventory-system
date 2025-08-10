
$(document).ready(function() {

    bpath = __basepath + "/";

    load_datatable();
    load_rc('');

});

var  _token = $('meta[name="csrf-token"]').attr('content');
var tbldata_rc;
var tbldata_rc_members;
var rc_modal_member_list;


function load_datatable() {

    try{
        /***/
        tbldata_rc = $('#dt__rc').DataTable({
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
                    { className: "dt-head-center", targets: [ 5 ] },
                ],
        });

        tbldata_rc_members = $('#dt__rc_members').DataTable({
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

        });

        rc_modal_member_list = $('#rc_modal_members').select2({
            placeholder: "Select members",
            allowClear: true,
            closeOnSelect: false,
        });


        /***/
    }catch(err){  }
}

$("body").on("click", "#rc_table_updated_rc", function () {
    var _this = $(this).closest('tr');
    var rc_id = _this.find('.rc_id').text();
    $('#rc_id_modal').val(rc_id);
    ////.log(rc_id);

    let rc_head = $(this).data('rc-head');
    let rc_head_id = $(this).data('rc-head-id');

    load_user_members_rc(rc_id);
});

$("body").on('click', '#btn_cancel_rc_update', function (){

    $('#rc_modal_members').val(null).trigger('change');

});

$("body").on("click", ".deleterow", function (ev) {
    ev.preventDefault();
    var urlToRedirect = ev.currentTarget.getAttribute('href'); //use currentTarget because the click may be on the nested i tag and not a tag causing the href to be empty

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
        if (result.value == true) {
            swal("Deleted!", "Your file has been deleted.", "success");

            var tablename = $(this).closest('table').DataTable();
            tablename
                .row($(this)
                    .parents('tr'))
                .remove()
                .draw();

            var _this = $(this).closest('tr');
            crop_id = _this.find('.crop_id').text();

            $.ajax({
                url: "crop/remove/crop",
                type: "POST",
                data: {
                    _token: _token,
                    type: 1,
                    crop_id: crop_id,
                },
                cache: false,
                success: function (dataResult) {
                    //.log(dataResult);
                    var dataResult = JSON.parse(dataResult);


                }
            });
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal("Cancelled", "Your file is safe :)", "error");
        }
    })
});

$("body").on("click", "#save_rc_head_members", function () {
    var memberList = [];
    var rc_modal_head = $('#rc_modal_head').val();
    var rc_id_modal = $('#rc_id_modal').val();

    $('.btn').attr('disabled', 'disabled');

    $('#rc_modal_member_list :selected').each(function(i, selected) {
        memberList[i] = $(selected).val();
    });

    let rc_members = $('#rc_modal_members').val();

    if(rc_members != "")
    {
        $.ajax({
            url: bpath + 'admin/rc/add/members',
            type: "POST",
            data: {
                _token: _token,
                memberList: memberList,
                rc_modal_head: rc_modal_head,
                rc_id_modal: rc_id_modal,
                rc_members,

            },
            success: function(data) {
                var data = JSON.parse(data);
                ////.log(data);
                __notif_load_data(__basepath + "/");
                load_user_members_rc('');
                load_rc('');

                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#update_rc_modal_members_head"));
                mdl.hide();
                $('.btn').removeAttr("disabled");
                rc_modal_member_list.val(null).trigger('change');

            }

        });
    }
});

function load_user_members_rc(rc_id) {
    $.ajax({
        url: bpath + 'admin/rc/load/members',
        type: "POST",
        data: {
            _token: _token,
            rc_id: rc_id,

        },
        success: function(data) {
            tbldata_rc_members.clear().draw();
            /***/
            var data = JSON.parse(data);

            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td class="rc_member_id">' +
                        id+
                        '</td>' +

                        '<td>' +
                        name+
                        '</td>' +

                        '<td>' +
                        '<div class="btn-group" role="group" aria-label="Basic outlined example">'+
                        '<button type="button" class="btn btn-outline-secondary rc_members_deleterow"><i class="fa fa-trash text-danger"></i></button>'+
                        '</div>'+
                        '</td>' +

                        '</tr>' +
                        '';

                    tbldata_rc_members.row.add($(cd)).draw();


                    /***/

                }
                ////.log( id );
            }
        }

    });
}

function load_rc(rc_id) {

    $.ajax({
        url: bpath + 'admin/rc/load',
        type: "POST",
        data: {
            _token: _token,
            rc_id: rc_id,
        },
        success: function(data) {
            tbldata_rc.clear().draw();
            /***/
            var data = JSON.parse(data);
            ////.log( data );
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var responid = data[i]['responid'];
                    var centername = data[i]['centername'];
                    var department = data[i]['department'];
                    var descriptions = data[i]['descriptions'];
                    var head = data[i]['head'];
                    var head_name = data[i]['head_name'];
                    var rc_head_id = data[i]['rc_head_id'];

                    var cd = "";
                    /***/

                    cd = '' +
                        '<tr >' +

                        '<td style="display: none" class="rc_id">' +
                        responid+
                        '</td>' +

                        '<td>' +
                        centername+
                        '</td>' +

                        '<td>' +
                        descriptions+
                        '</td>' +

                        '<td>' +
                        department+
                        '</td>' +

                        '<td>' +
                        head_name+
                        '</td>' +

                        '<td class="w-auto">' +
                        '<div class="flex justify-center items-center">'+
                        '<button id="rc_table_updated_rc" type="button" class="btn btn-outline-secondary flex items-center mr-2" data-rc-head="'+head_name+'" data-head-id="'+rc_head_id+'" data-tw-toggle="modal" data-tw-target="#update_rc_modal_members_head"><i class="fa fa-edit text-success"></i></button>'+

                        '</div>'+
                        '</td>' +

                        '</tr>' +
                        '';

                    tbldata_rc.row.add($(cd)).draw();


                    /***/

                }

            }
        }

    });
}

$("body").on("click", ".rc_members_deleterow", function (ev) {
    ev.preventDefault();
    var urlToRedirect = ev.currentTarget.getAttribute('href');

    //use currentTarget because the click may be on the nested i tag and not a tag causing the href to be empty
    //var tablename = $(this).closest('table').DataTable();

    tbldata_rc_members
        .row($(this)
            .parents('tr'))
        .remove()
        .draw();

    var _this = $(this).closest('tr');
    rc_member_id = _this.find('.rc_member_id').text();
    rc_id = $('#rc_id_modal').val();

    //.log(rc_id);
    $.ajax({
        url: "rc/member/remove",
        type: "POST",
        data: {
            _token:_token,
            type: 1,
            rc_member_id: rc_member_id,
            rc_id: rc_id,
        },
        cache: false,
        success: function (data) {
            ////.log(data);
            var data = JSON.parse(data);
            __notif_load_data(__basepath + "/");
            load_user_members_rc(rc_id);
        }
    });

});
