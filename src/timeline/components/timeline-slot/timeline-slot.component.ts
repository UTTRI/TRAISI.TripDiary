import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { faHome, faBriefcase, faSchool, faHandScissors, IconDefinition, faCarSide, faChild } from '../../shared/icons';

import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { IDropResult } from 'ngx-smooth-dnd';
import { TimelineDockComponent } from '../timeline-dock/timeline-dock.component';
@Component({
	selector: 'timeline-slot',
	template: require('./timeline-slot.component.html').toString(),
	styles: [require('./timeline-slot.component.scss').toString()]
})
export class TimelineSlotComponent implements OnInit {
	@Input()
	startLocation: boolean = false;

	@Input()
	endLocation: boolean = false;

	@Input()
	public timelineDock: TimelineDockComponent;

	hasTimelineEntryItem: boolean = false;

	homeIcon: IconDefinition = faHome;
	workIcon: IconDefinition = faBriefcase;
	schoolIcon: IconDefinition = faSchool;
	passenger: IconDefinition = faCarSide;
	daycare: IconDefinition = faChild;

	default: IconDefinition = faHandScissors;

	public dragOver: boolean = false;
	public model: TimelineEntry;
	public dragActive: boolean = false;

	public get icon() {
		if (this.model.purpose == 'home') {
			return this.homeIcon;
		} else if (this.model.purpose == 'work') {
			return this.workIcon;
		} else if (this.model.purpose == 'school') {
			return this.schoolIcon;
		} else if (this.model.purpose == 'daycare') {
			return this.daycare;
		} else if (this.model.purpose == 'facilitate_passenger') {
			return this.passenger;
		} else {
			return this.default;
		}
	}

	/**
	 *Creates an instance of TimelineSlotComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineSlotComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		this._timelineService.timelineLocations.subscribe((locations) => {
			locations.forEach((loc) => {
				if (loc.locationType == TimelineLocationType.StartLocation && this.startLocation) {
					this.addLocationToSlot(loc);
				} else if (loc.locationType == TimelineLocationType.EndLocation && this.endLocation) {
					this.addLocationToSlot(loc);
				}
			});
		});
	}

	/**
	 *
	 * @param location
	 */
	private addLocationToSlot(location: TimelineEntry) {
		this.model = location;
		this.hasTimelineEntryItem = true;
	}

	/**
	 *
	 * @param event
	 */
	public locationPlaced(event: DndDropEvent): void {
		this.model = event.data;
		this.hasTimelineEntryItem = true;
	}

	public delete(): void {
		this._timelineService.removeTimelineLocation(this.model);
		this.hasTimelineEntryItem = false;
		this.model = undefined;
	}

	/**
	 *
	 * @param dropResult
	 */
	public onDrop(dropResult: IDropResult): void {
		if (this.dragOver) {
			let model: TimelineEntry = Object.assign({}, dropResult.payload);
			model.id = Symbol();
			model.locationType = this.startLocation ? TimelineLocationType.StartLocation : TimelineLocationType.EndLocation;
			
			if (this.startLocation && model.purpose !== 'home') {
				this.timelineDock.popover.show();
			}
			this._timelineService.addTimelineLocation(model);
		}
		this.dragOver = false;
	}

	/**
	 *
	 * @param $event
	 */
	public onDragStart($event) {
		this.dragActive = true;
		this.dragOver = false;
	}

	/* */
	public onDragEnd($event) {
		this.dragActive = false;
	}

	public onDragEnter() {
		this.dragOver = true;
	}

	public onDragLeave() {
		this.dragOver = false;
	}
}
