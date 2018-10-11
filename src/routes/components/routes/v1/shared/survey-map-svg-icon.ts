import "jquery"

import * as Color from "color"

import * as L from "leaflet";
import {isNullOrUndefined} from "util";

declare var MARKER_URL: any;


let _svgMarkerXml = `
<div class="svg-marker"><i class="material-icons svg-marker-icon">home</i>
<mark style="display:none">20</mark> 
<svg
    id="Layer_1"
   x="0px"
   y="0px"
   width="34"
   height="44"
   viewBox="0 0 34 44"
   version="1.1"><path class="marker-path"
     style="stroke-width:0.10546875"
     id="path2"
     d="M 17,1 C 8.3021446,1 1.25,8.052142 1.25,16.75 1.25,25.447858 14.375,43 17,43 19.625,43 32.75,25.447858 32.75,16.75 32.75,8.052142 25.697855,1 17,1 Z"  />
     </svg>
     <img src="/static/dist/images/map-markers/marker-shadow.png" style=" position: relative;
    top: 3px;
    left: 6px;"/> 
     </div>`;

export class SurveyMapSvgIcon {


    /**
     *
     * @param {String} icon
     * @param {string} colorString
     * @param {string} customClass
     * @returns {any}
     */
    static createIcon(icon: String, colorString: string, customClass: string = null) {
        let svgElement = $(_svgMarkerXml);


        if (!isNullOrUndefined(customClass)) {
            svgElement.addClass(customClass);
        }


        let path = svgElement.find('.marker-path');


        path.css({'fill': Color(colorString).lighten(0.0).hex(), 'stroke': Color(colorString).darken(0.2).hex()});

        let iconElement = svgElement.find('.svg-marker-icon')[0].innerText = String(icon);

        let iconMarker = L['ExtraMarkers'].icon({
            icon: 'fa-coffee',
            markerColor: 'red',
            shape: 'square',
            innerHTML: svgElement[0].outerHTML,
            prefix: 'fa',
            shadowUrl: MARKER_URL.SHADOW,
            iconAnchor: [17, 44],
            iconSize: [34, 44],

        });

        iconMarker.options.iconSize = [34, 44];


        iconMarker.createShadow();

        return iconMarker;
    }
}