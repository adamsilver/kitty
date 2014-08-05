kitty.CheckboxDisabler = function(checkboxes, limit) {
	this.checkboxes = checkboxes;
	this.limit = limit;
	$(this.checkboxes).on("change", $.proxy(this, "checkboxChanged"));
	this.checkState();
};

kitty.CheckboxDisabler.prototype.checkboxChanged = function(e) {
	this.checkState();
};

kitty.CheckboxDisabler.prototype.checkState = function() {
	var checkboxesChecked = 0;
	for (var i = 0; i < this.checkboxes.length; i++) {
		if (this.checkboxes[i].checked) {
			checkboxesChecked++;
		}
	}

	if (checkboxesChecked === this.limit) {
		this.disableRemaining();
	} else {
		this.enableRemaining();
	}
};

kitty.CheckboxDisabler.prototype.disableRemaining = function() {
	for (var i = 0; i < this.checkboxes.length; i++) {
		if (!this.checkboxes[i].checked) {
			$(this.checkboxes[i]).attr("disabled", true);
		}
	}
};

kitty.CheckboxDisabler.prototype.enableRemaining = function() {
	for (var i = 0; i < this.checkboxes.length; i++) {
		this.checkboxes[i].disabled = false;
	}
};

kitty.CheckboxDisabler.prototype.destroy = function() {
	$(this.checkboxes).unbind("change", this.handleCheckbox_onChange);
};