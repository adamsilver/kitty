/**
 * @namespace
 */

/**
 * Validates form fields within a form.
 * @constructor
 * @class
 * @param {Element} form The form node
 */
kitty.FormValidator = function(form) {
	this.form = form;
	this.errors = [];
	this.validators = [];
};

/**
 * Adds a field to be validated against given rules
 * @param {String} fieldName The name of the field to validate
 * @param {Array[Object]} rules The rules for the validator to check against
 * @example
 * var formValidator = new kitty.FormValidator(formNode);
 * formValidator.addValidator("username", [{
 *    method: function() {
 *        // some test here and return true or false
 *        return true;
 *    },
 *    message: "This value for username is unacceptable"
 * }])
 */
kitty.FormValidator.prototype.addValidator = function(fieldName, rules) {
	var exceptionMessageRules = "Invalid rules. Must provide be an array of rules (at least 1).",
		field = this.form.elements[fieldName],
		rule,
		i;
	// if field does not exist
	if (!field) {
		throw "Invalid form field.";
	}
	if (!rules) {
		throw exceptionMessageRules;
	}
	if (!rules.length) {
		throw exceptionMessageRules;
	}
	if (rules.length) {
		for (i = 0; i < rules.length; i++) {
			rule = rules[i];
			if (typeof rule.method !== "function" ||
				typeof rule.message !== "string") {
				throw exceptionMessageRules;
			}
		}
	}
	this.validators.push({
		fieldName: fieldName,
		rules: rules,
		field: field
	});
};

/**
 * Iterates through the list of fields to validate
 * @return {Boolean} Returns false if there are errors, otherwise true
 * @example
 * var formValidator = new kitty.FormValidator(formNode);
 * formValidator.validate();
 */
kitty.FormValidator.prototype.validate = function() {
	this.errors = [];
	var validator = null,
		validatorValid = true,
		i,
		j;
	for (i = 0; i < this.validators.length; i++) {
		validator = this.validators[i];
		for (j = 0; j < validator.rules.length; j++) {
			validatorValid = validator.rules[j].method(validator.field,
				validator.rules[j].params);
			if (!validatorValid) {
				this.errors.push({
					fieldName: validator.fieldName,
					message: validator.rules[j].message
				});
				break;
			}
		}
	}
	return this.errors.length === 0;
};

/**
 * Retrieve a list of errors. Typically called after determining that validate
 * returned false
 * @return {Array[Object]} List of errors in format { fieldName: "",
 * message: "" }
 */
kitty.FormValidator.prototype.getErrors = function() {
	return this.errors;
};

/**
 * Remove a validator from the form validator
 * @param  {String} fieldName The name of the field to remove from validation
 */
kitty.FormValidator.prototype.removeValidator = function(fieldName) {
	var i;
	for (i = 0; i < this.validators.length; i++) {
		if (this.validators[i].fieldName === fieldName) {
			this.validators.splice(i, 1);
			break;
		}
	}
};

/**
 * Remove a single rule from a validator
 * @param  {String} fieldName The name of the field
 * @param  {Function} ruleFunction The function reference for the rule
 */
kitty.FormValidator.prototype.removeRuleFromValidator = function(fieldName,
	ruleFunction) {
	var validator = null,
		rules,
		rule,
		i,
		j;
	for (i = 0; i < this.validators.length; i++) {
		validator = this.validators[i];
		if (validator.fieldName === fieldName) {
			rules = validator.rules;
			for (j = 0; j < rules.length; j++) {
				rule = rules[j];
				if (rule.method === ruleFunction) {
					rules.splice(j, 1);
					break;
				}
			}
			break;
		}
	}
};