describe("Overlay", function() {
  
  var overlay, overlayElement;

  beforeEach(function() {
    overlay = new kitty.Overlay();  
    overlayElement = $(".overlay");
  });

  afterEach(function() {
    overlay = null;
    overlayElement.remove();
    overlayElement = null;
  });

  describe("Showing an overlay", function() {
    it("Shows the overlay", function() {
      overlay.show();
      expect(overlayElement).not.toHaveClass("offScreen");
    });
  });

  describe("Hiding the overlay", function() {
    it("Hides the overlay", function() {
      overlay.hide();
      expect(overlayElement).toHaveClass("offScreen");
    });
  });

});