kitty.WeekJumper = function(container) {
	this.container = container;
	this.showing = false;
	this.picker = this.container.find('.dates');

	this.container.find('.chooseDate').on('click', $.proxy(this, 'onChooseDateClicked'));


	this.container.on('click', '.prev', $.proxy(this, 'onPrevClicked'));
	this.container.on('click', '.next', $.proxy(this, 'onNextClicked'));

	/*
		Hide all months that arent selected
		Clicking next month
			hides current month
			shows next month

	 */

	this.hideMonths();

};

kitty.WeekJumper.prototype.onPrevClicked = function(e) {
	e.preventDefault();
	var href = this.getHref($(e.currentTarget));
	$(href).show();
	$(e.currentTarget).parents('.month').hide();
};

kitty.WeekJumper.prototype.onNextClicked = function(e) {
	e.preventDefault();
	var href = this.getHref($(e.currentTarget));
	$(href).show();
	$(e.currentTarget).parents('.month').hide();
};

kitty.WeekJumper.prototype.getHref = function(link) {
	var href = link.attr("href");
	href = href.slice(href.indexOf("#"), href.length);
	return href;
};

kitty.WeekJumper.prototype.onChooseDateClicked = function(e) {
	e.preventDefault();
	if(this.showing) {
		this.hidePicker();
	} else {
		this.showPicker();
	}
};

kitty.WeekJumper.prototype.showPicker = function() {
	this.picker.show();
	this.showing = true;
};

kitty.WeekJumper.prototype.hidePicker = function() {
	this.picker.hide();
	this.showing = false;
	this.picker.find('.month-current').show();
};

kitty.WeekJumper.prototype.hideMonths = function() {
	var months = this.picker.find('.month:not(.month-current)');
	months.hide();
};


