export class TripTimeline {
	startTime: Date;
	endTime: Date;

	timelineSegments: string[];

	/**
	 *
	 */
	constructor() {
		this.timelineSegments = new Array<string>(24);
		this.startTime = new Date();
		this.startTime.setHours(4, 0, 0, 0);

		let timeObj = new Date(this.startTime);
		for (let i = 0; i < 24; i++) {
			timeObj.setHours(4 + i, 0, 0, 0);
			this.timelineSegments[i] = this.formatAMPM(timeObj);
		}
	}

	/**
	 *
	 * @param date
	 * @returns {string}
	 */
	public formatAMPM(date): string {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		let strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
}
