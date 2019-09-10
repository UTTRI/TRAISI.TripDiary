import { TripLeg } from './trip-leg';
import { TripsQuestionState } from './trips-question-state';
import {
	ADD_TRIP_LEG_EXTRA_DATA,
	ADD_TRIP_LOCATION_DATA,
	ADD_TRIP_LOCATION_VIEW,
	CANCEL_ADD_TRIP_LOCATION,
	EDIT_TRIP_LOCATION_DATA,
	EDIT_TRIP_LOCATION_VIEW,
	OPTION_DEFAULT_VIEW,
	OPTION_NO_TRIPS_TAKEN,
	NO_TRIPS_REASON_GIVEN,
	OPTION_TRIPS_TAKEN,
	REMOVE_MODE_SWITCH,
	REMOVE_TRIP_LEG,
	REMOVE_TRIP_LOCATION,
	SET_MODE_SWITCH_DATA,
	SET_ROUTE_EDIT_ACTIVE,
	SET_ROUTE_EDIT_COMPLETE,
	SET_ROUTE_EDIT_INCOMPLETE,
	SET_SWITCH_ROUTE_MODE_STATE,
	SET_TRIP_LEG_ACTIVE,
	SET_TRIP_LEG_DATA,
	SET_TRIP_LEG_EDIT_COMPLETE,
	SET_TRIP_LEG_INCOMPLETE,
	SET_TRIP_LEG_WAYPOINTS,
	SET_TRIP_MODE,
	SET_UNKNOWN_ROUTE,
	TRIP_ROUTE_MODE_VIEW,
	UPDATE_STATE,
	UPDATE_TRIP_ROUTES
} from './trips-actions';

import * as redux from 'redux';
import { combineReducers } from 'redux';
import { TripLocation, TripLocationType } from './trip-location';
import { TripRoute } from './trip-route';
import { TripsReducersHelper } from './trips-reducers-helper';

import { ISurveyLocation } from '../shared/services/survey-location';
import { deserialize, plainToClass, plainToClassFromExist } from 'class-transformer';
import { isNullOrUndefined } from 'util';
import { last as _last, clone as _clone, first as _first } from 'lodash';
export let INITIAL_STATE: TripsQuestionState = {
	initialView: true,
	noTripsSelectView: false,
	completeView: false,
	mapView: false,
	locationView: false,
	timelineView: false,
	tripsLocationView: false,
	activeTripLocation: null,
	tripLocations: [],
	startLocation: null,
	endLocation: null,
	routeModeView: null,
	activeRouteIndex: -1,
	tripRoutes: [],
	activeMode: null,
	switchRouteModeLocation: null,
	switchRouteModeActive: false,
	madeTrips: {
		value: null,
		reason: null
	},
	previousAction: '',
	previousActionPayload: {}
};

/**
 *
 * @param {TripsQuestionState} state
 * @param action
 * @returns {any}
 */
