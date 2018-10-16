import { Injectable, Inject } from '@angular/core';
import { SurveyResponder, SurveyViewer, ResponseTypes } from 'traisi-question-sdk';
import { ReplaySubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

@Injectable()
export class RoutesService {
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {}

	public listTimelineEntries(surveyId: number): any {
		return this._surveyResponderService.listSurveyResponsesOfType(surveyId, ResponseTypes.Timeline);
	}
}
