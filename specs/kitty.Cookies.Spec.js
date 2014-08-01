describe("Cookies", function() {
  
  describe("create", function() {    
    it("sets it's value", function() {
      kitty.Cookies.create("key", "newValue");      
      var cookies = document.cookie.split(";");
      var cookie;
      var collection = {};
      for (var i = cookies.length - 1; i >= 0; i--) {
        cookie = cookies[i].split("=");
        if (cookie.length >= 2) {
          collection[cookie[0]] = cookie[1];
        }
      }
      expect(collection.key).toBe("newValue");
    });    
  });
  
  describe("read", function() {
    it("returns the value of the cookie", function() {    
      var cookie = "adam" + "=" + "silver" + "; expires=" + "" + "; path=/";
      document.cookie = cookie;
      expect(kitty.Cookies.read("adam")).toBe("silver");      
    });
  });
  
  describe("remove", function() {
    it("removes the cookie", function() {
      kitty.Cookies.create("adam", "benjamin");
      kitty.Cookies.remove("adam");
      expect(kitty.Cookies.read("adam")).toBeNull();
    });
  })
  
});