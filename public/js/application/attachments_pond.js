// Register the plugin
FilePond.registerPlugin(
    // validates the size of the file
    FilePondPluginFileValidateSize,
);


var Personal_Data_Sheet, Personal_Rating_Sheet, Civil_Service, Transcript_of_Records, File_Uploads;
var pds_filename_array = [], pds_folder_array = [],
    prs_filename_array = [], prs_folder_array = [],
    cs_filename_array = [],  cs_folder_array = [],
    tor_filename_array = [], tor_folder_array = [],
    file_type_array = [];


function _file_pond(doc_type){

    let pond_id = '';
    let pond_name = '';
    let html_data = '';
    let attachment_data = '';
    let attachment_id = '';
    let id_array = [];
    let pond = '';
    let pond_array = [];


    for (let i = 0; i < doc_type.length; i++) {
        pond_id   = doc_type[i]['document_type'];
        pond_name = doc_type[i]['pond_name'];

        html_data += "<label for='validation-form-1' class='form-label w-full flex flex-col sm:flex-row'> Attach <span class='ml-2'>"+pond_name+"</span> <span class='sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500'>Maximum of 5 MB</span> </label>" +
                "<input id='"+pond_id+"' type='file' class='filepond mt-1' name='"+pond_id+"[]' multiple >";

        attachment_data += "<input id='attachment_type' name='attachment_type[]' class='hidden' value='"+pond_name+"'>"
        attachment_id += "<input id='attachment_id' name='attachment_id[]' class='hidden' value='"+pond_id+"'>"

        id_array.push(pond_id);

        //NEW CODE
        pond_array.push(pond);
        $('#attachment_div').html(html_data);
        $('#attachment_type_div').html(attachment_data);
        $('#attachment_id_div').html(attachment_id);

    }

    //NEW CODE
    $.each(id_array, function( index, id ) {

        pond = document.querySelector('input[id="'+id+'"]');

        File_Uploads = FilePond.create((pond), {
            credits: false,
            maxTotalFileSize: "5MB",
            labelFileProcessingComplete: "Uploaded successfully",
            labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
            labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
        });

        File_Uploads.setOptions({
            server: {
                process: "/application/tmp/file/upload",
                revert: "/application/tmp/delete/applicants/files",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
            },
        });

    });


    //OLD CODE
    // $.each(id_array, function( index, id ) {
    //
    //     let pond_id = "#"+id;
    //
    //   $(pond_id).filepond({
    //         credits: false,
    //         maxTotalFileSize: "5MB",
    //         labelFileProcessingComplete: "Uploaded successfully",
    //         labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
    //         labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
    //
    //         server: {
    //             process: "/application/tmp/file/upload",
    //             revert: "/application/tmp/delete/applicants/files",
    //             headers: {
    //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //             },
    //         }
    //     });
    // });

}

function remove_file_upload(file_pond_id){

    $.each(file_pond_id, function( index, id ) {

        let pond_element = document.querySelector('input[id="'+id+'"]');

        FilePond.destroy(pond_element);
    });
}













