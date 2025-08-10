// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file
    FilePondPluginFileValidateSize,
);

const diploma_inputElement = document.querySelector('input[id="diploma"]');

const diploma_pond = FilePond.create((diploma_inputElement),
    {
        credits: false,
        maxTotalFileSize: "5MB",
        labelFileProcessingComplete: "Uploaded successfully",
        labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
        labelMaxTotalFileSize: 'Maximum total file size is {filesize}',

    });

diploma_pond.setOptions({
    server: {
        process: "/application/temp/diploma/upload",
        revert: "/application/temp/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function removeUploadedDiploma() {
    if (diploma_pond) {
        var files = diploma_pond.getFiles();
        if (files.length > 0) {
            diploma_pond.processFiles().then(() => {
                diploma_pond.removeFiles();
                // console.log('Removed');
            });
        }
    }
}
