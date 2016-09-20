# Dialog documentation

This script is responsible for creating dialogs. It uses just enough HTML elements to build the dialog giving you the means to inject whatever you want inside it so that you can style as you wish. No overrides necessary.

If you want a dialog to be 300px, just make sure the html that you inject into the dialog has a root element that has corresponding styles for that.

The dialog works by injecting an element at the end </body>.

### Create a dialog

	var dialog = new kitty.Dialog();

### Set content for dialog

	dialog.setContent('<p>Hello world</p>');

### Show a dialog

To show the dialog centered on the screen:

	dialog.show();

To show a dialog at a particular coordinates:

	dialog.show({y: 100, x:300 });

### Hide a dialog

	dialog.hide();