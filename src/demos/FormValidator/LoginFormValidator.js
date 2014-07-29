function LoginFormValidator(form, options) {
	LoginFormValidator.superConstructor.apply(this, arguments);
	this.setupValidators();
}

kitty.inherit(LoginFormValidator, DemoFormValidator);

DemoFormValidator.prototype.setupValidators = function() {
	this.addValidator("username", [
		{ message: "Username cannot be empty", method: kitty.validators.notEmpty }
	]);
	this.addValidator("password", [
		{
			message: "Password cannot be empty", method: kitty.validators.notEmpty
		},
		{
			message: "Password must contain 8 characters", method: kitty.validators.minLength, params: { minLength: 8 }
		}
	]);
	this.addValidator("colour", [
		{
			message: "Must choose a colour",
			method: function(controls) {
				var valid = false;
				for(var i = 0; i < controls.length; i++) {
					if(controls[i].checked) {
						valid = true;
						break;
					}
				}
				return valid;
			}
		}
	])
};