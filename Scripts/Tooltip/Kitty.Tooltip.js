var Kitty = Kitty || {};
Kitty.Tooltip = function(activator) {
	activator.on("focus", $.proxy(this, "handleActivator_onFocus"));
}
Kitty.Tooltip.prototype.handleActivator_onFocus = function(e) {
	$("body").append('<div class="tooltip"></div>');
}