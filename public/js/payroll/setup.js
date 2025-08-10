$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {

    bpath = __basepath + "/";

    load_setup_dt();
    load_items_dt();
    load_contribution_dt();

    load_setup();

    pr_item = $('#pr_item').select2({
        placeholder: "Select Item",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_item.val(null).trigger('change');

    $(".Div2").hide();
    $(".Div3").hide();


    pr_item.on('select2:select', function (e) {
        var selectedValue = e.params.data.id; // Get the selected value

        // Call your custom function here or perform any action you want
        load_item_amount(selectedValue);
    });


});


var  _token = $('meta[name="csrf-token"]').attr('content');
var setup_tbldata;
var items_tbldata;
var contribution_tbldata;
var loan_tbldata;
var ded_id;
var loan_id;
var salary_action;
var deduction_action;
var incentive_id;
var item_details_id;
var user_id_global;
var user_salary_global;


function load_setup_dt() {

    try{
        /***/
        setup_tbldata = $('#dt_pr_setup').DataTable({
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
        });
        /***/
    }catch(err){  }
}
function load_setup() {

    $.ajax({
        url: bpath + 'payroll/setup/load',
        type: "POST",
        data: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            setup_tbldata.clear().draw();
            /***/

            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    let salary = data[i]['salary'];
                    let agency_id = data[i]['agency_id'];
                    let emp_sal = data[i]['emp_sal'];




                    var cd = "";

                    /***/
                    cd = '' +
                        '<tr>' +

                        '<td class="hidden">' +
                        id+
                        '</td>' +

                        '<td>' +
                        '<a class="whitespace-nowrap" style="text-transform:uppercase">'+name+'</a>'+
                        '</td>' +


                        '<td class="w-40 !py-4 text-right">'+
                        salary+
                        '</td>'+


                        '<td class="table-report__action">'+
                        '<div class="flex justify-center items-center">'+
                        '<a id="account_details_btn" href="javascript:;" data-usr-id="'+agency_id+'" data-usr-salary="'+emp_sal+'" data-usr-name="'+name+'" class="flex items-center text-primary whitespace-nowrap mr-5"> View Details &nbsp; <i class="fa-solid fa-arrow-up-right-from-square"> </i></a>' +
                        '</div>'+
                        '</td>'+

                        '</tr>' +
                        '';
                    setup_tbldata.row.add($(cd)).draw();
                    /***/
                }
            }
        },
        error: function(e) {
            console.log(e)
        }

    });
}

$("body").on("click", "#account_details_btn", function (ev) {
    user_id = $(this).data('usr-id');
    user_id_global = user_id
    user_salary_global = $(this).data('usr-salary');
    $('#emp_name').text($(this).data('usr-name'));
    $('#emp_sal').text($(this).data('usr-salary'));
    load_user_id(user_id);

});

$("body").on("click", "#edit_item", function (ev) {
    id = $(this).data('item-id');
    item_details_id = $(this).data('id');
    rate = $(this).data('item-rate');
    load_items(user_id);
    pr_item.val(id).trigger('change');
    var amountInput = $('#item_amount');
    amountInput.val(rate);

});


