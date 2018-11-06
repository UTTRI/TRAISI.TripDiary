import { SurveyQuestion } from './survey-question';

export interface MultipageQuestion extends SurveyQuestion {
	activePageValid: boolean;

	value: any;

	pageChanged(selfRef: SurveyQuestion, page: number): boolean;
}
