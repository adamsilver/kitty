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
		mockLabels = jasmine.createSpyObj("mockLabels", ["filter"]);
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

	describe("Mouse entered a label", function() {
		var mockEvent;
		var el;
		beforeEach(function() {
			mockEvent = {
				currentTarget: {
					htmlFor: "blah"
				}
			};
			el = document.createElement("input");
			el.value = "mockValue";
			el.id = "blah";
			document.body.appendChild(el);
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			spyOn(starRatingControl, "highlightStars");
			starRatingControl.onLabelMouseEntered(mockEvent);
		});
		afterEach(function() {
			document.body.removeChild(el);
		});
		it("Highlights the stars based on the value of the related radio control", function() {
			expect(starRatingControl.highlightStars).toHaveBeenCalledWith("mockValue");
		});
	});

	describe("Mouse left a label", function() {
		beforeEach(function() {
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			spyOn(starRatingControl, "highlightStars");
			starRatingControl.onLabelMouseLeft();
		});
		it("Highlights the stars based on the currentRating", function() {
			expect(starRatingControl.highlightStars).toHaveBeenCalledWith(starRatingControl.currentRating);
		});
	});

	describe("Radio focussed", function() {
		var mockEvent;
		var mockRadio;
		beforeEach(function() {
			mockEvent = {
				target: {}
			};
			mockRadio = jasmine.createSpyObj("mockRadio", ["val"]);
			mockRadio.val.and.returnValue("mockValue");
			spyOn(window, "$").and.callFake(function(arg) {
				if(arg == mockEvent.target) {
					return mockRadio;
				}
			});
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			spyOn(starRatingControl, "highlightStars");
			starRatingControl.onRadioFocussed(mockEvent);
		});
		it("Highlights the stars based on the value of the focussed radio", function() {
			expect(starRatingControl.highlightStars).toHaveBeenCalledWith("mockValue");
		});
	});

	describe("Radio blurred", function() {
		beforeEach(function() {
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			spyOn(starRatingControl, "highlightStars");
			starRatingControl.onRadioBlurred();
		});
		it("Highlights the stars based on the currentRating", function() {
			expect(starRatingControl.highlightStars).toHaveBeenCalledWith(starRatingControl.currentRating);
		});
	});

	describe("Radio changed", function() {
		var mockEvent;
		var mockRadio;
		beforeEach(function() {
			mockEvent = {
				target: {}
			};
			mockRadio = jasmine.createSpyObj("mockRadio", ["val"]);
			mockRadio.val.and.returnValue("mockValue");
			spyOn(window, "$").and.callFake(function(arg) {
				if(arg === mockEvent.target) {
					return mockRadio;
				}
			});
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			spyOn(starRatingControl, "highlightStars");
			starRatingControl.onRadioChanged(mockEvent);
		});
		it("Sets the currentRating to the value of the radio", function() {
			expect(starRatingControl.currentRating).toBe("mockValue");
		});
		it("Highlights the stars using the currentRating", function() {
			expect(starRatingControl.highlightStars).toHaveBeenCalledWith(starRatingControl.currentRating);
		});
	});

	describe("Highlighting stars", function() {


		function createLabel() {
			return jasmine.createSpyObj("mockLabelToHighlight", ["addClass", "removeClass"]);
		}

		var mockLabel1;
		var mockLabel2;
		var mockLabel3;
		var mockLabel4;
		var mockLabel5;

		beforeEach(function() {
			mockLabels.filter.and.callFake(function(arg) {
				var label;
				switch(arg) {
					case ':eq(0)':
						label = mockLabel1 = createLabel();
						break;
					case ':eq(1)':
						label = mockLabel2 = createLabel();
						break;
					case ':eq(2)':
						label = mockLabel3 = createLabel();
						break;
					case ':eq(3)':
						label = mockLabel4 = createLabel();
						break;
					case ':eq(4)':
						label = mockLabel5 = createLabel();
						break;
				}
				return label;
			});
			mockLabels.length = 5;
			starRatingControl = new kitty.StarRatingControl(mockContainer);
			starRatingControl.highlightStars("3");
		});
		it("Adds a class of highlight to all labels that are equal to or below the value", function() {
			expect(mockLabel1.addClass).toHaveBeenCalledWith("highlight");
			expect(mockLabel2.addClass).toHaveBeenCalledWith("highlight");
			expect(mockLabel3.addClass).toHaveBeenCalledWith("highlight");
		});
		it("Removes a class of highlight to all the labels that are above the rating value", function() {
			expect(mockLabel4.removeClass).toHaveBeenCalledWith("highlight");
			expect(mockLabel5.removeClass).toHaveBeenCalledWith("highlight");
		});
	});

});