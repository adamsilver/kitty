var Kitty = Kitty || {};
Kitty.Tooltip = function(activator, content) {
	this.activator = activator;
	this.tooltip = $('<div class="tooltip offScreen">'+content+'</div>');
	this.activator.on("focus", $.proxy(this, "handleActivator_onFocus"));
	this.activator.on("blur", $.proxy(this, "handleActivator_onBlur"));
}
Kitty.Tooltip.prototype.handleActivator_onFocus = function(e) {
	this.tooltip.removeClass("offScreen");
	this.tooltip.css("left", this.activator.offset().left + 20 + "px");
	this.tooltip.css("top", this.activator.offset().top + 20 + "px");
	$("body").append(this.tooltip);
}
Kitty.Tooltip.prototype.handleActivator_onBlur = function(e) {
	this.tooltip.addClass("offScreen");
}