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
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import * as Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import templateString from './timeline-summary.component.html';

import { debounceTime } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
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

	@ViewChild('timeForm', { static: true })
	public inputForm: NgForm;

	/**
	 *
	 * @param _timelineService
	 * @param _formBuilder
	 */
	constructor(private _timelineService: TimelineService, private _formBuilder: FormBuilder) {
		this.timelineLocations = [];
		this.timeEntries = [];
		this.hours = [];
	}

	public ngAfterViewInit(): void {
		let timeInputs = (<any>Flatpickr)('.time-input', {
			enableTime: true,
			noCalendar: true,
			// defaultHour: 4,
			dateFormat: 'h:i K',
			defaultDate: null,
			onChange: (time, timeStr, instance) => {
				let index = parseInt(instance.element.dataset['index'], 10);
				let timeUpdate: Date = time[0];
				let start = new Date(this._timelineConfiguration.startTime);
				timeUpdate.setMonth(start.getMonth());
				timeUpdate.setFullYear(start.getFullYear());
				timeUpdate.setDate(start.getDate());

				if (timeUpdate.getHours() < 4 && timeUpdate.getHours() >= 0) {
					timeUpdate.setDate(timeUpdate.getDate() + 1);
				}
				this.timelineLocations[index].timeA = timeUpdate;
				this.update();
			}
		});

		if (Array.isArray(timeInputs)) {
			for (let i = 0; i < timeInputs.length; i++) {
				if (this.timelineLocations[i].timeA.getTime() > 0) {
					timeInputs[i].setDate(this.timelineLocations[i].timeA);
				}
			}
		} else {
			if (this.timelineLocations[0].timeA.getTime() > 0) {
				timeInputs.setDate(this.timelineLocations[0].timeA);
			}
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
			this._timelineService.updateTimeValidation();

			if (this._timelineService.isTimelineTimeStatevalid === true) {
				this.timeline.validationState.emit(ResponseValidationState.VALID);
			} else {
				this.timeline.validationState.emit(ResponseValidationState.INVALID);
			}

			// this.timeline.validationState.emit(ResponseValidationState.VALID);
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
			// this.inputForm.form.setErrors({ problem: true });
			if (this.timeline.isStep2) {
				this._timelineService.updateTimeValidation();
				if (this._timelineService.isTimelineTimeStatevalid) {
					this.timeline.validationState.emit(ResponseValidationState.VALID);
				} else {
					this.timeline.validationState.emit(ResponseValidationState.INVALID);
				}
			}
		});
	}

	public onSubmit(): void {
		console.log('submitted');
	}

	public validChange(event): void {}

	/**
	 * Updates time
	 * @param index
	 */
}
