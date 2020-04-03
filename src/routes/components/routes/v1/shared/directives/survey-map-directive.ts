import { ISurveyMapConfig } from '../survey-map-config';
import { ISurveyMapScope } from './survey-map-scope';
import { SurveyMapMarker } from '../survey-map-marker';

const GOOGLE_API_KEY = 'AIzaSyBATO0zp9waSGcW13pWmzOl9PSaV0fdMVE';

import 'leaflet-routing-machine';

import { IAugmentedJQueryStatic } from 'angular';
import * as icons from './../survey-map-marker-type';

import { TripLeg } from '../../ts/trip-leg';

import { UPDATE_STATE } from '../../ts/trips-actions';
import { TripLocation } from '../../ts/trip-location';
import { isNullOrUndefined } from 'util';
import { SurveyMapController } from '../controllers/survey-map-controller';
import { TripRoute } from '../../ts/trip-route';

import { last as _last, first as _first, delay as _delay, findIndex as _findIndex } from 'lodash';
import { TripLinxRouter } from 'routes/extensions/triplinx.router';

declare var L: any;

let MAPBOX_TILE_URL =
	`https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/256/{z}/{x}/{y}` +
	`?access_token=pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2s4Y3IwN3U3MG1obzNsczJjMGhoZWc4MiJ9.OCDfSypjueUF_gKejRr6Og`;

let googleTravelMode = {};

import template from '../templates/survey-map.html';
import deletePopupTemplateUrl from '../../templates/trip-diary-route-delete-popup.html';
import switchModePopupTemplateUrl from '../../templates/trip-diary-switch-mode-popup.html';
import deleteModeSwitchTemplateUrl from '../../templates/trip-diary-delete-mode-switch-popup.html';
import * as markerIcon from '../../../../../../assets/marker-icon.png';
import { link } from 'fs';

googleTravelMode['driver'] = 'Car';
googleTravelMode['bicycle'] = 'Bike';
googleTravelMode['transit'] = 'PT';
googleTravelMode['walk'] = 'Bike';
googleTravelMode['wheelchair'] = 'PT';

let lineOptions = {};

lineOptions['transit'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#F44336', opacity: 1, weight: 3 }
	]
};

lineOptions['accessible'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#f436e4', opacity: 1, weight: 3 }
	]
};

lineOptions['walk'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#4CAF50', opacity: 1, weight: 3 }
	]
};

lineOptions['driver'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#03A9F4', opacity: 1, weight: 3 }
	]
};
lineOptions['bicycle'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#FF9800', opacity: 1, weight: 3 }
	]
};

lineOptions['wheelchair'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#bb3bff', opacity: 1, weight: 3 }
	]
};

lineOptions['flight'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#3bffbb', opacity: 1, weight: 3 }
	]
};

lineOptions['ridehailing'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#1f28ab', opacity: 1, weight: 3 }
	]
};

lineOptions['motorcycle'] = {
	styles: [
		{ color: 'black', opacity: 0.3, weight: 11 },
		{ color: 'white', opacity: 0.9, weight: 9 },
		{ color: '#ab831f', opacity: 1, weight: 3 }
	]
};

lineOptions['noMode'] = {
	color: 'blue',
	weight: 3,
	opacity: 0.7,
	dashArray: '6,5'
};

lineOptions['nonActiveMode'] = {
	color: 'black',
	weight: 3,
	opacity: 0.5,
	dashArray: '6,5'
};

declare var $: IAugmentedJQueryStatic;

export class SurveyMapDirective {
	restrict = 'AEC';
	scope = {
		map: '=',
		callback: '=',
		controller: '=',
		ready: '=',
		markerClick: '=',
		config: '='
	};

	controller = [
		'$scope',
		'$mdDialog',
		'TripDiaryService',
		'$ngRedux',
		($scope, $mdDialog, TripDiaryService, $ngRedux) => {
			return new SurveyMapController($scope);
		}
	];
	private callback: any;
	private markerClick: any;
	private disableWaypointChange = false;
	private _map: L.Map;
	private _mapElement: JQuery;
	private _markers: { [id: string]: L.Marker };
	private _summaryLines: Array<L.Polyline>;
	private _$scope: ISurveyMapScope;
	private _config: ISurveyMapConfig;
	private _activeRoutingControl: any;
	private _attrs: ng.IAttributes;
	private _routers: { [id: string]: any };
	private _layersByRoute: { [id: string]: any[] };
	// public template = require('../templates/survey-map.html');
	// deletePopupTemplateUrl = require('../../templates/trip-diary-route-delete-popup.html');
	// switchModePopupTemplateUrl = require('../../templates/trip-diary-switch-mode-popup.html');
	// deleteModeSwitchTemplateUrl = require('../../templates/trip-diary-delete-mode-switch-popup.html');
	// link: ($scope: ISurveyMapScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
	private _reverseGeocodeResult: string;

	get reverseGeocodeResult(): string {
		return this._reverseGeocodeResult;
	}

