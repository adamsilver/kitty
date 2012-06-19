var Kitty = Kitty || {};
Kitty.Tooltip = function(activator, content) {
	this.activator = activator;
	this.tooltip = $('<div class="tooltip offScreen">'+content+'</div>');
	this.activator.on("focus", $.proxy(this, "handleActivator_onFocus"));
	this.activator.on("blur", $.proxy(this, "handleActivator_onBlur"));
	this.activator.on("mouseover", $.proxy(this, "handleActivator_onMouseover"));
	this.activator.on("mousemove", $.proxy(this, "handleActivator_onMousemove"));
	this.activator.on("mouseleave", $.proxy(this, "handleActivator_onMouseleave"));
};
Kitty.Tooltip.prototype.handleActivator_onFocus = function(e) {
	this.tooltip.removeClass("offScreen");
	this.tooltip.css("left", this.activator.offset().left + 20 + "px");
	this.tooltip.css("top", this.activator.offset().top + 20 + "px");
	$("body").append(this.tooltip);
};
Kitty.Tooltip.prototype.handleActivator_onBlur = function(e) {
	this.hideTooltip();
};
Kitty.Tooltip.prototype.handleActivator_onMouseover = function(e) {
	this.showTooltip(e);
};
Kitty.Tooltip.prototype.handleActivator_onMousemove = function(e) {
	this.showTooltip(e);
};
Kitty.Tooltip.prototype.handleActivator_onMouseleave = function(e) {
	this.hideTooltip();
};
Kitty.Tooltip.prototype.showTooltip = function(e) {
	this.tooltip.removeClass("offScreen");
	this.tooltip.css("left", (e.pageX + 20) + "px");
	this.tooltip.css("top", (e.pageY + 20) + "px");
	$("body").append(this.tooltip);
};
Kitty.Tooltip.prototype.hideTooltip = function() {
	this.tooltip.addClass("offScreen");
	this.tooltip.remove();
};
Kitty.Tooltip.prototype.destroy = function() {
	this.activator.off("focus", this.handleActivator_onFocus);
	this.activator.off("blur", this.handleActivator_onBlur);
	this.activator.off("mouseover", this.handleActivator_onMouseover);
	this.activator.off("mousemove", this.handleActivator_onMousemove);
	this.activator.off("mouseleave", this.handleActivator_onMouseleave);
};