import * as angular from 'angular';

import * as material from 'angular-animate';
import {MultipageQuestion} from "./survey-multipage";
import { SurveyConfigService } from 'routes/components/routes/v1/shared/services/survey-config-service';




declare var moment: any;

/**
 * Base SurveyQuestion
 */
export class SurveyQuestion {
    get startDate() {
        return this._startDate;
    }

    set startDate(value) {
        this._startDate = value;
    }
    get todayDateDisplay(): string {
        return this._todayDateDisplay;
    }

    set todayDateDisplay(value: string) {
        this._todayDateDisplay = value;
    }

    get tomorrowDateDisplay(): string {
        return this._tomorrowDateDisplay;
    }

    set tomorrowDateDisplay(value: string) {
        this._tomorrowDateDisplay = value;
    }

    get $scope(): ng.IScope {
        return this._$scope;
    }

    set $scope(value: ng.IScope) {
        this._$scope = value;
    }

    get $http(): ng.IHttpService {
        return this._$http;
    }

    set $http(value: ng.IHttpService) {
        this._$http = value;
    }

    get $ngRedux(): any {
        return this._$ngRedux;
    }

    set $ngRedux(value: any) {
        this._$ngRedux = value;
    }

    get $ngAnimation(): angular.animate.IAnimateService {
        return this._$ngAnimation;
    }

    set $ngAnimation(value: angular.animate.IAnimateService) {
        this._$ngAnimation = value;
    }

    get $mdpTimePicker(): any {
        return this._$mdpTimePicker;
    }

    set $mdpTimePicker(value: any) {
        this._$mdpTimePicker = value;
    }

    get $window(): ng.IWindowService {
        return this._$window;
    }

    set $window(value: ng.IWindowService) {
        this._$window = value;
    }

    get $location(): ng.ILocationService {
        return this._$location;
    }

    set $location(value: ng.ILocationService) {
        this._$location = value;
    }

    get $translate(): angular.translate.ITranslateService {
        return this._$translate;
    }

    set $translate(value: angular.translate.ITranslateService) {
        this._$translate = value;
    }

    get $cookies(): angular.cookies.ICookiesService {
        return this._$cookies;
    }

    set $cookies(value: angular.cookies.ICookiesService) {
        this._$cookies = value;
    }

    get surveyNextPageButton(): JQuery {
        return this._surveyNextPageButton;
    }

    set surveyNextPageButton(value: JQuery) {
        this._surveyNextPageButton = value;
    }

    get surveyPreviousPageButton(): JQuery {
        return this._surveyPreviousPageButton;
    }

    set surveyPreviousPageButton(value: JQuery) {
        this._surveyPreviousPageButton = value;
    }


    get basicState(): {} {
        return this._basicState;
    }

    set basicState(value: {}) {
        this._basicState = value;
    }

    get isMultiPage(): boolean {
        return this._isMultiPage;
    }

    set isMultiPage(value: boolean) {
        this._isMultiPage = value;
    }

    get csrfToken(): string {
        return this._csrfToken;
    }

    set csrfToken(value: string) {
        this._csrfToken = value;
    }

    get surveyId(): string {
        return this._surveyId;
    }

    set surveyId(value: string) {
        this._surveyId = value;
    }

    get questionId(): string {
        return this._questionId;
    }

    set questionId(value: string) {
        this._questionId = value;
    }


    get questionResponse() {
        return this._questionResponse;
    }

    set questionResponse(value) {
        this._questionResponse = value;
    }

    get translateData(): { startTime: string; endTime: string; startDate: string; endDate: string; householdName: string } {
        return this._translateData;
    }

    set translateData(value: { startTime: string; endTime: string; startDate: string; endDate: string; householdName: string }) {
        this._translateData = value;
    }

    get startTime() {
        return this._startTime;
    }

    set startTime(value) {
        this._startTime = value;
    }

    private _questionId: string;

    private _startTime;

    private _questionResponse: string;

    private _responseInputElement: HTMLInputElement;

    private _surveyId: string;

    private _csrfToken: string;

    private _isMultiPage: boolean;

    private _basicState: {};

    private _surveyNextPageButton: JQuery;

    private _surveyPreviousPageButton: JQuery;

    private _todayDateDisplay: string;

    private _tomorrowDateDisplay: string;

    /**
     *
     * @param _$scope
     * @param _$http
     * @param _$ngRedux
     * @param _$ngAnimation
     * @param _$mdpTimePicker
     * @param _$window
     * @param _$location
     * @param _$translate
     * @param _$cookies
     * @param _configService
     */
    constructor(protected _$scope: ng.IScope,
                protected _$rootScope: ng.IScope,
                protected _$http: ng.IHttpService,
                protected _$ngRedux: any,
                protected _$ngAnimation: angular.animate.IAnimateService,
                protected _$mdpTimePicker: any,
                protected _$window: ng.IWindowService,
                protected _$location: ng.ILocationService,
                protected _$translate: angular.translate.ITranslateService,
                protected _$cookies: angular.cookies.ICookiesService,
                protected _configService: SurveyConfigService) {


    }

    /**
     * Resets the state of the question
     */
    protected clearResponse() {
        this.basicState = {};
        this._responseInputElement.value = "";


    }

    private _startDate;


