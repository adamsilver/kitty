var Kitty = Kitty || {};
Kitty.ContextualSubmit = function(field, submitButton) {
	this.form = field.parents("form");
	this.field = field;
	this.submitButton = submitButton;
	this.field.bind("focus", $.proxy(this, "handleField_onFocus"));
	this.field.bind("blur", $.proxy(this, "handleField_onBlur"));
	this.clonedSubmitButton = this.submitButton.clone();
	this.clonedSubmitButton.attr("id", "");
	this.clonedSubmitButton.addClass("offScreen");
}
Kitty.ContextualSubmit.prototype.handleField_onFocus = function(e) {
	this.form.prepend(this.clonedSubmitButton);
}
Kitty.ContextualSubmit.prototype.handleField_onBlur = function(e) {
	this.clonedSubmitButton.remove();
}
Kitty.ContextualSubmit.prototype.destroy = function() {
	this.field.unbind("focus", this.handleField_onFocus);
	this.field.unbind("blur", this.handleField_onBlur);
}