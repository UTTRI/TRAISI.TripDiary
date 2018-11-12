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
	TimelineResponseData
} from 'traisi-question-sdk';
import { TimelineWedgeComponent } from '../timeline-wedge/timeline-wedge.component';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { QuestionLoaderService } from 'traisi-question-sdk';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { isRegExp } from 'util';
import { TimelineDockComponent } from '../timeline-dock/timeline-dock.component';

@Component({
	entryComponents: [TimelineWedgeComponent],
	selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()],
	providers: [TimelineService]
})
export class TimelineComponent extends SurveyQuestion<ResponseTypes.Timeline[]>
	implements OnInit, AfterViewInit, AfterViewChecked, OnVisibilityChanged {
	public editModel: TimelineEntry;

	@ViewChild(PopoverDirective)
	public popovers;

	@ViewChild(TemplateRef, { read: ViewContainerRef })
	public inputTemplate: ViewContainerRef;

	@ViewChild('newEntry')
	public newEntryDialog: TimelineNewEntryComponent;

	@ViewChild('timelineDock')
	public timelineDock: TimelineDockComponent;

	public isStep1: boolean = false;

	public isStep2: boolean = false;

	/**
	 *
	 * @param surveyViewerService
	 * @param _timelineService
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
	 * TRAISI life cycle called for when the question is prepared
	 */
	public traisiOnInit(): void {
		this.isStep1 = true;
		this.surveyViewerService.updateNavigationState(false);
		this._timelineService.clearAvailableLocations();

		this.surveyResponderService.listSurveyResponsesOfType(this.surveyId, ResponseTypes.Location).subscribe(result => {
			result.forEach(responses => {
				let purpose = JSON.parse(responses.configuration.purpose).id;

				let respondentName = responses.respondent.name;

				let locationName: string = respondentName === undefined ? purpose : respondentName + ' - ' + purpose;
				responses.responseValues.forEach(responseValue => {
					const element = responseValue;

					let location: TimelineEntry = {
						address: element.address,
						latitude: element.latitude,
						purpose: purpose !== undefined ? purpose : 'Prior Location',
						longitude: element.longitude,
						timeA: new Date(),
						timeB: new Date(),
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
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	public saveNewLocation(): void {}

	/**
	 *
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
		this.timelineDock.timelineNewEntry = this.newEntryDialog;
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

			return false;
		}

		return false;
	}

	/**
	 * Saves current response state
	 */
	private saveCurrentResponseState(): void {
		this._timelineService.timelineLocations.subscribe((entries: TimelineEntry[]) => {
			this.response.emit(entries);
		});
		// this.response.emit();
	}

	/**
	 * Override - signfies an internal navigation possible.
	 */
	public canNavigateInternalNext(): boolean {
		if (this.isStep2) {
			return true;
		} else {
			return this._timelineService.isTimelineStatevalid;
		}
	}

	/**
	 * Navigates internal previous
	 */
	public navigateInternalPrevious(): boolean {
		if (this.isStep2) {
			this.isStep2 = false;
			this.isStep1 = true;
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
		});
	};
}
