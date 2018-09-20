import { Component, OnInit } from "@angular/core";
import {
	SurveyViewer, QuestionConfiguration, SurveyResponder, SurveyQuestion,
	QuestionResponseState, TRAISI
} from 'traisi-question-sdk';

@Component({
    selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent  extends TRAISI.SurveyQuestion implements OnInit 
{

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}