	set reverseGeocodeResult(value: string) {
		this._reverseGeocodeResult = value;
	}

	private _reverseGeocodeLatLng: L.LatLng;

	get reverseGeocodeLatLng(): L.LatLng {
		return this._reverseGeocodeLatLng;
	}

	set reverseGeocodeLatLng(value: L.LatLng) {
		this._reverseGeocodeLatLng = value;
	}

	private _element: ng.IAugmentedJQuery;

	public get element(): ng.IAugmentedJQuery {
		return this._element;
	}

	public set element(value: ng.IAugmentedJQuery) {
		this._element = value;
	}

	controllerAs = '_smc';

	public static Factory() {
		let directive = ($http, $compile, $templateRequest, tripDiaryService, $rootScope) => {
			return new SurveyMapDirective($http, $compile, $templateRequest, tripDiaryService, $rootScope);
		};

		directive['$inject'] = ['$http'];
		directive['restrict'] = 'AEC';
		return directive;
	}
	/**
	 * Restore marker state to the map.
	 */
	public restoreMarkerState = (markers: SurveyMapMarker[]) => {
		for (let i = 0; i < markers.length; i++) {
			if (markers[i] != null) {
				this.addMarker(markers[i]);
			}
		}
	};

	private routingError = evt => {
		this._$scope.$emit('routingError');
		//
	};

	public clearFoundRoutes() {
		this._$scope.$parent['foundRoutes'] = [];
	}

	/**
	 *
	 * @param {TripLeg} tripLeg
	 */
	private generateLineOptions(tripLeg: TripLeg) {
		let lineOption = lineOptions[tripLeg.mode.modeCategory];

		lineOption.styles[2].color = this._tripDiaryService.getModeColour(tripLeg.mode.modeName);

		return lineOption;
	}

	/**
	 * Fits the route map display to display all contained bounds within the passed trip route.
	 * @param tripRoute
	 */
	private fitTripRouteBounds(tripRoute, options = null) {
		let l1 = new L.LatLng(tripRoute.startLocation.latLng.lat, tripRoute.startLocation.latLng.lng);
		let l2 = new L.LatLng(tripRoute.endLocation.latLng.lat, tripRoute.endLocation.latLng.lng);

		let latLngBounds = new L.LatLngBounds(l1, l2);

		// let markerIndex = 0;
		for (let tripLeg2 of tripRoute.tripLegs) {
			for (let waypoint of tripLeg2.waypoints) {
				latLngBounds.extend(waypoint);
			}
		}

		// let latLngBounds = L.LatLngBounds(bounds);
		_delay(() => {
			this._map.fitBounds(latLngBounds, options == null ? { padding: [20, 20] } : options);
		}, 100);
	}

	/**
	 *
	 * @param evt
	 */
	private routesFound = evt => {
		if (evt.target.tripLeg.hasOwnProperty('routeIndex')) {
			evt.target._selectedRoute = evt.target_routes[evt.target.tripLeg.routeIndex];
		}

		let routes = evt.routes;

		// this._$scope.$parent['foundRoutes'] = routes;
		this._$scope.$parent['routingError'] = false;

		if (routes.length > 0) {
			this._tripDiaryService.notifyRoutesFound(routes);
		} else {
			this._$scope.$emit('routingError');
		}

		setTimeout(() => {
			this._$scope.$apply();
		}, 0);
		/* Update the scope
		if (!this._$scope.$$phase) {

		}*/
	};
	/**
	 * Called when waypoints are changed on the active route.
	 * @param evt
	 */
	private waypointsChanged = evt => {
		if (!this.disableWaypointChange) {
			this._tripDiaryService.isAutoFitBounds = false;
			this._$scope.$emit('waypointsChanged', evt);
		} else {
			this.disableWaypointChange = false;
		}
		// this._$rootScope.$emit(
	};
	/**
	 * When a route is selected
	 */
	private routeSelected = evt => {};

	/**
	 *
	 * @param {angular.IHttpService} $http
	 */
	constructor(
		private _$http: ng.IHttpService,
		private _$compile,
		private _$templateRequest,
		private _tripDiaryService,
		private _$rootScope: ng.IRootScopeService
	) {
		this._markers = {};
		this._routers = {};
		this._summaryLines = [];
		this._layersByRoute = {};

		SurveyMapDirective.prototype.link = ($scope: ISurveyMapScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
			this._$scope = $scope as ISurveyMapScope;

			this._element = element;

			this._attrs = attrs;

			$scope.map = this;

			this.callback = $scope.callback;

			this._config = $scope.config;

			this.markerClick = $scope['markerClick'];

			console.log('in init map link');
			this.initMap();
		};
	}

	/**
	 *
	 * @returns {($http) => SurveyMapDirective}
	 * @constructor
	 */

	public toggleAddRoutingWaypoints(enable: boolean) {
		if (this._activeRoutingControl !== null && this._activeRoutingControl !== undefined) {
			this._activeRoutingControl.options.addWaypoints = enable;
		}
	}

