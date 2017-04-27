// https://haltersweb.github.io/Accessibility/autocomplete.html
// liveregion
// lookup/search sophistication option
// markup injection?

kitty.AutocompleteControl = function(control, options) {
	this.controlId = control.id;
	this.control = control;
	this.createTextBox();
	this.createButton();
	this.createOptionsUl();
	this.removeSelectBox();
	this.setupKeys();
};

kitty.AutocompleteControl.prototype.setupKeys = function() {
	this.keys = {
		enter:    13,
		esc:      27,
		space:    32,
		up:       38,
		down:     40
   };
};

kitty.AutocompleteControl.prototype.removeSelectBox = function() {
	$(this.control).remove();
};

kitty.AutocompleteControl.prototype.createTextBox = function() {
	this.textBox = $('<input class="autocomplete-textBox" type="text" role="combobox" autocomplete="off" aria-owns="'+this.getOptionsId()+'">');
	this.textBox.prop('id', this.controlId);
	$(this.control).parent().append(this.textBox);
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
	this.textBox.on('keydown', $.proxy(this, 'onTextBoxKeyDown'));
	this.textBox.on('blur', $.proxy(this, 'onTextBoxBlur'));
};

kitty.AutocompleteControl.prototype.onTextBoxKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.enter:
			this.onTextBoxKeyDownEnterPressed(e);
			break;
	}
};

kitty.AutocompleteControl.prototype.getOptionsId = function() {
	return 'autocomplete-options--'+this.controlId;
};

kitty.AutocompleteControl.prototype.onTextBoxKeyDownEnterPressed = function(e) {
	if(this.isOptionSelected()) {
		e.preventDefault();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			this.onTextBoxUpPressed(e);
			break;
		case this.keys.down:
			this.onTextBoxDownPressed(e);
			break;
		case this.keys.enter:
			this.onTextBoxEnterPressed(e);
			break;
		case this.keys.space:
			this.onTextBoxSpacePressed(e);
			break;
		case this.keys.esc:
			this.onTextBoxEscapePressed(e);
			break;
		default:
			this.onTextBoxCharacterEntered(e);
	}
};

kitty.AutocompleteControl.prototype.onTextBoxBlur = function(e) {
	this.timeout = window.setTimeout(function() {
		this.hideOptions();
	}.bind(this), 100)
};

kitty.AutocompleteControl.prototype.createButton = function() {
	this.button = $('<button class="autocomplete-button" type="button" tabindex="-1">&#9662;</button>');
	$(this.control).parent().append(this.button);
	this.button.on('click', $.proxy(this, 'onButtonClick'));
};

kitty.AutocompleteControl.prototype.onButtonClick = function(e) {
	window.clearTimeout(this.timeout);
	this.clearOptions();
	this.buildAllOptions();
	this.showOptionsPanel();
	this.textBox.focus();
};

kitty.AutocompleteControl.prototype.createOptionsUl = function() {
	this.optionsUl = $('<ul id="'+this.getOptionsId()+'" role="listbox" class="autocomplete-options autocomplete-options-isHidden" aria-hidden="true"></ul>');
	$(this.control).parent().append(this.optionsUl);
	this.optionsUl.on('click', 'li', $.proxy(this, 'onSuggestionClick'));
};



kitty.AutocompleteControl.prototype.onTextBoxCharacterEntered = function(e) {
	if(this.textBox.val().trim().length > 0) {
		this.buildOptions();
		this.showOptionsPanel();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxEscapePressed = function(e) {
	if(this.isOptionSelected()) {
		this.clearOptions();
		this.hideOptions();
		this.focusTextBox();
		e.preventDefault();
	}
};

kitty.AutocompleteControl.prototype.focusTextBox = function() {
	this.textBox.focus();
};

kitty.AutocompleteControl.prototype.onSuggestionClick = function(e) {
	this.textBox.val($(e.currentTarget).text());
	this.hideOptions();
	this.focusTextBox();
};

kitty.AutocompleteControl.prototype.onTextBoxEnterPressed = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxSpacePressed = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
		e.preventDefault();
	}
};

