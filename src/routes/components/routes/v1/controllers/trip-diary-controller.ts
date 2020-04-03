import { SurveyMapMarker } from '../shared/survey-map-marker';
import { SurveyMapDirective } from '../shared/directives/survey-map-directive';
import { TripRoute } from '../ts/trip-route';

import { TripTimeline } from '../ts/trip-timeline';
// import 'google';
// import {LatLngBounds, LatLng, PlaceResult } from 'google';
import { TripsQuestionState } from '../ts/trips-question-state';
import * as angular from 'angular';
import * as moment from 'moment';
import * as icons from '../shared/survey-map-marker-type';
// import * as L from 'leaflet';
import { TripDiary } from '../ts/trips-diary';
// import * as _ from 'lodash';
import * as TripsActions from '../ts/trips-actions';
// import LatLngBounds = google.maps.LatLngBounds;
// import LatLng = google.maps.LatLng;
// import SearchBox = google.maps.places.SearchBox;

import { defer, delay } from 'lodash';

class LatLng {
	lat: number;
	lng: number;

	public constructor(lat, lng) {
		this.lat = lat;
		this.lng = lng;
	}
}

interface PlaceResult {
	[key: string]: any;
}

import {
	ADD_TRIP_LOCATION_DATA,
	ADD_TRIP_LOCATION_VIEW,
	CANCEL_ADD_TRIP_LOCATION,
	EDIT_TRIP_LOCATION_DATA,
	OPTION_TRIPS_TAKEN,
	REMOVE_MODE_SWITCH,
	REMOVE_TRIP_LOCATION,
	SET_MODE_SWITCH_DATA,
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
	setTripLegActive,
	UPDATE_STATE,
	UPDATE_TRIP_ROUTES,
	updateState
} from '../ts/trips-actions';

// import PlaceResult = google.maps.places.PlaceResult;
import { TripLocation, TripLocationType } from '../ts/trip-location';

import { INITIAL_STATE } from '../ts/trips-reducers';
import { ITripsScope } from '../ts/trips-scope';

import 'angular-cookies/index';
import { SurveyConfigService } from '../shared/services/survey-config-service';
import { SurveyManager } from '../ts/survey-manager';
import { SurveyManagerEvents } from '../ts/survey-manager-events';

import { TripDiaryService } from '../ts/trip-diary-service';
import { isNullOrUndefined } from 'util';
import { SurveyMapLocation } from '../shared/survey-map-location';
import { SurveyQuestion } from '../ts/survey-question';
import { MultipageQuestion } from '../ts/survey-multipage';
import { RoutesService } from '../../../../services/routes.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';
import { GroupMember, ResponseValidationState } from 'traisi-question-sdk';
import iconMap from 'shared/icon-map';

declare var addSuccess: (element) => any;
declare var removeClasses: (element) => any;
declare var hasSuccess: (element) => any;
import switchModePopupTemplateUrl from '../templates/trip-diary-switch-mode-popup.html';
/**
 * Controller class for trips type question
 */
export class TripDiaryController extends SurveyQuestion implements MultipageQuestion {
	startDate: any;
	todayDateDisplay: string;
	tomorrowDateDisplay: string;
	$http: angular.IHttpService;
	$ngRedux: any;
	$ngAnimation: angular.animate.IAnimateService;
	$mdpTimePicker: any;
	$window: angular.IWindowService;
	$location: angular.ILocationService;
	$translate: angular.translate.ITranslateService;
	$cookies: angular.cookies.ICookiesService;
	surveyNextPageButton: JQuery<HTMLElement>;
	surveyPreviousPageButton: JQuery<HTMLElement>;
	basicState: {};
	isMultiPage: boolean;
	csrfToken: string;
	surveyId: string;
	questionResponse: string;
	translateData: { startTime: string; endTime: string; startDate: string; endDate: string; householdName: string };
	startTime: any;

	/* state of controller */
	value: TripsQuestionState;
	questionId: string;

	public defaultView: () => any;
	tripsTaken: () => any;
	noTripsTaken: () => any;
	noTripsReasonGiven: () => any;
	tripRouteModeView: () => any;
	setRouteEditActive: (number) => any;
	setRouteEditComplete: (index: number) => void;
	setRouteEditIncomplete: (index: number) => void;
	updateState: (state: TripsQuestionState) => any;
	updateTripRoutes: (routes: TripRoute[]) => any;
	setTripMode: (mode: string, category: string) => any;
	setTripLegData: (coordinates: L.LatLng[], indices: number[], routeName: string, routeIndex: number, otherRoutes?) => any;
	setSwitchRouteModeState: (active: boolean) => any;
	setModeSwitchData: () => any;
	setTripLegActive: (index: number) => any;
	removeTripLeg: (index: number) => any;
	addTripLocationData: () => any;
	addTripLocation: (loc: any) => any;
	setUnknownRoute: () => any;
	setTripLegIncomplete: (index: number) => any;
	removeModeSwitch: (routeIndex: number, legIndex: number) => any;

	get tripsScope(): ITripsScope {
		return this.$scope as ITripsScope;
	}

	private _state: TripsQuestionState;
	private shouldInit = false;
	get state(): TripsQuestionState {
		return this.tripsScope.tc.value;
	}

	private _tripTimeline: TripTimeline;

	public get tripTimeline(): TripTimeline {
		return this._tripTimeline;
	}

	public set tripTimeline(value: TripTimeline) {
		this._tripTimeline = value;
	}

	private _map: SurveyMapDirective;

	get map(): SurveyMapDirective {
		return this._map;
	}

	set map(value: SurveyMapDirective) {
		this._map = value;
	}

	private _locationEntry: string;

	get locationEntry(): string {
		return this._locationEntry;
	}

	set locationEntry(value: string) {
		this._locationEntry = value;
	}

	private _surveyStartTime: moment.Moment;

	get surveyStartTime(): moment.Moment {
		return this._surveyStartTime;
	}

	set surveyStartTime(value: moment.Moment) {
		this._surveyStartTime = value;
	}

	private _activePageValid: boolean;

	get activePageValid(): boolean {
		return this._activePageValid;
	}

	set activePageValid(value: boolean) {
		this._activePageValid = value;
	}

	private _rootScope: ng.IScope;

	public get rootScope(): ng.IScope {
		return this._rootScope;
	}

	private _routeMap: SurveyMapDirective;

	public get routeMap(): SurveyMapDirective {
		return this._routeMap;
	}

	private _locationSearchBoxInput: HTMLInputElement;

	private _pageValid: boolean;

