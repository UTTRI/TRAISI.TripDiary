import { Component, OnInit, ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { faHome, faSchool, faBriefcase, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { IDropResult } from 'ngx-smooth-dnd';
@Component({
	selector: 'timeline-slot',
	template: require('./timeline-slot.component.html').toString(),
	styles: [require('./timeline-slot.component.scss').toString()]
})
export class TimelineSlotComponent implements OnInit {
	typeName: string;

	hasTimelineEntryItem: boolean = false;

	homeIcon: IconDefinition = faHome;
	workIcon: IconDefinition = faBriefcase;
	schoolIcon: IconDefinition = faSchool;

	public dragOver: boolean = false;

	public dragActive: boolean = false;

	public get icon() {
		if (this.model.purpose == 'home') {
			return this.homeIcon;
		} else if (this.model.purpose == 'work') {
			return this.workIcon;
		} else if (this.model.purpose == 'school') {
			return this.schoolIcon;
		}
	}

	/**
	 *Creates an instance of TimelineSlotComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} timelineService
	 * @memberof TimelineSlotComponent
	 */
	constructor(private _element: ElementRef, private timelineService: TimelineService) {
		this.typeName = 'Trip Diary Timeline';
	}

	model: TimelineEntry;
	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {}

	/**
	 *
	 * @param event
	 */
	public locationPlaced(event: DndDropEvent) {
		this.model = event.data;
		this.hasTimelineEntryItem = true;
	}

	public delete(): void {
		this.model = undefined;
		this.hasTimelineEntryItem = false;
	}

	/**
	 *
	 * @param dropResult
	 */
	onDrop(dropResult: IDropResult) {
		if(this.dragOver)
		{
			this.hasTimelineEntryItem = true;
			this.model = dropResult.payload;
		}
		this.dragOver = false;
	}

	/**
	 * 
	 * @param $event 
	 */
	public onDragStart($event)
	{
		console.log("drag active!");
		this.dragActive = true;
	}

	/* */
	public onDragEnd($event)
	{

		this.dragActive = false;
		
	}

	public onDragEnter() {
		this.dragOver = true;
	}

	public onDragLeave() {
		this.dragOver = false;
	}
}
