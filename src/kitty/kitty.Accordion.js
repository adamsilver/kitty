kitty.Accordion = function(container) {
	this.container = container;
	this.links = container.find('.activator');
	this.panels = container.find('.panelContainer');
	this.activeSectionIndex = 0;
	this.sections = {};
	this.events = {
		panelClosed: new kitty.CustomEvent(),
		panelOpened: new kitty.CustomEvent()
	};
	this.container.on('click', '.activator', $.proxy(this, 'onActivatorClicked'));	
	this.setupAccordionSections();
}

kitty.Accordion.prototype.setupAccordionSections = function() {
	var panelContainer;
	var section;

	for(var i = 0; i < this.panels.length; i++) {
		panelContainer = $(this.panels[i]);
		section = new kitty.Accordion.AccordionSection(panelContainer);
		section.index = i;
		this.sections[panelContainer.attr('data-id')] = section;
		section.events.opened.subscribe($.proxy(this, 'onOpened'));
		section.events.closed.subscribe($.proxy(this, 'onClosed'));
		if(i > 0) {
			section.hide();
		}
	}
};

kitty.Accordion.prototype.onOpened = function(section) {
	this.activeSectionIndex = section.index;
	this.events.panelOpened.publish(section);
};

kitty.Accordion.prototype.onClosed = function(section) {
	this.activeSectionIndex = -1;
	this.events.panelClosed.publish(section);
};

kitty.Accordion.prototype.onActivatorClicked = function(e) {	
	e.preventDefault();
	var id = $(e.currentTarget).attr('data-id');
	var section = this.sections[id];	
	var activeSection = this.getActiveSection();	
	if(activeSection) {
		activeSection.slideShut();
	}
	section.toggle();
};

kitty.Accordion.prototype.getActiveSection = function() {
	var activeSection = null;
	if(this.activeSectionIndex >= 0) {
		for(var section in this.sections) {
			if (this.sections.hasOwnProperty(section)) {
				if(this.sections[section].showing) {
					activeSection = this.sections[section];
				}
			}
		}
	}
	return activeSection;
};

kitty.Accordion.AccordionSection = function(panelContainer) {
	this.showing = true;
	this.animationDuration = 100;
	this.panelContainer = panelContainer;
	this.panel = panelContainer.find('.panel');;
	this.events = {
		opened: new kitty.CustomEvent(),
		closed: new kitty.CustomEvent()
	};
	this.panelContainer.addClass('expanded');
}

kitty.Accordion.AccordionSection.prototype.toggle = function() {
	if(this.showing) {
		this.slideShut();
	} else {
		this.slideOpen();
	}
};

kitty.Accordion.AccordionSection.prototype.slideOpen = function() {
	this.panel.animate({ 'height': 'show' }, { duration: this.animationDuration, complete: $.proxy(this, 'onSlideOpenCompleted', this.panel)});
};

kitty.Accordion.AccordionSection.prototype.onSlideOpenCompleted = function() {
	this.showing = true;
	this.events.opened.publish(this);
	this.panelContainer.addClass('expanded');
};

kitty.Accordion.AccordionSection.prototype.slideShut = function() {
	this.panel.animate({ 'height': 'hide' }, { duration: this.animationDuration, complete: $.proxy(this, 'onSlideShutCompleted', this.panel)});
};

kitty.Accordion.AccordionSection.prototype.onSlideShutCompleted = function() {
	this.showing = false;
	this.events.closed.publish(this);
	this.panelContainer.removeClass('expanded');
};

kitty.Accordion.AccordionSection.prototype.hide = function() {
	this.showing = false;
	this.panel.css('display', 'none');
	this.panelContainer.removeClass('expanded');
};