import {
    Component,
    OnInit,
    ElementRef,
    ComponentFactoryResolver,
} from '@angular/core';

import {TimelineService} from '../../services/timeline.service';
import {TRAISI} from 'traisi-question-sdk';
import {TimelineWedgeComponent} from "../timeline-wedge/timeline-wedge.component";

@Component({
    entryComponents: [TimelineWedgeComponent],
    selector: 'traisi-timeline-question',
    template: require('./timeline.component.html').toString(),
    styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Timeline> implements OnInit {

    typeName: string;
    icon: string;


    /**
     *Creates an instance of TimelineComponent.
     * @param {ElementRef} _element
     * @param {TimelineService} timelineService
     * @memberof TimelineComponent
     */
    constructor(private _element: ElementRef, private _timelineService: TimelineService,
                private resolver: ComponentFactoryResolver) {
        super();
        this.typeName = "Trip Diary Timeline";
        this.icon = "business-time";
        const f = this.resolver.resolveComponentFactory(TimelineWedgeComponent);
        
        console.debug("in constructor of timeline component");
        console.log("in constructor of timeline component");

    }

    /**
     * TRAISI life cycle called for when the question is prepared
     */
    traisiOnInit(): void {
        console.log('TRAISI: traisiOnInit called');
    }

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {


        console.log("just testing  console log2");
    }
}
