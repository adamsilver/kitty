//https://haltersweb.github.io/Accessibility/autocomplete.html

kitty.AutocompleteControl = function(control, options) {
	this.controlId = control.id;
	this.control = control;
	this.activeSuggestion = null;
	this.changeSelectId();
	this.createTextBox();
	this.createButton();
	this.createSuggestionsPanel();
	this.hideSelect();
};

kitty.AutocompleteControl.prototype.changeSelectId = function() {
	this.control.id = this.controlId + '-select';
};

kitty.AutocompleteControl.prototype.hideSelect = function() {
	$(this.control).remove();
};

kitty.AutocompleteControl.prototype.createTextBox = function() {
	this.textBox = $('<input type="text" role="combobox" autocomplete="off" aria-owns="suggestions">');
	this.textBox.prop('id', this.controlId);
	$(this.control).parents('div').append(this.textBox);
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
	this.textBox.on('keydown', $.proxy(this, 'onTextBoxKeyDown'));
	this.textBox.on('blur', $.proxy(this, 'onTextBoxBlur'));
};

kitty.AutocompleteControl.prototype.onTextBoxKeyDown = function(e) {
	switch (e.keyCode) {
		case 13: // ENTER
			this.onTextBoxKeyDownEnterPressed(e);
			break;
	}
};

kitty.AutocompleteControl.prototype.onTextBoxKeyDownEnterPressed = function(e) {
	if(this.isOptionMenuShowing()) {
		e.preventDefault();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case 38: //UP
			this.onTextBoxUpPressed(e);
			break;
		case 40: //DOWN
			this.onTextBoxDownPressed(e);
			break;
		case 13: // ENTER
			this.onTextBoxEnterPressed(e);
			break;
		case 32: // SPACE
			this.onTextBoxSpacePressed(e);
			break;
		case 27: // ESCAPE
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
	this.button = $('<button type="button" tabindex="-1">&#9662;</button>');
	$(this.control).parents('div').append(this.button);
	this.button.on('click', $.proxy(this, 'onButtonClick'));
};

kitty.AutocompleteControl.prototype.onButtonClick = function(e) {
	window.clearTimeout(this.timeout);
	this.clearOptions();
	this.buildAllOptions();
	this.showOptionsPanel();
	this.textBox.focus();
};

kitty.AutocompleteControl.prototype.createSuggestionsPanel = function() {
	this.suggestionsPanel = $('<ul id="suggestions" role="listbox" class="hide"></ul>');
	$(this.control).parents('div').append(this.suggestionsPanel);
	this.suggestionsPanel.on('click', 'li', $.proxy(this, 'onSuggestionClick'));
};



kitty.AutocompleteControl.prototype.onTextBoxCharacterEntered = function(e) {
	if(this.textBox.val().trim().length > 0) {
		this.buildOptions();
		this.showOptionsPanel();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxEscapePressed = function(e) {
	if(this.isOptionMenuShowing()) {
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
	if(this.isOptionMenuShowing()) {
		this.selectSuggestion();
	}
};

kitty.AutocompleteControl.prototype.onTextBoxSpacePressed = function(e) {
	if(this.isOptionMenuShowing()) {
		this.selectSuggestion();
		e.preventDefault();
	}
};

kitty.AutocompleteControl.prototype.selectSuggestion = function() {
	this.textBox.val(this.getActiveOption().text());
	this.focusTextBox();
	this.hideOptions();
};

kitty.AutocompleteControl.prototype.onTextBoxDownPressed = function(e) {
	var option;
	if(this.isOptionMenuShowing()) {
		option = this.getNextOption();
		if(option[0]) {
			this.selectOption(option);
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
			this.selectOption(option);
		}
	}
};

kitty.AutocompleteControl.prototype.onTextBoxUpPressed = function(e) {
	if(this.isOptionMenuShowing()) {
		option = this.getPreviousOption();
		if(option[0]) {
			this.selectOption(option);
		} else {
			this.focusTextBox();
			this.hideOptions();
		}
	}
};

kitty.AutocompleteControl.prototype.isFirstOptionSelected = function() {
	var selectedOption = this.getActiveOption();
};

kitty.AutocompleteControl.prototype.isOptionMenuShowing = function() {
	return this.activeOptionId;
};

kitty.AutocompleteControl.prototype.getActiveOption = function() {
	return $('#'+this.activeOptionId);
};

kitty.AutocompleteControl.prototype.getFirstOption = function() {
	return this.suggestionsPanel.find('li').first();
};

kitty.AutocompleteControl.prototype.getPreviousOption = function() {
	return $('#'+this.activeOptionId).prev();
};

kitty.AutocompleteControl.prototype.getNextOption = function() {
	return $('#'+this.activeOptionId).next();
};

kitty.AutocompleteControl.prototype.selectOption = function(option) {
	/*
		TODO: update active-descendant on textbox
		TODO: aria-selected=true
	*/
	if(this.activeOptionId) {
		var activeOption = this.getOptionById(this.activeOptionId);
		activeOption.removeClass('active-suggestion');
	}

	option.addClass('active-suggestion');
	option.focus();
	option.parent().scrollTop(option.parent().scrollTop() + option.position().top);
	this.activeOptionId = option[0].id;
};

kitty.AutocompleteControl.prototype.getOptionById = function(id) {
	return $('#'+id);
};

kitty.AutocompleteControl.prototype.onSuggestionDownPressed = function(e) {
	if(this.activeSuggestion) {
		var nextSuggestion = $(this.activeSuggestion).next();
		if(nextSuggestion[0]) {
			this.selectOption(nextSuggestion[0]);
		}
	}
	e.preventDefault();
};

kitty.AutocompleteControl.prototype.onSuggestionUpPressed = function(e) {
	var previousSuggestion = $(this.activeSuggestion).prev();
	if(previousSuggestion[0]) {
		this.selectOption(previousSuggestion[0]);
	} else {
		this.focusTextBox();
		this.clearActiveSuggestion();
	}
	e.preventDefault();
};

kitty.AutocompleteControl.prototype.clearActiveSuggestion = function() {
	$(this.activeSuggestion).removeClass('active-suggestion');
	this.activeSuggestion = null;
};

kitty.AutocompleteControl.prototype.showOptionsPanel = function() {
	this.suggestionsPanel.removeClass('hide');
	this.textBox.attr('aria-expanded', 'true');
};

kitty.AutocompleteControl.prototype.hideOptions = function() {
	this.suggestionsPanel.addClass('hide');
	this.textBox.attr('aria-expanded', 'false');
	this.activeOptionId = null;
};

kitty.AutocompleteControl.prototype.clearOptions = function() {
	this.suggestionsPanel.empty();
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
			this.suggestionsPanel.append('<li role="option" id="search--' + i + '">' + optionText + '</li>')
		}
	}
	this.suggestionsPanel.scrollTop(this.suggestionsPanel.scrollTop());
};

kitty.AutocompleteControl.prototype.buildAllOptions = function() {
	var options = this.control.options;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		this.suggestionsPanel.append('<li role="option" id="search--' + i + '">' + optionText + '</li>')
	}
};
