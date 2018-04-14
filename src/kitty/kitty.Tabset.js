kitty.Tabs = function(container) {
	this.container = container;
	this.keys = { left: 37, right: 39 };
	this.cssActive = "active";
	this.cssHide = "hidden";
	this.links = container.find("> ul a");
	this.panels = container.find(".tabs__panel");

	// events
	this.links.on("click", $.proxy(this, 'onTabClick'));
	this.links.on('keydown', $.proxy(this, 'onTabKeydown'));

	this.setupHtml();

	// setup state
	this.links.attr('tabindex', '-1');
	this.panels.addClass("hidden");
	this.highlightTab(this.links.first());
	this.showPanel(this.links.first());
};

kitty.Tabs.prototype.setupHtml = function() {
	this.container.find('> ul').attr('role', 'tablist');
	this.links.attr('role', 'tab');
    $('.tabs > ul li').attr('role', 'presentation');
	this.panels.attr('role', 'tabpanel');
};

kitty.Tabs.prototype.onTabClick = function(e) {
	e.preventDefault();
	var newTab = $(e.target);
	var currentTab = this.getCurrentTab();
	this.unhighlightTab(currentTab);
	this.hidePanel(currentTab);
	this.highlightTab(newTab);
	this.showPanel(newTab);
};

kitty.Tabs.prototype.onTabKeydown = function(e) {
	switch(e.keyCode) {
		case this.keys.left:
			this.activatePreviousTab();
			break;
		case this.keys.right:
			this.activateNextTab();
			break;
	}
};

kitty.Tabs.prototype.activateNextTab = function() {
	var currentTab = this.getCurrentTab();
	var nextTab = currentTab.parent().next().find('[role=tab]');
	if(nextTab[0]) {
		this.unhighlightTab(currentTab);
		this.highlightTab(nextTab);
		this.hidePanel(currentTab);
		this.showPanel(nextTab);
		nextTab.focus();
	}
};

kitty.Tabs.prototype.activatePreviousTab = function() {
	var currentTab = this.getCurrentTab();
	var previousTab = currentTab.parent().prev().find('[role=tab]');
	if(previousTab[0]) {
		this.unhighlightTab(currentTab);
		this.highlightTab(previousTab);
		this.hidePanel(currentTab);
		this.showPanel(previousTab);
		previousTab.focus();
	}
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
kitty.Tabs.prototype.getHref = function(link) {
	var href = link.attr("href");
	href = href.slice(href.indexOf("#"), href.length);
	return href;
};