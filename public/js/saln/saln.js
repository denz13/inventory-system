var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function (){

    bpath = __basepath + "/";
    load_saln();
    load_saln_data();
});



//Initialize all My Documents DataTables
function load_saln(){
    try{
        /***/
        dt__created_saln = $('#dt__created_saln').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":true,
            "bJQueryUI": true,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [  6 ] },
                ],
        });


        /***/
    }catch(err){  }
}


function load_saln_data() {
    $.ajax({
        url: bpath + "saln/load/saln",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            dt__created_saln.clear().draw();
            var jsonData = JSON.parse(data);

            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    var id = jsonData[i]["id"];
                    var declarant_name = jsonData[i]["declarant_name"];
                    var created_at = jsonData[i]["created_at"];
                    var liabilities_total = jsonData[i]["liabilities_total"];
                    var acquisition_personal_prop_total =
                        jsonData[i]["acquisition_personal_prop_total"];
                    var net_worth = jsonData[i]["net_worth"];
                    var status = jsonData[i]["status"];
                    var as_of = jsonData[i]["as_of"];
                    var statusClass =
                        status === "Completed"
                            ? "text-primary"
                            : "text-pending";

                    var isUpdateButtonVisible = status !== "Completed";
                    var isChangeStatusActionsVisible = status !== "Completed";

                    var updateButton = isUpdateButtonVisible
                        ? `<a id="btn_update_saln" href="javascript:;" class="dropdown-item" data-sln-id="${id}"><i class="fa fa-pencil-square w-4 h-4 mr-2 text-success"></i> Update</a>`
                        : "";
                    var changeStatusActions = isChangeStatusActionsVisible
                        ? `<a id="btn_change_status" href="javascript:;" class="dropdown-item" data-sln-id="${id}"><i class="fa fa-exchange w-4 h-4 mr-2 text-warning"></i> Change Status</a>`
                        : "";
                    
                    var deleteButton =
                        status !== "Completed"
                            ? `<a id="btn_delete_saln" href="javascript:;" class="dropdown-item" data-sln-id="${id}"><i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i> Delete</a>`
                            : "";

                    var cd = `<tr>
                            <td style="display:none">${declarant_name}</td>
                            <td>${declarant_name}</td>
                            <td>${created_at}<br>As of ${as_of}</td>
                            <td>${liabilities_total}</td>
                            <td class="acquisition_personal_prop_total">${acquisition_personal_prop_total}</td>
                            <td class="net_worth">${net_worth}</td>
                            <td class="status ${statusClass}">${status}</td>
                            <td>
                                <div class="flex justify-center items-center">
                                    <a id="${id}" target="_blank" href="/saln/print/saln/${id}/vw" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Print" data-to-id="${id}"><i class="icofont-print text-success"></i></a>
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                        <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"><i class="fa fa-ellipsis-h items-center text-center text-primary"></i></a>
                                        <div class="dropdown-menu w-40">
                                            <div class="dropdown-content">
                                                ${updateButton}
                                                <a target="_blank" href="/saln/print/saln/${id}/dl" class="dropdown-item" data-sln-id="${id}"><i class="fa fa-download w-4 h-4 mr-2 text-success"></i> Download</a>
                                                <a id="btn_duplicate_saln" href="javascript:;" class="dropdown-item" data-sln-id="${id}"><i class="fa fa-copy w-4 h-4 mr-2 text-info"></i> Duplicate</a>
                                                ${changeStatusActions}
                                                ${deleteButton}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>`;

                    dt__created_saln.row.add($(cd)).draw();
                }
            }
        },
    });
}





$('#add_row_un_chil_table_modal').on('click',function(){

    add_row_chil();

});


function add_row_chil(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input  name="table_un_chil_id[]" type="text" class="form-control table_un_chil_id" placeholder="id"></td>'+
                '<td><input  name="table_un_chil_name[]" type="text" class="form-control" placeholder="Name"></td>'+
                '<td><input  name="table_un_chil_dateofbirth[]" type="date" class="form-control" placeholder="Date of Birth"></td>'+
                '<td><input  name="table_un_chil_age[]" type="text" class="form-control" placeholder="Age"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.un_chil_table_modal tbody').append(tr);

};


$('.un_chil_table_modal tbody').delegate('.delete','click',function(){

    var last=$('.un_chil_table_modal tbody tr').length;
    var table_un_chil_id = $(this).closest('tr').find('.table_un_chil_id').val();

    delete_data_from_table('un_chil_table_modal',table_un_chil_id);

    $(this).parent().parent().remove();
});


