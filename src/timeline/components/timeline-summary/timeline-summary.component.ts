import {
	Component,
	OnInit,
	ElementRef,
	Input,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	QueryList,
	ViewChildren,
	AfterViewInit,
	ContentChildren,
	ViewEncapsulation
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import { TimelineConfiguration } from '../../models/timeline-configuration.model';
import { TimelineComponent } from '../timeline/timeline.component';
import { ResponseValidationState } from 'traisi-question-sdk';
import { NgForm } from '@angular/forms';
import * as Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import templateString from './timeline-summary.component.html';

import { debounceTime } from 'rxjs/operators';
@Component({
	selector: 'timeline-summary',
	template: templateString,

	encapsulation: ViewEncapsulation.None,
	styles: [require('./timeline-summary.component.scss').toString()]
})
export class TimelineSummaryComponent implements OnInit, AfterViewInit {
	/**
	 * List of timeline locations
	 */
	public timelineLocations: Array<TimelineEntry>;

	public hours: Array<any>;

	public config: TimelineConfiguration;

	public timeEntries: Array<{ hours: number; minutes: number; am: boolean }>;

	public times: Array<Date>;

	private _timelineConfiguration: TimelineConfiguration;

	@Input()
	public timeline: TimelineComponent;

	@ViewChild('f', { static: true })
	public inputForm: NgForm;

	/**
	 *
	 * @param _timelineService
	 */
	constructor(private _timelineService: TimelineService) {
		this.timelineLocations = [];
		this.timeEntries = [];
		this.hours = [];
	}

	public ngAfterViewInit(): void {
		console.log(this._timelineConfiguration);
		let timeInputs = (<any>Flatpickr)('.time-input', {
			enableTime: true,
			noCalendar: true,
			defaultHour: 4,
			dateFormat: 'h:i K',
			minDate: new Date(this._timelineConfiguration.startTime),

			// defaultDate: '00:00',
			onChange: (time, timeStr, instance) => {
				let index = parseInt(instance.element.dataset['index'], 10);
				this.timelineLocations[index].timeA = time[0];
				this.update();
			}
		});

		if (Array.isArray(timeInputs)) {
			for (let i = 0; i < timeInputs.length; i++) {
				timeInputs[i].setDate(this.timelineLocations[i].timeA);
			}
		} else {
			timeInputs.setDate(this.timelineLocations[0].timeA);
		}
		setTimeout(() => {
			this.updateValidation();
		});
	}

	public update = (): void => {
		this.timeline.response.emit(this.timelineLocations);
		this.updateValidation();
	};

	private updateValidation(): void {
		if (this.timeline.isStep2) {
			this._timelineService.updateLocationsTimeValidation();
			console.log(this.timelineLocations);
			if (this._timelineService.isTimelineTimeStatevalid === true) {
				console.log('sending valid');
				this.timeline.validationState.emit(ResponseValidationState.VALID);
			} else {
				console.log('sending invalid');
				this.timeline.validationState.emit(ResponseValidationState.INVALID);
			}

			this.timeline.validationState.emit(ResponseValidationState.VALID);
		}
	}

	/**
	 * ngOnInit method
	 */
	public ngOnInit(): void {
		this._timelineService.timelineLocations.subscribe((locations: Array<TimelineEntry>) => {
			this.timelineLocations = locations;
			this.timeEntries = [];
			this.times = [];

			for (let i = 0; i < locations.length; i++) {
				this.times.push(new Date());
				this.timeEntries.push({
					hours: locations[i].timeA.getHours() >= 12 ? locations[i].timeA.getHours() - 12 : locations[i].timeA.getHours(),
					minutes: locations[i].timeA.getMinutes(),
					am: locations[i].timeA.getHours() < 12 ? true : false
				});
			}
		});

		this._timelineService.configuration.subscribe(config => {
			this._timelineConfiguration = config;

			let tempTime = new Date(config.startTime);
			while (tempTime < config.endTime) {
				this.hours.push(tempTime.getHours());
				tempTime.setHours(tempTime.getHours() + 1);
			}
			this.config = config;
		});


		this.inputForm.valueChanges.pipe(debounceTime(200)).subscribe(value => {
			this.timeline.response.emit(this.timelineLocations);

			if (this.timeline.isStep2) {
				this._timelineService.updateLocationsTimeValidation();
				if (this._timelineService.isTimelineTimeStatevalid) {
					this.timeline.validationState.emit(ResponseValidationState.VALID);
				} else {
					this.timeline.validationState.emit(ResponseValidationState.INVALID);
				}
			}
		});
	}

	public validChange(event): void {}

	/**
	 * Updates time
	 * @param index
	 */
	public updateTime(index: number) {
		let timeString = `${this.timeEntries[index].hours}:${this.timeEntries[index].minutes} ${this.timeEntries[index].am ? 'AM' : 'PM'}`;
		let time = new Date(0, 0, 0, this.timeEntries[index].hours, this.timeEntries[index].minutes, 0);

		time.setFullYear(this._timelineConfiguration.startTime.getFullYear());
		time.setMonth(this._timelineConfiguration.startTime.getMonth());
		time.setDate(this._timelineConfiguration.startTime.getDate());
		if (!this.timeEntries[index].am) {
			time.setHours(time.getHours() + 12);
		}

		this.timelineLocations[index].timeA = time;

		// this._timelineService.updateLocationsValidation();
		this._timelineService.updateLocationsTimeValidation();
		if (this._timelineService.isTimelineTimeStatevalid) {
			this.timeline.validationState.emit(ResponseValidationState.VALID);
		} else {
			this.timeline.validationState.emit(ResponseValidationState.INVALID);
		}
		this.timeline.response.emit(this.timelineLocations);
	}
}
