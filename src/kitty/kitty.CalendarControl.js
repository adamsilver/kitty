/**

- event handlers
- event emitter
- methods

* @param {Object} options Optional properties for this calendar instance
* @param {Date} options.dateStart The start date
* @param {Date} options.dateEnd The end date
* @param {Date} options.currentDate The current date
* @param {String} options.title The title text
* @param {String} options.calendarClass The class name for the calendar
* @param {HTMLElement} options.container The element that the calendar will be appended into the DOM
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
	options.dateStart = options.dateStart || defaults.dateStart;
	options.dateEnd = options.dateEnd || defaults.dateEnd;
	options.currentDate = options.currentDate || defaults.currentDate;
	options.title = options.title || 'Calendar';
	options.calendarClass = options.calendarClass || 'calendarControl';
	this.options = options;
};

kitty.CalendarControl.prototype.buildCalendar = function() {
	this.calendar = document.createElement("div");
	this.calendar.className = this.options.calendarClass;

	this.createPrimaryStructure();
	if (this.dateInRange(this.selectedDate, this.options.dateStart, this.options.dateEnd)) {
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

kitty.CalendarControl.prototype.onDayDownPressed = function(e) {
	e.preventDefault();
	console.log('down pressed');
	// get next weeks day
	// if day falls inside current month date
		// focus
	// else
		// set next month
		// focus on the day
};

kitty.CalendarControl.prototype.onDayUpPressed = function(e) {
	e.preventDefault();
	console.log('up pressed');
};

kitty.CalendarControl.prototype.onDayUpSpacePressed = function(e) {
	e.preventDefault();
	console.log('space/return pressed');
};

kitty.CalendarControl.prototype.onDayLeftPressed = function(e) {
	e.preventDefault();
	console.log('left pressed');
};

kitty.CalendarControl.prototype.onDayRightPressed = function(e) {
	e.preventDefault();
	// 
};

kitty.CalendarControl.prototype.getDayCell = function(date) {
	
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
	html +=					'<li class="calendarControl-back"><a href="#">Prev</a></li>';
	html +=					'<li class="calendarControl-next"><a href="#">Next</a></li>';
	html +=				'</ul>';
	html +=			'</div>';
	html +=			'<div class="calendarControl-months">';
	html +=			'</div>';
	html +=		'</div>'
	return html;
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
	monthHTML += 	'<div class="calendarControl-title">';
	monthHTML += 		monthNames[month] + " " + year;
	monthHTML += 	'</div>';
	monthHTML += 	'<div class="calendarControl-days">';
	monthHTML += 		'<table>';
	monthHTML += 			'<thead>';
	monthHTML += 				'<tr>';
	monthHTML += 					'<th><abbr title="Sunday">Su</abbr></th>';
	monthHTML += 					'<th><abbr title="Monday">Mo</abbr></th>';
	monthHTML += 					'<th><abbr title="Tuesday">Tu</abbr></th>';
	monthHTML += 					'<th><abbr title="Wednesday">We</abbr></th>';
	monthHTML += 					'<th><abbr title="Thursday">Th</abbr></th>';
	monthHTML += 					'<th><abbr title="Friday">Fr</abbr></th>';
	monthHTML += 					'<th><abbr title="Saturday">Sa</abbr></th>';
	monthHTML += 				'</tr>';
	monthHTML += 			'</thead>';
	monthHTML += 			'<tbody>';
	monthHTML += 			'</tbody>';
	monthHTML += 		'</table>';
	monthHTML += 	'</div>';
	monthHTML += '</div>';
	this.monthsContainer.innerHTML += monthHTML;
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

		html += '<td data-date="'+d.toString()+'" data-day="'+d.getDate()+'" data-month="'+d.getMonth()+'"  data-year="'+d.getFullYear()+'" tabindex="'+ tabIndex +'" class="'+tdClass+'">' + '' + d.getDate() + '' + '</td>';

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

kitty.CalendarControl.prototype.onDayClick = function(e) {
	var d = new Date($(e.currentTarget).attr('data-date'));
	this.selectDate(d);
};

kitty.CalendarControl.prototype.selectDate = function(date) {
	this.unhighlightSelectedDate(this.selectedDate);
	this.highlightSelectedDate(date);
	// maybe hide calendar?
};

kitty.CalendarControl.prototype.unhighlightSelectedDate = function(date) {
	var cell = $(this.calendar).find('[data-date="'+date.toString()+'"]');
	cell.removeClass('calendarControl-dayActivator-isSelected');
	cell.removeAttr('tabindex');
	this.selectedDate = null;
};

kitty.CalendarControl.prototype.highlightSelectedDate = function(date) {
	var cell = $(this.calendar).find('[data-date="'+date.toString()+'"]');
	cell.attr('tabindex', '0');
	cell.focus();
	cell.addClass('calendarControl-dayActivator-isSelected');
	this.selectedDate = date;
};

kitty.CalendarControl.prototype.onBackClick = function(e) {
	e.preventDefault();
	this.showPreviousMonth();
};

kitty.CalendarControl.prototype.showPreviousMonth = function() {
	var pm = this.getPreviousMonth();
	var hasPreviousMonth = this.dateInRange(pm, this.options.dateStart, this.options.dateEnd);
	if(!hasPreviousMonth) {
		return false;
	}
	this.removeCurrentMonth();
	this.createMonth(pm.getFullYear(),pm.getMonth());
	this.state.currentSelectedDate = pm;
};

kitty.CalendarControl.prototype.removeCurrentMonth = function() {
	this.monthsContainer.innerHTML = "";
};

kitty.CalendarControl.prototype.getNextMonth = function() {
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth());
	d = d.setMonth(d.getMonth()+1);
	d = new Date(d);
	return d;
};

kitty.CalendarControl.prototype.onNextClick = function(e) {
	e.preventDefault();
	this.showNextMonth();
};

kitty.CalendarControl.prototype.showNextMonth = function() {
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
