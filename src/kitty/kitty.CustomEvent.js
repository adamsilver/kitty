/**
 * @namespace
 */

/**
 * Typical publish subscribe object
 * @class
 * @constructor
 */
kitty.CustomEvent = function() {
	this.subscribers = [];
}

/**
 * Subscribe to an event
 * @param  {Function} fn The function that is called when the event is published
 * @return {[type]}      [description]
 */
kitty.CustomEvent.prototype.subscribe = function(fn) {
	this.subscribers.push(fn);
}

kitty.CustomEvent.prototype.unSubscribe = function(fn) {
	for (var i = 0; i < this.subscribers.length; i++) {
		if (this.subscribers[i] === fn) {
			this.subscribers.pop(i, 1);
			break;
		}
	}
}

kitty.CustomEvent.prototype.publish = function() {
	for (var i = this.subscribers.length - 1; i >= 0; i--) {
		try {
			this.subscribers[i].apply(this, arguments);
		} catch (e) {}
	}
}