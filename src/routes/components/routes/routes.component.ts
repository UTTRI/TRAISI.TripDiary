import { Component, OnInit, ElementRef } from "@angular/core";
import { UpgradeModule } from '@angular/upgrade/static';
import { TripDiaryModule } from "./v1/ts";
import { ResponseTypes, SurveyQuestion } from "traisi-question-sdk";

@Component({
    selector: 'traisi-routes-question',
	template: require('./routes.component.html').toString(),
	styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent extends SurveyQuestion<ResponseTypes.Json>  implements OnInit 
{
    public typeName: string;
    public icon: string;

    /**
     * 
     */
    constructor(private _elementRef: ElementRef,
                private _upgrade: UpgradeModule)
    {
        super();
    }

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        this.bootstrap();
    }

    /**
     * 
     */
    public bootstrap(){
        new TripDiaryModule().bootstrap('test');
        this._upgrade.bootstrap(this._elementRef.nativeElement, ['trips'], { strictDi: true });
    }

}