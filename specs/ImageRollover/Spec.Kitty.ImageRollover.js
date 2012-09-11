describe("Image Rollover", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var imageRollover = null;
	beforeEach(function() {
		jasmine.getFixtures().load('Spec.kitty.ImageRollover.Fixture1.html');
	});

	describe("Creating a new image rollover", function() {
		it("Preloads the new image into memory", function() {
			spyOn(window, "Image");
			var img = $("img");
			var imageRollover = new kitty.ImageRollover(img, "newImageSource");
			expect(imageRollover.preloadedImage instanceof window.Image).toBe(true);
			expect(window.Image).toHaveBeenCalled();
			expect(imageRollover.preloadedImage.src).toBe("newImageSource");
		});
	});

	describe("Mousing over the image", function() {
		it("Updates the source of the image to the new image source", function() {
			var img = $("img");
			var imageRollover = new kitty.ImageRollover(img, "newImageSource");
			img.trigger("mouseover");
			expect(img.attr("src")).toBe("newImageSource");
		});
	});

	describe("Mousing out of the image", function() {
		it("Updates the source of the image to the original image source", function() {
			var img = $("img");
			var originalSource = img.attr("src");
			var imageRollover = new kitty.ImageRollover(img, "newImageSource");
			img.trigger("mouseover");
			img.trigger("mouseout");
			expect(img.attr("src")).toBe(originalSource);
		});
	});

	describe("Destroying the image rollover", function() {
		it("Removes the events", function() {
			var img = $("img");
			var imageRollover = new kitty.ImageRollover(img, "newImageSource");
			imageRollover.destroy();
		});
	});
});