	/**
	 *
	 * @param {TripLocation} obj
	 */
	public markerClickCallback = (obj: TripLocation) => {
		if (obj._lockedLocation === false) {
			this.value.activeTripLocation.locationInput = obj.locationInput;
			this.value.activeTripLocation.latLng = obj.latLng;
			this.value.activeTripLocation.locationName = obj.locationName;

			this._$scope.$digest();
			this._map.setMarkerActive(obj);
			this._map.hideMarker(this.value.activeTripLocation);
		}
	};

	/**
	 * Route callback to add a new waypoint for the router
	 * @param controller
	 * @param {string} location
	 * @param {L.LatLng} latLng
	 */
	public routeCallback = (controller, location: string, latLng: L.LatLng) => {
		/* display a marker for switched route */
		if (this.state.switchRouteModeActive) {
			let switchMarker = new SurveyMapMarker();
			switchMarker.id = 'SWITCH_ROUTE';
			switchMarker.latLng = latLng;
			switchMarker.markerType = icons.MarkerType.Switch;

			this._routeMap.addMarker(switchMarker, switchModePopupTemplateUrl);

			this.state.switchRouteModeLocation = latLng;

			if (!this.$scope.$$phase) {
				this.$scope.$digest();
			}
		}
	};

	/**
	 *
	 * @param controller
	 * @param {string} location
	 * @param {L.LatLng} latLng
	 */
	private markerCallback = (controller, location: string, latLng: L.LatLng) => {
		if (this.value.activeTripLocation._lockedLocation === false) {
			this.value.activeTripLocation.locationInput = location;
			this.value.activeTripLocation.latLng = latLng;

			this._map.showMarker(this.value.activeTripLocation);
			this._map.setMarkerActive(this.value.activeTripLocation);
		}
	};

	/**
	 * Callback for when route map is ready
	 */
	private routeMapReady = (surveyMap: SurveyMapDirective) => {
		defer(() => {
			if (this.state.tripRoutes[this.state.activeRouteIndex] != null) {
				this._routeMap.addRouting(this.state.tripRoutes[this.state.activeRouteIndex]);
			}
		});
	};

	/**
	 *
	 * @param {SurveyMapDirective} surveyMap
	 */
	private locationsReady = (surveyMap: SurveyMapDirective) => {
		surveyMap.restoreMarkerState(
			[]
				.concat(this.state.startLocation)
				.concat(this.state.tripLocations)
				.concat(this.state.endLocation)
		);
	};

	/**
	 *
	 * @param {ITripsScope} $scope
	 * @param {angular.IScope} $rootScope
	 * @param {angular.IHttpService} $http
	 * @param {INgRedux} $ngRedux
	 * @param {"angular".animate.IAnimateService} $ngAnimation
	 * @param $mdpTimePicker
	 * @param {angular.IWindowService} $window
	 * @param {angular.ILocationService} $location
	 * @param {"angular".translate.ITranslateService} $translate
	 * @param {"angular".cookies.ICookiesService} $cookies
	 * @param {SurveyConfigService} configService
	 * @param {TripDiaryService} _tripDiaryService
	 * @param {angular.ITimeoutService} _$timeout
	 */
	constructor(
		public $scope: ITripsScope,
		$rootScope: ng.IScope,
		$http: ng.IHttpService,
		$ngRedux: any,
		$ngAnimation: angular.animate.IAnimateService,
		$mdpTimePicker: any,
		$window: ng.IWindowService,
		$location: ng.ILocationService,
		$translate: angular.translate.ITranslateService,
		$cookies: ng.cookies.ICookiesService,
		private configService: SurveyConfigService,
		private _tripDiaryService: TripDiaryService,
		private _$timeout: ng.ITimeoutService,
		_routesService: RoutesService,
		_surveyV2Id: number,
		respondent: GroupMember,
		questionId: any,
	) {
		super(
			$scope,
			$rootScope,
			$http,
			$ngRedux,
			$ngAnimation,
			$mdpTimePicker,
			$window,
			$location,
			$translate,
			$cookies,
			configService,
			_routesService,
			_surveyV2Id,
			respondent
		);


		this.questionId = questionId;

		let unsubscribe = $ngRedux.connect(this.mapStateToThis, TripsActions)(this);

		this._$rootScope = $rootScope;
		this.$ngRedux = $ngRedux;
		this._$ngRedux = $ngRedux;

		this.$scope.$on('$destroy', unsubscribe);

		$scope.config = TripDiary.config;

		$scope['tripsConfig'] = TripDiary.config;

		$scope['$tds'] = _tripDiaryService;

		let tcRef: TripDiaryController = this;

		this._tripTimeline = new TripTimeline();

		this.initializeLocationWatcher();

		$ngRedux.subscribe(() => {
			// _$timeout(() => {
			// 	this.manageCompleteState($ngRedux.getState().tripsState);
			// });

			// this.manageActiveSubSections($ngRedux.getState().tripsState);

			// manage the route map state
			this.manageRouteMapState($ngRedux.getState());

			// manage the location map state
			// this.manageLocationMapState($ngRedux.getState());
			delay(() => {
				// window.dispatchEvent(new Event('resize'));
			}, 300);
		});

		/* $scope.$watch('tc.value.madeTrips.value', (newValue, oldValue) => {
            let titleElement = $('#div_id_' + this.questionId).closest('.question-item');
            titleElement = titleElement.find('.question-container').first();
            titleElement.addClass('success');
            if (newValue === true && (oldValue == false || oldValue == null)) {
                $scope.tc.tripsTaken();
            }

            if (newValue === false) {
                $scope.tc.noTripsTaken();
            }
        }); */

		/* $scope.$watch('tc.value.madeTrips.reason', (newValue, oldValue) => {
            $scope.tc.noTripsReasonGiven();
        }); */

		this._$scope.$on('waypointsChanged', (evt, args) => {
			_$timeout(() => {
				this._routeMap.addRouting(_tripDiaryService.getActiveTripRoute(), true);
			});
		});

		/*
		$scope.$watch(
			'tc.value',
			(newValue, oldValue) => {
				tcRef.updateResponse(JSON.stringify(newValue, tcRef.serializer));
			},
			true
		); */

		$scope.$watch('tc.value.activeRouteIndex', (newValue: number, oldValue) => {
			if (tcRef._routeMap != null && newValue >= 0) {
				tcRef._routeMap.addRouting(tcRef.state.tripRoutes[newValue]);
			} else if (tcRef._routeMap != null && newValue === -1) {
				tcRef._routeMap.showRouteSummary(tcRef.state.tripRoutes);
			}
		});

		/*
		$scope.$watch(
			'tc.value.activeTripLocation',
			(newValue: TripLocation, oldValue: TripLocation) => {

				if (
					isNullOrUndefined($scope.tc.state.madeTrips) ||
					isNullOrUndefined($scope.tc.state.madeTrips.value) ||
					$scope.tc.state.madeTrips.value === false
				) {
					return;
				}

				if (newValue == null) {
					$scope.tripsLocationForm.$setPristine(true);
					// $scope.tripsLocationForm.$setValidity();
					$scope.tripsLocationForm.$setUntouched();
				}

				if (newValue != null) {
					if (tcRef.state.previousAction !== CANCEL_ADD_TRIP_LOCATION) {
						this._$scope['tripsLocationForm'].$valid = false;
						this._$scope['tripsLocationForm'].$invalid = true;

						this._$scope['tripsLocationForm'].$error = {};

						if (this.validateLocationForm()) {
							$scope.tripsLocationForm.$setPristine(true);
							$scope.tripsLocationForm.$setValidity();
							this._$scope['tripsLocationForm'].$error = {};
							// this._$scope['tripsLocationForm'].$valid = true;
							// this._$scope['tripsLocationForm']['invalidTime'] = false;
							this._$scope['tripsLocationForm'].$valid = true;
							this._$scope['tripsLocationForm'].$invalid = false;
							this._$scope['tripsLocationForm'].$tcInvalid = false;
						} else {
							this._$scope['tripsLocationForm'].$valid = false;
							this._$scope['tripsLocationForm'].$invalid = true;
							this._$scope['tripsLocationForm'].$tcInvalid = true;
						}

						/* Add this trip location
						newValue.label = newValue.locationName;

						if (newValue.mapMarker == null && tcRef.map != null) {
							if (oldValue != null && oldValue instanceof TripLocation) {
								if (!isNullOrUndefined(newValue.latLng)) {
									if (newValue.latLng.lat !== oldValue.latLng.lat || newValue.latLng.lng !== oldValue.latLng.lng) {
										tcRef.map.addMarker(newValue);
										tcRef.map.setMarkerActive(newValue);
									}

									if (newValue.displayName() !== oldValue.displayName()) {
										tcRef.map.setMarkerLabel(newValue, newValue.displayName());
									}
								}
							} else {
								tcRef.map.hideAllMarkers();
								tcRef.map.addMarker(newValue);
								tcRef.map.setMarkerActive(newValue);
							}
						}

						/* Update the scope
					} else if (tcRef.map != null && tcRef.state.previousAction !== CANCEL_ADD_TRIP_LOCATION) {
						/*set marker active
						tcRef.map.setMarkerActive(newValue, newValue._lockedLocation);
					} else if (tcRef.state.previousAction !== CANCEL_ADD_TRIP_LOCATION) {
						/* Add this trip location
						newValue.label = newValue.locationName;
					}
				}

				_$timeout(() => {
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				});
			},
			true
		); */

		$scope.$on('$mdMenuClose', () => {
			delay(() => {
				window.dispatchEvent(new Event('visibilityScrollCheck'));
			}, 1000);
		});
	}

