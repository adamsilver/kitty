describe("Tree Menu", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var rootList = null;
	var treeMenu = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.TreeMenu.Fixture1.html');
		rootList = $("ul#root")
		treeMenu = new Kitty.TreeMenu(rootList);
	});

	describe("Creating a new menu", function() {
		it("Collapses all the menus", function() {
			var subMenus = rootList.find("ul");
			for(var i = 0; i < subMenus.length; i++) {
				expect($(subMenus.filter(":eq("+i+")"))).toHaveClass("hide");
			}
		});
	});

	describe("Link with a sub menu", function() {
		describe("Clicking a link", function() {
			it("Reveals the menu", function() {
				var link1 = rootList.find("a:first");
				link1.trigger("click");
				expect(link1.parent().find("ul:first")).not.toHaveClass("hide");
			});
			it("Prevents default behaviour", function() {
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				}
				treeMenu.handleLink_onClick(fakeEvent);
				expect(fakeEvent.preventDefault).toHaveBeenCalled();
			});
		});
	});

	describe("Link without a sub menu", function() {
		describe("Clicking a link", function() {
			it("Follows the link as normal with default behaviour", function() {
				
			});
		});
	});

	describe("Closing a menu", function() {
		it("Collapses the menu", function() {
			var link1 = rootList.find("a:first");
			link1.trigger("click"); // open it first
			link1.trigger("click"); // then close it
			expect(link1.parent().find("ul:first")).toHaveClass("hide");
		});
		it("Collapses all sub menus", function() {
			
		});
	});

});