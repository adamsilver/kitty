describe("Accordion", function() {
  
  var fixture, originalHtml, rootNode, links, panels, accordion;

  beforeEach(function() {
    fixture = $("#fixture");
    originalHtml = fixture.html();
    rootNode = $("#accordion");
    panels = rootNode.find(".panel");
    links = rootNode.find("a.activator");
    accordion = new kitty.Accordion(rootNode);
  });

  afterEach(function() {
    fixture.html(originalHtml);
  });
  
  describe("creating a new accordion", function() {
    it("closes all the panels except for the first", function() {
      expect($(panels[0]).css("display")).toBe("block");
      expect($(panels[1]).css("display")).toBe("none");
      expect($(panels[2]).css("display")).toBe("none");
    });
  });

  describe("activating a panel", function() {
    it("opens the panel", function() {      
      $(links[1]).click();
      waits(400);
      runs(function() {
        expect($(panels[1]).css("display")).toBe("block");
      });
    });
    it("closes the previously active/open panel", function() {
      $(links[1]).click();
      waits(400);
      runs(function() {
        expect($(panels[0]).css("display")).toBe("none");
      });
    });

  });

  describe("deactivating a panel", function() {    
    it("closes the active panel", function() {      
      $(links[0]).click();
      waits(400);
      runs(function() {
        expect(panels.filter(":eq(0)").css("display")).toBe("none");
      });
    });
  });
  
  describe("destroying the accordion", function() {    
    beforeEach(function() {
      spyOn($.fn, "unbind");
      accordion.destroy();
    });
    it("restores to original html state", function() {
      expect($("#fixture").html()).toBe(originalHtml);
    });
    it("removes event handlers", function() {
      expect($.fn.unbind.mostRecentCall.object[0]).toBe(links[0]);
      expect($.fn.unbind.mostRecentCall.object[1]).toBe(links[1]);
      expect($.fn.unbind.mostRecentCall.object[2]).toBe(links[2]);
      expect($.fn.unbind).toHaveBeenCalledWith("click", accordion.handleActivator_onClick);
      //expect(links).not.toHandle("click", accordion.handleActivator_onClick);
    });
  });
});