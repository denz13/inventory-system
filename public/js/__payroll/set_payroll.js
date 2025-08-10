var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function() {

    bpath = __basepath + "/";

    Select2_setInstance();

});

function Select2_setInstance(){

    $('.payroll_employee').select2({
        placeholder: 'Select Employee',
        closeOnSelect: true,
    })

    $('.payroll_position').select2({
        placeholder: 'Select Position',
        closeOnSelect: true,
    })

    $('.payroll_designation').select2({
        placeholder: 'Select Designation',
        closeOnSelect: true,
    })

    $('.payroll_emp_status').select2({
        placeholder: 'Select Employee Status',
        closeOnSelect: true,
    })

    $('.payroll_emp_rank').select2({
        placeholder: 'Select Employee Rank',
        closeOnSelect: true,
    })

    $('.payroll_tranch').select2({
        placeholder: 'Select Salary Grade',
        closeOnSelect: true,
    })

    $('.payroll_agency').select2({
        placeholder: 'Select Agency',
        closeOnSelect: true,
    })

    $('.payroll_sal_type').select2({
        placeholder: 'Select Salary Type',
        closeOnSelect: true,
    })

    $('.payroll_salary').select2({
        placeholder: 'Select Salary',
        closeOnSelect: true,
    })

    $('.payroll_office_dept').select2({
        placeholder: 'Select Office/Department',
    });

    $('.payroll_assignment_status').select2({
        placeholder: 'Select Assignment Status',
    });

    $('.payroll_has_tax_exempt').select2({});

    // $('.payroll_has_tax_exempt').select2({
    //     placeholder: 'Select Salary',
    //     closeOnSelect: true,
    // })

}

function save_payroll_info(){

    $('body').on('click', '#mdl_btn_save_payroll_info', function (){



    });

}
