import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
	selector: 'timeline-new-entry',
	template: require('./timeline-new-entry.component.html').toString(),
	styles: [require('./timeline-new-entry.component.scss').toString()]
})
export class TimelineNewEntryComponent implements OnInit {
	modalRef: ModalDirective;

	@ViewChild('newEntryModal')
	newTimelineEntryTemplateRef: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	mapTemplate: ViewContainerRef;

	stepOne: boolean = true;
	stepTwo: boolean = false;
	stepThree: boolean = false;

	model: TimelineEntry;

	/**
	 *
	 * @param timelineService
	 */
	constructor(private timelineService: TimelineService) {}

	saveCallback: (value: any) => void;

	/**
	 *
	 * @param callback
	 */
	show(callback: (value: any) => void): void {
		console.log(this.mapTemplate);
		this.timelineService.openEditMapLocationModal(this.mapTemplate, this.callback);

		this.saveCallback = callback;

		this.newTimelineEntryTemplateRef.show();

		this.model = {
			address: '',
			latitude: 0,
			purpose: '',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),
			name: '',
			locationType: TimelineLocationType.Undefined,
			id: Symbol()
		};
	}

	stepTwoPrevious(): void {
		this.stepOne = true;
		this.stepTwo = false;
	}

	stepOneNext(): void {
		this.stepOne = false;
		this.stepTwo = true;
	}

	/**
	 *
	 * @param value
	 */
	public callback = (value: any): void => {
		this.model.address = value.address;
		this.model.latitude = value.latitude;
		this.model.longitude = value.longitude;
	};

	stepTwoNext(): void {
		this.stepThree = true;
		this.stepTwo = false;
	}

	stepThreePrevious(): void {
		this.stepThree = false;
		this.stepTwo = true;
	}

	stepThreeNext(): void {
		console.log(this.model);
		this.saveCallback(this.model);
		this.newTimelineEntryTemplateRef.hide();
	}

	ngOnInit(): void {}
}
