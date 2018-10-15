import {SurveyMapMarker} from "../shared/survey-map-marker";
import {MarkerType} from "../shared/survey-map-marker-type";
import {ISurveyLocation} from "../shared/services/survey-location";
import {Type} from "serializer.ts/Decorators";

export enum TripLocationType {
    StartLocation = "START_LOCATION",
    FinalLocation = "END_LOCATION",
    IntermediateLocation = "INTERMEDIATE_LOCATION"
}

export enum TimelineIcon {
    Home = "home",
    Work = "work",
    School = "school",
    Shopping = "shopping_cart",
    Daycare = "child_friendly",
    Default = "place",
    Passenger = "fas fa-car",
    Other = "map"
}

/**
 * Trip Location, attachable to a Map
 */
export class TripLocation extends SurveyMapMarker {
    get lockedLocationId(): string {
        return this._lockedLocationId;
    }

    set lockedLocationId(value: string) {
        this._lockedLocationId = value;
    }

    _valid: boolean;
    _invalidReason: string;
    _lockedLocationData: ISurveyLocation;
    public timelineIcon: TimelineIcon;
    private _lockedLocationId: string;

    constructor() {
        super();

        this._locationInput = "";
        this._lockedLocationData = null;
        this._locationName = "";


    }

    private _locationName;

    get locationName() {
        return this._locationName;
    }

    /**
     *
     * @param {string} value
     */
    set locationName(value: string) {
        this._locationName = value;
        this.label = value;

        if (value != undefined) {

        }
    }

    private _locationInput;

    get locationInput() {
        return this._locationInput;
    }

    set locationInput(value) {
        this._locationInput = value;
    }

    private _locationPurpose: string;

    get locationPurpose(): string {
        return this._locationPurpose;
    }

    set locationPurpose(value: string) {
        this._locationPurpose = value;

        if (value.toUpperCase() == 'SHOPPING') {
            this.markerType = MarkerType.Shopping;
            this.timelineIcon = TimelineIcon.Shopping;
        }
        else if (value.toUpperCase() == 'DAYCARE') {
            this.markerType = MarkerType.Daycare;
            this.timelineIcon = TimelineIcon.Daycare;
        }
        else if (value.toUpperCase() == 'FACILITATE_PASSENGER') {
            this.markerType = MarkerType.Passenger;
            this.timelineIcon = TimelineIcon.Passenger;
        }
        else if (value.toUpperCase() == 'OTHER') {
            this.markerType = MarkerType.Other;
            this.timelineIcon = TimelineIcon.Other;
        }
        else if (value.toUpperCase() == "HOME") {
            this.markerType = MarkerType.Home;
            this.timelineIcon = TimelineIcon.Home;
        }
        else if (value.toUpperCase() == "WORK") {
            this.markerType = MarkerType.Work;
            this.timelineIcon = TimelineIcon.Work;
        }
        else if (value.toUpperCase() == "SCHOOL") {
            this.markerType = MarkerType.School;
            this.timelineIcon = TimelineIcon.School;
        }
        else if (value.toUpperCase() == "OTHER") {

            this.markerType = MarkerType.Other;
            this.timelineIcon = TimelineIcon.Other;
        }
        else {
            this.markerType = MarkerType.Default;
            this.timelineIcon = TimelineIcon.Default;
        }

        this.label = value;

    }

    @Type(() => Date)
    _startTime: Date;

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(value: Date) {
        this._startTime = value;
    }

    @Type(() => Date)
    _endTime: Date;

    get endTime(): Date {
        return this._endTime;
    }

    set endTime(value: Date) {
        this._endTime = value;
    }

    _locationType: TripLocationType;

    get locationType(): TripLocationType {
        return this._locationType;
    }

    set locationType(value: TripLocationType) {
        this._locationType = value;
    }

    _lockedLocation: boolean;

    get lockedLocation(): boolean {
        return this._lockedLocation;
    }

    set lockedLocation(value: boolean) {
        this._lockedLocation = value;
    }

    private _otherLocationName: string;

    get otherLocationName(): string {
        return this._otherLocationName;
    }

    set otherLocationName(value: string) {
        this._otherLocationName = value;
    }

    private _otherLocationPurpose: string;

    /**
     *
     * @returns {string}
     */
    get otherLocationPurpose() {
        return this._otherLocationPurpose;
    }

    /**
     *
     * @param {string} value
     */
    set otherLocationPurpose(value: string) {


    }

    /**
     *
     * @returns {string}
     */
    public displayName(): string {
        if (this._locationName != undefined) {
            if (this._locationName.toUpperCase() != 'OTHER') {
                return this._locationName;
            }


            else {
                return this._otherLocationName
            }
        }
        else {
            return this._otherLocationName;
        }
    }

    /**
     * Determines if the time / end time set  by this location is valid.
     * @returns {boolean}
     */
    public valid(): boolean {
        if (this._startTime.getHours() <= 4) {
            return false;
        }

        if (this._locationName == null) {
            return false;
        }

        return true;

    }


}