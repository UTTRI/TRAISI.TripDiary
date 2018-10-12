import * as ng from "angular";
import { SurveyConfigService } from "../shared/services/survey-config-service";


export class TripDiaryTimelineHomeConfirmDialogController {


    private _headerText: string;
    private _descriptionText: string;


    /**
     *
     * @param {angular.IScope} $scope
     * @param {"angular".material.IDialogService} $mdDialog
     * @param {SurveyConfigService} SurveyConfigService
     */
    constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService, private SurveyConfigService: SurveyConfigService,
                private translateData) {


        $scope['close'] = this.close;
        $scope['cancel'] = this.cancel;

        $scope['chosenLocation'] = null;

        $scope['configService'] = SurveyConfigService;

        $scope['translateData'] = translateData;


        console.log($scope);
        let locations = [];

        let surveyLocations = SurveyConfigService.surveyLocations;
        for (let location of surveyLocations) {
            if (location.purpose.toLowerCase() == "home") {
                locations.push(location);
            }
        }
        $scope['locations'] = locations;


    }


    /**
     *
     * @param {any} value
     */
    private close = (value = null) => {


        this.$mdDialog.hide(this.$scope['chosenLocation']);
    }

    /**
     * Hides the overlay dialog
     */
    private cancel = () => {


        this.$mdDialog.cancel();
    }


}