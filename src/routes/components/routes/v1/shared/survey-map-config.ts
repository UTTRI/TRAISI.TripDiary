export enum DataInputType {
	INTEGER = 'INTEGER',
	STRING = 'STRING',
	TEXT = 'TEXT',
	OPTIONS = 'OPTIONS',
	MESSAGE = 'MESSAGE'
}

export interface ISurveyMapConfig {
	modes: Array<IModeCategoryConfig>;
	locations: { [locationName: string]: ILocationConfig };
	purposes: Array<{ value: string; label: string }>;
	noTripReasons?: Array<INoTripReason>;
}

/**
 * Configuration interface for "general" or "parent" category of a travel mode ie: transit vs bus
 */
export interface IModeCategoryConfig {
	name: string;
	icon: string;
	category: string;
	subModes: Array<IModeConfig>;
}

export interface IModeConfig {
	name: string;
	icon: string;
	category: string;
	allowAddWaypoints: boolean;
	colour: string;
	displayName: string;
	showPrompt: boolean;
	noRouteMessage: string;
	shouldAskNoRouteDescription?: boolean;
	dataInputs?: Array<IDataInput>;
	dialogTitle?: string;
	customRoute?: ICustomRouteInput;
	routerMode: string;
	autoSaveRoute?: boolean;
	accessibility?: string;
	modes?: string;
}

export interface ILocationConfig {
	locationColour: string;
}

export interface INoTripReason {
	value: string;
	label: string;
}

export interface ICustomRouteInput {
	label: string;
	dataInputs?: Array<IDataInput>;
	fieldAsSummary?: string;
	dialogTitle?: string;
	routeKey?: string;
}

export interface IDataInput {
	label: string;
	type: DataInputType;
	min?: number;
	max?: number;
	key: string;
	placeholder?: string;
	default?: string;
	description?: string;
	optionList?: Array<IDataInputOption>;
}

export interface IDataInputOption {
	value: string;
	label: string;
}
