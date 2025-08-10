$(document).ready(function() {

    bpath = __basepath + "/";

    load_datatable();

    load_employee('');
});
var  _token = $('meta[name="csrf-token"]').attr('content');
var tbldata_users;
var tbldata_user_priv;



function load_datatable() {

	try{
		/***/
		tbldata_users = $('#dt__users').DataTable({
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
                    { className: "dt-head-center", targets: [ 0 ], "orderable": false },
                ],

		});

        tbldata_user_priv = $('#dt__user_priv').DataTable({
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
		    "iDisplayLength": 50,
		    "aaSorting": [],
            columnDefs:
            [

                { className: "dt-head-center", targets: [ 1,2,3,4,5,6,7 ], "orderable": false },
            ],

		});

		/***/
	}catch(err){  }
}

function load_employee(user_id) {
    showLoading();
    $.ajax({
		url: bpath + 'admin/user/load',
		type: "POST",
		data: {
			_token: _token,
			user_id: user_id,
		},
		success: function(data) {
            tbldata_users.clear().draw();
				/***/
				var data = JSON.parse(data);
                if(data.length > 0) {
					for(var i=0;i<data.length;i++) {

							/***/
							var id = data[i]['id'];
							var name = data[i]['name'];
							var sex = data[i]['sex'];
							var last_seen = data[i]['last_seen'];
							var read = 1;

                            var cd = "";
							/***/

								cd = '' +
						                '<tr >' +

                                            '<td class="w-auto">' +

                                            '<div class="flex justify-center items-center" role="group"> <input class="form-check-input user_check[] w-5 h-5" name="user_check" type="checkbox" value="'+id+'" id="user_check[]" ></div>'+

                                            '</td>' +

                                            '<td  class="user_id">' +
                                                    id+
                                            '</td>' +

						                    '<td>' +
                                                    name+
						                    '</td>' +
                                            '<td>' +
                                                    sex+
                                            '</td>' +

                                            '<td>' +
                                                last_seen+
						                    '</td>' +

                                            '<td class="w-auto">' +
                                                '<div class="flex justify-center items-center" role="group" aria-label="Basic outlined example">'+
                                                    '<button type="button" class="btn btn-outline-secondary flex items-center mr-2 user_priv_table_updated" ><i class="fa fa-edit text-success"></i></button>'+
                                                '</div>'+

						                    '</td>' +

						                '</tr>' +
								'';

								tbldata_users.row.add($(cd)).draw();


							/***/

					}
                    ////.log( id );
				}
                hideLoading();
		}

		});
}

