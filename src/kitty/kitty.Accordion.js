kitty.Accordion = function(container, options) {
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
	var link = $(e.target);
	this.activatePanel(link);
};

kitty.Accordion.prototype.activatePanel = function(link) {
	var href = link[0].href;
	var panel;
	href = href.substr(href.indexOf("#"), href.length);
	panel = $(href);
	if (panel.css("display") === "none") {
		panel.animate({
			"height": "show"
		}, {
			duration: 300
		});
	}
	this.hideCurrentlyOpenPanel();
	this.currentlyOpenPanelIndex = this.panels.index(panel);
};

kitty.Accordion.prototype.hideCurrentlyOpenPanel = function() {
	this.panels.filter(":eq(" + this.currentlyOpenPanelIndex + ")").animate({
		"height": "hide"
	}, {
		duration: 300
	});
};