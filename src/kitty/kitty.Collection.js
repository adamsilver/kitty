kitty.Collection = function(options) {
	kitty.Collection.superConstructor.call(this);
	this.options = options || {};
	this.ModelConstructor = this.options.ModelConstructor || kitty.Model;
	this.models = [];
};

kitty.inherit(kitty.Collection, kitty.EventEmitter);

kitty.Collection.prototype.createModelFromAttributes = function(attributes) {
	var model;
	model = new this.ModelConstructor(attributes);
	this.models.push(model);
};

kitty.Collection.prototype.createModelsFromAttributes = function(modelObjectList) {
	for(var i = 0; i < modelObjectList.length; i++) {
		this.createModelFromAttributes(modelObjectList[i]);
	}
};

kitty.Collection.prototype.addModel = function(model) {
	this.model.push(model);
};

kitty.Collection.prototype.addModels = function(models) {
	for(var i = 0; i < models.length; i++) {
		this.model.push(models[i]);
	}
};