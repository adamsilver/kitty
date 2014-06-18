kitty.Cookies = {
	create: function(name, value, days) {
		var expires = "";
		if (days) {
			var date = days;
			if (!(date instanceof Date)) {
				date = new Date();
				date.setDate(date.getDate() + (days || -1));
			}
			expires = "expires=" + date.toGMTString();
		}
		var cookie = name + "=" + value + ";expires=" + expires + ";path=/";
		document.cookie = cookie;
	},
	read: function(name) {
		var value = null;
		var cookies = document.cookie.split(";");
		var cookie;
		var collection = {};
		for (var i = cookies.length - 1; i >= 0; i--) {
			cookie = cookies[i].split("=");
			if (name === $.trim(cookie[0])) {
				value = cookie[1];
			}
		}
		return value;
	},
	remove: function(name) {
		this.create(name, "", -1);
	}
};