	/**
	 *
	 */
	private toggleRouteMapTour() {
		if (window.matchMedia('(min-width: 480px)').matches) {
			// 	this._tripDiaryService.toggleRouteMapTour();
		}

		this.$scope['routeMobileTourActive'] = true;
		// window.dispatchEvent(new CustomEvent('onShowRouteTour'));
	}

	public $onInit = (): void => {
		console.log(this);
		this.initQuestion(this.questionId);
	};

	/**
	 *
	 * @param {SurveyMapDirective} value
	 */
	public set routeMap(value: SurveyMapDirective) {
		this._routeMap = value;
		this.updateTripRouteModes();
	}

	public isValid(): boolean {
		return true;
	}

	/**
	 * Updates trip route modes
	 */
	public updateTripRouteModes(force: boolean = false): void {
		/* call action to add routes */

		if (this.state.previousAction === UPDATE_STATE && !this.shouldInit) {
			this.updateValidationV2();
			return;
		}

		//        if(this.state.previousAction == TRIP_LO)

		let routes: TripRoute[] = [];

		/* add route for each trip */

		if (this.state.tripLocations.length === 0) {
			// just a single route from start to end

			if (this.state.startLocation != null && this.state.endLocation != null) {
				let tripRoute = TripRoute.create(this.state.startLocation, this.state.endLocation);

				if (
					tripRoute.startLocation.latLng.lat !== tripRoute.endLocation.latLng.lat &&
					tripRoute.startLocation.latLng.lng !== tripRoute.endLocation.latLng.lng
				) {
					routes.push(tripRoute);
				} else {
					console.log('coords match');
				}
			}
		} else {
			let i: number = 0;

			if (
				!isNullOrUndefined(
					this.state.startLocation
				) /*&&
				isNullOrUndefined(this.state.endLocation) /*|| this.state.tripLocations[0].startTime < this.state.endLocation.startTime */
			) {
				let startTripRoute = TripRoute.create(this.state.startLocation, this.state.tripLocations[0]);

				// if (startTripRoute.startLocation.locationName !== startTripRoute.endLocation.locationName) {
				routes.push(startTripRoute);

				// }
			}

			let lastNonEmbedded = 1;

			// DISABLED FOR NOW
			if (this.state.tripLocations.length > 1 && false) {
				for (
					;
					i < this.state.tripLocations.length &&
					isNullOrUndefined(
						this.state.endLocation
					) /*||  this.state.tripLocations[i].startTime < this.state.endLocation.startTime */;
					i++
				) {
					break;
					let surroundingLocation = this.getEmbeddedLocation(this.state.tripLocations[i]);

					if (surroundingLocation != null) {
						let route1 = TripRoute.create(surroundingLocation, this.state.tripLocations[i]);
						let route2 = TripRoute.create(this.state.tripLocations[i], surroundingLocation);

						routes.push(route1);
						routes.push(route2);
					} else {
						let route = TripRoute.create(this.state.tripLocations[lastNonEmbedded], this.state.tripLocations[i]);
						// if (route.startLocation.address !== route.endLocation.address) {
						routes.push(route);
						lastNonEmbedded = i;
						// }
					}
				}
			}
			// DISABLED
			if (lastNonEmbedded >= 0 && !isNullOrUndefined(this.state.endLocation) && false) {
				let latestLocation = this.state.tripLocations[lastNonEmbedded];

				if (!isNullOrUndefined(this.state.endLocation) /* latestLocation.startTime < this.state.endLocation.startTime */) {
					let endTripRoute = TripRoute.create(latestLocation, this.state.endLocation);
					// if (endTripRoute.startLocation.locationName !== endTripRoute.endLocation.locationName) {
					routes.push(endTripRoute);
					// }
				} else if (
					lastNonEmbedded === 0 &&
					!isNullOrUndefined(this.state.endLocation) /*&&
					latestLocation.startTime > this.state.endLocation.startTime*/
				) {
					let directRoute = TripRoute.create(this.state.startLocation, this.state.endLocation);
					// if (directRoute.startLocation.locationName !== directRoute.endLocation.locationName) {
					routes.push(directRoute);
					// }
				}
			}

			// DISABLED
			if (!isNullOrUndefined(this.state.endLocation) && false) {
				for (; i < this.state.tripLocations.length; i++) {
					let surroundingLocation = this.getEmbeddedLocation(this.state.tripLocations[i]);

					if (surroundingLocation != null) {
						let route1 = TripRoute.create(surroundingLocation, this.state.tripLocations[i]);
						let route2 = TripRoute.create(this.state.tripLocations[i], surroundingLocation);

						routes.push(route1);
						routes.push(route2);
					} else {
					}
				}
			}

			for (i = 0; i < this.state.tripLocations.length - 1; i++) {
				let route = TripRoute.create(this.state.tripLocations[i], this.state.tripLocations[i + 1]);
				routes.push(route);
			}

			if (!isNullOrUndefined(this.state.endLocation)) {
				let route = TripRoute.create(this.state.tripLocations[this.state.tripLocations.length - 1], this.state.endLocation);
				routes.push(route);
			}
		}

		// if length of routes is the same

		let oldRoutes: TripRoute[] = this.state.tripRoutes;
		for (let i = 0; i < routes.length; i++) {
			for (let j = 0; j < oldRoutes.length; j++) {
				if (TripRoute.similarRoutes(routes[i], oldRoutes[j])) {
					routes[i].tripLegs = oldRoutes[j].tripLegs;
					routes[i].editComplete = oldRoutes[j].editComplete;
				}
			}
		}

		this.updateTripRoutes(routes);

		if (this.state.activeRouteIndex >= routes.length) {
			// settings route edit active

			delay(() => {
				this._tripDiaryService.setRouteEditActive(0);
			}, 0);
		}
		if (routes.length === 0) {
			// hide routes tour since no routes available
			this._tripDiaryService.routesHidden();
		}

		this.shouldInit = false;
		this.updateValidationV2();

		// this._$window.dispatchEvent(new CustomEvent('visibilityScrollCheck'));
	}

