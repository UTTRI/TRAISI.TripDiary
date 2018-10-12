import { NgModule, ElementRef } from "@angular/core";
import './components/routes/v1/ts/index';
import { UpgradeModule } from '@angular/upgrade/static';
import { TripRouteModeDirective } from "routes/directives/trip-route-mode.directive";
import { setAngularLib } from '@angular/upgrade/static';
import { BrowserModule } from "@angular/platform-browser";
import { TripDiaryModule } from "./components/routes/v1/ts/index";
import { RoutesComponent } from "./components/routes/routes.component";
import * as angular from 'angular';
import { RoutesV1Component } from "./components/routes-v1/routes-v1.component";
import { SurveyModule, SurveyQuestion, ResponseTypes } from "traisi-question-sdk";



@NgModule(
    {
        declarations: [
            RoutesComponent,
            RoutesV1Component,
            TripRouteModeDirective
        ],
        entryComponents: [
            RoutesComponent,
            RoutesV1Component,
        ],

        imports: [
            UpgradeModule
        ], providers: [
            {
                provide: 'widgets',
                useValue: [
                    {
                        name: 'traisi-routes-question',
                        id: 'trip-diary-routes',
                        component: RoutesComponent
                    }
                ],
                multi: true
            },

        ],

    }
)
export default class RoutesModule extends SurveyModule {
    /**
     * 
     */
    constructor(private _upgrade: UpgradeModule) {
        super();
        setAngularLib(angular);


    }
    ngDoBootstrap() {
        console.log('in ng do bootstrap');




    }

    public traisiBootstrap<T extends ResponseTypes>(component: SurveyQuestion<T>) {

        console.log('in traisi do bootstrap');
    }


}

