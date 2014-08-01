describe("DefaultText", function() {
  var fixture = $("#fixture");
  var input = null;
  beforeEach(function() {
    fixture.html('<input type="text" id="username" value="Default text" />');
    input = $("#username");
  });
  
  afterEach(function() {
    fixture.children().remove();
  });
  
  describe("Creating a default text control", function() {    
    describe("With no given input node", function() {
      it("Throws an error", function() {        
        expect(function() { new kitty.DefaultText() }).toThrow("Provide an input.");
      });
    });
  });
  
  describe("Input is focussed", function() {
    it("Clears the default text", function() {
      var defaultText = new kitty.DefaultText(input);      
      input.trigger("focus");
      expect(input.val()).toBe("");      
    });
  });
  
  describe("Input is blurred", function() {
    describe("No new text entered", function() {
      it("Sets the value back to the default", function() {
        var defaultText = new kitty.DefaultText(input);
        input.trigger("focus");
        input.trigger("blur");        
        expect(input.val()).toBe(input.prop("defaultValue"));
      });
    });
    
    describe("New text entered", function() {
      it("Doesn't revert back to the default text", function() {
        var defaultText = new kitty.DefaultText(input);
        input.trigger("focus");
        input.val("Some new value");
        input.trigger("blur");
        expect(input.val()).toBe("Some new value");
      });
    });
  });
  
  describe("Tearing down the instance", function() {
    it("Removes the events from the input", function() {
      var defaultText = new kitty.DefaultText(input);
      defaultText.teardown();
      
      if(input.data("events")) {
        expect(input.data("events").focus).toBeUndefined();
        expect(input.data("events").blur).toBeUndefined();
      }
      else {
        expect(input.data("events")).toBeUndefined();
      }
    });
  });
  
});