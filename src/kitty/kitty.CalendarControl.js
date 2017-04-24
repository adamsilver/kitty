/**

- using arrows to get to date not in range
- aria
- next previous link styles
- next previous should be buttons
- accessible markup
- event emitter
- more spec stuff

* @param {HTMLElement} options.container The element that the calendar will be appended into the DOM
* @param {Date} options.startDate The start date range
* @param {Date} options.endDate The end date range
* @param {Date} options.currentDate The currently active date, defaults to today
* @param {String} options.calendarClass The class name for the calendar
*/
kitty.CalendarControl = function(options) {
	this.monthsContainer = null;
	var calendarActivator = null;
	this.setupOptions(options);
	this.setupKeys();

	this.state = {
		currentSelectedDate: options.currentDate // stores in view month
	};
	this.selectedDate = this.options.currentDate; // stores selected date (including day)
	this.buildCalendar();
};


kitty.CalendarControl.prototype.setupOptions = function(options) {
	var defaults = {};

	defaults.dateStart = (function() {
		var d = new Date();
		d.setYear(d.getFullYear()-1);
		return d;
	}());

	defaults.dateEnd = (function() {
		var d = new Date();
		d.setYear(d.getFullYear()+1);
		return d;
	}());

	defaults.currentDate = (function() {
		var d = new Date();
		d.setHours(0,0,0,0);
		return d;
	}());

	options = options || {};
	options.container = options.container || document.body;
	options.startDate = options.startDate || defaults.dateStart;
	options.endDate = options.endDate || defaults.dateEnd;
	options.currentDate = options.currentDate || defaults.currentDate;
	options.calendarClass = options.calendarClass || 'calendarControl';
	this.options = options;
};

kitty.CalendarControl.prototype.buildCalendar = function() {
	this.calendar = document.createElement("div");
	this.calendar.className = this.options.calendarClass;

	this.createPrimaryStructure();
	if (this.dateInRange(this.selectedDate, this.options.startDate, this.options.endDate)) {
		this.createMonth(this.selectedDate.getFullYear(),this.selectedDate.getMonth());
	}

	this.prepareCalendarControls();

	if(this.options.container !== null) {
		this.options.container.appendChild(this.calendar);
	}
};

kitty.CalendarControl.prototype.prepareCalendarControls = function() {
	$(this.calendar).on('click', '.calendarControl-back', $.proxy(this, 'onBackClick'));
	$(this.calendar).on('click', '.calendarControl-next', $.proxy(this, 'onNextClick'));
	$(this.calendar).on('click', '.calendarControl-dayActivator', $.proxy(this, 'onDayClick'));
	$(this.calendar).on('keyup', '.calendarControl-dayActivator', $.proxy(this, 'onDayKeyUp'));
};

kitty.CalendarControl.prototype.onDayClick = function(e) {
	var d = new Date($(e.currentTarget).attr('data-date'));
	this.selectDate(d);
};

kitty.CalendarControl.prototype.onBackClick = function(e) {
	this.showPreviousMonth();
};

kitty.CalendarControl.prototype.onNextClick = function(e) {
	this.showNextMonth();
};

kitty.CalendarControl.prototype.setupKeys = function() {
	this.keys = {
		tab:       9,
		enter:    13,
		esc:      27,
		space:    32,
		pageup:   33,
		pagedown: 34,
		end:      35,
		home:     36,
		left:     37,
		up:       38,
		right:    39,
		down:     40
   };
};

kitty.CalendarControl.prototype.onDayKeyUp = function(e) {
	switch(e.keyCode) {
		case this.keys.down:
			this.onDayDownPressed(e);
			break;
		case this.keys.up:
			this.onDayUpPressed(e);
			break;
		case this.keys.left:
			this.onDayLeftPressed(e);
			break;
		case this.keys.right:
			this.onDayRightPressed(e);
			break;
		case this.keys.space:
		case this.keys.enter:
			this.onDayUpSpacePressed(e);
			break;
	}
};

