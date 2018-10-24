import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild, ViewChildren, TemplateRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { IDropResult } from 'ngx-smooth-dnd';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';

@Component({
	selector: 'timeline-dock',
	template: require('./timeline-dock.component.html').toString(),
	styles: [require('./timeline-dock.component.scss').toString()]
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

	@ViewChild('startSlotPopover')
	startSlotPopover: PopoverDirective;

	@ViewChild('confirmPurposeTemplate')
	confirmPurposeTemplate: TemplateRef<any>;

	private _tempEntry: TimelineEntry;

	private _tempDropResult: IDropResult;

	private _modelRef: BsModalRef;

	public pipedPurpose: string;

	/**
	 *
	 * @param _element
	 * @param timelineService
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService, private _modalService: BsModalService) {
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
		this.dockItems = [];
	}
	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		// this.timelineService.availableLocations.subscribe(this.onShelfItemsChanged);
		// this.timelineService.timelineItemRemoved.subscribe(this.onTimelineEntryRemoved);

		this.sub = this.timelineService.timelineLocations.subscribe((value) => {
			this.dockItems = [];
			value.forEach((entry) => {
				if (entry.locationType === TimelineLocationType.IntermediateLocation) {
					this.dockItems.push(entry);
				}
			});
		});

		this.timelineService.configuration.subscribe((config) => {
			this.configuration = config;
		});
	}

	/**
	 * Confirms purpose
	 */
	public confirmPurpose(): void {
		this._tempEntry.purpose = this.pipedPurpose;
		this.dockItems.splice(this._tempDropResult.addedIndex, 0, this._tempEntry);
		this._tempEntry.id = Symbol();
		this._tempEntry.locationType = TimelineLocationType.IntermediateLocation;
		this.timelineService.addTimelineLocation(this._tempEntry);
		this._tempEntry = null;
		this._modelRef.hide();
	}

	/**
	 * Callback for when a timeline item has deleted itself
	 */
	private onTimelineEntryRemoved: (entry: TimelineEntry) => void = (entry: TimelineEntry) => {
		let index = this.dockItems.findIndex((p) => {
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
	onDrop(dropResult: IDropResult) {
		if (this.dragOver) {
			if (!(dropResult.payload in this.dockItems)) {
				if (dropResult.removedIndex != null) {
					this.dockItems.splice(dropResult.removedIndex, 1);
				}

				let model: TimelineEntry = Object.assign({}, dropResult.payload);

				if (model.pipedLocation) {
					this._tempEntry = model;
					this._modelRef = this._modalService.show(this.confirmPurposeTemplate);
					this._tempDropResult = dropResult;
					this.pipedPurpose = model.purpose;
				} else {
					this.dockItems.splice(dropResult.addedIndex, 0, model);
					model.id = Symbol();
					model.locationType = TimelineLocationType.IntermediateLocation;
					this.timelineService.addTimelineLocation(model);
				}
			}
		}

		this.dragOver = false;
	}

	public onDragEnter() {
		this.dragOver = true;
	}

	public onDragLeave() {
		this.dragOver = false;
	}

	/**
	 *
	 * @param $event
	 */
	public onDragStart($event) {
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
