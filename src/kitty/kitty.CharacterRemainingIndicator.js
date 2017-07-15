kitty.CharacterRemainingIndicator = function(field, options) {
	this.field = field;
	this.options = {
		maxLength: 100,
		message: 'You have %count% characters remaining.',
		status: $('<div class="indicator" role="alert" aria-live="polite" />')
	};

	this.options = $.extend(this.options, options);

	this.updateStatus(this.options.maxLength);

	$(this.field).parent().append(this.options.indicator);
	$(this.field).bind("keypress keydown", $.proxy(this.onFieldChange, this));
};

kitty.CharacterRemainingIndicator.prototype.onFieldChange = function(e) {
	var remaining = this.options.maxLength - this.field.value.length;
	this.updateStatus(remaining);
};

kitty.CharacterRemainingIndicator.prototype.updateStatus = function(remaining) {
	var message = this.options.message.replace(/%count%/, remaining);
	this.options.indicator.html(message);
};