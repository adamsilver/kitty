function DemoFormValidator(form, options) {
	DemoFormValidator.superConstructor.apply(this, arguments);
	$(this.form).on("submit", $.proxy(this, "onFormSubmit"));
}

kitty.inherit(DemoFormValidator, kitty.FormValidator);

DemoFormValidator.prototype.onFormSubmit = function (e) {
	this.clearFieldErrors();
	errorSummary.hideErrors();
	if(!this.validate()) {
		e.preventDefault();
		errorSummary.showErrors(this.getErrors());
		this.showFieldErrors();
	}
};

DemoFormValidator.prototype.showFieldErrors = function() {
	var errors = this.getErrors();
	for (var i = 0, j = errors.length; i < j; i++) {
		this.showFieldError(errors[i]);
	}
};

DemoFormValidator.prototype.showFieldError = function (error) {
	var errorSpan = '<span class="error"> Error</span>';
	var fieldContainer = $("#" + error.fieldName).parents(".field");
	var label = fieldContainer.find('label');
	var legend = fieldContainer.find("legend");
	var errorContainer = fieldContainer.find(".error");
	errorContainer.remove();
	fieldContainer.append('<div class="error">'+error.message+'</div>');
	if(legend.length) {
		legend.append(errorSpan);
	} else {
		label.append(errorSpan);
	}
};

DemoFormValidator.prototype.clearFieldErrors = function () {
	$(this.form).find(".field .error").remove();
};