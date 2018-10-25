import {TripLeg} from './trip-leg';
import * as L from 'leaflet';
import {TripLocation} from "./trip-location";
import {config} from "./config";
import {Type} from "class-transformer";
import "reflect-metadata";
import {isNullOrUndefined} from "util";
/**
 *
 */
export class TripRoute {
    /**
     *
     * @param {TripLocation} startLocation
     * @param {TripLocation} endLocation
     */
    constructor() {


    }

    /**
     * Each leg of this route, each leg is broken into different modes
     */
    private _tripLegs: TripLeg[];

    get tripLegs(): TripLeg[] {
        return this._tripLegs;
    }

    set tripLegs(value: TripLeg[]) {
        this._tripLegs = value;
    }

    @Type(() => TripLocation)
    private _startLocation: TripLocation;

    get startLocation(): TripLocation {
        return this._startLocation;
    }

    set startLocation(value: TripLocation) {
        this._startLocation = value;
    }

    @Type(() => TripLocation)
    private _endLocation: TripLocation;

    get endLocation(): TripLocation {
        return this._endLocation;
    }

    set endLocation(value: TripLocation) {
        this._endLocation = value;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _editComplete: boolean;

    get editComplete(): boolean {
        return this._editComplete;
    }

    set editComplete(value: boolean) {
        this._editComplete = value;
    }

    _activeTripLegIndex: number;

    get activeTripLegIndex(): number {
        return this._activeTripLegIndex;
    }

    set activeTripLegIndex(value: number) {
        this._activeTripLegIndex = value;
    }

    /**
     * Determines whether embedded location is
     * @param secondInFirst 
     * @returns true if embedded location 
     */
    private isEmbeddedLocation(secondInFirst: boolean): boolean {
        
        let tripLocation1 = this.startLocation;
        let tripLocation2 = this.endLocation;
        if (secondInFirst) {
            if (tripLocation2._startTime > tripLocation1._startTime &&
                tripLocation2._endTime > tripLocation1._startTime && tripLocation2._startTime < tripLocation1._endTime &&
                tripLocation2._endTime < tripLocation1._endTime) {
                return true;
            }
            else {
                return false;
            }
        }
        else 
        {
            if (tripLocation1._startTime > tripLocation2._startTime &&
                tripLocation1._endTime > tripLocation2._startTime && 
                (isNullOrUndefined(tripLocation2._endTime) || tripLocation1._startTime < tripLocation2._endTime) &&
                (isNullOrUndefined(tripLocation2._endTime) || tripLocation1._endTime < tripLocation2._endTime)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    public getAdjustedStartTime(): Date {
        let locOneInTwo = this.isEmbeddedLocation(false);
        let locTwoInOne = this.isEmbeddedLocation(true);

        if (locOneInTwo || (!locOneInTwo && !locTwoInOne))
        {
            return this.startLocation.endTime;
        }
        else
        {
            return null;
        }
        
    }

    public getAdjustedEndTime(): Date {
        let locOneInTwo = this.isEmbeddedLocation(false);
        let locTwoInOne = this.isEmbeddedLocation(true);
        if (locTwoInOne || (!locOneInTwo && !locTwoInOne))
        {
            return this.endLocation.startTime;
        }
        else
        {
            return null;
        }      
    }

    /**
     *
     * @param {TripLocation} startLocation
     * @param {TripLocation} endLocation
     * @returns {TripRoute}
     */
    public static create(startLocation: TripLocation, endLocation: TripLocation): TripRoute {
        let tripRoute = new TripRoute();

        tripRoute._tripLegs = [];
        tripRoute._endLocation = endLocation;
        tripRoute._startLocation = startLocation;
        tripRoute._activeTripLegIndex = 0;
        tripRoute._editComplete = false;


        tripRoute._tripLegs[0] = new TripLeg();
        tripRoute.tripLegs[0]._isComplete = false;

        tripRoute.tripLegs[0].waypoints = [];
        tripRoute.tripLegs[0].waypoints[0] = startLocation.latLng;
        tripRoute.tripLegs[0].waypoints[1] = endLocation.latLng;


        tripRoute.tripLegs[0]._mode = config.modes["transit"];


        tripRoute.init();

        return tripRoute;
    }

    /**
     * Compares two routes and determines if they are "similar". Similar being they have the same start and end
     * locations, but other properties can vary (location type etc). This is to check preservation of used data
     * when recreating routes.
     * @param {TripRoute} route1
     * @param {TripRoute} route2
     */
    public static similarRoutes(route1: TripRoute, route2: TripRoute): boolean {

        if (route1.startLocation.id == route2.startLocation.id && route1.endLocation.id == route2.endLocation.id) {


            if (route1.startLocation.latLng.lat == route2.startLocation.latLng.lat && route1.endLocation.latLng.lat == route2.endLocation.latLng.lat) {

                return true;
            }
        }
        else {
            return false;
        }
    }

    public generateId() {
        this.id = Math.random().toString(36).substring(7);
    }

    public init() {
        //this.latLng = new L.LatLng(0, 0);
        this.id = Math.random().toString(36).substring(7);
        //console.log(new L.LatLng(0, 0));
    }


}