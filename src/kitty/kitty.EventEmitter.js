kitty.EventEmitter = function() {
	this.events = {};
};

kitty.EventEmitter.prototype.on = function(eventName, fn, context) {
	if(!this.events[eventName]) {
		this.events[eventName] = {
			subscribers: []
		};
	}
	this.events[eventName].subscribers.push({
		fn: fn,
		context: context || null
	});
};

kitty.EventEmitter.prototype.fire = function(eventName) {
	var subscribers;
	if(!this.events[eventName]) {
		return;
	}
	subscribers = this.events[eventName].subscribers;

	var argumentsExceptFirst = Array.prototype.slice.call(arguments, 1);

	for (var i = subscribers.length - 1; i >= 0; i--) {
		try {
			subscribers[i].fn.apply(subscribers[i].context, argumentsExceptFirst);
		} catch (e) {}
	}
};