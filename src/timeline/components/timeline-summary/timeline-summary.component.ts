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

import { faClock, IconDefinition } from '../../shared/icons';

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

	clockIcon: IconDefinition = faClock;

	/**
	 *
	 * @param _timelineService
	 */
	constructor(private _timelineService: TimelineService) {
		this.timelineLocations = [];
		this.hours = [];
	}

	ngAfterViewInit(): void {}

	/**
	 * ngOnInit method
	 */
	ngOnInit(): void {
		this._timelineService.timelineLocations.subscribe((locations: Array<TimelineEntry>) => {
			this.timelineLocations = locations;
		});

		this._timelineService.configuration.subscribe(config => {
			

			let tempTime = new Date(config.startTime);
			while (tempTime < config.endTime) {
				this.hours.push(tempTime.getHours());
				tempTime.setHours(tempTime.getHours() + 1);
			}
			this.config = config;
		});
	}
}
