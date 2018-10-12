import { NgModule } from "@angular/core";
import './components/routes/v1/ts/index';
import { UpgradeModule } from '@angular/upgrade/static';
import { TripRouteModeDirective } from "routes/directives/trip-route-mode";
import {setAngularLib} from '@angular/upgrade/static';
import { BrowserModule } from "@angular/platform-browser";
import { TripDiaryModule } from "./components/routes/v1/ts/index";
import { RoutesComponent } from "./components/routes/routes.component";
import * as angular from 'angular';



@NgModule(
    {
        declarations: [
            TripRouteModeDirective,
            RoutesComponent
        ],
        entryComponents: [
            RoutesComponent
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
export default class RoutesModule {
    /**
     * 
     */
    constructor(private _upgrade: UpgradeModule) {
        setAngularLib(angular);
     }
    ngDoBootstrap() {


        
    }
}