	/**
	 * Checks validation
	 */
	private updateValidationV2(): void {
		let allValidated: boolean = true;

		if (this.state !== null && this.state.tripRoutes.length > 0) {
			this.state.tripRoutes.forEach(route => {
				if (!route.editComplete) {
					allValidated = false;
				}
			});
		} else {
			allValidated = false;
		}

		if (allValidated) {
			this._routesService.updateValidationState(ResponseValidationState.VALID);
		} else {
			this._routesService.updateValidationState(ResponseValidationState.TOUCHED);
		}
	}

	private getLocationIcon(purpose: string): string {
		return iconMap[purpose];
	}

	/**
	 *
	 * @param questionID
	 */
	public initQuestion(questionID): void {
		this.initLocationSearchBox();
		console.log(questionID);
		this.initStateManagement();
		this.questionId = questionID;
		this.initializeSurvey({}, this.$scope, this.$http);

		this._routesService.savedResponse().subscribe(response => {

			let state: TripsQuestionState;

			if (response !== 'none' && !(response instanceof Array)) {
				let t = JSON.parse(response[0].value);
				if (t.tripsState !== undefined) {
					state = t.tripsState;
				}

				// console.log(state);
			} else {
				// its an array
				// console.log(response);
				(<any>state) = {
					activeRouteIndex: 0,
					_activeRouteIndex: 0,
					tripRoutes: []
					// _tripRoutes: []
				};
			}

			this._routesService.listTimelineEntries(this._surveyV2Id, this._respondent).subscribe((entries: Array<any>) => {
				// find index

				let compareEntries = [];

				console.log(entries);

				let index = entries.findIndex(entry => {
					return entry.respondent.id === this._respondent.id;
				});
				if (index < 0) {
					index = 0;
				}
				let timelineEntries: TimelineEntry[] = entries[index].responseValues;

				let startLocation = null;
				let endLocation = null;
				let intermediateLocations = [];
				if (timelineEntries.length >= 1) {
					startLocation = {
						_locationName: timelineEntries[0].name,
						latLng: {
							lat: timelineEntries[0].latitude,
							lng: timelineEntries[0].longitude
						},
						locationPurpose: timelineEntries[0].purpose,
						_locationPurpose: timelineEntries[0].purpose,
						startTime: new Date(timelineEntries[0].timeA),
						endTime: new Date(timelineEntries[0].timeB),
						timelineIcon: this.getLocationIcon(timelineEntries[0].purpose)
					};
					// _startLocation = startLocation
					compareEntries.push(startLocation);
				}

				if (timelineEntries.length >= 2) {
					endLocation = {
						_locationName: timelineEntries[timelineEntries.length - 1].name,
						latLng: {
							lat: timelineEntries[timelineEntries.length - 1].latitude,
							lng: timelineEntries[timelineEntries.length - 1].longitude
						},
						locationPurpose: timelineEntries[timelineEntries.length - 1].purpose,
						_locationPurpose: timelineEntries[timelineEntries.length - 1].purpose,
						startTime: new Date(timelineEntries[timelineEntries.length - 1].timeA),
						endTime: new Date(timelineEntries[timelineEntries.length - 1].timeB),
						timelineIcon: this.getLocationIcon(timelineEntries[timelineEntries.length - 1].purpose)
					};
				}

				if (timelineEntries.length === 2) {
					compareEntries.push(endLocation);
				}

				if (timelineEntries.length >= 3) {
					const locations = timelineEntries.slice(1, timelineEntries.length - 1);

					locations.forEach(entry => {
						let newEntry = {
							_locationName: entry.name,
							latLng: {
								lat: entry.latitude,
								lng: entry.longitude
							},
							locationPurpose: entry.purpose,
							_locationPurpose: entry.purpose,
							startTime: new Date(entry.timeA),
							endTime: new Date(entry.timeB),
							timelineIcon: this.getLocationIcon(entry.purpose)
						};

						intermediateLocations.push(newEntry);
						compareEntries.push(newEntry);
					});

					compareEntries.push(endLocation);
				}

				if (state === undefined) {
					// console.log(' undefined ');
					this.basicState = {
						startLocation: startLocation,
						_startLocation: startLocation,
						_endLocation: endLocation,
						_tripLocations: intermediateLocations,
						tripLocations: intermediateLocations,
						endLocation: endLocation,
						activeRouteIndex: 0,
						_activeRouteIndex: 0,
						tripRoutes: []
						// _tripRoutes: []
					};

					for (let route of response) {
						(<any>this.basicState).tripRoutes.push(JSON.parse(route.value));
					}

					// this.state = this.basicState;
					this.shouldInit = true;
					this.$ngRedux.dispatch(updateState(this.basicState as TripsQuestionState));

					// this._tripDiaryService.setRouteEditActive(this.basicState['activeRouteIndex']);
					// this.updateValidationV2();

					if (this.state.activeRouteIndex >= 0) {
						// settings route edit active

						delay(() => {
							this._tripDiaryService.setRouteEditActive(0);
						}, 0);
					}
				} else {
					// compare the routes

					if (response !== 'none') {
						for (let route of response) {
							(<any>state).tripRoutes.push(JSON.parse(route.value));
						}
					}

					console.log(state.tripRoutes);

					for (let i = 0; i < state.tripRoutes.length; i++) {
						let route: TripRoute = state.tripRoutes[i];

						// console.log(i);
						if (compareEntries.length <= i + 1) {
							route.tripLegs = [];

							break;
						}

						if (
							route._startLocation._latLng.lat !== compareEntries[i].latLng.lat ||
							route._startLocation._latLng.lng !== compareEntries[i].latLng.lng ||
							route._endLocation._latLng.lat !== compareEntries[i + 1].latLng.lat ||
							route._endLocation._latLng.lng !== compareEntries[i + 1].latLng.lng
						) {
							// let routeCrate = TripRoute.create(compareEntries[i], compareEntries[i + 1]);
							state.tripRoutes[i] = TripRoute.create(compareEntries[i], compareEntries[i + 1]);
						} else {
						}
					}

					// purge extra routes
					if (compareEntries.length <= state.tripRoutes.length) {
						state.tripRoutes = state.tripRoutes.slice(0, compareEntries.length - 1);
					}

					if (compareEntries.length > state.tripRoutes.length + 1) {
						// create routes
						for (let i = state.tripRoutes.length; i < compareEntries.length - 1; i++) {
							state.tripRoutes[i] = TripRoute.create(compareEntries[i], compareEntries[i + 1]);
						}
					}

					// console.log(state.tripRoutes);
					this.basicState = {
						startLocation: startLocation,
						_startLocation: startLocation,
						_endLocation: endLocation,
						_tripLocations: intermediateLocations,
						tripLocations: intermediateLocations,
						endLocation: endLocation,
						activeRouteIndex: 0,
						tripRoutes: state.tripRoutes,
						_tripRoutes: state.tripRoutes
					};

					this.shouldInit = false;
					// this.basicState = state;
					// this.tripsScope.tc.value = state;
					// console.lo
					// this.$ngRedux.dispatch(updateState(this.basicState as TripsQuestionState));
					// this.updateState(<any>this.basicState);
					this._tripDiaryService.setRouteEditActive(this.basicState['activeRouteIndex']);

					this.updateValidationV2();
					// this.updateTripRouteModes();
				}

				console.log(this);
				this._$ngRedux.dispatch(updateState(this.basicState as TripsQuestionState));

				// this.updateTripRouteModes();
			});
		});

		this._$rootScope['questionId'] = this.questionId;

		// this.tripDiaryTourService.setQuestionId(this.questionId, this.translateData);

		let $scope = this._$scope as ITripsScope;

		$scope.$watch('tc.value.previousAction', (newValue, oldValue) => {
			if (newValue === UPDATE_STATE) {
				$scope.tc.updateTripRouteModes();
			} else if (newValue === CANCEL_ADD_TRIP_LOCATION) {
				let markerList = [];
				if (this.state.startLocation != null) {
					markerList.push(this.state.startLocation);
				}
				markerList = markerList.concat(this.state.tripLocations);
				if (this.state.endLocation != null) {
					markerList.push(this.state.endLocation);
				}
				this._map.cleanMarkers(markerList);
			} else if (newValue === SET_TRIP_LEG_ACTIVE) {
				this._routeMap.addRouting(this.state.tripRoutes[this.state.activeRouteIndex]);
			}
		});

		$scope.$watch('tc.value.activeMode', (newValue, oldValue) => {
			if (this._routeMap != null) {
				if (this.state.tripRoutes[this.state.activeRouteIndex] != null) {
					this._routeMap.addRouting(this.state.tripRoutes[this.state.activeRouteIndex]);

					if (!$scope.$$phase) {
						$scope.$digest();
					}
				}
			}
		});

		/* Update the state of the question */
		// this.$ngRedux.dispatch(updateState(this.basicState as TripsQuestionState));

		// let titleElement = $('#div_id_' + this.questionId).closest('.question-item');
		// titleElement = titleElement.find('.question-container').first();

		// this.updateTripRouteModes();

		/* _.delay(() => {
            this._$translate('DID_MAKE_TRIPS', this.translateData)
                .then(function(value) {
                    titleElement.html(value);
                })
                .catch((reason) => {})
                .finally(() => {});
        }, 5); */
	}

