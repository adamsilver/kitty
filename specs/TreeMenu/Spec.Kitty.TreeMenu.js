describe("Tree Menu", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var rootList = null;
	var treeMenu = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.kitty.TreeMenu.Fixture1.html');
		rootList = $("ul#root")
		treeMenu = new kitty.TreeMenu(rootList);
	});

	describe("Creating a new tree menu", function() {
		it("Collapses all the menus", function() {
			var subMenus = rootList.find("ul");
			for(var i = 0; i < subMenus.length; i++) {
				expect($(subMenus.filter(":eq("+i+")"))).toHaveClass("hide");
			}
		});
	});

	
	describe("Clicking a link", function() {
		describe("That has a sub menu", function() {
			it("Reveals the menu", function() {
				var link1 = rootList.find("a:first");
				link1.trigger("click");
				expect(link1.parent().find("ul:first")).not.toHaveClass("hide");
			});
			it("Prevents default behaviour", function() {
				var link1 = rootList.find("a:first");
				var fakeEvent = {
					target: link1[0],
					preventDefault: jasmine.createSpy()
				}
				treeMenu.handleLink_onClick(fakeEvent);
				expect(fakeEvent.preventDefault).toHaveBeenCalled();
			});
		});
		describe("That doesn't have a sub menu", function() {
			it("Follows the link as normal with default behaviour", function() {
				var link2 = rootList.find(">li:eq(1) a");
				var fakeEvent = {
					preventDefault: jasmine.createSpy()
				}
				treeMenu.handleLink_onClick(fakeEvent);
				expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
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
			var link1 = rootList.find("a:first");			
			var subMenus = link1.parent().find("ul ul");
			subMenus.removeClass("hide");
			link1.trigger("click"); // open it first
			link1.trigger("click"); // then close it
			expect(subMenus).toHaveClass("hide");
		});
	});

});