import { Injectable, TemplateRef, Inject, Injector, ViewContainerRef, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TimelineState } from '../models/timeline-state.model';
import { TimelineConfiguration } from '../models/timeline-configuration.model';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionLoaderService, TRAISI } from 'traisi-question-sdk';
import { NgTemplateOutlet } from '@angular/common';

@Injectable()
export class TimelineService {
	private _configuration: ReplaySubject<TimelineConfiguration>;

	public get configuration(): ReplaySubject<TimelineConfiguration> {
		return this._configuration;
	}

	/**
	 *
	 * @param store
	 * @param modalService
	 * @param injector
	 * @param _questionLoaderService
	 */
	constructor(
		private store: Store<TimelineState>,
		private modalService: BsModalService,
		private injector: Injector,
		private appRef: ApplicationRef,
		@Inject('QuestionLoaderService') private _questionLoaderService: QuestionLoaderService
	) {
		this.initializeConfiguration();

		let entry1: TimelineEntry = {
			address: '1783 Storrington Street',
			latitude: 0,
			purpose: 'work',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),

			name: 'My work place'
		};

		let entry2: TimelineEntry = {
			address: '1783 Storrington Street',
			latitude: 0,
			purpose: 'home',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),
			name: 'Home'
		};

		let entry3: TimelineEntry = {
			address: '1783 Storrington Street',
			latitude: 0,
			purpose: 'school',
			longitude: 0,
			time: new Date(),
			timeB: new Date(),
			name: 'University'
		};

		this.availableLocations = new BehaviorSubject([entry1, entry2, entry3]);
	}

	/**
	 * Behaviour subject that contains the list of available timeline
	 * entities for use (taken from the shelf)
	 *
	 * @type {BehaviorSubject<Array<TimelineEntry>>}
	 * @memberof TimelineService
	 */
	public availableLocations: BehaviorSubject<Array<TimelineEntry>>;

	/**
	 * Initialie the base configuration data
	 */
	private initializeConfiguration() {
		this._configuration = new ReplaySubject(1);

		let startTime: Date = new Date();
		let endTime: Date = new Date();
		startTime.setHours(4);
		startTime.setMinutes(0);

		endTime.setDate(endTime.getDate() + 1);
		endTime.setHours(3);
		endTime.setMinutes(59);
		this._configuration.next({
			startTime: startTime,
			endTime: new Date()
		});
	}

	modalRef: BsModalRef;

	/**
	 *
	 * @param template
	 */
	openEditTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 * 
	 * @param template 
	 */
	openNewTimelineEntryModal(template: TemplateRef<any>): BsModalRef {
		this.modalRef = this.modalService.show(template);
		return this.modalRef;
	}

	/**
	 *
	 * @param mapModalTemplate
	 * @param mapContainerRef
	 */
	openEditMapLocationModal(template: ViewContainerRef): TRAISI.SurveyQuestion<any> {


		let componentRef = null;

		console.log(template);
		let sub = this._questionLoaderService.componentFactories$.subscribe(factory => {
			if (factory.selector == 'traisi-map-question') {
				componentRef = template.createComponent(factory, undefined, this.injector);

				let instance: TRAISI.SurveyQuestion<any> = <TRAISI.SurveyQuestion<any>>componentRef.instance;

	
				instance.response.subscribe(value => {
					console.log('Getting value from child question: ' + value);
				});
				sub.unsubscribe();
			}
		});

 
		return undefined;

	}
}
