import { NgModule } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component'
import { TimelineWedgeComponent } from './components/timeline-wedge/timeline-wedge.component';
import {TimelineService} from "./services/timeline.service";
import {StoreModule} from "@ngrx/store";
import {timelineActions} from "./redux/reducer";
import {CommonModule} from "@angular/common";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopoverModule } from 'ngx-bootstrap/popover';

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
		FontAwesomeModule,
		StoreModule.forRoot({ timelineActions }),
		PopoverModule.forRoot()
	]
})
export default class TimelineModule {}
