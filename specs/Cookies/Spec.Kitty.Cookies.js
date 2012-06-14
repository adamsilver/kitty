describe("Cookies", function() {
  
  describe("create", function() {    
    it("sets it's value", function() {
      Kitty.Cookies.create("key", "newValue");      
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
      expect(Kitty.Cookies.read("adam")).toBe("silver");      
    });
  });
  
  describe("remove", function() {
    it("removes the cookie", function() {
      Kitty.Cookies.create("adam", "benjamin");
      Kitty.Cookies.remove("adam");
      expect(Kitty.Cookies.read("adam")).toBeNull();
    });
  })
  
});