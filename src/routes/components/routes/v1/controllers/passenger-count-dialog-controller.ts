/**
 *
 */
import * as ng from 'angular';

export class PassengerCountDialogController {
	$inject = ['$scope', '$mdDialog'];

	/**
	 *
	 * @param {angular.IScope} $scope
	 * @param {"angular".material.IDialogService} $mdDialog
	 */
	constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService) {
		$scope['numPassengers'] = 0;
		$scope['close'] = this.close;
		$scope['checkKey'] = this.checkKey;
	}

	/**
	 * Hides the overlay dialog
	 */
	private close = () => {
		this.$mdDialog.hide(this.$scope['numPassengers']);
	};

	/**
	 *
	 * @param {KeyboardEvent} $event
	 */
	private checkKey = ($event: KeyboardEvent) => {
		if ($event.keyCode == 13) {
			this.close();
		}
	};
}