	pageValid(): boolean {
		return false;
	}

	public confirmModeSwitch() {
		this._routeMap.removeMarker('SWITCH_ROUTE');

		this.setModeSwitchData();
	}

	/**
	 *
	 * @param {MultipageQuestion} selfRef
	 * @param {number} page
	 * @returns {boolean}
	 */
	pageChanged(selfRef: MultipageQuestion, page: number): boolean {
		/* Determine which view to show on page change */

		/* back button pressed */

		return;

		/*
		let selfRefTc: TripDiaryController = selfRef as TripDiaryController;

		if (page == -1) {
			if (selfRefTc.state.timelineView) {
				selfRefTc.tripsScope.tc.defaultView();
			}

			if (selfRefTc.state.routeModeView) {
				selfRefTc.tripsScope.tc.tripsTaken();
			}
		} else if (page == 1) {
			if (selfRefTc.state.initialView) {
				if (selfRefTc.state.madeTrips.value) {
					selfRefTc.tripsScope.tc.tripsTaken();
				} else {
					selfRefTc.tripsScope.tc.noTripsTaken();
				}

				return false;
			} else if (selfRefTc.state.timelineView) {
				selfRefTc.tripsScope.tc.tripRouteModeView();
				return false;
			}

			if (selfRefTc.state.noTripsSelectView) {
				if (selfRefTc.activePageValid) {
					return true;
				}
			}
		}
	*/
		return false;
	}

