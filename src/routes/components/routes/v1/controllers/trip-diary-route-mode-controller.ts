/**
 *
 */

import * as ng from 'angular';
import { RouteDescriptionDialogController } from './route-description-dialog-controller';
import { TripDiaryService } from '../ts/trip-diary-service';
import { IModeConfig } from '../shared/survey-map-config';
import { TripLeg } from '../ts/trip-leg';

import { TripsQuestionState } from '../ts/trips-question-state';
import { PassengerCountDialogController } from './passenger-count-dialog-controller';
import { DynamicDialogController } from './dynamic-dialog-controller';
import {
	SET_MODE_SWITCH_DATA,
	SET_SWITCH_ROUTE_MODE_STATE,
	SET_TRIP_LEG_DATA,
	SET_TRIP_LEG_EDIT_COMPLETE,
	SET_TRIP_MODE,
	TRIP_ROUTE_MODE_VIEW
} from '../ts/trips-actions';
import { isNullOrUndefined } from 'util';
import { TripDiaryController } from './trip-diary-controller';
//import * as _ from 'lodash';
import { last, delay } from 'lodash';
import SurveyManagerController from '../ts/survey-manager-controller';

declare var displaySnackBar: (string, any, number) => any;

import dynamicDialogcTemplate from '../templates/dynamic-dialog.html';
/**
 *
 */

enum MAP_OVERLAY_STATE {
	FULL = 'FULL',
	MID = 'MID',
	COLLAPSED = 'COLLAPSED'
}

export class TripDiaryRouteModeController {
	get questionId(): string {
		return this._questionId;
	}

	set questionId(value: string) {
		this._questionId = value;
	}

	/**
	 *
	 * @param {angular.IScope} $scope
	 * @param {"angular".material.IDialogService} $mdDialog
	 * @param {TripDiaryService} _tripDiaryService
	 * @param {INgRedux} _$ngRedux
	 * @param {angular.IAugmentedJQuery} _element
	 * @param {angular.ITimeoutService} _$timeout
	 * @param {string} _questionId
	 */
	constructor(
		private $scope: ng.IScope,
		private $mdDialog: ng.material.IDialogService,
		private _tripDiaryService: TripDiaryService,
		private _$ngRedux: any,
		private _element: ng.IAugmentedJQuery,
		private _$timeout: ng.ITimeoutService,
		private _questionId: string
	) {
		_$ngRedux.subscribe(() => {
			this.stateSubscription(_$ngRedux.getState().tripsState);
		});

		$scope['routeToggle'] = false;
		$scope['toggleRouteMap'] = this.toggleRouteMap;
		this.$scope['showMultipleTourTripText'] = true;
		this.$scope['expandPanelText'] = true;
		this.$scope['showMultipleTourTripTextPerm'] = false;

		window.addEventListener('onShowRouteTour', this.onShowTour);
		console.log('in trip route mode ');
	}

	/**
	 *
	 * @param {number} tripRouteIndex
	 * @param {number} tripLegIndex
	 */
	public setTripLegEditComplete(tripRouteIndex: number, tripLegIndex: number) {
		this.toggleRouteMap(true);
		this._tripDiaryService.tripLegHidden();
		this._tripDiaryService.setTripLegEditComplete(tripRouteIndex, tripLegIndex);
	}

