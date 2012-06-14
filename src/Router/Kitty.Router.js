var Kitty = Kitty || {};
Kitty.Router = function() {
	this.routes = {};

	var win = $(window);
  	win.hashchange($.proxy(this.handleHashChange, this));
  	win.hashchange();
}
Kitty.Router.prototype.getHash = function() {
	// strip '#'
	return document.location.hash.substr(1);
}
Kitty.Router.prototype.handleHashChange = function() {
	this.fireRoute(this.getHash());
}
Kitty.Router.prototype.fireRoute = function(url) {
	var matches, urlFound, routes = this.routes, route;
  for(var key in routes) {
    route = routes[key];
    matches = url.match(route.regex);
    if(matches) {
      urlFound = true;
      var params = this.getParamsFromRoute(route.route, url);
      for(var i = 0; i < route.callbacks.length; i++) {
        route.callbacks[i](params);
      }
    }
  }
}
Kitty.Router.prototype.route = function(route, callback) {
	this.routes[route] = {
		regex: this.createRegexForRoute(route),
		callbacks: [callback],
		route: route
	}
}
Kitty.Router.prototype.getParamsFromRoute = function(route, url) {
	var urlParams = {};
  var paramsMatcher = /:([\w\d]+)/g;
  paramsMatcher.lastIndex = 0; // ie bug - check out sammy
  var pathReplacer = "([^\/]+)";
  var queryStringMatcher = /\/?\?([^#]*)$/;
  
  // strip querystring but store key valued object ready to merge later
  // after we have converted the regular url params in an object
  var qs = url.match(queryStringMatcher);
  if(qs) {
    qs = qs[1];
    qs = $.unDelimit(qs);
  }
  else {
    qs = {};
  }

  route += "/?";
  url = url.replace(queryStringMatcher, '');

  var param_names = [], path_match, path = route, path_params;
  while ((path_match = paramsMatcher.exec(route)) !== null) {
    param_names.push(path_match[1]);
  }
  // replace with the path replacement
  path = new RegExp("^" + path.replace(paramsMatcher, pathReplacer) + "$");


  if ((path_params = path.exec(url)) !== null) {
    // dont want the first bit
    path_params.shift();
    // for each of the matches
    $.each(path_params, function(i, param) {
      // if theres a matching param name
      if (param_names[i]) {
        // set the name to the match
        urlParams[param_names[i]] = param;
      } else {
        // get splat code from sammy if/as you need it
      }
    });
  }
  
  return { urlParams: urlParams, queryStringParams: qs };
}
Kitty.Router.prototype.createRegexForRoute = function(route) {
	if(typeof route !== "string") return route;
  
  // replace last / with empty string i.e. remove final slash if present
  route = route.replace(/\/$/, "");

  // replace * with anything but a forward slash zero or more times
  route = route.replace('*', ".*");

  // replace : and any character but a slash with a matcher that matches any character but a slash one or more times
  route = route.replace(/([^\?]):[^\/]*/g, "$1([^\/]+)");

  //return regex
  return new RegExp("^" + route + "\/?(?:\\?(.*))?$");
}
