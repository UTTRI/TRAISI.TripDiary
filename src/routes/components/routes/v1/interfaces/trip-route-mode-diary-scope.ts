import {TripDiaryRouteModeController} from "../controllers/trip-diary-route-mode-controller";
import {TripDiaryController} from "../controllers/trip-diary-controller";
import {TripDiaryService} from "../trip-diary-service";

/**
 *
 */
export interface ITripDiaryRouteModeScope {
    routeModeController: TripDiaryRouteModeController
    tripDiaryController: TripDiaryController
    element: ng.IAugmentedJQuery
    tripDiaryService: TripDiaryService;
}