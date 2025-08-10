var  _token = $('meta[name="csrf-token"]').attr('content');
var desc_content = '';
var tc_id = '';
$(document).ready(function (){

    bpath = __basepath + "/";


ClassicEditor
.create( document.querySelector( '.editor_textarea' ) )
.then(editor => {desc_content = editor})
.catch( error => {
    console.error( error );
} );

});
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// ClassicEditor
// .create(document.querySelector( '.editor' ))
// .then(editor => {desc_content = editor})
// .catch((error) => {
//     console.error(error);
// });

$("body").on("click", "#update_terms_condition", function (ev) {

    //  console.log(desc_content.getData());
    tc_id = $('#tc_id').val();
    $.ajax({
        url: bpath + "others/update/terms-and-condition",
        type: "POST",
        data: {
            _token:_token,
            tc_id:tc_id,
            desc_content:desc_content.getData(),
        },
        cache: false,
        success: function(data) {

            var data = JSON.parse(data);
            console.log(data.load_content);
            $('#div_of_term_condition').empty();
            $('#div_of_term_condition').append(data.load_content['desc_content']);
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_content_term_condition'));
            mdl.hide();

        }
    });

});