$('#add_row_asset').on('click',function(){
    add_row_asset();
});


function add_row_asset(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input name="modal_asset_id[]" type="text" class="form-control modal_asset_id" placeholder="DESCRIPTION"></td>'+
                '<td><input name="modal_asset_description[]" type="text" class="form-control" placeholder="DESCRIPTION"></td>'+
                '<td><input name="modal_asset_kind[]" type="text" class="form-control" placeholder="KIND"></td>'+
                '<td><input name="modal_asset_exact_loc[]" type="text" class="form-control" placeholder="EXACT LOCATION"></td>'+
                '<td><input name="modal_asset_assesed_value[]" type="number" value="0" min="0" class="form-control" placeholder="ASSESSED VALUE"></td>'+
                '<td><input name="modal_asset_market_value[]" type="number" value="0" min="0" class="form-control" placeholder="CURRENT FAIR MARKET VALUE"></td>'+
                '<td><input name="modal_asset_year[]" type="text" class="form-control" value="2023" placeholder="Year"></td>'+
                '<td><input name="modal_asset_mode[]" type="text" class="form-control" placeholder="Mode"></td>'+
                '<td><input name="modal_asset_acquisition_cost[]" type="number" value="0" min="0" class="form-control modal_asset_acquisition_cost" placeholder="ACQUISITION COST"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.asset_modal_table tbody').append(tr);

};

$('.asset_modal_table tbody').on('click','.delete',function(){
    var last=$('.asset_modal_table tbody tr').length;
    var modal_asset_id = $(this).closest('tr').find('.modal_asset_id').val();

    delete_data_from_table('asset_modal_table',modal_asset_id);

        $(this).parent().parent().remove();

});



$('#add_row_pp').on('click',function(){
    add_row_pp();
});


function add_row_pp(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input name="table_personal_prop_id[]" type="text" class="form-control table_personal_prop_id" placeholder="id"></td>'+
                '<td><input name="table_personal_prop_description[]" type="text" class="form-control" placeholder="DESCRIPTION"></td>'+
                '<td><input name="table_personal_prop_year_acquired[]" type="text" value="2023" min="0" class="form-control" placeholder="YEAR ACQUIRED"></td>'+
                '<td><input name="table_personal_prop_acquisition_cost[]" type="number" value="0" min="0" class="form-control table_personal_prop_acquisition_cost" placeholder="ACQUISITION COST/AMOUNT"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.pp_modal_table tbody').append(tr);

};

$('.pp_modal_table tbody').on('click','.delete',function(){
    var last=$('.pp_modal_table tbody tr').length;

    var table_personal_prop_id = $(this).closest('tr').find('.table_personal_prop_id').val();

    delete_data_from_table('pp_modal_table',table_personal_prop_id);

        $(this).parent().parent().remove();

});



$('#add_row_liab').on('click',function(){
    add_row_liab();
});


function add_row_liab(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input name="table_liabilities_id[]" type="text" class="form-control table_liabilities_id" placeholder="id"></td>'+
                '<td><input name="table_liabilities_nature[]" type="text" class="form-control" placeholder="NATURE"></td>'+
                '<td><input name="table_liabilities_nameofcred[]" type="text" class="form-control" placeholder="NAME OF CREDITORS"></td>'+
                '<td><input name="table_liabilities_outstanding_balance[]" type="number" value="0" min="0" class="form-control table_liabilities_outstanding_balance" placeholder="OUTSTANDING BALANCE"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.liab_modal_table tbody').append(tr);

};

$('.liab_modal_table tbody').on('click','.delete',function(){
    var last=$('.liab_modal_table tbody tr').length;


    var table_liabilities_id = $(this).closest('tr').find('.table_liabilities_id').val();

    delete_data_from_table('liab_modal_table',table_liabilities_id);

        $(this).parent().parent().remove();

});



$('#add_row_buin').on('click',function(){
    add_row_buin();
});


function add_row_buin(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input name="table_biafc_id[]" type="text" class="form-control table_biafc_id" placeholder="id"></td>'+
                '<td><input name="table_biafc_nameofentity[]" type="text" class="form-control" placeholder="NAME OF ENTITY/BUSINESS ENTERPRISE"></td>'+
                '<td><input name="table_biafc_businessaddress[]" type="text" class="form-control" placeholder="BUSINESS ADDRESS"></td>'+
                '<td><input name="table_biafc_natureofbusiness[]" type="text" class="form-control" placeholder="NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION"></td>'+
                '<td><input name="table_biafc_dateofacquisition[]" type="date" class="form-control" placeholder="DATE OF ACQUISITION OF INTEREST OR CONNECTION"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.buin_modal_table tbody').append(tr);

};

