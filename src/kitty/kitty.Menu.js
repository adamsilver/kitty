kitty.Menu = function(container) {
	this.container = container;
	this.menu = this.container.find('.menu-items');
	this.setupKeys();
	this.setupTabIndex();
	this.menu.on('keydown', 'input', $.proxy(this, 'onButtonKeydown'));

	this.menuButton = $('<button type="button" aria-haspopup="true" aria-expanded="false">Actions<span aria-hidden="true">&#x25be;</span></button>');
	this.menuButton.on('click', $.proxy(this, 'onMenuButtonclick'));

	this.responsiveListener = new kitty.ResponsiveListener({
		smallSize: 600
	});
	this.responsiveListener.on('smallModeEnabled', $.proxy(this, 'onSmallModeEnabled'));
	this.responsiveListener.on('smallModeDisabled', $.proxy(this, 'onSmallModeDisabled'));
	this.responsiveListener.checkMode();
};

kitty.Menu.prototype.onSmallModeEnabled = function() {
	this.container.prepend(this.menuButton);
	this.hideMenu();
	this.menu[0].setAttribute('role', 'menu');
	this.smallMode = true;
};

kitty.Menu.prototype.onSmallModeDisabled = function() {
	this.menuButton.remove();
	this.showMenu();
	this.menu[0].setAttribute('role', 'menubar');
	this.smallMode = false;
};

kitty.Menu.prototype.hideMenu = function() {
	this.menu[0].hidden = true;
	this.menuButton[0].setAttribute('aria-expanded', 'false');
};

kitty.Menu.prototype.showMenu = function(first_argument) {
	this.menu[0].hidden = false;
	this.menuButton[0].setAttribute('aria-expanded', 'true');
};

kitty.Menu.prototype.onMenuButtonclick = function(e) {
	if(this.menu[0].hidden) {
		this.showMenu();
		this.menu.find('input')[0].focus();
	} else {
		this.hideMenu();
	}
};

kitty.Menu.prototype.setupKeys = function() {
	this.keys = {
		enter: 13,
		esc: 27,
		space: 32,
		left: 37,
		up: 38,
		right: 39,
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
	this.removeFirstButtonTabIndex();
	switch (e.keyCode) {
		case this.keys.right:
			e.preventDefault();
			this.focusNext(e.currentTarget);
			break;
		case this.keys.up:
			e.preventDefault();
			this.focusPrevious(e.currentTarget);
			break;
		case this.keys.down:
			e.preventDefault();
			this.focusNext(e.currentTarget);
			break;
		case this.keys.left:
			e.preventDefault();
			this.focusPrevious(e.currentTarget);
			break;

		case this.keys.esc:
			if(this.smallMode) {
				this.menuButton.focus();
				this.hideMenu();
				break;
			}
		case this.keys.tab:
			window.setTimeout(function() {
				this.resetFirstButtonTabIndex();
			}.bind(this), 1);
	}
};

kitty.Menu.prototype.focusNext = function(currentButton) {
	var next = $(currentButton).next();
	if(next[0]) {
		next.focus();
	} else {
		this.container.find('input').first().focus();
	}
};

kitty.Menu.prototype.focusPrevious = function(currentButton) {
	var prev = $(currentButton).prev();
	if(prev[0]) {
		prev.focus();
	} else {
		this.container.find('input').last().focus();
	}
};

kitty.Menu.prototype.resetFirstButtonTabIndex = function() {
	this.container.find('input')[0].tabIndex = 0;
};

kitty.Menu.prototype.removeFirstButtonTabIndex = function() {
	this.container.find('input')[0].tabIndex = -1;
};