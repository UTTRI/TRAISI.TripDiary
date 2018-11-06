import * as angular from 'angular';
import { SurveyManager } from './survey-manager';
import { TripDiary } from './trips-diary';

// survey manager
let surveyManager: SurveyManager = new SurveyManager();

// All modules that should be bootstrapped
// new TripDiary.TripDiaryModule().bootstrap();

// Bootstrap root app once DOM has finished loading

window['tripDiaryModule'] = new TripDiary.TripDiaryModule();
angular.element(document).on('ready', () => {
	surveyManager.surveyBootstrap();
});
