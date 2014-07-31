describe("Form Validator", function() {

	var validator;
	var mockForm;

	var invalidMethod = function() {
		return false;
	};
	var validMethod = function() {
		return true;
	};
	var rules = {
		passwordInvalid: {
			method: invalidMethod,
			message: "bad"
		},
		usernameInvalid: {
			method: invalidMethod,
			message: "bad"
		},
		usernameInvalid2: {
			method: invalidMethod,
			message: "very bad"
		},
		usernameInvalidWithParams: {
			method: invalidMethod,
			message: "bad",
			params: {
				whatever: 1
			}
		},
		usernameValid: {
			method: validMethod,
			message: "Yay"
		}
	};

	beforeEach(function () {
		mockForm = {
			elements: {
				username: {},
				password: {}
			}
		}
	});

	var invalidFormElementMessage = 'Must be a form element.';

	describe("Creating a new form validator", function() {
		beforeEach(function () {
			validator = new kitty.FormValidator(mockForm);
		});

		it("Stores the form as a property on the instance", function () {
			expect(validator.form).toBe(mockForm);
		});
		it("Stores an empty errors array on the instance", function () {
			expect(validator.errors).toBeDefined();
			expect(validator.errors.length).toBe(0);
		});
		it("Stores an empty validators array on the instance", function () {
			expect(validator.validators).toBeDefined();
			expect(validator.validators.length).toBe(0);

		});
	});

	describe("Adding a validator", function() {

		describe("With non-existant form field", function() {
			it("Throws an error", function() {
				validator = new kitty.FormValidator(mockForm);

				expect(function() {
					validator.addValidator();
				}).toThrow("Invalid form field.");
			});
		});

		describe("With invalid rules", function() {
			var errorMessage =  "Invalid rules. Must provide be an array of" +
								" rules (at least 1).";

			it("throws an error", function() {
				validator = new kitty
						.FormValidator(mockForm);

				expect(function() {
					validator.addValidator("username");
				}).toThrow(errorMessage);
				expect(function() {
					validator.addValidator("username", []);
				}).toThrow(errorMessage);
				expect(function() {
					validator
							.addValidator("username", [{
								method: function() {

								}
							}]);
				}).toThrow(errorMessage);
				expect(function() {
					validator.addValidator("username", [{
						message: "error"
					}]);
				}).toThrow(errorMessage);
				expect(function() {
					validator.addValidator("username", [{
						message: true,
						method: function() {
						}
					}]);
				}).toThrow(errorMessage);
			});
		});

		describe("With valid params", function() {
			it("adds the validator to the validators collection", function() {
				validator = new kitty.FormValidator(mockForm);

				var rule = {
					method: function() {
						return true;
					},
					message: "bad username"
				};

				validator.addValidator("username", [rule]);
				expect(validator.validators[0].fieldName).toBe("username");
				expect(validator.validators[0].rules[0]).toBe(rule);
			});
		});

	});

	describe("Validating the form", function() {
		it("Calls the validator method with correct arguments", function() {
			validator = new kitty
					.FormValidator(mockForm);

			validator.addValidator("username", [rules.usernameInvalid]);
			spyOn(rules.usernameInvalid, "method");
			validator.validate();
			var args = rules.usernameInvalid.method.calls.mostRecent().args;
			var firstArgument = args[0];
			var field = mockForm.elements["username"];
			expect(firstArgument).toBe(field);
			expect(rules.usernameInvalid.method).toHaveBeenCalled();
		});
		it("calls the validator with optional params", function() {
			validator = new kitty.FormValidator(mockForm);

			validator.addValidator("username", [rules.usernameInvalidWithParams]);

			spyOn(rules.usernameInvalidWithParams, "method");
			validator.validate();
			var args = rules.usernameInvalidWithParams.method.calls.mostRecent()
					.args;
			var secondArgument = args[1];
			expect(secondArgument).toBe(rules.usernameInvalidWithParams.params);
			expect(secondArgument.whatever).toBe(rules.usernameInvalidWithParams
					.params.whatever);
		});

		describe("Which contains errors", function() {
			it("Returns false", function() {
				validator = new kitty.FormValidator(mockForm);

				validator.addValidator("username", [rules.usernameInvalid]);
				expect(validator.validate()).toBe(false);
			});
		});

		describe("Which contains no errors", function() {
			it("Returns true", function() {
				validator = new kitty.FormValidator(mockForm);
				validator.addValidator("username", [rules.usernameValid]);
				expect(validator.validate()).toBe(true);
			});
		});

	});

	describe("Retrieving errors from a form", function() {

		describe("Which doesn't contain errors", function() {
			it("returns 0 errors", function() {
				validator = new kitty.FormValidator(mockForm);
				validator.addValidator("username", [rules.usernameValid]);
				validator.validate();
				expect(validator.getErrors().length).toBe(0);
			});
		});

		describe("Which contains errors", function() {
			it("returns the errors", function() {
				validator = new kitty.FormValidator(mockForm);

				validator.addValidator("username", [rules.usernameInvalid]);
				validator.addValidator("password", [rules.passwordInvalid]);
				validator.validate();
				var errors = validator.getErrors();
				expect(errors.length).toBe(2);
				expect(errors[0].fieldName).toBe("username");
				expect(errors[0].message).toBe(rules.usernameInvalid.message);
				expect(errors[1].fieldName).toBe("password");
				expect(errors[1].message).toBe(rules.passwordInvalid.message);
			});
		});

		describe("When a validator has more than one failed rule", function() {
			it("Only returns the first erroneous rule in the errors collection",
				function() {
					validator = new kitty
					.FormValidator(mockForm);

					validator.addValidator("username", [rules
						.usernameInvalid, rules.usernameInvalid2]);

					validator.validate();
					var errors = validator.getErrors();
					expect(errors.length).toBe(1);
			});
		});

		describe("When validating the form for a second time", function() {
			// so that errors don't keep on rising and/or contain duplicates
			it("Resets the errors before validating", function() {
				validator = new kitty.FormValidator(mockForm);

				validator.addValidator("username", [rules.usernameInvalid]);
				validator.validate();
				validator.validate(); // for a second time
				expect(validator.getErrors().length).toBe(1); // not 2
			});
		});

	});

	describe("Removing a validator", function() {
		it("Removes the validator", function() {
			validator = new kitty.FormValidator(mockForm);

			validator.addValidator("username", [{
				method: function() {
					return true;
				},
				message: "username blah"
			}]);
			validator.addValidator("password", [{
				method: function() {
					return true;
				},
				message: "password blah"
			}]);
			validator.removeValidator("username");
			expect(validator.validators.length).toBe(1);
			expect(validator.validators[0].fieldName).not.toBe("username");
		});
	});

	describe("Removing a rule from a validator", function() {
		it("Removes the rule", function() {
			validator = new kitty.FormValidator(mockForm);

			validator.addValidator("username", [{
					method: validMethod,
					message: "username blah"
				},
				{
					method: function() {},
					message: "username blah 2"
			}]);
			validator.removeRuleFromValidator("username", validMethod);
			expect(validator.validators[0].rules.length).toBe(1);
			expect(validator.validators[0].rules[0].method).not
					.toBe(validMethod);
		});
	});

});