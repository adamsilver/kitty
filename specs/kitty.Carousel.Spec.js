describe("Carousel", function() {

	var carousel;
    var mockContainer;
    var mockItemsContainer;
    var mockItems;
    var mockItemsWidth;
    var mockCssWidth;

	beforeEach(function() {
		mockContainer = jasmine.createSpyObj('mockContainer', ['find']);
        mockContainer.find.and.callFake(function(arg) {
            if(arg === 'ul.items') {
                return mockItemsContainer;
            }
        });

        mockItemsContainer = jasmine.createSpyObj('mockItemsContainer', ['find', 'width', 'css', 'animate']);
        mockItemsContainer.css.and.callFake(function (rule, value) {
            if(rule === "left") {
                return mockCssWidth;
            }
        });
        mockItemsContainer.find.and.callFake(function(arg) {
            if(arg === 'li.item') {
                return mockItems;
            }
        });

        mockItems = jasmine.createSpyObj('mockItem', ['width']);
        mockItems.width.and.returnValue(mockItemsWidth);
        mockItems.length = 2;
        mockItemsWidth = 100;
        mockCssWidth = "100px";
        carousel = new kitty.Carousel(mockContainer);
	});

	describe("Creating a carousel", function() {
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

    describe('Moving the carousel to the next item', function () {
        beforeEach(function () {
            carousel.moveForwards();
        });
        it('Retrieves the left css value', function () {
            expect(mockItemsContainer.css).toHaveBeenCalledWith('left');
        });
        it('Animates the left css value by 200', function () {
            expect(mockItemsContainer.animate).toHaveBeenCalledWith({
               left: "300px"
            });
        });
    });
    describe('Moving the carousel to the previous item', function () {
        beforeEach(function () {
            carousel.moveBackwards();
        });
        it('Retrieves the left css value', function () {
            expect(mockItemsContainer.css).toHaveBeenCalledWith('left');
        });
        it('Animates the left css value by 200', function () {
            expect(mockItemsContainer.animate).toHaveBeenCalledWith({
                left: "-100px"
            });
        });
    });
    describe('Destroying the carousel', function () {
        it('Removes the width style from the items container', function () {
            carousel.destroy();
            expect(mockItemsContainer.css).toHaveBeenCalledWith("width", "");
        });
    });
});
