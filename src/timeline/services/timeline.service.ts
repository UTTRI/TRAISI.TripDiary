import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TimelineState } from '../models/timeline-state.model';
import { TimelineConfiguration } from '../models/timeline-configuration.model';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

@Injectable()
export class TimelineService {
	private _configuration: ReplaySubject<TimelineConfiguration>;

	public get configuration(): ReplaySubject<TimelineConfiguration> {
		return this._configuration;
	}
	/**
	 *Creates an instance of TimelineService.
	 * @param {Store<TimelineState>} store
	 * @memberof TimelineService
	 */
	constructor(private store: Store<TimelineState>) {
        this.initializeConfiguration();

        let entry1: TimelineEntry = {
            address: "cat",
            latitude: 0,
            purpose: "work",
            longitude: 0,
            time: new Date()
        }

        let entry2: TimelineEntry = {
            address: "cat",
            latitude: 0,
            purpose: "home",
            longitude: 0,
            time: new Date()
        }

        this.availableLocations = new BehaviorSubject([
            entry1,
            entry2
        ]);
    }
    
    /**
     * Behaviour subject that contains the list of available timeline
     * entities for use (taken from the shelf)
     *
     * @type {BehaviorSubject<Array<TimelineEntry>>}
     * @memberof TimelineService
     */
    public availableLocations: BehaviorSubject<Array<TimelineEntry>>;

	/**
	 * Initialie the base configuration data
	 */
	private initializeConfiguration() {
		this._configuration = new ReplaySubject(1);

		let startTime: Date = new Date();
		let endTime: Date = new Date();
		startTime.setHours(4);
		startTime.setMinutes(0);

		endTime.setDate(endTime.getDate() + 1);
		endTime.setHours(3);
		endTime.setMinutes(59);
		this._configuration.next({
			startTime: startTime,
			endTime: new Date()
		});
	}
}
