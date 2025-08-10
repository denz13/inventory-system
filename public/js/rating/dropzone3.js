function showLoadingSaveData() {
    const btn = $("#hired_btn");
    btn.prop('disabled', true);
    btn.find('.normal-state').hide();
    btn.find('.loading-state').show();
    btn.find('.hireNotify_btn').text('Processing...');
}

function hideLoadingSaveData() {
    const btn = $("#hired_btn");
    btn.prop('disabled', false);
    btn.find('.normal-state').show();
    btn.find('.loading-state').hide();
    btn.find('.hireNotify_btn').text('Hire and Notify');
}

(function () {
    "use strict";

    Dropzone.autoDiscover = false;
    var _this = this;
    var filenamesArray = [];

    $(".dropzone").each(function () {
        _this = this;
        var hasUploadedFile = false; 

        var options = {
            parallelUploads: 9999,
            maxFiles: null,
            accept: function (file, done) {
                var allowedFileTypes = [
                    "application/msword", 
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                    "application/pdf", 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                    "application/vnd.ms-excel"
                ];
                if (!allowedFileTypes.includes(file.type)) {
                    alert("Invalid file type. Please upload a Word, PDF, or Excel document.");
                    this.removeFile(file); 
                } else if (file.size > 5 * 1024 * 1024) {
                    alert("File size exceeds 5MB. Please upload a smaller file.");
                    this.removeFile(file); 
                } else {
                    done();
                }
            },
            dictFileTooBig: "File is too big. Maximum file size: 5MB.",
            success: function (file, response) {
                if (response && response.imagePath) {
                    const filename = response.imagePath.split(',').pop();

                    filenamesArray = $("#hired_file").val() ? JSON.parse($("#hired_file").val()) : [];

                    filenamesArray.push(filename);
                    
                    $("#hired_file").val(JSON.stringify(filenamesArray));
                } else {
                    console.error("Image upload response did not contain an image path.");
                    hideLoadingSaveData();
                }
            },
            autoProcessQueue: false,
            addRemoveLinks: true,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            init: function () {
                var dz = this; 

                this.on("removedfile", function (file) {
                    hasUploadedFile = false;
                    console.log("File removed: " + file.name);
                });

                this.on("complete", function (file) {
                    if (file.xhr && file.xhr.status === 200) {
                        console.log("File uploaded successfully.");
                        $('#addFileBtn').click();
                    } else {
                        file.previewElement.addEventListener("click", function () {
                            dz.removeFile(file);
                            console.error("File upload failed for: " + file.name);
                        });
                    }
                });

                this.on("addedfile", function (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        file.previewElement.addEventListener("click", function () {
                            dz.removeFile(file);
                            console.log("File removed: " + file.name);
                        });
                    }
                });
            },
            url: '/rating/upload-attach-files', 
        };

        new Dropzone(this, options);
    });

    var dzInstances = $(".dropzone").map(function () {
        return Dropzone.forElement(this);
    }).get();
    
    dzInstances.forEach(function (dzInstance) {
        dzInstance.on("queuecomplete", function () {
            saveData(dzInstance);
        });
    });

    $("#hire_applicant_form").submit(function (e) {
        e.preventDefault();
    
        if (check_hireNotif_content()) {
            showLoadingSaveData();

            var dzInstances = $(".dropzone").map(function () {
                return Dropzone.forElement(this);
            }).get();
    
            if (dzInstances.some(dzInstance => dzInstance.getQueuedFiles().length > 0)) {
                dzInstances.forEach(dzInstance => dzInstance.processQueue());
            } else {
                saveData(null);
            }
        }
    });

})();

function saveData(dzInstance) {
    const fd = $("#hire_applicant_form");

    $.ajax({
        url: bpath + 'rating/hire-applicant',
        method: 'post',
        data: fd.serialize(),
        beforeSend: function(){
            showLoadingSaveData();
        },            
        success: function (response) {
            if (response.status == 200) {
                if (response.hire == 1) {
                    __notif_show(1, $('#applicant-name').text() + " is Registered as new Employee")
                    $('#hired_file, #hire_notif, #notifTitle').val(null);
                    fetched_rated_applicants(jobref_no, top_id, status_id);
                    load_activity_logs();
                    const notify_hire_Modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#hire_modal"));
                    notify_hire_Modal.hide();
                } else {
                    __notif_show(1, $('#applicant-name').text() + " is notified");
                    $('#hired_file, #hire_notif, #notifTitle').val(null);
                }

                _thisSelect();

                filenamesArray = [];

                if (dzInstance) {
                    dzInstance.removeAllFiles();
                }
            }
            
            hideLoadingSaveData();
        },
        error: function() {
            hideLoadingSaveData();
            __notif_show(3, "An error occurred. Please try again.");
        }
    });
}
