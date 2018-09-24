import { Component, OnInit, ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
	selector: 'timeline-shelf',
	template: require('./timeline-shelf.component.html').toString(),
	styles: [require('./timeline-shelf.component.scss').toString()]
})
export class TimelineShelfComponent implements OnInit {


	/**
	 *Creates an instance of TimelineWedgeComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineWedgeComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {
    
		
		
	}
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		console.log("in ngOnInit of shelf component.");
	}
}
