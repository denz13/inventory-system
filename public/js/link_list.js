var  _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_link_list;

$(document).ready(function() {

    bpath = __basepath + "/";

    load_datatable();

    load_all_links();

    toggle_Modal();

});


function load_datatable() {

    try{
        /***/
        tbl_data_link_list = $('#dt__link_list').DataTable({
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

        /***/
    }catch(err){  }
}

function load_all_links() {

        $.ajax({
            url: bpath + 'admin/get-list',
            type: "POST",
            data: {
                _token: _token,
            },
            success: function(data) {

                tbl_data_link_list.clear().draw();
                /***/
                var data = JSON.parse(data);

                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {

                        /***/
                        var id = data[i]['id'];
                        var name = data[i]['module_name'];
                        var link = data[i]['link'];

                        var cd = "";
                        /***/

                        cd = '' +
                            '<tr >' +

                            '<td>' +
                                id+
                            '</td>' +

                            '<td>' +
                                name+
                            '</td>' +

                            '<td>' +
                                link+
                            '</td>' +


                            '<td class="w-auto">' +
                            '<div class="flex justify-center items-center">'+
                                '<button id="btn_open_modal_update_links" type="button" class="btn btn-outline-secondary flex items-center mr-2" data-id="'+id+'" data-name="'+name+'" data-link="'+link+'" data-tw-toggle="modal" data-tw-target="#update_link_list_modal"><i class="fa fa-edit text-success"></i></button>'+
                            '</div>'+
                            '</td>' +

                            '</tr>' +
                            '';

                        tbl_data_link_list.row.add($(cd)).draw();


                        /***/

                    }

                }
            }

        });
}

function toggle_Modal()
{
    $("body").on('click', '#btn_open_modal_update_links', function (){


        $('#up_link_id').val($(this).data('id'));
        $('#up_module_name').val($(this).data('name'));
        $('#up_link').val($(this).data('link'));

    });

    $("body").on('click', '#update_links', function (e){
        e.preventDefault();

        let module_name = $('#up_module_name').val();
        let link_id = $('#up_link_id').val();

        $.ajax({
            url: bpath + 'admin/update-list',
            type: "POST",
            data: {
                _token: _token,
                module_name:module_name,
                link_id:link_id,
            },
            success: function(data) {
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_link_list_modal'));
                mdl.hide();
                load_all_links();
            }
        });

    });
}
