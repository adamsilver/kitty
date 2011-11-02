describe("Contextual Submit", function() {
  
	jasmine.getFixtures().fixturesPath = '.';

	var contextualSubmit = null,
		field = null,
		submitButton = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.ContextualSubmit.Fixture1.html');
		field = $("#formFixture").find("input[type=text]");
		submitButton = $("#formFixture").find("input[type=submit]");
	});

	describe("focusing on field", function() {

		it("prepends clone to the parent form", function() {
			contextualSubmit = new Kitty.ContextualSubmit(field, submitButton);
			field[0].focus();
			expect($("#formFixture").find(">input").attr("type")).toBe(submitButton.attr("type"));
		});

	});

	describe("blurring from field", function() {

		it("removes clone", function() {

		});

	});

});