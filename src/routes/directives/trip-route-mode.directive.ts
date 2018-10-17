import { UpgradeComponent } from '@angular/upgrade/static';
import { ElementRef, Injector, Directive } from '@angular/core';

/**
 * Directive
 */
@Directive({
	selector: 'trip-route-mode'
})
export class TripRouteModeDirective extends UpgradeComponent {
	/**
	 * Creates an instance of trip route mode directive.
	 * @param elementRef
	 * @param injector
	 */
	constructor(elementRef: ElementRef, injector: Injector) {
		super('tripRouteMode', elementRef, injector);
	}
}

/**
 * Trips route mode container
 * @returns  Component function
 */
export function tripRouteModeContainer() {
	return {
		restrict: 'E',
		scope: {},
		bindToController: {},
		template: `hello there`,
		controller: function() {}
	};
}