	/**
	 *
	 * @param state
	 * @returns {{value: ((state:TripsQuestionState, action:any)=>(TripsQuestionState|TripsQuestionState|TripsQuestionState))}}
	 */
	mapStateToThis(state) {
		return {
			value: state.tripsState
		};
	}

	/**
	 * Clears the response data and returns the question to a default state.
	 */
	protected clearResponse() {
		if (this._map != null) {
			this._map.cleanMarkers([]);
		}
		this.tripsScope.tc.updateState(INITIAL_STATE as TripsQuestionState);
	}

	/**
	 *
	 * @param {TripLocation} tripLocation1
	 * @param {TripLocation} tripLocation2
	 * @returns {boolean}
	 */
	private isEmbeddedTrip(tripLocation1: TripLocation, tripLocation2: TripLocation): boolean {
		if (
			tripLocation2._startTime > tripLocation1._startTime &&
			tripLocation2._endTime > tripLocation1._startTime &&
			tripLocation2._startTime < tripLocation1._endTime &&
			tripLocation2._endTime < tripLocation1._endTime
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Gets embedded location
	 * @param tripLocation
	 * @returns embedded location
	 */
	private getEmbeddedLocation(tripLocation: TripLocation): TripLocation {
		let surroundingLocation: TripLocation = null;

		for (let i = 0; i < this.state.tripLocations.length; i++) {
			let location = this.state.tripLocations[i];
			if (location !== tripLocation) {
				if (this.isEmbeddedTrip(location, tripLocation)) {
					surroundingLocation = location;
				}
			}
		}

		if (this.state.endLocation.startTime < tripLocation.startTime) {
			surroundingLocation = this.state.endLocation;
		}

		return surroundingLocation;
	}

	/**
	 *
	 * @param {TripLocation} tripLocation1
	 * @param {TripLocation} tripLocation2
	 * @returns {boolean}
	 */
	private isContainingTrip(tripLocation1: TripLocation, tripLocation2: TripLocation) {
		if (tripLocation1.startTime < tripLocation2.startTime && tripLocation1.endTime > tripLocation2.endTime) {
			return true;
		} else {
			return false;
		}
	}

	/** Setup watcher for tripLocations ( start and end too ) */
	private initializeLocationWatcher() {
		let tcRef = this;
		this.$scope.$watchCollection('tc.value.tripLocations', function(oldValue, newValue) {
			// update trip route
			tcRef.updateTripRouteModes();

			// 	 re order locations
		});

		this.$scope.$watch('tc.value.startLocation', function(oldValue: TripLocation, newValue: TripLocation) {
			// update trip route
			tcRef.updateTripRouteModes();
		});

		this.$scope.$watch('tc.value.endLocation', function(oldValue: TripLocation, newValue: TripLocation) {
			// update trip route
			tcRef.updateTripRouteModes();
		});
	}

	/**
	 *
	 * @param key
	 * @param value
	 * @returns {any}
	 */
	private serializer(key, value): any {
		if (key === 'locationView') {
			return false;
		} else if (key === 'mapView') {
			return false;
		} else if (key === 'timelineView') {
			return true;
		} else if (key === 'switchRouteModeActive') {
			return false;
		}
		return value;
	}

	/***
	 *
	 */
	private initStateManagement() {
		let $ngReduxRef = this.$ngRedux;

		window.onpopstate = ev => {
			$ngReduxRef.dispatch(updateState(ev.state as TripsQuestionState));
		};
	}

	/**
	 *
	 * @param {TripLocation} location
	 * @param {Array<TripLocation>} tripLocations
	 * @returns {number}
	 */
	private countEmbedded(location: TripLocation, tripLocations: Array<TripLocation>): number {
		let count = 0;
		for (let l2 of tripLocations) {
			if (this.isEmbeddedTrip(l2, location)) {
				count++;
			} else {
			}
		}

		return count;
	}

	/**
	 * Validates the input on the active loocation (time)
	 */
	private validateLocationForm(): boolean {
		let active = this.state.activeTripLocation;

		let error = false;
		let compareList = new Array<TripLocation>();

		if (!isNullOrUndefined(active.startTime)) {
			let startTime = moment(active.startTime);
			if (
				startTime.year() !== this.startDate.year() ||
				startTime.month() !== this.startDate.month() ||
				startTime.date() !== this.startDate.date()
			) {
				startTime.date(this.startDate.date());
				startTime.year(this.startDate.year());
				startTime.month(this.startDate.month());
				active.startTime = startTime.toDate();
			}
		}
		if (!isNullOrUndefined(active.endTime)) {
			let endTime = moment(active.endTime);
			if (
				endTime.year() !== this.startDate.year() ||
				endTime.month() !== this.startDate.month() ||
				endTime.date() !== this.startDate.date()
			) {
				endTime.date(this.startDate.date());
				endTime.year(this.startDate.year());
				endTime.month(this.startDate.month());
				active.endTime = endTime.toDate();
			}
		}

		compareList = compareList.concat(this.state.tripLocations);
		if (!isNullOrUndefined(this.state.startLocation)) {
			compareList.push(this.state.startLocation);
		}
		if (!isNullOrUndefined(this.state.endLocation)) {
			compareList.push(this.state.endLocation);
		}

		for (let location of compareList) {
			if (location.id !== this.state.activeTripLocation.id) {
				if (location.locationName === this.state.activeTripLocation.locationName) {
					// unmatching addresses
					if (location.locationInput !== this.state.activeTripLocation.locationInput) {
						this._$scope['tripsLocationForm'].$error['conflictingName'] = true;
						error = true;
						break;
					}
				}
			}
		}

		if (this.state.activeTripLocation.locationName == null) {
			//  return false;
			error = true;
		}

		if (this.state.activeTripLocation.locationInput == null) {
			//  return false;
			error = true;
		}

		if (
			isNullOrUndefined(this.state.activeTripLocation.startTime) &&
			this.state.activeTripLocation.locationType !== TripLocationType.StartLocation
		) {
			//   return false;
			error = true;
		}

		if (
			isNullOrUndefined(this.state.activeTripLocation.endTime) &&
			this.state.activeTripLocation.locationType !== TripLocationType.FinalLocation
		) {
			error = true;
			// return false;
		}

		if (
			(this.state.activeTripLocation.endTime == null || this.state.activeTripLocation.startTime == null) &&
			this.state.activeTripLocation.locationType === TripLocationType.IntermediateLocation
		) {
			error = true;
			// return false;
		}

		if (this.state.activeTripLocation._locationType === TripLocationType.StartLocation) {
			if (this.state.activeTripLocation.endTime != null) {
				if (this.state.activeTripLocation.endTime.getHours() < 4 && this.state.activeTripLocation.endTime.getHours() >= 0) {
					this._$scope['tripsLocationForm'].$error['tooEarly'] = true;
					error = true;
					// return false;
				}
			}
		}

		let startTimeAdjust = null;
		let endTimeAdjust = null;

		if (!isNullOrUndefined(this.state.activeTripLocation.startTime)) {
			startTimeAdjust = moment(this.state.activeTripLocation.startTime);
			startTimeAdjust.date(this.startDate.date());
			startTimeAdjust.year(this.startDate.year());
			startTimeAdjust.month(this.startDate.month());

			startTimeAdjust = startTimeAdjust.toDate();
		}

		if (!isNullOrUndefined(startTimeAdjust)) {
			if (startTimeAdjust.getHours() >= 0 && startTimeAdjust.getHours() < 4) {
				startTimeAdjust.setDate(startTimeAdjust.getDate() + 1);
			}
		}

		if (!isNullOrUndefined(this.state.activeTripLocation.endTime)) {
			endTimeAdjust = moment(this.state.activeTripLocation.endTime);
			endTimeAdjust.date(this.startDate.date());
			endTimeAdjust.year(this.startDate.year());
			endTimeAdjust.month(this.startDate.month());
			endTimeAdjust = endTimeAdjust.toDate();
		}

		if (!isNullOrUndefined(endTimeAdjust)) {
			// console.log(endTimeAdjust.getHours());
			if (endTimeAdjust.getHours() >= 0 && endTimeAdjust.getHours() < 4) {
				// console.log(endTimeAdjust.getHours());
				endTimeAdjust.setDate(endTimeAdjust.getDate() + 1);
			}
		}

		if (!isNullOrUndefined(endTimeAdjust) && !isNullOrUndefined(startTimeAdjust)) {
			if (endTimeAdjust.get < startTimeAdjust) {
				this._$scope['tripsLocationForm'].$error['invalidTime'] = true;

				error = true;
			}
		}

		/* check for earlier end time */
		if (!isNullOrUndefined(endTimeAdjust) && !isNullOrUndefined(startTimeAdjust)) {
			if (this.state.activeTripLocation._locationType === TripLocationType.IntermediateLocation) {
				if (endTimeAdjust <= startTimeAdjust) {
					this._$scope['tripsLocationForm'].$error['invalidTime'] = true;
					// console.log('invalid time2');

					error = true;
					// return false;
				}

				if (endTimeAdjust <= startTimeAdjust) {
					// console.log("here");

					this._$scope['tripsLocationForm'].$error['invalidTime'] = true;

					error = true;
					// return false;
				}
			}
		}

		if (this.state.endLocation != null && active.locationType !== TripLocationType.FinalLocation) {
			if (
				this.state.activeTripLocation.endTime >= this.state.endLocation.startTime &&
				this.state.activeTripLocation.startTime <= this.state.endLocation.startTime
			) {
				// console.log("ov1");
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				// return false;
			}
		}

		/*if (this.state.startLocation != null) {

			if (!isNullOrUndefined(startTimeAdjust)) {
				if (startTimeAdjust <= this.state.startLocation.endTime && active.id != this.state.startLocation.id) {

					//console.log(startTimeAdjust);
					//console.log(this.state.startLocation.endTime);
					// console.log("overlapping times");
					console.log("ov2");
					this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

					error = true;
					//return false;
				}
			}
			else {

			}
		}  */

		let countEmbedded = this.countEmbedded(active, compareList);

		if (isNullOrUndefined(active.startTime) || isNullOrUndefined(active.endTime)) {
			error = true;
			return !error;
		}

		if (countEmbedded > 1) {
			this._$scope['tripsLocationForm'].$error['multipleEmbedded'] = true;

			error = true;
		}

		// if(active.locationType == TripLocationType.FinalLocation && startTimeAdjust < )

		for (let location of compareList) {
			if (location.id === this.state.activeTripLocation.id) {
				continue;
			}

			if (this.isContainingTrip(active, location)) {
				// return true;
				console.log('is containing');
				break;
			}

			if (this.isEmbeddedTrip(location, active)) {
				console.log('is embedded');
				// return true;
				break;
			}

			if (
				active.locationType !== TripLocationType.StartLocation &&
				startTimeAdjust < location.startTime &&
				endTimeAdjust < location.endTime &&
				endTimeAdjust > location.startTime
			) {
				console.log('ov3');
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				break;
			}

			if (startTimeAdjust < location.startTime && endTimeAdjust > location.startTime && location.locationType === 'END_LOCATION') {
				console.log('ov2');
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				break;
			}

			if (startTimeAdjust < location.startTime && endTimeAdjust > location.startTime) {
				console.log('ov5');
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				break;
			}

			if (startTimeAdjust <= location.startTime && endTimeAdjust < location.endTime && endTimeAdjust >= location.startTime) {
				console.log(startTimeAdjust);
				console.log(location.startTime);
				console.log(endTimeAdjust);
				console.log(location.endTime);
				console.log('ov6');
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				break;
				// return false;
			}

			if (location._startTime <= endTimeAdjust && startTimeAdjust <= location._endTime) {
				console.log('ov7');
				this._$scope['tripsLocationForm'].$error['overlappingTimes'] = true;

				error = true;
				break;
				// return false;
			}
		}

		return !error;
	}

	/**
	 *
	 * @param {TripsQuestionState} tripsState
	 */
	private manageActiveSubSections(tripsState: TripsQuestionState) {
		// Passes the ids of togglable sections to the controller

		// console.log("updatong with: " + this.questionId);
		if (!isNullOrUndefined(tripsState.madeTrips)) {
			if (tripsState.madeTrips.value === false) {
				let detail = [this.questionId, ['trips-reason-select-' + this.questionId], ['.trips-default-panel']];

				this._$window.dispatchEvent(new CustomEvent(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS, { detail }));

				// this._$window['smcRootScope'].$emit(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS,);
			} else if (tripsState.madeTrips.value === true) {
				if (tripsState.tripRoutes.length > 0) {
					let detail = [
						this.questionId,
						['trip-diary-timeline-' + this.questionId, 'trip-diary-router-' + this.questionId],
						['.trips-default-panel']
					];
					this._$window.dispatchEvent(new CustomEvent(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS, { detail }));
				} else {
					let detail = [this.questionId, ['trip-diary-timeline-' + this.questionId], ['.trips-default-panel']];

					this._$window.dispatchEvent(new CustomEvent(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS, { detail }));
				}
			}
		}
	}

	/**
	 * Manages the state of the route map
	 * @param tripsState
	 */
	private manageRouteMapState(tripsState: any) {
		let state = tripsState.tripsState as TripsQuestionState;

		if (state.previousAction === SET_TRIP_MODE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		}

		if (state.previousAction === SET_ROUTE_EDIT_COMPLETE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_ROUTE_EDIT_INCOMPLETE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_TRIP_LEG_ACTIVE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_TRIP_LEG_EDIT_COMPLETE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === REMOVE_MODE_SWITCH) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_TRIP_LEG_WAYPOINTS) {
		} else if (state.previousAction === SET_TRIP_LEG_INCOMPLETE) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_MODE_SWITCH_DATA) {
			this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);

			this.setTripLegActive(state.tripRoutes[state.activeRouteIndex].activeTripLegIndex);
		} else if (state.previousAction === SET_TRIP_LEG_DATA) {
			// this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === SET_SWITCH_ROUTE_MODE_STATE) {
			this._routeMap.toggleAddRoutingWaypoints(!state.switchRouteModeActive);
		} else if (state.previousAction === SET_UNKNOWN_ROUTE) {
			// this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
		} else if (state.previousAction === UPDATE_TRIP_ROUTES) {
			if (this._routeMap !== undefined) {
				this._routeMap.addRouting(state.tripRoutes[state.activeRouteIndex]);
			}
		} else if (state.previousAction === REMOVE_TRIP_LOCATION) {
			if (this._routeMap !== undefined) {
				this._routeMap.removeActiveRouter();
			}
		}

