var Kitty = Kitty || {};
Kitty.Accordion = function(container) {
  this.container = container;
  this.panels = container.find(".panel");
  this.links = container.find("a.activator");
  this.panels.filter(":gt(0)").css("display", "none");
  this.links.bind("click", $.proxy(this.handleActivator_onClick, this));
  this.currentlyOpenPanelIndex = 0;
}
Kitty.Accordion.prototype.handleActivator_onClick = function(e) {
  e.preventDefault();
  var link = $(e.target);
  var href = link[0].href;
  href = href.substr(href.indexOf("#"), href.length);
  var panel = $(href);  
  if(panel.css("display") == "none") {
    panel.animate({"height": "show"}, { duration: 300} );
  }
  this.hideCurrentlyOpenPanel();
  this.currentlyOpenPanelIndex = this.panels.index(panel);
}
Kitty.Accordion.prototype.hideCurrentlyOpenPanel = function() {
  this.panels.filter(":eq("+this.currentlyOpenPanelIndex+")").animate({"height": "hide"}, {duration: 300});
}
Kitty.Accordion.prototype.destroy = function() {
  this.panels.removeAttr("style");
  //for(var i = 0; i < this.panels.length; i++) {
    //this.panels[i].removeAttribute("style");
  //}
  this.links.unbind("click", this.handleActivator_onClick);  
}