import {TripDiaryController} from "../controllers/trip-diary-controller";
import {ITimelineScope} from "../timeline-scope";

import * as angular from 'angular';
import {TripTimeline} from "../trip-timeline";
import {
    TIMELINE_LOCATION_CONTROLLER_READY,
    TripDiaryTimelineLocationController
} from "../controllers/trip-diary-timeline-location-controller";

/**
 * Timeline Directive
 */
export class TimelineDirective {

    private _element: ng.IAugmentedJQuery;

    private _attrs: ng.IAttributes;

    private _tripsController: TripDiaryController;

    private _$scope: ITimelineScope;

    private _timelineSegments: Array<any>;

    private _$window: ng.IWindowService;

    private tc;

    private _tripTimeline: TripTimeline;

    private _$timeout: ng.ITimeoutService;


    public templateUrl = function (): string {


        return '/static/dist/directives/trips/templates/timeline.html';
    };


    /**
     *
     * @param {ITimelineScope} scope
     * @param {angular.IAugmentedJQuery} element
     * @param {angular.IAttributes} attrs
     */
    public link(scope: ITimelineScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {

        this._tripsController = scope.$parent.tc;
        this._attrs = attrs;
        this._element = element;
        this._$scope = scope;

        this.tc = this._tripsController;

        this._tripTimeline = new TripTimeline();

        scope._tripTimeline = this._tripTimeline;


        this.init(element);


    }


    /**
     * Initialization function
     */
    private init(element: ng.IAugmentedJQuery) {


        let currentDayElement = element.find('.current-day')[0];

        //console.log(currentDayElement);

        let nextDayElement = element.find('.next-day')[0];

        let scopeRef = this._$scope;

        this._timelineSegments = [];


        $('.md-up-arrow').attr('tabindex', -1);
        $('.md-down-arrow').attr('tabindex', -1);

        angular.element(document).ready(() => {


            if (!scopeRef.$$phase) {
                scopeRef.$digest();
            }
            this.resize(currentDayElement, nextDayElement);

        });


        angular.element(this._$window).bind('resize', () => {


            this.resize(currentDayElement, nextDayElement);
            if (!scopeRef.$$phase) {
                scopeRef.$digest();
            }


        });


        scopeRef.$watch('tc.state.madeTrips.value', (newValue, oldValue) => {


            if (newValue == true) {


                this._$timeout(() => {
                    this.resize(currentDayElement, nextDayElement);
                    if (!scopeRef.$$phase) {
                        // scopeRef.$digest();
                    }
                });


            }
        }, true);


        // this._$timeout()


        //this._element.ready(() => {
        this._$timeout(0).then(() => {
            // console.log("here");
            this.resize(currentDayElement, nextDayElement);
            //window.dispatchEvent(new Event('resize'));
        });

        // });


    }


    private resize(currentDayElement, nextDayElement) {
        let width: number = this._element[0].querySelector('.timeline-values').clientWidth;

        let tabWidth: number = width / 24;

        currentDayElement.style.width = (width - (4 * tabWidth)) + "px";
        nextDayElement.style.width = "auto";


        //
    }


    /**
     *
     * @param window Injected window service
     */
    constructor(window: ng.IWindowService, timeout: ng.ITimeoutService, private _questionId: string) {

        this._$window = window;
        this._$timeout = timeout;


    }

    controller = ($scope, TripDiaryService, $ngRedux, $mdDialog, $translate, SurveyConfigService) => {

        return new TripDiaryTimelineLocationController($scope, TripDiaryService, $ngRedux, this._questionId, $mdDialog, $translate, SurveyConfigService);
    };

    controllerAs = "_tdtl";


    /**
     *
     * @param {string} url
     * @returns {($window, $timeout, questionId) => TimelineDirective}
     * @constructor
     */
    public static Factory(url: string = null) {

        var directive = ($window, $timeout, questionId) => {
            return new TimelineDirective($window, $timeout, questionId);
        };

        if (url != null) {
            directive['url'] = url;
        }

        directive['$inject'] = ['$window', '$timeout', 'QUESTION_ID'];


        return directive;
    }

}