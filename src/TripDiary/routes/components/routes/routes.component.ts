import { Component, OnInit } from "@angular/core";
import {
	SurveyViewer, QuestionConfiguration, SurveyResponder, SurveyQuestion,
	QuestionResponseState, TRAISI
} from 'traisi-question-sdk';

@Component({
    selector: 'traisi-routes-question',
	template: require('./routes.component.html').toString(),
	styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent  extends TRAISI.SurveyQuestion implements OnInit 
{

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}