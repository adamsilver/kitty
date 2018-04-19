kitty.Tabs = function(container) {
	this.container = container;
	this.keys = { left: 37, right: 39, down: 40 };
	this.cssHide = "hidden";
	this.tabs = container.find("> ul a");
	this.panels = container.find(".tabs__panel");

	// events
	this.tabs.on("click", $.proxy(this, 'onTabClick'));
	this.tabs.on('keydown', $.proxy(this, 'onTabKeydown'));
	$(window).on('hashchange', $.proxy(this, 'onHashChange'));

	this.setupHtml();

	// setup state
	this.tabs.attr('tabindex', '-1');
	this.panels.attr('tabindex', '-1');
	this.panels.addClass("hidden");

	// if there's a tab that matches the hash
	var tab = this.getTab(window.location.hash);
	if(tab.length) {
		this.highlightTab(tab);
		this.showPanel(tab);
	} else {
		// or show the first
		var firstTab = this.tabs.first();
		this.highlightTab(firstTab);
		this.showPanel(firstTab);
	}
};

kitty.Tabs.prototype.onHashChange = function (e) {
	if(this.changingHash) {
		this.changingHash = false;
		return;
	}
	var tab = this.getTab(window.location.hash);
	var currentTab = this.getCurrentTab();
	if(tab.length) {
		this.hideTab(currentTab);
		this.showTab(tab);
	} else {
		var firstTab = this.tabs.first();
		this.hideTab(currentTab);
		this.showTab(firstTab);
	}
};

kitty.Tabs.prototype.hideTab = function (tab) {
	this.unhighlightTab(tab);
	this.hidePanel(tab);
};

kitty.Tabs.prototype.showTab = function (tab) {
	this.highlightTab(tab);
	this.showPanel(tab);
};

kitty.Tabs.prototype.getTab = function(hash) {
	return this.tabs.filter('a[href="' + hash +'"]');
};

kitty.Tabs.prototype.setupHtml = function() {
	this.container.find('> ul').attr('role', 'tablist');
	this.container.find('> ul li').attr('role', 'presentation');
	this.tabs.attr('role', 'tab');
	this.panels.attr('role', 'tabpanel');
	this.tabs.each($.proxy(function(i, tab) {
		var href = this.getHref($(tab));
		tab.id = 'tab_'+href.slice(1);
	}, this));
	this.panels.each($.proxy(function(i, panel) {
		$(panel).attr('aria-labelledby', this.tabs[i].id);
	}, this));
};

kitty.Tabs.prototype.onTabClick = function(e) {
	e.preventDefault();
	var newTab = $(e.target);
	var currentTab = this.getCurrentTab();
	this.hideTab(currentTab);
	this.showTab(newTab);
	this.createHistoryEntry(newTab);
};

kitty.Tabs.prototype.createHistoryEntry = function(tab) {
	var panel = this.getPanel(tab)[0];
	var id = panel.id;
	panel.id = "";
	this.changingHash = true;
	window.location.hash = this.getHref(tab).slice(1);
	panel.id = id;
};

kitty.Tabs.prototype.onTabKeydown = function(e) {
	switch(e.keyCode) {
		case this.keys.left:
			this.activatePreviousTab();
			break;
		case this.keys.right:
			this.activateNextTab();
			break;
		case this.keys.down:
			this.focusCurrentTab();
			e.preventDefault();
			break;
	}
};

kitty.Tabs.prototype.focusCurrentTab = function() {
	this.getPanel(this.getCurrentTab()).focus();
};

kitty.Tabs.prototype.activateNextTab = function() {
	var currentTab = this.getCurrentTab();
	var nextTab = currentTab.parent().next().find('[role=tab]');
	if(nextTab[0]) {
		this.hideTab(currentTab);
		this.showTab(nextTab);
		nextTab.focus();
		this.createHistoryEntry(nextTab);
	}
};

kitty.Tabs.prototype.activatePreviousTab = function() {
	var currentTab = this.getCurrentTab();
	var previousTab = currentTab.parent().prev().find('[role=tab]');
	if(previousTab[0]) {
		this.hideTab(currentTab);
		this.showTab(previousTab);
		previousTab.focus();
		this.createHistoryEntry(previousTab);
	}
};

kitty.Tabs.prototype.getPanel = function(tab) {
	return $(this.getHref(tab));
};

kitty.Tabs.prototype.showPanel = function(tab) {
	$(this.getHref(tab)).removeClass(this.cssHide);
};

kitty.Tabs.prototype.hidePanel = function(tab) {
	$(this.getHref(tab)).addClass(this.cssHide);
};

kitty.Tabs.prototype.unhighlightTab = function(tab) {
	tab.attr('aria-selected', 'false');
	tab.attr('tabindex', '-1');
};

kitty.Tabs.prototype.highlightTab = function(tab) {
	tab.attr('aria-selected', 'true');
	tab.attr('tabindex', '0');
};

kitty.Tabs.prototype.getCurrentTab = function() {
	return this.container.find("[role=tab][aria-selected=true]");
};

// this is because IE doesn't always return the actual value but a relative full path
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
kitty.Tabs.prototype.getHref = function(tab) {
	var href = tab.attr("href");
	return href.slice(href.indexOf("#"), href.length);
};