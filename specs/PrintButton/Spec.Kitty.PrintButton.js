describe("PrintButton", function() {
  
  var fixture = null;
  
  beforeEach(function() {
    fixture = $("#fixture");
  });
  
  afterEach(function() {
    fixture.children().remove();
  });
  
  describe("Creating a print button", function() {
    it("Injects button into target container", function() {
      var button = new kitty.PrintButton(fixture);      
      expect(fixture.html()).toBe('<a class="printButton" href="#">Print</a>');
    });
    
    describe("With custom text", function() {
      it("has specified text", function() {
        var button = new kitty.PrintButton(fixture, {text: "Woop print"});
        expect(fixture.html()).toBe('<a class="printButton" href="#">Woop print</a>');
      });      
    })
  });
  
  describe("Clicking on a print button", function() {
    it("Sends the page to print", function() {
      var button = new kitty.PrintButton(fixture, {text: "Woop print"});
      var link = fixture.find("a.printButton");
      spyOn(window, "print");
      link.click();
      expect(window.print).toHaveBeenCalled();
    });
  });
  
});