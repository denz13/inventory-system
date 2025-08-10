var  _token = $('meta[name="csrf-token"]').attr('content');
var forwardDocs_modal_emp_list;

$(document).ready(function (){

    bpath = __basepath + "/";

    load_Select2();
    forward_Documents();

});

$("body").on('click', '#btn_fowardDocs', function (){

    var trackNumber = $(this).data('trk-no');
    $('#forward_DocCode').val(trackNumber);

});

function load_Select2() {

    forwardDocs_modal_emp_list = $('.forward-select2-multiple').select2({
        placeholder: "",
        allowClear: true,
        closeOnSelect: false,});
}

function forward_Documents() {
    $("body").on('click','#btn_Forward', function () {

        let forwardToEmps = $('#forward_emp_List').val();
        let ass_from_type = $('#doc_forwardAs').find(":selected").attr('data-ass-type');
        let docID = $('#forward_DocCode').val();

        $.ajax({
            type: "POST",
            url: bpath + 'forward-docs',
            data: {
                _token: _token,
                docID:docID,
                empID:forwardToEmps,
                __from:ass_from_type,
            },
            success:function (response) {
                if (response.status === 200)
                {
                    __notif_load_data(__basepath + "/");
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#forward_Docs'));
                    mdl.hide();

                    docDetails(docID);

                    forwardDocs_modal_emp_list.val(null).trigger('change');

                }else {
                    __notif_load_data(__basepath + "/");
                }
            }
        });
    });
}

$("body").on('click', '#btn_Test', function (){

    // docDetails();

    var trackNumber = $('#forward_DocCode').val();

    var base_url = window.location.origin;
    var qrcode = new QRCode(document.getElementById("myQR"), {
        text: base_url +'/track/doctrack/'+trackNumber,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    $('#trackingNumber').val(trackNumber);

    //.log($('#trackingNumber').val());
});

$("body").on('click', '#btn_closeQRModal', function (){
    $('#myQR').empty();
});

