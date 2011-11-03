describe("Contextual Submit", function() {
  
	jasmine.getFixtures().fixturesPath = '.';

	var contextualSubmit = null,
		field = null,
		submitButton = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.ContextualSubmit.Fixture1.html');
		field = $("#someField");
		submitButton = $("#submitButton");
		contextualSubmit = new Kitty.ContextualSubmit(field, submitButton);
	});

	describe("Focusing on field", function() {
		var clonedSubmitButton = null;
		beforeEach(function() {
			field[0].focus();
			clonedSubmitButton = $("#someForm").find(">input");
		});
		it("Prepends cloned submit button to the parent form", function() {
			expect(clonedSubmitButton.attr("type")).toBe(submitButton.attr("type"));
		});
		it("Removes id from cloned submit button", function() {
			expect(clonedSubmitButton.attr("id")).toBe("");
		});
		it("Hides the cloned submit button off screen", function() {
			expect(clonedSubmitButton.hasClass("offScreen")).toBe(true);
		});
	});

	describe("Blurring from field", function() {
		beforeEach(function() {
			field[0].focus(); // setup state
			field[0].blur(); // exercise
		});
		it("Removes cloned submit button", function() {
			var firstInput = $("#someForm").find(">input");
			expect(firstInput.attr("name")).not.toBe(submitButton.attr("name"));
		});
	});

	describe("Destroying the contextual submit", function() {
		it("Removes the events", function() {
			spyOn($.fn, "unbind");
			contextualSubmit.destroy();
			expect($.fn.unbind.mostRecentCall.object).toBe(field);
			expect($.fn.unbind).toHaveBeenCalledWith("focus", contextualSubmit.handleField_onFocus);
			expect($.fn.unbind).toHaveBeenCalledWith("blur", contextualSubmit.handleField_onBlur);
		});
	});

});