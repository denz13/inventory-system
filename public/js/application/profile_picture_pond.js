// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file

    // FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,

);

const profile_pic_inputElement = document.querySelector('input[id="profile_pic"]');

const profile_pic_pond = FilePond.create((profile_pic_inputElement),
    {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],

    });

profile_pic_pond.setOptions({
    server: {
        process: "/application/temp/profile/upload",
        revert: "/application/temp/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function removeUploadedProfile_pic() {
    if (profile_pic_pond) {
        var files = profile_pic_pond.getFiles();
        if (files.length > 0) {
            profile_pic_pond.processFiles().then(() => {
                profile_pic_pond.removeFiles();
                // console.log('Removed');
            });
        }
    }
}
