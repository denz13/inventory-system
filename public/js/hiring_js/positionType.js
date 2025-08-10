var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function () {
    action_function();
    fetchedPositionType();
    // alert('123')
});

function action_function(){
    $("body").on('click', '#btn_posType_modal', function () {
        $('#title').text('Add Position Type');
        $('#add_type_modal').text('Save');
    });
    $("#postionType_form").submit(function (e) { 
        e.preventDefault();
        
        const fd = new FormData(this);
        $.ajax({
            url: '/hiring/save-update/positoin-type',
            method: 'POST',
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
        success: function (res) {
            if(res.status == "save"){
                __notif_show( 1,"New Position Type Successfully");
                $('#postionType_form')[0].reset();
                $('#add_Pos_type_modal').hide();
                fetchedPositionType();
            }else{
                __notif_show( 1,"Position Updated Successfully");
                $('#postionType_form')[0].reset();
                $('#add_Pos_type_modal').hide();
                fetchedPositionType();
            }
        }
    });
    });
    $("body").on('click', '.editPosType', function () {
        var id = $(this).attr('id');
        var p_type = $(this).data('pt');
        var t_desc = $(this).data('ptd');

        // alert(id)

        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_Pos_type_modal'));
        mdl.show();
        
        $('#title').text('Update Position Type');
        $('#add_type_modal').text('Update');

        $('#typeID').val(id);
        $('#positionType').val(p_type);
        $('#type_desc').val(t_desc);
        


    });
    //DELETE POSITION TYPE
    $("body").on("click", ".delete_Position_category", function (ev) {
        ev.preventDefault();
    
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
                
                positionCategory_id = $(this).attr('id');
    
                // console.log(criteria_id);
                $.ajax({
                    url: '/hiring/delete-position-category',
                    method: 'POST',
                    data: {
                        _token:_token,
                        positionCategory_id: positionCategory_id,
                    },
                    cache: false,
                    success: function (data) {
                        //console.log(data);
                        var status = data.status;
                        // alert(status)
                        if(status == 200){
                            swal("Deleted!", "Position Category deleted Successfully.", "success");
                            __notif_show( 1,"Successfully Deleted!");
                            fetchedPositionType();
                        }else{
                            swal("Warning!", "Deleted Unsuccessful.", "warning");
                        }
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        })
    });
}
function fetchedPositionType(){
    $.ajax({
        url: '/hiring/fetched/position-type',
        type: "get",
        data: {
            _token: _token,
        },
        success: function(data){
            $('#positioType_div').html(data);
        }
    });
}