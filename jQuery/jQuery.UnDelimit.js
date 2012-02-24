(function( $ ){

  $.unDelimit = function(str, delimiters) {
    var delimeters = delimeters || ["&", "="];
    if (delimeters.length === 1) {
      return str.split(delimeters[0]);
    }
    var items = str.split(delimeters[0]),
        o = {},
        i = 0,
        j = items.length,
        subItem;
    for (i; i<j; i++) {
      subItem = items[i].split(delimeters[1]);
      subItem[1] = subItem[1] || "";
      if (o[subItem[0]]) {
        if ($.isArray(o[subItem[0]])) {
          o[subItem[0]].push(subItem[1]);
        } else {
          o[subItem[0]] = [o[subItem[0]], subItem[1]];
        }
      } else {
        o[subItem[0]] = subItem[1];
      }
    }
    return o;
  };
})( jQuery );