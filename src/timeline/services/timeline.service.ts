import { Injectable } from "@angular/core";
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import { TimelineState } from "../models/timeline-state.model";
import { TimelineConfiguration } from "../models/timeline-configuration.model";
import { ReplaySubject } from "rxjs";

@Injectable()
export class TimelineService
{

    private _configuration: ReplaySubject<TimelineConfiguration>;

    public get configuration(): ReplaySubject<TimelineConfiguration>
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
		this._configuration = new ReplaySubject(1);
		
		let startTime:Date = new Date();
		let endTime:Date = new Date();
		startTime.setHours(4);
		startTime.setMinutes(0);

		endTime.setDate(endTime.getDate()+1);
		endTime.setHours(3);
		endTime.setMinutes(59);
        this._configuration.next( {
            startTime: startTime,
            endTime: new Date(),

        });
    }
}