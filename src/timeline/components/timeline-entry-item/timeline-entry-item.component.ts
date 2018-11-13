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

import { BsModalRef, ModalDirective, ModalBackdropComponent, BsModalService } from 'ngx-bootstrap/modal';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';

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
	public inSummaryDisplay: boolean = false;

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

	@ViewChild('confirmPurposeTemplate')
	public confirmPurposeTemplate: TemplateRef<any>;

	private _modelRef: BsModalRef;

	public editPurpose: any;

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

	public modalRef: BsModalRef;

	public configuration: TimelineConfiguration;

	/**
	 *Creates an instance of TimelineEntryItemComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} _timelineService
	 * @memberof TimelineEntryItemComponent
	 */
	constructor(private _element: ElementRef, private _timelineService: TimelineService, private _modalService: BsModalService) {}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		this._timelineService.configuration.subscribe(config => {
			this.configuration = config;
		});
	}

	public ngAfterViewInit(): void {}

	/**
	 *
	 */
	public edit(): void {
		// console.log(this.timelineNewEntry);

		if (this.inShelf) {
			this.timelineNewEntry.show(value => {
				this.model = value;
				this._timelineService.editShelfEntry(this.model);
			}, Object.assign({}, this.model));
		} else {
			this.editPurpose = this.model.purpose;
			this._modelRef = this._modalService.show(this.confirmPurposeTemplate);
		}
	}

	public callback(value): void {}

	/**
	 *
	 */
	public editLocation(): void {}

	/**
	 *
	 */
	public save(entry): void {
		this.model = Object.assign({}, this.editModel);

		this.modalRef.hide();
	}

	/**
	 *
	 */
	public delete(): void {
		if (!this.inShelf) {
			this._timelineService.removeTimelineLocation(this.model);
		} else {
			this._timelineService.removeEntryFromShelf(this.model);
		}
	}

	public confirmPurpose(): void {
		this.model.purpose = this.editPurpose;

		this._timelineService.updateTimelineLocation(this.model); 
		this._modelRef.hide();
	}
}
