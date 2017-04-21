
/**
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
	var defaults = {};

	defaults.dateStart = (function() {
		var d = new Date();
		d.setYear(d.getFullYear()-2);
		return d;
	}());

	defaults.dateEnd = (function() {
		var d = new Date();
		d.setYear(d.getFullYear()+2);
		return d;
	}());

	defaults.currentDate = (function() {
		var d = new Date();
		d.setHours(0,0,0,0);
		return d;
	}());

	this.monthsContainer = null;
	var calendarActivator = null;

	options = options || {};

	options.dateStart = options.dateStart || defaults.dateStart;
	options.dateEnd = options.dateEnd || defaults.dateEnd;
	options.currentDate = options.currentDate || defaults.currentDate;
	options.title = options.title || 'Calendar';
	options.calendarClass = options.calendarClass || 'calendarControl';
	options.closeOnDateSelection = options.closeOnDateSelection || false;
	options.hasCloseButton = options.hasCloseButton || false;
	options.hasLinkActivator = options.hasLinkActivator || true;
	options.hasLinkClass = options.hasLinkClass || 'calendarHasLink';
	options.linkActivatorClass = options.linkActivatorClass || 'activateCalendar';
	options.linkActivatorText = options.linkActivatorText || 'Show calendar';
	options.startHidden = options.startHidden || false;
	options.selectDay = options.selectDay || null;
	options.selectMonth = options.selectMonth || null;
	options.selectYear = options.selectYear || null;
	options.hasDropDowns = (options.selectDay !== null || options.selectMonth !== null || options.selectYear !== null) || false;
	options.appendCalendarTo = options.appendCalendarTo || null;

	this.options = options;
	this.state = {
		currentSelectedDate: options.currentDate // stores in view month
	};;

	this.selectedDate = this.options.currentDate; // stores selected date (including day)
	this.buildCalendar();
};


kitty.CalendarControl.prototype.buildCalendar = function() {
	this.calendar = document.createElement("div");
	this.calendar.className = this.options.calendarClass;



	this.createPrimaryStructure();
	if (this.dateInRange(this.selectedDate, this.options.dateStart, this.options.dateEnd)) {
		this.createMonth(this.selectedDate.getFullYear(),this.selectedDate.getMonth());
	}

	this.prepareCalendarControls();

	if (this.options.startHidden) {
		this.hideCalendar();
	}
	else {
		this.showCalendar();
	}

	if(this.options.hasLinkActivator) {
		$(this.calendar).addClass(this.options.hasLinkClass);
		this.createCalendarActivator();
	}

	if(this.options.appendCalendarTo !== null) {
		this.options.appendCalendarTo.appendChild(this.calendar);
	}

	if(this.options.hasDropDowns) {
		this.prepareDropDowns();
		this.setCalendarDateFromDropDown();
	}
};

kitty.CalendarControl.prototype.createPrimaryStructure = function() {
	this.calendar.innerHTML = this.getCalendarHtml();
	this.monthsContainer = $(this.calendar).find(".calendar-months")[0];
};

kitty.CalendarControl.prototype.getCalendarHtml = function() {
	var html = '';
	html +=		'<div class="calendar">';
	html +=			'<div class="title">';
	html +=				this.options.title;
	html +=			'</div>';
	html +=			'<div class="actions">';
	html +=				'<ul>';
	html +=					'<li class="backward"><a href="#" class="previous">Prev</a></li>';
	html +=					'<li class="forward"><a href="#" class="next">Next</a></li>';
	html +=				'</ul>';
	html +=			'</div>';
	html +=			'<div class="calendar-months">';
	html +=			'</div>';
	if (this.options.hasCloseButton) {
		html += '<div class="actions2">';
		html += '<a href="#" class="close">Close</a>';
		html += '</div>';
	}
	html +=		'</div>'
	return html;
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

kitty.CalendarControl.prototype.dateInRange = function(date, dateRangeFrom, dateRangeTo) {
	d = date.getTime();
	drf = dateRangeFrom.getTime();
	drt = dateRangeTo.getTime();
	if(d > drf && d < drt) {
		return true;
	}
	else {
		return false;
	}
};

kitty.CalendarControl.prototype.createMonth = function(year, month) {
	var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];


	var monthHTML = '';
	monthHTML += '<div data-year="'+ year +'" data-month="'+ (month+1) +'" class="month date' + year +"-" + (month+1) + '">';
	monthHTML += 	'<div class="title">';
	monthHTML += 		monthNames[month] + " " + year;
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
	this.monthsContainer.innerHTML += monthHTML;
	$(this.calendar).find(".calendar-months div.days table tbody").append(this.getCalendarTableRows(month, year));
};

kitty.CalendarControl.prototype.getCalendarTableRows = function(month, year) {
	var html = "<tr>";
	var d = new Date();

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
		if (d.getTime() === this.options.currentDate.getTime()) {
			tdClass += " currentDate";
		}

		if (d.getTime() === this.selectedDate.getTime()) {
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
};

kitty.CalendarControl.prototype.setSelectedDate = function(e) {
	var day = parseInt(e.target.innerHTML);
	var year = parseInt($(this.monthsContainer).find(".month").attr('data-year'),10);
	var month = parseInt($(this.monthsContainer).find(".month").attr('data-month'), 10)-1;

	var d = new Date(year,month,day);
	if(!this.dateInRange(d, this.options.dateStart, this.options.dateEnd)) {
		return;
	}

	this.selectedDate = d;
	this.removeCurrentMonth();
	this.createMonth(this.selectedDate.getFullYear(),this.selectedDate.getMonth());

	if(this.options.closeOnDateSelection) {
		this.hideCalendar();
	}

	if(this.options.hasDropDowns) {
		this.setDropDownFromCalendarDate();
	}
};

kitty.CalendarControl.prototype.prepareCalendarControls = function() {
	$(this.calendar).on('click', '.previous', $.proxy(this, 'setPreviousMonth'));
	$(this.calendar).on('click', '.next', $.proxy(this, 'setNextMonth'));
	$(this.calendar).on('click', '.close', $.proxy(this, 'onCloseClick'));
	$(this.calendar).on('click', '.dayActivator', $.proxy(this, 'setSelectedDate'));
};

kitty.CalendarControl.prototype.setPreviousMonth = function(e) {
	e.preventDefault();
	var pm = this.getPreviousMonth();
	var hasPreviousMonth = this.dateInRange(pm, this.options.dateStart, this.options.dateEnd);
	if(!hasPreviousMonth) {
		return false;
	}
	this.removeCurrentMonth();
	this.createMonth(pm.getFullYear(),pm.getMonth());
	this.state.currentSelectedDate = pm;
};

kitty.CalendarControl.prototype.createCalendarActivator = function(	) {
	var a = document.createElement("a");
	a.href = "#";
	a.className = this.options.linkActivatorClass;
	a.innerHTML = this.options.linkActivatorText;
	$(a).on('click', $.proxy(this, 'calendarActivatorOnClick'));
	calendarActivator = a;
	$(this.calendar).prepend(a);
};

kitty.CalendarControl.prototype.prepareDropDowns = function() {
	if (this.options.selectDay !== null) {
		$(this.options.selectDay).on("change", $.proxy(this, 'setCalendarDateFromDropDown'));
	}
	if (this.options.selectMonth !== null) {
		$(this.options.selectMonth).on("change", $.proxy(this, 'setCalendarDateFromDropDown'));
	}
	if (this.options.selectYear !== null) {
		$(this.options.selectYear).on("change", $.proxy(this, 'setCalendarDateFromDropDown'));
	}	
};

kitty.CalendarControl.prototype.setCalendarDateFromDropDown = function() {
	var d = new Date();
	d.setHours(0,0,0,0);
	if (this.options.selectDay !== null) {
		d.setDate(parseInt(this.options.selectDay.value));
	}
	if (this.options.selectMonth !== null) {
		d.setMonth(parseInt(this.options.selectMonth.value)-1);
	}
	if (this.options.selectYear !== null) {
		d.setYear(this.options.selectYear.value);
	}
	if(this.dateInRange(d, this.options.dateStart, this.options.dateEnd)) {
		this.selectedDate = d;
		this.state.currentSelectedDate = d;
		this.removeCurrentMonth();
		this.createMonth(this.selectedDate.getFullYear(),this.selectedDate.getMonth());
	}
};

kitty.CalendarControl.prototype.removeCurrentMonth = function() {
	this.monthsContainer.innerHTML = "";
};

kitty.CalendarControl.prototype.setDropDownFromCalendarDate = function() {
	if (this.options.selectDay !== null) {
		this.setSelectBoxValue(this.options.selectDay, this.selectedDate.getDate().toString());
	}
	if (this.options.selectMonth !== null) {
		this.setSelectBoxValue(this.options.selectMonth, (this.selectedDate.getMonth()+1).toString());
	}
	if (this.options.selectYear !== null) {
		this.setSelectBoxValue(this.options.selectYear, this.selectedDate.getFullYear().toString());
	}
};

kitty.CalendarControl.prototype.setSelectBoxValue = function(selectNode, selectValue) {
	var options = selectNode.options;
	for(var i = options.length-1;i>=0;i--) {
		if(selectValue === options[i].value) {
			selectNode.selectedIndex = i;
			break;
		}
	}
};

kitty.CalendarControl.prototype.getNextMonth = function() {
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth());
	d = d.setMonth(d.getMonth()+1);
	d = new Date(d);
	return d;
};



kitty.CalendarControl.prototype.setNextMonth = function(e) {
	e.preventDefault();
	var nm = this.getNextMonth();
	var hasNextMonth = this.dateInRange(nm, this.options.dateStart, this.options.dateEnd);
	if(!hasNextMonth) {
		return false;
	}
	this.removeCurrentMonth();
	this.createMonth(nm.getFullYear(),nm.getMonth());
	this.state.currentSelectedDate = nm;
};

kitty.CalendarControl.prototype.getPreviousMonth = function() {
	var dayInMs = 86400000;
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth(),1);
	d = d.getTime() - dayInMs;
	d = new Date(d);
	return d;
};
