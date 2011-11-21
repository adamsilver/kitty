var Kitty = Kitty || {};
Kitty.Tooltip = function(activator, content) {
	this.activator = activator;
	this.tooltip = $('<div class="tooltip offScreen">'+content+'</div>');
	this.activator.on("focus", $.proxy(this, "handleActivator_onFocus"));
	this.activator.on("blur", $.proxy(this, "handleActivator_onBlur"));
	this.activator.on("mouseover", $.proxy(this, "handleActivator_onMouseover"));
}
Kitty.Tooltip.prototype.handleActivator_onFocus = function(e) {
	this.tooltip.removeClass("offScreen");
	this.tooltip.css("left", this.activator.offset().left + 20 + "px");
	this.tooltip.css("top", this.activator.offset().top + 20 + "px");
	$("body").append(this.tooltip);
}
Kitty.Tooltip.prototype.handleActivator_onBlur = function(e) {
	this.tooltip.addClass("offScreen");
	this.tooltip.remove();
}
Kitty.Tooltip.prototype.handleActivator_onMouseover = function(e) {
	this.tooltip.css("left", (e.pageX + 20) + "px");
	this.tooltip.css("top", (e.pageY + 20) + "px");
	$("body").append(this.tooltip);
}