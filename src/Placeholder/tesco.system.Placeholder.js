YUI.add("Placeholder", function(Y) {
	Y.namespace("tesco.system");

	Y.tesco.system.Placeholder = function(input) {
		if(!input) {
			throw "Provide an input.";
		}
		this.input = input;

		Y.one(input).on("focus", this.handleInput_onFocus, this);
		Y.one(input).on("blur", this.handleInput_onBlur, this);
	};

	Y.tesco.system.Placeholder.prototype.handleInput_onFocus = function(e) {
		e._event.target.value = '';
	};

	Y.tesco.system.Placeholder.prototype.handleInput_onBlur = function(e) {
		var input = e._event.target;
		var defaultValue = input.defaultValue;
		var newValue = input.value;
		if(newValue === "") {
			input.value = defaultValue;
		}
	};

	Y.tesco.system.Placeholder.prototype.teardown = function() {
		Y.one(this.input).detach("focus", this.handleInput_onFocus);
		Y.one(this.input).detach("blur", this.handleInput_onBlur);
	};

});