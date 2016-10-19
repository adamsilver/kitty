function WeekView(container) {
    this.container = container;
    this.timeSlots = container.find('.calendarWeekView-time')
    this.entriesContainer = container.find('.calendarWeekView-entries');
    this.entries = container.find('.calendarWeekView-entry');
    this.positionEntries();
    this.sizeEntries();
    this.createDraggables();
    this.createDroppables();
}

WeekView.prototype.positionEntries = function() {
    this.entries.each(function(i, el) {
        this.positionEntry($(el));
    }.bind(this));
};

WeekView.prototype.positionEntry = function(entry) {
    var entryModel = entriesCollection.getModelById(entry.attr('data-entry-id'));
    var slot = this.getTimeSlot(entryModel.getAttribute('startTime'));
    var position = slot.position();
    entry.css('top', position.top+'px');
};

WeekView.prototype.sizeEntries = function() {
    this.entries.each(function(i, el) {
        this.sizeEntry($(el));
    }.bind(this));
};

WeekView.prototype.sizeEntry = function(entry) {
    var entryModel = entriesCollection.getModelById(entry.attr('data-entry-id'));
    var timeSlotHeight = 60;
    var duration = entryModel.getDuration();
    var hours = duration / 60;
    var height = hours * timeSlotHeight - 1; // -1 so that the drags dont collide (shouldnt need this really)
    entry.css('height', height);
};

WeekView.prototype.getTimeSlot = function(time) {
    var $el;
    this.timeSlots.each(function(i, el) {
        if($(el).attr('data-time') === time) {
            $el = $(el);
        }
    });
    return $el;
};

WeekView.prototype.createDraggables = function() {
    this.entries.draggable({
        containment: this.container,
        revert: 'invalid',
        snap: '.calendarWeekView-entries',
        snapTolerance: 0,
        snapMode: 'inner',
        grid: [161, 15], // width of column plus one for the border, height of 15 mins,
        stop: $.proxy(this, 'onEntryFinishedDragging')
    });
    this.entries.droppable({
        greedy: true,
        tolerance: 'touch',
        drop: function(e, ui){
            // after dropping making sure the revert is set to true
            // so that it never allows dragging on to the droppable
            ui.draggable.draggable('option','revert',true);
        }
    });
};

WeekView.prototype.onEntryFinishedDragging = function(e, ui) {
    $(e.target).draggable('option','revert','invalid');
};

WeekView.prototype.getStartTimeFromOffsetTop = function(top) {
    var timeBeginsAt = 9;
    var timeAsADecimal = timeBeginsAt+top/60;
    var time = parse(timeAsADecimal);
    console.log(time);
};

function parse(num) {
    return ('0' + Math.floor(num) % 24).slice(-2) + ':' + ((num % 1)*60 + '0').slice(0, 2);
}

WeekView.prototype.createDroppables = function() {
    this.entriesContainer.droppable({
        accept: '.calendarWeekView-entry',
        drop: $.proxy(this, 'onEntryDropped')
    });
};

WeekView.prototype.onEntryDropped = function(e, ui) {
    this.getStartTimeFromOffsetTop(ui.position.top);
};