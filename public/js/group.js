$(document).ready(function() {

    bpath = __basepath + "/";

    load_datatable();

    load_group('');
});
var  _token = $('meta[name="csrf-token"]').attr('content');
var tbldata_group;
var tbldata_group_members;
var update_group;
var update_head;

function load_datatable() {

	try{
		/***/
		tbldata_group = $('#dt__group').DataTable({
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

        tbldata_group_members = $('#dt__group_members').DataTable({
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
                    { className: "dt-head-center", targets: [ 2 ] },
                ],
		});

        update_group = $('.select2-multiple').select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,});

		/***/
	}catch(err){  }
}

function load_group(group_id) {
    $.ajax({
		url: bpath + 'admin/group/load',
		type: "POST",
		data: {
			_token: _token,
			group_id: group_id,
		},
		success: function(data) {
            tbldata_group.clear().draw();
				/***/
				var data = JSON.parse(data);
                if(data.length > 0) {
					for(var i=0;i<data.length;i++) {

							/***/

							var id = data[i]['id'];
							var name = data[i]['name'];
							var desc = data[i]['desc'];
							var firstname = data[i]['grpHeadFirstname'];
                            var lastname = data[i]['grpHeadLastname'];
                            var head_id = data[i]['group_head_id'];

                            var cd = "";
							/***/

								cd = '' +
						                '<tr >' +

                                            '<td style="display: none" class="group_id">' +
                                                    id+
                                            '</td>' +

						                    '<td>' +
                                                    name+
						                    '</td>' +

                                            '<td>' +
                                                    desc+
						                    '</td>' +

                                            '<td class="w-auto">' +
                                                '<div class="flex justify-center items-center" role="group" aria-label="Basic outlined example">'+
                                                    '<button id="group_table_updated_group" type="button" class="btn btn-outline-secondary flex items-center mr-2" ' +
                                                            'data-tw-toggle="modal" ' +
                                                            'data-hd-lstname="'+lastname+'" ' +
                                                            'data-hd-fstname="'+firstname+'" ' +
                                                            'data-grp-name="'+name+'" ' +
                                                            'data-grp-id="'+id+'" ' +
                                                            'data-grp-desc="'+desc+'" ' +
                                                            'data-head-id="'+head_id+'"' +
                                                            'data-tw-target="#update_group_modal_members_head"><i class="fa fa-edit text-success"></i>' +
                                                    '</button>'+

                                                    '<button type="button" class="btn btn-outline-secondary group_deleterow"><i class="fa fa-trash text-danger"></i></button>'+
                                                '</div>'+
						                    '</td>' +

						                '</tr>' +
								'';

								tbldata_group.row.add($(cd)).draw();


							/***/

					}
                    ////.log( id );
				}
		}

		});
}

$("body").on("click", "#create_group_modal_save", function () {
    var memberList = [];
    var modal_group_title = $('#modal_group_title').val();
    var modal_group_desc = $('#modal_group_desc').val();


    $('#group_modal_member_list :selected').each(function(i, selected) {
        memberList[i] = $(selected).val();
    });

    $.ajax({
		url: bpath + 'admin/group/add',
		type: "POST",
		data: {
			_token: _token,
			memberList: memberList,
			modal_group_title: modal_group_title,
			modal_group_desc: modal_group_desc,

		},
		success: function(data) {
            var data = JSON.parse(data);

            __notif_load_data(__basepath + "/");
            load_group('');



            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#create_group_modal"));
            mdl.hide();


		}

		});

});

$("body").on("click", "#group_table_updated_group", function () {

    // var _this = $(this).closest('tr');
    // var group_id = _this.find('.group_id').text();

    let group_id = $(this).data('grp-id');
    let group_name = $(this).data('grp-name');
    let group_desc = $(this).data('grp-desc');


    $('#group_title').val(group_name);
    $('#group_desc').val(group_desc);


    $('#group_id_modal').val(group_id);

    let groupHeadLastname = $(this).data('hd-lstname');
    let groupHeadFirstname = $(this).data('hd-fstname');
    let groupHeadName = groupHeadFirstname+" "+groupHeadLastname;
    let group_head_id = $(this).data('head-id');

    $('#groupHead').val(groupHeadName);

    $('#update_group_modal_head').select2({
        placeholder: groupHeadName
    });

    $('#update_group_modal_member_list').select2({
        placeholder: "Select Employees"
    });

    $('#update_group_modal_head').val(group_head_id);


    ////.log(rc_id);
    load_group_members(group_id);
});

