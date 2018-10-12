import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { UpgradeModule } from '@angular/upgrade/static';
import { TripDiaryModule } from "./v1/ts";
import { ResponseTypes, SurveyQuestion, OnSurveyQuestionInit } from "traisi-question-sdk";

@Component({
    selector: 'traisi-routes-question',
    template: require('./routes.component.html').toString(),
    styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit, AfterViewInit {

    public typeName: string;
    public icon: string;

    @ViewChild('routesV1')
    private _routesV1: ElementRef;

    /**
     * 
     */
    constructor(private _elementRef: ElementRef,
        private _upgrade: UpgradeModule) {

        super();


        console.log('in constructor');
    }

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        //

        console.log(' in on init ');

        console.log(this._routesV1);

        

    }

    ngAfterViewInit(): void {



    }

    /**
     * 
     */
    public bootstrap() {

    }

    traisiOnLoaded() {

    }

}