var Kitty = Kitty || {};

Kitty.Carousel = function(container) {
  this.ul = container.find("ul.items");
  this.lis = this.ul.find("li.item");
  this.ul.width(this.getTotalLiWidth());
};

Kitty.Carousel.prototype.getTotalLiWidth = function() {
  var length = this.lis.length;
  var width = this.lis.width();
  var totalWidth = width * length;
  return totalWidth;
};

Kitty.Carousel.prototype.moveBackwards = function() {
  var currentLeft = parseInt(this.ul.css("left"), 10);
  var newLeft = currentLeft - 200;
  this.ul.animate({"left": newLeft+"px"});
};

Kitty.Carousel.prototype.moveForwards = function() {
  var currentLeft = parseInt(this.ul.css("left"), 10);
  var newLeft = currentLeft + 200;
  this.ul.animate({"left": newLeft+"px"});
};

Kitty.Carousel.prototype.destroy = function() {
  this.ul.css("width", "");
};