import * as icons from './survey-map-marker-type';
import { SurveyMapDirective } from './directives/survey-map-directive';
declare var L;

/**
 *
 */
export class SurveyMapMarker {
	get surveyMap(): SurveyMapDirective {
		return this._surveyMap;
	}

	set surveyMap(value: SurveyMapDirective) {
		this._surveyMap = value;
	}

	get label(): string {
		return this._label;
	}

	set label(value: string) {
		this._label = value;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get mapMarker(): L.Marker {
		return this._mapMarker;
	}

	set mapMarker(value: L.Marker) {
		this._mapMarker = value;
	}

	get markerType(): icons.MarkerType {
		return this._markerType;
	}

	set markerType(value: icons.MarkerType) {
		this._markerType = value;
	}

	get markerUrl(): string {
		return this._markerUrl;
	}

	set markerUrl(value: string) {
		this._markerUrl = value;
	}

	get latLng(): L.LatLng {
		return this._latLng;
	}

	set latLng(value: L.LatLng) {
		this._latLng = value;
	}

	get lat(): number {
		return this._lat;
	}

	set lat(value: number) {
		this._lat = value;
	}

	get lng(): number {
		return this._lng;
	}

	set lng(value: number) {
		this._lng = value;
	}

	public _latLng: L.LatLng = new L.LatLng(0, 0);

	private _lat: number = 0;
	private _lng: number = 0;
	private _id: string;

	private _surveyMap: SurveyMapDirective;

	private _label: string;

	protected _markerUrl: string;

	protected _markerType: icons.MarkerType;

	private _mapMarker: L.Marker;

	constructor() {
		this._latLng = new L.LatLng(0, 0);

		this.id = Math.random()
			.toString(36)
			.substring(7);
	}

	public generateId() {
		this.id = Math.random()
			.toString(36)
			.substring(7);
	}

	/**
	 * Init the service map marker
	 */
	public init() {
		// this.latLng = new L.LatLng(0, 0);
		if (this.id == null) {
			this.id = Math.random()
				.toString(36)
				.substring(7);
		}
		// console.log(new L.LatLng(0, 0));
	}

	/**
	 * Returns a marker icon.
	 * @returns {L.Icon}
	 */
	public getMarkerIcon(): L.Icon {

		switch (this._markerType) {
			case icons.MarkerType.Home:
				return icons.default.homeIcon;
			case icons.MarkerType.Work:
				return icons.default.workIcon;
			case icons.MarkerType.School:
				return icons.default.schoolIcon;
			case icons.MarkerType.Switch:
				return icons.default.switchIcon;
			case icons.MarkerType.Daycare:
				return icons.default.daycareIcon;
			case icons.MarkerType.Shopping:
				return icons.default.shoppingIcon;
			case icons.MarkerType.Passenger:
				return icons.default.passengerIcon;

			default:
				return icons.default.defaultIcon;
		}
	}

	public clear() {
		this.surveyMap.removeMarker(this.id);
	}
}
