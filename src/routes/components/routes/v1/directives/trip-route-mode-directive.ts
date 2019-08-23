import { TripsQuestionState } from '../ts/trips-question-state';

import * as TripsActions from '../ts/trips-actions';
import { TripRoute } from '../ts/trip-route';
import { TripLeg } from '../ts/trip-leg';
import { TripDiaryController } from '../controllers/trip-diary-controller';

import { TripDiary } from '../ts/trips-diary';
import 'jquery';
import * as angular from 'angular';
import * as Color from 'color';
import { TripDiaryService } from '../ts/trip-diary-service';

import { indexOf as _indexOf } from 'lodash';
import { SET_SWITCH_ROUTE_MODE_STATE } from '../ts/trips-actions';
import { TripDiaryRouteModeController } from '../controllers/trip-diary-route-mode-controller';
import { IModeConfig } from '../shared/survey-map-config';
import { PassengerCountDialogController } from '../controllers/passenger-count-dialog-controller';
import * as L from 'leaflet';
import { ITripDiaryRouteModeScope } from '../interfaces/trip-route-mode-diary-scope';
import { ISurveyMapRoute } from '../shared/survey-map-route';

export class TripRouteModeDirective {
	// public templateUrl = '/static/dist/directives/trips/templates/trip-route-mode.html';

	public template = require('../templates/trip-route-mode.html');
	scope = {};
	private _$scope: ng.IScope;
	private _element: ng.IAugmentedJQuery;
	private _attrs: ng.IAttributes;
	private _$mdPanel: angular.material.IPanelService;
	private _tc: TripDiaryController;

	/**
	 *
	 * @param $scope
	 * @param $mdDialog
	 * @returns {TripDiaryRouteModeController}
	 */
	controller = [
		'$scope',
		'$mdDialog',
		'TripDiaryService',
		'$ngRedux',
		'$element',
		'$timeout',
		'questionId',
		($scope, $mdDialog, TripDiaryService, $ngRedux, $element, $timeout, questionId) => {
			return new TripDiaryRouteModeController($scope, $mdDialog, TripDiaryService, $ngRedux, $element, $timeout, questionId);
		}
	];

	controllerAs = '_rmc';

	require = ['tripRouteMode'];

	/**
	 * Factory method for the timeline directive
	 */
	public static Factory() {
		let directive = (
			$ngRedux: any,
			$mdPanel: angular.material.IPanelService,
			tripDiaryService: TripDiaryService,
			$timeout: ng.ITimeoutService,
			$mdDialog
		) => {
			return new TripRouteModeDirective($ngRedux, $mdPanel, tripDiaryService, $timeout, $mdDialog);
		};

		// directive['$inject'] = ['ngRedux'];
		// directive['controller'] = TripDiaryRouteModeController;

		return directive;
	}

	/**
	 * Returns the active trip leg
	 * @returns {TripLeg}
	 */
	private activeTripLeg = (): TripLeg => {
		if (this.activeTripRoute() != null) {
			let leg = this.activeTripRoute().tripLegs[this.activeTripRoute().activeTripLegIndex];

			return leg;
		} else {
			return null;
		}
	};

	/**
	 *  Rmoves a trip leg
	 */
	private removeTripLeg = (index: number): any => {
		this._tc.removeTripLeg(index);
	};

	/**
	 * Sets a specific trip leg active
	 */
	private setTripLegActive = (index: number): any => {
		/* update state */
		this._tc.setTripLegActive(index);
	};

	/**
	 *
	 * @returns {TripRoute}
	 */
	private activeTripRoute = (): TripRoute => {
		if (this._$scope['tds']['state']['activeRouteIndex'] >= 0) {
			return this._$scope['tds']['state']['tripRoutes'][this._$scope['tds']['state']['activeRouteIndex']];
		} else {
			
			return null;
		}
	};
	/**
	 *
	 * @param e
	 */
	private onRouteMajorSelected = e => {};
	/**
	 * Shows the sub select route
	 */
	private showRouteSubMenu = () => {};

	/**
	 * Cancels mode switch overlay
	 */
	private cancelModeSwitch = () => {
		this._tc.setSwitchRouteModeState(false);
	};

	/**
	 * Saves the active route
	 */
	private saveRoute = (save: boolean = true) => {
		this._tc.setRouteEditComplete(this._tc.state.activeRouteIndex);
	};

	/**
	 *
	 * @param {number} index
	 */
	private setTripLegIncompleteR = index => {
		this._tc.setTripLegIncomplete(index);
	};

	/**
	 * Sets a route to active
	 */
	private editRoute = () => {
		this._tc.setRouteEditIncomplete(this._tc.state.activeRouteIndex);
	};

	/**
	 *
	 * @param route
	 */
	private showRoute = route => {
		this._tc['routingControl'].fire('routeselected', { route: route });
		this._$scope['selectedRoute'] = route;
	};

