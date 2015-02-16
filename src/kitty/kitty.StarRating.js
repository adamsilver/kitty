kitty.StarRating = function(container) {
	this.container = container;
	this.radios = this.container.find(".radio input");
	this.container.addClass("enhanced");
	this.labels = this.container.find("label");
	this.currentRating = this.radios.filter(":checked").val() || null;
	if (this.currentRating) {
		this.highlightStars(this.currentRating);
	}
	this.addEvents();
};

kitty.StarRating.prototype.getCurrentRating = function() {
	return this.currentRating;
};

kitty.StarRating.prototype.addEvents = function() {
	this.labels.on("mouseover", $.proxy(this, "onLabelMouseover"));
	this.labels.on("mouseout", $.proxy(this, "onLabelMouseout"));
	this.radios.on("focus", $.proxy(this, "onRadioFocussed"));
	this.radios.on("blur", $.proxy(this, "onRadioBlurred"));
	this.radios.on("change", $.proxy(this, "onRadioChanged"));
};

kitty.StarRating.prototype.removeEvents = function() {
	this.labels.off("mouseover", this.onLabelMouseover);
	this.labels.off("mouseout", this.onLabelMouseout);
	this.radios.off("focus", this.onRadioFocussed);
	this.radios.off("blur", this.onRadioBlurred);
	this.radios.off("change", this.onRadioChanged);
};

kitty.StarRating.prototype.onLabelMouseover = function(e) {
	var relatedRadio = $(e.target).parents(".radio").find("input[type=radio]");
	var rating = relatedRadio.val();
	this.highlightStars(rating);
};

kitty.StarRating.prototype.onLabelMouseout = function(e) {
	this.highlightStars(this.currentRating);
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

kitty.StarRating.prototype.onRadioFocussed = function(e) {
	this.highlightStars($(e.target).val());
};

kitty.StarRating.prototype.onRadioBlurred = function(e) {
	this.highlightStars(0);
};

kitty.StarRating.prototype.onRadioChanged = function(e) {
	this.currentRating = $(e.target).val();
	this.highlightStars(this.currentRating);
};

kitty.StarRating.prototype.destroy = function() {
	this.container.removeClass("enhanced");
	this.removeEvents();
};