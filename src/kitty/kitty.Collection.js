kitty.Collection = function(options) {
	kitty.Collection.superConstructor.call(this);
	this.options = options;
	this.ModelConstructor  = this.options.ModelConstructor || kitty.Model;
	this.models = [];
};

kitty.inherit(kitty.Collection, kitty.EventEmitter);

kitty.Collection.prototype.addModel = function(attributes) {
	// create a new model from these attributes
};

kitty.Collection.prototype.addModels = function(modelObjectList) {
	// body...
};