describe("Dialog", function() {
  
  describe("Creating a new Dialog", function() {
    
    it("Appends a new dialog container node to the body", function() {
      var dialog = new Kitty.Dialog();      
      var node = $(".dialog").get(0);      
      expect(node).toBe(dialog.container[0]);      
    });
  
    it("Isn't displayed", function() {
      var dialog = new Kitty.Dialog();
      expect(dialog.container.hasClass("off")).toBe(true);    
    });
    
  });
  
  describe("Setting a dialog's content", function() {
    
    it("Sets the content", function() {
      var dialog = new Kitty.Dialog();
      dialog.setHtml("woop");
      expect(dialog.container.html()).toBe("woop");
    });
    
  });
  
  describe("Showing a dialog", function() {
    
    it("Shows the dialog", function() {      
      var dialog = new Kitty.Dialog();
      dialog.show();      
      expect(dialog.container.hasClass("off")).toBe(false);      
    });
    
    it("Centers the dialog to the viewport", function() {
      var dialog = new Kitty.Dialog();
      dialog.setHtml("<div style='width: 200px; height: 200px'></div>");
      dialog.show();
      
      var container = dialog.container;
      var positionX = Math.floor( ( ( $(window).width() + -container.width() ) / 2 ) + $(window).scrollLeft() );
      var positionY = Math.floor( ( ( $(window).height() + -container.height() ) / 2 ) + $(window).scrollTop() );
    
      expect(parseInt(container.css("top"), 10)).toBe(positionY);
      expect(parseInt(container.css("left"), 10)).toBe(positionX);
    });
    
  });
  
  describe("Showing a dialog with a given position", function() {
    it("Sets the position", function() {
      var dialog = new Kitty.Dialog();
      dialog.show({x: 10, y: 20});      
      expect(parseInt(dialog.container.css("left"), 10)).toBe(10);
      expect(parseInt(dialog.container.css("top"), 10)).toBe(20);
    });
  });
  
  describe("Hiding a dialog", function() {
    it("Hides the dialog", function() {
      var dialog = new Kitty.Dialog();
      dialog.show();
      dialog.hide();
      expect(dialog.container.hasClass("off")).toBe(true);
    })
  });
  
  describe("Tearing a dialog instance down", function() {
    it("Removes the container from the DOM", function() {
      var dialog = new Kitty.Dialog();
      dialog.teardown();      
      expect(dialog.container[0].parentNode).toBeNull();
    });
    
  });
  
});