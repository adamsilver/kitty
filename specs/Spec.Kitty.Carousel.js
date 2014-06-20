describe("Carousel", function() {

	var fixture;
	var originalHtml;
	var $carousel = null;

	beforeEach(function() {
		fixture = $("#fixture2");
		originalHtml = fixture.html();
		$carousel = fixture.find(".carousel");
	});

	afterEach(function() {
		fixture.html(originalHtml);
	});

	describe("Creating a new carousel", function() {
		it("Sets the width of the UL to the total size of all the LI elements.", function() {
			var carousel = new kitty.Carousel($carousel);
			var length = $carousel.find("li.item").length;
			var width = $carousel.find("li.item").width();
			var totalWidth = width * length;
			expect($carousel.find("ul.items").width()).toBe(totalWidth);
		});
	});


	xdescribe("Moving the carousel backwards", function() {
		it("Moves the carousel backwards.", function(done) {
			var carousel = new kitty.Carousel($carousel);
			carousel.moveBackwards();
			waits(450);
			runs(function() {
				expect(carousel.ul.css("left")).toBe("-200px");
				carousel.moveBackwards();
				waits(450);
				runs(function() {
					expect(carousel.ul.css("left")).toBe("-400px");
				});
			});
		});
	});

	xdescribe("Moving the carousel forwards", function() {
		it("Moves the carousel forwards.", function() {
			var carousel = new kitty.Carousel($carousel);
			carousel.moveForwards();
			waits(450);
			runs(function() {
				expect(carousel.ul.css("left")).toBe("200px");
				carousel.moveForwards();
				waits(450);
				runs(function() {
					expect(carousel.ul.css("left")).toBe("400px");
				});
			});
		});
	});

	describe("Destroying a carousel", function() {
		it("Restores the carousel to it's original size", function() {
			var ulOriginalWidth = $("div.carousel ul").width();
			var carousel = new kitty.Carousel($carousel);
			carousel.destroy();
			expect($carousel.find("ul.items").width()).toBe(ulOriginalWidth);
		});
	});

});