		if (
			state.previousAction === SET_TRIP_LEG_DATA ||
			state.previousAction === SET_MODE_SWITCH_DATA ||
			state.previousAction === SET_TRIP_LEG_EDIT_COMPLETE ||
			state.previousAction === SET_ROUTE_EDIT_COMPLETE
		) {
			this._routesService.saveRoutes(state.tripRoutes);
		}

		if (
			state.previousAction === SET_ROUTE_EDIT_INCOMPLETE ||
			state.previousAction === SET_ROUTE_EDIT_COMPLETE ||
			state.previousAction === SET_TRIP_LEG_INCOMPLETE ||
			state.previousAction === SET_TRIP_LEG_EDIT_COMPLETE ||
			state.previousAction === SET_ROUTE_EDIT_COMPLETE
		) {
			this.updateValidationV2();
		}
	}

	/**
	 *
	 * @param tripsState
	 */
	private manageLocationMapState(tripsState: any) {
		let state = tripsState.tripsState as TripsQuestionState;
		if (state.previousAction === REMOVE_TRIP_LOCATION) {
			window.dispatchEvent(new Event('visibilityScrollCheck'));
			let markerList = [];

			if (this.state.startLocation) {
				markerList.push(this.state.startLocation);
			}
			markerList = markerList.concat(this.state.tripLocations);

			if (this.state.endLocation) {
				markerList.push(this.state.endLocation);
			}

			this._map.cleanMarkers(markerList);
		}

		if (state.previousAction === ADD_TRIP_LOCATION_VIEW) {
			// this._tripDiaryService.timelineHiddenByOption();
			if (state.activeTripLocation.lockedLocation) {
			}
		}
		if (state.previousAction === CANCEL_ADD_TRIP_LOCATION) {
			// this._tripDiaryService.timelineShownByOption();
		}
		if (state.previousAction === ADD_TRIP_LOCATION_DATA) {
			// this._tripDiaryService.timelineShownByOption();
		}

		if (state.previousAction === OPTION_TRIPS_TAKEN) {
			this._$timeout(() => {
				// console.log('timeline');
				// this._tripDiaryService.timelineShown();
				// $('body').scrollTop(1);
				// this._$window.scrollBy(0, 1);
			}, 200);
		}

		this.configService.clearNonStaticLocations();

		if (!isNullOrUndefined(state.startLocation)) {
			this.configService.addLocation(
				state.startLocation.locationName,
				state.startLocation.latLng,
				state.startLocation.locationInput,
				state.startLocation.locationPurpose,
				state.startLocation.id
			);
		}

		for (let location of state.tripLocations) {
			this.configService.addLocation(
				location.locationName,
				location.latLng,
				location.locationInput,
				location.locationPurpose,
				location.id
			);
		}

		if (!isNullOrUndefined(state.endLocation)) {
			this.configService.addLocation(
				state.endLocation.locationName,
				state.endLocation.latLng,
				state.endLocation.locationInput,
				state.endLocation.locationPurpose,
				state.endLocation.id
			);
		}

		this.configService.combineLocations();
	}

	/**
	 *
	 * @param {TripDiaryController} tc
	 * @param {google.maps.places.PlaceResult} placeResult
	 */
	private updateActiveLocationPlaceResult(tc: TripDiaryController, placeResult: PlaceResult) {
		/* Update the "active" TripLocation in question state*/

		// console.log(L);

		if (!tc.state.activeTripLocation._lockedLocation) {
			// console.log(placeResult);

			tc.state.activeTripLocation.locationInput = placeResult.formatted_address;

			tc.state.activeTripLocation.latLng = new L.LatLng(placeResult.geometry.location.lat(), placeResult.geometry.location.lng());

			tc.$scope.$digest();
		}
	}

	private inputChanged() {
		this._locationSearchBoxInput.placeholder = '';
	}

	/**
	 * Initializes the location search box
	 */
	private initLocationSearchBox() {
		/* this._locationSearchBoxInput = $('#trip-diary-' + this.questionId)
			.find('.location-input-map')[0] as HTMLInputElement;


		//console.log(this._locationSearchBoxInput);
		var searchOptions = {
			bounds: this.torontoBounds
		};

		let searchBox = new SearchBox(this._locationSearchBoxInput, searchOptions);


		let updateActiveLocation = this.updateActiveLocationPlaceResult;
		let tcRef: TripDiaryController = this;


		searchBox.addListener('places_changed', () => {
			let places: PlaceResult[] = searchBox.getPlaces();

			updateActiveLocation(tcRef, places[0]);


		}); */
	}

	/**
	 *
	 */
	private timeInputChanged() {
		// console.log("time input changed");
	}
}

function resetTripQuestion() {}
