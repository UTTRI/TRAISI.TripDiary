import { NgModule } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component'
import { TimelineWedgeComponent } from './components/timeline-wedge/timeline-wedge.component';
import {TimelineService} from "./services/timeline.service";
import {StoreModule} from "@ngrx/store";
import {timelineActions} from "./redux/reducer";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

@NgModule({
	entryComponents:[TimelineWedgeComponent, TimelineComponent ],
	declarations: [TimelineWedgeComponent, TimelineComponent ],
	exports: [],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-timeline-question',
					id: 'trip-diary-timeline',
					component: TimelineComponent,
					dependencies: ['trip-diary-timeline-wedge']
				},
				{
					name: 'traisi-timeline-wedge',
					id: 'trip-diary-timeline-wedge',
					component: TimelineWedgeComponent
				}
			],
			multi: true
			
		},
		TimelineService
	],
	imports: [
		CommonModule,
        StoreModule.forRoot({ timelineActions })
	]
})
export default class TimelineModule {}
