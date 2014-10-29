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
			'css',
			'index'
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
			if (selector === ".panelContainer") {
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
		
		beforeEach(function() {			
			accordion = new kitty.Accordion(mockContainer);
		});
		
		it("Stores the container on the instance", function() {
			expect(accordion.container).toBe(mockContainer);
		});
		it("Stores the panels on the instance", function() {
			expect(accordion.panels).toBe(mockPanels);
		});
		it("Finds the panels", function() {
			expect(mockContainer.find).toHaveBeenCalledWith('.panelContainer');
		});
		

		it("Stores the activeSectionIndex on the instance", function() {
			expect(accordion.activeSectionIndex).toBe(0);
		});
	});

});