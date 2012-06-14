describe("CustomEvent", function() {
  
  describe("subscribe", function() {
    
    it("adds a subscriber to it's collection", function() {
      var event = new Kitty.CustomEvent();
      var myFunc = function() {};
      event.subscribe(myFunc);      
      expect(event.subscribers[0]).toBe(myFunc);
    });
    
  });
  
  describe("unSubscribe", function() {
    
    it("removes the subscriber from it's collection", function() {
      var event = new Kitty.CustomEvent();
      var myFunc = function() {};
      event.subscribe(myFunc);
      event.unSubscribe(myFunc);
      expect(event.subscribers.length).toBe(0);
    });
    
  });
  
  describe("publish", function() {
    
    it("invokes each of the subscribers with params", function() {
      var event = new Kitty.CustomEvent();
      
      var fns = {
        fn1: function() {},
        fn2: function() {}
      }
      
      spyOn(fns, "fn1");
      spyOn(fns, "fn2");
      
      event.subscribe(fns.fn1);
      event.subscribe(fns.fn2);
      
      
      event.publish(true, false, 1);
      
      expect(fns.fn1).toHaveBeenCalledWith(true, false, 1);
      expect(fns.fn2).toHaveBeenCalledWith(true, false, 1);
    });
    
    describe("and one of the subscribers throws an error", function () {
      
      it("proceeds to invoke all the other subscribers", function() {
        var event = new Kitty.CustomEvent();
      
        var fns = {
          fn1: function() {
            throw Error("yo");
          },
          fn2: function() {
          }
        }
        
        spyOn(fns, "fn1").andCallThrough();
        spyOn(fns, "fn2").andCallThrough();
        
        event.subscribe(fns.fn1);
        event.subscribe(fns.fn2);
        event.publish(true, false, 1);
        
        expect(fns.fn2).toHaveBeenCalledWith(true, false, 1);
      });
      
    });
    
  });
  
    
});