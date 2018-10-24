import {
	Component,
	OnInit,
	ElementRef,
	Input,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	QueryList,
	ViewChildren,
	AfterViewInit,
	ContentChildren
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import { BsModalRef, ModalDirective, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';

@Component({
	selector: 'timeline-entry-item',
	template: require('./timeline-entry-item.component.html').toString(),
	styles: [require('./timeline-entry-item.component.scss').toString()]
})
export class TimelineEntryItemComponent implements OnInit, AfterViewInit {
	/**
	 * Input for the model that this timeline entry item component represents
	 *
	 * @type {TimelineEntry}
	 * @memberof TimelineEntryItemComponent
	 */
	@Input()
	public model: TimelineEntry;

	public editModel: TimelineEntry;

	@Input()
	public inShelf: boolean = true;

	@Input()
	public timelineNewEntry: TimelineNewEntryComponent;

	@ViewChild('editTimelineEntryTemplate')
	editTimelineEntryTemplateRef: TemplateRef<any>;

	@ViewChild('editMapModal')
	editMapModalTemplateRef: TemplateRef<any>;

	@ViewChild('mapModalTemplate', { read: ViewContainerRef })
	mapModalTemplateRef: ViewContainerRef;

	@ViewChild('mapContainer', { read: ViewContainerRef })
	mapControlViewContainerRef: ViewContainerRef;

	@ViewChild('mapModalTemplate')
	mapModal: ModalDirective;

	@ViewChildren(ViewContainerRef, { read: ViewContainerRef })
	viewChildren!: QueryList<ViewContainerRef>;

	public get icon() {
		if (this.model.purpose === 'home') {
			return 'fas fa-home';
		} else if (this.model.purpose === 'work') {
			return 'fas fa-building';
		} else if (this.model.purpose === 'school') {
			return 'fas fa-school';
		} else if (this.model.purpose === 'daycare') {
			return 'fas fa-child';
		} else if (this.model.purpose === 'facilitate_passenger') {
			return 'fas fa-car-side';
		} else {
			return 'fas fa-edit';
		}
	}

	modalRef: BsModalRef;

	/**
	 *Creates an instance of TimelineEntryItemComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} _timelineService
	 * @memberof TimelineEntryItemComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService) {}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {}

	public ngAfterViewInit(): void {}

	/**
	 *
	 */
	public edit(): void {
		console.log(this.timelineNewEntry);

		this.timelineNewEntry.show((value) => {
			this.model = value;
		}, Object.assign({}, this.model));
	}

	public callback(value): void {}

	/**
	 *
	 */
	public editLocation(): void {}

	/**
	 *
	 */
	public save(): void {
		this.model = Object.assign({}, this.editModel);

		this.modalRef.hide();
	}

	/**
	 *
	 */
	public delete(): void {
		console.log('in delete');
		this._timelineService.removeTimelineLocation(this.model);
	}
}
