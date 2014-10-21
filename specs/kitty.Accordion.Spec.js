describe("Accordion", function() {

	var accordion;
	var mockContainer;
	var mockPanels;
	var mockActivators;
	var mockFirstPanel;
	var mockProxyHandleActivatorClick;

	beforeEach(function() {
		mockContainer = jasmine.createSpyObj('mockContainer', [
			'find',
			'on'
		]);
		mockPanels = jasmine.createSpyObj('mockPanels', [
			'filter',
			'removeAttr',
			'css'
		]);
		mockFirstPanel = jasmine.createSpyObj('mockFirstPanel', [
			'css'
		]);
		mockPanels.filter.and.callFake(function(selector) {
			if (selector === ":gt(0)") {
				return mockFirstPanel;
			}
		});
		
		mockContainer.find.and.callFake(function(selector) {
			if (selector === ".panel") {
				return mockPanels;
			}
		});
		mockProxyHandleActivatorClick = function() {};
		spyOn($, 'proxy').and.callFake(function(fn) {
			if (fn === kitty.Accordion.prototype.onActivatorClicked) {
				return mockProxyHandleActivatorClick;
			}
		});
	});

	describe("Creating an accordion", function() {

		describe("Default settings (starts with first open)", function() {
			beforeEach(function() {			
				accordion = new kitty.Accordion(mockContainer);
			});
			it("Sets the startsCollapsed option to false", function() {
				expect(accordion.options.startCollapsed).toBe(false);
			});
			it("Stores the container on the instance", function() {
				expect(accordion.container).toBe(mockContainer);
			});
			it("Stores the panels on the instance", function() {
				expect(accordion.panels).toBe(mockPanels);
			});
			it("Finds the panels", function() {
				expect(mockContainer.find).toHaveBeenCalledWith('.panel');
			});
			it("Hides all panels but the first panel", function() {
				expect(mockPanels.filter).toHaveBeenCalledWith(":gt(0)");
				expect(mockFirstPanel.css).toHaveBeenCalledWith("display", "none");
			});
			it("Listens for a click event on the activators", function() {
				expect($.proxy).toHaveBeenCalledWith(accordion.onActivatorClicked, accordion);
				expect(mockContainer.on).toHaveBeenCalledWith("click", ".activator", mockProxyHandleActivatorClick);
			});
			it("Stores the currentlyOpenPanelIndex on the instance", function() {
				expect(accordion.currentlyOpenPanelIndex).toBe(0);
			});
		});

		describe("Starts collapsed", function() {
			beforeEach(function() {
				accordion = new kitty.Accordion(mockContainer, {
					startCollapsed: true
				});
			});
			it("Sets the startsCollapsed option to true", function() {
				expect(accordion.options.startCollapsed).toBe(true);
			});
			it("Hides all panels", function() {
				expect(mockPanels.css).toHaveBeenCalledWith("display", "none");
			});
			it("Stores the currentlyOpenPanelIndex on the instance", function() {
				expect(accordion.currentlyOpenPanelIndex).toBe(-1);
			});
		});

	});

	describe("Panel activated", function() {

		xdescribe("Panel is currently closed");
		xdescribe("Panel is currently open");

	});

});