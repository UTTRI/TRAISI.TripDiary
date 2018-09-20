import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[timelineSegment]'
})
export class TimelineSegment {
	/**
	 *Creates an instance of TimelineSegment.
	 * @param {ElementRef} _element
	 * @memberof TimelineSegment
	 */
	constructor(private _element: ElementRef) {}
}
