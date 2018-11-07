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

	private _timelineLocations: Array<TimelineEntry>;

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

	private _timelineStateValid: boolean = false;

	public get isTimelineStatevalid(): boolean {
		return this._timelineStateValid;
	}

	public clearAvailableLocations() {
		this._availableLocations = [];
		this.availableLocations.next(this._availableLocations);
	}

	public clearTimelineLocations() {
		this._timelineLocations = [];
		this.timelineLocations.next(this._timelineLocations);
	}

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

		this.availableLocations = new BehaviorSubject(this._availableLocations);
		this.timelineLocations = new BehaviorSubject(this._timelineLocations);
		this.timelineItemRemoved = new Subject<TimelineEntry>();
	}

	/**
	 * Initialie the base configuration data
	 */
	private initializeConfiguration(): void {
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
			endTime: endTime,
			purposes: [
				{ key: 'home', label: 'Home' },
				{ key: 'work', label: 'Work' },
				{ key: 'school', label: 'School' },
				{ key: 'daycare', label: 'Daycare' },
				{ key: 'facilitate_passenger', label: 'Facilitate Passenger' }
			]
		});
	}

	/**
	 * Updates timeline location
	 * @param model
	 */
	public updateTimelineLocation(model: TimelineEntry): void {
		let entry: TimelineEntry = this._timelineLocations.find((s) => s.id === model.id);

		entry.purpose = model.purpose;

		this.timelineLocations.next(this._timelineLocations);
	}

	/**
	 * Updates the validation of the timeline
	 */
	public updateLocationsValidation(): void {
		let hasStartLocation: boolean = false;
		let hasEndLocation: boolean = false;
		this._timelineLocations.forEach((location) => {
			if (location.locationType === TimelineLocationType.StartLocation) {
				hasStartLocation = true;
			} else if (location.locationType === TimelineLocationType.EndLocation) {
				hasEndLocation = true;
			}
		});
		this._timelineStateValid = hasStartLocation && hasEndLocation;

		this.surveyViewerService.updateNavigationState(this._timelineStateValid);
	}

	/**
	 *
	 * @param timelineLocation
	 */
	public removeEntryFromTimeline(timelineLocation: TimelineEntry) {
		this.timelineItemRemoved.next(timelineLocation);
	}

	/**
	 * Removes entry from shelf
	 * @param entry
	 */
	public removeEntryFromShelf(entry: TimelineEntry): void {
		const index: number = this._availableLocations.findIndex((x) => x.id === entry.id);

		if (index >= 0) {
			this._availableLocations.splice(index, 1);
			this.availableLocations.next(this._availableLocations);
		}
	}

	/**
	 *
	 */
	public updateTimelineLocations(locations: Array<TimelineEntry>): void {}

	/**
	 *
	 * @param location
	 */
	public addShelfLocation(location: TimelineEntry) {
		this._availableLocations.push(location);
		this.availableLocations.next(this._availableLocations);
	}

	/**
	 * Adds a new location to the list of dock items
	 * @param location
	 */
	public addTimelineLocation(location: TimelineEntry): void {
		this._timelineLocations.push(location);
		this.updateLocationsValidation();

		this.timelineLocations.next(this._timelineLocations);
	}

	/**
	 *
	 * @param location
	 */
	public removeTimelineLocation(location: TimelineEntry): void {
		let index: number = this._timelineLocations.findIndex((loc) => {
			return loc.id === location.id;
		});

		this._timelineLocations.splice(index, 1);
		this.timelineItemRemoved.next(location);
		this.updateLocationsValidation();

		this.timelineLocations.next(this._timelineLocations);
	}

	/**
	 *
	 * @param template
	 */
	public openEditTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 *
	 * @param template
	 */
	public openNewTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 *
	 * @param mapModalTemplate
	 * @param mapContainerRef
	 */
	public openEditMapLocationModal(template: ViewContainerRef, callback): void {}
}
