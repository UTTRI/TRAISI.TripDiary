import { Injectable, Inject } from '@angular/core';
import { SurveyResponder, SurveyViewer, ResponseTypes, GroupMember, ResponseData, ResponseValidationState } from 'traisi-question-sdk';
import { ReplaySubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { RoutesComponent } from '../components/routes/routes.component';
import { TripRoute } from '../components/routes/v1/ts/trip-route';

@Injectable()
export class RoutesService {
	public routesComponent: RoutesComponent;

	/**
	 *Creates an instance of RoutesService.
	 * @param {SurveyViewer} _surveyViewerService
	 * @param {SurveyResponder} _surveyResponderService
	 * @memberof RoutesService
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) { }

	/**
	 *
	 *
	 * @param {number} surveyId
	 * @param {GroupMember} respondent
	 * @returns {*}
	 * @memberof RoutesService
	 */
	public listTimelineEntries(surveyId: number, respondent: GroupMember): any {
		let responses = this._surveyResponderService.listSurveyResponsesOfType(surveyId, ResponseTypes.Timeline);
		if (respondent === undefined) {
			return responses;
		} else {
			return responses;
		}
	}

	/**
	 *
	 *
	 * @returns {*}
	 * @memberof RoutesService
	 */
	public savedResponse(): any {
		return this.routesComponent.savedResponse;
	}

	/**
	 * Saves routes
	 * @param value 
	 */
	public saveRoutes(value: Array<TripRoute>): void {

		this.routesComponent.response.emit(value);
	}

	/**
	 * Updates validation state
	 * @param value 
	 */
	public updateValidationState(value: ResponseValidationState): void {
		this.routesComponent.validationState.emit(value);
	}
}
