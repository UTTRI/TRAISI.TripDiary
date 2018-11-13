import * as TripsActions from './trips-actions';
import { TripsQuestionState } from './trips-question-state';
import { TripRoute } from './trip-route';
import { TripLeg } from './trip-leg';
import * as Color from 'color';
import { TripDiary } from './trips-diary';
import { TimelineIcon, TripLocation, TripLocationType } from './trip-location';
import { config } from './config';

import { Dictionary } from 'lodash';
import { isNullOrUndefined } from 'util';
import { IModeConfig } from '../shared/survey-map-config';
import { ISurveyMapRoute } from '../shared/survey-map-route';
import { SET_ROUTE_EDIT_ACTIVE } from './trips-actions';
import { ISurveyLocation } from '../shared/services/survey-location';

/**
 * Service to manage and share state information of the Trip Diary module / question.
 */
export class TripDiaryService {
	static instanceList = {};
	public readonly state: TripsQuestionState;
	defaultView: () => any;
	tripsTaken: () => any;
	noTripsTaken: () => any;
	noTripsReasonGiven: () => any;
	tripRouteModeView: () => any;
	setRouteEditActive: (number) => any;
	setRouteEditComplete: (index: number) => void;
	setRouteEditIncomplete: (index: number) => void;
	updateState: (state: TripsQuestionState) => any;
	updateTripRoutes: (routes: TripRoute[]) => any;
	setTripMode: (mode: string, category: string, waypoints: boolean, clearPrevious?: boolean) => any;
	setTripLegData: (coordinates: L.LatLng[], indices: number[], routeName: string, routeIndex: number, instructions: any) => any;
	setSwitchRouteModeState: (active: boolean) => any;
	/* The following are inluced for auto-completion only, ngRedux connect binds action methods */
	setModeSwitchData: (autosave: boolean, appendAfterIndex: number) => any;
	setTripLegActive: (index: number) => any;
	removeTripLeg: (index: number) => any;
	addTripLocationData: () => any;
	setUnknownRoute: (description: string, setComplete: boolean) => any;
	setTripLegIncomplete: (index: number) => any;
	removeModeSwitch: (routeIndex: number, legIndex: number, changeActiveTripLeg?: boolean) => any;
	setTriplegWaypoints: (tripRouteIndex: number, tripLegIndex: number, waypoints: L.LatLng[]) => any;
	setTripLegEditComplete: (tripRouteIndex: number, tripLegIndex: number) => any;
	addTripLegExtraData: (tripRouteIndex: number, tripLegIndex: number, data: { [v: string]: string }) => any;
	addTripLocation: (locationType: TripLocationType, location?: ISurveyLocation) => any;
	moveTripLocationIndex: (fromIndex: number, toIndex: number) => any;
	private _renderCallbacks = [];

	private _autoRoute: boolean = true;
	private _isAutoFitBounds = true;
	private _scrollVisibleComponents: { [name: string]: boolean } = {};

	/**
	 * Found routes from  router
	 */
	private _routes: Array<ISurveyMapRoute>;
	private _routesFoundCallbackList: Array<(routes: Array<ISurveyMapRoute>) => void>;
	private _activeRouteChangedCallbackList: Array<(route: TripRoute) => void>;

	static test() {
		return TripDiaryService;
	}

