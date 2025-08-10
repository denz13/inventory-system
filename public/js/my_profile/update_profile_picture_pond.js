
function remove_Update_UploadedProfile_pic() {
    if (update_profile_pic_pond) {
        var files = update_profile_pic_pond.getFiles();
        if (files.length > 0) {
            update_profile_pic_pond.processFiles().then(() => {
                update_profile_pic_pond.removeFiles();
                // console.log('Removed');
            });
        }
    }
}

    function save_profile_picture(){

        // Register the plugin
    FilePond.registerPlugin(
        // validates the size of the file

        FilePondPluginImagePreview,
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType,
        FilePondPluginImageEdit,
        FilePondPluginImageExifOrientation,

    );

    const update_profile_pic_inputElement = document.querySelector('input[id="up_profile_pic"]');


    const update_profile_pic_pond = FilePond.create(update_profile_pic_inputElement, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',
        acceptedFileTypes: ['image/*'],

        // Enable client-side processing
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {

                // For example, if you want to simulate a delay before uploading the file:
                setTimeout(() => {
                    // Simulate successful upload
                    load(file);
                }, 1000);

            },
            revert: (uniqueFileId, load, error) => {

                // Add a method to handle removal of files
                // You can implement your logic to delete the file here
                // For example, you can show a confirmation dialog and proceed with deletion if confirmed

                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_profile_pic_mdl'));
                mdl.toggle();

                $('body').on('click', '.btn_delete_profile', function(){
                    // Implement your deletion logic here

                    // If the deletion is successful, call load()
                    load();

                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_profile_pic_mdl'));
                    mdl.hide();
                });

        },

        },

    });



    $('body').on('click', '#btn_save_profile_pic', function(){

        let this_button = $(this);
        const file = update_profile_pic_pond.getFile();
        let old_profile_pic = $('#current_profile_picture_value').val();

        if(file)
        {
            const formData = new FormData();
            formData.append('my_profile_pic', file.file);
            formData.append('old_profile_pic', old_profile_pic);

            // Send AJAX request using jQuery
            $.ajax({
                url: bpath + 'my/save/profile/picture',
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                beforeSend: function () {

                    this_button.html('Saving <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2"> <g fill="none" fill-rule="evenodd"> <g transform="translate(1 1)" stroke-width="4"> <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path> </g></g> </svg>');
                    this_button.prop('disabled', true);

                },
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    remove_uploaded_profile(update_profile_pic_pond);
                    __modal_hide('update_profile_picture_mdl');

                    // Show Swal alert before reloading the page
                    Swal.fire({
                        title: "Success!",
                        text: "Profile uploaded successfully!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Delay the page reload for 2 seconds (2000ms)
                    setTimeout(function() {
                        location.reload();
                    }, 1000);

                },
                complete: function(){

                    this_button.html('Save');
                    this_button.prop('disabled', false);

                },

            });

        }else
        {
            __notif_show(-1, "Warning", "Please upload image first!");
        }
    });




    $('body').on('click', '.bnt_upload_cancel', function(){

        remove_uploaded_profile(update_profile_pic_pond);

    });

    // $('#form_profile_picture').submit(function (event){
    //     event.preventDefault();

    //     var form = $(this);

    //     $.ajax({
    //         type: "POST",
    //         url: bpath + 'my/save/profile/picture',
    //         data: form.serialize(),
    //         success: function (response) {

    //             if(response.status == 200)
    //             {
    //                 __notif_show(1, "Success", "Profile picture updated successfully!");

    //                 load_profile_picture();
    //                 remove_Update_UploadedProfile_pic();

    //                 const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_profile_picture_mdl'));
    //                 modal.hide();


    //             } else {

    //                 __notif_show(-1, "Warning", "OOps! Something went wrong!");
    //             }
    //         }
    //     });
}

function remove_uploaded_profile(update_profile_pic_pond) {
    if (update_profile_pic_pond) {
        var files = update_profile_pic_pond.getFiles();
        if (files.length > 0) {
            update_profile_pic_pond.processFiles().then(() => {
                update_profile_pic_pond.removeFiles();
            });
        }
    }
}