$('.buin_modal_table tbody').on('click','.delete',function(){
    var last=$('.buin_modal_table tbody tr').length;


    var table_biafc_id = $(this).closest('tr').find('.table_biafc_id').val();

    delete_data_from_table('buin_modal_table',table_biafc_id);

        $(this).parent().parent().remove();

});


$('#add_row_regs').on('click',function(){
    add_row_regs();
});


function add_row_regs(){
    var tr='<tr class="hover:bg-gray-200">'+
                '<td style="display: none"><input name="table_ritgs_id[]" type="text" class="form-control table_ritgs_id" placeholder="id"></td>'+
                '<td><input name="table_ritgs_nameofrelative[]" type="text" class="form-control" placeholder="NAME OF RELATIVE"></td>'+
                '<td><input name="table_ritgs_relationship[]" type="text" class="form-control" placeholder="RELATIONSHIP"></td>'+
                '<td><input name="table_ritgs_position[]" type="text" class="form-control" placeholder="POSITION"></td>'+
                '<td><input name="table_ritgs_nameofagency[]" type="text" class="form-control" placeholder="NAME OF AGENCY/OFFICE AND ADDRESS"></td>'+
                '<td><a href="javascript:void(0);" class="flex items-center text-theme-6 delete"><i  class="w-4 h-4 mr-1 far fa-trash-alt">Remove</i></a></td>'+
            '</tr>';
    $('.regs_modal_table tbody').append(tr);

};

$('.regs_modal_table tbody').on('click','.delete',function(){
    var last=$('.regs_modal_table tbody tr').length;

    var table_ritgs_id = $(this).closest('tr').find('.table_ritgs_id').val();

    delete_data_from_table('regs_modal_table',table_ritgs_id);

        $(this).parent().parent().remove();

});

$('#make_saln').on('click',function(){
    document.getElementById('add_saln').innerText = "Save"
    clear_add_update_modal();
});

