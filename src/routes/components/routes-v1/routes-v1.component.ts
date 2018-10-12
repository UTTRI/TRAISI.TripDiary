import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { UpgradeModule } from '@angular/upgrade/static';

import { ResponseTypes, SurveyQuestion,OnSurveyQuestionInit } from "traisi-question-sdk";
import { TripDiaryModule } from "../routes/v1/ts";
import { element } from "../../../node_modules/@angular/core/src/render3/instructions";

@Component({
    selector: 'traisi-routes-v1',
	template: require('./routes-v1.component.html').toString(),
	styles: [require('./routes-v1.component.scss').toString()]
})
export class RoutesV1Component implements OnInit
{
    public typeName: string;
    public icon: string;

    @ViewChild('div')
    divRef: ElementRef;

    /**
     * 
     */
    constructor(private _elementRef: ElementRef,
                private _upgrade: UpgradeModule)
    {
        
      
        
        
    }

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        //
        console.log(this._elementRef);
        new TripDiaryModule().bootstrap('test');

        setTimeout( () =>{
            this._upgrade.bootstrap(this.divRef.nativeElement, ['trips'], { strictDi: true });

            console.log('after bootstrap;)')
        })
    }

    /**
     * 
     */
    public bootstrap(){
        
    }


}