	/**
	 *
	 * @param route
	 */
	private selectRoute = (evt: Event, route) => {
		let routes = this._$scope['foundRoutes'];

		let routeIndex = _indexOf(routes, route);

		// if no valid route index, select index 0
		if (routeIndex < 0) {
			routeIndex = 0;
			route = this._$scope['foundRoutes'][0];
		}

		let alts = routes.slice();

		this._tc['routingControl'].fire('routeselected', { route: route, alternative: alts });

		this._$scope['selectedRoute'] = route;

		let waypoints = [];
		for (let i = 0; i < route.waypoints.length; i++) {
			waypoints.push(route.waypoints[i].latLng);
		}

		this._tripDiaryService.setTripLegData(route.coordinates, waypoints, route.name, route.routesIndex, route.instructions);

		this._$timeout(() => {
			this._tripDiaryService.notifyActiveRouteChanged(this._tripDiaryService.getActiveTripRoute());

			this._tripDiaryService.isAutoFitBounds = true;
		});
		// this._tripDiaryService.set

		/* fire a new select route event */
	};
	/**
	 * Returns the icon from the configuration based on the passed mode name
	 * @param {string} modeName
	 */
	private getModeIconString = (modeName: string) => {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode.icon;
				}
			}
		}
	};

	/**
	 *
	 * @param {string} modeName
	 * @returns {string}
	 */
	private getModeColourString = (modeName: string) => {
		for (let mode of TripDiary.config.modes) {
			for (let subMode of mode.subModes) {
				if (subMode.name === modeName) {
					return subMode.colour;
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
	 *
	 */
	private switchedModes = () => {
		// this._tripDiaryService.setSwitchRouteModeState(true);
	};

	/**
	 *
	 * @param {number} routeIndex
	 * @param {number} legIndex
	 */
	private removeModeSwitch = (routeIndex: number, legIndex: number) => {
		this._tripDiaryService.removeModeSwitch(routeIndex, legIndex);
	};

	/**
	 *
	 * @param evt
	 * @param {IModeConfig} mode
	 */
	private selectMode(this: ITripDiaryRouteModeScope, evt, mode: IModeConfig, $mdMenu) {
		let modePanel = this.element.find('.mode-button-panel');

		if (modePanel.length > 0) {
			let event = new Event('selectmode');
			if (evt != null) {
				let showedDialog: boolean = false;
				if (mode.dataInputs !== undefined) {
					if (mode.dataInputs.length > 0) {
						// _.delay(() => {
						showedDialog = true;

						this.routeModeController.showDialog(
							evt,
							mode,
							mode.dataInputs,
							mode.dialogTitle,
							this.tripDiaryService.getActiveTripLeg().data,
							result => {
								/* ask for passengers */
								this.tripDiaryService.setTripMode(mode['name'], mode['category'], mode.allowAddWaypoints);
								this.tripDiaryService.addTripLegExtraData(
									this.tripDiaryService.state.activeRouteIndex,
									this.tripDiaryService.getActiveTripRoute()._activeTripLegIndex,
									result
								);
							}
						);
						// }, 100);
					}
				}

				if (!showedDialog) {
					this.tripDiaryService.setTripMode(mode['name'], mode['category'], mode.allowAddWaypoints);
				}

				modePanel[0].dispatchEvent(event);
			}
		}
	}

	/**
	 *
	 * @param evt
	 * @param route
	 */
	private selectRouteClick(evt, route) {
		this.selectRoute(evt, route);
	}

	/**
	 *
	 * @param {INgRedux} $ngRedux
	 * @param {"angular".material.IPanelService} $mdPanel
	 * @param {TripDiaryService} _tripDiaryService
	 * @param {angular.ITimeoutService} _$timeout
	 */
	constructor(
		$ngRedux: any,
		$mdPanel: angular.material.IPanelService,
		private _tripDiaryService: TripDiaryService,
		private _$timeout: ng.ITimeoutService,
		private _$mdDialog
	) {
		let unsubscribe = $ngRedux.connect(
			this.mapStateToThis,
			TripsActions
		)(this);

		$ngRedux.subscribe(() => {
			let state = $ngRedux.getState().tripsState as TripsQuestionState;

			if (state.previousAction === SET_SWITCH_ROUTE_MODE_STATE) {
				if (state.switchRouteModeActive === false) {
					this._tc.routeMap.removeMarker('SWITCH_ROUTE');
				}
			}
		});
	}

	/**
	 *
	 */
	private initLocationSearchBox() {
		/*let element = $(this._element[0]).find('.route-map-location-input');


        //this._element.find('survey-map-router').append(element);


        let searchBox = new SearchBox(element[0] as HTMLInputElement, {bounds: null});

        //let updateActiveLocation = this.updateActiveLocationPlaceResult;
        //let tcRef: TripDiaryController = this;
        searchBox.addListener('places_changed', () => {

            let places: PlaceResult[] = searchBox.getPlaces();

            //searchBox.addListener('places_changed', () => {
            //let places: PlaceResult[] = searchBox.getPlaces();

            // updateActiveLocation(tcRef, places[0]);

            let latlng = places[0].geometry.location;

            console.log("places changed");

            this._tc.routeCallback(this._tc, places[0].name, new L.LatLng(latlng.lat(), latlng.lng()));


        }); */
	}

	/**
	 *
	 * @param {ISurveyMapRoute[]} routes
	 */
	private onRoutesFound: (routes: ISurveyMapRoute[]) => void = (routes: ISurveyMapRoute[]) => {
		this._$scope['foundRoutes'] = routes;
		this._$scope['routeQueryActive'] = false;

		if (routes.length > 0) {
			this._$timeout(() => {
				if (this._tripDiaryService.getActiveTripLeg()._routeIndex > 0) {
					this._$scope['selectedRoute'] = routes[this._tripDiaryService.getActiveTripLeg()._routeIndex];

					// if(this._tripDiaryService.state.activeRouteIndex < 0) {
					this.selectRoute(null, routes[this._tripDiaryService.getActiveTripLeg()._routeIndex]);
				} else {
					this._$scope['selectedRoute'] = routes[0];

					// if(this._tripDiaryService.state.activeRouteIndex < 0) {
					this.selectRoute(null, routes[0]);
				}
				// }

				this._$scope.$apply();
			});
		}
	};

	/**
	 *
	 * @param {angular.IScope} $scope
	 * @param {angular.IAugmentedJQuery} element
	 * @param {angular.IAttributes} attrs
	 * @param {Array<angular.IController>} controllers
	 */
	public link($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: Array<ng.IController>): void {
		this._tc = $scope.$parent['tc'] as TripDiaryController;

		$scope['element'] = element;
		$scope['routeModeController'] = controllers[0];
		$scope['tripDiaryService'] = this._tripDiaryService;
		$scope['_tdc'] = this._tc;

		$scope['onRouteMajorSelected'] = this.onRouteMajorSelected;
		$scope['showRouteSubMenu'] = this.showRouteSubMenu;
		$scope['selectMode'] = this.selectMode;
		$scope['activeTripRoute'] = this.activeTripRoute;
		$scope['activeTripLeg'] = this.activeTripLeg;
		$scope['activeTripRouteIndex'] = this._tc.state.activeRouteIndex;

		$scope['modes'] = TripDiary.config.modes;
		$scope['switchedModes'] = this.switchedModes;

		$scope['setTripLegActive'] = this.setTripLegActive;
		$scope['removeTripLeg'] = this.removeTripLeg;
		$scope['cancelModeSwitch'] = this.cancelModeSwitch;
		$scope['saveRoute'] = this.saveRoute;
		$scope['editRoute'] = this.editRoute;

		$scope['modes'] = TripDiary.config.modes;

		$scope['getModeIconString'] = this.getModeIconString;
		$scope['getModeColourString'] = this.getModeColourString;
		$scope['setTripLegIncompleteR'] = this.setTripLegIncompleteR;
		$scope['removeModeSwitch'] = this.removeModeSwitch;
		$scope['selectedRoute'] = undefined;
		$scope['selectRoute'] = this.selectRoute;
		$scope['showRoute'] = this.showRoute;
		$scope['filler'] = undefined;
		$scope['getDarkModeColourString'] = this.getDarkModeColourString;
		$scope['tds'] = this._tripDiaryService;
		$scope['routeQueryActive'] = false;
		$scope['selectRouteClick'] = this.selectRouteClick;

		this._element = element;

		this._$scope = $scope;

		// Callback for when a route query is active
		this._$scope.$on('routeQueryActive', () => {
			$scope['routeQueryActive'] = true;
		});

		// Check for routing error on survey map
		this._$scope.$on('routingError', () => {
			$scope['routeQueryActive'] = false;
			$scope['routingError'] = true;
			$scope['foundRoutes'] = [];
		});

		// Callback for changed waypoints
		this._$scope.$on('waypointsChanged', (evt, args) => {
			let waypoints: Array<L.LatLng> = [];
			for (let waypoint of args.waypoints) {
				waypoints.push(waypoint.latLng);
			}

			this._tripDiaryService.setTriplegWaypoints(
				this._tripDiaryService.state.activeRouteIndex,
				this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex,
				waypoints
			);
		});

		this._tripDiaryService.onRoutesFound(this.onRoutesFound);

		this._$scope.$on('$destroy', () => {
			this._tripDiaryService.unregisterOnRoutesFound(this.onRoutesFound);
		});

		/**
		 *
		 */
		this._$scope.$watch(
			'foundRoutes',
			(routes, oldValue) => {
				if (routes === undefined) {
					this._$scope['noRoutesFound'] = true;
				}
			},
			true
		);

		this.initLocationSearchBox();
	}

	/**
	 * Maps state from redux
	 * @param state State to me mapped (mapped to tripRoutes)
	 */
	mapStateToThis(state) {
		return state.tripsState;
	}
}
