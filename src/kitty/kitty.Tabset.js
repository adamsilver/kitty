kitty.Tabset = function(container) {
	this.container = container;
	 this.keys = {
		left: 37,
		right: 39
   };
	this.cssActive = "active";
	this.cssHide = "hidden";
	this.links = container.find("> ul a");
	this.panels = container.find(".tabs__panel");
	this.panels.addClass("hidden");
	container.find(".tabs__panel:first").removeClass(this.cssHide);
	
	this.links.on("click", $.proxy(this, 'onTabClick'));
	this.links.on('keydown', $.proxy(this, 'onTabKeydown'));

	// enhance markup
	container.find('> ul').attr('role', 'tablist');
	this.links.attr('role', 'tab');
	this.links.attr('tabindex', '-1');
  $('.tabs > ul li').attr('role', 'presentation');
	this.panels.attr('role', 'tabpanel');

	container.find("> ul a:first")
		.attr('aria-selected', 'true')
		.attr('tabindex', '0');
};

kitty.Tabset.prototype.onTabClick = function(e) {
	e.preventDefault();
	var newTab = $(e.target);
	var currentTab = this.getCurrentTab();
	this.unhighlightTab(currentTab);
	this.hidePanel(currentTab);
	this.highlightTab(newTab);
	this.showPanel(newTab);
};

kitty.Tabset.prototype.onTabKeydown = function(e) {
	switch(e.keyCode) {
		case this.keys.left:
			this.activatePreviousTab();
			break;
		case this.keys.right:
			this.activateNextTab();
			break;
	}
};

kitty.Tabset.prototype.activateNextTab = function() {
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

kitty.Tabset.prototype.activatePreviousTab = function() {
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

kitty.Tabset.prototype.showPanel = function(tab) {
	$(this.getHref(tab)).removeClass(this.cssHide);
};

kitty.Tabset.prototype.hidePanel = function(tab) {
	$(this.getHref(tab)).addClass(this.cssHide);
};

kitty.Tabset.prototype.unhighlightTab = function(tab) {
	tab.attr('aria-selected', 'false');
	tab.attr('tabindex', '-1');
};

kitty.Tabset.prototype.highlightTab = function(tab) {
	tab.attr('aria-selected', 'true');
	tab.attr('tabindex', '0');
};

kitty.Tabset.prototype.getCurrentTab = function() {
	return this.container.find("[role=tab][aria-selected=true]");
};

// this is because IE doesn't always return the actual value but a relative full path
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
kitty.Tabset.prototype.getHref = function(link) {
	var href = link.attr("href");
	href = href.slice(href.indexOf("#"), href.length);
	return href;
};