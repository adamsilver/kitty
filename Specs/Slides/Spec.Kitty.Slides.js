describe("Slides", function () {

  jasmine.getFixtures().fixturesPath = '.';

  var fixture1 = null;
  var slides = null;
  var items = null;
  var paginationLinks = null;

  beforeEach(function () {
    jasmine.getFixtures().load('Spec.Kitty.Slides.Fixture1.html');
    fixture1 = $("#slides");
    items = fixture1.find(".items .item");
  });

  describe("Creating a new carousel", function () {
    describe("Without options", function () {
      beforeEach(function () {
        slides = new Kitty.Slides(fixture1);
      });
      it("Has default delay", function () {
        expect(slides.options.delay).toBe(400);
      });
    });

    describe("With options", function () {
      beforeEach(function () {
        slides = new Kitty.Slides(fixture1, {
          delay: 1000
        });
      });
      it("Overrides the delay between showing the next item", function () {
        expect(slides.options.delay).toBe(1000);
      });
    });

    describe("With more than one item", function () {
      beforeEach(function () {
        jasmine.Clock.useMock();
        slides = new Kitty.Slides(fixture1);
        paginationLinks = fixture1.find(".pagination a");
      })
      it("Creates pagination 'dots'", function () {
        var paginationContainer = fixture1.find(".pagination");
        expect(paginationContainer).toExist();
        expect(paginationContainer.find("a").length).toBe(3);
      });
      it("Collapses the carousel to show the first item only", function () {
        expect(items.filter(":eq(0)")).toBeVisible();
        expect(items.filter(":eq(1)")).not.toBeVisible();
        expect(items.filter(":eq(2)")).not.toBeVisible();
      });
      it("Shows the next item after a period of time", function () {
        jasmine.Clock.tick(slides.options.delay);
        expect(items.filter(":eq(0)")).not.toBeVisible();
        expect(items.filter(":eq(1)")).toBeVisible();
      });
      it("Highlights the first dot", function () {
        expect(paginationLinks.filter(":eq(0)")).toHaveClass("selected");
      });
      it("Highlights the second (current) dot after a period of time", function () {
        jasmine.Clock.tick(slides.options.delay);
        expect(paginationLinks.filter(":eq(0)")).not.toHaveClass("selected");
        expect(paginationLinks.filter(":eq(1)")).toHaveClass("selected");
      });
    });
  });

  describe("Clicking pagination 'dot'", function () {
    beforeEach(function () {
      slides = new Kitty.Slides(fixture1);
      paginationLinks = fixture1.find(".pagination a");
    });
    it("Cancels default behaviour", function () {
      var fakeEvent = {
        preventDefault: jasmine.createSpy()
      }
      spyOn(slides, "handlePaginationLink_onClick").andCallThrough();
      slides.handlePaginationLink_onClick(fakeEvent);
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
    it("Displays the related item", function () {
      paginationLinks.filter(":eq(1)").trigger("click");
      expect(items.filter(":eq(0)")).not.toBeVisible();
      expect(items.filter(":eq(1)")).toBeVisible();
    });
    it("Resets the automatic timer", function () {
      var timer = slides.timer;
      spyOn($, "proxy");
      spyOn(window, "clearInterval");
      spyOn(window, "setInterval");

      paginationLinks.filter(":eq(1)").trigger("click");
      expect(window.clearInterval).toHaveBeenCalledWith(timer);
      expect($.proxy).toHaveBeenCalledWith(slides.showNextItem, slides);
      expect(window.setInterval).toHaveBeenCalled();
    });
    it("Highlights the current dot", function () {
      paginationLinks.filter(":eq(1)").trigger("click");
      expect(paginationLinks.filter(":eq(0)")).not.toHaveClass("selected");
      expect(paginationLinks.filter(":eq(1)")).toHaveClass("selected");
    });
  })

});
