import { Injectable, Inject } from '@angular/core';
import { SurveyViewer, ResponseTypes, GroupMember, ResponseValidationState, SurveyResponseService } from 'traisi-question-sdk';
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
		@Inject('SurveyResponseService') private _responseService: SurveyResponseService
	) {}

	/**
	 *
	 *
	 * @param {number} surveyId
	 * @param {GroupMember} respondent
	 * @returns {*}
	 * @memberof RoutesService
	 */
	public listTimelineEntries(surveyId: number, respondent: GroupMember): any {
		let responses = this._responseService.listSurveyResponsesOfType(surveyId, ResponseTypes.Timeline);
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
