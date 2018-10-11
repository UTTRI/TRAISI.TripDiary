import {TripTimeline} from "./trip-timeline";
import {ITripsScope} from "./trips-scope";
import {TripLocation} from "./trip-location";


export interface ITimelineScope extends ng.IScope {

    $parent: ITripsScope;
    state: TripLocation;
    _tripTimeline: TripTimeline;
}