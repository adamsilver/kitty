kitty.Collection = function() {
	kitty.Collection.superConstructor.call(this);
	this.models = [];
};

kitty.inherit(kitty.Collection, kitty.EventEmitter);

kitty.Collection.prototype.addModel = function(model) {
	this.models.push(model);
};

kitty.Collection.prototype.addModels = function(models) {
	for(var i = 0; i < models.length; i++) {
		this.models.push(models[i]);
	}
};

kitty.Collection.prototype.getModelIndexById = function(id) {
	var index;
	for(var i = 0; i < this.models.length; i++) {
		if(this.models[i].getAttribute("id") == id) {
			index = i;
			break;
		}
	}
	return index;
};

kitty.Collection.prototype.getModelById = function(id) {
    var i = this.getModelIndexById(id);
	return this.models[i];
};

kitty.Collection.prototype.removeModelById = function(id) {
    var i = this.getModelIndexById(id);
    var model = this.models[i];
    this.models.splice(i, 1);
    return model;
};

