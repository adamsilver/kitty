kitty.DatePicker = function(control, options) {
	this.control = control;
	this.container = $(control).parent();
	this.setupOptions(options);
	this.setupKeys();
	this.setupMonthNames();
	this.state = {
		currentSelectedDate: options.currentDate // stores in view month
	};
	this.selectedDate = this.options.currentDate; // stores selected date (including day)
	this.createToggleButton();
	this.buildCalendar();
};

kitty.DatePicker.prototype.setupMonthNames = function() {
	this.monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
};

kitty.DatePicker.prototype.setupOptions = function(options) {
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
	options.startHidden = options.startHidden || false;
	this.options = options;
};

kitty.DatePicker.prototype.getCalendarHtml = function(year, month) {
	var html = '<div class="'+this.options.calendarClass+'-wrapper">';
	html +=		'<div class="'+this.options.calendarClass+'-actions">';
	html +=			'<button aria-label="Previous month" type="button" class="'+this.options.calendarClass+'-back">&#10094;</button>';
	html += 		'<div aria-label="Currently viewing month:" id="somePrefix_label" role="heading" aria-live="assertive" and aria-atomic="true" class="'+this.options.calendarClass+'-title">';
	html += 			this.monthNames[month] + " " + year;
	html += 		'</div>';
	html +=			'<button aria-label="Next month" type="button" class="'+this.options.calendarClass+'-next">&#10095;</button>';
	html +=		'</div>';
	html += 	'<table aria-role="grid" aria-activedescendant="'+this.getActiveDescendantId()+'" aria-labelledby="somePrefix_label" tabindex="0">';
	html += 		'<thead>';
	html += 			'<tr>';
	html += 				'<th role="columnheader"><abbr title="Sunday">Sun</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Monday">Mon</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Tuesday">Tue</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Wednesday">Wed</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Thursday">Thu</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Friday">Fri</abbr></th>';
	html += 				'<th role="columnheader"><abbr title="Saturday">Sat</abbr></th>';
	html += 			'</tr>';
	html += 		'</thead>';
	html += 		'<tbody>';
	html += 			this.getCalendarTableRows(month, year);
	html += 		'</tbody>';
	html += 	'</table>';
	return html;
};

kitty.DatePicker.prototype.getActiveDescendantId = function() {
	return this.control.id + '_day_' + this.selectedDate.getDate();
};

kitty.DatePicker.prototype.getFirstDateOfMonth = function(month, year) {
	var d = new Date();
	d.setFullYear(year,month,1,0);
	d.setHours(0,0,0,0);
	return d;
};

kitty.DatePicker.prototype.getCalendarTableRows = function(month, year) {
	var html = "<tr>";
	var d = new Date();

	d.setFullYear(year,month,1,0);

	d.setHours(0,0,0,0);
	var firstDay = d.getDay();
	var i = 0;
	var tdClassDefault = this.options.calendarClass+'-dayActivator';
	var ariaSelected = 'false';
	var now = new Date();
	now.setHours(0,0,0,0);

	while (i < firstDay) {
		var daysToSubtract = firstDay - i;
		var paddedDate = new Date();
		paddedDate.setDate(d.getDate()-daysToSubtract);
		html += '<td class="calendarControl-previousMonthDay">'+paddedDate.getDate()+'</td>';
		i++;
	}

	var daysToIgnore = i;

	while (d.getMonth() == month) {
		if (i % 7 === 0) {
			html += '</tr><tr aria-role="row">';
		}

		ariaSelected = 'false';

		var tdClass = tdClassDefault;
		if (d.getTime() === now.getTime()) {
			tdClass += ' '+this.options.calendarClass+'-dayActivator-isToday';
		}

		if (d.getTime() === this.selectedDate.getTime()) {
			tdClass += ' '+this.options.calendarClass+'-dayActivator-isSelected';
			ariaSelected = 'true';
		}

		html += this.getCellHtml(d, tdClass, ariaSelected);

		d.setDate( d.getDate()+1 );

		i++;
	}

	while (i % 7 !== 0) {
		var firstDate = this.getFirstDateOfMonth(month, year);
		firstDate.setDate(firstDate.getDate()+(i-daysToIgnore));
		html += '<td class="calendarControl-previousMonthDay">'+firstDate.getDate()+'</td>';
		i++;
	}
	html += "</tr>";
	return html;
};

