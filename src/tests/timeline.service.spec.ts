// require('module-alias/register')('../package.json');
// import 'module-alias/register';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { TimelineService } from 'timeline/services/timeline.service';
import { TimelineEntry, TimelineLocationType } from 'timeline/models/timeline-entry.model';
// import { BsModalService } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';

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

	let loc2 = Object.assign({}, loc);
	loc2.id = Symbol();
	loc2.name = '2';
	let loc3 = Object.assign({}, loc);
	loc3.id = Symbol();
	loc3.name = '3';
	let loc4 = Object.assign({}, loc);
	loc4.id = Symbol();
	loc4.name = '4';
	let loc5 = Object.assign({}, loc);
	loc5.id = Symbol();
	loc5.name = '5';

	let timelineService: TimelineService;

	beforeEach(() => {
		let spy = jasmine.createSpyObj('BsModalService', ['show']);
		spy.show.and.returnValue(true);
		/*TestBed.configureTestingModule({
			// Provide both the service-to-test and its (spy) dependency
			providers: [TimelineService, BsModalService]
		}); */

		timelineService = new TimelineService(spy);
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
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(2);
			expect(locations[0].name === '2');
			done();
		});
	});

	it('add 3 location', done => {
		timelineService.addTimelineLocation(loc, 0);
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.addTimelineLocation(loc3); // add loc 3 to end
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(3);
			expect(locations[0].name === '2');
			expect(locations[2].name === '3');
			done();
		});
	});

	it('remove timeline location object ', done => {
		timelineService.addTimelineLocation(loc, 0);
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.addTimelineLocation(loc3);
		timelineService.removeTimelineLocation(loc2);
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(2);
			expect(locations[0].name === '1');
			expect(locations[1].name === '3');
			done();
		});
	});

	it('remove timeline location object 2', done => {
		timelineService.addTimelineLocation(loc, 0);
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.addTimelineLocation(loc3);
		timelineService.removeTimelineLocation(loc2);
		timelineService.removeTimelineLocation(loc2);
		timelineService.timelineLocations.subscribe(locations => {
			expect(locations.length).toEqual(2);
			expect(locations[0].name === '1');
			expect(locations[1].name === '3');
			done();
		});
	});

	it('test validation 1', done => {
		timelineService.addTimelineLocation(loc, 0);
		timelineService.addTimelineLocation(loc2, 0);
		timelineService.addTimelineLocation(loc3);
		timelineService.updateLocationsValidation();
		expect(timelineService.isTimelineStatevalid).toBe(false);
		done();
	});
});
