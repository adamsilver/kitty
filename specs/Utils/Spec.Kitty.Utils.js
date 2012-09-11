describe("Utils", function() {

  describe("innerXhtml", function() {
  
    it("retrives valid xhtml as a string", function() {      
      var val = kitty.Utils.innerXhtml(document.getElementById("fixture"));      
      expect(val).toBe("Inner text<span class='myClass'></span><a href='#'>Dude</a>");
    });
  
  });

});