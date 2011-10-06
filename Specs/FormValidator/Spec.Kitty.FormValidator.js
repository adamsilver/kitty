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
    describe("With a valid jQuery object containing a form", function() {
      it("doesn't throw an error", function() {
         expect(function() {
          new Kitty.FormValidator($("form"));
        }).not.toThrow();
      });
    });
  });

  describe("Adding a validator", function() {
    describe("With non-existant form field", function() {
      it("throws an error", function() {
        var formValidator = new Kitty.FormValidator($("form"));        
        expect(function() {
          formValidator.addValidator();
        }).toThrow("Invalid form field.");
      });
    });
    describe("With no rules", function() {
      it("throws an error", function() {
        var formValidator = new Kitty.FormValidator($("form"));        
        expect(function() {
          formValidator.addValidator("username");
        }).toThrow("Invalid rules. Must provide be an array of rules (at least 1).");
        expect(function() {
          formValidator.addValidator("username", []);
        }).toThrow("Invalid rules. Must provide be an array of rules (at least 1).");
      });
    });
    describe("With valid params", function() {
      it("doesn't throw an error", function() {
        var formValidator = new Kitty.FormValidator($("form"));        
        expect(function() {
          //formValidator.addValidator("username");
        }).not.toThrow();  
      });
    });
  });
  
});