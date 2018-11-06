export interface ISurveyMapRoute {
	name: string;
	summary: { totalDistance: number; totalTime: number };
	routesIndex: number;
	instructions: Array<any>;
}
