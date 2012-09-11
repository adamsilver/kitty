describe("Image Label Fixer", function() {
	// This should only be included for browsers (IE6/7)
	// that do not correctly treat labels correctly when
	// they contain an image. When the image is clicked,
	// the event should trigger a click on the label element,
	// which in turn should place focus on the related input

	jasmine.getFixtures().fixturesPath = '.';

	var imageLabelFixer = null;
	var img = null;
	var currentlyFocused = null;
	beforeEach(function() {
		trackFocusedElement();
	});

	function trackFocusedElement() {
		$("body").on("focus", "input, select, textarea", function() {
			currentlyFocused = this;
		});
	}

	describe("Clicking an image inside a label", function() {
		describe("That relates to textarea", function() {
			var textarea = null;
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture3.html');
				img = $("label img");
				textarea = $("#textarea1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should receive focus", function() {
				img.trigger("click");
				expect(textarea[0]).toBe(currentlyFocused);
			});
		});
		describe("The relates to a text input", function() {
			var textInput = null;
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture4.html');
				img = $("label img");
				textInput = $("#textInput1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should receive focus", function() {
				img.trigger("click");
				expect(textInput[0]).toBe(currentlyFocused);
			});
		});
		describe("The relates to a password input", function() {
			var passwordInput = null;
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture5.html');
				img = $("label img");
				passwordInput = $("#passwordInput1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should receive focus", function() {
				img.trigger("click");
				expect(passwordInput[0]).toBe(currentlyFocused);
			});
		});
		describe("The relates to a select", function() {
			var selectInput = null;
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture6.html');
				img = $("label img");
				selectInput = $("#select1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should receive focus", function() {
				img.trigger("click");
				expect(selectInput[0]).toBe(currentlyFocused);
			});
		});
		
		describe("The relates to a radio input", function() {	
			var radio = null;		
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture1.html');
				img = $("label img");
				radio = $("#radio1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should check the radio", function() {
				img.trigger("click");
				expect(radio[0].checked).toBe(true);
			});
			describe("That is already checked", function() {
				it("Should uncheck the radio", function() {
					radio[0].checked = true;
					img.trigger("click");
					expect(radio[0].checked).toBe(false);
				});
			});
		});
		describe("The relates to a checkbox input", function() {
			var checkbox = null;
			beforeEach(function() {
				jasmine.getFixtures().load('Spec.kitty.ImageLabelFixer.Fixture2.html');
				img = $("label img");
				checkbox = $("#checkbox1");
				imageLabelFixer = new kitty.ImageLabelFixer(img);
			});
			it("Should check the checkbox", function() {
				img.trigger("click");
				expect(checkbox[0].checked).toBe(true);
			});
			describe("That is already checked", function() {
				it("Should uncheck the checkbox", function() {
					checkbox[0].checked = true;
					img.trigger("click");
					expect(checkbox[0].checked).toBe(false);
				});
			});
		});
	});
});