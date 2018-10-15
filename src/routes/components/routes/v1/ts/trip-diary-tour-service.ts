//import {INgRedux} from "ng-redux";
import {TripDiaryService} from "./trip-diary-service";
import {TripsQuestionState} from "./trips-question-state";
import * as tours from './trip-diary-tour';
import * as _ from "lodash";
import {TripLeg} from "./trip-leg";
import {
    SET_SWITCH_ROUTE_MODE_STATE, SET_TRIP_LEG_EDIT_COMPLETE, SET_TRIP_MODE,
    TRIP_ROUTE_MODE_VIEW, ADD_TRIP_LOCATION_DATA, REMOVE_TRIP_LOCATION
} from "./trips-actions";
import {TripRoute} from "./trip-route";
import {isNullOrUndefined} from "util";


declare var Tour: any;

enum Tours {
    TIMELINE_TOUR = "TIMELINE_TOUR",
    ROUTE_MAP_TOUR = "ROUTE_MAP_TOUR",
    TOGGLED_ROUTE_MAP_TOUR = "TOGGLED_ROUTE_MAP_TOUR",
    END_LOCATION_TOUR = "TIMELINE_END_LOCATION_TOUR",
    INTERMEDIATE_TOUR = "TIMELINE_INTERMEDIATE_TOUR"
}

export const ADD_START_LOCATION_BUTTON = "ADD_START_LOCATION_BUTTON";
export const END_LOCATION_BUTTON = "END_LOCATION_BUTTON";
export const ADD_INTERMEDIATE_LOCATION_BUTTON = "ADD_INTERMEDIATE_LOCATION_BUTTON";

/**
 *
 */
export class TripDiaryTourService {
    public questionId;
    private _tours = {};
    private _scrollVisibleComponents: { [name: string]: boolean } = {};
    /**
     *
     */
    private stateSubscription = () => {


        if (!isNullOrUndefined(this)) {
            let state = this.state();

            if (state.previousAction == SET_TRIP_LEG_EDIT_COMPLETE) {
                console.log("routes shown");
                this.routesShown();
            }
        }

    }

    public timelineShownByOption() {
        this._isTimelineHidden = false;

        this.timelineShown();
    }

    /**
     *
     * @param {INgRedux} _$ngRedux
     */
    constructor(private _$ngRedux: any, private _$translate: ng.translate.ITranslateService) {


        //_$ngRedux.subscribe(this.stateSubscription);


    }

    private _isTimelineHidden = false;

    get isTimelineHidden(): boolean {
        return this._isTimelineHidden;
    }

    set isTimelineHidden(value: boolean) {
        this._isTimelineHidden = value;
    }

    /**
     *
     * @returns {($ngRedux) => TripDiaryTourService}
     * @constructor
     */
    static Factory() {


        let service = ($ngRedux, $translate) => {

            return new TripDiaryTourService($ngRedux, $translate);
        };

        return service;
    }

    /**
     *
     */
    public timelineHiddenByOption() {
       // this._isTimelineHidden = true;

       // this.timelineHidden();
    }

    /**
     *
     */
    public timelineHidden() {

       // this._tours[Tours.TIMELINE_TOUR].end();
      //  this._tours[Tours.END_LOCATION_TOUR].end();
       // this._tours[Tours.INTERMEDIATE_TOUR].end();


    }

    public hideStartLocationTour() {
        //this._tours[Tours.TIMELINE_TOUR].end();
    }

    public hideEndLocationTour() {
        //this._tours[Tours.END_LOCATION_TOUR].end();
    }

    public hideIntermediateLocationTour() {
        //this._tours[Tours.INTERMEDIATE_TOUR].end();
    }

    /**
     *
     */
    public tripLegShown() {
        if (this.isElementVisible(TRIP_ROUTE_MODE_VIEW)) {
            this.configureRouteMapTour();
        }
    }

    public tripLegHidden() {

        //this._tours[Tours.ROUTE_MAP_TOUR].end();
        //this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].end();
    }

    /**
     *
     */
    public routesShown() {


        let activeTripRoute: TripRoute = this.state().tripRoutes[this.state().activeRouteIndex];
        //active trip leg
        let activeTripLeg: TripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];


