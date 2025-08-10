$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    bpath = __basepath + "/";
    load_datatable();
    load_payroll_details();
    load_items_dt();
    load_emp();

    //update amount of item on item_modal
    $(document).on('keydown', '#item_modal input[type="text"]', function(event) {
        if (event.which === 13) { // Check for Enter or Tab key
            var item_value = $(this).val();

            var item_name = $(this).data('item_name');
            console.log(item_value)
            console.log(item_name)
            update_item_amount(item_name,global_user_id,item_value,global_payroll_id);
        }
    });

    $(".Div2").hide();
    $(".Div3").hide();

    pr_item = $('#pr_item').select2({
        placeholder: "Select Item",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_item.val(null).trigger('change');


});



var  _token = $('meta[name="csrf-token"]').attr('content');
var tbldata_pr_details;
var tbldata_emplist;
var items_tbldata;
var global_user_id='';
var global_nature='';

var currentURL = window.location.href;
var parts = currentURL.split('/'); // Split the URL by "/"
var global_payroll_id = parts[parts.length - 1]; //

var clickedRowContext;


var pr_modal_action='';
var pr_id='';

var rData='';
var currentRowData = null;
var payroll_item_id;


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
    clickedRowContext = this;
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var payroll_id = parts[parts.length - 1]; //

    let emp_id = $(this).data('user_id');
    global_user_id=user_id;
    console.log(global_nature)
    $.ajax({
        url: bpath + 'payroll/setup/loademp_items/nature',
        type: "GET",
        data: {
            _token: _token,
            user_id: user_id,
            payroll_id:payroll_id,
            nature:global_nature
        },
        success: function (data) {

            items_tbldata.clear().draw();
            /***/

            var data = JSON.parse(data);
            console.log(data.items);


            for (const item of data.items) {
                var id = item.id
                var name = item.name
                let rate = item.rate

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
                    '<a href="javascript:;"> <i data-id="'+id+'" data-tw-toggle="modal" data-tw-target="#delete_item_confirm" class="fa-regular fa-trash-can w-4 h-4 open_delete"></i> </a>'+
                    '</td>' +

                    '</tr>' +
                    '';
                items_tbldata.row.add($(cd)).draw();
            }

        },
        error: function (error) {
            // Handle the error
            console.error('Error:', error);
        }
    });
}

function update_item_amount(item_name, user_id, amount, pr_id) {
    $.ajax({
        url: "/payroll/payroll/update/employee/item",
        method: 'post',
        data: { item_name: item_name, user_id: user_id, amount: amount, pr_id: pr_id },
        success: function (response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Amount Successfully Updated!');
                load_total_employee_nature(global_user_id, global_payroll_id, global_nature);
                calculate_sal();
                load_payroll_details();
            } else {
                __notif_show(-3, 'Error', 'An error occurred.');
            }
        }, error: function (err) {
            console.log(err);
            __notif_show(-3, 'Error', err);
        }
    });
}

$('.confirm_delete_item').click(function (){
    $.ajax({
        url:"delete/item/details",
        method:'post',
        data:{id:payroll_item_id},
        success:function (res){
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete_item_confirm"));
            mdl.hide();

            __notif_show(1, 'Success', 'Item Was Removed Successfully!');
            load_items(global_user_id);
            load_payroll_items(global_user_id,global_payroll_id,global_nature);
            load_total_employee_nature(global_user_id, global_payroll_id, global_nature);
            calculate_sal();

            // const mdl2 = tailwind.Modal.getOrCreateInstance(document.querySelector("#myItems"));
            // mdl2.hide();

        },error:function (err){
            console.log(err)
        }
    });
})

$('#dt_emp_items').on('click', '.open_delete', function() {
    let id=$(this).data('id');
    console.log(id)
    payroll_item_id=id;
});

$('#add-new-item').on('click', '#add_new_payroll_item', function() {
    let name=$('#pr_item option:selected').text();
    let amount =$('#item_amount').val();
    console.log(global_nature);

    $.ajax({
        url:"save/item/details",
        method:'post',
        data:{item_name:name,agency_id:global_user_id,pr_id:global_payroll_id,item_nature:global_nature,amount:amount},
        success:function (res){
            __notif_show(1, 'Success', 'Item Successfully Saved');
            load_items(global_user_id);
            pr_item.val(null).trigger('change');
            var amountInput = $('#item_amount');
            amountInput.val('');
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#add-new-item"));
            mdl.hide();

        },error:function (err){
            console.log(err)

        }
    });
});

