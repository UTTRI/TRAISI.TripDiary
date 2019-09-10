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
					displayName: 'Driver',
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
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Paratransit service (e.g., bus transport for disabled persons)',
					showPrompt: false,
					autoSaveRoute: false,
					accessibility: 'wheelchair',
					noRouteMessage: 'No Route Message'
				},
				{
					name: 'Walk',
					icon: 'fas fa-walk',
					category: 'accessible',
					routerMode: 'driver',
					allowAddWaypoints: false,
					colour: '#03A9F4',
					displayName: 'Driver',
					showPrompt: false,
					autoSaveRoute: true,
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
			name: 'driver',
			icon: 'fas fa-car',
			category: 'driver',
			subModes: [
				{
					name: 'driver',
					icon: 'fas fa-car',
					category: 'driver',
					routerMode: 'driver',
					allowAddWaypoints: true,
					colour: '#03A9F4',
					displayName: 'Drive with passengers',
					autoSaveRoute: true,
					showPrompt: false,

					dataInputs: [
						{
							key: 'passengerCount',
							label: 'Passenger Count',
							type: DataInputType.INTEGER,
							min: 0,
							max: 10,
							placeholder: 'How many passengers were in the vehicle?'
						},
						{
							key: 'vehicleType',
							label: 'Type of Vehicle',
							type: DataInputType.OPTIONS,

							placeholder: 'What is the type of vehicle?',
							optionList: [
								{ value: 'household_owned', label: 'Household owned vehicle' },
								{ value: 'leased_vehicle', label: 'Leased vehicle' },
								{ value: 'commercial_carshare', label: 'Commercial carshare' }
							]
						}
					],
					noRouteMessage: "I don't know the route.",
				},
				{
					name: 'passenger',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Drive with passenger',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					dialogTitle: 'What was the type of vehicle?',
					dataInputs: [
						{
							key: 'driver',
							label: 'Driver',
							type: DataInputType.OPTIONS,

							placeholder: 'Choose an option',
							optionList: [
								{ value: 'household_member', label: 'Household owned vehicle' },
								{ value: 'carpool', label: 'Carpool' },
								{ value: 'taxi', label: 'Taxi' },
								{ value: 'uber', label: 'Uber' },
								{ value: 'other', label: 'Other' }
							]
						}
					],
					autoSaveRoute: true
				}
			]
		},
		{
			name: 'passenger',
			icon: 'fas fa-car',
			category: 'passenger',
			subModes: [
				{
					name: 'passenger1',
					icon: 'fas fa-car',
					category: 'passenger',
					routerMode: 'driver',
					allowAddWaypoints: true,
					colour: '#03A9F4',
					displayName: 'DAuto passenger (driver is a household member)',
					autoSaveRoute: true,
					showPrompt: false,

					/*dataInputs: [
						{
							key: 'passengerCount',
							label: 'Passenger Count',
							type: DataInputType.INTEGER,
							min: 0,
							max: 10,
							placeholder: 'How many passengers were in the vehicle?'
						},
						{
							key: 'vehicleType',
							label: 'Type of Vehicle',
							type: DataInputType.OPTIONS,

							placeholder: 'What is the type of vehicle?',
							optionList: [
								{ value: 'household_owned', label: 'Household owned vehicle' },
								{ value: 'leased_vehicle', label: 'Leased vehicle' },
								{ value: 'commercial_carshare', label: 'Commercial carshare' }
							]
						}
					], */
					noRouteMessage: "I don't know the route.",
				},
				{
					name: 'passenger',
					icon: 'fas fa-car',
					category: 'driver',
					allowAddWaypoints: true,
					colour: '#037bb8',
					routerMode: 'driver',
					customRoute: routeNotKnown,
					displayName: 'Auto passenger (driver is a household member)',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					dialogTitle: 'What was the type of vehicle?',
					autoSaveRoute: true
				}
			]
		},
		{
			name: 'transit',
			icon: 'fas fa-bus-alt',
			category: 'transit',
			subModes: [
				{
					name: 'public_transit',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#F44336',
					displayName: 'Public Transit',
					showPrompt: false,
					routerMode: 'transit',
					noRouteMessage: 'My route is not shown.',
					shouldAskNoRouteDescription: true,
					customRoute: routeNotShown,
					autoSaveRoute: false
				},
				{
					name: 'Streetcat',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#cd3d34',
					displayName: 'Intercity Bus',
					showPrompt: false,
					noRouteMessage: 'My route is not shown.',
					customRoute: routeNotShown,

					routerMode: 'transit',
					shouldAskNoRouteDescription: true,
					autoSaveRoute: false
				},
				{
					name: 'Subway R/T',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					allowAddWaypoints: false,
					colour: '#b23c33',
					displayName: 'Intercity Rail',
					showPrompt: false,
					routerMode: 'transit',
					noRouteMessage: 'My route is not shown.',
					customRoute: routeNotShown,
					autoSaveRoute: false,
					shouldAskNoRouteDescription: true
				},
				{
					name: 'Go Bus',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					allowAddWaypoints: true,
					customRoute: routeNotKnown,
					colour: '#9a342c',
					displayName: 'Paratransit',
					showPrompt: false,
					routerMode: 'driver',
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: false,

					shouldAskNoRouteDescription: false
				},
				{
					name: 'GO Train',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#9a342c',
					routerMode: 'driver',
					displayName: 'Schoolbus',
					showPrompt: false,
					noRouteMessage: "I don't know the route.",
					autoSaveRoute: false,
					shouldAskNoRouteDescription: false
				},

				{
					name: 'Inter-campus shuttle',
					icon: 'fas fa-bus-alt',
					category: 'transit',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#92312a',
					routerMode: 'driver',
					displayName: 'Private Shuttle',
					showPrompt: false,
					noRouteMessage: 'I don\'t know the route.',
					autoSaveRoute: false,
					shouldAskNoRouteDescription: false
				}
			]
		},
		{
			name: 'ridehialing',
			icon: 'fas fa-taxi',
			category: 'ridehailing',

			subModes: [
				{
					name: 'ridehailing-moped',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Motorcycle, moped or scooter',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},
				{
					name: 'ridehailing-taxu',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Taxi',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},
				{
					name: 'ridehailing-appshare',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Ride-hailing alone (UberX, Lyft etc.)',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},{
					name: 'ridehailing-appshare-pool',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Ride-hailing with other passengers (Uberpool, Lyftpool etc.)',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},{
					name: 'ridehailing-parkandride',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Ride-hailing with other passengers (Uberpool, Lyftpool etc.)',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},{
					name: 'ridehailing-kissandride',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Kiss and Ride',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				},{
					name: 'ridehailing-bikeandride',
					icon: 'fas fa-taxi',
					category: 'ridehailing',
					customRoute: routeNotKnown,
					allowAddWaypoints: true,
					colour: '#4CAF50',
					displayName: 'Bike and Ride',
					showPrompt: false,
					routerMode: 'walk',
					autoSaveRoute: true,
					noRouteMessage: 'I don\'t know the route.'
				}
			]
		}, /*
		{
			name: 'bicycle',
			icon: 'fas fa-bicycle',
			category: 'bicycle',
			subModes: [
				{
					name: 'bicycle',
					icon: 'fas fa-bicycle',
					category: 'bicycle',
					customRoute: routeNotKnown,

					allowAddWaypoints: true,
					colour: '#FF9800',
					displayName: 'Bicycle',
					showPrompt: false,
					noRouteMessage: 'I don\'t know the route.',
					dialogTitle: 'Did you use bike share?',
					routerMode: 'bicycle',
					dataInputs: [
						{
							key: 'useBikeShare',
							label: '',
							type: DataInputType.OPTIONS,
							placeholder: 'Select an option',
							optionList: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
						}
					]
				},
				{
					name: 'motorcycle',
					icon: 'fas fa-motorcycle',
					category: 'bicycle',
					customRoute: routeNotKnown,
					displayName: 'Motorcycle',
					allowAddWaypoints: true,
					colour: '#ed8c00',
					showPrompt: false,
					routerMode: 'driver',
					autoSaveRoute: false,
					noRouteMessage: 'I don\'t know the route.'
				}
			]
		}, */

		{
			name: 'wheelchair',
			icon: 'fas fa-wheelchair',
			category: 'wheelchair',
			subModes: [
				{
					name: 'wheelchair',
					icon: 'fas fa-wheelchair',
					category: 'wheelchair',
					allowAddWaypoints: true,
					colour: '#bb3bff',
					displayName: 'Wheelchair',
					showPrompt: false,
					customRoute: routeNotKnown,
					routerMode: 'walk',
					noRouteMessage: 'I don\'t know the route.',
					autoSaveRoute: false,
					accessibility: 'WheelChair'
				},
				{
					name: 'paratransit',
					icon: 'fas fa-bus-alt',
					category: 'wheelchair',
					allowAddWaypoints: true,
					routerMode: 'driver',
					colour: '#a036de',
					displayName: 'Paratransit',
					showPrompt: false,
					customRoute: routeNotKnown,
					noRouteMessage: 'My route is not shown.',
					autoSaveRoute: false
				}
			]
		},
		/*
		{
			name: 'flight',
			icon: 'fas fa-plane-departure',
			category: 'flight',

			subModes: [
				{
					name: 'flight',
					icon: 'fas fa-plane-departure',
					category: 'flight',
					customRoute: routeNotKnown,
					allowAddWaypoints: false,
					colour: '#4CAF50',
					displayName: 'Flight',
					showPrompt: false,
					routerMode: 'walk',
					noRouteMessage: 'I don\'t know the route.',
					autoSaveRoute: true
				}
			]
		} */
	]
};
