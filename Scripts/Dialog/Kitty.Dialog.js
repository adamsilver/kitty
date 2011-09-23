var Kitty = Kitty || {};

Kitty.Dialog = function() {
  this.body = $("body");
  this.container = $("<div class='dialog off'/>");
  this.body.append(this.container);
}

Kitty.Dialog.prototype.setHtml = function(html) {  
  this.container.html(html);
}

Kitty.Dialog.prototype.show = function(coordinates) {
  this.container.removeClass("off");  
  coordinates = coordinates || {};  
  this.container.css({ top: coordinates.y || this.getCenterPositionY(), left: coordinates.x || this.getCenterPositionX() })
}

Kitty.Dialog.prototype.getCenterPositionY = function() {
  var y = (($(window).height()+ - this.container.height()) / 2) + $(window).scrollTop();
  if(y < 0) y = 0;
  return y;
}

Kitty.Dialog.prototype.getCenterPositionX = function() {
  var y = (($(window).width()+ - this.container.width()) / 2) + $(window).scrollLeft();
  if(y < 0) y = 0;
  return y;
}

Kitty.Dialog.prototype.hide = function() {
  this.container.addClass("off")
}

Kitty.Dialog.prototype.teardown = function() {
  this.container.remove();
}