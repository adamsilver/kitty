kitty.Sticky = function(el) {
	this.el = el;
	this.topPosition = this.el.offset().top;
	this.height = this.el.outerHeight();
	this.window = $(window);
	this.viewportHeight = $(window).height();
	this.viewportWidth = $(window).width();
	this.window.on('scroll', $.debounce(1, $.proxy(this, "check")));
	this.window.on('resize', $.debounce(1, $.proxy(this, "check")));
};

kitty.Sticky.prototype.check = function() {
	if (this.window.height() > this.height) {
		if (this.window.scrollTop() < this.topPosition) {
			this.el.removeClass('sticky');
		} else {
			this.el.addClass('sticky');
		}
	} else {
		this.el.removeClass('sticky');
	}
};