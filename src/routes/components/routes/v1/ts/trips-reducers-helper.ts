import { TripLocation } from './trip-location';
import { TripRoute } from './trip-route';
import * as _ from 'lodash';

/**
 *
 */
export class TripsReducersHelper {
	/**
	 * Sorts trip locations by order of their start / end times.
	 * @param {TripLocation[]} tripLocations
	 */
	static sortTripLocations(tripLocations: TripLocation[]) {
		for (let i = 0; i < tripLocations.length; i++) {
			for (let j = 0; j < tripLocations.length - 1; j++) {
				/* compare start time */

				// comprae time
				let startTimeCompare1 = _.clone(tripLocations[j].startTime);
				let startTimeCompare2 = _.clone(tripLocations[j + 1].startTime);

				/*  if (startTimeCompare1.getHours() < 4) {
                      startTimeCompare1.setDate(startTimeCompare1.getDate() + 1);
                  }

                  if (startTimeCompare2.getHours() < 4) {
                      startTimeCompare2.setDate(startTimeCompare2.getDate() + 1);
                  } */

				if (startTimeCompare1 > startTimeCompare2) {
					let tmp = tripLocations[j];
					tripLocations[j] = tripLocations[j + 1];
					tripLocations[j + 1] = tmp;
				}
			}
		}
	}

	/**
	 *
	 * @param tripLocation
	 */
	static hydrateTripLocation(tripLocation: TripLocation): TripLocation {
		if (tripLocation == null) {
			return null;
		}
		let p2: TripLocation = Object.create(TripLocation.prototype);
		// var p2 = new TripLocation();

		/* convert time from object */
		let endTime = tripLocation._endTime;
		let startTime = tripLocation._startTime;

		Object.assign(p2, tripLocation);
		if (endTime) {
			p2.endTime = new Date(endTime);
		}
		if (startTime) {
			p2.startTime = new Date(startTime);
		}
		p2.init();

		return p2;
	}

	/**
	 *
	 * @param {TripRoute} tripRoute
	 * @returns {TripRoute}
	 */
	static hydrateTripRoute(tripRoute: TripRoute): TripRoute {
		if (tripRoute == null) {
			return null;
		}
		let p2: TripRoute = Object.create(TripRoute.prototype);

		Object.assign(p2, tripRoute);
		p2.endLocation = TripsReducersHelper.hydrateTripLocation(p2.endLocation);
		p2.startLocation = TripsReducersHelper.hydrateTripLocation(p2.startLocation);

		return p2;
	}
}
