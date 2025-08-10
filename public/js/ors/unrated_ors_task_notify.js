var unratedTaskNotify = unratedTaskNotify || {};
var unratedTaskCount = unratedTaskCount || {};


$(document).ready(function(){
    unratedTaskNotify.notifyUnratedOrsTask();
    unratedTaskCount.countUnratedTask();
});

//triger to inform a user of unrated task
unratedTaskNotify.notifyUnratedOrsTask = function(){
    try
    {
        $.ajax({
            headers:{'X-CSRF-TOKEN':_token},
            type: "POST",
            url: bpath + "ors/notify/unrated/task",
            dataType: "json",

            success:function(response)
            {
                if( response.notify !== null || response.notify!=='')
                {
                    if(response.notify === true)
                    {
                        let notify = '';

                            notify = `<div class="w-3 h-3 flex items-center justify-center  absolute top-0 right-0 -mt-1 -mr-1  text-xs rounded-full text-white bg-white fa-bounce"> </div>`;

                            $("#notify_unrated_task").append(notify);
                    } else
                    {
                        let notify = '';

                            notify = `<div class="w-3 h-3 flex items-center justify-center  absolute top-0 right-0 -mt-1 -mr-1  text-xs rounded-full text-white bg-white fa-bounce hidden"> </div>`;

                            $("#notify_unrated_task").append(notify);
                    }
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

unratedTaskCount.countUnratedTask = function(){
    try
    {
        $.ajax({
            headers:{'X-CSRF-TOKEN':_token},
            type:"POST",
            url: bpath + "ors/count/unrated/task",
            dataType: "json",

            success:function(response)
            {
                if(response.count_task !== null || response.count_task !=='')
                {
                    if(response.count_task !== 0)
                    {
                        let count = '';
                            count = `<div class="py-1 px-2  rounded-full text-xs text-white cursor-pointer font-medium incoming_counter">${response.count_task}</div>
                                        <div class="w-2 h-2 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-white font-medium -mt-1 -mr-1 fa-beat">
                                    </div>`;

                            $("#notify_rate_task").append(count);
                    }
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}


