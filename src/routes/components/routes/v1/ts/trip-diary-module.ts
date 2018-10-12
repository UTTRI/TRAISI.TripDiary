import {SurveyMapDirective} from '../shared/directives/survey-map-directive';
import * as angular from 'angular';

import * as ngAria from 'angular-aria';
import * as ngCookies from 'angular-cookies';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as ngTimePicker from 'angular-material-time-picker';
import * as ngTranslate from 'angular-translate';
import * as ngSanitize from 'angular-sanitize';

import reducers from './trips-reducers';
import {DateFilter} from '../shared/filters/date-filter';
import {DateFilterBrackets} from '../shared/filters/date-filter-brackets';
import {default as ngRedux} from 'ng-redux';
import {IModule} from 'angular';
import {SurveyConfigService} from '../shared/services/survey-config-service';
import {TimelineDirective} from '../directives/timeline-directive';
import {TimelineSegmentDirective} from '../directives/timeline-segment-directive';
import {TripRouteModeDirective} from '../directives/trip-route-mode-directive';
import {TripDiaryController} from '../controllers/trip-diary-controller';
import 'angular-translate-loader-static-files';
import 'angular-translate-interpolation-messageformat';

import {TimelineLineDirective} from "../directives/timeline-line-directive";
import {TimelineLineMapDirective} from "../directives/timeline-line-map-directive";
import {HtmlFilter} from "../shared/filters/html-filter";

import {TimelineConnectorDirective} from "../directives/timeline-connector-directive"



let surveyId = window['SURVEY_ID'];
let userId = window['USER_ID'];


import {TripDiaryService} from "./trip-diary-service";
import {TripDiaryTourService} from "./trip-diary-tour-service";
import {OrdinalFilter} from "../shared/filters/ordinal-filter";
import {TimeFilter} from "../shared/filters/time-filter";
import {ScrollViewWatcher} from "../shared/directives/scroll-view-watcher";
import {PreventScrollDirective} from "../shared/directives/prevent-scroll-directive";
import {DragResizeDirective} from "../shared/directives/drag-resize-directive";


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
     *
     * @param {string} questionId
     * @returns {boolean}
     */
    bootstrap(questionId: string): boolean {



        /* Create app and controller */
        let app: IModule = angular.module("trips", [ngRedux, ngMessages, ngAria, ngMaterial, ngTimePicker, ngTranslate, ngCookies, ngSanitize]).config(($ngReduxProvider) => {
            let reducer = reducers;
            $ngReduxProvider.createStoreWith(reducer);
        })
            .config(($compileProvider) => {
                $compileProvider.preAssignBindingsEnabled(true);
                $compileProvider.commentDirectivesEnabled(false);
                $compileProvider.cssClassDirectivesEnabled(false);
                //$compileProvider.debugInfoEnabled(false);
            })
            .config(function ($httpProvider: ng.IHttpProvider) {
                $httpProvider.useApplyAsync();
            })
            .config(function ($mdThemingProvider) {
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue')
                    .accentPalette('red');
            })
            .config(function ($locationProvider) {

                $locationProvider.html5Mode(false).hashPrefix('');

            })
            .config(function ($translateProvider: angular.translate.ITranslateProvider) {
                // add translation table
                $translateProvider.useStaticFilesLoader({
                    prefix: '/static/dist/localization/trips-',
                    suffix: '.json'
                });
                $translateProvider.useMessageFormatInterpolation();
                $translateProvider.useSanitizeValueStrategy('sanitize');
                $translateProvider.preferredLanguage('en');
            })
            .config(function ($interpolateProvider: angular.IInterpolateProvider) {
                $interpolateProvider.startSymbol('{$');
                $interpolateProvider.endSymbol('$}');
            })
            .directive("scrollViewWatcher", ['$window', ScrollViewWatcher.Factory()])
            .directive("preventScroll", ['$window', PreventScrollDirective.Factory()])
            .directive("dragResize", ['$window', DragResizeDirective.Factory()])
            .directive("timelineSegment", ['$ngRedux', TimelineSegmentDirective.Factory()])
            .directive("timeline", ['$window', '$timeout', 'QUESTION_ID', TimelineDirective.Factory()])
            .directive("timelineLine", ['$window', TimelineLineDirective.Factory()])
            .directive("timelineLineMap", ['$window', TimelineLineMapDirective.Factory()])
            .directive("timelineConnector", ['$window', '$timeout', TimelineConnectorDirective.Factory()])
            .directive("tripRouteMode", ['$ngRedux', '$mdPanel', 'TripDiaryService', '$timeout', '$mdDialog', TripRouteModeDirective.Factory()])
            .directive("surveyMap", ['$http', '$compile', '$templateRequest', 'TripDiaryService', '$rootScope', SurveyMapDirective.Factory()])
            .directive("surveyMapRouter", ['$http', '$compile', '$templateRequest', 'TripDiaryService', '$rootScope', SurveyMapDirective.Factory()])
            .factory('SurveyConfigService', ['$http', SurveyConfigService.Factory(userId, surveyId, '')])
            .factory('TripDiaryService', ['$ngRedux', 'TripDiaryTourService', TripDiaryService.Factory()])
            .factory('TripDiaryTourService', ['$ngRedux', '$translate', TripDiaryTourService.Factory()])
            .constant('QUESTION_ID', questionId)
            .constant('questionId', questionId);

        app.config(['$compileProvider', ($compileProvider) => {
            // $compileProvider.debugInfoEnabled(false);
        }]);

        app.filter('customDate', DateFilter.Factory());
        app.filter('customDateBrackets', DateFilterBrackets.Factory());
        app.filter('htmlFilter', ['$sce', HtmlFilter.Factory()]);
        app.filter('ordinalFilter', OrdinalFilter.Factory());
        app.filter('secondsToHourMinute', TimeFilter.Factory());

        app.controller("TripsController",
            ['$scope', '$rootScope', '$http', '$ngRedux', '$animate', '$mdpTimePicker', '$window', '$location',
                '$translate', '$cookies', 'SurveyConfigService', 'TripDiaryTourService', 'TripDiaryService', '$timeout', TripDiaryController]);


        


        //console.log(SurveyManager.modules);
        return true;


    }


}