//SPARE CODES
// const PDS = document.querySelector('input[id="personal_data_sheet"]');
// const PRS = document.querySelector('input[id="prs"]');
// const CS  = document.querySelector('input[id="eligibility"]');
// const TOR = document.querySelector('input[id="tor"]');
//
// Personal_Data_Sheet = FilePond.create((PDS), {
//     credits: false,
//     maxTotalFileSize: "5MB",
//     labelFileProcessingComplete: "Uploaded successfully",
//     labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
//     labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
// });
// Personal_Rating_Sheet = FilePond.create((PRS), {
//     credits: false,
//     maxTotalFileSize: "5MB",
//     labelFileProcessingComplete: "Uploaded successfully",
//     labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
//     labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
// });
// Civil_Service = FilePond.create((CS), {
//     credits: false,
//     maxTotalFileSize: "5MB",
//     labelFileProcessingComplete: "Uploaded successfully",
//     labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
//     labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
// });
// Transcript_of_Records = FilePond.create((TOR), {
//     credits: false,
//     maxTotalFileSize: "5MB",
//     labelFileProcessingComplete: "Uploaded successfully",
//     labelMaxTotalFileSizeExceeded: "Maximum total size exceeded",
//     labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
// });
//
//
// function remove_PRS_upload(){
//     if (Personal_Rating_Sheet) {
//         var files = Personal_Rating_Sheet.getFiles();
//         if (files.length > 0) {
//             Personal_Rating_Sheet.processFiles().then(() => {
//                 Personal_Rating_Sheet.removeFiles();
//             });
//         }
//     }
// }
// function remove_CS_upload(){
//     if (Civil_Service) {
//         var files = Civil_Service.getFiles();
//         if (files.length > 0) {
//             Civil_Service.processFiles().then(() => {
//                 Civil_Service.removeFiles();
//             });
//         }
//     }
// }
// function remove_TOR_upload(){
//     if (Transcript_of_Records) {
//         var files = Transcript_of_Records.getFiles();
//         if (files.length > 0) {
//             Transcript_of_Records.processFiles().then(() => {
//                 Transcript_of_Records.removeFiles();
//             });
//         }
//     }
// }
//
// Personal_Data_Sheet.setOptions({
//     server: {
//         process: "/application/tmp/pds/upload",
//         revert: "/application/tmp/delete/applicants/files",
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         },
//     },
// });
// Personal_Rating_Sheet.setOptions({
//     server: {
//         process: "/application/tmp/prs/upload",
//         revert: "/application/tmp/delete/applicants/files",
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         },
//     },
// });
// Civil_Service.setOptions({
//     server: {
//         process: "/application/tmp/cs/upload",
//         revert: "/application/tmp/delete/applicants/files",
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         },
//     },
// });
// Transcript_of_Records.setOptions({
//     server: {
//         process: "/application/tmp/tor/upload",
//         revert: "/application/tmp/delete/applicants/files",
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         },
//     },
// });
//
//
// function PDS_file_pond(){
//
//     let pds_default_folder;
//     let pds_name;
//     let pds_folder;
//     let pds_file_Length
//     let file_type = "PDS";
//
//     let pds = Personal_Data_Sheet.getFiles();
//     pds_file_Length = pds.length;
//
//     if (pds_file_Length > 0) {
//
//         $.each(pds, function (i, val) {
//
//             pds_default_folder = val.serverId
//             pds_name = val.filename
//
//             pds_folder = pds_default_folder.split("<");
//
//             pds_filename_array.push(pds_name);
//             pds_folder_array.push(pds_folder[0]);
//             file_type_array.push(file_type);
//
//         });
//     }
// }
//
// function PRS_file_pond(){
//
//     let prs_default_folder;
//     let prs_name;
//     let prs_folder;
//     let prs_file_Length;
//     let file_type = "PRS";
//
//     let prs = Personal_Rating_Sheet.getFiles();
//     prs_file_Length = prs.length;
//
//     if (prs_file_Length > 0) {
//
//         $.each(prs, function (i, val) {
//
//             prs_default_folder = val.serverId
//             prs_name = val.filename
//
//             prs_folder = prs_default_folder.split("<");
//
//             prs_filename_array.push(prs_name);
//             prs_folder_array.push(prs_folder[0]);
//             file_type_array.push(file_type);
//
//         });
//     }
// }
//
// function CS_file_pond(){
//
//     let cs_default_folder;
//     let cs_name;
//     let cs_folder;
//     let cs_file_Length
//     let file_type = "CS";
//
//     let cs = Civil_Service.getFiles();
//     cs_file_Length = cs.length;
//
//     if (cs_file_Length > 0) {
//
//         $.each(cs, function (i, val) {
//
//             cs_default_folder = val.serverId
//             cs_name = val.filename
//
//             cs_folder = cs_default_folder.split("<");
//
//             cs_filename_array.push(cs_name);
//             cs_folder_array.push(cs_folder[0]);
//             file_type_array.push(file_type);
//
//         });
//     }
// }
//
// function TOR_file_pond(){
//
//     let tor_default_folder;
//     let tor_name;
//     let tor_folder;
//     let tor_file_Length;
//     let file_type = "TOR";
//
//     let tor = Transcript_of_Records.getFiles();
//     tor_file_Length = tor.length;
//
//     if (tor_file_Length > 0) {
//
//         $.each(tor, function (i, val) {
//
//             tor_default_folder = val.serverId
//             tor_name = val.filename
//
//             tor_folder = tor_default_folder.split("<");
//
//             tor_filename_array.push(tor_name);
//             tor_folder_array.push(tor_folder[0]);
//             file_type_array.push(file_type);
//
//         });
//     }
// }
