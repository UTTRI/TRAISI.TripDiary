

import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { DndDropEvent } from 'ngx-drag-drop';

import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
import { DropResult } from 'ngx-smooth-dnd';
import { TimelineDockComponent } from '../timeline-dock/timeline-dock.component';
import iconMap from 'shared/icon-map';
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

	public dragOver: boolean = false;
	public model: TimelineEntry;
	public dragActive: boolean = false;

	public get icon() {
		return iconMap[this.model.purpose];
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
		this._timelineService.timelineLocations.subscribe(locations => {
			locations.forEach(loc => {
				if (loc.locationType === TimelineLocationType.StartLocation && this.startLocation) {
					this.addLocationToSlot(loc);
				} else if (loc.locationType === TimelineLocationType.EndLocation && this.endLocation) {
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

	/**
	 * Deletes timeline slot component
	 */
	public delete(): void {
		this._timelineService.removeTimelineLocation(this.model);
		this.hasTimelineEntryItem = false;
		this.model = undefined;
	}

	/**
	 *
	 * @param dropResult
	 */
	public onDrop(dropResult: DropResult): void {
		if (this.dragOver) {
			let model: TimelineEntry = Object.assign({}, dropResult.payload);

			model.id = Symbol();
			model.locationType = this.startLocation ? TimelineLocationType.StartLocation : TimelineLocationType.EndLocation;

			if (this.startLocation && model.purpose !== 'home') {
				this.timelineDock.popover.show();
			}

			if (model.locationType === TimelineLocationType.StartLocation) {
				this._timelineService.addTimelineLocation(model, 0);
			} else {
				this._timelineService.addTimelineLocation(model);
			}

			this._timelineService.updateIsStartEndLocationsDifferent();

			if (this._timelineService.isStartEndLocationsDifferent) {
				this.timelineDock.endPopover.show();
			}
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