$('#add_saln').on('click',function(){

    document.getElementById("add_saln").style.pointerEvents = "none";

    let save_or_update = document.getElementById('add_saln').innerText;
    let saln_id = $('#modal_update_saln_id').val();
    let modal_joint_filing = $("input[type='radio'][name='modal_joint_filing']:checked").val();


    // console.log(modal_joint_filing);

    let modal_as_of = $('#modal_as_of').val();
    let modal_declarant_firstname = $('#modal_declarant_firstname').val();
    let modal_declarant_lastname = $('#modal_declarant_lastname').val();
    let modal_declarant_middlename = $('#modal_declarant_middlename').val();
    let modal_declarant_address = $('#modal_declarant_address').val();
    let modal_declarant_position = $('#modal_declarant_position').val();
    let modal_declarant_agency_office = $('#modal_declarant_agency_office').val();
    let modal_declarant_office_address = $('#modal_declarant_office_address').val();
    let modal_declarant_id = $('#modal_declarant_id').val();
    let modal_declarant_id_no = $('#modal_declarant_id_no').val();
    let modal_declarant_date = $('#modal_declarant_date').val();

    let modal_spouse_firstname = $('#modal_spouse_firstname').val();
    let modal_spouse_lastname = $('#modal_spouse_lastname').val();
    let modal_spouse_middlename = $('#modal_spouse_middlename').val();
    let modal_spouse_position = $('#modal_spouse_position').val();
    let modal_spouse_agency_office = $('#modal_spouse_agency_office').val();
    let modal_spouse_office_address = $('#modal_spouse_office_address').val();
    let modal_spouse_id = $('#modal_spouse_id').val();
    let modal_spouse_no = $('#modal_spouse_no').val();
    let modal_spouse_date = $('#modal_spouse_date').val();

    let modal_real_prop_sub_total = $('#modal_real_prop_sub_total').text();
    let modal_personal_pro_sub_total = $('#modal_personal_pro_sub_total').text();
    let modal_total_assets = $('#modal_total_assets').text();
    let modal_total_liabilities = $('#modal_total_liabilities').text();
    let modal_total_net_worth = $('#modal_total_net_worth').text();

    var ritgs_has_gov_serv_relative = '0';
    var biafc_has_business_interest = '0';

    if( $('#biafc_has_business_interest').is(":checked")){
        ritgs_has_gov_serv_relative = '1'
    }

    if($('#ritgs_has_gov_serv_relative').is(":checked")){
        biafc_has_business_interest = '1'
    }

    //unmarried children

        var table_un_chil_id = [];

        $('input[name="table_un_chil_id[]"]').each(function (i, id) {
            table_un_chil_id[i] = $(id).val();
        });

        var table_un_chil_name = [];

        $('input[name="table_un_chil_name[]"]').each(function (i, name) {
            table_un_chil_name[i] = $(name).val();
        });

        var table_un_chil_dateofbirth = [];

        $('input[name="table_un_chil_dateofbirth[]"]').each(function (i, dateofbirth) {
            table_un_chil_dateofbirth[i] = $(dateofbirth).val();
        });


        var table_un_chil_age = [];

        $('input[name="table_un_chil_age[]"]').each(function (i, age) {
            table_un_chil_age[i] = $(age).val();
        });

    //assets

        var modal_asset_id = [];

            $('input[name="modal_asset_id[]"]').each(function (i, id) {
                modal_asset_id[i] = $(id).val();
            });

        var modal_asset_description = [];

        $('input[name="modal_asset_description[]"]').each(function (i, description) {
            modal_asset_description[i] = $(description).val();
        });

        var modal_asset_kind = [];

        $('input[name="modal_asset_kind[]"]').each(function (i, kind) {
            modal_asset_kind[i] = $(kind).val();
        });


        var modal_asset_exact_loc = [];

        $('input[name="modal_asset_exact_loc[]"]').each(function (i, exact_loc) {
            modal_asset_exact_loc[i] = $(exact_loc).val();
        });

        var modal_asset_assesed_value = [];

        $('input[name="modal_asset_assesed_value[]"]').each(function (i, assesed_value) {
            modal_asset_assesed_value[i] = $(assesed_value).val();
        });

        var modal_asset_market_value = [];

        $('input[name="modal_asset_market_value[]"]').each(function (i, market_value) {
            modal_asset_market_value[i] = $(market_value).val();
        });

        var modal_asset_year = [];

        $('input[name="modal_asset_year[]"]').each(function (i, year) {
            modal_asset_year[i] = $(year).val();
        });

        var modal_asset_mode = [];

        $('input[name="modal_asset_mode[]"]').each(function (i, mode) {
            modal_asset_mode[i] = $(mode).val();
        });


        var modal_asset_acquisition_cost = [];

        $('input[name="modal_asset_acquisition_cost[]"]').each(function (i, acquisition_cost) {
            modal_asset_acquisition_cost[i] = $(acquisition_cost).val();
        });

        //personal prop

        var table_personal_prop_id = [];

        $('input[name="table_personal_prop_id[]"]').each(function (i, id) {
            table_personal_prop_id[i] = $(id).val();
        });

        var table_personal_prop_description = [];

        $('input[name="table_personal_prop_description[]"]').each(function (i, prop_description) {
            table_personal_prop_description[i] = $(prop_description).val();
        });

        var table_personal_prop_year_acquired = [];

        $('input[name="table_personal_prop_year_acquired[]"]').each(function (i, year_acquired) {
            table_personal_prop_year_acquired[i] = $(year_acquired).val();
        });

        var table_personal_prop_acquisition_cost = [];

        $('input[name="table_personal_prop_acquisition_cost[]"]').each(function (i, acquisition_cost) {
            table_personal_prop_acquisition_cost[i] = $(acquisition_cost).val();
        });

        //LIABILITIES

        var table_liabilities_id = [];

        $('input[name="table_liabilities_id[]"]').each(function (i, id) {
            table_liabilities_id[i] = $(id).val();
        });

        var table_liabilities_nature = [];

        $('input[name="table_liabilities_nature[]"]').each(function (i, nature) {
            table_liabilities_nature[i] = $(nature).val();
        });

        var table_liabilities_nameofcred = [];

        $('input[name="table_liabilities_nameofcred[]"]').each(function (i, nameofcred) {
            table_liabilities_nameofcred[i] = $(nameofcred).val();
        });

        var table_liabilities_outstanding_balance = [];

        $('input[name="table_liabilities_outstanding_balance[]"]').each(function (i, outstanding_balance) {
            table_liabilities_outstanding_balance[i] = $(outstanding_balance).val();
        });

        //BUSINESS INTERESTS AND FINANCIAL CONNECTIONS

        var table_biafc_id = [];

        $('input[name="table_biafc_id[]"]').each(function (i, id) {
            table_biafc_id[i] = $(id).val();
        });

        var table_biafc_nameofentity = [];

        $('input[name="table_biafc_nameofentity[]"]').each(function (i, nameofentity) {
            table_biafc_nameofentity[i] = $(nameofentity).val();
        });

        var table_biafc_businessaddress = [];

        $('input[name="table_biafc_businessaddress[]"]').each(function (i, businessaddress) {
            table_biafc_businessaddress[i] = $(businessaddress).val();
        });

        var table_biafc_natureofbusiness = [];

        $('input[name="table_biafc_natureofbusiness[]"]').each(function (i, natureofbusiness) {
            table_biafc_natureofbusiness[i] = $(natureofbusiness).val();
        });

        var table_biafc_dateofacquisition = [];

        $('input[name="table_biafc_dateofacquisition[]"]').each(function (i, dateofacquisition) {
            table_biafc_dateofacquisition[i] = $(dateofacquisition).val();
        });

        //RELATIVES IN THE GOVERNMENT SERVICE

        var table_ritgs_id = [];

        $('input[name="table_ritgs_id[]"]').each(function (i, id) {
            table_ritgs_id[i] = $(id).val();
        });

        var table_ritgs_nameofrelative = [];

        $('input[name="table_ritgs_nameofrelative[]"]').each(function (i, nameofrelative) {
            table_ritgs_nameofrelative[i] = $(nameofrelative).val();
        });

        var table_ritgs_relationship = [];

        $('input[name="table_ritgs_relationship[]"]').each(function (i, relationship) {
            table_ritgs_relationship[i] = $(relationship).val();
        });

        var table_ritgs_position = [];

        $('input[name="table_ritgs_position[]"]').each(function (i, position) {
            table_ritgs_position[i] = $(position).val();
        });


        var table_ritgs_nameofagency = [];

        $('input[name="table_ritgs_nameofagency[]"]').each(function (i, nameofagency) {
            table_ritgs_nameofagency[i] = $(nameofagency).val();
        });



    $.ajax({
        type: "POST",
        url: bpath + 'saln/add/saln',
        data: {
            _token: _token,

            saln_id:saln_id,

            as_of:modal_as_of,
            modal_joint_filing: modal_joint_filing,
            modal_declarant_firstname: modal_declarant_firstname,
            modal_declarant_lastname: modal_declarant_lastname,
            modal_declarant_middlename: modal_declarant_middlename,
            modal_declarant_address: modal_declarant_address,
            modal_declarant_position: modal_declarant_position,
            modal_declarant_agency_office: modal_declarant_agency_office,
            modal_declarant_office_address: modal_declarant_office_address,
            modal_declarant_id: modal_declarant_id,
            modal_declarant_id_no: modal_declarant_id_no,
            modal_declarant_date: modal_declarant_date,

            modal_spouse_firstname: modal_spouse_firstname,
            modal_spouse_lastname: modal_spouse_lastname,
            modal_spouse_middlename: modal_spouse_middlename,
            modal_spouse_position: modal_spouse_position,
            modal_spouse_agency_office: modal_spouse_agency_office,
            modal_spouse_office_address: modal_spouse_office_address,
            modal_spouse_id: modal_spouse_id,
            modal_spouse_no: modal_spouse_no,
            modal_spouse_date: modal_spouse_date,

            modal_real_prop_sub_total: modal_real_prop_sub_total,
            modal_personal_pro_sub_total: modal_personal_pro_sub_total,
            modal_total_assets: modal_total_assets,
            modal_total_liabilities: modal_total_liabilities,
            modal_total_net_worth: modal_total_net_worth,

            ritgs_has_gov_serv_relative: ritgs_has_gov_serv_relative,
            biafc_has_business_interest: biafc_has_business_interest,

            table_un_chil_id: table_un_chil_id,
            table_un_chil_name: table_un_chil_name,
            table_un_chil_dateofbirth: table_un_chil_dateofbirth,
            table_un_chil_age: table_un_chil_age,

            modal_asset_id: modal_asset_id,
            modal_asset_description: modal_asset_description,
            modal_asset_kind: modal_asset_kind,
            modal_asset_exact_loc: modal_asset_exact_loc,
            modal_asset_assesed_value: modal_asset_assesed_value,
            modal_asset_market_value: modal_asset_market_value,
            modal_asset_year: modal_asset_year,
            modal_asset_mode: modal_asset_mode,
            modal_asset_acquisition_cost: modal_asset_acquisition_cost,

            table_personal_prop_id: table_personal_prop_id,
            table_personal_prop_description: table_personal_prop_description,
            table_personal_prop_year_acquired: table_personal_prop_year_acquired,
            table_personal_prop_acquisition_cost: table_personal_prop_acquisition_cost,


            table_liabilities_id: table_liabilities_id,
            table_liabilities_nature: table_liabilities_nature,
            table_liabilities_nameofcred: table_liabilities_nameofcred,
            table_liabilities_outstanding_balance: table_liabilities_outstanding_balance,

            table_biafc_id: table_biafc_id,
            table_biafc_nameofentity: table_biafc_nameofentity,
            table_biafc_businessaddress: table_biafc_businessaddress,
            table_biafc_natureofbusiness: table_biafc_natureofbusiness,
            table_biafc_dateofacquisition: table_biafc_dateofacquisition,


            table_ritgs_id: table_ritgs_id,
            table_ritgs_nameofrelative: table_ritgs_nameofrelative,
            table_ritgs_relationship: table_ritgs_relationship,
            table_ritgs_position: table_ritgs_position,
            table_ritgs_nameofagency: table_ritgs_nameofagency,


            save_or_update: save_or_update,


        },
        success:function (response) {
            var data = JSON.parse(response);
            // console.log(data);

                __notif_load_data(__basepath + "/");
                load_saln_data();
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_saln_modal'));
                mdl.hide();
                document.getElementById("add_saln").style.pointerEvents = "";

                clear_add_update_modal();
        }
    });

});


