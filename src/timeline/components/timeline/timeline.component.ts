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
import { SurveyQuestion, ResponseTypes, SurveyViewer } from 'traisi-question-sdk';
import { TimelineWedgeComponent } from '../timeline-wedge/timeline-wedge.component';
import { faHome } from '../../shared/icons';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { QuestionLoaderService } from 'traisi-question-sdk';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { TimelineNewEntryComponent } from '../timeline-new-entry/timeline-new-entry.component';
import { isRegExp } from 'util';
import { TimelineDockComponent } from '../timeline-dock/timeline-dock.component';

@Component({
	entryComponents: [TimelineWedgeComponent],
	selector: 'traisi-timeline-question',
	template: require('./timeline.component.html').toString(),
	styles: [require('./timeline.component.scss').toString()]
})
export class TimelineComponent extends SurveyQuestion<ResponseTypes.Timeline> implements OnInit, AfterViewInit, AfterViewChecked {
	typeName: string;
	icon: string;

	editModel: TimelineEntry;

	icons: {} = {
		faHome: faHome
	};

	@ViewChild(PopoverDirective)
	popovers;

	@ViewChild(TemplateRef, { read: ViewContainerRef })
	inputTemplate: ViewContainerRef;

	@ViewChild('newEntry')
	newEntryDialog: TimelineNewEntryComponent;

	@ViewChild('timelineDock')
	timelineDock: TimelineDockComponent;

	public isStep1: boolean = true;

	public isStep2: boolean = false;

	/**
	 *
	 * @param surveyViewerService
	 * @param _timelineService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer, private _timelineService: TimelineService) {
		super();
		this.typeName = 'Trip Diary Timeline';
		this.icon = 'business-time';
	}

	/**
	 * TRAISI life cycle called for when the question is prepared
	 */
	traisiOnInit(): void {
		this.surveyViewerService.updateNavigationState(false);
	}

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {}

	saveNewLocation(): void {}

	/**
	 *
	 */
	addNewLocation(): void {
		this.newEntryDialog.show(this.newEntryCallback);
	}

	/**
	 * Callback - called when the new "location" entry process has completed.
	 * @param value
	 */
	public newEntryCallback = (value: any): void => {
		this._timelineService.addShelfLocation(value);
	};

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
	ngAfterViewInit(): void {
		this.timelineDock.timelineNewEntry = this.newEntryDialog;
	}

	/**
	 *
	 */
	ngAfterViewChecked(): void {}

	/**
	 * Override of base method class
	 */
	public navigateInternalNext(): boolean {
		if (this.isStep1 && this._timelineService.isTimelineStatevalid) {
			this.isStep1 = false;
			this.isStep2 = true;
			return false;
		}

		if (this.isStep2) {
			return true;
		}
	}

	/**
	 * Override - signfies an internal navigation possible.
	 */
	public canNavigateInternalNext(): boolean {
		console.log(this._timelineService.isTimelineStatevalid);
		return this._timelineService.isTimelineStatevalid;
	}

	public navigateInternalPrevious() {
		this.isStep2 = false;
		this.isStep1 = true;
	}

	/**
	 *
	 */
	public canNavigateInternalPrevious(): boolean {
		return this.isStep2;
	}
}
