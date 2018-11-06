import * as ng from 'angular';

export class RouteDescriptionDialogController {
	get description() {
		return this._description;
	}

	set description(value) {
		this._description = value;
	}

	private _description;

	/**
	 *
	 * @param {angular.IScope} $scope
	 * @param {"angular".material.IDialogService} $mdDialog
	 */
	constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService) {
		this._description = '';
	}

	/**
	 * Hides the overlay dialog
	 */
	private close() {
		this.$mdDialog.hide(this._description);
	}

	/**
	 * Hides the overlay dialog
	 */
	private cancel() {
		this.$mdDialog.cancel();
	}
}
