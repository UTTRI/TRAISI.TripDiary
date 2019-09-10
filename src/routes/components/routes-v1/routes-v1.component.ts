import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

import { ResponseTypes, SurveyQuestion, OnSurveyQuestionInit, GroupMember } from 'traisi-question-sdk';
import { TripDiaryModule } from '../routes/v1/ts';
import templateString from './routes-v1.component.html';
@Component({
	selector: 'traisi-routes-v1',
	template: templateString,
	styles: [require('./routes-v1.component.scss').toString()]
})
export class RoutesV1Component implements OnInit {
	public typeName: string;
	public icon: string;

	@ViewChild('div', { static: true })
	divRef: ElementRef;

	@Input('surveyId')
	public surveyId: number;

	@Input('respondent')
	public respondent: GroupMember;

	/**
	 * Creates an instance of routes v1 component.
	 * @param _elementRef
	 * @param _upgrade
	 */
	constructor(private _elementRef: ElementRef, private _upgrade: UpgradeModule) {}

	/**
	 * Angular's ngOnInit
	 */
	public ngOnInit(): void {
		//

		new TripDiaryModule().bootstrap('test', this.surveyId, this.respondent);

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
