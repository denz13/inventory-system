
$(document).ready(function () {

    bpath = __basepath + "/";

    load_datatable();

    /*data_load();*/
    data_load_list_members();
    $(function () {
        //$('#datetimepicker1').datetimepicker();
    });

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36251023-1']);
    _gaq.push(['_setDomainName', 'jqueryscript.net']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

});



function load_datatable() {

    try {
        /***/
        tbldata_members = $('#dt__members').DataTable({
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
        });

        /***/
    } catch (err) { }
}


function data_load_list_members() {
    try {

        let agency = getUrlParameter('id');

        $.ajax({
            url: bpath + 'agency/memberlistdata',
            type: "GET",
            data: {
                _token: _token,
                cid: agency,
            },
            success: function (response) {
                try {
                    tbldata_members.clear().draw();
                    /***/
                    var data = JSON.parse(response);
                    var tcont = "";
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            try {
                                /***/
                                var id = data[i]['id'];
                                var name = data[i]['name'];
                                var email = data[i]['email'];
                                var contact_number = data[i]['contact_number'];
                                var img = data[i]['img'];
                                var cd = "";
                                var link = bpath + "user/profile?id=" + id;
                                /***/
                                var canAdd = 0;
                                var canEdit = parseInt(data[i]['canEdit']);
                                var canDelete = parseInt(data[i]['canDelete']);
                                var canAddMember = parseInt(data[i]['canAddMember']);
                                var canRemoveMember = parseInt(data[i]['canRemoveMember']);
                                var canManage = parseInt(data[i]['canManage']);
                                /***/
                                var c_member_remove = '';
                                if (canRemoveMember > 0) {
                                    c_member_remove = '' +
                                        '<a class="flex items-end mr-3 btn_action_2" href="javascript:;" data-type="action" data-target="s_member_remove" data-id="' + id + '"> <i class="fas fa-minus-circle fs_c_1 text-danger"></i> </a>' +
                                        '';
                                }
                                var c_member_edit = '';
                                if (canManage > 0) {
                                    c_member_edit = '' +
                                        '<a class="flex items-end mr-3 btn_action_2" href="javascript:;" data-type="action" data-target="s_member_edit" data-id="' + id + '"> <i class="fas fa-user-edit fs_c_1 text-slate-400"></i> </a>' +
                                        '';
                                }
                                /***/
                                if (name.trim() != "") {

                                    cd = '' +
                                        '<tr class="inbox__item intro-x">' +
                                        '<td>' +
                                        '<div class="w-12 h-12 flex-none image-fit">' +
                                        '	<img alt="" class="rounded-full" src="' + img + '">' +
                                        '</div>' +
                                        '' +
                                        '</td>' +
                                        '<td>' +
                                        '<a href="' + link + '" class="font-medium whitespace-nowrap">' + name + '</a>' +
                                        '<div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">' + email + '</div>' +
                                        '</td>' +
                                        '<td class="">' +
                                        '<div class="flex justify-center items-end text_right_1">' +
                                        c_member_edit + c_member_remove +
                                        '</div>' +
                                        '</td>' +
                                        '</tr>' +
                                        '';
                                    tbldata_members.row.add($(cd)).draw();

                                }
                                /***/
                            } catch (err) { }
                        }
                        bind_events_2();
                    }
                    /***/
                } catch (err) { }
            },
            error: function (response) {
                try {
                    /*//.log(response);*/
                } catch (err) { }
            }

        });
    } catch (err) { }
}