	/**
	 *
	 * @param markerList The list of current active markers. Unmatched markers will be removed.
	 */
	public cleanMarkers(markerList: SurveyMapMarker[]) {
		let notFound = [];

		for (let key of Object.keys(this._markers)) {
			let found = false;
			for (let i = 0; i < markerList.length; i++) {
				if (markerList[i].id === key) {
					found = true;
					continue;
				}
			}
			if (!found) {
				notFound.push(key);
			}
		}

		for (let i = 0; i < notFound.length; i++) {
			this._markers[notFound[i]].remove();
			// this._markers[notFound[i]] = null;

			delete this._markers[notFound[i]];
		}
	}

	/**
	 *
	 */
	public hideAllMarkers() {
		Object.keys(this._markers).forEach(key => {
			let marker = this._markers[key];
			marker.setOpacity(0.0);
			marker.closeTooltip();
		});
	}

	/**
	 *
	 * @param marker
	 */
	public setMarkerActive(marker: SurveyMapMarker, hideOthers: boolean = true) {
		// console.log(hideOthers);
		for (let key in this._markers) {
			if (marker.id !== key) {
				if (hideOthers) {
					this._markers[key].setOpacity(0.0);
					this._markers[key].closeTooltip();

					$(this._markers[key]['_icon']).css({ 'pointer-events': 'none' });
					// console.log($(this._markers[key]['_icon']));
				} else {
					this._markers[key].setOpacity(0.6);
				}
				this._markers[key].dragging.disable();
			} else {
				this._markers[key].setOpacity(1.0);
				this._markers[key].openTooltip();
				this._markers[key].dragging.enable();
				$(this._markers[key]['_icon']).css({ 'pointer-events': 'auto' });
			}
		}

		if (marker.latLng.lat !== 0) {
			this._map.setView(marker.latLng, this._map.getZoom());
		}
	}

	/**
	 *
	 * @param marker
	 */
	public hideMarker(marker: SurveyMapMarker) {
		if (!isNullOrUndefined(this._markers[marker.id])) {
			this._markers[marker.id].setOpacity(0);
		}
	}

	/**
	 *
	 * @param {SurveyMapMarker} marker
	 */
	public showMarker(marker: SurveyMapMarker) {
		if (!isNullOrUndefined(this._markers[marker.id])) {
			this._markers[marker.id].setOpacity(1);
		}
	}

	/**
	 *
	 * @param {SurveyMapMarker} marker
	 * @param {string} label
	 */
	public setMarkerLabel(marker: SurveyMapMarker, label: string) {
		if (this._markers.hasOwnProperty(marker.id)) {
			let m = this._markers[marker.id];

			m.unbindTooltip();
			m.bindTooltip(label, { permanent: true, direction: 'bottom' });
		}
	}

	/**
	 *
	 * @param marker
	 */
	public addMarker(marker: SurveyMapMarker, popupContentUrl?: string | undefined): void {
		let mapMarker = null;

		if (this._markers[marker.id] == null) {
			let icon = L.icon({
				iconUrl: markerIcon,
				iconSize: [25, 41],
				iconAnchor: [13, 41],
				popupAnchor: [0, -44]
			});

			mapMarker = L.marker([marker.latLng.lat, marker.latLng.lng], {
				draggable: true,
				marker: marker,
				icon: icon
			}).addTo(this._map);

			// marker.mapMarker = mapMarker;

			if (popupContentUrl === undefined) {
				if (marker.label !== undefined) {
					mapMarker.bindTooltip(marker.label, { permanent: true, direction: 'top' });
				}
			} else {
				this.createPopupFromTemplateUrl(mapMarker, popupContentUrl);
			}
			this._markers[marker.id] = mapMarker;

			mapMarker.surveyMap = this;

			mapMarker.on('dragend', evt => {
				this.getLocation(evt.target._latlng, this);
			});

			mapMarker.on('mouseover', e => {});

			mapMarker.on('click', evt => {
				if (this._$scope['markerClick'] != null) {
					this._$scope['markerClick'](evt.target.options.marker);
				}
			});
		} else {
			mapMarker = this._markers[marker.id];
		}

		let mapRef = this._map;

		/*watch for location change */
		this._$scope.$watch(
			() => {
				return marker.latLng;
			},
			(latLng: L.LatLng, old) => {
				if (latLng.lng === 0 && latLng.lat === 0) {
					mapMarker.setLatLng(latLng);
					if (mapMarker.getPopup() !== undefined) {
						mapMarker.openPopup();
					}
				} else {
					this._map.setView(latLng, this._map.getZoom(), {
						animate: true,
						duration: 0.7
					});

					mapMarker.setLatLng(latLng);
					if (mapMarker.getPopup() !== undefined) {
						mapMarker.openPopup();
					}
				}
			}
		);

		/* watch for marker change */
		this._$scope.$watch(
			() => {
				return marker.markerType;
			},
			markerType => {
				if (marker.label !== undefined) {
					if (mapMarker._tooltip != null) {
						this._map.removeLayer(mapMarker._tooltip);
					}
					let s = marker as TripLocation;

					mapMarker.bindTooltip(s.displayName(), {
						permanent: true,
						direction: 'bottom'
					});
				}
				mapMarker.setIcon(marker.getMarkerIcon());
			}
		);
	}

