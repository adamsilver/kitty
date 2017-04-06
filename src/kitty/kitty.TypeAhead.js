kitty.TypeAhead = function(control, options) {
	this.controlId = control.id;
	this.control = control;
	this.changeSelectId();
	this.createTextBox();
	this.createSuggestionsPanel();
};

kitty.TypeAhead.prototype.changeSelectId = function() {
	this.control.id = this.controlId + '-select';
};

kitty.TypeAhead.prototype.createTextBox = function() {
	this.textBox = $('<input type="text" />');
	this.textBox.prop('id', this.controlId);
	$(this.control).parents('div').append(this.textBox);
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
};

kitty.TypeAhead.prototype.createSuggestionsPanel = function() {
	this.suggestionsPanel = $('<ul id="suggestions" role="listbox"></ul>');
	$(this.control).parents('div').append(this.suggestionsPanel);
	this.suggestionsPanel.on('keyup', $.proxy(this, 'onSuggestionsKeyUp'));
};

kitty.TypeAhead.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case 38: //UP
			break;
		case 40: //DOWN
			this.onTextBoxDownPressed(e);
			break;
		default:
			this.displayMenu();
	}
};

kitty.TypeAhead.prototype.onSuggestionsKeyUp = function(e) {
	switch (e.keyCode) {
		case 9: // TAB
			break;
		case 16: // SHIFT
			return false;
		case 13: // ENTER
		case 32: // SPACE

			break;
		case 27: // ESCAPE
			break;
		case 38: //UP

			break;
		case 40: //DOWN
			this.onTextBoxDownPressed(e);
			break;
		default:
			// this.textBox.focus();
	}
};

kitty.TypeAhead.prototype.onTextBoxDownPressed = function(e) {
	var nextSuggestion = this.suggestionsPanel.find('li')[0];
	this.selectItem(nextSuggestion);
};

kitty.TypeAhead.prototype.selectItem = function(nextSuggestion) {
	/*
		1. Unhighlight previous if any
		2. Add highlight state using a class
		3. focus on the suggestion
		4. update active-descendant on the textbox
		5. Update the textbox
	*/
	this.textBox.val($(nextSuggestion).text());
	nextSuggestion.focus();
};


kitty.TypeAhead.prototype.displayMenu = function() {
	this.suggestionsPanel.empty();
	var value = this.textBox.val(); 
	var options = this.control.options;
	var optionText;
	for(var i = 0; i < options.length; i++) {
		optionText = $(options[i]).text();
		if(optionText.toLowerCase().indexOf(value) > -1) {
			this.suggestionsPanel.append('<li tabindex="-1" role="option" id="search' + i + '">' + optionText + '</li>')
		}
	}
};
