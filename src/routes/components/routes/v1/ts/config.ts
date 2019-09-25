import { DataInputType, ICustomRouteInput, ISurveyMapConfig } from '../shared/survey-map-config';

/*
let defaultIcon = SurveyMapSvgIcon.createIcon('', '#9eb3ce');
let homeIcon = SurveyMapSvgIcon.createIcon('home', '#82b8e2');
let schoolIcon = SurveyMapSvgIcon.createIcon('school', '#669d4d');
let shoppingIcon = SurveyMapSvgIcon.createIcon('shopping_cart', '#7847b8');
let workIcon = SurveyMapSvgIcon.createIcon('work', '#b29e85');
let switchIcon = SurveyMapSvgIcon.createIcon('swap_horiz', '#ff9703');
let otherIcon = SurveyMapSvgIcon.createIcon('home', '#607D8B');


let changepointIcon = SurveyMapSvgIcon.createIcon('swap_horiz', '#276464');
let passengerIcon = SurveyMapSvgIcon.createIcon('directions_car', '#276464');
let daycareIcon = SurveyMapSvgIcon.createIcon('child_care', '#D768A5');
 */

let routeNotShown: ICustomRouteInput = {
	label: 'My route is not shown',
	fieldAsSummary: 'routeDescription',
	dialogTitle: 'Route Description',
	routeKey: 'route_not_shown',
	dataInputs: [
		{
			key: 'routeDescription',
			label: 'Route Description',
			type: DataInputType.TEXT,
			placeholder: 'Please describe the route you took.'
		}
	]
};

let routeNotKnown: ICustomRouteInput = {
	label: "I don't know my route",
	routeKey: 'route_not_known'
	// fieldAsSummary: "routeDescription",
	// dialogTitle: "Route Description",
	/*dataInputs: [
        {
            key: 'routeDescription',
            label: 'Route Description',
            type: DataInputType.TEXT,
            placeholder: "Please describe the route you took."
        },

    ] */
};

