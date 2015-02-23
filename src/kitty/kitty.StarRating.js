kitty.StarRating = function(container) {
	this.container = container;
	this.radios = this.container.find(".radioControl");
	this.container.addClass("enhanced");
	this.labels = this.container.find("label");
	this.currentRating = this.getInitialRating();
	if (this.currentRating) {
		this.highlightStars(this.currentRating);
	}
	this.addEvents();
};

kitty.StarRating.prototype.getInitialRating = function() {
	return this.radios.filter(":checked").val() || null;
};

kitty.StarRating.prototype.addEvents = function() {
	this.container.on("mouseenter", "label", $.proxy(this, "onLabelMouseEntered"));
	this.container.on("mouseleave", "label", $.proxy(this, "onLabelMouseLeft"));
	this.container.on("focus", "", $.proxy(this, "onRadioFocussed"));
	this.container.on("blur", "", $.proxy(this, "onRadioBlurred"));
	this.container.on("change", "", $.proxy(this, "onRadioChanged"));
};

kitty.StarRating.prototype.onLabelMouseEntered = function(e) {
	var radio = this.getRelatedRadioByLabel(e.currentTarget);
	this.highlightStars(radio.value);
};

kitty.StarRating.prototype.getRelatedRadioByLabel = function(label) {
	var radioId = label.htmlFor;
	return document.getElementById(radioId);
};

kitty.StarRating.prototype.onLabelMouseLeft = function(e) {
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
	this.highlightStars(this.currentRating);
};

kitty.StarRating.prototype.onRadioChanged = function(e) {
	this.currentRating = $(e.target).val();
	this.highlightStars(this.currentRating);
};