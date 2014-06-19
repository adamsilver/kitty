describe("Accordion", function() {

	var accordion;
	var mockContainer;
	var mockPanels;
	var mockActivators;
	var mockFirstPanel;
	var mockProxyHandleActivatorClick;

	beforeEach(function() {
		mockContainer = jasmine.createSpyObj('mockContainer', [
			'find'
		]);
		mockPanels = jasmine.createSpyObj('mockPanels', [
			'filter',
			'removeAttr'
		]);
		mockFirstPanel = jasmine.createSpyObj('mockFirstPanel', [
			'css'
		]);
		mockPanels.filter.andCallFake(function(selector) {
			if (selector === ":gt(0)") {
				return mockFirstPanel;
			}
		});
		mockActivators = jasmine.createSpyObj('mockActivators', [
			'bind'
		]);
		mockContainer.find.andCallFake(function(selector) {
			if (selector === ".panel") {
				return mockPanels;
			}
			if (selector === "a.activator") {
				return mockActivators;
			}
		});
		mockProxyHandleActivatorClick = function() {};
		spyOn($, 'proxy').andCallFake(function(fn) {
			if (fn === kitty.Accordion.prototype.handleActivator_onClick) {
				return mockProxyHandleActivatorClick;
			}
		});
	});

	describe("Creating an accordion", function() {
		beforeEach(function() {
			accordion = new kitty.Accordion(mockContainer);
		});
		it("Creates a public member for the container", function() {
			expect(accordion.container).toBe(mockContainer);
		});
		it("Assigns a public member for the panels", function() {
			expect(accordion.panels).toBe(mockPanels);
		});
		it("Finds the panels", function() {
			expect(mockContainer.find).toHaveBeenCalledWith('.panel');
		});
		it("Assigns a public member for the activators", function() {
			expect(accordion.links).toBe(mockActivators);
		});
		it("Finds the activators", function() {
			expect(mockContainer.find).toHaveBeenCalledWith('a.activator');
		});
		it("Hides the first panel", function() {
			expect(mockPanels.filter).toHaveBeenCalledWith(":gt(0)");
			expect(mockFirstPanel.css).toHaveBeenCalledWith("display", "none");
		});
		it("Listens for a click even on the activators", function() {
			expect($.proxy).toHaveBeenCalledWith(accordion.handleActivator_onClick, accordion);
			expect(mockActivators.bind).toHaveBeenCalledWith("click", mockProxyHandleActivatorClick);
		});
		it("Assigns a publc member currentlyOpenPanelIndex of zero", function() {
			expect(accordion.currentlyOpenPanelIndex).toBe(0);
		});
	});



	/*

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
*/
});