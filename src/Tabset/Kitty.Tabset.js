var Kitty = Kitty || {};
Kitty.Tabset = function(container) {
  this.cssActive = "active";
  this.cssHide = "hide";
  this.links = container.find("a.tabActivator");
  this.panels = container.find("div.panel");
  this.panels.addClass("hide");
  container.find("div.panel:first").removeClass(this.cssHide);
  container.find("a.tabActivator:first").addClass(this.cssActive);
  this.links.bind("click", $.proxy(this.handleLink_onClick, this));
};
Kitty.Tabset.prototype.handleLink_onClick = function(e) {
  e.preventDefault();
  var link = $(e.target);
  var panel = $(this.getHref(link));
  this.panels.addClass(this.cssHide);
  this.links.removeClass(this.cssActive);
  panel.removeClass(this.cssHide);
  link.addClass(this.cssActive);
};
Kitty.Tabset.prototype.destroy = function() {
  this.panels.removeClass(this.cssHide);
  this.links.unbind("click", this.handleLink_onClick);
};
// this is because IE doesn't always return the actual value but a relative full path
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
Kitty.Tabset.prototype.getHref = function(link) {
  var href = link.attr("href");
  href = href.slice(href.indexOf("#"),href.length);
  return href;
};