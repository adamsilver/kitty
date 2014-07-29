kitty.inherit = function(Sub, Super) {
	Sub.prototype = kitty.cloneObject(Super.prototype);
	Sub.superConstructor = Super;
	Sub.prototype.constructor = Sub;
};