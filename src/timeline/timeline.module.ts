import { NgModule } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineWedgeComponent } from './components/timeline-wedge/timeline-wedge.component';
import { TimelineService } from './services/timeline.service';
import { CommonModule } from '@angular/common';
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
import { TimelineSummaryComponent } from './components/timeline-summary/timeline-summary.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SurveyQuestionInternalViewDirective } from 'traisi-question-sdk';
import { NgxPopper } from 'angular-popper';
@NgModule({
	entryComponents: [
		TimelineWedgeComponent,
		TimelineComponent,
		TimelineShelfComponent,
		TimelineDockComponent,
		TimelineSlotComponent,
		TimelineEntryItemComponent,
		TimelineNewEntryComponent,
		TimelineSummaryComponent,
		ModalBackdropComponent
	],
	declarations: [
		TimelineWedgeComponent,
		TimelineComponent,
		TimelineShelfComponent,
		TimelineDockComponent,
		TimelineSlotComponent,
		TimelineNewEntryComponent,
		TimelineSummaryComponent,
		SafeHtmlPipe,
		TimelineEntryItemComponent,
		SurveyQuestionInternalViewDirective
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
					dependencies: ['location']
				},
				{
					name: 'traisi-timeline-wedge',
					id: 'trip-diary-timeline-wedge',
					component: TimelineWedgeComponent
				}
			],
			multi: true
		},
		{
			provide: 'dependencies',
			useValue: {
				dependency: true,
				name: 'location'
			}
		}
	],
	imports: [
		CommonModule,
		AlertModule,
		CarouselModule.forRoot(),
		ModalModule.forRoot(),
		PopoverModule.forRoot(),
		ButtonsModule.forRoot(),
		BsDropdownModule.forRoot(),
		FormsModule,
		TimepickerModule.forRoot(),
		NgxSmoothDnDModule,
		TooltipModule.forRoot(),
		NgxPopper
	]
})
export default class TimelineModule {}
