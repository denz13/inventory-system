//Function for Toggling Document Details
function docDetails(docID){

    base_url = window.location.origin;

    swal({
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"><div>'+
                '<div class="p-5">'+
                    '<div class="p-5 image-fit zoom-in">'+
                    '<div id="qrcode" class="mt-4 flex justify-center rounded-md">' +
                '</div>'+
            '</div>'+
            '<div class="text-slate-600 dark:text-slate-500 mt-5">'+
                '<div class="flex items-center"> <i data-lucide="link" class="w-4 h-4 mr-2"></i> Tracking Number: <span class="ml-2">'+docID+'</span> ' +
            '</div>'+
            // '<div class="flex items-center mt-2"> <i data-lucide="layers" class="w-4 h-4 mr-2"></i> Recipient: 40 person(s) </div>'+
            '<div class="flex items-center mt-2"> <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> Status: Ongoing </div>'+
            '</div>'+
            '</div>'+
            '<div class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">'+
            '<a class="flex items-center text-primary mr-auto" href="'+base_url+'/track/doctrack/'+docID+'" target="_blank"> <i class="fa fa-map-marked w-4 h-4 mr-2 text-primary"></i> Track </a>'+
            '<a id="print_QR" class="flex items-center mr-3" href="'+base_url+'/print-qr/'+docID+'" target="_blank"> <i class="fa fa-print w-4 h-4 mr-2 text-primary"></i> Print </a>'+
            '</div>'+
            '</div>'+
            '</div>',
    });


    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: docID,
        // text: base_url +'/track/doctrack/'+docID,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}
