kitty.Accordion = function(container) {
	this.container = container;
	this.panels = container.find(".panel");
	this.links = container.find("a.activator");
	this.panels.filter(":gt(0)").css("display", "none");
	this.links.bind("click", $.proxy(this.handleActivator_onClick, this));
	this.currentlyOpenPanelIndex = 0;
};
kitty.Accordion.prototype.handleActivator_onClick = function(e) {
	e.preventDefault();
	var link = $(e.target),
		href = link[0].href,
		panel;
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
kitty.Accordion.prototype.destroy = function() {
	this.panels.removeAttr("style");
	//for(var i = 0; i < this.panels.length; i++) {
	//this.panels[i].removeAttribute("style");
	//}
	this.links.unbind("click", this.handleActivator_onClick);
};