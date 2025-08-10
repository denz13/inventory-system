var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function (){

    bpath = __basepath + "/";

    load_hiring_available();
    submit_application();
});


function load_hiring_available(){

    let available_pos = '';
    let position_details = '';

    $.ajax({
        url: bpath + 'application/get/available/positions',
        type: "POST",
        data: { _token, },
        success: function(response) {
            var data = JSON.parse(response);

            if(data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                        let index = data[i]['index'];
                        let position_ref_num = data[i]['position_ref_num'];
                        let assign_agency = data[i]['assign_agency'];
                        let pos_title = data[i]['pos_title'];
                        let item_no = data[i]['item_no'];
                        let sg = data[i]['sg'];
                        let salary = data[i]['salary'];
                        let eligibility = data[i]['eligibility'];
                        let educ = data[i]['educ'];
                        let training = data[i]['training'];
                        let work_ex = data[i]['work_ex'];
                        let competency = data[i]['competency'];

                        let remarks = data[i]['remarks'];
                        let doc_req = data[i]['doc_req'];

                        let email_through = data[i]['email_through'];
                        let hr_position = data[i]['hr_position'];

                        let post_date = data[i]['post_date'];
                        let close_date = data[i]['close_date'];

                        let status = data[i]['status'];

                        let btn_html = data[i]['btn_html'];
                        let email_address = data[i]['email_address'];
                        let address = data[i]['address'];


                    if (index == "0")
                    {
                        available_pos =
                            "<a id='job_list_number' " +
                            "data-index='"+index+"' " +
                            "data-ref-no='"+position_ref_num+"' " +

                            "data-agency='"+assign_agency+"' " +
                            "data-pos-title='"+pos_title+"' " +
                            "data-item-no='"+item_no+"' " +
                            "data-sg='"+sg+"' " +
                            "data-salary='"+salary+"' " +
                            "data-eligibility='"+eligibility+"' " +
                            "data-educ='"+educ+"' " +
                            "data-training='"+training+"' " +
                            "data-work-ex='"+work_ex+"' " +
                            "data-competency='"+competency+"' " +
                            "data-remarks='"+remarks+"' " +
                            "data-doc-req='"+doc_req+"' " +

                            "data-post-date='"+post_date+"' " +
                            "data-close-date='"+close_date+"' " +

                            "data-email-through='"+email_through+"' " +
                            "data-hr-position='"+hr_position+"' " +
                            "data-status='"+status+"' " +
                            "data-html='"+btn_html+"' " +
                            "data-address='"+address+"' " +
                            "data-email-address='"+email_address+"' " +

                            "class='flex rounded-lg items-center px-4 py-2 bg-primary text-white font-medium' href='javascript:;'>"+
                            "<div class='flex-1 truncate'>"+pos_title+"</div>"+
                            "</a>";


                        $('#btn_apply_div').html(btn_html);

                        $('#btn_apply_job_position').val(position_ref_num);

                        $('#job_title').text(pos_title);

                        job_desc(assign_agency, pos_title,item_no, sg, salary, eligibility, educ, training, work_ex, competency);

                        Job_opportunities_list(remarks, doc_req, email_through, hr_position, post_date, close_date, email_address, address);

                    }
                    else
                    {
                        available_pos += "<a id='job_list_number' " +
                                            "data-index='"+index+"' " +
                                            "data-ref-no='"+position_ref_num+"' " +

                                            "data-agency='"+assign_agency+"' " +
                                            "data-pos-title='"+pos_title+"' " +
                                            "data-item-no='"+item_no+"' " +
                                            "data-sg='"+sg+"' " +
                                            "data-salary='"+salary+"' " +
                                            "data-eligibility='"+eligibility+"' " +
                                            "data-educ='"+educ+"' " +
                                            "data-training='"+training+"' " +
                                            "data-work-ex='"+work_ex+"' " +
                                            "data-competency='"+competency+"' " +
                                            "data-remarks='"+remarks+"' " +
                                            "data-doc-req='"+doc_req+"' " +

                                            "data-post-date='"+post_date+"' " +
                                            "data-close-date='"+close_date+"' " +

                                            "data-email-through='"+email_through+"' " +
                                            "data-hr-position='"+hr_position+"' " +
                                            "data-status='"+status+"' " +
                                            "data-html='"+btn_html+"' " +
                                            "data-address='"+address+"' " +
                                            "data-email-address='"+email_address+"' " +

                                            "class='flex items-center px-4 py-2 mt-1' href='javascript:;'>"+
                                            "<div class='flex-1 truncate'>"+pos_title+"</div>"+
                                          "</a>";
                    }

                    $('#available_pos_div').html(available_pos);
                }
            }else
            {
                let html_data = "<a class='flex rounded-lg items-center px-4 py-2 bg-primary text-white font-medium text-center' href='javascript:;'>"+
                                "<div class='flex-1 truncate'>No available job/s yet!</div>"+
                                "</a>";

                $('#job_list_desc_div').hide();
                $('#available_pos_div').html(html_data);
            }
        }
    });
}

