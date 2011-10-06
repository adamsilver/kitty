var Kitty = Kitty || {};
Kitty.FormValidator = function(form) {
	this.form = form;
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
	var field = this.form.find("[name="+fieldName+"]");
	// if field does not exist
	if(!field.length) {
		throw "Invalid form field.";
	}
	if(!rules) {
		throw "Invalid rules. Must provide be an array of rules (at least 1).";
	}
	if(!rules.length) {
		throw "Invalid rules. Must provide be an array of rules (at least 1).";
	}
}