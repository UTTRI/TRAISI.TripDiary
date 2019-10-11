export interface TimelineEntry {
	latitude: number;
	longitude: number;
	address: string;
	timeA: Date;
	timeB?: Date;
	purpose: string;
	name: string;
	id: symbol;
	pipedLocation?: boolean;
	locationType: TimelineLocationType;
	order: number;
}

export enum TimelineLocationType {
	StartLocation,
	IntermediateLocation,
	EndLocation,
	Undefined
}
