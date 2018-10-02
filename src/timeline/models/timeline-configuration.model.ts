import { TimelineLocationPurpose } from './timeline-location-purpose';

export interface TimelineConfiguration {
	startTime: Date;
	endTime: Date;
	purposes: Array<string | TimelineLocationPurpose>;
}
