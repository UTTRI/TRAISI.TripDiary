import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { IDropResult } from 'ngx-smooth-dnd';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { Subscription } from 'rxjs';

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

	public sub: Subscription;

	@ViewChild('startSlotPopover')
	startSlotPopover: PopoverDirective;


	/**
	 *
	 * @param _element
	 * @param timelineService
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService) {
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
		this.dockItems = [];
	}
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		this.timelineService.availableLocations.subscribe(this.onShelfItemsChanged);
		this.timelineService.timelineItemRemoved.subscribe(this.onTimelineEntryRemoved);

		this.sub = this.timelineService.timelineLocations.subscribe(value => {
			value.forEach(entry => {
				if (entry.locationType == TimelineLocationType.Undefined) {

					let item = this.dockItems.find(s => {
						return s.id == entry.id
					});

					if (item === undefined) {
						this.dockItems.push(entry);
					}
				}
			});

		}

		);
	}

	/**
	 * Callback for when a timeline item has deleted itself
	 */
	private onTimelineEntryRemoved: (entry: TimelineEntry) => void = (entry: TimelineEntry) => {
		var index = this.dockItems.findIndex(p => {
			return p.id == entry.id
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
				var model = Object.assign({}, dropResult.payload);
				
				this.dockItems.splice(dropResult.addedIndex, 0, model);
				model.id = Symbol();
				this.timelineService.addTimelineLocation(model);
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
	private onShelfItemsChanged: (items: Array<TimelineEntry>) => void = (items: Array<TimelineEntry>) => { };
}
