kitty.Collection = function() {
	kitty.Collection.superConstructor.call(this);
	this.models = [];
};

kitty.inherit(kitty.Collection, kitty.EventEmitter);

kitty.Collection.prototype.addModel = function(model) {
	this.model.push(model);
};

kitty.Collection.prototype.addModels = function(models) {
	for(var i = 0; i < models.length; i++) {
		this.models.push(models[i]);
	}
};

kitty.Collection.prototype.getModelById = function(id) {
	var model;
	for(var i = 0; i < this.models.length; i++) {
		if(this.models[i].getAttribute("id") == id) {
			model = this.models[i];
			break;
		}
	}
	return model;
};