function load_user_priv(user_id){

    showLoading();

    $.ajax({
		url: bpath + 'admin/user/priv/load',
		type: "POST",
		data: {
			_token: _token,
			user_id: user_id,
		},
		success: function(data) {
            tbldata_user_priv.clear().draw();
				/***/
				var data = JSON.parse(data);
                ////.log(data);

                if(data.length > 0) {
					for(var i=0;i<data.length;i++) {

							/***/
							var link = data[i]['link'];
							var module_id = data[i]['module_id'];
                            var module_name = data[i]['module_name'];
							var user_id = data[i]['user_id'];
							var read = data[i]['read'];
							var write = data[i]['write'];
							var create = data[i]['create'];
							var dtdelete = data[i]['delete'];
							var dtimport = data[i]['import'];
							var dtexport = data[i]['export'];
							var dtprint = data[i]['print'];
							var link_permission = '';

							if (module_name)
                            {
                                link_permission = module_name;
                            }else {
                                link_permission = link;
                            }




                            var cd = "";
							/***/

								cd = '' +
						                '<tr >' +

                                            '<td  class="user_id">' +
                                                // '<div class="input-group flex-1">' +
                                                //     '<input id="selectall_link_permission" name="selectall_link_permission" class="form-check-input selectall_link_permission w-5 h-5" type="checkbox" value="" >' +
                                                //     '<div><label class="pl-5" for="selectall_link_permission">'+link_permission+'</label></div>' +
                                                // '</div>' +
                                                link_permission+
                                            '</td>' +

						                    '<td class="w-auto">' +
                                                '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_read[] w-5 h-5" name="cb_read" type="checkbox" value="'+module_id+'" id="cb_read[]" '+  ( read == 1 ? " checked" : "") +'></div>'+
						                    '</td>' +

                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_write[] w-5 h-5" name="cb_write" type="checkbox" value="'+module_id+'" id="cb_write[]" '+  ( write == 1 ? " checked" : "") +'></div>'+

						                    '</td>' +


                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_create[] w-5 h-5" name="cb_create" type="checkbox" value="'+module_id+'" id="cb_create[]" '+  ( create == 1 ? " checked" : "") +'></div>'+

						                    '</td>' +


                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_dtdelete[] w-5 h-5" name="cb_dtdelete" type="checkbox" value="'+module_id+'" id="cb_dtdelete[]" '+  ( dtdelete == 1 ? " checked" : "") +'></div>'+

						                    '</td>' +


                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_dtimport[] w-5 h-5" name="cb_dtimport" type="checkbox" value="'+module_id+'" id="cb_dtimport[]" '+  ( dtimport == 1 ? " checked" : "") +'></div>'+

						                    '</td>' +


                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_dtexport[] w-5 h-5" name="cb_dtexport" type="checkbox" value="'+module_id+'" id="cb_dtexport[]" '+  ( dtexport == 1 ? " checked" : "") +'></div>'+
						                    '</td>' +


                                            '<td class="w-auto">' +
                                            '<div class="flex justify-center items-center" role="group"><input class="form-check-input cb_dtprint[] w-5 h-5" name="cb_dtprint" type="checkbox" value="'+module_id+'" id="cb_dtprint[]" '+  ( dtprint == 1 ? " checked" : "") +'></div>'+
						                    '</td>' +

						                '</tr>' +
								'';

								tbldata_user_priv.row.add($(cd)).draw();


							/***/

					}

                    ////.log( id );
				}
                hideLoading();
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#user_priv_modal"));
                mdl.toggle();
		}

		});
}



$("body").on("click", ".user_priv_table_updated", function () {
    var _this = $(this).closest('tr');
    var user_id = _this.find('.user_id').text();
    $('#user_priv_id_modal').val(user_id);

    ////.log(user_id);
    if(user_id == ""){
        load_user_priv("");
    }else{
        load_user_priv(user_id);
    }

});

