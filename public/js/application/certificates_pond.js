// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file
    FilePondPluginFileValidateSize,
);

const certificates_inputElement = document.querySelector('input[id="certificates"]');

const certificates_pond = FilePond.create((certificates_inputElement),
    {
        credits: false,
        maxTotalFileSize: "5MB",
        labelFileProcessingComplete: "Uploaded successfully",
        labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
        labelMaxTotalFileSize: 'Maximum total file size is {filesize}',

    });

certificates_pond.setOptions({
    server: {
        process: "/application/temp/certificate/upload",
        revert: "/application/temp/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function removeUploadedCert() {
    if (certificates_pond) {
        var files = certificates_pond.getFiles();
        if (files.length > 0) {
            certificates_pond.processFiles().then(() => {
                certificates_pond.removeFiles();
                // console.log('Removed');
            });
        }
    }
}
