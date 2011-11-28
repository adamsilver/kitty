describe("Kitty.Router", function() {
	
	function changeLocation(newLocation) {
		document.location.hash = newLocation;
	}

	describe("Reacting to a particular route", function() {
		it("Fires the callback with url params", function() {
			var callback = jasmine.createSpy();
			var router = new Kitty.Router();
			router.route("/some/path/:some_param/", callback);

			changeLocation("/some/path/123/");
			
			expect(callback).toHaveBeenCalled();
			expect(callback.mostRecentCall.args[0].urlParams.some_param).toBe("123");
		});

		it("Fires callback with query string params", function() {
			var callback = jasmine.createSpy();
			var router = new Kitty.Router();
			router.route("/some/path/?some_qs_param", callback);
			changeLocation("/some/path/?some_qs_param=woop");
			
			expect(callback).toHaveBeenCalled();
			expect(callback.mostRecentCall.args[0].queryStringParams.some_qs_param).toBe("woop");
		});
	});

});