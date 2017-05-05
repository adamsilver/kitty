// https://haltersweb.github.io/Accessibility/autocomplete.html
// update text box to selected value as go up and down
// ...remember original value
// lookup/search sophistication option

kitty.Autocomplete = function(control) {
	this.container = $(control).parent();
	this.control = control;
	this.controlId = control.id;
	this.createTextBox();
	this.createButton();
	this.createOptionsUl();
	this.removeSelectBox();
	this.createStatusBox();
	this.setupKeys();
};

kitty.Autocomplete.prototype.createStatusBox = function() {
	this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="autocomplete-status" />');
	this.container.append(this.status);
};

kitty.Autocomplete.prototype.updateStatus = function(status) {
	this.status.text(status);
};

kitty.Autocomplete.prototype.setupKeys = function() {
	this.keys = {
		enter: 13,
		esc: 27,
		space: 32,
		up: 38,
		down: 40
   };
};

kitty.Autocomplete.prototype.removeSelectBox = function() {
	$(this.control).remove();
};

kitty.Autocomplete.prototype.createTextBox = function() {
	this.textBox = $('<input autocapitalize="none" class="autocomplete-textBox" type="text" role="combobox" autocomplete="off" aria-owns="'+this.getOptionsId()+'">');
	this.textBox.prop('id', this.controlId);
	this.container.append(this.textBox);
	this.textBox.on('keydown', $.proxy(this, 'onTextBoxKeyDown'));
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
	// this.textBox.on('blur', $.proxy(this, 'onTextBoxBlur'));
};

kitty.Autocomplete.prototype.onTextBoxKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			// this.onTextBoxKeyDownUpPressed(e);
			break;
	}
};

kitty.Autocomplete.prototype.getOptionsId = function() {
	return 'autocomplete-options--'+this.controlId;
};

kitty.Autocomplete.prototype.onTextBoxKeyDownEnterPressed = function(e) {
	if(this.isOptionSelected()) {
		e.preventDefault();
	}
};

kitty.Autocomplete.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case this.keys.down:
			this.onTextBoxDownPressed(e);
			break;
		default:
			this.onTextBoxCharacterPressed(e);
	}
};

kitty.Autocomplete.prototype.onTextBoxBlur = function(e) {
	this.timeout = window.setTimeout(function() {
		this.hideOptions();
	}.bind(this), 100);
};

kitty.Autocomplete.prototype.createButton = function() {
	this.button = $('<button class="autocomplete-button" type="button" tabindex="-1">&#9662;</button>');
	this.container.append(this.button);
	this.button.on('click', $.proxy(this, 'onButtonClick'));
};

kitty.Autocomplete.prototype.onButtonClick = function(e) {
	window.clearTimeout(this.timeout);
	this.clearOptions();
	this.buildAllOptions();
	this.showOptionsPanel();
	this.textBox.focus();
};

kitty.Autocomplete.prototype.createOptionsUl = function() {
	this.optionsUl = $('<ul tabindex="0" id="'+this.getOptionsId()+'" role="listbox" class="autocomplete-options autocomplete-options-isHidden" aria-hidden="true"></ul>');
	this.container.append(this.optionsUl);
	this.optionsUl.on('click', 'li', $.proxy(this, 'onSuggestionClick'));
	this.optionsUl.on('focus', $.proxy(this, 'onSuggestionContainerFocus'));
	this.optionsUl.on('keyup', $.proxy(this, 'onSuggestionContainerKeyUp'));
	this.optionsUl.on('keydown', $.proxy(this, 'onSuggestionContainerKeyDown'));
};

kitty.Autocomplete.prototype.onSuggestionContainerKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			break;
		case this.keys.down:
			break;
		case this.keys.enter:
			break;
		case this.keys.space:
			break;
		case this.keys.esc:
			break;
		default:
			this.onSuggestionCharacterType(e);
	}
};

kitty.Autocomplete.prototype.onSuggestionContainerKeyUp = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			this.onSuggestionUpArrow(e);
			break;
		case this.keys.down:
			this.onSuggestionContainerDownArrow(e);
			break;
		case this.keys.enter:
			this.onSuggestionEnter(e);
			break;
		case this.keys.space:
			this.onSuggestionSpace(e);
			break;
		case this.keys.esc:
			this.onSuggestionEscape(e);
			break;
		default:
			this.onSuggestionCharacterType(e);
	}
};

kitty.Autocomplete.prototype.onSuggestionContainerFocus = function(e) {
	window.clearTimeout(this.timeout);
};

kitty.Autocomplete.prototype.onSuggestionCharacterType = function(e) {
	this.textBox.focus();
};

kitty.Autocomplete.prototype.onTextBoxCharacterPressed = function(e) {
	if(this.textBox.val().trim().length > 0) {
		var options = this.getOptions(this.textBox.val().trim().toLowerCase());
		if(options.length > 0) {
			this.buildOptions(options);
			this.showOptionsPanel();
			this.updateStatus(options.length + ' results available.');
		} else {
			this.hideOptions();
			this.clearOptions();
			this.updateStatus('No results.');
		}
	}
};

kitty.Autocomplete.prototype.onSuggestionEscape = function(e) {
	if(this.isShowingMenu()) {
		this.clearOptions();
		this.hideOptions();
		this.focusTextBox();
		e.preventDefault();
	}
};

