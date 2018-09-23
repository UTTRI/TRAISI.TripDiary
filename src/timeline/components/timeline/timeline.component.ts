import { Component, OnInit, ElementRef } from '@angular/core';

import { TimelineService } from '../../services/timeline.service';
import { TRAISI } from 'traisi-question-sdk';
@Component({
	selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Timeline> implements OnInit {

    typeName: string;
	icon: string;

	/**
	 *Creates an instance of TimelineComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {
        super();

        this.typeName = "Trip Diary Timeline";
        this.icon = "business-time"
    }

    /**
     * TRAISI life cycle called for when the question is prepared
     */
    traisiOnInit(): void {

    }
   
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
        throw new Error('Method not implemented.');
        
        
	}
}
