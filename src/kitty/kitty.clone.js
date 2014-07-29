if(Object.create) {
	kitty.cloneObject = function(o) {
		return Object.create(o);
	};
} else {
	kitty.cloneObject = (function() {
		var Fn = function() {};

		return function(o) {
			Fn.prototype = o;
			return new Fn();
		};
	})();
}