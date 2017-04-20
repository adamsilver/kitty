
/**
*
* @class Create a calendar control to help fill in form elements that require a date format
* @constructor
* @param {Object} options Optional properties for this calendar instance
* @param {Date} options.dateStart The start date
* @param {Date} options.dateEnd The end date
* @param {Date} options.currentDate The current date
* @param {String} options.title The title text
* @param {String} options.calendarClass The class name for the calendar
* @param {Boolean} options.closeOnDateSelection To close the calendar when a date is selected
* @param {Boolean} options.hasCloseButton To include a close button for the calendar
* @param {Boolean} options.hasLinkActivator To tell the calendar if it has a link activator
* @param {String} options.linkActivatorClass Class name for the link activator
* @param {String} options.linkActivatorText The text for the link activator
* @param {Boolean} options.startHidden Tell the calendar to start hidden or shown on load.
* @param {HTMLElement} options.selectDay DOM reference to select element
* @param {HTMLElement} options.selectMonth DOM reference to select element
* @param {HTMLElement} options.selectYear DOM reference to select element
* @param {HTMLElement} options.appendCalendarTo The element that the calendar will be appended into the DOM
* @param {String} options.hasLinkClass The class name for the associated link
*/
kitty.CalendarControl = function(options) {

	var config = {
		dateStart: (function() {
			var d = new Date();
			d.setYear(d.getFullYear()-2);
			return d;
		}()),
		dateEnd: (function() {
			var d = new Date();
			d.setYear(d.getFullYear()+2);
			return d;
		}()),
		currentDate: (function() {
			var d = new Date();
			d.setHours(0,0,0,0);
			return d;
		}()),
		dayInMs: 86400000,
		monthsContainer: null,
		title: "Calendar",
		calendarClass: "calendarControl",
		dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
		closeOnDateSelection: false,
		hasCloseButton: false,
		hasLinkActivator: true,
		hasLinkClass: "calendarHasLink",
		linkActivatorClass: "activateCalendar",
		linkActivatorText: "Show calendar",
		startHidden: false,
		selectDay: null,
		selectMonth: null,
		selectYear: null,
		hasDropDowns: false,
		appendCalendarTo: null,
		calendarActivator: null
	};

	// set from values in object passed in as param to constructor.
	if (typeof options == "object") {
		config.dateStart = options.dateStart || config.dateStart;
		config.dateEnd = options.dateEnd || config.dateEnd;
		// todo: check if the currentDate is in range
		config.currentDate = options.currentDate || config.currentDate;
		config.title = options.title || config.title;
		config.calendarClass = options.calendarClass || config.calendarClass;
		config.closeOnDateSelection = (typeof options.closeOnDateSelection === "boolean") ? options.closeOnDateSelection : config.closeOnDateSelection;
		config.hasCloseButton = (typeof options.hasCloseButton === "boolean") ? options.hasCloseButton : config.hasCloseButton;
		config.hasLinkActivator = (typeof options.hasLinkActivator === "boolean") ? options.hasLinkActivator : config.hasLinkActivator;
		config.linkActivatorClass = options.linkActivatorClass || config.linkActivatorClass;
		config.linkActivatorText = options.linkActivatorText || config.linkActivatorText;
		config.startHidden = (typeof options.startHidden === "boolean") ? options.startHidden : config.startHidden;
		config.selectDay = options.selectDay || null;
		config.selectMonth = options.selectMonth || null;
		config.selectYear = options.selectYear || null;
		config.hasDropDowns = (config.selectDay !== null || config.selectMonth !== null || config.selectYear !== null) || false;
		config.appendCalendarTo = options.appendCalendarTo || null;
		config.hasLinkClass = options.hasLinkClass || config.hasLinkClass;
	}

	/*
	 * This handles the state of the calendar while in use.
	 * For example we may change months (previous/next) but
	 * not actually set a date. So we need to keep track of
	 * what date we are showing without having to inspect DOM
	 * for class/Id names etc
	 */
	var state = {
		currentSelectedDate: config.currentDate
	};

	this.calendar = document.createElement("div"); // calendar so user can place whereever they want
	this.calendar.className = config.calendarClass; // so the user can style with own class name
	this.selectedDate = config.currentDate;	// so user can utilise the selected date in some other situation not handled by this class
	var me = this;

	buildCalendar();
	function buildCalendar() {
		createPrimaryStructure();

		if (dateInRange(me.selectedDate, config.dateStart, config.dateEnd)) {
			createMonth(me.selectedDate.getFullYear(),me.selectedDate.getMonth());
		}

		prepareCalendarControls();

		if (config.startHidden) {
			me.hideCalendar();
		}
		else {
			me.showCalendar();
		}

		if(config.hasLinkActivator) {
			$(me.calendar).addClass(config.hasLinkClass);
			createCalendarActivator();
		}

		if(config.appendCalendarTo !== null) {
			placeCalendar();
		}

		if(config.hasDropDowns) {
			prepareDropDowns();
			setCalendarDateFromDropDown();
		}

	}

	function placeCalendar() {
		config.appendCalendarTo.appendChild(me.calendar);
	}

	function createCalendarActivator() {
		var a = document.createElement("a");
		a.href = "#";
		a.className = config.linkActivatorClass;
		a.innerHTML = config.linkActivatorText;
		$(a).on('click', $.proxy(me, 'calendarActivatorOnClick'));
		config.calendarActivator = a;
		$(me.calendar).prepend(a);
	}

	/*
	 * This creates the calendar mark-up with action buttons
	 * @param void
	 * @return void
	 */
	function createPrimaryStructure() {
		var html = '';
		html +=		'<div class="calendar">';
		html +=			'<div class="title">';
		html +=				config.title;
		html +=			'</div>';
		html +=			'<div class="actions">';
		html +=				'<ul>';
		html +=					'<li class="backward"><a href="#" class="previous">Prev</a></li>';
		html +=					'<li class="forward"><a href="#" class="next">Next</a></li>';
		html +=				'</ul>';
		html +=			'</div>';
		html +=			'<div class="months">';
		html +=			'</div>';
		if (config.hasCloseButton) {
			html += '<div class="actions2">';
			html += '<a href="#" class="close">Close</a>';
			html += '</div>';
		}
		html +=		'</div>'
		me.calendar.innerHTML = html;
		config.monthsContainer = $("div.months", me.calendar)[0];
	}

	/*
	 * Gets the HTML for a month
	 * @param month as number
	 * @param year as number
	 * @return html as HTML string
	 */
	function getCalendarTableRows( month, year ) {
		var html = "<tr>";
		var d = new Date();
		//d.setMonth(month);
		//d.setYear(year);
		//d.setDate(1);

		d.setFullYear(year,month,1,0);

		d.setHours(0,0,0,0);
		var firstDay = d.getDay();
		var i = 0;
		var tdClassDefault = "dayActivator";
		while (i < firstDay) {
			html += "<td>&nbsp;</td>";
			i++;
		}
		while (d.getMonth() == month) {
			if (i % 7 === 0) {
				html += "</tr><tr>";
			}

			var tdClass = tdClassDefault;
			if (d.getTime() === config.currentDate.getTime()) {
				tdClass += " currentDate";
			}

			if (d.getTime() === me.selectedDate.getTime()) {
				tdClass += " selectedDate";
			}

			html += '<td class="'+tdClass+'">' + '' + d.getDate() + '' + '</td>';

			d.setDate( d.getDate()+1 );
			i++;
		}
		while (i % 7 !== 0) {
			html += "<td>&nbsp;</td>";
			i++;
		}
		html += "</tr>";
		return html;
	}

	/*
	 * Creates a month by appending the HTML
	 * @param year (as number)
	 * @param month (as number) (months run from 0-11)
	 */
	function createMonth(year,month) {
		var monthHTML = '';
		monthHTML += '<div class="month date' + year +"-" + (month+1) + '">';
		monthHTML += 	'<div class="title">';
		monthHTML += 		config.monthNames[month] + " " + year;
		monthHTML += 	'</div>';
		monthHTML += 	'<div class="days">';
		monthHTML += 		'<table>';
		monthHTML += 			'<thead>';
		monthHTML += 				'<tr>';
		monthHTML += 					'<th>Su</th>';
		monthHTML += 					'<th>Mo</th>';
		monthHTML += 					'<th>Tu</th>';
		monthHTML += 					'<th>We</th>';
		monthHTML += 					'<th>Th</th>';
		monthHTML += 					'<th>Fr</th>';
		monthHTML += 					'<th>Sa</th>';
		monthHTML += 				'</tr>';
		monthHTML += 			'</thead>';
		monthHTML += 			'<tbody>';
		monthHTML += 			'</tbody>';
		monthHTML += 		'</table>';
		monthHTML += 	'</div>';
		monthHTML += '</div>';
		config.monthsContainer.innerHTML += monthHTML;
		$("div.months div.days table tbody", me.calendar).append(getCalendarTableRows(month, year));
		prepareDayActivators();
	}

	/*
	 * Apply events to calendar controls
	 */
	function prepareCalendarControls() {
		$(me.calendar).find('.previous').on('click', setPreviousMonth);
		$(me.calendar).find('.next').on('click', setNextMonth);
		$(me.calendar).find('.close').on('click', $.proxy(me, 'onCloseClick'));
	}

	function prepareDropDowns() {
		if (config.selectDay !== null) {
			$(config.selectDay).on("change", setCalendarDateFromDropDown);
		}
		if (config.selectMonth !== null) {
			$(config.selectMonth).on("change", setCalendarDateFromDropDown);
		}
		if (config.selectYear !== null) {
			$(config.selectYear).on("change", setCalendarDateFromDropDown);
		}
	}

	/*
	 * The calendar will update if the drop down fields have a valid date.
	 * @param void
	 * @return void
	 */
	function setCalendarDateFromDropDown() {
		var d = new Date();
		d.setHours(0,0,0,0);
		if (config.selectDay !== null) {
			d.setDate(parseInt(config.selectDay.value));
		}
		if (config.selectMonth !== null) {
			d.setMonth(parseInt(config.selectMonth.value)-1);
		}
		if (config.selectYear !== null) {
			d.setYear(config.selectYear.value);
		}
		if(dateInRange(d, config.dateStart, config.dateEnd)) {
			me.selectedDate = d;
			state.currentSelectedDate = d;
			removeCurrentMonth();
			createMonth(me.selectedDate.getFullYear(),me.selectedDate.getMonth());
		}
	}

	/*
	 * When the calendar date changes the drop downs will be configured to match
	 * if the drop downs have the correct range of values.
	 * @param void
	 * @return void
	 */
	function setDropDownFromCalendarDate() {
		if (config.selectDay !== null) {
			setSelectBoxValue(config.selectDay, me.selectedDate.getDate().toString());
		}
		if (config.selectMonth !== null) {
			setSelectBoxValue(config.selectMonth, (me.selectedDate.getMonth()+1).toString());
		}
		if (config.selectYear !== null) {
			setSelectBoxValue(config.selectYear, me.selectedDate.getFullYear().toString());
		}
	}

	/*
	 * Helper to set a value in a select field
	 * @param selectNode (as DOM reference to select field)
	 * @param selectValue (as string)
	 * @return void
	 */
	function setSelectBoxValue(selectNode, selectValue) {
		var options = selectNode.options;
		for(var i = options.length-1;i>=0;i--) {
			if(selectValue === options[i].value) {
				selectNode.selectedIndex = i;
				break;
			}
		}
	}

	/*
	 * Sets the calendar to previous month if within range
	 * @param void
	 * @return false (as boolean) - stops default action on a link
	 */
	function setPreviousMonth() {
		var pm = getPreviousMonth();
		var hasPreviousMonth = dateInRange(pm, config.dateStart, config.dateEnd);
		if(!hasPreviousMonth) {
			return false;
		}
		removeCurrentMonth();
		createMonth(pm.getFullYear(),pm.getMonth());
		state.currentSelectedDate = pm;
		return false;
	}

	/*
	 * Sets the calendar to the next month if within range
	 * @param void
	 * @return false (as boolean) - stops default action on a link
	 */
	function setNextMonth() {
		var nm = getNextMonth();
		var hasNextMonth = dateInRange(nm, config.dateStart, config.dateEnd);
		if(!hasNextMonth) {
			return false;
		}
		removeCurrentMonth();
		createMonth(nm.getFullYear(),nm.getMonth());
		state.currentSelectedDate = nm;
		return false;
	}

	/*
	 * Get the previous month
	 * See "state" for more information
	 * @param void
	 * @return d (as date object)
	 */
	function getPreviousMonth() {
		var d = new Date(state.currentSelectedDate.getFullYear(), state.currentSelectedDate.getMonth(),1);
		d = d.getTime() - config.dayInMs;
		d = new Date(d);
		return d;
	}

	/*
	 * Get the next month
	 * See "state" for more information
	 * @param void
	 * @return d (as date object)
	 */
	function getNextMonth() {
		var d = new Date(state.currentSelectedDate.getFullYear(), state.currentSelectedDate.getMonth());
		d = d.setMonth(d.getMonth()+1);
		d = new Date(d);
		return d;
	}

	/*
	 * Check to see a date is within a certain range
	 * @param date (as date object)
	 * @param dateRangeFrom (as date object)
	 * @param dateRangeTo (as date object)
	 * @return true (as boolean) if date is in range otherwise false
	 */
	function dateInRange(date, dateRangeFrom, dateRangeTo) {
		d = date.getTime();
		drf = dateRangeFrom.getTime();
		drt = dateRangeTo.getTime();
		if(d > drf && d < drt) {
			return true;
		}
		else {
			return false;
		}
	}

	/*
	 * Removes current month from DOM
	 * @param void
	 * @return void
	 */
	function removeCurrentMonth() {
		config.monthsContainer.innerHTML = "";
	}

	/*
	 * Applies event handlers to the table cells for picking a date
	 * @param void
	 * @return void
	 */
	function prepareDayActivators() {
		$("td.dayActivator", me.calendar).click(setSelectedDate);
	}

	/*
	 * Set the selected date if the date is within range
	 * @param void
	 * @return void
	 */
	function setSelectedDate() {
		var day = parseInt(this.innerHTML);
		var yearMonth = $("div.month",config.monthsContainer)[0].className.split(" ")[1].split("date")[1].split("-");
		var year = yearMonth[0];
		var month = yearMonth[1]-1;
		var d = new Date(year,month,day);
		if(!dateInRange(d, config.dateStart, config.dateEnd)) {
			return;
		}

		me.selectedDate = d;
		removeCurrentMonth();
		createMonth(me.selectedDate.getFullYear(),me.selectedDate.getMonth());

		if(config.closeOnDateSelection) {
			me.hideCalendar();
		}

		if(config.hasDropDowns) {
			setDropDownFromCalendarDate();
		}
	}
};

kitty.CalendarControl.prototype.buildControl = function() {
	
};

kitty.CalendarControl.prototype.onCloseClick = function(e) {
	e.preventDefault();
	this.hideCalendar();
};

kitty.CalendarControl.prototype.calendarActivatorOnClick = function(e) {
	e.preventDefault();
	this.showCalendar();
};

kitty.CalendarControl.prototype.hideCalendar = function() {
	$(this.calendar).find('.calendar').hide();
};

kitty.CalendarControl.prototype.showCalendar = function() {
	$(this.calendar).find('.calendar').show();
};



