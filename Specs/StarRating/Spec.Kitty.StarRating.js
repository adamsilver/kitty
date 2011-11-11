describe("Star Rating", function() {
	describe("Creating a new Star Rating control", function() {
		it("Hides the radio inputs", function(){
			// make sure each radio has a class name of "offScreen"
		});
		it("Stores the current rating from the currently selected radio", function() {
			
		});
	});
	describe("Mouse over a rating label (of 3)", function() {
		it("Highlights the first 3 stars", function() {
			
		});
	});
	describe("Focusing on the rating input (of 3)", function() {
		it("Highlights the first 3 stars", function() {
			
		});
	});
	describe("Mouse leaving a rating label", function() {
		it("Unhighlights the first 3 stars", function() {
			
		});
	});
	describe("Blurring the rating input", function() {
		it("Unhighlights the first 3 stars", function() {
			
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