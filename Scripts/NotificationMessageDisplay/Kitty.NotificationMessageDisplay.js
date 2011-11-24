var Kitty = Kitty || {};
Kitty.NotificationMessageDisplay = function(container) {
	this.container = container;
}
Kitty.NotificationMessageDisplay.Notification = function(message) {
	this.timer = window.setTimeout($.proxy(this, "closeNotification"), 3000);
	this.message = $('<div class="notification">'+message+'</div>');
	this.closeButton = $('<a class="close" href="#">Close</a>');
	this.message.prepend(this.closeButton);
	this.closeButton.on("click", $.proxy(this, "handleCloseButton_onClick"));
}
Kitty.NotificationMessageDisplay.Notification.prototype.handleCloseButton_onClick = function(e) {
	e.preventDefault();
	this.closeNotification();
}
Kitty.NotificationMessageDisplay.Notification.prototype.closeNotification = function() {
	this.message.remove();
}
Kitty.NotificationMessageDisplay.prototype.createNotification = function(message) {
	this.container.append(new Kitty.NotificationMessageDisplay.Notification(message).message);
}