$("body").on("click", "#btn_update_saln", function (ev) {
    saln_id = $(this).data('sln-id');


    document.getElementById('add_saln').innerText = "Update"

    $.ajax({
        url: "saln/load/details",
        type: "POST",
        data: {
            _token:_token,
            saln_id: saln_id,
        },
        cache: false,
        success: function (data) {
            clear_add_update_modal();
            var data = JSON.parse(data);
            //console.log(data);

            $('.un_chil_table_modal tbody').append(data['get_unm_chil_table']);
            $('.asset_modal_table tbody').append(data['get_real_prop_table']);
            $('.pp_modal_table tbody').append(data['get_personal_prop_table']);
            $('.liab_modal_table tbody').append(data['get_liabilities_table']);
            $('.buin_modal_table tbody').append(data['get_biafc_table']);
            $('.regs_modal_table tbody').append(data['get_ritgs_table']);

            $('#modal_update_saln_id').val(data['get_saln']['id']);

            $('#modal_as_of').val(data['get_saln']['as_of']);

            $('#modal_declarant_firstname').val(data['get_saln']['declarant_firstname']);
            $('#modal_declarant_lastname').val(data['get_saln']['declarant_lastname']);
            $('#modal_declarant_middlename').val(data['get_saln']['declarant_middlename']);
            $('#modal_declarant_address').val(data['get_saln']['declarant_address']);
            $('#modal_declarant_position').val(data['get_saln']['declarant_position']);
            $('#modal_declarant_agency_office').val(data['get_saln']['declarant_agency_office']);
            $('#modal_declarant_office_address').val(data['get_saln']['declarant_office_address']);
            $('#modal_declarant_id').val(data['get_saln']['declarant_id']);
            $('#modal_declarant_id_no').val(data['get_saln']['declarant_id_num']);
            $('#modal_declarant_date').val(data['get_saln']['declarant_id_date']);

            $('#modal_spouse_firstname').val(data['get_saln']['spouse_firstname']);
            $('#modal_spouse_lastname').val(data['get_saln']['spouse_lastname']);
            $('#modal_spouse_middlename').val(data['get_saln']['spouse_middlename']);
            $('#modal_spouse_position').val(data['get_saln']['spouse_position']);
            $('#modal_spouse_agency_office').val(data['get_saln']['spouse_agency_office']);
            $('#modal_spouse_office_address').val(data['get_saln']['spouse_office_address']);
            $('#modal_spouse_id').val(data['get_saln']['spouse_id']);
            $('#modal_spouse_no').val(data['get_saln']['spouse_id_num']);
            $('#modal_spouse_date').val(data['get_saln']['spouse_id_date']);

            if(data['get_saln']['joint_filing'] == 1){
                $("#modal_JointFiling").attr('checked', 'checked');

            }else if(data['get_saln']['separate_filing'] == 1){
                $("#modal_SeparateFiling").attr('checked', 'checked');

            }else if(data['get_saln']['not_applicable'] == 1){
                $("#modal_NotApplicable").attr('checked', 'checked');
            }else{
                $("#modal_JointFiling").attr('checked', false);
                $("#modal_SeparateFiling").attr('checked', false);
                $("#modal_NotApplicable").attr('checked', false);
            }

            if(data['get_saln']['biafc_has_business_interest'] == 1){
                $("#biafc_has_business_interest").attr('checked', true);

            }else{
                $("#biafc_has_business_interest").attr('checked', false);
            }

            if(data['get_saln']['ritgs_has_gov_serv_relative'] == 1){
                $("#ritgs_has_gov_serv_relative").attr('checked', true);
            }else{
                $("#ritgs_has_gov_serv_relative").attr('checked', false);
            }
            // console.log(data['get_saln']);


            total();

            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_saln_modal'));
                mdl.toggle();


        }
    });
});