	/**
	 *
	 * @param {TripsQuestionState} state
	 */
	private stateSubscription = (state: TripsQuestionState) => {
		if (isNullOrUndefined(state.madeTrips) || state.madeTrips.value === false) {
			this._tripDiaryService.routesHidden();
		}

		// console.log("in state subscription");

		if (state.previousAction === SET_TRIP_LEG_DATA && state.switchRouteModeActive === false) {
			if (this.$scope['mapOverlayState'] === MAP_OVERLAY_STATE.COLLAPSED) {
				this.toggleMapState(MAP_OVERLAY_STATE.FULL);
			}

			this.refreshMap();
		}

		if (state.activeRouteIndex === 0) {
			if (
				!isNullOrUndefined(this._tripDiaryService.getActiveTripRoute()) &&
				this._tripDiaryService.getActiveTripRoute().activeTripLegIndex === 0 &&
				(isNullOrUndefined(this._tripDiaryService.getActiveTripLeg().mode) ||
					isNullOrUndefined(this._tripDiaryService.getActiveTripLeg().mode.modeName))
			) {
				this.$scope['showSelectModeTourTripText'] = true;
				this.$scope['tourPassedInitial'] = true;
				this.$scope['expandPanelText'] = true;
				if ('_tdc' in this.$scope) {
					(<any>this.$scope['_tdc']['$scope']['routeMobileTourActive']) = true;
				}
			} else if (state.previousAction === SET_TRIP_MODE && this.$scope['tourPassedInitial']) {
				this.$scope['showSelectModeTourTripText'] = false;
				if ('_tdc' in this.$scope) {
					(<any>this.$scope['_tdc']['$scope']['routeMobileTourActive']) = true;
				}
				this.$scope['showSelectRouteTourTripText'] = true;
			} else if (state.previousAction === SET_TRIP_LEG_EDIT_COMPLETE) {
				this.$scope['showSelectModeTourTripText'] = false;
				this.$scope['showSelectRouteTourTripText'] = false;
				this.$scope['showMultipleTourTripText'] = false;
				if ('_tdc' in this.$scope) {
					(<any>this.$scope['_tdc']['$scope']['routeMobileTourActive']) = true;
				}
			} else if (state.previousAction === SET_TRIP_LEG_DATA) {
				if (!isNullOrUndefined(this.$scope['selectOnce'])) {
					// this.$scope['showMultipleTourTripText'] = true;
					this.$scope['showSelectModeTourTripText'] = false;
					this.$scope['showSelectRouteTourTripText'] = false;
					if ('_tdc' in this.$scope) {
						(<any>this.$scope['_tdc']['$scope']['routeMobileTourActive']) = true;
					}
				} else {
					this.$scope['selectOnce'] = true;
				}
			}
		}

		if (state.previousAction === SET_TRIP_LEG_EDIT_COMPLETE) {
			this.$scope['foundRoutes'] = [];

			this._$timeout(() => {
				if (this._tripDiaryService.getActiveTripLeg()._isComplete) {
					if (
						this._tripDiaryService.getActiveTripRoute().tripLegs.length - 1 >
						this._tripDiaryService.getActiveTripRoute().activeTripLegIndex
					) {
						// if (!this.shouldCollectRouteByModeName(this._tripDiaryService.getActiveTripLeg().mode.modeName)) {

						if (
							isNullOrUndefined(
								this._tripDiaryService.getActiveTripRoute().tripLegs[
									this._tripDiaryService.getActiveTripRoute().activeTripLegIndex + 1
								]._mode
							)
						) {
							this._tripDiaryService.setTripLegIncomplete(this._tripDiaryService.getActiveTripRoute().activeTripLegIndex + 1);
						}
						//  }
					}
				}
			});
		}

		// remove any found routes if the mode does not support it
		if (!isNullOrUndefined(this._tripDiaryService.getActiveTripLeg())) {
			if (!isNullOrUndefined(this._tripDiaryService.getActiveTripLeg()._mode)) {
				if (!this.shouldCollectRouteByModeName(this._tripDiaryService.getActiveTripLeg()._mode.modeName)) {
					this.$scope['foundRoutes'] = [];
				}
			}
		}
	};

	/**
	 *
	 * @param value
	 */
	public toggleRouteMap = (value: boolean) => {
		this.$scope['expandPanelText'] = false;

		if (!this._tripDiaryService.state.switchRouteModeActive) {
			if (value) {
				// console.log("it was active");

				if (!isNullOrUndefined(this._tripDiaryService.getActiveTripLeg())) {
					!isNullOrUndefined(this._tripDiaryService.getActiveTripLeg().mode);
					{
						// this._tripDiaryService.setTripLegEditComplete(this._tripDiaryService.state.activeRouteIndex,
						//      this._tripDiaryService.getActiveTripRoute().activeTripLegIndex);

						this.toggleMapState(MAP_OVERLAY_STATE.FULL);
						this.refreshMap();
					}
				} else {
				}
				// this._tripDiaryService.setTripLegActive(-1);
				// this._tripDiaryService.getActiveTripLeg()
			}

			this.$scope['mapOverlayState'] = '';
			this.$scope['routeToggle'] = !value;

			this.refreshMap();
		}
	};

