describe("Checkbox Disabler", function() {

	var checkboxDisabler;
    var mockCheckboxes;
    var mock$Checkboxes;
    var mockLimit;
    var mockProxy;

	beforeEach(function() {
        mockCheckboxes = {};
        mock$Checkboxes = jasmine.createSpyObj('mock$Checkboxes', ['on'])
        mockLimit = 2;
        mockProxy = {};
        spyOn(window, "$").and.callFake(function (selector) {
            if(selector === mockCheckboxes) {
                return mock$Checkboxes;
            }
        });
        spyOn($, "proxy").and.returnValue(mockProxy);
        spyOn(kitty.CheckboxDisabler.prototype, "checkState");
        checkboxDisabler = new kitty.CheckboxDisabler(mockCheckboxes, mockLimit);
	});

    describe('Creating a checkbox disabler', function () {
        it('Creates a checkboxes property', function () {
            expect(checkboxDisabler.checkboxes).toBe(mockCheckboxes);
        });
        it('Creates a limit property', function () {
            expect(checkboxDisabler.limit).toBe(mockLimit);
        });
        it('Listens to the checkbox change event', function () {
            expect($).toHaveBeenCalledWith(mockCheckboxes);
            expect($.proxy).toHaveBeenCalledWith(jasmine.any(Object), "checkboxChanged");
        });
        it('Checks the state of the checkboxes', function () {
            expect(kitty.CheckboxDisabler.prototype.checkState).toHaveBeenCalled();
        });
    });

    describe('Checkbox change event fires', function () {
        it('Checks the state of the checkboxes', function () {
            expect(kitty.CheckboxDisabler.prototype.checkState).toHaveBeenCalled();
        });
    });
    
});