function clear_add_update_modal() {
        $('.un_chil_table_modal tbody tr').detach();
        $('.asset_modal_table tbody tr').detach();
        $('.pp_modal_table tbody tr').detach();
        $('.liab_modal_table tbody tr').detach();
        $('.buin_modal_table tbody tr').detach();
        $('.regs_modal_table tbody tr').detach();

        $('#modal_update_saln_id').val('');
        $('#modal_as_of').val('');

        // $('#modal_declarant_firstname').val('');
        // $('#modal_declarant_lastname').val('');
        // $('#modal_declarant_middlename').val('');
        $('#modal_declarant_address').val('');
        $('#modal_declarant_position').val('');
        $('#modal_declarant_agency_office').val('');
        $('#modal_declarant_office_address').val('');
        $('#modal_declarant_id').val('');
        $('#modal_declarant_id_no').val('');
        $('#modal_declarant_date').val('');

        $('#modal_spouse_firstname').val('');
        $('#modal_spouse_lastname').val('');
        $('#modal_spouse_middlename').val('');
        $('#modal_spouse_position').val('');
        $('#modal_spouse_agency_office').val('');
        $('#modal_spouse_office_address').val('');
        $('#modal_spouse_id').val('');
        $('#modal_spouse_no').val('');
        $('#modal_spouse_date').val('');

        $('#modal_real_prop_sub_total').text('0');
        $('#modal_personal_pro_sub_total').text('0');
        $('#modal_total_assets').text('0');
        $('#modal_total_liabilities').text('0');
        $('#modal_total_net_worth').text('0');


        $("#modal_JointFiling").attr('checked', false);
        $("#modal_SeparateFiling").attr('checked', false);
        $("#modal_NotApplicable").attr('checked', false);
        $("#biafc_has_business_interest").attr('checked', false);
        $("#ritgs_has_gov_serv_relative").attr('checked', false);

        // document.getElementById("add_saln").style.pointerEvents = "";

}


