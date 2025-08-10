// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file
    FilePondPluginFileValidateSize,
);

const resume_inputElement = document.querySelector('input[id="resume_pond"]');

const resume_pond = FilePond.create((resume_inputElement),
    {
        credits: false,
        maxTotalFileSize: "5MB",
        labelFileProcessingComplete: "Uploaded successfully",
        labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
        labelMaxTotalFileSize: 'Maximum total file size is {filesize}',

    });

resume_pond.setOptions({
    server: {
        process: "/application/temp/tor/upload",
        revert: "/application/temp/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function removeUploaded_TOR() {
    if (resume_pond) {
        var files = resume_pond.getFiles();
        if (files.length > 0) {
            resume_pond.processFiles().then(() => {
                resume_pond.removeFiles();
                // console.log('Removed');
            });
        }
    }
}