	/**
	 *
	 */
	private cancelSwitchModeState() {
		this._tripDiaryService.setSwitchRouteModeState(false);
		this.toggleMapState(MAP_OVERLAY_STATE.MID);
		this.refreshMap();
	}

	/**
	 *
	 * @param {MAP_OVERLAY_STATE} state
	 */
	private toggleMapState(state: MAP_OVERLAY_STATE) {
		this.$scope['mapOverlayState'] = state;
	}

	/**
	 *
	 */
	private onShowTour = () => {
		if (!isNullOrUndefined(this._tripDiaryService.getActiveTripLeg())) {
			if (!this._tripDiaryService.getActiveTripLeg()._isComplete) {
				if (isNullOrUndefined(this._tripDiaryService.getActiveTripLeg().mode)) {
					this.$scope['showSelectModeTourTripText'] = true;
				} else {
					this.$scope['showMultipleTourTripText'] = true;
					this.$scope['showSelectRouteTourTripText'] = true;
					this.$scope['showMultipleTourTripTextPerm'] = false;
				}
			}
		}
	};

	/**
	 *
	 * @param index
	 */
	public setTripLegIncomplete(index) {
		this.toggleRouteMap(false);

		this._tripDiaryService.setTripLegIncomplete(index);
	}

	/**
	 *
	 * @param index
	 */
	public setRouteEditActive(index) {
		if (window.matchMedia('(min-width: 480px)').matches) {
			delay(() => {
				let header = this._element.find('.trip-route-mode-header')[0];
				header.scrollTo((index - 1) * 280, 0);
			}, 500);
		}
		this._tripDiaryService.setRouteEditActive(index);
	}

	/**
	 *
	 * @param modeName
	 * @param modeCategory
	 * @param allowWaypoints
	 */
	public setTripMode(modeName: string, modeCategory: string, allowWaypoints: boolean) {
		this._tripDiaryService.setTripMode(modeName, modeCategory, allowWaypoints);
	}

	/**
	 *
	 * @param evt
	 * @param mode
	 * @param dataInputs
	 * @param dialogTitle
	 * @param data
	 * @param callback
	 */
	public showDialog(evt, mode, dataInputs, dialogTitle, data, callback) {
		this.$mdDialog
			.show({
				controller: 'DynamicDialogController',
				locals: {
					mode: mode,
					dataInputs: dataInputs,
					dialogTitle: dialogTitle,
					data: data
				},

				template: dynamicDialogcTemplate,
				parent: ng.element(document.body),
				targetEvent: evt,
				clickOutsideToClose: false,
				escapeToClose: false
			})

			.then(
				result => {
					// console.log("callin back");
					callback(result);
				},
				() => {
					// console.log("cancelled?");
				}
			);
	}

	/**
	 *
	 * @param {boolean} value
	 */
	private setSwitchRouteModeStateClick = v => {
		if (v) {
			$('path.leaflet-interactive').css('pointer-events', 'none');
		} else {
			$('path.leaflet-interactive').css('pointer-events', 'auto');
		}

		this.$scope['showMultipleTourTripText'] = false;
		this.$scope['expandPanelText'] = false;
		this.$scope['showMultipleTourTripTextPerm'] = false;
		this.$scope['showSelectModeTourTripText'] = false;
		this.$scope['showSelectRouteTourTripText'] = false;

		this._tripDiaryService.setSwitchRouteModeState(v);

		if (this.$scope.$root.$$phase !== '$apply' && this.$scope.$root.$$phase !== '$digest') {
			this.$scope.$apply();
		}

		// this.toggleRouteMap(true);
		this.toggleMapState(MAP_OVERLAY_STATE.COLLAPSED);
		this.$scope['routeToggle'] = false;
		this.refreshMap();
	};

