import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { TripDiaryModule } from './v1/ts';
import { ResponseTypes, SurveyQuestion, OnSurveyQuestionInit, SurveyResponder } from 'traisi-question-sdk';
import { RoutesService } from '../../services/routes.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

@Component({
	selector: 'traisi-routes-question',
	template: require('./routes.component.html').toString(),
	styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit, AfterViewInit {
	public typeName: string;
	public icon: string;

	/**
	 * View child of routes component
	 */
	@ViewChild('routesV1')
	private _routesV1: ElementRef;

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

		console.log('in constructor');
	}

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		this._surveyResponderService.listSurveyResponsesOfType(this.surveyId, ResponseTypes.Timeline).subscribe(responses => {
			console.log(responses);
		});
	}

	ngAfterViewInit(): void {}

	/**
	 * Bootstraps routes component
	 */
	public bootstrap(): void {}

	traisiOnLoaded() {}
}
