/*
todo:
work out how to save() a model with regards to state of attributes
*/

kitty.Model = function(attributes) {
	kitty.Model.superConstructor.call(this, attributes);
	this.createAttributesObject(attributes);
};

kitty.inherit(kitty.Model, kitty.EventEmitter);

kitty.Model.prototype.createAttributesObject = function(attributes) {
	var massagedAttributes = {};
	for(var attribute in attributes) {
		if(attributes.hasOwnProperty(attribute)) {
			massagedAttributes[attribute] = {
				previousValue: null,
				currentValue: attributes[attribute]
			};
		}
	}
	this.attributes = massagedAttributes;
};

kitty.Model.prototype.getAttribute = function(name) {
	return this.attributes[name].currentValue;
};

/* 
todo call this function without firing event as if user
uses the tbd setAttributes method which uses this method
then the event will fire several times which is not what
want.
*/
kitty.Model.prototype.setAttribute = function(name, value) {
	this.attributes[name].previousValue = this.attributes[name].currentValue;
	this.attributes[name].currentValue = value;
	var eventDetails = { changed: {} };

	var attributeChanges = {
		previousValue: this.attributes[name].previousValue,
		newValue: this.attributes[name].currentValue
	};

	eventDetails.changed[name] = attributeChanges;
	this.fire("changed", eventDetails);
	this.fire(name+"Changed", attributeChanges);
};
