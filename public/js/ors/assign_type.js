//ajax header
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(function(){
    setTablistActive();
});

function setTablistActive()
{
    $('.assign_tab_list').on('click',function(){

        $('.assign_tab_list').removeClass('btn btn-rounded btn-sm btn-primary-soft active');

        //check if the button is already click
        $(this).addClass('btn btn-rounded btn-sm btn-primary-soft active');

    });
}
