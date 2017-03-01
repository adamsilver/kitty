function ErrorSummary() {
    this.container = $(".errorSummary");
    this.container.on('click', 'a', $.proxy(this, 'onErrorClicked'));
}

ErrorSummary.prototype.onErrorClicked = function(e) {
    e.preventDefault();
    var href = e.target.href;
    href = href.substring(href.indexOf("#")+1, href.length);
    document.getElementById(href).focus();
};

ErrorSummary.prototype.showErrors = function (errors) {
    this.container.html(this.getErrorHtml(errors));
    this.container.removeClass('errorSummary-isHidden');
    this.container.find('h2')[0].focus();
};

ErrorSummary.prototype.getErrorHtml = function(errors) {
    var html = '<h2 tabindex="-1">You have ' + errors.length + ' errors</h2>';
    html += '<ul>';
    for (var i = 0, j = errors.length; i < j; i++) {
        var error = errors[i];
        html += '<li>';
        html +=		'<a href="#' + error.fieldName + '">';
        html +=			error.message;
        html +=		'</a>';
        html +=	'</li>';
    }
    html += '</ul>';
    return html;
};

ErrorSummary.prototype.hideErrors = function() {
    this.container.addClass('errorSummary-isHidden');
};