describe('Image label fixer', function () {

    // This should only be included for browsers (IE6/7)
    // that do not correctly treat labels correctly when
    // they contain an image. When the image is clicked,
    // the event should trigger a click on the label element,
    // which in turn should place focus on the related input

    var fixer;
    var mockImage;
    var mockProxy;
    var mockLabel;
    var mockFor;
    var mockFormControl;

    beforeEach(function () {
        mockFormControl = {
            "0": {
                tagName: "",
                type: "",
                checked: false
            },
            trigger: jasmine.createSpy()
        };
        mockFor = "mockFor";
        mockImage = jasmine.createSpyObj('mockImage', ['on', 'parents']);
        mockLabel = jasmine.createSpyObj('mockLabel', ['attr']);
        mockLabel.attr = jasmine.createSpy().and.returnValue(mockFor);
        mockImage.parents = jasmine.createSpy().and.returnValue(mockLabel);
        mockProxy = {};
        spyOn($, 'proxy').and.returnValue(mockProxy);
        spyOn(window, '$').and.returnValue(mockFormControl);
        fixer = new kitty.ImageLabelFixer(mockImage);
    });

    describe('Creating a new label fixer', function () {
        it('Creates an img property', function () {
            expect(fixer.img).toBe(mockImage);
        });
        it('Listens for the click event on the image', function () {
            expect(mockImage.on).toHaveBeenCalledWith('click', mockProxy);
            expect($.proxy).toHaveBeenCalledWith(jasmine.any(Object), "onImageClicked");
        });
    });

    describe('Image clicked', function () {

        describe('Always', function () {
            beforeEach(function () {
                fixer.onImageClicked();
            })
            it('Retrieves the parent label', function () {
                expect(mockImage.parents).toHaveBeenCalledWith('label');
            });

            it('Retrieves the for attribute', function () {
                expect(mockLabel.attr).toHaveBeenCalledWith('for');
            });

            it('Retrieves the related form control', function () {
                expect($).toHaveBeenCalledWith('#'+mockFor);
            });
        });

        describe('Related control is a textarea', function () {
            beforeEach(function () {
                mockFormControl[0].tagName = 'textarea';
                fixer.onImageClicked();
            });
            it('Focuses on the related form control', function () {
                expect(mockFormControl.trigger).toHaveBeenCalledWith('focus');
            });
        });

        describe('Related control is a select', function () {
            beforeEach(function () {
                mockFormControl[0].tagName = 'select';
                fixer.onImageClicked();
            });
            it('Focuses on the related form control', function () {
                expect(mockFormControl.trigger).toHaveBeenCalledWith('focus');
            });
        });

        describe('Related control is an input', function () {
            beforeEach(function () {
                mockFormControl[0].tagName = 'input';
            });
            describe('Text input', function () {
                it('Focus on the related form control', function () {
                    mockFormControl[0].type = 'text';
                    fixer.onImageClicked();
                    expect(mockFormControl.trigger).toHaveBeenCalledWith('focus');
                });
            });
            describe('Password input', function () {
                it('Focus on the related form control', function () {
                    mockFormControl[0].type = 'password';
                    fixer.onImageClicked();
                    expect(mockFormControl.trigger).toHaveBeenCalledWith('focus');
                });
            });
            describe('Radio input', function () {
                beforeEach(function() {
                    mockFormControl[0].type = 'radio';
                    fixer.onImageClicked();
                });
                it('Marks the radio as checked', function () {
                    expect(mockFormControl[0].checked).toBe(true);
                });
            });
            describe('Checkbox input', function () {
                beforeEach(function() {
                    mockFormControl[0].type = 'checkbox';
                });
                describe('Checkbox is checked', function () {
                    it('Marks the checkbox as unchecked', function () {
                        mockFormControl[0].checked = true;
                        fixer.onImageClicked();
                        expect(mockFormControl[0].checked).toBe(false);
                    });
                });
                describe('Checkbox is not checked', function () {
                    it('Marks the checkbox as checked', function () {
                        mockFormControl[0].checked = false;
                        fixer.onImageClicked();
                        expect(mockFormControl[0].checked).toBe(true);
                    });
                });
            });

        });

    });

});