describe("Dialog", function() {
  
  var dialog, dialogElement;

  describe("Without an overlay/mask/screen", function() {
    
    beforeEach(function() {
      dialog = new Kitty.Dialog();
      dialogElement = $(".dialog");
    });

    afterEach(function() {    
      dialog = null;
      dialogElement.remove();
      dialogelement = null;
    });

    describe("Creating a new Dialog", function() {    
      it("Appends a new dialog container node to the body", function() {        
        expect(dialogElement).toExist();      
      });  
      it("Isn't displayed", function() {
        expect(dialogElement).toHaveClass("off");
      });    
    });
    
    describe("Setting a dialog's content", function() {    
      it("Sets the content", function() {
        var content = "Woop";
        dialog.setHtml(content);
        expect(dialogElement.html()).toBe(content);
      });    
    });
    
    describe("Showing a dialog", function() {    
      it("Shows the dialog", function() {      
        dialog.show();      
        expect(dialogElement).not.toHaveClass("off");     
      });    
      it("Centers the dialog to the viewport", function() {
        dialog.setHtml("<div style='width: 200px; height: 200px'></div>");
        dialog.show();      
        var positionX = Math.floor( ( ( $(window).width() + -dialogElement.width() ) / 2 ) + $(window).scrollLeft() );
        var positionY = Math.floor( ( ( $(window).height() + -dialogElement.height() ) / 2 ) + $(window).scrollTop() );
      
        expect(parseInt(dialogElement.css("top"), 10)).toBe(positionY);
        expect(parseInt(dialogElement.css("left"), 10)).toBe(positionX);
      });        
    });
    
    describe("Showing a dialog with a given position", function() {
      it("Sets the position", function() {
        dialog.show({x: 10, y: 20});      
        expect(parseInt(dialogElement.css("left"), 10)).toBe(10);
        expect(parseInt(dialogElement.css("top"), 10)).toBe(20);
      });
    });
    
    describe("Hiding a dialog", function() {
      it("Hides the dialog", function() {
        dialog.show(); // set state
        dialog.hide();
        expect(dialogElement).toHaveClass("off");
      })
    });
    
    describe("Destroying a dialog", function() {
      it("Removes the container from the DOM", function() {
        dialog.destroy();      
        expect(dialogElement.parentNode).toBeUndefined();
      });
      
    });
  });

  describe("With overlay", function() {

    var overlayMock = {
      show: jasmine.createSpy(),
      hide: jasmine.createSpy()
    }

    beforeEach(function() {
      dialog = new Kitty.Dialog({ overlay: overlayMock });
    });
      
    afterEach(function() {    
      dialog = null;
      dialogElement.remove();
      dialogelement = null;
    });

    describe("Showing dialog", function() {
      it("Displays the overlay", function() {
        dialog.show();
        expect(overlayMock.show).toHaveBeenCalled();
      });
    });

    describe("Hiding dialog", function() {
      it("Hides the overlay", function() {
        dialog.hide();
        expect(overlayMock.hide).toHaveBeenCalled();
      });
    });

  });

});