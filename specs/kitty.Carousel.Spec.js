describe("Carousel", function() {

	var carousel;
    var mockContainer;
    var mockItemsContainer;
    var mockItems;
    var mockItemsWidth;

	beforeEach(function() {
		mockContainer = jasmine.createSpyObj('mockContainer', ['find']);
        mockItemsContainer = jasmine.createSpyObj('mockItemsContainer', ['find', 'width']);
        mockItems = jasmine.createSpyObj('mockItem', ['width']);
        mockItems.length = 2;
        mockItemsWidth = 100;

        mockContainer.width = jasmine.createSpy();

        mockItems.width = jasmine.createSpy().and.returnValue(mockItemsWidth);

        mockContainer.find = jasmine.createSpy().and.callFake(function(arg) {
            if(arg === 'ul.items') {
                return mockItemsContainer;
            }
        });

        mockItemsContainer.find = jasmine.createSpy().and.callFake(function(arg) {
            if(arg === 'li.item') {
                return mockItems;
            }
        });
	});

	describe("Creating a carousel", function() {
        beforeEach(function () {
            carousel = new kitty.Carousel(mockContainer);
        })
        it('Finds the carousel items container', function () {
            expect(mockContainer.find).toHaveBeenCalledWith("ul.items");
            expect(carousel.ul).toBe(mockItemsContainer);
        });
        it('Finds the carousel items collection', function () {
            expect(mockItemsContainer.find).toHaveBeenCalledWith('li.item');
            expect(carousel.lis).toBe(mockItems);
        });
        it('Sets the width of the items container to match the width of all the items in the carousel', function () {
            expect(mockItemsContainer.width).toHaveBeenCalledWith(mockItems.length*mockItemsWidth);
        });
	});

});