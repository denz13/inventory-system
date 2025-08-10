class ZCalendar {

	/*
		ORIGINAL BY: SHEAU - DMM
	*/

	MAIN = this;

	BASEPATH = '';

	CALLBACK_ONLOAD = null;
	CALLBACK_DATE_CURRENT_PREV = null;
	CALLBACK_DATE_CURRENT_NEXT = null;
	CALLBACK_DATE_SELECT = null;
	CALLBACK_DAYS_LOADED = null;

	PLACEHOLDER_MAIN = 'calendar';

	WEEK_DAYS = 7;
	WEEK_DAY_START = 0; /* 0 - 6  |  0 = SUN , 7 = SAT */

	MONTH_COUNT = 12; /* 1 - 12 */

	DATA_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	DATA_MONTHS = [];

	CURRENT_YEAR = 0;
	CURRENT_MONTH = 1;
	CURRENT_DAY = 1;


	TAG_CLASS_CALENDAR_DAY = 'zc_calendar_day';
	TAG_ACTION_DATA_TYPE = 'calendar-action';
	TAG_ACTION_DATA_TARGET_CALENDAR_BODY_DAY = 'day';

	STYLE_CLASS_DAY_SELECTED = 'current-day-selected-r';


	ELEMENTS_DAY_SELECTED = [];
	VALUES_DATE_SELECTED = [];

	DATE_SELECTED_MULTIPLE = false;
	DATE_DESELECT_ON_SECOND_SELECT = true;

	DELAY_COMMON = 600; /* millisecond : 1sec - 1000 */
	



	constructor(placeHolder = 'calendar', basepath = '', onLoadCallback = null, onDaysLoadedCallback = null, onDateSelectedCallback = null) {

		this.MAIN = this;

		this.BASEPATH = basepath;
		this.CALLBACK_ONLOAD = onLoadCallback;
		this.CALLBACK_DAYS_LOADED = onDaysLoadedCallback;
		this.CALLBACK_DATE_SELECT = onDateSelectedCallback;

		this.PLACEHOLDER_MAIN = placeHolder.trim();

		this.loadDefaultDataHeaders();
		this.loadDefaultDataMonths();

		this.loadCurrentDateFromSystem();

		this.loadCalendar();

	}

	onLoadCallback(args = null) {
		try{
			if(this.CALLBACK_ONLOAD != null && this.CALLBACK_ONLOAD != undefined) {
				this.CALLBACK_ONLOAD(args);
			}
		}catch(err){}
	}

	loadCalendar() {
		try{

			let id_header_title = this.getID_Header_Title();
			let id_body_tbl_header = this.getID_Body_TBL_Header();
			let id_body_tbl_body = this.getID_Body_TBL_Body();


			let cd = '';


			cd = '' +
					'' +
					'<div class="zcalendar">' +
					'	<div class="main">' +
					'		<div class="header">' +
					'			<table style="width: 100%;">' +
					'				<tr>' +
					'					<td class="rl"><div class="zc-btn-group"><button id="' + this.getID_BTN_Date_Prev() + '" class="zc-btn-ns zc-color-white"><i class="fas fa-chevron-left"></i></button></div></td>' +
					'					<td class="rm"><div id="' + id_header_title + '" class="title"></div><input id="' + this.getID_Header_Input_Date() + '" class="title-input-date" type="date" /></td>' +
					'					<td class="rr"><div class="zc-btn-group"><button id="' + this.getID_BTN_Date_Next() + '" class="zc-btn-ns zc-color-white"><i class="fas fa-chevron-right"></i></button></div></td>' +
					'				</tr>' +
					'			</table>' +
					'		</div>' +
					'		<div class="body">' +
					'			<table class="zc-calendar" style="width: 100%;">' +
					'				<thead id="' + id_body_tbl_header + '">' +
					'				</thead>' +
					'				<tbody id="' + id_body_tbl_body + '">' +
					'				</tbody>' +
					'			</table>' +
					'		</div>' +
					'	</div>' +
					'</div>' +
					'';

			let target = this.fixElementID(this.PLACEHOLDER_MAIN);
			document.getElementById(target).innerHTML = cd;

			this.bindEvents();


			this.loadCalendarHeader();
			this.loadCalendarBodyByDate(this.CURRENT_YEAR, this.CURRENT_MONTH, true);

			this.loadCalendarTitle();

			/***/
			this.onLoadCallback();

		}catch(err){  }
	}

	loadCalendarTitle() {
		try{

			let target = this.getID_Header_Title();


			let date = new Date(this.CURRENT_YEAR, this.CURRENT_MONTH, this.CURRENT_DAY);

			let title = '';

			let monthInfo = this.getMonthNameInfoByMonth(date.getMonth());
			title = monthInfo['name'] + " " + date.getFullYear();

			document.getElementById(target).innerHTML = title;

		}catch(err){}
	}

	loadCalendarHeader() {
		try{

			let id_body_tbl_header = this.getID_Body_TBL_Header();
			let id_body_tbl_body = this.getID_Body_TBL_Body();
			

			let cd = '';

			cd += '<tr>';

			let tsize = 100 / this.DATA_HEADERS.length;

			for(var i=0; i<this.DATA_HEADERS.length; i++) {

				cd += '<th style="width: ' + tsize + '%;">' + this.DATA_HEADERS[i]['shortName'] + '</th>';

			}

			cd += '</tr>';
			

			document.getElementById(id_body_tbl_header).innerHTML = cd;


		}catch(err){}
	}

	loadCalendarBodyByDate(year, month, loadOtherMonthDays = true) {
		try{


			let id_body_tbl_header = this.getID_Body_TBL_Header();
			let id_body_tbl_body = this.getID_Body_TBL_Body();
			
			let offset = 0;

			let fd = '';
			let cd = '';

			let pos = 0;
			let cn = 0;

			let days = 0;

			let currentDate = new Date();
			let currentDateYear = currentDate.getFullYear();
			let currentDateMonth = currentDate.getMonth();
			let currentDateDay = currentDate.getDate();


			let date = new Date(year, month - 1, 1);
			let dayIndex = date.getDay();
			offset = dayIndex;
			days = this.getDaysInMonth(year, month);


			let prevYear = year;
			let prevMonth = month - 2;
			if(prevMonth < 0) {
				prevYear -= 1;
				prevMonth = 11;
			}
			let prevDate = new Date(prevYear, prevMonth, 1);
			let prevDateDays = this.getDaysInMonth(prevYear, prevMonth + 1);

			/* LOAD OFFSET */
			for(var i=(prevDateDays-(offset-1)); i<=prevDateDays; i++) {
				cd += '<td class="' + this.TAG_CLASS_CALENDAR_DAY + '" data-type="' + this.TAG_ACTION_DATA_TYPE + '" data-target="' + this.TAG_ACTION_DATA_TARGET_CALENDAR_BODY_DAY + '" data-year="' + prevYear + '" data-month="' + prevMonth + '" data-day="' + i + '"><div class="day-o">' + i + '</div></td>';
			}

			pos = offset;


			/* LOAD MAIN DAYS */
			for(var d=1; d<=days; d++) {

				let tcs = '';

				if(date.getFullYear() == this.CURRENT_YEAR && 
					(date.getMonth()+1) == this.CURRENT_MONTH && 
					d == this.CURRENT_DAY) {
					tcs = 'current-day-selected-r';
				}

				if(date.getFullYear() == currentDate.getFullYear() && 
					date.getMonth() == currentDate.getMonth() && 
					d == currentDateDay) {
					tcs = 'current-day-r';
				}

				cd += '<td class="' + tcs + ' ' + this.TAG_CLASS_CALENDAR_DAY + ' " data-type="' + this.TAG_ACTION_DATA_TYPE + '" data-target="' + this.TAG_ACTION_DATA_TARGET_CALENDAR_BODY_DAY + '" data-year="' + year + '" data-month="' + month + '" data-day="' + d + '"><div class="day">' + d + '</div></td>';
				pos++;

				if(pos > 1) {
					if((pos % this.DATA_HEADERS.length) == 0) {
						fd += '<tr>' + cd + '</tr>';
						cd = '';
					}
				}

			}

			/* CHECK FOR LACKING END CELLS */
			let rem = pos % this.DATA_HEADERS.length;
			for(var i=1; i<=(this.DATA_HEADERS.length - rem); i++) {
				let tv = '';
				if(loadOtherMonthDays) {
					tv = i;
				}
				cd += '<td class="' + this.TAG_CLASS_CALENDAR_DAY + '" data-type="' + this.TAG_ACTION_DATA_TYPE + '" data-target="' + this.TAG_ACTION_DATA_TARGET_CALENDAR_BODY_DAY + '" data-year="' + (year) + '" data-month="' + (month + 1) + '" data-day="' + i + '"><div class="day-o">' + tv + '</div></td>';
			}

			/* LOAD UNLOADED CELLS */
			if(cd.trim() != "") {
				fd += '<tr>' + cd + '</tr>';
				cd = '';
			}

			document.getElementById(id_body_tbl_body).innerHTML = fd;

			this.bindCalendarDayEvents();

			try{
				setTimeout(function(e) {
					if(this.CALLBACK_DAYS_LOADED != null && this.CALLBACK_DAYS_LOADED != undefined) {
						let date = { year:year, month:month, };
						this.CALLBACK_DAYS_LOADED(date);
					}
				}.bind(this), this.DELAY_COMMON);
			}catch(err){}


		}catch(err){}
	}


	fixElementID(id) {
		let result = id;
		try{
			let fc = id.trim().charAt(0);
			if(fc.trim() != '#') {
				result = '' + id.trim();
			}
		}catch(err){}
		return result;
	}


	setCurrentDate(year, month = 1, day = 1) {
		this.CURRENT_YEAR = year;
		this.CURRENT_MONTH = month;
		this.CURRENT_DAY = day;
	}

	setSelectedMultiple(value) {
		this.DATE_SELECTED_MULTIPLE = value;
	}


	/* DATE START ================= **/

	getDaysInMonth(year, month) {
		let date = new Date(year, month, 0);
		return date.getDate();
	}

	loadDefaultDataHeaders() {
		try{

			this.DATA_HEADERS = [];

			let max = this.WEEK_DAYS; /* 0 = sunday, 6 = saturday */

			for(var i=0; i<max; i++) {
				let info = this.getDayNameInfoByIndex(i, this.WEEK_DAY_START);
				let tv = { index:i, value:i, name:info['name'], shortName:info['shortName'], };
				this.DATA_HEADERS.push(tv);
			}

		}catch(err){}
	}

	loadDefaultDataMonths() {
		try{

			this.DATA_MONTHS = [];

			let max = this.MONTH_COUNT; /* 1 - 12 */

			for(var i=1; i<=max; i++) {
				let info = this.getMonthNameInfoByMonth(i);
				let tv = { index:i, value:i, name:info['name'], shortName:info['shortName'], };
				this.DATA_MONTHS.push(tv);
			}

		}catch(err){}
	}

	getDayNameInfoByIndex(index, dayStart = 0) {
		/***/
		let name = '';
		let shortName = '';
		/***/
		let max = 6;
		/***/
		let ti = index;
		/***/
		if(ti < 0) {
			ti = 0;
		}
		if(ti > max) {
			//ti = max;
		}
		/***/
		if(dayStart < 0) {
			dayStart = 0;
		}
		if(dayStart > max) {
			dayStart = max;
		}
		/***/
		if(dayStart > 0) {
			ti = ti + dayStart;
		}
		if(ti > max) {

		}
		/***/
		ti = index + dayStart;
		/***/
		let th = -1;
		for(var i=0; i<=ti; i++) {
			th++;
			if(th > max) {
				th = 0;
			}
		}
		ti = th;
		/***/
		switch(ti) {
			case 0:
				name = 'Sunday';
				shortName = 'Sun';
				break;
			case 1:
				name = 'Monday';
				shortName = 'Mon';
				break;
			case 2:
				name = 'Tuesday';
				shortName = 'Tue';
				break;
			case 3:
				name = 'Wednesday';
				shortName = 'Wed';
				break;
			case 4:
				name = 'Thursday';
				shortName = 'Thu';
				break;
			case 5:
				name = 'Friday';
				shortName = 'Fri';
				break;
			case 6:
				name = 'Saturday';
				shortName = 'Sat';
				break;
			default:
				name = 'Sunday';
				shortName = 'Sun';
		}
		return { name:name, shortName:shortName, };
	}

	getMonthNameInfoByMonth(month = 1) {
		let name = '';
		let shortName = '';
		try{
			/*
				1 - 12
			*/
			let ti = month;
			/***/
			switch(ti) {
				case 1:
					name = 'January';
					shortName = 'Jan';
					break;
				case 2:
					name = 'February';
					shortName = 'Feb';
					break;
				case 3:
					name = 'March';
					shortName = 'Mar';
					break;
				case 4:
					name = 'April';
					shortName = 'Apr';
					break;
				case 5:
					name = 'May';
					shortName = 'May';
					break;
				case 6:
					name = 'June';
					shortName = 'Jun';
					break;
				case 7:
					name = 'July';
					shortName = 'Jul';
					break;
				case 8:
					name = 'August';
					shortName = 'Aug';
					break;
				case 9:
					name = 'September';
					shortName = 'Sep';
					break;
				case 10:
					name = 'October';
					shortName = 'Oct';
					break;
				case 11:
					name = 'November';
					shortName = 'Nov';
					break;
				case 12:
					name = 'December';
					shortName = 'Dec';
					break;
				default:
					name = 'January';
					shortName = 'Jan';
			}
			/***/
		}catch(err){}
		return { name:name, shortName:shortName, };
	}

	loadCurrentDateFromSystem() {
		try{
			let date = new Date();
			this.CURRENT_YEAR = date.getFullYear();
			this.CURRENT_MONTH = date.getMonth() + 1;
			this.CURRENT_DAY = date.getDate();
		}catch(err){}
	}

	/* DATE END ================= **/

	/* SET CALLBACKS START ================= **/

	setOnLoadCallback(callback) {
		this.CALLBACK_ONLOAD = callback;
	}

	setCallbackDateCurrentPrev(callback) {
		this.CALLBACK_DATE_CURRENT_PREV = callback;
	}
	setCallbackDateCurrentNext(callback) {
		this.CALLBACK_DATE_CURRENT_NEXT = callback;
	}


	setCallbackDaysLoaded(callback) {
		this.CALLBACK_DAYS_LOADED = callback;
	}

	setCallbackSelectDate(callback) {
		this.CALLBACK_DATE_SELECT = callback;
	}

	/* SET CALLBACKS START ================= **/

	/* EVENTS START ================= **/

	bindEvents() {
		/***/
		try{
			document.getElementById(this.getID_BTN_Date_Prev()).removeEventListener('click', function() {

			});
		}catch(err){}
		try{
			document.getElementById(this.getID_BTN_Date_Prev()).addEventListener('click', function() {
				if(this.CALLBACK_DATE_CURRENT_PREV == null || this.CALLBACK_DATE_CURRENT_PREV == undefined) {
					/***/
					if(this.CURRENT_MONTH > 1) {
						this.CURRENT_MONTH -= 1;
					}else{
						if(this.CURRENT_YEAR > 0) {
							this.CURRENT_YEAR -= 1;
						}
						this.CURRENT_MONTH = 12;
					}
					/***/
					this.loadCalendarBodyByDate(this.CURRENT_YEAR, this.CURRENT_MONTH);
					this.loadCalendarTitle();
					/***/
				}else{

				}
			}.bind(this));
		}catch(err){}
		/***/
		/***/
		try{
			document.getElementById(this.getID_BTN_Date_Next()).removeEventListener('click', function() {

			});
		}catch(err){}
		try{
			document.getElementById(this.getID_BTN_Date_Next()).addEventListener('click', function() {
				if(this.CALLBACK_DATE_CURRENT_NEXT == null || this.CALLBACK_DATE_CURRENT_NEXT == undefined) {
					/***/
					if(this.CURRENT_MONTH < 12) {
						this.CURRENT_MONTH += 1;
					}else{
						this.CURRENT_YEAR += 1;
						this.CURRENT_MONTH = 1;
					}
					/***/
					this.loadCalendarBodyByDate(this.CURRENT_YEAR, this.CURRENT_MONTH);
					this.loadCalendarTitle();
					/***/
				}else{

				}
			}.bind(this));
		}catch(err){}
		/***/
		/***/
		try{
			document.getElementById(this.getID_Header_Title()).removeEventListener('click', function() {

			});
		}catch(err){}
		try{
			document.getElementById(this.getID_Header_Title()).addEventListener('click', function() {
				let el = document.getElementById(this.getID_Header_Input_Date());
				el.showPicker();
			}.bind(this));
		}catch(err){}
		/***/
		/***/
		try{
			document.getElementById(this.getID_Header_Input_Date()).removeEventListener('change', function() {

			});
		}catch(err){}
		try{
			document.getElementById(this.getID_Header_Input_Date()).addEventListener('change', function() {
				let el = document.getElementById(this.getID_Header_Input_Date());
				if(el.value != null && el.value != undefined && el.value != "") {
					let date = new Date(el.value);
					this.CURRENT_YEAR = date.getFullYear();
					this.CURRENT_MONTH = date.getMonth() + 1;
					this.CURRENT_DAY = date.getDate();
					this.loadCalendarBodyByDate(this.CURRENT_YEAR, this.CURRENT_MONTH);
					this.loadCalendarTitle();
				}
			}.bind(this));
		}catch(err){}
		/***/
	}

	bindCalendarDayEvents() {
		/***/
		try{
			var els = document.getElementsByClassName(this.TAG_CLASS_CALENDAR_DAY);
			/***/
			for (var i = 0; i < els.length; i++) {
				try{
					els[i].removeEventListener('click', function() {

					});
				}catch(err){}
				try{
					els[i].addEventListener('click', function(e) {
						let target = e.target;
						this.checkAction(target);
					}.bind(this));
				}catch(err){ console.log(err); }
			}
			/***/
		}catch(err){}
		/***/
	}

	checkAction(src) {
		try{
			if(src != null && src != undefined) {
				let type = src.getAttribute('data-type');
				let target = src.getAttribute('data-target');
				/***/
				if(type.trim().toLowerCase() == this.TAG_ACTION_DATA_TYPE.trim().toLowerCase()) {
					/***/
					if(target.trim().toLowerCase() == this.TAG_ACTION_DATA_TARGET_CALENDAR_BODY_DAY.trim().toLowerCase()) {
						let year = src.getAttribute('data-year');
						let month = src.getAttribute('data-month');
						let day = src.getAttribute('data-day');
						/***/
						let data = { year:year, month:month, day:day, };
						/***/
						try{
							/***/
							this.addSelectedDate(year, month, day, null);
							/***/
						}catch(err){}
						/***/
						if(this.CALLBACK_DATE_SELECT != null && this.CALLBACK_DATE_SELECT != undefined) {
							this.CALLBACK_DATE_SELECT(data);
						}
						/***/
					}
					/***/
				}
				/***/
			}
		}catch(err){}
	}

	clearDateSelected() {
		try{
			let els = this.ELEMENTS_DAY_SELECTED;
			for (var i = 0; i < els.length; i++) {
				try{
					let cls = els[i].classList;
					cls.remove(this.STYLE_CLASS_DAY_SELECTED);
				}catch(err){}
			}
			this.ELEMENTS_DAY_SELECTED = [];
			this.VALUES_DATE_SELECTED = [];
		}catch(err){}
	}

	addSelectedDate(year, month, day, element = null) {
		let result = false;
		try{
			if(!this.DATE_SELECTED_MULTIPLE) {
				this.clearDateSelected();
			}
			if(!this.hasDateSelected(year, month, day)) {
				let data = { year:year, month:month, day:day, };
				this.VALUES_DATE_SELECTED.push(data);
				result = true;
				/***/
				if(element == null && element == undefined) {
					element = this.getSelectedDateElementByDate(year, month, day);
				}
				if(element != null && element != undefined) {
					let cls = element.classList;
					cls.remove(this.STYLE_CLASS_DAY_SELECTED);
					cls.add(this.STYLE_CLASS_DAY_SELECTED);
					if(!this.hasElementSelected(element)) {
						this.ELEMENTS_DAY_SELECTED.push(element);
					}
				}
			}else{
				if(this.DATE_DESELECT_ON_SECOND_SELECT) {
					this.removeSelectedDate(year, month, day);
				}
			}
		}catch(err){  }
		return result;
	}

	removeSelectedDate(year, month, day) {
		let result = false;
		try{
			for (var i = (this.VALUES_DATE_SELECTED.length - 1); i >= 0; i--) {
				try{
					let ty = this.VALUES_DATE_SELECTED[i]['year'];
					let tm = this.VALUES_DATE_SELECTED[i]['month'];
					let td = this.VALUES_DATE_SELECTED[i]['day'];
					if(year == ty && month == tm && day == td) {
						this.removeSelectedDateElement(year, month, day);
						this.VALUES_DATE_SELECTED.splice(i, 1);
						result = true;
					}
				}catch(err){}
			}
		}catch(err){}
		return result;
	}

	removeSelectedDateElement(year, month, day) {
		let result = false;
		try{
			for (var i = (this.ELEMENTS_DAY_SELECTED.length - 1); i >= 0; i--) {
				try{
					let ty = this.ELEMENTS_DAY_SELECTED[i]['year'];
					let tm = this.ELEMENTS_DAY_SELECTED[i]['month'];
					let td = this.ELEMENTS_DAY_SELECTED[i]['day'];
					if(year == ty && month == tm && day == td) {
						let el = this.ELEMENTS_DAY_SELECTED[i];
						let cls = el.classList;
						cls.remove(this.STYLE_CLASS_DAY_SELECTED);
						this.ELEMENTS_DAY_SELECTED.splice(i, 1);
						result = true;
					}
				}catch(err){}
			}
		}catch(err){}
		return result;
	}


	hasDateSelected(year, month, day) {
		let result = false;
		try{
			let vals = this.VALUES_DATE_SELECTED;
			for (var i = 0; i < vals.length; i++) {
				try{
					let ty = vals[i]['year'];
					let tm = vals[i]['month'];
					let td = vals[i]['day'];
					if(year == ty && month == tm && day == td) {
						result = true;
						return result;
					}
				}catch(err){}
			}
		}catch(err){}
		return result;
	}

	hasElementSelected(element) {
		let result = false;
		try{
			if(element != null && element != undefined) {
				let els = this.ELEMENTS_DAY_SELECTED;
				for (var i = 0; i < els.length; i++) {
					try{
						if(element == els[i]) {
							result = true;
							return result;
						}
					}catch(err){}
				}
			}
		}catch(err){}
		return result;
	}

	getSelectedDateElementByDate(year, month, day) {
		let result = null;
		try{
			var els = document.getElementsByClassName(this.TAG_CLASS_CALENDAR_DAY);
			/***/
			for (var i = 0; i < els.length; i++) {
				try{
					let src = els[i];
					let ty = parseInt(src.getAttribute('data-year'));
					let tm = parseInt(src.getAttribute('data-month'));
					let td = parseInt(src.getAttribute('data-day'));
					/***/
					if(year == ty && month == tm && day == td) {
						result = src;
						return result;
					}
				}catch(err){}
			}
			/***/
		}catch(err){}
		return result;
	}

	/* EVENTS END ================= **/


	/* IDS START ================= **/

	getID_Header_Title() {
		return this.PLACEHOLDER_MAIN.trim() + '__header_title';
	}

	getID_Body_TBL_Header() {
		return this.PLACEHOLDER_MAIN.trim() + '__body_header';
	}

	getID_Body_TBL_Body() {
		return this.PLACEHOLDER_MAIN.trim() + '__body_body';
	}

	getID_Header_Input_Date() {
		return this.PLACEHOLDER_MAIN.trim() + '__header_input_date';
	}


	getID_BTN_Date_Prev() {
		return this.PLACEHOLDER_MAIN.trim() + '__btn_date_current_prev';
	}
	getID_BTN_Date_Next() {
		return this.PLACEHOLDER_MAIN.trim() + '__btn_date_current_next';
	}

	/* IDS END ================= **/

}