var _token = $('meta[name="csrf-token"]').attr("content");

$(document).ready(function () {
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
        url: bpath + "saln/load/saln/completed",
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
                                    
                                </div>
                            </td>
                        </tr>`;

                    dt__created_saln.row.add($(cd)).draw();
                }
            }
        },
    });
}
