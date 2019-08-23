var polyline = require('@mapbox/polyline');
var directionsService = new google.maps.DirectionsService();

L.Routing = L.Routing || {};
L.Routing.Google = L.Class.extend({
    options: {
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: true
    },
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },
    _flatten: function(arrs) {
        var arr = [],
            i;
        for (i = 0; i < arrs.length; i++) arr = arr.concat(arrs[i]);
        return arr;
    },
    _decodePolyline: function(geometry) {
			var coords = polyline.decode(geometry, 5),
				latlngs = new Array(coords.length),
				i;
			for (i = 0; i < coords.length; i++) {
				latlngs[i] = new L.LatLng(coords[i][0], coords[i][1]);
			}

			return latlngs;
		},
    route: function(waypoints, callback, context, options) {
        var that = this;
        var directions = this.options;
        directions.origin = waypoints[0].latLng.lat + ',' + waypoints[0].latLng.lng;
        directions.destination = waypoints[waypoints.length - 1].latLng.lat + ',' + waypoints[waypoints.length - 1].latLng.lng;
        if (waypoints.length > 2) {
            directions.waypoints =
                waypoints.slice(1, waypoints.length - 1).map(function(waypoint) {
                    return {
                      location: waypoint.latLng.lat + ',' + waypoint.latLng.lng,
                      stopover: false
                    };
                });
        }
        
        directionsService.route(directions, function(result, status) {
            var globalCounter = 0;
            var summaryArray = [];
          if (status == google.maps.DirectionsStatus.OK) {
            callback.call(context || callback, null, result.routes.map(function(route) {
                var iroute = {}, i, j, step;

                // If there is no provided summary (transit), create a summary with bus/subway icons
                if (route.summary === "") {
                    var transitDiv = '';
                    var currentMode = '';
                    var summaryString = '';
                    for (var legKey in route.legs) {
                        if (route.legs.hasOwnProperty(legKey)) {
                            for (var stepKey in route.legs[legKey].steps) {
                                if (route.legs[legKey].steps.hasOwnProperty(stepKey)) {
                                    if (currentMode != 'WALKING') {
                                        if (route.legs[legKey].steps[stepKey].travel_mode == 'WALKING') {
                                            if (transitDiv === '' || route.legs[legKey].steps[stepKey].duration.value > 300 || route.legs[legKey].steps.length - 1 == stepKey) {
                                                if (transitDiv !== '') {
                                                    transitDiv += '<i class="fas fa-angle-right"></i>';
                                                }
                                                transitDiv += '<i class="fas fa-walking"></i>';
                                                currentMode = 'WALKING';
                                                summaryString += '/walk';
                                            }
                                        }
                                    }
                                    if (route.legs[legKey].steps[stepKey].hasOwnProperty('transit')) {
                                        if (route.legs[legKey].steps[stepKey].transit.line.short_name != 'undefined') {
                                            currentMode = route.legs[legKey].steps[stepKey].travel_mode;
                                            if (transitDiv !== '') {
                                                transitDiv += '<i class="fas fa-angle-right"></i>';
                                            }

                                            if (route.legs[legKey].steps[stepKey].transit.line.hasOwnProperty('short_name')) {
                                                short_name = route.legs[legKey].steps[stepKey].transit.line.short_name;
                                            } else {
                                                short_name = route.legs[legKey].steps[stepKey].transit.line.name;
                                            }

                                            transitDiv += '<img class="bus-icon" src="' + 
                                            route.legs[legKey].steps[stepKey].transit.line.vehicle.icon + '">' +
                                            '<div class="transit-number" style="background-color: ' + 
                                            route.legs[legKey].steps[stepKey].transit.line.color +
                                            '; color: ' + route.legs[legKey].steps[stepKey].transit.line.text_color +
                                            ';">' + short_name +
                                            '</div>';
                                            summaryString += '/' + short_name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    iroute.name = transitDiv;

                    // Check if this route is already added
                    if (summaryArray.indexOf(summaryString) > -1) {
                        // Mark this route as a duplicate
                       transitDiv+="<duplicate></duplicate>";
                        iroute.name = 'duplicate';
                    } else {
                        summaryArray.push(summaryString);
                    }
                } else {
                    iroute.name = route.summary;
                }
                iroute.summary = {
                    totalDistance: that._flatten(route.legs.map(function(leg) {
                        return leg.steps.map(function(step) {
                            return step.distance.value;
                        });
                    })).reduce(function(previousValue, currentValue) {
                        return previousValue + currentValue;
                    }),
                    totalTime: that._flatten(route.legs.map(function(leg) {
                        return leg.steps.map(function(step) {
                            return step.duration.value;
                        });
                    })).reduce(function(previousValue, currentValue) {
                        return previousValue + currentValue;
                    })
                };

                iroute.coordinates = [];
                var indices = [], indicesSecondary = [];

                for(i = 0; i < route.legs.length; i++){
                  indicesSecondary = [];
                  for(j = 0; j < route.legs[i].steps.length; j++){
                    indicesSecondary.push(iroute.coordinates.length);
                    step = route.legs[i].steps[j];
                    iroute.coordinates = iroute.coordinates.concat(that._decodePolyline(step.polyline.points));
                  }
                  indices.push(indicesSecondary);
                }
                iroute.inputWaypoints = waypoints || [];
                iroute.waypoints = iroute.actualWaypoints = waypoints;
                //iroute.waypointIndices = [0, iroute.coordinates.length - 1];
                for(i = 0; i < iroute.actualWaypoints; i++) iroute.waypointIndices.push(i);

                iroute.instructions = [];
                for(i = 0; i < route.legs.length; i++)
                  for(j = 0; j < route.legs[i].steps.length; j++){
                    step = route.legs[i].steps[j];
                    iroute.instructions.push({
            					type: 'Straight',
            					text: step.instructions.replace(/<(?:.|\n)*?>/gm, ''),
            					distance: step.distance.value,
            					time:  step.duration.value,
            					index: indices[i][j],
            					exit: null//instr.exit_number,
            				});
                  }
                return iroute;
            }));
          }
          else {
                callback.call(context, {
                  status: status,
                  message: result
                });
            }
        });
        return this;
    }
});

L.Routing.google = function(options) {
    return new L.Routing.Google(options);
};
