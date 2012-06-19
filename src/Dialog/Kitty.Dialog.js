var Kitty = Kitty || {};

Kitty.Dialog = function(options) {
  this.options = options || {};
  this.overlay = this.options.overlay || null;
  this.body = $("body");
  this.container = $("<div class='dialog off'/>");
  this.body.append(this.container);
};

Kitty.Dialog.prototype.setHtml = function(html) {
  this.container.html(html);
};

Kitty.Dialog.prototype.show = function(coordinates) {
  if(this.overlay) {
    this.overlay.show();
  }
  this.container.removeClass("off");  
  coordinates = coordinates || {};  
  this.container.css({ top: coordinates.y || this.getCenterPositionY(), left: coordinates.x || this.getCenterPositionX() })
};

Kitty.Dialog.prototype.getCenterPositionY = function() {
  var y = (($(window).height()+ - this.container.height()) / 2) + $(window).scrollTop();
  if(y < 0) y = 0;
  return y;
};

Kitty.Dialog.prototype.getCenterPositionX = function() {
  var y = (($(window).width()+ - this.container.width()) / 2) + $(window).scrollLeft();
  if(y < 0) y = 0;
  return y;
};

Kitty.Dialog.prototype.hide = function() {
  this.container.addClass("off");
  if(this.overlay) {
    this.overlay.hide();
  }
};

Kitty.Dialog.prototype.destroy = function() {
  this.container.remove();
};