kitty.PasswordReveal = function(el) {
    this.el = el;
    this.passwordControl = $(el);
    this.showingPassword = false;
    this.createButton();
};

kitty.PasswordReveal.prototype.createButton = function() {
    this.button = $('<button>'+this.showText+'</button>');
    this.passwordControl.parent().append(this.button);
    this.button.on('click', $.proxy(this, 'onButtonClicked'));
};

kitty.PasswordReveal.prototype.onButtonClicked = function(e) {
    e.preventDefault();
    if(this.showingPassword) {
        this.hidePassword();
    } else {
        this.showPassword();
    }
};

kitty.PasswordReveal.prototype.showPassword = function() {
    this.el.type = 'text';
    this.showingPassword = true;
    this.button.text('Hide password');
};

kitty.PasswordReveal.prototype.hidePassword = function() {
    this.el.type = 'password';
    this.showingPassword = false;
    this.button.text('Show password');
};