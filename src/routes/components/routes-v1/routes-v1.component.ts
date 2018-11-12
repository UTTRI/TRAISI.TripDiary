import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

import { ResponseTypes, SurveyQuestion, OnSurveyQuestionInit } from 'traisi-question-sdk';
import { TripDiaryModule } from '../routes/v1/ts';
import { element } from '../../../node_modules/@angular/core/src/render3/instructions';

@Component({
	selector: 'traisi-routes-v1',
	template: require('./routes-v1.component.html').toString(),
	styles: [require('./routes-v1.component.scss').toString()]
})
export class RoutesV1Component implements OnInit {
	public typeName: string;
	public icon: string;

	@ViewChild('div')
	divRef: ElementRef;

	@Input('surveyId')
	public surveyId: number;

	/**
	 * Creates an instance of routes v1 component.
	 * @param _elementRef
	 * @param _upgrade
	 */
	constructor(private _elementRef: ElementRef, private _upgrade: UpgradeModule) {}

	/**
	 * Angular's ngOnInit
	 */
	ngOnInit(): void {
		//
		
		new TripDiaryModule().bootstrap('test', this.surveyId);

		setTimeout(() => {
			this._upgrade.bootstrap(this.divRef.nativeElement, ['trips'], { strictDi: false });

			// console.log('after bootstrap;)');
		});
	}

	/**
	 *
	 */
	public bootstrap() {}
}
