$( document ).ready(function() {
  //__uniuploadINIT("../");
});

var __uniupload_basepath = "";
var __uniupload_file_input;
var __uniupload_token = $('meta[name="csrf-token"]').attr('content');

function __uniuploadINIT(basepath = "") {

  var inputs;
  var parent = $('.uniupload');
  var e_prev = parent.children(".preview");
  var data_type = "single"; /*single / multiple*/
  var dropRegion;
  var file_input;

  __uniupload_basepath = basepath;

  /*
  parent.children(".preview").each(function(){
    e_prev = $(this);
    alert(1);
  });
  */


  try{

    data_type = parent.attr('data-type');
    try{
      if(data_type == null || data_type == "undefined") {
        data_type = "single";
      }
      if(data_type.trim() == "") {
        data_type = "single";
      }
      if(data_type.trim().toLowerCase() != "single" && data_type.trim().toLowerCase() != "multi" && data_type.trim().toLowerCase() != "multiple") {
        data_type = "single";
      }
    }catch(err){}
    try{
      if(data_type.trim().toLowerCase() == "multi") {
        data_type = "multiple";
      }
    }catch(err){}

    parent.find('.preview').each(function(){
      e_prev = $(this);
    });

    parent.find('.trigger').each(function(){
      dropRegion = this;
    });

    dropRegion.addEventListener('dragenter', __uniupload_preventDefault, false);
    dropRegion.addEventListener('dragleave', __uniupload_preventDefault, false);
    dropRegion.addEventListener('dragover', __uniupload_preventDefault, false);
    dropRegion.addEventListener('drop', __uniupload_preventDefault, false);
    dropRegion.addEventListener('drop', __uniupload_handleDrop, false);

    inputs = parent.find('input:file').each(function(e){
      //var id = $(this).attr('id');
      //$('#' + id).trigger('click');
      //$(this).on('click')
      //alert($(this).attr('id'));
      file_input = this;
      __uniupload_file_input = this;
      try{
        //$(this).trigger('click');
      }catch(err){}

      try{
        $(this).on('change', function() {
          var file = this.files[0];
          /*
          var src = URL.createObjectURL(file);
          var cont = '<img class="img_preview" src="' + src + '" />';
          if(__uniupload_is_multiple(data_type)) {
            var tc = e_prev.html();
            tc = tc + cont;
            e_prev.html(tc);
          }else{
            e_prev.html(cont);
          }
          */
          __uniupload_load_preview(file);
          __uniupload_element_hide_by_class(parent, '.info', false)
        });
      }catch(err){  }
      
    });
    
    $('.uniupload').on('click', function(){
      var parent = $(this);
      /*
      var inputs = parent.find('input:file');
      try{
        inputs[0].trigger('click');
      }catch(err){}
      */
      
      try{
        //$('#uniupload_file-upload').trigger('click');
      }catch(err){}
      
    });

  }catch(err){}


  function __uniupload_load_preview(file) {
    var src = URL.createObjectURL(file);
    if(__uniupload_validateImage(file)) {
      src = URL.createObjectURL(file);
    }else{
      src = basepath + "img/icon_file.png";
    }
    var cont = '<img class="img_preview" src="' + src + '" />';
    if(__uniupload_is_multiple(data_type)) {
      var tc = e_prev.html();
      tc = tc + cont;
      e_prev.html(tc);
    }else{
      e_prev.html(cont);
    }
  }

  function __uniupload_element_hide_by_class(parent, classname, show = false) {

    parent.find('' + classname).each(function(){
      var t = $(this);
      if(show) {
        t.removeClass('hidden');
      }else{
        t.removeClass('hidden');
        t.addClass('hidden');
      }
    });

  }

  function __uniupload_is_multiple(datatype) {
    var result = false;
    if(datatype.trim().toLowerCase() == "multi".trim().toLowerCase() || datatype.trim().toLowerCase() == "multiple".trim().toLowerCase()) {
      result = true;
    }
    return result;
  }

  function __uniupload_preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function __uniupload_handleDrop(e) {
    //alert(1);
    var data = e.dataTransfer,
    files = data.files;
    file_input.files = data.files;
    //handleFiles(files)
    __uniupload_load_preview(files[0]);
    __uniupload_element_hide_by_class(parent, '.info', false)
  }

  function __uniupload_validateImage(file) {
    // check the type
    var validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/bmp', 'image/svg', 'image/ico', 'image/webp'];
    if (validTypes.indexOf( file.type ) === -1) {
      //alert("Invalid File Type");
      return false;
    }

    // check the size
    /*
    var maxSizeInBytes = 10e6; // 10MB
    if (file.size > maxSizeInBytes) {
      alert("File too large");
      return false;
    }
    */

    return true;
  }

  function uploadFile(url) {
    try{
      alert(basepath + url);
      return;
      var fd = new FormData();
      var files = file_input.files;
      fd.append('file',files[0]);
      $.ajax({
        type: 'POST',
        url: basepath + url,
        data: new FormData(this),
        dataType: 'json',
        contentType: false,
        cache: false,
        processData:false,
        beforeSend: function(){

        },
        success: function(response){
          console.log(response);
        }
      });
    }catch(err){}
  }

}

