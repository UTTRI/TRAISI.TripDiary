import { SurveyQuestion } from './survey-question';

export interface MultipageQuestion extends SurveyQuestion {
	pageChanged(selfRef: SurveyQuestion, page: number): boolean;

    activePageValid: boolean;
    
    public value: any;
}
