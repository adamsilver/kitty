describe("Form Validator", function() {
  
  jasmine.getFixtures().fixturesPath = '.';

  beforeEach(function() {
    jasmine.getFixtures().load('Spec.Kitty.FormValidator.Fixture1.html');
  });

  describe("Creating a new form validator", function() {
    describe("Without a form argument", function() {
      it("throws an error", function() {
        expect(function() {
          new Kitty.FormValidator();
        }).toThrow("Invalid container. Must be a jquery object with form element.");
      });
    });
    describe("With an invalid form argument", function() {
      it("throws an error", function() {
        expect(function() {
          new Kitty.FormValidator({});
        }).toThrow("Invalid container. Must be a jquery object with form element.");
      });
    });
    describe("With a valid jQuery object but not a form", function() {
      it("throws an error", function() {
        expect(function() {
          new Kitty.FormValidator($("body"));
        }).toThrow("Invalid container. Must be a jquery object with form element.");
      });
    });
  });
  
});