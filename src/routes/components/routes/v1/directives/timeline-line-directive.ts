import {ITimelineScope} from "../timeline-scope";
import * as _ from 'lodash';
import {TripDiaryTimelineLineController} from "../controllers/trip-diary-timeline-line-controller";


/**
 *
 */
export class TimelineLineDirective {


    private _$window: ng.IWindowService;

    /**
     *
     * @param window Injected window service
     */
    constructor(window: ng.IWindowService) {

        this._$window = window;
    }

    /**
     *
     * @param {ITimelineScope} scope
     * @param {angular.IAugmentedJQuery} element
     * @param {angular.IAttributes} attrs
     */
    public link(scope: ITimelineScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {


        element.ready(() => {


            _.defer(() => {


                scope.$root.$emit('timelineLineChanged');
            });
        });


    }

    controller = ($scope, TripDiaryService, $ngRedux) => {

        return new TripDiaryTimelineLineController($scope, TripDiaryService, $ngRedux);
    }

    controllerAs = "_tllc";


    public
    templateUrl: string = '/static/dist/directives/trips/templates/timeline-line.html';

    $inject = ['$window']

    /**
     * Factory method for the timeline directive
     */
    public static

    Factory(url: string = null) {

        var directive = ($window) => {
            return new TimelineLineDirective($window);
        };

        return directive;
    }

}