	/**
	 *
	 * @param id The id of the marker to remove
	 */
	public removeMarker(id: string) {
		if (this._markers.hasOwnProperty(id)) {
			this._markers[id].remove();

			delete this._markers[id];
		}
	}

	/**
	 *
	 * @param tripRoutes The routes to add to the map
	 */
	public addRoutingList(tripRoutes: TripRoute[]) {
		this._$scope.$parent['foundRoutes'] = undefined;
		for (let r in this._routers) {
			// this._routers[r]._map.removeControl(this._routers[r]);
			// this._routers[r]._plan.splice();
		}
		for (let i = 0; i < tripRoutes.length; i++) {
			this.addRouting(tripRoutes[i]);
		}
	}

	/**
	 * Removes all routers from the map
	 */
	public removeAllRouters() {
		for (let r in this._routers) {
			// this._map.removeControl(this._routers[r]);
		}

		this._activeRoutingControl = null;
		this._routers = {};
	}

	/**
	 *
	 * @param opacity Opacity of the summary lines
	 */
	public setSummaryLinesOpacity(opacity: number) {
		for (let r in this._summaryLines) {
			this._summaryLines[r].setStyle({ opacity: opacity });
		}
	}

	/**
	 * Display trip route summaries
	 * @param {TripRoute[]} tripRoute
	 */
	public showRouteSummary(tripRoutes: TripRoute[]) {
		this.removeAllRouters();

		for (let i = 0; i < tripRoutes.length; i++) {
			for (let j = 0; j < tripRoutes[i].tripLegs.length; j++) {
				if (tripRoutes[i].tripLegs[j]._mode != null) {
					let line = L.polyline(tripRoutes[i].tripLegs[j]._coordinates, {
						color: lineOptions[tripRoutes[i].tripLegs[j]._mode.modeCategory].styles[2]['color'],
						weight: 8,
						opacity: 0.9,
						smoothFactor: 1
					});
					this._summaryLines.push(line);

					this._map.addLayer(line);
				}
			}
		}
		this.setSummaryLinesOpacity(0.9);
	}

	/**
	 *
	 * @param {TripLeg} tripLeg
	 * @returns {{service: string; options: any}}
	 */
	private generateRouterOptions(tripLeg: TripLeg, startTime: Date) {
		let today = new Date();
		if (typeof startTime === 'string') {
			startTime = new Date(startTime);
		}
		let adjustedStartTime = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			startTime.getHours(),
			startTime.getMinutes()
		);
		let routerMode = this._tripDiaryService.getRouterMode(tripLeg._mode.modeName);
		let modes = this._tripDiaryService.getModeProperty(tripLeg._mode.modeName, 'modes');
		let modeConfig = this._tripDiaryService.getModeConfig(tripLeg._mode.modeName);

		let googleRouter = {
			service: 'triplinx',
			options: new TripLinxRouter(this._$http, routerMode, modes, modeConfig)
		};