function load_datatable() {

    try{
        /***/
        tbldata_pr_details = $('#dt_payroll_details').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":false,
            "bJQueryUI": false,
            "bProcessing": false,
            "bPaginate" : false,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],
            "searching": false
        });
        /***/
    }catch(err){  }

    try{
        /***/
        tbldata_emplist = $('#dt_emp_list').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": true,
            "bInfo":false,
            "bJQueryUI": false,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],
            "searching": true
        });
        /***/
    }catch(err){  }
}


//PAYROLL DETAILS

//load employee search to datatable
function load_emp() {

    $.ajax({
        url: bpath + 'payroll/payroll/empload',
        type: "POST",
        data: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(data) {
            tbldata_emplist.clear().draw();
            /***/

            var data = JSON.parse(data);
            if(data.length > 0) {
                for(var i=0;i<data.length;i++) {

                    /***/
                    var id = data[i]['id'];
                    var name = data[i]['name'];
                    var manage = data[i]['manage'];

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


                        '<td>' +
                        manage+
                        '</td>' +

                        '</tr>' +
                        '';
                    tbldata_emplist.row.add($(cd)).draw();
                    /***/
                }
            }
        }
        ,error: function (e){

        }
    });
}

//get id of employee to add in the payroll
$("body").on('click', '#get_emp_id', function (){
    let id = $(this).data('id')
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var numberString = parts[parts.length - 1]; //

    $.ajax({
        url:"/payroll/payroll/save/employee",
        method:'post',
        data:{id:id,payroll_id:numberString},
        success:function (response){
            if (response.success) {
                __notif_show(1, 'Success', 'Employee was successfully added!');
                load_payroll_details(id);
            } else if (response.message === 'Employee already added') {
                __notif_show(-1, 'Warning', 'Employee is already added.');
            } else {
                __notif_show(-3, 'Error', 'An error occurred.');
            }
        },error:function (err){
            console.log(err)
            __notif_show(-3, 'Error', err);
        }
    });
});


