import { tripsState } from './trips-reducers';
import { TripsQuestionState } from './trips-question-state';
import { TripLocation, TripLocationType } from './trip-location';
import { TripRoute } from './trip-route';
import { ISurveyLocation } from '../shared/services/survey-location';

export const OPTION_NO_TRIPS_TAKEN = 'OPTION_NO_TRIPS_TAKEN';
export const NO_TRIPS_REASON_GIVEN = 'NO_TRIPS_REASON_GIVEN';
export const OPTION_TRIPS_TAKEN = 'OPTION_TRIPS_TAKEN';
export const ADD_TRIP_LOCATION_VIEW = 'ADD_TRIP_LOCATION_VIEW';
export const REMOVE_TRIP_LOCATION = 'REMOVE_TRIP_LOCATION';
export const ADD_TRIP_MODE = 'ADD_TRIP_MODE';
export const REMOVE_TRIP_MODE = 'REMOVE_TRIP_MODE';
export const UPDATE_STATE = 'UPDATE_STATE';
export const CANCEL_ADD_TRIP_LOCATION = 'CANCEL_ADD_TRIP_LOCATION';
export const ADD_TRIP_LOCATION_DATA = 'ADD_TRIP_LOCATION_DATA';
export const EDIT_TRIP_LOCATION_VIEW = 'EDIT_TRIP_LOCATION_VIEW';
export const EDIT_TRIP_LOCATION_DATA = 'EDIT_TRIP_LOCATION_DATA';
export const OPTION_DEFAULT_VIEW = 'OPTION_DEFAULT_VIEW';
export const TRIP_ROUTE_MODE_VIEW = 'TRIP_ROUTE_MODE_VIEW';
export const UPDATE_TRIP_ROUTES = 'UPDATE_TRIP_ROUTES';
export const SET_ROUTE_EDIT_ACTIVE = 'SET_ROUTE_EDIT_ACTIVE';
export const SET_ROUTE_EDIT_COMPLETE = 'SET_ROUTE_EDIT_COMPLETE';
export const SET_TRIP_MODE = 'SET_TRIP_MODE';
export const SET_TRIP_LEG_DATA = 'SET_TRIP_LEG_DATA';
export const SET_SWITCH_ROUTE_MODE_STATE = 'SET_SWITCH_ROUTE_MODE_STATE';
export const SET_MODE_SWITCH_DATA = 'SET_MODE_SWITCH_DATA';
export const SET_TRIP_LEG_ACTIVE = 'SET_TRIP_LEG_ACTIVE';
export const REMOVE_TRIP_LEG = 'REMOVE_TRIP_LEG';
export const SET_ROUTE_EDIT_INCOMPLETE = 'SET_ROUTE_EDIT_INCOMPLETE';
export const SET_UNKNOWN_ROUTE = 'SET_UNKNOWN_ROUTE';
export const SET_TRIP_LEG_INCOMPLETE = 'SET_TRIP_LEG_INCOMPLETE';
export const REMOVE_MODE_SWITCH = 'REMOVE_MODE_SWITCH';
export const SET_TRIP_LEG_EDIT_COMPLETE = 'SET_TRIP_LEG_EDIT_COMPLETE';
export const SET_TRIP_LEG_WAYPOINTS = 'SET_TRIP_LEG_WAYPINTS';
export const ADD_TRIP_LEG_EXTRA_DATA = 'ADD_TRIP_LEG_EXTRA_DATA';

/**
 * Returns trip state to default view.
 * @returns {{type: string, payload: {updateHistory: boolean}}}
 */
export function defaultView() {
	return {
		type: OPTION_DEFAULT_VIEW,
		payload: {
			updateHistory: true
		}
	};
}

/** Action for user selecting no trips were taken.
 *
 * @returns {{type: string, payload: {}}}
 */
export function noTripsTaken() {
	return {
		type: OPTION_NO_TRIPS_TAKEN,
		payload: {
			updateHistory: true
		}
	};
}

export function noTripsReasonGiven() {
	return {
		type: NO_TRIPS_REASON_GIVEN,
		payload: {
			updateHistory: true
		}
	};
}

/**
 *
 * @returns {{type: string, payload: {}}}
 */
export function tripsTaken() {
	return {
		type: OPTION_TRIPS_TAKEN,
		payload: {
			updateHistory: true
		}
	};
}

/**
 * Adds a new node (location) to the entire trip chain
 * @returns {{type: string, payload: {}}}
 */
export function addTripLocation(
	locationType: TripLocationType = TripLocationType.IntermediateLocation,
	locationPipe: ISurveyLocation = null
) {
	return {
		type: ADD_TRIP_LOCATION_VIEW,
		payload: {
			updateHistory: true,
			locationType: locationType,
			locationPipe: locationPipe
		}
	};
}

