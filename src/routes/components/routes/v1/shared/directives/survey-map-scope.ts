import {SurveyMapDirective} from './survey-map-directive';
import {TripDiaryController} from "../../controllers/trip-diary-controller";

export interface ISurveyMapScope extends ng.IScope {


    callback: (ctrl, address, latlng) => void;

    ready: (surveyMap) => void;

    map: SurveyMapDirective;

    controller: TripDiaryController;

    updateMarkers: (any) => any;

    config: any;


}