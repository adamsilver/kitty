kitty.Accordion = function(container, options) {
	this.animationDuration = 100;
	this.options = this.getOptions(options);
	this.container = container;
	this.panels = container.find(".panel");
	this.currentlyOpenPanelIndex = -1;
	if(this.options.startCollapsed) {
		this.panels.css("display", "none");
	} else {
		this.panels.filter(":gt(0)").css("display", "none");
		this.currentlyOpenPanelIndex = 0;
	}

	this.container.on("click", ".activator", $.proxy(this.onActivatorClicked, this));	
};

kitty.Accordion.prototype.getOptions = function(options) {
	var options = options || {};
	options.startCollapsed = options.startCollapsed || false;
	return options;
};

kitty.Accordion.prototype.onActivatorClicked = function(e) {
	e.preventDefault();
	var link = e.target;
	this.activatePanel(link);
};

kitty.Accordion.prototype.activatePanel = function(link) {
	var href = link.href;
	var panel;
	href = href.substr(href.indexOf("#"), href.length);
	panel = $(href);

	if(this.isPanelHidden(panel)) {
		this.hideCurrentlyOpenPanel();
		this.showPanel(panel);
	} else {
		this.hidePanel(panel);
	}
};

kitty.Accordion.prototype.showPanel = function(panel) {
	panel.animate({	"height": "show" }, { duration: this.animationDuration, complete: $.proxy(this, "onShowAnimationComplete", panel)});
};

kitty.Accordion.prototype.onShowAnimationComplete = function(panel) {
	this.currentlyOpenPanelIndex = this.panels.index(panel);
};

kitty.Accordion.prototype.hidePanel = function(panel) {
	panel.animate({ "height": "hide" }, { duration: this.animationDuration, complete: $.proxy(this, "onHideAnimationComplete") });
};

kitty.Accordion.prototype.onHideAnimationComplete = function(panel) {
	this.currentlyOpenPanelIndex = -1;
};

kitty.Accordion.prototype.isPanelHidden = function(panel) {
	return this.panels.index(panel) != this.currentlyOpenPanelIndex;
};

kitty.Accordion.prototype.hideCurrentlyOpenPanel = function() {
	var currentlyOpenPanel = this.panels.filter(":eq(" + this.currentlyOpenPanelIndex + ")")
	this.hidePanel(currentlyOpenPanel);
};