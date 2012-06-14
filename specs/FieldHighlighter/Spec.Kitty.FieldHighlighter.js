describe("FieldHighlighter", function() {
  
  var fixture = null;
  var field = null;
  var highlighter = null;
  
  beforeEach(function() {
    fixture = $("#fixture");
    field = $('<input type="text" />');
    fixture.append(field);
    highlighter = new Kitty.FieldHighlighter(field);  
  });
  
  afterEach(function() {
    highlighter = null;
    fixture.children().remove();
  });
  
  describe("Focusing on a field", function() {
    it("Highlights the field", function() {
      field.focus();      
      expect(field.hasClass("highlight")).toBe(true);      
    });    
  });
  
  describe("Blurring a field", function() {
    it("removes the highlight from the field", function() {
      field.focus();
      field.blur();
      expect(field.hasClass("highlight")).toBe(false);
    });      
  });
  
  
  describe("Tearing down the highlighter", function() {
    it("Removes the bound events", function() {      
      highlighter.teardown();     
      field.focus();      
      expect(field.hasClass("highlight")).toBe(false);
      
      field.addClass("highlight");
      field.blur();      
      expect(field.hasClass("highlight")).toBe(true);      
    });
  });

});