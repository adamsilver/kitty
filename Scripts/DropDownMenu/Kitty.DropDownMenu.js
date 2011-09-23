var Kitty = Kitty || {};
Kitty.DropDownMenu = function(container) {
  var links = container.find("a");
  for(var i = 0; i < links.length; i++) {
    new Kitty.DropDownMenu.LinkHandler($(links[i]));
  }
}
Kitty.DropDownMenu.LinkHandler = function(link) {
  this.link = link;
  this.cssHide = "off";
  this.subMenu = this.getSubMenu();
  this.li = this.link.parents("li");
  this.link.bind("mouseenter", $.proxy(this, "showSubMenu"));
  this.link.bind("focus", $.proxy(this, "showSubMenu"));
  this.link.bind("blur", $.proxy(this, "hideSubMenu"));
  // if this li is not inside sub menu
  if(this.li.parents(".subMenu").length == 0) {
    this.li.bind("mouseleave", $.proxy(this, "hideSubMenu"));
  }
}
Kitty.DropDownMenu.LinkHandler.prototype.getSubMenu = function() {
  var subMenu = this.link.parents(".subMenu"); 
  if(subMenu.length === 0) {
    subMenu = this.link.parents("li").find(".subMenu");
  }
  return subMenu;
}
Kitty.DropDownMenu.LinkHandler.prototype.showSubMenu = function() {
  this.subMenu.removeClass(this.cssHide);
}
Kitty.DropDownMenu.LinkHandler.prototype.hideSubMenu = function() {
  this.subMenu.addClass(this.cssHide);
}