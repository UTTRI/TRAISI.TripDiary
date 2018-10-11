// Define the tour!

let template = `<div class='popover tour'> 
    <div class='arrow'></div> 
    <h3 class='popover-title'></h3>
    <div class='popover-content'></div>

    </div>`;

let templateOk = `<div class='popover tour'> 
    <div class='arrow'></div> 
    <h3 class='popover-title'></h3>
    <div class='popover-content'></div>
    <div class='popover-done'>
    <button class='btn btn-default' data-role='end'>Ok</button></div>

    </div>`;

let templateNext = `<div class='popover tour'> 
    <div class='arrow'></div> 
    <h3 class='popover-title'></h3>
    <div class='popover-content'></div>
    <div class='popover-done'>
    <button class='btn btn-default btn-sm' data-role='next'>Next</button></div>

    </div>`;

let stepTemplate = `<div class='popover tour'>
    <div class='arrow'></div>
    <h3 class='popover-title'></h3>
    <div class='popover-content'></div>
    <div class='popover-navigation'>
    <div class="btn-group"> 
        <button class='btn btn-sm btn-default' data-role='prev'>« Prev</button>
        
        <button class='btn btn-sm btn-default' data-role='next'>Next »</button>
    </div>
    <button class='btn btn-sm btn-default' data-role='end'>End</button> 
    </div>  
    </div>`;

var tour = {
    name: "trips-tour-{{id}}",
    orphan: true,
    autoscroll: false,
    backdrop: false,
    steps: [
        {
            title: "TOUR_1_TITLE",
            content: "TOUR_1_CONTENT",
            element: "#add-start-location-{{id}}",
            reflex: true,
            template: template,
            delay: 0,
            backdrop: false,
            autoscroll: false,
            orphan: false,
            placement: 'right',
            smartPlacement: true,


        },

    ],


};


var endLocationTour = {
    name: "end-location-tour-{{id}}",
    orphan: true,
    autoscroll: false,
    backdrop: false,
    steps: [
        {
            title: "END_LOCATION_TOUR_TITLE",
            content: "END_LOCATION_TOUR_CONTENT",
            element: "#add-end-location-{{id}}",
            reflex: true,
            template: template,
            delay: 0,
            backdrop: false,
            autoscroll: false,
            orphan: false,
            smartPlacement: true,
            placement: "auto left"
        },

    ],
};

var intermediateLocationTour = {
    name: "intermediate-location-tour-{{id}}",
    autoscroll: false,
    orphan: false,
    steps: [
        {
            title: "INTERMEDIATE_LOCATION_TOUR_TITLE",
            content: "INTERMEDIATE_LOCATION_TOUR_CONTENT",
            element: "#add-intermediate-location-{{id}}",
            reflex: true,
            template: template,
            placement: "auto right"

        },
    ]
}


var routeMapTour = {
    name: "route-map-tour-{{id}}",

    autoscroll: false,
    smartPlacement: true,
    orphan: false,
    steps: [
        {
            title: "Select the travel mode for this trip",
            content: "Note that the “Transit” mode includes walking to, from, and between transit stops.",
            element: ".mode-button-panel.{{id}}",
            template: template,
            reflex: 'selectmode',
            delay: 0,
            autoscroll: false,
            smartPlacement: false

        },
        {
            title: "Choose a route that most resembles the route you took",
            content: "For non-transit modes, you can click and drag to add waypoints to customize your route on the map.",
            element: "#route-options-container-0-{{id}}",
            reflex: true,
            delay: 50,
            backdrop: true,
            template: templateNext
        },
        {
            title: "Switched modes?",
            content: " If you took several modes for this trip, click here to enter in a second travel mode.",
            element: "#switch-mode-{{id}}",
            reflex: 'mousedown',
            backdrop: true,
            template: templateNext
        },
        {
            title: "Save your route",
            content: " Once you've selected your route, click here to save your response.",
            element: "#confirm-route-{{id}}",
            reflex: 'mousedown',
            backdrop: true,
            template: templateOk
        },
        {
            title: "Next Trip",
            content: "Click on these tabs above to enter route information for your other trips.",
            element: "#route-select-1-{{id}}",
            reflex: true,
            placement: "bottom",
            delay: 50,
            backdrop: true,
            template: template,
        }
    ],


}


var toggledRouteMapTour = {
    name: "toggled-route-map-tour-{{id}}",

    autoscroll: false,
    smartPlacement: true,
    orphan: false,
    steps: [
        {
            title: "Select the travel mode for this trip",
            content: "Note that the “Transit” mode includes walking to, from, and between transit stops.",
            element: ".mode-button-panel.{{id}}:visible",
            template: stepTemplate,
            orphan: false,

            //delay: 200,
            backdrop: true,
            autoscroll: false,
            smartPlacement: true

        },
        {
            title: "Choose a route that most resembles the route you took",
            content: "For non-transit modes, click and drag to add waypoints to customize your route if desired.",
            element: ".route-options-container-{{id}}:visible",
            //reflex: true,
            //delay: 200,
            orphan: false,
            backdrop: true,
            template: stepTemplate
        },
        {
            title: "Switched modes?",
            content: " If you took several modes for this trip, click here to enter in a second travel mode.",
            element: ".switch-mode-{{id}}:visible",
            orphan: false,
            // reflex: 'mousedown',
            backdrop: true,
            template: stepTemplate
        },
        {
            title: "Save your route",
            content: " Once you've selected your route, click here to save your response.",
            element: ".confirm-route-{{id}}:visible",
            orphan: false,
            // reflex: 'mousedown',
            backdrop: true,
            template: stepTemplate
        },
        {
            title: "Next Trip",
            content: "Click on these tabs above to enter route information for your other trips.",
            element: "#trip-route-mode-header-{{id}}",
            //reflex: true,
            backdrop: true,
            placement: "bottom",
            template: templateOk,
        }
    ],
}

export default {
    tour,
    endLocationTour,
    intermediateLocationTour,
    routeMapTour,
    toggledRouteMapTour
}