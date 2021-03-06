import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild, ViewChildren, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { DropResult } from 'ngx-smooth-dnd';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';

import templateString from './timeline-dock.component.html';
import { PopperComponent } from 'angular-popper';

@Component({
	selector: 'timeline-dock',
	template: templateString,
	encapsulation: ViewEncapsulation.None,
	styles: [require('./timeline-dock.component.scss')]
})
export class TimelineDockComponent implements OnInit {
	typeName: string;
	icon: string;

	public dockItems: Array<TimelineEntry>;

	public dragOver: boolean = false;

	public dragActive: boolean = false;

	public timelineNewEntry: TimelineNewEntryComponent;

	public configuration: TimelineConfiguration;

	public sub: Subscription;

	/* @ViewChild('startSlotPopover')
	public startSlotPopover: PopoverDirective; */

	@ViewChild('confirmPurposeTemplate', { static: true })
	public confirmPurposeTemplate: TemplateRef<any>;

	private _tempEntry: TimelineEntry;

	private _tempDropResult: DropResult;

	private _modelRef: BsModalRef;

	private _locations: Array<TimelineEntry>;

	public pipedPurpose: string;

	public title: string = 'Confirm Location';

	public showPlaceholder = false;

	@ViewChild('popover', { static: true })
	public popover: PopoverDirective;

	@ViewChild('endPopover', { static: true })
	public endPopover: PopoverDirective;

	public hasStartLocation: boolean = false;
	public hasEndLocation: boolean = false;

	public shouldShowPlaceholder(): void {
		let hasStart = false;
		let hasEnd = false;

		this._locations.forEach(v => {
			if (v.locationType === TimelineLocationType.EndLocation) {
				hasEnd = true;
			} else if (v.locationType === TimelineLocationType.StartLocation) {
				hasStart = true;
			}
		});

		if (this.dockItems.length === 0 && hasStart && hasEnd) {
			this.showPlaceholder = true;
		} else {
			this.showPlaceholder = false;
		}
	}

	/**
	 *
	 * @param _element
	 * @param timelineService 
	 */
	constructor(
		private _element: ElementRef,
		private timelineService: TimelineService,
		private _modalService: BsModalService,
		private _cdr: ChangeDetectorRef
	) {
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
		this.dockItems = [];
		this._locations = [];
	}
	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		// this.timelineService.availableLocations.subscribe(this.onShelfItemsChanged);
		// this.timelineService.timelineItemRemoved.subscribe(this.onTimelineEntryRemoved);

		this.sub = this.timelineService.timelineLocations.subscribe(value => {
			this.dockItems = [];
			this._locations = [];
			this.hasStartLocation = false;
			value.forEach(entry => {
				this._locations.push(entry);
				if (entry.locationType === TimelineLocationType.IntermediateLocation) {
					this.dockItems.push(entry);
				} else if (entry.locationType === TimelineLocationType.StartLocation) {
					this.hasStartLocation = true;
				}
			});
			if (!this.hasStartLocation) {
			} else {
				// this.startLocationPopper.show = false;
			}

			// this.startLocationPopper['popper'].scheduleUpdate();
		});

		this.timelineService.configuration.subscribe(config => {
			this.configuration = config;
		});
	}

	public hideConfirmPurpose(): void {
		this._modelRef.hide();
	}

	/**
	 * Confirms purpose
	 */
	public confirmPurpose(): void {
		this._tempEntry.purpose = this.pipedPurpose;
		this.dockItems.splice(this._tempDropResult.addedIndex, 0, this._tempEntry);

		this._tempEntry.locationType = TimelineLocationType.IntermediateLocation;

		this.timelineService.updateTimelineLocation(this._tempEntry);

		// this.timelineService.addTimelineLocation(this._tempEntry);

		this._tempEntry = null;
		this._modelRef.hide();
	}

	/**
	 * Confirms start location
	 */
	public confirmStartLocation(): void {
		console.log('in here');
		//this.popover.hide();
	}

	public confirmEndLocation(): void {
		// this.endPopover.hide();
	}

	/**
	 * Callback for when a timeline item has deleted itself
	 */
	private onTimelineEntryRemoved: (entry: TimelineEntry) => void = (entry: TimelineEntry) => {
		let index = this.dockItems.findIndex(p => {
			return p.id === entry.id;
		});
		this.dockItems.splice(index, 1);
	};

	/**
	 *
	 */
	getChildPayload = (index: number): any => {
		return this.dockItems[index];
	};

	/**
	 *
	 * @param dropResult
	 */
	public onDrop(dropResult: DropResult): void {
		if (this.dragOver) {
			if (!(dropResult.payload in this.dockItems)) {
				if (dropResult.removedIndex !== null) {
					this.dockItems.splice(dropResult.removedIndex, 1);
					if (dropResult.addedIndex !== null) {
						this.dockItems.splice(dropResult.addedIndex, 0, dropResult.payload);
						this.timelineService.reorderTimelineLocation(dropResult.removedIndex + 1, dropResult.addedIndex + 1);
					}
				} else {
					let model: TimelineEntry = Object.assign({}, dropResult.payload);
					this.dockItems.splice(dropResult.addedIndex, 0, model);
					model.id = Symbol();
					model.locationType = TimelineLocationType.IntermediateLocation;
					this.timelineService.addTimelineLocation(model, dropResult.addedIndex + 1);

					if (model.pipedLocation) {
						this._tempEntry = model;
						this._modelRef = this._modalService.show(this.confirmPurposeTemplate);
						this._tempDropResult = dropResult;
						this.pipedPurpose = model.purpose;
					}
				}
			}
		} else {
			// console.log(dropResult);
			if (dropResult.removedIndex !== null) {
				this.timelineService.removeTimelineLocation(this.dockItems[dropResult.removedIndex]);
			}
			// this.dockItems.splice(dropResult.removedIndex, 1);

			// console.log(this.dockItems);
		}

		this.dragOver = false;
	}

	public onDragEnter(): void {
		this.dragOver = true;
	}

	public onDragLeave(): void {
		this.dragOver = false;
	}

	/**
	 *
	 * @param $event
	 */
	public onDragStart($event) {
		this.shouldShowPlaceholder();
		this.dragActive = true;
	}

	/**
	 *
	 * @param $event
	 */
	public onDragEnd($event) {
		this.dragActive = false;
	}

	/**
	 *
	 *
	 * @private
	 * @memberof TimelineShelfComponent
	 */
	private onShelfItemsChanged: (items: Array<TimelineEntry>) => void = (items: Array<TimelineEntry>) => {};
}