$('.asset_modal_table tbody').delegate('.modal_asset_acquisition_cost','keyup',function(){
    var tr=$(this).parent().parent();
    total();

});

$('.pp_modal_table tbody').delegate('.table_personal_prop_acquisition_cost','keyup',function(){
    var tr=$(this).parent().parent();
    total();

});

$('.liab_modal_table tbody').delegate('.table_liabilities_outstanding_balance','keyup',function(){
    var tr=$(this).parent().parent();
    total();

});



    function delete_data_from_table(type,type_id){

        if (type_id) {
            $.ajax({
                url: "saln/remove/data/from/table",
                type: "POST",
                data: {
                    _token:_token,
                    type:type,
                    type_id: type_id,
                },
                cache: false,
                success: function (data) {


                    __notif_load_data(__basepath + "/");
                }
            });
        }
        total();
    }


    $("body").on("click", "#btn_delete_saln", function (ev) {
        saln_id = $(this).data('sln-id');
        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "It will permanently deleted!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e40af',
            cancelButtonColor: '#6e6e6e',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value == true) {
                swal({
                    title:"Deleted!",
                    text:"SALN deleted permanently!",
                    type:"success",
                    confirmButtonColor: '#1e40af',
                    confirmButtonColor: '#1e40af',
                    timer: 1000
                });

                $.ajax({
                    url: "saln/remove",
                    type: "POST",
                    data: {
                        _token:_token,
                        saln_id: saln_id,
                    },
                    cache: false,
                    success: function (data) {

                        var data = JSON.parse(data);
                        __notif_load_data(__basepath + "/");
                        load_saln_data();
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal({
                    title:"Cancelled",
                    text:"No action taken!",
                    type:"error",
                    confirmButtonColor: '#1e40af',
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });
            }
        })
    });


