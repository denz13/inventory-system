// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file

    // FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,

);

const modal_set_imageUpload = document.querySelector('input[id="modal_set_imageUpload"]');

const imageUpload = FilePond.create((modal_set_imageUpload),
    {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],

    });

imageUpload.setOptions({
    server: {
        process: "/admin/temp/system/image/upload",
        revert: "/admin/temp/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function removeUploadedProfile_pic() {
    if (imageUpload) {
        var files = imageUpload.getFiles();
        if (files.length > 0) {
            imageUpload.processFiles().then(() => {
                imageUpload.removeFiles();
                // console.log('Removed');
            });
        }
    }
}
