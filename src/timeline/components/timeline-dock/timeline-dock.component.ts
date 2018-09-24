import { Component, OnInit, ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
	selector: 'timeline-dock',
	template: require('./timeline-dock.component.html').toString(),
	styles: [require('./timeline-dock.component.scss').toString()]
})
export class TimelineDockComponent implements OnInit {

    typeName: string;
    icon: string;

	/**
	 * 
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
