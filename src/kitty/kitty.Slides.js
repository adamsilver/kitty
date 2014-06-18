kitty.Slides = function(container, options) {
	this.container = container;
	this.options = $.extend({
		delay: 400
	}, options);
	this.items = container.find(".item");
	this.items.filter(":gt(0)").hide();
	this.currentIndex = 0;
	this.itemCount = this.items.length;
	this.startTimer();
	this.createPagination();
};
kitty.Slides.prototype.startTimer = function() {
	this.timer = window.setInterval($.proxy(this.showNextItem, this), this.options.delay);
};
kitty.Slides.prototype.stopTimer = function() {
	window.clearInterval(this.timer);
};
kitty.Slides.prototype.showNextItem = function() {
	var nextIndex = (this.currentIndex === (this.itemCount - 1)) ? 0 : this.currentIndex + 1;
	this.getItemAtIndex(this.currentIndex).hide();
	this.unHighlightPaginationLink(this.currentIndex);
	this.getItemAtIndex(nextIndex).show();
	this.highlightPaginationLink(nextIndex);
	this.currentIndex = nextIndex;
};
kitty.Slides.prototype.getItemAtIndex = function(index) {
	return this.items.filter(":eq(" + index + ")");
};
kitty.Slides.prototype.createPagination = function() {
	var paginationHtml = '<div class="pagination">';
	for (var i = 0; i < this.items.length; i++) {
		paginationHtml += '<a href="#">' + (i + 1) + '</a>';
	}
	paginationHtml += '</div>';
	this.container.prepend(paginationHtml);
	this.paginationLinks = this.container.find(".pagination a");
	this.paginationLinks.bind("click", $.proxy(this, "handlePaginationLink_onClick"));
	this.highlightPaginationLink(0);
};
kitty.Slides.prototype.handlePaginationLink_onClick = function(e) {
	e.preventDefault();
	this.stopTimer();
	var target = $(e.target);
	var index = this.paginationLinks.index(target);
	this.getItemAtIndex(this.currentIndex).hide();
	this.unHighlightPaginationLink(this.currentIndex);
	this.getItemAtIndex(index).show();
	this.highlightPaginationLink(index);
	this.currentIndex = index;
	this.startTimer();
};
kitty.Slides.prototype.highlightPaginationLink = function(index) {
	this.paginationLinks.filter(":eq(" + index + ")").addClass("selected");
};
kitty.Slides.prototype.unHighlightPaginationLink = function(index) {
	this.paginationLinks.filter(":eq(" + index + ")").removeClass("selected");
};