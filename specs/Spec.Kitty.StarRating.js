describe("Star Rating", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var starRating = null;
	var radioContainers = null;
	var radios = null;
	var labels = null;
	var cssHighlightedClass = "highlight";

	// has checked radio
	function setupFixture1() {
		jasmine.getFixtures().load('Spec.kitty.StarRating.Fixture1.html');
		commonSetup();
	}

	// doesn't have checked radio
	function setupFixture2() {
		jasmine.getFixtures().load('Spec.kitty.StarRating.Fixture2.html');
		commonSetup();
	}

	function commonSetup() {
		radioContainers = $(".radio");
		radios = $(".radio input");
		labels = $(".radio label");
		starRating = new kitty.StarRating(radioContainers);
	}

	describe("Creating a new Star Rating control", function() {

		beforeEach(setupFixture1);

		it("Hides the radio inputs", function(){
			for(var i = 0; i < radios.length; i++) {
				expect(radios.filter(":eq("+i+")")).toHaveClass("offScreen");
			}
		});

		describe("That has a checked radio", function() {
			it("Stores the current rating from the currently selected radio", function() {
				expect(starRating.currentRating).toBe(radios.filter(":checked").val());
			});
			it("Highlights the labels up until that rating", function() {
				expect(labels.filter(":eq(0)")).toHaveClass(cssHighlightedClass)
				expect(labels.filter(":eq(1)")).toHaveClass(cssHighlightedClass)
			});
		});

		describe("That doesn't have a checked radio", function() {
			beforeEach(setupFixture2);
			it("Stores the current rating from the currently selected radio", function() {
				expect(starRating.currentRating).toBe(null);
			});
		});
	});




	describe("Mouse over a rating label (of 3)", function() {

		beforeEach(setupFixture1);

		it("Highlights the first 3 stars", function() {
			labels.filter(":eq(2)").trigger("mouseover");
			for(var i = 0; i < 2; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass(cssHighlightedClass);
			}
		});

		describe("And then mouseover a rating label (of 2)", function() {
			it("Unhighlights the stars after the first 2 stars", function() {
				labels.filter(":eq(2)").trigger("mouseover");
				labels.filter(":eq(1)").trigger("mouseover");
				expect(labels.filter(":eq(2)")).not.toHaveClass(cssHighlightedClass);
			});
		});
	});

	describe("Mouse over an element inside of rating label (of 3)", function() {
		beforeEach(setupFixture1);
		it("Highlights the first 3 stars", function() {
			labels.filter(":eq(2)").find("span").trigger("mouseover");
			for(var i = 0; i < 2; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass(cssHighlightedClass);
			}
		});
	});

	describe("Focus on a rating label (of 3)", function() {
		beforeEach(setupFixture1);
		it("Highlights the first 3 stars", function() {
			radios.filter(":eq(2)").trigger("focus");
			for(var i = 0; i < 2; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass(cssHighlightedClass);
			}
		});

		describe("And then mouseover a rating label (of 2)", function() {
			it("Unhighlights the stars after the first 2 stars", function() {
				radios.filter(":eq(2)").trigger("focus");
				radios.filter(":eq(1)").trigger("focus");
				expect(labels.filter(":eq(2)")).not.toHaveClass(cssHighlightedClass);
			});
		});
	});
	describe("Mouse leaving a rating label", function() {
		beforeEach(setupFixture2);
		describe("No selected rating", function() {
			it("Unhighlights the stars", function() {
				labels.filter(":eq(2)").trigger("mouseover"); // setup state
				labels.filter(":eq(2)").trigger("mouseout");
				for(var i = 0; i < 3; i++) {
					expect(labels.filter(":eq("+i+")")).not.toHaveClass(cssHighlightedClass);
				}
			});
		});

		describe("And it has a selected rating of 2", function() {
			beforeEach(setupFixture1);
			it("Highlights the 2 stars", function() {
				labels.filter(":eq(2)").trigger("mouseover");
				labels.filter(":eq(2)").trigger("mouseout");
				
				expect(labels.filter(":eq(0)")).toHaveClass(cssHighlightedClass);
				expect(labels.filter(":eq(1)")).toHaveClass(cssHighlightedClass);
				expect(labels.filter(":eq(2)")).not.toHaveClass(cssHighlightedClass);

			});
		});
		
	});
	describe("Blurring the rating input", function() {
		beforeEach(setupFixture1);
		it("Unhighlights the first 3 stars", function() {
			radios.filter(":eq(2)").trigger("focus"); // setup state
			radios.filter(":eq(2)").trigger("blur");
			for(var i = 0; i < 2; i++) {
				expect(labels.filter(":eq("+i+")")).not.toHaveClass(cssHighlightedClass);
			}
		});
	});
	describe("Selecting a rating (rating 3)", function() {
		beforeEach(setupFixture2);
		it("Persists the chosen rating by highlighting the stars", function() {					
			radios.filter(":eq(2)").click();
			labels.filter(":eq(2)").mouseout();
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass(cssHighlightedClass);
			}
		});
		it("Marks the radio as selected", function() {
			labels.filter(":eq(2)").click();
			for(var i = 0; i < 3; i++) {
				expect(labels.filter(":eq("+i+")")).toHaveClass(cssHighlightedClass);
			}
		});
	});
	describe("Destroying the Star Rating control", function() {
		beforeEach(function() {
			setupFixture1();
			spyOn($.fn, "off");
			starRating.destroy();
		})
		it("Reveals the radio inputs", function(){
			for(var i = 0; i < radios.length; i++) {
				expect(radios.filter(":eq("+i+")")).not.toHaveClass("offScreen");
			}
		});
		it("Removes event handlers for labels", function() {
			expect($.fn.off.calls[0].object).toBe(starRating.labels);
			expect($.fn.off).toHaveBeenCalledWith("mouseover", starRating.handleLabel_onMouseover);
			
			expect($.fn.off.calls[1].object).toBe(starRating.labels);
			expect($.fn.off).toHaveBeenCalledWith("mouseout", starRating.handleLabel_onMouseout);
		});
		it("Removes event handlers for radios", function() {
			expect($.fn.off.calls[2].object).toBe(starRating.radios);
			expect($.fn.off).toHaveBeenCalledWith("focus", starRating.handleRadio_onFocus);

			expect($.fn.off.calls[2].object).toBe(starRating.radios);
			expect($.fn.off).toHaveBeenCalledWith("blur", starRating.handleRadio_onBlur);
			
			expect($.fn.off.calls[2].object).toBe(starRating.radios);
			expect($.fn.off).toHaveBeenCalledWith("change", starRating.handleRadio_onChange);
		});
	});
});