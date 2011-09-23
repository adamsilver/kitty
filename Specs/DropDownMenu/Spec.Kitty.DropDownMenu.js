describe("DropDownMenu", function() {
  
  jasmine.getFixtures().fixturesPath = '.';

  var container = null;
  var menu = null;
  var topLevelLinks = null;

  beforeEach(function() {
    jasmine.getFixtures().load('Spec.Kitty.DropDownMenu.Fixture1.html');
    container = $("#dropDownMenu");
    topLevelLinks = container.find("ul > li > a");
  });

  describe("Hovering over a top level link", function() {    
    it("Displays the sub menu", function() {
      menu = new Kitty.DropDownMenu(container);
      var link = topLevelLinks.filter(":eq(0)");
      link.trigger("mouseenter");
      var subMenu = link.parents("li").find("div.subMenu");
      expect(subMenu).not.toHaveClass("off");
    });
  });
  
  describe("Move the mouse off the list item", function() {    
    it("Hides the sub menu", function() {
       menu = new Kitty.DropDownMenu(container);
       var link = topLevelLinks.filter(":eq(0)");
       link.trigger("mouseenter"); // show to setup DOM state
       link.parents("li").trigger("mouseleave");
       var subMenu = link.parents("li").find("div.subMenu");
       expect(subMenu).toHaveClass("off");
    });
  });
  
  describe("Tabbing to a top level menu item", function() {    
    it("Displays the menu", function() {
      menu = new Kitty.DropDownMenu(container);
      var link = topLevelLinks.filter(":eq(0)");
      link.trigger("focus");
      var subMenu = link.parents("li").find("div.subMenu");
      expect(subMenu).not.toHaveClass("off");
    });
  });
  
  describe("Tabbing away from a top level menu item", function() {    
    it("Hides the sub menu", function() {
      menu = new Kitty.DropDownMenu(container);
      var link = topLevelLinks.filter(":eq(0)");
      link.trigger("focus"); // show to setup DOM state
      link.trigger("blur");
      var subMenu = link.parents("li").find("div.subMenu");
      expect(subMenu).toHaveClass("off");
    });    
  });

  describe("Tabbing to a sub menu link", function() {
    it("Displays the menu", function() {
      menu = new Kitty.DropDownMenu(container);
      var subMenu = container.find("div.subMenu:eq(0)");
      var link = subMenu.find("a:eq(0)");
      link.trigger("focus");
      expect(subMenu).not.toHaveClass("off");
    });
  });

  describe("Tabbing away from a sub menu link", function() {
    it("Hides the menu", function() {
      menu = new Kitty.DropDownMenu(container);
      var subMenu = container.find("div.subMenu:eq(0)");
      var link = subMenu.find("a:eq(0)");
      link.trigger("focus"); // show to setup DOM state
      link.trigger("blur");
      expect(subMenu).toHaveClass("off");
    });
  });
  
  describe("destroying a drop down menu", function() {
    it("restores original state");
    it("removes events");
  });

});