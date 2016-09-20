kitty.Dialog = function() {
    this.overlayContainer = $('<div class="dialogOverlay dialogOverlay-isHidden" />');
    this.body = $("body");
    this.container = $("<div class='dialog dialog-isOffScreen'/>");
    this.wrapper = $('<div class="dialog-wrapper">');
    this.content = $('<div class="dialog-content">');
    this.container.append(this.wrapper);
    this.wrapper.append(this.content);
    this.body.append(this.overlayContainer);
    this.body.append(this.container);
    this.createCloseButton();
};

kitty.Dialog.prototype.createCloseButton = function() {
    this.closeButton = $('<a href="#" class="dialog-close">Close</a>');
    this.wrapper.on('click', '.dialog-close', $.proxy(this, 'onCloseButtonClicked'));
    this.wrapper.append(this.closeButton);
};

kitty.Dialog.prototype.onCloseButtonClicked = function(e) {
    e.preventDefault();
    this.hide();
};

kitty.Dialog.prototype.setHtml = function(html) {
    this.container.html(html);
};

kitty.Dialog.prototype.setContent = function(html) {
    this.content.html(html);
};

kitty.Dialog.prototype.show = function(coordinates) {
    this.showOverlay();
    this.container.removeClass("dialog-isOffScreen");
    coordinates = coordinates || {};
    this.container.css({ top: coordinates.y || this.getTopPosition(), left: coordinates.x || this.getLeftPosition() });
};

kitty.Dialog.prototype.getTopPosition = function() {
    var windowHeight = $(window).height();
    var windowScrollTop = $(window).scrollTop();
    var dialogHeight = this.container.height();
    var y;
    if(windowHeight < dialogHeight) {
        y = windowScrollTop;
    } else {
        y = ((windowHeight+ - dialogHeight) / 2) + windowScrollTop;
    }
    return y;
};

kitty.Dialog.prototype.getLeftPosition = function() {
    var windowWidth = $(window).width();
    var windowScrollLeft = $(window).scrollLeft();
    var dialogWidth = this.container.width();
    var x;
    if(windowWidth < dialogWidth) {
        x = windowScrollLeft;
    } else {
        x = ((windowWidth+ - dialogWidth) / 2) + windowScrollLeft;
    }
    return x;
};

kitty.Dialog.prototype.hide = function() {
    this.container.addClass("dialog-isOffScreen");
    this.hideOverlay();
};

kitty.Dialog.prototype.destroy = function() {
    this.container.remove();
    this.overlayContainer.remove();
};

kitty.Dialog.prototype.showOverlay = function() {
	this.overlayContainer.removeClass('dialogWrapper-isHidden');
};
kitty.Dialog.prototype.hideOverlay = function() {
	this.overlayContainer.addClass('dialogWrapper-isHidden');
};