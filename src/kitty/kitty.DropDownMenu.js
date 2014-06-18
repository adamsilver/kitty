kitty.DropDownMenu = function(container, options) {
	var links = container.find("a");
	for (var i = 0; i < links.length; i++) {
		new kitty.DropDownMenu.LinkHandler($(links[i]), options);
	}
};
kitty.DropDownMenu.LinkHandler = function(link, options) {
	this.link = link;
	this.options = $.extend({
		cssHide: "off"
	}, options);
	this.subMenu = this.getSubMenu();
	this.li = this.link.parents("li");
	this.link.bind("mouseenter", $.proxy(this, "showSubMenu"));
	this.link.bind("focus", $.proxy(this, "showSubMenu"));
	this.link.bind("blur", $.proxy(this, "hideSubMenu"));
	// if this li is not inside sub menu
	if (this.li.parents(".subMenu").length === 0) {
		this.li.bind("mouseleave", $.proxy(this, "hideSubMenu"));
	}
};
kitty.DropDownMenu.LinkHandler.prototype.getSubMenu = function() {
	var subMenu = this.link.parents(".subMenu");
	if (subMenu.length === 0) {
		subMenu = this.link.parents("li").find(".subMenu");
	}
	return subMenu;
};
kitty.DropDownMenu.LinkHandler.prototype.showSubMenu = function() {
	this.subMenu.removeClass(this.options.cssHide);
};
kitty.DropDownMenu.LinkHandler.prototype.hideSubMenu = function() {
	this.subMenu.addClass(this.options.cssHide);
};