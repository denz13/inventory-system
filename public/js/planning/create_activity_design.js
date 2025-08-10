import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(".editor").each(function () {
    const el = this;
    ClassicEditor.create(el).catch((error) => {
        console.error(error);
    });
});

