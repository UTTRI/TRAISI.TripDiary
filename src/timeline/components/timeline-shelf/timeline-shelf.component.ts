import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { ContainerComponent, DraggableComponent, IDropResult } from 'ngx-smooth-dnd';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
@Component({
	selector: 'timeline-shelf',
	template: require('./timeline-shelf.component.html').toString(),
	styles: [require('./timeline-shelf.component.scss').toString()]
})
export class TimelineShelfComponent implements OnInit {
	public shelfItems: Array<TimelineEntry>;

	@ViewChild('shelfContainer)')
	shelfContainer: ContainerComponent;

	@Input()
	public timelineNewEntry: TimelineNewEntryComponent;

	public isDragActive: boolean = false;

	public draggedItem: any = undefined;

	/**
	 *Creates an instance of TimelineWedgeComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineWedgeComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {
		this.shelfItems = [];
		this.draggedItem = {
			id: Symbol()
		};
	}

	/**
	 *
	 * @param dropResult
	 */
	public onDrop(dropResult: IDropResult): void {}

	public getChildPayload = (index: number): any => {
		return this.shelfItems[index];
	};

	/**
	 *
	 * @param $event
	 */
	public onDragStart($event): void {
		this.isDragActive = true;

		this.draggedItem = $event.payload;
	}

	public onDragEnd($event): void {
		this.isDragActive = false;

		this.draggedItem = {
			id: Symbol()
		};
	}

	/**
	 *
	 *
	 * @private
	 * @memberof TimelineShelfComponent
	 */
	private onShelfItemsChanged: (items: Array<TimelineEntry>) => void = (items: Array<TimelineEntry>) => {
		this.shelfItems = items;
	};

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		this._timelineService.availableLocations.subscribe(this.onShelfItemsChanged);
	}
}
