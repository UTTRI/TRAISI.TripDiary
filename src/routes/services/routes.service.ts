import { Injectable, Inject } from '@angular/core';
import { SurveyResponder, SurveyViewer, ResponseTypes, GroupMember } from 'traisi-question-sdk';
import { ReplaySubject, Observable } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { RoutesComponent } from '../components/routes/routes.component';

@Injectable()
export class RoutesService {
	public routesComponent: RoutesComponent;

	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {}

	public listTimelineEntries(surveyId: number, respondent: GroupMember): any {
		let responses = this._surveyResponderService.listSurveyResponsesOfType(surveyId, ResponseTypes.Timeline);
		if (respondent === undefined) {
			return responses;
		} else {
			return responses;
		}
	}

	public savedResponse(): Observable<any> {

		return this.routesComponent.savedResponse;
	}

	/**
	 * Saves routes
	 * @param value
	 */
	public saveRoutes(value: any): void {

		this.routesComponent.response.emit(value);
	}
}
