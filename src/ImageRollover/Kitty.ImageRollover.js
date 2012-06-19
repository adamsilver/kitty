var Kitty = Kitty || {};
Kitty.ImageRollover = function(image, rolloverImageSource) {
	this.rolloverImageSource = rolloverImageSource;
	this.preloadedImage = new Image();
	this.preloadedImage.src = rolloverImageSource;
	this.image = image;
	this.originalImageSource = this.image.attr("src");
	this.image.on("mouseover", $.proxy(this, "handleImage_onMouseOver"));
	this.image.on("mouseout", $.proxy(this, "handleImage_onMouseOut"));
};
Kitty.ImageRollover.prototype.handleImage_onMouseOver = function(e) {
	this.image.attr("src", this.rolloverImageSource);
};
Kitty.ImageRollover.prototype.handleImage_onMouseOut = function(e) {
	this.image.attr("src", this.originalImageSource);
};
Kitty.ImageRollover.prototype.destroy = function() {
	
};