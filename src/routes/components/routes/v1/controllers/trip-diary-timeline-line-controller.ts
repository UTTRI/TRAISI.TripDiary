import {TripDiaryService} from "../trip-diary-service";
import {INgRedux} from "ng-redux";
import {TripsQuestionState} from "../trips-question-state";
import {ADD_TRIP_LOCATION_DATA, REMOVE_TRIP_LOCATION} from "../trips-actions";
import {
    ADD_INTERMEDIATE_LOCATION_BUTTON, ADD_START_LOCATION_BUTTON,
    END_LOCATION_BUTTON
} from "../trip-diary-tour-service";
import {TripLocationType} from "../trip-location";

export class TripDiaryTimelineLineController {

    private $inject = ['$scope', 'TripDiaryService', '$ngRedux'];

    /**
     *
     * @param {angular.IScope} _$scope
     * @param {TripDiaryService} _tripDiaryService
     * @param {INgRedux} _$ngRedux
     */
    constructor(private _$scope: ng.IScope, private _tripDiaryService: TripDiaryService, private _$ngRedux: INgRedux) {


        _$ngRedux.subscribe(() => {

            let state: TripsQuestionState = _$ngRedux.getState().tripsState;

            if (state.previousAction == ADD_TRIP_LOCATION_DATA || state.previousAction == REMOVE_TRIP_LOCATION) {
                _$scope.$emit('timelineLineChanged');
            }
        });
    }

    private iScrollEnter() {

        this._tripDiaryService.setElementScrollVisibility(ADD_INTERMEDIATE_LOCATION_BUTTON, true);
    }

    private iScrollLeave() {
        this._tripDiaryService.setElementScrollVisibility(ADD_INTERMEDIATE_LOCATION_BUTTON, false);
    }

    private endScrollEnter() {

        this._tripDiaryService.setElementScrollVisibility(END_LOCATION_BUTTON, true);
    }

    private endScrollLeave() {
        this._tripDiaryService.setElementScrollVisibility(END_LOCATION_BUTTON, false);
    }

    /**
     * Called when the "Add Start Location" button scrolls into view.
     */
    private startScrollEnter() {


        this._tripDiaryService.setElementScrollVisibility(ADD_START_LOCATION_BUTTON, true);
    }

    /**
     * Called when the "Add Start Location" button scrolls out of view.
     */
    private startScrollLeave() {


        this._tripDiaryService.setElementScrollVisibility(ADD_START_LOCATION_BUTTON, false);
        //this._tripDiaryService.timelineHidden();


    }


    /**
     *
     */
    $onInit() {


        this._tripDiaryService.timelineShown();


    }
}
