import { Component, OnInit, ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
	selector: 'timeline-slot',
	template: require('./timeline-slot.component.html').toString(),
	styles: [require('./timeline-slot.component.scss').toString()]
})
export class TimelineSlotComponent implements OnInit {

    typeName: string;
	icon: string;
	
	/**
	 *Creates an instance of TimelineSlotComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineSlotComponent
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService) {
        this.typeName = "Trip Diary Timeline";
        this.icon = "business-time"
		
		
	}
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		console.log("inside of wedge component - test 2");
	}
}