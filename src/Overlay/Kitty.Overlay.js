var Kitty = Kitty || {};
Kitty.Overlay = function() {
	this.container = $('<div class="overlay offScreen" />');
	$("body").append(this.container);
}
Kitty.Overlay.prototype.show = function() {
	this.container.removeClass('offScreen');
}
Kitty.Overlay.prototype.hide = function() {
	this.container.addClass('offScreen');
}