	private startScrollEnter() {
		// console.log("enter");
		this._tripDiaryService.setElementScrollVisibility(TRIP_ROUTE_MODE_VIEW, true);
	}

	private startScrollLeave() {
		// console.log("leave");

		this._tripDiaryService.setElementScrollVisibility(TRIP_ROUTE_MODE_VIEW, false);
	}

	/**
	 *
	 * Shows the dialog asking the user to enter the route description (for transit) if not known.
	 *
	 * @param {TripLeg} tripLeg
	 * @param $event
	 * @param mode
	 */
	public showRouteDescriptionDialog(tripLeg: TripLeg, $event, mode, autoConfirm = true) {
		let modeConfig: IModeConfig = this._tripDiaryService.getModeConfig(mode);

		let dialogShown: boolean = false;
		if (!isNullOrUndefined(modeConfig)) {
			if (!isNullOrUndefined(modeConfig.customRoute.dataInputs)) {
				if (modeConfig.customRoute.dataInputs.length > 0) {
					dialogShown = true;
					this.showDialog(
						$event,
						modeConfig,
						modeConfig.customRoute.dataInputs,
						modeConfig.customRoute.dialogTitle,
						tripLeg.data,
						result => {
							this._tripDiaryService.addTripLegExtraData(
								this._tripDiaryService.state.activeRouteIndex,
								this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex,
								result
							);
							this._tripDiaryService.setUnknownRoute('', false);

							if (autoConfirm) {
								this._tripDiaryService.setUnknownRoute('', true);
								this._tripDiaryService.setTripLegEditComplete(
									this._tripDiaryService.state.activeRouteIndex,
									this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex
								);
							}
						}
					);
				}
			}

			if (!dialogShown) {
				this._tripDiaryService.addTripLegExtraData(
					this._tripDiaryService.state.activeRouteIndex,
					this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex,
					{ routeInfo: modeConfig.customRoute.routeKey }
				);
				this._tripDiaryService.setUnknownRoute('', false);

				if (autoConfirm) {
					this._tripDiaryService.setUnknownRoute('', true);
					this._tripDiaryService.setTripLegEditComplete(
						this._tripDiaryService.state.activeRouteIndex,
						this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex
					);
				}
			}
		}
	}