function load_total_employee_nature(user_id, payroll_id, nature) {
    $.ajax({
        url: bpath + 'payroll/setup/loademp_items/nature',
        type: "GET",
        data: {
            _token: _token,
            user_id: user_id,
            payroll_id: payroll_id,
            nature: nature
        },
        success: function (data) {
            $('#item_modal_title').text(nature);
            $('#item_modal_total').text('Total ' + nature);

            try {
                var parsedData = JSON.parse(data);
                if (parsedData.items.length > 0) {
                    var totalAmount = 0.00;
                    var items = parsedData.items;
                    items.forEach(function (item) {
                        var itemRate = parseFloat(item.rate);
                        totalAmount += itemRate;
                    });
                    $('#item_modal_total_amount').text(totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                } else {
                    // Handle empty items array
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}
//load item details per nature
$("body").on('click', '#item_addition, #item_deduction, #item_contribution', function (e) {
    clickedRowContext = this;
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var payroll_id = parts[parts.length - 1]; //


    var closestRow = $(this).closest('tr');
    currentRowData = {
        statusCell: closestRow.find('td:eq(11)'),
        employee_id: closestRow.find('td:eq(1)').text(),
        tax: parseFloat(closestRow.find('.gettax').val()) || 0,
        hours: parseFloat(closestRow.find('.gethours').val()) || 1,
        late: parseFloat(closestRow.find('.getlate').val()) || 0
    };

    let user_id = $(this).data('user_id');
    global_user_id=user_id;
    let nature = $(this).data('nature');
    global_nature=nature;


    load_payroll_items(global_user_id,global_payroll_id,global_nature);

});

function load_payroll_items(user_id,payroll_id,nature){
    $.ajax({
        url: bpath + 'payroll/setup/loademp_items/nature',
        type: "GET",
        data: {
            _token: _token,
            user_id: user_id,
            payroll_id:payroll_id,
            nature:nature
        },
        success: function (data) {
            $('#item_modal_title').text(nature);

            $('#item_modal_total').text('Total ' + nature);


            try {
                var parsedData = JSON.parse(data);
                if(parsedData.items.length > 0) {

                var prItemsContainer = $('#pr_items_summary');
                prItemsContainer.empty(); // Clear existing content
                var totalAmount = 0.00;
                var items = parsedData.items;
                items.forEach(function(item) {
                    var itemID = item.item_id;
                    var id = item.id
                    var itemRate = parseFloat(item.rate);
                    var itemName = item.name;
                    var itemNature = item.nature
                    var itemHtml = '';
                    totalAmount += itemRate;
                    // Create HTML for each item
                        itemHtml =
                        // ' <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#item-details-modal" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">'+
                        // '<div class="max-w-[50%] truncate mr-1">' + itemName + '</div>'+
                        // '<div class="text-slate-500"></div>'+
                        // ''+
                        // '<div class="ml-auto font-medium">'+itemRate.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})+'</div>'+
                        // '</a>';

                        '<div class="flex items-center justify-between pb-3">' +
                        '<div class="max-w-[50%] truncate mr-1">' + itemName + '</div>' +
                        '<div class="text-slate-500"></div>' +
                        '<a href="javascript:;" data-tw-toggle="modal" data-tw-target="#item-details-modal"><i class="fa-regular fa-pen-to-square w-4 h-4 text-slate-500 ml-2"></i></a>' +
                        '<div class="input-group ml-auto">' +
                            '<div class="input-group-text">₱</div>' +
                            '<input type="text" id="item_modal_rate_amount" data-item_name="'+itemName+'" class="form-control min-w-[2rem]" placeholder="Amount" value="'+itemRate.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})+'" style="text-align: right">' +
                        '</div>' +
                        '</div>';

                    // Append the item HTML to the container
                    prItemsContainer.append(itemHtml);

                });
                $('#item_modal_total_amount').text(totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
                }else{
                    var prItemsContainer = $('#pr_items_summary');
                    prItemsContainer.empty(); // Clear existing content
                    var itemHtml = '';

                    // Create HTML for each item
                    itemHtml =
                    '<a class="flex items-center justify-between p-3">' +
                    '<div class="max-w-[50%] truncate mr-1">--- No Item ---</div>' +
                    '<div class="text-slate-500"></div>' +
                    '<div class="input-group ml-auto">' +
                    '<div class="input-group-text">₱</div>' +
                    '<input type="text" class="form-control min-w-[6rem] disabled" placeholder="Amount" disabled>' +
                    '</div>' +
                    '</a>';

                    // Append the item HTML to the container
                    prItemsContainer.append(itemHtml);
                    $('#item_modal_total_amount').text('0.00');
                }


            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        },
        error: function (error) {
            // Handle the error
            console.error('Error:', error);
        }
    });
}

//on click salary
$("body").on('click', '#a_salary', function (e) {
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var payroll_id = parts[parts.length - 1]; //

    let user_id = $(this).data('user_id');
    global_user_id=user_id;
    let nature = $(this).data('nature');
    global_nature=nature;

    let hourly = $(this).data('hourly');
    let pr_header = $(this).data('pr_header');
    let bsalary = $(this).data('bsalary');
    let step = $(this).data('pr_step');
    let sg = $(this).data('pr_sg');
    let pr_rate = $(this).data('pr_rate');

    $('#modal_update_to_id').val(pr_header);


    if (hourly===null){
        $(".Div1").hide();
        $(".Div2").hide();
        $(".Div3").show();
        $('#emp_class').val(3);

        if(step!==null){
            $(".Div1").show();
            $(".Div2").hide();
            $(".Div3").hide();
            $('#emp_class').val(1)
            $('#step').val(step);
            $('#sg').val(sg);
            $('#amount1').val(bsalary);
        }

        $('#amount3').val(bsalary);
    }else{
        $('#emp_class').val(2);
        $('#amount2').val(bsalary);
        $('#rate_class').val(pr_rate);
        $(".Div1").hide();
        $(".Div2").show();
        $(".Div3").hide();
    }

});

// on click salary save
$('body').on('click','.add_salary',function (e){

    let choice = $('#emp_class').val();
    let rate_id = $('#rate_class').val();


    let sg=$('#sg').val();
    let step=$('#step').val();
    let amount='';

    if(choice==='1'){
        amount=$('#amount1').val();
        rate_id='';
    }else if(choice==='2'){
        amount=$('#amount2').val();
        sg='';
        step='';
        let rate_id = $('#rate_class').val();
    }else if(choice==='3'){
        amount=$('#amount3').val();
        sg='';
        step='';
        rate_id='';
    }


    $.ajax({
        url:"/payroll/payroll/header/update",
        datatype:'JSON',
        method:'POST',
        data:{
            emp_id:global_user_id,
            sg:sg,
            step:step,
            amount:amount,
            choice:choice,
            pr_id:global_payroll_id,
            rate_id:rate_id
        },
        success:function (res){
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_salary"));
            mdl.hide();
            __notif_show(1, 'Success', 'Salary Was Updated Successfully!');
            load_payroll_details();
            calculate_sal();

        },error:function (err){
            console.log(err)
        }
    });



});

//on click gross salary
$("body").on('click', '#g_salary', function (e) {
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var payroll_id = parts[parts.length - 1]; //

    let user_id = $(this).data('user_id');
    global_user_id=user_id;

    let amount = $(this).data('amount');
    console.log(amount);
    let pr_header = $(this).data('pr_header');

    $('#amount_gross').val(amount);
    clickedRowContext = this;

});


$('body').on('click','.gross_salary_save',function (e){

    let  amount=$('#amount_gross').val();
    if (amount>=0){
        $.ajax({
            url:"/payroll/payroll/header/update/gross",
            datatype:'JSON',
            method:'POST',
            data:{
                emp_id:global_user_id,
                amount:amount,
                pr_id:global_payroll_id,
                _token: _token,
            },
            success:function (res){
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#set_gross"));
                mdl.hide();
                __notif_show(1, 'Success', 'Gross Salary Was Updated Successfully!');
                load_payroll_details(global_payroll_id, calculate_sal);

            },error:function (err){
                console.log(err)
            }
        });

    }
});

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

//select employee class

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

$("#emp_class").change(function(){
    empclass_toshow();
});


$('#set_salary').on( 'keyup', '#sg', function () {
    loadsalary_sg();
});

$('#set_salary').on( 'keyup', '#step', function () {
    loadsalary_sg();
});

function loadsalary_sg(){
    var step_id = $('#step').val();
    var tranch_id = $('#sg').val();
    var theElement = $('#amount1');

    $.ajax({
        url: bpath + 'payroll/setup/getsalary',
        type: "POST",
        data: {
            'sg':tranch_id,
            'step':step_id,
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
}


//preview to delete
$("body").on('click', '#preview_delete_emp', function (e) {
    var currentURL = window.location.href;
    var parts = currentURL.split('/'); // Split the URL by "/"
    var payroll_id = parts[parts.length - 1]; //

    var user_id = $(this).data('user-id');
    global_user_id= user_id;
});

//confirm to delete
$('#confirm_delete_emp').click(function (){

    $.ajax({
        url:"/payroll/payroll/delete/employee",
        method:'post',
        data:{user_id:global_user_id,payroll_id:global_payroll_id},
        success:function (response){
            if (response.success) {
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-emp-preview"));
                mdl.hide();
                load_payroll_details();
                __notif_show(1, 'Success', 'Employee was successfully removed!');
            }else{
                __notif_show(-3, 'Error', 'An error occurred.');
            }
        },error:function (err){
            console.log(err)
            __notif_show(-3, 'Error', err);
        }
    });
})

//load payroll details
function load_payroll_details(id, callback) {
    var currentURL = window.location.href;
    var parts = currentURL.split('/');
    var numberString = parts[parts.length - 1];

    $.ajax({
        url: bpath + 'payroll/payroll/details/load',
        type: "POST",
        data: {
            id: numberString,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function (data) {
            tbldata_pr_details.clear().draw();
            console.log(data);

            var data = JSON.parse(data);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var id = data[i]['id'];
                    var user_id = data[i]['user_id'];
                    var user_name = data[i]['user_name'];
                    var gsalary = data[i]['gsalary'];
                    var bsalary = data[i]['bsalary'];
                    var hourly = data[i]['hourly'];
                    var manage = data[i]['manage'];
                    var addition = data[i]['addition'];
                    var deduction = data[i]['deduction'];
                    var contribution = data[i]['contribution'];
                    var taxes = data[i]['taxes'];
                    var net = data[i]['net'];
                    var pr_header_id = data[i]['pr_header_id'];
                    var pr_header_hourly = data[i]['pr_header_hourly'];
                    var pr_step = data[i]['pr_step'];
                    var pr_sg = data[i]['pr_sg'];
                    var pr_rate = data[i]['pr_rate'];
                    var late = data[i]['late'];

                    console.log(pr_rate);
                    var tax_input = '';
                    if (pr_rate !== null) {
                        tax_input = '<div> <input id="taxes_' + user_id + '" type="text" value="' + taxes + '" class="form-control gettax disabled" style="text-align: right" disabled></div>';
                    } else {
                        tax_input = '<div><input id="taxes_' + user_id + '" type="text" value="' + taxes + '" class="form-control gettax" style="text-align: right"></div>';
                    }

                    var cd = '';
                    cd = '' +
                        '<tr>' +
                        '<td class="hidden">' + id + '</td>' +
                        '<td class="hidden">' + user_id + '</td>' +
                        '<td>' + user_name + '</td>' +
                        '<td style="text-align: right"> <a id="a_salary" href="javascript:;" data-tw-toggle="modal" data-tw-target="#set_salary"' +
                        'data-user_id="' + user_id + '"' +
                        'data-hourly="' + pr_header_hourly + '"' +
                        'data-bsalary="' + bsalary + '"' +
                        'data-pr_header="' + pr_header_id + '"' +
                        'data-pr_step="' + pr_step + '"' +
                        'data-pr_sg="' + pr_sg + '"' +
                        'data-pr_rate="' + pr_rate + '"' +
                        'class="text-secondary block font-normal">' + bsalary + '</a> ' +
                        '</td>' +
                        '<td>' + hourly + '</td>' +
                        '<td style="text-align: right"> <a id="g_salary" href="javascript:;" data-tw-toggle="modal" data-tw-target="#set_gross"' +
                        'data-user_id="' + user_id + '"' +
                        'data-pr_header="' + pr_header_id + '"' +
                        'data-amount="' + gsalary + '"' +
                        'class="text-secondary block font-normal">' + gsalary + '</a> ' +
                        '</td>' +
                        '<td>' + late + '</td>' +
                        '<td style="text-align: right"> <a id="item_addition" href="javascript:;" data-tw-toggle="modal" data-tw-target="#item_modal"' +
                        'data-user_id="' + user_id + '"' +
                        'data-nature="Addition"' +
                        'class="text-primary block font-normal">' + addition + '</a> ' +
                        '</td>' +
                        '<td style="text-align: right"> <a id="item_deduction" href="javascript:;" data-tw-toggle="modal" data-tw-target="#item_modal"' +
                        'data-user_id="' + user_id + '"' +
                        'data-nature="Deduction"' +
                        'class="text-danger block font-normal">' + deduction + '</a> ' +
                        '</td>' +
                        '<td style="text-align: right"> <a id="item_contribution" href="javascript:;" data-tw-toggle="modal" data-tw-target="#item_modal"' +
                        'data-user_id="' + user_id + '"' +
                        'data-nature="Contribution"' +
                        'class="text-secondary block font-normal">' + contribution + '</a> ' +
                        '</td>' +
                        '<td>' + tax_input + '</td>' +
                        '<td id="netsalary" style="text-align: right">' + net + '</td>' +
                        '<td class="loading-cell" style="text-align: center">' + manage + '</td>' +
                        '<td class="loading-cell" style="text-align: center">' +
                        '<a href="javascript:;" data-user-id="' + user_id + '" data-tw-toggle="modal" data-tw-target="#delete-emp-preview" id="preview_delete_emp"><i class="fa-solid fa-trash-can"></i></a>' +
                        '</td>' +
                        '</tr>';
                    tbldata_pr_details.row.add($(cd)).draw();
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

var salCalculationInProgress = false;

const debouncedCalculateSal = _.debounce(calculate_sal, 1000);


//new
$('#dt_payroll_details').on('keydown blur', '.gettax, .gethours, .getlate', function(event) {
    var statusCell = $(this).closest('tr').find('td:eq(11)');

    if (event.type === 'blur' || (event.type === 'keydown' && (event.keyCode === 13 || event.keyCode === 9))) {
        // Display loading animation before making the AJAX call
        statusCell.html('<i class="fas fa-spinner fa-spin"></i>');
        var closestRow = $(this).closest('tr');
        currentRowData = {
            statusCell: closestRow.find('td:eq(11)'),
            employee_id: closestRow.find('td:eq(1)').text(),
            tax: parseFloat(closestRow.find('.gettax').val()) || 0,
            hours: parseFloat(closestRow.find('.gethours').val()) || 1,
            late: parseFloat(closestRow.find('.getlate').val()) || 0
        };
        debouncedCalculateSal.call(this);
    } else {
        // Show loading animation while typing

    }
});

function calculate_sal() {
    if (!currentRowData) return; // No data to process

    var statusCell = currentRowData.statusCell;
    var employee_id = currentRowData.employee_id;
    var tax = currentRowData.tax;
    var hours = currentRowData.hours;
    var late = currentRowData.late;
    var currentURL = window.location.href;
    var parts = currentURL.split('/');
    var pr_id = parts[parts.length - 1];

    if (!isNaN(tax) && !isNaN(hours) && !salCalculationInProgress) {
        salCalculationInProgress = true;

        $.ajax({
            url: bpath + 'payroll/payroll/calculate_salary',
            type: "POST",
            data: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                employee_id: employee_id,
                tax: tax,
                hours: hours,
                pr_id: pr_id,
                late: late
            },
            beforeSend: function() {
                // Display "saving..." before the request is sent
                statusCell.html('Saving...');
            },
            success: function(data) {
                setTimeout(function() {
                    statusCell.html('<i class="fas fa-check text-success"></i>');
                    // Trigger blur event on the input after success
                    load_payroll_details();
                }, 1000); // 1 second delay
            },
            error: function(err) {
                setTimeout(function() {
                    statusCell.html('<i class="fas fa-times text-danger"></i>');
                    // Trigger blur event on the input after error
                }, 1000); // 1 second delay
            },
            complete: function() {
                salCalculationInProgress = false;
            }
        });
    }
}



$('#add-new-item-link').on('click', function() {
    if(global_user_id){
        load_items(global_user_id);
        pr_item.val(null).trigger('change');
        var amountInput = $('#item_amount');
        amountInput.val('');
    }else{
    }

});

$('#exportButton').on('click', function(e) {
    e.preventDefault(); // Prevent default form submission or link behavior

    // Extract the numberString from the URL
    var currentURL = window.location.pathname; // Get the path part of the URL
    var parts = currentURL.split('/'); // Split the path by "/"
    var numberString = parts[parts.length - 1]; // The last part is the numberString

    // Create a hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    // Set the source of the iframe to the export URL
    iframe.src = bpath + 'payroll/export?_token=' + _token + '&numberString=' + numberString;

    // Append the iframe to the document
    document.body.appendChild(iframe);

    // Wait for the file to be downloaded, then remove the iframe
    iframe.onload = function() {
        document.body.removeChild(iframe);
        console.log('Excel file exported successfully.');
    };
});


$('#exportButtonPT').on('click', function(e) {
    e.preventDefault(); // Prevent default form submission or link behavior

    // Extract the numberString from the URL
    var currentURL = window.location.pathname; // Get the path part of the URL
    var parts = currentURL.split('/'); // Split the path by "/"
    var numberString = parts[parts.length - 1]; // The last part is the numberString

    // Create a hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    // Set the source of the iframe to the export URL
    iframe.src = bpath + 'payroll/export/pt?_token=' + _token + '&numberString=' + numberString;

    // Append the iframe to the document
    document.body.appendChild(iframe);

    // Wait for the file to be downloaded, then remove the iframe
    iframe.onload = function() {
        document.body.removeChild(iframe);
        console.log('Excel file exported successfully.');
    };
});

$('#exportButtonCOS').on('click', function(e) {
    e.preventDefault(); // Prevent default form submission or link behavior

    // Extract the numberString from the URL
    var currentURL = window.location.pathname; // Get the path part of the URL
    var parts = currentURL.split('/'); // Split the path by "/"
    var numberString = parts[parts.length - 1]; // The last part is the numberString

    // Create a hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    // Set the source of the iframe to the export URL
    iframe.src = bpath + 'payroll/export/cos?_token=' + _token + '&numberString=' + numberString;

    // Append the iframe to the document
    document.body.appendChild(iframe);

    // Wait for the file to be downloaded, then remove the iframe
    iframe.onload = function() {
        document.body.removeChild(iframe);
        console.log('Excel file exported successfully.');
    };
});

