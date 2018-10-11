import {TripDiaryService} from "../trip-diary-service";
import {INgRedux} from "ng-redux";
import {TripsQuestionState} from "../trips-question-state";
import {
    ADD_TRIP_LOCATION_VIEW, CANCEL_ADD_TRIP_LOCATION, OPTION_NO_TRIPS_TAKEN, OPTION_TRIPS_TAKEN,
    UPDATE_STATE, ADD_TRIP_LOCATION_DATA, EDIT_TRIP_LOCATION_DATA, REMOVE_TRIP_LOCATION, EDIT_TRIP_LOCATION_VIEW
} from "../trips-actions";
import * as _ from "lodash";
import {isNullOrUndefined} from "util";
import SurveyManagerController from "../../../survey/survey-manager-controller";
import * as angular from "angular";
import {TripDiaryTimelineDialogController} from "./trip-diary-timeline-dialog-controller";
import {TripLocationType} from "../trip-location";
import {IPromise} from "angular";
import {TripDiaryTimelineHomeConfirmDialogController} from "./trip-diary-timeline-home-confirm-dialog-controller";
import {SurveyConfigService} from "../../shared/services/survey-config-service";

declare var displaySnackBar: (string, any, number) => any;
export const TIMELINE_LOCATION_CONTROLLER_READY = "TIMELINE_LOCATION_CONTROLLER_READY";

export class TripDiaryTimelineLocationController {
    get whichLocationsTourHeader(): string {
        return this._whichLocationsTourHeader;
    }

    set whichLocationsTourHeader(value: string) {
        this._whichLocationsTourHeader = value;
    }

    $inject = ['$scope', 'TripDiaryService', '$ngRedux', 'QUESTION_ID', '$mdDialog', '$translate'];
    /**
     *
     * @param activePage
     * @returns {boolean}
     */
    private onNext: (activePage) => boolean = (activePage) => {

        if (!isNullOrUndefined(activePage.parentQuestion)) {
            if (activePage.parentQuestion.id != this.questionId) {
                return true;
            }
        }
        else {
            if (activePage['id'] != this.questionId) {
                return true;
            }
        }

        if (activePage[0].dataset.segmentName == "TIMELINE") {
            //set active route to 0
            if (isNullOrUndefined(this._tripDiaryService.state.startLocation) ||
                isNullOrUndefined(this._tripDiaryService.state.endLocation)) {
                displaySnackBar("Please enter where you started and ended your day!", "errorMsg", 1500)
                return false;
            }
            else if (this._tripDiaryService.state.tripRoutes.length == 0) {
                displaySnackBar("Please enter all visited locations!", "errorMsg", 1500)
                return false;
            }
        }

        return true;
    };

    /**
     *
     * @param {angular.IScope} _$scope
     * @param {TripDiaryService} _tripDiaryService
     * @param {INgRedux} _$ngRedux
     * @param _questionId
     * @param _$mdDialog
     * @param _$translate
     */
    constructor(private _$scope: ng.IScope, private _tripDiaryService: TripDiaryService, private _$ngRedux: INgRedux, private _questionId,
                private _$mdDialog: ng.material.IDialogService, private _$translate: angular.translate.ITranslateService,
                private SurveyConfigService: SurveyConfigService) {


        _$ngRedux.subscribe(() => {
            this.stateSubscription();
        });


    }

    private _timelineTourHeader1;

    get timelineTourHeader1() {
        return this._timelineTourHeader1;
    }

    set timelineTourHeader1(value) {
        this._timelineTourHeader1 = value;
    }

    private _timelineTourContent1;

    get timelineTourContent1() {
        return this._timelineTourContent1;
    }

    set timelineTourContent1(value) {
        this._timelineTourContent1 = value;
    }

    get $mdDialog() {
        return this._$mdDialog;
    }

    set $mdDialog(value) {
        this._$mdDialog = value;
    }

    get $translate(): ng.translate.ITranslateService {
        return this._$translate;
    }

    set $translate(value) {
        this._$translate = value;
    }

    get questionId() {
        return this._questionId;
    }

    set questionId(value) {
        this._questionId = value;
    }

    private _timePickerAmPmElementRef;

    get timePickerAmPmElementRef() {
        return this._timePickerAmPmElementRef;
    }

    set timePickerAmPmElementRef(value) {
        this._timePickerAmPmElementRef = value;
    }


    private _whichLocationsTourHeader: string;

    /**
     *
     */
    $onInit() {


        this.update();
        this.initTimeInput();


        // resize child
        this._$scope.$emit('timelineLineChanged');

        let smc: SurveyManagerController = window['smc'];

        smc.addOnNext(this.onNext);

        this.$translate('TIMELINE_TOUR_DIALOG_1_TITLE', this._$scope['tc']['translateData']).then((value) => {


            this.timelineTourHeader1 = value;

        });


        this.$translate('TIMELINE_TOUR_DIALOG_1_BODY', this._$scope['tc']['translateData']).then((value) => {

            this.timelineTourContent1 = value;
        });

        this.$translate('TIMELINE_TOUR_WHICH_LOCATIONS_INCLUDE', this._$scope['tc']['translateData']).then((value) => {

            this.whichLocationsTourHeader = value;
        });


    }

