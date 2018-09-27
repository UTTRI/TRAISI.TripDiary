import { NgModule } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineWedgeComponent } from './components/timeline-wedge/timeline-wedge.component';
import { TimelineService } from './services/timeline.service';
import { StoreModule } from '@ngrx/store';
import { timelineActions } from './redux/reducer';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimelineShelfComponent } from './components/timeline-shelf/timeline-shelf.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TimelineDockComponent } from './components/timeline-dock/timeline-dock.component';
import { TimelineSlotComponent } from './components/timeline-slot/timeline-slot.component';
import { TimelineEntryItemComponent } from './components/timeline-entry-item/timeline-entry-item.component';
import { ModalModule, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule } from '@angular/forms';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { TimelineNewEntryComponent } from './components/timeline-new-entry/timeline-new-entry.component';
@NgModule({
	entryComponents: [
		TimelineWedgeComponent,
		TimelineComponent,
		TimelineShelfComponent,
		TimelineDockComponent,
		TimelineSlotComponent,
		TimelineEntryItemComponent,
		TimelineNewEntryComponent,
		ModalBackdropComponent
	],
	declarations: [
		TimelineWedgeComponent,
		TimelineComponent,
		TimelineShelfComponent,
		TimelineDockComponent,
		TimelineSlotComponent,
		TimelineNewEntryComponent,
		TimelineEntryItemComponent
	],
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
		AlertModule,
		CarouselModule.forRoot(),
		ModalModule.forRoot(),
		FontAwesomeModule,
		StoreModule.forRoot({ timelineActions }),
		PopoverModule.forRoot(),
		ButtonsModule.forRoot(),
		BsDropdownModule.forRoot(),
		FormsModule,
		NgxSmoothDnDModule
	]
})
export default class TimelineModule {}