//E-Signature Here
const e_signature_inputElement = document.querySelector('input[id="e_signature"]');
const e_sig_pond = FilePond.create((e_signature_inputElement), {

    credits: false,
    allowMultiple: false,
    allowFileTypeValidation: true,
    acceptedFileTypes: ['image/png'],

});

e_sig_pond.setOptions({
    server: {
        process: "/my/temp/e/signature/upload",
        revert: "/my/temp/e/signature/delete",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    },
});

function toggle_add_signature_mdl(){

    $('body').on('click', '#btn_add_e_signature', function (){

        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_e_signature_mdl'));
        mdl.toggle();

        __dropdown_close('#e_signature_dd_div');

    });

}

function save_e_signature(_token){

    $('#form_e_signature').submit(function (event){
        event.preventDefault();

        var form = $(this);

        $.ajax({
            type: "POST",
            url: bpath + 'my/save/e/signature',
            data: form.serialize(),
            success: function (response) {

                if(response.status == 200)
                {
                    __notif_show(1, "Success", "Electronic Signature added successfully!");


                    remove_added_e_signature();
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_e_signature_mdl'));
                    mdl.hide();

                    load_uploaded_signature(_token);

                } else {

                    __notif_show(-1, "Warning", "OOps! Something went wrong!");
                }
            }
        });
    });
}

function load_uploaded_signature(_token){

    $.ajax({
        type: "POST",
        url: bpath + 'my/load/e/signature',
        data: { _token },
        success: function (response) {
            if(response)
            {
                let data = JSON.parse(response);
                let e_signature = data['e_signature'];
                let e_signature_raw = data['e_signature_raw'];

                if(e_signature_raw)
                {
                    let html_data = '<a id="btn_add_e_signature" href="javascript:;" class="dropdown-item"><i class="fa-solid fa-pen-to-square text-success w-4 h-4 mr-2"></i> Update </a>';
                    $('#btn_add_update_signature').html(html_data);
                    $('#li_delete_e_signature').show();

                    $('#e_signature_label').text(e_signature_raw);
                    $('#e_signature_status').show();
                    $('#btn_delete_e_signature').show();

                }else
                {
                    let html_data = '<a id="btn_add_e_signature" href="javascript:;" class="dropdown-item"><i class="fa-solid fa-plus w-4 h-4 text-success mr-2"></i> Add </a>';
                    $('#btn_add_update_signature').html(html_data);
                    $('#li_delete_e_signature').hide();

                    $('#e_signature_label').text('No Signature Yet');
                    $('#e_signature_status').hide();
                    $('#btn_delete_e_signature').hide();

                }

                $('#old_e_signature_value').val(e_signature_raw.toString());
                $('#profile_e_signature').attr('src', e_signature);

            }
        }
    });
}

function delete_uploaded_e_signature(_token){

    $('body').on('click', '#btn_delete_e_signature', function (){

        __dropdown_close('#e_signature_dd_div');

        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_e_sig_mdl'));
        mdl.toggle();
    });

    $('body').on('click', '#btn_delete_e_sig_mdl', function (){
        $.ajax({
            type: "POST",
            url: bpath + 'my/delete/e/signature',
            data: { _token },
            success: function (response) {
                if (response)
                {
                    let data = JSON.parse(response);
                    let status = data['status'];
                    if(status == 200)
                    {
                        load_uploaded_signature(_token);

                        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_e_sig_mdl'));
                        mdl.hide();
                    }
                }
            }
        });
    });

}

function remove_added_e_signature() {
    if (e_sig_pond) {
        var files = e_sig_pond.getFiles();
        if (files.length > 0) {
            e_sig_pond.processFiles().then(() => {
                e_sig_pond.removeFiles();
            });
        }
    }
}

function download_e_signature(_token){

    $('body').on('click', '#btn_download_e_sig', function (){

        let e_signature_value = $('#old_e_signature_value').val();

        $.ajax({
            type: "GET",
            url: bpath + 'my/download/e/signature/'+e_signature_value,
            data: { _token, e_signature_value },
            success: function (response) {

            }
        });
    });

}
