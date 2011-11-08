var Kitty = Kitty || {};
Kitty.TreeMenu = function(rootList) {
	rootList.find("ul").addClass("hide");
	rootList.find("a").on("click", $.proxy(this, "handleLink_onClick"));
}
Kitty.TreeMenu.prototype.handleLink_onClick = function(e) {
	e.preventDefault();

	var hideClass = "hide";

	var list = $(e.target).parent().find("ul");
	if(list.hasClass(hideClass)) {
		list.removeClass(hideClass);
	}
	else {
		list.addClass(hideClass);
	}
}