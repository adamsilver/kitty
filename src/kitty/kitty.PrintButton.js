kitty.PrintButton = function(container, options) {
	this.options = options || {};
	this.options.text = this.options.text || "Print";
	this.link = $('<a class="printButton" href="#">' + this.options.text + '</a>');
	container.html(this.link);
	this.link.bind("click", $.proxy(this.handleLink_onClick, this));
};
kitty.PrintButton.prototype.handleLink_onClick = function(e) {
	e.preventDefault();
	window.print();
};