describe("CheckboxDisabler", function() {
  
  beforeEach(function() {
    this.originalFixtureHtml = $("#fixture").html();
    this.checkboxes = $("#fixture").find("input[type=checkbox]");
  });
  
  afterEach(function() {
    $("#fixture").html(this.originalFixtureHtml);
  })
  
  describe("marking the max amount of checkboxes as checked", function() {    
       
    it("disables the remaining checkboxes", function() {
      var disabler = new Kitty.CheckboxDisabler(this.checkboxes, 2);
      $(this.checkboxes[0]).trigger("click");
      $(this.checkboxes[1]).trigger("click");
      expect(this.checkboxes[2].disabled).toBe(true);
    });
    
    describe("and then unmarking a checkbox", function() {
      it("enables the remaining checkboxes", function() {
        var disabler = new Kitty.CheckboxDisabler(this.checkboxes, 2);
        $(this.checkboxes[0]).trigger("click");
        $(this.checkboxes[1]).trigger("click");
        $(this.checkboxes[1]).trigger("click");
        expect(this.checkboxes[2].disabled).toBe(false);
      });
    });
    
  });
  
  describe("teardown", function() {
    it("removes the event handlers", function() {
      var disabler = new Kitty.CheckboxDisabler(this.checkboxes, 2);
      spyOn($.fn, "unbind");
      
      disabler.teardown();      
      expect($.fn.unbind).toHaveBeenCalled();      
    })
  });

});