function job_desc(assign_agency, pos_title,item_no, sg, salary, eligibility, educ, training, work_ex, competency){
    $('#table_job_list tbody tr').detach();

    var tr = `
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Place of Assignment :</label></td>
                <td style="width: 80%"><label>${ assign_agency }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Position Title :</label></td>
                <td style="width: 80%"><label>${ pos_title }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Plantilla Item No. : </label></td>
                <td style="width: 80%"><label>${ item_no }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Salary/Job/Pay Grade :</label></td>
                <td style="width: 80%"><label>${ sg }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Monthly Salary : </label></td>
                <td style="width: 80%"><label>Php<span class="ml-1">${ salary }</span></label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Eligibility : </label></td>
                <td style="width: 80%"><label>${ eligibility }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Education :</label></td>
                <td style="width: 80%"><label>${ educ }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Training :</label></td>
                <td style="width: 80%"><label>${ training }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Work Experience :</label></td>
                <td style="width: 80%"><label>${ work_ex }</label></td>
            </tr>
            <tr class="hover:bg-gray-200">
                <td style="width: 20%"><label class="font-bold">Competency :</label></td>
                <td style="width: 80%"><label>${ competency }</label></td>
            </tr>`;

    $('#table_job_list tbody').append(tr);
}

function Job_opportunities_list(remarks, doc_req, email_through, hr_position, post_date, close_date, email_address, address){

    const Instructions_Remarks = `
            <div class="accordion-item">
                 <div id="faq-accordion-content-5" class="accordion-header"> <button class="accordion-button" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-5" aria-expanded="true" aria-controls="faq-accordion-collapse-5"> Instructions/Remarks : </button> </div>
                 <div id="faq-accordion-collapse-5" class="accordion-collapse collapse show" aria-labelledby="faq-accordion-content-5" data-tw-parent="#faq-accordion-remarks">
                     <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed"> ${ remarks } </div>
                 </div>
             </div>`;

    const Documents = `
            <div class="accordion-item">
                 <div id="faq-accordion-content-6" class="accordion-header"> <button class="accordion-button" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-6" aria-expanded="true" aria-controls="faq-accordion-collapse-5"> Documents : </button> </div>
                 <div id="faq-accordion-collapse-6" class="accordion-collapse collapse show" aria-labelledby="faq-accordion-content-6" data-tw-parent="#faq-accordion-documents">
                     <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed"> ${ doc_req } </div>
                 </div>
             </div>`;


    const job_description_footer = `
            <div class="accordion-item mb-5">
                 <div>
                    <label class='text-sm font-medium leading-none mt-3 font-bold'>QUALIFIED APPLICANTS</label> <span class='ml-1'>are advised to hand in or send through courier/email their application to:</span>
                 </div>
                 <div class='mt-5'>
                    <label style='text-transform: uppercase' class='text-sm font-medium leading-none mt-3 font-bold'>${ email_through }</label>
                 </div>
                 <div class='mt-5'>
                    <label style='text-transform: uppercase' class='text-sm font-medium leading-none mt-3 font-bold'>${ hr_position }</label>
                 </div>
                 <div>
                    <label class='text-sm font-medium leading-none font-normal'>${ address }</label>
                 </div>
                  <div>
                    <label class='text-sm font-medium leading-none font-normal'>${ email_address }</label>
                 </div>
                  <div class='mt-5'>
                    <label class='text-sm font-medium leading-none font-bold'>APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED.</label>
                 </div>
                 <div class='mt-5'>
                    <label class='text-sm font-bold leading-none font-bold'>Posting Date :</label><label class='text-sm font-medium leading-none font-normal ml-5'>${ post_date }</label>
                 </div>
                 <div class='mt-5'>
                    <label class='text-sm font-bold leading-none font-bold'>Closing Date :</label><label class='text-sm font-medium leading-none font-normal ml-5'>${ close_date }</label>
                 </div>
             </div>`;


    $('#faq-accordion-remarks').html(Instructions_Remarks);
    $('#faq-accordion-documents').html(Documents);
    $('#faq-accordion-footer').html(job_description_footer);



}

