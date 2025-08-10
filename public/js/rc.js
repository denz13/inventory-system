$(document).ready(function() {
    $('.js-example-basic-single').select2();

    const delete_rc = tailwind.Modal.getInstance(document.querySelector("#delete_rc"));
    const change_head = tailwind.Modal.getInstance(document.querySelector("#rc_change_head"));
    const add_mem = tailwind.Modal.getInstance(document.querySelector("#rc_add_mem"));
    const edit_rc = tailwind.Modal.getInstance(document.querySelector("#edit_res_cen"));

    // ===== CSRF
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function load_heads() {
        $.ajax({
            url: "/admin/rc/load_head",
            type: "GET",
            dataType: "json",
            success: function (response) {
                $('#head_user').empty();
                $('#head_user').append('<option disabled selected>Please select</option>');
                $.each(response, function(index, row) { 
                    $('#head_user').append('<option value="'+row.employee+'">'+row.firstname+' '+row.middlename+' '+row.lastname+'</option>');
                });
                $('#add_mem_val').empty();
                $('#add_mem_val').append('<option disabled selected>Please select</option>');
                $.each(response, function(index, row) { 
                    $('#add_mem_val').append('<option value="'+row.employee+'">'+row.firstname+' '+row.middlename+' '+row.lastname+'</option>');
                });
                $('#new_head').empty();
                $('#new_head').append('<option disabled selected>Please select</option>');
                $.each(response, function(index, row) { 
                    $('#new_head').append('<option value="'+row.employee+'">'+row.firstname+' '+row.middlename+' '+row.lastname+'</option>');
                });
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }
    load_heads();

    function load_rc(search, page) {
        $.ajax({
            url: "/admin/rc/load_rc",
            type: "POST",
            dataType: "json",
            data: {search: search, page: page},
            success: function (response) {
                $('#rc_tbody').empty();
                $('#rc_tbody').html(response.html);
                $('#rc_summary').html(response.summary);

                const previousPageButton = $('#rc_prev');
                const nextPageButton = $('#rc_next');
                if (response.users.current_page === 1) {
                    previousPageButton.prop('disabled', true);
                } else {
                    previousPageButton.prop('disabled', false);
                }
                if (response.users.current_page === response.users.last_page) {
                    nextPageButton.prop('disabled', true);
                } else {
                    nextPageButton.prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }

    let rc_page = 1;
    load_rc($('#rc_search').val(), rc_page);
    $('#rc_prev').click(function(){
        if (rc_page > 1) {
            rc_page--;
            load_rc($('#rc_search').val(), rc_page);
        }
    });
    $('#rc_next').click(function() {
        rc_page++;
        load_rc($('#rc_search').val(), rc_page);
    });
    var timeout;
    $('#rc_search').keyup(function(){
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            load_rc($('#rc_search').val(), rc_page);
        }, 500);
    });

    $('#rc_tbody').on('click', '.rc_delete', function() {
        var id = $(this).data('id');
        $('#rc_to_delete').val(id);
        delete_rc.show();
    });
    $('#delete_rc_btn').click(function(){
        var id =  $('#rc_to_delete').val();
        $.ajax({
            url: "/admin/rc/delete_rc",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                if (response == 'goods') {
                    delete_rc.hide();
                    load_rc($('#rc_search').val(), rc_page);
                    __notif_show(1, 'Success', 'Successfully deleted the Responsibility Center!');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
    $('#rc_tbody').on('click', '.rc_change', function() {
        var id = $(this).data('id');
        $('#rc_to_change').val(id);
        change_head.show();
    });
    $('#change_head_btn').click(function(){
        var id = $('#rc_to_change').val();
        var head = $('#head_user').val();

        if (id == '' || head == '' || head == null) {
            __notif_show(-1, 'Empty', 'Please choose user to become head.');
        } else {
            $.ajax({
                url: "/admin/rc/change_head",
                type: "POST",
                dataType: "json",
                data: {id: id, head: head},
                success: function (response) {
                    if (response == 'goods') {
                        change_head.hide();
                        load_rc($('#rc_search').val(), rc_page);
                        __notif_show(1, 'Success', 'Successfully change the head!');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    let mem_page = 1;
    function load_members(id, search ,page) {
        $.ajax({
            url: "/admin/rc/load_members",
            type: "POST",
            dataType: "json",
            data: {id: id, search: search, page: page},
            beforeSend: function() {
                $('#mem_tbody').html(`<tr>
                        <td colspan="2" class="text-center">
                            Loading <i class=" ml-1 fa-solid fa-spinner fa-spin"></i>
                        </td>
                    </tr>`);
                $('#mem_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            },
            success: function (response) {
                $('#mem_tbody').html(response.html);
                $('#mem_summary').html(response.summary);

                const previousPageButton = $('#mem_prev');
                const nextPageButton = $('#mem_next');
                if (response.users.current_page === 1) {
                    previousPageButton.prop('disabled', true);
                } else {
                    previousPageButton.prop('disabled', false);
                }
                if (response.users.current_page === response.users.last_page) {
                    nextPageButton.prop('disabled', true);
                } else {
                    nextPageButton.prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }
    $('#rc_tbody').on('click', '.rc_add_mem', function() {
        var id = $(this).data('id');
        $('#rc_to_add').val(id);
        add_mem.show();
        load_members(id, $('#mem_search').val(), mem_page);
    });
    $('#rc_tbody').on('click', '.rc_edit', function() {
        var id = $(this).data('id');
        var rc = $(this).data('rc');
        var desc = $(this).data('desc');
        $('#rc_to_edit').val(id);
        $('#edit_respon').val(rc);
        $('#edit_desc').val(desc);
        edit_rc.show();
    });
    $('#save_edit_res').click(function(){
        var id = $('#rc_to_edit').val();
        var res = $('#edit_respon').val();
        var desc = $('#edit_desc').val();

        if(res == '') {
            __notif_show(-1, 'Empty', 'Please input responsibility center.');
        } else {
            $.ajax({
                url: "/admin/rc/edit_rc",
                type: "POST",
                dataType: "json",
                data: {res: res, id: id, desc: desc},
                success: function (response) {
                    if (response == 'goods') {
                        load_rc($('#rc_search').val(), rc_page);
                        edit_rc.hide();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
    $('#mem_prev').click(function(){
        if (mem_page > 1) {
            mem_page--;
            load_members($('#rc_to_add').val(), $('#mem_search').val(), mem_page);
        }
    });
    $('#mem_next').click(function() {
        mem_page++;
        load_members($('#rc_to_add').val(), $('#mem_search').val(), mem_page);
    });
    var memtimeout;
    $('#mem_search').keyup(function(){
        clearTimeout(memtimeout);

        memtimeout = setTimeout(function() {
            load_members($('#rc_to_add').val(), $('#mem_search').val(), mem_page);
        }, 500);
    });

    $('#add_mem_btn').click(function() {
        var id = $('#rc_to_add').val();
        var user = $('#add_mem_val').val();

        if (user == null || user == '') {
            __notif_show(-1, 'Empty', 'Please choose user to become member.');
        } else {
            $.ajax({
                url: "/admin/rc/addmem_rc",
                type: "POST",
                dataType: "json",
                data: {id:id, user: user},
                success: function (response) {
                    $('#mem_search').val('')
                    if (response == 'goods') {
                        load_members($('#rc_to_add').val(), $('#mem_search').val(), 1);
                        __notif_show(1, 'Success', 'Successfully added a member!');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('#mem_tbody').on('click', '.dlt_mem', function() {
        var id = $(this).data('id');
        
        $.ajax({
            url: "/admin/rc/removemem",
            type: "POST",
            dataType: "json",
            data: {id:id},
            success: function (response) {
                $('#mem_search').val('')
                if (response == 'goods') {
                    load_members($('#rc_to_add').val(), $('#mem_search').val(), 1);
                    __notif_show(1, 'Success', 'Successfully removed a member!');
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('#save_new_res').click(function() {
        var res = $('#new_respon').val();
        var head = $('#new_head').val();
        var desc = $('#new_desc').val();

        if(res == '') {
            __notif_show(-1, 'Empty', 'Please input responsibility center.');
        } else {
            $.ajax({
                url: "/admin/rc/add_new_rc",
                type: "POST",
                dataType: "json",
                data: {res: res, head: head, desc: desc},
                success: function (response) {
                    if (response == 'goods') {
                        $('#new_respon').val('');
                        $('#new_head').val('');
                        $('#new_desc').val('');
                        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#add_res_cen"));
                        myModal.hide();
                        load_rc($('#rc_search').val(), rc_page);
                    }else{
                        __notif_show(-1, 'RC is Already Exist.');
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
});