var Kitty = Kitty || {};
Kitty.ImageLabelFixer = function(img) {
	this.img = img;
	this.img.bind("click", $.proxy(this, "handleImg_onClick"));
}
Kitty.ImageLabelFixer.prototype.handleImg_onClick = function(e) {
	var relatedElement = $("#"+this.img.parents("label").attr("for"));
	if(relatedElement[0].checked) {
		relatedElement.prop("checked", false);
	}
	else {
		relatedElement.prop("checked", true);
	}
}