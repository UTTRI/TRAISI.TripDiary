import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { IDropResult } from 'ngx-smooth-dnd';
import { TimelineEntry } from '../../models/timeline-entry.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';

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
	

	@ViewChild('startSlotPopover') startSlotPopover: PopoverDirective;

	/**
	 *
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
		console.log('inside of wedge component - test 2');
		this.timelineService.availableLocations.subscribe(this.onShelfItemsChanged);

		console.log(this.startSlotPopover);
		console.log("after popover");
	}

	/**
	 *
	 * @param dropResult
	 */
	onDrop(dropResult: IDropResult) {
		// update item list according to the @dropResult
		//this.items = applyDrag(this.items, dropResult);

		if (this.dragOver) {
			console.log(dropResult);
			this.dockItems.push(dropResult.payload);

			console.log(this.startSlotPopover);
		}
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
		console.log($event);
	}

	/**
	 *
	 *
	 * @private
	 * @memberof TimelineShelfComponent
	 */
	private onShelfItemsChanged: (items: Array<TimelineEntry>) => void = (items: Array<TimelineEntry>) => {};
}
