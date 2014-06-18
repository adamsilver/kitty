kitty.TreeMenu = function(rootList) {
	rootList.find("ul").addClass("hide");
	rootList.find("a").on("click", $.proxy(this, "handleLink_onClick"));
};
kitty.TreeMenu.prototype.handleLink_onClick = function(e) {
	var list = $(e.target).parent().find("> ul");
	if (!list.length) {
		return true;
	}
	e.preventDefault();
	var hideClass = "hide";
	if (list.hasClass(hideClass)) {
		list.removeClass(hideClass);
	} else {
		list.addClass(hideClass);
		list.find("ul").addClass(hideClass);
	}
};