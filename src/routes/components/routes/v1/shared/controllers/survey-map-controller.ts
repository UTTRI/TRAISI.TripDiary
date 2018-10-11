export class SurveyMapController {

    private _map: L.Map;
    private _mapElement: JQuery;

    /**
     *
     * @param $scope
     */
    constructor(private $scope) {

        console.log("in controller");
        console.log($scope);
    }

}