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
    passwordInvalid: {method: invalidMethod, message: "bad"},
    usernameInvalid: {method: invalidMethod, message: "bad"},
    usernameInvalid2: {method: invalidMethod, message: "very bad"},
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

  var invalidFormElementMessage = 'Must be a form element.';

  describe("Creating a new form validator", function() {
    describe("Without a form argument", function() {
      it("throws an error", function() {
        expect(function() {
          new Kitty.FormValidator();
        }).toThrow(invalidFormElementMessage);
      });
    });
    describe("With an invalid form argument", function() {
      it("throws an error", function() {
        expect(function() {
          new Kitty.FormValidator(document.createElement("div"));
        }).toThrow(invalidFormElementMessage);
      });
    });
  });

  describe("Adding a validator", function() {
    describe("With non-existant form field", function() {
      it("throws an error", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);        
        expect(function() {
          formValidator.addValidator();
        }).toThrow("Invalid form field.");
      });
    });
    describe("With invalid rules", function() {
      var errorMessage = "Invalid rules. Must provide be an array of rules (at least 1).";
      it("throws an error", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);        
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
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        var rule = {
            method: function() { return true },
            message: "bad username"
        }
        formValidator.addValidator("username", [rule]);
        expect(formValidator.validators[0].fieldName).toBe("username");
        expect(formValidator.validators[0].rules[0]).toBe(rule);
      });
    });
  });

  describe("Validating the form", function() {

    it("calls the validator method with correct arguments", function() {
      var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
      formValidator.addValidator("username", [rules.usernameInvalid]);
      spyOn(rules.usernameInvalid, "method");
      formValidator.validate();
      var args = rules.usernameInvalid.method.mostRecentCall.args;
      var firstArgument = args[0];
      var field = document.forms["fixture1"].elements["username"];
      expect(firstArgument).toBe(field);
      expect(rules.usernameInvalid.method).toHaveBeenCalled();
    });
    it("calls the validator with optional params", function() {
      var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
      formValidator.addValidator("username", [rules.usernameInvalidWithParams]);
      spyOn(rules.usernameInvalidWithParams, "method");
      formValidator.validate();
      var args = rules.usernameInvalidWithParams.method.mostRecentCall.args;
      var secondArgument = args[1];
      expect(secondArgument).toBe(rules.usernameInvalidWithParams.params);
      expect(secondArgument.whatever).toBe(rules.usernameInvalidWithParams.params.whatever);
    });

    describe("Which contains errors", function() {
      it("Returns false", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameInvalid]);
        expect(formValidator.validate()).toBe(false);
      });      
    });

    describe("Which contains no errors", function() {
      it("Returns true", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameValid]);
        expect(formValidator.validate()).toBe(true);
      });
    });

  });

  describe("Retrieving errors from a form", function() {
    describe("Which doesn't contain errors", function() {      
      it("returns 0 errors", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameValid]);
        formValidator.validate();
        expect(formValidator.getErrors().length).toBe(0);  
      });
    });
    describe("Which contains errors", function() {
      it("returns the errors", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameInvalid]);
        formValidator.addValidator("password", [rules.passwordInvalid]);
        formValidator.validate();
        var errors = formValidator.getErrors();
        expect(errors.length).toBe(2);  
        expect(errors[0].fieldName).toBe("username");
        expect(errors[0].message).toBe(rules.usernameInvalid.message);
        expect(errors[1].fieldName).toBe("password");
        expect(errors[1].message).toBe(rules.passwordInvalid.message);
      });
    });
    describe("When a validator has more than one failed rule", function() {
      it("Only returns the first erroneous rule in the errors collection", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameInvalid, rules.usernameInvalid2]);
        formValidator.validate();
        var errors = formValidator.getErrors();
        expect(errors.length).toBe(1);
      });
    });
    describe("When validating the form for a second time", function() {
      // so that errors don't keep on rising and/or contain duplicates
      it("Resets the errors before validating", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [rules.usernameInvalid]);
        formValidator.validate();
        formValidator.validate(); // for a second time
        expect(formValidator.getErrors().length).toBe(1); // not 2
      });
    });
  });
  
  describe("Removing a validator", function() {
      it("Removes the validator", function() {
        var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
        formValidator.addValidator("username", [{
          method: function() { return true}, message: "username blah"
        }]);
        formValidator.addValidator("password", [{
          method: function() { return true}, message: "password blah"
        }]);
        formValidator.removeValidator("username");
        expect(formValidator.validators.length).toBe(1);
        expect(formValidator.validators[0].fieldName).not.toBe("username");
      });
  });

  describe("Removing a rule from a validator", function() {
    it("Removes the rule", function() {
      var formValidator = new Kitty.FormValidator(document.forms["fixture1"]);
      formValidator.addValidator("username", [
        { method: validMethod, message: "username blah" },
        { method: function() {}, message: "username blah 2"}
      ]);
      formValidator.removeRuleFromValidator("username", validMethod);
      expect(formValidator.validators[0].rules.length).toBe(1);
      expect(formValidator.validators[0].rules[0].method).not.toBe(validMethod);
    });
  });

});