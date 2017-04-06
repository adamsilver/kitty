kitty.TypeAhead = function(control, options) {
	this.controlId = control.id;
	this.control = control;
	this.changeSelectId();
	this.hideSelect();
	this.createTextBox();
	this.createShowSuggestionsButton();
	this.createSuggestionsPanel();
};

kitty.TypeAhead.prototype.changeSelectId = function() {
	this.control.id = this.controlId + '-select';
};

kitty.TypeAhead.prototype.hideSelect = function() {
	$(this.control).hide();
};

kitty.TypeAhead.prototype.createTextBox = function() {
	this.textBox = $('<input type="text" />');
	this.textBox.prop('id', this.controlId);
	$(this.control).parents('div').append(this.textBox);
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
};

kitty.TypeAhead.prototype.createShowSuggestionsButton = function() {
	this.toggleButton = $('<button>Show suggestions</button>');
	$(this.control).parents('div').append(this.toggleButton);
	this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick'));
};

kitty.TypeAhead.prototype.onToggleButtonClick = function(e) {
	this.clearSuggestions();
	this.buildAllSuggestions();
	this.showMenu();
};

kitty.TypeAhead.prototype.createSuggestionsPanel = function() {
	this.suggestionsPanel = $('<ul id="suggestions" role="listbox"></ul>');
	$(this.control).parents('div').append(this.suggestionsPanel);
	this.suggestionsPanel.on('keyup', $.proxy(this, 'onSuggestionsKeyUp'));
	this.suggestionsPanel.on('click', 'li', $.proxy(this, 'onSuggestionClick'));
};

kitty.TypeAhead.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case 40: //DOWN
			this.onTextBoxDownPressed(e);
			break;
		default:
			console.log('typed');
			
			if(this.textBox.val().length > 0) {
				this.clearSuggestions();
				this.buildFilteredSuggestions();
				this.showMenu();
			} else {
				this.clearSuggestions();
				this.hideMenu();
			}
	}
};

kitty.TypeAhead.prototype.onSuggestionsKeyUp = function(e) {
	switch (e.keyCode) {
		case 9: // TAB
			break;
		case 16: // SHIFT
			return false;
		case 13: // ENTER
			this.onSuggestionEnterPressed(e);
			break;
		case 32: // SPACE
			this.onSuggestionSpacePressed(e);
			break;
		case 27: // ESCAPE
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

kitty.TypeAhead.prototype.onSuggestionClick = function(e) {
	this.textBox.val($(e.currentTarget).text());
	this.hideMenu();
	this.textBox.focus();
};

kitty.TypeAhead.prototype.onSuggestionEnterPressed = function(e) {
	this.textBox.val($(this.activeSuggestion).text());
	this.hideMenu();
	this.textBox.focus();
};

kitty.TypeAhead.prototype.onSuggestionSpacePressed = function(e) {
	this.textBox.val($(this.activeSuggestion).text());
	this.hideMenu();
	this.textBox.focus();
};

kitty.TypeAhead.prototype.onTextBoxDownPressed = function(e) {
	this.showMenu();
	var firstSuggestion = this.suggestionsPanel.find('li')[0];
	this.selectItem(firstSuggestion);
};

kitty.TypeAhead.prototype.onSuggestionDownPressed = function(e) {
	if(this.activeSuggestion) {
		var nextSuggestion = $(this.activeSuggestion).next();
		if(nextSuggestion[0]) {
			this.selectItem(nextSuggestion[0]);
		}
	}
};

kitty.TypeAhead.prototype.onSuggestionUpPressed = function(e) {	
	var previousSuggestion = $(this.activeSuggestion).prev();
	if(previousSuggestion[0]) {
		this.selectItem(previousSuggestion[0]);
	} else {
		this.textBox.focus();
		this.clearActiveSuggestion();
	}
};

kitty.TypeAhead.prototype.clearActiveSuggestion = function() {
	$(this.activeSuggestion).removeClass('active-suggestion');
	this.activeSuggestion = null;
};

kitty.TypeAhead.prototype.selectItem = function(suggestion) {
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

kitty.TypeAhead.prototype.showMenu = function() {
	this.suggestionsPanel.show();
};

kitty.TypeAhead.prototype.hideMenu = function() {
	this.suggestionsPanel.hide();
};

kitty.TypeAhead.prototype.clearSuggestions = function() {
	this.suggestionsPanel.empty();
};

kitty.TypeAhead.prototype.buildFilteredSuggestions = function() {
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

kitty.TypeAhead.prototype.buildAllSuggestions = function() {
	var options = this.control.options;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		this.suggestionsPanel.append('<li tabindex="-1" role="option" id="search--' + i + '">' + optionText + '</li>')
	}
};

kitty.TypeAhead.prototype.hideMenu = function() {
	this.clearSuggestions();
};