kitty.CalendarControl.prototype.onDayUpSpacePressed = function(e) {
	e.preventDefault();
	console.log('space/return pressed');
};

kitty.CalendarControl.prototype.onDayDownPressed = function(e) {
	e.preventDefault();
	var date = new Date($(e.currentTarget).attr('data-date'));
	var newDate = this.getSameDayNextWeek(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.createMonth(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.CalendarControl.prototype.onDayUpPressed = function(e) {
	e.preventDefault();
	var date = new Date($(e.currentTarget).attr('data-date'));
	var newDate = this.getSameDayLastWeek(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.createMonth(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.CalendarControl.prototype.onDayLeftPressed = function(e) {
	e.preventDefault();
	var date = new Date($(e.currentTarget).attr('data-date'));
	var newDate = this.getPreviousDay(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.createMonth(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.CalendarControl.prototype.onDayRightPressed = function(e) {
	e.preventDefault();
	var date = new Date($(e.currentTarget).attr('data-date'));
	var newDate = this.getNextDay(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.createMonth(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.CalendarControl.prototype.getPreviousDay = function(date) {
	date.setDate(date.getDate()-1);
	return date;
};

kitty.CalendarControl.prototype.getSameDayLastWeek = function(date) {
	date.setDate(date.getDate()-7);
	return date;
};

kitty.CalendarControl.prototype.getNextDay = function(date) {
	date.setDate(date.getDate()+1);
	return date;
};

kitty.CalendarControl.prototype.getSameDayNextWeek = function(date) {
	date.setDate(date.getDate()+7);
	return date;
};

kitty.CalendarControl.prototype.getDayCell = function(date) {
	return $(this.calendar).find('[data-date="'+date.toString()+'"]');
};

kitty.CalendarControl.prototype.createPrimaryStructure = function() {
	this.calendar.innerHTML = this.getCalendarHtml();
	this.monthsContainer = $(this.calendar).find(".calendarControl-months")[0];
};

kitty.CalendarControl.prototype.getCalendarHtml = function() {
	var html = '';
	html +=		'<div class="calendarControl-wrapper">';
	html +=			'<div class="calendarControl-actions">';
	html +=				'<ul>';
	html +=					'<li class="calendarControl-back"><button type="button">Prev</button></li>';
	html +=					'<li class="calendarControl-next"><button type="button">Next</button></li>';
	html +=				'</ul>';
	html +=			'</div>';
	html +=			'<div class="calendarControl-months">';
	html +=			'</div>';
	html +=		'</div>'
	return html;
};

kitty.CalendarControl.prototype.createMonth = function(year, month) {
	var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var monthHTML = '';
	monthHTML += '<div class="calendarControl-month">';
	monthHTML += 	'<div class="calendarControl-title">';
	monthHTML += 		monthNames[month] + " " + year;
	monthHTML += 	'</div>';
	monthHTML += 	'<div class="calendarControl-days">';
	monthHTML += 		'<table>';
	monthHTML += 			'<thead>';
	monthHTML += 				'<tr>';
	monthHTML += 					'<th><abbr title="Sunday">Sun</abbr></th>';
	monthHTML += 					'<th><abbr title="Monday">Mon</abbr></th>';
	monthHTML += 					'<th><abbr title="Tuesday">Tue</abbr></th>';
	monthHTML += 					'<th><abbr title="Wednesday">Wed</abbr></th>';
	monthHTML += 					'<th><abbr title="Thursday">Thu</abbr></th>';
	monthHTML += 					'<th><abbr title="Friday">Fri</abbr></th>';
	monthHTML += 					'<th><abbr title="Saturday">Sat</abbr></th>';
	monthHTML += 				'</tr>';
	monthHTML += 			'</thead>';
	monthHTML += 			'<tbody>';
	monthHTML += 			'</tbody>';
	monthHTML += 		'</table>';
	monthHTML += 	'</div>';
	monthHTML += '</div>';
	this.monthsContainer.innerHTML = monthHTML;
	$(this.calendar).find(".calendarControl-months .calendarControl-days table tbody").append(this.getCalendarTableRows(month, year));
};

kitty.CalendarControl.prototype.getCalendarTableRows = function(month, year) {
	var html = "<tr>";
	var d = new Date();

	d.setFullYear(year,month,1,0);

	d.setHours(0,0,0,0);
	var firstDay = d.getDay();
	var i = 0;
	var tdClassDefault = "calendarControl-dayActivator";
	var tabIndex = '';
	while (i < firstDay) {
		html += "<td>&nbsp;</td>";
		i++;
	}
	while (d.getMonth() == month) {
		if (i % 7 === 0) {
			html += "</tr><tr>";
		}

		tabIndex = '';

		var tdClass = tdClassDefault;
		if (d.getTime() === this.options.currentDate.getTime()) {
			tdClass += " calendarControl-dayActivator-isToday";
		}

		if (d.getTime() === this.selectedDate.getTime()) {
			tdClass += " calendarControl-dayActivator-isSelected";
			tabIndex = '0';
		}

		html += this.getCellHtml(d, tabIndex, tdClass);

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

kitty.CalendarControl.prototype.getCellHtml = function(date, tabIndex, tdClass) {
	return '<td data-date="'+date.toString()+'" tabindex="'+ tabIndex +'" class="'+tdClass+'">' + '' + date.getDate() + '' + '</td>';
};

kitty.CalendarControl.prototype.selectDate = function(date) {
	this.unhighlightSelectedDate(this.selectedDate);
	this.highlightSelectedDate(date);
	// maybe hide calendar?
};

kitty.CalendarControl.prototype.unhighlightSelectedDate = function(date) {
	var cell = this.getDayCell(date);
	cell.removeClass('calendarControl-dayActivator-isSelected');
	cell.removeAttr('tabindex');
	this.selectedDate = null;
};

kitty.CalendarControl.prototype.highlightSelectedDate = function(date) {
	var cell = this.getDayCell(date);
	cell.attr('tabindex', '0');
	cell.focus();
	cell.addClass('calendarControl-dayActivator-isSelected');
	this.selectedDate = date;
};

kitty.CalendarControl.prototype.showPreviousMonth = function() {
	var pm = this.getPreviousMonth();
	var hasPreviousMonth = this.dateInRange(pm, this.options.startDate, this.options.endDate);
	if(!hasPreviousMonth) {
		return;
	}
	this.state.currentSelectedDate = pm;
	this.selectedDate = pm;
	this.createMonth(pm.getFullYear(),pm.getMonth());
};

kitty.CalendarControl.prototype.showNextMonth = function() {
	var nm = this.getNextMonth();
	var hasNextMonth = this.dateInRange(nm, this.options.startDate, this.options.endDate);
	if(!hasNextMonth) {
		return;
	}
	this.state.currentSelectedDate = nm;
	this.selectedDate = nm;
	this.createMonth(nm.getFullYear(),nm.getMonth());
};

kitty.CalendarControl.prototype.getPreviousMonth = function() {
	var dayInMs = 86400000;
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth(),1);
	d = d.getTime() - dayInMs;
	d = new Date(d);
	d.setDate(1);
	return d;
};

kitty.CalendarControl.prototype.getNextMonth = function() {
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth());
	d = d.setMonth(d.getMonth()+1);
	d = new Date(d);
	d.setDate(1);
	return d;
};

kitty.CalendarControl.prototype.dateInRange = function(date, dateRangeFrom, dateRangeTo) {
	var d = date.getTime();
	drf = dateRangeFrom.getTime();
	drt = dateRangeTo.getTime();
	if(d > drf && d < drt) {
		return true;
	} else {
		return false;
	}
};
