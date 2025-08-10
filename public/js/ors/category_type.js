const ors_category_modal = tailwind.Modal.getInstance(document.querySelector("#ors_category_modal"));
const delete_category_type = tailwind.Modal.getInstance(document.querySelector("#delete-modal-ors"));
const add_category_type = tailwind.Modal.getInstance(document.querySelector("#ors_category_modal"));

var category_id = {GLobalCategoryId:''};
$(document).ready(function(){

    bpath = __basepath + "/";

    intializeCategoryName();
    appendCategoryType();
    savedCategoryData();
    displayCategoryType();
    categoryEdit();
    removeCategory();
    cancelCategoryModal();
    // getCategoryData();
    // openAddCategory();
    openThemeCategoryAdd();
});

/*========================================== Initialization ======================================================*/

function intializeCategoryName()
{
    $("#category_type").select2({
        placeholder: "Select the type of category",
        closeOnSelect: true,
        allowClear:true,
    });
}

/*========================================== END:Initialization ======================================================*/

//get the data in the table
function getData()
{
    try
    {
        let temp_category_data = [];


        $("#tb_category_type tr").each(function(i){

            let id = $(this).find("td #category_id").text();
                color = $(this).find("td #color").text();

            if((color!==null && color!=='') && (id!==null && id!==''))
            {
                let data = {
                    id:id,
                    color:color
                };

                temp_category_data.push(data);
            }
        });

        return temp_category_data;

    }catch(error)
    {
        console.log(error.message);
    }
}

//clear fields
function clearCategory()
{
    $("#category_type").val(null).trigger("change");
    $("#category_color").val("#ff0000");
    $("#tb_category_type tbody").empty();
}

//check if the table is not empty
function checkCategoryTable()
{
    let tb = $("#tb_category_type tr").length;

    if(tb > 1)
    {
        return true;

    } else
    {
        __notif_show(-1,'','Please fill the fields');
         return false;
    }
}

//append the data
function appendCategoryData(color,id)
{
    try
    {
        let cd = '';

            cd = `<tr id="category_type_tr">
                        <td hidden><label id="category_id" class="category_id text-center">${id}</label></td>
                        <td class="text-center"><label id="color" class="text-center">${color}</label></td>
                        <td id="btn_remove_category" class="text-danger text-center" data-id=""><button><i class="fa-solid fa-trash"></i></button></td>
                  </tr>`;

            $("#tb_category_type").append(cd);
            $("#category_type").val(null).trigger("change");

    }catch(error)
    {
        console.log(error.message);
    }
}

//append the data in the table
function appendCategoryType()
{
    $("#btn_add_category").on("click",function(){

            let
                color = $("#category_color").val(),
                id = $("#categorytype_id").val();

                if(color!==null || color!=='')
                {
                    if(id.trim() === null || id.trim() === '')
                    {
                        id = 0;
                    }
                    appendCategoryData(color,id);
                }
    });
}

//removed the category
function removeCategory()
{
    $("body").on("click","#btn_remove_category",function(){

        let id = $(this).closest('tr').find('td #category_id').text();

        if(id !== '0' && id !== '')
        {
            delete_category_type.show();

            $("#btn_delete_ors").on("click",function(){
                deleteCategory(id);
                delete_category_type.hide();
            });

        }
        else
        {
            $(this).closest('tr').remove();
        }
    });
}

//click the category to edit
function categoryEdit()
{
    $("body").on("click","#category_type_tr",function(){

        let type = $(this).find("td #type").text(),
            color = $(this).find("td #color").text(),
            id = $(this).find("td #category_id").text();

        $("#category_type").val(type).trigger("change");
        $("#category_color").val(color);
        $("#categorytype_id").val(id);

        //remove the data
        $(this).remove();
    });
}

//cancel the category
function cancelCategoryModal()
{
    $("#btn_cancel_category_type").on("click",function(){
        clearCategory();
    });
}

//saved the category data
function savedCategoryData()
{
    try
    {
        $("#btn_save_category_type").on("click",function(){

            if(checkCategoryTable())
            {

                savedCategoryDataServer(getData());
            }

        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//open the add category modal
function openAddCategory()
{
    $("#btn_open_category").on("click",function(){
        getCategoryData();
    });
}

//open the add category modal in the select thme
function openThemeCategoryAdd()
{
    $("#add_theme").on("click",function(e){
        add_category_type.show();
        getCategoryData();
    });
}

/*========================================== BEGIN:ServerSide ======================================================*/
//save the data of the category
function savedCategoryDataServer(data)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + 'ors/save/category-data',
            data:{_token,data},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    __notif_show(1,'',response.message);
                    displayCategoryType();
                    clearCategory();
                    ors_category_modal.hide();
                    //display the newly saved theme
                    getTheme();
                }
                else
                {
                    __notif_show(-1,'',response.message);
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

// display the data in the select2
function displayCategoryType()
{
    try
    {
        let div = $("#category_typelevel_loading");
        $.ajax({
            type: "GET",
            url: bpath + 'ors/display/category-type',
            data: {_token},

            beforeSend: function(){
                div.empty('');
                div.append(`<i class="fa-solid fa-spinner fa-spin h-5 w-5 text-center mt-20"></i>`);
            },

            success:function(response){

                if(response !== null && response !== '')
                {
                    let data = JSON.parse(response);

                    $("#display_category_type").empty('');
                    div.empty('');

                    $.each(data, function(index,value)
                    {

                        let cd = '';

                            cd = `<a href="" class="flex items-center px-3 py-2 rounded-md"  onclick="return false;">
                                        <div class="w-2 h-2 rounded-full mr-3" style=background-color:${value.color}></div>
                                        ${value.category}
                                    </a>`;

                            $("#display_category_type").append(cd);
                    });
                }
            }
        });
    }
    catch(error)
    {
        console.log(error.message);
    }
}

//get the category data
function getCategoryData()
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + 'ors/update/caregory-data',
            data:{_token},

            success:function(response){

                if(response!==null && response!=='')
                {
                    let data = JSON.parse(response);

                    if(data!=='' && data!==null)
                    {
                        $('#tb_category_type tbody').empty();

                        $.each(data,function(index,value)
                        {
                            category_id.GLobalCategoryId = value.id;

                            let cd = '';

                                cd = `<tr id="category_type_tr">
                                            <td hidden><label id="category_id" class="text-center">${value.id}</label></td>
                                            <td class="text-center"><label id="color" class="text-center">${value.color}</label></td>
                                            <td id="btn_remove_category" class="text-danger text-center" data-id=""><button><i class="fa-solid fa-trash"></i></button></td>
                                      </tr>`;

                                $("#tb_category_type tbody").append(cd);
                        });
                    }
                }
            }

        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//delete the category type
function deleteCategory(categoryid)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + 'ors/delete/category-type',
            data:{_token,categoryid},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    __notif_show(1,'',response.message);
                    getCategoryData();
                    getTheme();
                }
                else
                {
                    __notif_show(-1,'',response.message);
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}


