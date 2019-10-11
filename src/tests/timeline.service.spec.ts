// require('module-alias/register');
import 'module-alias/register';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { async, fakeAsync, tick } from '@angular/core/testing';
import { TimelineService } from 'timeline/services/timeline.service';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';

describe('Timeline Service', () => {
	let loc: TimelineEntry = {
		address: '',
		latitude: 0,
		longitude: 0,
		locationType: TimelineLocationType.StartLocation,
		id: Symbol(),
		name: '1',
		order: 0,
		timeA: null,
		timeB: null,
		pipedLocation: false,
		purpose: 'purpose'
	};

	let timelineService: TimelineService;

	beforeEach(() => {
		timelineService = new TimelineService(null);
		// let spy = jasmine.createSpyObj('BsModalService', []);
	});

	it('no timeline locations on init', done => {
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(0);
			done();
		});
	});

	it('add first location', done => {
		timelineService.addTimelineLocation(loc, 0);
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(1);
			done();
		});
	});

	it('add second location', done => {
		timelineService.addTimelineLocation(loc, 0);
		let loc2 = Object.assign({}, loc);
		loc2.id = Symbol();
		loc2.name = '2';
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(2);
			expect(locations[0].name === '2');
			done();
		});
	});

	it('add 3 location', done => {
		timelineService.addTimelineLocation(loc, 0);
		let loc2 = Object.assign({}, loc);
		loc2.id = Symbol();
		loc2.name = '2';
		let loc3 = Object.assign({}, loc);
		loc3.id = Symbol();
		loc3.name = '3';
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.addTimelineLocation(loc3); // add loc 3 to end
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(3);
			expect(locations[0].name === '2');
			expect(locations[2].name === '3');
			done();
		});
	});
});
