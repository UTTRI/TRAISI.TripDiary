import * as angular from "angular";

export class ScrollViewWatcher {

    /**
     *
     */
    constructor(private _$window: ng.IWindowService) {

    }


    public static Factory() {


        var directive = ($window) => {

            return new ScrollViewWatcher($window);
        };


        directive["restrict"] = "AEC";


        return directive;
    }

    /**
     * Checks whether the element is scrolled into view or not
     * @param elem
     * @returns {boolean}
     */
    private isInView(elem): boolean {

        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom - 40) && (elemTop >= docViewTop + 40 ));
    }

    scope = {
        'scrollEnterCallback': '&',
        'scrollLeaveCallback': '&',
        'triggerScrollOnClassRemoved': '@'

    };


    /**
     *
     * @param scope
     * @param {angular.IAugmentedJQuery} element
     */
    private scrollCheck = (scope, element: ng.IAugmentedJQuery) => {

        if (this.isInView(element[0])) {

            if (scope['inView'] == false || !element.hasClass(scope['triggerScrollOnClassRemoved'])) {


                if (scope['scrollEnterCallback'] != undefined) {
                    scope['scrollEnterCallback']();
                }
            }
            scope['inView'] = true;


        }
        else {
            if (scope['inView'] == true) {
                //console.log('left');
                if (scope['scrollLeaveCallback'] != undefined) {
                    scope['scrollLeaveCallback']();
                }
            }
            scope['inView'] = false;

        }
    }


    /**
     *
     * @param {angular.IScope} scope
     * @param {angular.IAugmentedJQuery} element
     * @param {angular.IAttributes} attrs
     */
    public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {


        scope['inView'] = this.isInView(element[0]);

        if (scope['inView']) {
            scope['scrollEnterCallback']();
        }
        else {
            scope['scrollLeaveCallback']();


        }


        angular.element(this._$window).on('visibilityScrollCheck', () => {


            this.scrollCheck(scope, element);

        });


        //console.log("inside link");

        angular.element(this._$window).on('resize', () => {
            //console.log(scope);


            this.scrollCheck(scope, element);

        });


        angular.element(this._$window).on("scroll", () => {


            this.scrollCheck(scope, element);
        });


        //scope.$apply();

    }
}