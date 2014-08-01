kitty.ImageLabelFixer = function(img) {
	this.img = img;
	this.img.on("click", $.proxy(this, "onImageClicked"));
};
kitty.ImageLabelFixer.prototype.onImageClicked = function(e) {
	var relatedElement = $("#" + this.img.parents("label").attr("for"));
	switch (relatedElement[0].tagName.toLowerCase()) {
		case "textarea":
		case "select":
			relatedElement.trigger("focus");
			break;
		case "input":
			switch (relatedElement[0].type.toLowerCase()) {
				case "text":
				case "password":
					relatedElement.trigger("focus");
					break;
				case "radio":
                    relatedElement[0].checked = true;
                    break;
				case "checkbox":
					if (relatedElement[0].checked) {
                        relatedElement[0].checked = false;
					} else {
                        relatedElement[0].checked = true;
					}
					break;
			}
	}
};