$("body").on('click', '#job_list_number', function (){

    $(this).addClass('flex rounded-lg items-center px-4 py-2 bg-primary text-white font-medium').siblings().removeClass('flex rounded-lg items-center px-4 py-2 bg-primary text-white font-medium').addClass('flex items-center px-4 py-2 mt-1');

    let reference_number = $(this).data('ref-no');

    let assign_agency = $(this).data('agency');
    let position_title = $(this).data('pos-title');
    let remarks = $(this).data('remarks');
    let doc_req = $(this).data('doc-req');
    let item_no = $(this).data('item-no');
    let sal_grade = $(this).data('sg');
    let salary = $(this).data('salary');
    let eligibility = $(this).data('eligibility');
    let educ = $(this).data('educ');
    let training = $(this).data('training');
    let work_exp = $(this).data('work-ex');
    let competency = $(this).data('competency');
    let email_through = $(this).data('email-through');
    let hr_position = $(this).data('hr-position');
    let post_date = $(this).data('post-date');
    let close_date = $(this).data('close-date');
    let status = $(this).data('status');
    let email_address = $(this).data('email-address');
    let address = $(this).data('address');
    let btn_html = $(this).data('html');


    $('#btn_apply_div').html(btn_html);

    $('#table_job_list tbody tr').detach();

    $('#job_title').text(position_title);
    $('#btn_apply_job_position').val(reference_number);

    job_desc(assign_agency, position_title,item_no, sal_grade, salary, eligibility, educ, training, work_exp, competency);
    Job_opportunities_list(remarks, doc_req, email_through, hr_position, post_date, close_date, email_address, address);

});

$("body").on('click', '#btn_apply_job_position', function () {

    let reference_number = $(this).val();
    let doc_requirements =
    $('#position_ref_number').val(reference_number);

    $.ajax({
        url: bpath + 'application/apply',
        type: "POST",
        data: {
            _token,
            reference_number,
        },
        success: function (response) {

            if (response.status == 200)
            {
                if(response.status == "NO_ATTACHMENT")
                {
                    __notif_show(-1, "Ooops!!", response.message);

                }else
                {
                    const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_file_attachments_mdl'));
                    modal.toggle();

                    _file_pond(response.doc_type);
                }
            }
            else
            {
                __notif_show(-1, "Ooops!!", response.message);
            }
        }
    });
});

$("body").on('click', '#submit_attachments', function (){

    let position_ref_number = $('#position_ref_number').val();

    // remove_file_upload();

    // PDS_file_pond();
    // PRS_file_pond();
    // CS_file_pond();
    // TOR_file_pond();

    // let form_data = {
    //     _token,
    //     position_ref_number,
    //     pds_folder_array,
    //     prs_folder_array,
    //     cs_folder_array,
    //     tor_folder_array,
    // }
    //
    // $.ajax({
    //     url: bpath + 'application/submit/attachments',
    //     type: "POST",
    //     data: form_data,
    //     success: function (response) {
    //
    //         if (response.status == 200) {
    //
    //             __notif_show(1, "Success", "Submitted successfully!");
    //             pds_filename_array = []; pds_folder_array = [];
    //             prs_filename_array = []; prs_folder_array = [];
    //             cs_filename_array = [];  cs_folder_array = [];
    //             tor_filename_array = []; tor_folder_array = [];
    //             file_type_array = [];
    //
    //             remove_PDS_upload();
    //             remove_PRS_upload();
    //             remove_CS_upload();
    //             remove_TOR_upload();
    //
    //             const educ_mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_file_attachments_mdl'));
    //             educ_mdl.hide();
    //         }
    //     }
    // });
});

function submit_application(){

    let submit_button = $('#submit_attachments');
    $('#form_applicant_attachments').submit(function (event){
        event.preventDefault();

        let ids = $('#attachment_div input[id]').map(function() {
            return this.id;
        }).get();

        var form = $(this);

        $.ajax({
            type: "POST",
            url: bpath + 'application/submit/attachments',
            data: form.serialize(),
            beforeSend: function () {

                submit_button.html(`Submitting <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="4"><circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg>`);
                submit_button.prop('disabled', true);

            },
            success: function (response) {

                if(response.status == 200)
                {
                    __notif_show(1, "Success", "Application submitted successfully!");

                    remove_file_upload(ids);

                    const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_file_attachments_mdl'));
                    modal.hide();

                    load_hiring_available();

                }
                else  if(response.status == 500) {

                    __notif_show(-1, "Warning", response.message);
                }

                else {

                    __notif_show(-1, "Warning", "OOps! Something went wrong!");
                }
            },
            complete: function (){

                submit_button.html(`Submit`);
                submit_button.prop('disabled', false);

            },
        });

    });
}

$('body').on('click', '#btn_applied', function (){

   __notif_show(-1, 'Ooops!','You have already applied for this position!');
});

$('body').on('click', '.btn_already_submitted', function (){

    __notif_show(-1, 'Ooops!', 'You have already submitted an application.');

});
