kitty.SortableTable = function(table, options) {
	this.table = $(table);
	this.setupOptions(options);
	this.body = this.table.find('tbody');
	this.createHeadingButtons();
	this.createStatusBox();
	this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'));
};

kitty.SortableTable.prototype.setupOptions = function(options) {
	options = options || {};
	options.statusMessage = options.statusMessage || 'Sort by %heading% (%direction%)';
	options.ascendingText = options.ascendingText || 'ascending';
	options.descendingText = options.descendingText || 'descending';
	this.options = options;
};

kitty.SortableTable.prototype.createHeadingButtons = function() {
	var headings = this.table.find('thead th');
	var heading;
	for(var i = 0; i < headings.length; i++) {
		heading = $(headings[i]);
		if(heading.attr('aria-sort')) {
			this.createHeadingButton(heading, i);
		}
	}
};

kitty.SortableTable.prototype.createHeadingButton = function(heading, i) {
	var text = heading.text();
	var button = $('<button type="button" data-index="'+i+'">'+text+'</button>');
	heading.text('');
	heading.append(button);
};

kitty.SortableTable.prototype.createStatusBox = function() {
	this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="sortableTable-status" />');
	this.table.parent().append(this.status);
};

kitty.SortableTable.prototype.onSortButtonClick = function(e) {
	var columnNumber = e.currentTarget.getAttribute('data-index');
	var sortDirection = $(e.currentTarget).parent().attr('aria-sort');
	var newSortDirection;
	if(sortDirection === 'none' || sortDirection === 'descending') {
		newSortDirection = 'ascending';
	} else {
		newSortDirection = 'descending';
	}
	var rows = this.getTableRowsArray();
	var sortedRows = this.sort(rows, columnNumber, newSortDirection);
	this.addRows(sortedRows);
	this.removeButtonStates();
	this.updateButtonState($(e.currentTarget), newSortDirection);
};

kitty.SortableTable.prototype.updateButtonState = function(button, direction) {
	button.parent().attr('aria-sort', direction);
	var message = this.options.statusMessage;
	message = message.replace(/%heading%/, button.text());
	message = message.replace(/%direction%/, this.options[direction+'Text']);
	this.status.text(message);
};

kitty.SortableTable.prototype.removeButtonStates = function() {
	this.table.find('thead th').attr('aria-sort', 'none');
};

kitty.SortableTable.prototype.addRows = function(rows) {
	for(var i = 0; i < rows.length; i++) {
		this.body.append(rows[i]);
	}
};

kitty.SortableTable.prototype.getTableRowsArray = function() {
	var rows = [];
	var trs = this.body.find('tr');
	for (var i = 0; i < trs.length; i++) {
		rows.push(trs[i]);
	}
    return rows;
};

kitty.SortableTable.prototype.sort = function(rows, columnNumber, sortDirection) {
	var newRows = rows.sort($.proxy(function(rowA, rowB) {
		var tdA = $(rowA).find('td').eq(columnNumber);
		var tdB = $(rowB).find('td').eq(columnNumber);
		var valueA = this.getCellValue(tdA);
		var valueB = this.getCellValue(tdB);
		if(sortDirection === 'ascending') {
			if(valueA < valueB) {
				return -1;
			}
			if(valueA > valueB) {
				return 1;
			}
			return 0;
		} else {
			if(valueB < valueA) {
				return -1;
			}
			if(valueB > valueA) {
				return 1;
			}
			return 0;
		}
	}, this));
	return newRows;
};

kitty.SortableTable.prototype.getCellValue = function(cell) {
	var val = cell.attr('data-sort-value');
	val = val || cell.html();
	if($.isNumeric(val)) {
		val = parseInt(val, 10);
	}
	return val;
};
