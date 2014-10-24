kitty.Accordion = function(container) {
	this.container = container;
	this.links = container.find('.activator');
	this.panels = container.find('.panelContainer');
	this.activeSectionIndex = -1;
	this.sections = {};
	this.container.on('click', '.activator', $.proxy(this, 'onActivatorClicked'));	
	this.setupAccordionSections();
}

kitty.Accordion.prototype.setupAccordionSections = function() {
	var panelContainer;
	var section;

	for(var i = 0; i < this.panels.length; i++) {
		//link = $(this.links[i]);
		panelContainer = $(this.panels[i]);
		section = new kitty.Accordion.AccordionSection(panelContainer);
		section.index = i;
		this.sections[panelContainer.attr('data-id')] = section;
		section.events.opened.subscribe($.proxy(this, 'onOpened'));
		section.events.closed.subscribe($.proxy(this, 'onClosed'));
	}
};

kitty.Accordion.prototype.onOpened = function(section) {
	this.activeSectionIndex = section.index;
};

kitty.Accordion.prototype.onClosed = function(section) {
	this.activeSectionIndex = -1;
};

kitty.Accordion.prototype.onActivatorClicked = function(e) {
	e.preventDefault();
	var id = $(e.target).attr('data-id');
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
	this.link = panelContainer.find('.activator');
	this.panel = panelContainer.find('.panel');;
	this.events = {
		opened: new kitty.CustomEvent(),
		closed: new kitty.CustomEvent()
	};
	this.hide();
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
	this.link.addClass('expanded');
};

kitty.Accordion.AccordionSection.prototype.slideShut = function() {
	this.panel.animate({ 'height': 'hide' }, { duration: this.animationDuration, complete: $.proxy(this, 'onSlideShutCompleted', this.panel)});
};

kitty.Accordion.AccordionSection.prototype.onSlideShutCompleted = function() {
	this.showing = false;
	this.events.closed.publish(this);
	this.link.removeClass('expanded');
};

kitty.Accordion.AccordionSection.prototype.hide = function() {
	this.showing = false;
	this.panel.css('display', 'none');
};