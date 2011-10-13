describe("Form Validator", function() {
  
  jasmine.getFixtures().fixturesPath = '.';

  var fixture1 = null;
  var invalidMethod = function() {
    return false;
  }
  var validMethod = function() {
    return true;
  }
  var rules = {
    usernameInvalid: {method: invalidMethod, message: "bad"},
    usernameInvalidWithParams: {
      method: invalidMethod,
      message: "bad",
      params: {whatever: 1}
    },
    usernameValid: {method: validMethod, message: "Yay"}
  }

  beforeEach(function() {
    jasmine.getFixtures().load('Spec.Kitty.FormValidator.Fixture1.html');
    fixture1 = $("#fixture1");
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
    describe("With invalid rules", function() {
      var errorMessage = "Invalid rules. Must provide be an array of rules (at least 1).";
      it("throws an error", function() {
        var formValidator = new Kitty.FormValidator($("form"));        
        expect(function() {
          formValidator.addValidator("username");
        }).toThrow(errorMessage);
        expect(function() {
          formValidator.addValidator("username", []);
        }).toThrow(errorMessage);
        expect(function() {
          formValidator.addValidator("username", [{method: function() {}}]);
        }).toThrow(errorMessage);
        expect(function() {
          formValidator.addValidator("username", [{message: "error"}]);
        }).toThrow(errorMessage);
        expect(function() {
          formValidator.addValidator("username", [{message: true, method: function() {}}]);
        }).toThrow(errorMessage);
      });
    });
    describe("With valid params", function() {
      it("adds the validator to the validators collection", function() {
        var formValidator = new Kitty.FormValidator($("form"));
        var rule = {
            method: function() { return true },
            message: "bad username"
        }
        formValidator.addValidator("username", [rule]);
        expect(formValidator.validators[0].fieldName).toBe("username");
        expect(formValidator.validators[0].rules[0]).toBe(rule);
      });
    });
    describe("With rule params to pass to the method", function() {
        
    });
  });

  describe("Validating the form", function() {
    describe("Invalid", function() {
      it("Returns false", function() {
        var formValidator = new Kitty.FormValidator($("form"));
        formValidator.addValidator("username", [rules.usernameInvalid]);
        expect(formValidator.validate()).toBe(false);
      });
      it("calls the validator method with correct arguments", function() {
        var formValidator = new Kitty.FormValidator($("form"));
        formValidator.addValidator("username", [rules.usernameInvalid]);
        spyOn(rules.usernameInvalid, "method");
        formValidator.validate();
        var args = rules.usernameInvalid.method.mostRecentCall.args;
        var field = $("form [name=username]");
        expect(args[0][0]).toBe(field[0]);
        expect(rules.usernameInvalid.method).toHaveBeenCalled();
      });
      it("calls the validator with optional params", function() {
        var formValidator = new Kitty.FormValidator($("form"));
        formValidator.addValidator("username", [rules.usernameInvalidWithParams]);
        spyOn(rules.usernameInvalidWithParams, "method");
        formValidator.validate();
        var args = rules.usernameInvalidWithParams.method.mostRecentCall.args;
        expect(args[1]).toBe(rules.usernameInvalidWithParams.params);
      });
    });
  });

  describe("Retrieving errors from a form", function() {
    describe("Valid form", function() {
      var formValidator = new Kitty.FormValidator($("form"));
      formValidator.addValidator("username", [rules.usernameVvalid]);
      it("returns 0 errors", function() {
        
      });
    });
    describe("Invalid form", function() {
      
    });
  });
  
});