/**
 * Adds a new node (location) to the entire trip chain
 * @returns {{type: string, payload: {}}}
 */
export function addTripLocationData() {
	return {
		type: ADD_TRIP_LOCATION_DATA,
		payload: {
			updateHistory: true
		}
	};
}

/**
 * Removes a node (location) from the trip chain
 * @returns {{type: string, payload: {}}}
 */
export function removeTripLocation(triplocation: TripLocation, index: number = -1) {
	return {
		type: REMOVE_TRIP_LOCATION,
		payload: {
			updateHistory: true,
			tripLocation: triplocation,
			index: index
		}
	};
}

/**
 * Adds a mode to the the trip segment.
 * @returns {{type: string, payload: {}}}
 */
export function addTripMode() {
	return {
		type: ADD_TRIP_MODE,
		payload: {
			updateHistory: true
		}
	};
}

/**
 * Removes a trip mode from the trip segment.
 * @returns {{type: string, payload: {}}}
 */
export function removeTripMode() {
	return {
		type: REMOVE_TRIP_MODE,
		payload: {
			updateHistory: true
		}
	};
}

/**
 *
 * @param newState
 * @returns {{type: string, payload: {newState: TripsQuestionState, updateHistory: boolean}}}
 */
export function updateState(newState: TripsQuestionState) {
	return {
		type: UPDATE_STATE,
		payload: {
			newState: newState,
			updateHistory: false
		}
	};
}

/**
 *
 * @param newState
 * @returns {{type: string, payload: {newState: TripsQuestionState, updateHistory: boolean}}}
 */
export function cancelAddTripLocation(newState: TripsQuestionState) {
	return {
		type: CANCEL_ADD_TRIP_LOCATION,
		payload: {
			newState: newState,
			updateHistory: true
		}
	};
}

/**
 *
 * @param triplocation
 * @param index
 * @returns {{type: string, payload: {tripLocation: TripLocation, index: number, updateHistory: boolean}}}
 */
export function editTripLocation(triplocation: TripLocation, index: number = -1) {
	return {
		type: EDIT_TRIP_LOCATION_VIEW,
		payload: {
			tripLocation: triplocation,
			index: index,
			updateHistory: true
		}
	};
}

/**
 *
 * @returns {{type: string, payload: {updateHistory: boolean}}}
 */
export function editTripLocationData() {
	return {
		type: EDIT_TRIP_LOCATION_DATA,
		payload: {
			updateHistory: true
		}
	};
}

/**
 *
 * @returns {{type: string, payload: {updateHistory: boolean}}}
 */
export function tripRouteModeView() {
	return {
		type: TRIP_ROUTE_MODE_VIEW,
		payload: {
			updateHistory: true
		}
	};
}

/**
 *
 * @param routes
 */
export function updateTripRoutes(routes: TripRoute[]) {
	return {
		type: UPDATE_TRIP_ROUTES,
		payload: {
			tripRoutes: routes,
			updateHistory: true
		}
	};
}

/**
 *
 * @param {number} routeIndex
 * @returns {{type: string; payload: {routeIndex: number; updateHistory: boolean}}}
 */
export function setRouteEditActive(routeIndex: number) {
	return {
		type: SET_ROUTE_EDIT_ACTIVE,
		payload: {
			routeIndex: routeIndex,
			updateHistory: true
		}
	};
}

/**
 * Sets the trip mode
 * @param {string} mode
 * @returns {{type: string; payload: {mode: string; updateHistory: boolean}}}
 */
export function setTripMode(mode: string, category: string, usesWaypoints: boolean = true) {
	return {
		type: SET_TRIP_MODE,
		payload: {
			mode: mode,
			category: category,
			updateHistory: true,
			usesWaypoints: usesWaypoints
		}
	};
}

/**
 *
 * @param {number} routeIndex
 * @returns {{type: string; payload: {routeIndex: number; updateHistory: boolean}}}
 */
export function setRouteEditComplete(routeIndex: number) {
	return {
		type: SET_ROUTE_EDIT_COMPLETE,
		payload: {
			routeIndex: routeIndex,
			updateHistory: true
		}
	};
}

/**
 *
 * @param {number} routeIndex
 * @returns {{type: string; payload: {routeIndex: number; updateHistory: boolean}}}
 */
export function setRouteEditIncomplete(routeIndex: number) {
	return {
		type: SET_ROUTE_EDIT_INCOMPLETE,
		payload: {
			routeIndex: routeIndex,
			updateHistory: true
		}
	};
}

/**
 *
 * @param coordinates
 * @param waypoints
 */
export function setTripLegData(coordinates: L.LatLng[], waypoints: L.LatLng[], legName: string, routeIndex: number, instructions: any) {
	return {
		type: SET_TRIP_LEG_DATA,
		payload: {
			coordinates: coordinates,
			waypoints: waypoints,
			legName: legName,
			updateHistory: true,
			routeIndex: routeIndex,
			instructions: instructions
		}
	};
}

