import { IModule } from 'angular';

import * as angular from 'angular';
import SurveyManagerController from './survey-manager-controller';

import * as ngAria from 'angular-aria';
import * as ngMaterial from 'angular-material';
import * as ngTranslate from 'angular-translate';
import 'leaflet';
import 'leaflet-routing-machine';
import 'color';
import { SurveyConfigService } from 'routes/components/routes/v1/shared/services/survey-config-service';

let surveyId = window['SURVEY_ID'];
let userId = window['USER_ID'];

/**
 * Class for managing the state of each survey page (and interacting with each page question
 */
export class SurveyManager {
	static modules: Array<string> = [];

	private app: IModule;

	private conroller: SurveyManagerController;

	/**
	 * Registers a module with the global survey manager, assumes module has already been initialized
	 * @param {string} name
	 */
	static registerModule(name: string) {
		SurveyManager.modules.push(name);
	}

	/**
	 *
	 */
	constructor() {
		/* Register survey manager controller */

		let surveyManagerModule: IModule = angular.module('surveyManagerModule', [ngAria, ngMaterial, ngTranslate]);

		surveyManagerModule
			.controller('SurveyManagerController', [
				'$scope',
				'$rootScope',
				'$http',
				'$window',
				'$mdSidenav',
				'$location',
				'$translate',
				'SurveyConfigService',
				SurveyManagerController
			])
			.config(function($interpolateProvider: angular.IInterpolateProvider) {
				$interpolateProvider.startSymbol('{$');
				$interpolateProvider.endSymbol('$}');
			})
			.config(function($locationProvider) {
				$locationProvider.html5Mode(false).hashPrefix('');
			})
			.config(function($httpProvider: ng.IHttpProvider) {
				$httpProvider.useApplyAsync();
			})
			.factory('SurveyConfigService', ['$http', SurveyConfigService.Factory(userId, surveyId, '')]);

		SurveyManager.registerModule(surveyManagerModule.name);
	}

	/**
	 * Bootstrap the main surveey app
	 */
	public surveyBootstrap() {
		angular.element(document).ready(() => {
			angular.bootstrap('#smc-app-container', SurveyManager.modules, {
				strictDi: true
			});
			window['angular'] = angular;
			window['modules'] = SurveyManager.modules;
		});
	}
}