export let config: ISurveyMapConfig = {
	purposes: [
		{ label: 'Home', value: 'home' },
		{ label: 'Work', value: 'work' },
		{ label: 'School', value: 'school' },
		{ label: 'Daycare', value: 'daycare' },
		{ label: 'Shopping', value: 'shopping' },
		{ label: 'Facilitate Passenger', value: 'facilitate_passenger' },
		{ label: 'Other', value: 'other' }
	],

	locations: {
		home: {
			locationColour: '#82b8e2'
		},
		other: {
			locationColour: '#607D8B'
		},
		school: {
			locationColour: '#669d4d'
		},
		work: {
			locationColour: '#b29e85'
		},
		daycare: {
			locationColour: '#D768A5'
		},
		shopping: {
			locationColour: '#7847b8'
		},
		facilitate_passenger: {
			locationColour: '#276c6c'
		}
	},
	modes: [
		{
			name: 'Accessibile',
			icon: 'fas fa-wheelchair',
			category: 'accessible',
			subModes: [
				{
					name: 'accessible-car',
					icon: 'fas fa-car',
					category: 'accessible',
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Accessibility adapted vehicle as driver',
					showPrompt: false,
					autoSaveRoute: true,
					noRouteMessage: 'No Route Message'
				},
				{
					name: 'accessible-passenger',
					icon: 'fas fa-car',
					category: 'accessible',
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Accessibility adapted vehicle as passenger',
					showPrompt: false,
					autoSaveRoute: true,
					noRouteMessage: 'No Route Message'
				},
				{
					name: 'accessible-paratransit',
					icon: 'fas fa-car',
					category: 'accessible',
					routerMode: 'PT',
					// modes: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Paratransit service (e.g., bus transport for disabled persons)',
					showPrompt: false,
					autoSaveRoute: false,
					accessibility: 'WheelChair',
					noRouteMessage: 'No Route Message'
				}

				/*{
					name: 'driver',
					icon: 'fas fa-car',
					category: 'accessible',
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Driver',
					showPrompt: false,
					autoSaveRoute: true,
					noRouteMessage: 'No Route Message'
				}
				{
					name: 'driver',
					icon: 'fas fa-car',
					category: 'accessible',
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Driver',
					showPrompt: false,
					autoSaveRoute: true,
					noRouteMessage: 'No Route Message'
				} */
			]
		},
		{
			name: 'walk',
			icon: 'fas fa-walking',
			category: 'walk',
			subModes: [
				{
					name: 'walk',
					icon: 'fas fa-walking',
					category: 'walk',
					customRoute: routeNotKnown,
					allowAddWaypoints: false,
					colour: '#4CAF50',
					displayName: 'Walk',
					showPrompt: false,
					routerMode: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					modes: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				}
			]
		},
		{
			name: 'bicycle',
			icon: 'fas fa-biking',
			category: 'bicycle',
			subModes: [
				{
					name: 'personal',
					icon: 'fas fa-biking',
					category: 'walk',
					customRoute: routeNotKnown,
					allowAddWaypoints: false,
					colour: '#4CAF50',
					displayName: 'Personal',
					showPrompt: false,
					routerMode: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					modes: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				},
				{
					name: 'bikeshare',
					icon: 'fas fa-bicycle',
					category: 'walk',
					customRoute: routeNotKnown,
					allowAddWaypoints: false,
					colour: '#4CAF50',
					displayName: 'Bikeshare',
					showPrompt: false,
					routerMode: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					modes: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				}
			]
		},
		{
			name: 'auto',
			icon: 'fas fa-car',
			category: 'driver',
			subModes: [
				{
					name: 'auto-drive-alone',
					icon: 'fas fa-car',
					category: 'driver',
					routerMode: 'driver',
					allowAddWaypoints: true,
					colour: '#03A9F4',
					displayName: 'Drive alone',
					autoSaveRoute: true,
					showPrompt: false,
					noRouteMessage: "I don't know the route."
				},
				{
					name: 'auto-drive-passenger-household',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Drive with passenger(s) (household members only)',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				},
				{
					name: 'auto-drive-passenger-non-household',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Drive with passenger(s) (including non-household members)',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				},
				{
					name: 'auto-passenger-household',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Auto passenger (driver is a household member)',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				},
				{
					name: 'auto-non-household',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Auto passenger (driver is a non-household member)',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				}
			]
		},
		{
			name: 'transit',
			icon: 'fas fa-subway',
			category: 'transit',
			subModes: [
				{
					name: 'transit-all-way',
					icon: 'fas fa-subway',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#F44336',
					displayName: 'Transit all way',
					showPrompt: false,
					routerMode: 'PT',
					noRouteMessage: 'My route is not shown.',
					shouldAskNoRouteDescription: true,
					modes: 'TRAIN|LOCAL_TRAIN|HST|RAPID_TRANSIT|LONG_DISTANCE_TRAIN|METRO|TRAMWAY|COACH|BUS|FERRY|TROLLEY_BUS|SHUTTLE',
					customRoute: routeNotShown,
					autoSaveRoute: false
				},
				{
					name: 'transit-other-access',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#F44336',
					displayName: 'Transit with other access/egress mode',
					routerMode: 'PT',
					noRouteMessage: 'My route is not shown.',
					shouldAskNoRouteDescription: true,
					modes: 'TRAIN|LOCAL_TRAIN|HST|RAPID_TRANSIT|LONG_DISTANCE_TRAIN|METRO|TRAMWAY|COACH|BUS|FERRY|TROLLEY_BUS|SHUTTLE',
					customRoute: routeNotShown,
					autoSaveRoute: false,
					showPrompt: true,
					dialogTitle: 'Transit Access/Egress Details',
					dataInputs: [
						{
							key: 'accessEgressMode',
							label: 'Transit access mode',
							type: DataInputType.OPTIONS,
							placeholder: 'What mode did you take to access public transit?',
							optionList: [
								{ value: 'auto', label: 'Auto' },
								{ value: 'bicycle', label: 'Bicycle' },
								{ value: 'walk', label: 'Walk' }
							]
						}
					]
				},
				{
					name: 'transit-campus-shuttle',
					icon: 'fas fa-bus',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#F44336',
					displayName: 'Transit with auto or auto access',
					showPrompt: false,
					routerMode: 'PT',
					noRouteMessage: 'My route is not shown.',
					shouldAskNoRouteDescription: true,
					modes: 'BUS',
					customRoute: routeNotShown,
					autoSaveRoute: false
				}
			]
		},
		{
			name: 'ridehailing',
			icon: 'fas fa-taxi',
			category: 'ridehailing',
			subModes: [
				{
					name: 'ridehailing-taxi',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#1f28ab',
					displayName: 'Taxi',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: "I don't know the route."
				},
				{
					name: 'ridehailing-alone',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#1f28ab',
					displayName: 'Ride-hailing alone (UberX, Lyft etc.)',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: "I don't know the route."
				},
				{
					name: 'ridehailing-share',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#1f28ab',
					displayName: 'Ride-hailing with other passengers (Uberpool, Lyftpool etc.)',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: "I don't know the route."
				}
			]
		},
		{
			name: 'motorcycle',
			icon: 'fas fa-motorcycle',
			category: 'motorcycle',
			subModes: [
				{
					name: 'motorcycle',
					icon: 'fas fa-motorcycle',
					category: 'motorcycle',
					customRoute: routeNotKnown,
					allowAddWaypoints: false,
					colour: '#ab831f',
					displayName: 'Motorcycle, moped or scooter',
					showPrompt: false,
					routerMode: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					modes: 'BUS|LOCAL_TRAIN|METRO|RAPID_TRANSIT',
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: true
				}
			]
		}
	]
};
