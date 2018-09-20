import { NgModule } from "@angular/core";
import { TimelineComponent } from "./components/timeline/timeline.component";

@NgModule({
    exports: [TimelineComponent],
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