function load_user_id(user_id) {
    $.ajax({
        url: bpath + 'payroll/setup/loademp_items',
        type: "POST",
        data: {
            _token: _token,
            user_id: user_id,
        },
        success: function (data) {
            try {
                var parsedData = JSON.parse(data);

                // Check the structure of parsedData


                var prItemsContainer = $('#pr_items');
                prItemsContainer.empty(); // Clear existing content

                parsedData.forEach(function (item) {
                    var itemID = item.item_id;
                    var id = item.id
                    var itemRate = item.rate;
                    var itemName = item.name;
                    var itemNature = item.nature
                    var itemHtml = '';

                    // Create HTML for each item
                    if(itemNature==='Addition'){
                        itemHtml =
                        ' <a id="edit_item" href="javascript:;"  data-item-id="'+itemID+'" data-id="'+id+'"  data-item-rate="'+itemRate+'" data-tw-toggle="modal" data-tw-target="#myItems" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">'+
                        '<div class="max-w-[50%] truncate mr-1">' + itemName + '</div>'+
                        '<i class="fa-regular fa-pen-to-square w-4 h-4 text-slate-500 ml-2"></i>'+
                        '<div class="ml-auto font-medium text-success">+' + itemRate + '</div>'+
                        '</a>'
                    }else if(itemNature==='Contribution'){
                        itemHtml =
                        ' <a id="edit_item" href="javascript:;" data-item-id="'+itemID+'" data-id="'+id+'" data-item-rate="'+itemRate+'" data-tw-toggle="modal" data-tw-target="#myItems" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">'+
                        '<div class="max-w-[50%] truncate mr-1">' + itemName + '</div>'+
                        '<i class="fa-regular fa-pen-to-square w-4 h-4 text-slate-500 ml-2"></i>'+
                        '<div class="ml-auto font-medium">' + itemRate + '</div>'+
                        '</a>'
                    }
                    else if(itemNature==='Deduction'){
                        itemHtml =
                        ' <a id="edit_item" href="javascript:;" data-item-id="'+itemID+'" data-id="'+id+'"  data-item-rate="'+itemRate+'" data-tw-toggle="modal" data-tw-target="#myItems" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">'+
                        '<div class="max-w-[50%] truncate mr-1">' + itemName + '</div>'+
                        '<i class="fa-regular fa-pen-to-square w-4 h-4 text-slate-500 ml-2"></i>'+
                        '<div class="ml-auto font-medium text-danger">-' + itemRate + '</div>'+
                        '</a>'
                    }

                    // Append the item HTML to the container
                    prItemsContainer.append(itemHtml);
                });

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        },
        error: function (error) {
            console.log(error)
            // Handle the error
            console.error('Error:', error);
        }
    });
}

function load_item_amount(id){
    $.ajax({
        url: bpath + 'payroll/setup/loademp_items/amount',
        type: "POST",
        data: {
            _token: _token,
            id: id,
            user_id:user_id_global,
        },
        success: function (data) {
            console.log(data)
            var data = JSON.parse(data);
            var result = data[0]['rate'];


                var amountInput = $('#item_amount');
                amountInput.val(result);

        },
        error: function (error) {
            // Handle the error
            console.error('Error:', error);
        }
    });
}

$('#clear_item').on('click', function() {
    user_id_global='';
    $('#emp_name').text('');
    $('#emp_sal').text('');
    var prItemsContainer = $('#pr_items');
    prItemsContainer.empty();
});

// Function to handle the "Add Item" button click
$('#add_item').on('click', function() {
    if(user_id_global){
        load_items(user_id_global);
        pr_item.val(null).trigger('change');
        var amountInput = $('#item_amount');
        amountInput.val('');
    }else{

        setTimeout(function() {
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#myItems"));
            mdl.hide();

            Swal.fire({
                icon: "warning",
                title: "Warning!",
                text: "View Details of Employee First.",
            });
        }, 1000);
    }

});



function load_items_dt() {

    try{
        /***/
        items_tbldata = $('#dt_emp_items').DataTable({
            dom:
                'lrt',
            renderer: 'bootstrap',
            "info": false,
            "bInfo":false,
            "bJQueryUI": false,
            "bProcessing": false,
            "bPaginate" : false,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],
            "ordering":false
        });
        /***/
    }catch(err){  }
}
function load_items(user_id) {

    $.ajax({
        url: bpath + 'payroll/setup/loademp_items',
        type: "POST",
        data: {
            _token: _token,
            user_id: user_id,
        },
        success: function (data) {
            items_tbldata.clear().draw();
            /***/

            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    let rate = data[i]['rate'];

                    var cd = "";

                    /***/
                    cd = '' +
                        '<tr>' +

                        '<td class="hidden">' +
                        id+
                        '</td>' +

                        '<td>' +
                        name+
                        '</td>' +


                        '<td>'+
                        rate+
                        '</td>'+

                        '<td class="!pl-4 text-slate-500" style="text-align: center">' +
                        '<a href="javascript:;"> <i data-id="'+id+'" data-tw-toggle="modal" data-tw-target="#emp_incentive_confirm" class="fa-regular fa-trash-can w-4 h-4 incentive_open_delete"></i> </a>'+
                        '</td>' +

                        '</tr>' +
                        '';
                    items_tbldata.row.add($(cd)).draw();
                    /***/
                }
            }
        },
        error: function (error) {
            // Handle the error
            console.error('Error:', error);
        }
    });
}

