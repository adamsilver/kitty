kitty.ListCollapser = function(container, options) {
	this.container = container;
	this.options = options || {};
	this.options.collapseAfter = this.options.collapseAfter || 4;
	this.options.expandText = this.options.expandText || "Expand";
	this.options.collapseText = this.options.collapseText || "Collapse";
	this.ul = container.find("ul");
	this.lis = this.ul.find("li");
	this.collapsibleLis = this.lis.filter(":gt(" + this.options.collapseAfter + ")");
	this.createToggleButton();
	this.collapse();
	this.collapsed = true;
};
kitty.ListCollapser.prototype.createToggleButton = function() {
	this.toggleButton = $('<a href="#" class="toggleItems"></a>');
	this.container.append(this.toggleButton);
	this.toggleButton.bind("click", $.proxy(this, "handleToggleButton_onClick"));
};
kitty.ListCollapser.prototype.destroy = function() {
	this.expand();
	this.toggleButton.remove();
};
kitty.ListCollapser.prototype.handleToggleButton_onClick = function(e) {
	e.preventDefault();
	if (this.collapsed) {
		this.expand();
	} else {
		this.collapse();
	}
};
kitty.ListCollapser.prototype.expand = function() {
	this.collapsibleLis.removeClass("hide");
	this.toggleButton.text(this.options.collapseText);
	this.collapsed = false;
};
kitty.ListCollapser.prototype.collapse = function() {
	this.collapsibleLis.addClass("hide");
	this.collapsed = true;
	this.toggleButton.text(this.options.expandText);
};