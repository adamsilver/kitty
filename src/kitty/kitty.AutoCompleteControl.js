kitty.AutoCompleteControl = function(control, options) {
	this.controlId = control.id;
	this.control = control;
	this.changeSelectId();
	this.createTextBox();
	this.createShowSuggestionsButton();
	this.createSuggestionsPanel();
	this.hideSelect();
};

kitty.AutoCompleteControl.prototype.changeSelectId = function() {
	this.control.id = this.controlId + '-select';
};

kitty.AutoCompleteControl.prototype.hideSelect = function() {
	$(this.control).remove();
};

kitty.AutoCompleteControl.prototype.createTextBox = function() {
	this.textBox = $('<input type="text" role="combobox" autocomplete="off" aria-owns="suggestions">');
	this.textBox.prop('id', this.controlId);
	$(this.control).parents('div').append(this.textBox);
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
	// this.textBox.on('blur', $.proxy(this, 'onTextBoxBlur'));
};

kitty.AutoCompleteControl.prototype.createShowSuggestionsButton = function() {
	// this.toggleButton = $('<button>&darr;</button>');
	// $(this.control).parents('div').append(this.toggleButton);
	// this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick'));
};

kitty.AutoCompleteControl.prototype.onToggleButtonClick = function(e) {
	this.clearSuggestions();
	this.buildAllSuggestions();
	this.showMenu();
};

kitty.AutoCompleteControl.prototype.createSuggestionsPanel = function() {
	this.suggestionsPanel = $('<ul id="suggestions" role="listbox" class="hide"></ul>');
	$(this.control).parents('div').append(this.suggestionsPanel);
	this.suggestionsPanel.on('keydown', 'li', $.proxy(this, 'onSuggestionsKeyDown'));
	this.suggestionsPanel.on('click', 'li', $.proxy(this, 'onSuggestionClick'));
};

kitty.AutoCompleteControl.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case 40: //DOWN
			this.onTextBoxDownPressed(e);
			e.preventDefault();
			break;
		default:

			// when a suggestion is selected and the text box is focussed
			// it triggers this event listener to fire
			// but we don't want this to run because it will
			// reshow the menu because the length is more than 0
			// perhaps instead of this state "hack" we could...
			// instead check that the value is an actual suggestion
			// if it is don't show the box. Could serve double purpose.
			if(this.suggestionSelected) {
				this.suggestionSelected = false;
				return;
			}
			if(this.textBox.val().length > 0) {
				this.clearSuggestions();
				this.buildFilteredSuggestions();
				if(this.suggestionsPanel.find('li').length) {
					this.showMenu();
				}
			} else {
				this.clearSuggestions();
				this.hideMenu();
			}
	}
};

kitty.AutoCompleteControl.prototype.onSuggestionsKeyDown = function(e) {
	switch (e.keyCode) {
		case 13: // ENTER
			this.onSuggestionEnterPressed(e);
			break;
		case 32: // SPACE
			this.onSuggestionSpacePressed(e);
			break;
		case 27: // ESCAPE
			this.onSuggestionEscapePressed(e);
			break;
		case 38: //UP
			this.onSuggestionUpPressed(e);
			break;
		case 40: //DOWN
			this.onSuggestionDownPressed(e);
			break;
		default:
	}
};

kitty.AutoCompleteControl.prototype.onSuggestionEscapePressed = function(e) {
	e.preventDefault();
	this.clearSuggestions();
	this.hideMenu();
	this.focusTextBox();
};

kitty.AutoCompleteControl.prototype.focusTextBox = function() {
	this.textBox.focus();
};

kitty.AutoCompleteControl.prototype.onSuggestionClick = function(e) {
	this.textBox.val($(e.currentTarget).text());
	this.hideMenu();
	this.focusTextBox();
};

kitty.AutoCompleteControl.prototype.onSuggestionEnterPressed = function(e) {
	this.selectSuggestion();
	e.preventDefault();
};

kitty.AutoCompleteControl.prototype.onSuggestionSpacePressed = function(e) {
	this.selectSuggestion();
	e.preventDefault();
};

kitty.AutoCompleteControl.prototype.selectSuggestion = function() {
	this.suggestionSelected = true;
	this.textBox.val($(this.activeSuggestion).text());
	this.focusTextBox();
	this.hideMenu();
};

kitty.AutoCompleteControl.prototype.onTextBoxDownPressed = function(e) {
	this.showMenu();
	var firstSuggestion = this.suggestionsPanel.find('li')[0];
	this.highlightItem(firstSuggestion);
};

kitty.AutoCompleteControl.prototype.onSuggestionDownPressed = function(e) {
	if(this.activeSuggestion) {
		var nextSuggestion = $(this.activeSuggestion).next();
		if(nextSuggestion[0]) {
			this.highlightItem(nextSuggestion[0]);
		}
	}
	e.preventDefault();
};

kitty.AutoCompleteControl.prototype.onSuggestionUpPressed = function(e) {
	var previousSuggestion = $(this.activeSuggestion).prev();
	if(previousSuggestion[0]) {
		this.highlightItem(previousSuggestion[0]);
	} else {
		this.focusTextBox();
		this.clearActiveSuggestion();
	}
	e.preventDefault();
};

kitty.AutoCompleteControl.prototype.clearActiveSuggestion = function() {
	$(this.activeSuggestion).removeClass('active-suggestion');
	this.activeSuggestion = null;
};

kitty.AutoCompleteControl.prototype.highlightItem = function(suggestion) {
	/*
		1. Unhighlight previous if any DONE
		2. Add highlight state using a class DONE
		3. focus on the suggestion DONE
		4. update active-descendant on the textbox TODO
	*/
	if(this.activeSuggestion) {
		$(this.activeSuggestion).removeClass('active-suggestion');
	}
	$(suggestion).addClass('active-suggestion');
	suggestion.focus();
	this.activeSuggestion = suggestion;
};

kitty.AutoCompleteControl.prototype.showMenu = function() {
	this.suggestionsPanel.removeClass('hide');
	this.textBox.attr('aria-expanded', 'true');
};

kitty.AutoCompleteControl.prototype.hideMenu = function() {
	this.suggestionsPanel.addClass('hide');
	this.textBox.attr('aria-expanded', 'false');
};

kitty.AutoCompleteControl.prototype.clearSuggestions = function() {
	this.suggestionsPanel.empty();
};

kitty.AutoCompleteControl.prototype.buildFilteredSuggestions = function() {
	var value = this.textBox.val().toLowerCase();
	var options = this.control.options;
	var optionText;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		if(optionText.toLowerCase().indexOf(value) > -1) {
			this.suggestionsPanel.append('<li tabindex="-1" role="option" id="search--' + i + '">' + optionText + '</li>')
		}
	}
};

kitty.AutoCompleteControl.prototype.buildAllSuggestions = function() {
	var options = this.control.options;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		this.suggestionsPanel.append('<li tabindex="-1" role="option" id="search--' + i + '">' + optionText + '</li>')
	}
};
