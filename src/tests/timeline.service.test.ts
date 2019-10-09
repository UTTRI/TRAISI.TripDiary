import { async, fakeAsync, tick } from '@angular/core/testing';

describe('test', () => {
	it('equal 8', async(() => {
		expect(3 + 5).toEqual(8);
	}));
});
