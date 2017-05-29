kitty.ResponsiveListener = function(options) {
    kitty.ResponsiveListener.superConstructor.call(this);
    this.options = options || {};
    this.options.smallSize = this.options.smallSize || 600;
    this.smallModeEnabled = false;
    $(window).on('resize', $.debounce(1, $.proxy(this, 'onWindowResized')));
};

kitty.inherit(kitty.ResponsiveListener, kitty.EventEmitter);

kitty.ResponsiveListener.prototype.onWindowResized = function(e) {
    this.checkMode();
};

kitty.ResponsiveListener.prototype.checkMode = function() {
    var width = window.innerWidth;

    if(width <= this.options.smallSize) {
        // must check this as some devices fire resize event on scroll
        if(!this.smallModeEnabled) {
            this.enableSmallMode();
        }
    } else {
        if(this.smallModeEnabled) {
            this.disableSmallMode();
        }
    }
};

kitty.ResponsiveListener.prototype.enableSmallMode = function() {
    this.smallModeEnabled = true;
    this.fire('smallModeEnabled');
};

kitty.ResponsiveListener.prototype.disableSmallMode = function() {
    this.smallModeEnabled = false;
    this.fire('smallModeDisabled');
};

kitty.ResponsiveListener.prototype.isSmalledModeEnabled = function() {
    return this.smallModeEnabled;
};