kitty.AutocompleteControl.prototype.selectOption = function() {
	this.textBox.val(this.getActiveOption().text());
	this.focusTextBox();
	this.hideOptions();
};

kitty.AutocompleteControl.prototype.onTextBoxDownPressed = function(e) {
	var option;
	if(this.isOptionSelected()) {
		option = this.getNextOption();
		if(option[0]) {
			this.highlightOption(option);
		}
	} else {
		if(this.textBox.val().trim().length == 0) {
			this.buildAllOptions();
		} else {
			this.buildOptions();
		}
		this.showOptionsPanel();
		option = this.getFirstOption();
		if(option[0]) {
			this.highlightOption(option);
		}
	}
};

kitty.AutocompleteControl.prototype.onTextBoxUpPressed = function(e) {
	if(this.isOptionSelected()) {
		option = this.getPreviousOption();
		if(option[0]) {
			this.highlightOption(option);
		} else {
			this.focusTextBox();
			this.hideOptions();
		}
	}
};

kitty.AutocompleteControl.prototype.isFirstOptionSelected = function() {
	var selectedOption = this.getActiveOption();
};

kitty.AutocompleteControl.prototype.isOptionSelected = function() {
	return this.activeOptionId;
};

kitty.AutocompleteControl.prototype.getActiveOption = function() {
	return $('#'+this.activeOptionId);
};

kitty.AutocompleteControl.prototype.getFirstOption = function() {
	return this.optionsUl.find('li').first();
};

kitty.AutocompleteControl.prototype.getPreviousOption = function() {
	return $('#'+this.activeOptionId).prev();
};

kitty.AutocompleteControl.prototype.getNextOption = function() {
	return $('#'+this.activeOptionId).next();
};

kitty.AutocompleteControl.prototype.highlightOption = function(option) {
	if(this.activeOptionId) {
		var activeOption = this.getOptionById(this.activeOptionId);
		activeOption.removeClass('autocomplete-option-isActive');
		activeOption.attr('aria-selected', 'false');
	}

	option.addClass('autocomplete-option-isActive');
	option.attr('aria-selected', 'true');
	option.focus();
	option.parent().scrollTop(option.parent().scrollTop() + option.position().top);
	this.activeOptionId = option[0].id;
	this.updateActiveDescendant(this.activeOptionId);
};

kitty.AutocompleteControl.prototype.updateActiveDescendant = function(id) {
	this.textBox.attr('aria-activedescendant', id);
};

kitty.AutocompleteControl.prototype.getOptionById = function(id) {
	return $('#'+id);
};

kitty.AutocompleteControl.prototype.showOptionsPanel = function() {
	this.optionsUl.removeClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'false');
	this.textBox.attr('aria-expanded', 'true');
};

kitty.AutocompleteControl.prototype.hideOptions = function() {
	this.optionsUl.addClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'true');
	this.textBox.attr('aria-expanded', 'false');
	this.removeActiveDescendant();
	this.activeOptionId = null;
	this.clearOptions();
};

kitty.AutocompleteControl.prototype.removeActiveDescendant = function() {
	this.textBox.removeAttr('aria-activedescendant');
};

kitty.AutocompleteControl.prototype.clearOptions = function() {
	this.optionsUl.empty();
};

kitty.AutocompleteControl.prototype.buildOptions = function() {
	this.clearOptions();
	this.activeOptionId = null;
	var value = this.textBox.val().toLowerCase();
	var options = this.control.options;
	var optionText;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		if(optionText.toLowerCase().indexOf(value) > -1) {
			this.optionsUl.append(this.getOptionHtml(i, optionText));
		}
	}
	this.optionsUl.scrollTop(this.optionsUl.scrollTop());
};

kitty.AutocompleteControl.prototype.buildAllOptions = function() {
	this.clearOptions();
	var options = this.control.options;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		this.optionsUl.append(this.getOptionHtml(i, optionText));
	}
};

kitty.AutocompleteControl.prototype.getOptionHtml = function(i, optionText) {
	return '<li class="autocomplete-option" aria-selected="false" role="option" id="autocomplete-option--' + i + '">' + optionText + '</li>'
};
