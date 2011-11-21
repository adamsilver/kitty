describe("Tooltip", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var activator = null;
	var tooltip = null;
	var tooltipContent = '<div class="tooltipContent">Content</div>';

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.Tooltip.Fixture1.html');
		activator = $("#activator");
		tooltip = new Kitty.Tooltip(activator, tooltipContent);
	});

	afterEach(function() {
		$("body .tooltip").remove();
	});


	describe("Activing a tooltip", function() {
		it("Appends a tooltip to the body", function() {
			activator.focus();
			var appendedTooltip = $("body .tooltip");
			expect(appendedTooltip).toExist();
			expect(tooltip.tooltip[0]).toBe(appendedTooltip[0]);
			expect(tooltip.tooltip).not.toHaveClass("offScreen");
			expect(tooltip.tooltip.css("position")).toBe("absolute");
		});
		it("Displays the specified content", function() {
			activator.focus();
			expect(tooltip.tooltip.html()).toBe(tooltipContent);
		})
		describe("Via keyboard focus", function() {
			it("Displays the tooltip with an offset of 20 in both x and y position", function() {
				activator.focus();
				var activatorOffset = activator.offset();
				var tooltipOffset = tooltip.tooltip.offset();
				expect(tooltipOffset.left).toBe(activatorOffset.left + 20);
				expect(tooltipOffset.top).toBe(activatorOffset.top + 20);
			});
		});
		describe("Via mouseenter", function() {
			
		});
	});
	describe("Deactivating a tooltip", function() {
		describe("Via keyboard blur", function() {
			it("Hides the tooltip", function() {
				activator.focus(); // setup state
				activator.blur(); // act
				expect(tooltip.tooltip).toHaveClass("offScreen");
			});
			it("Removes the appended node from the body", function() {
				activator.focus(); // setup state
				activator.blur(); // act
				expect($("body .tooltip")).not.toExist();
			});
		});
		describe("Via mouseleave", function() {
			
		});
	});
	describe("Destroying tooltip", function() {
		
	});
});