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
		it("Unhighlights the first 3 stars", function() {
			labels.filter(":eq(2)").trigger("mouseover"); // setup state
			labels.filter(":eq(2)").trigger("mouseout");
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).not.toHaveClass("highlight");
			}
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
	describe("Selecting a rating", function() {
		it("Persists the chosen rating by highlighting the stars", function() {
			
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