$("body").on('click', '#btn_update_group_cancel', function (){

    $('#update_group_modal_head').val(null).trigger('change');

});

$("body").on("click", "#group_modal_table_updated_group", function () {
    var memberList = [];

    var update_group_modal_head = $('#update_group_modal_head').val();

    var group_id_modal = $('#group_id_modal').val();
    var update_modal_group_title = $('#group_title').val();
    var update_modal_group_desc = $('#group_desc').val();

    $('#update_group_modal_member_list :selected').each(function(i, selected) {
        memberList[i] = $(selected).val();
    });

    //.log(update_group_modal_head);

    $.ajax({
		url: bpath + 'admin/group/add/update/members',
		type: "POST",
		data: {
			_token: _token,
			memberList: memberList,
			update_group_modal_head: update_group_modal_head,
			group_id_modal: group_id_modal,
			update_modal_group_title: update_modal_group_title,
			update_modal_group_desc: update_modal_group_desc,

		},
		success: function(data) {
            var data = JSON.parse(data);
            ////.log(data.head);
            __notif_load_data(__basepath + "/");
            load_group_members(group_id_modal);
            load_group('');
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#update_group_modal_members_head"));
            mdl.hide();

            $('#update_group_modal_head').val(null).trigger('change');
            $('#update_group_modal_member_list').val(null).trigger('change');

		}

		});
});

function load_group_members(group_id) {
    $.ajax({
		url: bpath + 'admin/group/load/members',
		type: "POST",
		data: {
			_token: _token,
			group_id: group_id,

		},
		success: function(data) {
            tbldata_group_members.clear().draw();
				/***/
				var data = JSON.parse(data);
                var getgroup_name = data['getgroup_name'];
                var getgroup_desc = data['getgroup_desc'];
                $('#update_modal_group_title').val(data[1]);
                $('#update_modal_group_desc').val(data[2]);

				if(data[0].length > 0) {
					for(var i=0;i<data[0].length;i++) {
							/***/
							var id = data[0][i]['id'];
							var name = data[0][i]['name'];


                            var cd = "";
							/***/

								cd = '' +
						                '<tr >' +

						                    '<td class="group_member_id">' +
                                                    id+
						                    '</td>' +

                                            '<td>' +
                                                    name+
						                    '</td>' +

                                            '<td>' +
                                                '<div class="flex justify-center items-center">'+
                                                    '<div class="btn-group" role="group" aria-label="Basic outlined example">'+
                                                        '<button type="button" class="btn btn-outline-secondary group_member_deleterow"><i class="fa fa-trash text-danger"></i></button>'+
                                                    '</div>'+
                                                '</div>'+
						                    '</td>' +

						                '</tr>' +
								'';

								tbldata_group_members.row.add($(cd)).draw();


							/***/

					}

                    ////.log( id );
				}

		}

		});

}

$("body").on("click", ".group_deleterow", function (ev) {
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

            //var tablename = $(this).closest('table').DataTable();
            tbldata_group
                .row($(this)
                .parents('tr'))
                .remove()
                .draw();

            var _this = $(this).closest('tr');
            group_id = _this.find('.group_id').text();

            //.log(group_id);
            $.ajax({
                url: "group/remove",
                type: "POST",
                data: {
                    _token:_token,
                    type: 1,
                    group_id: group_id,
                },
                cache: false,
                success: function (data) {
                    ////.log(data);
                    var data = JSON.parse(data);
                    __notif_load_data(__basepath + "/");
                    load_group('');
                }
            });
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal("Cancelled", "Your file is safe :)", "error");
        }
    })
});

$("body").on("click", ".group_member_deleterow", function (ev) {
    ev.preventDefault();
    var urlToRedirect = ev.currentTarget.getAttribute('href'); //use currentTarget because the click may be on the nested i tag and not a tag causing the href to be empty

            //var tablename = $(this).closest('table').DataTable();
            tbldata_group_members
                .row($(this)
                .parents('tr'))
                .remove()
                .draw();

            var _this = $(this).closest('tr');
            group_member_id = _this.find('.group_member_id').text();
            group_id = $('#group_id_modal').val();

            //.log(group_id);
            $.ajax({
                url: "group/member/remove",
                type: "POST",
                data: {
                    _token:_token,
                    type: 1,
                    group_member_id: group_member_id,
                    group_id: group_id,
                },
                cache: false,
                success: function (data) {
                    ////.log(data);
                    var data = JSON.parse(data);
                    __notif_load_data(__basepath + "/");
                    load_group_members(group_id);
                }
            });

});



