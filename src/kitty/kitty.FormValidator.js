kitty.FormValidator = function(form, options) {
	this.form = form;
	this.errors = [];
	this.validators = [];
	$(this.form).on("submit", $.proxy(this, "onFormSubmit"));
	this.summary = $(".errorSummary");
	this.summary.on('click', 'a', $.proxy(this, 'onErrorClicked'));
};

kitty.FormValidator.prototype.onErrorClicked = function(e) {
    e.preventDefault();
    var href = e.target.href;
    href = href.substring(href.indexOf("#")+1, href.length);
    document.getElementById(href).focus();
};

kitty.FormValidator.prototype.showSummary = function () {
    this.summary.html(this.getSummaryHtml());
    this.summary.removeClass('errorSummary-isHidden');
    this.summary.focus();
};

kitty.FormValidator.prototype.getSummaryHtml = function() {
	var errors = this.getErrors();
    var html = '<h2>You have ' + errors.length + ' errors</h2>';
    html += '<ul>';
    for (var i = 0, j = errors.length; i < j; i++) {
        var error = errors[i];
        html += '<li>';
        html +=		'<a href="#' + error.fieldName + '">';
        html +=			error.message;
        html +=		'</a>';
        html +=	'</li>';
    }
    html += '</ul>';
    return html;
};

kitty.FormValidator.prototype.hideSummary = function() {
    this.summary.addClass('errorSummary-isHidden');
};

kitty.FormValidator.prototype.onFormSubmit = function (e) {
	this.removeInlineErrors();
	this.hideSummary();
	if(!this.validate()) {
		e.preventDefault();
		this.showSummary();
		this.showInlineErrors();
	}
};

kitty.FormValidator.prototype.showInlineErrors = function() {
	var errors = this.getErrors();
	for (var i = 0, j = errors.length; i < j; i++) {
		this.showInlineError(errors[i]);
	}
};

kitty.FormValidator.prototype.showInlineError = function (error) {
	var errorSpan = '<span class="error"><span>Error:</span> '+error.message+'</span>';
	var fieldContainer = $("#" + error.fieldName).parents(".field");
	var label = fieldContainer.find('label');
	var legend = fieldContainer.find("legend");
	var errorContainer = fieldContainer.find(".error");
	errorContainer.remove();
	if(legend.length) {
		legend.append(errorSpan);
	} else {
		label.append(errorSpan);
	}
};

kitty.FormValidator.prototype.removeInlineErrors = function () {
	$(this.form).find(".field .error").remove();
};

kitty.FormValidator.prototype.addValidator = function(fieldName, rules) {
	this.validators.push({
		fieldName: fieldName,
		rules: rules,
		field: this.form.elements[fieldName]
	});
};

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
	return this.getErrors().length === 0;
};

kitty.FormValidator.prototype.getErrors = function() {
	return this.errors;
};

// kitty.FormValidator.prototype.removeValidator = function(fieldName) {
// 	var i;
// 	for (i = 0; i < this.validators.length; i++) {
// 		if (this.validators[i].fieldName === fieldName) {
// 			this.validators.splice(i, 1);
// 			break;
// 		}
// 	}
// };

// kitty.FormValidator.prototype.removeRuleFromValidator = function(fieldName,
// 	ruleFunction) {
// 	var validator = null,
// 		rules,
// 		rule,
// 		i,
// 		j;
// 	for (i = 0; i < this.validators.length; i++) {
// 		validator = this.validators[i];
// 		if (validator.fieldName === fieldName) {
// 			rules = validator.rules;
// 			for (j = 0; j < rules.length; j++) {
// 				rule = rules[j];
// 				if (rule.method === ruleFunction) {
// 					rules.splice(j, 1);
// 					break;
// 				}
// 			}
// 			break;
// 		}
// 	}
// };