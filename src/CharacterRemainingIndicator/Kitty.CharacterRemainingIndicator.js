var Kitty = Kitty || {};

Kitty.CharacterRemainingIndicator = function(field, options) {
  this.field = field;
  if(!this.checkValidField(field)) {
    throw "Provide a valid input.";
  }
  this.options = {
    maxLength: 100,
    textBefore: "You have ",
    textAfter: " characters remaining.",
    indicator: $("<div class='indicator'/>")
  }
  
  this.options = $.extend(this.options, options);
  
  this.options.indicator.html(this.options.textBefore + this.options.maxLength + this.options.textAfter);
  
  if(!options || !options.indicator) {
    $(this.field).parent().append(this.options.indicator);
  }
  
  $(this.field).bind("change keypress keydown", $.proxy(this.handleField_onChange, this));
  
}

Kitty.CharacterRemainingIndicator.prototype.checkValidField = function(field) {
  if(!field || !field.tagName) {
    return false;
  }
  if(field.tagName.toLowerCase() !== "textarea" && field.tagName.toLowerCase() !== "input") {
    return false;
  }
  if(field.tagName.toLowerCase() === "input" && (field.type !== "password" && field.type !== "text") ) {
    return false;
  }
  return true;
}

Kitty.CharacterRemainingIndicator.prototype.handleField_onChange = function(e) {
  var remainingCharacterCount = this.options.maxLength - this.field.value.length;
  this.setIndicator(remainingCharacterCount);
}

Kitty.CharacterRemainingIndicator.prototype.setIndicator = function(remainingCharacterCount) {
  this.options.indicator.html(this.options.textBefore + remainingCharacterCount + this.options.textAfter);
}