function load_contribution_dt() {

    try{
        /***/
        contribution_tbldata = $('#dt_emp_contribution').DataTable({
            dom:
                'lrt',
            renderer: 'bootstrap',
            "info": false,
            "bInfo":false,
            "bJQueryUI": false,
            "bProcessing": false,
            "bPaginate" : false,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],
            "ordering":false
        });
        /***/
    }catch(err){  }
}
function load_contribution() {
    let id =  $('#cont_emp_id').val();
    $.ajax({
        url: bpath + 'payroll/setup/contribution/load',
        type: "POST",
        data: {
            emp_id:id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            contribution_tbldata.clear().draw();
            /***/

            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    let amount = data[i]['amount'];

                    var cd = "";

                    /***/
                    cd = '' +
                        '<tr>' +

                        '<td class="hidden">' +
                        id+
                        '</td>' +

                        '<td>' +
                        name+
                        '</td>' +


                        '<td>'+
                        amount+
                        '</td>'+

                        '<td class="!pl-4 text-slate-500" style="text-align: center">' +
                        '<a href="javascript:;"> <i data-id="'+id+'" data-tw-toggle="modal" data-tw-target="#emp_contribution_confirm" class="fa-regular fa-trash-can w-4 h-4 contribution_open_delete"></i> </a>'+
                        '</td>' +

                        '</tr>' +
                        '';
                    contribution_tbldata.row.add($(cd)).draw();
                    /***/
                }
            }
        },
        error: function(e) {
            console.log(e)
        }

    });
}

function load_loan_dt() {

    try{
        /***/
        loan_tbldata = $('#dt_emp_loan').DataTable({
            dom:
                "lrt",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":false,
            "bJQueryUI": false,
            "bProcessing": false,
            "bPaginate" : false,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],
            "ordering":false
        });
        /***/
    }catch(err){  }
}
function load_loan(){
    let id =  $('#loan_emp_id').val();
    $.ajax({
        url: bpath + 'payroll/setup/loan/load',
        type: "POST",
        data: {
            emp_id:id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            loan_tbldata.clear().draw();
            /***/

            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    let amount = data[i]['amount'];

                    var cd = "";

                    /***/
                    cd = '' +
                        '<tr>' +

                        '<td class="hidden">' +
                        id+
                        '</td>' +

                        '<td>' +
                        name+
                        '</td>' +


                        '<td>'+
                        amount+
                        '</td>'+

                        '<td class="!pl-4 text-slate-500" style="text-align: center">' +
                        '<a href="javascript:;"> <i data-id="'+id+'" data-tw-toggle="modal" data-tw-target="#emp_loan_confirm" class="fa-regular fa-trash-can w-4 h-4 loan_open_delete"></i> </a>'+
                        '</td>' +

                        '</tr>' +
                        '';
                    loan_tbldata.row.add($(cd)).draw();
                    /***/
                }
            }
        },
        error: function(e) {
            console.log(e)
        }

    });
}


