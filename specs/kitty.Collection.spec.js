describe('Collection', function () {

    var collection;
    var mockModels;
    var mockModelObj;
    var mockModelsArray;
    var mockModelId;
    var mockModelIdIndex;
    var mockReturnIndex;
    var mockGetModelById;
    var mockRemovedModelById;

    beforeEach(function () {
        mockModels = [];
        spyOn(kitty.Collection, 'superConstructor');
        mockModelId = '1';
        mockModelObj = {
            attributes : {
                'id': {
                    currentValue: mockModelId,
                    previousValue: '0'
                },
                'prop1' : {
                    currentValue: '0',
                    previousValue: '0'
                }
            },
            getAttribute: function(){}
        };
        spyOn(mockModelObj, 'getAttribute').and.callFake(function(arg) {
            // kitty.Model
            return this.attributes[arg];
        });
        mockModelsArray = [mockModelObj, mockModelObj];

        collection = new kitty.Collection();
    });

    describe('Creating new Collection', function () {
        it('Calls the event emitter super constructor', function () {
            expect(kitty.Collection.superConstructor).toHaveBeenCalled();
            expect(kitty.Collection.superConstructor.calls.mostRecent().object).toBe(collection);
        });
        it('Creates new Models Array',function () {
            expect(collection.models).toEqual(mockModels);
        });
    });
    describe('Adding a Model', function () {
        beforeEach(function () {
            spyOn(collection.models, 'push');
            collection.addModel(mockModelObj);
        });
        it('Appends to Collection Array', function() {
            expect(collection.models.push).toHaveBeenCalledWith(mockModelObj);
        });
    });
    describe('Adding multiple Models to the Collection', function () {
        beforeEach(function () {
            spyOn(collection.models, 'push');
            collection.addModels(mockModelsArray);
        });
        it('Appends to Collection Array', function() {
            expect(collection.models.push).toHaveBeenCalledWith(mockModelsArray[0]);
            expect(collection.models.push).toHaveBeenCalledWith(mockModelsArray[1]);
        });
    });
    describe('Retrieving a Model index from Collection by Id', function () {
        beforeEach(function () {
            collection.addModel(mockModelObj);
            mockReturnIndex = collection.models.length - 1;
            mockModelIdIndex = collection.getModelIndexById(mockModelObj.attributes.id);
        });
        it('Returns the index of the Model with "Id"', function() {
            expect(mockModelObj.getAttribute).toHaveBeenCalledWith('id');
            expect(mockModelIdIndex).toBe(mockReturnIndex);
        });
    });
    describe('Retrieving a Model from Collection by Id', function () {
        beforeEach(function () {
            collection.addModel(mockModelObj);
            mockGetModelById = collection.getModelById(mockModelObj.attributes.id);
        });
        it('Returns the Model object retrieved from Collection', function() {
            expect(mockGetModelById).toBe(mockModelObj);
        });
    });
    describe('Removing Model from Collection by Id', function () {
        beforeEach(function () {
            collection.addModel(mockModelObj);
            mockRemovedModelById = collection.removeModelById(mockModelObj.attributes.id);
        });
        it('Returns the removed Model object from Collection', function() {
            expect(mockRemovedModelById).toBe(mockModelObj);
        });
    });

});