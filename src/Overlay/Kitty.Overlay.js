var kitty = kitty || {};
kitty.Overlay = function() {
	this.container = $('<div class="overlay offScreen" />');
	$("body").append(this.container);
};
kitty.Overlay.prototype.show = function() {
	this.container.removeClass('offScreen');
};
kitty.Overlay.prototype.hide = function() {
	this.container.addClass('offScreen');
};