		return googleRouter;
	}

	/**
	 *
	 * @param tripRoute
	 * @param waypointChangedTrigger
	 * @param forceRender
	 */
	public addRouting(tripRoute: TripRoute, waypointChangedTrigger = false, forceRender = false) {
		let lastTime = this._$scope['routeTime'];

		let currTime = Date.now() / 1000.0;

		if (currTime - lastTime < 0.3 && this._$scope.controller.state.previousAction !== UPDATE_STATE && !forceRender) {
			return;
		}

		this._$scope['routeTime'] = Date.now() / 1000.0;

		if (tripRoute == null) {
			return;
		}

		this.disableWaypointChange = waypointChangedTrigger;

		this.removeAllRouters();

		this._$scope.$emit('routeQueryActive');

		if (this._layersByRoute[tripRoute.id] == null) {
			this._layersByRoute[tripRoute.id] = [];
		}

		for (let key of Object.keys(this._layersByRoute)) {
			for (let layer of Object.keys(this._layersByRoute[key])) {
				this._map.removeLayer(this._layersByRoute[key][layer]);

				if (tripRoute.id !== key) {
					// this._map.removeControl(layer);
				}
			}
			this._layersByRoute[key] = [];
		}

		if (!this._routers.hasOwnProperty(tripRoute.id) || true) {
			let activeTripLeg = tripRoute.tripLegs[tripRoute.activeTripLegIndex];

			let legActive = false;

			for (let leg of tripRoute.tripLegs) {
				if (leg._isComplete === false) {
					legActive = true;
					break;
				}
			}

			if (tripRoute.editComplete === false || legActive === true) {
				if (activeTripLeg._mode === undefined) {
					if (this._$scope.controller['routingControl'] !== undefined) {
						this._$scope.controller['routingControl']._line.remove();
					}
					this.clearFoundRoutes();
					this.addTripLegSummaryLine(tripRoute, activeTripLeg);
					this.addTripLegSummaryLineMarkers(tripRoute, activeTripLeg, _findIndex(tripRoute.tripLegs, activeTripLeg), 0);
				}

				// tslint:disable-next-line:no-shadowed-variable
				let routerActive = false;

				// let i = 0;
				let markerIndex = 0;
				for (let tripLeg of tripRoute.tripLegs) {
					if (tripLeg._mode === undefined) {
						this.addTripLegSummaryLine(tripRoute, tripLeg);
						this.addTripLegSummaryLineMarkers(tripRoute, tripLeg, _findIndex(tripRoute.tripLegs, tripLeg), markerIndex);
						continue;
					}
					let google_router = this.generateRouterOptions(tripLeg, tripRoute.startLocation.endTime);

					let latLngs = [];

					for (let i = 0; i < tripLeg._waypoints.length; i++) {
						latLngs.push(new L.LatLng(tripLeg._waypoints[i].lat, tripLeg._waypoints[i].lng));
					}

					/* convert each way point to a new lat lng*/

					/*use start and end of the trip route*/
					if (latLngs.length === 0) {
						latLngs.push(tripRoute.startLocation.latLng);
						latLngs.push(tripRoute.endLocation.latLng);
					}

					let allowWaypoints = true;
					for (let i = 0; i < this._config.modes.length; i++) {
						if (this._config.modes[i].name === tripLeg._mode.modeCategory) {
							for (let j = 0; j < this._config.modes[i].subModes.length; j++) {
								if (this._config.modes[i].subModes[j].name === tripLeg._mode.modeName) {
									allowWaypoints = this._config.modes[i].subModes[j].allowAddWaypoints;
								}
							}
						}
					}

					if (tripLeg.id === tripRoute.tripLegs[tripRoute.activeTripLegIndex].id && !tripLeg._isComplete) {
						// do not add the routing control if this mode's route is not configurable

						if (
							this._$scope.controller['routingControl'] === undefined &&
							!this._tripDiaryService.getModeConfig(tripLeg._mode.modeName).autoSaveRoute
						) {
							let control = L.Routing.control({
								fitSelectedRoutes: false,
								autoRoute: true,
								plan: L.Routing.plan(latLngs, {
									createMarker: (i, wp, n) => {
										let tripRoute: TripRoute = this._tripDiaryService.getActiveTripRoute();
										let tripLeg: TripLeg = this._tripDiaryService.getActiveTripLeg();

										let icon = L.icon({
											iconUrl: markerIcon,
											iconSize: [25, 41],
											iconAnchor: [13, 41],
											popupAnchor: [0, -44]
										});

										let marker = L.marker(wp.latLng, {
											draggable: i > 0 && i < n - 1 ? true : false,
											icon: icon
										});

										// do not allow deleting on end markers
										if (i !== 0 && i !== n - 1) {
											let link = $('<span class="delete-popup">Delete</span>').on('click', evt => {
												control.spliceWaypoints(i, 1);
											});

											link[0]['waypointIndex'] = i;

											this._$scope['deleteWayPoint'] = $event => {
												control.spliceWaypoints($event.target.waypointIndex, 1);
											};
											// this._$templateRequest(this.deletePopupTemplateUrl).then(template => {

											let template = deletePopupTemplateUrl;
											let toolTip = this._$compile(
												$('<span></span>')
													.html(template)
													.contents()
											)(this._$scope);

											toolTip[0]['waypointIndex'] = i;

											marker.bindPopup(toolTip[0], {
												permanent: false,
												direction: 'top',
												interactive: true
											});
											// });
										}
										this._layersByRoute[tripRoute.id].push(marker);

										return marker;
									},

									geocoder: L.Control.Geocoder.nominatim(),
									addWaypoints: allowWaypoints
								}),
								addWaypoints: allowWaypoints,
								geocoder: L.Control.Geocoder.nominatim(),
								// lineOptions: lineOptions[tripLeg._mode.modeCategory],
								lineOptions: this.generateLineOptions(tripLeg),
								router: google_router.options
							});

							control.addTo(this._$scope['mapRef']);

							this._activeRoutingControl = control;
							// console.log(this._activeRoutingControl);

							this._$scope.$emit('routeQueryActive');

							control.on('waypointschanged', this.waypointsChanged);
							control.on('routeselected', this.routeSelected);
							control.on('routesfound', this.routesFound);
							control.on('routingerror', this.routingError);
							control['tripLeg'] = tripRoute.tripLegs[tripRoute.activeTripLegIndex];
							control['tripRoute'] = tripRoute;

							this._$scope.controller['routingControl'] = control;
							this._routers[tripRoute.id] = control;
						} else if (
							!isNullOrUndefined(this._$scope.controller['routingControl']) &&
							!this._tripDiaryService.getModeConfig(tripLeg._mode.modeName).autoSaveRoute
						) {
							// let control = this._$scope.controller['routingControl'];
							let control = this._$scope.controller['routingControl'];
							control['tripLeg'] = tripRoute.tripLegs[tripRoute.activeTripLegIndex];
							control['tripRoute'] = tripRoute;

							// let router = this.generateRouterOptions(tripLeg);

							let newRouter = this.generateRouterOptions(tripLeg, tripRoute.startLocation.endTime);

							control.options.router = newRouter.options;
							control.options.lineOptions = this.generateLineOptions(tripLeg);
							control.options.disableWaypointChange = newRouter.options.disableWaypointChange;

							control._router.options = newRouter.options.options;

							// console.log(control['plan']);
							control.setWaypoints(latLngs);

							control.options.addWaypoints = allowWaypoints;

							this._routers[tripRoute.id] = control;
							this._layersByRoute[tripRoute.id].push(control);

							control.route();
						}
					} else {
						this.addTripLegSummaryLine(tripRoute, tripLeg);
					}
					this.addTripLegSummaryLineMarkers(tripRoute, tripLeg, _findIndex(tripRoute.tripLegs, tripLeg), markerIndex);

					routerActive = true;
					markerIndex++;
				}

				if (this._$scope.controller['routingControl'] !== undefined) {
					if (!routerActive) {
						this._$scope.controller['routingControl']._line.remove();
					} else {
						this._$scope.controller['routingControl'].show();
					}
				}
			} else if (tripRoute.editComplete === true) {
				if (this._$scope.controller['routingControl'] !== undefined) {
					this._$scope.controller['routingControl'].hide();
					this._$scope.controller['routingControl']._line.remove();
					// console.log( (this._$scope.controller['routingControl']));
					window['cat'] = this._$scope.controller['routingControl'];
				}

				// bounds = [];

				_delay(() => {
					for (let tripLeg2 of tripRoute.tripLegs) {
						this.addTripLegSummaryLine(tripRoute, tripLeg2);
						this.addTripLegSummaryLineMarkers(tripRoute, tripLeg2, _findIndex(tripRoute.tripLegs, tripLeg2));
					}
				}, 200);
			}

			let routerActive = false;
			for (let tripLeg of tripRoute.tripLegs) {
				if (!tripLeg._isComplete || tripLeg._coordinates.length > 0) {
					routerActive = true;
					break;
				}
			}

			if (!routerActive) {
				this.fitTripRouteBounds(tripRoute);
			}
		}
	}

	/**
	 *
	 * @param {TripRoute} route
	 */
	private onRouteChanged = (route: TripRoute) => {
		if (this._tripDiaryService.isAutoFitBounds) {
			this.fitTripRouteBounds(route);
		}
	};

	/**
	 *
	 */
	public removeActiveRouter() {
		if (!isNullOrUndefined(this._$scope.controller['routingControl'])) {
			this._map.removeControl(this._$scope.controller['routingControl']);
		}
		this._$scope.controller['routingControl'] = null;
		this._tripDiaryService.unregisterActiveRouteChangedCallback(this.onRouteChanged);
	}

	/**
	 *
	 * @param marker
	 */
	private addDeleteModeSwitchPopup(marker, tripLegIndex) {
		// link[0]['waypointIndex'] = i;

		this._$scope['deleteModeSwitch'] = $event => {
			this._tripDiaryService.removeModeSwitch(this._tripDiaryService.state.activeRouteIndex, $event.target['tripLegIndex']);
		};

		// this._$templateRequest(this.deleteModeSwitchTemplateUrl).then(template => {
		let template = deleteModeSwitchTemplateUrl;
		let toolTip = this._$compile(
			$('<span></span>')
				.html(template)
				.contents()
		)(this._$scope);

		// console.log(toolTip);

		toolTip[0]['tripLegIndex'] = tripLegIndex - 1;
		// toolTip[0]['waypointIndex'] = i;

		marker.bindPopup(toolTip[0], {
			permanent: false,
			direction: 'top',
			interactive: true
		});
		// });
	}

	/**
	 *
	 */
	public invalidateSize() {
		this._map.invalidateSize();
	}

	/**
	 *
	 * @param {L.Popup} popup
	 */
	public openPopup(popup: L.Popup) {
		this._map.openPopup(popup);
	}

	/**
	 *
	 */
	public initMap() {
		this._$scope['routeTime'] = Date.now() / 1000.0 - 20;

		let initialLocation1 = { lat: 43.6532, lng: -79.3832 };

		let map = L.map(this._element[0], { zoomControl: false }).setView(initialLocation1, 10);

		console.log('in init map');
		console.log(map);

		this._map = map;

		this._$scope['mapRef'] = map;

		this._mapElement = this._element;

		let elemrentRef = this._element;

		let mapRef: L.Map = this._map;
		let surveyMapRef: SurveyMapDirective = this;

		this._map.whenReady(() => {
			if (surveyMapRef._$scope.ready != null) {
				surveyMapRef._$scope.ready(surveyMapRef);
			}
		});

		this._map.on('click', (ev: any) => {
			surveyMapRef.getLocation(ev.latlng, surveyMapRef);
		});

		let mapLayers = {
			tileLayer: L.tileLayer(MAPBOX_TILE_URL, {
				maxZoom: 20,
				minZoom: 8,
				attribution: 'TTS2.0'
			}).addTo(this._map)
		};

		this._$scope.$watch(
			() => {
				return elemrentRef.attr('class');
			},
			newValue => {
				if (newValue.match(/ng-hide/) !== null) {
					return new Promise(resolve => setTimeout(resolve, 100)).then(v => {
						mapRef.invalidateSize();
					});
				}
			}
		);

		window.addEventListener('PAGE_SECTION_CHANGED', () => {
			_delay(() => {
				mapRef.invalidateSize();
			}, 300);
		});

		let zoom = new L.Control.Zoom({ position: 'topright' });

		this._map.addControl(zoom);

		window.setTimeout(() => {
			mapRef.invalidateSize();
		}, 0);

		/* this._$scope.$watchCollection('tc.value.tripLocations', (newValue: SurveyMapMarker[], oldValue: SurveyMapMarker[]) => {
			if (oldValue !== newValue) {
				surveyMapRef.cleanMarkers(newValue);
			}
		}); */

		this._$scope.controller.updateTripRouteModes();

		this._$scope['switchModeConfirm'] = evt => {
			this._$scope.controller.confirmModeSwitch();
		};
		this._tripDiaryService.onRouteChanged(this.onRouteChanged);
	}

	/**
	 *
	 * @param position
	 * @param {SurveyMapDirective} surveyMap
	 */
	public getLocation(position, surveyMap: SurveyMapDirective) {
		if (position == null) {
			return;
		}
		let lat = position.lat;
		let lon = position.lng;

		let apiURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',%20' + lon + '&key=' + GOOGLE_API_KEY;

		this._$http.get(apiURL).then(result => {
			surveyMap.reverseGeocodeResult = result.data['results'][0].formatted_address;

			surveyMap.reverseGeocodeLatLng = L.latLng(lat, lon);

			if (surveyMap._$scope.callback != null) {
				surveyMap._$scope.callback(surveyMap._$scope.controller, result.data['results'][0].formatted_address, L.latLng(lat, lon));
			}
		});
	}

	/**
	 *
	 * @param {L.Marker} mapMarker
	 * @param {string} popupContentUrl
	 */
	private createPopupFromTemplateUrl(mapMarker: L.Marker, popupContentUrl: string) {
		// this._$templateRequest(popupContentUrl).then(template => {

		let template = popupContentUrl;
		let toolTip = this._$compile(
			$('<span></span>')
				.html(template)
				.contents()
		)(this._$scope);

		mapMarker.bindPopup(toolTip[0], { offset: [0, -15] });
		mapMarker.openPopup();
		// });
	}

	private addTripLegSummaryLine(tripRoute: TripRoute, tripLeg: TripLeg) {
		let lineBack;
		let line;
		if (tripLeg._coordinates.length >= 2 && tripLeg._mode !== undefined) {
			lineBack = L.polyline(tripLeg._coordinates, {
				color: 'white',
				weight: 7,
				opacity: 0.9,
				smoothFactor: 1,
				fillColor: 'white'
			});

			// let lineOptions = lineOptions[tripLeg._mode.modeCategory].styles[2]['color'];
			line = L.polyline(tripLeg._coordinates, {
				color: this._tripDiaryService.getModeColour(tripLeg._mode.modeName),
				// color: lineOptions[tripLeg._mode.modeCategory].styles[2]['color'],
				weight: 4,
				opacity: 0.7,
				smoothFactor: 1,
				dashArray: '3,5'
			});
		} else {
			lineBack = L.polyline(tripLeg._waypoints, {
				color: 'white',
				weight: 7,
				opacity: 0.7,
				smoothFactor: 1,
				fillColor: 'white'
			});
			line = L.polyline(tripLeg._waypoints, lineOptions['nonActiveMode']);
		}

		this._map.addLayer(lineBack);
		this._map.addLayer(line);
		this._layersByRoute[tripRoute.id].push(line);
		this._layersByRoute[tripRoute.id].push(lineBack);
	}

	/**
	 *
	 * @param {TripRoute} tripRoute
	 * @param {TripLeg} tripLeg2
	 * @param {number} tripLegIndex
	 * @param {number} markerIndex
	 */
	private addTripLegSummaryLineMarkers(tripRoute: TripRoute, tripLeg2: TripLeg, tripLegIndex: number, markerIndex: number = 0) {
		// console.log("in summary markers");

		if (tripLegIndex === 0) {
			markerIndex = 1;
		} else {
			markerIndex = tripLegIndex + 1;
		}

		if (tripRoute.tripLegs.length === 1) {
			// add icon for start and end of this leg

			// console.log(tripRoute.startLocation.getMarkerIcon());
			// let marker = L.marker(tripLeg2._waypoints[0]);
			let icon = L.icon({
				iconUrl: markerIcon,
				iconSize: [25, 41],
				iconAnchor: [13, 41],
				popupAnchor: [0, -44]
			});

			let marker = L.marker(tripLeg2._waypoints[0], {
				icon: icon
			});

			marker.setIcon(tripRoute.startLocation.getMarkerIcon());
			marker.addTo(this._map);
			this._layersByRoute[tripRoute.id].push(marker);
			marker.bindTooltip(tripRoute.startLocation.displayName(), {
				permanent: true,
				direction: 'bottom'
			});

			$(marker['_icon'])
				.find('mark')
				.css({ display: 'block' });
			$(marker['_icon'])
				.find('mark')
				.html('' + markerIndex);

			marker = L.marker(_last(tripLeg2._waypoints));
			marker.setIcon(tripRoute.endLocation.getMarkerIcon());
			marker.addTo(this._map);
			this._layersByRoute[tripRoute.id].push(marker);
			marker.bindTooltip(tripRoute.endLocation.displayName(), {
				permanent: true,
				direction: 'bottom'
			});

			markerIndex++;
			$(marker['_icon'])
				.find('mark')
				.css({ display: 'block' });
			$(marker['_icon'])
				.find('mark')
				.html('' + markerIndex);
			// console.log($(marker['_icon']));
			// console.log(marker);
		} else if (tripRoute.tripLegs.length > 1) {
			if (tripLeg2.id === _first(tripRoute.tripLegs).id) {
				let marker = L.marker(tripLeg2._waypoints[0]);

				marker.setIcon(tripRoute.startLocation.getMarkerIcon());
				marker.addTo(this._map);
				this._layersByRoute[tripRoute.id].push(marker);
				marker.bindTooltip(tripRoute.startLocation.displayName(), {
					permanent: true,
					direction: 'bottom'
				});

				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);

				marker = L.marker(_last(tripLeg2._waypoints));
				marker.setIcon(icons.default.switchIconSummary);

				markerIndex++;

				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);

				this.addDeleteModeSwitchPopup(marker, tripLegIndex);
				marker.addTo(this._map);
				this._layersByRoute[tripRoute.id].push(marker);
			} else if (tripLeg2.id === _last(tripRoute.tripLegs).id) {
				let marker = L.marker(tripLeg2._waypoints[0]);
				marker.setIcon(icons.default.switchIconSummary);
				marker.addTo(this._map);
				this.addDeleteModeSwitchPopup(marker, tripLegIndex);
				this._layersByRoute[tripRoute.id].push(marker);
				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);

				markerIndex++;

				marker = L.marker(_last(tripLeg2._waypoints));
				marker.setIcon(tripRoute.endLocation.getMarkerIcon());
				marker.addTo(this._map);
				this._layersByRoute[tripRoute.id].push(marker);
				marker.bindTooltip(tripRoute.endLocation.displayName(), {
					permanent: true,
					direction: 'bottom'
				});
				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);
			} else {
				let marker = L.marker(tripLeg2._waypoints[0]);
				marker.setIcon(icons.default.switchIconSummary);
				this.addDeleteModeSwitchPopup(marker, markerIndex);
				marker.addTo(this._map);
				this._layersByRoute[tripRoute.id].push(marker);
				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);

				markerIndex++;
				marker = L.marker(_last(tripLeg2._waypoints));
				marker.setIcon(icons.default.switchIconSummary);
				this.addDeleteModeSwitchPopup(marker, tripLegIndex);
				marker.addTo(this._map);
				this._layersByRoute[tripRoute.id].push(marker);
				$(marker['_icon'])
					.find('mark')
					.css({ display: 'block' });
				$(marker['_icon'])
					.find('mark')
					.html('' + markerIndex);
			}
		}

		// add markers for waypoint switching

		let waypointIndex = 0;
		for (let tripLeg of tripRoute.tripLegs) {
			for (let i = 1; i < tripLeg.waypoints.length - 1; i++) {
				if (!tripLeg._isComplete) {
					let marker = L.marker(tripLeg.waypoints[i]);
					marker.setIcon(icons.default.switchIconSummary);
					marker.addTo(this._map);
					this._layersByRoute[tripRoute.id].push(marker);
					$(marker['_icon'])
						.find('mark')
						.css({ display: 'block' });
					$(marker['_icon'])
						.find('svg,i,img')
						.remove();
					$(marker['_icon'])
						.find('mark')
						.html('' + String.fromCharCode(97 + waypointIndex).toUpperCase());
					$(marker['_icon']).css({ 'pointer-events': 'none' });
					waypointIndex++;
				}
			}
		}
	}
}
