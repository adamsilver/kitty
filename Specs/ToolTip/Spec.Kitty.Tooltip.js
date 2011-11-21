describe("Tooltip", function() {

	jasmine.getFixtures().fixturesPath = '.';

	var activator = null;
	var tooltip = null;

	beforeEach(function() {
		jasmine.getFixtures().load('Spec.Kitty.Tooltip.Fixture1.html');
		activator = $("#activator");
		tooltip = new Kitty.Tooltip(activator, '<div class="stuff">Stuff</div>');
	});


	describe("Activing a tooltip", function() {
		it("Appends a tooltip to the body", function() {
			activator.focus();
			expect($("body .tooltip")).toExist();
		});
		describe("Via keyboard focus", function() {
			it("Displays the tooltip with an offset of 10 in both x and y position", function() {
				
				//var tooltip = $("body .tooltip");
				//expect(tooltip.html())
			});
		});
		describe("Via mouseenter", function() {
			
		});
	});
	describe("Deactivating a tooltip", function() {
		describe("Via keyboard blur", function() {
			
		});
		describe("Via mouseleave", function() {
			
		});
	});
	describe("Destroying tooltip", function() {
		
	});
});