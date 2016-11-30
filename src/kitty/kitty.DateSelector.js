
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
* @param {String} options.outOfRangeMessage Message to display when the date is out of range.
* @param {HTMLElement} options.appendCalendarTo The element that the calendar will be appended into the DOM
* @param {String} options.hasLinkClass The class name for the associated link
*/
kitty.DateSelector = function() {
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
		closeOnDateSelection: true,
		hasCloseButton: true,
		hasLinkActivator: true,
		hasLinkClass: "calendarHasLink",
		linkActivatorClass: "activateCalendar",
		linkActivatorText: "Show calendar",
		startHidden: true,
		selectDay: null,
		selectMonth: null,
		selectYear: null,
		hasDropDowns: false,
		outOfRangeMessage: "Date selected is not in correct range.",
		appendCalendarTo: null,
		calendarActivator: null
	};

	// set from values in object passed in as param to constructor.
	if (typeof arguments[0] == "object") {
		config.dateStart = arguments[0].dateStart || config.dateStart;
		config.dateEnd = arguments[0].dateEnd || config.dateEnd;
		// todo: check if the currentDate is in range
		config.currentDate = arguments[0].currentDate || config.currentDate;
		config.title = arguments[0].title || config.title;
		config.calendarClass = arguments[0].calendarClass || config.calendarClass;
		config.closeOnDateSelection = (typeof arguments[0].closeOnDateSelection === "boolean") ? arguments[0].closeOnDateSelection : config.closeOnDateSelection;
		config.hasCloseButton = (typeof arguments[0].hasCloseButton === "boolean") ? arguments[0].hasCloseButton : config.hasCloseButton;
		config.hasLinkActivator = (typeof arguments[0].hasLinkActivator === "boolean") ? arguments[0].hasLinkActivator : config.hasLinkActivator;
		config.linkActivatorClass = arguments[0].linkActivatorClass || config.linkActivatorClass;
		config.linkActivatorText = arguments[0].linkActivatorText || config.linkActivatorText;
		config.startHidden = (typeof arguments[0].startHidden === "boolean") ? arguments[0].startHidden : config.startHidden;
		config.selectDay = arguments[0].selectDay || null;
		config.selectMonth = arguments[0].selectMonth || null;
		config.selectYear = arguments[0].selectYear || null;
		config.hasDropDowns = (config.selectDay !== null || config.selectMonth !== null || config.selectYear !== null) || false;
		config.outOfRangeMessage = arguments[0].outOfRangeMessage || config.outOfRangeMessage;
		config.appendCalendarTo = arguments[0].appendCalendarTo || null;
		config.hasLinkClass = arguments[0].hasLinkClass || config.hasLinkClass;
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

	// public
	this.calendar = document.createElement("div"); // calendar so user can place whereever they want
	this.calendar.className = config.calendarClass; // so the user can style with own class name
	this.selectedDate = config.currentDate;	// so user can utilise the selected date in some other situation not handled by this class
	this.hideCalendar = hideCalendar; // so user can hide the calendar from external functionality
	this.showCalendar = showCalendar; // so user can show the calendar from external functionality
	var me = this;

	buildCalendar();
	function buildCalendar() {
		createPrimaryStructure();

		if (dateInRange(me.selectedDate, config.dateStart, config.dateEnd)) {
			createMonth(me.selectedDate.getFullYear(),me.selectedDate.getMonth());
		}

		prepareCalendarControls();

		if (config.startHidden) {
			hideCalendar();
		}
		else {
			showCalendar();
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

	/*
	 * Position calendar to calendarActivator
	 * @param void
	 * @return void
	 */
	function positionCalendar() {
		var pos = $(config.calendarActivator).position();
		$("div.calendar",me.calendar).css({
			left: pos.left+"px",
			top: pos.top+"px",
			position: "absolute"
		});
	}

	/*
	 * Appends calendar to specified location
	 * @param void
	 * @return void
	 */
	function placeCalendar() {
		var node = config.appendCalendarTo;
		node.appendChild(me.calendar);
	}

	/*
	 * Creates and appends a link to the calendar to show the calendar
	 * @param void
	 * @return void
	 */
	function createCalendarActivator() {
		var a = document.createElement("a");
		a.href = "#";
		a.className = config.linkActivatorClass;
		a.innerHTML = config.linkActivatorText;
		a.onclick = showCalendar;
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
		html +=					'<li class="backward"><a href="#" class="previous">Back</a></li>';
		html +=					'<li class="forward"><a href="#" class="next">Forward</a></li>';
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
	 * @return void
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
		monthHTML += 					'<th>S</th>';
		monthHTML += 					'<th>M</th>';
		monthHTML += 					'<th>T</th>';
		monthHTML += 					'<th>W</th>';
		monthHTML += 					'<th>T</th>';
		monthHTML += 					'<th>F</th>';
		monthHTML += 					'<th>S</th>';
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
	 * @param void
	 * @return void
	 */
	function prepareCalendarControls() {
		var previous = $("a.previous", me.calendar)[0];
		var next = $("a.next", me.calendar)[0];
		var close = $("a.close", me.calendar)[0];
		$(previous).click(setPreviousMonth);
		$(next).click(setNextMonth);
		$(close).click(hideCalendar);
	}

	function prepareDropDowns() {
		if (config.selectDay !== null) {
			$(config.selectDay).bind("change", setCalendarDateFromDropDown);
		}
		if (config.selectMonth !== null) {
			$(config.selectMonth).bind("change", setCalendarDateFromDropDown);
		}
		if (config.selectYear !== null) {
			$(config.selectYear).bind("change", setCalendarDateFromDropDown);
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
		$("td.dayActivator",me.calendar).click(setSelectedDate);
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
			hideCalendar();
		}

		if(config.hasDropDowns) {
			setDropDownFromCalendarDate();
		}
	}

	/*
	 * Hide the calendar
	 * @param void
	 * @return void
	 */
	function hideCalendar() {
		$(me.calendar).find("div.calendar").css({"display": "none", "zIndex":"0"});
		return false;
	}

	/*
	 * Show the calendar
	 * @param void
	 * @return void
	 */
	function showCalendar() {
		$(me.calendar).find("div.calendar").css({"display": "block", "zIndex": "999"});
		return false;
	}
};







/*

var options = {
appendTo: domNode,
calendarCssClass: 'string',
selectDay: domNode,
selectMonth: domNode,
selectYear: domNode,
textInput: domNode
}

var cal = new kitty.DateSelector(options);

cal.getDate();

cal.setDate(dateObject);

cal.show();

cal.hide();

*/