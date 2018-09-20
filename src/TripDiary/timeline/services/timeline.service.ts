import { Injectable } from "@angular/core";
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import { TimelineState } from "../models/timeline-state.model";

@Injectable()
export class TimelineService
{

    /**
     *Creates an instance of TimelineService.
     * @param {Store<TimelineState>} store
     * @memberof TimelineService
     */
    constructor(private store: Store<TimelineState>)
    {

    }
}