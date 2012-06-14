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

	describe("Showing a tooltip", function() {
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
		});
		describe("Via keyboard focus", function() {
			it("Displays the tooltip with an offset of 20 in both x and y position", function() {
				activator.focus();
				var activatorOffset = activator.offset();
				var tooltipOffset = tooltip.tooltip.offset();
				expect(tooltipOffset.left).toBe(activatorOffset.left + 20);
				expect(tooltipOffset.top).toBe(activatorOffset.top + 20);
			});
		});
		describe("Via mouseover", function() {
			it("Shows the tooltip", function() {
				var e = jQuery.Event("mouseover", { pageX: 64, pageY: 32 });
				activator.trigger(e);
				expect(tooltip.tooltip).not.toHaveClass("offScreen");
			});
			it("Positions itself relative to the mouse coordinates", function() {
				var e = jQuery.Event("mouseover", { pageX: 64, pageY: 32 });
				activator.trigger(e);
				var tooltipOffset = tooltip.tooltip.offset();
				expect(tooltipOffset.left).toBe(64 + 20);
				expect(tooltipOffset.top).toBe(32 + 20);
			});
		});
		describe("Via mousemove", function() {
			it("Shows the tooltip", function() {
				var e = jQuery.Event("mouseover", { pageX: 64, pageY: 32 });
				activator.trigger(e);
				expect(tooltip.tooltip).not.toHaveClass("offScreen");
			});
			it("Positions itself relative to the mouse coordinates", function() {
				var e = jQuery.Event("mousemove", { pageX: 64, pageY: 32 });
				activator.trigger(e);
				var tooltipOffset = tooltip.tooltip.offset();
				expect(tooltipOffset.left).toBe(64 + 20);
				expect(tooltipOffset.top).toBe(32 + 20);
			});
		});
	});
	describe("Hiding a tooltip", function() {
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
			it("Hides the tooltip", function() {
				activator.focus(); // to setup state so that it is showing
				activator.trigger("mouseleave");
				expect(tooltip.tooltip).toHaveClass("offScreen");
			});
			it("Removes the appended node from the body", function() {
				activator.focus(); // to setup state so that it is showing
				activator.trigger("mouseleave");
				expect($("body .tooltip")).not.toExist();
			});
		});
	});
	describe("Destroying tooltip", function() {
		beforeEach(function() {
			spyOn($.fn, "off");
			tooltip.destroy();			
		});
		it("Removes the events", function() {
			expect($.fn.off.calls[0].object).toBe(tooltip.activator);
			expect($.fn.off).toHaveBeenCalledWith("focus", tooltip.handleActivator_onFocus);

			expect($.fn.off.calls[1].object).toBe(tooltip.activator);
			expect($.fn.off).toHaveBeenCalledWith("blur", tooltip.handleActivator_onBlur);

			expect($.fn.off.calls[2].object).toBe(tooltip.activator);
			expect($.fn.off).toHaveBeenCalledWith("mouseover", tooltip.handleActivator_onMouseover);

			expect($.fn.off.calls[3].object).toBe(tooltip.activator);
			expect($.fn.off).toHaveBeenCalledWith("mousemove", tooltip.handleActivator_onMousemove);

			expect($.fn.off.calls[4].object).toBe(tooltip.activator);
			expect($.fn.off).toHaveBeenCalledWith("mouseleave", tooltip.handleActivator_onMouseleave);
		});
	});
});