import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { ContainerComponent, DraggableComponent, IDropResult } from 'ngx-smooth-dnd';
@Component({
	selector: 'timeline-shelf',
	template: require('./timeline-shelf.component.html').toString(),
	styles: [require('./timeline-shelf.component.scss').toString()]
})
export class TimelineShelfComponent implements OnInit {
	public shelfItems: Array<TimelineEntry>;

	@ViewChild('shelfContainer)')
	shelfContainer: ContainerComponent;

	/**
	 *Creates an instance of TimelineWedgeComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineWedgeComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {
		this.shelfItems = [];
	}

	/**
	 *
	 * @param dropResult
	 */
	onDrop(dropResult: IDropResult) {
		console.log(dropResult);
	}

	getChildPayload = (index: number): any => {
		return this.shelfItems[index];
	} 



	/**
	 *
	 * @param $event
	 */
	onDragStart($event) {


	}

	/**
	 *
	 *
	 * @private
	 * @memberof TimelineShelfComponent
	 */
	private onShelfItemsChanged: (items: Array<TimelineEntry>) => void = (items: Array<TimelineEntry>) => {
		console.log('Shelf items changed');
		this.shelfItems = items;

		console.log(items);
		console.log(this.shelfItems);
	};

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		this._timelineService.availableLocations.subscribe(this.onShelfItemsChanged);
	}
}
