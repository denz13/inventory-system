(function () {
    "use strict";

    // Disable auto-discover of Dropzone elements
    Dropzone.autoDiscover = false;

    // Initialize Dropzone for elements with the "dropzone" class
    $(".dropzone").each(function () {
        var _this = this;
        var hasUploadedFile = false; // Flag to track if a file has been uploaded

        var options = {
            accept: function accept(file, done) {
                if (hasUploadedFile) {
                    alert("You can only upload one file at a time.");
                    this.removeFile(file); // Remove the additional file
                } else {
                    hasUploadedFile = true; // Set the flag to indicate a file has been uploaded
                  //  console.log("asdasdasd "+file);

                    done();
                }

            },
            success: function (file, response) {
                if (response && response.imagePath) {
                    // Set the value of the res_photo input field with the image path

                    const filename = response.imagePath.split('/').pop();

                    // Set the value of the res_photo input field with the filename
                    $("#res_photo").val(filename);
                    this.removeAllFiles();

                    __notif_show(1, 'SUCCESS', 'Image uploaded successfully. Filename:", filename');
                } else {

                    __notif_show(-1, 'ERROR', 'Image upload response did not contain image path.');
                }
            },
            autoProcessQueue: false,
            addRemoveLinks: true,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},// Enable remove links for uploaded files
            init: function () {
                this.on("maxfilesexceeded", function (file) {
                    alert("No more files, please!");
                    this.removeFile(file); // Remove the additional file
                });

                this.on("removedfile", function (file) {
                    hasUploadedFile = false; // Reset the flag when a file is removed

                });

                this.on("complete", function (file) {
                    // Check if the file upload was successful
                    if (file.xhr.status === 200) {

                       $('#addReoucesBtn').click();

                    }

                });
            },
            // Set the URL for file upload
            url: '/schedule/My-uploadfiles', // Replace with your server-side route

            // Define other Dropzone options as needed
            // ...

        };


        var dz = new Dropzone(this, options);
        $("#verifybtn").on("click", function () {
            dz.processQueue();
        });

    });

})();



