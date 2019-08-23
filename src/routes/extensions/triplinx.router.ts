import 'leaflet-routing-machine';
import { Routing, LatLng } from 'leaflet';

export class TripLinxRouter implements Routing.IRouter {
	private readonly _geoServiceUrl: string = '/api/GeoService';

	public options = {
		travelMode: 'auto',
		unitSystem: 'metric',
		provideRouteAlternatives: true
	};
	public disableWaypointChange: boolean = false;
	public route = (
		waypoints: Routing.Waypoint[],
		callback: (error?: Routing.IError, routes?: Routing.IRoute[]) => void,
		context?: {},
		options?: Routing.RoutingOptions
	): Routing.IRouter => {
		console.log(waypoints);

		/*

        [FromQuery] string origin, [FromQuery] string destination, [FromQuery] string date
        [FromQuery] string mode

        (yyyy-MM-dd_HH-mm
        */

		let routes: any[] = [];
		this._http
			.get(this._geoServiceUrl + '/routeplanner', {
				params: {
					departure: waypoints[0].latLng.lat + '|' + waypoints[0].latLng.lng,
					arrival: waypoints[waypoints.length - 1].latLng.lat + '|' + waypoints[waypoints.length - 1].latLng.lng,
					date: '2019-08-23_06-30',
					mode: 'PT'
				}
			})
			.then(value => {
				let trips = value.data['Data'][0]['response']['trips']['Trip'];

				console.log(trips);
				for (let trip of trips) {
					let route: any = {};
					route.waypoints = [];
					route.coordinates = [];
					route.name = '';
					route.summary = {
						totalDistance: trip['Distance'],
						totalTime: trip['Duration']
					};
					route.instructions = [];

					console.log(trip);
					for (let section of trip['sections']['Section']) {
						let leg = section['Leg'];
						
						if (leg !== null && leg !== undefined) {
							for (let pathLink of leg['pathLinks']['PathLink']) {
								// console.log(pathLink);
								let re = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;

								let coords = pathLink['Geometry'].match(re);

								if (coords !== null && coords.length >= 2) {
									let coord = new LatLng(Number(coords[1]), Number(coords[0]));
									route.coordinates.push(coord);
								}
							}
						} else {
							let re = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
							let coords = section['PTRide']['TripGeometry'].match(re);

							if (coords !== null && coords.length >= 2) {
								for (let i = 0; i < coords.length / 2; i += 2) {
									let coord = new LatLng(Number(coords[i + 1]), Number(coords[i + 0]));
									route.coordinates.push(coord);
								}
							}
						}
						route.instructions.push({
							distance: 0,
							time: 0
						});
						// break;
					}

					//route.coordinates = [
					//	new LatLng(waypoints[0].latLng.lat, waypoints[0].latLng.lng),
					//	new LatLng(waypoints[waypoints.length - 1].latLng.lat, waypoints[waypoints.length - 1].latLng.lng)
					//];
					route.waypoints = [
						Routing.waypoint(new LatLng(waypoints[0].latLng.lat, waypoints[0].latLng.lng), 'Name'),
						Routing.waypoint(
							new LatLng(waypoints[waypoints.length - 1].latLng.lat, waypoints[waypoints.length - 1].latLng.lng),
							'Name2'
						)
					];
					route['inputWaypoints'] = route.waypoints || [];
					routes.push(route);
					console.log(route);
				}
				console.log(routes);
				callback.call(context, null, routes);
			});

		return this;
	};

	public constructor(private _http: ng.IHttpService) {}
}
