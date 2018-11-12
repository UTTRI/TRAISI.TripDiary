import { SurveyMapDirective } from '../shared/directives/survey-map-directive';
import * as angular from 'angular';

import * as ngAria from 'angular-aria';
import * as ngCookies from 'angular-cookies';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as ngTimePicker from 'angular-material-time-picker';
import * as ngTranslate from 'angular-translate';
import * as ngSanitize from 'angular-sanitize';

import reducers from './trips-reducers';
import { DateFilter } from '../shared/filters/date-filter';
import { DateFilterBrackets } from '../shared/filters/date-filter-brackets';
import { default as ngRedux } from 'ng-redux';
import { IModule } from 'angular';
import { SurveyConfigService } from '../shared/services/survey-config-service';

import { TripRouteModeDirective } from '../directives/trip-route-mode-directive';
import { TripDiaryController } from '../controllers/trip-diary-controller';
import 'angular-translate-loader-static-files';
import 'angular-translate-interpolation-messageformat';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';

import { HtmlFilter } from '../shared/filters/html-filter';

import * as moment from 'moment';
window['moment'] = moment;
let surveyId = window['SURVEY_ID'];
let userId = window['USER_ID'];

require('../js/lrm-google.js');

import 'leaflet-control-geocoder';
// var polyline = require('@mapbox/polyline');

let translate = require('../assets/trips-en.json');

import { TripDiaryService } from './trip-diary-service';

import { OrdinalFilter } from '../shared/filters/ordinal-filter';
import { TimeFilter } from '../shared/filters/time-filter';
import { RoutesV1Component } from '../../../routes-v1/routes-v1.component';
import { tripRouteModeContainer } from '../../../../directives/trip-route-mode.directive';
import { RoutesService } from '../../../../services/routes.service';
import { GroupMember } from 'traisi-question-sdk';

export class TripDiaryModule {
	questionId: string;
	questionType: string;

	clearResponse(): boolean {
		return undefined;
	}

	getResponse(): string {
		return undefined;
	}

	/**
	 * Bootstraps trip diary module
	 * @param questionId
	 * @param [v2SurveyId]
	 * @returns true if bootstrap
	 */
	bootstrap(questionId: string, v2SurveyId: number = -1, respondent?: GroupMember): boolean {
		/* Create app and controller */
		let app: IModule = angular
			.module('trips', [ngRedux, ngMessages, ngAria, ngMaterial, ngTimePicker, ngTranslate, ngCookies, ngSanitize])

			.config([
				'$ngReduxProvider',
				$ngReduxProvider => {
					let reducer = reducers;
					$ngReduxProvider.createStoreWith(reducer);
				}
			])

			.config([
				'$httpProvider',
				function($httpProvider: ng.IHttpProvider) {
					$httpProvider.useApplyAsync();
				}
			])
			.config([
				'$mdThemingProvider',
				function($mdThemingProvider) {
					$mdThemingProvider
						.theme('default')
						.primaryPalette('blue')
						.accentPalette('red');
				}
			])
			.config([
				'$locationProvider',
				function($locationProvider) {
					$locationProvider.html5Mode(false).hashPrefix('');
				}
			])
			.config([
				'$translateProvider',
				function($translateProvider: angular.translate.ITranslateProvider) {
					// add translation table

					$translateProvider.useMessageFormatInterpolation();
					$translateProvider.useSanitizeValueStrategy('sanitize');
					$translateProvider.translations('en', translate);
					$translateProvider.preferredLanguage('en');
				}
			])
			.config([
				'$interpolateProvider',
				function($interpolateProvider: angular.IInterpolateProvider) {
					$interpolateProvider.startSymbol('{$');
					$interpolateProvider.endSymbol('$}');
				}
			])
			.config([
				'$compileProvider',
				$compileProvider => {
					// $compileProvider.preAssignBindingsEnabled(true);
					$compileProvider.commentDirectivesEnabled(false);
					$compileProvider.cssClassDirectivesEnabled(false);
					// $compileProvider.debugInfoEnabled(false);
				}
			])
			// .directive('scrollViewWatcher', ['$window', ScrollViewWatcher.Factory()])
			.directive('tripRouteModeContainer', [tripRouteModeContainer])
			// .directive('preventScroll', ['$window', PreventScrollDirective.Factory()])
			// .directive('dragResize', ['$window', DragResizeDirective.Factory()])
			// .directive('timelineSegment', ['$ngRedux', TimelineSegmentDirective.Factory()])
			// .directive('timeline', ['$window', '$timeout', 'QUESTION_ID', TimelineDirective.Factory()])
			// .directive('timelineLine', ['$window', TimelineLineDirective.Factory()])
			// .directive('timelineLineMap', ['$window', TimelineLineMapDirective.Factory()])
			// .directive('timelineConnector', ['$window', '$timeout', TimelineConnectorDirective.Factory()])
			.directive('tripRouteMode', [
				'$ngRedux',
				'$mdPanel',
				'TripDiaryService',
				'$timeout',
				'$mdDialog',
				TripRouteModeDirective.Factory()
			])
			.directive('surveyMap', [
				'$http',
				'$compile',
				'$templateRequest',
				'TripDiaryService',
				'$rootScope',
				SurveyMapDirective.Factory()
			])
			.directive('surveyMapRouter', [
				'$http',
				'$compile',
				'$templateRequest',
				'TripDiaryService',
				'$rootScope',
				SurveyMapDirective.Factory()
			])
			.factory('SurveyConfigService', ['$http', SurveyConfigService.Factory(userId, surveyId, '')])
			.factory('TripDiaryService', ['$ngRedux', TripDiaryService.Factory()])
			// .factory('TripDiaryTourService', ['$ngRedux', '$translate', TripDiaryTourService.Factory()])
			.factory('routesService', downgradeInjectable(RoutesService))
			.constant('QUESTION_ID', questionId)
			.constant('SurveyV2Id', v2SurveyId)
			.constant('questionId', questionId)
			.constant('respondent', respondent)
			.directive('traisiRoutesV1', downgradeComponent({ component: RoutesV1Component }) as angular.IDirectiveFactory);

		app.config([
			'$compileProvider',
			$compileProvider => {
				// $compileProvider.debugInfoEnabled(false);
			}
		]);

		app.filter('customDate', DateFilter.Factory());
		app.filter('customDateBrackets', DateFilterBrackets.Factory());
		app.filter('htmlFilter', ['$sce', HtmlFilter.Factory()]);
		app.filter('ordinalFilter', OrdinalFilter.Factory());
		app.filter('secondsToHourMinute', TimeFilter.Factory());

		app.controller('TripsController', [
			'$scope',
			'$rootScope',
			'$http',
			'$ngRedux',
			'$animate',
			'$mdpTimePicker',
			'$window',
			'$location',
			'$translate',
			'$cookies',
			'SurveyConfigService',
			'TripDiaryService',
			'$timeout',
			'routesService',
			'SurveyV2Id',
			'respondent',
			TripDiaryController
		]);

		return true;
	}
}
