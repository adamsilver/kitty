kitty.StarRating = function(radioContainers) {
	this.radios = radioContainers.find("input[type=radio]");
	this.radios.addClass("offScreen");
	this.currentRating = this.radios.filter(":checked").val() || null;
	this.labels = radioContainers.find("label");
	this.addEvents();
	if (this.currentRating) {
		this.highlightStars(this.currentRating);
	}
};
kitty.StarRating.prototype.addEvents = function() {
	this.labels.on("mouseover", $.proxy(this, "handleLabel_onMouseover"));
	this.labels.on("mouseout", $.proxy(this, "handleLabel_onMouseout"));
	this.radios.on("focus", $.proxy(this, "handleRadio_onFocus"));
	this.radios.on("blur", $.proxy(this, "handleRadio_onBlur"));
	this.radios.on("change", $.proxy(this, "handleRadio_onChange"));
};
kitty.StarRating.prototype.removeEvents = function() {
	this.labels.off("mouseover", this.handleLabel_onMouseover);
	this.labels.off("mouseout", this.handleLabel_onMouseout);
	this.radios.off("focus", this.handleRadio_onFocus);
	this.radios.off("blur", this.handleRadio_onBlur);
	this.radios.off("change", this.handleRadio_onChange);
};
kitty.StarRating.prototype.handleLabel_onMouseover = function(e) {
	var relatedRadio = $(e.target).parents(".radio").find("input[type=radio]");
	var rating = relatedRadio.val();
	this.highlightStars(rating);
};
kitty.StarRating.prototype.highlightStars = function(rating) {
	rating = parseInt(rating, 10) - 1;
	for (var i = 0; i < this.labels.length; i++) {
		if (rating >= i) {
			this.labels.filter(":eq(" + i + ")").addClass("highlight");
		} else {
			this.labels.filter(":eq(" + i + ")").removeClass("highlight");
		}
	}
};
kitty.StarRating.prototype.handleRadio_onFocus = function(e) {
	this.highlightStars($(e.target).val());
};
kitty.StarRating.prototype.handleLabel_onMouseout = function(e) {
	this.highlightStars(this.currentRating);
};
kitty.StarRating.prototype.handleRadio_onBlur = function(e) {
	this.highlightStars(0);
};
kitty.StarRating.prototype.handleRadio_onChange = function(e) {
	this.currentRating = $(e.target).val();
	this.highlightStars(this.currentRating);
};
kitty.StarRating.prototype.destroy = function() {
	this.radios.removeClass("offScreen");
	this.removeEvents();
};