let MARKER_URL = './';

import 'leaflet-extra-markers';
import { SurveyMapSvgIcon } from './survey-map-svg-icon';

// console.log(cat);

import * as L from 'leaflet';

export enum MarkerType {
	Default = 0,
	Home = 1,
	Work = 2,
	School = 3,
	Shopping = 4,
	Switch = 5,
	Daycare = 6,
	Passenger = 7,
	Other = 8
}

/*
var defaultIcon = new L.Icon({
    iconUrl: MARKER_URL.DEFAULT,
    shadowUrl: MARKER_URL.SHADOW,
    iconAnchor: [16, 42],
    iconSize: [32, 42]
});

var defaultIcon = L['ExtraMarkers'].icon({
    icon: 'fa-coffee',
    markerColor: 'red',
    shape: 'square',
    innerHTML: svgMarker,
    prefix: 'fa'
  }); */

let defaultIcon = SurveyMapSvgIcon.createIcon('', '#9eb3ce');
let homeIcon = SurveyMapSvgIcon.createIcon('fas fa-home', '#82b8e2');
let schoolIcon = SurveyMapSvgIcon.createIcon('fas fa-school', '#669d4d');
let shoppingIcon = SurveyMapSvgIcon.createIcon('shopping_cart', '#7847b8');
let workIcon = SurveyMapSvgIcon.createIcon('fas fa-building', '#b29e85');
let switchIcon = SurveyMapSvgIcon.createIcon('swap_horiz', '#ff9d02');
let otherIcon = SurveyMapSvgIcon.createIcon('home', '#607D8B');
let switchIconSummary = SurveyMapSvgIcon.createIcon('swap_horiz', '#ff9d02', 'summary-switch-marker');

let passengerIcon = SurveyMapSvgIcon.createIcon('fas fa-car', '#276464');
let daycareIcon = SurveyMapSvgIcon.createIcon('fas fa-child', '#D768A5');

let transitMarker = {};

transitMarker['transit'] = new L.Icon({
	// iconUrl: MARKER_URL.TRANSIT,
	// shadowUrl: MARKER_URL.SHADOW,
	iconAnchor: [16, 42]
});

transitMarker['walking'] = new L.Icon({
	// iconUrl: MARKER_URL.WALKING,
	// shadowUrl: MARKER_URL.SHADOW,
	iconAnchor: [16, 42]
});

transitMarker['bicycling'] = new L.Icon({
	// iconUrl: MARKER_URL.BICYCLING,
	// shadowUrl: MARKER_URL.SHADOW,
	iconAnchor: [16, 42]
});

transitMarker['driving'] = new L.Icon({
	// iconUrl: MARKER_URL.DRIVING,
	// shadowUrl: MARKER_URL.SHADOW,
	iconAnchor: [16, 42]
});

transitMarker['default'] = new L.Icon({
	// iconUrl: MARKER_URL.DEFAULT,
	// shadowUrl: MARKER_URL.SHADOW,
	iconAnchor: [16, 42]
});

export default {
	MarkerType,
	homeIcon,
	defaultIcon,
	workIcon,
	schoolIcon,
	shoppingIcon,
	switchIcon,
	transitMarker,
	passengerIcon,
	daycareIcon,
	otherIcon,
	switchIconSummary
};