function __uniupload_uploadFile(url, edata, token) {
  try{
    var basepath = __uniupload_basepath;
    var file_input = __uniupload_file_input;
    token = __uniupload_token;
    //alert(token);
    /***/
    //var fd = new FormData();
    var files = file_input.files;
    //fd.append('file',files[0]);

    //var dataURL = canvas.toDataURL('image/jpeg', 1.0)
    //var blob = dataURItoBlob(dataURL)
    var formData = new FormData();
    formData.append('_token', token);
    formData.append('access_token', token);
    formData.append('file', files[0]);
    formData.append('edata', edata);

    if(edata != null && edata != "undefined") {
      edata.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
          formData.append('' + key, item[key]);
        });
      });
    }


    $.ajax({
    url: basepath + url,
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      //console.log(response);
    },
    error: function(response) {
      try{
        //console.log(response);
      }catch(err){}
    }

});

    /*
    $.ajax({
      type: 'POST',
      url: basepath + url,
      data: {
        _token: token,
        "_token": token,
        file:files[0],
      },
      dataType: 'json',
      contentType: false,
      cache: false,
      processData:false,
      beforeSend: function(){

      },
      success: function(response){
        console.log(response);
      },
      error: function(response) {
        console.log(response);
      }
    });
    */
  }catch(err){  }
}


/*
// File Upload
// 
function uniupload_Upload(){
  function Init() {

    console.log("Upload Initialised");

    var fileSelect    = document.getElementById('uniupload_file-upload'),
        fileDrag      = document.getElementById('uniupload_file-drag'),
        submitButton  = document.getElementById('uniupload_submit-button');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // File Drop
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('uniupload_file-drag');

    e.stopPropagation();
    e.preventDefault();

    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'uniupload_file-upload');
  }

  function fileSelectHandler(e) {
    // Fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);

    // Process all File objects
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
      //uploadFile(f);
    }
  }

  // Output
  function output(msg) {
    // Response
    var m = document.getElementById('uniupload_messages');
    m.innerHTML = msg;
  }

  function parseFile(file) {

    console.log(file.name);
    output(
      '<strong>' + encodeURI(file.name) + '</strong>'
    );
    
    // var fileType = file.type;
    // console.log(fileType);
    var imageName = file.name;

    var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
    if (isGood) {
      document.getElementById('uniupload_start').classList.add("hidden");
      document.getElementById('uniupload_response').classList.remove("hidden");
      document.getElementById('uniupload_notimage').classList.add("hidden");
      // Thumbnail Preview
      document.getElementById('uniupload_file-image').classList.remove("hidden");
      document.getElementById('uniupload_file-image').src = URL.createObjectURL(file);
    }
    else {
      document.getElementById('uniupload_file-image').classList.add("hidden");
      document.getElementById('uniupload_notimage').classList.remove("hidden");
      document.getElementById('uniupload_start').classList.remove("hidden");
      document.getElementById('uniupload_response').classList.add("hidden");
      document.getElementById("uniupload_file-upload-form").reset();
    }
  }

  function setProgressMaxValue(e) {
    var pBar = document.getElementById('uniupload_file-progress');

    if (e.lengthComputable) {
      pBar.max = e.total;
    }
  }

  function updateFileProgress(e) {
    var pBar = document.getElementById('uniupload_file-progress');

    if (e.lengthComputable) {
      pBar.value = e.loaded;
    }
  }

  function uploadFile(file) {

    var xhr = new XMLHttpRequest(),
      fileInput = document.getElementById('uniupload_class-roster-file'),
      pBar = document.getElementById('uniupload_file-progress'),
      fileSizeLimit = 1024; // In MB
    if (xhr.upload) {
      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 1024 * 1024) {
        // Progress bar
        pBar.style.display = 'inline';
        xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
        xhr.upload.addEventListener('progress', updateFileProgress, false);

        // File received / failed
        xhr.onreadystatechange = function(e) {
          if (xhr.readyState == 4) {
            // Everything is good!

            // progress.className = (xhr.status == 200 ? "success" : "failure");
            // document.location.reload(true);
          }
        };

        // Start upload
        xhr.open('POST', document.getElementById('uniupload_file-upload-form').action, true);
        xhr.setRequestHeader('X-File-Name', file.name);
        xhr.setRequestHeader('X-File-Size', file.size);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(file);
      } else {
        output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
      }
    }
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    document.getElementById('uniupload_file-drag').style.display = 'none';
  }
}
uniupload_Upload();
*/