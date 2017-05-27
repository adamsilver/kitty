kitty.Menu = function(container) {
	this.container = container;
	this.setupKeys();
	this.setupTabIndex();
	this.container.on('keydown', 'input', $.proxy(this, 'onButtonKeydown'));
	// capture focus of first input and change tabindex. or something.
};

kitty.Menu.prototype.setupKeys = function() {
	this.keys = {
		enter: 13,
		esc: 27,
		space: 32,
		up: 38,
		down: 40,
		tab: 9
   };
};


kitty.Menu.prototype.setupTabIndex = function() {
	this.container.find('input').each($.proxy(function(index, el) {
		if(index > 0) {
			el.tabIndex = -1;
		}
	}, this));
};

kitty.Menu.prototype.onButtonKeydown = function(e) {
	switch (e.keyCode) {
		case this.keys.down:
			this.focusNext(e.currentTarget);
			break;
		case this.keys.up:
			this.focusPrevious(e.currentTarget);
			break;
		case this.keys.tab:
			this.resetFirstButtonTabIndex();
	}
};

kitty.Menu.prototype.focusNext = function(currentButton) {
	var next = $(currentButton).next();
	next.focus();

};

kitty.Menu.prototype.focusPrevious = function(currentButton) {
	var prev = $(currentButton).prev();
	prev.focus();
};

kitty.Menu.prototype.resetFirstButtonTabIndex = function() {
	this.container.find('input')[0].tabindex = 0;
};

kitty.Menu.prototype.removeFirstButtonTabIndex = function() {
	this.container.find('input')[0].tabindex = -1;
};