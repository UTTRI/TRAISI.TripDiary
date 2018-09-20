import { Component, OnInit, ElementRef } from '@angular/core';
import {
	SurveyViewer,
	QuestionConfiguration,
	SurveyResponder,
	SurveyQuestion,
	QuestionResponseState,
	TRAISI
} from 'traisi-question-sdk';
import { TimelineService } from '../../services/timeline.service';

@Component({
	selector: 'traisi-wedge-question',
	template: require('./timeline-wedge.component.html').toString(),
	styles: [require('./timeline-wedge.component.scss').toString()]
})
export class TimelineWedgeComponent extends TRAISI.SurveyQuestion implements OnInit {
	/**
	 *Creates an instance of TimelineWedgeComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineWedgeComponent
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService) {
		super();
	}
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		throw new Error('Method not implemented.');
	}
}
