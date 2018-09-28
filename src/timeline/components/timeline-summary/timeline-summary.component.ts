import {
	Component,
	OnInit,
	ElementRef,
	Input,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	QueryList,
	ViewChildren,
	AfterViewInit,
	ContentChildren
} from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { TimelineEntry } from 'timeline/models/timeline-entry.model';

import { faHome, faBriefcase, faHandScissors, faSchool, IconDefinition } from '../../shared/icons';

import { BsModalRef, ModalDirective, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { NgTemplateOutlet } from '@angular/common';
import { Subject } from 'rxjs';
@Component({
	selector: 'timeline-summary',
	template: require('./timeline-summary.component.html').toString(),
	styles: [require('./timeline-summary.component.scss').toString()]
})
export class TimelineSummaryComponent implements OnInit, AfterViewInit {
	ngAfterViewInit(): void {
		throw new Error('Method not implemented.');
	}
	ngOnInit(): void {
		throw new Error('Method not implemented.');
	}
}
