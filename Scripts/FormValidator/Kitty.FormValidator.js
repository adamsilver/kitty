var Kitty = Kitty || {};
Kitty.FormValidator = function(form) {
	this.form = form;
	this.errors = [];
	this.validators = [];
	var invalidContainerMessage = "Must be a form element.";
	if(typeof form == "undefined") {
		throw invalidContainerMessage;
	}
	if(!form.tagName || form.tagName.toLowerCase() != "form") {
		throw invalidContainerMessage;
	}
}
Kitty.FormValidator.prototype.addValidator = function(fieldName, rules) {
	var exceptionMessageRules = "Invalid rules. Must provide be an array of rules (at least 1).";
	var field = this.form.elements[fieldName];
	var rule;
	// if field does not exist
	if(!field) {
		throw "Invalid form field.";
	}
	if(!rules) {
		throw exceptionMessageRules;
	}
	if(!rules.length) {
		throw exceptionMessageRules;
	}
	if(rules.length) {
		for(var i = 0; i < rules.length; i++) {
			rule = rules[i];
			if(typeof rule.method != "function" || typeof rule.message != "string") {
				throw exceptionMessageRules;
			}
		}
	}
	this.validators.push({fieldName: fieldName, rules: rules, field: field});
}
Kitty.FormValidator.prototype.validate = function() {
	this.errors = [];
	var validator = null, validatorValid = true;
	for(var i = 0; i < this.validators.length; i++) {
		validator = this.validators[i];
		for(var j = 0; j < validator.rules.length; j++) {
			validatorValid = validator.rules[j].method(validator.field, validator.rules[j].params);
			if(!validatorValid) {
				this.errors.push({
					fieldName: validator.fieldName,
					message: validator.rules[j].message
				});
				break;
			}
		}
	}
	return this.errors.length === 0;
}
Kitty.FormValidator.prototype.getErrors = function() {
	return this.errors;
}
Kitty.FormValidator.prototype.removeValidator = function(fieldName) {
	for(var i = 0; i < this.validators.length; i++) {
		if(this.validators[i].fieldName === fieldName) {
			this.validators.splice(i, 1);
			break;
		}
	}
}
Kitty.FormValidator.prototype.removeRuleFromValidator = function(fieldName, ruleFunction) {
	var validator = null, rules, rule;
	for(var i = 0; i < this.validators.length; i++) {
		validator = this.validators[i]
		if(validator.fieldName === fieldName) {
			rules = validator.rules;
			for(var j = 0; j < rules.length; j++) {
				rule = rules[j];
				if(rule.method == ruleFunction) {
					rules.splice(j, 1);
					break;
				}	
			}
			break;
		}
	}
}