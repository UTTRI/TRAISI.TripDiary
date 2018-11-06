import { IDataInput, IModeConfig } from '../shared/survey-map-config';

export class DynamicDialogController {
	$inject = ['$scope', '$mdDialog'];

	/**
	 *
	 * @param {angular.IScope} $scope
	 * @param {"angular".material.IDialogService} $mdDialog
	 */
	constructor(
		private $scope: ng.IScope,
		private $mdDialog: ng.material.IDialogService,
		private mode: IModeConfig,
		private dataInputs: Array<IDataInput>,
		private dialogTitle: string,
		private data: {}
	) {
		$scope['dialogTitle'] = dialogTitle;
		$scope['dataInputs'] = dataInputs;
		$scope['close'] = this.close;
		$scope['checkKey'] = this.checkKey;
		$scope['dialog'] = $mdDialog;
		$scope['cancel'] = this.cancel;
		$scope['onChange'] = this.onChange;
		$scope['data'] = {};

		/* load passed data into scope data object*/

		Object.keys(data).forEach((key) => {
			$scope['data'][key] = data[key];
		});

		$scope['valid'] = this.validate();
	}

	/**
	 *
	 */
	private cancel = () => {
		this.$mdDialog.cancel();
	};

	/**
	 *
	 */
	private close = () => {
		this.$mdDialog.hide(this.$scope['data']);
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

	/**
	 *
	 * @param $event
	 */
	private onChange = ($event) => {
		this.$scope['valid'] = this.validate();
	};

	/**
	 *
	 * @returns {boolean}
	 */
	private validate = (): boolean => {
		if (Object.keys(this.$scope['data']).length >= this.$scope['dataInputs'].length) {
			return true;
		} else {
			return false;
		}
	};
}
