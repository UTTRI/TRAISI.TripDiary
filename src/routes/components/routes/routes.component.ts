import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ResponseTypes, SurveyQuestion } from 'traisi-question-sdk';
import { RoutesService } from '../../services/routes.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import templateString from './routes.component.html';
import styleString from './routes.component.scss';
@Component({
	selector: 'traisi-routes-question',
	template: '' + templateString,
	encapsulation: ViewEncapsulation.None,
	styles: ['' + styleString],
})
export class RoutesComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit, AfterViewInit {

	public displayClass = 'display-full';

	public timelineLocations: Array<TimelineEntry>;

	/**
	 * Creates an instance of routes component.
	 * @param _elementRef
	 * @param _upgrade
	 * @param _routesService
	 * @param _surveyResponderService
	 */
	constructor(private _routesService: RoutesService) {
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
