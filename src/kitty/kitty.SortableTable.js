kitty.SortableTable = function(table) {
	this.table = $(table);
	this.body = this.table.find('tbody');
	this.createHeadingButtons();
	this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'));
};

kitty.SortableTable.prototype.createHeadingButtons = function() {
	var headings = this.table.find('thead th');
	for(var i = 0; i < headings.length; i++) {
		if($(headings[i]).hasClass('sort')) {
			this.createHeadingButton(headings[i], i);
		}
	}
};

kitty.SortableTable.prototype.createHeadingButton = function(heading, i) {
	var heading = $(heading);
	var text = heading.text();
	var textSpan = $('<span class="sort-text">'+text+'</span>');
	var arrowSpan = $('<span aria-hidden="true" class="sort-arrow"></span>');
	if(heading.attr('data-sort-direction') == 'asc') {
		arrowSpan.html(' 	&#9652;');
	}
	if(heading.attr('data-sort-direction') == 'desc') {
		arrowSpan.html(' &#9662;');
	}
	var button = $('<button type="button" data-index="'+i+'"></button>');
	button.append(textSpan);
	button.append(arrowSpan);
	heading.text('');
	heading.append(button);
};

kitty.SortableTable.prototype.onSortButtonClick = function(e) {
	var columnNumber = e.currentTarget.getAttribute('data-index');
	var sortDirection = $(e.currentTarget).parent().attr('data-sort-direction') || 'desc';
	var newSortDirection = (sortDirection == 'asc') ? 'desc' : 'asc';
	var rows = this.getTableRowsArray();
	var sortedRows = this.sort(rows, columnNumber, newSortDirection);
	this.addRows(sortedRows);
	this.removeButtonStates();
	this.updateButtonState($(e.currentTarget), newSortDirection);
};

kitty.SortableTable.prototype.updateButtonState = function(button, direction) {
	var symbol = (direction == 'asc') ? '	&#9652;' : '&#9662;';


	button.parent().attr('data-sort-direction', direction);
	button.find('.sort-arrow').html(' '+symbol);
	// &#9662;
};

kitty.SortableTable.prototype.removeButtonStates = function() {
	this.table.find('thead th').attr('data-sort-direction', '');
	this.table.find('thead th .sort-arrow').text('');
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
		if(sortDirection == 'asc') {
			return valueA > valueB;
		} else {
			return valueB > valueA;
		}
	}, this));
	return newRows;
};

kitty.SortableTable.prototype.getCellValue = function(cell) {
	var val = cell.attr('data-sort-value');
	val = val || cell.html();
	return val;
};