kitty.DatePicker.prototype.getCellHtml = function(date, tdClass, ariaSelected) {
	var label = date.getDate() + ' ' + this.monthNames[date.getMonth()] + ', ' + date.getFullYear();
	return '<td aria-role="gridcell" aria-selected="'+ariaSelected+'" aria-label="'+label+'" data-date="'+date.toString()+'" id="'+this.control.id+'_day_'+date.getDate()+'" class="'+tdClass+'">' + '' + date.getDate() + '' + '</td>';
};

kitty.DatePicker.prototype.buildCalendar = function() {
	this.calendar = $('<div class="'+this.options.calendarClass+'">');
	if(this.options.startHidden) {
		this.hide();
	} else {
		this.show();
	}

	this.calendar.html(this.getCalendarHtml(this.selectedDate.getFullYear(), this.selectedDate.getMonth()));
	this.addEventListeners();
	this.container.append(this.calendar);
};

kitty.DatePicker.prototype.addEventListeners = function() {
	this.calendar.on('click', '.'+this.options.calendarClass+'-back', $.proxy(this, 'onBackClick'));
	this.calendar.on('click', '.'+this.options.calendarClass+'-next', $.proxy(this, 'onNextClick'));
	this.calendar.on('click', '.'+this.options.calendarClass+'-dayActivator', $.proxy(this, 'onDayClick'));
	this.calendar.on('keydown', 'table', $.proxy(this, 'onGridKeyDown'));
	this.calendar.on('keydown', $.proxy(this, 'onCalendarKeyDown'));
};

kitty.DatePicker.prototype.createToggleButton = function() {
	this.toggleButton = $('<button class="'+this.options.calendarClass+'-toggleButton" type="button">View calendar</button>');
	this.container.append(this.toggleButton);
	this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick'));
};

kitty.DatePicker.prototype.focusButton = function() {
	this.toggleButton.focus();
};

kitty.DatePicker.prototype.onToggleButtonClick = function(e) {
	if(this.showing) {
		this.hide();
	} else {
		this.show();
	}
};

kitty.DatePicker.prototype.onDayClick = function(e) {
	var d = new Date($(e.currentTarget).attr('data-date'));
	this.selectDate(d);
	this.updateTextBoxDate(d);
	this.hide();
	this.focusTextBox();
};

kitty.DatePicker.prototype.onBackClick = function(e) {
	this.showPreviousMonth();
};

kitty.DatePicker.prototype.onNextClick = function(e) {
	this.showNextMonth();
};

