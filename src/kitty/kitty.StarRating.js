kitty.StarRatingControl = function(container) {
	this.container = container;
	this.radioControls = this.container.find(".radioControl");
	this.container.addClass("enhanced");
	this.labels = this.container.find("label");
	this.currentRating = this.getInitialRating();
	if (this.currentRating) {
		this.highlightStars(this.currentRating);
	}
	this.addEvents();
};

kitty.StarRatingControl.prototype.getInitialRating = function() {
	return this.radioControls.filter(":checked").val() || null;
};

kitty.StarRatingControl.prototype.addEvents = function() {
	this.container.on("mouseenter", "label", $.proxy(this, "onLabelMouseEntered"));
	this.container.on("mouseleave", "label", $.proxy(this, "onLabelMouseLeft"));
	this.container.on("focus", "", $.proxy(this, "onRadioFocussed"));
	this.container.on("blur", "", $.proxy(this, "onRadioBlurred"));
	this.container.on("change", "", $.proxy(this, "onRadioChanged"));
};

kitty.StarRatingControl.prototype.onLabelMouseEntered = function(e) {
	var radio = this.getRelatedRadioByLabel(e.currentTarget);
	this.highlightStars(radio.value);
};

kitty.StarRatingControl.prototype.getRelatedRadioByLabel = function(label) {
	var radioId = label.htmlFor;
	return document.getElementById(radioId);
};

kitty.StarRatingControl.prototype.onLabelMouseLeft = function(e) {
	this.highlightStars(this.currentRating);
};

kitty.StarRatingControl.prototype.highlightStars = function(rating) {
	rating = parseInt(rating, 10) - 1;
	for (var i = 0; i < this.labels.length; i++) {
		if (rating >= i) {
			this.labels.filter(":eq(" + i + ")").addClass("highlight");
		} else {
			this.labels.filter(":eq(" + i + ")").removeClass("highlight");
		}
	}
};

kitty.StarRatingControl.prototype.onRadioFocussed = function(e) {
	this.highlightStars($(e.target).val());
};

kitty.StarRatingControl.prototype.onRadioBlurred = function(e) {
	this.highlightStars(this.currentRating);
};

kitty.StarRatingControl.prototype.onRadioChanged = function(e) {
	this.currentRating = $(e.target).val();
	this.highlightStars(this.currentRating);
};