export function tripsState(state = INITIAL_STATE, action) {
	if (!action || !action.type) {
		return state;
	}

	let newState = null;
	if (action.payload != null && action.payload.newState != null) {
		newState = Object.assign({}, action.payload.newState) as TripsQuestionState;
	} else {
		newState = Object.assign({}, state) as TripsQuestionState;
	}

	if (action.hasOwnProperty('payload')) {
		if (action.payload.updateHistory) {
			// history.pushState(state, "state");
		}
	}

	newState.previousAction = action.type;
	newState.previousActionPayload = action.payload;
	switch (action.type) {
		case OPTION_DEFAULT_VIEW:
			newState.initialView = true;
			newState.noTripsSelectView = false;
			newState.timelineView = false;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;
			break;
		case OPTION_NO_TRIPS_TAKEN:
			newState.initialView = false;
			newState.noTripsSelectView = true;
			newState.tripsLocationView = false;
			break;
		case NO_TRIPS_REASON_GIVEN:
			break;
		case OPTION_TRIPS_TAKEN:
			newState.initialView = false;
			newState.timelineView = true;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;
			newState.routeModeView = false;
			break;
		case ADD_TRIP_LOCATION_VIEW:
			newState.timelineView = false;
			newState.initialView = false;
			newState.mapView = true;
			newState.locationView = true;
			newState.tripsLocationView = true;
			newState.activeTripLocation = new TripLocation();
			newState.activeTripLocation.locationType = action.payload.locationType;

			if (newState.activeTripLocation.locationType === TripLocationType.StartLocation) {
				let date = new Date();
				date.setHours(4);
				date.setMinutes(0);
				date.setSeconds(0);
				newState.activeTripLocation.startTime = date;
			} else if (newState.activeTripLocation.locationType === TripLocationType.FinalLocation) {
				let date = new Date();
				date.setHours(3);
				date.setMinutes(59);
				date.setSeconds(58);
				newState.activeTripLocation.endTime = date;
			}

			if (action.payload.locationPipe !== undefined) {
				let location: ISurveyLocation = action.payload.locationPipe;

				newState.activeTripLocation._lockedLocationData = action.payload.locationPipe;
				newState.activeTripLocation._lockedLocation = true;
				newState.activeTripLocation.lockedLocationId = location.id;
				newState.activeTripLocation.locationName = location.name;
				newState.activeTripLocation.locationInput = location.address;
				newState.activeTripLocation.latLng = location.latLng;
				newState.activeTripLocation.lat = location.latLng.lat;
				newState.activeTripLocation.lng = location.latLng.lng;

				if (!isNullOrUndefined(location.purpose)) {
					newState.activeTripLocation.locationPurpose = location.purpose;
				}
			} else {
				newState.activeTripLocation._lockedLocation = false;
			}

			break;

		case REMOVE_TRIP_LOCATION:
			newState.initialView = false;
			newState.timelineView = true;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;

			let toDelete: TripLocation = action.payload.tripLocation;

			if (newState.startLocation != null && newState.startLocation.id === toDelete.id) {
				newState.startLocation = null;
			}
			if (newState.endLocation != null && newState.endLocation.id === toDelete.id) {
				newState.endLocation = null;
			}

			for (let i = 0; i < newState.tripLocations.length; i++) {
				if (newState.tripLocations[i].id === toDelete.id) {
					newState.tripLocations.splice(i, 1);
					break;
				}
			}

			newState.activeTripLocation = null;

			break;

		case CANCEL_ADD_TRIP_LOCATION:
			newState.initialView = false;
			newState.timelineView = true;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;
			newState.activeTripLocation = null;
			newState.previousAction = CANCEL_ADD_TRIP_LOCATION;

			/* remove last "leg" added to trip details*/

			break;
		case ADD_TRIP_LOCATION_DATA:
			/* Move active trip location into array and set active to null */
			newState.initialView = false;
			newState.timelineView = true;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;
			if (newState.activeTripLocation.endTime.getHours() >= 0 && newState.activeTripLocation.endTime.getHours() < 4) {
				newState.activeTripLocation.endTime.setHours(newState.activeTripLocation.endTime.getHours() + 24);

				// console.log(newState.activeTripLocation.endTime);
			}

			if (newState.activeTripLocation.startTime.getHours() >= 0 && newState.activeTripLocation.startTime.getHours() < 4) {
				newState.activeTripLocation.startTime.setHours(newState.activeTripLocation.startTime.getHours() + 24);

				// console.log(newState.activeTripLocation.endTime);
			}

			if (newState.activeTripLocation.locationType === TripLocationType.IntermediateLocation) {
				let found: boolean = false;

				for (let i = 0; i < newState.tripLocations.length; i++) {
					if (newState.tripLocations[i].id === newState.activeTripLocation.id) {
						newState.tripLocations[i] = newState.activeTripLocation;
						found = true;

						break;
					}
				}

				if (!found) {
					newState.tripLocations.push(newState.activeTripLocation);
				}

				TripsReducersHelper.sortTripLocations(newState.tripLocations);
			} else if (newState.activeTripLocation.locationType === TripLocationType.StartLocation) {
				newState.startLocation = newState.activeTripLocation;
			} else {
				newState.endLocation = newState.activeTripLocation;
			}

			// determine if any locations are "locked" to this one
			if (newState.activeTripLocation.locationType === TripLocationType.StartLocation) {
				// check all intermediate + last location
				if (!isNullOrUndefined(newState.endLocation)) {
					if (newState.endLocation.lockedLocation) {
						if (newState.endLocation._lockedLocationData.id === newState.activeTripLocation.id) {
							newState.endLocation.latLng.lat = newState.activeTripLocation.latLng.lat;
							newState.endLocation.latLng.lng = newState.activeTripLocation.latLng.lng;
							newState.endLocation.locationInput = newState.activeTripLocation.locationInput;
						}
					}
				}

				for (let i = 0; i < newState.tripLocations.length; i++) {
					if (newState.tripLocations[i].lockedLocation) {
						if (newState.tripLocations[i]._lockedLocationData.id === newState.activeTripLocation.id) {
							newState.tripLocations[i].latLng.lat = newState.activeTripLocation.latLng.lat;
							newState.tripLocations[i].latLng.lng = newState.activeTripLocation.latLng.lng;
							newState.tripLocations[i].locationInput = newState.activeTripLocation.locationInput;
						}
					}
				}
			}

			newState.activeTripLocation = null;

			break;
		case EDIT_TRIP_LOCATION_DATA:
			/* Move active trip location into array and set active to null */
			newState.initialView = false;
			newState.timelineView = true;
			newState.mapView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;

			if (newState.activeTripLocation.locationType === TripLocationType.IntermediateLocation) {
				newState.tripLocations[action.payload.index] = newState.activeTripLocation;
			} else if (newState.activeTripLocation.locationType === TripLocationType.StartLocation) {
				newState.startLocation = newState.activeTripLocation;
			} else {
				newState.endLocation = newState.activeTripLocation;
			}

			newState.activeTripLocation = null;

			TripsReducersHelper.sortTripLocations(newState.tripLocations);

			break;
		case EDIT_TRIP_LOCATION_VIEW:
			newState.timelineView = false;
			newState.initialView = false;
			newState.mapView = true;
			newState.locationView = true;
			newState.tripsLocationView = true;
			newState.activeTripLocation = TripsReducersHelper.hydrateTripLocation(action.payload.tripLocation);
			newState.activeTripLocation.id = action.payload.tripLocation._id;

			break;
		case TRIP_ROUTE_MODE_VIEW:
			newState.initialView = false;
			newState.timelineView = false;
			newState.noTripsSelectView = false;
			newState.tripsLocationView = false;
			newState.locationView = false;
			newState.routeModeView = true;
			break;

		case UPDATE_TRIP_ROUTES:
			newState.tripRoutes = action.payload.tripRoutes;
			if (isNullOrUndefined(newState.activeRouteIndex) || newState.activeRouteIndex === -1) {
				newState.activeRouteIndex = 0;
			}

			break;
		case SET_ROUTE_EDIT_ACTIVE:
			newState.activeRouteIndex = action.payload.routeIndex;
			break;

		case SET_ROUTE_EDIT_COMPLETE:
			newState.tripRoutes[action.payload.routeIndex].editComplete = true;

			break;

		case SET_ROUTE_EDIT_INCOMPLETE:
			// newState.activeRouteIndex = -1;
			newState.tripRoutes[action.payload.routeIndex].editComplete = false;

			break;
		case SET_TRIP_MODE:
			let activeTripRoute = newState.tripRoutes[newState.activeRouteIndex] as TripRoute;
			let activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex] as TripLeg;

			activeTripLeg._mode = { modeName: action.payload.mode, modeCategory: action.payload.category };
			activeTripLeg._routeIndex = 0;

			if (!action.payload.usesWaypoints) {
				let w1 = activeTripLeg._waypoints[0];
				let w2 = _last(activeTripLeg._waypoints);
				activeTripLeg._waypoints = [w1, w2];
			}

			newState.previousAction = SET_TRIP_MODE;
			newState.activeMode = action.payload.category;

			break;

		case SET_TRIP_LEG_DATA:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];

			activeTripLeg._coordinates = action.payload.coordinates;
			activeTripLeg._waypoints = action.payload.waypoints;
			activeTripLeg._legName = action.payload.legName;
			activeTripLeg._routeIndex = action.payload.routeIndex;
			activeTripLeg.instructions = action.payload.instructions;
			activeTripLeg._unknownRoute = false;

			break;

		case SET_SWITCH_ROUTE_MODE_STATE:
			newState.switchRouteModeActive = action.payload.active;
			break;

		case ADD_TRIP_LEG_EXTRA_DATA:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex] as TripRoute;
			activeTripLeg = plainToClass(TripLeg, activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex] as TripLeg);

			let extraData: [{ [v: string]: string }] = action.payload.data;

			for (let p of Object.keys(extraData)) {
				activeTripLeg.addExtraData(p, extraData[p]);
			}

			activeTripRoute.tripLegs[activeTripRoute._activeTripLegIndex] = activeTripLeg;

			break;

		case SET_TRIP_LEG_INCOMPLETE:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex];

			activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];

			// set active trip leg to edit complete
			if (activeTripLeg._coordinates.length > 2) {
				activeTripLeg._isComplete = true;
			}
			activeTripRoute.editComplete = false;

			activeTripLeg = activeTripRoute.tripLegs[action.payload.tripLegIndex];
			activeTripLeg._isComplete = false;
			activeTripRoute.activeTripLegIndex = action.payload.tripLegIndex;

			break;

		case SET_TRIP_LEG_WAYPOINTS:
			activeTripRoute = newState.tripRoutes[action.payload.tripRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[action.payload.tripLegIndex];

			activeTripLeg._waypoints = action.payload.waypoints;
			activeTripLeg._coordinates = [];
			activeTripLeg._isComplete = false;

			break;

		case SET_TRIP_LEG_EDIT_COMPLETE:
			activeTripRoute = newState.tripRoutes[action.payload.tripRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[action.payload.tripLegIndex];

			activeTripLeg._isComplete = true;

			let allComplete: boolean = true;

			for (let tLeg of activeTripRoute.tripLegs) {
				if (tLeg._isComplete === false) {
					allComplete = false;
				}
			}

			activeTripRoute.editComplete = allComplete;

			break;

		case REMOVE_MODE_SWITCH:
			activeTripRoute = newState.tripRoutes[action.payload.tripRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[action.payload.tripLegIndex];
			activeTripRoute.activeTripLegIndex = action.payload.tripLegIndex;

			/* combine the trip legs for the active trip leg, and the one after */

			// special case, use route end point as end of this trip leg
			if (activeTripRoute.tripLegs.length === 1) {
				// nothing
			} else if (activeTripRoute.tripLegs.length === 2) {
				activeTripRoute.tripLegs.splice(1, 1);

				activeTripLeg._coordinates = new Array<L.LatLng>();
				activeTripLeg._waypoints = new Array<L.LatLng>();
				activeTripLeg._waypoints.push(activeTripRoute.startLocation.latLng);
				activeTripLeg._waypoints.push(activeTripRoute.endLocation.latLng);
				activeTripLeg._coordinates.push(activeTripRoute.startLocation.latLng);
				activeTripLeg._coordinates.push(activeTripRoute.endLocation.latLng);
			} else {
				let toRemove: TripLeg = activeTripRoute.tripLegs[activeTripRoute._activeTripLegIndex + 1];

				let startWaypoint = _clone(activeTripLeg._waypoints[0]);
				let endWaypoint = _clone(_last(toRemove._waypoints));

				activeTripRoute.tripLegs.splice(activeTripRoute._activeTripLegIndex + 1, 1);

				activeTripLeg._waypoints = [startWaypoint, endWaypoint];
				activeTripLeg._coordinates = [];
			}

			activeTripLeg._isComplete = false;

			break;

		case SET_MODE_SWITCH_DATA:
			/* get active trip route and split the active leg */

			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex] as TripRoute;
			activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];

			let switchLocation = newState.switchRouteModeLocation;

			let leg = new TripLeg();

			leg._isComplete = false;

			// start is the switch location
			leg.waypoints.push(_clone(switchLocation));

			// end point is the end
			leg.waypoints.push(_clone(_last(activeTripLeg._waypoints)));

			// active trip location is  the switch location

			let start = _clone(activeTripLeg._waypoints[0]);
			activeTripLeg._waypoints = [];
			activeTripLeg._waypoints.push(start);
			activeTripLeg._waypoints.push(_clone(switchLocation));
			activeTripLeg._coordinates = [];

			activeTripRoute.tripLegs.splice(activeTripRoute.activeTripLegIndex + 1, 0, leg);

			newState.switchRouteModeActive = false;

			if (activeTripLeg._mode !== undefined) {
				// activeTripRoute['_activeTripLegIndex'] = activeTripRoute['_activeTripLegIndex'] + 1;
			}

			break;
		case SET_TRIP_LEG_ACTIVE:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];

			activeTripRoute.activeTripLegIndex = action.payload.tripLegIndex;

			break;

		case REMOVE_TRIP_LEG:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex];
			// activeTripRoute.activeTripLegIndex = action.payload.tripLegIndex;

			// splice the trip route
			if (activeTripRoute.tripLegs.length > 1) {
				activeTripRoute.tripLegs.splice(action.payload.tripLegIndex, 1);
			}

			break;

		case SET_UNKNOWN_ROUTE:
			activeTripRoute = newState.tripRoutes[newState.activeRouteIndex];
			activeTripLeg = activeTripRoute.tripLegs[activeTripRoute.activeTripLegIndex];
			activeTripLeg._unknownRoute = true;
			// activeTripLeg._isComplete = true;
			activeTripLeg._coordinates = [];
			activeTripLeg._coordinates[0] = _first(activeTripLeg._waypoints);
			activeTripLeg._coordinates[1] = _last(activeTripLeg._waypoints);

			if (action.payload.setComplete) {
				activeTripLeg._isComplete = true;
			}

			// activeTripLeg._unknownRouteDescription = action.payload._unknownRouteDescription;

			let allCompleteUR: boolean = true;

			for (let tLeg of activeTripRoute.tripLegs) {
				if (tLeg._isComplete === false) {
					allComplete = false;
				}
			}

			activeTripRoute.editComplete = allCompleteUR;

			break;

		case UPDATE_STATE:
			let startLocation = plainToClass(TripLocation, newState.startLocation);
			let endLocation = plainToClass(TripLocation, newState.endLocation);
			let tripLocations = plainToClass(TripLocation, newState.tripLocations);

			newState.tripLocations = tripLocations;
			newState.startLocation = startLocation;
			newState.endLocation = endLocation;

			// deserialize tripRoutes
			let tripRoutes = <TripRoute[]><any>plainToClass(TripRoute, newState.tripRoutes);
			if (isNullOrUndefined(tripRoutes)) {
				tripRoutes = [];
			}
			newState.tripRoutes = tripRoutes;

			if (!isNullOrUndefined(newState.endLocation)) {
				newState.endLocation.endTime = plainToClass(Date, newState.endLocation._endTime);
				newState.endLocation.startTime = plainToClass(Date, newState.endLocation._startTime);
			}

			if (!isNullOrUndefined(newState.startLocation)) {
				newState.startLocation.startTime = plainToClass(Date, newState.startLocation._startTime);
				newState.startLocation.endTime = plainToClass(Date, newState.startLocation._endTime);
			}

			if (isNullOrUndefined(tripLocations)) {
				newState.tripLocations = [];
			}
			for (let i = 0; i < newState.tripLocations.length; i++) {
				newState.tripLocations[i].startTime = plainToClass(Date, newState.tripLocations[i].startTime);
				newState.tripLocations[i].endTime = plainToClass(Date, newState.tripLocations[i].endTime);
			}

			for (let tripRoute of tripRoutes) {
				for (let i = 0; i < tripRoute.tripLegs.length; i++) {
					tripRoute.tripLegs[i] = plainToClass(TripLeg, tripRoute.tripLegs[i]);
				}
			}

			newState.activeTripLocation = plainToClass(TripLocation, newState.activeTripLocation);
			newState.previousAction = UPDATE_STATE;
			break;

		/* hydrate trip routes */

		default:
			return newState;
	}

	return newState;
}

/**
 * Combine all reducers
 * @type {Reducer<any>}
 */
const reducers = redux.combineReducers({
	tripsState
});

export default reducers;
