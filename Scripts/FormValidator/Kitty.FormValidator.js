var Kitty = Kitty || {};
Kitty.FormValidator = function(container) {
	var invalidContainerMessage = "Invalid container. Must be a jquery object with form element.";
	if(typeof container == "undefined") {
		throw invalidContainerMessage;
	}
	if(!(container instanceof jQuery)) {
		throw invalidContainerMessage;
	}
	if(!container.is("form")) {
		throw invalidContainerMessage;
	}
}