	/**
	 * Should show alternative summary
	 * @param tripLeg
	 * @returns true if show alternative summary
	 */
	public shouldShowAlternativeSummary(tripLeg: TripLeg): boolean {
		if (isNullOrUndefined(tripLeg.mode)) {
			return false;
		}
		let mode = this._tripDiaryService.getModeConfig(tripLeg.mode.modeName);

		if (!isNullOrUndefined(mode.customRoute)) {
			if (!isNullOrUndefined(mode.customRoute.fieldAsSummary)) {
				if (!isNullOrUndefined(tripLeg.data[mode.customRoute.fieldAsSummary])) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 *
	 * @param {TripLeg} tripLeg
	 */
	public routeName(tripLeg: TripLeg, forceAlternative = false): string {
		let summary = this._tripDiaryService.getRouteSummaryString(tripLeg, forceAlternative);

		return summary;
	}

	/**
	 *
	 */
	public $onInit() {
		// this._tripDiaryService.tripLegShown();
		let smc: SurveyManagerController = window['smc'];

		// mc.addOnNext(this.onNext);
		// smc.addOnPrevious(this.onPrevious);
		this.$scope['tourPassedInitial'] = false;
		this.$scope['showMultipleTourTripText'] = false;
		this.$scope['showSelectModeTourTripText'] = false;
		this.$scope['showSelectRouteTourTripText'] = false;
		this.$scope['expandPanelText'] = true;
		this.$scope['showMultipleTourTripTextPerm'] = false;
	}

	/**
	 * Hook into the SMC's onNext callback;
	 * @returns {boolean}
	 */
	private onNext: (activePage) => boolean = activePage => {
		if (!isNullOrUndefined(activePage.parentQuestion)) {
			if (activePage.parentQuestion.id !== this.questionId) {
				return true;
			}
		} else {
			if (activePage['id'] !== this.questionId) {
				return true;
			}
		}

		if (isNullOrUndefined(activePage[0].dataset)) {
			return true;
		}

		if (activePage[0].dataset.segmentName === 'TIMELINE') {
			// set active route to 0
			if (this._tripDiaryService.state.activeRouteIndex !== 0) {
				this.setRouteEditActive(0);
			}

			this._$timeout(() => {
				this.refreshMap();
			});
		}

		if (activePage[0].dataset.segmentName === 'ROUTE_MAP') {
			let currentIndex = this._tripDiaryService.state.activeRouteIndex;
			let currentTripLeg = this._tripDiaryService.getActiveTripRoute().activeTripLegIndex;
			let activeRoute = this._tripDiaryService.state.tripRoutes[this._tripDiaryService.state.activeRouteIndex];
			let modesFilled: boolean = true;

			for (let tripLeg of activeRoute.tripLegs) {
				if (isNullOrUndefined(tripLeg._mode)) {
					modesFilled = false;
					break;
				}
			}

			if (modesFilled) {
				delay(() => {
					this._tripDiaryService.setTripLegEditComplete(currentIndex, currentTripLeg);
				}, 200);
				if (this._tripDiaryService.state.activeRouteIndex < this._tripDiaryService.state.tripRoutes.length - 1) {
					this.setRouteEditActive(this._tripDiaryService.state.activeRouteIndex + 1);
					return false;
				}
			} else {
				displaySnackBar('Please complete information for all legs of your trip!', 'errorMsg', 1500);
				return false;
			}
		}

		// return false
		return true;
	};

	/**
	 *
	 * @param activePage
	 * @returns {boolean}
	 */
	private onPrevious: (activePage) => boolean = activePage => {
		if (!isNullOrUndefined(activePage.parentQuestion)) {
			if (activePage.parentQuestion.id !== this.questionId) {
				return true;
			}
		} else {
			if (activePage['id'] !== this.questionId) {
				return true;
			}
		}

		if (isNullOrUndefined(activePage[0].dataset)) {
			return true;
		}

		if (activePage[0].dataset.segmentName === 'ROUTE_MAP') {
			let index = this._tripDiaryService.state.activeRouteIndex;
			if (this._tripDiaryService.state.activeRouteIndex > 0) {
				this.setRouteEditActive(index - 1);
				return false;
			}
		}

		// return false
		return true;
	};

	/**
	 *
	 */
	private hideRouteMultipleTripTourText() {
		this.$scope['showMultipleTourTripTextPerm'] = true;

		this.$scope['tourPassedInitial'] = false;
		this.$scope['showMultipleTourTripText'] = false;
		this.$scope['showSelectModeTourTripText'] = false;
		this.$scope['showSelectRouteTourTripText'] = false;
		this.$scope['_tdc']['$scope']['routeMobileTourActive'] = false;
	}

	/**
	 *
	 * @param evt
	 * @param {IModeConfig} mode
	 * @param $mdMenu
	 */
	private selectMode(evt, mode: IModeConfig, $mdMenu) {
		let modePanel = this._element.find('.mode-button-panel');

		if (modePanel.length > 0) {
			let event = new CustomEvent('selectmode');
			if (evt != null) {
				let showedDialog: boolean = false;
				if (mode.dataInputs !== undefined) {
					if (mode.dataInputs.length > 0) {
						// _.delay(() => {
						showedDialog = true;

						this.showDialog(
							evt,
							mode,
							mode.dataInputs,
							mode.dialogTitle,
							this._tripDiaryService.getActiveTripLeg().data,
							result => {
								/* ask for passengers */
								modePanel[0].dispatchEvent(event);
								this._tripDiaryService.setTripMode(
									mode['name'],
									mode['category'],
									mode.allowAddWaypoints,
									this.shouldCollectRoute(mode) === true ? false : true
								);
								this._tripDiaryService.addTripLegExtraData(
									this._tripDiaryService.state.activeRouteIndex,
									this._tripDiaryService.getActiveTripRoute()._activeTripLegIndex,
									result
								);
								this.toggleRouteMap(false);

								if (!this.shouldCollectRoute(mode)) {
									this._tripDiaryService.tripLegHidden();
									this._tripDiaryService.setTripLegEditComplete(
										this._tripDiaryService.state.activeRouteIndex,
										this._tripDiaryService.getActiveTripRoute().activeTripLegIndex
									);
								} else {
								}
							}
						);
						// }, 100);
					} else {
						modePanel[0].dispatchEvent(event);
					}
				}

				if (!showedDialog) {
					this._tripDiaryService.setTripMode(
						mode['name'],
						mode['category'],
						mode.allowAddWaypoints,
						this.shouldCollectRoute(mode) === true ? false : true
					);
					this.toggleRouteMap(false);

					// determine if should auto save
					if (!this.shouldCollectRoute(mode)) {
						this._tripDiaryService.tripLegHidden();
						this._tripDiaryService.setTripLegEditComplete(
							this._tripDiaryService.state.activeRouteIndex,
							this._tripDiaryService.getActiveTripRoute().activeTripLegIndex
						);
					}

					this._$timeout(() => {
						modePanel[0].dispatchEvent(event);
					});
				}
			}
		}
	}

	/**
	 *
	 */
	private refreshMap() {
		let mapElementHeight = this._element.find('survey-map-router')[0].offsetHeight;
		delay(() => {
			this.$scope['_tdc']['_routeMap'].invalidateSize();

			// if (this.$scope['routeToggle']) {
			if (window.matchMedia('(max-width: 480px)').matches) {
				let mapState = this.$scope;
				if (this.$scope['mapOverlayState'] !== MAP_OVERLAY_STATE.FULL) {
					this.$scope['_tdc']['_routeMap'].fitTripRouteBounds(this._tripDiaryService.getActiveTripRoute(), {
						paddingTopLeft: [15, 15],
						paddingBottomRight: [15, mapElementHeight / 3]
					});
				} else {
					this.$scope['_tdc']['_routeMap'].fitTripRouteBounds(this._tripDiaryService.getActiveTripRoute(), {
						paddingTopLeft: [10, mapElementHeight / 2],
						paddingBottomRight: [0, 0]
					});
				}
			}
			/*}

            else {
                if (window.matchMedia('(max-width: 480px)').matches) {
                    if (this.$scope['mapOverlayState'] != MAP_OVERLAY_STATE.FULL) {
                        this.$scope['_tdc']['_routeMap'].fitTripRouteBounds(this._tripDiaryService.getActiveTripRoute(), {
                            paddingTopLeft: [10, 100],
                            paddingBottomRight: [0, 0]
                        });
                    }
                }

            }*/
		}, 300);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	private shouldShowAddTravelMode(): boolean {
		if (isNullOrUndefined(last(<any>this._tripDiaryService.getActiveTripRoute()))) {
			return false;
		}

		if (isNullOrUndefined(last(this._tripDiaryService.getActiveTripRoute().tripLegs).mode)) {
			return false;
		} else if (!this.shouldCollectRouteByModeName(last(this._tripDiaryService.getActiveTripRoute().tripLegs).mode.modeName)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns whether or not the selected route should auto save or let the user
	 * auto collect route
	 * @param {IModeConfig} tripMode
	 * @returns {boolean}
	 */
	private shouldCollectRoute(tripMode: IModeConfig): boolean {
		if (isNullOrUndefined(tripMode)) {
			return false;
		} else {
			return !tripMode.autoSaveRoute;
		}
	}

	private shouldCollectRouteByModeName(tripModeName: string): boolean {
		return this.shouldCollectRoute(this._tripDiaryService.getModeConfig(tripModeName));
	}
}
