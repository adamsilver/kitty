/**
 * @namespace
 */
var Kitty = Kitty || {};

/**
 * Typical publish subscribe object
 * @class
 * @constructor
 */
Kitty.CustomEvent = function() {
  this.subscribers = [];
}

/**
 * Subscribe to an event
 * @param  {Function} fn The function that is called when the event is published
 * @return {[type]}      [description]
 */
Kitty.CustomEvent.prototype.subscribe = function(fn) {
  this.subscribers.push(fn);
}

Kitty.CustomEvent.prototype.unSubscribe = function(fn) {
  for(var i = 0; i < this.subscribers.length; i++) {
    if(this.subscribers[i] === fn) {
      this.subscribers.pop(i, 1);
      break;
    }
  }
}

Kitty.CustomEvent.prototype.publish = function() {
  for(var i = this.subscribers.length-1; i>=0; i--) {
    try {
      this.subscribers[i].apply(this, arguments);
    } catch (e) {}
  }
}