    /**
     * Initializes and finds references to the md-time-picker element.
     * Sets up trackers that watch the AM/PM status and updates accordingly for user QoL
     */
    private initTimeInput() {


    }

    /**
     *
     */
    private update() {
        let state: TripsQuestionState = this._$ngRedux.getState().tripsState;

        if (state.previousAction == CANCEL_ADD_TRIP_LOCATION
            || state.previousAction == ADD_TRIP_LOCATION_DATA
            || state.previousAction == EDIT_TRIP_LOCATION_DATA
            || state.previousAction == OPTION_TRIPS_TAKEN
            || state.previousAction == REMOVE_TRIP_LOCATION) {
            this._tripDiaryService.timelineShown();
            $('#fade').removeClass('black_overlay');
        }
        if (state.previousAction == UPDATE_STATE && !isNullOrUndefined(state.madeTrips) && state.madeTrips.value) {
            this._tripDiaryService.timelineShown();
        }
        if (state.previousAction == UPDATE_STATE && !isNullOrUndefined(state.madeTrips) && !state.madeTrips.value) {
            this._tripDiaryService.timelineHidden();
        }

        if (state.previousAction == EDIT_TRIP_LOCATION_VIEW) {
            this._tripDiaryService.timelineHidden();
            var darkOverlay = document.getElementById("fade");
            _.delay( () => {
                $('#fade').addClass('black_overlay');
            }, 200);
        }

        if (state.previousAction == ADD_TRIP_LOCATION_VIEW) {
            this._tripDiaryService.timelineHidden();
            _.delay( () => {
                $('#fade').addClass('black_overlay');
            }, 200);
        }

        if (state.previousAction == OPTION_NO_TRIPS_TAKEN) {
            this._tripDiaryService.timelineHidden();
        }

        if (isNullOrUndefined(state.startLocation) && state.previousAction == OPTION_TRIPS_TAKEN) {
            _.delay(() => {
                this._tripDiaryService.timelineShownByOption();
            }, 500);
        }

        //check if both start and end are set
        if (state.previousAction == ADD_TRIP_LOCATION_DATA) {
            if (state.tripLocations.length == 0 && !isNullOrUndefined(state.startLocation) && !isNullOrUndefined(state.endLocation)) {
                //show dialog for next
                this.showIntmediateLocationTourDialog();


            }

        }
    }

    /**
     *
     */
    private showIntmediateLocationTourDialog() {

        this.showTimelineDialog(this.timelineTourHeader1, this.timelineTourContent1);

    }

    /**
     *
     */
    private stateSubscription() {


        this.update();
    }


    /**
     *
     * @param {string} header
     * @param {string} description
     */
    private showTimelineDialog(header: string, description: string) {

        this.$mdDialog.show({
            controller: TripDiaryTimelineDialogController,
            locals: {
                headerText: header,
                descriptionText: description
            },


            templateUrl: '/static/dist/directives/trips/templates/timeline-dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
        })

            .then((result) => {


                //console.log("callin back");
                //callback(result);


            }, () => {

                //console.log("cancelled?");
            });
    }

    /**
     *
     * @param {string} header
     * @param {string} description
     */
    private showEndLocationConfirmDialog(): any {


        return this.$mdDialog.show({
            controller: TripDiaryTimelineHomeConfirmDialogController,
            locals: {translateData: this._$scope['tc']['translateData']},


            templateUrl: '/static/dist/directives/trips/templates/timeline-confirm-home-dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true,
        });

    }


    /**
     *
     */
    private showTimlineToggleTourDialog() {

        this.showTimelineDialog(this.whichLocationsTourHeader, this._timelineTourContent1);
    }

    /**
     *
     * @param location
     */
    private addEndLocation(location = null) {


        let homeCount = 0;
        let locations = this.SurveyConfigService.surveyLocations;

        for (let location of locations) {
            if (location.purpose.toLowerCase() == "home") {
                homeCount++;
                break;
            }
        }


        if (homeCount <= 0) {
            this._tripDiaryService.addTripLocation(TripLocationType.FinalLocation, null);
        }
        else {

            if (!isNullOrUndefined(location) && location.purpose.toLowerCase() == "home") {
                this._tripDiaryService.addTripLocation(TripLocationType.FinalLocation, location);
            }
            else {
                this.showEndLocationConfirmDialog().then((v) => {

                    if (v == null) {
                        this._tripDiaryService.addTripLocation(TripLocationType.FinalLocation, location);
                    }
                    else {
                        this._tripDiaryService.addTripLocation(TripLocationType.FinalLocation, v);
                    }
                }, () => {

                    this._tripDiaryService.addTripLocation(TripLocationType.FinalLocation, location);
                });
            }
        }


    }
}