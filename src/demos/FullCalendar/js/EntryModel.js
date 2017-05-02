function EntryModel() {
	EntryModel.superConstructor.apply(this, arguments);
}

kitty.inherit(EntryModel, kitty.Model);

EntryModel.prototype.getDuration = function() {
	return this.getAttribute('duration');
};