    /**
     * Initialize survey question
     * @param surveyData
     * @param $scope
     * @param $http
     */
    protected initializeSurvey(surveyData, $scope: ng.IScope, $http: ng.IHttpService) {


        surveyData = {
            startTime: new Date(),
            endTime: new Date()
        }

        this._startTime = surveyData.startTime;

        //let jsonData = JSON.parse(surveyData);

        let jsonData = surveyData;
        let startDate = moment(jsonData['startDate']);

        console.log("Start Date:" + startDate);

        this.todayDateDisplay = startDate.format('MMMM Do');

        let endDate = moment(jsonData['startDate']).add(1, 'days');

        this.tomorrowDateDisplay = endDate.format('MMMM Do');


        /*
        //let endTime = moment(jsonData['endTime']);

        let time = jsonData['endTime'].split(" ")[0];

        let hrs = time.split(":")[0];
        let mins = time.split(":")[1];


        let endTime = endDate.hours(hrs).minutes(mins);

        time = jsonData['startTime'].split(" ")[0];

        hrs = time.split(":")[0];
        mins = time.split(":")[1];


        //get conditional
        let startConditions = jsonData['conditionsStartDate'].split(",");

        let startTimeCondition = startConditions[0];

        let offset = 0;
        if (startTimeCondition == "useSurveyStartDate" && startConditions.length > 1) {
            offset = parseInt(startConditions[1]);
            startDate = startDate.add(offset, "days");
            endDate = endDate.add(offset, "days");
        }


        //let startTime = moment(jsonData["startDate"]).hours(hrs).minutes(mins);


        this._startTime = startTime;
        this._startDate = startDate; */
        let startTime = moment()
        let endTime = moment()
        let endDate = moment()
        let startDate = moment()


        this._translateData = {
            startTime: startTime.format("LT"),
            endTime: endTime.format("LT"),
            startDate: startDate.format('MMMM Do YYYY'),
            endDate: endDate.format('MMMM Do YYYY'),
            householdName: 'household name',

        };


        this.config = this._translateData;


        var responseElement: HTMLInputElement = angular.element('.answer-container #id_' + this.questionId)[0] as HTMLInputElement;

        //var csrfElement = (angular.element('input[name="csrfmiddlewaretoken"]')[0] as HTMLInputElement).defaultValue;

        //this._csrfToken = csrfElement;

        this._responseInputElement = responseElement;

        /*Watch the value of the resposne element, when it changes send partial response to the server */
        let surveyIdRef = $scope['tc'].$window.SURVEY_ID;

        this.surveyId = surveyIdRef;

        let httpRef: ng.IHttpService = $http;

        let questionIdRef = this.questionId;

        let surveyServiceRef: SurveyConfigService = this._configService;

        $scope.$watch(() => {
            //return responseElement.value;
        }, function (value: string) {

            /* Send the updated value to the server */
            if (value != null) {

                console.log(questionIdRef);  

               // surveyServiceRef.savePartialResponse(value, questionIdRef);

            }

        });

        this.loadSavedResponseData();


        this._$scope['mapToggle'] = false;

      
        

    }

    /**
     * Establishes this question as multi-page, removing default "next" capability and replacing it with a
     * callback.
     *
     * @param pageChangeCallback callback function to next page. Next page should return true when the question is
     * finshed and the response should be submitted to the server.
     */
    public requireMultiPage(selfRef: MultipageQuestion, pageChangeCallback: (selfRef: MultipageQuestion, page: number) => boolean) {


        let ref = this;

        this.surveyNextPageButton = angular.element('#next_page_button')
        this.surveyPreviousPageButton = angular.element('#prev-page-button');

        this.surveyNextPageButton.on('click', function (ev) {


            if (pageChangeCallback(selfRef, 1)) {

                /* regular next button action, question ididacted finished */
                return true;

            }
            else {


                return false;
            }


        });
        this.surveyPreviousPageButton.on('click', function (ev) {


            if (pageChangeCallback(selfRef, -1)) {
                /* return original next page functionality,
                 * continue without preventing default */

            }
            else {


                ev.stopImmediatePropagation();
                ev.preventDefault();
                //ev.returnValue = false;
                return false;
            }


        });

        /* assign watches to page valid of question */
        this.$scope.$watch(() => {
                return selfRef.activePageValid;
            },
            function (valid: boolean) {


                // if valid next button is clickable
                if (valid) {

                    ref.surveyNextPageButton.removeClass('disabled');
                }
                else {
                    ref.surveyNextPageButton.addClass('disabled');
                }


            });

    }

    /**
     *
     * @param value
     */
    protected updateResponse(value: string) {
        //this._responseInputElement.value = value;
    }

    /**
     * Returns the any response data that may exist on the server.
     * @returns {string}
     */
    protected loadSavedResponseData() {
        /*if (this._responseInputElement.value != '') {
            this.basicState = JSON.parse(this._responseInputElement.value);
        }
        else{

        }
        state.endLocation.locationName,
                state.endLocation.latLng, state.endLocation.locationInput,
                state.endLocation.locationPurpose, state.endLocation.id);
        
        */

        this.basicState = {
            
            startLocation: {
                '_locationName': 'Home',
                'latLng': {
                    lat: 43.834208,
                    lng: -79.095633
                },
                startTime: Date(),
                endTime: Date,
            },
            
            endLocation:
            {
                '_locationName': 'Work',
                'latLng': {
                    lat: 43.660313,
                    lng: -79.395692
                },
                startTime: Date(),
                endTime: Date,
            },
            activeRouteIndex: 0

        };

    }

    private config;

    /* transalte data */
    private _translateData = {

        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        householdName: '',
    }

}