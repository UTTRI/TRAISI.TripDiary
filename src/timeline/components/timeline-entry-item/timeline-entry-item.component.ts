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

import { BsModalRef, ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';
import iconMap from 'shared/icon-map';

/**
 * A component that represents a timeline entry. An entry can appear on the shelf, dock or
 * other places.
 *
 * @export
 * @class TimelineEntryItemComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
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
		return iconMap[this.model.purpose];
	}

	public modalRef: BsModalRef;

	public configuration: TimelineConfiguration;

	/**
	 *Creates an instance of TimelineEntryItemComponent.
	 * @param {ElementRef} _element
	 * @param {TimelineService} _timelineService
	 * @memberof TimelineEntryItemComponent
	 */
	constructor(
		private _element: ElementRef,
		private _timelineService: TimelineService,
		private _modalService: BsModalService
	) {}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		this._timelineService.configuration.subscribe(config => {
			this.configuration = config;
		});
	}

	/**
	 *
	 *
	 * @memberof TimelineEntryItemComponent
	 */
	public ngAfterViewInit(): void {}

	/**
	 *
	 *
	 * @memberof TimelineEntryItemComponent
	 */
	public edit(): void {
		// console.log(this.timelineNewEntry);

		if (this.inShelf) {
			this.timelineNewEntry.show(
				value => {
					this.model = value;
					this._timelineService.editShelfEntry(this.model);
				},
				Object.assign({}, this.model),
				true
			);
		} else {
			this.editPurpose = this.model.purpose;
			this._modelRef = this._modalService.show(this.confirmPurposeTemplate);
		}
	}

	/**
	 *
	 *
	 * @param {*} value
	 * @memberof TimelineEntryItemComponent
	 */
	public callback(value): void {}

	/**
	 * @memberof TimelineEntryItemComponent
	 */
	public editLocation(): void {}

	/**
	 * @param {*} entry
	 * @memberof TimelineEntryItemComponent
	 */
	public save(entry): void {
		this.model = Object.assign({}, this.editModel);

		this.modalRef.hide();
	}

	/**
	 * @memberof TimelineEntryItemComponent
	 */
	public delete(): void {
		if (!this.inShelf) {
			this._timelineService.removeTimelineLocation(this.model);
		} else {
			this._timelineService.removeEntryFromShelf(this.model);
		}
	}

	/**
	 * @memberof TimelineEntryItemComponent
	 */
	public confirmPurpose(): void {
		this.model.purpose = this.editPurpose;

		this._timelineService.updateTimelineLocation(this.model);
		this._modelRef.hide();
	}
}
