import { Injectable, TemplateRef, Inject, Injector, ViewContainerRef, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { TimelineConfiguration } from '../models/timeline-configuration.model';
import { ReplaySubject, BehaviorSubject, Subject, Observable } from '../shared/rxjs';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SurveyQuestion, SurveyViewer } from 'traisi-question-sdk';

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

	private _timelineTimeStateValid: boolean = false;

	private _hasAdjacentIdenticalLocations: boolean = false;

	private _isStartEndLocationsDifferent: boolean = false;

	public get isStartEndLocationsDifferent(): boolean {
		return this._isStartEndLocationsDifferent;
	}

	public get hasAdjacentIdenticalLocations(): boolean {
		return this._hasAdjacentIdenticalLocations;
	}

	public get isTimelineStatevalid(): boolean {
		return this._timelineStateValid;
	}

	public get isTimelineTimeStatevalid(): boolean {
		return this._timelineTimeStateValid;
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
	constructor(private modalService: BsModalService) {
		// this.initializeConfiguration();
		this._availableLocations = [];
		this._timelineLocations = [];

		this.availableLocations = new BehaviorSubject(this._availableLocations);
		this.timelineLocations = new BehaviorSubject(this._timelineLocations);
		this.timelineItemRemoved = new Subject<TimelineEntry>();
	}

	public init(configPurposes: []): void {
		this.initializeConfiguration(configPurposes);
	}

	/**
	 * Initialie the base configuration data
	 */
	private initializeConfiguration(configPurposes: []): void {
		this._configuration = new ReplaySubject(1);

		let startTime: Date = new Date();
		let endTime: Date = new Date();
		startTime.setDate(startTime.getDate() - 1);
		startTime.setHours(4);
		startTime.setMinutes(0);

		endTime.setDate(endTime.getDate());
		endTime.setHours(3);
		endTime.setMinutes(59);

		let purposes = [];

		if (configPurposes.length > 0) {
			for (let purpose of configPurposes) {
				purposes.push({
					key: purpose,
					label: purpose
				});
			}
		} else {
			purposes = [
				{ key: 'home', label: 'Home' },
				{ key: 'work', label: 'Work' },
				{ key: 'school', label: 'School' },
				{ key: 'daycare', label: 'Daycare' },
				{ key: 'facilitate_passenger', label: 'Facilitate Passenger' }
			];
		}

		this._configuration.next({
			startTime: startTime,
			endTime: endTime,
			purposes: purposes
		});
	}

	public updateIsStartEndLocationsDifferent(): void {
		if (this._timelineLocations.length < 2) {
			this._isStartEndLocationsDifferent = false;
		} else {
			if (
				this._timelineLocations[0].latitude !== this._timelineLocations[this._timelineLocations.length - 1].latitude &&
				this._timelineLocations[0].longitude !== this._timelineLocations[this._timelineLocations.length - 1].longitude
			) {
				this._isStartEndLocationsDifferent = true;
			} else {
				this._isStartEndLocationsDifferent = false;
			}
		}
	}

	/**
	 * Updates timeline location
	 * @param model
	 */
	public updateTimelineLocation(model: TimelineEntry): void {
		let entry: TimelineEntry = this._timelineLocations.find(s => s.id === model.id);

		entry.purpose = model.purpose;

		this.timelineLocations.next(this._timelineLocations);
	}

	/**
	 *
	 */
	public updateLocationValidation(): void {
		this._timelineStateValid = true;
		let hasAdjacentLocations: boolean = false;
		if (this._timelineLocations.length < 2) {
			this._timelineStateValid = false;
		} else if (
			this._timelineLocations[0].locationType !== TimelineLocationType.StartLocation ||
			this._timelineLocations[this._timelineLocations.length - 1].locationType !== TimelineLocationType.EndLocation
		) {
			this._timelineStateValid = false;
		}

		this._timelineLocations.forEach((location, index) => {
			if (index < this._timelineLocations.length - 1) {
				if (
					location.latitude === this._timelineLocations[index + 1].latitude &&
					location.longitude === this._timelineLocations[index + 1].longitude
				) {
					hasAdjacentLocations = true;
				}
			}
		});

		this._hasAdjacentIdenticalLocations = hasAdjacentLocations;
	}

	/**
	 * Determine validity of timeline locations by examining times.
	 */
	public updateTimeValidation(): boolean {
		console.log(this._timelineLocations);

		if (this._timelineLocations.length === 2 && this._timelineLocations[0].timeA.getFullYear() < 2000) {
			this._timelineTimeStateValid = false;
			return false;
		} else {
			for (let i = 0; i < this._timelineLocations.length - 2; i++) {
				if (this._timelineLocations[i].timeA.getFullYear() < 2000) {
					this._timelineTimeStateValid = false;
					return false;
				}

				if (this._timelineLocations[i + 1].timeA <= this._timelineLocations[i].timeA) {
					this._timelineTimeStateValid = false;
					return false;
				}
			}
		}

		this._timelineTimeStateValid = true;

		return true;
	}

	/**
	 * Removes entry from shelf
	 * @param entry
	 */
	public removeEntryFromShelf(entry: TimelineEntry): void {
		const index: number = this._availableLocations.findIndex(x => x.id === entry.id);

		if (index >= 0) {
			this._availableLocations.splice(index, 1);
			this.availableLocations.next(this._availableLocations);
		}
	}

	/**
	 * Edits shelf entry
	 * @param entry
	 */
	public editShelfEntry(entry: TimelineEntry): void {
		const index: number = this._availableLocations.findIndex(x => x.id === entry.id);
		if (index >= 0) {
			this._availableLocations[index] = entry;
		}
	}

	/**
	 *
	 * @param location
	 */
	public addShelfLocation(location: TimelineEntry, update: boolean = true): void {
		const index = this._availableLocations.findIndex(l => {
			return l.address === location.address;
		});
		if (index < 0) {
			this._availableLocations.push(location);
			if (update) {
				this.availableLocations.next(this._availableLocations);
			}
		}
	}

	/**
	 * Adds a new location to the list of dock items
	 * @param location
	 */
	public addTimelineLocation(location: TimelineEntry, index?: number, update: boolean = true): void {
		if (index === undefined) {
			this._timelineLocations.push(location);
			this.updateLocationValidation();
		} else {
			this._timelineLocations.splice(index, 0, location);
		}
		this.updateTimelineOrder();
		if (update) {
			this.timelineLocations.next(this._timelineLocations);
		}
		this.updateLocationValidation();
	}

	/**
	 *
	 */
	private updateTimelineOrder(): void {
		for (let i = 0; i < this._timelineLocations.length; i++) {
			this._timelineLocations[i].order = i;
		}
	}

	/**
	 *
	 *
	 * @memberof TimelineService
	 */
	public updateTimelineLocationsList(): void {
		this.timelineLocations.next(this._timelineLocations);
	}

	/**
	 * Reorders timeline location
	 * @param from
	 * @param to
	 */
	public reorderTimelineLocation(from: number, to: number) {
		this._timelineLocations.splice(to, 0, this._timelineLocations.splice(from, 1)[0]);
		this.timelineLocations.next(this._timelineLocations);
		this.updateLocationValidation();
	}

	/**
	 *
	 * @param location
	 */
	public removeTimelineLocation(location: TimelineEntry): void {
		let index: number = this._timelineLocations.findIndex(loc => {
			return loc.id === location.id;
		});

		if (index >= 0) {
			this._timelineLocations.splice(index, 1);
			this.timelineItemRemoved.next(location);
		}
		this.updateLocationValidation();
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
