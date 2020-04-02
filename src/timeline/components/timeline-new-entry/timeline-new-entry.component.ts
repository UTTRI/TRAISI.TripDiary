import {
	Component,
	OnInit,
	ElementRef,
	ViewEncapsulation,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	Inject,
	Injector,
	AfterContentInit,
	ViewChildren,
	QueryList
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyQuestion } from 'traisi-question-sdk';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';
import { AfterViewInit } from '@angular/core';

import templateString from './timeline-new-entry.component.html';
@Component({
	selector: 'timeline-new-entry',
	template: templateString,
	encapsulation: ViewEncapsulation.None,
	styles: [require('./timeline-new-entry.component.scss').toString()]
})
export class TimelineNewEntryComponent implements OnInit, AfterViewInit, AfterContentInit {
	modalRef: ModalDirective;

	@ViewChild('newEntryModal', { static: true })
	newTimelineEntryTemplateRef: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef, static: true })
	mapTemplate: ViewContainerRef;

	@ViewChildren('purposeSelect')
	public purposeSelect: QueryList<ElementRef>;

	public configuration: TimelineConfiguration;

	public stepOne: boolean = true;
	public stepTwo: boolean = false;
	public stepThree: boolean = false;
	public saveCallback: (value: any) => void;

	public model: TimelineEntry;

	public isEdit: boolean = false;

	private _mapComponent: any;

	/**
	 *
	 * @param timelineService
	 * @param injector
	 * @param _questionLoaderService
	 */
	constructor(
		private timelineService: TimelineService,
		private injector: Injector,
		@Inject('QuestionLoaderService') private _questionLoaderService
	) {}

	/**
	 * Callback for when the new entry dialog is hidden
	 */
	private onHidden: () => void = () => {
		this.model = {
			address: '',
			latitude: 0,
			purpose: null,
			longitude: 0,
			order: 0,
			timeA: new Date(),
			timeB: new Date(),
			pipedLocation: false,
			name: '',
			locationType: TimelineLocationType.Undefined,
			id: Symbol()
		};
		this.model.timeA.setHours(0);
		this.model.timeA.setMinutes(0);
		this.stepOne = true;
		this.stepTwo = false;
		this.stepThree = false;
	};

	/**
	 *
	 * @param {(value: any) => void} callback
	 * @param {TimelineEntry} [entry]
	 * @param {boolean} [isEdit=false]
	 * @memberof TimelineNewEntryComponent
	 */
	public show(callback: (value: any) => void, entry?: TimelineEntry, isEdit: boolean = false): void {
		// this.timelineService.openEditMapLocationModal(this.mapTemplate, this.callback);
		this.stepOne = true;
		this.stepTwo = false;
		this.stepThree = false;
		this.saveCallback = callback;
		this.isEdit = isEdit;

		this.newTimelineEntryTemplateRef.onHidden.subscribe(this.onHidden);

		this.newTimelineEntryTemplateRef.onShown.subscribe(val => {
			let sub = (<any>this._mapComponent).mapInstance.subscribe(mapInstance => {
				mapInstance.resize();
				this._mapComponent.resetInput();
				if (entry !== undefined) {
					(<any>this._mapComponent).setQuestionState(entry.latitude, entry.longitude, entry.address);
				}

				// (latitude: number, longitude: number, address: string): void {
			});
			sub.unsubscribe();
		});
		this.newTimelineEntryTemplateRef.show();

		if (entry == null) {
			this.model = {
				address: '',
				latitude: 0,
				purpose: null,
				longitude: 0,
				order: 0,
				timeA: new Date(0),
				timeB: new Date(0),
				name: '',
				pipedLocation: false,
				locationType: TimelineLocationType.Undefined,
				id: Symbol()
			};

			// this.model.timeA.setHours(0);
			// this.model.timeA.setMinutes(0);
		} else {
			this.model = entry;
		}
	}

	public stepTwoPrevious(): void {
		this.stepOne = true;
		this.stepTwo = false;
	}

	public stepOneNext(): void {
		this.stepOne = false;
		this.stepTwo = true;
	}

	/**
	 *
	 * @param value
	 */
	public callback = (value: any): void => {
		this.model.address = value.address;
		this.model.latitude = value.latitude;
		this.model.longitude = value.longitude;
	};

	public stepTwoNext(): void {
		this.stepThree = true;
		this.stepTwo = false;
	}

	public stepThreePrevious(): void {
		this.stepThree = false;
		this.stepTwo = true;
	}

	public stepThreeNext(): void {
		this.saveCallback(this.model);
		this.newTimelineEntryTemplateRef.hide();
		this._mapComponent.resetInput();
	}

	public ngOnInit(): void {
		let componentRef = null;
		let factories = this._questionLoaderService.componentFactories;
		// console.log(factories);
		let sub = Object.keys(this._questionLoaderService.componentFactories).forEach(key => {
			let factory = this._questionLoaderService.componentFactories[key];
			if (factory.selector === 'traisi-map-question') {
				componentRef = this.mapTemplate.createComponent(factory, undefined, this.injector);
				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;
				instance.response.subscribe(value => {
					this.callback(value);
				});
				this._mapComponent = instance;
			}
		});

		this.timelineService.configuration.subscribe(config => {
			this.configuration = config;
		});
	}

	public ngAfterViewInit(): void {
		this.purposeSelect.changes.subscribe((v: QueryList<ElementRef>) => {
			if (v.length > 0) {
				console.log($(v.first.nativeElement));
				$(v.first.nativeElement)['selectpicker']();
				console.log(v);
			}
		});
	}

	public ngAfterContentInit(): void {}
}
