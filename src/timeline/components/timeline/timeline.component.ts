import {
	Component,
	OnInit,
	ElementRef,
	ComponentFactoryResolver,
	ViewChild,
	Inject,
	TemplateRef,
	ViewContainerRef,
	Injector,
	ContentChild,
	AfterViewInit,
	ContentChildren,
	QueryList,
	ViewChildren,
	AfterViewChecked
} from '@angular/core';

import { TimelineService } from '../../services/timeline.service';
import { SurveyQuestion, ResponseTypes } from 'traisi-question-sdk';
import { TimelineWedgeComponent } from '../timeline-wedge/timeline-wedge.component';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionLoaderService } from 'traisi-question-sdk';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';

@Component({
	entryComponents: [TimelineWedgeComponent],
	selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent extends SurveyQuestion<ResponseTypes.Timeline> implements OnInit, AfterViewInit, AfterViewChecked {
	typeName: string;
	icon: string;

	icons: {} = {
		faHome: faHome
	};

	@ViewChild(PopoverDirective)
	popovers;


	@ViewChild(TemplateRef, { read: ViewContainerRef })
	inputTemplate: ViewContainerRef;

	@ViewChild('newEntry')
	newEntryDialog: TimelineNewEntryComponent;


	/**
	 *
	 * @param _questionLoaderService
	 * @param _element
	 * @param _timelineService
	 * @param resolver
	 * @param injector
	 * @param modalService
	 */
	constructor(
		@Inject('QuestionLoaderService') private _questionLoaderService: QuestionLoaderService,
		private _element: ElementRef,
		private _timelineService: TimelineService,
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
		private modalService: BsModalService
	) {
		super();
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
		const f = this.resolver.resolveComponentFactory(TimelineWedgeComponent);
	}

	/**
	 * TRAISI life cycle called for when the question is prepared
	 */
	traisiOnInit(): void {
		console.log('this timeline configuration');
		console.log(this.configuration);
	}

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {}

	editModel: TimelineEntry;

	saveNewLocation(): void {
		//this._timelineService.availableLocations.next(this._timelineService.availableLocations.getValue().concat(this.editModel));


		//this.modalRef.hide();
	}

	/**
	 * 
	 */
	addNewLocation(): void {

		
		this.newEntryDialog.show(this.newEntryCallback);
	}

	    /**
     * 
     * @param value 
     */
    public newEntryCallback = (value:any): void => 
    {
        console.log(value);
        this._timelineService.addNewLocation(value);

    }

	/**
	 *
	 * @param type
	 * @param $event
	 */
	handler(type: string, $event: ModalDirective) {
		//this._timelineService.openEditMapLocationModal(this.mapTemplate);
	}

	/**
	 *
	 */
	ngAfterViewInit(): void {}

	/**
	 *
	 */
	ngAfterViewChecked(): void {}
}