/**
 *
 * @param active
 */
export function setSwitchRouteModeState(active: boolean) {
	return {
		type: SET_SWITCH_ROUTE_MODE_STATE,
		payload: {
			active: active,
			updateHistory: true
		}
	};
}

/**
 * Sets the mode switch data to the active trip route
 */
export function setModeSwitchData() {
	return {
		type: SET_MODE_SWITCH_DATA,
		payload: {
			updateHistory: true
		}
	};
}

/**
 * Sets the mode switch data to the active trip route
 */
export function setUnknownRoute(description: string, setComplete: boolean = true) {
	return {
		type: SET_UNKNOWN_ROUTE,
		payload: {
			updateHistory: true,
			description: description,
			setComplete: setComplete
		}
	};
}

export function setTripLegIncomplete(index: number) {
	return {
		type: SET_TRIP_LEG_INCOMPLETE,
		payload: {
			updateHistory: true,
			tripLegIndex: index
		}
	};
}

/**
 *
 * @param index
 */
export function setTripLegActive(index: number) {
	return {
		type: SET_TRIP_LEG_ACTIVE,
		payload: {
			updateHistory: true,
			tripLegIndex: index
		}
	};
}

/**
 * Removes a specific trip leg from the active trip route
 * @param index Index of the trip leg to remove
 */
export function removeTripLeg(index: number) {
	return {
		type: REMOVE_TRIP_LEG,
		payload: {
			updateHistory: true,
			tripLegIndex: index
		}
	};
}

/**
 *
 * @param {number} tripRouteIndex
 * @param {number} tripLegIndex
 * @returns {{type: string; payload: {updateHistory: boolean; tripLegIndex: number; tripRouteIndex: number}}}
 */
export function removeModeSwitch(tripRouteIndex: number, tripLegIndex: number) {
	return {
		type: REMOVE_MODE_SWITCH,
		payload: {
			updateHistory: true,
			tripLegIndex: tripLegIndex,
			tripRouteIndex: tripRouteIndex
		}
	};
}

/**
 *
 * @param {number} tripRouteIndex
 * @param {number} tripLegIndex
 * @returns {{type: string; payload: {updateHistory: boolean; tripLegIndex: number; tripRouteIndex: number}}}
 */
export function setTripLegEditComplete(tripRouteIndex: number, tripLegIndex: number) {
	return {
		type: SET_TRIP_LEG_EDIT_COMPLETE,
		payload: {
			updateHistory: true,
			tripLegIndex: tripLegIndex,
			tripRouteIndex: tripRouteIndex
		}
	};
}

/**
 *
 * @param {number} tripRouteIndex
 * @param {number} tripLegIndex
 * @param {[{[p: string]: string}]} data
 * @returns {{type: string; payload: {updateHistory: boolean; tripLegIndex: number; tripRouteIndex: number; data: [{[p: string]: string}]}}}
 */
export function addTripLegExtraData(tripRouteIndex: number, tripLegIndex: number, data: [{ [v: string]: string }]) {
	return {
		type: ADD_TRIP_LEG_EXTRA_DATA,
		payload: {
			updateHistory: true,
			tripLegIndex: tripLegIndex,
			tripRouteIndex: tripRouteIndex,
			data: data
		}
	};
}

/**
 *
 * @param {number} tripRouteIndex
 * @param {number} tripLegIndex
 * @param {[]} waypoints
 * @returns {{type: string; payload: {updateHistory: boolean; tripLegIndex: number; tripRouteIndex: number; waypoints: []}}}
 */
export function setTriplegWaypoints(tripRouteIndex: number, tripLegIndex: number, waypoints: L.LatLng[]) {
	return {
		type: SET_TRIP_LEG_WAYPOINTS,
		payload: {
			updateHistory: true,
			tripLegIndex: tripLegIndex,
			tripRouteIndex: tripRouteIndex,
			waypoints: waypoints
		}
	};
}

/**
 * Default exports
 */
export default {
	noTripsTaken,
	noTripsReasonGiven,
	tripsTaken,
	addTripLocation,
	removeTripLocation,
	addTripMode,
	removeTripMode,
	updateState,
	addTripLocationData,
	cancelAddTripLocation,
	editTripLocation,
	editTripLocationData,
	defaultView,
	tripRouteModeView,
	updateTripRoutes,
	setRouteEditActive,
	setRouteEditComplete,
	setTripMode,
	setSwitchRouteModeState,
	setTripLegActive,
	removeTripLeg,
	setUnknownRoute,
	setTripLegIncomplete,
	removeModeSwitch,
	setTripLegEditComplete,
	setTriplegWaypoints,
	addTripLegExtraData
};
