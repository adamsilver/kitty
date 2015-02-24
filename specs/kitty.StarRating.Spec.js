describe("Star Rating", function() {

	var starRatingControl;
	var mockContainer;
	var mockRadioControls;
	var mockCheckedRadio;
	var mockLabels;

	beforeEach(function() {
		mockContainer = jasmine.createSpyObj("mockContainer", ["find", "addClass", "on"]);
		mockRadioControls = jasmine.createSpyObj("mockRadioControls", ["filter"]);
		mockCheckedRadio = jasmine.createSpyObj("mockCheckedRadio", ["val"]);
		mockRadioControls.filter.and.callFake(function(arg) {
			if(arg === ":checked") {
				return mockCheckedRadio;
			}
		});
		mockLabels = jasmine.createSpyObj("mockLabels", ["blah"]);
		mockContainer.find.and.callFake(function(selector) {
			if(selector === ".radioControl") {
				return mockRadioControls;
			}
			if(selector === "label") {
				return mockLabels;
			}
		});
	});

	describe("Creating a Star Rating control", function() {
		describe("Always", function() {
			beforeEach(function() {
				starRatingControl = new kitty.StarRatingControl(mockContainer);
			});
			it("Stores the container", function() {
				expect(starRatingControl.container).toBe(mockContainer);
			});
			it("Retrieves the radio controls", function() {
				expect(mockContainer.find).toHaveBeenCalledWith(".radioControl");
				expect(starRatingControl.radioControls).toBe(mockRadioControls);
			});
			it("Adds a class of enhanced to the container", function() {
				expect(mockContainer.addClass).toHaveBeenCalledWith("enhanced");
			});
			it("Retrieves the labels", function() {
				expect(mockContainer.find).toHaveBeenCalledWith("label");
				expect(starRatingControl.labels).toBe(mockLabels);
			});
		});
		describe("One of the radios is already marked as checked", function() {
			beforeEach(function() {
				
			});
			it("Sets the currentRating as the value from the checked radio", function() {
							
			});
			it("Highlights the stars for the checked radio", function() {
				
			});
		});
		describe("None of the radios are checked yet", function() {
			it("Sets the currentRating to null", function() {
				
			});
			it("Doesn't highlight the stars", function() {
				
			});
		});
	});

});