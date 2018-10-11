import {TripMode} from "./trip-mode";
import {TripRoute} from "./trip-route";
import {IModeConfig} from "../shared/survey-map-config";

/**
 * A TripLeg contains a start and finish point, as well as the mode used for transit (and the route taken)
 */
export class TripLeg {
    _coordinates: L.LatLng [];
    _routeIndex: number;
    id: string;
    _isComplete: boolean;

    constructor() {

        this._waypoints = [];
        this._coordinates = [];
        this._data = {};

        this.id = Math.random().toString(36).substring(10);

    }

    private _instructions: string;

    get instructions(): string {
        return this._instructions;
    }

    set instructions(value: string) {
        this._instructions = value;
    }

    private _data: {};

    get data(): {} {
        return this._data;
    }

    set data(value: {}) {
        this._data = value;
    }

    _mode: TripMode;

    get mode(): TripMode {
        return this._mode;
    }

    set mode(value: TripMode) {
        this._mode = value;
    }

    _waypoints: L.LatLng [];

    public get waypoints(): L.LatLng [] {
        return this._waypoints;
    }

    public set waypoints(value: L.LatLng []) {
        this._waypoints = value;
    }

    _legName: string;

    get legName(): string {
        return this._legName;
    }

    set legName(value: string) {
        this._legName = value;
    }

    public _unknownRoute: boolean;

    get unknownRoute(): boolean {
        return this._unknownRoute;
    }

    set unknownRoute(value: boolean) {
        this._unknownRoute = value;
    }

    public addExtraData(key, value) {
        this._data[key] = value;
    }


}