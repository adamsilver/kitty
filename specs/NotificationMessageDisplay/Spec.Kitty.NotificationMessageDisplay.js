describe("Notification Message Display", function() {
	
	jasmine.getFixtures().fixturesPath = '.';

	var notificationMessageDisplay = null;
	var container = null;

	beforeEach(function() {
		jasmine.Clock.useMock();
		jasmine.getFixtures().load('Spec.Kitty.NotificationMessageDisplay.Fixture1.html');
		container = $("#notifications");
		notificationMessageDisplay = new Kitty.NotificationMessageDisplay(container);
	});
	describe("Creating a notification", function() {
		beforeEach(function() {
			notificationMessageDisplay.createNotification("Message");
		});
		it("Appends a new notification to the container", function() {
			var notificationMessage = container.find(".notification");
			expect(notificationMessage).toExist();
		});
		it("Closes after a certain period of time", function() {
			jasmine.Clock.tick(3000);
			var notificationMessage = container.find(".notification");
			expect(notificationMessage).not.toExist();
		});
	});

	describe("Manually closing a notification", function() {
		beforeEach(function() {
			notificationMessageDisplay.createNotification("Message");			
		});
		it("Closes the notification",  function() {
			var notificationMessage = container.find(".notification");
			notificationMessage.find("a.close").trigger("click");	
			notificationMessage	= container.find(".notification");
			expect(notificationMessage).not.toExist();
		});
		it("Prevents the close button link from being followed", function() {
			var fakeClickEvent = {
				preventDefault: jasmine.createSpy()
			}
			var notificationObj = new Kitty.NotificationMessageDisplay.Notification("message");
			notificationObj.handleCloseButton_onClick(fakeClickEvent);
			expect(fakeClickEvent.preventDefault).toHaveBeenCalled();
		});
	});

	describe("Mousing over a notification", function() {
		var notificationMessage = null;
		beforeEach(function() {
			notificationMessageDisplay.createNotification("Message");
			notificationMessage = container.find(".notification");
			notificationMessage.trigger("mouseover");
		});
		it("Will not close the notification after a period of time", function() {			
			jasmine.Clock.tick(3000);
			expect(container.find(".notification")).toExist();
		});
		describe("And then mousing out of the notification", function() {
			it("Closes after a certain period of time", function() {
				notificationMessage.trigger("mouseout");
				jasmine.Clock.tick(3000);
				expect(container.find(".notification")).not.toExist();
			});
		});
	});

});