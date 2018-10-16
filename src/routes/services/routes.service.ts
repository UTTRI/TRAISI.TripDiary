import { Injectable, Inject } from '@angular/core';
import { SurveyResponder, SurveyViewer } from 'traisi-question-sdk';
import { ReplaySubject } from 'timeline/shared/rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

@Injectable()
export class RoutesService {
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder
	) {}
}
