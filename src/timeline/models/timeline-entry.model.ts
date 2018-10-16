export interface TimelineEntry {
	latitude: number;
	longitude: number;
	address: string;
	time: Date;
	timeB: Date;
	purpose: string;
	name: string;
	id: symbol;
	locationType: TimelineLocationType;
}

export enum TimelineLocationType {
	StartLocation,
	IntermediateLocation,
	EndLocation,
	Undefined
}
