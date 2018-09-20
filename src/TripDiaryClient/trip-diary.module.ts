import { NgModule } from '@angular/core';
import { TripDiaryTimelineComponent } from './components/trip-diary-timeline.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
	declarations: [TripDiaryTimelineComponent],
	entryComponents: [TripDiaryTimelineComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-trip-diary-timeline-component',
					id: 'text',
					component: TripDiaryTimelineComponent
				},
			],
			multi: true
		},
		
	],
	imports: [

		HttpClientModule
	]
})
export default class TripDiaryModule {}
