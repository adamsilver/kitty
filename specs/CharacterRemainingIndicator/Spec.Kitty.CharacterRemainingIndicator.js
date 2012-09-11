describe("CharacterRemainingIndicator", function() {
  var textarea = null;
  beforeEach(function() {
    $("#fixture").html("<textarea id='description' />");
    textarea = document.getElementById("description");
  });
  
  afterEach(function() {
    textarea = null;
    $("#fixture").children().remove(); 
  })
  
  describe("Creating an instance", function() {
    describe("No specified field", function() {
      it("Throws an error", function() {
        expect(function() { new kitty.CharacterRemainingIndicator() }).toThrow("Provide a valid input.");  
      });
    });
    describe("Invalid field (not a textarea of input)", function() {
      it("Throws an error", function() {
        expect(function() { new kitty.CharacterRemainingIndicator({}) }).toThrow("Provide a valid input.");
      });
    });
    describe("Invalid input type (not text/password", function() {
      it("Throws an error", function() {
        expect(function() { new kitty.CharacterRemainingIndicator($('<input type="radio"/>')[0]) }).toThrow("Provide a valid input.");
      });
    });
    describe("With no options", function() {
      it("Has the correct defaults", function() {
        var remaining = new kitty.CharacterRemainingIndicator(textarea);        
        expect(remaining.options.maxLength).toBe(100);
        expect(remaining.options.textBefore).toBe("You have ");
        expect(remaining.options.textAfter).toBe(" characters remaining.");
        expect(remaining.options.indicator[0].tagName.toLowerCase()).toBe("div");
        expect(remaining.options.indicator.hasClass("indicator")).toBe(true);
      });
      it("Appends the indicator node to the parent of the field.", function() {
        var remaining = new kitty.CharacterRemainingIndicator(textarea);
        expect($("#fixture").find("div.indicator")[0]).toBeTruthy();
      });
    });
    
    it("Sets the indicator html", function() {
      var remaining = new kitty.CharacterRemainingIndicator(textarea);
      expect($("#fixture").find("div.indicator").html()).toBe(remaining.options.textBefore + "100" + remaining.options.textAfter);
    });
    
    describe("With options", function() {
      it("Overrides the options.", function() {
        var indicator = $("<div class='adam'></div>");
        $("#fixture").append(indicator);
        var remaining = new kitty.CharacterRemainingIndicator(textarea, {
          textBefore: "Yo before",
          textAfter: "Yo after",
          maxLength: 94,
          indicator: indicator
        });
        expect(remaining.options.textBefore).toBe("Yo before");
        expect(remaining.options.textAfter).toBe("Yo after");
        expect(remaining.options.maxLength).toBe(94);
        expect(remaining.options.indicator).toBe(indicator);
      });
    });
    
  });
  
  describe("Entering text", function() {
    it("Updates the indicator to display the remaining character count", function() {   
      var remaining = new kitty.CharacterRemainingIndicator(textarea);
      var $textarea = $(textarea);
      var $indicator = $textarea.parent().find("div.indicator");
      
      // simulate entering text
      $textarea.val("hello");
      $textarea.trigger("change");
      
      expect($indicator.html()).toBe(remaining.options.textBefore + (remaining.options.maxLength - $textarea.val().length) + remaining.options.textAfter);
    });
  });
  
  describe("Deleting text", function() {
    it("Updates the indicator to display the remaining character count", function() {
      var remaining = new kitty.CharacterRemainingIndicator(textarea);
      var $textarea = $(textarea);
      var $indicator = $textarea.parent().find("div.indicator");
      
      // simulate pressing backspace
      $textarea.val("hello");
      $textarea.val("hell");      
      $textarea.trigger("keypress");
      
      expect($indicator.html()).toBe(remaining.options.textBefore + (96) + remaining.options.textAfter);
      
      // more simulation
      $textarea.val("hel");
      $textarea.trigger("keydown");
      
      expect($indicator.html()).toBe(remaining.options.textBefore + (97) + remaining.options.textAfter);
      
    });
  });
  
});