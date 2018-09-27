import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { IDropResult } from 'ngx-smooth-dnd';
import { TimelineEntry } from '../../models/timeline-entry.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
	selector: 'timeline-new-entry',
	template: require('./timeline-new-entry.component.html').toString(),
	styles: [require('./timeline-new-entry.component.scss').toString()]
})
export class TimelineNewEntryComponent implements OnInit {
	modalRef: ModalDirective;

	@ViewChild('newEntryModal')
	newTimelineEntryTemplateRef: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	mapTemplate: ViewContainerRef;

	constructor(private timelineService: TimelineService) {}

	show(): void {

        console.log(this.mapTemplate);
        this.timelineService.openEditMapLocationModal(this.mapTemplate);

        console.log(this.newTimelineEntryTemplateRef);
    
        this.newTimelineEntryTemplateRef.show();
        
	}

	ngOnInit(): void {}
}