	static Factory() {
		let service = $ngRedux => {
			return new TripDiaryService($ngRedux);
		};

		return service;
	}
	/**
	 *
	 * @param {string} modeName
	 * @returns {string}
	 */
	private getModeColour = (modeName: string) => {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return Color(subMode.colour).hex();
				}
			}
		}
	};
	/**
	 *
	 * @param {string} modeName
	 * @returns {string}
	 */
	private getDarkModeColourString = (modeName: string) => {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return Color(subMode.colour)
						.darken(0.3)
						.hex();
				}
			}
		}
	};

	/**
	 * Creates an instance of trip diary service.
	 * @param _$ngRedux
	 */
	constructor(private _$ngRedux: any) {
		let unsubscribe = _$ngRedux.connect(
			this.mapStateToThis,
			TripsActions
		)(this);

		_$ngRedux.subscribe(this.stateSubscription);

		this._routes = [];
		this._routesFoundCallbackList = [];
		this._activeRouteChangedCallbackList = [];
	}

	get isAutoFitBounds(): boolean {
		return this._isAutoFitBounds;
	}

	set isAutoFitBounds(value: boolean) {
		this._isAutoFitBounds = value;
	}

	get autoRoute(): boolean {
		return this._autoRoute;
	}

	set autoRoute(value: boolean) {
		this._autoRoute = value;
	}

	public getTimelineIcon(value: string) {
		if (value.toUpperCase() === 'SHOPPING') {
			// this.markerType = MarkerType.Shopping;
			return TimelineIcon.Shopping;
		} else if (value.toUpperCase() === 'DAYCARE') {
			// this.markerType = MarkerType.Daycare;
			return TimelineIcon.Daycare;
		} else if (value.toUpperCase() === 'FACILITATE PASSENGER') {
			// this.markerType = MarkerType.Passenger;
			return TimelineIcon.Passenger;
		} else if (value.toUpperCase() === 'OTHER') {
			// this.markerType = MarkerType.Other;
			return TimelineIcon.Other;
		} else if (value.toUpperCase() === 'HOME') {
			// this.markerType = MarkerType.Home;
			return TimelineIcon.Home;
		} else if (value.toUpperCase() === 'WORK') {
			// this.markerType = MarkerType.Work;
			return TimelineIcon.Work;
		} else if (value.toUpperCase() === 'SCHOOL') {
			// this.markerType = MarkerType.School;
			return TimelineIcon.School;
		} else if (value.toUpperCase() === 'OTHER') {
			// this.markerType = MarkerType.Other;
			return TimelineIcon.Other;
		} else {
			// this.markerType = MarkerType.Default;
			return TimelineIcon.Default;
		}
	}

	/**
	 *
	 */
	public tripLegShown() {
		// this._tripDiaryTourService.tripLegShown();
	}

	public tripLegHidden() {
		// this._tripDiaryTourService.tripLegHidden();
	}

	public routesShown() {
		// this._tripDiaryTourService.routesShown();
	}

	public routesHidden() {
		// this._tripDiaryTourService.routesHidden();
	}

	public timelineShown() {
		// this._tripDiaryTourService.timelineShown();
	}

	public timelineShownByOption() {
		// this._tripDiaryTourService.initializeTimelineButtonVisibility();
		// this._tripDiaryTourService.timelineShownByOption();

		document.dispatchEvent(new CustomEvent('visibilityScrollCheck'));
	}

	public timelineHidden() {
		// this._tripDiaryTourService.timelineHidden();
	}

	public timelineHiddenByOption() {
		// this._tripDiaryTourService.timelineHiddenByOption();
	}

	public shouldAskNoRouteDescription(modeName: string): boolean {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode.shouldAskNoRouteDescription === undefined ? false : subMode.shouldAskNoRouteDescription;
				}
			}
		}
	}

	/**
	 *
	 * @param {string} modeName
	 */
	public getModeConfig(modeName: string): IModeConfig {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode;
				}
			}
		}

		return null;
	}

	/**
	 *
	 * @param {TripLeg} tripLeg
	 * @returns {any}
	 */
	public getRouteSummaryString(tripLeg: TripLeg, forceAlternative = false) {
		if (isNullOrUndefined(tripLeg.mode)) {
			return tripLeg.legName;
		}

		let mode: IModeConfig = this.getModeConfig(tripLeg.mode.modeName);

		if (tripLeg._unknownRoute || forceAlternative) {
			if (!isNullOrUndefined(mode.customRoute)) {
				if (!isNullOrUndefined(mode.customRoute.fieldAsSummary)) {
					let summary = tripLeg.data[mode.customRoute.fieldAsSummary];

					if (!isNullOrUndefined(summary)) {
						return summary;
					}
				}
			}
		}

		return tripLeg.legName;
	}

	/**
	 *
	 * @param {TripRoute} tripRoute
	 */
	public notifyActiveRouteChanged(tripRoute: TripRoute) {
		for (let i = 0; i < this._activeRouteChangedCallbackList.length; i++) {
			this._activeRouteChangedCallbackList[i](tripRoute);
		}
	}

	/**
	 * Register a callback for routes being found
	 * @param {(routes: ISurveyMapRoute[]) => void} callback
	 */
	public onRoutesFound(callback: (routes: ISurveyMapRoute[]) => void) {
		this._routesFoundCallbackList.push(callback);
	}

	/**
	 *
	 * @param {(route: TripRoute) => void} callback
	 */
	public onRouteChanged(callback: (route: TripRoute) => void) {
		this._activeRouteChangedCallbackList.push(callback);
	}

	/**
	 * Unregisters the callback function
	 * @param {(routes: ISurveyMapRoute[]) => void} callback
	 */
	public unregisterOnRoutesFound(callback: (routes: ISurveyMapRoute[]) => void) {
		for (let i = 0; i < this._routesFoundCallbackList.length; i++) {
			if (this._routesFoundCallbackList[i] === callback) {
				// remove from array
				this._routesFoundCallbackList.splice(i, 1);
			}
		}
	}

	/**
	 *
	 * @param {(route: TripRoute) => void} callback
	 */
	public unregisterActiveRouteChangedCallback(callback: (route: TripRoute) => void) {
		for (let i = 0; i < this._activeRouteChangedCallbackList.length; i++) {
			if (this._activeRouteChangedCallbackList[i] === callback) {
				// remove from array
				this._activeRouteChangedCallbackList.splice(i, 1);
			}
		}
	}

	/**
	 *
	 * @param {ISurveyMapRoute[]} routes
	 */
	public notifyRoutesFound(routes: ISurveyMapRoute[]) {
		this._routes = routes.filter((route: ISurveyMapRoute) => {
			if (this.state.activeMode === 'transit') {
				if (route.instructions.length <= 1) {
					return false;
				}
			}

			return route.name !== 'duplicate';
		});

		for (let i = 0; i < this._routesFoundCallbackList.length; i++) {
			this._routesFoundCallbackList[i](this._routes);
		}
	}

	/**
	 *
	 */
	public toggleRouteMapTour() {
		// this._tripDiaryTourService.toggleRouteMapTour();
	}

	/**
	 *
	 * @param {string} modeName
	 * @returns {boolean}
	 */
	public shouldShowCustomRouteInput(modeName: string) {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					if (!isNullOrUndefined(subMode.customRoute)) {
						return true;
					} else {
						return false;
					}
				}
			}
		}

		return false;
	}

	/**
	 *
	 * @param {string} modeName
	 * @returns {string}
	 */
	public getRouterMode(modeName: string): string {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					// console.log(subMode);
					return subMode.routerMode;
				}
			}
		}

		return null;
	}

	/**
	 *
	 * @param {string} elementName
	 * @param {boolean} visible
	 */
	public setElementScrollVisibility(elementName: string, visible: boolean) {
		this._scrollVisibleComponents[elementName] = visible;

		// this._tripDiaryTourService.setElementScrollVisibility(elementName, visible);
	}

	/**
	 *
	 * @returns {TripRoute}
	 */
	public getActiveTripRoute(): TripRoute {
		if (this.state.activeRouteIndex < 0) {
			return null;
		}
		return this.state.tripRoutes[this.state.activeRouteIndex];
	}

	public registerCallback(func: () => any) {
		this._renderCallbacks.push(func);
	}

	/**
	 *
	 * @returns {TripLeg}
	 */
	public getActiveTripLeg(): TripLeg {
		if (this.state.tripRoutes != null && this.state.activeRouteIndex in this.state.tripRoutes) {
			return this.state.tripRoutes[this.state.activeRouteIndex].tripLegs[this.getActiveTripRoute().activeTripLegIndex];
		} else {
			return null;
		}
	}

	/**
	 *
	 * @param {TripLocation} tripLocation
	 * @returns {string}
	 */
	private getLocationColourDark(tripLocation: TripLocation) {
		if (config.locations.hasOwnProperty(tripLocation.locationPurpose.toLowerCase())) {
			return Color(config.locations[tripLocation.locationPurpose.toLowerCase()].locationColour)
				.darken(0.2)
				.hex();
		}
	}

	private shouldShowPrompt(modeName: string) {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode.showPrompt;
				}
			}
		}
	}

	/**
	 *
	 * @param {string} modeName
	 * @returns {string}
	 */
	private getNoRouteMessage(modeName: string) {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode.noRouteMessage;
				}
			}
		}
	}

	/**
	 * Replaces the current text of the passed element with translation / key data provided
	 * @param {HTMLElement} element
	 * @param {string} translateKey
	 * @param {{}} translateData
	 */
	public updateQuestionText(element: HTMLElement, translateKey: string, translateData: {} = null) {}

	/**
	 *
	 * @param {string} colour
	 * @returns {string}
	 */
	private getDarkenedColor(colour: string) {
		return Color(colour)
			.darken(0.2)
			.hex();
	}

	private mapStateToThis(state) {
		return {
			state: state.tripsState
		};
	}

	private stateSubscription = () => {
		if (this._$ngRedux.getState().tripsState.previousAction === SET_ROUTE_EDIT_ACTIVE) {
			this.isAutoFitBounds = true;
			if (!isNullOrUndefined(this.getActiveTripRoute())) {
				this.notifyActiveRouteChanged(this.getActiveTripRoute());
			}
		}
	};

	private isRouteComplete() {}
}
