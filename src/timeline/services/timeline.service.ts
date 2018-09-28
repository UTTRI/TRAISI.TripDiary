import { Injectable, TemplateRef, Inject, Injector, ViewContainerRef, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TimelineState } from '../models/timeline-state.model';
import { TimelineConfiguration } from '../models/timeline-configuration.model';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionLoaderService, SurveyQuestion } from 'traisi-question-sdk';
import { NgTemplateOutlet } from '@angular/common';
import { EventEmitter } from 'events';

@Injectable()
export class TimelineService {
	private _configuration: ReplaySubject<TimelineConfiguration>;

	public get configuration(): ReplaySubject<TimelineConfiguration> {
		return this._configuration;
	}

	private _availableLocations: Array<TimelineEntry>;
	private _dockLocations: Array<TimelineEntry>;

	/**
	 *
	 * @param store
	 * @param modalService
	 * @param injector
	 * @param _questionLoaderService
	 */
	constructor(
		private store: Store<TimelineState>,
		private modalService: BsModalService,
		private injector: Injector,
		private appRef: ApplicationRef,
		@Inject('QuestionLoaderService') private _questionLoaderService: QuestionLoaderService
	) {
		this.initializeConfiguration();
		this._availableLocations = [];
		this._dockLocations = [];

		let entry1: TimelineEntry = {
			address: '1783 Storrington Street',
			latitude: 0,
			purpose: 'work',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),
			id: Symbol(),
			name: 'My work place'
		};


		this._availableLocations.push(entry1);

		this.availableLocations = new BehaviorSubject(this._availableLocations);
		this.dockLocations = new BehaviorSubject(this._dockLocations);
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
	 * Behaviour subject that contains the list of available timeline
	 * entities for use (taken from the shelf)
	 *
	 * @type {BehaviorSubject<Array<TimelineEntry>>}
	 * @memberof TimelineService
	 */
	public dockLocations: BehaviorSubject<Array<TimelineEntry>>;

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

	/**
	 *
	 * @param location
	 */
	public addNewLocation(location: TimelineEntry) {
		this._availableLocations.push(location);
		this.availableLocations.next(this._availableLocations);
	}


	/**
	 * Adds a new location to the list of dock items
	 * @param location 
	 */
	public addLocationToDock(location: TimelineEntry)
	{
		this._dockLocations.push(location);
		this.dockLocations.next(this._availableLocations);
	}

	/**
	 * 
	 * @param location 
	 */
	public removeLocationFromDock(location: TimelineEntry)
	{
		var index = this._dockLocations.findIndex( s => {
			return s.id == location.id
		})
		console.log("splicing index: " + index);
		this._dockLocations.splice(index,1);
	}

	modalRef: BsModalRef;

	/**
	 *
	 * @param template
	 */
	openEditTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 *
	 * @param template
	 */
	openNewTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 *
	 * @param mapModalTemplate
	 * @param mapContainerRef
	 */
	openEditMapLocationModal(template: ViewContainerRef, callback) {
		let componentRef = null;

		let sub = this._questionLoaderService.componentFactories$.subscribe(factory => {
			if (factory.selector == 'traisi-map-question') {
				componentRef = template.createComponent(factory, undefined, this.injector);

				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;

				instance.response.subscribe(value => {
					callback(value);
				});
			}
		});
	}
}
