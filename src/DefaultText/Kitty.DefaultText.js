var Kitty = Kitty || {};

Kitty.DefaultText = function(input) {
  if(!input) {
    throw "Provide an input.";
  }
  this.input = input;
  
  input.bind("focus", $.proxy(this.handleInput_onFocus));
  input.bind("blur", $.proxy(this.handleInput_onBlur));
};

Kitty.DefaultText.prototype.handleInput_onFocus = function(e) {
  $(e.target).val("");
};

Kitty.DefaultText.prototype.handleInput_onBlur = function(e) {
  var input = $(e.target);
  var defaultValue = input.prop("defaultValue");
  var newValue = input.val();
  if(newValue === "") {
    input.val(defaultValue);
  }
};

Kitty.DefaultText.prototype.teardown = function() {
  this.input.unbind("focus");
  this.input.unbind("blur");
};