$('body').on('click','.add_salary',function (e){
    let id=$('#modal_update_to_id').val();

    let choice = $('#emp_class').val();
    let rate_id = $('#rate_class').val();

    let sg=$('#sg').val();
    let step=$('#step').val();
    let amount='';
    let tranche_id=$('#rate_tranche').val();

    let update_amount_request=false;

    if(choice==='1'){
        amount=$('#amount1').val();
        rate_id='';
    }else if(choice==='2'){
        amount=$('#amount2').val();
        sg='';
        step='';
    }else if(choice==='3'){
        amount=$('#amount3').val();
        sg='';
        step='';
    }


    if ($('#confirm_update_items').is(':checked')) {
        update_amount_request=true;
    } else {
        update_amount_request=false;
    }

    if(salary_action==="Add"){
        $.ajax({
            url:"/payroll/setup/store",
            datatype:'JSON',
            method:'POST',
            data:{
                sg:sg,
                step:step,
                amount:amount,
                choice:choice,
                id:id,
                tranche_id:tranche_id
            },
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_salary"));
                mdl.hide();
                __notif_show(1, 'Success', 'Salary Was Saved Successfully!');
                load_setup();

            },error:function (err){
                console.log(err)
            }
        });
    }else if(salary_action==="Edit"){
        $.ajax({
            url:"/payroll/setup/update",
            datatype:'JSON',
            method:'POST',
            data:{
                sg:sg,
                step:step,
                amount:amount,
                choice:choice,
                id:id,
                rate_id:rate_id,
                update_items:update_amount_request,
                tranche_id:tranche_id
            },
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_salary"));
                mdl.hide();
                __notif_show(1, 'Success', 'Salary Was Updated Successfully!');
                load_setup();

            },error:function (err){
                console.log(err)
            }
        });
    }



});

$('body').on('click','.addnewsalary',function (e){
    salary_action='Add';
    let id=$(this).data('id');
    $('#modal_update_to_id').val(id);
    clear_salary();
});
$('body').on('click','.editsalary',function (e){
    salary_action="Edit";
    let sal_id=$(this).data('sal_id');
    let emp_id=$(this).data('emp_id');
    $('#tranche_adjustment').hide();
    // $('#rate_tranche').val(1);
    user_id_global = emp_id;
    user_salary_global = sal_id;

    $('#modal_update_to_sal_id').val(sal_id)
    $('#modal_update_to_id').val(emp_id)
    var e_emp_class = $('#emp_class');

    var e_sg = $('#sg');
    var e_step = $('#step');

    var e_rate_class = $('#rate_class');

    var e_amount1 = $('#amount1');
    var e_amount2 = $('#amount2');
    var e_amount3 = $('#amount3');
    var tranche = $('#rate_tranche');


    $.ajax({
        url: bpath + 'payroll/setup/loadsalary_toedit',
        type: "POST",
        data: {
            'emp_id':emp_id,
            'sal_id':sal_id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {

            var data = JSON.parse(data);
            let mode=data['classification'];
            let tr=data['tranche_id'];
            tranche.val(tr);

            if(mode==='1'){
                e_sg.val(data['sg']);
                e_step.val(data['step']);
                e_amount1.val(data['salary']);
            }else if(mode==='2'){
                e_rate_class.val(data['rate_id'])
                e_amount2.val(data['salary'])
            }else if(mode==='3'){
                e_amount3.val(data['salary'])
            }
            e_emp_class.val(data['classification']);
            empclass_toshow();
        },
        error:function (e){
            console.log(e)
        }
    });
});

$('body').on('click','.opencontribution',function (e){
    let id=$(this).data('id');
    $('#emp_id').val(id);
    $('#cont_emp_id').val(id);
    $('#contribution_amount').val('');
    load_contribution();
});
$('body').on('click','.openedit_con',function (e){
    let id=$(this).data('id');
    $('#emp_id').val(id);
    $('#cont_emp_id').val(id);
    $('#contribution_amount').val('');
    load_contribution();
});


$('body').on('click','.openincentive',function (e){
    let id=$(this).data('id');
    $('#inc_emp_id').val(id);
    $('#incentive_amount').val('');
    console.log(id)
    load_items();
});
$('body').on('click','.openedit_inc',function (e){
    let id=$(this).data('id');
    $('#emp_id').val(id);
    $('#inc_emp_id').val(id);
    $('#incentive_amount').val('');
    console.log(id)
    load_items();
});

$('body').on('click','.addnewdeduction',function (e){
    deduction_action='Add';
    let id=$(this).data('id');
    $('#modal_ded_emp_id').val(id);
});
$('body').on('click','.add_deduction',function (e){
    console.log(deduction_action)
    let employee_id=$('#modal_ded_emp_id').val();

    let deduction_id = $('#deduction_select').val();


    if(deduction_action==="Add"){
        $.ajax({
            url:"/payroll/setup/deduction/insert",
            datatype:'JSON',
            method:'POST',
            data:{
                employee_id,
                deduction_id
            },
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_deduction"));
                mdl.hide();
                __notif_show(1, 'Success', 'Deduction Rate Was Saved Successfully!');
                load_setup();

            },error:function (err){
                console.log(err)
            }
        });
    }else if(deduction_action==="Edit"){
        $.ajax({
            url:"/payroll/setup/deduction/update",
            datatype:'JSON',
            method:'POST',
            data:{
                employee_id,
                deduction_id
            },
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_deduction"));
                mdl.hide();
                __notif_show(1, 'Success', 'Deduction Rate Was Updated Successfully!');
                load_setup();

            },error:function (err){
            }
        });
    }



});
$('body').on('click','.openedit_ded',function (e){
    deduction_action='Edit';
    let id=$(this).data('id');
    $('#modal_ded_emp_id').val(id);

    var deduction_select = $('#deduction_select');
    var deduction_amount = $('#deduction_amount');

    $.ajax({
        url: bpath + 'payroll/setup/getdeduction',
        type: "POST",
        data: {
            'id':id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            var data = JSON.parse(data);
            deduction_select.val(data['deduction_details']['id'])
            deduction_amount.val(data['deduction_details']['amount'])
        },
        error:function (e){
            console.log(e)
        }
    });

});

