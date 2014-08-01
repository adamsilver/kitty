describe("ListCollapser", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var container = null;
	var listItems = null;
	var listCollapser = null;

	function getItem(index) {
		return listItems.filter(":eq(" + index + ")");
	}

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.kitty.ListCollapser.Fixture1.html');
		container = $("#listContainer");
		listItems = container.find("li");
	});

	describe("Creating a new list collapser", function() {

		beforeEach(function() {
			listCollapser = new kitty.ListCollapser(container);
		});

		describe("With default options", function() {
			it("creates a toggle button", function() {
				expect(container).toContain("a.toggleItems");
				expect(container.find("a.toggleItems")).toHaveText(listCollapser.options.expandText);
			});

			it("has default expand text", function() {
				expect(listCollapser.options.expandText).toBe("Expand");
			});

			it("has default collapse text", function() {
				expect(listCollapser.options.collapseText).toBe("Collapse");
			});

			it("collapses the list items after the default collapseAfter property", function() {
				var defaultCollapseAfter = listCollapser.options.collapseAfter;
				expect(getItem(defaultCollapseAfter)).toBeVisible();

				for (var i = defaultCollapseAfter + 1; i < listItems.length; i++) {
					expect(getItem(i)).not.toBeVisible();
				}
			});

		});

		describe("With custom options", function() {

			beforeEach(function() {
				listCollapser = new kitty.ListCollapser(container, {
					collapseAfter: 5,
					expandText: "Expand woop",
					collapseText: "Collapse woop"
				});
			});

			it("overrides collapseAfter", function() {
				expect(listCollapser.options.collapseAfter).toBe(5);
			});
			it("overrides expandText", function() {
				expect(listCollapser.options.expandText).toBe("Expand woop");
			});
			it("overrides collapseText", function() {
				expect(listCollapser.options.collapseText).toBe("Collapse woop");
			});

		});

	});

	describe("Toggling the list", function() {

		beforeEach(function() {
			listCollapser = new kitty.ListCollapser(container, {
				collapseAfter: 4
			});
		});

		it("prevents the default action", function() {
			var fakeEvent = {
				preventDefault: function() {}
			};
			spyOn(fakeEvent, "preventDefault");
			listCollapser.handleToggleButton_onClick(fakeEvent);
			expect(fakeEvent.preventDefault).toHaveBeenCalled();
		});

		describe("That is collapsed", function() {
			beforeEach(function() {
				container.find("a.toggleItems").trigger("click");
			});
			it("expands the list", function() {
				expect(getItem(5)).toBeVisible();
				expect(getItem(6)).toBeVisible();
				expect(getItem(7)).toBeVisible();
			});
			it("updates the toggle button text", function() {
				expect(container.find("a.toggleItems")).toHaveText(listCollapser.options.collapseText);
			})
		});

		describe("That is expanded", function() {
			beforeEach(function() {
				container.find("a.toggleItems").trigger("click");
				container.find("a.toggleItems").trigger("click");
			});
			it("collapses the list", function() {
				expect(getItem(5)).not.toBeVisible();
				expect(getItem(6)).not.toBeVisible();
				expect(getItem(7)).not.toBeVisible();
			});
			it("updates the toggle button text", function() {
				expect(container.find("a.toggleItems")).toHaveText(listCollapser.options.expandText);
			});
		});

	});

	describe("Destroying the list collapser", function() {

		beforeEach(function() {
			listCollapser = new kitty.ListCollapser(container);
			listCollapser.destroy();
		});

		it("displays all list items", function() {
			var listItems = container.find("li");
			for (var i = 0; i < listItems.length; i++) {
				expect(listItems.filter(":eq(" + i + ")")).toBeVisible();
			}
		});

		it("removes the toggle button", function() {
			expect(container.find("a.toggleItems")).not.toExist();
		});

	});

});