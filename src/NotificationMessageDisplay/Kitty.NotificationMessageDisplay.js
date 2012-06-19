var Kitty = Kitty || {};
Kitty.NotificationMessageDisplay = function(container) {
	this.container = container;
};
Kitty.NotificationMessageDisplay.Notification = function(message) {
	this.startTimer();
	this.message = $('<div class="notification">'+message+'</div>');
	this.closeButton = $('<a class="close" href="#">Close</a>');
	this.message.prepend(this.closeButton);
	this.closeButton.on("click", $.proxy(this, "handleCloseButton_onClick"));
	this.message.on("mouseover", $.proxy(this, "handleMessage_onMouseover"));
	this.message.on("mouseout", $.proxy(this, "handleMessage_onMouseout"));
};
Kitty.NotificationMessageDisplay.Notification.prototype.handleCloseButton_onClick = function(e) {
	e.preventDefault();
	this.closeNotification();
};
Kitty.NotificationMessageDisplay.Notification.prototype.handleMessage_onMouseover = function(e) {
	window.clearTimeout(this.timer);
};
Kitty.NotificationMessageDisplay.Notification.prototype.handleMessage_onMouseout = function(e) {
	this.startTimer();
};
Kitty.NotificationMessageDisplay.Notification.prototype.startTimer = function(e) {
	this.timer = window.setTimeout($.proxy(this, "closeNotification"), 3000);
};
Kitty.NotificationMessageDisplay.Notification.prototype.closeNotification = function() {
	this.message.remove();
};
Kitty.NotificationMessageDisplay.prototype.createNotification = function(message) {
	this.container.append(new Kitty.NotificationMessageDisplay.Notification(message).message);
};