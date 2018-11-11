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
	ContentChildren
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import { BsModalRef, ModalDirective, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { NgTemplateOutlet } from '@angular/common';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';

@Component({
	selector: 'timeline-summary',
	template: require('./timeline-summary.component.html').toString(),
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

	private _timelineConfiguration: TimelineConfiguration;

	/**
	 *
	 * @param _timelineService
	 */
	constructor(private _timelineService: TimelineService) {
		this.timelineLocations = [];
		this.timeEntries = [];
		this.hours = [];
	}

	public ngAfterViewInit(): void {}

	/**
	 * ngOnInit method
	 */
	public ngOnInit(): void {
		this._timelineService.timelineLocations.subscribe((locations: Array<TimelineEntry>) => {
			this.timelineLocations = locations;
			this.timeEntries = [];

			

			for (let i = 0; i < locations.length; i++) {
				this.timeEntries.push({
					hours: locations[i].time.getHours() >= 12 ? locations[i].time.getHours() - 12 : locations[i].time.getHours(),
					minutes: locations[i].time.getMinutes(),
					am: locations[i].time.getHours() < 12 ? true : false
				});
			}
		});

		this._timelineService.configuration.subscribe((config) => {
			this._timelineConfiguration = config;

			let tempTime = new Date(config.startTime);
			while (tempTime < config.endTime) {
				this.hours.push(tempTime.getHours());
				tempTime.setHours(tempTime.getHours() + 1);
			}
			this.config = config;
		});
	}

	/**
	 *
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
		console.log(timeString);
		console.log(time);

		this.timelineLocations[index].time = time;
	}
}
