
// var  _token = $('meta[name="csrf-token"]').attr('content');

// $(document).ready(function () {

//     bpath = __basepath + "/";
//     _thisSelect();
//     onChange_function();
//     fetched_Applicant_summary();
//     _onClick_function();

// });
// function _thisSelect(){
//     $('#pos_cat').select2({
//         placeholder: "Select Position Category",
//         closeOnSelect: true,

//     });
// }

// function onChange_function(){
//     $("body").on('change', '#pos_cat', function () {
//         var post_typeID = $(this).val();
//         fetched_Applicant_summary(post_typeID)
//     });
// }
// function _onClick_function(){

//     $("body").on('click', '#raterStatus', function () {
//         var job_ref = $(this).data('job-ref');
//         var applicant_id = $(this).data('applicant-id');
//         var position_id = $(this).data('position-id');

//         console.log(job_ref+'---- '+ applicant_id+' ===== '+position_id);
//         const raterStatus_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#raterStatus_modal'));
//         raterStatus_modal.show();

//         $.ajax({
//             url:  bpath + 'rating/rater-details',
//             method: 'get',
//             data: {_token:_token, job_ref:job_ref, applicant_id:applicant_id, position_id:position_id},
//             success: function (response) {
//                 $('#raterDetail_div').html(response);
//             }
//         });
//     });

    // $("body").on('click', '.ratedDetails', function () {
    //     // alert('123')
    //     var job_ref = $(this).data('job-ref');
    //     var applicant_id = $(this).data('applicant-id');
    //     var position_id = $(this).data('position-id');
    //     var position_type = $(this).data('position-type');
    //     var short_listID = $(this).data('shortlist-id');
    //     const detail_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#SummaryDetail_Modal'));
    //     detail_modal.show();

    //     $.ajax({
    //         url:  bpath + 'rating/summary-details',
    //         method: 'get',
    //         data: {_token:_token, job_ref:job_ref, applicant_id:applicant_id, position_id:position_id, position_type:position_type, short_listID:short_listID},
    //         success: function (response) {
    //             $('#summary_detail_div').html(response);
    //         }
    //     });

    // });

    //approving class btn
    // $("body").on('click', '.complete_class', function(){

    //     var postion_cat = $('#pos_cat').val();
    //     var rated_id = $(this).attr('id')
    //     var shortList_id = $(this).data('shortlist-id')
    //     var applicant_id = $(this).data('applicant-id')
    //     var position_id = $(this).data('position-id')
    //     var profile_id = $(this).data('profile-id')
    //     var ref_num = $(this).data('ref-num')
    //     var completing_id = $(this).data('completing-id')

    //     // alert(approving_id)
    //     $.ajax({
    //         url:  bpath + 'rating/approving-applicant/'+shortList_id,
    //         method: 'get',
    //         data: { _token:_token,
    //                 applicant_id:applicant_id,
    //                 rated_id:rated_id,
    //                 position_id:position_id,
    //                 ref_num:ref_num,
    //                 profile_id:profile_id,
    //                 // remarks:remarks,
    //                 approving_id:completing_id
    //               },
    //         success: function (response) {
    //             console.log(response.status);

    //             if(response.status == 200){
    //                 __notif_show( 1,applicant_id+" Rating Complete");
    //                 // const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#approve_modal'));
    //                 // mdl.hide();
    //                 fetched_Applicant_summary(postion_cat);
    //             }
    //             // else if(response.status == 400){
    //             //     __notif_show( 1,"Employee Position Updated Successfully");
    //             //     const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#approve_modal'));
    //             //     mdl.hide();
    //             // }
    //         }
    //     });



        // if(completing_id == 16){
        //     $('.apprv_btn').text('Complete')
        //     $('#proceed_head').text('Completing')
        // }else{
        //     $('.apprv_btn').text('Return')
        //     $('#proceed_head').text('Return')
        // }
        // // alert(ref_num)
        // $('#rated_id').val(rated_id);
        // $('#shortList_id').val(shortList_id);
        // $('#position_id').val(position_id);
        // $('#applicant_id').val(applicant_id);
        // $('#profile_id').val(profile_id);
        // $('#ref_num').val(ref_num);
        // $('#approving_id').val(completing_id);



    // })

    //approve class btn
    // $("body").on('click', '.approve_class', function(){


    //     var rated_id = $(this).attr('id')
    //     var shortList_id = $(this).data('shortlist-id')
    //     var applicant_id = $(this).data('applicant-id')
    //     var position_id = $(this).data('position-id')
    //     var profile_id = $(this).data('profile-id')
    //     var ref_num = $(this).data('ref-num')
    //     // alert(ref_num)
    //     $('#rated_id').val(rated_id);
    //     $('#shortList_id').val(shortList_id);
    //     $('#position_id').val(position_id);
    //     $('#applicant_id').val(applicant_id);
    //     $('#profile_id').val(profile_id);
    //     $('#ref_num').val(ref_num);

    // })

    //disapprove class btn
    // $("body").on('click', '.disapprove_class', function(){
    //     var rated_id = $(this).attr('id')
    //     var shortList_id = $(this).attr('shortlist-id')
    //     // $('#appl_id').val(id);
    // })

    //Approve Button
    // $("body").on('click', '.apprv_btn', function(){
    //     var rated_id = $('#rated_id').val();
    //     var shortList_id = $('#shortList_id').val();
    //     var applicant_id = $('#applicant_id').val();
    //     var position_id = $('#position_id').val();
    //     var postion_cat = $('#pos_cat').val();
    //     var profile_id = $('#profile_id').val();
    //     var ref_num = $('#ref_num').val();
    //     var remarks = $('#remarks').val();
    //     var approving_id = $('#approving_id').val();


    // console.log(start_date+' ' +end_date)
        // alert(position_id)

    //     $.ajax({
    //         url:  bpath + 'rating/approving-applicant/'+shortList_id,
    //         method: 'get',
    //         data: { _token:_token,
    //                 applicant_id:applicant_id,
    //                 rated_id:rated_id,
    //                 position_id:position_id,
    //                 ref_num:ref_num,
    //                 profile_id:profile_id,
    //                 remarks:remarks,
    //                 approving_id:approving_id
    //               },
    //         success: function (response) {
    //             console.log(response.status);

    //             if(response.status == 200){
    //                 __notif_show( 1,applicant_id+" Rating Complete");
    //                 const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#approve_modal'));
    //                 mdl.hide();
    //                 fetched_Applicant_summary(postion_cat);
    //             }
    //             // else if(response.status == 400){
    //             //     __notif_show( 1,"Employee Position Updated Successfully");
    //             //     const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#approve_modal'));
    //             //     mdl.hide();
    //             // }
    //         }
    //     });

    // })

// }
// function fetched_Applicant_summary(position_id){

//     $.ajax({
//         url:  bpath + 'rating/fetched/applicant-summary/'+position_id,
//         type: "get",
//         data: {
//             _token: _token,
//         },
//         success: function(data) {

//             $('#summary_div').html(data);
//             $('#tbl_summary').DataTable({
//                 dom:
//                             "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
//                             "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
//                             "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
//                             renderer: 'bootstrap',
//                             "info": false,
//                             "bInfo":true,
//                             "bJQueryUI": true,
//                             "bProcessing": true,
//                             "bPaginate" : true,
//                             "aLengthMenu": [[5,10,25,50,100,150,200,250,300,-1], [5,10,25,50,100,150,200,250,300,"All"]],
//                             "iDisplayLength": 10,
//                             "aaSorting": [],

//                             order: [0, 'desc']
//             });

//         }
//     });
// }