kitty.Autocomplete.prototype.isShowingMenu = function() {
	return this.textBox.attr('aria-expanded', 'true');
};

kitty.Autocomplete.prototype.focusTextBox = function() {
	this.textBox.focus();
};

kitty.Autocomplete.prototype.onSuggestionClick = function(e) {
	this.textBox.val($(e.currentTarget).text());
	this.hideOptions();
	this.focusTextBox();
};

kitty.Autocomplete.prototype.onSuggestionEnter = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
	}
};

kitty.Autocomplete.prototype.onSuggestionSpace = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
		e.preventDefault();
	}
};

kitty.Autocomplete.prototype.selectOption = function() {
	this.textBox.val(this.getActiveOption().text());
	this.focusTextBox();
	this.hideOptions();
};

kitty.Autocomplete.prototype.onTextBoxDownPressed = function(e) {
	var option;
	if(this.isOptionSelected()) {
		option = this.getNextOption();
		if(option[0]) {
			this.highlightOption(option);
		}
	} else {
		this.optionsUl.focus();
		if(this.textBox.val().trim().length === 0) {
		// 	this.buildAllOptions();
		// 	this.showOptionsPanel();
		} else {
			var options = this.getOptions(this.textBox.val().trim());
			if(options.length > 0) {
				this.buildOptions(options);
				this.showOptionsPanel();
			}
		}
		option = this.getFirstOption();
		if(option[0]) {
			this.highlightOption(option);
		}
	}
};

kitty.Autocomplete.prototype.onSuggestionContainerDownArrow = function(e) {
	var option = this.getNextOption();
	if(option[0]) {
		this.highlightOption(option);
	}
};

kitty.Autocomplete.prototype.onSuggestionUpArrow = function(e) {
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

kitty.Autocomplete.prototype.onTextBoxKeyDownUpPressed = function(e) {
	if(this.isOptionSelected()) {
		e.preventDefault();
	}
};

kitty.Autocomplete.prototype.isFirstOptionSelected = function() {
	var selectedOption = this.getActiveOption();
};

kitty.Autocomplete.prototype.isOptionSelected = function() {
	return this.activeOptionId;
};

kitty.Autocomplete.prototype.getActiveOption = function() {
	return $('#'+this.activeOptionId);
};

kitty.Autocomplete.prototype.getFirstOption = function() {
	return this.optionsUl.find('li').first();
};

kitty.Autocomplete.prototype.getPreviousOption = function() {
	return $('#'+this.activeOptionId).prev();
};

kitty.Autocomplete.prototype.getNextOption = function() {
	return $('#'+this.activeOptionId).next();
};

kitty.Autocomplete.prototype.highlightOption = function(option) {
	if(this.activeOptionId) {
		var activeOption = this.getOptionById(this.activeOptionId);
		activeOption.removeClass('autocomplete-option-isActive');
		activeOption.attr('aria-selected', 'false');
	}

	option.addClass('autocomplete-option-isActive');
	option.attr('aria-selected', 'true');
	option.parent().scrollTop(option.parent().scrollTop() + option.position().top);
	this.activeOptionId = option[0].id;
	this.updateActiveDescendant(this.activeOptionId);
};

kitty.Autocomplete.prototype.updateActiveDescendant = function(id) {
	this.textBox.attr('aria-activedescendant', id);
};

kitty.Autocomplete.prototype.getOptionById = function(id) {
	return $('#'+id);
};

kitty.Autocomplete.prototype.showOptionsPanel = function() {
	this.optionsUl.removeClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'false');
	this.textBox.attr('aria-expanded', 'true');
};

kitty.Autocomplete.prototype.hideOptions = function() {
	this.optionsUl.addClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'true');
	this.textBox.attr('aria-expanded', 'false');
	this.removeActiveDescendant();
	this.activeOptionId = null;
	this.clearOptions();
};

kitty.Autocomplete.prototype.removeActiveDescendant = function() {
	this.textBox.removeAttr('aria-activedescendant');
};

kitty.Autocomplete.prototype.clearOptions = function() {
	this.optionsUl.empty();
};

kitty.Autocomplete.prototype.getOptions = function(value) {
	var options = [];
	var selectOptions = this.control.options;
	var text;
	for(var i = 0; i < selectOptions.length; i++) {
		text = $(selectOptions[i]).text();
		if(text.toLowerCase().indexOf(value) > -1) {
			options.push(text);
		}
	}
	return options;
};

kitty.Autocomplete.prototype.buildOptions = function(options) {
	this.clearOptions();
	this.activeOptionId = null;
	for(var i = 0; i < options.length; i++) {
		this.optionsUl.append(this.getOptionHtml(i, options[i]));
	}
	this.optionsUl.scrollTop(this.optionsUl.scrollTop());
};

kitty.Autocomplete.prototype.buildAllOptions = function() {
	this.clearOptions();
	this.activeOptionId = null;
	var options = this.control.options;
	for(var i = 0; i < options.length; i++) {
		this.optionsUl.append(this.getOptionHtml(i, $(options[i]).text()));
	}
};

kitty.Autocomplete.prototype.getOptionHtml = function(i, text) {
	return '<li class="autocomplete-option" aria-selected="false" role="option" id="autocomplete-option--' + i + '">' + text + '</li>';
};
