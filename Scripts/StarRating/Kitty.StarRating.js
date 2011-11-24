var Kitty = Kitty || {};
Kitty.StarRating = function(radioContainers) {
	this.radios = radioContainers.find("input[type=radio]");
	this.radios.addClass("offScreen");
	this.currentRating = this.radios.filter(":checked").val();
	this.labels = radioContainers.find("label");
	this.labels.on("mouseover", $.proxy(this, "handleLabel_onMouseover"));
}
Kitty.StarRating.prototype.handleLabel_onMouseover = function(e) {
	var relatedRadio = $(e.target).parent().find("input[type=radio]");
	var rating = relatedRadio.val();
	this.highlightStars(rating);
}
Kitty.StarRating.prototype.highlightStars = function(rating) {
	for(var i = 0; i < this.labels.length; i++) {
		if(rating > i) {
			this.labels.filter(":eq("+i+")").addClass("highlight");
		}
		else {
			this.labels.filter(":eq("+i+")").removeClass("highlight");
		}
		
	}
}