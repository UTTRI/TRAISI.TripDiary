/* Load previous location data */
import {IHttpService} from "angular";
import {SurveyMapLocation} from "../survey-map-location";

import * as angular from 'angular';
import {ISurveyLocation} from "./survey-location";
import {isNullOrUndefined} from "util";
import * as _ from "lodash";


const API_ROOT: string = '/api/survey/';

declare var L;

/**
 * SurveyConfigService, provides services for interacting with STAISI API
 */
export class SurveyConfigService {
    private locationUrl: string = '/api/survey/' + this.surveyId + '/' + this.userId + '/locations/';
    private previousLocationsLoaded: boolean = false;
    private _staticSurveyLocations: Array<ISurveyLocation>;

    /**
     *
     * @param {angular.IHttpService} $http
     * @param {string} surveyId
     * @param {string} userId
     */
    constructor(private $http: IHttpService,
                private surveyId: string,
                private userId: string,
                private questionId: string) {

        this.$http = $http;

        this._surveyLocations = new Array<ISurveyLocation>();

        this._staticSurveyLocations = new Array<ISurveyLocation>();

        this.locationUrl = '/api/survey/' + this.surveyId + '/' + this.userId + '/locations/';

        this.getPreviousLocations();

        /* get the csrf element */
        this._csrfToken = (angular.element('input[name="csrfmiddlewaretoken"]')[0] as HTMLInputElement).defaultValue;


    }

    private _csrfToken: string;

    get csrfToken(): string {
        return this._csrfToken;
    }

    set csrfToken(value: string) {
        this._csrfToken = value;
    }

    private _surveyLocations: Array<ISurveyLocation>;

    get surveyLocations(): Array<ISurveyLocation> {
        return this._surveyLocations;
    }

    set surveyLocations(value: Array<ISurveyLocation>) {
        this._surveyLocations = value;
    }

    /**
     * Factory method to create the Survey Config service
     * @param {string} userId user ID of active user
     * @param {string} surveyId SurveyID of active survey
     * @returns {($http) => SurveyConfigService} Returns new service
     * @constructor
     */
    public static Factory(userId: string, surveyId: string, questionId: string) {
        var service = ($http) => {
            return new SurveyConfigService($http, surveyId, userId, questionId);
        };
        service['$inject'] = ['$http'];
        return service;
    }

    /**
     * Saves the current state of the question
     * @param {string} responseData string representation of the response data
     * @param {string} questionId the question id
     */
    savePartialResponse(responseData: string, questionId: string) {


        let data = {};
        data[questionId] = responseData;
        this.$http.post(API_ROOT + this.surveyId + "/partial_response/question/" + questionId + "/",
            data, {headers: {'X-CSRFToken': this._csrfToken},})
            .then(function (r) {

                    /* success updating */
                },
                function (error) {
                    /* error occoured saving repsonse */
                    console.log(error);

                });
    }

    /**
     * Gets previous locations of the current responder
     * @returns {SurveyMapLocation}
     */
    getPreviousLocations(): any {
        if (!this.previousLocationsLoaded) {
            this.previousLocationsLoaded = true;
            this.$http.get(this.locationUrl).then((response) => {

                
                    for (let result of response.data['data']) {


                        let purpose = "";
                        let label = "";
                        let lat = "";
                        let lng = "";
                        let addressLatLng = "";
                        let validLocation: boolean = true;

                        if (!isNullOrUndefined(result['purpose'])) {
                            purpose = result['purpose'];
                        }
                        else {
                            validLocation = false;
                        }

                        if (!isNullOrUndefined(result['label'])) {
                            label = result['label'];
                        }
                        else {
                            validLocation = false;
                        }

                        for (let key of Object.keys(result['response'])) {
                            //console.log(key);


                            if (key.indexOf('purpose') < 0) {
                                addressLatLng = result['response'][key];

                                if (addressLatLng != 'other_option_value' && !isNullOrUndefined(addressLatLng)) {

                                    if (addressLatLng.indexOf('_') < 0) {
                                        validLocation = false;
                                        return;
                                    }
                                    lat = addressLatLng.split('_')[1].split(',')[0].split(':')[1];
                                    lng = addressLatLng.split('_')[1].split(',')[1].split(':')[1].slice(0, -1);

                                    validLocation = true;
                                    break;
                                }
                                else {
                                    validLocation = false;
                                }
                            }
                        }

                        //check if not exist

                        let exist: boolean = false;

                        for (let location of this._surveyLocations) {

                            if (location.latLng.lat == parseFloat(lat) && location.latLng.lng == parseFloat(lng)) {

                                exist = true;
                                break;
                            }
                        }


                        if (validLocation)  {
                            
                            if (!exist) {
                                this._surveyLocations.push(
                                    {
                                        name: label,
                                        latLng: new L.LatLng(lat, lng),
                                        address: addressLatLng.split('_')[0],
                                        purpose: purpose,

                                    }
                                )
                            }

                            this._staticSurveyLocations.push(
                                {
                                    name: label,
                                    latLng: new L.LatLng(lat, lng),
                                    address: addressLatLng.split('_')[0],
                                    purpose: purpose,

                                }
                            )
                        }
                        //console.log(this._surveyLocations);
                    }
                

            }, function (data) {

                console.log(data);
            });
        }
    }

    /**
     * Clears / resets dynamic piped locations.
     */
    public clearNonStaticLocations() {
        this._surveyLocations = [];
    }

    /**
     * Combines static and dynamic locations
     */
    public combineLocations() {

        this._surveyLocations = this._staticSurveyLocations.concat(this._surveyLocations);


        /*check for combination */


        this._surveyLocations = _.uniqBy(this._surveyLocations, 'latLng');

        //console.log(this._surveyLocations);



    }


    /**
     *
     * @param {string} name
     * @param {LatLng} latLng
     * @param {string} address
     */
    public addLocation(name: string, latLng: L.LatLng, address: string, purpose: string, id: string) {


        let hasLocation: boolean = false;

        for (let location of this._staticSurveyLocations) {
            if (location.latLng.lat == latLng.lat && location.latLng.lng == latLng.lng) {
                hasLocation = true;
            }


        }


        for (let location of this._surveyLocations) {
            if (location.latLng.lat == latLng.lat && location.latLng.lng == latLng.lng) {
                hasLocation = true;
            }


        }


        if (!hasLocation) {
            this._surveyLocations.push(
                {
                    name: name,
                    latLng: latLng,
                    address: address,
                    purpose: purpose,
                    id: id
                }
            )
        }


    }

}