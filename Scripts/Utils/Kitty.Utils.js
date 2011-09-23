var Kitty = Kitty || {};

Kitty.Utils = {
  innerXhtml: function(node) {
	 var s = "";
	 if(!node) return s;
	 var childNode = null;
	 for(var i = 0; i<node.childNodes.length; i++) {
	   childNode = node.childNodes[i];
	
	   // 1 - element
	   if(childNode.nodeType == 1) {
       if(childNode.tagName.toLowerCase() === "img") {
         // open tag
         s+='<';
         s+=childNode.tagName.toLowerCase();
         s+=this.getAttributesAsString(childNode);
         s+=' />';
      }
      else {
      	// open tag
      	s+='<';
      	s+=childNode.tagName.toLowerCase();
      	s+=this.getAttributesAsString(childNode);
      	s+='>';
      	
      	s+=this.innerXhtml(childNode);
	
      	// close tag
      	s+='</';
      	s+=childNode.tagName.toLowerCase();
      	s+='>';	
	     }
	   }
	 // 3 - text
	   else {
	     s+=childNode.nodeValue;
	   }
	
	};
	
	 return $.trim(s);
  },
  getAttributesAsString: function(node) {
	 var s = "";
		var allowedTags = ["id", "src", "href", "class", "alt"];
		var attributes = node.attributes ? node.attributes : node.getAttributes();
		var attribute;
		for(var i = 0; i<attributes.length; i++) {
			attribute = attributes[i];

			if(jQuery.inArray(attribute.nodeName, allowedTags) < 0) continue;
			s+= " ";
			s+= attribute.nodeName;
			s+= "=";
			s+= "'"+attribute.nodeValue+"'";
		};
		return s;
  }
}