import {TripLocation} from "./trip-location";
import {TripRoute} from "./trip-route";
export interface TripsQuestionState {

    initialView: boolean;
    noTripsSelectView: boolean;
    completeView: boolean;
    mapView: boolean;
    locationView: boolean;
    timelineView: boolean;
    tripsLocationView: boolean;
    activeTripLocation: TripLocation;
    tripLocations: TripLocation[];
    startLocation: TripLocation;
    endLocation: TripLocation;
    tripRoutes: TripRoute[];
    routeModeView: boolean;
    activeRouteIndex: number,
    switchRouteModeActive: boolean,
    switchRouteModeLocation: L.LatLng,
    activeMode: string,
    madeTrips: {
        value: boolean,
        reason: string
    };
    previousAction: string,
    previousActionPayload: Object;

}