import 'leaflet-routing-machine';
import { Routing, LatLng } from 'leaflet';

/**
 * TripLinx router for Leaflet and Leaflet routing machine. This will utilize the journey / route planner
 * available on the TripLinx API and configure it for display in leaflet.
 *
 * @export
 * @class TripLinxRouter
 * @implements {Routing.IRouter}
 */
export class TripLinxRouter implements Routing.IRouter {
	/**
	 *
	 * @param _http
	 * @param _mode
	 */
	public constructor(private _http: ng.IHttpService, private _mode: string, private _triplinxModes: string) {
		console.log('constructor: ' + this._mode + ' ' + this._triplinxModes);
	}
	private readonly _geoServiceUrl: string = '/api/GeoService';

	public options = {
		travelMode: 'auto',
		unitSystem: 'metric',
		provideRouteAlternatives: true
	};
	public disableWaypointChange: boolean = false;

	private modeTemplatePre = '<span class="instruction-info"><i class="';
	private modeTemplateMid = '"></i><div class="instruction-route-name">';
	private modeTemplateSuf = '</div></span>';
	private;
	public route = (
		waypoints: Routing.Waypoint[],
		callback: (error?: Routing.IError, routes?: Routing.IRoute[]) => void,
		context?: {},
		options?: Routing.RoutingOptions
	): Routing.IRouter => {
		/*

        [FromQuery] string origin, [FromQuery] string destination, [FromQuery] string date
        [FromQuery] string mode

        (yyyy-MM-dd_HH-mm
        */

		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
		let yyyy = today.getFullYear();

		let routes: any[] = [];
		this._http
			.get(this._geoServiceUrl + '/routeplanner', {
				params: {
					departure: waypoints[0].latLng.lat + '|' + waypoints[0].latLng.lng,
					arrival: waypoints[waypoints.length - 1].latLng.lat + '|' + waypoints[waypoints.length - 1].latLng.lng,
					date: `${yyyy}-${mm}-${dd}_${today
						.getHours()
						.toString()
						.padStart(2, '0')}-${today
						.getSeconds()
						.toString()
						.padStart(2, '0')}`,
					mode: this._mode,
					transitModes: this._triplinxModes
				}
			})
			.then(value => {
				let trips = value.data['Data'][0]['response']['trips']['Trip'];

				console.log(trips);
				for (let trip of trips) {
					let route: any = {};
					route.waypoints = [];
					route.coordinates = [];
					route.name = 'Route Information';
					route.summary = {
						totalDistance: trip['Distance'],
						totalTime: trip['Duration']
					};
					route.instructions = [];

					// add icons for each route instruction
					let routeInstructions: Array<string> = [];

					for (let section of trip['sections']['Section']) {
						let leg = section['Leg'];
						if (leg !== null && leg !== undefined) {
							routeInstructions.push(this.getInsturctionForTransitMode(leg['TransportMode'],'WALK'));
							for (let pathLink of leg['pathLinks']['PathLink']) {
								// let ins = `<i class="${}"></i>`;

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
							// console.log(section['PTRide']['TransportMode']);

							// let ins = `<i class="${}"></i>`;
							routeInstructions.push(this.getInsturctionForTransitMode(section['PTRide']['TransportMode'],section['PTRide']['Line']['Number']));
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

					// route.coordinates = [
					// 	new LatLng(waypoints[0].latLng.lat, waypoints[0].latLng.lng),
					// 	new LatLng(waypoints[waypoints.length - 1].latLng.lat, waypoints[waypoints.length - 1].latLng.lng)
					// ];
					route.waypoints = [
						Routing.waypoint(new LatLng(waypoints[0].latLng.lat, waypoints[0].latLng.lng), 'Name'),
						Routing.waypoint(
							new LatLng(waypoints[waypoints.length - 1].latLng.lat, waypoints[waypoints.length - 1].latLng.lng),
							'Name2'
						)
					];
					route['inputWaypoints'] = route.waypoints || [];

					route.name = routeInstructions.join('');
					routes.push(route);
				}

				callback.call(context, null, routes);
			});

		return this;
	};
	private getInsturctionForTransitMode(transitMode: string, lineName: string): string {
		switch (transitMode) {
			case 'WALK':
				return `${this.modeTemplatePre}fas fa-walking${this.modeTemplateMid}${lineName}${this.modeTemplateSuf}`;
			case 'METRO':
				return `${this.modeTemplatePre}fas fa-subway${this.modeTemplateMid}${lineName}${this.modeTemplateSuf}`;
			case 'BUS':
				return `${this.modeTemplatePre}fas fa-bus${this.modeTemplateMid}${lineName}${this.modeTemplateSuf}`;
			case 'TRAMWAY':
				return `${this.modeTemplatePre}fas fa-subway${this.modeTemplateMid}${lineName}${this.modeTemplateSuf}`;
			case 'TRAIN':
				return `${this.modeTemplatePre}fas fa-subway${this.modeTemplateMid}${lineName}${this.modeTemplateSuf}`;

			default:
				return '';
		}
	}
}
