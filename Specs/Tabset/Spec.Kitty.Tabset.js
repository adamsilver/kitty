describe("Tabset", function() {
  
  var originalHtml = null;
  
  beforeEach(function() {
    originalHtml = $("#fixture").html();
  });
  
  afterEach(function() {
    $("#fixture").html(originalHtml);
  });

  describe("Creating a new tabset", function() {
    
    it("Hides all tab panels except for the first", function() {
      var container = $("#tabs");
      var tabset = new Kitty.Tabset(container);      
      expect($("#panel1").hasClass("hide")).toBe(false);
      expect($("#panel2").hasClass("hide")).toBe(true);
      expect($("#panel3").hasClass("hide")).toBe(true);
      expect($("a[href$='#panel1']").hasClass("active")).toBe(true);
    });
    
  });
  
  describe("Activating a panel", function() {
    
    it("Hides the active panel and displays the new panel", function() {
      var container = $("#tabs");
      var tabset = new Kitty.Tabset(container);      
      $("a[href$='#panel2']").trigger("click");
      expect($("#panel1").hasClass("hide")).toBe(true);
      expect($("#panel2").hasClass("hide")).toBe(false);      
    });

    it("Highlights the tab link and unhighlights previously active link", function() {
      var container = $("#tabs");
      var tabset = new Kitty.Tabset(container);     
      var link2 = $("a[href$='#panel2']");
      var link3 = $("a[href$='#panel3']");
      
      link2.click();
      expect(link2.hasClass("active")).toBe(true);
      link3.click();
      expect(link2.hasClass("active")).toBe(false);
    });
    
  });
  
  describe("Destroying a tabset", function() {
    
    it("Removes the events from the tab links", function() {
      var container = $("#tabs");
      var tabset = new Kitty.Tabset(container);
      tabset.destroy();
      var link2 = $("a[href='#panel2']");
      link2.click();
      // inspecting DOM to see if event was fired, but could have spyOn(tabset, "handleLink_onClick")
      // and check if called instead
      expect(link2.hasClass("active")).toBe(false);
    });
    
    it("Displays all the panels", function() {
      var container = $("#tabs");
      var tabset = new Kitty.Tabset(container);			
      tabset.destroy();
      expect($("#panel1").hasClass("hide")).toBe(false);  
      expect($("#panel2").hasClass("hide")).toBe(false);  
      expect($("#panel3").hasClass("hide")).toBe(false);  
    });
    
  });
  
});