$('.confirm_contribution_delete').click(function (){
        $.ajax({
            url:"setup/contribution/delete",
            method:'post',
            data:{id:ded_id},
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#emp_contribution_confirm"));
                mdl.hide();
                load_contribution();
                __notif_show(1, 'Success', 'Contribution Was Removed Successfully!');
                load_setup();
            },error:function (err){
                console.log(err)
            }
        });
    })
$('.confirm_incentive_delete').click(function (){
    $.ajax({
        url:"setup/incentive/delete",
        method:'post',
        data:{id:incentive_id},
        success:function (res){
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#emp_incentive_confirm"));
            mdl.hide();
            load_items(user_id_global);
            __notif_show(1, 'Success', 'Item Was Removed Successfully!');

            const mdl2 = tailwind.Modal.getOrCreateInstance(document.querySelector("#myItems"));
            mdl2.hide();
            load_user_id(user_id_global);
        },error:function (err){
            console.log(err)
        }
    });
})
$('.confirm_loan_delete').click(function (){
    $.ajax({
        url:"setup/loan/delete",
        method:'post',
        data:{id:loan_id},
        success:function (res){
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#emp_loan_confirm"));
            mdl.hide();
            load_loan();
            __notif_show(1, 'Success', 'Loan Was Removed Successfully!');
            load_setup();
        },error:function (err){
            console.log(err)
        }
    });
})

$("#emp_class").change(function(){
    empclass_toshow();
});

$("#rate_class").click(function(){
   let id =$(this).val();
   var theElement = $('#amount2');

    $.ajax({
        url: bpath + 'payroll/setup/getrate_amount',
        type: "POST",
        data: {
            'id':id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            var data = JSON.parse(data);
            $(theElement).val(data['amount']);
        },
        error:function (e){
            $(theElement).val('');
        }
    });

});

$("#deduction_select").click(function(){
    let id =$(this).val();
    var theElement = $('#deduction_amount');

    $.ajax({
        url: bpath + 'payroll/setup/getdeduction_amount',
        type: "POST",
        data: {
            'id':id,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            var data = JSON.parse(data);
            $(theElement).val(data['amount']);
        },
        error:function (e){
            $(theElement).val('');
        }
    });

});

$('#set_salary').on( 'keyup', '#sg', function () {
    loadsalary_sg();
});

$('#set_salary').on( 'keyup', '#step', function () {
    loadsalary_sg();
});


$('#dt_emp_contribution').on('click', '.contribution_open_delete', function() {
    let id=$(this).data('id');
    ded_id=id;
});

$('#dt_emp_items').on('click', '.incentive_open_delete', function() {
    let id=$(this).data('id');
    incentive_id=id;
});

$('#dt_emp_loan').on('click', '.loan_open_delete', function() {
    let id=$(this).data('id');
    loan_id=id;
});

