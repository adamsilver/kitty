var kitty = kitty || {};

kitty.FieldHighlighter = function(field) {
  this.field = field;
  this.field.bind("focus", $.proxy(this.handleFocus, this));
  this.field.bind("blur", $.proxy(this.handleBlur, this));
};

kitty.FieldHighlighter.prototype.handleFocus = function(e) {
  this.field.addClass("highlight");
};

kitty.FieldHighlighter.prototype.handleBlur = function(e) {
  this.field.removeClass("highlight");
};

kitty.FieldHighlighter.prototype.teardown = function() {
 this.field.unbind("focus", this.handleFocus);
 this.field.unbind("blur", this.handleBlur);
};