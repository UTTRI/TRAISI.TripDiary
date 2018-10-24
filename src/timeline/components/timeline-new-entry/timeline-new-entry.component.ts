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
	AfterContentInit
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry, TimelineLocationType } from '../../models/timeline-entry.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QuestionLoaderService, SurveyQuestion } from 'traisi-question-sdk';
import { TimelineConfiguration } from '../../models/timeline-configuration.model';
import { AfterViewInit } from '@angular/core';

@Component({
	selector: 'timeline-new-entry',
	template: require('./timeline-new-entry.component.html').toString(),
	styles: [require('./timeline-new-entry.component.scss').toString()]
})
export class TimelineNewEntryComponent implements OnInit, AfterViewInit, AfterContentInit {
	modalRef: ModalDirective;

	@ViewChild('newEntryModal')
	newTimelineEntryTemplateRef: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	mapTemplate: ViewContainerRef;

	public configuration: TimelineConfiguration;

	stepOne: boolean = true;
	stepTwo: boolean = false;
	stepThree: boolean = false;
	saveCallback: (value: any) => void;

	model: TimelineEntry;

	private _mapComponent: any;

	/**
	 *
	 * @param timelineService
	 */
	constructor(
		private timelineService: TimelineService,
		private injector: Injector,
		@Inject('QuestionLoaderService') private _questionLoaderService: QuestionLoaderService
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
			time: new Date(),
			timeB: new Date(),
			pipedLocation: false,
			name: '',
			locationType: TimelineLocationType.Undefined,
			id: Symbol()
		};
		this.model.time.setHours(0);
		this.model.time.setMinutes(0);
		this.stepOne = true;
		this.stepTwo = false;
		this.stepThree = false;
	};

	/**
	 *
	 * @param callback
	 */
	show(callback: (value: any) => void, entry?: TimelineEntry): void {
		// this.timelineService.openEditMapLocationModal(this.mapTemplate, this.callback);

		this.saveCallback = callback;

		this.newTimelineEntryTemplateRef.onHidden.subscribe(this.onHidden);

		this.newTimelineEntryTemplateRef.onShown.subscribe((val) => {
			let sub = (<any>this._mapComponent).mapInstance.subscribe((mapInstance) => {
				console.log('in here');
				mapInstance.resize();
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
				time: new Date(),
				timeB: new Date(),
				name: '',
				pipedLocation: false,
				locationType: TimelineLocationType.Undefined,
				id: Symbol()
			};

			this.model.time.setHours(0);
			this.model.time.setMinutes(0);
		} else {
			this.model = entry;
		}
	}

	stepTwoPrevious(): void {
		this.stepOne = true;
		this.stepTwo = false;
	}

	stepOneNext(): void {
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
		console.log(this.model);
		this.saveCallback(this.model);
		this.newTimelineEntryTemplateRef.hide();
	}

	public ngOnInit(): void {
		let componentRef = null;

		let sub = this._questionLoaderService.componentFactories$.subscribe((factory) => {
			if (factory.selector == 'traisi-map-question') {
				componentRef = this.mapTemplate.createComponent(factory, undefined, this.injector);

				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;

				instance.response.subscribe((value) => {
					this.callback(value);
				});

				this._mapComponent = instance;
			}
		});

		this.timelineService.configuration.subscribe((config) => {
			this.configuration = config;
		});
	}

	public ngAfterViewInit(): void {}

	public ngAfterContentInit(): void {}
}
