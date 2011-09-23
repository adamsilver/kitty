var Kitty = Kitty || {};

Kitty.CheckboxDisabler = function(checkboxes, limit) {
  this.checkboxes = checkboxes;
  this.limit = limit;
  $(this.checkboxes).bind("change", $.proxy(this.handleCheckbox_onChange, this));
  this.checkState();
}

Kitty.CheckboxDisabler.prototype.handleCheckbox_onChange = function(e) {
  this.checkState();
}

Kitty.CheckboxDisabler.prototype.checkState = function() {
  var checkboxesChecked = 0;
  for(var i = 0; i < this.checkboxes.length; i++) {
    if(this.checkboxes[i].checked) {
      checkboxesChecked++;
    }
  }
  
  if(checkboxesChecked === this.limit) {
    this.disableRemaining();
  }
  else {
    this.enableRemaining();
  }
}

Kitty.CheckboxDisabler.prototype.disableRemaining = function() {
  for(var i = 0; i < this.checkboxes.length; i++) {
    if(!this.checkboxes[i].checked) {
      $(this.checkboxes[i]).attr("disabled", true);
    }
  }
}

Kitty.CheckboxDisabler.prototype.enableRemaining = function() {
  for(var i = 0; i < this.checkboxes.length; i++) {
    this.checkboxes[i].disabled = false
  }
}

Kitty.CheckboxDisabler.prototype.teardown = function() {
  $(this.checkboxes).unbind("change", this.handleCheckbox_onChange);
}