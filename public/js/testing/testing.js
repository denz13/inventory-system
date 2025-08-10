
var  _token = $('meta[name="csrf-token"]').attr('content');

$(document ).ready(function() {
    // alert('123')
    onClick_testCategory();
    actionFunction();

  });

  function onClick_testCategory(){
    // Testing Part
    $("body").on('click', '#t_part', function(){
        // alert('t_part')
        $.ajax({
            url: '/testing/test-part',
            method: 'get',
            data: { _token: _token},
            success: function (data) {

             $('#test_div').html(data);
             $('#t_part').addClass('bg-primary text-white font-medium');
             $('#t_choice').removeClass('bg-primary text-white font-medium');
             $('#t_question').removeClass('bg-primary text-white font-medium');
             $('#testQ_type').removeClass('bg-primary text-white font-medium');
            }
        });
    });
     // Testing Question type
    $("body").on('click', '#testQ_type', function(){
        // alert('t_Type')
        $.ajax({
            url: '/testing/test-question-types',
            method: 'get',
            data: { _token: _token},
            success: function (data) {

             $('#test_div').html(data);

             $('#t_choice').removeClass('bg-primary text-white font-medium');
             $('#t_question').removeClass('bg-primary text-white font-medium');
             $('#t_part').removeClass('bg-primary text-white font-medium');
             $('#testQ_type').addClass('bg-primary text-white font-medium');

            }
        });
    });
     // Testing Question
    $("body").on('click', '#t_question', function(){
        // alert('t_question')
        $.ajax({
            url: '/testing/test-question',
            method: 'get',
            data: { _token: _token},
            success: function (data) {

             $('#test_div').html(data);

             $('#t_part').removeClass('bg-primary text-white font-medium');
             $('#testQ_type').removeClass('bg-primary text-white font-medium');
             $('#t_choice').removeClass('bg-primary text-white font-medium');
             $('#t_question').addClass('bg-primary text-white font-medium');

            }
        });
    });
     // Testing Choice
    $("body").on('click', '#t_choice', function(){
        // alert('t_choice')
        $.ajax({
            url: '/testing/test-choices',
            method: 'get',
            data: { _token: _token},
            success: function (data) {

             $('#test_div').html(data);
             $('#t_part').removeClass('bg-primary text-white font-medium');
             $('#testQ_type').removeClass('bg-primary text-white font-medium');
             $('#t_question').removeClass('bg-primary text-white font-medium');
             $('#t_choice').addClass('bg-primary text-white font-medium');

            }
        });
    });

  }

  function actionFunction(){
    $("body").on('click', '#addTest_part', function(){

        const add_mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#testPart_modal'));
        add_mdl.show();
    });
    $("#test_Part_form").submit(function(e){
        e.preventDefault();
        // alert('23')
        const fd = new FormData(this);

        $.ajax({
            url: '/testing/save-test-part',
            method: 'POST',
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (res) {
                // if(res.status == 200){

                //     __notif_show( 1,"Rated Successfully");
                //     $('#saveRate_form')[0].reset();
                //     dropdown();
                //     filterByPosition();
                //     $('#ApplicantPosition_select').select2().empty();
                //     $("#applicant").select2({
                //         placeholder: "Select a  Applicant",
                //         initSelection: function(element, callback) {
                //         }
                //     });
                // }
            }
        });

    });

  }
