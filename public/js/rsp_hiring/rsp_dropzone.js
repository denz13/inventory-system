var myDropzone = {Dropzone:''};
var file = {Upload:''};
var temp_files = {Uploaded:[]};

$(function(){
    "use strict";
    dropzoneImageUploader('#dropzone_rsp');
});


function dropzoneImageUploader(id)
{
    //Prevent Dropzone from automatically attaching itself to all elements with class dropzone
    Dropzone.autoDiscover = false;

    myDropzone.Dropzone = new Dropzone(id, {
        url: "/rsp_hiring/store/applicant/send/document",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        autoProcessQueue: false, // Disable automatic processing
        parallelUploads: 5,// limit the file
        maxFilesize: 5, // Maximum file size in megabytes
        maxFiles: 5,
        acceptedFiles: "image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv", // Allowed file types
        dictRemoveFile: '<i class="fa-solid fa-xmark text-danger"></i>', // Use this to remove file
        addRemoveLinks: true,

            init: function () {

                this.on("addedfile", function (file) {
                    //hide the icon of the dropzone
                    hideIcon(file);

                    if(validateFileSize(file))
                    {
                        // Add the fade-in animation to the preview element
                        file.previewElement.classList.add("dz-file-preview");
                        var filenameElement = Dropzone.createElement("<p class='dz-filename'><span data-dz-name></span></p>");
                        file.previewElement.appendChild(filenameElement);
                        myDropzone.Dropzone.emit("thumbnail", file,changeIconShow(file));
                    } else
                    {
                        this.removeFile(file);
                    }

                    if (this.files.length > 5) {
                        // Display an alert
                        __notif_show(-1,"Maximum number of files exceeded. You can only upload a maximun of 5 files");
                        // Remove the excess file
                        this.removeFile(file);
                        return false; // Stop further processing
                    }
                });

                //handle the success when the file is uploaded successfully
                this.on("success",function (file,response)
                {
                    if( response.status === true)
                    {
                        temp_files.Uploaded.push(response.message);
                    }
                    //clear the message
                    response.message = {};
                });

                //handle the error upon the uploading of images
                this.on("error",function(file,response){
                    __notif_show(-1,"Error uploading file",file.name);
                });
            },
        });

        //click event to the remove file
        myDropzone.Dropzone.on("removedfile", function (file) {

        });
}

//Hide the icon for the success and error
function hideIcon(file)
{
    $(file.previewElement).find(".dz-error-mark").hide();
    $(file.previewElement).find(".dz-success-mark").hide();
}

/*Select the type of icon to display aside from image*/
function changeIconShow(file)
{
    let fileType = file.type;
    let image = '';


    if (fileType === "application/pdf") {

    image = '/dist/images/pdf.png';

    } else if (fileType === "application/msword" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // Word file (both .doc and .docx)
    image = '/dist/images/word.png';
    } else if(fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    {
    image = '/dist/images/excel.png';
    }

    return image;
}

//validate the filesize
function validateFileSize(file)
{
    if(file.size > 5 * 1024 * 1024)
    {
        __notif_show(-1,'','File limit is only 5 mb');

        return false;
    }

    return true;
}
