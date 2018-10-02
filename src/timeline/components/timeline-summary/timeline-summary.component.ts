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


	clockIcon: IconDefinition = faClock;

	/**
	 * 
	 * @param _timelineService 
	 */
	constructor(private _timelineService: TimelineService)
	{
		this.timelineLocations = [];


	}

	ngAfterViewInit(): void {

	}
	
	/**
	 * ngOnInit method
	 */
	ngOnInit(): void {
		this._timelineService.timelineLocations.subscribe( (locations: Array<TimelineEntry>) => {

			this.timelineLocations = locations;

		});

		this._timelineService.configuration.subscribe( config => {
			console.log("sub got config");
			console.log(config);
		})

	}
}
