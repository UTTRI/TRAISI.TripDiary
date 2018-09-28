import { Component, OnInit, ElementRef, Input, ViewChild, TemplateRef, ViewContainerRef, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { faHome, faSchool, faBriefcase, faHandScissors, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, ModalDirective, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { NgTemplateOutlet } from '@angular/common';
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
	model: TimelineEntry;

	editModel: TimelineEntry;


	

	@ViewChild('editTimelineEntryTemplate')
	editTimelineEntryTemplateRef: TemplateRef<any>;

	@ViewChild('editMapModal')
	editMapModalTemplateRef: TemplateRef<any>;

	@ViewChild('mapModalTemplate', { read: ViewContainerRef })
	mapModalTemplateRef: ViewContainerRef;

	@ViewChild('mapContainer', { read: ViewContainerRef })
	mapControlViewContainerRef: ViewContainerRef;


	@ViewChild('mapModalTemplate') mapModal: ModalDirective;

	@ViewChildren(ViewContainerRef, { read: ViewContainerRef }) viewChildren !: QueryList<ViewContainerRef>;

	homeIcon: IconDefinition = faHome;
	workIcon: IconDefinition = faBriefcase;
	schoolIcon: IconDefinition = faSchool;
	default: IconDefinition = faHandScissors;

	public get icon() {
		if(this.model.purpose == "home")
		{
			return this.homeIcon;
		}
		else if(this.model.purpose == "work")
		{
			return this.workIcon;
		}
		else if(this.model.purpose == "school")
		{
			return this.schoolIcon;
		}
		else
		{
			return this.default;
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
	ngOnInit(): void {

	}


	ngAfterViewInit(): void {
	
	}

	/**
	 *
	 */
	public edit(): void {
		
		this.editModel = Object.assign({}, this.model);
		this.modalRef = this._timelineService.openEditTimelineEntryModal(this.editTimelineEntryTemplateRef);


		this.viewChildren.changes.subscribe(value => {

			this.viewChildren.forEach( (i:ViewContainerRef) => {
				this._timelineService.openEditMapLocationModal(i,this.callback);
			});
			
		});

		
	}

	callback(value): void
	{

	}

	/**
	 * 
	 */
	public editLocation(): void {

	}

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

	}
}