$('#myItems').on('click', '#add_new_incentive', function() {
    let id=$('#pr_item').val();
    let amount =$('#item_amount').val();
    let agency_id=user_id_global;
    console.log(amount);
    console.log(id);
    console.log(agency_id)

    $.ajax({
        url:"setup/incentive/insert",
        method:'post',
        data:{id:id,amount:amount,agency_id:agency_id},
        success:function (res){
            __notif_show(1, 'Success', 'Item Successfully Saved');
            load_items(user_id_global);
            pr_item.val(null).trigger('change');
            var amountInput = $('#item_amount');
            amountInput.val('');
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#myItems"));
            mdl.hide();
            load_user_id(user_id_global);

        },error:function (err){
            console.log(err)

        }
    });
});

$('#set_contribution').on('click', '#add_new_contribution', function() {
   let id=$('#contribution_id').val();
   let amount =$('#contribution_amount').val();
   let employee_id=$('#cont_emp_id').val();

   if(amount>0){
       $.ajax({
           url:"setup/contribution/insert",
           method:'post',
           data:{contribution_id:id,amount:amount,employee_id:employee_id},
           success:function (res){
               load_contribution();
               __notif_show(1, 'Success', 'Contribution Was Added Successfully!');
               load_setup();
               $('#contribution_amount').val('');
           },error:function (err){
               console.log(err)
               $('#contribution_amount').val('');
           }
       });
   }
});

$('#set_loan').on('click', '#add_new_loan', function() {
    let id=$('#loan_id').val();
    let amount =$('#loan_amount').val();
    let employee_id=$('#loan_emp_id').val();

    if(amount>0){
        $.ajax({
            url:"setup/loan/insert",
            method:'post',
            data:{loan_id:id,amount:amount,employee_id:employee_id},
            success:function (res){
                load_loan();
                __notif_show(1, 'Success', 'Loan Was Added Successfully!');
                load_setup();
                $('#loan_amount').val('');
            },error:function (err){
                console.log(err)
                $('#loan_amount').val('');
            }
        });
    }
});

function loadsalary_sg(){
    var step_id = $('#step').val();
    var tranch_id = $('#sg').val();
    var tranche_id= $('#rate_tranche').val();
    var theElement = $('#amount1');
    var tranch_html = $('#tranche_adjustment');


    $.ajax({
        url: bpath + 'payroll/setup/getsalary',
        type: "POST",
        data: {
            'sg':tranch_id,
            'step':step_id,
            'tranche':tranche_id,
            'old_sal':user_salary_global,
            'user_id':user_id_global,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            console.log(data)
            var salary = data.salary;
            var diff = data.difference;
            console.log()
            if(diff>0){
                tranch_html.show();
                tranch_html.removeClass('text-danger').addClass('text-success');
                tranch_html.html(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg>');
            }else if(diff<0){
                tranch_html.show();
                tranch_html.removeClass('text-success').addClass('text-danger');
                tranch_html.html(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-down" data-lucide="chevron-down" class="lucide lucide-chevron-down w-4 h-4 ml-0.5"><polyline points="6 9 12 15 18 9"></polyline></svg>');
            }else if(diff===0){
                tranch_html.hide();
            }
            console.log(data);
            $(theElement).val(salary);
        },
        error:function (e){
            console.log(e)
            $(theElement).val('');

        }
    });
}

function clear_salary(){
    $(".Div1").show();
    $(".Div2").hide();
    $(".Div3").hide();

    $('#sg').val('');
    $('#step').val('');

    $('#emp_class').val(1);

    $('#amount1').val('');
    $('#amount2').val('');
    $('#amount3').val('');

}

function empclass_toshow(){
    let choice =$('#emp_class').val();
    if (choice==='1'){

        $(".Div1").show();
        $(".Div2").hide();
        $(".Div3").hide();
    }else if(choice==='2'){
        $(".Div1").hide();
        $(".Div2").show();
        $(".Div3").hide();
    }
    else if(choice==='3'){
        $(".Div1").hide();
        $(".Div2").hide();
        $(".Div3").show();
    }
}

$('#rate_tranche').change(function() {
    loadsalary_sg();
});
