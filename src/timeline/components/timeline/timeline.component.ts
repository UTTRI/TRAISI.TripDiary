import {
	Component,
	OnInit,
	ElementRef,
	ComponentFactoryResolver,
	ViewChild,
	Inject,
	TemplateRef,
	ViewContainerRef,
	Injector,
	ContentChild,
	AfterViewInit,
	ContentChildren,
	QueryList,
	ViewChildren,
	AfterViewChecked
} from '@angular/core';

import { TimelineService } from '../../services/timeline.service';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyViewer,
	OnVisibilityChanged,
	SurveyResponder,
	ResponseData,
	TimelineResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';
import { TimelineWedgeComponent } from '../timeline-wedge/timeline-wedge.component';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { QuestionLoaderService } from 'traisi-question-sdk';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { isRegExp } from 'util';
import { TimelineDockComponent } from '../timeline-dock/timeline-dock.component';
import { SurveyQuestionInternalViewDirective } from 'traisi-question-sdk';
import { AfterContentInit } from '@angular/core';

@Component({
	entryComponents: [TimelineWedgeComponent],
	selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()],
	providers: [TimelineService]
})
export class TimelineComponent extends SurveyQuestion<ResponseTypes.Timeline[]>
	implements OnInit, AfterViewInit, AfterViewChecked, OnVisibilityChanged, AfterContentInit {
	public editModel: TimelineEntry;

	@ViewChild(PopoverDirective)
	public popovers;

	@ViewChild(TemplateRef, { read: ViewContainerRef })
	public inputTemplate: ViewContainerRef;

	@ViewChild('newEntry')
	public newEntryDialog: TimelineNewEntryComponent;

	@ViewChild('timelineDock')
	public timelineDock: TimelineDockComponent;

	@ViewChild('popover')
	public popover: PopoverDirective;

	@ViewChild('duplicateLocationPopTemplate')
	public confirmPurposeTemplate: TemplateRef<any>;

	@ViewChildren(SurveyQuestionInternalViewDirective)
	public interalViewChildren!: QueryList<SurveyQuestionInternalViewDirective>;

	public isStep1: boolean = false;

	public isStep2: boolean = false;

	/**
	 *Creates an instance of TimelineComponent.
	 * @param {SurveyViewer} surveyViewerService
	 * @param {SurveyResponder} surveyResponderService
	 * @param {TimelineService} _timelineService
	 * @memberof TimelineComponent
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder,
		private _timelineService: TimelineService
	) {
		super();

		this.isMultiPage = true;
	}

	/**
	 *
	 *
	 * @memberof TimelineComponent
	 */
	public ngAfterContentInit(): void {}

	/**
	 *
	 *
	 * @param {boolean} isPrevActionNext
	 * @memberof TimelineComponent
	 */
	public traisiOnInit(isPrevActionNext: boolean): void {
		// console.log('in on init ');
		// this.isStep1 = true;
		// this.surveyViewerService.updateNavigationState(false);
		this._timelineService.clearAvailableLocations();

		if (!isPrevActionNext) {
			this.isStep1 = false;
			this.isStep2 = true;
		} else {
			this.isStep1 = true;
			this.isStep2 = false;
		}

		this.surveyResponderService.listSurveyResponsesOfType(this.surveyId, ResponseTypes.Location).subscribe((result) => {
			result.forEach((responses) => {
				let purpose = JSON.parse(responses.configuration.purpose).id;

				let respondentName = responses.respondent.name;

				let locationName: string = respondentName === undefined ? purpose : respondentName + ' - ' + purpose;
				responses.responseValues.forEach((responseValue) => {
					const element = responseValue;

					let location: TimelineEntry = {
						address: element.address,
						latitude: element.latitude,
						purpose: purpose !== undefined ? purpose : 'Prior Location',
						longitude: element.longitude,
						timeA: new Date(1900, 0, 0, 0, 0, 0, 0),
						timeB: new Date(1900, 0, 0, 0, 0, 0, 0),
						pipedLocation: true,
						id: Symbol(),
						locationType: TimelineLocationType.Undefined,
						name: locationName
					};
					location.timeA.setHours(0);
					location.timeA.setMinutes(0);
					this._timelineService.addShelfLocation(location);
				});
			});
		});
	}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		this._timelineService.clearTimelineLocations();
		// this.isStep1 = true;
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 *
	 *
	 * @memberof TimelineComponent
	 */
	public saveNewLocation(): void {}

	/**
	 *
	 */
	/**
	 *
	 *
	 * @memberof TimelineComponent
	 */
	public addNewLocation(): void {
		this.newEntryDialog.show(this.newEntryCallback);
	}

	/**
	 * Callback - called when the new "location" entry process has completed.
	 * @param value
	 */
	public newEntryCallback = (value: any): void => {
		this._timelineService.addShelfLocation(value);
	};

	/**
	 *
	 * @param type
	 * @param $event
	 */
	public handler(type: string, $event: ModalDirective) {}

	/**
	 *
	 */
	public ngAfterViewInit(): void {
		if (this.timelineDock !== undefined) {
			this.timelineDock.timelineNewEntry = this.newEntryDialog;
		}

		console.log(this.interalViewChildren);
	}

	/**
	 *
	 */
	public ngAfterViewChecked(): void {}

	/**
	 * Navigates internal next
	 * @returns true if there are no more internal pages
	 */
	public navigateInternalNext(): boolean {
		if (this.isStep2) {
			return true;
		} else if (this.isStep1 && this._timelineService.isTimelineStatevalid) {
			this.isStep1 = false;
			this.isStep2 = true;
			this.saveCurrentResponseState();
			this.validationState.emit(ResponseValidationState.TOUCHED);

			return false;
		}

		return false;
	}

	/**
	 * Saves current response state
	 */
	private saveCurrentResponseState(): void {
		// this.response.emit();
	}

	/**
	 * Override - signfies an internal navigation possible.
	 */
	public canNavigateInternalNext(): boolean {
		if (this.isStep2) {
			return this._timelineService.isTimelineTimeStatevalid;
		} else {
			return this._timelineService.isTimelineStatevalid;
		}
	}

	/**
	 * Navigates internal previous
	 */
	public navigateInternalPrevious(): boolean {
		if (this.isStep2) {
			this._timelineService.updateLocationsValidation();
			this.isStep2 = false;
			this.isStep1 = true;
			if (this._timelineService.isTimelineStatevalid && !this._timelineService.hasAdjacentIdenticalLocations) {
				this.validationState.emit(ResponseValidationState.VALID);
			} else {
				// console.log('invalid');
				this.validationState.emit(ResponseValidationState.INVALID);
			}

			// console.log('here');

			return false;
		} else {
			return true;
		}
	}

	/**
	 *
	 */
	public canNavigateInternalPrevious(): boolean {
		return this.isStep2;
	}

	/**
	 * Determines whether question shown on
	 */
	public onQuestionShown(): void {
		this._timelineService.updateLocationsValidation();
		if (this.isStep1 && this._timelineService.isTimelineStatevalid) {
			// this.isStep1 = false;
			// this.isStep2 = true;
		}
	}
	public onQuestionHidden(): void {}

	public closePopover(): void {
		this.popover.hide();
	}

	/**
	 *
	 *
	 * @param {('none' | ResponseData<ResponseTypes.Timeline>[])} response
	 */
	private onSavedResponseData: (response: 'none' | ResponseData<ResponseTypes.Timeline>[]) => void = (
		response: 'none' | ResponseData<ResponseTypes.Timeline>[]
	) => {
		let location: TimelineEntry = {
			address: undefined,
			latitude: undefined,
			purpose: undefined,
			longitude: undefined,
			timeA: new Date(),
			timeB: new Date(),
			id: Symbol(),
			pipedLocation: true,
			locationType: TimelineLocationType.Undefined,
			name: 'Prior Location'
		};
		if (response instanceof Array) {
			if (response.length >= 1) {
				const timelineResponse = <TimelineResponseData>response[0];
				location.locationType = TimelineLocationType.StartLocation;
				location.address = timelineResponse.address;
				location.latitude = timelineResponse.latitude;
				location.longitude = timelineResponse.longitude;
				location.purpose = timelineResponse.purpose;
				location.name = timelineResponse.name;
				location.timeA = new Date(timelineResponse.timeA);
				location.timeB = new Date(timelineResponse.timeB);
				this._timelineService.addTimelineLocation(location);
				this._timelineService.addShelfLocation(location);
			}
			if (response.length >= 2) {
				location = Object.assign({}, location);
				location.id = Symbol();
				const timelineResponse = <TimelineResponseData>response[response.length - 1];
				location.locationType = TimelineLocationType.EndLocation;
				location.address = timelineResponse.address;
				location.latitude = timelineResponse.latitude;
				location.longitude = timelineResponse.longitude;
				location.purpose = timelineResponse.purpose;
				location.name = timelineResponse.name;
				location.timeA = new Date(timelineResponse.timeA);
				location.timeB = new Date(timelineResponse.timeB);
				this._timelineService.addTimelineLocation(location);
				this._timelineService.addShelfLocation(location);
			}

			if (response.length >= 3) {
				const midResponses = response.slice(1, response.length - 1);

				midResponses.forEach((entry, index) => {
					location = Object.assign({}, location);
					location.id = Symbol();
					const timelineResponse = <TimelineResponseData>entry;
					location.locationType = TimelineLocationType.IntermediateLocation;
					location.address = timelineResponse.address;
					location.latitude = timelineResponse.latitude;
					location.longitude = timelineResponse.longitude;
					location.purpose = timelineResponse.purpose;
					location.timeA = new Date(timelineResponse.timeA);
					location.timeB = new Date(timelineResponse.timeB);
					location.name = timelineResponse.name;
					this._timelineService.addTimelineLocation(location, index + 1);
					this._timelineService.addShelfLocation(location);
				});
			}
		}

		this._timelineService.timelineLocations.subscribe((entries: TimelineEntry[]) => {
			this.response.emit(entries);
			this._timelineService.updateLocationsValidation();
			this._timelineService.updateLocationsTimeValidation();

			if (this.isStep1) {
				if (this._timelineService.hasAdjacentIdenticalLocations) {
					this.popover.show();
				} else {
					this.popover.hide();
				}
				if (this._timelineService.isTimelineStatevalid && !this._timelineService.hasAdjacentIdenticalLocations) {
					this.validationState.emit(ResponseValidationState.VALID);
				} else {
					this.validationState.emit(ResponseValidationState.INVALID);
				}
			} else if (this.isStep2) {
				if (this._timelineService.isTimelineTimeStatevalid) {
					this.validationState.emit(ResponseValidationState.VALID);
				}
			} else if (!this._timelineService.isTimelineTimeStatevalid) {
				this.validationState.emit(ResponseValidationState.INVALID);
			}
		});
	};
}
