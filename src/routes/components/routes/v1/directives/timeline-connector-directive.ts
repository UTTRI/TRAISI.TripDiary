import * as angular from 'angular'
import * as _ from "lodash";

export class TimelineConnectorDirective {


    private _$window: ng.IWindowService;

    private _element: ng.IAugmentedJQuery;

    private _attrs: ng.IAttributes;

    private _svgElement: HTMLElement;

    private _$scope: ng.IScope;

    private _parent: HTMLElement;

    private _targetId: string;

    private _$timeout: ng.ITimeoutService;


    private _timelineElement: HTMLElement;

    private _timelineSegmentElement: HTMLElement;


    /**
     *
     * @param {angular.IWindowService} window
     * @param {angular.ITimeoutService} timeout
     */
    constructor(window: ng.IWindowService, timeout: ng.ITimeoutService) {

        this._$window = window;
        this._$timeout = timeout;
    }

    public templateUrl: string = '/static/dist/directives/trips/templates/timeline-connector.html';

    /**
     * Factory method for the timeline directive
     */
    public static Factory() {

        var directive = ($window, $timeout) => {
            return new TimelineConnectorDirective($window, $timeout);
        };

        directive['$inject'] = ['$window', '$timeout'];

        return directive;
    }

    private calculatePath(): string {
        return null;
    }

    /**
     *
     * @param {angular.IScope} scope
     * @param {angular.IAugmentedJQuery} element
     * @param {angular.IAttributes} attrs
     * @param {angular.IWindowService} window
     */
    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, window: ng.IWindowService): void => {


        this._attrs = attrs;


        this._$scope = scope;

        //console.log(scope);


        scope['locationId'] = attrs['locationId'];

        scope['element'] = element[0];
        scope['svgElement'] = element[0].querySelector('svg path');
        scope['svgRootElement'] = element[0].querySelector('svg');


        this._$scope.$root.$on('timelineLineChanged', (evt, args) => {


            //console.log("in timeline line changed");
            this._$timeout(() => {


            }).then(
                () => {
                    _.delay(() => {
                        // console.log("in callbakc");
                        this.init(scope);
                    }, 250);
                }
            )


        });


        this._$scope.$root.$on('timelineSegmentChanged', (evt, args) => {


            if (args == scope['locationId']) {


                this._$timeout(() => {


                }).then(
                    () => {

                        _.delay(() => {
                            //console.log("in callbakc")
                            // ;
                            scope['timelineElement'] = angular.element("#timeline-add-" + scope['locationId'])[0];
                            scope['timelineSegmentElement'] = angular.element("#timeline-segment-" + scope['locationId'])[0];
                            this.init(scope);
                        }, 250);
                    }
                )


            }


        });

        this._$timeout(() => {
            this.render(scope);

        });

    };

    scope = {
        'locationName': '@'
    }

    /**
     *
     * @param $scope
     */
    public init($scope) {


        angular.element(this._$window).on('resize', () => {


            this._$timeout(() => {
                this.render($scope);
            });


        });

        this.render($scope);

    }

    /**
     *
     * @param $scope
     * @returns {any}
     */
    private render = ($scope): any => {

        if ($scope['timelineElement'] == undefined) {
            return;
        }
        let timelineBoundingRect = $scope['timelineElement'].getBoundingClientRect();
        let timelineSegmentBoundingRect = $scope['timelineSegmentElement'].getBoundingClientRect();
        let elementBoundingRect = $scope['element'].getBoundingClientRect();


        let yOffset = timelineBoundingRect.height / 2;
        let xOffset = timelineBoundingRect.width / 2;

        let path: string = "";
        path += "M";
        path += (timelineBoundingRect.left - elementBoundingRect.left + xOffset);
        path += " ";
        path += (timelineBoundingRect.top - elementBoundingRect.top + yOffset);
        path += " ";

        path += "L";
        path += (timelineSegmentBoundingRect.left - elementBoundingRect.left);
        path += " ";
        path += (timelineSegmentBoundingRect.top - elementBoundingRect.top + yOffset) - 30;
        path += " ";


        path += "L";
        path += (timelineSegmentBoundingRect.left - elementBoundingRect.left + timelineSegmentBoundingRect.width);
        path += " ";
        path += (timelineSegmentBoundingRect.top - elementBoundingRect.top + yOffset) - 30;
        path += " ";


        path += "Z";


        //console.log($($scope['svgElement']));

        $scope['svgElement'].setAttribute('d', path);
        //$scope['svgElement'].css({'display':'block'});
        $scope['element'].setAttribute('class', $scope['locationName']);

        $($scope['svgRootElement']).css("display", "block");


    }


}