        if (!activeTripLeg._isComplete) {
            this.configureRouteMapTour();
        }
        else {
            this.nextLegTour();
        }


    }

    /**
     * When routes are hidden
     */
    public routesHidden() {


        //this._tours[Tours.ROUTE_MAP_TOUR].end();
        //this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].end();
    }

    /**
     *
     */
    public timelineShown() {

        if (window.matchMedia('(min-width: 480px)').matches) {
            if (isNullOrUndefined(this.state().startLocation)) {
                if (this.isElementVisible(ADD_START_LOCATION_BUTTON) && !this._isTimelineHidden) {
                    _.delay(() => {
                        this._tours[Tours.TIMELINE_TOUR].start(true);
                        this._tours[Tours.TIMELINE_TOUR].redraw();
                    }, 0);
                }
            }
            if (isNullOrUndefined(this.state().endLocation)) {
                if (this.isElementVisible(END_LOCATION_BUTTON) && !this._isTimelineHidden) {
                    _.delay(() => {
                        this._tours[Tours.END_LOCATION_TOUR].start(true);
                        this._tours[Tours.END_LOCATION_TOUR].redraw();
                    }, 0);
                }
            }

            if (!isNullOrUndefined(this.state().startLocation) && !isNullOrUndefined(this.state().endLocation) && !this._isTimelineHidden) {

                if (this.state().tripRoutes.length == 0 && this.state().previousAction != ADD_TRIP_LOCATION_DATA ||
                    this.state().tripRoutes.length == 2 && this.state().previousAction == REMOVE_TRIP_LOCATION) {

                    //if (this.isElementVisible(ADD_INTERMEDIATE_LOCATION_BUTTON)) {
                    _.delay(() => {
                        this._tours[Tours.INTERMEDIATE_TOUR].start(true);
                        this._tours[Tours.INTERMEDIATE_TOUR].redraw();
                    }, 100);
                    //console.log("shjowing intermedaite tour");
                    //}
                }
            }
            else {
                this._tours[Tours.INTERMEDIATE_TOUR].end();
            }
        }
    }

    /**
     * Activates the route map tour (that is togglable)
     */
    public toggleRouteMapTour() {



        //disable automatic tour
        this._tours[Tours.ROUTE_MAP_TOUR].end();


        _.delay(() => {
            this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].restart();
            this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].start(true);
            // this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].goTo(0);
        }, 200);


    }

    /**
     *
     * @param {string} questionId
     */
    public setQuestionId(questionId: string, translateData: any) {

        return;

        this.questionId = questionId;


        let tour = _.cloneDeep(tours.default.tour);
        let endLocationTour = _.cloneDeep(tours.default.endLocationTour);
        let intermediateLocationTour = _.cloneDeep(tours.default.intermediateLocationTour);
        let routeMapTour = _.cloneDeep(tours.default.routeMapTour);
        let toggledRouteMapTour = _.cloneDeep(tours.default.toggledRouteMapTour);


        this.translateTour(tour, translateData, (tour) => {
            this.ReplaceIterate(tour, "({{\s+)(\S+)(\s+}})", this.questionId);
            this._tours[Tours.TIMELINE_TOUR] = new Tour(tour);
            this._tours[Tours.TIMELINE_TOUR].init();


        });

        this.translateTour(endLocationTour, translateData, (tour) => {
            this.ReplaceIterate(tour, "({{\s+)(\S+)(\s+}})", this.questionId);
            this._tours[Tours.END_LOCATION_TOUR] = new Tour(tour);
            this._tours[Tours.END_LOCATION_TOUR].init();


        });

        this.translateTour(intermediateLocationTour, translateData, (tour) => {
            this.ReplaceIterate(tour, "({{\s+)(\S+)(\s+}})", this.questionId);
            this._tours[Tours.INTERMEDIATE_TOUR] = new Tour(tour);
            this._tours[Tours.INTERMEDIATE_TOUR].init();


        });

        //this.ReplaceIterate(tour, "({{\s+)(\S+)(\s+}})", this.questionId);
        //this.ReplaceIterate(endLocationTour, "({{\s+)(\S+)(\s+}})", this.questionId);
        //this.ReplaceIterate(intermediateLocationTour, "({{\s+)(\S+)(\s+}})", this.questionId);
        this.ReplaceIterate(routeMapTour, "({{\s+)(\S+)(\s+}})", this.questionId);
        this.ReplaceIterate(toggledRouteMapTour, "({{\s+)(\S+)(\s+}})", this.questionId);


        this._tours[Tours.ROUTE_MAP_TOUR] = new Tour(routeMapTour);
        this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR] = new Tour(toggledRouteMapTour);
        //this._tours[Tours.END_LOCATION_TOUR] = new Tour(endLocationTour);
        this._tours[Tours.INTERMEDIATE_TOUR] = new Tour(intermediateLocationTour);


        this._tours[Tours.ROUTE_MAP_TOUR].init();
        this._tours[Tours.TOGGLED_ROUTE_MAP_TOUR].init();
        //this._tours[Tours.END_LOCATION_TOUR].init();
        //this._tours[Tours.INTERMEDIATE_TOUR].init();


    }

    private translateTour(tour, translateData, callback) {


        let translateStrings = [];
        for (let step of tour.steps) {

            translateStrings.push(step.content);
            translateStrings.push(step.title);
        }


        this._$translate(translateStrings, translateData).then((values) => {


            for (let key in values) {

                for (let step of tour.steps) {
                    step.title = step.title.replace(new RegExp(key, 'g'), values[key]);
                    step.content = step.content.replace(new RegExp(key, 'g'), values[key]);
                }
            }

            callback(tour);


        });


    }

    /**
     *
     * @param {TripsQuestionState} tripsState
     */
    public manageTourState(tripsState: TripsQuestionState) {


    }

    /**
     *
     * @param {string} elementName
     * @param {boolean} visible
     */

    public initializeTimelineButtonVisibility() {
        this._scrollVisibleComponents[ADD_START_LOCATION_BUTTON] = true;
        this._scrollVisibleComponents[END_LOCATION_BUTTON] = true;
        this._scrollVisibleComponents[ADD_INTERMEDIATE_LOCATION_BUTTON] = false;
    }

    /**
     *
     * @param {string} elementName
     * @param {boolean} visible
     */
    public setElementScrollVisibility(elementName: string, visible: boolean) {


        if (this._scrollVisibleComponents[elementName] != visible) {
            this._scrollVisibleComponents[elementName] = visible;
        }
        else {
            return;
        }

        if ((elementName == ADD_START_LOCATION_BUTTON || elementName == END_LOCATION_BUTTON || elementName == ADD_INTERMEDIATE_LOCATION_BUTTON) && visible) {
            this.timelineShown();
        }
        else if (elementName == ADD_START_LOCATION_BUTTON && !visible) {
            this.hideStartLocationTour();
        }
        else if (elementName == END_LOCATION_BUTTON && !visible) {
            this.hideEndLocationTour();
        }
        else if (elementName == ADD_INTERMEDIATE_LOCATION_BUTTON && !visible) {
            this.hideIntermediateLocationTour();
        }
        else if (elementName == TRIP_ROUTE_MODE_VIEW && !visible) {

            this.routesHidden();
        }
        else if (elementName == TRIP_ROUTE_MODE_VIEW && visible) {


            this.routesShown();
        }

    }

    /**
     *
     * @returns {TripsQuestionState}
     */
    private state(): TripsQuestionState {
        return this._$ngRedux.getState().tripsState;
    }

    /**
     * Gets called when all visilibty requirements are met to display
     */
    private configureRouteMapTour() {
        return;
        if (window.matchMedia('(min-width: 480px)').matches) {
            if (this.state().activeRouteIndex == 0) {
                let activeTripRoute: TripRoute = this.state().tripRoutes[this.state().activeRouteIndex];
                //active trip leg
                let activeTripLeg: TripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];

                let tour = this._tours[Tours.ROUTE_MAP_TOUR];


                _.delay(() => {

                        if (isNullOrUndefined(activeTripLeg.mode) && activeTripRoute.activeTripLegIndex == 0) {
                            tour.setCurrentStep(0);
                            tour.start(true);
                        }

                    }
                    , 600);
                //this._tours[Tours.ROUTE_MAP_TOUR].start(true);
            }
        }
    }

    /**
     *
     */
    private nextLegTour() {
        if (window.matchMedia('(min-width: 480px)').matches) {
            if (this.state().tripRoutes.length > 1) {

                let activeRouteIndex = this.state().activeRouteIndex;

                if (activeRouteIndex == 0 && this.state().tripRoutes[0].editComplete && !this.state().tripRoutes[1].editComplete) {

                    this._tours[Tours.ROUTE_MAP_TOUR].setCurrentStep(4);
                    this._tours[Tours.ROUTE_MAP_TOUR].start(true);
                    this._tours[Tours.ROUTE_MAP_TOUR].redraw();
                }
                else {
                    this._tours[Tours.ROUTE_MAP_TOUR].end();
                }
            }
        }
    }

    /**
     *
     * @param {string} element
     * @returns {boolean}
     */
    private isElementVisible(element: string) {
        if (!this._scrollVisibleComponents.hasOwnProperty(element)) {
            this._scrollVisibleComponents[element] = false;
            return false;
        }
        return this._scrollVisibleComponents[element];
    }

    /**
     *
     * @param obj
     * @param regex
     * @param replace
     * @constructor
     */
    private ReplaceIterate(obj, regex, replace) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object")
                    this.ReplaceIterate(obj[property], regex, replace);
                else if (typeof obj[property] == "string") {

                    obj[property] = obj[property].replace("{{id}}", replace);

                }
            }
        }
    }

    /**
     *
     * @param {TripsQuestionState} state
     * @returns {boolean}
     */
    private manageRouteMapTour(state: TripsQuestionState): boolean {


        return true;
    }
}