function total(){

    var RealProperties=0;
        $('.modal_asset_acquisition_cost').each(function(i,e){
            var acquisition_cost = $(this).closest('tr').find('.modal_asset_acquisition_cost').val();
            RealProperties += parseFloat(acquisition_cost);
        });

        $('#modal_real_prop_sub_total').text(RealProperties.toLocaleString());


    var PersonalProperties=0;
        $('.table_personal_prop_acquisition_cost').each(function(i,e){
            var prop_acquisition_cost = $(this).closest('tr').find('.table_personal_prop_acquisition_cost').val();
            PersonalProperties += parseFloat(prop_acquisition_cost);
        });

        $('#modal_personal_pro_sub_total').text(PersonalProperties.toLocaleString());

        var TOTALASSETS =  parseFloat(RealProperties) + parseFloat(PersonalProperties);

        $('#modal_total_assets').text(TOTALASSETS.toLocaleString());



        var LIABILITIES=0;
        $('.table_liabilities_outstanding_balance').each(function(i,e){
            var liabilities_outstanding_balance = $(this).closest('tr').find('.table_liabilities_outstanding_balance').val();
            LIABILITIES += parseFloat(liabilities_outstanding_balance);
        });

        $('#modal_total_liabilities').text(LIABILITIES.toLocaleString());

        var NETWORTH =  parseFloat(TOTALASSETS) - parseFloat(LIABILITIES);

        $('#modal_total_net_worth').text(NETWORTH.toLocaleString());
    }


$(document).on("click", "#btn_change_status", function () {
    saln_id = $(this).data("sln-id");

    swal({
        container: "my-swal",
        title: "Confirm Status Change",
        text: "Are you sure you want to mark this SALN as Completed? This action cannot be undone.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: "Yes, mark as Completed",
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "saln/change-status",
                type: "POST",
                data: {
                    _token: _token,
                    saln_id: saln_id,
                    status: "Completed",
                },
                cache: false,
                success: function (data) {
                    if (data.success) {
                        swal({
                            title: "Status Changed!",
                            text: "SALN status has been set to Completed.",
                            type: "success",
                            confirmButtonColor: "#1e40af",
                            timer: 1500,
                        });
                        __notif_load_data(__basepath + "/");
                        load_saln_data();
                    } else {
                        swal({
                            title: "Error",
                            text: "Failed to change SALN status. Please try again later.",
                            type: "error",
                            confirmButtonColor: "#1e40af",
                            timer: 1500,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Error",
                        text: "Failed to change SALN status. Please try again later.",
                        type: "error",
                        confirmButtonColor: "#1e40af",
                        timer: 1500,
                    });
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                timer: 1500,
            });
        }
    });
});

$(document).on("click", "#btn_duplicate_saln", function () {
    var salnId = $(this).data("sln-id");

    swal({
        container: "my-swal",
        title: "Are you sure?",
        text: "This will duplicate the selected SALN record.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: "Yes, duplicate it",
    }).then((result) => {
        if (result.value) {
            // If user confirms, send AJAX request to duplicate SALN record
            $.ajax({
                url: "saln/duplicate",
                type: "POST",
                data: {
                    _token: _token,
                    id: salnId,
                },
                success: function (data) {
                    if (data.success) {
                        swal({
                            title: "Duplicated!",
                            text: "SALN record has been duplicated.",
                            type: "success",
                            confirmButtonColor: "#1e40af",
                            timer: 1500,
                        });
                        // Reload the SALN data after duplication
                        load_saln_data();
                    } else {
                        swal({
                            title: "Error",
                            text: "Failed to duplicate SALN record. Please try again later.",
                            type: "error",
                            confirmButtonColor: "#1e40af",
                            timer: 1500,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Error",
                        text: "Failed to duplicate SALN record. Please try again later.",
                        type: "error",
                        confirmButtonColor: "#1e40af",
                        timer: 1500,
                    });
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                timer: 1500,
            });
        }
    });
});


