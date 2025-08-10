
$(document).ready(function() {

    __notif_load_data(__basepath + "/");

});

function __notif_show(code = 0, title = "", content = "") {
	try{

		/*
		STYLE CODE:
			> 0   : SUCCESS
			== -1 : WARNING
			< -1  : DANGER
		*/

		if(title.trim() != "" || content.trim() != "") {

			var src = $('#__notif_content_src');
			var id = "#__notif_content";


			var tc = '' +
					    '<div id="__notif_content" class="toastify-content hidden flex">' +
					    '	<div class="font-medium">' + content + '<a class="font-medium text-primary dark:text-slate-400 mt-1 sm:mt-0 sm:ml-40" href=""></a>' +
					    '</div>' +
					 '';

			if(code > 0) {
				tc = '' +
				     '<div id="__notif_content" class="toastify-content hidden flex"> <i class="far fa-check-circle notif_icon_1 text-success"></i>' +
				     '	<div class="ml-4 mr-4">' +
				     '		<div class="font-medium">' + title + '</div>' +
				     '		<div class="text-slate-500 mt-1">' + content + '</div>' +
				     '	</div>' +
				     '</div>' +
				 	 '';
			}
			if(code < -1) {
				tc = '' +
				     '<div id="__notif_content" class="toastify-content hidden flex"> <i class="far fa-times-circle notif_icon_1 text-danger"></i>' +
				     '	<div class="ml-4 mr-4">' +
				     '		<div class="font-medium">' + title + '</div>' +
				     '		<div class="text-slate-500 mt-1">' + content + '</div>' +
				     '	</div>' +
				     '</div>' +
				 	 '';
			}
			if(code == -1) {
				tc = '' +
				     '<div id="__notif_content" class="toastify-content hidden flex"> <i class="fas fa-exclamation-triangle notif_icon_1 text-warning"></i>' +
				     '	<div class="ml-4 mr-4">' +
				     '		<div class="font-medium">' + title + '</div>' +
				     '		<div class="text-slate-500 mt-1">' + content + '</div>' +
				     '	</div>' +
				     '</div>' +
				 	 '';
			}

            if(code == -2) {
                tc = '' +
                    '<div id="__notif_content" class="toastify-content hidden flex"> <i class="fa-solid fa-file-circle-exclamation notif_icon_1 text-warning"></i>' +
                    '	<div class="ml-4 mr-4">' +
                    '		<div class="font-medium">' + title + '</div>' +
                    '		<div class="text-slate-500 mt-1">' + content + '</div>' +
                    '	</div>' +
                    '</div>' +
                    '';

        }

			//src.html(tc);

		    Toastify({ node: $(tc) .clone() .removeClass(
		        "hidden")[0],
		        duration: 3000,
		        newWindow: true,
		        close: true,
		        gravity: "top",
		        position: "right",
		        backgroundColor: "#fff",
		        stopOnFocus: true,
		    }).showToast();

		    //src.html("");

		}


	}catch(err){  }
}

function __notif_load_data(bpath = "") {
	try{
		$.ajax({
		url: bpath + 'getnotif',
		type: "GET",
		data: {},
		success: function(data) {
			try{
				var cd = JSON.parse(data);
				var code = parseInt(cd['code']);
				var ttl = cd['title'];
				var cont = cd['content'];
				__notif_show(code,ttl,cont);
			}catch(err){  }
		},
		error: function() {
			try{

			}catch(err){}
		}

		});
	}catch(err){  }
}

function __validateAndHighlightInputs(modal) {
    let modal_input = modal+' input';
    let modal_select = modal+' select';
    const inputs = document.querySelectorAll(modal_select+','+modal_input);
    let allInputsSelected = true;

    inputs.forEach(input => {
        // Check for blank or null values
        if (!input.value.trim() && input.tagName.toLowerCase() !== 'select') {
            allInputsSelected = false;
            input.classList.add('highlight-red');
        } else if (input.tagName.toLowerCase() === 'select' && input.value.length === 0) {
            var placeholder = document.getElementById(input.id).getAttribute("placeholder")
            var multiple = document.getElementById(input.id).getAttribute("multiple")

            allInputsSelected = false;

            if(multiple!==null){
                $('#'+input.id).select2({
                    theme: "mali",
                    placeholder:placeholder,
                });
            }else{

                $('#'+input.id).select2({
                    theme: "error",
                    placeholder:placeholder,
                });
            }

        } else {
            input.classList.remove('highlight-red');
        }
    });
    if(!allInputsSelected){
        __notif_show(-1, 'Warning', 'Please fill all required fields!');
    }
    return allInputsSelected;
}

function __clearInputs(modal) {
    let modal_input = modal+' input';
    let modal_select = modal+' select';
    const inputs = document.querySelectorAll(modal_select+','+modal_input);

    inputs.forEach(input => {
        if (input.tagName.toLowerCase() !== 'select') {
            let input_element = $('#'+input.id);
            input_element.val("");
            input.classList.remove('highlight-red');
        } else if (input.tagName.toLowerCase() === 'select') {
            var placeholder = document.getElementById(input.id).getAttribute("placeholder")
            input_s = $('#'+input.id).select2({
                theme: "default",
                placeholder:placeholder,
            });
            input_s.val(null).trigger('change');
        } else {

        }
    });

}
