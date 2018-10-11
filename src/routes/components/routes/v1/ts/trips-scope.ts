import { ISurveyMapConfig } from '../shared/survey-map-config';
import { config } from './';
import {TripDiaryController} from '../controllers/trip-diary-controller';
export interface ITripsScope extends ng.IScope {

    tc: TripDiaryController;
    tripsLocationForm: HTMLFormElement;

    config: ISurveyMapConfig;
}