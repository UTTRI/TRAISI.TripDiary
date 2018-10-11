import * as ng from "angular";

export class TripDiaryTimelineDialogController {


    private _headerText: string;
    private _descriptionText: string;

    /**
     *
     * @param {angular.IScope} $scope
     * @param {"angular".material.IDialogService} $mdDialog
     */
    constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService,
                headerText: string,
                descriptionText: string) {


        this._descriptionText = descriptionText;
        this._headerText = headerText;

        $scope['headerText'] = headerText;
        $scope['descriptionText'] = descriptionText;
        $scope['close'] = this.close;


    }

    /**
     * Hides the overlay dialog
     */
    private close = (value = null) => {


        this.$mdDialog.hide();

        this.$mdDialog.hide(value);
    }

    /**
     * Hides the overlay dialog
     */
    private cancel() {


        this.$mdDialog.cancel();
    }


}