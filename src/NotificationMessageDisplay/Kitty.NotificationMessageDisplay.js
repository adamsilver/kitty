var kitty = kitty || {};
kitty.NotificationMessageDisplay = function(container) {
	this.container = container;
};
kitty.NotificationMessageDisplay.Notification = function(message) {
	this.startTimer();
	this.message = $('<div class="notification">'+message+'</div>');
	this.closeButton = $('<a class="close" href="#">Close</a>');
	this.message.prepend(this.closeButton);
	this.closeButton.on("click", $.proxy(this, "handleCloseButton_onClick"));
	this.message.on("mouseover", $.proxy(this, "handleMessage_onMouseover"));
	this.message.on("mouseout", $.proxy(this, "handleMessage_onMouseout"));
};
kitty.NotificationMessageDisplay.Notification.prototype.handleCloseButton_onClick = function(e) {
	e.preventDefault();
	this.closeNotification();
};
kitty.NotificationMessageDisplay.Notification.prototype.handleMessage_onMouseover = function(e) {
	window.clearTimeout(this.timer);
};
kitty.NotificationMessageDisplay.Notification.prototype.handleMessage_onMouseout = function(e) {
	this.startTimer();
};
kitty.NotificationMessageDisplay.Notification.prototype.startTimer = function(e) {
	this.timer = window.setTimeout($.proxy(this, "closeNotification"), 3000);
};
kitty.NotificationMessageDisplay.Notification.prototype.closeNotification = function() {
	this.message.remove();
};
kitty.NotificationMessageDisplay.prototype.createNotification = function(message) {
	this.container.append(new kitty.NotificationMessageDisplay.Notification(message).message);
};