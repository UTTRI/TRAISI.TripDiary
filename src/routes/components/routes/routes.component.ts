import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, ViewEncapsulation } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { TripDiaryModule } from './v1/ts';
import { ResponseTypes, SurveyQuestion, OnSurveyQuestionInit, SurveyResponder } from 'traisi-question-sdk';
import { RoutesService } from '../../services/routes.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import templateString from './routes.component.html';
@Component({
	selector: 'traisi-routes-question',
	template: templateString,
	encapsulation: ViewEncapsulation.None,
	styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit, AfterViewInit {
	/**
	 * View child of routes component
	 */
	@ViewChild('routesV1', { static: true })
	private _routesV1: ElementRef;

	public displayClass = 'display-full';

	public timelineLocations: Array<TimelineEntry>;

	/**
	 * Creates an instance of routes component.
	 * @param _elementRef
	 * @param _upgrade
	 * @param _routesService
	 * @param _surveyResponderService
	 */
	constructor(
		private _elementRef: ElementRef,
		private _upgrade: UpgradeModule,
		private _routesService: RoutesService,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
	}

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		/* console.log(this.respondent);
		this._surveyResponderService.listSurveyResponsesOfType(this.surveyId, ResponseTypes.Timeline).subscribe(responses => {
			console.log(responses);
		}); */

		this._routesService.routesComponent = this;
	}

	ngAfterViewInit(): void {}

	/**
	 * Bootstraps routes component
	 */
	public bootstrap(): void {}

	public traisiOnLoaded(): void {}
}
