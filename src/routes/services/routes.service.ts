import { Injectable, Inject } from '@angular/core';
import { SurveyResponder, SurveyViewer, ResponseTypes, GroupMember } from 'traisi-question-sdk';
import { ReplaySubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

@Injectable()
export class RoutesService {
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
}
