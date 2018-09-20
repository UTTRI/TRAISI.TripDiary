import { Injectable } from "@angular/core";
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import { TimelineState } from "../models/timeline-state.model";
import { TimelineConfiguration } from "../models/timeline-configuration.model";

@Injectable()
export class TimelineService
{

    private _configuration: TimelineConfiguration;

    public get configuration(): TimelineConfiguration
    {
        return this._configuration;
    }
    /**
     *Creates an instance of TimelineService.
     * @param {Store<TimelineState>} store
     * @memberof TimelineService
     */
    constructor(private store: Store<TimelineState>)
    {
        this.initializeConfiguration();
    }

    /**
     * Initialie the base configuration data
     */
    private initializeConfiguration()
    {
        this._configuration = {
            startTime: new Date(),
            endTime: new Date(),

        }
    }
}