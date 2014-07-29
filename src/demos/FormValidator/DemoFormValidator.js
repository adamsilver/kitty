function DemoFormValidator(form, options) {
	DemoFormValidator.superConstructor.apply(this, arguments);
	this.errorSummaryContainer = document.getElementById("errorSummary");
	$(this.form).on("submit", $.proxy(this, "onFormSubmit"));
}

kitty.inherit(DemoFormValidator, kitty.FormValidator);

DemoFormValidator.prototype.onFormSubmit = function (e) {
	this.clearFieldErrors();
	this.clearErrorSummary();
	if(!this.validate()) {
		e.preventDefault();
		this.showErrorSummary();
		this.showFieldErrors();
	}
};

DemoFormValidator.prototype.showErrorSummary = function () {
	this.errorSummaryContainer.innerHTML = this.getErrorSummaryHtml();
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

DemoFormValidator.prototype.clearErrorSummary = function () {
	$(this.errorSummaryContainer).empty();
};

DemoFormValidator.prototype.getErrorSummaryHtml = function () {
	var errors = this.getErrors();
	var html = '<p>You have ' + errors.length + ' errors</p>';
	html += '<ul>';
	for (var i = 0, j = errors.length; i < j; i++) {
		var error = errors[i];
		html += '<li>';
		html += 	'<a class="errorMessageAnchor" href="#' + error.fieldName +	'">';
		html += 		'<span class="errorMessageBody">' + error.message +	'</span>';
		html +=			'-';
		html += 		'<span class="errorMessageLink">Fix error</span>';
		html +=		'</a>';
		html +=	'</li>';
	}
	html += '</ul>';
	return html;
};