kitty.DatePicker.prototype.setupKeys = function() {
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

kitty.DatePicker.prototype.onCalendarKeyDown = function(e) {
	switch(e.keyCode) {
		case this.keys.esc:
			this.hide();
			this.focusButton();
			break
	}
};

kitty.DatePicker.prototype.onGridKeyDown = function(e) {
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

kitty.DatePicker.prototype.onDayUpSpacePressed = function(e) {
	e.preventDefault();
	this.updateTextBoxDate(this.selectedDate);
	this.hide();
	debugger;
	this.focusTextBox();
};

kitty.DatePicker.prototype.onDayDownPressed = function(e) {
	e.preventDefault();
	var date = new Date(this.selectedDate);
	var newDate = this.getSameDayNextWeek(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.DatePicker.prototype.onDayUpPressed = function(e) {
	e.preventDefault();
	var date = new Date(this.selectedDate);
	var newDate = this.getSameDayLastWeek(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.DatePicker.prototype.onDayLeftPressed = function(e) {
	e.preventDefault();
	var date = new Date(this.selectedDate);
	var newDate = this.getPreviousDay(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.DatePicker.prototype.onDayRightPressed = function(e) {
	e.preventDefault();
	var date = new Date(this.selectedDate);
	var newDate = this.getNextDay(date);
	if(newDate.getMonth() == this.state.currentSelectedDate.getMonth()) {
		this.selectDate(newDate);
	} else {
		this.state.currentSelectedDate = newDate;
		this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
		this.selectDate(newDate);
	}
};

kitty.DatePicker.prototype.getPreviousDay = function(date) {
	date.setDate(date.getDate()-1);
	return date;
};

kitty.DatePicker.prototype.getSameDayLastWeek = function(date) {
	date.setDate(date.getDate()-7);
	return date;
};

kitty.DatePicker.prototype.getNextDay = function(date) {
	date.setDate(date.getDate()+1);
	return date;
};

kitty.DatePicker.prototype.getSameDayNextWeek = function(date) {
	date.setDate(date.getDate()+7);
	return date;
};

kitty.DatePicker.prototype.getDayCell = function(date) {
	return this.calendar.find('[data-date="'+date.toString()+'"]');
};

kitty.DatePicker.prototype.updateCalendarHtml = function(year, month) {
	this.calendar.find('.'+this.options.calendarClass+'-title').html(this.monthNames[month] + ' ' + year);
	this.calendar.find("tbody").html(this.getCalendarTableRows(month, year));
};

kitty.DatePicker.prototype.selectDate = function(date) {
	this.unhighlightSelectedDate(this.selectedDate);
	this.highlightSelectedDate(date);
	this.updateActiveDescendant();
};

kitty.DatePicker.prototype.updateTextBoxDate = function(date) {
	this.control.value = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
};

kitty.DatePicker.prototype.focusTextBox = function() {
	this.control.focus();
};

kitty.DatePicker.prototype.unhighlightSelectedDate = function(date) {
	var cell = this.getDayCell(date);
	cell.removeClass(this.options.calendarClass+'-dayActivator-isSelected');
	cell.attr('aria-selected', 'false');
	// cell.removeAttr('tabindex');
	this.selectedDate = null;
};

kitty.DatePicker.prototype.updateActiveDescendant = function() {
	this.calendar.find('table').attr('aria-activedescendant', this.getActiveDescendantId());
};

kitty.DatePicker.prototype.highlightSelectedDate = function(date) {
	var cell = this.getDayCell(date);
	// cell.attr('tabindex', '0');
	cell.addClass(this.options.calendarClass+'-dayActivator-isSelected');
	cell.attr('aria-selected', 'true');
	this.selectedDate = date;
};

kitty.DatePicker.prototype.showPreviousMonth = function() {
	var pm = this.getPreviousMonth();
	var hasPreviousMonth = this.dateInRange(pm, this.options.startDate, this.options.endDate);
	if(!hasPreviousMonth) {
		return;
	}
	this.state.currentSelectedDate = pm;
	this.selectedDate = pm;
	this.updateCalendarHtml(pm.getFullYear(), pm.getMonth());
};

kitty.DatePicker.prototype.showNextMonth = function() {
	var nm = this.getNextMonth();
	var hasNextMonth = this.dateInRange(nm, this.options.startDate, this.options.endDate);
	if(!hasNextMonth) {
		return;
	}
	this.state.currentSelectedDate = nm;
	this.selectedDate = nm;
	this.updateCalendarHtml(nm.getFullYear(), nm.getMonth());
};

kitty.DatePicker.prototype.getPreviousMonth = function() {
	var dayInMs = 86400000;
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth(),1);
	d = d.getTime() - dayInMs;
	d = new Date(d);
	d.setDate(1);
	return d;
};

kitty.DatePicker.prototype.getNextMonth = function() {
	var d = new Date(this.state.currentSelectedDate.getFullYear(), this.state.currentSelectedDate.getMonth());
	d = d.setMonth(d.getMonth()+1);
	d = new Date(d);
	d.setDate(1);
	return d;
};

kitty.DatePicker.prototype.dateInRange = function(date, dateRangeFrom, dateRangeTo) {
	var d = date.getTime();
	drf = dateRangeFrom.getTime();
	drt = dateRangeTo.getTime();
	if(d > drf && d < drt) {
		return true;
	} else {
		return false;
	}
};

kitty.DatePicker.prototype.show = function() {
	this.calendar.attr('aria-hidden', 'false');
	this.calendar.removeClass(this.options.calendarClass+'-isHidden');
	this.showing = true;
	this.toggleButton.attr('aria-expanded', 'true');
};

kitty.DatePicker.prototype.hide = function() {
	this.calendar.attr('aria-hidden', 'true');
	this.calendar.addClass(this.options.calendarClass+'-isHidden');
	this.showing = false;
	this.toggleButton.attr('aria-expanded', 'false');
};
