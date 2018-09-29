import { Injectable, TemplateRef, Inject, Injector, ViewContainerRef, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { TimelineState } from '../models/timeline-state.model';
import { TimelineConfiguration } from '../models/timeline-configuration.model';
import { ReplaySubject, BehaviorSubject, Subject, Observable } from '../shared/rxjs';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionLoaderService, SurveyQuestion, SurveyViewer } from 'traisi-question-sdk';

@Injectable()
export class TimelineService {
	private _configuration: ReplaySubject<TimelineConfiguration>;

	public get configuration(): ReplaySubject<TimelineConfiguration> {
		return this._configuration;
	}

	private _availableLocations: Array<TimelineEntry>;
	public modalRef: BsModalRef;

	private _timelineStartLocation: TimelineEntry;
	private _timelineLocations: Array<TimelineEntry>;
	private _timelineEndLocation: TimelineEntry;
	public timelineItemRemoved: Subject<TimelineEntry>;

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
	public timelineLocations: BehaviorSubject<Array<TimelineEntry>>;

	/**
	 *
	 * @param modalService
	 * @param injector
	 * @param surveyViewerService
	 * @param _questionLoaderService
	 */
	constructor(
		private modalService: BsModalService,
		private injector: Injector,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('QuestionLoaderService') private _questionLoaderService: QuestionLoaderService
	) {
		this.initializeConfiguration();
		this._availableLocations = [];
		this._timelineLocations = [];

		let entry1: TimelineEntry = {
			address: '1783 Storrington Street',
			latitude: 0,
			purpose: 'work',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),
			id: Symbol(),
			locationType: TimelineLocationType.Undefined,
			name: 'My work place'
		};

		this._availableLocations.push(entry1);
		this.availableLocations = new BehaviorSubject(this._availableLocations);
		this.timelineLocations = new BehaviorSubject(this._timelineLocations);
		this.timelineItemRemoved = new Subject<TimelineEntry>();
	}

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
	 * Updates the validation of the timeline
	 */
	private updateLocationsValidation() {
		if (this._timelineStartLocation != undefined && this._timelineEndLocation != undefined) {
			this.surveyViewerService.updateNavigationState(true);
		} else {
			this.surveyViewerService.updateNavigationState(false);
		}
	}

	/**
	 *
	 * @param timelineLocation
	 */
	public removeEntryFromTimeline(timelineLocation: TimelineEntry) {
		this.timelineItemRemoved.next(timelineLocation);
	}

	/**
	 *
	 */
	public updateTimelineLocations(locations: Array<TimelineEntry>): void {}

	/**
	 *
	 * @param location
	 */
	public addNewLocation(location: TimelineEntry) {
		this._availableLocations.push(location);
		this.availableLocations.next(this._availableLocations);
	}

	/**
	 *
	 * @param location
	 */
	public addStartLocation(location: TimelineEntry) {
		this._timelineStartLocation = location;
		this.updateLocationsValidation();
	}

	/**
	 *
	 * @param location
	 */
	public removeStartLocation() {
		this._timelineStartLocation = undefined;
		this.updateLocationsValidation();
	}

	/**
	 *
	 * @param location
	 */
	public addEndLocation(location: TimelineEntry) {
		this._timelineEndLocation = location;
		this.updateLocationsValidation();
	}

	/**
	 *
	 * @param location
	 */
	public removeEndLocation() {
		this._timelineEndLocation = undefined;
		this.updateLocationsValidation();
	}

	/**
	 * Adds a new location to the list of dock items
	 * @param location
	 */
	public addTimelineLocation(location: TimelineEntry) {
		this._timelineLocations.push(location);
		this.timelineLocations.next(this._availableLocations);
	}

	/**
	 *
	 * @param location
	 */
	public removeTimelineLocation(location: TimelineEntry) {
		this.timelineItemRemoved.next(location);
	}

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