$("body").on("click", "#update_user_priv_modal_save", function () {

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#user_priv_modal"));
    mdl.hide();

    showLoading();

    var readList = [];
    var writeList = [];
    var createList = [];
    var dtdeleteList = [];
    var dtimportList = [];
    var dtexportList = [];
    var dtprintList = [];
    var multiple_user = [];
    var user_id = $('#user_priv_id_modal').val();

    var cb_reads = document.getElementsByName('cb_read');
    for(var i = 0; i<cb_reads.length; i++){
        if(cb_reads[i].checked === true){
            ////.log(cb_reads[i].value);
            readList.push(cb_reads[i].value);
        }

    }


    var cb_write = document.getElementsByName('cb_write');
    for(var i = 0; i<cb_write.length; i++){
        if(cb_write[i].checked === true){
            ////.log(cb_write[i].value);
            writeList.push(cb_write[i].value);
        }

    }

    var cb_create = document.getElementsByName('cb_create');
    for(var i = 0; i<cb_create.length; i++){
        if(cb_create[i].checked === true){
            ////.log(cb_write[i].value);
            createList.push(cb_create[i].value);
        }

    }

    var cb_dtdelete = document.getElementsByName('cb_dtdelete');
    for(var i = 0; i<cb_dtdelete.length; i++){
        if(cb_dtdelete[i].checked === true){
            ////.log(cb_write[i].value);
            dtdeleteList.push(cb_dtdelete[i].value);
        }

    }

    var cb_dtimport = document.getElementsByName('cb_dtimport');
    for(var i = 0; i<cb_dtimport.length; i++){
        if(cb_dtimport[i].checked === true){
            ////.log(cb_write[i].value);
            dtimportList.push(cb_dtimport[i].value);
        }

    }

    var cb_dtexport = document.getElementsByName('cb_dtexport');
    for(var i = 0; i<cb_dtexport.length; i++){
        if(cb_dtexport[i].checked === true){
            ////.log(cb_write[i].value);
            dtexportList.push(cb_dtexport[i].value);
        }

    }

    var cb_dtprint = document.getElementsByName('cb_dtprint');
    for(var i = 0; i<cb_dtprint.length; i++){
        if(cb_dtprint[i].checked === true){
            ////.log(cb_write[i].value);
            dtprintList.push(cb_dtprint[i].value);
        }

    }

    var user_check = document.getElementsByName('user_check');
    for(var i = 0; i<user_check.length; i++){
        if(user_check[i].checked === true){
            ////.log(cb_reads[i].value);
            multiple_user.push(user_check[i].value);
        }

    }

    ////.log(multiple_user);

    $.ajax({
		url: bpath + 'admin/user/priv/update',
		type: "POST",
		data: {

			_token: _token,
			user_id: user_id,
			readList: readList,
			writeList: writeList,
			createList: createList,
			dtdeleteList: dtdeleteList,
			dtimportList: dtimportList,
			dtexportList: dtexportList,
			dtprintList: dtprintList,
			multiple_user: multiple_user,

		},
		success: function(data) {
            var data = JSON.parse(data);

            __notif_load_data(__basepath + "/");
            $('div input').prop('checked', false);



            hideLoading();
		}

		});
});


$("body").on("click", "#update_user_priv_modal_save_reload_priv", function () {

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#user_priv_modal_reload_priv"));
    mdl.hide();
    var importantList = [];
    var user_id = $('#user_priv_id_modal_reload_priv').val();

    var cb_important = document.getElementsByName('cb_important');
    for(var i = 0; i<cb_important.length; i++){
        if(cb_important[i].checked == true){
            ////.log(cb_reads[i].value);
            importantList.push(cb_important[i].value);
        }

    }
    $.ajax({
		url: bpath + 'admin/user/priv/update/reload',
		type: "POST",
		data: {

			_token: _token,
			user_id: user_id,
			importantList: importantList,
		},
		success: function(data) {
            var data = JSON.parse(data);
            ////.log(data.data);
            __notif_load_data(__basepath + "/");

            $("#dt__user_priv_modal_reload_priv").load(location.href + " #dt__user_priv_modal_reload_priv");



		}

		});
    ////.log(importantList);
});



$('.selectall').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=user_check]').prop('checked', true);
    } else {
        $('div input[name=user_check]').prop('checked', false);
    }
});

$('.selectall_Read').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_read]').prop('checked', true);
    } else {
        $('div input[name=cb_read]').prop('checked', false);
    }
});

$('.selectall_Write').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_write]').prop('checked', true);
    } else {
        $('div input[name=cb_write]').prop('checked', false);
    }
});

$('.selectall_Create').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_create]').prop('checked', true);
    } else {
        $('div input[name=cb_create]').prop('checked', false);
    }
});

$('.selectall_Delete').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_dtdelete]').prop('checked', true);
    } else {
        $('div input[name=cb_dtdelete]').prop('checked', false);
    }
});

$('.selectall_Import').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_dtimport]').prop('checked', true);
    } else {
        $('div input[name=cb_dtimport]').prop('checked', false);
    }
});

$('.selectall_Export').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_dtexport]').prop('checked', true);
    } else {
        $('div input[name=cb_dtexport]').prop('checked', false);
    }
});

$('.selectall_Print').click(function() {
    if ($(this).is(':checked')) {
        $('div input[name=cb_dtprint]').prop('checked', true);
    } else {
        $('div input[name=cb_dtprint]').prop('checked', false);
    }
});


