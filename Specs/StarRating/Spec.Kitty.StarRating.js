describe("Star Rating", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var starRating = null;
	var radioContainers = null;
	var radios = null;
	var labels = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.StarRating.Fixture1.html');
		radioContainers = $(".radio");
		radios = $(".radio input");
		labels = $(".radio label");
		starRating = new Kitty.StarRating(radioContainers);
	});

	describe("Creating a new Star Rating control", function() {
		it("Hides the radio inputs", function(){
			for(var i = 0; i < radios.length; i++) {
				expect(radios.filter(":eq("+i+")")).toHaveClass("offScreen");
			}
		});
		it("Stores the current rating from the currently selected radio", function() {
			expect(starRating.currentRating).toBe(radios.filter(":checked").val());
		});
	});
	describe("Mouse over a rating label (of 3)", function() {
		it("Highlights the first 3 stars", function() {
			labels.filter(":eq(2)").trigger("mouseover");
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass("highlight");
			}
		});

		describe("And then mouseover a rating label (of 2)", function() {
			it("Unhighlights the stars after the first 2 stars", function() {
				labels.filter(":eq(2)").trigger("mouseover");
				labels.filter(":eq(1)").trigger("mouseover");
				expect(labels.filter(":eq(2)")).not.toHaveClass("highlight");
			});
		});
	});

	describe("Mouse over in element of rating label (of 3)", function() {
		it("Highlights the first 3 stars", function() {
			labels.filter(":eq(2)").find("span").trigger("mouseover");
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass("highlight");
			}
		});
	});

	describe("Focus on a rating label (of 3)", function() {
		it("Highlights the first 3 stars", function() {
			radios.filter(":eq(2)").trigger("focus");
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass("highlight");
			}
		});

		describe("And then mouseover a rating label (of 2)", function() {
			it("Unhighlights the stars after the first 2 stars", function() {
				radios.filter(":eq(2)").trigger("focus");
				radios.filter(":eq(1)").trigger("focus");
				expect(labels.filter(":eq(2)")).not.toHaveClass("highlight");
			});
		});
	});
	describe("Mouse leaving a rating label", function() {

		describe("No selected rating", function() {
			it("Unhighlights the stars", function() {
				labels.filter(":eq(2)").trigger("mouseover"); // setup state
				labels.filter(":eq(2)").trigger("mouseout");
				for(var i = 0; i < 3; i++) {
					expect(labels.filter(":eq("+i+")")).not.toHaveClass("highlight");
				}
			});
		});

		describe("A selected rating of 3", function() {
			it("Highlights the 3 stars", function() {
				for(var j = 0; j < radios.length; j++) {
					
				}
				labels.filter(":eq(2)").trigger("mouseover"); // setup state
				labels.filter(":eq(2)").trigger("mouseout");
				for(var i = 0; i < 3; i++) {
					expect(labels.filter(":eq("+i+")")).toHaveClass("highlight");
				}
			});
		});
		
	});
	describe("Blurring the rating input", function() {
		it("Unhighlights the first 3 stars", function() {
			radios.filter(":eq(2)").trigger("focus"); // setup state
			radios.filter(":eq(2)").trigger("blur");
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).not.toHaveClass("highlight");
			}
		});
	});
	describe("Selecting a rating (rating 3)", function() {
		it("Persists the chosen rating by highlighting the stars", function() {
			radios.filter(":eq(2)").click();
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass("highlight");
			}
		});
		it("Marks the radio as selected", function() {
			
		});
	});
	describe("Destroying the Star Rating control", function() {
		it("Restores the HTML to original state");
		it("Removes event handlers for radios");
		it("Removes event handlers for labels");
	});
});