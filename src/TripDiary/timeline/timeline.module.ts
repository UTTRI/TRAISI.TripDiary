import { NgModule } from "@angular/core";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { TimelineWedge } from "./directives/timeline-wedge/timeline-wedge.directive";

@NgModule({
	declarations: [TimelineComponent, TimelineWedge],
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
            ] }
        ]
})
export default class TimelineModule {
    
}