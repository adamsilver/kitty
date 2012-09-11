describe("CheckboxDisabler", function() {
  
  var fixture;
  var originalHtml;
  var checkboxes;
  var checkboxDisabler;

  beforeEach(function() {
    fixture = $("#fixture");
    originalHtml = fixture.html();
    checkboxes = fixture.find("input[type=checkbox]");
    checkboxDisabler = new kitty.CheckboxDisabler(checkboxes, 2);
  });  
  afterEach(function() {
    fixture.html(originalHtml);
  });  
  describe("marking the max amount of checkboxes as checked", function() {           
    it("disables the remaining checkboxes", function() {
      $(checkboxes[0]).trigger("click");
      $(checkboxes[1]).trigger("click");
      expect(checkboxes[2].disabled).toBe(true);
    });    
    describe("and then unmarking a checkbox", function() {
      it("enables the remaining checkboxes", function() {
        $(checkboxes[0]).trigger("click");
        $(checkboxes[1]).trigger("click");
        $(checkboxes[1]).trigger("click");
        expect(checkboxes[2].disabled).toBe(false);
      });
    });    
  });  
  describe("Destroy", function() {
    it("removes the event handlers", function() {
      spyOn($.fn, "unbind");      
      checkboxDisabler.destroy();      
      expect($.fn.unbind).toHaveBeenCalled();      
    })
  });

});