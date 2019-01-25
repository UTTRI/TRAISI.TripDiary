import { Component, OnInit, ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
	selector: 'timeline-wedge',
	template: require('./timeline-wedge.component.html').toString(),
	styles: [require('./timeline-wedge.component.scss').toString()]
})
export class TimelineWedgeComponent implements OnInit {
	typeName: string;
	icon: string;
	/**
	 *Creates an instance of TimelineWedgeComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineWedgeComponent
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService) {
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
	}
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		console.log('inside of wedge component - test 2');
	}
}
