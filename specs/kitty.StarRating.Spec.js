describe("Star Rating", function() {

	var starRatingControl;
	var mockContainer;
	var mockRadioControls;
	var mockCheckedRadio;
	var mockLabels;
	var mockCheckedRadioValue;
	var mockProxy;

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
		mockProxy = {};
		spyOn($, "proxy").and.returnValue(mockProxy);
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
			it("Delegates the mouse enter event on the labels", function() {
				expect($.proxy).toHaveBeenCalledWith(starRatingControl, "onLabelMouseEntered");
				expect(mockContainer.on).toHaveBeenCalledWith("mouseenter", "label", mockProxy);
			});
			it("Delegates the mouse leave event on the labels", function() {
				expect($.proxy).toHaveBeenCalledWith(starRatingControl, "onLabelMouseLeft");
				expect(mockContainer.on).toHaveBeenCalledWith("mouseleave", "label", mockProxy);
			});
			it("Delegates the focus event on the radio controls", function() {
				expect($.proxy).toHaveBeenCalledWith(starRatingControl, "onRadioFocussed");
				expect(mockContainer.on).toHaveBeenCalledWith("focus", ".radioControl", mockProxy);
			});
			it("Delegates the blur event on the radio controls", function() {
				expect($.proxy).toHaveBeenCalledWith(starRatingControl, "onRadioBlurred");
				expect(mockContainer.on).toHaveBeenCalledWith("blur", ".radioControl", mockProxy);
			});
			it("Delegates the change event on the radio controls", function() {
				expect($.proxy).toHaveBeenCalledWith(starRatingControl, "onRadioChanged");
				expect(mockContainer.on).toHaveBeenCalledWith("change", ".radioControl", mockProxy);
			});
		});
		describe("One of the radios is already marked as checked", function() {
			beforeEach(function() {
				mockCheckedRadioValue = "1";
				mockCheckedRadio.val.and.returnValue(mockCheckedRadioValue);
				spyOn(kitty.StarRatingControl.prototype, "highlightStars");
				starRatingControl = new kitty.StarRatingControl(mockContainer);
			});
			it("Sets the currentRating as the value from the checked radio", function() {
				expect(starRatingControl.currentRating).toBe(mockCheckedRadioValue);
			});
			it("Highlights the stars for the checked radio", function() {
				expect(starRatingControl.highlightStars).toHaveBeenCalledWith(mockCheckedRadioValue);
			});
		});
		describe("None of the radios are checked yet", function() {
			beforeEach(function() {
				mockCheckedRadio.val.and.returnValue(undefined);
				spyOn(kitty.StarRatingControl.prototype, "highlightStars");
				starRatingControl = new kitty.StarRatingControl(mockContainer);
			});
			it("Sets the currentRating to null", function() {
				expect(starRatingControl.currentRating).toBe(null);
			});
			it("Doesn't highlight the stars", function() {
				expect(starRatingControl.highlightStars).not.toHaveBeenCalled();
			});
		});
	});

});