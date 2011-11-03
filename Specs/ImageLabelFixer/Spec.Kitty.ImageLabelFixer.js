describe("Image Label Fixer", function() {
	// This should only be included for browsers (IE6/7)
	// that do not correctly treat labels correctly when
	// they contain an image. When the image is clicked,
	// the event should trigger a click on the label element,
	// which in turn should place focus on the related input

	//

	

	describe("Clicking an image inside a label", function() {
		describe("That relates to textarea", function() {
			it("Should receive focus", function() {
				
			});
		});
		describe("The relates to a text input", function() {
			it("Should receive focus", function() {
				
			});
		});
		describe("The relates to a password input", function() {
			it("Should receive focus", function() {
				
			});
		});
		describe("The relates to a select box", function() {
			it("Should receive focus", function() {
				
			});
		});
		
		describe("The relates to a radio input", function() {
			var imageLabelFixer = null;
			var img = null;
			var radio = null;
			jasmine.getFixtures().fixturesPath = '.';
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.Kitty.ImageLabelFixer.Fixture1.html');
				img = $("label img");
				radio = $("#radio1");
				imageLabelFixer = new Kitty.ImageLabelFixer(img);
				
			});
			it("Should check the radio", function() {
				img.trigger("click");
				expect(radio.prop("checked")).toBe(true);
			});
			describe("That is already checked", function() {
				it("Should uncheck the radio", function() {
					radio.prop("checked", true);
					img.trigger("click");
					expect(radio.prop("checked")).toBe(false);
				});
			});
		});
		describe("The relates to a checkbox input", function() {
			it("Should check the checkbox", function() {
				
			});
			describe("That is already checked", function() {
				it("Should uncheck the checkbox", function() {
					
				});
			});
		});
	});
});