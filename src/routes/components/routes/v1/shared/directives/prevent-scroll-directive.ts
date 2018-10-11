export class PreventScrollDirective {

    /**
     *
     * @param {angular.IWindowService} _$window
     */
    constructor(private _$window: ng.IWindowService) {

    }


    public static Factory() {


        var directive = ($window) => {

            return new PreventScrollDirective($window);
        };


        directive["restrict"] = "AEC";


        return directive;
    }

    /**
     *
     * @param {angular.IScope} scope
     * @param {angular.IAugmentedJQuery} element
     * @param {angular.IAttributes} attrs
     */

    public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {


        element.on('mousewheel', (evt) => {
            evt.preventDefault();


        });
    }
}