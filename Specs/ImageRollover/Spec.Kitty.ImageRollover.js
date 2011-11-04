describe("Image Rollover", function() {

	describe("Creating a new image rollover", function() {
		it("Preloads the new image into memory", function() {
			spyOn(window, "Image");
			var img = $("img");
			var imageRollover = new Kitty.ImageRollover(img, "newImageSource");
			expect(imageRollover.preloadedImage instanceof window.Image).toBe(true);
			expect(window.Image).toHaveBeenCalled();
			expect(imageRollover.preloadedImage.src).toBe("newImageSource");
		});
	});

	describe("Mousing over the image", function() {
		it("Updates the source of the image to the new image source", function() {
			
		});
	});

	describe("Mousing out of the image", function() {
		it("Updates the source of the image to the original image source", function() {
			
		});
	});

	describe("Destroying the image rollover", function() {
		it("Removes the events", function() {
			var imageRollover = new Kitty.ImageRollover(img, "newImageSource");
			imageRollover.destroy();
		});
	});
});
