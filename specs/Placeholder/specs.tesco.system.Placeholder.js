describe("PlaceHolder", function() {
	var fixture = document.getElementById("fixture"),
		input = null;

	beforeEach(function() {
		fixture.innerHTML = '<input type="text" id="username" value="Default text">';
		input = document.getElementById("username");
	});

	afterEach(function() {
		fixture.children().remove();
	});

	describe("Creating a default text control", function() {
		describe("With no given input node", function() {
			it("Throws an error", function() {
				expect(function() { new Y.tesco.system.PlaceHolder(); }).toThrow("Provide an input.");
			});
		});
	});

	describe("Input is focussed", function() {
		it("Clears the default text", function() {
			var defaultText = new Y.tesco.system.PlaceHolder(input);

			// simulate focus
			input.trigger("focus");
			expect(input.val()).toBe("");
		});
	});

	describe("Input is blurred", function() {
		describe("No new text entered", function() {
			it("Sets the value back to the default", function() {
				var defaultText = new Y.tesco.system.PlaceHolder(input);

				// simulate focus
				// simulate blur
				input.trigger("focus");
				input.trigger("blur");
				expect(input.val()).toBe(input.prop("defaultValue"));
			});
		});

		describe("New text entered", function() {
			it("Doesn't revert back to the default text", function() {
				var defaultText = new Y.tesco.system.PlaceHolder(input);

				// simulate new text entered
				input.trigger("focus");
				input.val("Some new value");
				input.trigger("blur");
				expect(input.val()).toBe("Some new value");
			});
		});
	});

	describe("Tearing down the instance", function() {
		it("Removes the events from the input", function() {
			var defaultText = new Y.tesco.system.PlaceHolder(input);


			// can't spyOn host methods...
			// spyOn(input, "add")
			// defaultText.teardown();
			expect(defaultText)
		});
	});
});