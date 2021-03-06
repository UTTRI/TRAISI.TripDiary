import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

import templateString from './timeline-wedge.component.html';
@Component({
	selector: 'timeline-wedge',
	template: templateString,

	encapsulation: ViewEncapsulation.None,
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
