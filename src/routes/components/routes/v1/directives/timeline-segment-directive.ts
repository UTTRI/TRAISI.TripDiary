import {IDirective} from "angular";

import * as angular from 'angular';
import {TripDiaryController} from "../controllers/trip-diary-controller";

import * as  moment from 'moment';


import {ITimelineScope} from "../timeline-scope";

import * as _ from 'lodash';

export class TimelineSegmentDirective {


    get element(): ng.IAugmentedJQuery {
        return this._element;
    }

    set element(value: ng.IAugmentedJQuery) {
        this._element = value;
    }

    get attrs(): ng.IAttributes {
        return this._attrs;
    }

    set attrs(value: ng.IAttributes) {
        this._attrs = value;
    }

    get tripsController(): TripDiaryController {
        return this._tripsController;
    }

    set tripsController(value: TripDiaryController) {
        this._tripsController = value;
    }

    private _element: ng.IAugmentedJQuery;

    private _attrs: ng.IAttributes;

    private _tripsController: TripDiaryController;

    //public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    public templateUrl = '/static/dist/directives/trips/templates/timeline-segment.html';

    public scope = {

        state: '=state',
        locationId: '@locationId',
        startOfDay: '@startOfDay'

    }

    /**
     *
     * @param scope
     * @param element
     * @param attrs
     */
    public link(scope: ITimelineScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
        this.tripsController = scope.$parent.tc;

        this.element = element;

        this.attrs = attrs;

        let a = angular.element("#timeline-tabs")[0];


        scope['startOfDay'] = Date.parse(scope['startOfDay']);

        let tomorrow;
        let startOfDay;
        let startTime;
        let endTime;

        if (scope.state == null) {
            return;
        }


        let updateDisplay = (newVal) => {


            if (startOfDay == undefined) {
                return;
            }
            var width = 0;
            var translateX = 0;
            if (scope.state._locationType == 'START_LOCATION') {

                var duration = moment.duration(startOfDay.diff(endTime));

                var hours = duration.asHours();

                width = (newVal / 24) * Math.abs(hours);

            }

            else if (scope.state._locationType.toString() == 'END_LOCATION') {
                /* calculate end of day minus arrive time */


                startTime = moment(scope.state._startTime);
                if (startTime.hours() >= 4) {
                    tomorrow = moment(scope.state._startTime).add(1, 'days').hours(4).minutes(0);

                    var duration = moment.duration(tomorrow.diff(startTime));

                    var hours = duration.asHours();


                    width = (newVal / 24) * Math.abs(hours);

                    /* translate x to align with the right */
                    translateX = newVal - width;
                }
                else {

                    startTime = startTime.add('days', 1);
                    tomorrow = moment(scope.state._startTime).add(1, 'days').hours(4).minutes(0);

                    var duration = moment.duration(tomorrow.diff(startTime));

                    var hours = duration.asHours();


                    width = (newVal / 24) * Math.abs(hours);

                    /* translate x to align with the right */
                    translateX = newVal - width;
                }

            }
            else {
                var duration = moment.duration(startTime.diff(endTime));


                var hours = duration.asHours();

                width = (newVal / 24) * Math.abs(hours);

                /* get the start x */


                let st = startTime.clone();
                let et = endTime.clone();
                /* if (startTime.hours() >= 0 && startTime.hours() < 4) {
                     st = st.add(24, 'hours');
                 }


                 if (endTime.hours() >= 0 && endTime.hours() < 4) {
                     et.add(24, 'hours');

                 } */

                //console.log(st);
                if (st.hours() < 24 && et.hours() >= 4) {
                    duration = moment.duration(st.diff(startOfDay));
                    hours = duration.asHours();

                    console.log("hours1");

                }
                else {

                    duration = moment.duration(st.diff(et));


                    width = (newVal / 24) * Math.abs(duration.asHours());

                    hours = moment.duration(st.diff(startOfDay)).asHours();
                    console.log("hours2");
                }


                translateX = (newVal / 24) * Math.abs(hours);
                //console.log(translateX);


            }

            var css = {
                width: width + "px",
                transform: "translateX(" + translateX + "px)"

            };

            element.css(
                css
            );


            scope.$root.$emit('timelineSegmentChanged', scope['locationId']);


        };


        element.ready(() => {
            _.defer(() => {
                scope.$root.$emit('timelineSegmentChanged', scope['locationId']);
            });
        });


        scope.$watch(() => {
            return a.clientWidth;

        }, (newVal, oldVal) => updateDisplay(newVal));

        scope.$watch(() => {
                return scope.state
            },
            (newValue, oldValue) => {

                if (scope.state._startTime) {

                    startTime = moment(scope.state._startTime);


                    tomorrow = moment(scope['startOfDay']).add(1, 'days').hours(4).minutes(0);

                    startOfDay = moment(scope['startOfDay']).hours(0).minutes(0);
                }

                if (scope.state._endTime) {

                    endTime = moment(scope.state._endTime);
                    var m = moment(scope['startOfDay']);

                    tomorrow = m.add(1, 'days').hours(4).minutes(0);

                    startOfDay = moment(scope['startOfDay']).hours(4).minutes(0);
                }


                updateDisplay(a.clientWidth);
                //window.dispatchEvent(new Event('resize'));


            });


    }


    /**
     *
     */
    constructor() {

    }

    /**
     *
     */
    public static Factory() {
        var directive = () => {
            return new TimelineSegmentDirective();
        };


        directive['$inject'] = [];
        directive['restrict'] = 'E';


        return directive;
    }

}