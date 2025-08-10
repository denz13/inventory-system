
$(document).ready(function() {

	// __notification_core_load(__basepath + "/");
	__notification_core_bind_events();

});

function __notification_core_bind_events() {
	try{
		$('.b_icon__notification').unbind();
	}catch(err){}
	try{
	$(".b_icon__notification").on('click', function(event){
		/***/
		__notification_core_load(__basepath + "/");
		/***/
	});
	}catch(err){}
}

function __notification_core_create(token, status, title, details, seen = 0, target = "", targettype = "", type = "", typeid = "", file = "", islink = "", link = "", locallink = "", locallinktype = "", bpath = "") {
	try{
		$.ajax({
		url: bpath + 'notification/core/create',
		type: "GET",
		data: {
			_token:token,
			status:status,
			title:title,
			details:details,
			seen:seen,
			target:target,
			targettype:targettype,
			type:type,
			typeid:typeid,
			file:file,
			islink:islink,
			link:link,
			locallink:locallink,
			locallinktype:locallinktype,
		},
		success: function(response) {
			try{
				/*//.log(response);*/
			}catch(err){  }
		},
		error: function(response) {
			try{
				/*//.log(response);*/
			}catch(err){  }
		}

		});
	}catch(err){  }
}

function __notification_core_load(bpath = "") {
	try{
		/***/
		var target = $('#__notification_content');
		/***/
		$.ajax({
		url: bpath + 'notification/core/load',
		type: "GET",
		data: {},
		success: function(response) {
			try{
				/*//.log(response);*/
				var tad = "";
				//tad = tad + '<div class="notification-content__title">Notifications</div>';
				var data = JSON.parse(response);
				if(data != null && data.length > 0) {
					/***/
					for(var i=0; i<data.length; i++) {
						try{
							/***/
							var title = data[i]['title'];
							var details = data[i]['descriptions'];
							var edate = data[i]['entrydate'];
							var edate1 = data[i]['edate'];
							var edate2 = data[i]['edate2'];
							var usedate2 = parseInt(data[i]['usedate2']);
							var islink = data[i]['islink'];
							var link = data[i]['link'];
							var locallink = data[i]['locallink'];
							var locallinktype = data[i]['locallinktype'];
							var img = data[i]['img'];
							/***/
							var tstat = '<div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>';
							tstat = '';
							/***/
							if(usedate2 > 0) {
								edate = edate2;
							}else{
								edate = edate1;
							}
							/***/
							var tlink = 'javascript:;';
							try{
								if(locallink != null && locallink != 'undefined' && locallink != '' && locallink.trim() != '') {
									if(locallinktype == null || locallinktype == 'undefined' || locallinktype == '') {
										tlink = __basepath + locallink;
									}else{
										if(locallinktype.trim().toLowerCase() == "committee".trim().toLowerCase()) {
											tlink = __basepath + "/committee/profile?id=" + locallink;
										}
										if(locallinktype.trim().toLowerCase() == "agency".trim().toLowerCase()) {
											tlink = __basepath + "/agency/profile?id=" + locallink;
										}
									}
								}else{

								}
							}catch(err){}
							try{
								if(img.trim() == "") {
									img = __basepath + "/img/notification.png";
								}
							}catch(err){}
							/***/
							var td = '';
							td =  '' +
				                  '<a href="' + tlink + '">' +
				                  '<div class="cursor-pointer relative flex items-center mb-5">' +
				                  '	<div class="w-12 h-12 flex-none image-fit mr-1">' +
				                  '		<img alt="" class="rounded-full" src="' + img + '">' +
				                  '		' + tstat +
				                  '	</div>' +
				                  '	<div class="ml-2 overflow-hidden">' +
				                  '		<div class="flex items-center">' +
				                  '			<span class="font-medium truncate mr-5">' + title + '</span>' +
				                  '			<div class="text-xs text-slate-400 ml-auto whitespace-nowrap notification_time_holder_1">' + edate + '</div>' +
				                  '		</div>' +
				                  '		<div class="w-full truncate text-slate-500 mt-0.5">' + details + '</div>' +
				                  '	</div>' +
				                  '</div>' +
				                  '</a>' +
								  '';
							/***/
							tad = tad + td;
						}catch(err){}
					}
					/***/
					target.html(tad);
				}
			}catch(err){  }
		},
		error: function(response) {
			try{
				/*//.log(response);*/
			}catch(err){  }
		}

		});
	}catch(err){  }
}
