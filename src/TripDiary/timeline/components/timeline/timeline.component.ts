import { Component, OnInit, ElementRef } from "@angular/core";
import {
	SurveyViewer, QuestionConfiguration, SurveyResponder, SurveyQuestion,
	QuestionResponseState, TRAISI
} from 'traisi-question-sdk';
import { TimelineService } from "../../services/timeline.service";

@Component({
    selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent  extends TRAISI.SurveyQuestion implements OnInit 
{

    /**
     *Creates an instance of TimelineComponent.
     * @param {ElementRef} _element
     * @param {TimelineService} timelineService
     * @memberof TimelineComponent
     */
    constructor(private _element: ElementRef,
        private _timelineService: TimelineService)
    {
        super();
    }

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}