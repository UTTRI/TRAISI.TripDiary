import { NgModule } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component'
import { TimelineWedgeComponent } from './components/timeline-wedge/timeline-wedge.component';

@NgModule({
	declarations: [TimelineComponent, TimelineWedgeComponent],
	exports: [],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-timeline-question',
					id: 'timeline',
					component: TimelineComponent
				},
				{
					name: 'traisi-timeline-wedge',
					id: 'timeline-wedge',
					component: TimelineWedgeComponent
				}
			]
		}
	]
})
export default class TimelineModule {}
