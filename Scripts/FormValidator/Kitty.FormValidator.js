var Kitty = Kitty || {};
Kitty.FormValidator = function(form) {
	this.form = form;
	this.errors = [];
	this.validators = [];
	var invalidContainerMessage = "Invalid container. Must be a jquery object with form element.";
	if(typeof form == "undefined") {
		throw invalidContainerMessage;
	}
	if(!(form instanceof jQuery)) {
		throw invalidContainerMessage;
	}
	if(!form.is("form")) {
		throw invalidContainerMessage;
	}
}
Kitty.FormValidator.prototype.addValidator = function(fieldName, rules) {
	var exceptionMessageRules = "Invalid rules. Must provide be an array of rules (at least 1).";
	var field = this.form.find("[name="+fieldName+"]");
	var rule;
	// if field does not exist
	if(!field.length) {
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
	this.validators.push({fieldName: fieldName, rules: rules});
}
Kitty.FormValidator.prototype.validate = function() {
	this.errors = [];
	var validator = null, validatorValid = true;
	for(var i = 0; i < this.validators.length; i++) {
		validator = this.validators[i];
		for(var j = 0; j < validator.rules.length; j++) {
			validatorValid = validator.rules[j].method($("[name="+validator.fieldName+"]"), validator.rules[j].params);
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