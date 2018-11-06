import { isNullOrUndefined } from 'util';

export class DragResizeDirective {
	/**
	 *
	 * @param {angular.IWindowService} _$window
	 */
	constructor(private _$window: ng.IWindowService) {}

	/**
	 *
	 * @returns {($window) => DragResizeDirective}
	 * @constructor
	 */
	public static Factory() {
		let directive = ($window) => {
			return new DragResizeDirective($window);
		};

		directive['restrict'] = 'AEC';

		return directive;
	}

	/**
	 *
	 * @param {angular.IScope} scope
	 * @param {angular.IAugmentedJQuery} element
	 * @param {angular.IAttributes} attrs
	 */

	public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
		element.on('touchstart', (evt) => {
			scope['touchStart'] = true;
			scope['translateY'] = isNullOrUndefined(scope['translateY']) ? 0 : scope['translateY'];
		});
		element.on('touchmove', (evt) => {
			if (scope['touchStart']) {
				let currentY = evt['originalEvent']['touches'][0].clientY;

				if (!isNullOrUndefined(scope['touchY'])) {
					let delta = scope['touchY'] - currentY;
					scope['translateY'] = scope['translateY'] - delta;

					let y: string = 'translateY(' + scope['translateY'] + 'px)';

					element.css('transform', y);
				}

				scope['touchY'] = currentY;
			}
		});
		element.on('toughend', (evt) => {
			scope['touchStart'] = false;
		});
	}
}
